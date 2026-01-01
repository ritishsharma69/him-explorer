"use client";

import { useState } from "react";

import { Container } from "@/components/layout/container";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { SpotlightModal } from "@/components/ui/spotlight-modal";
import type { PartnerHotelCard } from "./partner-hotels-section";

interface PartnerHotelsSectionClientProps {
  hotels: PartnerHotelCard[];
}

interface ActiveHotelCard {
  hotel: PartnerHotelCard;
}

export function PartnerHotelsSectionClient({ hotels }: PartnerHotelsSectionClientProps) {
  const [active, setActive] = useState<ActiveHotelCard | null>(null);

  const closeModal = () => setActive(null);

  return (
    <>
      <section className="py-4 sm:py-6">
        <Container>
          <ScrollReveal className="flex flex-col gap-4 rounded-3xl bg-white/85 px-4 py-5 shadow-[0_18px_60px_rgba(15,23,42,0.12)] ring-1 ring-slate-100/90 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-6">
            <div className="max-w-xs space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600">
                Flagship stays we love booking
              </p>
              <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                Hotel &amp; resort partners across Himachal
              </h2>
              <p className="text-xs text-slate-600 sm:text-sm">
                From boutique homestays to bigger brands, we mix and match stays so your trip feels cosy, not cookie-cutter.
              </p>
            </div>

            <div className="flex gap-3 overflow-x-auto px-2 pb-2 pt-2 text-xs [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {hotels.map((hotel) => (
                <article
                  key={hotel.id}
                  onClick={() => setActive({ hotel })}
                  className="group flex min-w-[190px] max-w-[210px] cursor-pointer flex-shrink-0 flex-col overflow-hidden rounded-2xl bg-white/95 text-slate-900 shadow-[0_10px_30px_rgba(15,23,42,0.08)] ring-1 ring-slate-100/80 transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.16)]"
                >
                  <div className="h-28 bg-gradient-to-tr from-emerald-50 via-slate-50 to-amber-50 sm:h-32">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={hotel.imageUrl || "/harcode-image.png"}
                      alt={hotel.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-1 px-3 py-2">
                    <p className="text-[11px] font-semibold leading-snug text-slate-900">
                      {hotel.name}
                    </p>
                    <p className="text-[11px] text-slate-600">{hotel.label}</p>
                  </div>
                </article>
              ))}
            </div>
          </ScrollReveal>
        </Container>
      </section>

      <SpotlightModal
        open={!!active}
        onClose={closeModal}
        title={active?.hotel.name}
      >
        {active && (
          <div className="space-y-3 p-4 sm:p-5 text-slate-900">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Partner stay highlight
            </p>
            <div className="overflow-hidden rounded-2xl bg-white shadow-[0_10px_30px_rgba(15,23,42,0.16)] ring-1 ring-slate-100/80">
              <div className="h-44 bg-gradient-to-tr from-emerald-50 via-slate-50 to-amber-50 sm:h-52">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={active.hotel.imageUrl || "/harcode-image.png"}
                  alt={active.hotel.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-1 px-3 pb-3 pt-2">
                <p className="text-sm font-semibold sm:text-base">{active.hotel.name}</p>
                <p className="text-xs text-slate-600 sm:text-[13px]">
                  {active.hotel.label}
                </p>
              </div>
            </div>
          </div>
        )}
      </SpotlightModal>
    </>
  );
}

