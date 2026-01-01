import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { TravelChatbotWidget } from "@/components/chatbot/travel-chatbot-widget";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

	const geistMono = Geist_Mono({
		variable: "--font-geist-mono",
		subsets: ["latin"],
	});

	export const metadata: Metadata = {
	  title: "HimExplore | Himachal tour packages & custom trips",
	  description:
	    "Curated Himachal Pradesh tour packages, weekend getaways and custom trips planned by local experts.",
	};

		export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
		    <html lang="en" suppressHydrationWarning>
	      <body
						className={`${geistSans.variable} ${geistMono.variable} bg-gradient-to-b from-sky-50 via-white to-white text-slate-900 antialiased`}
	      >
	        <div className="flex min-h-screen flex-col">
	          <SiteHeader />
	          <main className="flex-1">{children}</main>
	          <SiteFooter />
	        </div>
	        <TravelChatbotWidget />
	      </body>
	    </html>
  );
}
