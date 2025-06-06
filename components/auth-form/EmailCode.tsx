"use client";

import Link from "next/link";
import { signInWithEmailCode } from "@/utils/auth-helpers/server";
import { handleRequest } from "@/utils/auth-helpers/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MailIcon } from "lucide-react";

// Define prop type with allowPassword boolean
interface EmailCodeProps {
  allowPassword: boolean;
  redirectMethod: string;
  disableButton?: boolean;
}

export default function EmailCode({
  allowPassword,
  redirectMethod,
  disableButton,
}: EmailCodeProps) {
  const router = useRouter();

  const routerMethod = redirectMethod === "client" ? router : null;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true); // Disable the button while the request is being handled
    await handleRequest(e, signInWithEmailCode, routerMethod);
    setIsSubmitting(false);
  };

  return (
    <div className="my-8">
      <form
        noValidate={true}
        className="mb-4"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="grid gap-2">
          <div className="grid gap-1">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              placeholder="Your email address"
              type="email"
              name="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              className="w-full rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-zinc-700 focus:border-transparent"
            />
          </div>
          <Button
            size="login"
            variant="login"
            type="submit"
            className="mt-1"
            loading={isSubmitting}
            disabled={disableButton}
          >
            Send email code
          </Button>
        </div>
      </form>
    </div>
  );
}

export function ContinueWithEmailCode() {
  return (
    <Button variant="slim" className="w-full">
      <MailIcon className="w-5 h-5 mr-2" />
      <Link href="/signin/email_code">Continue with email code</Link>
    </Button>
  );
}
