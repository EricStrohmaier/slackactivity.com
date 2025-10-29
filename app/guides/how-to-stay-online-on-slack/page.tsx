import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, AlertCircle, ArrowRight, Shield, Clock, Zap, Settings } from 'lucide-react';
import {
  generateMetadata,
  seoPages,
  generateBreadcrumbStructuredData,
  generateHowToStructuredData,
  generateArticleStructuredData,
} from '@/lib/seo/config';
import { MultipleStructuredData } from '@/components/seo/StructuredData';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import {
  SEOPageLayout,
  CTAButton,
  Section,
  FeatureCard,
  CTASection,
  FAQItem,
} from '@/components/seo/SEOPageLayout';

export const metadata: Metadata = generateMetadata(seoPages.howToStayOnline);

const breadcrumbItems = [
  { name: 'Home', url: 'https://slackactivity.com' },
  { name: 'Guides', url: 'https://slackactivity.com/guides' },
  {
    name: 'How to Stay Online on Slack',
    url: 'https://slackactivity.com/guides/how-to-stay-online-on-slack',
  },
];

const howToSteps = [
  {
    name: 'Sign up for Slackactivity',
    text: 'Create a free account at Slackactivity.com and connect your Slack workspace using secure OAuth authentication.',
  },
  {
    name: 'Configure your work schedule',
    text: 'Set your daily work hours and timezone preferences in the dashboard to match when you want to appear online.',
  },
  {
    name: 'Enable automatic status updates',
    text: 'Activate the automation feature to keep your status active every 5 minutes during your scheduled work hours.',
  },
  {
    name: 'Monitor and adjust as needed',
    text: 'Review your status activity in the dashboard and adjust your schedule or preferences anytime.',
  },
];

const structuredData = [
  generateBreadcrumbStructuredData(breadcrumbItems),
  generateHowToStructuredData(
    'How to Stay Online on Slack During Work Hours',
    'Learn how to maintain an active Slack status throughout your workday with automatic status management.',
    howToSteps
  ),
  generateArticleStructuredData(
    'How to Stay Online on Slack During Work Hours - Complete Guide',
    'Step-by-step guide to staying online on Slack without manual updates. 100% automated solution for remote workers.',
    '2024-01-15',
    '2024-01-15'
  ),
];

