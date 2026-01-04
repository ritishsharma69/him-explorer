import { Container } from "@/components/layout/container";
import { listPublicPartnerHotels } from "@/server/services/partner-hotel.service";
import type { PartnerHotelDocument } from "@/server/models/partner-hotel.model";
import { PartnerHotelsSectionClient } from "./partner-hotels-section.client";

export interface PartnerHotelCard {
	id: string;
	name: string;
	label: string;
	imageUrl?: string;
}

const FALLBACK_PARTNER_HOTELS: PartnerHotelCard[] = [
	  {
		    id: "wyndham",
		    name: "Wyndham Hotels & Resorts",
		    label: "Hill view resorts",
	  },
	  {
		    id: "sterling",
		    name: "Sterling Hotels & Resorts",
		    label: "Family-friendly stays",
	  },
	  {
		    id: "hyatt",
		    name: "Hyatt Hotels",
		    label: "City + hillside combos",
	  },
	  {
			id: "majestic",
			name: "Majestic Hotels",
			label: "Premium Himachal stays",
		},
];

function mapHotel(doc: PartnerHotelDocument): PartnerHotelCard {
	return {
		id: String(doc._id),
		name: doc.name,
		label: doc.label,
		imageUrl: doc.imageUrl,
	};
}

export async function PartnerHotelsSection() {
	const hotelsFromDb = await listPublicPartnerHotels();
	const hotels =
		hotelsFromDb.length > 0
			? hotelsFromDb.map(mapHotel)
			: FALLBACK_PARTNER_HOTELS;

	return <PartnerHotelsSectionClient hotels={hotels} />;
}

export function PartnerHotelsSectionSkeleton() {
	return (
		<section className="py-4 sm:py-6">
			<Container>
				<div className="flex flex-col gap-4 rounded-3xl bg-white/85 px-4 py-5 shadow-[0_18px_60px_rgba(15,23,42,0.12)] ring-1 ring-slate-100/90 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-6">
					<div className="max-w-xs space-y-2">
						<div className="h-3 w-40 rounded-full bg-slate-200" />
						<div className="h-4 w-56 rounded-full bg-slate-200" />
						<div className="h-3 w-full rounded-full bg-slate-100" />
					</div>
					<div className="flex gap-3 overflow-hidden px-2 pb-2 pt-2 text-xs">
						{Array.from({ length: 3 }).map((_, index) => (
							<div
								key={index}
										className="flex min-w-[190px] max-w-[210px] flex-shrink-0 flex-col overflow-hidden rounded-2xl bg-white/95 shadow-[0_10px_30px_rgba(15,23,42,0.08)] ring-1 ring-slate-100/80 animate-pulse"
							>
										<div className="h-28 bg-gradient-to-tr from-blue-50 via-slate-50 to-amber-50" />
								<div className="flex flex-1 items-center px-3 py-2">
									<div className="h-3 w-3/4 rounded-full bg-slate-200" />
								</div>
							</div>
						))}
					</div>
				</div>
			</Container>
		</section>
	);
}
