"use client";

import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

import { Container } from "@/components/layout/container";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { SpotlightModal } from "@/components/ui/spotlight-modal";
import type { CollectionItem } from "./collections-section";

interface CollectionsSectionClientProps {
  primaryItems: CollectionItem[];
  offbeatItems: CollectionItem[];
}

interface CollectionsRowProps {
  heading: string;
  description: string;
  items: CollectionItem[];
  onCardClick: (item: CollectionItem, heading: string, description: string) => void;
  showArrows?: boolean;
}

interface ActiveCollectionCard {
  item: CollectionItem;
  heading: string;
  description: string;
}

function CollectionsRow({ heading, description, items, onCardClick, showArrows = false }: CollectionsRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 280; // Approx card width + gap
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">{heading}</h2>
          <p className="mt-1 text-xs text-slate-600 sm:text-sm">{description}</p>
        </div>
        {showArrows && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 shadow-sm transition hover:bg-slate-200 hover:text-slate-900"
              aria-label="Scroll left"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 shadow-sm transition hover:bg-slate-200 hover:text-slate-900"
              aria-label="Scroll right"
            >
              <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
            </button>
          </div>
        )}
      </div>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto px-2 pb-2 pt-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <article
            key={item.id}
            onClick={() => onCardClick(item, heading, description)}
            className="group relative flex min-w-[232px] max-w-[260px] cursor-pointer flex-shrink-0 flex-col overflow-hidden rounded-[26px] bg-white/95 shadow-[0_10px_30px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.14)]"
          >
            <div className="relative h-40 bg-gradient-to-tr from-sky-50 via-slate-50 to-amber-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.imageUrl || "/harcode-image.png"}
                alt={item.title}
                className="h-full w-full object-cover"
              />
              <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white shadow-sm shadow-blue-500/40">
                {item.badge}
              </span>
            </div>
            <div className="flex flex-1 flex-col justify-between px-3 pb-3 pt-2">
              <p className="line-clamp-2 text-[12px] font-semibold text-slate-900">{item.title}</p>
              <p className="mt-1 line-clamp-2 text-[11px] text-slate-600">{item.subtitle}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function CollectionsSectionClient({ primaryItems, offbeatItems }: CollectionsSectionClientProps) {
  const [active, setActive] = useState<ActiveCollectionCard | null>(null);

  const handleCardClick = (item: CollectionItem, heading: string, description: string) => {
    setActive({ item, heading, description });
  };

  const closeModal = () => setActive(null);

  return (
    <>
      <section className="py-6">
        <Container>
          <ScrollReveal className="space-y-8 rounded-3xl bg-white px-4 py-5 shadow-[0_18px_60px_rgba(15,23,42,0.12)] ring-1 ring-slate-100 sm:px-6 sm:py-6">
            <CollectionsRow
              heading="Top 10 Himachal collections for you"
              description="Ready-made ideas for weekend getaways, workations and short breaks you can further customise over a quick call."
              items={primaryItems}
              onCardClick={handleCardClick}
              showArrows
            />
            <CollectionsRow
              heading="Unlock lesser-known wonders of Himachal"
              description="Offbeat spots, quieter towns and slow-travel bases that stay within easy driving distance of major cities."
              items={offbeatItems}
              onCardClick={handleCardClick}
              showArrows
            />
          </ScrollReveal>
        </Container>
      </section>

      <SpotlightModal
        open={!!active}
        onClose={closeModal}
        title={active?.item.title}
      >
        {active && (
          <div className="space-y-3 p-4 sm:p-5 text-slate-900">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-700">
              {active.heading}
            </p>
            <div className="overflow-hidden rounded-2xl bg-white shadow-[0_10px_30px_rgba(15,23,42,0.12)] ring-1 ring-slate-100/80">
              <div className="relative h-48 bg-gradient-to-tr from-sky-50 via-slate-50 to-amber-50 sm:h-56">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={active.item.imageUrl || "/harcode-image.png"}
                  alt={active.item.title}
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white shadow-sm shadow-blue-500/40">
                  {active.item.badge}
                </span>
              </div>
              <div className="space-y-1 px-3 pb-3 pt-2">
                <p className="text-sm font-semibold sm:text-base">{active.item.title}</p>
                <p className="text-xs text-slate-600 sm:text-[13px]">
                  {active.item.subtitle}
                </p>
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              {active.description}
            </p>
          </div>
        )}
      </SpotlightModal>
    </>
  );
}

