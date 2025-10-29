import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, Video, Users, Clock, Zap, Shield, ArrowRight, AlertCircle } from 'lucide-react';
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
  generateFAQStructuredData,
  generateSoftwareApplicationStructuredData,
} from '@/lib/seo/config';

export const metadata: Metadata = {
  title: 'Keep Slack Active During Meetings - Stay Online During Video Calls',
  description:
    'Stay active on Slack during meetings, video calls, and conferences. Prevent away status while in Zoom, Teams, or Google Meet. Look available even when busy. Free solution.',
  keywords: [
    'slack active during meetings',
    'slack online during calls',
    'prevent slack away during video calls',
    'slack status during zoom',
    'stay active on slack in meetings',
    'slack away during teams calls',
  ],
};

const breadcrumbItems = [
  { name: 'Home', url: 'https://slackactivity.com' },
  { name: 'Solutions', url: 'https://slackactivity.com/solutions' },
  {
    name: 'Keep Slack Active During Meetings',
    url: 'https://slackactivity.com/solutions/keep-slack-active-during-meetings',
  },
];

const faqData = [
  {
    question: 'Why does Slack show me as away during video calls?',
    answer:
      "When you're in a video call (Zoom, Teams, Google Meet), you're not actively clicking or typing in Slack, so after 10 minutes of inactivity, Slack automatically marks you as 'away'. This happens even though you're actively working and available.",
  },
  {
    question: 'Will teammates know I\'m using a tool to stay active?',
    answer:
      'No. Slackactivity updates your presence status just like natural activity would. Your status simply shows as "Active" - there\'s no indication that you\'re using automation. It looks exactly like you being naturally active on Slack.',
  },
  {
    question: 'Does this work while screen sharing in meetings?',
    answer:
      'Yes! Whether you\'re presenting, screen sharing, or just in the call, Slackactivity keeps you active on Slack in the background. You don\'t need to alt-tab to Slack or worry about your status changing.',
  },
  {
    question: 'Can I still receive Slack notifications during meetings?',
    answer:
      'Absolutely. Slackactivity only manages your presence status (active/away). All your notifications, messages, and calls work normally. You can still receive and respond to urgent messages during meetings.',
  },
  {
    question: 'What if I want to appear away during certain meetings?',
    answer:
      'You have full control. You can pause Slackactivity anytime or set a custom status like "In a meeting - limited availability" and the tool will keep your presence active while respecting your custom message.',
  },
];

const structuredData = [
  generateBreadcrumbStructuredData(breadcrumbItems),
  generateFAQStructuredData(faqData),
  generateSoftwareApplicationStructuredData(),
];

