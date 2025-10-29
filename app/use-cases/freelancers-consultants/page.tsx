import { Metadata } from "next";
import { CheckCircle, Users, Globe, Clock, Zap, Briefcase } from "lucide-react";
import {
  SEOPageLayout,
  CTAButton,
  Section,
  FeatureCard,
  CTASection,
  FAQItem,
} from "@/components/seo/SEOPageLayout";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { MultipleStructuredData } from "@/components/seo/StructuredData";
import {
  generateBreadcrumbStructuredData,
  generateArticleStructuredData,
  generateSoftwareApplicationStructuredData,
} from "@/lib/seo/config";

export const metadata: Metadata = {
  title:
    "Slack for Freelancers & Consultants - Manage Multiple Client Workspaces",
  description:
    "Manage 3-5+ client Slack workspaces from one dashboard. Sync status across all clients, maintain professional presence, and save hours weekly. Free forever for freelancers.",
  keywords: [
    "slack for freelancers",
    "slack for consultants",
    "manage multiple slack workspaces",
    "freelance slack management",
    "client workspace management",
    "multi-workspace slack tool",
    "consultant slack automation",
  ],
};

const breadcrumbItems = [
  { name: "Home", url: "https://slackactivity.com" },
  { name: "Use Cases", url: "https://slackactivity.com/use-cases" },
  {
    name: "Freelancers & Consultants",
    url: "https://slackactivity.com/use-cases/freelancers-consultants",
  },
];

const structuredData = [
  generateBreadcrumbStructuredData(breadcrumbItems),
  generateArticleStructuredData(
    "Slack for Freelancers & Consultants - Manage Multiple Client Workspaces",
    "Comprehensive guide for freelancers and consultants managing multiple Slack workspaces efficiently",
    "2024-01-15",
    "2024-01-15"
  ),
  generateSoftwareApplicationStructuredData(),
];

