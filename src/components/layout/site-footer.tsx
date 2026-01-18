"use client";

import { usePathname } from "next/navigation";

import { Container } from "@/components/layout/container";

export function SiteFooter() {
	const pathname = usePathname();
	const isAdminRoute = pathname.startsWith("/admin");

	if (isAdminRoute) {
		return (
			<footer className="mt-8 border-t border-slate-900/40 bg-slate-950/95 text-slate-300">
				<Container className="flex flex-col items-start justify-between gap-2 py-3 text-[11px] sm:flex-row sm:items-center">
					<p>HimExplore Admin · Internal tools</p>
					<p className="text-slate-500">
						For admin access or support, contact the site owner.
					</p>
				</Container>
			</footer>
		);
	}

	return (
		<footer className="mt-10 border-t border-slate-900/40 bg-slate-950 text-slate-200">
			{/* Upper info bar */}
			<div className="border-b border-slate-800/70 bg-slate-950/95">
				<Container className="grid gap-8 py-8 text-[11px] sm:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)] sm:text-xs">
					<div className="space-y-3">
						<p className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-300">
							HimExplore · Himachal trips
						</p>
						<p className="max-w-md text-slate-200/90">
							Local-first travel studio helping small groups plan relaxed, scenic itineraries across Himachal instead of rushed checklists.
						</p>
						<div className="flex items-center gap-3 pt-1">
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								src="/himachal-tourism.png"
								alt="Himachal Tourism"
								className="h-10 w-auto object-contain"
							/>
							<span className="text-sm font-medium text-slate-300">
								Trusted by Himachal Tourism
							</span>
						</div>
					</div>

					<div className="space-y-3">
						<h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-300">
							Trip planning
						</h3>
						<ul className="space-y-1 text-slate-200/80">
							<li>Custom Himachal itineraries</li>
							<li>Homestay &amp; hotel shortlists</li>
							<li>Cab + stay packages</li>
							<li>Workation &amp; slow travel plans</li>
						</ul>
					</div>

					<div className="space-y-3">
						<h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-300">
							Popular routes
						</h3>
						<ul className="space-y-1 text-slate-200/80">
							<li>Delhi → Manali / Kasol</li>
							<li>Chandigarh → Tirthan / Jibhi</li>
							<li>Shimla → Kinnaur loops</li>
							<li>Spiti with safe buffer days</li>
						</ul>
					</div>
				</Container>
			</div>

			{/* Bottom bar */}
			<div className="bg-slate-950">
				<Container className="flex flex-col items-start justify-between gap-2 py-4 text-[11px] text-slate-400 sm:flex-row sm:items-center">
					<p>© 2025 HimExplore. All rights reserved.</p>
					<p className="flex flex-wrap items-center gap-1 sm:gap-2">
						<span>Website made by</span>
						<a
							href="https://portfolio-app-frontend.onrender.com/contact"
							target="_blank"
							rel="noreferrer"
							className="font-medium text-blue-300 hover:text-blue-200"
						>
							Ritish Sharma
						</a>
						<span className="hidden sm:inline">·</span>
						<a
							href="https://portfolio-app-frontend.onrender.com/contact"
							target="_blank"
							rel="noreferrer"
							className="underline-offset-2 hover:underline"
						>
							Contact
						</a>
					</p>
				</Container>
			</div>
		</footer>
	);
}
