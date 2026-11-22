import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Logo from "@/components/app/icons/logo";
import SlackIcon from "@/components/app/icons/slack";
import GoogleIcon from "@/components/app/icons/google";
import { getUser } from "@/lib/auth";
import { googleEnabled } from "@/lib/google";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in with Slack or Google to keep your status green automatically. Free forever, no credit card.",
  robots: { index: false, follow: true },
};

export default async function SignIn({
  searchParams,
}: {
  searchParams: { error?: string; error_description?: string };
}) {
  if (await getUser()) redirect("/dashboard");

  const error = searchParams.error_description || searchParams.error;
  const google = googleEnabled();

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <Logo width="60px" height="75px" />
        </div>

        <h1 className="mb-3 text-3xl font-bold text-text-900">
          Sign in to Slackactivity
        </h1>
        <p className="mb-8 text-text-600">
          {google
            ? "Use Slack, or the Google account you signed up with. Free forever, no credit card."
            : "Connecting Slack is all it takes — there is no separate account to create. Free forever, no credit card."}
        </p>

        {error && (
          <p className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <Button asChild size="lg" className="w-full">
          <Link href="/api/slack/auth">
            <SlackIcon className="mr-2 h-5 w-5" />
            Continue with Slack
          </Link>
        </Button>

        {google && (
          <Button asChild size="lg" variant="outline" className="mt-3 w-full">
            {/* A route handler, not a page: plain <a> skips client prefetch. */}
            <a href="/api/auth/google">
              <GoogleIcon className="mr-2 h-5 w-5" />
              Continue with Google
            </a>
          </Button>
        )}

        <p className="mt-6 text-xs text-text-500">
          We request only the permissions needed to set your presence.
          Slackactivity cannot read your messages, files, or channels. Read the{" "}
          <Link href="/privacy-policy" className="underline">
            privacy policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
