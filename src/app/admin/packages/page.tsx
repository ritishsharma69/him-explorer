"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DocumentTextIcon } from "@heroicons/react/24/outline";

interface ItineraryItem {
	dayNumber: number;
	title: string;
	description: string;
}

interface PackageDetails {
	_id: string;
	title: string;
	subtitle?: string;
	destinationName: string;
	durationDays: number;
	startingPricePerPerson: number;
	currencyCode: string;
	shortDescription: string;
	detailedDescription?: string;
	highlights: string[];
	inclusions: string[];
	exclusions: string[];
	itinerary: ItineraryItem[];
}

const ADMIN_FLAG_KEY = "himexplore_admin_logged_in";

interface AdminPackage {
  _id: string;
  slug: string;
  title: string;
  destinationName: string;
  durationDays: number;
  startingPricePerPerson: number;
  currencyCode: string;
  status: "draft" | "published" | "archived";
	  createdAt?: string;
}

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

export default function AdminPackagesPage() {
  const router = useRouter();
  const [packages, setPackages] = useState<AdminPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
	    const [deletingId, setDeletingId] = useState<string | null>(null);
	    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(
	      null,
	    );

  async function loadPackages() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/packages");
      if (!res.ok) {
        setError("Failed to load packages");
        return;
      }

      const data = (await res.json()) as { packages?: AdminPackage[] };
      setPackages(data.packages ?? []);
	  } catch (error) {
	      console.error(error);
	      setError("Failed to load packages");
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
		      const res = await fetch(`/api/admin/packages/${id}`, {
		        method: "DELETE",
		      });

		      if (!res.ok) {
		        setError("Failed to delete package");
		        return;
		      }

		      setPackages((prev) => prev.filter((pkg) => pkg._id !== id));
		    } catch (deleteError) {
		      console.error(deleteError);
		      setError("Failed to delete package");
		    } finally {
		      setDeletingId(null);
		      setConfirmDeleteId(null);
		    }
		  }

	const [loadingPackageId, setLoadingPackageId] = useState<string | null>(null);
	const [viewPackage, setViewPackage] = useState<PackageDetails | null>(null);

	async function handleViewPackage(packageId: string) {
		setLoadingPackageId(packageId);
		try {
			const res = await fetch(`/api/admin/packages/${packageId}`);
			if (!res.ok) {
				setError("Failed to fetch package details");
				return;
			}
			const data = (await res.json()) as { package: PackageDetails };
			setViewPackage(data.package);
		} catch (err) {
			console.error("Failed to load package:", err);
			setError("Failed to load package details");
		} finally {
			setLoadingPackageId(null);
		}
	}

	function getPackageText(pkg: PackageDetails): string {
		const price = `₹${pkg.startingPricePerPerson.toLocaleString("en-IN")}`;

		let text = `PACKAGE DETAILS
Title: ${pkg.title}${pkg.subtitle ? `\nSubtitle: ${pkg.subtitle}` : ""}
Destination: ${pkg.destinationName}
Duration: ${pkg.durationDays} Days
Starting Price: ${price} per person

DESCRIPTION
${pkg.shortDescription}`;

		if (pkg.detailedDescription) {
			text += `\n\nTRIP OVERVIEW\n${pkg.detailedDescription}`;
		}

		if (pkg.highlights.length > 0) {
			text += `\n\nHIGHLIGHTS\n${pkg.highlights.map((h) => `• ${h}`).join("\n")}`;
		}

		if (pkg.itinerary.length > 0) {
			text += `\n\nITINERARY`;
			for (const day of pkg.itinerary) {
				text += `\n\nDay ${day.dayNumber}: ${day.title}\n${day.description}`;
			}
		}

		if (pkg.inclusions.length > 0) {
			text += `\n\nINCLUSIONS\n${pkg.inclusions.map((i) => `✓ ${i}`).join("\n")}`;
		}

		if (pkg.exclusions.length > 0) {
			text += `\n\nEXCLUSIONS\n${pkg.exclusions.map((e) => `✗ ${e}`).join("\n")}`;
		}

		return text;
	}

	function handleCopyText() {
		if (!viewPackage) return;
		const text = getPackageText(viewPackage);
		navigator.clipboard.writeText(text).then(() => {
			alert("Copied to clipboard!");
		}).catch(() => {
			alert("Failed to copy. Please select and copy manually.");
		});
	}

  useEffect(() => {
    if (typeof window === "undefined") return;

    const flag = window.localStorage.getItem(ADMIN_FLAG_KEY);
    if (flag !== "1") {
      router.replace("/admin/login");
      return;
    }

    void loadPackages();
  }, [router]);

  return (
	    <div className="space-y-4">
	      <div className="flex items-center justify-between gap-2">
	        <h2 className="text-sm font-semibold text-slate-50 sm:text-base">
          Packages
        </h2>
	        <div className="flex items-center gap-2">
	          <button
	            type="button"
	            onClick={() => void loadPackages()}
	            className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-700 shadow-sm hover:bg-slate-200"
	          >
	            Refresh
	          </button>
	          <button
	            type="button"
	            onClick={() => router.push("/admin/packages/new")}
	            className="rounded-full bg-sky-600 px-3 py-1 text-[11px] font-medium text-white shadow-sm hover:bg-sky-700"
	          >
	            + Add package
	          </button>
	        </div>
	      </div>
	      		  <p className="text-[11px] text-slate-300">
	        Note: Only <span className="font-semibold">published</span> packages are shown on the public website
	        (home page cards and packages list). The slug is the detail page URL, e.g.
	        <span className="font-mono"> /packages/weekend-manali-from-delhi</span>.
	      		  </p>
	      {error && <p className="text-xs font-medium text-red-400">{error}</p>}
	      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/40 shadow-inner backdrop-blur-sm">
	        <table className="min-w-full text-left text-xs text-slate-100 sm:text-sm">
	          <thead className="bg-white/5 text-[10px] uppercase tracking-[0.18em] text-slate-300">
            <tr>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Destination</th>
              <th className="px-3 py-2">Slug</th>
              <th className="px-3 py-2">Duration</th>
              <th className="px-3 py-2">Price from</th>
              <th className="px-3 py-2">Status</th>
			              <th className="px-3 py-2">Created</th>
			              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
	          <tbody>
	            {packages.length === 0 && !loading && (
	              <tr className="border-t border-white/10 bg-white/5">
		                <td
		                  className="px-3 py-10 text-center text-[11px] text-slate-400"
		                  colSpan={8}
		                >
	                  <div className="flex flex-col items-center gap-1">
	                    <span className="text-xs font-medium text-slate-200">
	                      No packages yet
	                    </span>
		                    <span className="max-w-md text-[11px] text-slate-400">
		                      Click &quot;+ Add package&quot; button above to create your first package.
		                    </span>
	                  </div>
	                </td>
	              </tr>
	            )}
	            {packages.map((pkg) => (
		              <tr
		                key={pkg._id}
		                className="border-t border-white/5 bg-white/5 hover:bg-white/10"
		              >
	                <td className="px-3 py-2 font-medium text-slate-50">
                  {pkg.title}
                </td>
                <td className="px-3 py-2">{pkg.destinationName}</td>
		                <td className="px-3 py-2 text-[11px] font-mono text-slate-500">
                  {pkg.slug}
                </td>
                <td className="px-3 py-2">
                  {pkg.durationDays} days
                </td>
	                <td className="px-3 py-2">
	                  {pkg.currencyCode} {pkg.startingPricePerPerson.toLocaleString("en-IN")}
	                </td>
		                <td className="px-3 py-2">
		                  <span
		                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${
		                      pkg.status === "published"
		                        ? "bg-blue-600/20 text-blue-200"
		                        : pkg.status === "draft"
		                          ? "bg-slate-500/30 text-slate-200"
		                          : "bg-amber-500/20 text-amber-200"
		                    }`}
		                  >
		                    {pkg.status}
		                  </span>
		                </td>
			                <td className="px-3 py-2 text-[11px] text-slate-400">
			                  {formatDate(pkg.createdAt)}
			                </td>
	                <td className="px-3 py-2">
	                  <div className="flex items-center justify-end gap-2">
	                    <button
	                      type="button"
	                      onClick={() => void handleViewPackage(pkg._id)}
	                      disabled={loadingPackageId === pkg._id}
	                      className="flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-medium text-white shadow-sm hover:bg-emerald-500 disabled:opacity-60"
	                      title="View Package Details"
	                    >
	                      <DocumentTextIcon className="h-4 w-4" />
	                      {loadingPackageId === pkg._id ? "..." : "View"}
	                    </button>
	                    <button
	                      type="button"
	                      onClick={() => router.push(`/admin/packages/${pkg._id}/edit`)}
	                      className="rounded-full border border-slate-500/50 px-2 py-1 text-[10px] font-medium text-slate-100 hover:bg-slate-900/60"
	                    >
	                      Edit
	                    </button>
				              <button
				                type="button"
				                onClick={() => setConfirmDeleteId(pkg._id)}
				                disabled={deletingId === pkg._id}
				                className="rounded-full border border-red-500/40 px-2 py-1 text-[10px] font-medium text-red-300 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
				              >
	                      {deletingId === pkg._id ? "Deleting..." : "Delete"}
	                    </button>
	                  </div>
	                </td>
              </tr>
            ))}
			            {loading && (
			              <tr className="border-t border-white/10 bg-white/5">
				                <td
				                  className="px-3 py-8 text-center text-[11px] text-slate-400"
				                  colSpan={8}
				                >
			                  Loading packages...
			                </td>
			              </tr>
			            )}
		          </tbody>
		        </table>
		      </div>
		      <ConfirmDialog
		        open={confirmDeleteId !== null}
		        title="Delete this package?"
		        description="This package will be removed from the website immediately. This action cannot be undone."
		        confirmLabel={deletingId ? "Deleting..." : "Delete package"}
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

		      {/* Package Details Modal */}
		      {viewPackage && (
		        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
		          <div className="max-h-[80vh] w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
		            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
		              <h3 className="text-sm font-semibold text-slate-900">
		                Package Details - {viewPackage.title}
		              </h3>
		              <button
		                type="button"
		                onClick={() => setViewPackage(null)}
		                className="text-slate-400 hover:text-slate-600"
		              >
		                ✕
		              </button>
		            </div>
		            <div className="max-h-[50vh] overflow-y-auto p-5">
		              <pre className="whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-xs text-slate-700 font-mono leading-relaxed">
		                {getPackageText(viewPackage)}
		              </pre>
		            </div>
		            <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-3">
		              <button
		                type="button"
		                onClick={() => setViewPackage(null)}
		                className="rounded-full px-4 py-1.5 text-[11px] font-medium text-slate-600 hover:bg-slate-100"
		              >
		                Close
		              </button>
		              <button
		                type="button"
		                onClick={handleCopyText}
		                className="rounded-full bg-blue-600 px-4 py-1.5 text-[11px] font-medium text-white hover:bg-blue-500"
		              >
		                Copy to Clipboard
		              </button>
		            </div>
		          </div>
		        </div>
		      )}
		    </div>
		  );
		}

