import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function GET(request: NextRequest) {
    const sessionId = request.nextUrl.searchParams.get("session_id");

    if (!sessionId) {
        return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({clientSecret: session.client_secret});
}

export async function POST(request: NextRequest) {

    const { name, message, description } = await request.json();

    if (!name || !message || !description) {
        return NextResponse.json({ error: "Name, message, and description are required" }, { status: 400 });
    }

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
          {
              price: "price_1RRnHUIkeiRvemAOR3RownEp",
              quantity: 1
          }
      ],
      metadata: {
          name,
          message,
          description
      },
      mode: "payment",
      return_url: `${baseUrl}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
      ui_mode: "embedded",
    });

    return NextResponse.json({clientSecret: session.client_secret});
  } catch (error) {
    console.error('Stripe checkout session creation failed:', error);
    return NextResponse.json({ 
      error: 'Failed to create checkout session', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
