import avatarImage1 from "@/public/landingpage/avatars/avatar-1.png";
import avatarImage5 from "@/public/landingpage/avatars/avatar-5.png";
import abstractBackgroundImage from "@/public/landingpage/abstract-background.png";
import productivityImg from "@/public/landingpage/socialcare.png";
import logo from "@/public/logo.png";
import { siteConfig } from "@/config/site";

export const landingpageContent = {
  header: {
    company: {
      name: "slacktivity",
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
      // need smaller text here
      "Easily manage your Slack status with Slacktivity. Automatically set yourself as 'away' or 'active' according to your defined working hours, helping you stay productive without the distractions.",
    socialCare: {
      active: false,
      image: productivityImg,
      fatPrefix: "1k+ ",
      text: "users boosting their productivity",
    },
    cta: {
      actions: {
        email: {
          active: false,
          placeholder: "Enter your email for updates",
        },
        links: {
          howItWorks: {
            active: true,
            text: "Learn More",
            link: "#features",
          },
        },
      },
      button: {
        text: "Try it out",
        link: "/signin",
      },
    },
  },

  // features/steps section
  featureSteps: {
    id: "setup",
    headline: "",
    highlightedText: "Slacktivity",
    suffix: "in 3 Simple Steps",
    subheadline:
      "Get set up in minutes and let Slacktivity take care of your Slack status for you.",
    iconView: {
      active: true,
      // account generation and payment before
      steps: [
        {
          step: "Integrate with Slack",
          summary: "Connect your workspace.",
          description:
            "Link your Slack account to automate your status updates seamlessly.",
          iconKey: "integrate",
        },
        {
          step: "Set Your Working Hours",
          summary: "Define your schedule.",
          description:
            "Choose the times you're available, and we'll handle the rest.",
          iconKey: "schedule",
        },
        {
          step: "Boost Your Productivity",
          summary: "Focus on your tasks.",
          description:
            "Let Slacktivity manage your online presence, so you can stay focused on work.",
          iconKey: "focus",
        },
      ],
    },
    imageView: {
      active: false,
      steps: [
        {
          step: "Set Your Working Hours",
          description: "Easily specify the hours when you want to be online.",
          image: abstractBackgroundImage,
        },
        {
          step: "Integrate with Slack",
          summary: "Connect your workspace.",
          description:
            "Authorize Slacktivity to manage your Slack status automatically.",
          image: abstractBackgroundImage,
        },
        {
          step: "Boost Your Productivity",
          summary: "Focus on your work.",
          description:
            "Let Slacktivity handle your online presence while you focus on what matters.",
          image: abstractBackgroundImage,
        },
      ],
    },
  },
  stripe: {
    id: "pricing",
    title: "Pricing",
    heading: "Unlock Your Productivity!",
    subheadline: "",
    buttonText: "Get Now 🚀",
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
  // middle cta
  middleCTA: {
    id: "live-examples",
    headline: "Try Slacktivity Now",
    highlightedText: "",
    suffix: "",
    subheadline:
      "Experience how Slacktivity helps professionals streamline their work by automating Slack status management. Start now for free!",
    button: {
      text: "Get Started",
      href: "/signin",
    },
  },

  // Testimonials
  testimonials: {
    active: true,
    id: "testimonials",
    headline: "What Our Users Say",
    highlightedText: "About Slacktivity",
    suffix: "",
    subheadline: "See how Slacktivity is improving productivity for our users.",
    testimonials: [
      [
        {
          content:
            "Slacktivity makes managing my Slack status a breeze. I can focus on work without worrying about being offline.",
          author: {
            name: "Sheryl Berge",
            role: "Product Manager at Tech Corp",
            image: avatarImage1,
          },
        },
      ],
      [
        {
          content:
            "Slacktivity is the best tool for maintaining an online presence during work hours. It’s indispensable!",
          author: {
            name: "Leland Kiehn",
            role: "Founder at Kiehn and Sons",
            image: avatarImage5,
          },
        },
      ],
      [
        {
          content:
            "Slacktivity is the best tool for maintaining an online presence during work hours. It’s indispensable!",
          author: {
            name: "Leland Kiehn",
            role: "Founder at Kiehn and Sons",
            image: avatarImage5,
          },
        },
      ],
    ],
  },

  // last Call to Action
  emailSignUp: {
    id: "its-free",
    headline: "Ready to Get Started with",
    highlightedText: "Slacktivity",
    suffix: "?",
    subheadline:
      "Want to learn more? Reach out to us at office@slackactivity.com.",
    placeholder: "Enter your email for updates",
    buttonText: "Get Started",
  },
};
