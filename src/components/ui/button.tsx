"use client";

import * as React from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	  variant?: "primary" | "outline" | "ghost";
	  // Allow a larger size for prominent CTAs (e.g. hero section buttons).
	  size?: "sm" | "md" | "lg";
	}

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
			const base =
				"inline-flex items-center justify-center rounded-full font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60";

			const variantClasses =
				variant === "primary"
					? "bg-blue-600 text-white shadow-md shadow-blue-600/40 hover:bg-blue-500"
					: variant === "outline"
					? "border border-blue-400/60 bg-transparent text-blue-200 hover:bg-blue-600/10"
					: "bg-transparent text-blue-200 hover:bg-blue-600/10";

	  const sizeClasses =
	    size === "sm"
	      ? "px-3 py-1 text-[11px] uppercase tracking-[0.18em]"
	      : size === "lg"
	        ? "px-5 py-2.5 text-sm uppercase tracking-[0.18em]"
	        : "px-4 py-2 text-xs uppercase tracking-[0.18em]";

  return (
    <button
      className={cn(base, variantClasses, sizeClasses, className)}
      {...props}
    />
  );
}

