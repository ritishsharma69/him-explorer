import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { EnquiryForm } from "@/components/enquiry/enquiry-form";
import { getPublishedPackageBySlug } from "@/server/services/package.service";
import type { PackageDocument } from "@/server/models/package.model";

interface PackageForPage extends PackageDocument {
  _isDemo?: boolean;
}

const DEMO_PACKAGES_BY_SLUG: Record<string, PackageForPage> = {
  "weekend-manali-from-delhi": {
    _id: "000000000000000000000001" as unknown as PackageDocument["_id"],
    slug: "weekend-manali-from-delhi",
    title: "Weekend in Manali from Delhi",
    subtitle: "Cafe-hopping, riverside walks & Solang day trip",
    destinationName: "Manali & Solang Valley",
    durationDays: 3,
    startingPricePerPerson: 8999,
    currencyCode: "INR",
    shortDescription:
      "Overnight Volvo from Delhi, two nights in a cosy stay near Old Manali and a flexible day for Solang / Atal Tunnel.",
    detailedDescription:
      "Perfect if you want a quick break from Delhi without burning too many leaves. Travel overnight, check into a small homestay near Old Manali and spend your time between riverside walks, cafes and one flexible day for Solang / Atal Tunnel depending on weather.",
    highlights: [
      "Overnight semi-sleeper Volvo from Delhi to Manali",
      "Cosy homestay near Old Manali with mountain views",
      "Flexible Solang / Atal Tunnel day depending on weather",
      "Time for riverside walks, cafes and local markets",
    ],
    inclusions: [
      "Delhi-Manali-Delhi Volvo tickets",
      "2 nights stay in a verified homestay near Old Manali",
      "Breakfast on all days at the stay",
      "Private cab for local sightseeing day",
    ],
    exclusions: [
      "Lunches, dinners and cafe meals",
      "Activities like paragliding / skiing / ropeway tickets",
      "Personal expenses and tips",
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: "Overnight Volvo from Delhi",
        description:
          "Board the overnight semi-sleeper Volvo from Delhi in the evening. Settle in, carry a light blanket and earphones. Overnight journey to Manali.",
      },
      {
        dayNumber: 2,
        title: "Arrive in Manali, riverside and cafes",
        description:
          "Arrive in Manali by morning, transfer to your homestay near Old Manali. Freshen up, grab brunch in a cafe and spend the day exploring Old Manali lanes, riverside walk and Manu temple.",
      },
      {
        dayNumber: 3,
        title: "Solang / Atal Tunnel day trip",
        description:
          "Head out after breakfast for a flexible day trip towards Solang valley and, if weather allows, Atal Tunnel. Try basic snow activities, click photos and be back in Manali by evening for the bus back to Delhi.",
      },
    ],
    galleryImageUrls: [
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1515023115689-589c33041d3c?auto=format&fit=crop&w=900&q=80",
    ],
    isFeatured: true,
    status: "published",
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
    _isDemo: true,
  },
  "shimla-kasauli-short-break": {
    _id: "000000000000000000000002" as unknown as PackageDocument["_id"],
    slug: "shimla-kasauli-short-break",
    title: "Shimla & Kasauli slow weekend",
    subtitle: "Toy train views, sunset points and cafe corners",
    destinationName: "Shimla & Kasauli",
    durationDays: 3,
    startingPricePerPerson: 7799,
    currencyCode: "INR",
    shortDescription:
      "Perfect for couples and small groups driving up from Chandigarh looking for a relaxed, no-rush break.",
    detailedDescription:
      "A slow-paced long weekend with one night in Shimla and one in Kasauli. Think short toy-train style views, sunset points, pine walks and cosy cafes instead of rushed ticking of points.",
    highlights: [
      "Short drive up from Chandigarh with flexible start time",
      "Evening walks on the Ridge & Mall Road in Shimla",
      "Golden hour sunset points and churches in Kasauli",
      "Stay in small, view-friendly stays instead of big hotels",
    ],
    inclusions: [
      "1 night stay in Shimla, 1 night stay in Kasauli",
      "Breakfast on all days",
      "Private cab for the full trip from Chandigarh",
    ],
    exclusions: [
      "Lunches, dinners and snacks",
      "Entry fees and activities",
      "Anything not mentioned in inclusions",
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: "Drive to Shimla & evening on the Ridge",
        description:
          "Start from Chandigarh post breakfast. Drive up via Kandaghat with chai stops. Check into your Shimla stay, freshen up and spend the evening walking around the Ridge, Christ Church and nearby cafes.",
      },
      {
        dayNumber: 2,
        title: "Shimla viewpoints and drive to Kasauli",
        description:
          "Visit a couple of easy viewpoints around Shimla or just enjoy a lazy morning at the stay. Later, drive towards Kasauli, stopping at viewpoints on the way. Catch sunset from one of Kasauli's sunset points.",
      },
      {
        dayNumber: 3,
        title: "Kasauli walks & drive back to Chandigarh",
        description:
          "Wake up to pine views, take a short morning walk around the church / old cantonment area and head back to Chandigarh after an early lunch.",
      },
    ],
    galleryImageUrls: [
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1548940740-204726a19be3?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1542718610-a1c3ea9b66d3?auto=format&fit=crop&w=900&q=80",
    ],
    isFeatured: true,
    status: "published",
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
    _isDemo: true,
  },
  "jibhi-tirthan-workation": {
    _id: "000000000000000000000003" as unknown as PackageDocument["_id"],
    slug: "jibhi-tirthan-workation",
    title: "10-day Jibhi & Tirthan workation",
    subtitle: "Wi-Fi tested stays with quiet work corners",
    destinationName: "Jibhi & Tirthan Valley",
    durationDays: 10,
    startingPricePerPerson: 18999,
    currencyCode: "INR",
    shortDescription:
      "Stay in two scenic homestays with strong Wi-Fi, riverside walks after calls and optional weekend hikes.",
    detailedDescription:
      "Designed for people who want to log in from the mountains without worrying about internet drops. You split your time between Jibhi and Tirthan in small, host-run homestays with verified Wi-Fi and calm work corners.",
    highlights: [
      "Wi-Fi checked at both stays with backup dongle",
      "Separate work corners / desk space in rooms",
      "Riverside walks and short hikes post work",
      "One free weekend for a longer hike or Great Himalayan NP",
    ],
    inclusions: [
      "9 nights stay across Jibhi & Tirthan homestays",
      "Breakfast and simple home-style dinners",
      "Shared cab for inter-town transfer",
    ],
    exclusions: [
      "Lunches and cafe visits",
      "Guided treks and permits",
      "Any equipment rentals",
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: "Arrive in Jibhi & settle into your work base",
        description:
          "Drive up from Aut / Chandigarh, check into your Jibhi homestay, test Wi-Fi and set up your work desk. Evening walk to the river or Jibhi waterfall.",
      },
      {
        dayNumber: 2,
        title: "Work days with short evening walks",
        description:
          "Log into work from the homestay. Evenings free for cafe-hopping, small forest walks and bonfire (weather-permitting).",
      },
      {
        dayNumber: 5,
        title: "Shift to Tirthan valley",
        description:
          "Move to a riverside stay in Tirthan. Fresh setting, similar work-friendly setup with Wi-Fi and quiet common spaces.",
      },
      {
        dayNumber: 8,
        title: "Weekend hike or Great Himalayan National Park",
        description:
          "Use the weekend for a slightly longer hike or a GHNP entry day with a local guide. Last day kept light for rest and packing.",
      },
    ],
    galleryImageUrls: [
      "https://images.unsplash.com/photo-1500534314211-0a24cd03f2c0?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1526481280695-3c687fd543c0?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1520939817895-060bdaf4fe1a?auto=format&fit=crop&w=900&q=80",
    ],
    isFeatured: true,
    status: "published",
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
    _isDemo: true,
  },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getPackage(slug: string): Promise<PackageForPage> {
  const pkg = await getPublishedPackageBySlug(slug);

  if (pkg) {
    return pkg;
  }

  const demo = DEMO_PACKAGES_BY_SLUG[slug];
  if (demo) {
    return demo;
  }

  notFound();
}

