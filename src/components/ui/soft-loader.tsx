"use client";

import type { HTMLAttributes } from "react";

interface SoftLoaderProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  /**
   * Optional small variant for inline/section loaders (e.g. inside cards).
   */
  size?: "sm" | "md";
}

export function SoftLoader({
  label = "Loading...",
  size = "md",
  className = "",
  ...rest
}: SoftLoaderProps) {
  const dotSize = size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2";
  const textSize = size === "sm" ? "text-[10px]" : "text-[11px]";

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1.5 text-blue-800 ring-1 ring-blue-200 shadow-sm ${textSize} ${className}`}
      {...rest}
    >
      <span className={`${dotSize} rounded-full bg-blue-500 animate-pulse`} />
      <span
        className={`${dotSize} rounded-full bg-blue-500 animate-pulse [animation-delay:120ms]`}
      />
      <span
        className={`${dotSize} rounded-full bg-blue-500 animate-pulse [animation-delay:240ms]`}
      />
      <span className="ml-1 font-medium">{label}</span>
    </div>
  );
}
