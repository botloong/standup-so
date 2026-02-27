import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

const PRICE_ID = process.env.STRIPE_PRICE_ID || "price_1T5K2bPBQY0kVXYaS7fZiY7Y";

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get("origin") || "https://standup-so.vercel.app";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${origin}/generate?pro=success`,
      cancel_url: `${origin}/generate?pro=cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
