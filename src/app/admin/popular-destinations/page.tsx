"use client";

import type { ChangeEvent } from "react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { readAndCompressImageFile } from "@/lib/client/image-utils";

const ADMIN_FLAG_KEY = "himexplore_admin_logged_in";

// Fixed 6 destinations - order and size locked
const FIXED_DESTINATIONS = [
  { id: "manali", name: "Manali", size: "large" as const, order: 0 },
  { id: "shimla", name: "Shimla", size: "medium" as const, order: 1 },
  { id: "dharamshala", name: "Dharamshala", size: "large" as const, order: 2 },
  { id: "kasol", name: "Kasol", size: "medium" as const, order: 3 },
  { id: "bir-billing", name: "Bir Billing", size: "medium" as const, order: 4 },
  { id: "spiti", name: "Spiti Valley", size: "medium" as const, order: 5 },
];

interface DestinationImage {
  _id?: string;
  destinationId: string;
  imageUrl: string;
}

export default function AdminPopularDestinationsPage() {
  const router = useRouter();
  const [images, setImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    const flag = window.localStorage.getItem(ADMIN_FLAG_KEY);
    if (flag !== "1") router.replace("/admin/login");
  }, [router]);

  async function loadDestinations() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/popular-destinations");
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      const imageMap: Record<string, string> = {};
      for (const dest of data.destinations ?? []) {
        // Match by name (case insensitive)
        const fixed = FIXED_DESTINATIONS.find(
          (f) => f.name.toLowerCase() === dest.name.toLowerCase()
        );
        if (fixed) {
          imageMap[fixed.id] = dest.imageUrl;
        }
      }
      setImages(imageMap);
    } catch (err) {
      console.error(err);
      setError("Unable to load destinations");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDestinations();
  }, []);

  async function handleImageUpload(destId: string, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const maxSizeMb = 15;
    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`Image must be less than ${maxSizeMb}MB`);
      return;
    }

    const dest = FIXED_DESTINATIONS.find((d) => d.id === destId);
    if (!dest) return;

    setUploadingId(destId);
    setError(null);

    try {
      // Compress image - larger for large cards
      const isLarge = dest.size === "large";
      const compressedDataUrl = await readAndCompressImageFile(file, {
        maxWidth: isLarge ? 800 : 640,
        maxHeight: isLarge ? 1000 : 400,
        quality: 0.85,
      });

      // Save to database
      const res = await fetch("/api/admin/popular-destinations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: dest.name,
          imageUrl: compressedDataUrl,
          order: dest.order,
          size: dest.size,
        }),
      });

      if (!res.ok) throw new Error("Failed to save");

      setImages((prev) => ({ ...prev, [destId]: compressedDataUrl }));
      setSuccessId(destId);
      setTimeout(() => setSuccessId(null), 2000);
    } catch (err) {
      console.error(err);
      setError("Failed to upload image");
    } finally {
      setUploadingId(null);
      // Reset file input
      const input = fileInputRefs.current[destId];
      if (input) input.value = "";
    }
  }

  function triggerUpload(destId: string) {
    fileInputRefs.current[destId]?.click();
  }

  // Get resolution recommendation based on size
  function getResolutionHint(size: "small" | "medium" | "large") {
    if (size === "large") return "800×1000px (Portrait)";
    return "640×400px (Landscape)";
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 sm:text-base">
            Popular Destinations
          </h2>
          <p className="text-[11px] text-slate-500">
            Click on any card to upload image • Layout is fixed to match homepage
          </p>
        </div>
        <button
          type="button"
          onClick={loadDestinations}
          className="rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-medium text-slate-700 shadow-sm hover:bg-slate-200"
        >
          Refresh
        </button>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-[11px] text-red-600 ring-1 ring-red-200">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-xs text-slate-500">Loading...</p>
      ) : (
        <>
          {/* Visual Bento Grid Editor - matches homepage layout */}
          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <p className="mb-4 text-xs font-semibold text-slate-700">
              Bento Grid Preview (Click to upload)
            </p>

            {/* Desktop 4-column bento grid */}
            <div className="grid grid-cols-4 gap-3" style={{ gridAutoRows: "120px" }}>
              {FIXED_DESTINATIONS.map((dest) => {
                const isLarge = dest.size === "large";
                const hasImage = !!images[dest.id];
                const isUploading = uploadingId === dest.id;
                const isSuccess = successId === dest.id;

                return (
                  <div
                    key={dest.id}
                    className={`group relative overflow-hidden rounded-xl bg-slate-200 transition-all hover:ring-2 hover:ring-sky-500 ${
                      isLarge ? "row-span-2" : ""
                    } ${isSuccess ? "ring-2 ring-green-500" : ""}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => !isUploading && triggerUpload(dest.id)}
                  >
                    {/* Hidden file input */}
                    <input
                      type="file"
                      accept="image/*"
                      ref={(el) => { fileInputRefs.current[dest.id] = el; }}
                      onChange={(e) => handleImageUpload(dest.id, e)}
                      className="hidden"
                    />

                    {/* Image or placeholder */}
                    {hasImage ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={images[dest.id]}
                          alt={dest.name}
                          className="h-full w-full object-cover"
                        />
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                          <div className="text-center text-white">
                            <svg className="mx-auto h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="mt-1 text-[10px]">Change Image</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center p-2 text-center">
                        <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                        </svg>
                        <p className="mt-1 text-[10px] font-medium text-slate-500">Upload</p>
                      </div>
                    )}

                    {/* Loading overlay */}
                    {isUploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      </div>
                    )}

                    {/* Success checkmark */}
                    {isSuccess && (
                      <div className="absolute right-2 top-2 rounded-full bg-green-500 p-1">
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}

                    {/* Name badge */}
                    <div className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-slate-700 shadow-sm">
                      {dest.name}
                    </div>

                    {/* Size indicator */}
                    <div className="absolute right-2 top-2 rounded-full bg-slate-900/70 px-1.5 py-0.5 text-[8px] font-medium text-white">
                      {dest.size === "large" ? "L" : "M"}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Resolution hints */}
            <div className="mt-4 flex flex-wrap gap-4 text-[10px] text-slate-500">
              <div className="flex items-center gap-1">
                <span className="rounded bg-slate-900/70 px-1 py-0.5 text-[8px] text-white">L</span>
                <span>Large: {getResolutionHint("large")}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="rounded bg-slate-900/70 px-1 py-0.5 text-[8px] text-white">M</span>
                <span>Medium: {getResolutionHint("medium")}</span>
              </div>
            </div>
          </div>

          {/* Info box */}
          <div className="rounded-xl bg-sky-50 p-3 text-[11px] text-sky-800">
            <p className="font-medium">ℹ️ Layout is locked</p>
            <p className="mt-1 text-sky-600">
              6 destinations with fixed positions. Large cards (Manali, Dharamshala) span 2 rows.
              Only images can be changed - click any card to upload.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
