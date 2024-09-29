"use client";

import { siteConfig } from "@/config/site";
import apiClient from "@/lib/api";
import { useState } from "react";
import { Button } from "../ui/button";

// <Pricing/> displays the pricing plans for your app
// It's your Stripe config in config.js.stripe.plans[] that will be used to display the plans
// <ButtonCheckout /> renders a button that will redirect the user to Stripe checkout called the /api/stripe/create-checkout API endpoint with the correct priceId

const Pricing = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handlePayment = async (priceId: string) => {
    setIsLoading(true);

    try {
      const { url }: { url: string } = await apiClient.post(
        "/stripe/create-checkout",
        {
          priceId: priceId,
          successUrl: window.location.href,
          cancelUrl: window.location.href,
          mode: "payment",
        }
      );

      window.location.href = url;
    } catch (e) {
      console.error(e);
    }

    setIsLoading(false);
  };

  return (
    <section className="overflow-hidden" id={siteConfig.pricing.title}>
      <div className="py-24 px-8 max-w-5xl mx-auto">
        <div className="flex flex-col text-center w-full mb-20">
          <p className="font-medium text-primary mb-8">
            {siteConfig.pricing.title}
          </p>
          <h2 className="font-bold text-3xl lg:text-5xl tracking-tight">
            {siteConfig.pricing.heading}
          </h2>
        </div>

        <div className="relative flex justify-center flex-col lg:flex-row items-center lg:items-stretch gap-8">
          {siteConfig.stripe.plans.map((plan) => (
            <PlanCard
              key={plan.priceId}
              plan={plan}
              onPayment={() => handlePayment(plan.priceId)}
              isLoading={isLoading}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;

// PlanCard component
const PlanCard = ({
  plan,
  onPayment,
  isLoading,
}: {
  plan: any;
  onPayment: () => Promise<void>;
  isLoading: boolean;
}) => {
  return (
    <div className="relative w-full max-w-lg">
      {plan.isFeatured && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
          <span
            className={`text-xs text-white font-semibold border-0 bg-primary px-2 py-1 rounded-full `}
          >
            POPULAR
          </span>
        </div>
      )}

      {plan.isFeatured && (
        <div
          className={`absolute -inset-[1px] rounded-xl border-2 border-primary shadow-lg z-20`}
        ></div>
      )}

      <div className="relative flex flex-col h-full gap-5 lg:gap-8 z-10 p-8 rounded-xl w-full bg-stone-100">
        <div className="flex justify-between items-center gap-4">
          <div>
            <p className="text-lg lg:text-xl font-bold">{plan.name}</p>
            {plan.description && <p className=" mt-2">{plan.description}</p>}
          </div>
        </div>
        <div className="flex gap-2">
          {/* to very pretty so far */}
          {plan.priceAnchor && (
            <div className="flex flex-col justify-end mb-[4px] text-lg ">
              <p className="relative">
                <span className="absolute bg-black/80 h-[1.5px] inset-x-0 top-[53%]"></span>
                <span className="text-black/80">${plan.priceAnchor}</span>
              </p>
            </div>
          )}
          <p className={`text-5xl tracking-tight font-extrabold`}>
            {plan.currency === "EUR" ? "€" : "$"}
            {plan.price}
          </p>
          <div className="flex flex-col justify-end mb-[4px]">
            <p className="text-xs text-stone-500 uppercase font-semibold">
              {plan.currency}
            </p>
          </div>
        </div>
        {plan.features && (
          <ul className="space-y-2.5 leading-relaxed text-base flex-1">
            {plan.features.map((feature: any, i: number) => (
              <li key={i} className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-[18px] h-[18px] opacity-80 shrink-0"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>

                <span>{feature.name} </span>
              </li>
            ))}
          </ul>
        )}
        {/* make button centered */}
        <div className="flex justify-center z-50 ">
          <Button
            loading={isLoading}
            className="cursor-pointer hover:bg-primary hover:text-white"
            onClick={onPayment}
          >
            {siteConfig.pricing.buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};
