"use client";

import { siteConfig } from "@/config/site";
import { PricePlan } from "./PricePlan";

import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { landingpageContent } from "@/constants/landingpage";

const Pricing = ({ user }: { user: User | null }) => {
  const router = useRouter();

  const handleAction = () => {
    if (!user) {
      router.push(siteConfig.auth.loginUrl);
    } else {
      router.push(siteConfig.auth.slackAuth);
    }
  };

  return (
    <section className="overflow-hidden" id={landingpageContent.stripe.title}>
      <div className="py-24 px-8 max-w-5xl mx-auto">
        <div className="flex flex-col text-center w-full mb-20">
          <p className="font-medium text-primary mb-8">
            {landingpageContent.stripe.title}
          </p>
          <h2 className="font-bold text-3xl lg:text-5xl tracking-tight">
            {landingpageContent.stripe.heading}
          </h2>
        </div>

        <div className="relative flex justify-center flex-col lg:flex-row items-center lg:items-stretch gap-8">
          {landingpageContent.stripe.plans.map((plan) => (
            <PricePlan onAction={handleAction} plan={plan} isLoading={false} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
