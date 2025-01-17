import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

import { Toaster } from "@/components/ui/sonner";
import { Provider } from "@/components/Provider";
import { Header } from "@/components/landingpage/header";
import { SiteFooter } from "@/components/app/Footer";
import { getRowUser } from "./action";
import { siteConfig } from "@/config/site";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_SITE_URL}`),
  title: {
    default: "Slackactivity",
    template: "%s - Slackactivity",
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: "Slackactivity",
      url: process.env.NEXT_PUBLIC_SITE_URL,
    },
  ],
  openGraph: {
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/icon.jpeg`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getRowUser();

  return (
    <html lang="en">
      <head>
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="8aa1afc7-b3eb-460c-ab50-fd386289cdaa"
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2706727138311810"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`h-full ${inter.className}`}>
        <Provider>
          <div className="flex flex-col w-full h-full bg-background">
            <Header user={user as any} />
            <main className="flex-auto">{children}</main>
          </div>
          <SiteFooter />
          <Toaster richColors theme="light" closeButton />
        </Provider>
      </body>
    </html>
  );
}
