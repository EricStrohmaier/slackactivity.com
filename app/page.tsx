import React from "react";
import EmailSignUp from "@/components/landingpage/emailsignup";
import { FeatureSteps } from "@/components/landingpage/FeatureSteps";
import { Hero } from "@/components/landingpage/Hero";
import { BenefitsFeature } from "@/components/landingpage/BenefitsFeature";
import { MiddleCallToAction } from "@/components/landingpage/MiddleCallToAction";
import { Testimonials } from "@/components/landingpage/Testimonials";
import { MiddleCTA } from "@/components/landingpage/MiddleCTA";
import Pricing from "@/components/app/Pricing";

export default async function page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { show: boolean };
}) {
  return (
    <div className="text-text">
      <Hero />
      <BenefitsFeature />
      <MiddleCTA />
      <FeatureSteps />
      <Pricing />
      <Testimonials />
      <EmailSignUp />
    </div>
  );
}
