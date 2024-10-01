import React from "react";
import EmailSignUp from "@/components/landingpage/emailsignup";
import { FeatureSteps } from "@/components/landingpage/FeatureSteps";
import { Hero } from "@/components/landingpage/Hero";
import { Testimonials } from "@/components/landingpage/Testimonials";
import Pricing from "@/components/app/Pricing";
import { getUser } from "./action";
import { MiddleCTA } from "@/components/landingpage/MiddleCTA";

export default async function page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { show: boolean };
}) {
  const user = await getUser();
  return (
    <div className="text-text">
      <Hero />
      <FeatureSteps />
      <Pricing user={user} />
      <Testimonials />
      <MiddleCTA />
    </div>
  );
}
