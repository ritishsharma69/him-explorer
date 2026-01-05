"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { readAndCompressImageFile } from "@/lib/client/image-utils";

const ADMIN_FLAG_KEY = "himexplore_admin_logged_in";

type PackageStatus = "draft" | "published" | "archived";

interface ItineraryFormItem {
	title: string;
	description: string;
}

	interface FormState {
			title: string;
			slug: string;
			subtitle: string;
			destinationName: string;
			durationDays: string;
			startingPricePerPerson: string;
			currencyCode: string;
			shortDescription: string;
			detailedDescription: string;
			// Hero image URL is still required by the backend, but on the "new" page
			// we derive it automatically from the first trip photo instead of asking
			// for a separate upload. Keeping it in the form state so the payload
			// structure stays consistent.
			heroImageUrl: string;
			galleryImageUrls: string;
			highlights: string;
			inclusions: string;
			exclusions: string;
			itinerary: ItineraryFormItem[];
			isFeatured: boolean;
			status: PackageStatus;
		}

	function validatePackageForm(form: FormState): string | null {
		const slug = form.slug.trim();
		if (!slug) {
			return "Slug field cannot be empty. This becomes part of the URL ( /packages/slug ).";
		}

		const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
		if (!slugPattern.test(slug)) {
			return "Slug should only contain lowercase letters (a-z), numbers (0-9), and hyphens (-). No spaces or special characters. Example: weekend-manali-from-delhi.";
		}

		if (!form.title.trim()) {
			return "Title is required. This will be the heading shown on the card.";
		}
		if (!form.destinationName.trim()) {
			return "Destination name is required (e.g., Manali, Kasol).";
		}
		if (!form.shortDescription.trim()) {
				return "Short description is required. This is a brief summary of the package.";
		}

		const duration = Number.parseInt(form.durationDays || "0", 10);
		if (!Number.isFinite(duration) || duration < 1) {
			return "Duration must be at least 1 day.";
		}

		const price = Number.parseFloat(form.startingPricePerPerson || "0");
		if (!Number.isFinite(price) || price < 0) {
			return "Starting price per person must be 0 or greater. Negative values are not allowed.";
		}

		return null;
	}

