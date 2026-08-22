import Stripe from 'stripe';

/**
 * Vercel Serverless Function: /api/create-checkout-session
 * Accepts { itemTitle, price, currency, customerEmail, successUrl, cancelUrl }
 * Creates a Stripe Checkout session and returns the session URL for client redirection.
 */
export default async function handler(req, res) {
  // Set CORS headers for API calls
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const {
      itemTitle,
      price,
      currency = 'usd',
      customerEmail,
      successUrl,
      cancelUrl,
    } = req.body || {};

    if (!itemTitle || price === undefined || price === null) {
      return res.status(400).json({ error: 'itemTitle and price are required parameters.' });
    }

    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({ error: 'Price must be a valid positive number.' });
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return res.status(500).json({
        error: 'STRIPE_SECRET_KEY is not configured in the environment variables.',
      });
    }

    // Lazy initialization of Stripe client
    const stripe = new Stripe(stripeSecretKey);

    // Convert dollar/euro/gbp amount to integer cents
    const unitAmount = Math.round(numericPrice * 100);

    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host || 'localhost:3000';
    const origin = req.headers.origin || `${protocol}://${host}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: (currency || 'usd').toLowerCase(),
            product_data: {
              name: String(itemTitle),
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: customerEmail || undefined,
      success_url: successUrl || `${origin}/?session_id={CHECKOUT_SESSION_ID}&status=success`,
      cancel_url: cancelUrl || `${origin}/?status=cancelled`,
    });

    return res.status(200).json({ url: session.url, id: session.id });
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    return res.status(500).json({
      error: error.message || 'Failed to create Stripe Checkout session.',
    });
  }
}
