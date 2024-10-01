export const siteConfig = {
  supportEmail: "mailto:office@slackactivity.com",
  name: "Slackactivity",
  domain: "slackactivity.com",
  url: "https://slackactivity.com",
  defaultLocationText: "Effortlessly manage your Slack status",
  description: {
    marketplace:
      "Slackactivity is the ultimate tool for automatically managing your Slack status based on your work schedule and timezone. Ideal for professionals juggling multiple workspaces, it ensures that your status is always up to date, without manual intervention. Stay connected and boost productivity effortlessly.",
    landingPage:
      "Slackactivity is a simple tool designed to keep your Slack status in sync with your working hours. Whether you manage one or multiple workspaces, Slackactivity automates your availability, so you can focus on your work. No more forgetting to change your status—let Slackactivity handle it for you.",
  },
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
  footer: [
    { name: "Home", href: "/" },
    { name: "Features", href: "#features" },
    { name: "Contact", href: "mailto:office@slackactivity.com" },
    { name: "About Us", href: "/about" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
  ],
  mailgun: {
    subdomain: "mg",
    fromNoReply: `Slackactivity <noreply@slackactivity.com>`,
    fromAdmin: `Slackactivity <office@slackactivity.com>`,
    supportEmail: "support@slackactivity.com",
    forwardRepliesTo: "support@slackactivity.com",
  },
  pricing: {
    title: "Pricing",
    heading: "Unlock Your Productivity!",
    buttonText: "Subscribe Now 🚀",
  },
  auth: {
    loginUrl: "/signin",
    callbackUrl: "/dashboard",
    slackAuth: "/api/slack/auth",
  },
  stripe: {
    plans: [
      {
        isFeatured: true,
        name: "Productivity Boost",
        description: "Complete Workspace Management",
        price: 20,
        priceAnchor: "€20 / workspace",
        currency: "EUR",
        features: [
          { name: "Automated Slack status updates" },
          { name: "Multiple workspace support" },
          { name: "Customized working hours per workspace" },
          { name: "Activity logging and reports" },
        ],
      },
    ],
  },
};