export default function AdminNewPackagePage() {
  const router = useRouter();
	  const galleryInputRef = useRef<HTMLInputElement | null>(null);
		  const [form, setForm] = useState<FormState>({
	    title: "",
	    slug: "",
	    subtitle: "",
	    destinationName: "",
	    durationDays: "3",
	    startingPricePerPerson: "10000",
	    currencyCode: "INR",
	    shortDescription: "",
	    detailedDescription: "",
		    heroImageUrl: "",
	    galleryImageUrls: "",
	    highlights: "",
	    inclusions: "",
	    exclusions: "",
	    itinerary: [{ title: "", description: "" }],
	    isFeatured: false,
	    status: "draft",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const flag = window.localStorage.getItem(ADMIN_FLAG_KEY);
    if (flag !== "1") router.replace("/admin/login");
  }, [router]);

		  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

	  function linesToArray(value: string): string[] {
	    return value
	      .split("\n")
	      .map((line) => line.trim())
	      .filter(Boolean);
	  }

			async function handleGalleryImageFilesChange(
			  event: ChangeEvent<HTMLInputElement>,
			) {
	    const files = event.target.files;
	    if (!files || files.length === 0) return;

	    const maxSizeMb = 2;
	    for (const file of Array.from(files)) {
	      if (file.size > maxSizeMb * 1024 * 1024) {
	        setError(
	          `Image size must be less than ${maxSizeMb}MB, otherwise upload will be very slow.`,
	        );
	        return;
	      }
	    }

	    try {
	      setError(null);
	      const urls: string[] = [];
	      for (const file of Array.from(files)) {
	        const compressedDataUrl = await readAndCompressImageFile(file, {
	          maxWidth: 1600,
	          maxHeight: 900,
	          quality: 0.85,
	        });
	        urls.push(compressedDataUrl);
	      }

	      setForm((prev) => {
	        const existing = prev.galleryImageUrls.trim();
	        const lines = existing ? existing.split("\n") : [];
	        const nextLines = [...lines, ...urls];
	        return { ...prev, galleryImageUrls: nextLines.join("\n") };
	      });
	    } catch (err) {
	      console.error(err);
	      setError(
	        "There was an issue processing gallery images. Try smaller files or upload again.",
	      );
	    }
	  }

		  async function handleSubmit(event: FormEvent) {
			    event.preventDefault();
			    setError(null);
		
			    const validationError = validatePackageForm(form);
			    if (validationError) {
			      setError(validationError);
			      return;
			    }
		
			    // Hero image now auto-derives from the first trip photo.
			    const galleryImageUrls = linesToArray(form.galleryImageUrls);
			    const heroImageUrl = form.heroImageUrl.trim() || galleryImageUrls[0] || "";
			    if (!heroImageUrl) {
			      setError(
			        "Upload at least one trip photo. The first photo is used as the hero image (card background).",
			      );
			      return;
			    }
		
			    setSubmitting(true);
		  		
			    		const payload: Record<string, unknown> = {
			      slug: form.slug.trim(),
			      title: form.title.trim(),
			      subtitle: form.subtitle.trim() || undefined,
			      destinationName: form.destinationName.trim(),
			      durationDays: Number.parseInt(form.durationDays || "0", 10),
			      startingPricePerPerson: Number.parseFloat(
			        form.startingPricePerPerson || "0",
			      ),
			      currencyCode: form.currencyCode.trim() || "INR",
			      shortDescription: form.shortDescription.trim(),
			      detailedDescription: form.detailedDescription.trim() || undefined,
			      heroImageUrl,
			      isFeatured: form.isFeatured,
			      status: form.status,
			    };
		  		
			    const highlights = linesToArray(form.highlights);
			    if (highlights.length) payload.highlights = highlights;
			    const inclusions = linesToArray(form.inclusions);
			    if (inclusions.length) payload.inclusions = inclusions;
			    const exclusions = linesToArray(form.exclusions);
			    if (exclusions.length) payload.exclusions = exclusions;
			    if (galleryImageUrls.length) payload.galleryImageUrls = galleryImageUrls;
		
			    const itinerary = form.itinerary
			      .map((item, index) => ({
			        dayNumber: index + 1,
			        title: item.title.trim(),
			        description: item.description.trim(),
			      }))
			      .filter((item) => item.title && item.description);
			    if (itinerary.length) payload.itinerary = itinerary;

    try {
      const res = await fetch("/api/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? "Failed to create package");
        return;
      }

      router.replace("/admin/packages");
    } catch (submitError) {
      console.error(submitError);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

			  return (
	    <div className="mx-auto max-w-3xl space-y-4">
	      <div className="flex items-center justify-between gap-2">
	        <h2 className="text-sm font-semibold text-slate-50 sm:text-base">Add new package</h2>
	        <button
	          type="button"
	          onClick={() => router.push("/admin/packages")}
	          className="rounded-full border border-slate-500/50 px-3 py-1 text-[11px] font-medium text-slate-100 shadow-sm hover:bg-slate-900/60"
	        >
	          Back to list
	        </button>
	      </div>
	
	      {error && <p className="text-xs font-medium text-red-400">{error}</p>}
	
	      <form
	        onSubmit={handleSubmit}
	        className="space-y-4 rounded-2xl border border-white/10 bg-slate-950/40 p-4 shadow-inner backdrop-blur-sm"
	      >
	        <div className="grid gap-4 sm:grid-cols-2">
		          <div className="space-y-1">
		            <label className="block text-xs font-medium text-slate-200">Title</label>
		            <input
		              type="text"
		              value={form.title}
		              onChange={(event) => updateField("title", event.target.value)}
		              className="w-full rounded-lg border border-slate-700/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 shadow-sm placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
		              required
		            />
		          </div>
		          <div className="space-y-1">
		            <label className="block text-xs font-medium text-slate-200">Slug</label>
		            <input
		              type="text"
		              value={form.slug}
		              onChange={(event) => updateField("slug", event.target.value)}
		              className="w-full rounded-lg border border-slate-700/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 shadow-sm placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
		              placeholder="weekend-manali-from-delhi"
		              required
		            />
		            <p className="text-[10px] text-slate-400">
		              The slug becomes part of the URL: <span className="font-mono">/packages/your-slug</span>. Use only
		              lowercase letters, numbers, and <span className="font-mono">-</span>.
		            </p>
		          </div>
		        </div>

	        <div className="space-y-1">
	          <label className="block text-xs font-medium text-slate-200">
	            Subtitle (optional, small line under title)
	          </label>
	          <input
	            type="text"
	            value={form.subtitle}
	            onChange={(event) => updateField("subtitle", event.target.value)}
	            className="w-full rounded-lg border border-slate-700/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 shadow-sm placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
	            placeholder="Cafe-hopping, riverside walks & Solang day trip"
	          />
	        </div>

	        <div className="grid gap-4 sm:grid-cols-3">
	          <div className="space-y-1 sm:col-span-2">
	            <label className="block text-xs font-medium text-slate-200">Destination name</label>
            <input
              type="text"
	              value={form.destinationName}
	              onChange={(event) => updateField("destinationName", event.target.value)}
	              className="w-full rounded-lg border border-slate-700/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 shadow-sm placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              placeholder="Manali, Kasol"
              required
            />
          </div>
	          <div className="space-y-1">
	            <label className="block text-xs font-medium text-slate-200">Duration (days)</label>
            <input
              type="number"
              min={1}
	              value={form.durationDays}
	              onChange={(event) => updateField("durationDays", event.target.value)}
	              className="w-full rounded-lg border border-slate-700/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 shadow-sm placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              required
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
	          <div className="space-y-1 sm:col-span-2">
	            <label className="block text-xs font-medium text-slate-200">Starting price per person</label>
            <input
              type="number"
              min={0}
	              value={form.startingPricePerPerson}
	              onChange={(event) => updateField("startingPricePerPerson", event.target.value)}
	              className="w-full rounded-lg border border-slate-700/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 shadow-sm placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              required
            />
          </div>
	          <div className="space-y-1">
	            <label className="block text-xs font-medium text-slate-200">Currency</label>
            <input
              type="text"
	              value={form.currencyCode}
	              onChange={(event) => updateField("currencyCode", event.target.value.toUpperCase())}
	              className="w-full rounded-lg border border-slate-700/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 shadow-sm placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              maxLength={3}
              required
            />
          </div>
        </div>

	        <div className="space-y-1">
	          <label className="block text-xs font-medium text-slate-200">Short description</label>
          <textarea
	            value={form.shortDescription}
	            onChange={(event) => updateField("shortDescription", event.target.value)}
	            className="min-h-[80px] w-full rounded-lg border border-slate-700/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 shadow-sm placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            required
          />
        </div>

	        <div className="space-y-1">
	          <label className="block text-xs font-medium text-slate-200">
	            Detailed description (optional)
	          </label>
	          <textarea
	            value={form.detailedDescription}
	            onChange={(event) =>
	              updateField("detailedDescription", event.target.value)
	            }
	            className="min-h-[100px] w-full rounded-lg border border-slate-700/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 shadow-sm placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
	          />
	        </div>

	        <div className="space-y-3">
	          <div className="flex items-center justify-between">
	            <label className="block text-xs font-medium text-slate-200">
	              Day-wise plan
	            </label>
	            <button
	              type="button"
	              onClick={() =>
	                updateField("itinerary", [
	                  ...form.itinerary,
	                  { title: "", description: "" },
	                ])
	              }
	              className="rounded-full border border-slate-500/60 px-2 py-1 text-[10px] font-medium text-slate-100 hover:bg-slate-900/60"
	            >
	              + Add day
	            </button>
	          </div>
	          <p className="text-[10px] text-slate-400">
	            Fill one card per day. Day numbers are auto-set as Day 1, Day 2,
	            and so on.
	          </p>
	          <div className="space-y-3">
	            {form.itinerary.map((item, index) => (
	              <div
	                key={index}
	                className="space-y-2 rounded-xl border border-white/10 bg-slate-900/40 p-3"
	              >
	                <div className="flex items-center justify-between gap-2">
	                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-300">
	                    Day {index + 1}
	                  </p>
	                  {form.itinerary.length > 1 && (
	                    <button
	                      type="button"
	                      onClick={() => {
	                        const next = [...form.itinerary];
	                        next.splice(index, 1);
	                        updateField("itinerary", next);
	                      }}
	                      className="text-[10px] text-slate-400 hover:text-red-400"
	                    >
	                      Remove
	                    </button>
	                  )}
	                </div>
	                <div className="space-y-1">
	                  <input
	                    type="text"
	                    value={item.title}
	                    onChange={(event) => {
	                      const next = [...form.itinerary];
	                      next[index] = {
	                        ...next[index],
	                        title: event.target.value,
	                      };
	                      updateField("itinerary", next);
	                    }}
	                    className="w-full rounded-lg border border-slate-700/60 bg-slate-900/60 px-3 py-2 text-xs text-slate-50 shadow-sm placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
	                    placeholder="Overnight Volvo from Delhi"
	                  />
	                  <textarea
	                    value={item.description}
	                    onChange={(event) => {
	                      const next = [...form.itinerary];
	                      next[index] = {
	                        ...next[index],
	                        description: event.target.value,
	                      };
	                      updateField("itinerary", next);
	                    }}
	                    className="min-h-[72px] w-full rounded-lg border border-slate-700/60 bg-slate-900/60 px-3 py-2 text-xs text-slate-50 shadow-sm placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
	                    placeholder="Board the overnight semi-sleeper Volvo from Delhi..."
	                  />
	                </div>
	              </div>
	            ))}
	          </div>
	        </div>

		        <div className="space-y-1">
		          <label className="block text-xs font-medium text-slate-200">
		            Trip photos (gallery images)
		          </label>
		          <input
		            id="trip-photos-input"
		            type="file"
		            multiple
		            accept="image/*"
		            onChange={handleGalleryImageFilesChange}
		            ref={galleryInputRef}
		            className="hidden"
		          />
		          <div className="flex flex-wrap gap-2">
		            <button
		              type="button"
		              onClick={() => galleryInputRef.current?.click()}
		              className="rounded-full bg-sky-600 px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm hover:bg-sky-700"
		            >
		              {linesToArray(form.galleryImageUrls).length === 0
		                ? "Add trip photos"
		                : "+ Add more images"}
		            </button>
		            {linesToArray(form.galleryImageUrls).length > 0 && (
		              <button
		                type="button"
		                onClick={() => updateField("galleryImageUrls", "")}
		                className="rounded-full border border-slate-600/70 px-3 py-1 text-[10px] font-medium text-slate-100 hover:border-red-400/80 hover:text-red-400"
		              >
		                Clear all photos
		              </button>
		            )}
		          </div>
		          <p className="text-[10px] text-slate-400">
		            Images uploaded here will appear in the package page&apos;s &quot;Trip
		            photos&quot; section. The first photo is used as the hero image
		            (card background). You can select multiple files at once. Recommended: 3–6 photos.
		          </p>
		          {linesToArray(form.galleryImageUrls).length > 0 && (
		            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
		              {linesToArray(form.galleryImageUrls).map((url, index) => (
		                <div
		                  key={url}
		                  className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-slate-900"
		                >
		                  <span className="absolute left-1 top-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-slate-50">
		                    Photo {index + 1}
		                  </span>
		                  {/* eslint-disable-next-line @next/next/no-img-element */}
		                  <img
		                    src={url}
		                    alt="Trip photo preview"
		                    className="h-full w-full object-cover"
		                  />
		                </div>
		              ))}
		            </div>
		          )}
		        </div>

	        <div className="grid gap-4 sm:grid-cols-3">
	          <div className="space-y-1">
	            <label className="block text-xs font-medium text-slate-200">Status</label>
	            <select
	              value={form.status}
	              onChange={(event) =>
	                updateField("status", event.target.value as PackageStatus)
	              }
	              className="w-full rounded-lg border border-slate-700/60 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
	            >
	              <option value="draft">Draft</option>
	              <option value="published">Published</option>
	              <option value="archived">Archived</option>
	            </select>
	            <p className="text-[10px] text-slate-400">
	              Cards on the public website only show for <span className="font-semibold">Published</span> packages.
	              Draft/Archived packages remain only in the admin panel.
	            </p>
	          </div>
	          <div className="space-y-1 sm:col-span-2">
	            <label className="block text-xs font-medium text-slate-200">Flags</label>
	            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-slate-900/40 px-3 py-2 text-xs text-slate-100">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(event) => updateField("isFeatured", event.target.checked)}
                  className="h-3 w-3 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <span>Featured package</span>
              </label>
            </div>
          </div>
        </div>

	        <div className="grid gap-4 sm:grid-cols-3">
	          <div className="space-y-1">
	            <label className="block text-xs font-medium text-slate-200">Highlights (one per line)</label>
	            <textarea
	              value={form.highlights}
	              onChange={(event) => updateField("highlights", event.target.value)}
	              className="min-h-[80px] w-full rounded-lg border border-slate-700/60 bg-slate-900/60 px-3 py-2 text-xs text-slate-50 shadow-sm placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
	              placeholder="River-side cafe; Trek to viewpoint"
	            />
          </div>
	          <div className="space-y-1">
	            <label className="block text-xs font-medium text-slate-200">Inclusions (one per line)</label>
	            <textarea
	              value={form.inclusions}
	              onChange={(event) => updateField("inclusions", event.target.value)}
	              className="min-h-[80px] w-full rounded-lg border border-slate-700/60 bg-slate-900/60 px-3 py-2 text-xs text-slate-50 shadow-sm placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
	              placeholder="Hotel stay; Breakfast and dinner"
	            />
          </div>
	          <div className="space-y-1">
	            <label className="block text-xs font-medium text-slate-200">Exclusions (one per line)</label>
	            <textarea
	              value={form.exclusions}
	              onChange={(event) => updateField("exclusions", event.target.value)}
	              className="min-h-[80px] w-full rounded-lg border border-slate-700/60 bg-slate-900/60 px-3 py-2 text-xs text-slate-50 shadow-sm placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
	              placeholder="Lunch; Personal expenses"
	            />
          </div>
        </div>

		        <button
		          type="submit"
		          disabled={submitting}
		          className="inline-flex w-full items-center justify-center rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-none hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-sky-500/70"
		        >
		          {submitting ? "Creating package..." : "Create package"}
		        </button>
      </form>
    </div>
  );
}

