import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Logo from "@/components/app/icons/logo";
import { confirmPasswordAction } from "../actions";

// Every button and input on the auth pages shares one height and text size.
const CONTROL = "h-12 w-full text-base font-medium";

export const metadata: Metadata = {
  title: "Confirm password",
  robots: { index: false, follow: false },
};

/**
 * Landing page for the emailed link. Only shows a button: the token is spent
 * by the POST, so link-scanning mail filters can't consume it.
 */
export default function ConfirmPassword({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams.token ?? "";

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <Logo width="60px" height="75px" />
        </div>
        <h1 className="mb-3 text-3xl font-bold text-text-900">Confirm your password</h1>
        {token ? (
          <form action={confirmPasswordAction}>
            <input type="hidden" name="token" value={token} />
            <p className="mb-8 text-text-600">
              One click to save your new password and sign in.
            </p>
            <Button type="submit" className={CONTROL}>
              Confirm and sign in
            </Button>
          </form>
        ) : (
          <p className="text-text-600">
            This link is incomplete.{" "}
            <Link href="/signin?view=set-password" className="underline">
              Request a new one
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  );
}
