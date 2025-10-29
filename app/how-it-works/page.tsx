import { Metadata } from 'next';
import { CheckCircle, Zap, Settings, Shield, Clock } from 'lucide-react';
import {
  SEOPageLayout,
  CTAButton,
  Section,
  FeatureCard,
  CTASection,
} from '@/components/seo/SEOPageLayout';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { StructuredData } from '@/components/seo/StructuredData';
import { generateHowToStructuredData, generateBreadcrumbStructuredData } from '@/lib/seo/config';

export const metadata: Metadata = {
  title: 'How Slackactivity Works - Automatic Slack Status Management',
  description:
    'Learn how Slackactivity automatically keeps you active on Slack. Simple setup, smart scheduling, and secure automation for your Slack status.',
  keywords: [
    'how slackactivity works',
    'slack automation setup',
    'automatic slack status',
    'slack status tool',
  ],
};

const breadcrumbItems = [
  { name: 'Home', url: 'https://slackactivity.com' },
  { name: 'How It Works', url: 'https://slackactivity.com/how-it-works' },
];

const howToSteps = [
  {
    name: 'Connect Your Slack Workspace',
    text: 'Sign in with your Slack account using secure OAuth. We only request permission to update your status - nothing else.',
  },
  {
    name: 'Set Your Work Schedule',
    text: 'Configure your work hours and timezone. The tool will only keep you active during these times.',
  },
  {
    name: 'Let It Run',
    text: 'Slackactivity automatically updates your status every 5 minutes during your work hours. No manual intervention needed.',
  },
];

const structuredData = [
  generateBreadcrumbStructuredData(breadcrumbItems),
  generateHowToStructuredData(
    'How to Use Slackactivity',
    'Set up automatic Slack status management in 3 simple steps',
    howToSteps
  ),
];

