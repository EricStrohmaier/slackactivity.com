import React from "react";
import EmailSignUp from "@/components/landingpage/emailsignup";
import { FeatureSteps } from "@/components/landingpage/FeatureSteps";
import { Hero } from "@/components/landingpage/Hero";
import { Testimonials } from "@/components/landingpage/Testimonials";
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
      <FeatureSteps />
      {/* <Pricing /> */}
      {/* <BenefitsFeature /> */}
      <Testimonials />
      <EmailSignUp />
    </div>
  );
}
