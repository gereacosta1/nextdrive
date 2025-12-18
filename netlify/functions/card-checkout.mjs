// netlify/functions/card-checkout.mjs
import Stripe from 'stripe';

const stripeSecret = process.env.STRIPE_SECRET_KEY || '';

const stripe = stripeSecret
  ? new Stripe(stripeSecret, { apiVersion: '2024-06-20' })
  : null;

/**
 * Netlify define:
 * - process.env.URL (primary site url)
 * - process.env.DEPLOY_PRIME_URL (deploy url actual)
 */
function getSiteOriginFallback() {
  const url = process.env.DEPLOY_PRIME_URL || process.env.URL;
  if (url && typeof url === 'string' && url.startsWith('http')) return url;
  return 'https://example.com';
}

function normalizeOrigin(maybe) {
  if (typeof maybe !== 'string') return null;
  try {
    const u = new URL(maybe);
    return `${u.protocol}//${u.host}`;
  } catch {
    return null;
  }
}

function getAllowedOrigins() {
  // Opcional: separá por comas en Netlify env var (si querés)
  // ALLOWED_ORIGINS="https://nextdrive.netlify.app,https://nextdrive.com"
  const raw = process.env.ALLOWED_ORIGINS || '';
  const list = raw
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .map(normalizeOrigin)
    .filter(Boolean);

  // Siempre permitimos los origins del propio deploy/site
  const fallback = normalizeOrigin(getSiteOriginFallback());
  if (fallback && !list.includes(fallback)) list.push(fallback);

  return list;
}

function corsHeadersFor(origin) {
  const allowed = getAllowedOrigins();
  const o = normalizeOrigin(origin);
  const allow = o && allowed.includes(o) ? o : allowed[0] || getSiteOriginFallback();

  return {
    'Access-Control-Allow-Origin': allow,
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

function json(statusCode, obj, origin) {
  return {
    statusCode,
    headers: { ...corsHeadersFor(origin), 'Content-Type': 'application/json' },
    body: JSON.stringify(obj),
  };
}

const safe = (o) => {
  try {
    return JSON.stringify(o, null, 2).slice(0, 4000);
  } catch {
    return '[unserializable]';
  }
};

export async function handler(event) {
  const reqOrigin = event.headers?.origin || event.headers?.Origin || '';

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeadersFor(reqOrigin), body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeadersFor(reqOrigin), body: 'Method Not Allowed' };
  }

  try {
    if (!stripe) {
      return json(500, { error: 'Missing STRIPE_SECRET_KEY env var' }, reqOrigin);
    }

    const body = JSON.parse(event.body || '{}');
    const items = Array.isArray(body.items) ? body.items : [];

    if (!items.length) {
      return json(400, { error: 'items array required' }, reqOrigin);
    }

    // origin preferido:
    // 1) body.origin (si es válido)
    // 2) header Origin (si es válido)
    // 3) fallback Netlify site url
    const allowed = getAllowedOrigins();
    const bodyOrigin = normalizeOrigin(body.origin);
    const headerOrigin = normalizeOrigin(reqOrigin);
    const fallbackOrigin = normalizeOrigin(getSiteOriginFallback());

    const resolvedOrigin =
      (bodyOrigin && allowed.includes(bodyOrigin) && bodyOrigin) ||
      (headerOrigin && allowed.includes(headerOrigin) && headerOrigin) ||
      fallbackOrigin ||
      getSiteOriginFallback();

    // Construimos line_items con validaciones
    const line_items = items.map((it, index) => {
      const name = String(it?.name || `Item ${index + 1}`).slice(0, 120);
      const unitAmount = Math.round(Number(it?.price || 0) * 100);
      const qty = Math.max(1, Number(it?.qty) || 1);

      if (!Number.isFinite(unitAmount) || unitAmount <= 0) {
        throw new Error(`Invalid price for item "${name}"`);
      }

      return {
        price_data: {
          currency: 'usd',
          product_data: { name },
          unit_amount: unitAmount,
        },
        quantity: qty,
      };
    });

    // Si tu cuenta Stripe no tiene habilitado alguno de estos,
    // Stripe te va a tirar error. Lo dejo, pero se puede simplificar.
    const payment_method_types = ['card', 'afterpay_clearpay', 'klarna', 'zip'];

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types,
      line_items,
      success_url: `${resolvedOrigin}/?card=success`,
      cancel_url: `${resolvedOrigin}/?card=cancel`,
      // opcional: más “pro”
      // allow_promotion_codes: true,
      // billing_address_collection: 'required',
    });

    console.log('[card-checkout] created', safe({ id: session.id, url: session.url, origin: resolvedOrigin }));

    return json(200, { ok: true, url: session.url }, reqOrigin);
  } catch (err) {
    console.error('[card-checkout] error', err);

    const msg =
      (err && err.message) ||
      (err && err.raw && err.raw.message) ||
      'server_error';

    const code = err && (err.code || (err.raw && err.raw.code));

    return json(500, { error: msg, code: code || null }, reqOrigin);
  }
}
