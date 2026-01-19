"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPaperPlane,
	faPlaneDeparture,
	faRobot,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";
import gsap from "gsap";

interface Message {
  id: number;
  sender: "bot" | "user";
  text: string;
}

	const QUICK_QUESTIONS: string[] = [
		"I want to plan a Himachal trip.",
		"I want to know your Himachal packages.",
		"Suggest the best Himachal package for my budget and dates.",
	];

// Generate unique session ID for each user
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

	export function TravelChatbotWidget() {
			  const pathname = usePathname();
			  const isAdminRoute = pathname?.startsWith("/admin");

				  const [isOpen, setIsOpen] = useState(false);
				  const [hasAutoOpened, setHasAutoOpened] = useState(false);
				  const [isBotTyping, setIsBotTyping] = useState(false);
				  const [hasUserTypedMessage, setHasUserTypedMessage] = useState(false);
				  const [messages, setMessages] = useState<Message[]>([
		    {
		      id: 1,
		      sender: "bot",
			      text:
			        "Welcome to HimExplore! I'm your Himachal trip planner buddy. Tell me where you're travelling from, when you'd like to go, and your rough budget.",
		    },
		  ]);
		  const [input, setInput] = useState("");
	  const [sessionId] = useState(() => generateSessionId());
	  const nextId = useRef(2);
	  const panelRef = useRef<HTMLDivElement | null>(null);
	  const toggleRef = useRef<HTMLButtonElement | null>(null);
	  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
	  const endRef = useRef<HTMLDivElement | null>(null);

			  useEffect(() => {
			    if (isAdminRoute) return;
			
			    const timer = setTimeout(() => {
			      setIsOpen(true);
			      setHasAutoOpened(true);
			    }, 800);
			
			    return () => clearTimeout(timer);
			  }, [isAdminRoute]);

	  // Keep the latest messages in view when the chat is open
		  useEffect(() => {
		    if (isAdminRoute || !isOpen) return;
		    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
		  }, [isAdminRoute, isOpen, messages.length, isBotTyping]);

		  // Animate the chat panel whenever it opens
			  useEffect(() => {
			    if (isAdminRoute || !isOpen || !panelRef.current) return;
			
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
		  }, [isAdminRoute, isOpen]);

		  // Subtle entrance animation for the toggle pill once it appears
			  useEffect(() => {
			    if (isAdminRoute || isOpen || !hasAutoOpened || !toggleRef.current) return;
			
		    gsap.fromTo(
	      toggleRef.current,
	      { y: 18, autoAlpha: 0, scale: 0.96 },
	      {
	        y: 0,
	        autoAlpha: 1,
	        scale: 1,
	        duration: 0.35,
		        ease: "power3.out",
		      },
		    );
		  }, [isAdminRoute, isOpen, hasAutoOpened]);

		  // Animate in the latest message bubble
			  useEffect(() => {
			    if (isAdminRoute || !messagesContainerRef.current) return;
			
		    const nodes = messagesContainerRef.current.querySelectorAll<HTMLElement>(
	      "[data-message]",
	    );
	    const last = nodes[nodes.length - 1];
	    if (!last) return;

	    gsap.fromTo(
	      last,
	      { y: 6, autoAlpha: 0, scale: 0.97 },
	      {
	        y: 0,
	        autoAlpha: 1,
	        scale: 1,
	        duration: 0.28,
		        ease: "power2.out",
		      },
		    );
		  }, [isAdminRoute, messages.length]);

		  function openChat() {
		    if (isAdminRoute) return;
		    setIsOpen(true);
		  }

		  function closeChat() {
		    if (isAdminRoute) {
		      setIsOpen(false);
		      return;
		    }
	    if (!panelRef.current) {
	      setIsOpen(false);
	      return;
	    }

	    gsap.to(panelRef.current, {
	      y: 16,
	      autoAlpha: 0,
	      scale: 0.96,
	      filter: "blur(8px)",
	      duration: 0.25,
	      ease: "power2.in",
	      onComplete: () => setIsOpen(false),
	    });
	  }

		  async function sendMessage(rawText: string) {
		  	const trimmed = rawText.trim();
		  	if (!trimmed || isBotTyping) return;

		  	const userMessage: Message = {
		  	  id: nextId.current++,
		  	  sender: "user",
		  	  text: trimmed,
		  	};

		  	setMessages((prev) => [...prev, userMessage]);
		  	setInput("");
		  	setIsBotTyping(true);

		  	try {
		  	  const response = await fetch("/api/chat", {
		  	    method: "POST",
		  	    headers: {
		  	      "Content-Type": "application/json",
		  	    },
		  	    body: JSON.stringify({
		  	      sessionId,
		  	      message: trimmed,
		  	      metadata: {
		  	        userAgent: navigator.userAgent,
		  	        referrer: document.referrer,
		  	      },
		  	    }),
		  	  });

		  	  if (!response.ok) {
		  	    throw new Error("Failed to get AI response");
		  	  }

		  	  const data = await response.json();
		  	  const aiResponse = data.response;

		  	  setMessages((prev) => [
		  	    ...prev,
		  	    {
		  	      id: nextId.current++,
		  	      sender: "bot",
		  	      text: aiResponse,
		  	    },
		  	  ]);
		  	} catch (error) {
		  	  console.error("Chat error:", error);
		  	  setMessages((prev) => [
		  	    ...prev,
		  	    {
		  	      id: nextId.current++,
		  	      sender: "bot",
		  	      text: "Sorry, I'm having trouble connecting right now. Please try again or contact us directly for assistance.",
		  	    },
		  	  ]);
		  	} finally {
		  	  setIsBotTyping(false);
		  	}
		  }

			  async function handleSend(e?: React.FormEvent) {
			  	e?.preventDefault();
			  	const trimmed = input.trim();
			  	if (!trimmed) return;
			  	setHasUserTypedMessage(true);
			  	await sendMessage(trimmed);
			  }

		  async function handleQuickQuestionClick(text: string) {
		  	await sendMessage(text);
		  }

				  if (isAdminRoute) {
				    return null;
				  }

				  return (
			      <div className="pointer-events-none fixed bottom-3 right-3 z-50 flex max-w-full flex-col items-end gap-3 sm:bottom-5 sm:right-5 sm:max-w-sm">
		      {/* Toggle pill when closed */}
			      {!isOpen && hasAutoOpened && (
	        <button
	          ref={toggleRef}
	          type="button"
	          onClick={openChat}
					          className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(37,99,235,0.65)] hover:bg-blue-500"
		        >
		          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[13px]">
		            <FontAwesomeIcon icon={faPlaneDeparture} />
		          </span>
		          <span>Plan a Himachal trip</span>
		        </button>
      )}

			      {/* Main chat panel */}
				      {isOpen && (
		        <div
		          ref={panelRef}
		          className="pointer-events-auto w-[min(100vw-1.5rem,24rem)] overflow-hidden rounded-3xl bg-white p-4 text-[12px] shadow-[0_18px_60px_rgba(15,23,42,0.3)] ring-1 ring-slate-200 sm:p-5 sm:text-[13px]"
		        >
		            <div className="mb-3 flex items-center justify-between gap-2">
			              <div className="flex items-center gap-2">
			                <div className="relative flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 text-sm text-white shadow-md shadow-blue-500/40">
		                <FontAwesomeIcon icon={faRobot} />
		              </div>
              <div>
	                <p className="text-[12px] sm:text-sm font-semibold text-slate-900">
                  HimExplore assistant
                </p>
	                <p className="text-[11px] sm:text-[12px] text-slate-500">
                  Ask for routes, budgets or hotel vibes.
                </p>
              </div>
            </div>
			            <button
			              type="button"
			              onClick={closeChat}
					      className="inline-flex items-center gap-1 rounded-full bg-red-500 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-white hover:bg-red-600"
			            >
		              <FontAwesomeIcon icon={faXmark} className="text-[9px]" />
		              <span>Hide</span>
		            </button>
          </div>

				              <div
				                ref={messagesContainerRef}
				                className="relative mb-3 max-h-64 space-y-2 overflow-y-auto pr-1"
				              >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-white/90 to-transparent" />
            {messages.map((m) => (
              <div
                key={m.id}
	                data-message
                className={
                  m.sender === "bot"
                    ? "flex justify-start"
                    : "flex justify-end"
                }
              >
					          <div
					            className={
					              m.sender === "bot"
					                ? "max-w-[85%] rounded-2xl bg-blue-50 px-3.5 py-2.5 text-[12px] text-slate-800 ring-1 ring-blue-200"
					                : "max-w-[85%] rounded-2xl bg-blue-600 px-3.5 py-2.5 text-[12px] text-blue-50 shadow-md shadow-blue-500/40"
					            }
					          >
                  {m.text}
                </div>
              </div>
		            ))}
	            {isBotTyping && (
		              <div className="flex justify-start" data-message>
		                <div className="inline-flex items-center gap-1 rounded-2xl bg-blue-50 px-3.5 py-2.5 text-[11px] text-blue-800 ring-1 ring-blue-200">
	                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
	                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse [animation-delay:120ms]" />
	                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse [animation-delay:240ms]" />
	                  <span className="ml-1">Typing...</span>
	                </div>
	              </div>
	            )}
            <div ref={endRef} />
          </div>

				      <form onSubmit={handleSend} className="space-y-1">
					            {!hasUserTypedMessage && (
						            <div className="mb-1 flex flex-wrap gap-1">
							  {QUICK_QUESTIONS.map((q) => (
							    <button
							      key={q}
							      type="button"
							      onClick={() => handleQuickQuestionClick(q)}
							      className="pointer-events-auto rounded-full border border-blue-300 bg-white px-3 py-1 text-[10px] sm:text-[11px] text-blue-800 hover:bg-blue-50"
							    >
							      {q}
							    </button>
							  ))}
						            </div>
						          )}
							            <div className="flex items-center gap-2 rounded-2xl border border-blue-300 bg-slate-50 px-3 py-2 shadow-[0_0_0_1px_rgba(52,211,153,0.5)]">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about Himachal trips"
	                className="h-8 flex-1 bg-transparent text-[12px] sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
				          <button
				            type="submit"
				            className="inline-flex h-8 items-center justify-center gap-1 rounded-full bg-blue-600 px-4 text-[11px] sm:text-[12px] font-semibold text-blue-50 shadow-[0_6px_18px_rgba(15,23,42,0.35)] hover:bg-blue-700"
				          >
		                <FontAwesomeIcon icon={faPaperPlane} className="text-[10px]" />
		                <span>Send</span>
		              </button>
            </div>
	            <p className="text-[10px] sm:text-[11px] text-slate-400">
              AI-powered assistant. For personalized planning, share your details on our enquiry form.
            </p>
          </form>
        </div>
      )}
    </div>
  );
}

