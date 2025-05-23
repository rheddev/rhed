import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(request: NextRequest) {
    const sessionId = request.nextUrl.searchParams.get("session_id");

    if (!sessionId) {
        return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        return NextResponse.json({
            status: session.status,
            payment_status: session.payment_status,
            customer_email: session.customer_details?.email,
            metadata: session.metadata,
            amount: session.amount_total
        });
    } catch (error) {
        console.error("Error retrieving session:", error);
        return NextResponse.json({ error: "Failed to retrieve session" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const sessionId = request.nextUrl.searchParams.get("session_id");

    if (!sessionId) {
        return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
        status: session.status,
        payment_status: session.payment_status,
        customer_email: session.customer_details?.email,
        metadata: session.metadata,
        amount: session.amount_total
    });
}