export default function HowItWorksPage() {
  return (
    <>
      <StructuredData data={structuredData[0]} />
      <StructuredData data={structuredData[1]} />

      <SEOPageLayout>
        <Breadcrumbs items={breadcrumbItems} />

        {/* Hero Section */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-text-900">
            How Slackactivity Works
          </h1>
          <p className="text-xl text-text-600 mb-8">
            Slackactivity automatically manages your Slack status so you always appear active during work
            hours. Set it up once in 3 simple steps, then forget about manual status updates forever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <CTAButton href="/signin" variant="primary">
              Get Started - Free Forever
            </CTAButton>
            <CTAButton href="/#pricing" variant="secondary">
              View Pricing
            </CTAButton>
          </div>
        </header>

        {/* 3 Step Process */}
        <Section>
          <h2 className="text-3xl font-bold mb-8 text-text-900">Simple 3-Step Setup</h2>
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="relative pl-12 pb-8 border-l-2 border-text-800">
              <div className="absolute left-0 top-0 -ml-4 w-10 h-10 bg-text-800 text-white rounded-full flex items-center justify-center font-bold text-lg">
                1
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-text-900">
                Connect Your Slack Workspace
              </h3>
              <p className="text-text-700 mb-4">
                Click &quot;Get Started&quot; and authorize Slackactivity using Slack&apos;s secure OAuth
                system. We only request the minimum permission needed to update your status - we
                <strong> never access your messages, files, or any other data</strong>.
              </p>
              <div className="bg-background-100 border border-text-200 rounded-lg p-4">
                <p className="text-sm text-text-700">
                  <Shield className="w-4 h-4 inline mr-2" />
                  <strong>Security:</strong> We only request &quot;users.profile:write&quot; permission.
                  Your conversations remain completely private.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative pl-12 pb-8 border-l-2 border-text-800">
              <div className="absolute left-0 top-0 -ml-4 w-10 h-10 bg-text-800 text-white rounded-full flex items-center justify-center font-bold text-lg">
                2
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-text-900">Set Your Work Schedule</h3>
              <p className="text-text-700 mb-4">
                Configure when you want to appear active on Slack. Set your:
              </p>
              <ul className="space-y-2 text-text-700 mb-4">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-text-800 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Work hours:</strong> Define your start and end times for each day
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-text-800 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Timezone:</strong> Automatically detected, works anywhere in the world
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-text-800 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Days off:</strong> Disable weekends or specific days as needed
                  </span>
                </li>
              </ul>
              <p className="text-text-700">
                The tool will <strong>only</strong> keep you active during these configured times, respecting
                your work-life balance.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative pl-12">
              <div className="absolute left-0 top-0 -ml-4 w-10 h-10 bg-text-800 text-white rounded-full flex items-center justify-center font-bold text-lg">
                3
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-text-900">Let It Run Automatically</h3>
              <p className="text-text-700 mb-4">
                That&apos;s it! Slackactivity now runs in the background and automatically updates your
                Slack status every 5 minutes during your work hours. You&apos;ll always appear active without
                any manual intervention.
              </p>
              <div className="bg-background-100 border border-text-200 rounded-lg p-4">
                <p className="text-text-700">
                  <strong className="text-text-900">✓ Set it and forget it!</strong> No ongoing maintenance
                  required. You can adjust your schedule anytime in the dashboard.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* How It Works Behind the Scenes */}
        <Section variant="subtle">
          <h2 className="text-3xl font-bold mb-6 text-text-900">Behind the Scenes</h2>
          <p className="text-lg text-text-700 mb-6">
            Here&apos;s what happens automatically once you&apos;ve set up Slackactivity:
          </p>
          <div className="space-y-4">
            <div className="bg-white border border-text-200 rounded-lg p-6">
              <h3 className="font-semibold mb-2 text-text-900 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-text-800" />
                Every 5 Minutes
              </h3>
              <p className="text-text-700">
                During your configured work hours, our system sends a presence update to Slack on your
                behalf. This prevents Slack from marking you as away after 30 minutes of inactivity.
              </p>
            </div>
            <div className="bg-white border border-text-200 rounded-lg p-6">
              <h3 className="font-semibold mb-2 text-text-900 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-text-800" />
                Schedule Awareness
              </h3>
              <p className="text-text-700">
                The tool checks your current timezone and schedule. If you&apos;re within your work hours,
                it updates your status. If not, it stays dormant until your next work period.
              </p>
            </div>
            <div className="bg-white border border-text-200 rounded-lg p-6">
              <h3 className="font-semibold mb-2 text-text-900 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-text-800" />
                Privacy First
              </h3>
              <p className="text-text-700">
                We only update your presence indicator (the green dot). Your custom status messages, emojis,
                and all other Slack data remain untouched and private.
              </p>
            </div>
            <div className="bg-white border border-text-200 rounded-lg p-6">
              <h3 className="font-semibold mb-2 text-text-900 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-text-800" />
                Zero Maintenance
              </h3>
              <p className="text-text-700">
                No manual actions needed. The automation runs reliably 24/7. You can modify your schedule
                anytime, and changes take effect immediately.
              </p>
            </div>
          </div>
        </Section>

        {/* Key Features */}
        <Section>
          <h2 className="text-3xl font-bold mb-8 text-text-900">What Makes Slackactivity Different</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <FeatureCard
              icon={<Shield className="w-10 h-10" />}
              title="Official Slack API"
              description="Uses Slack's official OAuth and API methods. No hacky workarounds or security risks."
            />
            <FeatureCard
              icon={<Settings className="w-10 h-10" />}
              title="Smart Scheduling"
              description="Timezone-aware automation that adapts to your actual work schedule, not a fixed clock."
            />
            <FeatureCard
              icon={<Zap className="w-10 h-10" />}
              title="Multi-Workspace Support"
              description="Manage status across multiple Slack workspaces from one dashboard. Multiple workspaces supported."
            />
            <FeatureCard
              icon={<Clock className="w-10 h-10" />}
              title="Instant Updates"
              description="Status updates happen every 5 minutes during work hours. Never appear away again."
            />
          </div>
        </Section>

        {/* Benefits */}
        <Section variant="highlight">
          <h2 className="text-3xl font-bold mb-6 text-text-900">What You Get</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <CheckCircle className="w-6 h-6 text-text-800 mr-3 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-lg text-text-900">Always Appear Available:</strong>
                <p className="text-text-700">
                  Your team sees you as online during work hours, building trust and enabling better
                  communication.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-6 h-6 text-text-800 mr-3 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-lg text-text-900">Save Time Daily:</strong>
                <p className="text-text-700">
                  No more manual status updates. Save 10-15 minutes every day that you can spend on actual
                  work.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-6 h-6 text-text-800 mr-3 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-lg text-text-900">Work-Life Balance:</strong>
                <p className="text-text-700">
                  Automation respects your configured hours. You only appear online when you want to, helping
                  maintain healthy boundaries.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-6 h-6 text-text-800 mr-3 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-lg text-text-900">Peace of Mind:</strong>
                <p className="text-text-700">
                  Never worry about appearing offline during meetings, calls, or when stepping away from your
                  desk.
                </p>
              </div>
            </li>
          </ul>
        </Section>

        {/* CTA Section */}
        <CTASection
          title="Ready to Automate Your Slack Status?"
          description="Join thousands of professionals using Slackactivity. Set it up in less than 2 minutes. No credit card required."
          primaryCTA={{ text: 'Get Started - Free Forever', href: '/signin' }}
          secondaryCTA={{ text: 'View Pricing', href: '/#pricing' }}
        />
      </SEOPageLayout>
    </>
  );
}