export default async function PackageDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const pkg = await getPackage(slug);
  const isDemo = pkg._isDemo === true;

  return (
    <main className="py-10 sm:py-12">
      <section className="pb-12 bg-gradient-to-b from-blue-50/60 via-blue-50/30 to-white">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-start">
          {/* Left column: all details */}
          <div className="space-y-8">
            {/* Hero / basic info */}
            <div className="space-y-4">
              <p className="inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">
                Travel itinerary
              </p>
              <h1 className="text-balance text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
                {pkg.title}
              </h1>
              {pkg.subtitle && (
                <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                  {pkg.subtitle}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                <span className="truncate text-slate-600">{pkg.destinationName}</span>
                <span className="rounded-full bg-sky-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700">
                  {pkg.durationDays} days
                </span>
                <span className="text-[11px] font-medium text-sky-700">
                  From {pkg.currencyCode}{" "}
                  {pkg.startingPricePerPerson.toLocaleString("en-IN")} per person
                </span>
              </div>
              <p className="max-w-xl text-xs text-slate-600 sm:text-sm">
                {pkg.shortDescription}
              </p>
            </div>

            {/* Trip overview, highlights & day-wise plan */}
            <div className="space-y-6">
              {pkg.detailedDescription && (
                <div className="space-y-2">
                  <h2 className="text-sm font-semibold text-slate-900 sm:text-base">
                    Trip overview
                  </h2>
                  <p className="whitespace-pre-line text-xs text-slate-600 sm:text-sm">
                    {pkg.detailedDescription}
                  </p>
                </div>
              )}

              {pkg.highlights.length > 0 && (
                <div className="space-y-2">
                  <h2 className="text-sm font-semibold text-slate-900 sm:text-base">
                    Highlights
                  </h2>
                  <ul className="grid list-disc gap-1 pl-5 text-xs text-slate-700 sm:text-sm">
                    {pkg.highlights.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {pkg.itinerary.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-sm font-semibold text-slate-900 sm:text-base">
                    Day-wise plan
                  </h2>
                  <ol className="space-y-3 border-l border-blue-200 pl-4 text-xs text-slate-700 sm:text-sm">
                    {pkg.itinerary.map((day) => (
                      <li key={day.dayNumber} className="relative space-y-1">
                        <span className="absolute -left-[9px] mt-1 h-2 w-2 rounded-full bg-blue-600" />
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                          Day {day.dayNumber}
                        </p>
                        <p className="font-medium text-slate-900">{day.title}</p>
                        <p className="text-[11px] text-slate-600 sm:text-xs">
                          {day.description}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>

            {/* Inclusions, exclusions & photos below details on the left */}
            <div className="space-y-6">
              {(pkg.inclusions.length > 0 || pkg.exclusions.length > 0) && (
                <div className="space-y-4 rounded-2xl bg-white/95 p-4 text-xs text-slate-700 shadow-[0_18px_60px_rgba(15,23,42,0.08)] ring-1 ring-slate-100">
                  {pkg.inclusions.length > 0 && (
                    <div className="space-y-1">
                      <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                        Inclusions
                      </h3>
                      <ul className="list-disc space-y-1 pl-4 text-[11px] text-slate-600">
                        {pkg.inclusions.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {pkg.exclusions.length > 0 && (
                    <div className="space-y-1">
                      <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                        Exclusions
                      </h3>
                      <ul className="list-disc space-y-1 pl-4 text-[11px] text-slate-600">
                        {pkg.exclusions.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {pkg.galleryImageUrls.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-900">
                    Trip photos
                  </h3>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {pkg.galleryImageUrls.map((url) => (
                      <div
                        key={url}
                        className="aspect-[4/3] overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
                      >
                        {/* Using a plain <img> here avoids build-time issues with remote domains.
                        If you prefer Next/Image, configure remotePatterns in next.config
                        and replace this with <Image />. */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={pkg.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right column: enquiry form, next to all details */}
          <aside className="relative rounded-3xl border border-sky-100 bg-gradient-to-br from-white via-sky-50/70 to-blue-50/70 p-4 text-xs text-slate-900 shadow-[0_18px_60px_rgba(15,23,42,0.14)] sm:p-5 lg:sticky lg:top-24">
            <div className="space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">
                Plan this trip
              </p>
              <p className="text-[11px] text-slate-600">
                Share your dates, group size and rough budget. We&apos;ll tweak this
                itinerary to match your pace and stays, then send a quote.
              </p>
              {isDemo && (
                <p className="rounded-xl bg-sky-50 px-3 py-2 text-[10px] text-sky-800">
                  This is a sample itinerary to help you visualise the package
                  page. Once you add a real package from the admin, that data
                  will show here.
                </p>
              )}
              <EnquiryForm
                packageId={isDemo ? undefined : pkg._id.toString()}
                packageTitle={pkg.title}
              />
            </div>
          </aside>
        </Container>
      </section>
    </main>
  );
}
