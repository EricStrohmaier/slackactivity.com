/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    missingSuspenseWithCSRBailout: false,
    serverActions: {
      allowedOrigins: ["partner.localhost:3000"],
    },
  },
  images: {
    domains: ["api.slack.com"],
    remotePatterns: [
      {
        hostname: "utfs.io",
        protocol: "https",
        port: "",
      },
      {
        hostname: "vhxkjwczllimkfbbowmf.supabase.co",
        protocol: "https",
      },
      {
        hostname: "api.slack.com",
        protocol: "https",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/plausible/js/script.js",
        destination: "https://plausible.io/js/script.js",
      },
      {
        source: "/plausible/api/event",
        destination: "https://plausible.io/api/event",
      },
    ];
}
};

export default nextConfig;
