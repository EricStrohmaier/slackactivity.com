"use client";

import { landingpageContent } from "@/site";
import Link from "next/link";
import { Container } from "./container";
import { Gradient } from "@/components/landingpage/gradient";
import { Button } from "../ui/button";

export function MiddleCTA() {
  const content = landingpageContent;

  return (
    <section id={content.middleCTA.id} aria-label={content.middleCTA.headline}>
      <Gradient className="relative">
        <div className="absolute inset-2 rounded-3xl bg-white/80" />
        <Container>
          <div className="relative pb-16 pt-20 text-center sm:py-24 max-w-3xl mx-auto">
            <hgroup>
              <h2 className="text-3xl sm:text-4xl font-bold text-text-900 mb-4">
                {content.middleCTA.headline}
                <span className="text-accent-400">
                  {content.middleCTA.highlightedText}
                </span>
                {content.middleCTA.suffix}
              </h2>
              <p className="text-lg text-text-700 mb-8">
                {content.middleCTA.subheadline}
              </p>
              <Link
                className="w-full"
                href={content.middleCTA.button.href || "/"}
              >
                <Button size={"lg"} variant={"landingpageCTA"}>
                  {content.middleCTA.button.text}
                </Button>
              </Link>
            </hgroup>
          </div>
        </Container>
      </Gradient>
    </section>
  );
}
