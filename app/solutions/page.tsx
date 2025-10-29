import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Zap, Clock, Video } from "lucide-react";
import {
  SEOPageLayout,
  Section,
  CTAButton,
} from "@/components/seo/SEOPageLayout";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

export const metadata: Metadata = {
  title: "Solutions - Slackactivity | Slack Status Automation",
  description:
    "Explore Slackactivity solutions for automatic Slack status management. Keep your status active, prevent away status, and automate your presence.",
  keywords: [
    "slack solutions",
    "slack automation",
    "slack status tools",
    "slack presence management",
  ],
};

const breadcrumbItems = [
  { name: "Home", url: "https://slackactivity.com" },
  { name: "Solutions", url: "https://slackactivity.com/solutions" },
];

const solutions = [
  {
    title: "Slack Auto Away Prevention",
    description:
      "Prevent Slack from marking you as away after 30 minutes. Keep your status active automatically during work hours.",
    href: "/solutions/slack-auto-away-prevention",
    icon: Clock,
    keywords: ["Away Prevention", "Always Active", "Status Management"],
  },
  {
    title: "Slack Status Automation",
    description:
      "Automate your entire Slack status with smart scheduling. Set your work hours and let automation handle the rest.",
    href: "/solutions/slack-status-automation",
    icon: Zap,
    keywords: ["Automation", "Smart Scheduling", "Multi-Workspace"],
  },
  {
    title: "Keep Slack Active During Meetings",
    description:
      "Stay active on Slack during meetings, video calls, and conferences. Prevent away status while in Zoom, Teams, or Google Meet. Look available even when busy.",
    href: "/solutions/keep-slack-active-during-meetings",
    icon: Video,
    keywords: [
      "Active During Meetings",
      "Stay Online",
      "Video Calls",
      "Zoom Integration",
    ],
  },
];

export default function SolutionsPage() {
  return (
    <>
      <SEOPageLayout>
        <Breadcrumbs items={breadcrumbItems} />

        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-text-900">
            Slack Status Solutions
          </h1>
          <p className="text-xl text-text-600 mb-8">
            Discover how Slackactivity solves your Slack status management
            challenges. From preventing away status to full automation,
            we&apos;ve got you covered.
          </p>
        </header>

        <Section>
          <div className="grid md:grid-cols-2 gap-8">
            {solutions.map((solution) => {
              const Icon = solution.icon;
              return (
                <Link
                  key={solution.href}
                  href={solution.href}
                  className="group bg-white border border-text-200 rounded-lg p-8 hover:shadow-lg hover:border-text-800 transition-all"
                >
                  <div className="mb-4">
                    <Icon className="w-12 h-12 text-text-800" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3 text-text-900 group-hover:text-text-800 flex items-center">
                    {solution.title}
                    <ArrowRight className="w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h2>
                  <p className="text-text-700 mb-4">{solution.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {solution.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="text-xs px-3 py-1 bg-background-100 text-text-700 rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        </Section>

        <Section variant="highlight">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-text-900">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-6 text-text-700">
              All solutions are completely free. No credit card required.
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
