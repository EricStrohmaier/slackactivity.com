import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, Layout, Zap, Globe, Users, TrendingUp, ArrowRight, Settings } from 'lucide-react';
import {
  SEOPageLayout,
  CTAButton,
  Section,
  FeatureCard,
  CTASection,
  FAQItem,
} from '@/components/seo/SEOPageLayout';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { MultipleStructuredData } from '@/components/seo/StructuredData';
import {
  generateBreadcrumbStructuredData,
  generateHowToStructuredData,
  generateArticleStructuredData,
} from '@/lib/seo/config';

export const metadata: Metadata = {
  title: 'How to Manage Multiple Slack Workspaces Efficiently - Complete Guide',
  description:
    'Master managing 3, 5, or 10+ Slack workspaces. Sync status across all workspaces, centralized control, and save hours weekly. Complete guide with step-by-step instructions.',
  keywords: [
    'manage multiple slack workspaces',
    'multiple slack accounts',
    'slack workspace management',
    'sync slack status across workspaces',
    'multi workspace slack tool',
    'slack workspace organization',
  ],
};

const breadcrumbItems = [
  { name: 'Home', url: 'https://slackactivity.com' },
  { name: 'Guides', url: 'https://slackactivity.com/guides' },
  {
    name: 'Manage Multiple Slack Workspaces',
    url: 'https://slackactivity.com/guides/manage-multiple-slack-workspaces',
  },
];

const howToSteps = [
  {
    name: 'Identify your workspace management needs',
    text: 'Determine how many workspaces you need to manage and what your specific challenges are - time zone differences, status synchronization, or schedule management.',
  },
  {
    name: 'Create a Slackactivity account',
    text: 'Sign up for free at Slackactivity.com and prepare to connect all your Slack workspaces through secure OAuth authentication.',
  },
  {
    name: 'Connect all your workspaces',
    text: 'Add each Slack workspace to your Slackactivity dashboard. No limits on the number of workspaces - connect 3, 5, 10, or more.',
  },
  {
    name: 'Configure global or per-workspace settings',
    text: 'Choose between syncing the same status across all workspaces or setting custom schedules for each one based on your needs.',
  },
  {
    name: 'Enable automation and monitor',
    text: 'Activate presence automation for all workspaces and manage everything from one centralized dashboard.',
  },
];

const structuredData = [
  generateBreadcrumbStructuredData(breadcrumbItems),
  generateHowToStructuredData(
    'How to Manage Multiple Slack Workspaces Efficiently',
    'Step-by-step guide to managing multiple Slack workspaces with automated status synchronization',
    howToSteps
  ),
  generateArticleStructuredData(
    'How to Manage Multiple Slack Workspaces Efficiently - Complete Guide',
    'Comprehensive guide to managing 3+ Slack workspaces efficiently with centralized control',
    '2024-01-15',
    '2024-01-15'
  ),
];

