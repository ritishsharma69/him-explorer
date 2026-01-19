import { Suspense } from "react";

// Always render the homepage dynamically so new content from the admin
// (packages, collections, partner hotels) appears immediately without
// needing a rebuild.
export const dynamic = "force-dynamic";

import { HeroSection } from "@/components/home/hero-section";
import {
	FeaturedPackagesSectionWithData,
	FeaturedPackagesSectionSkeleton,
	} from "@/components/home/featured-packages-section";
import {
	CollectionsSection,
	CollectionsSectionSkeleton,
} from "@/components/home/collections-section";
import { AdventureSportsSection } from "@/components/home/adventure-sports-section";
// Popular Destinations temporarily disabled
// import {
// 	PopularDestinationsSection,
// 	PopularDestinationsSectionSkeleton,
// } from "@/components/home/popular-destinations-section";
import {
	PartnerHotelsSection,
	PartnerHotelsSectionSkeleton,
} from "@/components/home/partner-hotels-section";
import { ContactSection } from "@/components/home/contact-section";

	export default function HomePage() {
	return (
		<div className="relative bg-slate-50/40">
			<div className="relative space-y-10">
				<HeroSection />
				{/* Popular Destinations temporarily disabled
				<Suspense fallback={<PopularDestinationsSectionSkeleton />}>
					<PopularDestinationsSection />
				</Suspense>
				*/}
				<Suspense fallback={<CollectionsSectionSkeleton />}>
					<CollectionsSection />
				</Suspense>
				<AdventureSportsSection />
				<Suspense fallback={<PartnerHotelsSectionSkeleton />}>
					<PartnerHotelsSection />
				</Suspense>
				<div className="bg-gradient-to-b from-blue-50/60 via-blue-50/30 to-white py-5">
					<div className="space-y-10">
						<Suspense fallback={<FeaturedPackagesSectionSkeleton />}>
							<FeaturedPackagesSectionWithData />
						</Suspense>
						<ContactSection />
					</div>
				</div>
			</div>
		</div>
	);
}
