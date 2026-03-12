import Stripe from "stripe";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const { sessionId } = req.body;

  if (!sessionId) {
    return res.status(400).json({ error: "sessionId requerido" });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      return res.status(200).json({
        paid: true,
        nombre: session.metadata?.nombre,
        email: session.customer_email,
      });
    } else {
      return res.status(200).json({ paid: false });
    }
  } catch (error) {
    console.error("Error verificando pago:", error);
    return res.status(500).json({ error: error.message });
  }
}