export default function KeepSlackActiveDuringMeetingsPage() {
  return (
    <>
      <MultipleStructuredData dataArray={structuredData} />

      <SEOPageLayout>
        <Breadcrumbs items={breadcrumbItems} />

        {/* Hero Section */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-text-900">
            Keep Slack Active During Meetings: Stay Online During Video Calls
          </h1>
          <p className="text-xl text-text-600 mb-4">
            Stop appearing &quot;away&quot; on Slack when you&apos;re in meetings, video calls, or conferences. Stay
            active and available even while in Zoom, Teams, or Google Meet. Your team knows you&apos;re working, not
            missing in action.
          </p>
          <div className="flex items-center gap-2 text-sm text-text-500 mb-8">
            <span>Last updated: January 15, 2024</span>
            <span>•</span>
            <span>10 min read</span>
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
            Slackactivity automatically keeps your Slack status active during meetings and video calls. No more
            appearing &quot;away&quot; when you&apos;re in Zoom, Teams, or Google Meet. Your colleagues see you as
            available and working, even when you&apos;re busy in back-to-back calls. Completely automated, no manual
            updates needed. Free forever.
          </p>
        </Section>

        {/* The Problem */}
        <Section>
          <h2 className="text-3xl font-bold mb-6 text-text-900">
            The Meeting Problem: You&apos;re Working, But Slack Shows You&apos;re Away
          </h2>
          <p className="text-lg text-text-700 mb-6">
            You&apos;re in an important client call. Or a team standup. Or presenting in an all-hands meeting. You&apos;re
            actively engaged, paying attention, contributing value. But there&apos;s a problem:
          </p>
          <div className="bg-background-50 border-l-4 border-text-800 p-6 mb-6">
            <p className="text-lg font-medium text-text-900 mb-2">
              After 10 minutes of not clicking in Slack, your status changes to &quot;away&quot; - even though you&apos;re
              clearly working.
            </p>
            <p className="text-text-700">
              To your teammates, manager, or clients checking Slack, it looks like you&apos;re not at your desk,
              unavailable, or maybe not even working.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start bg-white p-5 rounded-lg border border-text-200">
              <AlertCircle className="w-6 h-6 text-text-800 mr-3 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-text-900">The Perception Problem</strong>
                <p className="text-text-700">
                  When you&apos;re in a 2-hour meeting, you show as &quot;away&quot; for most of it. Teammates wonder
                  where you are. Your manager notices. Remote workers especially struggle with this - appearing away
                  during meetings undermines trust and visibility.
                </p>
              </div>
            </div>
            <div className="flex items-start bg-white p-5 rounded-lg border border-text-200">
              <AlertCircle className="w-6 h-6 text-text-800 mr-3 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-text-900">The Constant Interruption</strong>
                <p className="text-text-700">
                  You can&apos;t focus on the meeting because you&apos;re alt-tabbing to Slack every few minutes to click
                  something and reset your status. This breaks your concentration and makes you less effective in
                  the actual meeting.
                </p>
              </div>
            </div>
            <div className="flex items-start bg-white p-5 rounded-lg border border-text-200">
              <AlertCircle className="w-6 h-6 text-text-800 mr-3 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-text-900">The Missed Opportunities</strong>
                <p className="text-text-700">
                  Someone needs an urgent answer. They see you&apos;re &quot;away&quot; and ask someone else instead. You
                  miss the chance to help, contribute, or be seen as responsive. These small moments add up over
                  time.
                </p>
              </div>
            </div>
            <div className="flex items-start bg-white p-5 rounded-lg border border-text-200">
              <AlertCircle className="w-6 h-6 text-text-800 mr-3 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-text-900">The Back-to-Back Meeting Reality</strong>
                <p className="text-text-700">
                  In today&apos;s remote work culture, many people have 4-6 hours of meetings daily. That&apos;s half the
                  workday showing as &quot;away&quot; on Slack. It creates a false impression of your work ethic and
                  availability.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* Why This Happens */}
        <Section variant="subtle">
          <h2 className="text-3xl font-bold mb-6 text-text-900">
            Why Does Slack Mark You Away During Meetings?
          </h2>
          <p className="text-lg text-text-700 mb-6">
            Understanding why this happens helps explain why Slackactivity is necessary:
          </p>
          <div className="space-y-5">
            <div className="bg-white border border-text-200 rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-2 text-text-900">Slack&apos;s Idle Detection</h3>
              <p className="text-text-700">
                Slack monitors keyboard and mouse activity specifically within the Slack app. After 10 minutes of
                no activity in Slack (not your computer overall), it automatically changes your status to
                &quot;away&quot;. This was designed to help people know when you&apos;re truly unavailable.
              </p>
            </div>
            <div className="bg-white border border-text-200 rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-2 text-text-900">Video Calls Happen Outside Slack</h3>
              <p className="text-text-700">
                When you&apos;re in Zoom, Microsoft Teams, Google Meet, or any other video platform, you&apos;re actively
                using your computer - talking, typing in the chat, screen sharing. But none of that registers as
                activity in Slack, so Slack assumes you&apos;re idle.
              </p>
            </div>
            <div className="bg-white border border-text-200 rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-2 text-text-900">No Built-In Meeting Integration</h3>
              <p className="text-text-700">
                While Slack can show calendar integrations or meeting statuses, it doesn&apos;t automatically keep you
                active during those meetings. The presence system is independent from calendar status, creating
                this disconnect.
              </p>
            </div>
            <div className="bg-white border border-text-200 rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-2 text-text-900">The 10-Minute Threshold</h3>
              <p className="text-text-700">
                Most meetings last 30-60 minutes minimum. Even if you check Slack at the start of a meeting, by
                the 10-minute mark you&apos;re already showing as away. A 1-hour meeting means 50 minutes of appearing
                unavailable.
              </p>
            </div>
          </div>
        </Section>

        {/* How Slackactivity Solves This */}
        <Section>
          <h2 className="text-3xl font-bold mb-6 text-text-900">
            How Slackactivity Keeps You Active During Meetings
          </h2>
          <p className="text-lg text-text-700 mb-6">
            Slackactivity runs continuously in the background, automatically maintaining your active status on Slack
            during your work hours - including when you&apos;re in meetings:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <FeatureCard
              icon={<Zap className="w-10 h-10" />}
              title="Automatic Presence Management"
              description="Updates your Slack status every few minutes during your configured work hours, keeping you active even when you're in video calls or meetings."
            />
            <FeatureCard
              icon={<Video className="w-10 h-10" />}
              title="Works With All Video Platforms"
              description="Whether you're in Zoom, Microsoft Teams, Google Meet, Webex, or any other platform, Slackactivity keeps your Slack status active."
            />
            <FeatureCard
              icon={<Clock className="w-10 h-10" />}
              title="Schedule-Based Automation"
              description="Set your work hours once. During those hours, you're automatically kept active - in meetings or not. Outside work hours, it does nothing."
            />
            <FeatureCard
              icon={<Shield className="w-10 h-10" />}
              title="Privacy-First Design"
              description="Slackactivity only manages your presence status. It can't see your calendar, join your meetings, or access your messages. Completely private."
            />
          </div>
        </Section>

        {/* Real Scenarios */}
        <Section variant="subtle">
          <h2 className="text-3xl font-bold mb-6 text-text-900">
            Real Scenarios: When This Matters Most
          </h2>
          <div className="space-y-6">
            <div className="bg-white border border-text-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-text-900">
                Scenario 1: The Remote Worker with Back-to-Back Meetings
              </h3>
              <div className="space-y-3">
                <div>
                  <strong className="text-text-900">The Situation:</strong>
                  <p className="text-text-700">
                    Alex is a remote product manager with 5-6 hours of video meetings daily - team standups, client
                    calls, sprint planning, 1-on-1s. During these meetings, he appears &quot;away&quot; on Slack for
                    hours at a time.
                  </p>
                </div>
                <div>
                  <strong className="text-text-900">The Problem:</strong>
                  <p className="text-text-700">
                    His manager mentioned in his review that he seems &quot;hard to reach&quot; and &quot;not always
                    available.&quot; Teammates started excluding him from quick decisions because he &quot;never seems to
                    be online.&quot; All this despite working 50-hour weeks.
                  </p>
                </div>
                <div>
                  <strong className="text-text-900">The Solution:</strong>
                  <p className="text-text-700">
                    Alex started using Slackactivity. Now he stays active during all meetings. His manager noticed
                    the change, teammates reach out more, and he&apos;s back in the loop on important discussions. His
                    reputation for availability dramatically improved.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-text-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-text-900">
                Scenario 2: The Consultant Presenting to Clients
              </h3>
              <div className="space-y-3">
                <div>
                  <strong className="text-text-900">The Situation:</strong>
                  <p className="text-text-700">
                    Maria runs a consulting firm and frequently delivers 2-3 hour client presentations via Zoom. She
                    has team members in multiple Slack workspaces who need to reach her for urgent client requests.
                  </p>
                </div>
                <div>
                  <strong className="text-text-900">The Problem:</strong>
                  <p className="text-text-700">
                    During presentations, she appears offline in all client workspaces. Team members would panic
                    when they couldn&apos;t reach her. Clients checking her Slack would see her as away, which looked
                    unprofessional given her premium rates.
                  </p>
                </div>
                <div>
                  <strong className="text-text-900">The Solution:</strong>
                  <p className="text-text-700">
                    With Slackactivity managing all her workspaces, Maria stays active everywhere during business
                    hours - including during long client presentations. Her team knows they can message her, and
                    clients see her as consistently available.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-text-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-text-900">
                Scenario 3: The Support Team Lead in Training Sessions
              </h3>
              <div className="space-y-3">
                <div>
                  <strong className="text-text-900">The Situation:</strong>
                  <p className="text-text-700">
                    Jordan leads a customer support team and spends several hours weekly training new hires via
                    video calls. During training, urgent support escalations happen frequently.
                  </p>
                </div>
                <div>
                  <strong className="text-text-900">The Problem:</strong>
                  <p className="text-text-700">
                    His team would see him as &quot;away&quot; during training sessions. They&apos;d hesitate to interrupt
                    him for escalations, sometimes making wrong decisions. His manager questioned why he was
                    &quot;unavailable&quot; so often during business hours.
                  </p>
                </div>
                <div>
                  <strong className="text-text-900">The Solution:</strong>
                  <p className="text-text-700">
                    Using Slackactivity, Jordan stays active on Slack even during training. His team knows they can
                    ping him for emergencies (he checks Slack on his phone during breaks). The perception issue is
                    solved, and urgent issues get escalated properly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Benefits */}
        <Section>
          <h2 className="text-3xl font-bold mb-6 text-text-900">
            Key Benefits of Staying Active During Meetings
          </h2>
          <div className="space-y-4">
            <div className="flex items-start bg-background-50 p-5 rounded-lg border border-text-200">
              <CheckCircle className="w-6 h-6 text-text-800 mr-4 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-text-900 text-lg">Professional Perception</strong>
                <p className="text-text-700 mt-1">
                  Managers, teammates, and clients see you as consistently available and engaged. This is
                  especially critical for remote workers who need to prove they&apos;re working even when not visible.
                </p>
              </div>
            </div>
            <div className="flex items-start bg-background-50 p-5 rounded-lg border border-text-200">
              <CheckCircle className="w-6 h-6 text-text-800 mr-4 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-text-900 text-lg">Better Focus in Meetings</strong>
                <p className="text-text-700 mt-1">
                  Stop worrying about your Slack status and focus on the actual meeting. No more alt-tabbing to
                  reset your presence. Be fully present in your calls and conversations.
                </p>
              </div>
            </div>
            <div className="flex items-start bg-background-50 p-5 rounded-lg border border-text-200">
              <CheckCircle className="w-6 h-6 text-text-800 mr-4 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-text-900 text-lg">Stay in the Loop</strong>
                <p className="text-text-700 mt-1">
                  Teammates will message you when they need you because you appear available. You don&apos;t get
                  excluded from quick decisions or lose opportunities to contribute valuable input.
                </p>
              </div>
            </div>
            <div className="flex items-start bg-background-50 p-5 rounded-lg border border-text-200">
              <CheckCircle className="w-6 h-6 text-text-800 mr-4 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-text-900 text-lg">Reduce Unnecessary Messages</strong>
                <p className="text-text-700 mt-1">
                  When you appear away, teammates send follow-up messages like &quot;Are you there?&quot; or &quot;When
                  you&apos;re back...&quot; Staying active eliminates this noise and makes communication more efficient.
                </p>
              </div>
            </div>
            <div className="flex items-start bg-background-50 p-5 rounded-lg border border-text-200">
              <CheckCircle className="w-6 h-6 text-text-800 mr-4 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-text-900 text-lg">Performance Review Protection</strong>
                <p className="text-text-700 mt-1">
                  Your &quot;availability&quot; won&apos;t be questioned in performance reviews. You won&apos;t hear
                  &quot;you&apos;re hard to reach&quot; or &quot;you seem unavailable a lot.&quot; Your Slack presence
                  matches your actual work effort.
                </p>
              </div>
            </div>
            <div className="flex items-start bg-background-50 p-5 rounded-lg border border-text-200">
              <CheckCircle className="w-6 h-6 text-text-800 mr-4 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-text-900 text-lg">Peace of Mind</strong>
                <p className="text-text-700 mt-1">
                  Set it once and forget it. You never have to think about your Slack status during meetings again.
                  It&apos;s handled automatically, giving you one less thing to worry about.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* How to Set It Up */}
        <Section variant="subtle">
          <h2 className="text-3xl font-bold mb-8 text-text-900">
            How to Set Up: Stay Active During All Meetings
          </h2>
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="relative pl-12 pb-8 border-l-2 border-text-800">
              <div className="absolute left-0 top-0 -ml-4 w-8 h-8 bg-text-800 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-text-900">Create Your Free Account</h3>
              <p className="text-text-700 mb-4">
                Visit{' '}
                <Link href="/" className="text-text-800 hover:underline font-medium">
                  Slackactivity.com
                </Link>{' '}
                and sign up in 30 seconds. No credit card required, no trial period - just free forever.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative pl-12 pb-8 border-l-2 border-text-800">
              <div className="absolute left-0 top-0 -ml-4 w-8 h-8 bg-text-800 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-text-900">Connect Your Slack Workspace</h3>
              <p className="text-text-700 mb-4">
                Click &quot;Connect Slack&quot; and authorize via OAuth. Slackactivity only requests permission to
                manage your presence - it cannot read messages, access files, or see your calendar.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative pl-12 pb-8 border-l-2 border-text-800">
              <div className="absolute left-0 top-0 -ml-4 w-8 h-8 bg-text-800 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-text-900">Set Your Work Hours</h3>
              <p className="text-text-700 mb-4">
                Configure when you want to stay active on Slack. Typical setup: Monday-Friday, 9 AM - 6 PM. During
                these hours, you&apos;ll stay active automatically - including during all meetings.
              </p>
              <div className="bg-background-100 p-4 rounded-lg border border-text-200">
                <p className="text-sm text-text-700">
                  <strong>Example:</strong> Set 8 AM - 5 PM as your work hours. Now whenever you&apos;re in a 10 AM
                  team meeting or 2 PM client call, Slackactivity keeps you active automatically in the background.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative pl-12">
              <div className="absolute left-0 top-0 -ml-4 w-8 h-8 bg-text-800 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-text-900">Enable Automation and Join Your Next Meeting</h3>
              <p className="text-text-700 mb-4">
                Toggle automation to &quot;On&quot; and that&apos;s it! You&apos;re done. Next time you join a meeting,
                you&apos;ll stay active on Slack the entire time without thinking about it.
              </p>
              <div className="bg-background-100 border border-text-200 rounded-lg p-4">
                <p className="text-text-700">
                  <strong className="text-text-900">✓ You&apos;re Protected!</strong> From now on, all your meetings
                  show you as active. Focus on the call, not your Slack status.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* Advanced Tips */}
        <Section>
          <h2 className="text-3xl font-bold mb-6 text-text-900">
            Advanced Tips for Meeting-Heavy Schedules
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-background-50 p-6 rounded-lg border border-text-200">
              <h3 className="text-xl font-semibold mb-3 text-text-900">Custom Status + Active Presence</h3>
              <p className="text-text-700 mb-3">
                Set a custom Slack status like &quot;In meetings today&quot; or &quot;Back-to-back calls - limited
                availability.&quot; Slackactivity keeps your presence active while respecting your custom message.
              </p>
              <p className="text-text-700 text-sm">
                This way teammates know you&apos;re busy but can still reach you for urgent matters.
              </p>
            </div>
            <div className="bg-background-50 p-6 rounded-lg border border-text-200">
              <h3 className="text-xl font-semibold mb-3 text-text-900">Multiple Workspaces</h3>
              <p className="text-text-700 mb-3">
                If you&apos;re in multiple Slack workspaces (company workspace + client workspaces), connect them all.
                You&apos;ll stay active in every workspace during meetings, not just one.
              </p>
              <p className="text-text-700 text-sm">
                Perfect for consultants who present to clients but need to stay reachable by their team.
              </p>
            </div>
            <div className="bg-background-50 p-6 rounded-lg border border-text-200">
              <h3 className="text-xl font-semibold mb-3 text-text-900">Mobile Access</h3>
              <p className="text-text-700 mb-3">
                During meetings, check Slack on your phone if something urgent comes through. You&apos;ll see messages
                in real-time since you&apos;re showing as active, and can quickly respond between meeting topics.
              </p>
              <p className="text-text-700 text-sm">
                Being active encourages teammates to reach out when they truly need you.
              </p>
            </div>
            <div className="bg-background-50 p-6 rounded-lg border border-text-200">
              <h3 className="text-xl font-semibold mb-3 text-text-900">After-Hours Meetings</h3>
              <p className="text-text-700 mb-3">
                Have occasional evening or weekend meetings? Temporarily extend your work hours for that day, or
                just enable automation for that specific time block.
              </p>
              <p className="text-text-700 text-sm">
                Full flexibility to match your actual schedule, including one-off meetings outside normal hours.
              </p>
            </div>
          </div>
        </Section>

        {/* Common Concerns */}
        <Section variant="subtle">
          <h2 className="text-3xl font-bold mb-6 text-text-900">
            Common Questions and Concerns
          </h2>
          <div className="space-y-5">
            <div className="bg-white border border-text-200 rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-2 text-text-900">
                &quot;Won&apos;t people think I&apos;m ignoring them if I&apos;m active but don&apos;t respond immediately?&quot;
              </h3>
              <p className="text-text-700">
                Not if you set expectations. Use a custom status like &quot;In meetings - will respond within 1
                hour&quot; or enable Slack&apos;s Do Not Disturb during calls. People understand you&apos;re busy; they
                just want to know you&apos;re working and will see their message eventually.
              </p>
            </div>
            <div className="bg-white border border-text-200 rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-2 text-text-900">
                &quot;Is it dishonest to appear active when I&apos;m in a meeting?&quot;
              </h3>
              <p className="text-text-700">
                Not at all. You ARE actively working - you&apos;re in a meeting, which is work. The dishonest thing
                is Slack showing you as &quot;away&quot; when you&apos;re clearly engaged in work activities. You&apos;re
                simply correcting a flaw in Slack&apos;s presence detection.
              </p>
            </div>
            <div className="bg-white border border-text-200 rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-2 text-text-900">
                &quot;What if I&apos;m in a meeting and truly can&apos;t respond to Slack?&quot;
              </h3>
              <p className="text-text-700">
                That&apos;s fine. You can be active on Slack without responding immediately. Set a status message
                explaining you&apos;re busy, or enable Do Not Disturb. Being active just means you&apos;re working and
                will see messages - not that you&apos;ll respond instantly.
              </p>
            </div>
            <div className="bg-white border border-text-200 rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-2 text-text-900">
                &quot;Can my employer see I&apos;m using this tool?&quot;
              </h3>
              <p className="text-text-700">
                No. Slackactivity updates your status through official Slack APIs - the same way you would if you
                manually clicked in Slack. There&apos;s no indication that you&apos;re using automation. Your status
                simply shows as &quot;Active&quot; like normal.
              </p>
            </div>
          </div>
        </Section>

        {/* FAQ */}
        <Section>
          <h2 className="text-3xl font-bold mb-8 text-text-900">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <FAQItem
              question={faqData[0].question}
              answer={faqData[0].answer}
            />
            <FAQItem
              question={faqData[1].question}
              answer={faqData[1].answer}
            />
            <FAQItem
              question={faqData[2].question}
              answer={faqData[2].answer}
            />
            <FAQItem
              question={faqData[3].question}
              answer={faqData[3].answer}
            />
            <FAQItem
              question={faqData[4].question}
              answer={faqData[4].answer}
            />
          </div>
        </Section>

        {/* CTA Section */}
        <CTASection
          title="Ready to Stay Active During Every Meeting?"
          description="Join thousands of professionals who never appear away during meetings again. Set up takes 2 minutes. Free forever, no credit card required."
          primaryCTA={{ text: 'Get Started - Free Forever', href: '/signin' }}
          secondaryCTA={{ text: 'Learn More', href: '/how-it-works' }}
        />
      </SEOPageLayout>
    </>
  );
}
