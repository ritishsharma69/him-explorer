"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

interface SpotlightModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function SpotlightModal({
  open,
  onClose,
  title,
  children,
}: SpotlightModalProps) {
	  const panelRef = useRef<HTMLDivElement | null>(null);
	  const [mounted, setMounted] = useState(false);

		  // Track when we're mounted on the client so we can safely portal into document.body
		  useEffect(() => {
		    // This pattern avoids touching `document` during SSR, and is safe here.
		    // eslint-disable-next-line react-hooks/set-state-in-effect
		    setMounted(true);
		    return () => {
		      setMounted(false);
		    };
		  }, []);

	  // Lock body scroll when the modal is open
	  useEffect(() => {
	    if (!open || !mounted) return;

	    const originalOverflow = document.body.style.overflow;
	    document.body.style.overflow = "hidden";

	    return () => {
	      document.body.style.overflow = originalOverflow;
	    };
	  }, [open, mounted]);

	  // Animate modal in when it mounts / opens
	  useEffect(() => {
	    if (!open || !mounted || !panelRef.current) return;

	    gsap.fromTo(
	      panelRef.current,
	      {
	        y: 24,
	        autoAlpha: 0,
	        scale: 0.96,
	        filter: "blur(10px)",
	      },
	      {
	        y: 0,
	        autoAlpha: 1,
	        scale: 1,
	        filter: "blur(0px)",
	        duration: 0.45,
	        ease: "power3.out",
	      },
	    );
	  }, [open, mounted]);

  function handleRequestClose() {
    if (!panelRef.current) {
      onClose();
      return;
    }

    gsap.to(panelRef.current, {
      y: 16,
      autoAlpha: 0,
      scale: 0.96,
      filter: "blur(8px)",
      duration: 0.25,
      ease: "power2.in",
      onComplete: onClose,
    });
  }

	  if (!open || !mounted) return null;

	  const modalContent = (
	    <div
	      className="fixed inset-0 z-[80] flex items-center justify-center px-4 sm:px-6"
	      role="dialog"
	      aria-modal="true"
	      aria-label={title}
	    >
	      <div
	        className="absolute inset-0 bg-slate-950/55 backdrop-blur-[8px]"
	        onClick={handleRequestClose}
	      />
	      <div
	        ref={panelRef}
	        className="relative z-10 my-10 w-[min(96vw,460px)] sm:my-12 sm:w-[min(90vw,600px)]"
	      >
	        <div className="overflow-hidden rounded-3xl bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.6)] ring-1 ring-slate-200">
	          {children}
	        </div>
	        <button
	          type="button"
	          onClick={handleRequestClose}
	          className="absolute -right-2 -top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-[12px] font-semibold text-slate-100 shadow-md shadow-slate-900/40 hover:bg-slate-800"
	        >
	          X
	        </button>
	      </div>
	    </div>
	  );

	  return createPortal(modalContent, document.body);
}

