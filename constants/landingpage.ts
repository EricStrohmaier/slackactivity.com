import avatarImage1 from "@/public/landingpage/avatars/avatar-1.png";
import avatarImage5 from "@/public/landingpage/avatars/avatar-5.png";
import abstractBackgroundImage from "@/public/landingpage/abstract-background.png";
import productivityImg from "@/public/landingpage/socialcare.png";
import logo from "@/public/logo.png";
import { siteConfig } from "@/config/site";

export const landingpageContent = {
  header: {
    company: {
      name: "Slacktivity",
      logo: logo,
      logoHref: "/",
    },
    button: {
      active: true,
      text: "Get Started",
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
    preHeadline: "Slacktivity",
    headline: "Automate Your Slack Schedule",
    highlightedText: "",
    suffix: "",
    subheadline:
      "Boost productivity and maintain work-life balance with Slacktivity. Automatically manage your Slack status based on your schedule, reducing distractions and improving focus.",
    socialCare: {
      active: true,
      image: productivityImg,
      fatPrefix: "5k+ ",
      text: "professionals optimizing their workflow",
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
        text: "Get Started",
        link: "/signin",
      },
    },
  },

  // feature steps section
  featureSteps: {
    id: "setup",
    headline: "",
    highlightedText: "Slacktivity",
    suffix: "in 3 Simple Steps",
    subheadline:
      "Get set up in minutes and let Slacktivity optimize your Slack presence automatically.",
    iconView: {
      active: true,
      steps: [
        {
          step: "Connect Your Workspace",
          summary: "Seamless integration.",
          description:
            "Securely link your Slack account for automatic status updates.",
          iconKey: "integrate",
        },
        {
          step: "Define Your Schedule",
          summary: "Customize your availability.",
          description:
            "Set your working hours and breaks. We'll handle the rest.",
          iconKey: "schedule",
        },
        {
          step: "Maximize Your Focus",
          summary: "Boost productivity.",
          description:
            "Let Slacktivity manage your online presence while you tackle important tasks.",
          iconKey: "focus",
        },
      ],
    },
  },

  // pricing section
  stripe: {
    id: "pricing",
    title: "Pricing",
    heading: "Unlock Your Productivity Potential",
    subheadline: "Optimize your workflow with our powerful solution",
    buttonText: "Get Started 🚀",
    plans: [
      {
        isFeatured: true,
        name: "Workspace Pro",
        description: "The Complete Workspace Management Solution",
        price: 20,
        pricePer: "workspace",
        priceAnchor: "",
        currency: "EUR",
        features: [
          { name: "Automated Slack status updates" },
          { name: "Support for multiple workspaces" },
          { name: "Customized working hours per workspace" },
          { name: "Comprehensive activity logging" },
        ],
      },
    ],
  },

  // middle call to action
  middleCTA: {
    id: "live-examples",
    headline: "Maximize Your Productivity Today",
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
            "Slacktivity has revolutionized my workday. I've reclaimed 2 hours of focused work time each week!",
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
  footer: [
    { name: "Home", href: "/" },
    { name: "Contact", href: "mailto:office@slackactivity.com" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy-policy" },
  ],
};
