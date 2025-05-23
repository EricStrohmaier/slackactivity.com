export const siteConfig = {
  supportEmail: "office@slackactivity.com",
  name: "Slackactivity",
  domain: "slackactivity.com",
  url: "https://slackactivity.com",
  tagline: "Stay Active on Slack, Anytime.",
  description:
    "Slackactivity is a tool for automatically managing your Slack status. Based on your work schedule and timezone it ensures that your status is always up-to-date, without manual intervention. It's free and open source.",
  keywords: [
    "Slack status",
    "Slack automation",
    "productivity tool",
    "workspace management",
    "Slack integration",
    "automatic status updates",
    "remote work",
    "work schedule",
    "timezone management",
    "multi-workspace",
    "Slack productivity",
  ],
  mailgun: {
    subdomain: "mg",
    fromNoReply: `Slackactivity <noreply@slackactivity.com>`,
    fromAdmin: `Slackactivity <office@slackactivity.com>`,
    supportEmail: "support@slackactivity.com",
    forwardRepliesTo: "support@slackactivity.com",
  },
  auth: {
    loginUrl: "/signin",
    callbackUrl: "/dashboard",
    slackAuth: "/api/slack/auth",
  },
};
