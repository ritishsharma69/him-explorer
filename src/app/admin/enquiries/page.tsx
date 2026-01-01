"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";

const ADMIN_FLAG_KEY = "himexplore_admin_logged_in";

interface AdminEnquiry {
  _id: string;
  fullName: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  numberOfAdults: number;
  numberOfChildren: number;
  budgetPerPersonMin?: number;
  message: string;
  howDidYouHear?: string;
  status: string;
  preferredStartDate?: string;
  createdAt?: string;
}

function getStatusClasses(status: string) {
	  switch (status) {
	    case "new":
	      return "bg-sky-100 text-sky-800";
	    case "contacted":
	      return "bg-amber-100 text-amber-800";
	    case "in_progress":
	      return "bg-indigo-100 text-indigo-800";
	    case "closed":
	      return "bg-emerald-100 text-emerald-800";
	    default:
	      return "bg-slate-100 text-slate-700";
	  }
}

export default function AdminEnquiriesPage() {
  const router = useRouter();
  const [enquiries, setEnquiries] = useState<AdminEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  async function loadEnquiries() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/enquiries");
      if (!res.ok) {
        setError("Failed to load enquiries");
        return;
      }

      const data = (await res.json()) as { enquiries?: AdminEnquiry[] };
      setEnquiries(data.enquiries ?? []);
	  } catch (error) {
	      console.error(error);
	      setError("Failed to load enquiries");
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmDelete() {
    if (!confirmDeleteId) return;

    const id = confirmDeleteId;
    setDeletingId(id);
    setError(null);

    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        setError("Failed to delete enquiry");
        return;
      }

      setEnquiries((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete enquiry");
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

    void loadEnquiries();
  }, [router]);

  function formatDate(value?: string) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  }

	  return (
	    <div className="space-y-4">
	      <div className="flex items-center justify-between gap-2">
	        <h2 className="text-sm font-semibold text-slate-50 sm:text-base">
	          Enquiries
	        </h2>
	        <button
	          type="button"
	          onClick={() => void loadEnquiries()}
		          className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-700 shadow-sm hover:bg-slate-200"
	        >
	          Refresh
	        </button>
	      </div>
	      {error && <p className="text-xs font-medium text-red-400">{error}</p>}
		      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/40 shadow-inner backdrop-blur-sm">
	        <table className="min-w-full text-left text-xs text-slate-100 sm:text-sm">
	          <thead className="bg-white/5 text-[10px] uppercase tracking-[0.18em] text-slate-300">
	            <tr>
	              <th className="px-3 py-2">Guest</th>
	              <th className="px-3 py-2">Contact</th>
	              <th className="px-3 py-2">People</th>
		              <th className="px-3 py-2">Trip details</th>
		              <th className="px-3 py-2">Budget min</th>
	              <th className="px-3 py-2">Status</th>
	              <th className="px-3 py-2">Created</th>
	              <th className="px-3 py-2 text-right">Actions</th>
	            </tr>
	          </thead>
	          <tbody>
		          {enquiries.length === 0 && !loading && (
		            <tr className="border-t border-white/10 bg-white/5">
		                <td className="px-3 py-8 text-center text-[11px] text-slate-400" colSpan={8}>
	                  No enquiries yet.
	                </td>
	              </tr>
	            )}
		            {enquiries.map((enquiry) => (
		              <tr
		                key={enquiry._id}
		                className="border-t border-white/5 bg-white/5 hover:bg-white/10"
		              >
	              <td className="px-3 py-2 align-top">
	                <div className="space-y-0.5">
	                  <div className="font-medium text-slate-100">
                      {enquiry.fullName}
                    </div>
	                    {enquiry.howDidYouHear && (
	                      <div className="text-[10px] text-slate-400">
                        Source: {enquiry.howDidYouHear}
                      </div>
                    )}
                  </div>
                </td>
	              <td className="px-3 py-2 align-top text-[11px] text-slate-300">
                  <div>{enquiry.email}</div>
                  <div>
                    {enquiry.phoneCountryCode} {enquiry.phoneNumber}
                  </div>
                </td>
	              <td className="px-3 py-2 align-top text-[11px] text-slate-100">
                  {enquiry.numberOfAdults}A
                  {enquiry.numberOfChildren > 0 && ` + ${enquiry.numberOfChildren}C`}
                </td>
		                <td className="px-3 py-2 align-top text-[11px] text-slate-300">
	                  <div>
	                    Preferred: {formatDate(enquiry.preferredStartDate)}
	                  </div>
		                  <div className="mt-1 text-[11px] leading-snug text-slate-300">
	                    {enquiry.message}
	                  </div>
	                </td>
		                <td className="px-3 py-2 align-top text-[11px] text-slate-100">
		                  {enquiry.budgetPerPersonMin
		                    ? `₹ ${enquiry.budgetPerPersonMin.toLocaleString("en-IN")}`
		                    : "-"}
		                </td>
		                <td className="px-3 py-2 align-top">
		                  <span
		                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${getStatusClasses(enquiry.status)}`}
		                  >
		                    {enquiry.status.replace("_", " ")}
		                  </span>
		                </td>
		                <td className="px-3 py-2 align-top text-[11px] text-slate-400">
	                  {formatDate(enquiry.createdAt)}
	                </td>
	                <td className="px-3 py-2 align-top text-right">
	                  <button
	                    type="button"
	                    onClick={() => setConfirmDeleteId(enquiry._id)}
	                    disabled={deletingId === enquiry._id}
	                    className="rounded-full border border-red-500/40 px-2 py-1 text-[10px] font-medium text-red-300 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
	                  >
	                    {deletingId === enquiry._id ? "Deleting..." : "Delete"}
	                  </button>
	                </td>
	              </tr>
            ))}
		          {loading && (
		            <tr className="border-t border-white/10 bg-white/5">
		                <td className="px-3 py-8 text-center text-[11px] text-slate-400" colSpan={8}>
	                  Loading enquiries...
	                </td>
	              </tr>
	            )}
	        </tbody>
	        </table>
	      </div>
	      <ConfirmDialog
	        open={confirmDeleteId !== null}
	        title="Delete this enquiry?"
	        description="Ye enquiry admin table se delete ho jayegi. Agar galti se delete ho gaya to wapas nahi la paoge."
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

