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
    preHeadline: "Optimize Your Slack Experience",
    headline: "Set Your Working Slack Hours and never be offline again",
    highlightedText: "Activity Scheduler",
    suffix: "Made Easy",
    subheadline:
      "Effortlessly manage your Slack status and working hours with Slacktivity. Stay productive and online with our intuitive scheduling tool.",
    socialCare: {
      active: true,
      image: productivityImg,
      fatPrefix: "1k+ ",
      text: "users enhancing their productivity",
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
            text: "It's Free",
            link: "#setup",
          },
        },
      },
      button: {
        text: "Try it out",
        link: "/signup",
      },
    },
  },

  // problem section
  imageSection: {
    id: "image-section",
    features: [
      {
        title: "Easy Scheduling",
        description:
          "Effortlessly set your working hours and automate your Slack status.",
        image: "",
        background: "bg-stone-900",
      },
      {
        title: "Always Online",
        description:
          "Ensure you're consistently available during work hours with our online status feature.",
        image: appScreenshot1,
        background: "",
      },
      {
        title: "Custom Notifications",
        description:
          "Stay on track with reminders and notifications tailored to your work schedule.",
        image: appScreenshot2,
        background: "",
      },
      {
        title: "Seamless Integration",
        description:
          "Integrate effortlessly with your Slack workspace without any hassle.",
        image: "",
        background: "bg-accent",
      },
    ],
  },

  // benefits of the product
  benefitsFeature: {
    id: "features",
    headline: "Why Choose Slacktivity",
    highlightedText: "Scheduler",
    suffix: "App",
    subheadline:
      "Elevate your productivity and streamline your Slack management with ease.",
    features: [
      {
        title: "Automatic Status Updates",
        description:
          "Your Slack status updates automatically based on your scheduled hours.",
        image: appScreenshot1,
      },
      {
        title: "Effortless Setup",
        description:
          "Get started quickly by setting up your working hours and Slack integration in minutes.",
        image: appScreenshot2,
      },
      {
        title: "Customizable Notifications",
        description:
          "Receive notifications tailored to fit your work schedule and preferences.",
        image: appScreenshot1,
      },
      {
        title: "Enhanced Productivity",
        description:
          "Maintain focus and productivity during work hours with minimal effort.",
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
          description: "Easily specify the hours when you want to be online.",
          iconKey: "schedule",
        },
        {
          step: "Integrate with Slack",
          summary: "Connect your workspace.",
          description:
            "Authorize Slacktivity to manage your Slack status automatically.",
          iconKey: "integrate",
        },
        {
          step: "Boost Your Productivity",
          summary: "Focus on your work.",
          description:
            "Let Slacktivity handle your online presence while you focus on what matters.",
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
    highlightedText: "About Slacktivity",
    suffix: "",
    subheadline:
      "Discover how our users are transforming their productivity with Slacktivity.",
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
        {
          content:
            "I love how Slacktivity helps me stay organized and visible. It’s a game-changer for my productivity!",
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
            "Slacktivity is the best tool for maintaining an online presence during work hours. It’s indispensable!",
          author: {
            name: "Leland Kiehn",
            role: "Founder at Kiehn and Sons",
            image: avatarImage5,
          },
        },
        {
          content:
            "With Slacktivity, I never miss important Slack messages. It’s a great addition to my workflow.",
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
            "Slacktivity simplifies managing my Slack presence. It’s intuitive and highly effective.",
          author: {
            name: "Peter Renolds",
            role: "Founder of West Inc",
            image: avatarImage3,
          },
        },
        {
          content:
            "Slacktivity support is excellent! They’re quick and helpful in getting everything set up.",
          author: {
            name: "Amy Hahn",
            role: "Director at Velocity Industries",
            image: avatarImage4,
          },
        },
      ],
    ],
  },

  // last Call to Action
  emailSignUp: {
    id: "its-free",
    headline: "Ready to start with",
    highlightedText: "Slacktivity",
    suffix: "?",
    subheadline:
      "If you want to see more features, dont hasitate and reach out to us.",
    placeholder: "Try it out its free",
    buttonText: "Get Started",
  },
};
