"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  /** Optional delay in milliseconds for staggering multiple items */
  delay?: number;
}

/**
 * Lightweight scroll-based reveal wrapper.
 *
 * - Renders children slightly translated + blurred on first paint
 * - Runs a smooth slide-up + fade-in the first time the block enters the viewport
 * - Does NOT re-animate on subsequent scrolls or when you navigate back
 */
export function ScrollReveal({
  children,
  className = "",
  delay = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setHasAnimated(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.18 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [hasAnimated]);

	  const baseClasses =
	    "transition-all duration-700 ease-[cubic-bezier(0.23,0.87,0.32,1)] will-change-transform";
	  // Important: keep content visible even before the observer fires so navigating
	  // away and back never leaves sections permanently hidden.
	  const hiddenClasses = "translate-y-6 opacity-100 blur-sm";
	  const visibleClasses = "translate-y-0 opacity-100 blur-0";

  return (
    <div
      ref={ref}
      className={`${baseClasses} ${
        hasAnimated ? visibleClasses : hiddenClasses
      } ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

