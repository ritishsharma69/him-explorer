import Image from "next/image";
import Link from "next/link";

import type { PackageDocument } from "@/server/models/package.model";
import { listPublishedPackages } from "@/server/services/package.service";
import { Container } from "@/components/layout/container";

// Indian avatar face images for variety (40+ faces)
const AVATAR_FACES = [
	"https://images.unsplash.com/photo-1618835962148-cf177563c6c0?w=100&h=100&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=100&h=100&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1624395149141-4e8a53bc939c?w=100&h=100&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1588731234159-8b9963143fca?w=100&h=100&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=100&h=100&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1614644147798-f8c0fc9da7f6?w=100&h=100&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1622861473072-a7b7c783c4c5?w=100&h=100&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?w=100&h=100&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1628157588553-5eeea00af15c?w=100&h=100&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1614204424926-196a80bf0be8?w=100&h=100&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1580518324671-c2f0833a3af3?w=100&h=100&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1617722929390-01671af98f32?w=100&h=100&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?w=100&h=100&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1601455763557-db1bea8a9a5a?w=100&h=100&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=100&h=100&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&h=100&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=100&h=100&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop&crop=face",
];

// Generate consistent random values based on package id/slug
function getPackageStats(idOrSlug: string, index: number) {
	// Simple hash from string to get consistent "random" values
	let hash = 0;
	for (let i = 0; i < idOrSlug.length; i++) {
		hash = ((hash << 5) - hash) + idOrSlug.charCodeAt(i);
		hash = hash & hash;
	}
	hash = Math.abs(hash);

	// Rating between 4.2 and 4.9
	const rating = (4.2 + (hash % 8) * 0.1).toFixed(1);

	// Review count between 45 and 180
	const reviewCount = 45 + (hash % 136);

	// Traveller count: 12, 18, 25, 35, 50, etc.
	const travellerOptions = [12, 18, 20, 25, 30, 35, 40, 50, 65, 80];
	const travellerCount = travellerOptions[(hash + index) % travellerOptions.length];

	// Get 3 unique avatars based on hash
	const avatarStart = (hash + index * 3) % (AVATAR_FACES.length - 2);
	const avatars = [
		AVATAR_FACES[avatarStart],
		AVATAR_FACES[(avatarStart + 1) % AVATAR_FACES.length],
		AVATAR_FACES[(avatarStart + 2) % AVATAR_FACES.length],
	];

	return { rating, reviewCount, travellerCount, avatars };
}

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
	| "galleryImageUrls"
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
		galleryImageUrls: ["https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80"],
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
		galleryImageUrls: ["https://images.unsplash.com/photo-1597074866923-dc0589150358?w=800&q=80"],
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
		galleryImageUrls: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"],
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

						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{displayPackages.map((pkg, index) => {
								const stats = getPackageStats(pkg.slug || pkg._id.toString(), index);
								return (
								<Link
									key={pkg._id.toString()}
									href={`/packages/${pkg.slug}`}
									className="group relative flex flex-col overflow-hidden rounded-[28px] bg-gradient-to-b from-slate-800 to-slate-900 shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
								>
									{/* Image Section - taller */}
									<div className="relative h-64 w-full overflow-hidden">
										<Image
											src={pkg.galleryImageUrls?.[0] || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80"}
											alt={pkg.title}
											fill
											className="object-cover transition-transform duration-700 group-hover:scale-105"
											sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
										/>
										{/* Gradient Overlay - stronger at bottom */}
										<div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

										{/* Location Badge - pill style */}
										<div className="absolute left-4 top-4">
											<span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-slate-700 shadow-lg backdrop-blur-sm">
												<svg className="h-3.5 w-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
													<path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
												</svg>
												{pkg.destinationName}
											</span>
										</div>

										{/* Duration Badge - orange/amber */}
										<div className="absolute right-4 top-4">
											<span className="inline-flex items-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white shadow-lg">
												{pkg.durationDays} Days
											</span>
										</div>

										{/* Title on Image */}
										<div className="absolute bottom-0 left-0 right-0 px-5 pb-3">
											<h3 className="text-xl font-bold leading-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] sm:text-2xl">
												{pkg.title}
											</h3>
										</div>
									</div>

									{/* Content Section - dark bg */}
									<div className="flex flex-1 flex-col px-5 pb-5 pt-2">
										{pkg.subtitle && (
											<p className="mb-1.5 line-clamp-1 text-sm font-medium text-amber-400">
												{pkg.subtitle}
											</p>
										)}
										<p className="line-clamp-2 text-[13px] leading-relaxed text-slate-400">
											{pkg.shortDescription}
										</p>

										{/* Bottom Section - avatars, rating, button */}
										<div className="mt-4 flex items-center justify-between">
											<div className="flex flex-col gap-1">
												<div className="flex items-center gap-2">
													{/* Avatar images - unique per package */}
													<div className="flex -space-x-2">
														{stats.avatars.map((avatarUrl, i) => (
															<Image key={i} src={avatarUrl} alt="" width={28} height={28} className="rounded-full ring-2 ring-slate-800 object-cover" />
														))}
													</div>
													{/* Rating - unique per package */}
													<div className="flex items-center gap-1">
														<span className="text-sm font-bold text-white">{stats.rating}</span>
														<div className="flex">
															{[...Array(5)].map((_, i) => (
																<svg key={i} className="h-3 w-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
																	<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
																</svg>
															))}
														</div>
														<span className="text-xs text-slate-500">({stats.reviewCount})</span>
													</div>
												</div>
												<p className="text-[11px] text-slate-500">
													<span className="font-semibold text-slate-400">{stats.travellerCount}+</span> travelers loved this
												</p>
											</div>

											{/* Explore Button */}
											<span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.7)]">
												Explore
												<svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
													<path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
												</svg>
											</span>
										</div>
									</div>
								</Link>
							);
							})}
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
		galleryImageUrls: pkg.galleryImageUrls,
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
				<div className="grid animate-pulse gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{Array.from({ length: 3 }).map((_, index) => (
						<div
							key={index}
							className="flex flex-col overflow-hidden rounded-[28px] bg-gradient-to-b from-slate-800 to-slate-900 shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
						>
							{/* Image skeleton */}
							<div className="h-64 w-full bg-slate-700" />
							{/* Content skeleton */}
							<div className="space-y-3 px-5 pb-5 pt-3">
								<div className="h-3 w-2/3 rounded-full bg-slate-700" />
								<div className="h-3 w-full rounded-full bg-slate-700" />
								<div className="mt-4 flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div className="flex -space-x-2">
											<div className="h-7 w-7 rounded-full bg-slate-600" />
											<div className="h-7 w-7 rounded-full bg-slate-600" />
											<div className="h-7 w-7 rounded-full bg-slate-600" />
										</div>
										<div className="h-3 w-16 rounded-full bg-slate-700" />
									</div>
									<div className="h-10 w-28 rounded-full bg-blue-600/30" />
								</div>
							</div>
						</div>
					))}
				</div>
			</Container>
		</section>
	);
}

