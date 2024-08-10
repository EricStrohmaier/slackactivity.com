import appScreenshot1 from "@/public/landingpage/app_screenshot1.jpg";
import appScreenshot2 from "@/public/landingpage/app_screenshot2.jpg";
import avatarImage1 from "@/public/landingpage/avatars/avatar-1.png";
import avatarImage2 from "@/public/landingpage/avatars/avatar-2.png";
import avatarImage3 from "@/public/landingpage/avatars/avatar-3.png";
import avatarImage4 from "@/public/landingpage/avatars/avatar-4.png";
import avatarImage5 from "@/public/landingpage/avatars/avatar-5.png";
import backgroundImageMiddleCTA from "@/public/landingpage/bluebackgroundtree.jpg";
import abstractBackgroundImage from "@/public/landingpage/abstract-background.png";
import productivityImg from "@/public/landingpage/socialcare.png";
import logo from "@/public/logo.png";

export const landingpageContent = {
  header: {
    company: {
      name: "Schleude",
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
    preHeadline: "Maximize Your Slack Presence",
    headline: "Schleude",
    highlightedText: "Activity Scheduler",
    suffix: "Simplified",
    subheadline:
      "Set your working hours, stay online, and maintain your productivity effortlessly with our Slack integration.",
    socialCare: {
      active: true,
      image: productivityImg,
      fatPrefix: "1k+ ",
      text: "users boosting their productivity",
    },
    cta: {
      actions: {
        email: {
          active: true,
          placeholder: "Enter your email for updates",
        },
        links: {
          howItWorks: {
            active: false,
            text: "Learn More",
            link: "#setup",
          },
        },
      },
      button: {
        text: "Get Started",
        link: "/signup",
      },
    },
  },

  // problem section 1st outline the problem
  imageSection: {
    id: "image-section",
    features: [
      {
        title: "Easy Scheduling",
        description:
          "Set your working hours and automate your Slack status effortlessly.",
        image: "",
        background: "bg-stone-900",
      },
      {
        title: "Stay Online",
        description:
          "Ensure you're always available during work hours with our seamless online status feature.",
        image: appScreenshot1,
        background: "",
      },
      {
        title: "Custom Notifications",
        description:
          "Receive reminders and notifications to keep your productivity on track.",
        image: appScreenshot2,
        background: "",
      },
      {
        title: "Seamless Integration",
        description:
          "Integrate smoothly with your Slack workspace without any hassle.",
        image: "",
        background: "bg-accent",
      },
    ],
  },

  // benefits of the product
  benefitsFeature: {
    id: "features",
    headline: "Why Choose Schleude",
    highlightedText: "Scheduler",
    suffix: "App",
    subheadline:
      "Boost your productivity and manage your Slack presence like a pro.",
    features: [
      {
        title: "Automatic Status Updates",
        description:
          "Your Slack status updates automatically based on your set schedule.",
        image: appScreenshot1,
      },
      {
        title: "Effortless Setup",
        description:
          "Set up your working hours and Slack integration in just a few minutes.",
        image: appScreenshot2,
      },
      {
        title: "Customizable Notifications",
        description:
          "Receive notifications tailored to your work schedule and preferences.",
        image: appScreenshot1,
      },
      {
        title: "Enhanced Productivity",
        description:
          "Stay focused and present during your working hours with minimal effort.",
        image: appScreenshot2,
      },
    ],
  },

  // features/steps section
  featureSteps: {
    id: "setup",
    headline: "Get Started",
    highlightedText: "in 3 Simple Steps",
    suffix: "",
    subheadline:
      "Follow these steps to set up your working hours and optimize your Slack presence.",
    iconView: {
      active: true,
      steps: [
        {
          step: "Set Your Working Hours",
          summary: "Define your availability.",
          description: "Easily set the hours when you want to be online.",
          iconKey: "schedule",
        },
        {
          step: "Integrate with Slack",
          summary: "Connect your workspace.",
          description:
            "Authorize Schleude to update your Slack status automatically.",
          iconKey: "integrate",
        },
        {
          step: "Stay Productive",
          summary: "Focus on your work.",
          description:
            "Let Schleude manage your online presence so you can focus on what matters.",
          iconKey: "focus",
        },
      ],
    },
    imageView: {
      active: false,
      steps: [
        {
          step: "Set Your Working Hours",
          description: "Easily set the hours when you want to be online.",
          image: abstractBackgroundImage,
        },
        {
          step: "Integrate with Slack",
          summary: "Connect your workspace.",
          description:
            "Authorize Schleude to update your Slack status automatically.",
          image: abstractBackgroundImage,
        },
        {
          step: "Stay Productive",
          summary: "Focus on your work.",
          description:
            "Let Schleude manage your online presence so you can focus on what matters.",
          image: abstractBackgroundImage,
        },
      ],
    },
  },

  // middle cta
  middleCTA: {
    active: false,
    id: "get-started-today",
    headline: "Ready to Get Started?",
    subheadline:
      "Join our community and start optimizing your Slack activity today.",
    button: {
      className: "bg-accent",
      text: "Sign Up",
      href: "/signup",
    },
    textColor: "text-white",
    backgroundImage: backgroundImageMiddleCTA,
  },

  // Testimonials
  testimonials: {
    active: false,
    id: "testimonials",
    headline: "What People Say",
    highlightedText: "About Schleude",
    suffix: "",
    subheadline:
      "Hear how our users are enhancing their productivity with Schleude.",
    testimonials: [
      [
        {
          content:
            "Schleude makes it so easy to manage my Slack status. I can focus on work without worrying about appearing offline.",
          author: {
            name: "Sheryl Berge",
            role: "Product Manager at Tech Corp",
            image: avatarImage1,
          },
        },
        {
          content:
            "I love how Schleude helps me stay on top of my work hours and Slack presence. It's a game-changer!",
          author: {
            name: "Amy Hahn",
            role: "Team Lead at Velocity Industries",
            image: avatarImage4,
          },
        },
      ],
      [
        {
          content:
            "The best productivity tool I've added to my workflow. Schleude ensures I'm always online during work hours.",
          author: {
            name: "Leland Kiehn",
            role: "Founder at Kiehn and Sons",
            image: avatarImage5,
          },
        },
        {
          content:
            "With Schleude, I no longer have to worry about missing important Slack messages during work hours.",
          author: {
            name: "Erin Powlowski",
            role: "COO at Armstrong Inc",
            image: avatarImage2,
          },
        },
      ],
      [
        {
          content:
            "Schleude has simplified how I manage my Slack presence. It's so intuitive and effective.",
          author: {
            name: "Peter Renolds",
            role: "Founder of West Inc",
            image: avatarImage3,
          },
        },
        {
          content:
            "Schleude support is fantastic! Quick responses and really helpful in setting everything up.",
          author: {
            name: "Amy Hahn",
            role: "Director at Velocity Industries",
            image: avatarImage4,
          },
        },
      ],
    ],
  },

  // partner companies section
  partnerCompanies: {
    active: false,
    id: "partner-companies",
    headline: "Trusted by leading",
    highlightedText: "productivity enthusiasts",
    suffix: "",
    subheadline:
      "Join the ranks of professionals who trust Schleude for their Slack management.",
    companies: [
      { name: "Tech Corp", logo: "/images/logos/tech-corp.svg" },
      {
        name: "Velocity Industries",
        logo: "/images/logos/velocity-industries.svg",
      },
      { name: "Kiehn and Sons", logo: "/images/logos/kiehn-and-sons.svg" },
      { name: "West Inc", logo: "/images/logos/west-inc.svg" },
      { name: "Armstrong Inc", logo: "/images/logos/armstrong-inc.svg" },
    ],
  },

  // last Call to Action
  emailSignUp: {
    id: "email-sign-up",
    headline: "Stay Updated",
    highlightedText: "with Schleude",
    suffix: "",
    subheadline:
      "Enter your email to receive the latest updates and features for Schleude.",
    placeholder: "Enter your email",
    buttonText: "Subscribe",
  },
};
