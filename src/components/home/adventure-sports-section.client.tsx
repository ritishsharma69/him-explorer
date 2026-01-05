"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

import { Container } from "@/components/layout/container";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import type { AdventureSportCard } from "./adventure-sports-section";

interface AdventureSportsSectionClientProps {
  sports: AdventureSportCard[];
}

	export function AdventureSportsSectionClient({ sports }: AdventureSportsSectionClientProps) {
		  const [activeIndex, setActiveIndex] = useState(0);
		  const [direction, setDirection] = useState<"next" | "prev">("next");
		  const cardRef = useRef<HTMLElement | null>(null);

			  // Auto-advance to the next card every 2.5s
			  useEffect(() => {
		    if (!sports || sports.length <= 1) return;

		    const id = setTimeout(() => {
		      setDirection("next");
		      setActiveIndex((prev) => (prev + 1) % sports.length);
		    }, 2500);

		    return () => clearTimeout(id);
		  }, [activeIndex, sports, sports.length]);

			  // GSAP animation whenever the active card changes (page-like slide)
			  useEffect(() => {
		    if (!cardRef.current) return;

		    const node = cardRef.current;
		    const fromX = direction === "next" ? 80 : -80;

		    gsap.killTweensOf(node);

		    gsap.fromTo(
		      node,
		      {
		        x: fromX,
		        autoAlpha: 0,
		        filter: "blur(6px)",
		      },
		      {
		        x: 0,
		        autoAlpha: 1,
		        filter: "blur(0px)",
		        duration: 0.55,
		        ease: "power3.out",
		      },
		    );
		  }, [activeIndex, direction]);

		  const handleNext = () => {
	    setDirection("next");
	    setActiveIndex((prev) => (prev + 1) % sports.length);
	  };

		  const handlePrev = () => {
	    setDirection("prev");
	    setActiveIndex((prev) => (prev - 1 + sports.length) % sports.length);
	  };

	  if (!sports || sports.length === 0) return null;

		  const activeSport = sports[activeIndex];

			return (
			  <section className="py-6 sm:py-8">
			    <Container>
			      <ScrollReveal className="space-y-4">
			        <div className="mx-auto max-w-2xl space-y-1 text-center">
			          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-500">
			            Fun activities & treks with HimExplore
			          </p>
			          <p className="text-xs text-slate-500 sm:text-[13px]">
			            River rafting, paragliding, camping, and short treks &mdash; all planned
			            with trusted local partners and professional guides, so you can safely
			            add adventure to any trip.
			          </p>
			        </div>
			        <div className="mx-auto flex max-w-6xl items-center gap-4 sm:gap-6">
            {/* Left arrow */}
	            <button
	              type="button"
	              onClick={handlePrev}
	              className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 sm:inline-flex"
	              aria-label="Previous adventure sport"
	            >
	              {"<"}
	            </button>

		            {/* Main big card */}
		            <article
		              ref={cardRef}
		              className="group mx-auto w-full overflow-hidden rounded-3xl bg-white/95 text-slate-900 shadow-[0_16px_50px_rgba(15,23,42,0.16)] ring-1 ring-slate-100/90"
		            >
		              <div className="relative h-[22rem] bg-gradient-to-tr from-sky-50 via-slate-50 to-blue-50 sm:h-[26rem] lg:h-[30rem]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeSport.imageUrl || "/harcode-image.png"}
                  alt={activeSport.name}
                  className="h-full w-full object-cover"
                />
              </div>
		              <div className="px-4 pb-4 pt-2 text-center sm:px-6 sm:pb-4">
		                <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
		                  {activeSport.name}
		                </h3>
		                {activeSport.label && (
		                  <p className="mt-1 text-[11px] text-slate-500 sm:text-xs">
		                    {activeSport.label}
		                  </p>
		                )}
		              </div>
            </article>

            {/* Right arrow */}
	            <button
	              type="button"
	              onClick={handleNext}
	              className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 sm:inline-flex"
	              aria-label="Next adventure sport"
	            >
	              {">"}
	            </button>
          </div>

          {/* Mobile arrows under the card */}
          <div className="flex items-center justify-center gap-4 sm:hidden">
	            <button
	              type="button"
	              onClick={handlePrev}
	              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
	              aria-label="Previous adventure sport"
	            >
	              {"<"}
	            </button>
            <span className="text-[11px] text-slate-500">
              {activeIndex + 1} / {sports.length}
            </span>
	            <button
	              type="button"
	              onClick={handleNext}
	              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
	              aria-label="Next adventure sport"
	            >
	              {">"}
	            </button>
          </div>
        </ScrollReveal>
      </Container>
    </section>
	  );
	}

	