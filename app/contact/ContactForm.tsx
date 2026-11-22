"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { siteConfig } from "@/site";

const TOPIC_OPTIONS = [
  { value: "setup", label: "Setup help" },
  { value: "bug", label: "Something is broken" },
  { value: "feature", label: "Feature request" },
  { value: "account", label: "Account or workspace" },
  { value: "privacy", label: "Privacy & data" },
  { value: "other", label: "Something else" },
] as const;

const VALID_TOPICS = new Set<string>(TOPIC_OPTIONS.map((o) => o.value));

const fieldClasses =
  "block w-full rounded-xl border border-text-200 bg-white px-4 py-3 text-text-900 placeholder:text-text-400 transition-colors focus:border-text-800 focus:outline-none focus:ring-2 focus:ring-text-800/15";

export function ContactForm({
  defaultName = "",
  defaultEmail = "",
}: {
  defaultName?: string;
  defaultEmail?: string;
}) {
  return (
    <Suspense fallback={null}>
      <ContactFormInner defaultName={defaultName} defaultEmail={defaultEmail} />
    </Suspense>
  );
}

function ContactFormInner({
  defaultName,
  defaultEmail,
}: {
  defaultName: string;
  defaultEmail: string;
}) {
  const searchParams = useSearchParams();
  // Lets other pages deep-link a pre-selected topic, e.g. /contact?topic=bug
  const initialTopic = searchParams.get("topic") ?? "";

  const [formState, setFormState] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [formData, setFormData] = useState({
    name: defaultName,
    email: defaultEmail,
    subject: VALID_TOPICS.has(initialTopic) ? initialTopic : "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("submitting");

    try {
      const response = await fetch("/api/send-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.success) {
        throw new Error(data?.error || "Failed to send message");
      }

      setFormState("success");
      setFormData({
        name: defaultName,
        email: defaultEmail,
        subject: "",
        message: "",
      });
    } catch {
      setFormState("error");
    }
  };

  if (formState === "success") {
    return (
      <div className="rounded-2xl border border-text-200 bg-background-100 p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-text-200 bg-white">
          <Check className="h-6 w-6 text-text-800" aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-text-900">
          Message sent
        </h3>
        <p className="mt-2 text-text-600">
          Thanks for reaching out — I&apos;ll reply to you personally, usually
          within a few hours.
        </p>
        <button
          type="button"
          onClick={() => setFormState("idle")}
          className="mt-6 text-sm font-medium text-text-900 underline decoration-text-400 underline-offset-4 hover:decoration-text-900"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="text-sm font-medium text-text-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            autoComplete="name"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className={fieldClasses}
            placeholder="Your name"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-text-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className={fieldClasses}
            placeholder="you@company.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="subject" className="text-sm font-medium text-text-700">
          What&apos;s this about?
        </label>
        <select
          id="subject"
          name="subject"
          required
          value={formData.subject}
          onChange={(e) =>
            setFormData({ ...formData, subject: e.target.value })
          }
          className={fieldClasses}
        >
          <option value="">Select a topic</option>
          {TOPIC_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium text-text-700">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          className={`${fieldClasses} resize-none`}
          placeholder="How can I help? The more detail, the faster I can sort it out."
        />
      </div>

      {formState === "error" && (
        <div
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-text-800"
        >
          Something went wrong on my end. Please try again, or email me directly
          at{" "}
          <a
            href={`mailto:${siteConfig.supportEmail}`}
            className="font-medium underline underline-offset-4"
          >
            {siteConfig.supportEmail}
          </a>
          .
        </div>
      )}

      <button
        type="submit"
        disabled={formState === "submitting"}
        data-umami-event="contact-form-submit"
        className="w-full rounded-xl bg-text-800 px-6 py-4 font-semibold text-white transition-colors hover:bg-text-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {formState === "submitting" ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            Sending...
          </span>
        ) : (
          "Send message"
        )}
      </button>

      <p className="text-center text-xs text-text-500">
        I read every message myself. No newsletter, no sales sequence.
      </p>
    </form>
  );
}
