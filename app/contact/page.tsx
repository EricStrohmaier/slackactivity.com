import { Metadata } from "next";
import { getUser } from "@/lib/auth";
import { siteConfig } from "@/site";
import { ContactForm } from "./ContactForm";
import { FounderCard } from "@/components/app/FounderCard";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { MultipleStructuredData } from "@/components/seo/StructuredData";
import { generateBreadcrumbStructuredData } from "@/lib/seo/config";

export const metadata: Metadata = {
  title: "Contact - Talk to the person who built Slackactivity",
  description:
    "Questions about setup, your workspace, or privacy? Message Eric directly — every message is read and answered by the developer behind Slackactivity, usually within a few hours.",
  keywords: [
    "contact slackactivity",
    "slackactivity support",
    "slack status tool support",
    "slackactivity help",
  ],
  alternates: { canonical: "/contact" },
};

const breadcrumbItems = [
  { name: "Home", url: siteConfig.url },
  { name: "Contact", url: `${siteConfig.url}/contact` },
];

const structuredData = [
  generateBreadcrumbStructuredData(breadcrumbItems),
  {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Slackactivity",
    url: `${siteConfig.url}/contact`,
    mainEntity: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      founder: { "@type": "Person", name: "Eric Strohmaier" },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: siteConfig.supportEmail,
        availableLanguage: ["English", "German"],
      },
    },
  },
];

export default async function ContactPage() {
  const user = await getUser();

  return (
    <>
      <MultipleStructuredData dataArray={structuredData} />

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumbs items={breadcrumbItems} />

        <header className="mb-10 max-w-2xl">
          <h1 className="text-4xl font-bold text-text-900 sm:text-5xl">
            Get in touch
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-text-600">
            {siteConfig.name} is built and supported by one person. Ask anything
            — setup, your workspace, privacy, or a feature you wish existed.
          </p>
        </header>

        <div className="flex flex-col gap-10 lg:flex-row lg:gap-14">
          {/* Left column — photo + intro. Sticky sidebar on wide screens. */}
          <div className="shrink-0 lg:w-[280px]">
            <FounderCard layout="compact" className="lg:hidden" />
            <FounderCard
              layout="stacked"
              className="sticky top-24 hidden lg:block"
            />
          </div>

          <div className="min-w-0 flex-1">
            <ContactForm
              defaultName={user?.full_name ?? ""}
              defaultEmail={user?.email ?? ""}
            />
          </div>
        </div>
      </div>
    </>
  );
}
