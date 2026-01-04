"use client";
import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Container } from "@/components/layout/container";

export default function AdminLayout({
	children,
}: {
	children: ReactNode;
}) {
	const pathname = usePathname();
	const router = useRouter();
	const showHeader = pathname !== "/admin/login";

	return (
		<section className="relative min-h-screen py-10 text-slate-50">
			<div className="pointer-events-none fixed inset-0 -z-10">
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src="/harcode-image.png"
					alt=""
					className="h-full w-full object-cover blur-sm"
				/>
				<div className="absolute inset-0 bg-slate-950/75" />
			</div>
			<Container className="relative z-10">
				<div className="rounded-3xl border border-white/10 bg-slate-950/70 px-4 py-5 shadow-[0_18px_60px_rgba(15,23,42,0.9)] backdrop-blur-xl sm:px-6 sm:py-6">
					{showHeader && (
						<header className="mb-6">
							<div className="flex flex-wrap items-center justify-between gap-3">
								<div>
									<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">
										Admin panel
									</p>
									<h1 className="text-base font-semibold text-slate-50 sm:text-lg">
										Internal tools
									</h1>
									<p className="mt-1 text-[11px] text-slate-300">
										Private area to manage packages, enquiries, home collections and more.
									</p>
								</div>
								<button
									type="button"
									onClick={() => router.push("/")}
									className="rounded-full border border-slate-500/70 bg-slate-900/70 px-3 py-1 text-[10px] font-medium text-slate-100 hover:bg-slate-800"
								>
									Back to site
								</button>
							</div>
						</header>
					)}
					<div className="space-y-4 text-sm text-slate-100">{children}</div>
				</div>
			</Container>
		</section>
	);
}

