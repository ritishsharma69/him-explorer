"use client";

	import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
	import gsap from "gsap";

const HEADLINE_TEXT =
	"Slow, scenic trips in the mountains\nwith zero planning stress.";

export function HeroSection() {
			const [charIndex, setCharIndex] = useState(0);
			const leftColRef = useRef<HTMLDivElement | null>(null);
			const cardRef = useRef<HTMLDivElement | null>(null);

		// Typing animation for the main headline
		useEffect(() => {
		if (charIndex >= HEADLINE_TEXT.length) return;

		const id = setTimeout(() => {
			setCharIndex((prev) => prev + 1);
		}, 60);

			return () => clearTimeout(id);
		}, [charIndex]);

				// GSAP-powered entrance animation for hero content
				useEffect(() => {
					if (!leftColRef.current || !cardRef.current) return;

					// Important: avoid ever leaving the hero content fully invisible.
					// Only animate blur + position so that even if GSAP doesn't run again
					// when navigating away and back, the content stays visible.
					const tl = gsap.timeline({
						defaults: { duration: 0.9, ease: "power3.out" },
					});

					tl.fromTo(
						leftColRef.current,
						{
							y: 40,
							filter: "blur(8px)",
						},
						{
							y: 0,
							filter: "blur(0px)",
						},
					).fromTo(
						cardRef.current,
						{
							y: 40,
							filter: "blur(12px)",
						},
						{
							y: 0,
							filter: "blur(0px)",
						},
						"-=0.5",
					);

					return () => {
						tl.kill();
					};
				}, []);

	const typed = HEADLINE_TEXT.slice(0, charIndex);
	const lines = typed.split("\n");

					return (
						<section className="relative flex min-h-[91vh] items-center pb-[100px] pt-10 sm:pt-16">
						<div className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
								<video
									className="h-full w-full object-cover"
									autoPlay
									muted
									loop
									playsInline
									preload="metadata"
									poster="/harcode-image.png"
									aria-hidden="true"
								>
									<source src="/home1.mp4" type="video/mp4" />
								</video>
								<div className="absolute inset-0" />
						</div>
					<Container className="relative z-10 grid gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-center">
					<div
						ref={leftColRef}
						className="space-y-6 md:space-y-7"
					>
						<p className="inline-flex items-center rounded-full bg-blue-50/95 px-4 py-1.5 text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.25em] text-blue-900 shadow-sm shadow-blue-300/80 ring-1 ring-blue-300">
						Indian getaways, handcrafted
					</p>
					<h1 className="text-balance text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
							<span className="block text-slate-900 drop-shadow-md">
							<span className="hero-typing">
								{lines.map((line, index) => (
									<span key={index} className="block">
										{line}
									</span>
								))}
						</span>
					</span>
						</h1>
						<p className="max-w-xl text-base leading-relaxed text-slate-700 sm:text-lg">
						Weekend escapes from Chandigarh, week-long workations, or a relaxed
						family vacation. Share your dates and vibe, and we build the rest:
						stays, transfers and honest suggestions from a local planner.
					</p>
						<div className="flex flex-wrap items-center gap-3">
							<Link href="/packages">
								<Button
									size="lg"
									className="rounded-full bg-blue-600 px-7 py-2.5 text-sm sm:text-base font-semibold text-white shadow-[0_18px_45px_rgba(37,99,235,0.65)] hover:bg-blue-500 hover:shadow-[0_22px_60px_rgba(37,99,235,0.85)]"
								>
									Browse travel packages
								</Button>
							</Link>
							<a
								href="#packages"
								className="text-sm font-semibold text-blue-900 underline-offset-4 hover:text-blue-950 hover:underline"
							>
								See popular trips
							</a>
						</div>
					</div>
	
							<div
								ref={cardRef}
								className="relative"
							>
							<div className="pointer-events-none absolute inset-0 -z-10 rounded-[32px] bg-white/12 backdrop-blur-2xl" />
							<div className="relative overflow-hidden rounded-3xl bg-white/40 p-5 text-[13px] text-slate-700 shadow-[0_20px_60px_rgba(15,23,42,0.35)] ring-1 ring-white/60 backdrop-blur-2xl sm:p-6 sm:text-sm">
								<div className="mb-3 flex items-center justify-between gap-2">
										<div className="space-y-1">
										<p className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.22em] text-blue-800">
										Live like a local
									</p>
										<p className="text-[11px] sm:text-[12px] text-slate-500">
									Trips planned 1:1 over WhatsApp with local travel experts.
								</p>
										</div>
								</div>

							<div className="space-y-3">
									<div className="rounded-2xl bg-slate-50/85 p-3 ring-1 ring-slate-100">
									<p className="text-[12px] sm:text-[13px] text-slate-600">
									Recent trip: family escape across Tirthan, Jibhi &amp; Shoja with
									stays in two cosy homestays and one riverside resort.
								</p>
										</div>
										<div className="flex flex-col gap-2 rounded-2xl bg-slate-50/85 p-4 text-slate-900 ring-1 ring-slate-100">
											<p className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.22em] text-slate-600">
	  							Sample question
	  						</p>
										<p className="text-base sm:text-lg font-semibold text-slate-900">
	  							Cheapest trip from Delhi to Manali this May for 4 friends
	  						</p>
										<p className="text-[11px] sm:text-[12px] text-slate-700">
	  							We reply with route options, estimated budget and 2-3 stay
	  							recommendations within 5-10 mins.
	  						</p>
								</div>
									<div className="flex flex-wrap gap-2 text-[11px] sm:text-xs font-medium text-slate-600">
										<span className="rounded-full bg-slate-100 px-2.5 py-1 shadow-sm">
									Weekend getaways
								</span>
										<span className="rounded-full bg-slate-100 px-2.5 py-1 shadow-sm">
									Workations
								</span>
										<span className="rounded-full bg-slate-100 px-2.5 py-1 shadow-sm">
									Snow trips
								</span>
										<span className="rounded-full bg-slate-100 px-2.5 py-1 shadow-sm">
									Offbeat valleys
								</span>
							</div>
						</div>
					</div>
				</div>
			</Container>
		</section>
	);
}

