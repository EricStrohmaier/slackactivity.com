export const siteConfig = {
  supportEmail: "mailto:office@slackactivity.com",
  name: "Slackactivity",
  domain: "slackactivity.com",
  url: "https://slackactivity.com",
  //  Keep Slack Status Always Online
  defaultLocationText: "Effortlessly manage your Slack status",
  description:
    "Slackactivity is the ultimate tool for automatically managing your Slack status based on your work schedule and timezone. Ideal for professionals juggling multiple workspaces, it ensures that your status is always up-to-date, without manual intervention. Stay connected and boost productivity effortlessly.",
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
