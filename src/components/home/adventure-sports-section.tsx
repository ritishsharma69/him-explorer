import type { AdventureActivityDocument } from "@/server/models/adventure-activity.model";
import { listPublicAdventureActivities } from "@/server/services/adventure-activity.service";
import { AdventureSportsSectionClient } from "./adventure-sports-section.client";

export interface AdventureSportCard {
	id: string;
	name: string;
	label: string;
	imageUrl?: string;
}

const ADVENTURE_SPORTS: AdventureSportCard[] = [
	{
		id: "river-rafting",
		name: "River rafting",
		label:
			"Guided runs on popular river stretches with proper life-jackets, helmets and rescue kayaks.",
	},
	{
		id: "paragliding",
		name: "Paragliding",
		label:
			"Certified pilots, weather-checked slots and smooth take-off / landing zones for first-timers.",
	},
	{
		id: "bungee-jump",
		name: "Bungee & giant swing",
		label:
			"High-thrill jumps at audited sites with harness checks, clear weight limits and safety briefings.",
	},
];

function mapActivity(doc: AdventureActivityDocument): AdventureSportCard {
	return {
		id: String(doc._id),
		name: doc.name,
		label: doc.label,
		imageUrl: doc.imageUrl,
	};
}

export async function AdventureSportsSection() {
	const activitiesFromDb = await listPublicAdventureActivities();
	const sports =
		activitiesFromDb.length > 0
			? activitiesFromDb.map(mapActivity)
			: ADVENTURE_SPORTS;

	return <AdventureSportsSectionClient sports={sports} />;
}
