import { siteConfig } from "@/site";
import { landingpageContent } from "@/site";
import Link from "next/link";
import Image from "next/image";

export function SiteFooter() {
  const { main, legal, products } = landingpageContent.footer.links;

  return (
    <footer className="border-t bg-background my-10">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-start">
          {/* Left side - Logo and info */}
          <div className="mb-8 lg:mb-0 lg:w-1/4">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src={landingpageContent.header.company.logo}
                alt={landingpageContent.header.company.name}
                width={24}
                height={24}
                className="h-6 w-6"
              />
              <span className="text-sm font-semibold">{siteConfig.name}</span>
            </Link>
            <p className="mt-6 text-sm text-muted-foreground">
              {siteConfig.tagline}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
              reserved.
            </p>
          </div>

          {/* Right side - Links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:flex lg:flex-1 lg:justify-end lg:space-x-24">
            <div>
              <h3 className="text-sm font-semibold">LINKS</h3>
              <ul className="mt-4 space-y-3">
                {main.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold">LEGAL</h3>
              <ul className="mt-4 space-y-3">
                {legal.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold">MORE FROM THE MAKER</h3>
              <ul className="mt-4 space-y-3">
                {products.map((item) => (
                  <li key={item.name} className="flex items-center space-x-2">
                    <Image
                      src={item.icon}
                      alt={item.name}
                      width={24}
                      height={24}
                      className="h-6 w-6 rounded-sm"
                    />
                    <Link
                      href={item.href}
                      target={item.target}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Badges Section */}
        <div className="mt-12 pt-8 border-t border-border">
          <h3 className="text-sm text-muted-foreground font-semibold text-center mb-6">
            AS SEEN ON
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-6">
            <a
              href="https://startupfa.me/s/slackactivity?utm_source=slackactivity.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:opacity-90 transition-opacity"
            >
              <img
                src="https://startupfa.me/badges/featured-badge.webp"
                alt="Slackactivity - Featured on Startup Fame"
                className="h-10 w-auto object-contain"
                style={{
                  minHeight: "40px",
                  maxWidth: "150px",
                  width: "auto",
                  height: "auto",
                }}
              />
            </a>
            <a
              href="https://submitaitools.org"
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:opacity-90 transition-opacity"
            >
              <img
                src="https://submitaitools.org/static_submitaitools/images/submitaitools.png"
                alt="Submit AI Tools – Discover and explore AI tools"
                className="h-10 w-auto object-contain"
                style={{
                  borderRadius: "8px",
                  minHeight: "40px",
                  maxWidth: "150px",
                  width: "auto",
                  height: "auto",
                  backgroundColor: "white",
                  padding: "4px",
                }}
              />
            </a>
            <a href="https://www.aidirectori.es" target="_blank">
              <img
                src="https://cdn.aidirectori.es/ai-tools/badges/dark-mode.png"
                alt="AI Directories Badge"
                className="h-10 w-auto object-contain"
                style={{
                  borderRadius: "8px",
                  minHeight: "40px",
                  maxWidth: "150px",
                  width: "auto",
                  height: "auto",
                  backgroundColor: "white",
                  padding: "4px",
                }}
              />
            </a>
            <a href="https://twelve.tools" target="_blank">
              <img
                src="https://twelve.tools/badge0-white.svg"
                alt="Featured on Twelve Tools"
                className="h-10 w-auto object-contain"
                style={{
                  borderRadius: "8px",
                  minHeight: "40px",
                  maxWidth: "150px",
                  width: "auto",
                  height: "auto",
                  backgroundColor: "white",
                  padding: "4px",
                }}
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
