import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import {
  SEOPageLayout,
  Section,
  CTAButton,
} from "@/components/seo/SEOPageLayout";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

export const metadata: Metadata = {
  title: "Use Cases - Slackactivity | For Remote Workers & Teams",
  description:
    "Discover how different professionals use Slackactivity. From remote workers to freelancers, see how our tool fits your workflow.",
  keywords: [
    "slack use cases",
    "remote work slack",
    "freelancer slack",
    "slack for teams",
    "distributed teams",
  ],
};

const breadcrumbItems = [
  { name: "Home", url: "https://slackactivity.com" },
  { name: "Use Cases", url: "https://slackactivity.com/use-cases" },
];

const useCases = [
  {
    title: "Remote Workers",
    description:
      "Manage your Slack presence across time zones, maintain professional visibility, and eliminate manual status management. Perfect for fully remote professionals and digital nomads.",
    href: "/use-cases/remote-workers",
    personas: ["Digital Nomads", "Remote Employees", "Distributed Teams"],
    benefits: ["Timezone Management", "Multi-Workspace", "Flexible Schedules"],
  },
  {
    title: "Freelance consultants",
    description:
      "Manage 3-5+ client Slack workspaces from one dashboard. Sync status across all clients, maintain professional presence, and save hours weekly. Free forever for freelancers.",
    href: "/use-cases/freelance-consultants",
    personas: [
      "Freelance Consultants",
      "Remote Employees",
      "Distributed Teams",
    ],
    benefits: ["Timezone Management", "Multi-Workspace", "Flexible Schedules"],
  },
];

export default function UseCasesPage() {
  return (
    <>
      <SEOPageLayout>
        <Breadcrumbs items={breadcrumbItems} />

        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-text-900">
            Use Cases
          </h1>
          <p className="text-xl text-text-600 mb-8">
            See how professionals like you use Slackactivity to stay active on
            Slack. Whether you&apos;re a remote worker, freelancer, or team
            lead, we&apos;ve got solutions for your workflow.
          </p>
        </header>

        <Section>
          <div className="space-y-8">
            {useCases.map((useCase) => (
              <Link
                key={useCase.href}
                href={useCase.href}
                className="group block bg-white border border-text-200 rounded-lg p-8 hover:shadow-lg hover:border-text-800 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      <Users className="w-8 h-8 text-text-800 mr-3" />
                      <h2 className="text-2xl font-bold text-text-900 group-hover:text-text-800 flex items-center">
                        {useCase.title}
                        <ArrowRight className="w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h2>
                    </div>
                    <p className="text-text-700 mb-4">{useCase.description}</p>
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-text-900 mb-2">
                        Perfect For:
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {useCase.personas.map((persona) => (
                          <span
                            key={persona}
                            className="text-xs px-3 py-1 bg-background-100 text-text-700 rounded-full"
                          >
                            {persona}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-text-900 mb-2">
                        Key Benefits:
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {useCase.benefits.map((benefit) => (
                          <span
                            key={benefit}
                            className="text-xs px-3 py-1 bg-background-50 text-text-700 border border-text-200 rounded-full"
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Section>

        <Section variant="subtle">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-text-900">
              More Use Cases Coming Soon
            </h2>
            <p className="text-lg text-text-700 mb-6">
              We&apos;re documenting more use cases for different professionals.
              In the meantime, get started and discover how Slackactivity fits
              your workflow.
            </p>
            <CTAButton href="/signin" variant="primary">
              Get Started - Free Forever
            </CTAButton>
          </div>
        </Section>
      </SEOPageLayout>
    </>
  );
}
