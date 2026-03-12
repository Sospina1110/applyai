import Stripe from "stripe";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const { nombre, email, conversationId } = req.body;

  const origin = req.headers.origin || "https://applyai-cv.vercel.app";

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "cop",
            product_data: {
              name: "CV Profesional - ApplyAI",
              description: `CV estilo McKinsey para ${nombre || "ti"}`,
              images: [],
            },
            unit_amount: 1990000, // $19.900 COP (en centavos)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: email || undefined,
      metadata: {
        conversationId: conversationId || "",
        nombre: nombre || "",
      },
      success_url: `${origin}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?payment=cancelled`,
    });

    return res.status(200).json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error("Error creando checkout:", error);
    return res.status(500).json({ error: error.message });
  }
}
