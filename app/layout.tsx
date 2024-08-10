import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

import { Toaster } from "@/components/ui/sonner";
import { Provider } from "@/components/Provider";
import { Header } from "@/components/landingpage/header";
import { Footer } from "@/components/landingpage/footer";
import { getRowUser } from "./action";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Free Slack Scheduler App",
  description: "Set your Slack status for free. So to never be offline again.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getRowUser();

  return (
    <html lang="en">
      <body className={`h-full ${inter.className}`}>
        <Provider>
          <div className="flex flex-col w-full h-full ">
            <div className="absolute inset-0 bg-gradient-to-b from-lightGreen to-stone-50 opacity-70 -z-10"></div>
            <Header user={user as any} />
            <main className="flex-auto">{children}</main>
          </div>
          <Footer />
          <Toaster richColors theme="light" closeButton />
        </Provider>
      </body>
    </html>
  );
}
