"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";

import { Container } from "@/components/layout/container";

const ADMIN_NAV_ITEMS = [
	{ href: "/admin/packages", label: "Packages" },
	{ href: "/admin/home-collections", label: "Home collections" },
	{ href: "/admin/partner-hotels", label: "Partner hotels" },
	{ href: "/admin/enquiries", label: "Enquiries" },
	{ href: "/admin/reviews", label: "Reviews" },
	{ href: "/admin/adventure-activities", label: "Adventure activities" },
];

const ADMIN_FLAG_KEY = "himexplore_admin_logged_in";

	export function SiteHeader() {
				const pathname = usePathname();
				const router = useRouter();
				const isAdminRoute = pathname.startsWith("/admin");
				const isAdminLogin = pathname === "/admin/login";
				const [isMenuOpen, setIsMenuOpen] = useState(false);

		function handleAdminLogout() {
			if (typeof window !== "undefined") {
				window.localStorage.removeItem(ADMIN_FLAG_KEY);
			}
			router.push("/admin/login");
		}

					if (isAdminRoute && !isAdminLogin) {
					return (
						<>
							<header className="sticky top-0 z-40 border-b border-slate-900/80 bg-slate-950/95 backdrop-blur-xl">
								<Container className="flex items-center justify-between py-7 sm:py-7">
									<Link href="/admin/packages" className="flex items-center gap-2 shrink-0">
										{/* eslint-disable-next-line @next/next/no-img-element */}
										<img
											src="/logo.png"
											alt="HimExplore logo"
											className="h-6 w-auto transform origin-left scale-[4]"
										/>
									</Link>
									{/* Desktop nav */}
									<div className="hidden items-center gap-2 sm:flex">
										<nav className="flex flex-wrap gap-1 rounded-full bg-slate-900/70 p-1 text-[11px] font-medium text-slate-300 sm:text-xs">
											{ADMIN_NAV_ITEMS.map((item) => {
												const isActive =
													pathname === item.href || pathname.startsWith(`${item.href}/`);

												return (
													<Link
														key={item.href}
														href={item.href}
														className={`rounded-full px-3 py-1 transition-colors duration-150 ${
															isActive
																? "bg-slate-50 text-slate-950 shadow-sm"
																: "text-slate-200 hover:bg-slate-800 hover:text-white"
														}`}
													>
														{item.label}
													</Link>
												);
											})}
										</nav>
										<button
											type="button"
											onClick={handleAdminLogout}
											className="rounded-full border border-red-400/70 bg-red-500/90 px-3 py-1 text-[11px] font-semibold text-white shadow-sm hover:bg-red-600"
										>
											Logout
										</button>
									</div>
									{/* Mobile hamburger button */}
									<button
										type="button"
										onClick={() => setIsMenuOpen(true)}
										className="inline-flex h-9 w-16 items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 text-slate-200 shadow-sm hover:bg-slate-800 sm:hidden"
										aria-label="Open admin menu"
									>
										<FontAwesomeIcon icon={faBars} className="h-4 w-4" />
									</button>
								</Container>
							</header>
							{/* Admin mobile sidebar menu */}
							<div
								className={`fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm transition-opacity duration-300 sm:hidden ${
									isMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
								}`}
							>
								<button
									type="button"
									className="absolute inset-0 h-full w-full cursor-pointer"
									onClick={() => setIsMenuOpen(false)}
									aria-label="Close admin menu"
								/>
								<div
									className={`absolute right-0 top-0 flex h-full w-64 transform flex-col bg-slate-950/95 p-5 text-sm text-slate-100 shadow-2xl ring-1 ring-slate-800 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
										isMenuOpen ? "translate-x-0" : "translate-x-full"
									}`}
								>
									<div className="mb-4 flex items-center justify-between">
										<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">
											Admin Menu
										</p>
										<button
											type="button"
											onClick={() => setIsMenuOpen(false)}
											className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 text-slate-200 hover:bg-slate-800"
											aria-label="Close menu"
										>
											<FontAwesomeIcon icon={faXmark} className="h-3.5 w-3.5" />
										</button>
									</div>
									<nav className="space-y-2 text-[15px]">
										{ADMIN_NAV_ITEMS.map((item) => {
											const isActive =
												pathname === item.href || pathname.startsWith(`${item.href}/`);

											return (
												<Link
													key={item.href}
													href={item.href}
													onClick={() => setIsMenuOpen(false)}
													className={`block rounded-lg px-3 py-2 ${
														isActive
															? "bg-sky-500/10 text-sky-200"
															: "text-slate-200 hover:bg-slate-800"
													}`}
												>
													{item.label}
												</Link>
											);
										})}
									</nav>
									<button
										type="button"
										onClick={() => {
											setIsMenuOpen(false);
											handleAdminLogout();
										}}
										className="mt-4 inline-flex items-center justify-center rounded-full border border-red-400/70 bg-red-500/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-sm hover:bg-red-600"
									>
										Logout
									</button>
								</div>
							</div>
						</>
					);
			}
		
				return (
					<>
						<header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
							<Container className="flex items-center justify-between py-7 sm:py-7 pl-3 pr-4 sm:px-4">
								<Link href="/" className="flex items-center gap-2 shrink-0">
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img
											src="/logo.png"
											alt="HimExplore logo"
											className="h-6 w-auto transform origin-left scale-[4]"
										/>
								</Link>
								{/* Desktop nav */}
								<nav className="hidden items-center gap-5 text-sm font-medium text-slate-200 sm:flex">
									<Link
											href="/"
											className={`border-b-2 pb-1.5 transition ${
												pathname === "/"
													? "border-blue-500 text-blue-200"
													: "border-transparent text-slate-300 hover:text-blue-200"
											}`}
										>
											Home
										</Link>
										<Link
											href="/packages"
											className={`border-b-2 pb-1.5 transition ${
												pathname.startsWith("/packages")
													? "border-blue-500 text-blue-200"
													: "border-transparent text-slate-300 hover:text-blue-200"
											}`}
										>
											Packages
										</Link>
										<Link
											href="/reviews"
											className={`border-b-2 pb-1.5 transition ${
												pathname.startsWith("/reviews")
													? "border-blue-500 text-blue-200"
													: "border-transparent text-slate-300 hover:text-blue-200"
											}`}
										>
											Reviews
										</Link>
										<Link
											href="/about"
											className={`hidden border-b-2 pb-1.5 transition sm:inline ${
												pathname.startsWith("/about")
													? "border-blue-500 text-blue-200"
													: "border-transparent text-slate-300 hover:text-blue-200"
											}`}
										>
											About
										</Link>
										<Link
											href="/contact"
											className={`hidden border-b-2 pb-1.5 transition sm:inline ${
												pathname.startsWith("/contact")
													? "border-blue-500 text-blue-200"
													: "border-transparent text-slate-300 hover:text-blue-200"
											}`}
										>
											Contact
										</Link>
										<Link
											href="/#contact"
											className="hidden rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 px-5 py-2 text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.18em] text-white shadow-lg shadow-blue-500/40 transition hover:brightness-110 sm:inline"
										>
											Plan a trip
										</Link>
								</nav>
				{/* Mobile hamburger button */}
				<button
						type="button"
						onClick={() => setIsMenuOpen(true)}
						className="inline-flex h-9 w-16 items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 text-slate-200 shadow-sm hover:bg-slate-800 sm:hidden"
						aria-label="Open navigation menu"
				>
					<FontAwesomeIcon icon={faBars} className="h-4 w-4" />
				</button>
							</Container>
						</header>
						{/* Mobile sidebar menu with smooth springy easing */}
						<div
							className={`fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm transition-opacity duration-300 sm:hidden ${
								isMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
							}`}
						>
							<button
									type="button"
									className="absolute inset-0 h-full w-full cursor-pointer"
									onClick={() => setIsMenuOpen(false)}
									aria-label="Close navigation menu"
								/>
								<div
										className={`absolute right-0 top-0 flex h-full w-64 transform flex-col bg-slate-950/95 p-5 text-sm text-slate-100 shadow-2xl ring-1 ring-slate-800 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
											isMenuOpen ? "translate-x-0" : "translate-x-full"
										}`}
								>
									<div className="mb-4 flex items-center justify-between">
										<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-300">
											Menu
										</p>
							<button
								type="button"
								onClick={() => setIsMenuOpen(false)}
								className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 text-slate-200 hover:bg-slate-800"
								aria-label="Close menu"
							>
								<FontAwesomeIcon icon={faXmark} className="h-3.5 w-3.5" />
							</button>
									</div>
									<nav className="space-y-2 text-[15px]">
										<Link
												href="/"
												onClick={() => setIsMenuOpen(false)}
												className={`block rounded-lg px-3 py-2 ${
													pathname === "/"
														? "bg-blue-600/10 text-blue-200"
														: "text-slate-200 hover:bg-slate-800"
												}`}
											>
												Home
											</Link>
										<Link
												href="/packages"
												onClick={() => setIsMenuOpen(false)}
												className={`block rounded-lg px-3 py-2 ${
													pathname.startsWith("/packages")
														? "bg-blue-600/10 text-blue-200"
														: "text-slate-200 hover:bg-slate-800"
												}`}
											>
												Packages
											</Link>
										<Link
												href="/reviews"
												onClick={() => setIsMenuOpen(false)}
												className={`block rounded-lg px-3 py-2 ${
													pathname.startsWith("/reviews")
														? "bg-blue-600/10 text-blue-200"
														: "text-slate-200 hover:bg-slate-800"
												}`}
											>
												Reviews
											</Link>
										<Link
												href="/about"
												onClick={() => setIsMenuOpen(false)}
												className={`block rounded-lg px-3 py-2 ${
													pathname.startsWith("/about")
														? "bg-blue-600/10 text-blue-200"
														: "text-slate-200 hover:bg-slate-800"
												}`}
											>
												About
											</Link>
										<Link
												href="/contact"
												onClick={() => setIsMenuOpen(false)}
												className={`block rounded-lg px-3 py-2 ${
													pathname.startsWith("/contact")
														? "bg-blue-600/10 text-blue-200"
														: "text-slate-200 hover:bg-slate-800"
												}`}
											>
												Contact
											</Link>
									</nav>
							<Link
									href="/#contact"
									onClick={() => setIsMenuOpen(false)}
									className="mt-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-lg shadow-blue-500/40 hover:brightness-110"
							>
								Plan a trip
							</Link>
								</div>
						</div>
					</>
				);
		}

