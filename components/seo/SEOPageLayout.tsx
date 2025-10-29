import Link from "next/link";
import { ReactNode } from "react";

interface SEOPageLayoutProps {
  children: ReactNode;
}

export function SEOPageLayout({ children }: SEOPageLayoutProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-text">
      {children}
    </div>
  );
}

interface CTAButtonProps {
  href: string;
  variant?: "primary" | "secondary";
  children: ReactNode;
  className?: string;
}

export function CTAButton({ href, variant = "primary", children, className = "" }: CTAButtonProps) {
  const baseClasses = "inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md transition-colors";

  const variantClasses = variant === "primary"
    ? "text-white bg-text-800 hover:bg-text-900 border border-transparent"
    : "text-text-700 bg-white hover:bg-background-50 border border-text-200";

  return (
    <Link href={href} className={`${baseClasses} ${variantClasses} ${className}`}>
      {children}
    </Link>
  );
}

interface SectionProps {
  children: ReactNode;
  variant?: "default" | "subtle" | "highlight";
  className?: string;
}

export function Section({ children, variant = "default", className = "" }: SectionProps) {
  const variantClasses = {
    default: "",
    subtle: "bg-background-50 rounded-lg p-8",
    highlight: "bg-background-100 border-l-4 border-accent-400 rounded-lg p-8"
  };

  return (
    <section className={`mb-12 ${variantClasses[variant]} ${className}`}>
      {children}
    </section>
  );
}

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white border border-text-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="text-text-800 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-3 text-text-900">{title}</h3>
      <p className="text-text-600">{description}</p>
    </div>
  );
}

interface CTASectionProps {
  title: string;
  description: string;
  primaryCTA?: { text: string; href: string };
  secondaryCTA?: { text: string; href: string };
}

export function CTASection({ title, description, primaryCTA, secondaryCTA }: CTASectionProps) {
  return (
    <Section variant="highlight" className="text-center">
      <h2 className="text-3xl font-bold mb-4 text-text-900">{title}</h2>
      <p className="text-xl mb-6 text-text-700">{description}</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {primaryCTA && (
          <CTAButton href={primaryCTA.href} variant="primary">
            {primaryCTA.text}
          </CTAButton>
        )}
        {secondaryCTA && (
          <CTAButton href={secondaryCTA.href} variant="secondary">
            {secondaryCTA.text}
          </CTAButton>
        )}
      </div>
    </Section>
  );
}

interface FAQItemProps {
  question: string;
  answer: string;
}

export function FAQItem({ question, answer }: FAQItemProps) {
  return (
    <div className="bg-white border border-text-200 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-3 text-text-900">{question}</h3>
      <p className="text-text-700">{answer}</p>
    </div>
  );
}
