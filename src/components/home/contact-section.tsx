import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";

	export function ContactSection() {
		return (
			<section id="contact">
				<Container>
					<div className="rounded-3xl bg-white/80 p-5 text-xs text-slate-600 shadow-[0_18px_50px_rgba(15,23,42,0.16)] ring-1 ring-slate-100/80 backdrop-blur-xl sm:p-6 sm:text-sm">
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
								<Button size="sm">Explore packages</Button>
							</Link>
						</div>
					</div>
				</Container>
			</section>
		);
	}

