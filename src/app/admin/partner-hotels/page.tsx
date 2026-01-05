"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { readAndCompressImageFile } from "@/lib/client/image-utils";

const ADMIN_FLAG_KEY = "himexplore_admin_logged_in";

interface AdminPartnerHotel {
  _id: string;
  name: string;
  label: string;
  imageUrl?: string;
}

interface FormState {
  name: string;
  label: string;
  imageUrl: string;
}

const INITIAL_FORM: FormState = {
  name: "",
  label: "",
  imageUrl: "",
};

export default function AdminPartnerHotelsPage() {
  const router = useRouter();
  const [hotels, setHotels] = useState<AdminPartnerHotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
	  const [deletingId, setDeletingId] = useState<string | null>(null);
	  const [editingId, setEditingId] = useState<string | null>(null);
		  const [confirmDeleteId, setConfirmDeleteId] =
		    useState<string | null>(null);

  async function loadHotels() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/partner-hotels");
      if (!res.ok) {
        setError("Failed to load partner hotels");
        return;
      }

      const data = (await res.json()) as { hotels?: AdminPartnerHotel[] };
      setHotels(data.hotels ?? []);
    } catch (err) {
      console.error(err);
      setError("Failed to load partner hotels");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return;

    const flag = window.localStorage.getItem(ADMIN_FLAG_KEY);
    if (flag !== "1") {
      router.replace("/admin/login");
      return;
    }

    void loadHotels();
  }, [router]);

		async function handleSubmit(event: FormEvent) {
		  event.preventDefault();
		  setError(null);

		  const name = form.name.trim();
		  const label = form.label.trim();
		  if (!name || !label) {
		    setError(
		      "Both name and label are required. These are displayed on the home page.",
		    );
		    return;
		  }

		  setSubmitting(true);

		  try {
		    const payload = {
		      name,
		      label,
		      imageUrl: form.imageUrl.trim() || undefined,
		    };

		    const isEditing = Boolean(editingId);
		    const url = isEditing
		      ? `/api/admin/partner-hotels/${editingId}`
		      : "/api/admin/partner-hotels";
		    const method = isEditing ? "PATCH" : "POST";

		    const res = await fetch(url, {
		      method,
		      headers: { "Content-Type": "application/json" },
		      body: JSON.stringify(payload),
		    });

		    if (!res.ok) {
		      const data = (await res.json().catch(() => null)) as
		        | { error?: string }
		        | null;
		      setError(data?.error ?? "Failed to save partner hotel");
		      return;
		    }

		    const data = (await res.json()) as { hotel: AdminPartnerHotel };
		    const saved = data.hotel;
		
		    setHotels((prev) => {
		      if (!isEditing) {
		        return [...prev, saved];
		      }
		
		      return prev.map((hotel) =>
		        hotel._id === saved._id ? saved : hotel,
		      );
		    });
		
		    setForm(INITIAL_FORM);
		    setEditingId(null);
		  } catch (err) {
		    console.error(err);
		    setError("Failed to save partner hotel");
		  } finally {
		    setSubmitting(false);
		  }
		}

			async function handleConfirmDelete() {
			  if (!confirmDeleteId) return;

			  const id = confirmDeleteId;
	    setDeletingId(id);
	    setError(null);

	    try {
	      const res = await fetch(`/api/admin/partner-hotels/${id}`, {
	        method: "DELETE",
	      });

	      if (!res.ok) {
	        setError("Failed to delete partner hotel");
	        return;
	      }

	      setHotels((prev) => prev.filter((hotel) => hotel._id !== id));
	      if (editingId === id) {
	        setEditingId(null);
	        setForm(INITIAL_FORM);
	      }
	    } catch (err) {
	      console.error(err);
	      setError("Failed to delete partner hotel");
	    } finally {
	      setDeletingId(null);
	      setConfirmDeleteId(null);
	    }
	  }

		function startEdit(hotel: AdminPartnerHotel) {
			setEditingId(hotel._id);
			setError(null);
			setForm({
				name: hotel.name,
				label: hotel.label,
				imageUrl: hotel.imageUrl ?? "",
			});
		}

		function cancelEdit() {
			setEditingId(null);
			setForm(INITIAL_FORM);
		}

		  async function handleImageFileChange(event: ChangeEvent<HTMLInputElement>) {
				const file = event.target.files?.[0];
				if (!file) return;

				const maxSizeMb = 2;
				if (file.size > maxSizeMb * 1024 * 1024) {
					setError(
						`Image size must be less than ${maxSizeMb}MB, otherwise upload will be very slow.`,
					);
					return;
				}

				try {
					setError(null);
					const compressedDataUrl = await readAndCompressImageFile(file, {
						maxWidth: 1280,
						maxHeight: 720,
						quality: 0.8,
					});
					setForm((prev) => ({ ...prev, imageUrl: compressedDataUrl }));
				} catch (err) {
					console.error(err);
					setError(
						"There was an issue processing the image. Try a smaller file or upload again.",
					);
				}
			}

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
	          <h2 className="text-sm font-semibold text-slate-50 sm:text-base">
            Partner hotels
          </h2>
	          <p className="text-[11px] text-slate-300">
            Manage the partner hotel logos & labels shown on the home page.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadHotels()}
          className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-700 shadow-sm hover:bg-slate-200"
        >
          Refresh
        </button>
      </div>

	      {error && <p className="text-xs font-medium text-red-400">{error}</p>}

	      <form
	        onSubmit={handleSubmit}
		        className="space-y-3 rounded-2xl border border-white/10 bg-slate-950/40 p-3 text-xs text-slate-100 shadow-inner backdrop-blur-sm sm:text-sm"
		      >
	        <div className="flex flex-wrap gap-3">
	          <div className="flex-1 space-y-1 min-w-[200px]">
		            <label className="block text-[11px] font-medium text-slate-200">
              Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
	              className="w-full rounded-lg border border-slate-700/60 bg-slate-900/60 px-2 py-1 text-xs text-slate-50 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              required
            />
          </div>
		          <div className="flex-1 space-y-1 min-w-[200px]">
		            <label className="block text-[11px] font-medium text-slate-200">
              Label
            </label>
            <input
              type="text"
              value={form.label}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, label: e.target.value }))
              }
	              className="w-full rounded-lg border border-slate-700/60 bg-slate-900/60 px-2 py-1 text-xs text-slate-50 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              required
            />
          </div>
	          <div className="space-y-1 min-w-[200px]">
			            <label className="block text-[11px] font-medium text-slate-200">
		              Image (optional)
		            </label>
	            <input
	              type="file"
	              accept="image/*"
	              onChange={handleImageFileChange}
		              className="block w-full text-[11px] text-slate-200 file:mr-3 file:rounded-full file:border-0 file:bg-sky-600 file:px-3 file:py-1.5 file:text-[11px] file:font-semibold file:text-white file:shadow-sm hover:file:bg-sky-700"
	            />
			            <p className="text-[10px] text-slate-400">
		              Upload a logo image here. Preview will appear below.
		            </p>
	            {form.imageUrl && (
	              <div className="mt-2 flex items-center gap-2">
	                <div className="h-16 w-28 overflow-hidden rounded-xl border border-white/10 bg-slate-900/60">
	                  {/* eslint-disable-next-line @next/next/no-img-element */}
	                  <img
	                    src={form.imageUrl}
	                    alt="Preview"
	                    className="h-full w-full object-cover"
	                  />
	                </div>
	                <button
	                  type="button"
	                  onClick={() =>
	                    setForm((prev) => ({ ...prev, imageUrl: "" }))
	                  }
	                  className="text-[10px] font-medium text-slate-300 hover:text-slate-50"
	                >
	                  Clear image
	                </button>
	              </div>
	            )}
	          </div>
	        </div>
	        <div className="flex flex-wrap items-center justify-between gap-3">
	          <div className="text-[11px] text-slate-400">
	            {editingId
	              ? "Editing existing partner hotel"
	              : "Add a new partner hotel"}
	          </div>
	          <div className="flex items-center gap-2">
	            {editingId && (
	              <button
	                type="button"
	                onClick={cancelEdit}
	                className="rounded-full border border-slate-500/60 px-3 py-1 text-[11px] font-medium text-slate-200 hover:bg-slate-800/70"
	              >
	                Cancel
	              </button>
	            )}
	            <button
	              type="submit"
	              disabled={submitting}
	              className="rounded-full bg-sky-600 px-4 py-1.5 text-[11px] font-semibold text-white shadow-sm hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-sky-400"
	            >
	              {submitting
	                ? editingId
	                  ? "Saving..."
	                  : "Adding..."
	                : editingId
	                  ? "Save changes"
	                  : "+ Add partner hotel"}
	            </button>
	          </div>
	        </div>
	      </form>

	      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/40 shadow-inner backdrop-blur-sm">
	        <table className="min-w-full text-left text-xs text-slate-100 sm:text-sm">
		          <thead className="bg-white/5 text-[10px] uppercase tracking-[0.18em] text-slate-300">
	            <tr>
	              <th className="px-3 py-2">Logo</th>
	              <th className="px-3 py-2">Name</th>
	              <th className="px-3 py-2">Label</th>
	              <th className="px-3 py-2 text-right">Actions</th>
	            </tr>
	          </thead>
		        <tbody>
		            {hotels.length === 0 && !loading && (
		              <tr className="border-t border-white/10 bg-white/5">
		                <td className="px-3 py-8 text-center text-[11px] text-slate-400" colSpan={4}>
		                  No partner hotels yet.
		                </td>
		              </tr>
		            )}
		        {hotels.map((hotel) => (
		          <tr
		            key={hotel._id}
		            className="border-t border-white/5 bg-white/5 hover:bg-white/10"
		          >
		            <td className="px-3 py-2">
		              <div className="h-10 w-16 overflow-hidden rounded-xl border border-white/10 bg-slate-900/60">
		                {/* eslint-disable-next-line @next/next/no-img-element */}
		                <img
		                  src={hotel.imageUrl || "/harcode-image.png"}
		                  alt={hotel.name}
		                  className="h-full w-full object-cover"
		                />
		              </div>
		            </td>
	            <td className="px-3 py-2 text-slate-100">{hotel.name}</td>
	            <td className="px-3 py-2 text-[11px] text-slate-300">
	              {hotel.label}
	            </td>
		            <td className="px-3 py-2 text-right">
		              <div className="flex items-center justify-end gap-2">
		                <button
		                  type="button"
		                  onClick={() => startEdit(hotel)}
		                  className="rounded-full border border-slate-500/60 px-2 py-1 text-[10px] font-medium text-slate-200 hover:bg-slate-800/70"
		                >
		                  Edit
		                </button>
		                <button
		                  type="button"
		                  onClick={() => setConfirmDeleteId(hotel._id)}
		                  disabled={deletingId === hotel._id}
		                  className="rounded-full border border-red-500/40 px-2 py-1 text-[10px] font-medium text-red-300 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
		                >
		                  {deletingId === hotel._id ? "Deleting..." : "Delete"}
		                </button>
		              </div>
		            </td>
	              </tr>
	            ))}
		            {loading && (
		              <tr>
		                <td className="px-3 py-4 text-slate-500" colSpan={4}>
		                  Loading partner hotels...
		                </td>
		              </tr>
		            )}
		          </tbody>
		        </table>
		      </div>
		      <ConfirmDialog
		        open={confirmDeleteId !== null}
		        title="Delete this partner hotel?"
		        description="This partner hotel logo and name will be removed from the home page. This action cannot be undone."
		        confirmLabel={deletingId ? "Deleting..." : "Delete hotel"}
		        cancelLabel="Cancel"
		        tone="danger"
		        loading={Boolean(deletingId)}
		        onCancel={() => {
		          if (deletingId) return;
		          setConfirmDeleteId(null);
		        }}
		        onConfirm={() => {
		          void handleConfirmDelete();
		        }}
		      />
		    </div>
		  );
		}

