import Link from "next/link";

import type { PackageDocument } from "@/server/models/package.model";
import { listPublishedPackages } from "@/server/services/package.service";
import { Container } from "@/components/layout/container";

export type LeanPackage = Pick<
	PackageDocument,
	| "_id"
	| "slug"
	| "title"
	| "subtitle"
	| "destinationName"
	| "durationDays"
	| "startingPricePerPerson"
	| "currencyCode"
	| "shortDescription"
	| "isFeatured"
>;

export interface FeaturedPackagesSectionProps {
	packages: LeanPackage[];
}

export const FALLBACK_PACKAGES: LeanPackage[] = [
	{
		_id: "fallback-manali-weekend" as unknown as LeanPackage["_id"],
		slug: "weekend-manali-from-delhi",
				title: "Weekend in Manali from Delhi",
				subtitle: "Cafe-hopping, riverside walks & Solang day trip",
		destinationName: "Manali & Solang Valley",
		durationDays: 3,
		startingPricePerPerson: 8999,
		currencyCode: "INR",
		shortDescription:
			"Overnight Volvo from Delhi, two nights in a cosy stay near Old Manali and a flexible day for Solang / Atal Tunnel.",
		isFeatured: true,
	},
	{
		_id: "fallback-shimla-kasauli" as unknown as LeanPackage["_id"],
		slug: "shimla-kasauli-short-break",
				title: "Shimla & Kasauli slow weekend",
				subtitle: "Toy train views, sunset points and cafe corners",
		destinationName: "Shimla & Kasauli",
		durationDays: 3,
		startingPricePerPerson: 7799,
		currencyCode: "INR",
		shortDescription:
			"Perfect for couples and small groups driving up from Chandigarh looking for a relaxed, no-rush break.",
		isFeatured: true,
	},
	{
		_id: "fallback-workation" as unknown as LeanPackage["_id"],
		slug: "jibhi-tirthan-workation",
		title: "10-day Jibhi & Tirthan workation",
		subtitle: "Wi-Fi tested stays with quiet work corners",
		destinationName: "Jibhi & Tirthan Valley",
		durationDays: 10,
		startingPricePerPerson: 18999,
		currencyCode: "INR",
		shortDescription:
			"Stay in two scenic homestays with strong Wi-Fi, riverside walks after calls and optional weekend hikes.",
		isFeatured: true,
	},
];

export function FeaturedPackagesSection({
	packages,
}: FeaturedPackagesSectionProps) {
	const hasPackages = packages.length > 0;
	const displayPackages = hasPackages ? packages : FALLBACK_PACKAGES;

			return (
				<section
					id="packages"
					className="py-10"
				>
				<Container className="space-y-4">
				<div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
					<div>
							<h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
							Popular Himachal itineraries
						</h2>
							<p className="mt-1 text-xs text-slate-600 sm:text-sm">
							Handpicked trips that work well for first-time and repeat visitors.
						</p>
						{!hasPackages && (
								<p className="mt-1 text-[11px] text-slate-500 sm:text-xs">
								Live packages will appear here once you add them from the admin.
								These are sample itineraries to show how your cards will look.
							</p>
						)}
					</div>
							<Link
									href="/packages"
									className="text-xs font-semibold text-blue-800 underline-offset-4 hover:text-blue-900 hover:underline"
							>
						View all packages
					</Link>
				</div>

						<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
							{displayPackages.map((pkg) => (
								<Link
									key={pkg._id.toString()}
									href={`/packages/${pkg.slug}`}
									className="group flex flex-col justify-between rounded-3xl bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.45)] ring-1 ring-slate-900/5 transition-transform transition-shadow duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(15,23,42,0.65)] hover:ring-blue-400/60"
								>
									<div className="space-y-3">
										<div className="flex items-center justify-between gap-2 text-[11px] text-slate-500">
											<span className="truncate">{pkg.destinationName}</span>
											<span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-800">
												{pkg.durationDays} days
											</span>
										</div>
										<h3 className="line-clamp-2 text-sm font-semibold text-slate-900">
											{pkg.title}
										</h3>
										{pkg.subtitle && (
											<p className="line-clamp-2 text-[11px] text-slate-600">
												{pkg.subtitle}
											</p>
										)}
										<p className="line-clamp-3 pt-1 text-[11px] text-slate-600">
											{pkg.shortDescription}
										</p>
									</div>
							<div className="mt-4 flex items-end justify-between gap-2 text-xs">
								<div>
									<p className="text-[11px] font-semibold text-slate-600">
										Want to know the price?
									</p>
									<p className="mt-1 text-[11px] text-slate-500">
										Tap to share your dates and group size for a custom quote.
									</p>
								</div>
								<span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100">
									View details
									<span aria-hidden>&rarr;</span>
								</span>
							</div>
								</Link>
							))}
					</div>
			</Container>
		</section>
	);
}

export async function FeaturedPackagesSectionWithData() {
	const docs = await listPublishedPackages();

	const packages: LeanPackage[] = docs.slice(0, 6).map((pkg) => ({
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

	return <FeaturedPackagesSection packages={packages} />;
}

export function FeaturedPackagesSectionSkeleton() {
	return (
		<section className="py-10">
			<Container className="space-y-4">
				<div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
					<div className="space-y-2">
						<div className="h-4 w-40 rounded-full bg-slate-200" />
						<div className="h-3 w-64 max-w-full rounded-full bg-slate-100" />
					</div>
					<div className="h-3 w-24 rounded-full bg-slate-100" />
				</div>
				<div className="grid gap-5 animate-pulse sm:grid-cols-2 lg:grid-cols-3">
					{Array.from({ length: 3 }).map((_, index) => (
						<div
							key={index}
							className="flex flex-col justify-between rounded-3xl bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.35)] ring-1 ring-slate-900/5"
						>
							<div className="space-y-3">
								<div className="flex items-center justify-between gap-2">
									<div className="h-3 w-24 rounded-full bg-slate-100" />
									<div className="h-5 w-16 rounded-full bg-blue-100" />
								</div>
								<div className="h-4 w-3/4 rounded-full bg-slate-200" />
								<div className="h-3 w-full rounded-full bg-slate-100" />
								<div className="h-3 w-5/6 rounded-full bg-slate-100" />
							</div>
							<div className="mt-4 h-5 w-2/3 rounded-full bg-slate-100" />
						</div>
					))}
				</div>
			</Container>
		</section>
	);
}

