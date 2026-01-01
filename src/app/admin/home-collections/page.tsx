"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { readAndCompressImageFile } from "@/lib/client/image-utils";

const ADMIN_FLAG_KEY = "himexplore_admin_logged_in";

type HomeCollectionCategory = "top" | "offbeat";

interface AdminHomeCollectionItem {
  _id: string;
  category: HomeCollectionCategory;
  badge: string;
  title: string;
  subtitle: string;
  imageUrl?: string;
}

interface FormState {
  category: HomeCollectionCategory;
  badge: string;
  title: string;
  subtitle: string;
  imageUrl: string;
}

function createInitialForm(category: HomeCollectionCategory): FormState {
	  return {
	    category,
	    badge: category === "top" ? "TOP 10" : "OFFBEAT",
	    title: "",
	    subtitle: "",
	    imageUrl: "",
	  };
	}

export default function AdminHomeCollectionsPage() {
  const router = useRouter();
  const [items, setItems] = useState<AdminHomeCollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
	  const [activeCategory, setActiveCategory] =
	    useState<HomeCollectionCategory>("top");
	  const [form, setForm] = useState<FormState>(() =>
	    createInitialForm("top"),
	  );
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
	  const [editingId, setEditingId] = useState<string | null>(null);
	  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  async function loadItems() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/home-collections");
      if (!res.ok) {
        setError("Failed to load collections");
        return;
      }

      const data = (await res.json()) as {
        items?: AdminHomeCollectionItem[];
      };
      setItems(data.items ?? []);
    } catch (err) {
      console.error(err);
      setError("Failed to load collections");
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

    void loadItems();
  }, [router]);

			async function handleSubmit(event: FormEvent) {
		  event.preventDefault();
		  setError(null);

		  const title = form.title.trim();
		  const subtitle = form.subtitle.trim();
		  const badge = form.badge.trim();
		  if (!title || !subtitle) {
		    setError(
		      "Title aur subtitle dono bharna zaroori hai. Yehi home page cards par dikhte hain.",
		    );
		    return;
		  }

		  setSubmitting(true);
		
			  try {
			    const payload = {
			      category: activeCategory,
			      badge,
			      title,
			      subtitle,
			      imageUrl: form.imageUrl.trim() || undefined,
			    };

			    const isEditing = Boolean(editingId);
			    const url = isEditing
			      ? `/api/admin/home-collections/${editingId}`
			      : "/api/admin/home-collections";
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
		      setError(data?.error ?? "Failed to save collection");
		      return;
		    }
		
			    const data = (await res.json()) as { item: AdminHomeCollectionItem };
			    const saved = data.item;
		
			    setItems((prev) => {
			      if (!isEditing) {
			        return [...prev, saved];
			      }
		
			      return prev.map((item) => (item._id === saved._id ? saved : item));
			    });
		
			    setForm(createInitialForm(activeCategory));
			    setEditingId(null);
		  } catch (err) {
		    console.error(err);
		    setError("Failed to save collection");
		  } finally {
		    setSubmitting(false);
		  }
		}

		function startEdit(item: AdminHomeCollectionItem) {
		  setEditingId(item._id);
		  setError(null);
		  setActiveCategory(item.category);
		  setForm({
		    category: item.category,
		    badge: item.badge,
		    title: item.title,
		    subtitle: item.subtitle,
			    imageUrl: item.imageUrl ?? "",
		  });
		}

		function cancelEdit() {
		  setEditingId(null);
		  setForm(createInitialForm(activeCategory));
		}

		async function handleConfirmDelete() {
		  if (!confirmDeleteId) return;

		  const id = confirmDeleteId;
		  setDeletingId(id);
		  setError(null);
		
		  try {
		    const res = await fetch(`/api/admin/home-collections/${id}`, {
		      method: "DELETE",
		    });
		
		    if (!res.ok) {
		      setError("Failed to delete collection");
		      return;
		    }
		
		    setItems((prev) => prev.filter((item) => item._id !== id));
		    if (editingId === id) {
		      setEditingId(null);
		      setForm(createInitialForm(activeCategory));
		    }
		  } catch (err) {
		    console.error(err);
		    setError("Failed to delete collection");
		  } finally {
		    setDeletingId(null);
		    setConfirmDeleteId(null);
		  }
		}

		  async function handleImageFileChange(event: ChangeEvent<HTMLInputElement>) {
				const file = event.target.files?.[0];
				if (!file) return;

				const maxSizeMb = 2;
				if (file.size > maxSizeMb * 1024 * 1024) {
					setError(
						`Image ka size ${maxSizeMb}MB se chhota rakho, warna upload bahut slow ho jata hai.`,
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
						"Image process karne mein issue aaya. Thoda chhota file try karo ya dubara upload karo.",
					);
				}
			}
		
		  const filteredItems = items.filter(
		    (item) => item.category === activeCategory,
		  );
		
	  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-slate-50 sm:text-base">
            Home collections
          </h2>
          <p className="text-[11px] text-slate-300">
            Manage the two rows of collection cards on the home page.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadItems()}
          className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-700 shadow-sm hover:bg-slate-200"
        >
          Refresh
        </button>
      </div>

		      <div className="flex flex-wrap items-center justify-between gap-3">
		        <div className="inline-flex rounded-full bg-slate-900/60 p-1 text-[11px]">
	          <button
	            type="button"
	            onClick={() => {
	              setActiveCategory("top");
		              setEditingId(null);
		              setForm(createInitialForm("top"));
	            }}
	            className={`rounded-full px-3 py-1 font-medium transition-colors ${
	              activeCategory === "top"
	                ? "bg-sky-500 text-slate-950 shadow-sm"
	                : "bg-transparent text-slate-200 hover:bg-slate-800"
	            }`}
	          >
	            Top 10 row
	          </button>
	          <button
	            type="button"
	            onClick={() => {
	              setActiveCategory("offbeat");
		              setEditingId(null);
		              setForm(createInitialForm("offbeat"));
	            }}
	            className={`rounded-full px-3 py-1 font-medium transition-colors ${
	              activeCategory === "offbeat"
	                ? "bg-sky-500 text-slate-950 shadow-sm"
	                : "bg-transparent text-slate-200 hover:bg-slate-800"
	            }`}
	          >
	            Unlock lesser-known row
	          </button>
	        </div>
	        <p className="max-w-xs text-[10px] text-slate-400">
	          {activeCategory === "top"
	            ? "Ye cards home page ke \"Top 10 Himachal collections\" wale row mein dikhte hain."
	            : "Ye cards \"Unlock lesser-known wonders of Himachal\" wale row mein dikhte hain."}
	        </p>
	      </div>

	      {error && <p className="text-xs font-medium text-red-400">{error}</p>}
	
		      <form
		        onSubmit={handleSubmit}
		        className="space-y-3 rounded-2xl border border-white/10 bg-slate-950/40 p-3 text-xs text-slate-100 shadow-inner backdrop-blur-sm sm:text-sm"
		      >
        <div className="flex flex-wrap gap-3">
	          <div className="space-y-1 min-w-[180px]">
	            <label className="block text-[11px] font-medium text-slate-200">
	              Row
	            </label>
	            <p className="rounded-lg border border-slate-700/60 bg-slate-900/60 px-2 py-1 text-[11px] text-slate-100">
	              {activeCategory === "top"
	                ? "Top 10 Himachal collections row"
	                : "Unlock lesser-known Himachal row"}
	            </p>
	            <p className="text-[10px] text-slate-400">
	              Yahan jo cards add karoge, sirf isi row mein dikhenge.
	            </p>
	          </div>
	          <div className="flex-1 space-y-1 min-w-[180px]">
            <label className="block text-[11px] font-medium text-slate-200">
              Badge
            </label>
            <input
              type="text"
              value={form.badge}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, badge: e.target.value }))
              }
              className="w-full rounded-lg border border-slate-700/60 bg-slate-900/60 px-2 py-1 text-xs text-slate-50 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
		            {activeCategory === "top" && (
		              <p className="text-[10px] text-slate-400">
		                Top row ke cards ke liye default badge &quot;TOP 10&quot; rakha gaya
		                hai.
		              </p>
		            )}
          </div>
          <div className="flex-1 space-y-1 min-w-[220px]">
            <label className="block text-[11px] font-medium text-slate-200">
              Title
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full rounded-lg border border-slate-700/60 bg-slate-900/60 px-2 py-1 text-xs text-slate-50 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              required
            />
          </div>
          <div className="flex-1 space-y-1 min-w-[220px]">
            <label className="block text-[11px] font-medium text-slate-200">
              Subtitle
            </label>
            <input
              type="text"
              value={form.subtitle}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, subtitle: e.target.value }))
              }
              className="w-full rounded-lg border border-slate-700/60 bg-slate-900/60 px-2 py-1 text-xs text-slate-50 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              required
            />
          </div>
		          <div className="space-y-1 min-w-[180px]">
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
		              Yahan se image upload karein. Neeche preview dikh jayega.
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
		              ? "Editing existing card. Changes issi row ke cards par reflect honge."
		              : "Naya collection card add karein jo selected row par dikhega."}
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
		                  : "+ Add collection card"}
		            </button>
		          </div>
		        </div>
      </form>

		      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/40 shadow-inner backdrop-blur-sm">
		        <table className="min-w-full text-left text-xs text-slate-100 sm:text-sm">
			          <thead className="bg-white/5 text-[10px] uppercase tracking-[0.18em] text-slate-300">
		            <tr>
		              <th className="px-3 py-2">Image</th>
		              <th className="px-3 py-2">Category</th>
		              <th className="px-3 py-2">Badge</th>
		              <th className="px-3 py-2">Title</th>
		              <th className="px-3 py-2">Subtitle</th>
		              <th className="px-3 py-2 text-right">Actions</th>
		            </tr>
		          </thead>
		      <tbody>
		            {filteredItems.length === 0 && !loading && (
		              <tr className="border-t border-white/10 bg-white/5">
		                <td
		                  className="px-3 py-10 text-center text-[11px] text-slate-400"
		                  colSpan={6}
		                >
				                  No collection cards in this row yet.
		                </td>
		              </tr>
		            )}
		            {filteredItems.map((item) => (
		              <tr
		                key={item._id}
		                className="border-t border-white/5 bg-white/5 hover:bg-white/10"
		              >
		                <td className="px-3 py-2">
		                  {item.imageUrl ? (
		                    <div className="h-10 w-16 overflow-hidden rounded-xl border border-white/10 bg-slate-900/60">
		                      {/* eslint-disable-next-line @next/next/no-img-element */}
		                      <img
		                        src={item.imageUrl}
		                        alt={item.title}
		                        className="h-full w-full object-cover"
		                      />
		                    </div>
		                  ) : (
		                    <span className="text-[10px] text-slate-400">
					                      No image
		                    </span>
		                  )}
		                </td>
		                <td className="px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-slate-300">
		                  {item.category}
		                </td>
		                <td className="px-3 py-2 text-[11px] font-semibold text-slate-50">
		                  {item.badge}
		                </td>
		                <td className="px-3 py-2 text-slate-100">{item.title}</td>
		                <td className="px-3 py-2 text-[11px] text-slate-300">
		                  {item.subtitle}
		                </td>
		                <td className="px-3 py-2 text-right">
		                  <div className="inline-flex items-center gap-2">
		                    <button
		                      type="button"
		                      onClick={() => startEdit(item)}
		                      className="rounded-full border border-slate-500/60 px-2 py-1 text-[10px] font-medium text-slate-200 hover:bg-slate-800/70"
		                    >
		                      Edit
		                    </button>
		                    <button
		                      type="button"
		                      onClick={() => setConfirmDeleteId(item._id)}
		                      disabled={deletingId === item._id}
		                      className="rounded-full border border-red-500/40 px-2 py-1 text-[10px] font-medium text-red-300 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
		                    >
		                      {deletingId === item._id ? "Deleting..." : "Delete"}
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
		                  Loading collections...
		                </td>
		              </tr>
		            )}
		          </tbody>
		        </table>
		      </div>
		      <ConfirmDialog
		        open={confirmDeleteId !== null}
		        title="Delete this collection card?"
		        description="Ye card home page se turant hat jayega. Ye action undo nahi ho sakta."
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

