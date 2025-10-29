import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, Calendar, Clock, Globe, ArrowRight } from "lucide-react";
import {
  SEOPageLayout,
  Section,
  FeatureCard,
  CTASection,
  FAQItem,
} from "@/components/seo/SEOPageLayout";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { MultipleStructuredData } from "@/components/seo/StructuredData";
import {
  generateBreadcrumbStructuredData,
  generateHowToStructuredData,
  generateArticleStructuredData,
} from "@/lib/seo/config";

export const metadata: Metadata = {
  title: "How to Schedule Your Slack Availability - Complete Guide",
  description:
    "Learn how to schedule your Slack availability automatically. Set work hours, manage time zones, and automate your status for perfect work-life balance.",
  keywords: [
    "schedule slack availability",
    "slack work hours",
    "slack availability scheduler",
    "slack timezone management",
    "automatic slack schedule",
  ],
};

const breadcrumbItems = [
  { name: "Home", url: "https://slackactivity.com" },
  { name: "Guides", url: "https://slackactivity.com/guides" },
  {
    name: "Schedule Slack Availability",
    url: "https://slackactivity.com/guides/schedule-slack-availability",
  },
];

const howToSteps = [
  {
    name: "Sign up for Slackactivity",
    text: "Create a free account and connect your Slack workspace using secure OAuth authentication.",
  },
  {
    name: "Set your timezone",
    text: "Configure your local timezone so the schedule matches your actual work hours.",
  },
  {
    name: "Define work hours",
    text: "Set your daily start and end times for each day of the week.",
  },
  {
    name: "Enable automation",
    text: "Activate the schedule and let Slackactivity manage your status automatically.",
  },
];

const structuredData = [
  generateBreadcrumbStructuredData(breadcrumbItems),
  generateHowToStructuredData(
    "How to Schedule Your Slack Availability",
    "Set up automatic Slack status scheduling based on your work hours and timezone",
    howToSteps
  ),
  generateArticleStructuredData(
    "How to Schedule Your Slack Availability - Complete Guide",
    "Comprehensive guide to scheduling Slack availability with automatic status management",
    "2024-01-15",
    "2024-01-15"
  ),
];

