import { PricePlan } from "./PricePlan";
import { User } from "@supabase/supabase-js";
import { landingpageContent } from "@/site";
import { siteConfig } from "@/site";

const Pricing = ({ user }: { user: User | null }) => {
  return (
    <section className="overflow-hidden" id="pricing">
      <div className="py-24 px-8 max-w-5xl mx-auto">
        <div className="flex flex-col text-center w-full mb-20">
          <p className="font-medium text-primary mb-8">{siteConfig.tagline}</p>
          <h2 className="font-bold text-3xl lg:text-5xl tracking-tight">
            {landingpageContent.stripe.heading}
          </h2>
        </div>

        <div className="relative flex justify-center flex-col lg:flex-row items-center lg:items-stretch gap-8">
          {landingpageContent.stripe.plans.map((plan) => (
            <PricePlan
              user={user || null}
              plan={plan}
              isLoading={false}
              key={plan.name}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
