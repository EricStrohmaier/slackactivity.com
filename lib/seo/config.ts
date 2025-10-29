import { Metadata } from "next";

export interface SEOPageConfig {
  title: string;
  description: string;
  keywords: readonly string[] | string[];
  ogImage?: string;
  canonical?: string;
  noindex?: boolean;
  structuredData?: any;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://slackactivity.com";

export const seoPages = {
  home: {
    title: "Slackactivity - Stay Active on Slack Automatically",
    description:
      "Keep your Slack status active automatically. Never appear away again with our smart Slack status automation tool. Free to start, works 24/7.",
    keywords: [
      "slack status automation",
      "keep slack online",
      "slack auto away prevention",
      "automatic slack status",
      "slack presence management",
      "slack availability tool",
    ],
    canonical: baseUrl,
  },
  slackAutoAway: {
    title: "Slack Auto Away Prevention - Never Show Away on Slack Again",
    description:
      "Prevent Slack from showing you as away. Our tool keeps your status active automatically, ensuring you always appear online during work hours. Free trial available.",
    keywords: [
      "slack auto away prevention",
      "prevent slack away status",
      "slack always active",
      "disable slack away",
      "slack status active tool",
      "keep slack green",
    ],
    canonical: `${baseUrl}/solutions/slack-auto-away-prevention`,
  },
  statusAutomation: {
    title: "Slack Status Automation Tool - Automatic Status Management",
    description:
      "Automate your Slack status updates with smart scheduling. Set it once and let our tool manage your online presence automatically. Perfect for remote teams.",
    keywords: [
      "slack status automation tool",
      "automatic slack status",
      "slack status scheduler",
      "automated status updates",
      "slack automation software",
      "status management tool",
    ],
    canonical: `${baseUrl}/solutions/slack-status-automation`,
  },
  remoteWorkers: {
    title: "Slack Status Tool for Remote Workers - Stay Connected",
    description:
      "Essential Slack tool for remote workers. Manage your availability across time zones, automate status updates, and maintain professional presence effortlessly.",
    keywords: [
      "slack for remote workers",
      "remote work slack tool",
      "slack timezone management",
      "distributed team slack",
      "work from home slack",
      "remote availability tool",
    ],
    canonical: `${baseUrl}/use-cases/remote-workers`,
  },
  howToStayOnline: {
    title: "How to Stay Online on Slack During Work Hours - Complete Guide",
    description:
      "Learn how to maintain an active Slack status throughout your workday. Step-by-step guide to staying online on Slack without manual updates. 100% automated.",
    keywords: [
      "how to stay online on slack",
      "keep slack status active",
      "slack always online guide",
      "maintain slack presence",
      "slack active status tips",
    ],
    canonical: `${baseUrl}/guides/how-to-stay-online-on-slack`,
  },
  scheduleAvailability: {
    title: "How to Schedule Your Slack Availability - Automation Guide",
    description:
      "Schedule your Slack availability automatically. Set your work hours, define time zones, and let automation handle your status. Perfect for flexible schedules.",
    keywords: [
      "schedule slack availability",
      "slack availability scheduler",
      "automatic slack schedule",
      "slack working hours",
      "slack time management",
    ],
    canonical: `${baseUrl}/guides/schedule-slack-availability`,
  },
  multiWorkspace: {
    title: "Manage Multiple Slack Workspaces Efficiently - Multi-Workspace Tool",
    description:
      "Manage multiple Slack workspaces from one dashboard. Sync status across all workspaces, schedule availability, and stay organized. Built for professionals.",
    keywords: [
      "multiple slack workspaces",
      "manage slack workspaces",
      "multi workspace slack tool",
      "slack workspace management",
      "sync slack status",
    ],
    canonical: `${baseUrl}/features/multiple-workspaces`,
  },
} as const;

export function generateMetadata(config: SEOPageConfig): Metadata {
  return {
    title: config.title,
    description: config.description,
    keywords: Array.isArray(config.keywords) ? config.keywords : undefined,
    alternates: {
      canonical: config.canonical,
    },
    robots: config.noindex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
    openGraph: {
      title: config.title,
      description: config.description,
      url: config.canonical,
      siteName: "Slackactivity",
      images: [
        {
          url: config.ogImage || `${baseUrl}/icon.jpeg`,
          width: 1200,
          height: 630,
          alt: config.title,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: config.title,
      description: config.description,
      images: [config.ogImage || `${baseUrl}/icon.jpeg`],
    },
  };
}

export function generateBreadcrumbStructuredData(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateSoftwareApplicationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Slackactivity",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "127",
    },
    description:
      "Automatic Slack status management tool that keeps you active on Slack 24/7. Perfect for remote workers and distributed teams.",
  };
}

export function generateFAQStructuredData(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateHowToStructuredData(
  name: string,
  description: string,
  steps: { name: string; text: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

export function generateArticleStructuredData(
  headline: string,
  description: string,
  datePublished: string,
  dateModified: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    datePublished,
    dateModified,
    author: {
      "@type": "Organization",
      name: "Slackactivity",
    },
    publisher: {
      "@type": "Organization",
      name: "Slackactivity",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
  };
}
