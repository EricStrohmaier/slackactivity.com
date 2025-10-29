import { Metadata } from "next";
import { CheckCircle, Globe, Calendar, Users, Clock, Zap } from "lucide-react";
import {
  generateMetadata,
  seoPages,
  generateBreadcrumbStructuredData,
  generateFAQStructuredData,
  generateSoftwareApplicationStructuredData,
} from "@/lib/seo/config";
import { MultipleStructuredData } from "@/components/seo/StructuredData";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import {
  SEOPageLayout,
  CTAButton,
  Section,
  FeatureCard,
  CTASection,
  FAQItem,
} from "@/components/seo/SEOPageLayout";

export const metadata: Metadata = generateMetadata(seoPages.remoteWorkers);

const breadcrumbItems = [
  { name: "Home", url: "https://slackactivity.com" },
  { name: "Use Cases", url: "https://slackactivity.com/use-cases" },
  {
    name: "Remote Workers",
    url: "https://slackactivity.com/use-cases/remote-workers",
  },
];

const faqs = [
  {
    question: "Why do remote workers need Slack status automation?",
    answer:
      "Remote workers often juggle multiple time zones, client calls, and flexible schedules. Manual status management becomes impractical when you&apos;re not in a traditional office. Automation ensures you maintain professional visibility without constant manual updates.",
  },
  {
    question: "How does timezone management work for remote workers?",
    answer:
      "Slackactivity automatically adjusts to your local timezone, even when you travel. Set your work hours in your local time, and the tool handles the rest. Perfect for digital nomads and remote workers who move between time zones.",
  },
  {
    question: "Can I use this with multiple client workspaces?",
    answer:
      "Yes! Multiple Slack workspaces are supported, which is essential for freelancers and consultants working with multiple clients. Manage all your workspaces from one central dashboard.",
  },
  {
    question: "Does this replace actual work or communication?",
    answer:
      "No, it&apos;s a presence management tool, not a replacement for work. It keeps your status active so colleagues know you&apos;re available during work hours, but you still need to respond to messages and do your actual work.",
  },
];

const structuredData = [
  generateBreadcrumbStructuredData(breadcrumbItems),
  generateFAQStructuredData(faqs),
  generateSoftwareApplicationStructuredData(),
];

