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
  const [customNames, setCustomNames] = useState<Record<string, string>>({});
  const [destinationDbIds, setDestinationDbIds] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [editingNameValue, setEditingNameValue] = useState("");
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
      const dbIdMap: Record<string, string> = {};
      const namesMap: Record<string, string> = {};
      for (const dest of data.destinations ?? []) {
        // Match by position/order in array
        const fixed = FIXED_DESTINATIONS.find(
          (f) => f.name.toLowerCase() === dest.name.toLowerCase() || dest.position === f.id
        );
        if (fixed) {
          imageMap[fixed.id] = dest.imageUrl;
          dbIdMap[fixed.id] = dest._id;
          // Store custom name if different from default
          if (dest.name && dest.name.toLowerCase() !== fixed.name.toLowerCase()) {
            namesMap[fixed.id] = dest.name;
          }
        }
      }
      setImages(imageMap);
      setDestinationDbIds(dbIdMap);
      setCustomNames(namesMap);
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

    const maxSizeMb = 1;
    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`Image must be less than ${maxSizeMb}MB. Please compress and upload again.`);
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

      // Save to database - use custom name if available
      const displayName = customNames[destId] || dest.name;
      const res = await fetch("/api/admin/popular-destinations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: displayName,
          imageUrl: compressedDataUrl,
          order: dest.order,
          size: dest.size,
          position: destId, // Store position ID for matching
        }),
      });

      if (!res.ok) throw new Error("Failed to save");

      const savedData = await res.json();
      setImages((prev) => ({ ...prev, [destId]: compressedDataUrl }));
      if (savedData.destination?._id) {
        setDestinationDbIds((prev) => ({ ...prev, [destId]: savedData.destination._id }));
      }
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

  async function handleDeleteImage(destId: string, e: React.MouseEvent) {
    e.stopPropagation(); // Prevent triggering upload

    const dbId = destinationDbIds[destId];
    if (!dbId) {
      setError("Destination not found in database");
      return;
    }

    if (!confirm("Delete this image?")) return;

    setDeletingId(destId);
    setError(null);

    try {
      const res = await fetch(`/api/admin/popular-destinations/${dbId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      // Remove from local state
      setImages((prev) => {
        const newImages = { ...prev };
        delete newImages[destId];
        return newImages;
      });
      setDestinationDbIds((prev) => {
        const newIds = { ...prev };
        delete newIds[destId];
        return newIds;
      });
    } catch (err) {
      console.error(err);
      setError("Failed to delete image");
    } finally {
      setDeletingId(null);
    }
  }

  function startEditingName(destId: string, currentName: string, e: React.MouseEvent) {
    e.stopPropagation();
    setEditingNameId(destId);
    setEditingNameValue(currentName);
  }

  async function saveNameEdit(destId: string) {
    const newName = editingNameValue.trim();
    if (!newName) {
      setEditingNameId(null);
      return;
    }

    const dbId = destinationDbIds[destId];
    const dest = FIXED_DESTINATIONS.find((d) => d.id === destId);

    // Update local state immediately
    setCustomNames((prev) => ({ ...prev, [destId]: newName }));
    setEditingNameId(null);

    // If destination exists in DB, update it
    if (dbId && dest) {
      try {
        const res = await fetch("/api/admin/popular-destinations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: newName,
            imageUrl: images[destId],
            order: dest.order,
            size: dest.size,
            position: destId,
          }),
        });
        if (!res.ok) throw new Error("Failed to update name");
      } catch (err) {
        console.error(err);
        setError("Failed to save name");
      }
    }
  }

  function handleNameKeyDown(e: React.KeyboardEvent, destId: string) {
    if (e.key === "Enter") {
      e.preventDefault();
      saveNameEdit(destId);
    } else if (e.key === "Escape") {
      setEditingNameId(null);
    }
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
          <div className="rounded-2xl bg-slate-800 p-4 ring-1 ring-slate-700">
            <p className="mb-4 text-xs font-semibold text-slate-300">
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
                    className={`group relative overflow-hidden rounded-xl bg-slate-700 transition-all hover:ring-2 hover:ring-sky-500 ${
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
                          <div className="flex gap-4">
                            {/* Change image button */}
                            <div className="text-center text-white">
                              <svg className="mx-auto h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p className="mt-1 text-[10px]">Change</p>
                            </div>
                            {/* Delete button */}
                            <button
                              type="button"
                              onClick={(e) => handleDeleteImage(dest.id, e)}
                              disabled={deletingId === dest.id}
                              className="text-center text-red-400 hover:text-red-300 disabled:opacity-50"
                            >
                              <svg className="mx-auto h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              <p className="mt-1 text-[10px]">
                                {deletingId === dest.id ? "..." : "Delete"}
                              </p>
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center p-2 text-center">
                        <svg className="h-8 w-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                        </svg>
                        <p className="mt-1 text-[10px] font-medium text-slate-400">Upload</p>
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

                    {/* Name badge - editable */}
                    {editingNameId === dest.id ? (
                      <div className="absolute bottom-2 left-2" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={editingNameValue}
                          onChange={(e) => setEditingNameValue(e.target.value)}
                          onKeyDown={(e) => handleNameKeyDown(e, dest.id)}
                          onBlur={() => saveNameEdit(dest.id)}
                          autoFocus
                          className="w-24 rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-slate-700 shadow-sm outline-none ring-2 ring-sky-500"
                        />
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => startEditingName(dest.id, customNames[dest.id] || dest.name, e)}
                        className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-slate-700 shadow-sm hover:bg-white hover:ring-1 hover:ring-sky-400"
                      >
                        {customNames[dest.id] || dest.name}
                        <svg className="h-2.5 w-2.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    )}

                    {/* Size indicator */}
                    <div className="absolute right-2 top-2 rounded-full bg-slate-900/70 px-1.5 py-0.5 text-[8px] font-medium text-white">
                      {dest.size === "large" ? "L" : "M"}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Resolution hints */}
            <div className="mt-4 flex flex-wrap gap-4 text-[10px] text-slate-400">
              <div className="flex items-center gap-1">
                <span className="rounded bg-slate-600 px-1 py-0.5 text-[8px] text-white">L</span>
                <span>Large: {getResolutionHint("large")}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="rounded bg-slate-600 px-1 py-0.5 text-[8px] text-white">M</span>
                <span>Medium: {getResolutionHint("medium")}</span>
              </div>
            </div>
          </div>

          {/* Info box */}
          <div className="rounded-xl bg-sky-900/30 p-3 text-[11px] text-sky-300">
            <p className="font-medium">ℹ️ Layout is locked</p>
            <p className="mt-1 text-sky-400">
              6 destinations with fixed positions. Large cards span 2 rows.
              Click card to upload image • Click name badge to edit name • Hover for delete option.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
