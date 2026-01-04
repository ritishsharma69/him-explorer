"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";

export interface EnquiryFormProps {
  packageId?: string;
  packageTitle?: string;
}

interface FieldErrors {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  message?: string;
}

export function EnquiryForm({ packageId, packageTitle }: EnquiryFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [preferredStartDate, setPreferredStartDate] = useState("");
  const [numberOfAdults, setNumberOfAdults] = useState("2");
  const [numberOfChildren, setNumberOfChildren] = useState("0");
  const [budgetPerPersonMin, setBudgetPerPersonMin] = useState("");
  const [howDidYouHear, setHowDidYouHear] = useState("");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

	  const inputBase =
	    "w-full rounded-xl border border-slate-200 bg-white/90 px-3 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-sky-400 focus:ring-1 focus:ring-sky-500/70 focus:bg-white";

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    setFieldErrors({});

    const basicErrors: FieldErrors = {};
    if (!fullName.trim()) basicErrors.fullName = "Please enter your name";
    if (!email.trim()) basicErrors.email = "Please enter your email";
    if (!phoneNumber.trim())
      basicErrors.phoneNumber = "Please enter your phone number";
    if (!message.trim()) basicErrors.message = "Please tell us a bit about your trip";

    if (Object.keys(basicErrors).length > 0) {
      setFieldErrors(basicErrors);
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        fullName: fullName.trim(),
        email: email.trim(),
        phoneCountryCode: phoneCountryCode.trim() || "+91",
        phoneNumber: phoneNumber.trim(),
        packageId,
        preferredStartDate: preferredStartDate
          ? new Date(preferredStartDate).toISOString()
          : undefined,
        numberOfAdults: Number.parseInt(numberOfAdults || "1", 10),
        numberOfChildren: Number.parseInt(numberOfChildren || "0", 10),
        budgetPerPersonMin: budgetPerPersonMin
          ? Number.parseFloat(budgetPerPersonMin)
          : undefined,
        message: message.trim(),
        howDidYouHear: howDidYouHear.trim() || undefined,
      };

      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        setErrorMessage(
          "We couldn't submit your enquiry. Please check your details and try again.",
        );
      } else {
        setSuccessMessage(
          "Thanks for reaching out! We'll get back to you within a working day.",
        );
        setFullName("");
        setEmail("");
        setPhoneCountryCode("+91");
        setPhoneNumber("");
        setPreferredStartDate("");
        setNumberOfAdults("2");
        setNumberOfChildren("0");
        setBudgetPerPersonMin("");
        setHowDidYouHear("");
        setMessage("");
      }
    } catch (error) {
      console.error("Failed to submit enquiry", error);
      setErrorMessage("Something went wrong. Please try again in a minute.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
	    <form className="space-y-4" onSubmit={handleSubmit}>
	      {packageTitle && (
	        <p className="text-xs text-slate-600">
	          You&apos;re enquiring about: <span className="font-medium text-slate-900">{packageTitle}</span>
	        </p>
	      )}

      <div className="grid gap-3 sm:grid-cols-2">
	        <div className="space-y-1">
	          <label className="block text-xs font-medium text-slate-700">
            Full name
          </label>
          <input
            type="text"
	            placeholder="Your full name"
	            className={inputBase}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          {fieldErrors.fullName && (
            <p className="text-[11px] text-rose-400">{fieldErrors.fullName}</p>
          )}
        </div>
	        <div className="space-y-1">
	          <label className="block text-xs font-medium text-slate-700">
            Email
          </label>
          <input
            type="email"
	            placeholder="you@example.com"
	            className={inputBase}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {fieldErrors.email && (
            <p className="text-[11px] text-rose-400">{fieldErrors.email}</p>
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]">
	        <div className="space-y-1">
	          <label className="block text-xs font-medium text-slate-700">
            Country code
          </label>
          <input
            type="text"
	            className={inputBase}
            value={phoneCountryCode}
            onChange={(e) => setPhoneCountryCode(e.target.value)}
          />
        </div>
	        <div className="space-y-1">
	          <label className="block text-xs font-medium text-slate-700">
            Phone number
          </label>
          <input
            type="tel"
	            placeholder="10-digit WhatsApp number"
	            className={inputBase}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          {fieldErrors.phoneNumber && (
            <p className="text-[11px] text-rose-400">{fieldErrors.phoneNumber}</p>
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
	        <div className="space-y-1">
	          <label className="block text-xs font-medium text-slate-700">
            Preferred start date
          </label>
          <input
            type="date"
	            className={inputBase}
            value={preferredStartDate}
            onChange={(e) => setPreferredStartDate(e.target.value)}
          />
        </div>
	        <div className="space-y-1">
	          <label className="block text-xs font-medium text-slate-700">
            Adults
          </label>
          <input
            type="number"
            min={1}
	            className={inputBase}
            value={numberOfAdults}
            onChange={(e) => setNumberOfAdults(e.target.value)}
          />
        </div>
	        <div className="space-y-1">
	          <label className="block text-xs font-medium text-slate-700">
            Children
          </label>
          <input
            type="number"
            min={0}
	            className={inputBase}
            value={numberOfChildren}
            onChange={(e) => setNumberOfChildren(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
	        <div className="space-y-1">
	          <label className="block text-xs font-medium text-slate-700">
            Approx. budget per person (optional)
          </label>
          <input
            type="number"
            min={0}
	            placeholder="Rough range helps us suggest better stays"
	            className={inputBase}
            value={budgetPerPersonMin}
            onChange={(e) => setBudgetPerPersonMin(e.target.value)}
          />
        </div>
	        <div className="space-y-1">
	          <label className="block text-xs font-medium text-slate-700">
            How did you hear about us? (optional)
          </label>
          <input
            type="text"
	            placeholder="Friend, Instagram, search, etc."
	            className={inputBase}
            value={howDidYouHear}
            onChange={(e) => setHowDidYouHear(e.target.value)}
          />
        </div>
      </div>

	      <div className="space-y-1">
	        <label className="block text-xs font-medium text-slate-700">
          Tell us about your trip
        </label>
        <textarea
          rows={4}
	          className={inputBase + " resize-none min-h-[120px] leading-relaxed"}
          placeholder="Dates, places you&apos;re considering, what pace you prefer, anything specific you want to include."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        {fieldErrors.message && (
          <p className="text-[11px] text-rose-400">{fieldErrors.message}</p>
        )}
      </div>

      {errorMessage && (
	        <p className="text-[11px] text-rose-500">{errorMessage}</p>
      )}
      {successMessage && (
	        <p className="text-[11px] text-blue-700">{successMessage}</p>
      )}

      <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
        {submitting ? "Sending enquiry..." : "Request a callback"}
      </Button>
    </form>
  );
}
