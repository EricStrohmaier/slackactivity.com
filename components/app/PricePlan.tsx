"use client";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/site";
import { landingpageContent } from "@/site";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
// PlanCard component
export const PricePlan = ({
  user,
  plan,
  isLoading,
}: {
  user: User | null;
  plan: any;
  isLoading: boolean;
}) => {
  const loginUrl = siteConfig.auth.loginUrl;
  return (
    <div className="relative w-full max-w-lg">
      {plan.isFeatured && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
          <span
            className={`text-xs text-white font-semibold border-0 bg-secondary px-2 py-1 rounded-full `}
          >
            POPULAR
          </span>
        </div>
      )}

      <div
        className={`relative flex flex-col h-full gap-5 lg:gap-8 z-10 p-8 rounded-xl w-full bg-stone-100 shadow-md ${
          plan.isFeatured ? "border-2 border-secondary" : ""
        }`}
      >
        <div className="flex justify-between items-center gap-4">
          <div>
            <p className="text-lg lg:text-xl font-bold">{plan.name}</p>
            {plan.description && <p className=" mt-2">{plan.description}</p>}
          </div>
        </div>
        <div className="flex items-end gap-2">
          {plan.priceAnchor && (
            <div className="mb-1 text-lg">
              <p className="relative">
                <span className="absolute bg-black/80 h-[1.5px] inset-x-0 top-[53%]"></span>
                <span className="text-black/80">€{plan.priceAnchor}</span>
              </p>
            </div>
          )}
          <div className="flex items-baseline">
            <span className="text-4xl font-extrabold">
              {plan.currency === "EUR" ? "€" : "$"}
            </span>
            <span className="text-5xl font-extrabold tracking-tight">
              {plan.price}
            </span>
          </div>
          <div className="flex flex-col items-start mb-1">
            <span className="text-xs text-stone-500 uppercase font-semibold">
              {plan.currency}
            </span>
            {plan.pricePer && (
              <span className="text-sm text-stone-500">
                per {plan.pricePer}
              </span>
            )}
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
        <div className="flex justify-center">
          <Button
            asChild
            className="cursor-pointer hover:bg-primary-800 hover:text-white w-full sm:w-auto"
          >
            <Link href={loginUrl}>{landingpageContent.stripe.buttonText}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
