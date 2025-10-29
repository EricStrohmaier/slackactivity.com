import { Metadata } from 'next';
import { CheckCircle, Clock, Shield, Zap } from 'lucide-react';
import {
  generateMetadata,
  seoPages,
  generateBreadcrumbStructuredData,
  generateFAQStructuredData,
  generateSoftwareApplicationStructuredData,
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

export const metadata: Metadata = generateMetadata(seoPages.slackAutoAway);

const breadcrumbItems = [
  { name: 'Home', url: 'https://slackactivity.com' },
  { name: 'Solutions', url: 'https://slackactivity.com/solutions' },
  {
    name: 'Slack Auto Away Prevention',
    url: 'https://slackactivity.com/solutions/slack-auto-away-prevention',
  },
];

const faqs = [
  {
    question: 'How does Slack auto away prevention work?',
    answer:
      'Our tool automatically keeps your Slack status active by simulating activity every 5 minutes. This prevents Slack from marking you as away after 30 minutes of inactivity, ensuring you always appear online during your scheduled work hours.',
  },
  {
    question: 'Is it safe to use a Slack auto away prevention tool?',
    answer:
      'Yes, Slackactivity uses official Slack API methods to update your status. We never access your messages, files, or private data. Your workspace data remains completely secure and private.',
  },
  {
    question: 'Will my team know I&apos;m using a status automation tool?',
    answer:
      'No, the status updates are indistinguishable from manual updates. Your status will appear normally active to your team members.',
  },
  {
    question: 'Can I schedule when the tool is active?',
    answer:
      'Absolutely! You can set specific work hours and time zones. The tool only keeps you active during your scheduled availability, respecting your work-life balance.',
  },
  {
    question: 'Does it work with multiple Slack workspaces?',
    answer:
      'Yes, multiple Slack workspaces are supported, allowing you to manage your status across all your teams from one central dashboard.',
  },
];

const structuredData = [
  generateBreadcrumbStructuredData(breadcrumbItems),
  generateFAQStructuredData(faqs),
  generateSoftwareApplicationStructuredData(),
];

export default function SlackAutoAwayPreventionPage() {
  return (
    <>
      <MultipleStructuredData dataArray={structuredData} />

      <SEOPageLayout>
        <Breadcrumbs items={breadcrumbItems} />

        {/* Hero Section */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-text-900">
            Slack Auto Away Prevention: Never Show Away on Slack Again
          </h1>
          <p className="text-xl text-text-600 mb-8">
            Keep your Slack status active automatically, even when you step away from your desk. Perfect
            for remote workers, freelancers, and anyone who needs to maintain an active presence on
            Slack.
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

        {/* Problem Section */}
        <Section variant="subtle">
          <h2 className="text-3xl font-bold mb-6 text-text-900">
            The Slack Away Status Problem
          </h2>
          <p className="text-lg text-text-700 mb-4">
            Slack automatically marks you as &quot;away&quot; after just 30 minutes of inactivity. This
            can happen when you&apos;re:
          </p>
          <ul className="space-y-3 text-text-700">
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-text-800 mr-3 mt-1 flex-shrink-0" />
              <span>In a meeting or on a phone call</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-text-800 mr-3 mt-1 flex-shrink-0" />
              <span>Working on tasks that don&apos;t require your computer</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-text-800 mr-3 mt-1 flex-shrink-0" />
              <span>Taking a short break but still available</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-text-800 mr-3 mt-1 flex-shrink-0" />
              <span>Working across multiple devices</span>
            </li>
          </ul>
          <p className="text-lg text-text-700 mt-6">
            An away status can make you seem unavailable or unresponsive, potentially affecting your
            professional reputation and team communication.
          </p>
        </Section>

        {/* Solution Section */}
        <Section>
          <h2 className="text-3xl font-bold mb-6 text-text-900">
            How Slackactivity Prevents Away Status
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <FeatureCard
              icon={<Clock className="w-10 h-10" />}
              title="Automatic Updates Every 5 Minutes"
              description="Our system updates your Slack status automatically every 5 minutes during your scheduled work hours, ensuring you never go idle."
            />
            <FeatureCard
              icon={<Zap className="w-10 h-10" />}
              title="Smart Scheduling"
              description="Set your work hours and time zone. The tool only runs during your availability, respecting your personal time and work-life balance."
            />
            <FeatureCard
              icon={<Shield className="w-10 h-10" />}
              title="Secure & Private"
              description="Uses official Slack APIs and OAuth authentication. We never access your messages, files, or any sensitive workspace data."
            />
            <FeatureCard
              icon={<CheckCircle className="w-10 h-10" />}
              title="Set It and Forget It"
              description="Configure once and let automation handle the rest. No manual status updates, no constant monitoring required."
            />
          </div>
        </Section>

        {/* Benefits Section */}
        <Section variant="highlight">
          <h2 className="text-3xl font-bold mb-6 text-text-900">
            Benefits of Preventing Slack Away Status
          </h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <CheckCircle className="w-6 h-6 text-text-800 mr-3 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-lg text-text-900">
                  Maintain Professional Presence:
                </strong>
                <p className="text-text-700">
                  Always appear available and responsive to your team and clients.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-6 h-6 text-text-800 mr-3 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-lg text-text-900">Save Time:</strong>
                <p className="text-text-700">
                  No more manually updating your status throughout the day.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-6 h-6 text-text-800 mr-3 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-lg text-text-900">Better Communication:</strong>
                <p className="text-text-700">
                  Team members know when you&apos;re truly available for quick questions.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-6 h-6 text-text-800 mr-3 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-lg text-text-900">Multi-Workspace Support:</strong>
                <p className="text-text-700">
                  Manage status across all your Slack workspaces from one place.
                </p>
              </div>
            </li>
          </ul>
        </Section>

        {/* FAQ Section */}
        <Section>
          <h2 className="text-3xl font-bold mb-8 text-text-900">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </Section>

        {/* CTA Section */}
        <CTASection
          title="Ready to Stop Showing Away on Slack?"
          description="Start using Slackactivity for free. No credit card required."
          primaryCTA={{ text: 'Get Started - Free Forever', href: '/signin' }}
          secondaryCTA={{ text: 'View Pricing', href: '/#pricing' }}
        />
      </SEOPageLayout>
    </>
  );
}
