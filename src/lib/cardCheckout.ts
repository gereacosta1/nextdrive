// src/lib/cardCheckout.ts
import type { CartItem } from '../context/CartContext';

const API_URL = '/api/card-checkout';

type CardCheckoutResponse =
  | { ok: true; url: string }
  | { error: string; code?: string | null };

function toHttpsOrigin(origin: string) {
  // en prod normalmente ya es https; esto evita redirects raros
  return origin.replace(/^http:\/\//i, 'https://');
}

function safeName(v: unknown, fallback: string) {
  const s = String(v ?? '').trim();
  return (s || fallback).slice(0, 120);
}

function safePrice(v: unknown) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function safeQty(v: unknown) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
}

export async function startCardCheckout(items: CartItem[]): Promise<void> {
  if (!items.length) {
    throw new Error('The shopping cart is empty.');
  }

  const origin = toHttpsOrigin(window.location.origin);

  // Mandar solo lo necesario al backend (evita depender del shape completo del cart)
  const payloadItems = items.map((it, idx) => ({
    name: safeName(it?.name, `Item ${idx + 1}`),
    price: safePrice(it?.price),
    qty: safeQty(it?.qty),
    sku: it?.sku,
    image: it?.image,
    url: it?.url,
  }));

  // Validación fuerte: Stripe no acepta unit_amount <= 0
  const hasInvalid = payloadItems.some((it) => !Number.isFinite(it.price) || it.price <= 0);
  if (hasInvalid) {
    throw new Error('Some items have an invalid price.');
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: payloadItems, origin }),
  });

  // Intentar leer JSON si existe; si no, texto
  let data: CardCheckoutResponse | null = null;
  let rawText = '';

  try {
    rawText = await res.text();
    data = rawText ? (JSON.parse(rawText) as CardCheckoutResponse) : null;
  } catch {
    data = null;
  }

  if (!res.ok) {
    const msg =
      (data && 'error' in data && data.error) ||
      rawText ||
      'The card payment could not be initiated.';
    throw new Error(msg);
  }

  const url = (data && 'url' in data && data.url) ? data.url : null;
  if (!url) {
    throw new Error('Stripe response did not include a URL.');
  }

  // Redirige al checkout de Stripe
  window.location.assign(url);
}
