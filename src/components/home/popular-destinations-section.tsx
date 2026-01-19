import { Container } from "@/components/layout/container";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { listPublicPopularDestinations } from "@/server/services/popular-destination.service";
import type { PopularDestinationDocument } from "@/server/models/popular-destination.model";

interface DestinationCard {
  id: string;
  name: string;
  imageUrl: string;
  size: "small" | "medium" | "large";
}

const FALLBACK_DESTINATIONS: DestinationCard[] = [
  {
    id: "manali",
    name: "Manali",
    imageUrl: "/harcode-image.png",
    size: "large",
  },
  {
    id: "shimla",
    name: "Shimla",
    imageUrl: "/harcode-image.png",
    size: "medium",
  },
  {
    id: "dharamshala",
    name: "Dharamshala",
    imageUrl: "/harcode-image.png",
    size: "large",
  },
  {
    id: "kasol",
    name: "Kasol",
    imageUrl: "/harcode-image.png",
    size: "medium",
  },
  {
    id: "bir-billing",
    name: "Bir Billing",
    imageUrl: "/harcode-image.png",
    size: "medium",
  },
  {
    id: "spiti",
    name: "Spiti Valley",
    imageUrl: "/harcode-image.png",
    size: "medium",
  },
];

function mapDestination(doc: PopularDestinationDocument): DestinationCard {
  return {
    id: String(doc._id),
    name: doc.name,
    imageUrl: doc.imageUrl,
    size: doc.size,
  };
}

export async function PopularDestinationsSection() {
  const destinationsFromDb = await listPublicPopularDestinations();
  const destinations =
    destinationsFromDb.length > 0
      ? destinationsFromDb.map(mapDestination)
      : FALLBACK_DESTINATIONS;

  return (
    <section className="py-6 sm:py-8">
      <Container>
        <ScrollReveal className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
            Popular destinations
          </h2>
          <div className="grid auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[200px] sm:grid-cols-4 sm:gap-4">
            {destinations.map((dest, index) => {
              // Bento grid sizing based on size property
              let gridClasses = "";
              if (dest.size === "large") {
                gridClasses = "col-span-1 row-span-2 sm:col-span-1 sm:row-span-2";
              } else if (dest.size === "medium") {
                gridClasses = "col-span-1 row-span-1 sm:col-span-1 sm:row-span-1";
              } else {
                gridClasses = "col-span-1 row-span-1";
              }

              return (
                <article
                  key={dest.id}
                  className={`group relative overflow-hidden rounded-2xl bg-slate-100 ${gridClasses}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={dest.imageUrl}
                    alt={dest.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  {/* Label */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="inline-block rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-slate-900 shadow-sm backdrop-blur-sm sm:text-xs">
                      {dest.name}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}

export function PopularDestinationsSectionSkeleton() {
  return (
    <section className="py-6 sm:py-8">
      <Container>
        <div className="space-y-4">
          <div className="h-6 w-48 animate-pulse rounded bg-slate-200" />
          <div className="grid auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[200px] sm:grid-cols-4 sm:gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl bg-slate-200"
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

