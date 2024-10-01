export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  supportEmail: "mailto:office@local-boards.com",
  name: "Slackactivity",
  domain: "slackactivity.com",
  url: "https://slackactivity.com",
  defaultLocationText: "Coming soon to a beach near you",
  description: {
    marketplace:
      "We're a global surfboard marketplace built by surfers, for surfers. Our platform connects the surfing community with a hassle-free way to find and rent boards at the world's best surf spots. No more stress from traveling with boards or spending hours hunting for rentals at new locations. Whether you're looking to rent for a day or longer, we make it easy to discover the right option, wherever your waves may be.",
    landingPage:
      "Local Boards is a global surfboard marketplace created by surfers, for surfers. Our platform connects the surfing community with a hassle-free way to find and rent boards at the world's best surf spots. No more stress from traveling with boards or wasting hours hunting for rentals. Whether you're on a quick trip or exploring new coastlines, we make it simple to find the perfect board for your next adventure.",
  },
  keywords: [
    "surfboard",
    "rental",
    "surfshop",
    "surf",
    "local",
    "boards",
    "surfboard rental",
    "global marketplace",
    "surf spots",
    "travel surfing",
    "board rentals",
    "surfing community",
    "hassle-free surfing",
  ],
  footer: [
    { name: "Home", href: "/" },
    { name: "Learn More", href: "https://info.local-boards.com" },
    { name: "Contact", href: "mailto:office@local-boards.com" },
    { name: "About Us", href: "https://info.local-boards.com/about-us" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
  ],
  mailgun: {
    // subdomain to use when sending emails, if you don't have a subdomain, just remove it. Highly recommended to have one (i.e. mg.yourdomain.com or mail.yourdomain.com)
    subdomain: "mg",
    // REQUIRED — Email 'From' field to be used when sending magic login links
    fromNoReply: `Local Boards <noreply@local-boards.com>`,
    // REQUIRED — Email 'From' field to be used when sending other emails, like abandoned carts, updates etc..
    fromAdmin: `Local Boards <office@local-boards.com>`,
    // Email shown to customer if need support. Leave empty if not needed => if empty, set up Crisp above, otherwise you won't be able to offer customer support."
    supportEmail: "support@local-boards.com",
    // When someone replies to supportEmail sent by the app, forward it to the email below (otherwise it's lost). If you set supportEmail to empty, this will be ignored.
    forwardRepliesTo: "support@local-boards.com",
  },
  pricing: {
    title: "Pricing",
    heading: "Unlock Your Productivity!",
    buttonText: "Get Now 🚀",
  },

  auth: {
    // REQUIRED — the path to log in users. It's use to protect private routes (like /dashboard). It's used in apiClient (/libs/api.js) upon 401 errors from our API
    loginUrl: "/signin",
    // REQUIRED — the path you want to redirect users after successfull login (i.e. /dashboard, /private). This is normally a private page for users to manage their accounts. It's used in apiClient (/libs/api.js) upon 401 errors from our API & in ButtonSignin.js
    callbackUrl: "/dashboard",
    slackAuth: "/api/slack/auth",
  },
};