export default function HowToStayOnlineOnSlackPage() {
  return (
    <>
      <MultipleStructuredData dataArray={structuredData} />

      <SEOPageLayout>
        <Breadcrumbs items={breadcrumbItems} />

        {/* Hero Section */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-text-900">
            How to Stay Online on Slack During Work Hours: Complete Guide
          </h1>
          <p className="text-xl text-text-600 mb-4">
            Learn how to maintain an active Slack status throughout your workday without constant manual
            updates. This comprehensive guide covers everything from understanding Slack&apos;s away status
            to implementing automation that keeps you online 24/7.
          </p>
          <div className="flex items-center gap-2 text-sm text-text-500 mb-8">
            <span>Last updated: January 15, 2024</span>
            <span>•</span>
            <span>8 min read</span>
          </div>
        </header>

        {/* Quick Summary */}
        <Section variant="highlight">
          <h2 className="text-xl font-bold mb-3 text-text-900">Quick Summary</h2>
          <p className="text-text-700">
            To stay online on Slack automatically, use a status automation tool like Slackactivity that
            updates your presence every 5 minutes during your work hours. This prevents Slack from marking
            you as away after 30 minutes of inactivity, ensuring you always appear available to your team.
          </p>
        </Section>

        {/* Understanding the Problem */}
        <Section>
          <h2 className="text-3xl font-bold mb-6 text-text-900">
            Understanding Slack&apos;s Away Status
          </h2>
          <p className="text-lg text-text-700 mb-4">
            Slack automatically changes your status to &quot;away&quot; after 30 minutes of no activity.
            While this feature helps indicate when someone is truly unavailable, it can be problematic for:
          </p>
          <div className="space-y-4 my-6">
            <div className="flex items-start bg-background-50 p-4 rounded-lg border border-text-200">
              <AlertCircle className="w-5 h-5 text-text-800 mr-3 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-text-900">Remote workers</strong>
                <p className="text-text-700">
                  Who need to maintain visibility even when attending calls or working away from their
                  computer
                </p>
              </div>
            </div>
            <div className="flex items-start bg-background-50 p-4 rounded-lg border border-text-200">
              <AlertCircle className="w-5 h-5 text-text-800 mr-3 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-text-900">Team leaders</strong>
                <p className="text-text-700">
                  Who want to appear accessible to their team during work hours
                </p>
              </div>
            </div>
            <div className="flex items-start bg-background-50 p-4 rounded-lg border border-text-200">
              <AlertCircle className="w-5 h-5 text-text-800 mr-3 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-text-900">Freelancers and consultants</strong>
                <p className="text-text-700">
                  Managing multiple workspaces who can&apos;t constantly monitor their status across all of
                  them
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* Manual Methods */}
        <Section variant="subtle">
          <h2 className="text-3xl font-bold mb-6 text-text-900">
            Manual Methods (And Why They Don&apos;t Work)
          </h2>
          <div className="space-y-6">
            <div className="bg-white border border-text-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 flex items-center text-text-900">
                <span className="mr-2">❌</span>
                Constantly Moving Your Mouse
              </h3>
              <p className="text-text-700">
                This is impractical and prevents you from doing actual work. Plus, it only works if
                you&apos;re at your computer constantly.
              </p>
            </div>
            <div className="bg-white border border-text-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 flex items-center text-text-900">
                <span className="mr-2">❌</span>
                Setting Status Manually Throughout the Day
              </h3>
              <p className="text-text-700">
                Manual updates are easy to forget and interrupt your workflow. You&apos;ll inevitably show
                as away when you get busy with actual work.
              </p>
            </div>
            <div className="bg-white border border-text-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 flex items-center text-text-900">
                <span className="mr-2">❌</span>
                Using Mouse Jiggler Hardware
              </h3>
              <p className="text-text-700">
                Physical devices that move your mouse don&apos;t update Slack status and can interfere with
                other work. They&apos;re also ineffective for mobile or multi-device setups.
              </p>
            </div>
          </div>
        </Section>

        {/* The Automated Solution */}
        <Section variant="highlight">
          <h2 className="text-3xl font-bold mb-6 text-text-900">
            The Automated Solution: Status Management Tools
          </h2>
          <p className="text-lg text-text-700 mb-6">
            The most effective way to stay online on Slack is using a dedicated status automation tool.
            These tools use Slack&apos;s official API to update your status automatically, ensuring you
            always appear active during your work hours.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <FeatureCard
              icon={<Clock className="w-8 h-8" />}
              title="Reliable"
              description="Works 24/7 without any intervention from you"
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="Secure"
              description="Uses official Slack APIs with OAuth authentication"
            />
            <FeatureCard
              icon={<Settings className="w-8 h-8" />}
              title="Smart"
              description="Respects your schedule and timezone preferences"
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Effortless"
              description="Set it once and forget about manual status updates"
            />
          </div>
        </Section>

        {/* Step-by-Step Guide */}
        <Section>
          <h2 className="text-3xl font-bold mb-8 text-text-900">
            Step-by-Step: How to Stay Online on Slack Automatically
          </h2>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="relative pl-12 pb-8 border-l-2 border-text-800">
              <div className="absolute left-0 top-0 -ml-4 w-8 h-8 bg-text-800 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-text-900">
                Create a Slackactivity Account
              </h3>
              <p className="text-text-700 mb-4">
                Visit{' '}
                <Link href="/" className="text-text-800 hover:underline font-medium">
                  Slackactivity.com
                </Link>{' '}
                and click &quot;Get Started - Free Forever&quot; to create your account. All features
                including multiple workspace support are completely free.
              </p>
              <Link
                href="/signin"
                className="inline-flex items-center text-text-800 hover:text-text-900 font-medium"
              >
                Create Account <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Step 2 */}
            <div className="relative pl-12 pb-8 border-l-2 border-text-800">
              <div className="absolute left-0 top-0 -ml-4 w-8 h-8 bg-text-800 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-text-900">
                Connect Your Slack Workspace
              </h3>
              <p className="text-text-700 mb-4">
                Click &quot;Connect Workspace&quot; and authorize Slackactivity to manage your status. This
                uses Slack&apos;s secure OAuth system and only grants permission to update your status - we
                never access your messages, files, or any other data.
              </p>
              <div className="bg-background-100 p-4 rounded-lg border border-text-200">
                <p className="text-sm text-text-700">
                  <strong>Security Note:</strong> Slackactivity only requests &quot;users.profile:write&quot;
                  permission, which allows status updates only. Your conversations and files remain private.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative pl-12 pb-8 border-l-2 border-text-800">
              <div className="absolute left-0 top-0 -ml-4 w-8 h-8 bg-text-800 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-text-900">Set Your Work Schedule</h3>
              <p className="text-text-700 mb-4">
                Configure your daily work hours and timezone in the dashboard. For example:
              </p>
              <ul className="space-y-2 text-text-700">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-text-800 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Monday-Friday: 9:00 AM - 5:00 PM EST</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-text-800 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Lunch break: 12:00 PM - 1:00 PM (optional)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-text-800 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Weekends: Disabled</span>
                </li>
              </ul>
            </div>

            {/* Step 4 */}
            <div className="relative pl-12">
              <div className="absolute left-0 top-0 -ml-4 w-8 h-8 bg-text-800 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-text-900">Enable Automation</h3>
              <p className="text-text-700 mb-4">
                Toggle the automation switch to &quot;On&quot;. That&apos;s it! Slackactivity will now
                update your status every 5 minutes during your scheduled work hours, keeping you online
                automatically.
              </p>
              <div className="bg-background-100 border border-text-200 rounded-lg p-4">
                <p className="text-text-700">
                  <strong className="text-text-900">✓ You&apos;re all set!</strong> Your Slack status will
                  now stay active automatically. You can return to work and forget about manual status
                  management.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* Best Practices */}
        <Section variant="subtle">
          <h2 className="text-3xl font-bold mb-6 text-text-900">
            Best Practices for Maintaining Slack Presence
          </h2>
          <div className="space-y-4">
            <div className="flex items-start bg-white border border-text-200 rounded-lg p-6">
              <CheckCircle className="w-6 h-6 text-text-800 mr-4 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2 text-text-900">Set Realistic Work Hours</h3>
                <p className="text-text-700">
                  Configure your automation to match your actual availability. Don&apos;t appear online 24/7
                  - respect work-life boundaries.
                </p>
              </div>
            </div>
            <div className="flex items-start bg-white border border-text-200 rounded-lg p-6">
              <CheckCircle className="w-6 h-6 text-text-800 mr-4 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2 text-text-900">Use Custom Status Messages</h3>
                <p className="text-text-700">
                  Combine automation with informative status messages like &quot;In a meeting&quot; or
                  &quot;Focus time&quot; to provide context to your teammates.
                </p>
              </div>
            </div>
            <div className="flex items-start bg-white border border-text-200 rounded-lg p-6">
              <CheckCircle className="w-6 h-6 text-text-800 mr-4 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2 text-text-900">Communicate Your Availability</h3>
                <p className="text-text-700">
                  Let your team know you use automation and set clear expectations for response times.
                </p>
              </div>
            </div>
            <div className="flex items-start bg-white border border-text-200 rounded-lg p-6">
              <CheckCircle className="w-6 h-6 text-text-800 mr-4 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2 text-text-900">Review and Adjust Regularly</h3>
                <p className="text-text-700">
                  Periodically check your schedule settings and adjust them as your work patterns change.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* Troubleshooting */}
        <Section>
          <h2 className="text-3xl font-bold mb-6 text-text-900">Troubleshooting Common Issues</h2>
          <div className="space-y-6">
            <FAQItem
              question="Status Still Showing Away"
              answer="Check that automation is enabled in your dashboard and that the current time falls within your configured work hours. Verify your timezone is set correctly."
            />
            <FAQItem
              question="Multiple Workspaces Not Syncing"
              answer="Ensure you've connected all workspaces in your account settings. Multiple Slack workspaces are supported - simply connect each workspace you want to manage from your dashboard."
            />
            <FAQItem
              question="Custom Status Getting Overwritten"
              answer="Slackactivity preserves your custom status messages and only updates the presence indicator. If you're experiencing issues, contact support."
            />
          </div>
        </Section>

        {/* CTA Section */}
        <CTASection
          title="Ready to Stay Online on Slack Automatically?"
          description="Join thousands of remote workers who&apos;ve automated their Slack presence. No credit card required."
          primaryCTA={{ text: 'Get Started - Free Forever', href: '/signin' }}
          secondaryCTA={{ text: 'View Pricing', href: '/#pricing' }}
        />
      </SEOPageLayout>
    </>
  );
}
