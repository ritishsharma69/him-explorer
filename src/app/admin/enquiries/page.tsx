"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DayPicker } from "react-day-picker";

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
	preferredStartDate?: string;
	message: string;
	howDidYouHear?: string;
	status: "new" | "contacted" | "in_progress" | "closed";
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
			return "bg-blue-100 text-blue-900";
		default:
			return "bg-slate-100 text-slate-700";
	}
}

function getStatusLabel(status: string) {
	switch (status) {
		case "new":
			return "New";
		case "contacted":
			return "Read";
		case "in_progress":
			return "In progress";
		case "closed":
			return "Closed";
		default:
			return status.replace("_", " ");
	}
}

function getDateKey(value?: string) {
	if (!value) return null;
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return null;
	return date.toISOString().slice(0, 10);
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

export default function AdminEnquiriesPage() {
	const router = useRouter();
	const [enquiries, setEnquiries] = useState<AdminEnquiry[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
	const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
	const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
	const [startDateFilter, setStartDateFilter] = useState("");
	const [endDateFilter, setEndDateFilter] = useState("");
	const [customizeEnquiry, setCustomizeEnquiry] = useState<AdminEnquiry | null>(null);

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
			setSelectedIds(new Set());
		} catch (err) {
			console.error(err);
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
			setSelectedIds((prev) => {
				const next = new Set(prev);
				next.delete(id);
				return next;
			});
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

	function handleToggleSelect(id: string) {
		setSelectedIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) {
				next.delete(id);
			} else {
				next.add(id);
			}
			return next;
		});
	}

	function handleToggleSelectAll(current: AdminEnquiry[]) {
		setSelectedIds((prev) => {
			if (current.length === 0) return new Set(prev);
			const allIds = current.map((item) => item._id);
			const allSelected = allIds.every((id) => prev.has(id));
			if (allSelected) {
				const next = new Set(prev);
				allIds.forEach((id) => next.delete(id));
				return next;
			}
			return new Set(allIds);
		});
	}

	async function handleStatusChange(
		id: string,
		nextStatus: AdminEnquiry["status"],
	) {
		setUpdatingStatusId(id);
		setError(null);

		try {
			const res = await fetch(`/api/admin/enquiries/${id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ status: nextStatus }),
			});

			if (!res.ok) {
				setError("Failed to update enquiry status");
				return;
			}

			const data = (await res.json()) as { enquiry?: AdminEnquiry };
			const updated = data.enquiry;

			setEnquiries((prev) =>
				prev.map((item) =>
					item._id === id
						? updated ?? { ...item, status: nextStatus }
						: item,
				),
			);
		} catch (err) {
			console.error(err);
			setError("Failed to update enquiry status");
		} finally {
			setUpdatingStatusId(null);
		}
	}

	function handleExportSelected() {
		if (selectedIds.size === 0) return;

		const selected = enquiries.filter((item) => selectedIds.has(item._id));
		if (selected.length === 0) return;

		const headers = [
			"Full name",
			"Email",
			"Phone",
			"Adults",
			"Children",
			"Preferred start date",
			"Budget per person min",
			"Status",
			"Created at",
			"Source",
			"Message",
		];

		const rows = selected.map((item) => [
			item.fullName,
			item.email,
			`${item.phoneCountryCode} ${item.phoneNumber}`,
			item.numberOfAdults,
			item.numberOfChildren,
			getDateKey(item.preferredStartDate) ?? "",
			item.budgetPerPersonMin ?? "",
			getStatusLabel(item.status),
			getDateKey(item.createdAt) ?? "",
			item.howDidYouHear ?? "",
			item.message,
		]);

		const csvLines = [headers, ...rows].map((row) =>
			row
				.map((cell) => {
					const value = String(cell ?? "");
					const escaped = value.replace(/"/g, '""');
					return `"${escaped}"`;
				})
				.join(","),
		);

		const csvContent = csvLines.join("\r\n");
		const blob = new Blob([csvContent], {
			type: "text/csv;charset=utf-8;",
		});
		const url = URL.createObjectURL(blob);

		const link = document.createElement("a");
		link.href = url;
		link.setAttribute(
			"download",
			`himexplore-enquiries-${new Date()
				.toISOString()
				.slice(0, 10)}.csv`,
		);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}

	function handleCustomize(enquiry: AdminEnquiry) {
		setCustomizeEnquiry(enquiry);
	}

	function getEnquiryText(enquiry: AdminEnquiry) {
		const tripDate = enquiry.preferredStartDate
			? formatDate(enquiry.preferredStartDate)
			: "Not specified";
		const budget = enquiry.budgetPerPersonMin
			? `₹${enquiry.budgetPerPersonMin.toLocaleString("en-IN")} per person`
			: "Not specified";
		const totalPeople = enquiry.numberOfAdults + enquiry.numberOfChildren;

		return `GUEST DETAILS
Name: ${enquiry.fullName}
Email: ${enquiry.email}
Phone: ${enquiry.phoneCountryCode} ${enquiry.phoneNumber}

TRIP REQUIREMENTS
Number of Adults: ${enquiry.numberOfAdults}
Number of Children: ${enquiry.numberOfChildren}
Total Travelers: ${totalPeople}
Preferred Start Date: ${tripDate}
Budget: ${budget}

GUEST MESSAGE
${enquiry.message || "No message provided"}

Source: ${enquiry.howDidYouHear || "Not specified"}
Enquiry Date: ${formatDate(enquiry.createdAt)}`;
	}

	function handleCopyText() {
		if (!customizeEnquiry) return;
		const text = getEnquiryText(customizeEnquiry);
		navigator.clipboard.writeText(text).then(() => {
			alert("Copied to clipboard!");
		}).catch(() => {
			alert("Failed to copy. Please select and copy manually.");
		});
	}

	const hasDateFilter = Boolean(startDateFilter || endDateFilter);

	const filteredEnquiries = enquiries.filter((enquiry) => {
		if (!hasDateFilter) return true;

		const dateKey =
			getDateKey(enquiry.preferredStartDate) ??
			getDateKey(enquiry.createdAt);

		if (!dateKey) return false;

		if (startDateFilter && dateKey < startDateFilter) return false;
		if (endDateFilter && dateKey > endDateFilter) return false;

		return true;
	});

	const allVisibleSelected =
		filteredEnquiries.length > 0 &&
		filteredEnquiries.every((item) => selectedIds.has(item._id));

	const hasAnySelection = selectedIds.size > 0;

	function dateKeyToDate(value: string | "") {
		if (!value) return null;
		const [year, month, day] = value.split("-").map((part) => Number(part));
		if (!year || !month || !day) return null;
		const date = new Date(year, month - 1, day);
		if (Number.isNaN(date.getTime())) return null;
		return date;
	}

	const startDateObj = dateKeyToDate(startDateFilter);
	const endDateObj = dateKeyToDate(endDateFilter);

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap items-center justify-between gap-2">
				<h2 className="text-sm font-semibold text-slate-50 sm:text-base">
					Enquiries
				</h2>
				<div className="flex flex-wrap items-center gap-2">
					<button
						type="button"
						onClick={handleExportSelected}
						disabled={!hasAnySelection}
						className="rounded-full border border-blue-500/70 bg-blue-600/90 px-3 py-1 text-[11px] font-semibold text-white shadow-sm hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
					>
						Export selected to Excel
					</button>
					<button
						type="button"
						onClick={() => void loadEnquiries()}
						className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-700 shadow-sm hover:bg-slate-200"
					>
						Refresh
					</button>
				</div>
			</div>
			{error && (
				<p className="text-[11px] text-rose-400 sm:text-xs">{error}</p>
			)}
				<div className="rounded-2xl border border-white/10 bg-slate-950/50 px-3 py-3 text-[11px] text-slate-200 sm:px-4 sm:py-3 sm:text-xs">
					<div className="flex flex-wrap items-start gap-4">
						<div className="space-y-1">
							<p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
								Trip date range
							</p>
							<div className="flex flex-wrap items-center gap-2">
								<div className="flex items-center gap-2">
									<div className="inline-flex items-center rounded-lg border border-slate-700 bg-slate-900/80 px-2 py-1 text-[11px] text-slate-100 shadow-sm">
										<span className="mr-1 text-[10px] text-slate-400">From</span>
										<span className="min-w-[90px] truncate">
											{startDateObj ? formatDate(startDateFilter) : "Any"}
										</span>
									</div>
									<span className="text-[10px] text-slate-400">to</span>
									<div className="inline-flex items-center rounded-lg border border-slate-700 bg-slate-900/80 px-2 py-1 text-[11px] text-slate-100 shadow-sm">
										<span className="mr-1 text-[10px] text-slate-400">To</span>
										<span className="min-w-[90px] truncate">
											{endDateObj ? formatDate(endDateFilter) : "Any"}
										</span>
									</div>
								</div>
							</div>
							<div className="mt-3 rounded-xl border border-slate-800/80 bg-slate-950/80 p-2 shadow-inner sm:p-3">
								<DayPicker
									mode="range"
									defaultMonth={endDateObj ?? startDateObj ?? new Date()}
									selected={{ from: startDateObj ?? undefined, to: endDateObj ?? undefined }}
									onSelect={(range) => {
										if (!range) {
											setStartDateFilter("");
											setEndDateFilter("");
											return;
										}
										const from = range.from ?? null;
										const to = range.to ?? range.from ?? null;
										function toKey(date: Date | null) {
											if (!date) return "";
											const year = date.getFullYear();
											const month = String(date.getMonth() + 1).padStart(2, "0");
											const day = String(date.getDate()).padStart(2, "0");
											return `${year}-${month}-${day}`;
										}
										setStartDateFilter(toKey(from));
										setEndDateFilter(toKey(to));
									}}
									className="rdp-root text-[11px] sm:text-xs"
									weekStartsOn={1}
								/>
							</div>
						</div>
						<button
							type="button"
							onClick={() => {
								setStartDateFilter("");
								setEndDateFilter("");
							}}
							className="self-start rounded-full border border-slate-600 bg-slate-900/70 px-3 py-1 text-[10px] font-medium text-slate-100 hover:bg-slate-800"
						>
							Clear
						</button>
				</div>

			</div>
			<div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/40 shadow-inner backdrop-blur-sm">
				<table className="min-w-full divide-y divide-slate-800/80 text-[11px] text-slate-100 sm:text-xs">
					<thead className="bg-slate-900/60">
						<tr>
							<th className="px-3 py-2">
								<input
									type="checkbox"
									className="h-3.5 w-3.5 rounded border-slate-500 bg-slate-900 text-blue-600 focus:ring-0"
									checked={allVisibleSelected}
									onChange={() => handleToggleSelectAll(filteredEnquiries)}
									aria-label="Select all visible enquiries"
								/>
							</th>
							<th className="px-3 py-2 text-left font-medium text-slate-400">
								Guest
							</th>
							<th className="px-3 py-2 text-left font-medium text-slate-400">
								Trip details
							</th>
							<th className="px-3 py-2 text-left font-medium text-slate-400">
								Contact
							</th>
							<th className="px-3 py-2 text-left font-medium text-slate-400">
								Message
							</th>
							<th className="px-3 py-2 text-left font-medium text-slate-400">
								Source
							</th>
							<th className="px-3 py-2 text-left font-medium text-slate-400">
								Status
							</th>
							<th className="px-3 py-2 text-left font-medium text-slate-400">
								Received
							</th>
							<th className="px-3 py-2 text-right font-medium text-slate-400">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-800/70">
						{filteredEnquiries.length === 0 && !loading && (
							<tr>
								<td
									className="px-3 py-8 text-center text-[11px] text-slate-400"
									colSpan={9}
								>
									{enquiries.length === 0
											? "No enquiries yet."
											: "No enquiries in this date range."}
								</td>
							</tr>
						)}
						{filteredEnquiries.map((enquiry) => (
							<tr key={enquiry._id} className="hover:bg-slate-900/40">
								<td className="px-3 py-2 align-top">
									<input
										type="checkbox"
										className="h-3.5 w-3.5 rounded border-slate-500 bg-slate-900 text-blue-600 focus:ring-0"
										checked={selectedIds.has(enquiry._id)}
										onChange={() => handleToggleSelect(enquiry._id)}
										aria-label={`Select enquiry from ${enquiry.fullName}`}
									/>
								</td>
								<td className="px-3 py-2 align-top">
									<div className="space-y-1">
										<p className="font-semibold text-slate-50">
											{enquiry.fullName}
										</p>
										<p className="text-[10px] text-slate-400">
											{enquiry.numberOfAdults} adult
											{enquiry.numberOfAdults > 1 ? "s" : ""}
											{enquiry.numberOfChildren > 0 && (
												<>
													{" "}
													&middot; {enquiry.numberOfChildren} child
													{enquiry.numberOfChildren > 1 ? "ren" : ""}
												</>
											)}
										</p>
									</div>
								</td>
								<td className="px-3 py-2 align-top">
									<div className="space-y-1">
										<p className="text-[10px] text-slate-300">
											Preferred start date:
											{" "}
											<span className="font-medium text-slate-100">
												{enquiry.preferredStartDate
														? formatDate(enquiry.preferredStartDate)
														: "Not specified"}
											</span>
										</p>
										<p className="text-[10px] text-slate-300">
											Budget per person:
											{" "}
											{enquiry.budgetPerPersonMin ? (
												<span className="font-medium text-slate-100">
													₹{enquiry.budgetPerPersonMin.toLocaleString("en-IN")}
												</span>
											) : (
												<span className="text-slate-500">Not specified</span>
											)}
										</p>
									</div>
								</td>
								<td className="px-3 py-2 align-top">
									<div className="space-y-1">
										<p className="text-[10px] text-slate-200">
											{enquiry.email}
										</p>
										<p className="text-[10px] text-slate-200">
											{enquiry.phoneCountryCode} {enquiry.phoneNumber}
										</p>
									</div>
								</td>
								<td className="px-3 py-2 align-top">
									<p className="max-w-xs whitespace-pre-line text-[10px] leading-snug text-slate-200 sm:max-w-sm">
										{enquiry.message}
									</p>
								</td>
								<td className="px-3 py-2 align-top">
									<p className="text-[10px] text-slate-300">
										{enquiry.howDidYouHear || "-"}
									</p>
								</td>
								<td className="px-3 py-2 align-top">
									<div className="space-y-1">
										<span
											className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${getStatusClasses(enquiry.status)}`}
										>
											{getStatusLabel(enquiry.status)}
										</span>
										<select
											value={enquiry.status}
											onChange={(e) =>
												void handleStatusChange(
													enquiry._id,
													e.target.value as AdminEnquiry["status"],
												)}
											disabled={updatingStatusId === enquiry._id}
											className="mt-1 w-full rounded-full border border-white/10 bg-slate-900/60 px-2 py-0.5 text-[10px] text-slate-100 outline-none focus:border-blue-500"
										>
											<option value="new">New</option>
											<option value="contacted">Read / contacted</option>
											<option value="in_progress">In progress</option>
											<option value="closed">Closed</option>
										</select>
									</div>
								</td>
								<td className="px-3 py-2 align-top">
									<p className="text-[10px] text-slate-300">
										{formatDate(enquiry.createdAt)}
									</p>
								</td>
								<td className="px-3 py-2 align-top text-right">
									<div className="flex flex-col items-end gap-1.5">
										<button
											type="button"
											onClick={() => setConfirmDeleteId(enquiry._id)}
											disabled={deletingId === enquiry._id}
											className="rounded-full bg-rose-500/90 px-2.5 py-1 text-[10px] font-semibold text-rose-50 shadow-sm hover:bg-rose-500 disabled:opacity-60"
										>
											{deletingId === enquiry._id ? "Deleting..." : "Delete"}
										</button>
										<button
											type="button"
											onClick={() => handleCustomize(enquiry)}
											className="rounded-full bg-blue-600/90 px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm hover:bg-blue-500"
										>
											Customize
										</button>
									</div>
								</td>
							</tr>
						))}
						{loading && (
							<tr>
								<td
									className="px-3 py-8 text-center text-[11px] text-slate-400"
									colSpan={9}
								>
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
				description="This enquiry will be deleted from the admin table. If deleted by mistake, it cannot be recovered."
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

			{/* Customize Text Dialog */}
			{customizeEnquiry && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
					<div className="max-h-[80vh] w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
						<div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
							<h3 className="text-sm font-semibold text-slate-900">
								Enquiry Details - {customizeEnquiry.fullName}
							</h3>
							<button
								type="button"
								onClick={() => setCustomizeEnquiry(null)}
								className="text-slate-400 hover:text-slate-600"
							>
								✕
							</button>
						</div>
						<div className="max-h-[50vh] overflow-y-auto p-5">
							<pre className="whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-xs text-slate-700 font-mono leading-relaxed">
								{getEnquiryText(customizeEnquiry)}
							</pre>
						</div>
						<div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-3">
							<button
								type="button"
								onClick={() => setCustomizeEnquiry(null)}
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
