import Link from "next/link";

// Render the packages listing dynamically so newly published packages
// show up immediately on the public website without a redeploy.
export const dynamic = "force-dynamic";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import {
	type LeanPackage,
	FALLBACK_PACKAGES,
} from "@/components/home/featured-packages-section";
import { listPublishedPackages } from "@/server/services/package.service";

async function getPackages(): Promise<LeanPackage[]> {
  const docs = await listPublishedPackages();

  return docs.map((pkg) => ({
    _id: pkg._id,
    slug: pkg.slug,
    title: pkg.title,
    subtitle: pkg.subtitle,
    destinationName: pkg.destinationName,
    durationDays: pkg.durationDays,
    startingPricePerPerson: pkg.startingPricePerPerson,
    currencyCode: pkg.currencyCode,
    shortDescription: pkg.shortDescription,
    isFeatured: pkg.isFeatured,
  }));
}

export default async function PackagesPage() {
  const packages = await getPackages();
		const hasPackages = packages.length > 0;
		const displayPackages = hasPackages ? packages : FALLBACK_PACKAGES;

		  return (
		    <main className="space-y-8 py-8">
					<section className="border-y border-sky-100 bg-gradient-to-r from-sky-50 via-sky-100/60 to-emerald-50 py-6">
						<Container className="space-y-4">
							<p className="inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700 shadow-sm shadow-sky-200">
								Himachal tour packages
							</p>
							<h1 className="text-balance text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
								Pick a starting point, then customise it with your planner.
							</h1>
							<p className="max-w-2xl text-xs text-slate-600 sm:text-sm">
								These itineraries are meant to be a base. Once you find something that
									feels close to your vibe, use the enquiry form on the package page to
									tweak stays, pace and budget with help from a local expert.
							</p>
							<div className="flex flex-wrap gap-3 pt-1">
								<Link href="/contact#trip-enquiry-form">
									<Button size="sm">Customise your package</Button>
								</Link>
								<Link
									href="/contact#trip-enquiry-form"
									className="text-[11px] font-medium text-sky-800 underline-offset-4 hover:text-sky-900 hover:underline sm:text-xs"
								>
									Or talk to a local planner
								</Link>
							</div>
						</Container>
					</section>

				<section className="pb-12">
					<Container className="space-y-4">
						{!hasPackages && (
							<p className="text-xs text-slate-500 sm:text-sm">
								No packages are live yet. These are sample itineraries to show you
								the style of trips we plan in Himachal.
							</p>
						)}
						<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
							{displayPackages.map((pkg) => (
								<Link
									key={pkg._id.toString()}
									href={`/packages/${pkg.slug}`}
									className="group flex flex-col justify-between rounded-3xl bg-white/95 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.18)] ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-[0_22px_80px_rgba(15,23,42,0.28)] hover:ring-sky-200"
								>
									<div className="space-y-2">
										<div className="flex items-center justify-between gap-2 text-[11px] text-slate-500">
											<span className="truncate">{pkg.destinationName}</span>
											<span className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-sky-700">
												{pkg.durationDays} days
											</span>
										</div>
										<h2 className="line-clamp-2 text-sm font-semibold text-slate-900">
											{pkg.title}
										</h2>
										{pkg.subtitle && (
											<p className="line-clamp-2 text-[11px] text-slate-500">
												{pkg.subtitle}
											</p>
										)}
										<p className="line-clamp-3 pt-1 text-[11px] text-slate-500">
											{pkg.shortDescription}
										</p>
									</div>
									<div className="mt-4 flex items-end justify-between gap-2 text-xs">
										<div>
											<p className="text-[11px] text-slate-500">Starting from</p>
											<p className="text-sm font-semibold text-sky-700">
												{pkg.currencyCode}{" "}
												{pkg.startingPricePerPerson.toLocaleString("en-IN")}
												<span className="ml-1 text-[11px] font-normal text-slate-500">
													per person
												</span>
											</p>
										</div>
										<span className="text-[11px] font-medium text-sky-600 opacity-0 transition group-hover:opacity-100">
											View details
										</span>
									</div>
								</Link>
							))}
						</div>
					</Container>
				</section>
    </main>
  );
}
