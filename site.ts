import avatarImage1 from "@/public/landingpage/avatars/avatar-1.png";
import avatarImage5 from "@/public/landingpage/avatars/avatar-5.png";
import productivityImg from "@/public/landingpage/socialcare.png";
import logo from "@/public/logo.png";

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

export const landingpageContent = {
  header: {
    company: {
      name: "Slackactivity",
      logo: logo,
      logoHref: "/",
    },
    button: {
      active: true,
      text: "Get Started - Free Forever",
      href: "/signin",
    },
    NavAndFooterLinks: [
      {
        active: false,
        text: "How It Works",
        href: "#setup",
      },
      {
        active: false,
        text: "Features",
        href: "#features",
      },
    ],
  },
  // hero section
  hero: {
    preHeadline: "Slackactivity",
    headline: "Stay Active on Slack, Anytime.",
    highlightedText: "",
    suffix: "",
    subheadline:
      "Trusted by remote teams in 40+ countries to keep Slack status green and connected, even when you're away from your desk.",
    socialCare: {
      active: true,
      image: productivityImg,
      fatPrefix: "5k+ teams ",
      text: "count on Slacktivity to stay present in Slack",
    },
    cta: {
      actions: {
        email: {
          active: false,
          placeholder: "Enter your email to get started",
        },
        links: {
          howItWorks: {
            active: true,
            text: "How It Works",
            link: "#setup",
          },
        },
      },
      button: {
        text: "Get Started - Free Forever",
        link: "/signin",
      },
    },
  },
  demoVideo: {
    src: "/Salackactivity_demo_movie.mov",
    title: "",
  },
  fancyContent: {
    id: "appear-active",
    headline: "Appear Active on Slack",
    highlightedText: "",
    suffix: "",
    description: `
    Slack sets you to 'away' after 30 minutes of no activity, making you seem unavailable. Our App fixes that — keeping your status active and online every 5 minutes, even when you're not at your desk. Stay visible, stay engaged, and never worry about going offline again! Now, you can stay online and available all day. Take charge of your status and eliminate the hassle of appearing inactive!
    `,
  },

  // feature st eps section
  featureSteps: {
    id: "setup",
    title: "",
    headline: "",
    highlightedText: "Slackactivity",
    suffix: "in 3 Simple Steps",
    subheadline:
      "Set up in minutes and let Slackactivity manage your online status, so you stay active even when you're away.",
    iconView: {
      active: true,
      steps: [
        {
          step: "Connect Your Workspace",
          summary: "Quick and secure.",
          description:
            "Easily link your Slack workspace for automatic status management, keeping you online with no extra effort.",
          iconKey: "integrate",
        },
        {
          step: "Set Your Availability",
          summary: "Tailored to your schedule.",
          description:
            "Define your working hours. Slacktivity will ensure your status reflects when you're available, all without manual updates.",
          iconKey: "schedule",
        },
        {
          step: "Focus on What Matters",
          summary: "Productivity maximized.",
          description:
            "Stay focused on your tasks, while Slacktivity keeps you online and engaged in Slack. Let us handle the presence, so you can handle the work.",
          iconKey: "focus",
        },
      ],
    },
  },

  // pricing section
  stripe: {
    id: "pricing",
    title: "Simple Pricing",
    heading: "Elevate Your Slack Presence",
    subheadline:
      "Choose the plan that fits your needs and boost your productivity",
    buttonText: "Get Started 🚀",
    plans: [
      {
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1QBzOkK0DN5oBxDUxaIdEE2R"
            : "price_1QBhGFK0DN5oBxDUqgjRBTA3",
        mode: "subscription",
        name: "Monthly Pro",
        description: "Flexible monthly subscription",
        price: 0,
        priceAnchor: "7.99",
        pricePer: "/month",
        currency: "EUR",
        features: [
          { name: "Always appear online in Slack" },
          { name: "Automatic status updates" },
          { name: "Support for one workspace" },
        ],
      },
      {
        priceId: "price_1QBhHWK0DN5oBxDURPEsphgv",
        mode: "payment",
        isFeatured: true,
        name: "Lifetime Access",
        description: "One-time payment for unlimited access",
        price: 0,
        priceAnchor: "39.99",
        pricePer: "workspace",
        currency: "EUR",
        features: [
          { name: "All Pro features" },
          { name: "Never pay again" },
          { name: "Lifetime updates and support" },
          { name: "VIP customer service" },
        ],
      },
    ],
  },

  // middle call to action
  middleCTA: {
    id: "live-examples",
    headline: "Ready to Stay Active on Slack?",
    highlightedText: "",
    suffix: "",
    subheadline:
      "Join thousands of professionals who've optimized their workflow with Slacktivity. Start boosting your productivity now!",
    button: {
      text: "Get Started",
      href: "/signin",
    },
  },

  // testimonials
  testimonials: {
    active: true,
    id: "testimonials",
    headline: "What Our Users Say",
    highlightedText: "About Slacktivity",
    suffix: "",
    subheadline:
      "See how Slacktivity is transforming work for professionals across industries.",
    testimonials: [
      [
        {
          content:
            "Both my slack channels appear online during my working hours without any problem.",
          author: {
            name: "Sarah Chen",
            role: "Product Manager at Tech Corp",
            image: avatarImage1,
          },
        },
      ],
      [
        {
          content:
            "As a remote team lead, Slacktivity helps me respect my team's boundaries while staying connected. It's a game-changer for our productivity.",
          author: {
            name: "Miguel Rodriguez",
            role: "Engineering Lead at Global Solutions",
            image: avatarImage5,
          },
        },
      ],
      [
        {
          content:
            "Slacktivity is essential for maintaining work-life balance in our always-on culture. It's improved our team's communication and reduced burnout.",
          author: {
            name: "Aisha Patel",
            role: "HR Director at Innovate Inc",
            image: avatarImage5,
          },
        },
      ],
    ],
  },

  // last call to action
  emailSignUp: {
    id: "its-free",
    headline: "Ready to Boost Your Productivity with",
    highlightedText: "Slacktivity",
    suffix: "?",
    subheadline:
      "Start optimizing your workflow today or reach out to us at office@slacktivity.com for more information.",
    placeholder: "Enter your work email",
    buttonText: "Get Started",
  },
  footer: {
    links: {
      main: [
        { name: "How It Works", href: "/how-it-works" },
        { name: "Pricing", href: "/pricing" },
        { name: "Solutions", href: "/solutions" },
        { name: "Guides", href: "/guides" },
        { name: "Use Cases", href: "/use-cases" },
        { name: "Support", href: "/contact" },
      ],
      legal: [
        { name: "Terms of services", href: "/terms" },
        { name: "Privacy policy", href: "/privacy-policy" },
      ],
      products: [
        {
          icon: "https://promptsloth.com/logo.png",
          name: "Prompt Sloth",
          target: "_blank",
          href: "https://promptsloth.com/?ref=slacktivity",
        },
      ],
    },
  },
};
