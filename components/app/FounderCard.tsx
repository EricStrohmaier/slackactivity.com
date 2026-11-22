import Image from "next/image";
import { siteConfig } from "@/site";

/**
 * Founder intro shown next to the contact form.
 *
 * - layout="stacked": photo on top, text below — sidebar on wide screens
 * - layout="compact": small photo beside text — mobile-friendly horizontal row
 */
export function FounderCard({
  layout = "stacked",
  className = "",
}: {
  layout?: "stacked" | "compact";
  className?: string;
}) {
  const blurb = <>I built {siteConfig.name} and I read every message sent.</>;

  const emailLink = (
    <a
      href={`mailto:${siteConfig.supportEmail}`}
      className="text-sm font-medium text-text-900 underline decoration-text-400 underline-offset-4 transition-colors hover:decoration-text-900"
    >
      {siteConfig.supportEmail}
    </a>
  );

  if (layout === "compact") {
    return (
      <div className={`flex items-start gap-5 ${className}`}>
        <Image
          src="/eric-founder.jpg"
          alt="Eric Strohmaier, the developer behind Slackactivity"
          width={100}
          height={130}
          className="shrink-0 rounded-2xl border border-text-200 object-cover object-top"
          priority
        />
        <div className="pt-1">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-text-500">
            Maker
          </p>
          <h2 className="text-2xl font-bold text-text-900">
            Hi, I&apos;m Eric.
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-text-600">{blurb}</p>
          <p className="mt-3">{emailLink}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <Image
        src="/eric-founder.jpg"
        alt="Eric Strohmaier, the developer behind Slackactivity"
        width={280}
        height={364}
        className="w-full rounded-2xl border border-text-200 object-cover object-top"
        priority
      />
      <p className="mt-6 mb-1 text-xs font-semibold uppercase tracking-wider text-text-500">
        Maker
      </p>
      <h2 className="text-2xl font-bold text-text-900">Hi, I&apos;m Eric.</h2>
      <p className="mt-3 text-[15px] leading-relaxed text-text-600">{blurb}</p>
      <p className="mt-4">{emailLink}</p>
    </div>
  );
}
