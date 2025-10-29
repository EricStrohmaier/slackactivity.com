import { Metadata } from 'next';
import { CheckCircle, Calendar, Sparkles, Users, Zap } from 'lucide-react';
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

export const metadata: Metadata = generateMetadata(seoPages.statusAutomation);

const breadcrumbItems = [
  { name: 'Home', url: 'https://slackactivity.com' },
  { name: 'Solutions', url: 'https://slackactivity.com/solutions' },
  {
    name: 'Slack Status Automation',
    url: 'https://slackactivity.com/solutions/slack-status-automation',
  },
];

const faqs = [
  {
    question: 'What is Slack status automation?',
    answer:
      'Slack status automation is the process of automatically managing your Slack presence and status without manual intervention. It updates your status based on predefined schedules, ensuring you always appear online during work hours and offline during personal time.',
  },
  {
    question: 'Can I customize my automation schedule?',
    answer:
      'Yes! You can set specific work hours, define time zones, and create custom schedules that match your actual availability. The automation respects your calendar and only runs during your designated work periods.',
  },
  {
    question: 'Does automation work across different time zones?',
    answer:
      'Absolutely. Our tool is timezone-aware and adjusts automatically. Perfect for distributed teams working across multiple time zones or professionals who travel frequently.',
  },
  {
    question: 'Will automation interfere with my manual status updates?',
    answer:
      'No, you maintain full control. You can manually set custom status messages or emojis, and our automation will preserve them while keeping you active.',
  },
];

const structuredData = [
  generateBreadcrumbStructuredData(breadcrumbItems),
  generateFAQStructuredData(faqs),
  generateSoftwareApplicationStructuredData(),
];

export default function SlackStatusAutomationPage() {
  return (
    <>
      <MultipleStructuredData dataArray={structuredData} />

      <SEOPageLayout>
        <Breadcrumbs items={breadcrumbItems} />

        {/* Hero Section */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-text-900">
            Slack Status Automation Tool - Smart, Automatic Status Management
          </h1>
          <p className="text-xl text-text-600 mb-8">
            Automate your Slack status updates with intelligent scheduling. Set your work hours once,
            and let our tool handle your online presence automatically across all your workspaces.
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

        {/* Why Automate Section */}
        <Section variant="subtle">
          <h2 className="text-3xl font-bold mb-6 text-text-900">
            Why Automate Your Slack Status?
          </h2>
          <p className="text-lg text-text-700 mb-4">
            In today&apos;s remote and hybrid work environment, your Slack status is your office door.
            Manual status management is time-consuming and easy to forget, leading to:
          </p>
          <ul className="space-y-3 text-text-700">
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-text-800 mr-3 mt-1 flex-shrink-0" />
              <span>Colleagues thinking you&apos;re unavailable when you&apos;re actually working</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-text-800 mr-3 mt-1 flex-shrink-0" />
              <span>Interruptions during focus time because your status says you&apos;re available</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-text-800 mr-3 mt-1 flex-shrink-0" />
              <span>Constant context switching to update your status manually</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-text-800 mr-3 mt-1 flex-shrink-0" />
              <span>Appearing offline when you step away briefly</span>
            </li>
          </ul>
          <p className="text-lg text-text-700 mt-6">
            <strong>Slack status automation solves all these problems</strong> by intelligently managing
            your presence based on your actual work schedule.
          </p>
        </Section>

        {/* Features Grid */}
        <Section>
          <h2 className="text-3xl font-bold mb-8 text-text-900">
            Powerful Automation Features
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <FeatureCard
              icon={<Calendar className="w-10 h-10" />}
              title="Smart Scheduling"
              description="Define your work hours, lunch breaks, and availability windows. The automation runs only when you want to be shown as active, preserving your work-life balance."
            />
            <FeatureCard
              icon={<Users className="w-10 h-10" />}
              title="Multi-Workspace Sync"
              description="Manage status across multiple Slack workspaces simultaneously. Perfect for freelancers, consultants, and professionals working with multiple organizations."
            />
            <FeatureCard
              icon={<Sparkles className="w-10 h-10" />}
              title="Timezone Intelligence"
              description="Automatically adjusts to your timezone, even when traveling. Your status reflects your local work hours, not some fixed schedule."
            />
            <FeatureCard
              icon={<Zap className="w-10 h-10" />}
              title="Zero Maintenance"
              description="Set it up once and forget about it. The automation runs reliably in the background, requiring no ongoing management or monitoring."
            />
          </div>
        </Section>

        {/* How It Works Section */}
        <Section variant="highlight">
          <h2 className="text-3xl font-bold mb-6 text-text-900">
            How Slack Status Automation Works
          </h2>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-text-800 text-white rounded-full flex items-center justify-center font-bold mr-4">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-text-900">Connect Your Workspace</h3>
                <p className="text-text-700">
                  Securely authenticate with Slack using OAuth. We only request the minimum permissions
                  needed to update your status - no access to messages or files.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-text-800 text-white rounded-full flex items-center justify-center font-bold mr-4">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-text-900">Configure Your Schedule</h3>
                <p className="text-text-700">
                  Set your work hours, timezone, and any specific availability preferences. You can define
                  different schedules for different days of the week.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-text-800 text-white rounded-full flex items-center justify-center font-bold mr-4">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-text-900">Automation Runs 24/7</h3>
                <p className="text-text-700">
                  Our system automatically updates your status every 5 minutes during your work hours,
                  keeping you active and available without any manual intervention.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* Use Cases Section */}
        <Section>
          <h2 className="text-3xl font-bold mb-6 text-text-900">Perfect For</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-background-100 rounded-lg p-6 border border-text-200">
              <h3 className="text-lg font-semibold mb-3 text-text-900">Remote Workers</h3>
              <p className="text-text-700">
                Maintain consistent presence across time zones without manual updates.
              </p>
            </div>
            <div className="bg-background-100 rounded-lg p-6 border border-text-200">
              <h3 className="text-lg font-semibold mb-3 text-text-900">Freelancers</h3>
              <p className="text-text-700">
                Manage multiple client workspaces effortlessly with unified automation.
              </p>
            </div>
            <div className="bg-background-100 rounded-lg p-6 border border-text-200">
              <h3 className="text-lg font-semibold mb-3 text-text-900">Consultants</h3>
              <p className="text-text-700">
                Show availability to clients automatically during your consulting hours.
              </p>
            </div>
            <div className="bg-background-100 rounded-lg p-6 border border-text-200">
              <h3 className="text-lg font-semibold mb-3 text-text-900">Team Leads</h3>
              <p className="text-text-700">
                Stay accessible to your team without being chained to your desk.
              </p>
            </div>
            <div className="bg-background-100 rounded-lg p-6 border border-text-200">
              <h3 className="text-lg font-semibold mb-3 text-text-900">Digital Nomads</h3>
              <p className="text-text-700">
                Work from anywhere with timezone-aware status automation.
              </p>
            </div>
            <div className="bg-background-100 rounded-lg p-6 border border-text-200">
              <h3 className="text-lg font-semibold mb-3 text-text-900">Support Teams</h3>
              <p className="text-text-700">
                Ensure consistent availability indicators during support hours.
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
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </Section>

        {/* CTA Section */}
        <CTASection
          title="Start Automating Your Slack Status Today"
          description="Join thousands of professionals who&apos;ve eliminated manual status management. No credit card required."
          primaryCTA={{ text: 'Get Started - Free Forever', href: '/signin' }}
          secondaryCTA={{ text: 'View Pricing', href: '/#pricing' }}
        />
      </SEOPageLayout>
    </>
  );
}
