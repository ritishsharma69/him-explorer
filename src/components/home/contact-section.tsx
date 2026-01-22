import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";

	export function ContactSection() {
		return (
			<section id="contact">
				<Container>
					<div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-50 via-blue-50/80 to-indigo-100/60 p-5 text-xs text-slate-600 shadow-[0_18px_50px_rgba(15,23,42,0.12)] ring-1 ring-sky-100/50 sm:p-6 sm:text-sm">
						{/* Decorative gradient orbs */}
						<div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-blue-200/40 to-indigo-200/30 blur-3xl" />
						<div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-gradient-to-tr from-sky-200/50 to-cyan-100/40 blur-3xl" />

						<div className="relative">
							<h2 className="text-base font-semibold text-slate-900 sm:text-lg">
								Ready to plan your next trip?
							</h2>
							<p className="mt-2 text-[11px] text-slate-600 sm:text-xs">
								Pick any package that feels close to what you want, then use the
								form on the package page to request a callback. We&apos;ll suggest
								tweaks based on your group size, pace and month of travel.
							</p>
							<div className="mt-4 flex flex-wrap gap-3">
								<Link href="/packages">
									<Button size="sm" className="bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[0_8px_24px_rgba(59,130,246,0.4)] hover:from-blue-600 hover:to-indigo-600 hover:shadow-[0_12px_32px_rgba(59,130,246,0.5)]">Explore packages</Button>
								</Link>
							</div>
						</div>
					</div>
				</Container>
			</section>
		);
	}

