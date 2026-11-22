import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "@/components/app/icons/logo";
import SlackIcon from "@/components/app/icons/slack";
import GoogleIcon from "@/components/app/icons/google";
import { getUser } from "@/lib/auth";
import { googleEnabled } from "@/lib/google";
import { signInWithPasswordAction } from "./actions";

// Every button and input on the auth pages shares one height and text size.
const CONTROL = "h-12 w-full text-base font-medium";
const FIELD = "h-12 px-4 text-base bg-white";
// Secondary buttons: white like the inputs, not the beige page background.
const SECONDARY = "bg-white hover:bg-gray-50";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in with Slack, Google or email to keep your status green automatically. Free forever, no credit card.",
  robots: { index: false, follow: true },
};

export default async function SignIn({
  searchParams,
}: {
  searchParams: {
    error?: string;
    error_description?: string;
    email?: string;
  };
}) {
  if (await getUser()) redirect("/dashboard");

  const error = searchParams.error_description || searchParams.error;
  const google = googleEnabled();
  const email = searchParams.email ?? "";

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <Logo width="60px" height="75px" />
        </div>

        <h1 className="mb-3 text-3xl font-bold text-text-900">
          Sign in to Slackactivity
        </h1>
        <p className="mb-8 text-text-600">
          Use whichever you signed up with. New here? Continue with Slack.
          Free forever, no credit card.
        </p>

        {error && (
          <p className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}
        <Button asChild className={CONTROL}>
          <Link href="/api/slack/auth">
            <SlackIcon className="mr-2 h-5 w-5" />
            Continue with Slack
          </Link>
        </Button>

        {google && (
          <Button asChild variant="outline" className={`${CONTROL} ${SECONDARY} mt-3`}>
            {/* A route handler, not a page: plain <a> skips client prefetch. */}
            <a href="/api/auth/google">
              <GoogleIcon className="mr-2 h-5 w-5" />
              Continue with Google
            </a>
          </Button>
        )}

        <div className="my-6 flex items-center gap-3 text-xs uppercase text-text-500">
          <span className="h-px flex-1 bg-gray-200" />
          or with email
          <span className="h-px flex-1 bg-gray-200" />
        </div>
        <form action={signInWithPasswordAction} className="space-y-3 text-left">
          <Input className={FIELD} name="email" type="email" required autoComplete="email" placeholder="you@example.com" defaultValue={email} />
          <Input className={FIELD} name="password" type="password" required autoComplete="current-password" placeholder="Password" />
          <Button type="submit" variant="outline" className={`${CONTROL} ${SECONDARY}`}>
            Sign in with email
          </Button>
        </form>
        <p className="mt-3 text-sm text-text-500">
          Forgot your password? Continue with Slack or Google using the same
          email address.
        </p>

        <p className="mt-6 text-xs text-text-500">
          Slackactivity only asks Slack for the permissions needed to set your
          presence. It cannot read your messages, files, or channels. Read the{" "}
          <Link href="/privacy-policy" className="underline">
            privacy policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
