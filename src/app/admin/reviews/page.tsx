"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";

const ADMIN_FLAG_KEY = "himexplore_admin_logged_in";

type ReviewStatus = "pending" | "approved" | "rejected";

interface AdminReview {
	_id: string;
	fullName: string;
	location?: string;
	rating: number;
	comment: string;
	isFeatured: boolean;
	status: ReviewStatus | string;
	createdAt?: string;
}

interface FormState {
	fullName: string;
	location: string;
	rating: string;
	comment: string;
	status: ReviewStatus;
	isFeatured: boolean;
}

const INITIAL_FORM: FormState = {
	fullName: "",
	location: "",
	rating: "5",
	comment: "",
	status: "approved",
	isFeatured: false,
};

function getStatusClasses(status: string) {
	switch (status) {
		case "approved":
			return "bg-emerald-100 text-emerald-800";
		case "pending":
			return "bg-amber-100 text-amber-800";
		case "rejected":
			return "bg-red-100 text-red-700";
		default:
			return "bg-slate-100 text-slate-700";
	}
}

export default function AdminReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
	  const [form, setForm] = useState<FormState>(INITIAL_FORM);
	  const [submitting, setSubmitting] = useState(false);
	  const [editingId, setEditingId] = useState<string | null>(null);
	  const [deletingId, setDeletingId] = useState<string | null>(null);
	  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

	  async function loadReviews() {
	    setLoading(true);
	    setError(null);

	    try {
	      const res = await fetch("/api/admin/reviews");
	      if (!res.ok) {
	        setError("Failed to load reviews");
	        return;
	      }

	      const data = (await res.json()) as { reviews?: AdminReview[] };
	      setReviews(data.reviews ?? []);
	    } catch (err) {
	      console.error(err);
	      setError("Failed to load reviews");
	    } finally {
	      setLoading(false);
	    }
	  }

	  async function handleSubmit(event: FormEvent) {
	    event.preventDefault();
	    setError(null);

	    const fullName = form.fullName.trim();
	    const comment = form.comment.trim();
	    const location = form.location.trim();
	    const ratingValue = Number(form.rating);

	    if (!fullName || !comment) {
	      setError(
	        "Name aur review text dono bharna zaroori hai. Yehi site par dikhte hain.",
	      );
	      return;
	    }

	    if (Number.isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
	      setError("Rating 1 se 5 ke beech ka number hona chahiye.");
	      return;
	    }

	    setSubmitting(true);

	    try {
	      const payload = {
	        fullName,
	        comment,
	        location: location || undefined,
	        rating: ratingValue,
	        status: form.status,
	        isFeatured: form.isFeatured,
	      };

	      const isEditing = Boolean(editingId);
	      const url = isEditing
	        ? `/api/admin/reviews/${editingId}`
	        : "/api/admin/reviews";
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
	        setError(data?.error ?? "Failed to save review");
	        return;
	      }

	      const data = (await res.json()) as { review: AdminReview };
	      const saved = data.review;

	      setReviews((prev) => {
	        if (!isEditing) {
	          // New reviews are most recent, so show them at the top.
	          return [saved, ...prev];
	        }

	        return prev.map((item) => (item._id === saved._id ? saved : item));
	      });

	      setForm(INITIAL_FORM);
	      setEditingId(null);
	    } catch (err) {
	      console.error(err);
	      setError("Failed to save review");
	    } finally {
	      setSubmitting(false);
	    }
	  }

	  function startEdit(review: AdminReview) {
	    setEditingId(review._id);
	    setError(null);
	    setForm({
	      fullName: review.fullName,
	      location: review.location ?? "",
	      rating: review.rating.toString(),
	      comment: review.comment,
	      status: (review.status as ReviewStatus) ?? "approved",
	      isFeatured: Boolean(review.isFeatured),
	    });
	  }

	  function cancelEdit() {
	    setEditingId(null);
	    setForm(INITIAL_FORM);
	  }

	  async function handleConfirmDelete() {
	    if (!confirmDeleteId) return;

	    const id = confirmDeleteId;
	    setDeletingId(id);
	    setError(null);

	    try {
	      const res = await fetch(`/api/admin/reviews/${id}`, {
	        method: "DELETE",
	      });

	      if (!res.ok) {
	        setError("Failed to delete review");
	        return;
	      }

	      setReviews((prev) => prev.filter((item) => item._id !== id));
	      if (editingId === id) {
	        setEditingId(null);
	        setForm(INITIAL_FORM);
	      }
	    } catch (err) {
	      console.error(err);
	      setError("Failed to delete review");
	    } finally {
	      setDeletingId(null);
	      setConfirmDeleteId(null);
	    }
	  }

  useEffect(() => {
    if (typeof window === "undefined") return;

    const flag = window.localStorage.getItem(ADMIN_FLAG_KEY);
    if (flag !== "1") {
      router.replace("/admin/login");
      return;
    }

    void loadReviews();
  }, [router]);

	  function formatDate(value?: string) {
	    if (!value) return "-";
	    const date = new Date(value);
	    if (Number.isNaN(date.getTime())) return "-";
	    return date.toLocaleDateString("en-IN", {
	      year: "numeric",
	      month: "short",
	      day: "2-digit",
	    });
	  }

	  return (
	    <div className="space-y-4">
	      <div className="flex items-center justify-between gap-2">
	        <div>
	          <h2 className="text-sm font-semibold text-slate-50 sm:text-base">
	            Reviews
	          </h2>
	          <p className="text-[11px] text-slate-300">
	            Add new testimonials and tweak existing ones that show on the site.
	          </p>
	        </div>
	        <button
	          type="button"
	          onClick={() => void loadReviews()}
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
	          <div className="min-w-[200px] flex-1 space-y-1">
	            <label className="block text-[11px] font-medium text-slate-200">
	              Guest name
	            </label>
	            <input
	              type="text"
	              value={form.fullName}
	              onChange={(e) =>
	                setForm((prev) => ({ ...prev, fullName: e.target.value }))
	              }
	              className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-50 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
	              placeholder="Ritish from Delhi"
	            />
	          </div>
	          <div className="min-w-[160px] space-y-1">
	            <label className="block text-[11px] font-medium text-slate-200">
	              Location (optional)
	            </label>
	            <input
	              type="text"
	              value={form.location}
	              onChange={(e) =>
	                setForm((prev) => ({ ...prev, location: e.target.value }))
	              }
	              className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-50 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
	              placeholder="Delhi, India"
	            />
	          </div>
	          <div className="w-28 space-y-1">
	            <label className="block text-[11px] font-medium text-slate-200">
	              Rating
	            </label>
	            <input
	              type="number"
	              min={1}
	              max={5}
	              step={0.5}
	              value={form.rating}
	              onChange={(e) =>
	                setForm((prev) => ({ ...prev, rating: e.target.value }))
	              }
	              className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-50 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
	            />
	          </div>
	          <div className="min-w-[140px] space-y-1">
	            <label className="block text-[11px] font-medium text-slate-200">
	              Status
	            </label>
	            <select
	              value={form.status}
	              onChange={(e) =>
	                setForm((prev) => ({
	                  ...prev,
	                  status: e.target.value as ReviewStatus,
	                }))
	              }
	              className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-50 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
	            >
	              <option value="approved">Approved</option>
	              <option value="pending">Pending</option>
	              <option value="rejected">Rejected</option>
	            </select>
	          </div>
	          <div className="flex items-end space-x-2">
	            <label className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-200">
	              <input
	                type="checkbox"
	                checked={form.isFeatured}
	                onChange={(e) =>
	                  setForm((prev) => ({
	                    ...prev,
	                    isFeatured: e.target.checked,
	                  }))
	                }
	                className="h-3.5 w-3.5 rounded border-white/20 bg-slate-900 text-sky-500 focus:ring-sky-500"
	              />
	              <span>Featured</span>
	            </label>
	          </div>
	        </div>
	        <div className="space-y-1">
	          <label className="block text-[11px] font-medium text-slate-200">
	            Review text
	          </label>
	          <textarea
	            value={form.comment}
	            onChange={(e) =>
	              setForm((prev) => ({ ...prev, comment: e.target.value }))
	            }
	            rows={3}
	            className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-50 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
	            placeholder="What did they love about the trip?"
	          />
	          <p className="text-[11px] text-slate-400">
	            Approved + featured reviews hi home page par carousel mein dikhte
	            hain.
	          </p>
	        </div>
	        <div className="flex flex-wrap items-center justify-between gap-3">
	          <div className="text-[11px] text-slate-400">
	            {editingId ? "Editing existing review" : "Add a new testimonial"}
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
	              className="rounded-full bg-sky-600 px-4 py-1.5 text-[11px] font-semibold text-slate-50 shadow-sm hover:bg-sky-500 disabled:opacity-60"
	            >
	              {submitting
	                ? editingId
	                  ? "Saving..."
	                  : "Adding..."
	                : editingId
	                  ? "Save changes"
	                  : "+ Add review"}
	            </button>
	          </div>
	        </div>
	      </form>

	      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/40 shadow-inner backdrop-blur-sm">
	        <table className="min-w-full text-left text-xs text-slate-100 sm:text-sm">
	          <thead className="bg-white/5 text-[10px] uppercase tracking-[0.18em] text-slate-300">
	            <tr>
	              <th className="px-3 py-2">Guest</th>
	              <th className="px-3 py-2">Location</th>
	              <th className="px-3 py-2">Rating</th>
	              <th className="px-3 py-2">Status</th>
	              <th className="px-3 py-2">Created</th>
	              <th className="px-3 py-2 text-right">Actions</th>
	            </tr>
	          </thead>
	          <tbody>
	            {reviews.length === 0 && !loading && (
	              <tr className="border-t border-white/10 bg-white/5">
	                <td
	                  className="px-3 py-8 text-center text-[11px] text-slate-400"
	                  colSpan={6}
	                >
	                  No reviews yet.
	                </td>
	              </tr>
	            )}
	            {reviews.map((review) => (
	              <tr
	                key={review._id}
	                className="border-t border-white/5 bg-white/5 hover:bg-white/10"
	              >
	                <td className="px-3 py-2 align-top">
	                  <div className="space-y-0.5">
	                    <div className="font-medium text-slate-100">
	                      {review.fullName}
	                    </div>
	                    <div className="text-[11px] text-slate-300">
	                      {review.comment}
	                    </div>
	                  </div>
	                </td>
	                <td className="px-3 py-2 align-top text-[11px] text-slate-300">
	                  {review.location ?? "-"}
	                </td>
	                <td className="px-3 py-2 align-top">
	                  <span className="rounded-full bg-amber-100/10 px-2 py-0.5 text-[11px] font-medium text-amber-200">
	                    {review.rating.toFixed(1)} ★
	                  </span>
	                </td>
	                <td className="px-3 py-2 align-top">
	                  <div className="flex flex-col gap-1 text-[11px]">
	                    <span
	                      className={`inline-flex items-center rounded-full px-2 py-0.5 font-semibold uppercase tracking-[0.18em] ${getStatusClasses(review.status)}`}
	                    >
	                      {review.status}
	                    </span>
	                    {review.isFeatured && (
	                      <span className="inline-flex items-center rounded-full bg-sky-500/10 px-2 py-0.5 text-[10px] font-medium text-sky-300">
	                        Featured on site
	                      </span>
	                    )}
	                  </div>
	                </td>
		                <td className="px-3 py-2 align-top text-[11px] text-slate-400">
		                  {formatDate(review.createdAt)}
		                </td>
		                <td className="px-3 py-2 align-top text-right">
		                  <div className="inline-flex items-center gap-2">
		                    <button
		                      type="button"
		                      onClick={() => startEdit(review)}
		                      className="rounded-full border border-slate-500/60 px-2 py-1 text-[10px] font-medium text-slate-200 hover:bg-slate-800/70"
		                    >
		                      Edit
		                    </button>
		                    <button
		                      type="button"
		                      onClick={() => setConfirmDeleteId(review._id)}
		                      disabled={deletingId === review._id}
		                      className="rounded-full border border-red-500/40 px-2 py-1 text-[10px] font-medium text-red-300 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
		                    >
		                      {deletingId === review._id ? "Deleting..." : "Delete"}
		                    </button>
		                  </div>
		                </td>
	              </tr>
	            ))}
	            {loading && (
	              <tr className="border-t border-white/10 bg-white/5">
	                <td
	                  className="px-3 py-8 text-center text-[11px] text-slate-400"
	                  colSpan={6}
	                >
	                  Loading reviews...
	                </td>
	              </tr>
	            )}
	          </tbody>
		        </table>
	      </div>
	      <ConfirmDialog
	        open={confirmDeleteId !== null}
	        title="Delete this review?"
	        description="Ye review testimonials list se delete ho jayega. Agar galti se delete ho gaya to wapas nahi la paoge."
	        confirmLabel={deletingId ? "Deleting..." : "Delete"}
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

