import type { Metadata } from "next";

import { Container } from "@/components/layout/container";

export const metadata: Metadata = {
  title: "About us | HimExplore",
  description:
    "HimExplore is a small team of travel planners crafting slow, scenic trips across India.",
};

export default function AboutPage() {
  return (
    <main className="py-10 sm:py-12">
      <Container className="space-y-10">
        <section className="max-w-2xl space-y-4">
          <p className="inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">
            About HimExplore
          </p>
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Trips planned by people who actually live in the mountains.
          </h1>
          <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
            HimExplore started as a side project helping friends plan their first
            trips. Today, we are a small local-first team that spends
            more time on the road than behind deskschecking new stays,
            drives and cafes so your trip feels slow, scenic and sorted.
          </p>
	          <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
	            Instead of pushing fixed &quot;packages&quot;, we help you pick a broad
	            directionTirthan, Jibhi, Chamba, Spiti, Kinnaurand then stitch
	            together homestays, transfers and small experiences that suit your
	            pace, budget and the people you are travelling with.
	          </p>
        </section>

        <section className="grid gap-6 sm:grid-cols-3">
          <div className="space-y-2 rounded-2xl bg-white/90 p-4 text-sm text-slate-700 shadow-[0_18px_60px_rgba(15,23,42,0.08)] ring-1 ring-slate-100">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
              Local-first
            </h2>
            <p className="text-xs text-slate-600">
              We work directly with homestays and small hotels across India,
              so your money supports local families and not just large chains.
            </p>
          </div>
          <div className="space-y-2 rounded-2xl bg-white/90 p-4 text-sm text-slate-700 shadow-[0_18px_60px_rgba(15,23,42,0.08)] ring-1 ring-slate-100">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
              Slow travel
            </h2>
            <p className="text-xs text-slate-600">
              Fewer hotel hops, more time in each valley. We plan for buffer
              days, realistic drive times and weather so the trip actually
              feels like a break.
            </p>
          </div>
          <div className="space-y-2 rounded-2xl bg-white/90 p-4 text-sm text-slate-700 shadow-[0_18px_60px_rgba(15,23,42,0.08)] ring-1 ring-slate-100">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
              Honest planning
            </h2>
            <p className="text-xs text-slate-600">
              No over-promising. If a drive is too long for kids or snow chances
              are low for your dates, we will tell you upfront and adjust the
              plan.
            </p>
          </div>
        </section>
      </Container>
    </main>
  );
}

