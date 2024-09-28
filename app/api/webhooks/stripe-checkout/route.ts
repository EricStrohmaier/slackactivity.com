"use server";

// import { fetchProductsAndSendEmails } from "@/src/fetchAndSendEmail";
import { supabaseAdmin } from "@/utils/supabase/admin";

import { headers } from "next/headers";
import { NextRequest } from "next/server";
import Stripe from "stripe";

type METADATA = {
  product_ids: string;
  reservation_ids: string;
  product_to_reservation_map: string;
};

const stripeKey =
  process.env.NODE_ENV === "development"
    ? process.env.STRIPE_TEST_SECRET_KEY
    : process.env.STRIPE_SECRET_KEY;

const stripe = new Stripe(stripeKey!);

const supabase = supabaseAdmin();

export async function POST(request: NextRequest) {
  const body = await request.text();
  const endpointSecret = process.env.STRIPE_SECRET_WEBHOOK_KEY!;
  const sig = headers().get("stripe-signature") as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    return new Response(`Webhook Error: ${err}`, {
      status: 400,
    });
  }

  const eventType = event.type;
  console.log("Event type:", eventType);
  if (
    eventType === "checkout.session.expired" ||
    eventType === "checkout.session.async_payment_failed"
  ) {
    // update reservation id in db to expired and make it like this avalible again
    console.log("Checkout session expired or async payment failed");
    return new Response("Checkout session expired or async payment failed", {
      status: 200,
    });
  }

  if (
    eventType !== "checkout.session.completed" &&
    eventType !== "checkout.session.async_payment_succeeded"
  )
    return new Response("Server Error", {
      status: 500,
    });

  const data = event.data.object as Stripe.Checkout.Session;
  const metadata = data.metadata as METADATA;

  // Parse the product_ids and reservation_ids from the metadata
  const productIds = JSON.parse(metadata.product_ids);
  const reservationIds = JSON.parse(metadata.reservation_ids);

  // Log the product IDs and reservation IDs
  console.log("Product IDs:", productIds);
  console.log("Reservation IDs:", reservationIds);

  try {
    // Update reservation status to 'paid'
    const { data: reservationData, error: reservationError } = await supabase
      .from("reservations")
      // @ts-ignore
      .update({ status: "paid" })
      .in("id", reservationIds)
      .select("user_id");

    if (reservationError) {
      console.error("Error updating reservation status:", reservationError);
      return new Response("Error updating reservation status", { status: 500 });
    }

    console.log("Updated reservations:", reservationData);

    // Update user information if available
    if (data.customer_details?.email || data.customer_details?.name) {
      const userId = reservationData[0]?.user_id;
      if (userId) {
        const updateData: { email?: string; full_name?: string } = {};
        if (data.customer_details.email)
          updateData.email = data.customer_details.email;
        if (data.customer_details.name)
          updateData.full_name = data.customer_details.name;

        const { error: userUpdateError } = await supabase
          .from("users")
          .update(updateData)
          .eq("id", userId);

        if (userUpdateError) {
          console.error("Error updating user information:", userUpdateError);
        } else {
          console.log("Updated user information for user ID:", userId);
        }
      }
    }

    await fetchProductsAndSendEmails(productIds);
  } catch (err) {
    console.error("Error processing webhook:", err);
    return new Response("Error processing webhook", { status: 500 });
  }

  return new Response("Reservation paid and emails sent", {
    status: 200,
  });
}
