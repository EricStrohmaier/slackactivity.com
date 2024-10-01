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
};

export default nextConfig;
