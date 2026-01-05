"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { readAndCompressImageFile } from "@/lib/client/image-utils";

const ADMIN_FLAG_KEY = "himexplore_admin_logged_in";

interface AdminAdventureActivity {
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

const EMPTY_FORM: FormState = {
  name: "",
  label: "",
  imageUrl: "",
};

export default function AdminAdventureActivitiesPage() {
  const router = useRouter();
  const [activities, setActivities] = useState<AdminAdventureActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
	  const [confirmDeleteId, setConfirmDeleteId] =
	    useState<string | null>(null);

  async function loadActivities() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/admin/adventure-activities");
      if (!res.ok) throw new Error("Failed to load activities");

      const json = await res.json();
      setActivities(json.activities ?? []);
    } catch (err) {
      console.error(err);
      setError("Unable to load activities. Please try again.");
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

	  void loadActivities();
	}, [router]);

  const handleInputChange = (
    field: keyof FormState,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

	  function startEdit(activity: AdminAdventureActivity) {
	    setEditingId(activity._id);
	    setForm({
	      name: activity.name,
	      label: activity.label,
	      imageUrl: activity.imageUrl ?? "",
	    });
	  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
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

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

	    if (!form.name.trim() || !form.label.trim()) {
	      setError("Name and short line are required.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

	      const payload = {
	        name: form.name.trim(),
	        label: form.label.trim(),
	        imageUrl: form.imageUrl.trim() || undefined,
	      };

      const endpoint = editingId
        ? `/api/admin/adventure-activities/${editingId}`
        : "/api/admin/adventure-activities";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save activity");

      await loadActivities();
      setForm(EMPTY_FORM);
      setEditingId(null);
    } catch (err) {
      console.error(err);
      setError("Unable to save activity. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

	  async function handleConfirmDelete() {
	    if (!confirmDeleteId) return;

	    const id = confirmDeleteId;
	    try {
	      setDeletingId(id);
	      setError(null);

	      const res = await fetch(`/api/admin/adventure-activities/${id}`, {
	        method: "DELETE",
	      });

	      if (!res.ok) throw new Error("Failed to delete activity");

	      await loadActivities();
	      if (editingId === id) {
	        cancelEdit();
	      }
	    } catch (err) {
	      console.error(err);
	      setError("Unable to delete activity. Please try again.");
	    } finally {
	      setDeletingId(null);
	      setConfirmDeleteId(null);
	    }
	  }

	  return (
	    <div className="space-y-4">
	      <div className="flex flex-wrap items-center justify-between gap-3">
	        <div>
	          <h2 className="text-sm font-semibold text-slate-50 sm:text-base">
	            Fun activities & treks
	          </h2>
	          <p className="text-[11px] text-slate-300">
	            Manage the adventure slider on the homepage: rafting, paragliding,
	            camping, short treks, etc.
	          </p>
	        </div>
	        <button
	          type="button"
	          onClick={loadActivities}
	          className="rounded-full border border-slate-400/60 bg-slate-900/40 px-3 py-1.5 text-[11px] font-medium text-slate-100 shadow-sm hover:bg-slate-800/60"
	        >
	          Refresh
	        </button>
	      </div>

      {error && (
        <p className="rounded-lg border border-red-500/50 bg-red-950/40 px-3 py-2 text-[11px] text-red-100">
          {error}
        </p>
      )}

	      <form
	        onSubmit={handleSubmit}
	        className="space-y-3 rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-xs sm:p-5"
	      >
	        <div className="flex flex-wrap gap-3">
	          <div className="flex-1 min-w-[180px] space-y-1">
	            <label className="block text-[11px] font-medium text-slate-200">
	              Name
	            </label>
	            <input
	              type="text"
	              value={form.name}
	              onChange={(event) => handleInputChange("name", event)}
	              className="w-full rounded-xl border border-slate-500/60 bg-slate-900/70 px-3 py-1.5 text-xs text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-400/80"
	              placeholder="e.g. River rafting"
	              required
	            />
	          </div>
	          <div className="flex-1 min-w-[200px] space-y-1">
	            <label className="block text-[11px] font-medium text-slate-200">
	              Short line
	            </label>
	            <input
	              type="text"
	              value={form.label}
	              onChange={(event) => handleInputChange("label", event)}
	              className="w-full rounded-xl border border-slate-500/60 bg-slate-900/70 px-3 py-1.5 text-xs text-slate-50 outline-none placeholder:text-slate-500 focus:border-sky-400/80"
	              placeholder="One line about safety / experience"
	              required
	            />
	          </div>
	          <div className="min-w-[200px] space-y-1">
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
	              Select an image from your device. A small preview will appear below.
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
	                  onClick={() => setForm((prev) => ({ ...prev, imageUrl: "" }))}
	                  className="text-[10px] font-medium text-slate-300 hover:text-slate-50"
	                >
	                  Clear image
	                </button>
	              </div>
	            )}
	          </div>
	        </div>
        <div className="flex items-center justify-between gap-3 pt-1">
          {editingId ? (
            <p className="text-[11px] text-amber-100">
              Editing existing activity. Save or cancel.
            </p>
          ) : (
            <p className="text-[11px] text-slate-400">
              Keep 3–6 activities active for the best experience.
            </p>
          )}
          <div className="flex items-center gap-2">
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-full border border-slate-500/70 bg-transparent px-3 py-1.5 text-[11px] font-medium text-slate-100 hover:bg-slate-800/70"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-sky-500 px-4 py-1.5 text-[11px] font-semibold text-slate-950 shadow-sm hover:bg-sky-400 disabled:cursor-wait disabled:opacity-70"
            >
              {editingId ? "Save changes" : "Add activity"}
            </button>
          </div>
        </div>
      </form>

      <div className="space-y-2 rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-xs">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-medium text-slate-200">
            Current activities
          </p>
          {loading && (
            <span className="text-[11px] text-slate-400">Loading…</span>
          )}
        </div>

			        {activities.length === 0 && !loading ? (
			          <p className="text-[11px] text-slate-400">
			            No activities added yet. Create one above.
			          </p>
			        ) : (
			          <ul className="space-y-2">
			            {activities.map((activity) => (
			              <li
			                key={activity._id}
			                className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2"
			              >
			                <div className="min-w-0 flex-1">
			                  <p className="truncate text-xs font-medium text-slate-50">
			                    {activity.name}
			                  </p>
			                  <p className="truncate text-[11px] text-slate-300">
			                    {activity.label}
			                  </p>
			                </div>
			                <div className="flex flex-shrink-0 items-center gap-1.5">
			                  <button
			                    type="button"
			                    onClick={() => startEdit(activity)}
			                    className="rounded-full border border-slate-500/70 bg-slate-900/80 px-2.5 py-1 text-[10px] font-medium text-slate-100 hover:bg-slate-800"
			                  >
			                    Edit
			                  </button>
			                  <button
			                    type="button"
			                    onClick={() => setConfirmDeleteId(activity._id)}
			                    disabled={deletingId === activity._id}
			                    className="rounded-full border border-red-500/80 bg-red-600 px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm hover:bg-red-500 disabled:cursor-wait disabled:opacity-70"
			                  >
			                    Delete
			                  </button>
			                </div>
			              </li>
			            ))}
			          </ul>
			        )}
		      </div>
		      <ConfirmDialog
		        open={confirmDeleteId !== null}
		        title="Delete this activity?"
		        description="This activity will be removed from the homepage adventure slider. This action cannot be undone."
		        confirmLabel={deletingId ? "Deleting..." : "Delete activity"}
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

