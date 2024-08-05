import code from "@/public/landingpage/code.jpg";
import code2 from "@/public/landingpage/code2.jpg";

export const landingpageContent = {
  header: {
    companyName: "Schleude",
    NavAndFooterLinks: [
      {
        active: false,
        text: "Features",
        href: "#features",
      },
      {
        active: false,
        text: "Pricing",
        href: "#pricing",
      },
    ],
    button: {
      active: true,
      text: "Try It Now",
      href: "/signin",
    },
  },
  hero: {
    preHeadline: "Keep Your Status Active",
    headline: "Schleude for Slack",
    highlightedText: "Stay Present",
    suffix: "Even When You're Away",
    subheadline:
      "Ensure your Slack status remains active even when you're not at your desk with Schleude. Effortless status management to keep you connected.",
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
        text: "Try It Free",
        link: "/signin",
      },
    },
  },
  primaryfeatures: {
    id: "features",
    headline: "Why Schleude?",
    highlightedText: "Top Features",
    suffix: "",
    subheadline:
      "Discover how Schleude enhances your Slack experience with these powerful features.",
    features: [
      {
        title: "Continuous Presence",
        description:
          "Keep your Slack status active, ensuring you stay visible even when you’re not at your computer.",
        image: code,
      },
      {
        title: "Customizable Status",
        description:
          "Set and customize your status to reflect your current activity or mood, automatically updated for you.",
        image: code2,
      },
      {
        title: "Automatic Updates",
        description:
          "Easily manage and update your status based on your calendar, activity, or custom rules.",
        image: code,
      },
      {
        title: "Seamless Integration",
        description:
          "Integrates effortlessly with Slack, requiring minimal setup for maximum impact.",
        image: code2,
      },
    ],
  },
  secondaryFeature: {
    id: "setup",
    headline: "Get Started",
    highlightedText: "in 3 Simple Steps",
    suffix: "",
    subheadline:
      "Follow these straightforward steps to start using Schleude and keep your Slack status active effortlessly.",
    howItWorks: [
      {
        step: "Install the App",
        summary: "Add Schleude to your Slack workspace.",
        description:
          "Visit the Slack App Directory, search for Schleude, and add it to your workspace.",
        iconKey: "install",
      },
      {
        step: "Configure Settings",
        summary: "Set your preferences and rules.",
        description:
          "Adjust settings to customize your status updates and rules according to your needs.",
        iconKey: "settings",
      },
      {
        step: "Enjoy Seamless Presence",
        summary: "Let Schleude handle your Slack status.",
        description:
          "Relax as Schleude ensures your Slack status reflects your availability, even when you're away.",
        iconKey: "enjoy",
      },
    ],
  },
  imageSection: {
    id: "image-section",
    features: [
      {
        title: "Effortless Integration",
        description:
          "Easily integrate Schleude with your Slack workspace and start managing your status effortlessly.",
        image: "",
        background: "bg-secondary",
      },
      {
        title: "Customizable Settings",
        description:
          "Tailor the status updates and rules to fit your unique needs and preferences.",
        image: code,
        background: "",
      },
      {
        title: "Reliable Performance",
        description:
          "Enjoy consistent and reliable performance with minimal setup and maintenance required.",
        image: code2,
        background: "",
      },
      {
        title: "User-Friendly Interface",
        description:
          "Navigate through an intuitive interface designed for ease of use and efficiency.",
        image: "",
        background: "bg-accent",
      },
    ],
  },
  emailSignUp: {
    id: "email-sign-up",
    headline: "Stay Updated",
    highlightedText: "with Schleude News",
    suffix: "",
    subheadline:
      "Sign up to receive the latest updates, features, and tips for getting the most out of Schleude.",
    placeholder: "Enter your email",
    buttonText: "Subscribe",
  },
};
