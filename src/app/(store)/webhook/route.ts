import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { Metadata } from "../../../../actions/createCheckoutSession";
import { backendClient } from "@/sanity/lib/backendClient";
import { v4 as uuidV4 } from "uuid";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = headers();
  const sig = (await headersList).get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("⚠ Stripe webhook secret is not set.");
    return NextResponse.json(
      { error: "Stripe webhook secret is not set" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: `Webhook Error: ${err}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = `order_${session.id}`; // Unique order identifier

    try {
      const existingOrder = await backendClient.fetch(
        `*[_type == "order" && stripeCheckoutSessionId == $sessionId][0]`,
        { sessionId: session.id }
      );

      if (existingOrder) {
        console.log("⚠ Order already exists, skipping creation.");
        return NextResponse.json({ message: "Order already exists" });
      }

      const order = await createOrderInSanity(session, orderId);
      console.log("✅ Order created in Sanity:", order);
    } catch (err) {
      console.error("Error creating order in Sanity:", err);
      return NextResponse.json(
        { error: "Error creating order" },
        { status: 500 }
      );
    }
  }
  return NextResponse.json({ received: true });
}

async function createOrderInSanity(session: Stripe.Checkout.Session, orderId: string) {
  const {
    id,
    amount_total,
    currency,
    metadata,
    payment_intent,
    customer,
    total_details,
  } = session;

  const { orderNumber, customerName, customerEmail, clerkUserId } =
    metadata as Metadata;

  const lineItemsWithProduct = await stripe.checkout.sessions.listLineItems(id, {
    expand: ["data.price.product"],
  });

  const sanityProduct = lineItemsWithProduct.data.map((item) => ({
    _key: uuidV4(),
    product: {
      _type: "reference",
      _ref: (item.price?.product as Stripe.Product)?.metadata?.id,
    },
    quantity: item.quantity || 0,
  }));

  const order = await backendClient.createIfNotExists({
    _id: orderId, // Ensure uniqueness
    _type: "order",
    orderNumber,
    stripeCheckoutSessionId: id,
    stripePaymentIntentId: payment_intent,
    customerName,
    stripeCustomerId: customer,
    clerkUserId: clerkUserId,
    email: customerEmail,
    currency,
    amountDiscount: total_details?.amount_discount
      ? total_details.amount_discount / 100
      : 0,
    products: sanityProduct,
    totalPrice: amount_total ? amount_total / 100 : 0,
    status: "paid",
    orderDate: new Date().toISOString(),
  });

  return order;
}