export default function ScheduleSlackAvailabilityPage() {
  return (
    <>
      <MultipleStructuredData dataArray={structuredData} />

      <SEOPageLayout>
        <Breadcrumbs items={breadcrumbItems} />

        {/* Hero Section */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-text-900">
            How to Schedule Your Slack Availability
          </h1>
          <p className="text-xl text-text-600 mb-4">
            Learn how to schedule your Slack availability automatically based on
            your work hours. Perfect for remote workers, freelancers, and anyone
            with flexible schedules who needs to maintain professional presence
            without manual status updates.
          </p>
          <div className="flex items-center gap-2 text-sm text-text-500 mb-8">
            <span>Last updated: January 15, 2024</span>
            <span>•</span>
            <span>7 min read</span>
          </div>
        </header>

        {/* Quick Summary */}
        <Section variant="highlight">
          <h2 className="text-xl font-bold mb-3 text-text-900">
            Quick Summary
          </h2>
          <p className="text-text-700">
            Use Slackactivity to schedule your Slack availability automatically.
            Set your work hours once, configure your timezone, and the tool
            keeps you active only during your scheduled times. No manual updates
            needed - perfect for flexible work schedules and remote teams.
          </p>
        </Section>

        {/* Why Schedule Availability */}
        <Section>
          <h2 className="text-3xl font-bold mb-6 text-text-900">
            Why Schedule Slack Availability?
          </h2>
          <p className="text-lg text-text-700 mb-4">
            Scheduling your Slack availability is essential for:
          </p>
          <div className="space-y-4">
            <div className="flex items-start bg-background-50 p-4 rounded-lg border border-text-200">
              <CheckCircle className="w-5 h-5 text-text-800 mr-3 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-text-900">Work-Life Balance</strong>
                <p className="text-text-700">
                  Only appear online during work hours. Protect your personal
                  time without seeming unavailable during business hours.
                </p>
              </div>
            </div>
            <div className="flex items-start bg-background-50 p-4 rounded-lg border border-text-200">
              <CheckCircle className="w-5 h-5 text-text-800 mr-3 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-text-900">Professional Presence</strong>
                <p className="text-text-700">
                  Automatically appear active during your work hours, even when
                  you&apos;re in meetings or away from your desk.
                </p>
              </div>
            </div>
            <div className="flex items-start bg-background-50 p-4 rounded-lg border border-text-200">
              <CheckCircle className="w-5 h-5 text-text-800 mr-3 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-text-900">Flexible Schedules</strong>
                <p className="text-text-700">
                  Perfect for remote workers with non-traditional hours, split
                  shifts, or varying schedules by day.
                </p>
              </div>
            </div>
            <div className="flex items-start bg-background-50 p-4 rounded-lg border border-text-200">
              <CheckCircle className="w-5 h-5 text-text-800 mr-3 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-text-900">Time Zone Management</strong>
                <p className="text-text-700">
                  Especially important for distributed teams - your status
                  reflects your local work hours, not a fixed schedule.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* Step-by-Step Guide */}
        <Section variant="subtle">
          <h2 className="text-3xl font-bold mb-8 text-text-900">
            Step-by-Step: Schedule Your Slack Availability
          </h2>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="relative pl-12 pb-8 border-l-2 border-text-800">
              <div className="absolute left-0 top-0 -ml-4 w-8 h-8 bg-text-800 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-text-900">
                Sign Up for Slackactivity
              </h3>
              <p className="text-text-700 mb-4">
                Visit{" "}
                <Link
                  href="/"
                  className="text-text-800 hover:underline font-medium"
                >
                  Slackactivity.com
                </Link>{" "}
                and create your free account. Click &quot;Get Started - Free
                Forever&quot; and connect your Slack workspace using secure
                OAuth.
              </p>
              <Link
                href="/signin"
                className="inline-flex items-center text-text-800 hover:text-text-900 font-medium"
              >
                Create Free Account <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Step 2 */}
            <div className="relative pl-12 pb-8 border-l-2 border-text-800">
              <div className="absolute left-0 top-0 -ml-4 w-8 h-8 bg-text-800 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-text-900">
                Configure Your Timezone
              </h3>
              <p className="text-text-700 mb-4">
                Slackactivity automatically detects your timezone, but you can
                adjust it if needed. This ensures your schedule runs according
                to your local time, not UTC or another fixed timezone.
              </p>
              <div className="bg-background-100 p-4 rounded-lg border border-text-200">
                <p className="text-sm text-text-700">
                  <strong>Pro Tip:</strong> If you travel frequently (digital
                  nomads!), the tool adjusts automatically to your current
                  timezone. No need to manually update when you move locations.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative pl-12 pb-8 border-l-2 border-text-800">
              <div className="absolute left-0 top-0 -ml-4 w-8 h-8 bg-text-800 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-text-900">
                Set Your Work Hours
              </h3>
              <p className="text-text-700 mb-4">
                This is where you define when you want to appear active:
              </p>
              <div className="space-y-3 mb-4">
                <div className="bg-white border border-text-200 rounded-lg p-4">
                  <h4 className="font-semibold text-text-900 mb-2">
                    Monday - Friday
                  </h4>
                  <p className="text-text-700 text-sm mb-2">
                    Example: 9:00 AM - 5:00 PM
                  </p>
                  <p className="text-text-700 text-sm">
                    Set your standard work week hours. You can customize each
                    day individually if needed.
                  </p>
                </div>
                <div className="bg-white border border-text-200 rounded-lg p-4">
                  <h4 className="font-semibold text-text-900 mb-2">Weekends</h4>
                  <p className="text-text-700 text-sm mb-2">
                    Example: Disabled or Custom Hours
                  </p>
                  <p className="text-text-700 text-sm">
                    Turn off weekends completely, or set custom hours if you
                    work Saturdays/Sundays.
                  </p>
                </div>
                <div className="bg-white border border-text-200 rounded-lg p-4">
                  <h4 className="font-semibold text-text-900 mb-2">
                    Lunch Breaks (Optional)
                  </h4>
                  <p className="text-text-700 text-sm mb-2">
                    Example: 12:00 PM - 1:00 PM
                  </p>
                  <p className="text-text-700 text-sm">
                    Add break periods if you want to appear away during lunch.
                    Completely optional.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative pl-12">
              <div className="absolute left-0 top-0 -ml-4 w-8 h-8 bg-text-800 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-text-900">
                Enable Automation
              </h3>
              <p className="text-text-700 mb-4">
                Toggle the automation switch to &quot;On&quot;. Your Slack
                status will now automatically update according to your schedule.
                The tool updates your status every 5 minutes during your work
                hours to keep you active.
              </p>
              <div className="bg-background-100 border border-text-200 rounded-lg p-4">
                <p className="text-text-700">
                  <strong className="text-text-900">✓ Done!</strong> Your
                  availability is now scheduled. You can modify your schedule
                  anytime from the dashboard.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* Advanced Scheduling Options */}
        <Section>
          <h2 className="text-3xl font-bold mb-6 text-text-900">
            Advanced Scheduling Options
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <FeatureCard
              icon={<Calendar className="w-10 h-10" />}
              title="Different Hours Per Day"
              description="Set unique work hours for each day. Perfect for flexible schedules like early Mondays, late Thursdays, or half-day Fridays."
            />
            <FeatureCard
              icon={<Clock className="w-10 h-10" />}
              title="Split Shifts"
              description="Work mornings and evenings? Configure multiple time blocks per day for split shift schedules."
            />
            <FeatureCard
              icon={<Globe className="w-10 h-10" />}
              title="Automatic Timezone"
              description="Traveling? The tool automatically adjusts to your current timezone without manual configuration."
            />
            <FeatureCard
              icon={<CheckCircle className="w-10 h-10" />}
              title="Holiday Mode"
              description="Disable specific dates for holidays or vacation days. Resume automatically when you return."
            />
          </div>
        </Section>

        {/* Common Scheduling Scenarios */}
        <Section variant="subtle">
          <h2 className="text-3xl font-bold mb-6 text-text-900">
            Common Scheduling Scenarios
          </h2>
          <div className="space-y-6">
            <div className="bg-white border border-text-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-text-900">
                Standard 9-5 Schedule
              </h3>
              <p className="text-text-700 mb-3">
                <strong>Use case:</strong> Traditional office hours,
                Monday-Friday
              </p>
              <p className="text-text-700">
                <strong>Setup:</strong> Mon-Fri: 9:00 AM - 5:00 PM, Sat-Sun:
                Disabled. This keeps you active during standard business hours
                and offline on weekends.
              </p>
            </div>

            <div className="bg-white border border-text-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-text-900">
                Flexible Remote Schedule
              </h3>
              <p className="text-text-700 mb-3">
                <strong>Use case:</strong> Early mornings and late evenings,
                variable by day
              </p>
              <p className="text-text-700">
                <strong>Setup:</strong> Mon/Wed/Fri: 7:00 AM - 3:00 PM, Tue/Thu:
                1:00 PM - 9:00 PM. Perfect for those with family commitments or
                personal preferences.
              </p>
            </div>

            <div className="bg-white border border-text-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-text-900">
                Digital Nomad Schedule
              </h3>
              <p className="text-text-700 mb-3">
                <strong>Use case:</strong> Working across time zones while
                traveling
              </p>
              <p className="text-text-700">
                <strong>Setup:</strong> Set your preferred work hours (e.g.,
                10:00 AM - 6:00 PM). As you travel, the timezone automatically
                adjusts so 10 AM in Tokyo shows as 10 AM in Bali.
              </p>
            </div>

            <div className="bg-white border border-text-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-text-900">
                Part-Time or Split Shift
              </h3>
              <p className="text-text-700 mb-3">
                <strong>Use case:</strong> Working around childcare, school, or
                other commitments
              </p>
              <p className="text-text-700">
                <strong>Setup:</strong> 6:00 AM - 9:00 AM and 1:00 PM - 5:00 PM.
                Appear active during both work periods, offline during personal
                time.
              </p>
            </div>
          </div>
        </Section>

        {/* FAQ */}
        <Section>
          <h2 className="text-3xl font-bold mb-8 text-text-900">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <FAQItem
              question="Can I change my schedule anytime?"
              answer="Yes! You can modify your work hours, timezone, or any schedule settings anytime from your dashboard. Changes take effect immediately."
            />
            <FAQItem
              question="What happens outside my scheduled hours?"
              answer="Outside your scheduled hours, Slackactivity does nothing - your status reflects your actual activity. The tool only keeps you active during your configured work times."
            />
            <FAQItem
              question="Can I schedule different hours for different workspaces?"
              answer="Yes! If you manage multiple Slack workspaces, you can set different schedules for each one. Perfect for freelancers with multiple clients."
            />
            <FAQItem
              question="Does the schedule account for holidays?"
              answer="You can manually disable specific dates for holidays or vacation. We're working on automatic holiday detection based on your location."
            />
            <FAQItem
              question="What if I want to appear away during my scheduled hours?"
              answer="You can manually set a custom status (like 'In a meeting' or 'Do not disturb') and Slackactivity will respect it while keeping your presence indicator active."
            />
          </div>
        </Section>

        {/* CTA Section */}
        <CTASection
          title="Ready to Schedule Your Slack Availability?"
          description="Set up automated availability scheduling in under 2 minutes. No credit card required."
          primaryCTA={{ text: "Get Started - Free Forever", href: "/signin" }}
          secondaryCTA={{ text: "Learn More", href: "/how-it-works" }}
        />
      </SEOPageLayout>
    </>
  );
}