export default function ManageMultipleSlackWorkspacesPage() {
  return (
    <>
      <MultipleStructuredData dataArray={structuredData} />

      <SEOPageLayout>
        <Breadcrumbs items={breadcrumbItems} />

        {/* Hero Section */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-text-900">
            How to Manage Multiple Slack Workspaces Efficiently
          </h1>
          <p className="text-xl text-text-600 mb-4">
            Complete guide to managing 3, 5, or 10+ Slack workspaces without the chaos. Learn how to sync your
            status across all workspaces, set centralized schedules, and save 5-10 hours weekly on workspace
            management. Perfect for freelancers, consultants, and multi-company employees.
          </p>
          <div className="flex items-center gap-2 text-sm text-text-500 mb-8">
            <span>Last updated: January 15, 2024</span>
            <span>•</span>
            <span>14 min read</span>
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
          <h2 className="text-xl font-bold mb-3 text-text-900">Quick Summary</h2>
          <p className="text-text-700">
            Managing multiple Slack workspaces becomes effortless with Slackactivity. Connect all your workspaces
            to one dashboard, sync your status automatically across every workspace, and set either global schedules
            or per-workspace configurations. No more manually updating each workspace or appearing away in workspaces
            you&apos;re not actively using. Free forever with unlimited workspaces.
          </p>
        </Section>

        {/* The Multi-Workspace Challenge */}
        <Section>
          <h2 className="text-3xl font-bold mb-6 text-text-900">
            The Multi-Workspace Challenge: Why It&apos;s So Difficult
          </h2>
          <p className="text-lg text-text-700 mb-6">
            If you&apos;re managing multiple Slack workspaces, you already know the pain. It&apos;s not just about
            switching between them - it&apos;s about maintaining presence, managing availability, and avoiding the
            perception that you&apos;re never online.
          </p>
          <div className="space-y-4">
            <div className="flex items-start bg-background-50 p-5 rounded-lg border border-text-200">
              <div className="mr-4 text-3xl">🔄</div>
              <div>
                <strong className="text-text-900 text-lg">Constant Context Switching</strong>
                <p className="text-text-700 mt-1">
                  Every time you switch to a different workspace, you lose mental context. You have to remember
                  which workspace is for which client, team, or project. The cognitive load adds up fast when
                  managing 3+ workspaces.
                </p>
              </div>
            </div>
            <div className="flex items-start bg-background-50 p-5 rounded-lg border border-text-200">
              <div className="mr-4 text-3xl">👻</div>
              <div>
                <strong className="text-text-900 text-lg">The &quot;Always Away&quot; Problem</strong>
                <p className="text-text-700 mt-1">
                  You&apos;re actively working in Workspace A, but Workspaces B, C, and D all show you as
                  &quot;away.&quot; This makes you look unavailable or unresponsive across most of your workspaces,
                  even though you&apos;re working full-time.
                </p>
              </div>
            </div>
            <div className="flex items-start bg-background-50 p-5 rounded-lg border border-text-200">
              <div className="mr-4 text-3xl">⏰</div>
              <div>
                <strong className="text-text-900 text-lg">Manual Status Management Nightmare</strong>
                <p className="text-text-700 mt-1">
                  To appear professional, you try to manually update your status in each workspace throughout the
                  day. With 5 workspaces, that&apos;s opening each one, updating status, checking messages - multiple
                  times daily. That&apos;s easily 1-2 hours wasted per day.
                </p>
              </div>
            </div>
            <div className="flex items-start bg-background-50 p-5 rounded-lg border border-text-200">
              <div className="mr-4 text-3xl">🌍</div>
              <div>
                <strong className="text-text-900 text-lg">Time Zone Complexity</strong>
                <p className="text-text-700 mt-1">
                  Different workspaces expect you during different hours. Your US client wants you online 9-5 EST.
                  Your European client expects you mornings GMT. Your Asia-Pacific workspace needs evening coverage.
                  Managing this manually is impossible.
                </p>
              </div>
            </div>
            <div className="flex items-start bg-background-50 p-5 rounded-lg border border-text-200">
              <div className="mr-4 text-3xl">💬</div>
              <div>
                <strong className="text-text-900 text-lg">Missed Messages and Opportunities</strong>
                <p className="text-text-700 mt-1">
                  You check Workspace A thoroughly, but you only scan Workspaces B and C. Important messages slip
                  through. Urgent requests go unanswered. You miss opportunities to contribute or help because you
                  didn&apos;t see the message in time.
                </p>
              </div>
            </div>
            <div className="flex items-start bg-background-50 p-5 rounded-lg border border-text-200">
              <div className="mr-4 text-3xl">😰</div>
              <div>
                <strong className="text-text-900 text-lg">Professional Reputation Risk</strong>
                <p className="text-text-700 mt-1">
                  Each workspace sees you as frequently unavailable. Clients or managers might think you&apos;re not
                  dedicated, hard to reach, or perhaps working for someone else. Your professional reputation
                  suffers even though you&apos;re working harder than ever.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* Common Multi-Workspace Scenarios */}
        <Section variant="subtle">
          <h2 className="text-3xl font-bold mb-6 text-text-900">
            Who Needs Multi-Workspace Management?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-text-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-text-900">Freelancers & Consultants</h3>
              <p className="text-text-700 mb-3">
                Managing 3-10 client workspaces simultaneously. Each client expects your presence and
                responsiveness in their workspace.
              </p>
              <p className="text-sm text-text-600">
                <strong>Challenge:</strong> Appearing active for all clients without manually switching between
                workspaces constantly.
              </p>
            </div>
            <div className="bg-white border border-text-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-text-900">Agency Workers</h3>
              <p className="text-text-700 mb-3">
                Your agency has its own workspace, plus you&apos;re in each client&apos;s workspace. That&apos;s 4-6
                workspaces minimum.
              </p>
              <p className="text-sm text-text-600">
                <strong>Challenge:</strong> Balancing internal agency communication with client-facing presence
                across multiple workspaces.
              </p>
            </div>
            <div className="bg-white border border-text-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-text-900">Multi-Company Employees</h3>
              <p className="text-text-700 mb-3">
                Working part-time for 2-3 companies, or contracting for multiple organizations at once.
              </p>
              <p className="text-sm text-text-600">
                <strong>Challenge:</strong> Each company expects you during specific hours, and all want to see you
                as active and engaged.
              </p>
            </div>
            <div className="bg-white border border-text-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-text-900">Remote Team Leaders</h3>
              <p className="text-text-700 mb-3">
                Managing teams across different company divisions, partner organizations, or cross-functional
                groups.
              </p>
              <p className="text-sm text-text-600">
                <strong>Challenge:</strong> Staying visible and accessible to all team members across multiple
                workspaces and time zones.
              </p>
            </div>
            <div className="bg-white border border-text-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-text-900">Startup Founders</h3>
              <p className="text-text-700 mb-3">
                Your company&apos;s workspace, investor workspaces, partner workspaces, industry community workspaces.
              </p>
              <p className="text-sm text-text-600">
                <strong>Challenge:</strong> Maintaining professional presence everywhere while focusing on building
                your company.
              </p>
            </div>
            <div className="bg-white border border-text-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-text-900">Open Source Maintainers</h3>
              <p className="text-text-700 mb-3">
                Company workspace plus multiple open source community and project workspaces.
              </p>
              <p className="text-sm text-text-600">
                <strong>Challenge:</strong> Staying engaged with open source communities while managing day job
                responsibilities.
              </p>
            </div>
          </div>
        </Section>

        {/* Step-by-Step Guide */}
        <Section>
          <h2 className="text-3xl font-bold mb-8 text-text-900">
            Step-by-Step: How to Manage Multiple Workspaces Efficiently
          </h2>
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="relative pl-12 pb-8 border-l-2 border-text-800">
              <div className="absolute left-0 top-0 -ml-4 w-8 h-8 bg-text-800 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-text-900">Assess Your Workspace Situation</h3>
              <p className="text-text-700 mb-4">
                Before setting up automation, understand your needs:
              </p>
              <ul className="space-y-2 text-text-700 ml-4">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-text-800 mr-2 mt-0.5 flex-shrink-0" />
                  <span>How many workspaces do you need to manage? (List them all)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-text-800 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Do they all require the same availability hours or different schedules?</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-text-800 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Are there time zone differences between workspaces?</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-text-800 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Which workspaces are highest priority for responsiveness?</span>
                </li>
              </ul>
            </div>

            {/* Step 2 */}
            <div className="relative pl-12 pb-8 border-l-2 border-text-800">
              <div className="absolute left-0 top-0 -ml-4 w-8 h-8 bg-text-800 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-text-900">Create Your Slackactivity Account</h3>
              <p className="text-text-700 mb-4">
                Sign up at{' '}
                <Link href="/" className="text-text-800 hover:underline font-medium">
                  Slackactivity.com
                </Link>{' '}
                - completely free, no credit card required. The free plan includes unlimited workspaces, unlike
                other tools that charge per workspace or limit you to 1-3 workspaces on free plans.
              </p>
              <Link
                href="/signin"
                className="inline-flex items-center text-text-800 hover:text-text-900 font-medium"
              >
                Create Free Account <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Step 3 */}
            <div className="relative pl-12 pb-8 border-l-2 border-text-800">
              <div className="absolute left-0 top-0 -ml-4 w-8 h-8 bg-text-800 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-text-900">Connect All Your Workspaces</h3>
              <p className="text-text-700 mb-4">
                Use the &quot;Add Workspace&quot; button to connect each Slack workspace individually via OAuth. This
                is secure - you&apos;re authorizing through Slack&apos;s official authentication system.
              </p>
              <div className="bg-background-100 p-4 rounded-lg border border-text-200 mb-4">
                <p className="text-sm font-semibold text-text-900 mb-2">Pro Tip: Organize as you add</p>
                <p className="text-sm text-text-700">
                  Give each workspace a clear nickname (e.g., &quot;Client: Acme Corp&quot;, &quot;Internal Team&quot;,
                  &quot;Consulting: FinTech Project&quot;). This makes managing them easier later.
                </p>
              </div>
              <div className="bg-white border border-text-200 rounded-lg p-4">
                <p className="text-sm text-text-700">
                  <strong>What happens during connection:</strong> You&apos;ll be redirected to Slack, where you select
                  the workspace and approve access. Slackactivity only requests permission to manage your presence
                  status - we cannot read messages, access files, or see workspace content.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative pl-12 pb-8 border-l-2 border-text-800">
              <div className="absolute left-0 top-0 -ml-4 w-8 h-8 bg-text-800 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-text-900">Choose Your Management Strategy</h3>
              <p className="text-text-700 mb-4">You have two main approaches:</p>
              <div className="space-y-4">
                <div className="bg-white border-2 border-text-800 rounded-lg p-5">
                  <h4 className="font-semibold text-text-900 mb-2 flex items-center">
                    <span className="bg-text-800 text-white px-2 py-1 rounded mr-2 text-sm">Option A</span>
                    Global Schedule (Recommended for Most)
                  </h4>
                  <p className="text-text-700 mb-3">
                    Set one schedule that applies to all workspaces. For example: Monday-Friday, 9 AM - 6 PM your
                    time. You&apos;ll appear active in every workspace during these hours.
                  </p>
                  <p className="text-sm text-text-600">
                    <strong>Best for:</strong> Freelancers/consultants who work consistent hours, multi-company
                    employees with similar schedules, anyone managing workspaces in the same time zone.
                  </p>
                </div>
                <div className="bg-white border-2 border-text-300 rounded-lg p-5">
                  <h4 className="font-semibold text-text-900 mb-2 flex items-center">
                    <span className="bg-text-600 text-white px-2 py-1 rounded mr-2 text-sm">Option B</span>
                    Per-Workspace Schedules (Advanced)
                  </h4>
                  <p className="text-text-700 mb-3">
                    Set different schedules for each workspace. Client A gets 9-5 EST availability, Client B gets
                    10-6 PST, internal team gets 8-4 CST, etc.
                  </p>
                  <p className="text-sm text-text-600">
                    <strong>Best for:</strong> Multi-time zone operations, part-time roles with specific hours,
                    agencies with different client expectations.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="relative pl-12 pb-8 border-l-2 border-text-800">
              <div className="absolute left-0 top-0 -ml-4 w-8 h-8 bg-text-800 text-white rounded-full flex items-center justify-center font-bold">
                5
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-text-900">Configure Your Schedule(s)</h3>
              <p className="text-text-700 mb-4">
                Whether you chose global or per-workspace, now set your actual hours:
              </p>
              <div className="bg-background-100 border border-text-200 rounded-lg p-4 mb-4">
                <p className="font-semibold text-text-900 mb-2">Example Global Setup:</p>
                <div className="text-sm text-text-700 space-y-1">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday - Sunday: Disabled</p>
                  <p>Timezone: Automatically detected (or manually set)</p>
                </div>
              </div>
              <div className="bg-background-100 border border-text-200 rounded-lg p-4">
                <p className="font-semibold text-text-900 mb-2">Example Per-Workspace Setup:</p>
                <div className="text-sm text-text-700 space-y-2">
                  <p><strong>Workspace &quot;Client A (NYC)&quot;:</strong> 9 AM - 5 PM EST</p>
                  <p><strong>Workspace &quot;Client B (SF)&quot;:</strong> 10 AM - 6 PM PST</p>
                  <p><strong>Workspace &quot;Internal Team&quot;:</strong> 8 AM - 4 PM CST</p>
                </div>
              </div>
            </div>

            {/* Step 6 */}
            <div className="relative pl-12">
              <div className="absolute left-0 top-0 -ml-4 w-8 h-8 bg-text-800 text-white rounded-full flex items-center justify-center font-bold">
                6
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-text-900">Enable Automation and Monitor</h3>
              <p className="text-text-700 mb-4">
                Toggle automation to &quot;On&quot; for each workspace. Your dashboard will now show the status of all
                workspaces:
              </p>
              <ul className="space-y-2 text-text-700 ml-4 mb-4">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">●</span>
                  <span>Green = Active automation, currently in work hours</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">●</span>
                  <span>Gray = Active automation, currently outside work hours</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2">●</span>
                  <span>Yellow = Paused temporarily</span>
                </li>
              </ul>
              <div className="bg-background-100 border border-text-200 rounded-lg p-4">
                <p className="text-text-700">
                  <strong className="text-text-900">✓ You&apos;re Done!</strong> All your workspaces are now managed
                  automatically. Check your dashboard anytime to see the status of each workspace, make schedule
                  adjustments, or add new workspaces.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* Key Benefits */}
        <Section variant="subtle">
          <h2 className="text-3xl font-bold mb-6 text-text-900">
            Key Benefits of Centralized Multi-Workspace Management
          </h2>
          <div className="space-y-4">
            <div className="flex items-start bg-white p-5 rounded-lg border border-text-200">
              <CheckCircle className="w-6 h-6 text-text-800 mr-4 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-text-900 text-lg">Save 5-10 Hours Weekly</strong>
                <p className="text-text-700 mt-1">
                  If you&apos;re spending 1-2 hours daily switching workspaces and manually updating statuses, that&apos;s
                  5-10 hours per week. With automation, that time goes back to billable work or personal life.
                  That&apos;s 20-40 hours per month reclaimed.
                </p>
              </div>
            </div>
            <div className="flex items-start bg-white p-5 rounded-lg border border-text-200">
              <CheckCircle className="w-6 h-6 text-text-800 mr-4 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-text-900 text-lg">Synchronized Status Across All Workspaces</strong>
                <p className="text-text-700 mt-1">
                  Set your status once - it applies everywhere. If you need to update your availability or set a
                  custom message, one change syncs to all connected workspaces. No more updating 5 workspaces
                  individually.
                </p>
              </div>
            </div>
            <div className="flex items-start bg-white p-5 rounded-lg border border-text-200">
              <CheckCircle className="w-6 h-6 text-text-800 mr-4 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-text-900 text-lg">Professional Presence Everywhere</strong>
                <p className="text-text-700 mt-1">
                  Never appear &quot;away&quot; again during work hours. Every client, manager, and teammate sees you
                  as active and available. This dramatically improves how you&apos;re perceived across all your
                  professional relationships.
                </p>
              </div>
            </div>
            <div className="flex items-start bg-white p-5 rounded-lg border border-text-200">
              <CheckCircle className="w-6 h-6 text-text-800 mr-4 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-text-900 text-lg">Manage Time Zones Effortlessly</strong>
                <p className="text-text-700 mt-1">
                  Set different schedules per workspace if needed. Your London client sees you during their work
                  hours, your New York client during theirs, and your Tokyo client during theirs - all automated,
                  no manual timezone calculations.
                </p>
              </div>
            </div>
            <div className="flex items-start bg-white p-5 rounded-lg border border-text-200">
              <CheckCircle className="w-6 h-6 text-text-800 mr-4 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-text-900 text-lg">Single Dashboard Control</strong>
                <p className="text-text-700 mt-1">
                  See all your workspaces in one place. Enable/disable automation per workspace, update schedules,
                  monitor status - everything from one interface. No more logging into 5+ different Slack instances.
                </p>
              </div>
            </div>
            <div className="flex items-start bg-white p-5 rounded-lg border border-text-200">
              <CheckCircle className="w-6 h-6 text-text-800 mr-4 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-text-900 text-lg">Reduced Mental Load</strong>
                <p className="text-text-700 mt-1">
                  Stop tracking which workspace you&apos;re in, what your status is, whether you&apos;ve checked messages
                  everywhere. The automation handles it all, freeing your mind to focus on actual work instead of
                  workspace logistics.
                </p>
              </div>
            </div>
            <div className="flex items-start bg-white p-5 rounded-lg border border-text-200">
              <CheckCircle className="w-6 h-6 text-text-800 mr-4 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-text-900 text-lg">Completely Free for Unlimited Workspaces</strong>
                <p className="text-text-700 mt-1">
                  Unlike other tools that charge $10-50 per workspace per month, Slackactivity is free forever with
                  no workspace limits. Manage 3, 5, 10, or 20 workspaces - all free. No hidden fees, no surprise
                  charges.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* Advanced Management Strategies */}
        <Section>
          <h2 className="text-3xl font-bold mb-6 text-text-900">
            Advanced Strategies for Power Users
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-background-50 p-6 rounded-lg border border-text-200">
              <Settings className="w-10 h-10 text-text-800 mb-3" />
              <h3 className="text-xl font-semibold mb-3 text-text-900">Workspace Grouping</h3>
              <p className="text-text-700 mb-3">
                Group similar workspaces together for easier management. Create groups like &quot;Active Clients&quot;,
                &quot;Internal Teams&quot;, &quot;Side Projects&quot;. Apply settings to entire groups at once.
              </p>
              <p className="text-sm text-text-600">
                Example: Disable all &quot;Side Projects&quot; workspaces during busy periods with one toggle.
              </p>
            </div>
            <div className="bg-background-50 p-6 rounded-lg border border-text-200">
              <Globe className="w-10 h-10 text-text-800 mb-3" />
              <h3 className="text-xl font-semibold mb-3 text-text-900">Time Zone Templates</h3>
              <p className="text-text-700 mb-3">
                Create schedule templates for common time zones you work with. Save templates like &quot;EST Business
                Hours&quot;, &quot;PST Extended Hours&quot;, &quot;GMT Morning Shift&quot; and apply them to workspaces quickly.
              </p>
              <p className="text-sm text-text-600">
                Perfect when adding new clients in familiar time zones - just apply the template.
              </p>
            </div>
            <div className="bg-background-50 p-6 rounded-lg border border-text-200">
              <Layout className="w-10 h-10 text-text-800 mb-3" />
              <h3 className="text-xl font-semibold mb-3 text-text-900">Priority Workspaces</h3>
              <p className="text-text-700 mb-3">
                Mark certain workspaces as &quot;Priority&quot; so they&apos;re always at the top of your dashboard. For
                your most important clients or your primary employer.
              </p>
              <p className="text-sm text-text-600">
                Quickly see the status of your most critical workspaces at a glance.
              </p>
            </div>
            <div className="bg-background-50 p-6 rounded-lg border border-text-200">
              <Zap className="w-10 h-10 text-text-800 mb-3" />
              <h3 className="text-xl font-semibold mb-3 text-text-900">Quick Actions</h3>
              <p className="text-text-700 mb-3">
                One-click actions like &quot;Pause All for 1 Hour&quot;, &quot;Enable Vacation Mode for All&quot;, or
                &quot;Sync Custom Status to All Workspaces&quot;. Bulk actions save time when managing many workspaces.
              </p>
              <p className="text-sm text-text-600">
                Need a break? One click pauses automation everywhere. Need to resume? One click re-enables all.
              </p>
            </div>
          </div>
        </Section>

        {/* Common Scenarios and Solutions */}
        <Section variant="subtle">
          <h2 className="text-3xl font-bold mb-6 text-text-900">
            Common Multi-Workspace Scenarios and How to Handle Them
          </h2>
          <div className="space-y-6">
            <div className="bg-white border border-text-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-text-900">
                Scenario: Full-Time Job + Freelance Clients
              </h3>
              <div className="space-y-3">
                <div>
                  <strong className="text-text-900">Setup:</strong>
                  <p className="text-text-700">
                    Company workspace: Active Monday-Friday 9 AM - 5 PM. Freelance workspaces: Active
                    Monday-Friday 6 PM - 10 PM and weekends 10 AM - 6 PM.
                  </p>
                </div>
                <div>
                  <strong className="text-text-900">Result:</strong>
                  <p className="text-text-700">
                    Your employer sees you as available during work hours. Your freelance clients see you as
                    available evenings and weekends. No overlap, no conflicts. Both sets of stakeholders are happy.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-text-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-text-900">
                Scenario: Consultant with International Clients
              </h3>
              <div className="space-y-3">
                <div>
                  <strong className="text-text-900">Setup:</strong>
                  <p className="text-text-700">
                    Use per-workspace schedules. European clients: 8 AM - 12 PM EST (their afternoon). US clients:
                    1 PM - 5 PM EST (their business hours). APAC clients: 8 PM - 11 PM EST (their morning).
                  </p>
                </div>
                <div>
                  <strong className="text-text-900">Result:</strong>
                  <p className="text-text-700">
                    Each client sees you during their business hours, creating the perception that you&apos;re always
                    available when they need you. You actually work 9 AM - 6 PM EST (normal hours) but appear
                    active for each client when it matters to them.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-text-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-text-900">
                Scenario: Agency Worker with Multiple Client Projects
              </h3>
              <div className="space-y-3">
                <div>
                  <strong className="text-text-900">Setup:</strong>
                  <p className="text-text-700">
                    Internal agency workspace + 4 client workspaces. Use global schedule 9 AM - 6 PM for all. Set
                    custom status messages per workspace when needed (e.g., &quot;Working on Campaign X today&quot;).
                  </p>
                </div>
                <div>
                  <strong className="text-text-900">Result:</strong>
                  <p className="text-text-700">
                    You&apos;re active everywhere, but clients know what you&apos;re focused on via custom statuses. Your
                    internal team can always reach you. Clients feel prioritized even when you&apos;re not actively in
                    their workspace.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Best Practices */}
        <Section>
          <h2 className="text-3xl font-bold mb-6 text-text-900">
            Best Practices for Multi-Workspace Management
          </h2>
          <div className="space-y-5">
            <div className="bg-background-50 p-5 rounded-lg border border-text-200">
              <h3 className="text-lg font-semibold mb-2 text-text-900">1. Start with Global, Graduate to Per-Workspace</h3>
              <p className="text-text-700">
                When first setting up, use a global schedule for all workspaces. Get comfortable with automation.
                After a week or two, evaluate if any workspaces need custom schedules and adjust accordingly.
              </p>
            </div>
            <div className="bg-background-50 p-5 rounded-lg border border-text-200">
              <h3 className="text-lg font-semibold mb-2 text-text-900">2. Use Clear Workspace Nicknames</h3>
              <p className="text-text-700">
                Don&apos;t just use the Slack workspace name. Add context: &quot;Client: Nike - Marketing Project&quot;,
                &quot;Internal: Engineering Team&quot;, &quot;Freelance: Web Dev for Startup X&quot;. This makes your dashboard
                scannable at a glance.
              </p>
            </div>
            <div className="bg-background-50 p-5 rounded-lg border border-text-200">
              <h3 className="text-lg font-semibold mb-2 text-text-900">3. Set Boundaries with Custom Statuses</h3>
              <p className="text-text-700">
                Even though you&apos;re active, use custom status messages to set expectations. &quot;Available but in
                deep work&quot;, &quot;In meetings today - limited availability&quot;, &quot;Available for urgent matters only&quot;.
                Combine presence with communication.
              </p>
            </div>
            <div className="bg-background-50 p-5 rounded-lg border border-text-200">
              <h3 className="text-lg font-semibold mb-2 text-text-900">4. Review and Optimize Monthly</h3>
              <p className="text-text-700">
                Once per month, review your workspace setup. Remove workspaces you&apos;re no longer in. Adjust
                schedules based on what&apos;s working. Add new workspaces as you take on new clients or projects.
                Keep your dashboard current.
              </p>
            </div>
            <div className="bg-background-50 p-5 rounded-lg border border-text-200">
              <h3 className="text-lg font-semibold mb-2 text-text-900">5. Use Vacation Mode Strategically</h3>
              <p className="text-text-700">
                When you take time off, use vacation mode to disable all workspaces at once with start and end
                dates. This prevents the awkward situation of appearing active during your vacation. Set it and
                forget it.
              </p>
            </div>
          </div>
        </Section>

        {/* FAQ */}
        <Section variant="subtle">
          <h2 className="text-3xl font-bold mb-8 text-text-900">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <FAQItem
              question="How many workspaces can I connect on the free plan?"
              answer="Unlimited! There's no cap on the number of workspaces. Connect 3, 5, 10, 20, or more - all free forever. We built this specifically for people managing multiple workspaces, so workspace limits don't make sense."
            />
            <FAQItem
              question="Can I set different schedules for different workspaces?"
              answer="Yes. You can use a global schedule (same hours for all workspaces) or per-workspace schedules (custom hours for each). Mix and match as needed - some workspaces on global schedule, others on custom schedules."
            />
            <FAQItem
              question="What happens if I'm removed from a workspace?"
              answer="Slackactivity automatically detects when you're removed from a workspace and stops managing it. It will appear as 'Disconnected' in your dashboard, and you can remove it with one click. If you're re-added later, just reconnect it."
            />
            <FAQItem
              question="Can I temporarily pause automation for one workspace but keep others running?"
              answer="Absolutely. Each workspace has its own enable/disable toggle. Pause specific workspaces when needed (like when a project ends or during client vacations) while keeping others active."
            />
            <FAQItem
              question="Does this work with Slack Enterprise Grid?"
              answer="Yes! Slackactivity works with Slack Enterprise Grid, standard Slack workspaces, and Slack Connect channels. The automation works the same way regardless of your Slack plan type."
            />
          </div>
        </Section>

        {/* CTA Section */}
        <CTASection
          title="Ready to Manage All Your Workspaces Effortlessly?"
          description="Join thousands of freelancers, consultants, and multi-workspace professionals who've eliminated workspace chaos. Set up takes 5 minutes. No credit card required, free forever with unlimited workspaces."
          primaryCTA={{ text: 'Get Started - Free Forever', href: '/signin' }}
          secondaryCTA={{ text: 'See How It Works', href: '/how-it-works' }}
        />
      </SEOPageLayout>
    </>
  );
}
