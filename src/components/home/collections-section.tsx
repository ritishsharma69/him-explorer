import { Container } from "@/components/layout/container";
import { listPublicHomeCollections } from "@/server/services/home-collection.service";
import type { HomeCollectionItemDocument } from "@/server/models/home-collection.model";
import { CollectionsSectionClient } from "./collections-section.client";

export interface CollectionItem {
		id: string;
		badge: string;
		title: string;
		subtitle: string;
		imageUrl?: string;
	}

function mapDocToCollectionItem(doc: HomeCollectionItemDocument): CollectionItem {
		return {
			id: String(doc._id),
			badge: doc.badge,
			title: doc.title,
			subtitle: doc.subtitle,
			imageUrl: doc.imageUrl,
		};
	}

const PRIMARY_COLLECTIONS: CollectionItem[] = [
	{
		id: "delhi-weekend-stays",
			badge: "TOP 10",
		title: "Stays in & around Delhi for a weekend getaway",
		subtitle: "Quick drives, misty mornings and easy check-ins.",
	},
	{
		id: "mumbai-weekend-stays",
			badge: "TOP 10",
		title: "Stays in & around Mumbai for a weekend getaway",
		subtitle: "Short breaks with greenery, views and quiet corners.",
	},
	{
		id: "bangalore-weekend-stays",
			badge: "TOP 10",
		title: "Stays in & around Bengaluru for a relaxed long weekend",
		subtitle: "Coffee estates, riverside stays and easy walks.",
	},
	{
		id: "beach-destinations",
			badge: "TOP 10",
		title: "Beach destinations you can pair with Himachal trips",
		subtitle: "Plan a cool hills + warm beach combo break.",
	},
	{
		id: "weekend-getaways",
			badge: "TOP 10",
		title: "Weekend getaways for couples & small groups",
		subtitle: "Curated for short leaves and flexible budgets.",
		},
		{
			id: "family-roadtrips",
			badge: "TOP 10",
			title: "Family-friendly road trips from Chandigarh",
			subtitle: "Easy drives with kid-friendly halts and views.",
		},
		{
			id: "short-workations",
			badge: "TOP 10",
			title: "Short workations with strong Wi-Fi",
			subtitle: "Quiet homestays where you can plug in and log off.",
		},
		{
			id: "snow-weekends",
			badge: "TOP 10",
			title: "Snow weekends within a day\'s drive",
			subtitle: "Trips where you\'re likely to see snow without long treks.",
		},
		{
			id: "first-time-himachal",
			badge: "TOP 10",
			title: "First-time Himachal itineraries",
			subtitle: "Classic Manali, Shimla & Dharamshala combinations.",
		},
		{
			id: "friends-group-trips",
			badge: "TOP 10",
			title: "Group trips with friends on a budget",
			subtitle: "Hostels, homestays and cab-sharing friendly plans.",
		},
];

const OFFBEAT_COLLECTIONS: CollectionItem[] = [
	{
		id: "shimla-secret-spots",
		badge: "OFFBEAT",
		title: "Shimla's lesser-known view points",
		subtitle: "Skip the mall-road rush and explore quiet sides.",
	},
	{
		id: "tirthan-valley-trails",
		badge: "OFFBEAT",
		title: "Slow trails in Tirthan & Jibhi valley",
		subtitle: "Streams, forest walks and tiny village cafes.",
	},
	{
		id: "kangra-heritage",
		badge: "HERITAGE",
		title: "Kangra & Palampur tea gardens",
		subtitle: "Monasteries, toy trains and tea estate stays.",
	},
	{
		id: "winter-snow-hamlets",
		badge: "WINTER",
		title: "Snowy hamlets near Manali & Shimla",
		subtitle: "Short drives to see snow without hectic treks.",
	},
	{
		id: "summer-hill-retreats",
		badge: "SUMMER",
		title: "Cool hill retreats for May–June heat",
		subtitle: "Family-friendly stays with easy sightseeing.",
		},
		{
			id: "hidden-lakes",
			badge: "OFFBEAT",
			title: "Hidden lakes & short hikes",
			subtitle: "Quiet walks to lesser-known lakes and meadows.",
		},
		{
			id: "quiet-villages",
			badge: "SLOW",
			title: "Slow stays in quiet Himachal villages",
			subtitle: "Live like a local with long balconies and chai breaks.",
		},
		{
			id: "monastery-towns",
			badge: "CULTURE",
			title: "Monastery towns & tea garden walks",
			subtitle: "Mix monasteries, small cafes and gentle walks.",
		},
		{
			id: "river-side-cabins",
			badge: "OFFBEAT",
			title: "Riverside cabins & forest glamps",
			subtitle: "Sleep to river sounds, wake up to pine forests.",
		},
		{
			id: "borderline-spiti",
			badge: "ADVENTURE",
			title: "Almost-Spiti circuits for first timers",
			subtitle: "Spiti-style views without committing to the full loop.",
		},
];

	export async function CollectionsSection() {
		const { topCollections, offbeatCollections } =
			await listPublicHomeCollections();

		const primaryItems =
			topCollections.length > 0
				? topCollections.map(mapDocToCollectionItem)
				: PRIMARY_COLLECTIONS;

		const offbeatItems =
			offbeatCollections.length > 0
				? offbeatCollections.map(mapDocToCollectionItem)
				: OFFBEAT_COLLECTIONS;

			return (
				<CollectionsSectionClient
						primaryItems={primaryItems}
						offbeatItems={offbeatItems}
					/>
			);
		}

export function CollectionsSectionSkeleton() {
	return (
		<section className="py-6">
			<Container>
				<div className="space-y-6 rounded-3xl bg-white px-4 py-5 shadow-[0_18px_60px_rgba(15,23,42,0.12)] ring-1 ring-slate-100 animate-pulse sm:px-6 sm:py-6">
					<div className="space-y-2">
						<div className="h-4 w-52 rounded-full bg-slate-200" />
						<div className="h-3 w-64 max-w-full rounded-full bg-slate-100" />
					</div>
					<div className="mt-2 flex gap-4 overflow-hidden">
						{Array.from({ length: 3 }).map((_, index) => (
							<div
								key={index}
								className="min-w-[232px] max-w-[260px] flex-shrink-0 rounded-[26px] bg-slate-50 shadow-[0_10px_30px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80"
							>
								<div className="h-40 rounded-[26px] bg-gradient-to-tr from-sky-50 via-slate-50 to-amber-50" />
								<div className="space-y-2 px-3 pb-3 pt-3">
									<div className="h-3 w-3/4 rounded-full bg-slate-200" />
									<div className="h-3 w-full rounded-full bg-slate-100" />
								</div>
							</div>
						))}
					</div>
				</div>
			</Container>
		</section>
	);
}
