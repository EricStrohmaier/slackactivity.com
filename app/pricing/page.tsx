import { Metadata } from 'next';
import { CheckCircle, Heart, Zap, Shield } from 'lucide-react';
import { SEOPageLayout, CTAButton, Section } from '@/components/seo/SEOPageLayout';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { StructuredData } from '@/components/seo/StructuredData';
import { generateBreadcrumbStructuredData } from '@/lib/seo/config';

export const metadata: Metadata = {
  title: 'Pricing - Slackactivity | Free Forever',
  description:
    'Slackactivity is completely free. No hidden fees, no premium tiers, no trials. Just a free tool to keep your Slack status active automatically.',
  keywords: ['slackactivity pricing', 'free slack tool', 'slack automation free', 'free slack status'],
};

const breadcrumbItems = [
  { name: 'Home', url: 'https://slackactivity.com' },
  { name: 'Pricing', url: 'https://slackactivity.com/pricing' },
];

const structuredData = generateBreadcrumbStructuredData(breadcrumbItems);

export default function PricingPage() {
  return (
    <>
      <StructuredData data={structuredData} />

      <SEOPageLayout>
        <Breadcrumbs items={breadcrumbItems} />

        {/* Hero Section */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-text-900">Simple Pricing</h1>
          <p className="text-xl text-text-600 mb-8 max-w-2xl mx-auto">
            Slackactivity is completely free. No hidden fees, no premium tiers, no credit card required.
          </p>
        </header>

        {/* Free Plan Card */}
        <Section>
          <div className="max-w-2xl mx-auto">
            <div className="bg-background-100 border-2 border-text-800 rounded-2xl p-8 text-center shadow-lg">
              <div className="mb-6">
                <Heart className="w-16 h-16 mx-auto text-text-800 mb-4" />
                <h2 className="text-3xl font-bold text-text-900 mb-2">Free Forever</h2>
                <p className="text-text-600 text-lg">Everything you need, completely free</p>
              </div>

              <div className="text-5xl font-bold text-text-900 mb-2">€0</div>
              <p className="text-text-600 mb-8">Forever. No catch.</p>

              <CTAButton href="/signin" variant="primary" className="w-full sm:w-auto mb-8">
                Get Started - Free Forever
              </CTAButton>

              <div className="text-left space-y-3 mt-8">
                <h3 className="font-semibold text-text-900 mb-4 text-center">What&apos;s Included:</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-text-800 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-text-700">Automatic status updates every 5 minutes</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-text-800 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-text-700">Custom work schedule configuration</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-text-800 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-text-700">Timezone-aware automation</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-text-800 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-text-700">Multiple Slack workspaces</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-text-800 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-text-700">Secure OAuth authentication</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-text-800 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-text-700">Privacy-first design</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-text-800 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-text-700">Email support</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-text-800 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-text-700">No credit card required</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-text-800 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-text-700">Unlimited usage</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-text-800 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-text-700">No time limits</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Why Free Section */}
        <Section variant="subtle">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-text-900 text-center">
              Why Is Slackactivity Free?
            </h2>
            <div className="space-y-6">
              <div className="bg-white border border-text-200 rounded-lg p-6">
                <h3 className="font-semibold mb-2 text-text-900 flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-text-800" />
                  Built for the Community
                </h3>
                <p className="text-text-700">
                  We believe everyone should have access to tools that make remote work better. Slackactivity
                  started as a personal project and we decided to keep it free for everyone.
                </p>
              </div>
              <div className="bg-white border border-text-200 rounded-lg p-6">
                <h3 className="font-semibold mb-2 text-text-900 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-text-800" />
                  Simple and Efficient
                </h3>
                <p className="text-text-700">
                  Our tool does one thing really well - keeping your Slack status active. We don&apos;t need
                  complex infrastructure, so we can keep it free.
                </p>
              </div>
              <div className="bg-white border border-text-200 rounded-lg p-6">
                <h3 className="font-semibold mb-2 text-text-900 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-text-800" />
                  No Hidden Agenda
                </h3>
                <p className="text-text-700">
                  We don&apos;t sell your data. We don&apos;t have ads. We don&apos;t upsell premium features.
                  It&apos;s just a genuinely free tool.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* FAQ */}
        <Section>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-text-900 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-text-900">
                  Is it really completely free?
                </h3>
                <p className="text-text-700">
                  Yes! There are no hidden costs, no premium features locked behind a paywall, and no time
                  limits. Everything is free, forever.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-text-900">
                  Will it always be free?
                </h3>
                <p className="text-text-700">
                  Yes. We&apos;re committed to keeping Slackactivity free. We built it to help the remote work
                  community, and that mission won&apos;t change.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-text-900">
                  How many workspaces can I connect?
                </h3>
                <p className="text-text-700">
                  You can connect multiple Slack workspaces. There&apos;s no limit - manage all your client or
                  team workspaces from one dashboard.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-text-900">
                  Do you collect or sell my data?
                </h3>
                <p className="text-text-700">
                  No. We only access the minimum permission needed to update your Slack status. We never see
                  your messages, files, or any other data. And we definitely don&apos;t sell anything.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-text-900">
                  What if I need help or support?
                </h3>
                <p className="text-text-700">
                  Email us at office@slackactivity.com and we&apos;ll help you out. Support is free too!
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-text-900">
                  Are there any usage limits?
                </h3>
                <p className="text-text-700">
                  Nope! Use it as much as you want, with as many workspaces as you need. Unlimited usage,
                  forever.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* CTA Section */}
        <Section variant="highlight">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-text-900">Ready to Get Started?</h2>
            <p className="text-xl mb-6 text-text-700">
              Create your free account in less than 2 minutes. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton href="/signin" variant="primary">
                Get Started - Free Forever
              </CTAButton>
              <CTAButton href="/how-it-works" variant="secondary">
                Learn How It Works
              </CTAButton>
            </div>
          </div>
        </Section>
      </SEOPageLayout>
    </>
  );
}