export default function RemoteWorkersPage() {
  return (
    <>
      <MultipleStructuredData dataArray={structuredData} />

      <SEOPageLayout>
        <Breadcrumbs items={breadcrumbItems} />

        {/* Hero Section */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-text-900">
            Slack Status Tool for Remote Workers - Stay Connected Across Time
            Zones
          </h1>
          <p className="text-xl text-text-600 mb-8">
            Essential Slack automation for remote workers, freelancers, and
            digital nomads. Manage your availability across time zones, maintain
            professional presence, and eliminate manual status management from
            your daily routine.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <CTAButton href="/signin" variant="primary">
              Get Started - Free Forever
            </CTAButton>
            <CTAButton
              href="/guides/how-to-stay-online-on-slack"
              variant="secondary"
            >
              Learn More
            </CTAButton>
          </div>
        </header>

        {/* Remote Work Challenges */}
        <Section variant="subtle">
          <h2 className="text-3xl font-bold mb-6 text-text-900">
            Unique Challenges Remote Workers Face with Slack
          </h2>
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-text-200">
              <h3 className="text-xl font-semibold mb-3 flex items-center text-text-900">
                <Globe className="w-6 h-6 text-text-800 mr-3" />
                Multiple Time Zones
              </h3>
              <p className="text-text-700">
                Working with teams across different time zones means your
                &quot;work hours&quot; might not align with traditional 9-5. You
                need status management that adapts to your actual schedule, not
                a fixed clock.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-text-200">
              <h3 className="text-xl font-semibold mb-3 flex items-center text-text-900">
                <Calendar className="w-6 h-6 text-text-800 mr-3" />
                Flexible Schedules
              </h3>
              <p className="text-text-700">
                Remote work often means flexible hours - early mornings, late
                evenings, or split shifts around childcare. Manual status
                updates don&apos;t fit this lifestyle.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-text-200">
              <h3 className="text-xl font-semibold mb-3 flex items-center text-text-900">
                <Users className="w-6 h-6 text-text-800 mr-3" />
                Multiple Workspaces
              </h3>
              <p className="text-text-700">
                Freelancers and consultants often juggle 3-5 different client
                Slack workspaces. Manually managing status across all of them is
                impossible.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-text-200">
              <h3 className="text-xl font-semibold mb-3 flex items-center text-text-900">
                <Clock className="w-6 h-6 text-text-800 mr-3" />
                Async Communication
              </h3>
              <p className="text-text-700">
                Remote teams rely on async communication, but paradoxically,
                seeing colleagues &quot;online&quot; builds trust. Being shown
                as &quot;away&quot; can make you seem less engaged.
              </p>
            </div>
          </div>
        </Section>

        {/* How It Helps Remote Workers */}
        <Section>
          <h2 className="text-3xl font-bold mb-8 text-text-900">
            How Slackactivity Empowers Remote Workers
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <FeatureCard
              icon={<Zap className="w-10 h-10" />}
              title="Automatic Presence Management"
              description="Set your work hours once and forget about it. Status updates happen automatically every 5 minutes during your scheduled availability."
            />
            <FeatureCard
              icon={<Globe className="w-10 h-10" />}
              title="Timezone Intelligence"
              description="Built for the globally distributed workforce. Your status adapts to your timezone, wherever you are in the world."
            />
            <FeatureCard
              icon={<Users className="w-10 h-10" />}
              title="Multi-Workspace Support"
              description="Manage status across all your client workspaces from a single dashboard. Essential for freelancers and consultants."
            />
            <FeatureCard
              icon={<Calendar className="w-10 h-10" />}
              title="Flexible Scheduling"
              description="Accommodate any work schedule - split shifts, early mornings, late evenings, or irregular hours that fit your lifestyle."
            />
          </div>
        </Section>

        {/* Benefits List */}
        <Section variant="highlight">
          <h2 className="text-3xl font-bold mb-6 text-text-900">
            Key Benefits for Remote Workers
          </h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <CheckCircle className="w-6 h-6 text-text-800 mr-3 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-lg text-text-900">
                  No manual updates needed:
                </strong>
                <p className="text-text-700">
                  Works even when you&apos;re in meetings or away from your
                  computer
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-6 h-6 text-text-800 mr-3 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-lg text-text-900">
                  Automatic timezone detection:
                </strong>
                <p className="text-text-700">
                  Perfect for digital nomads traveling the world
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-6 h-6 text-text-800 mr-3 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-lg text-text-900">
                  Sync status across workspaces:
                </strong>
                <p className="text-text-700">
                  Manage multiple client workspaces from one central location
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-6 h-6 text-text-800 mr-3 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-lg text-text-900">
                  Custom work hours per day:
                </strong>
                <p className="text-text-700">
                  Supports flexible schedules including split shifts and
                  irregular hours
                </p>
              </div>
            </li>
          </ul>
        </Section>

        {/* Real-World Scenarios */}
        <Section>
          <h2 className="text-3xl font-bold mb-6 text-text-900">
            Real-World Remote Work Scenarios
          </h2>
          <div className="space-y-6">
            <div className="bg-white border border-text-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-text-900">
                Scenario: The Digital Nomad
              </h3>
              <p className="text-text-700 mb-3">
                <strong>Challenge:</strong> Sarah works from Bali this month,
                Tokyo next month. Her team is in New York. She needs her Slack
                status to reflect her actual availability in her current
                timezone.
              </p>
              <p className="text-text-700">
                <strong>Solution:</strong> Slackactivity automatically detects
                her timezone and updates her status according to her local work
                hours. When she moves to Tokyo, the tool adjusts automatically -
                no manual reconfiguration needed.
              </p>
            </div>

            <div className="bg-white border border-text-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-text-900">
                Scenario: The Freelance Consultant
              </h3>
              <p className="text-text-700 mb-3">
                <strong>Challenge:</strong> Marcus works with 5 different
                clients, each with their own Slack workspace. He can&apos;t
                manually update his status across all 5 workspaces throughout
                the day.
              </p>
              <p className="text-text-700">
                <strong>Solution:</strong> He connects all 5 workspaces to
                Slackactivity. The tool syncs his status across all of them
                automatically, so he appears active to all clients during his
                work hours.
              </p>
            </div>

            <div className="bg-white border border-text-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-text-900">
                Scenario: The Parent with Split Shifts
              </h3>
              <p className="text-text-700 mb-3">
                <strong>Challenge:</strong> Elena works 6-9 AM before school
                drop-off, then 1-5 PM after pickup. Her Slack status
                doesn&apos;t reflect this unconventional schedule.
              </p>
              <p className="text-text-700">
                <strong>Solution:</strong> She configures two daily time blocks
                in Slackactivity. The tool keeps her active during both periods
                and automatically goes offline during her parenting hours,
                perfectly matching her actual availability.
              </p>
            </div>
          </div>
        </Section>

        {/* Benefits Summary */}
        <Section variant="subtle">
          <h2 className="text-3xl font-bold mb-6 text-text-900">
            Why Remote Workers Choose Slackactivity
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border border-text-200">
              <h3 className="text-lg font-semibold mb-3 text-text-900">
                Time Savings
              </h3>
              <p className="text-text-700">
                Save 10-15 minutes daily that you&apos;d otherwise spend
                managing status across workspaces. That&apos;s 60+ hours per
                year back in your schedule.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-text-200">
              <h3 className="text-lg font-semibold mb-3 text-text-900">
                Professional Image
              </h3>
              <p className="text-text-700">
                Always appear engaged and available during work hours. Build
                trust with remote teams and clients through consistent presence.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-text-200">
              <h3 className="text-lg font-semibold mb-3 text-text-900">
                Mental Peace
              </h3>
              <p className="text-text-700">
                No more anxiety about appearing offline or unavailable. Set it
                once and focus on actual work, not status management.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-text-200">
              <h3 className="text-lg font-semibold mb-3 text-text-900">
                Work-Life Balance
              </h3>
              <p className="text-text-700">
                Automation respects your personal time. You only appear online
                during your configured work hours, helping maintain healthy
                boundaries.
              </p>
            </div>
          </div>
        </Section>

        {/* FAQ Section */}
        <Section>
          <h2 className="text-3xl font-bold mb-8 text-text-900">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </Section>

        {/* CTA Section */}
        <CTASection
          title="Join Thousands of Remote Workers Using Slackactivity"
          description="Stop managing status manually. Start focusing on what matters - your actual work. No credit card required."
          primaryCTA={{ text: "Get Started - Free Forever", href: "/signin" }}
          secondaryCTA={{ text: "View Pricing", href: "/#pricing" }}
        />
      </SEOPageLayout>
    </>
  );
}
