import { Container } from "@/components/layout/container";
import {
	listApprovedReviews,
} from "@/server/services/review.service";
import type { ReviewDocument } from "@/server/models/review.model";

const FALLBACK_REVIEWS = [
	{
		name: "Riya & Karan",
		location: "Delhi - Weekend in Manali & Solang",
		rating: 4.9,
		comment:
			"We booked last minute from Delhi and still got a very relaxed 3-day plan with buffer for traffic. Stays were exactly like the photos and cabs were on time.",
		tripCompletedOn: "March 2024",
	},
	{
		name: "Tanvi's family",
		location: "Chandigarh - Shimla & Kasauli",
		rating: 4.8,
		comment:
			"Great for my parents. No rushed sightseeing, mostly short walks, viewpoints and cafes. They adjusted the plan on call when the weather changed.",
		tripCompletedOn: "February 2024",
	},
	{
		name: "Remote team of 5",
		location: "Bengaluru - Workation in Jibhi",
		rating: 4.9,
		comment:
			"Wi-Fi was solid and the planner actually checked speeds beforehand. We had a simple meal plan, bonfire evenings and two light hike options for weekends.",
		tripCompletedOn: "January 2024",
	},
];

interface DisplayReviewProps {
	name: string;
	location?: string;
	rating: number;
	comment: string;
	tripLabel: string;
}

function ReviewCard({
	name,
	location,
	rating,
	comment,
	tripLabel,
}: DisplayReviewProps) {
	return (
		<article className="flex h-full flex-col justify-between rounded-3xl bg-white/95 p-4 text-xs text-slate-700 shadow-[0_22px_80px_rgba(15,23,42,0.24)] ring-1 ring-slate-100">
			<div className="space-y-2">
				<div className="flex items-center justify-between gap-2">
					<div className="space-y-0.5">
						<p className="text-sm font-semibold text-slate-900">{name}</p>
						{location && (
							<p className="text-[11px] text-slate-500">{location}</p>
						)}
					</div>
					<div className="flex items-center gap-1 text-[11px] text-amber-500">
						<span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold">
							{rating.toFixed(1)}
						</span>
						<span className="text-amber-400">*</span>
					</div>
				</div>
				<p className="text-[11px] leading-relaxed text-slate-700 sm:text-xs">
					{comment}
				</p>
			</div>
			<p className="mt-3 text-[10px] text-slate-400">
				Trip completed on {tripLabel}
			</p>
		</article>
	);
}

async function getReviews(): Promise<ReviewDocument[]> {
	const docs = await listApprovedReviews();
	return docs;
}

export default async function ReviewsPage() {
	const reviews = await getReviews();

	return (
		<main className="space-y-8 py-8">
			<section className="border-y border-sky-100 bg-gradient-to-r from-sky-50 via-sky-100/60 to-rose-50 py-6">
				<Container className="space-y-3">
					<p className="inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700 shadow-sm shadow-sky-200">
						Guest stories
					</p>
					<h1 className="text-balance text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
						Honest reviews from recent trips.
					</h1>
					<p className="max-w-2xl text-xs text-slate-600 sm:text-sm">
						Every trip is planned 1:1 over calls and WhatsApp, so these reviews talk
						about the small details: last-minute changes, reliable cabs, and
						whether the stays actually matched what was promised.
					</p>
				</Container>
			</section>

			<section className="pb-12">
				<Container className="space-y-4">
					{reviews.length === 0 ? (
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{FALLBACK_REVIEWS.map((review) => (
								<ReviewCard
										key={review.name}
										name={review.name}
										location={review.location}
										rating={review.rating}
										comment={review.comment}
										tripLabel={review.tripCompletedOn}
									/>
								))}
						</div>
					) : (
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{reviews.map((review) => (
								<ReviewCard
										key={review._id.toString()}
										name={review.fullName}
										location={review.location || undefined}
										rating={review.rating}
										comment={review.comment}
										tripLabel={new Date(
											review.createdAt,
										).toLocaleDateString("en-IN", {
											day: "2-digit",
											month: "short",
											year: "numeric",
										})}
									/>
								))}
						</div>
					)}
				</Container>
			</section>
		</main>
	);
}
