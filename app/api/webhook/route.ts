import { createClient } from "@/utils/supabase/server";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServiceSupabase } from "@/utils/supabase/service";

export async function POST(req: Request) {
  const supabase = getServiceSupabase();
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error("[Stripe Webhook] Error:", error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed':
    console.log("[Stripe Webhook] Checkout session completed:", event.id);
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session?.metadata?.user_id;
      const courseId = session?.metadata?.course_id;

      if (!userId || !courseId) {
        console.log("[Stripe Webhook] Missing metadata in checkout.session.completed event.");
        return new NextResponse("Webhook Error: Missing metadata", { status: 400 });
      }
      console.log("[Stripe Webhook] User ID:", userId);
        console.log("[Stripe Webhook] Course ID:", courseId);
      try {
        // Save the purchase in the database
        await supabase.from('purchases').insert({
          user_id: userId,
          course_id: courseId,
        });
        
      } catch (error) {
        console.error("[Stripe Webhook] Error saving purchase:", error);
        return new NextResponse("Webhook Error: Error saving purchase", { status: 500 });
      }
      break;

    case 'customer.created':
      const customer = event.data.object as Stripe.Customer;
      ////console.log("[Stripe Webhook] Customer created:", customer.id);

      // Here, you could log the customer creation or save additional data if needed
      break;

    default:
      console.warn("[Stripe Webhook] Unhandled event type:", event.type);
  }

  return new NextResponse(null, { status: 200 });
}