export default function FreelancersConsultantsPage() {
  return (
    <>
      <MultipleStructuredData dataArray={structuredData} />

      <SEOPageLayout>
        <Breadcrumbs items={breadcrumbItems} />

        {/* Hero Section */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-text-900">
            Slack for Freelancers & Consultants: Manage Multiple Client
            Workspaces Effortlessly
          </h1>
          <p className="text-xl text-text-600 mb-4">
            Juggling 3, 4, or 5+ client Slack workspaces? Stay active across all
            of them without the constant switching, manual status updates, or
            missed messages. Manage everything from one centralized dashboard -
            completely free, forever.
          </p>
          <div className="flex items-center gap-2 text-sm text-text-500 mb-8">
            <span>Last updated: January 15, 2024</span>
            <span>•</span>
            <span>12 min read</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <CTAButton href="/signin" variant="primary">
              Get Started - Free Forever
            </CTAButton>
            <CTAButton href="/how-it-works" variant="secondary">
              See How It Works
            </CTAButton>
          </div>
        </header>

        {/* Quick Summary */}
        <Section variant="highlight">
          <h2 className="text-xl font-bold mb-3 text-text-900">
            Quick Summary
          </h2>
          <p className="text-text-700">
            Slackactivity is built for freelancers and consultants managing
            multiple client Slack workspaces. Connect unlimited workspaces, sync
            your status across all clients automatically, and maintain a
            professional presence 24/7 - without manually updating each
            workspace. Save 5-10 hours per week on workspace management. No
            credit card required, free forever.
          </p>
        </Section>

        {/* The Freelancer's Dilemma */}
        <Section>
          <h2 className="text-3xl font-bold mb-6 text-text-900">
            The Multi-Workspace Challenge for Freelancers
          </h2>
          <p className="text-lg text-text-700 mb-6">
            If you&apos;re a freelancer or consultant, you know the struggle.
            Each client wants you in their Slack workspace. You&apos;re
            constantly switching between 4, 5, sometimes 6+ different workspaces
            throughout the day. And each one shows you as &quot;away&quot; when
            you&apos;re not actively in it.
          </p>
          <div className="space-y-4">
            <div className="flex items-start bg-background-50 p-4 rounded-lg border border-text-200">
              <div className="mr-4 text-3xl">😰</div>
              <div>
                <strong className="text-text-900">Appearing Unavailable</strong>
                <p className="text-text-700">
                  You&apos;re actively working for Client A, but Clients B, C,
                  and D all see you as &quot;away&quot; in their workspaces.
                  This makes you look unavailable or unprofessional, even though
                  you&apos;re fully engaged with work.
                </p>
              </div>
            </div>
            <div className="flex items-start bg-background-50 p-4 rounded-lg border border-text-200">
              <div className="mr-4 text-3xl">⏰</div>
              <div>
                <strong className="text-text-900">
                  Constant Workspace Switching
                </strong>
                <p className="text-text-700">
                  Every time a message comes in, you have to switch to that
                  workspace, mark yourself active, respond, then switch back.
                  This context switching kills your productivity and drains
                  mental energy.
                </p>
              </div>
            </div>
            <div className="flex items-start bg-background-50 p-4 rounded-lg border border-text-200">
              <div className="mr-4 text-3xl">🕐</div>
              <div>
                <strong className="text-text-900">Time Zone Confusion</strong>
                <p className="text-text-700">
                  Your clients are spread across different time zones. Some
                  expect responses during their business hours, others work odd
                  hours. Managing availability across multiple time zones
                  manually is nearly impossible.
                </p>
              </div>
            </div>
            <div className="flex items-start bg-background-50 p-4 rounded-lg border border-text-200">
              <div className="mr-4 text-3xl">💼</div>
              <div>
                <strong className="text-text-900">
                  Professional Image at Risk
                </strong>
                <p className="text-text-700">
                  Clients are paying premium rates. When you appear
                  &quot;away&quot; frequently, it raises questions about your
                  availability and dedication - even if you&apos;re working 50+
                  hours a week.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* How Slackactivity Solves This */}
        <Section variant="subtle">
          <h2 className="text-3xl font-bold mb-6 text-text-900">
            How Slackactivity Solves Multi-Workspace Management
          </h2>
          <p className="text-lg text-text-700 mb-6">
            Slackactivity was designed specifically for professionals managing
            multiple Slack workspaces. Here&apos;s how it transforms your
            workflow:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <FeatureCard
              icon={<Users className="w-10 h-10" />}
              title="Unlimited Workspaces"
              description="Connect all your client workspaces - 3, 5, 10, or more. No limits on the free plan. Manage everything from one dashboard without upgrading."
            />
            <FeatureCard
              icon={<Zap className="w-10 h-10" />}
              title="Synchronized Status"
              description="Set your status once, apply it everywhere. When you're active, all your clients see you as active. One update syncs across all workspaces instantly."
            />
            <FeatureCard
              icon={<Clock className="w-10 h-10" />}
              title="Automatic Presence Management"
              description="Stay active across all workspaces during your work hours - even when you're not actively using Slack. No manual updates needed."
            />
            <FeatureCard
              icon={<Globe className="w-10 h-10" />}
              title="Per-Workspace Schedules"
              description="Different clients in different time zones? Set custom work hours for each workspace to match each client's expectations."
            />
          </div>
        </Section>

        {/* Real Freelancer Scenarios */}
        <Section>
          <h2 className="text-3xl font-bold mb-6 text-text-900">
            Real Scenarios: How Freelancers Use Slackactivity
          </h2>
          <div className="space-y-6">
            <div className="bg-white border border-text-200 rounded-lg p-6">
              <div className="flex items-start mb-4">
                <Briefcase className="w-8 h-8 text-text-800 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-text-900">
                    Sarah - Freelance Full-Stack Developer
                  </h3>
                  <p className="text-sm text-text-500 mb-3">
                    4 Active Clients, 4 Slack Workspaces
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <strong className="text-text-900">The Challenge:</strong>
                  <p className="text-text-700">
                    Sarah works with 4 different startups, each requiring her to
                    be in their Slack workspace. She found herself constantly
                    switching between workspaces to appear online, often missing
                    messages because she was focused in one workspace while
                    another client needed her.
                  </p>
                </div>
                <div>
                  <strong className="text-text-900">The Solution:</strong>
                  <p className="text-text-700">
                    Connected all 4 workspaces to Slackactivity. Set her work
                    hours to 9 AM - 6 PM Monday-Friday. Now she appears active
                    in all 4 workspaces simultaneously during work hours,
                    regardless of which one she&apos;s actively using.
                  </p>
                </div>
                <div>
                  <strong className="text-text-900">The Result:</strong>
                  <p className="text-text-700">
                    Saves 8-10 hours per week in workspace switching time.
                    Clients respond faster because they see her as available.
                    Got two new referrals from satisfied clients who appreciate
                    her responsiveness.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-text-200 rounded-lg p-6">
              <div className="flex items-start mb-4">
                <Briefcase className="w-8 h-8 text-text-800 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-text-900">
                    Marcus - Marketing Consultant
                  </h3>
                  <p className="text-sm text-text-500 mb-3">
                    6 Clients Across 3 Time Zones
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <strong className="text-text-900">The Challenge:</strong>
                  <p className="text-text-700">
                    Marcus consults for companies in EST, PST, and GMT time
                    zones. Each client expects him to be available during their
                    business hours. He was working 14+ hour days trying to
                    accommodate everyone and still appearing &quot;away&quot;
                    half the time.
                  </p>
                </div>
                <div>
                  <strong className="text-text-900">The Solution:</strong>
                  <p className="text-text-700">
                    Set up workspace-specific schedules in Slackactivity. His
                    EST clients see him active 9-5 EST, PST clients see him
                    active during their hours, and GMT clients during theirs -
                    all automatically managed without him lifting a finger.
                  </p>
                </div>
                <div>
                  <strong className="text-text-900">The Result:</strong>
                  <p className="text-text-700">
                    Cut his actual work hours from 70 to 45 per week while
                    maintaining better client satisfaction. Clients think
                    he&apos;s incredibly responsive. He&apos;s raised his rates
                    by 30% based on his &quot;availability&quot; reputation.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-text-200 rounded-lg p-6">
              <div className="flex items-start mb-4">
                <Briefcase className="w-8 h-8 text-text-800 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-text-900">
                    Priya - UX/UI Design Consultant
                  </h3>
                  <p className="text-sm text-text-500 mb-3">
                    3 Major Clients + 2 Small Projects
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <strong className="text-text-900">The Challenge:</strong>
                  <p className="text-text-700">
                    Priya dedicates specific days to specific clients
                    (Monday/Tuesday for Client A, Wednesday/Thursday for Client
                    B, etc.). But all clients wanted her to appear available in
                    their Slack every day, which meant manually updating 5
                    workspaces every morning and evening.
                  </p>
                </div>
                <div>
                  <strong className="text-text-900">The Solution:</strong>
                  <p className="text-text-700">
                    Connected all 5 workspaces to Slackactivity and set a
                    consistent 9-6 schedule. Now she appears active across all
                    workspaces during work hours, even on days she&apos;s not
                    actively working for that particular client.
                  </p>
                </div>
                <div>
                  <strong className="text-text-900">The Result:</strong>
                  <p className="text-text-700">
                    Eliminated 2 hours per day of manual status management.
                    Clients feel more connected even when she&apos;s working for
                    others. Can respond to urgent requests without clients
                    feeling like she&apos;s &quot;never there.&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Key Benefits for Freelancers */}
        <Section variant="subtle">
          <h2 className="text-3xl font-bold mb-6 text-text-900">
            Key Benefits for Freelancers & Consultants
          </h2>
          <div className="space-y-4">
            <div className="flex items-start bg-white p-5 rounded-lg border border-text-200">
              <CheckCircle className="w-6 h-6 text-text-800 mr-4 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-text-900 text-lg">
                  Save 5-10 Hours Weekly
                </strong>
                <p className="text-text-700 mt-1">
                  Stop manually switching between workspaces to update your
                  status. That&apos;s 20-40 hours per month you can spend on
                  billable work or growing your business.
                </p>
              </div>
            </div>
            <div className="flex items-start bg-white p-5 rounded-lg border border-text-200">
              <CheckCircle className="w-6 h-6 text-text-800 mr-4 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-text-900 text-lg">
                  Professional Image Across All Clients
                </strong>
                <p className="text-text-700 mt-1">
                  Appear consistently available and professional. Clients see
                  you as responsive and dedicated, which leads to longer
                  contracts, better rates, and more referrals.
                </p>
              </div>
            </div>
            <div className="flex items-start bg-white p-5 rounded-lg border border-text-200">
              <CheckCircle className="w-6 h-6 text-text-800 mr-4 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-text-900 text-lg">
                  Better Work-Life Boundaries
                </strong>
                <p className="text-text-700 mt-1">
                  Set your work hours once, and automatically appear offline
                  outside those times across all workspaces. No more late-night
                  pings from clients expecting immediate responses.
                </p>
              </div>
            </div>
            <div className="flex items-start bg-white p-5 rounded-lg border border-text-200">
              <CheckCircle className="w-6 h-6 text-text-800 mr-4 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-text-900 text-lg">
                  Manage Time Zones Effortlessly
                </strong>
                <p className="text-text-700 mt-1">
                  Clients in New York, London, and Singapore? Set
                  workspace-specific schedules that match each client&apos;s
                  time zone expectations automatically.
                </p>
              </div>
            </div>
            <div className="flex items-start bg-white p-5 rounded-lg border border-text-200">
              <CheckCircle className="w-6 h-6 text-text-800 mr-4 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-text-900 text-lg">
                  Completely Free for Unlimited Workspaces
                </strong>
                <p className="text-text-700 mt-1">
                  Unlike other tools, Slackactivity doesn&apos;t charge per
                  workspace or user. Connect 3, 5, 10+ workspaces - all free,
                  forever. No hidden fees, no upgrade requirements.
                </p>
              </div>
            </div>
            <div className="flex items-start bg-white p-5 rounded-lg border border-text-200">
              <CheckCircle className="w-6 h-6 text-text-800 mr-4 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-text-900 text-lg">
                  Reduce Mental Load
                </strong>
                <p className="text-text-700 mt-1">
                  Stop tracking which workspace you need to be active in. Stop
                  worrying about appearing away. The mental relief alone is
                  worth it - focus on actual work, not workspace management.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* How It Works */}
        <Section>
          <h2 className="text-3xl font-bold mb-8 text-text-900">
            How It Works: Setup in Under 5 Minutes
          </h2>
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="relative pl-12 pb-8 border-l-2 border-text-800">
              <div className="absolute left-0 top-0 -ml-4 w-8 h-8 bg-text-800 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-text-900">
                Create Your Free Account
              </h3>
              <p className="text-text-700 mb-4">
                Sign up at Slackactivity.com - no credit card required. Click
                &quot;Get Started - Free Forever&quot; and you&apos;ll be up and
                running in 30 seconds.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative pl-12 pb-8 border-l-2 border-text-800">
              <div className="absolute left-0 top-0 -ml-4 w-8 h-8 bg-text-800 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-text-900">
                Connect All Your Client Workspaces
              </h3>
              <p className="text-text-700 mb-4">
                Use the &quot;Add Workspace&quot; button to connect each client
                workspace via secure OAuth. You&apos;ll authorize Slackactivity
                to manage your presence - it takes 10 seconds per workspace.
              </p>
              <div className="bg-background-100 p-4 rounded-lg border border-text-200">
                <p className="text-sm text-text-700">
                  <strong>Security Note:</strong> Slackactivity only requests
                  permission to manage your status. We can&apos;t read your
                  messages, access files, or see workspace content. Your client
                  data stays completely private.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative pl-12 pb-8 border-l-2 border-text-800">
              <div className="absolute left-0 top-0 -ml-4 w-8 h-8 bg-text-800 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-text-900">
                Set Your Availability Schedule
              </h3>
              <p className="text-text-700 mb-4">
                Choose between global schedule (same hours for all clients) or
                per-workspace schedules (different hours for different time
                zones). Most freelancers start with a global schedule.
              </p>
              <div className="space-y-2 text-text-700">
                <p>
                  <strong>Example Global Schedule:</strong> Monday-Friday, 9 AM
                  - 6 PM (your time zone)
                </p>
                <p>
                  <strong>Example Per-Workspace:</strong> Client A (EST): 9 AM -
                  5 PM EST, Client B (PST): 10 AM - 6 PM PST
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative pl-12">
              <div className="absolute left-0 top-0 -ml-4 w-8 h-8 bg-text-800 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-text-900">
                Enable Automation and Relax
              </h3>
              <p className="text-text-700 mb-4">
                Flip the automation switch to &quot;On&quot; for each workspace.
                That&apos;s it! You&apos;ll now appear active across all
                connected workspaces during your scheduled hours, automatically.
              </p>
              <div className="bg-background-100 border border-text-200 rounded-lg p-4">
                <p className="text-text-700">
                  <strong className="text-text-900">✓ You&apos;re Done!</strong>{" "}
                  Slackactivity runs in the background 24/7. You never have to
                  manually update your status again. Manage everything from your
                  dashboard.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* Common Freelancer Concerns */}
        <Section variant="subtle">
          <h2 className="text-3xl font-bold mb-6 text-text-900">
            Common Concerns from Freelancers
          </h2>
          <div className="space-y-5">
            <div className="bg-white border border-text-200 rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-2 text-text-900">
                &quot;Will clients know I&apos;m using a tool?&quot;
              </h3>
              <p className="text-text-700">
                No. Slackactivity works exactly like you being naturally active
                on Slack. There&apos;s no indication to clients that you&apos;re
                using automation. Your status just shows as &quot;Active&quot;
                like normal.
              </p>
            </div>
            <div className="bg-white border border-text-200 rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-2 text-text-900">
                &quot;Is it really free for multiple workspaces?&quot;
              </h3>
              <p className="text-text-700">
                Yes! Unlike most tools that charge per workspace or have
                workspace limits, Slackactivity is free forever with unlimited
                workspaces. We built this specifically for freelancers who need
                multi-workspace support without breaking the bank.
              </p>
            </div>
            <div className="bg-white border border-text-200 rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-2 text-text-900">
                &quot;What if I want to appear away for one client but active
                for others?&quot;
              </h3>
              <p className="text-text-700">
                You have full control. You can enable/disable automation for
                specific workspaces, set different schedules, or pause
                automation temporarily for individual clients while keeping
                others running.
              </p>
            </div>
            <div className="bg-white border border-text-200 rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-2 text-text-900">
                &quot;Can I still set custom status messages?&quot;
              </h3>
              <p className="text-text-700">
                Absolutely. Set custom statuses like &quot;In a client
                call&quot; or &quot;Deep work mode&quot; and Slackactivity will
                keep your presence active while respecting your custom message.
              </p>
            </div>
            <div className="bg-white border border-text-200 rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-2 text-text-900">
                &quot;What about data privacy and security?&quot;
              </h3>
              <p className="text-text-700">
                We take security seriously. Slackactivity only requests
                permission to manage your presence status. We cannot read
                messages, access files, or see any client data. Your
                conversations and work remain 100% private. We&apos;re
                OAuth-authenticated and follow Slack&apos;s security best
                practices.
              </p>
            </div>
          </div>
        </Section>

        {/* Advanced Features */}
        <Section>
          <h2 className="text-3xl font-bold mb-6 text-text-900">
            Advanced Features for Power Freelancers
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-background-50 p-6 rounded-lg border border-text-200">
              <h3 className="text-xl font-semibold mb-3 text-text-900">
                Workspace Groups
              </h3>
              <p className="text-text-700">
                Group similar clients together and manage their schedules as a
                unit. Perfect if you have multiple clients in the same time zone
                or with similar availability requirements.
              </p>
            </div>
            <div className="bg-background-50 p-6 rounded-lg border border-text-200">
              <h3 className="text-xl font-semibold mb-3 text-text-900">
                Quick Toggle
              </h3>
              <p className="text-text-700">
                Need to go offline across all workspaces instantly? One-click
                &quot;Pause All&quot; button lets you disable automation
                everywhere when you need a real break.
              </p>
            </div>
            <div className="bg-background-50 p-6 rounded-lg border border-text-200">
              <h3 className="text-xl font-semibold mb-3 text-text-900">
                Activity Dashboard
              </h3>
              <p className="text-text-700">
                See all your connected workspaces at a glance. Know which ones
                are active, what your current status is, and manage everything
                from one central location.
              </p>
            </div>
            <div className="bg-background-50 p-6 rounded-lg border border-text-200">
              <h3 className="text-xl font-semibold mb-3 text-text-900">
                Vacation Mode
              </h3>
              <p className="text-text-700">
                Going on vacation? Set a date range to automatically disable all
                workspaces, then re-enable them when you return. No need to
                manually toggle each one.
              </p>
            </div>
          </div>
        </Section>

        {/* Pricing Comparison */}
        <Section variant="subtle">
          <h2 className="text-3xl font-bold mb-6 text-text-900">
            Why Slackactivity is Free (When Others Charge $100+/month)
          </h2>
          <p className="text-lg text-text-700 mb-6">
            We know freelancers already deal with tight margins and
            unpredictable income. That&apos;s why Slackactivity is free forever,
            with no workspace limits. Compare that to alternatives:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-text-800 text-white">
                  <th className="text-left p-4 border border-text-700">
                    Feature
                  </th>
                  <th className="text-center p-4 border border-text-700">
                    Slackactivity
                  </th>
                  <th className="text-center p-4 border border-text-700">
                    Other Tools
                  </th>
                </tr>
              </thead>
              <tbody className="text-text-700">
                <tr className="bg-white">
                  <td className="p-4 border border-text-200">Price</td>
                  <td className="p-4 border border-text-200 text-center font-bold text-text-900">
                    Free Forever
                  </td>
                  <td className="p-4 border border-text-200 text-center">
                    $15-50/month per workspace
                  </td>
                </tr>
                <tr className="bg-background-50">
                  <td className="p-4 border border-text-200">
                    Unlimited Workspaces
                  </td>
                  <td className="p-4 border border-text-200 text-center">✓</td>
                  <td className="p-4 border border-text-200 text-center">
                    ✗ (Usually 1-3 max on free)
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="p-4 border border-text-200">
                    Per-Workspace Schedules
                  </td>
                  <td className="p-4 border border-text-200 text-center">✓</td>
                  <td className="p-4 border border-text-200 text-center">
                    ✗ (Usually paid only)
                  </td>
                </tr>
                <tr className="bg-background-50">
                  <td className="p-4 border border-text-200">
                    Sync Status Across All
                  </td>
                  <td className="p-4 border border-text-200 text-center">✓</td>
                  <td className="p-4 border border-text-200 text-center">
                    Varies
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="p-4 border border-text-200">
                    No Credit Card Required
                  </td>
                  <td className="p-4 border border-text-200 text-center">✓</td>
                  <td className="p-4 border border-text-200 text-center">✗</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-text-700 mt-6">
            <strong>Our mission:</strong> Make professional workspace management
            accessible to all freelancers, regardless of budget. We believe
            better tools lead to better work-life balance and more successful
            independent careers.
          </p>
        </Section>

        {/* FAQ */}
        <Section>
          <h2 className="text-3xl font-bold mb-8 text-text-900">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <FAQItem
              question="How many workspaces can I connect on the free plan?"
              answer="Unlimited! Connect as many client workspaces as you need. We don't impose workspace limits because we built this tool specifically for freelancers and consultants who need multi-workspace support."
            />
            <FAQItem
              question="Can I set different schedules for different client workspaces?"
              answer="Yes. You can configure workspace-specific schedules if your clients are in different time zones or have different availability expectations. Or use a global schedule if you want the same hours across all clients."
            />
            <FAQItem
              question="What happens if a client removes me from their workspace?"
              answer="If you're removed from a workspace, Slackactivity automatically detects this and stops managing that workspace. You can reconnect it anytime if you regain access, or simply remove it from your dashboard."
            />
            <FAQItem
              question="Will this work with Slack Connect channels?"
              answer="Yes! If you're in Slack Connect channels with clients (rather than full workspace access), Slackactivity still keeps you active. The automation works across all Slack workspace types."
            />
            <FAQItem
              question="Can I temporarily pause automation for one client but keep others running?"
              answer="Absolutely. Each workspace has its own toggle switch. You can enable/disable automation per workspace without affecting the others. Great for when you're between projects with one client but active with others."
            />
          </div>
        </Section>

        {/* CTA Section */}
        <CTASection
          title="Ready to Take Control of Your Client Workspaces?"
          description="Join thousands of freelancers and consultants who've eliminated workspace chaos. Set up takes 5 minutes. No credit card required, free forever."
          primaryCTA={{ text: "Get Started - Free Forever", href: "/signin" }}
          secondaryCTA={{ text: "See How It Works", href: "/how-it-works" }}
        />
      </SEOPageLayout>
    </>
  );
}
