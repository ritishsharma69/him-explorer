import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { EnquiryForm } from "@/components/enquiry/enquiry-form";

export const metadata: Metadata = {
  title: "Contact us | HimExplore",
  description:
    "Share your dates, rough budget and what kind of Himachal trip you want. A local planner will get back on WhatsApp.",
};

export default function ContactPage() {
  return (
    <main className="py-10 sm:py-12">
	      <Container className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-start">
        <section className="space-y-4">
          <p className="inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">
            Contact & enquiry
          </p>
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Tell us about the Himachal trip you have in mind.
          </h1>
          <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
            Share your dates, number of travellers and what vibe you are going
            forchill workation, quick snow fix, family trip or something more
            offbeat. We will reply over WhatsApp with route options, a rough
            budget and stay suggestions.
          </p>
	          <ul className="mt-2 space-y-1 text-xs text-slate-600 sm:text-sm">
            <li> 100% free planning help, you only pay for confirmed
              stays & transport.
            </li>
            <li> No spammy calls; we usually reply within working
              hours.
            </li>
          </ul>
	          <div className="mt-4 space-y-1 text-sm text-slate-700 sm:text-base">
	            <p>You can also reach us directly:</p>
	            <p>
	              <span className="font-semibold">Phone:</span>{" "}
	              <a
	                href="tel:+919317501055"
	                className="text-sky-700 hover:underline"
	              >
	                +91 93175 01055
	              </a>
	            </p>
	            <p>
	              <span className="font-semibold">Email:</span>{" "}
	              <a
	                href="mailto:thehimexplorer55@gmail.com"
	                className="text-sky-700 hover:underline"
	              >
	                thehimexplorer55@gmail.com
	              </a>
	            </p>
	          </div>
        </section>

	        <section
	          id="trip-enquiry-form"
	          className="relative rounded-3xl border border-sky-100 bg-gradient-to-br from-white via-sky-50/70 to-blue-50/70 p-4 text-xs text-slate-900 shadow-[0_18px_60px_rgba(15,23,42,0.14)] sm:p-5"
	        >
	          <div className="space-y-4">
	            <div>
	              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">
	                Trip enquiry form
	              </p>
	              <p className="mt-1 text-[11px] text-slate-600">
	                Fill this once and we will take it forward over WhatsApp or email.
	              </p>
	            </div>
	            <EnquiryForm />
	          </div>
	        </section>
      </Container>
    </main>
  );
}

