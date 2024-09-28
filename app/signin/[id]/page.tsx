import React from "react";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getAuthTypes,
  getViewTypes,
  getDefaultSignInView,
  getRedirectMethod,
} from "@/utils/auth-helpers/settings";
import Logo from "@/components/app/icons/logo";
import EmailSignIn from "@/components/auth-form/EmailSignIn";
import ForgotPassword from "@/components/auth-form/ForgotPassword";
import OauthSignIn from "@/components/auth-form/OauthSignIn";
import UpdatePassword from "@/components/auth-form/UpdatePassword";
import Separator from "@/components/auth-form/Seperator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import EmailCode from "@/components/auth-form/EmailCode";
import { IoIosArrowBack } from "react-icons/io";
import SignUp from "@/components/auth-form/signup";

export default async function SignIn({
  params,
  searchParams,
}: {
  params: { id: string; signuptype: string };
  searchParams: { disable_button: boolean; email: string };
}) {
  const { allowOauth, allowEmail, allowPassword } = getAuthTypes();
  const viewTypes = getViewTypes();
  const redirectMethod = getRedirectMethod();

  let viewProp: string;

  if (typeof params.id === "string" && viewTypes.includes(params.id)) {
    viewProp = params.id;
  } else {
    const cookieStore = cookies();
    const preferredSignInView =
      cookieStore.get("preferredSignInView")?.value || null;
    viewProp = getDefaultSignInView(preferredSignInView);
    return redirect(`/signin/${viewProp}`);
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && viewProp !== "update_password") {
    return redirect("/dashboard");
  } else if (!user && viewProp === "update_password") {
    return redirect("/signin");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <CardHeader className="space-y-1">
        <div className="flex h-full justify-center">
          <Logo width="60px" height="75px" />
        </div>
        <CardTitle className="text-2xl font-bold text-center">
          {viewProp === "forgot_password"
            ? "Reset Password"
            : viewProp === "update_password"
            ? "Update Password"
            : viewProp === "signup"
            ? "Sign Up"
            : "Sign In"}
        </CardTitle>
      </CardHeader>
      <Card className="w-full max-w-md p-4">
        <CardContent className="space-y-4">
          {(viewProp === "email_signin" || viewProp === "password_signin") && (
            <EmailSignIn
              redirectMethod={redirectMethod}
              disableButton={searchParams.disable_button}
              searchParamsEmail={searchParams.email}
              viewProp={viewProp === "password_signin" ? "password" : undefined}
            />
          )}
          {viewProp === "email_code" && (
            <EmailCode
              allowPassword={allowPassword}
              redirectMethod={redirectMethod}
              disableButton={searchParams.disable_button}
            />
          )}
          {viewProp === "forgot_password" && (
            <ForgotPassword
              allowEmail={allowEmail}
              redirectMethod={redirectMethod}
              disableButton={searchParams.disable_button}
            />
          )}
          {viewProp === "update_password" && (
            <UpdatePassword redirectMethod={redirectMethod} />
          )}
          {viewProp === "signup" && (
            <SignUp allowEmail={allowEmail} redirectMethod={redirectMethod} />
          )}
          {viewProp !== "update_password" &&
            viewProp !== "email_code" &&
            viewProp !== "password_signin" &&
            allowOauth && (
              <>
                <Separator text="OR" />
                <OauthSignIn
                  viewProp={viewProp}
                  signuptype={params.signuptype}
                />
              </>
            )}
          {viewProp === "email_signin" && (
            <p className="text-sm mt-4 font-normal text-center text-stone-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/signin/signup"
                className="underline text-brandedLinkColor"
              >
                Sign up
              </Link>
            </p>
          )}
          {viewProp === "signup" && (
            <p className="text-sm mt-4 font-normal text-center text-stone-500">
              Already have an account?{" "}
              <Link
                href="/signin/email_signin"
                className="underline text-brandedLinkColor"
              >
                Sign in
              </Link>
            </p>
          )}
        </CardContent>
      </Card>
      {(viewProp === "email_code" || viewProp === "password_signin") && (
        <div className="flex items-center text-sm mt-4 font-normal text-center text-stone-500">
          <IoIosArrowBack className="h-4 w-4 mr-1" />
          <Link href="/signin/email_signin" className="hover:underline">
            Go back
          </Link>
        </div>
      )}
    </div>
  );
}
