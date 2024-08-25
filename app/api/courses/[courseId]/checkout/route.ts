import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  const supabase = createClient();

  try {
    // Step 1: Authenticate the user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = user.id;
    const userEmail = user.email || '';

    // Step 2: Fetch the course details
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, title, price')
      .eq('id', params.courseId)
      .eq('is_published', true)
      .single();

    if (courseError || !course) {
      return new NextResponse("Course Not Found", { status: 404 });
    }

    // Step 3: Check if the user has already purchased the course
    const { data: purchase } = await supabase
      .from('purchases')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', course.id)
      .single();

    if (purchase) {
      return new NextResponse("Already Purchased", { status: 400 });
    }

    // Step 4: Fetch or create a Stripe customer
    let { data: stripeCustomer } = await supabase
      .from('stripe_customers')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single();

    if (!stripeCustomer?.stripe_customer_id) {
      const customer = await stripe.customers.create({
        email: userEmail,
      });

      const { data: newStripeCustomer, error: stripeCustomerError } = await supabase
        .from('stripe_customers')
        .insert({
          user_id: userId,
          stripe_customer_id: customer.id,
        })
        .select()
        .single();

      if (stripeCustomerError) {
        console.error("Error creating Stripe customer:", stripeCustomerError);
        return new NextResponse("Internal Error", { status: 500 });
      }

      stripeCustomer = newStripeCustomer;
    }

    // Step 5: Define line items for Stripe checkout
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: course.title,
          },
          unit_amount: Math.round(course.price * 100),
        },
        quantity: 1,
      },
    ];

    // Step 6: Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomer!.stripe_customer_id,
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=1`,
      metadata: {
        course_id: course.id,
        user_id: userId,
      },
    });

    // Step 7: Return the checkout session URL
    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error("COURSE_ID_CHECKOUT", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
