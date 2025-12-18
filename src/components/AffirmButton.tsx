// src/components/AffirmButton.tsx
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { loadAffirm } from '../lib/affirm';
import { buildAffirmCheckout, type CartItem as Item, type Customer } from '../lib/affirmCheckout';

type Props = {
  cartItems?: {
    name: string;
    sku?: string | number;
    price: number;
    qty: number;
    url?: string;
    image?: string;
    id?: string | number;
  }[];
  totalUSD?: number;
  shippingUSD?: number;
  taxUSD?: number;
  customer?: Customer;
};

const MIN_TOTAL_CENTS = 5000; // $50
const toCents = (usd = 0) => Math.round((Number(usd) || 0) * 100);

/* Toast + NiceModal */
function Toast({
  show,
  type,
  message,
  onClose
}: {
  show: boolean;
  type: 'success' | 'error' | 'info';
  message: string;
  onClose: () => void;
}) {
  if (!show) return null;

  return (
    <div
      role="status"
      onClick={onClose}
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] px-4 py-3 rounded-xl shadow-2xl border text-sm font-semibold 
      ${
        type === 'success'
          ? 'bg-green-600/95 text-white border-green-400'
          : type === 'error'
          ? 'bg-red-600/95 text-white border-red-400'
          : 'bg-black/90 text-white border-white/20'
      }`}
    >
      {message}
    </div>
  );
}

function NiceModal({
  open,
  title,
  children,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onClose
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  primaryLabel?: string;
  onPrimary?: () => void;
  secondaryLabel?: string;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-[95%] max-w-md p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-black text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            ✕
          </button>
        </div>

        <div className="text-gray-700 mb-6">{children}</div>

        <div className="flex items-center justify-end gap-3">
          {secondaryLabel && (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              {secondaryLabel}
            </button>
          )}
          {primaryLabel && (
            <button
              onClick={onPrimary}
              className="px-4 py-2 rounded-lg bg-black text-white font-bold hover:bg-gray-900"
            >
              {primaryLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AffirmButton({
  cartItems = [],
  totalUSD,
  shippingUSD = 0,
  taxUSD = 0,
  customer
}: Props) {
  const PUBLIC_KEY = String(import.meta.env.VITE_AFFIRM_PUBLIC_KEY || '').trim();
  const ENV = (import.meta.env.VITE_AFFIRM_ENV || 'prod') as 'prod' | 'sandbox';

  const affirmEnabled = PUBLIC_KEY.length > 0;

  const [ready, setReady] = useState(false);
  const [loadingSdk, setLoadingSdk] = useState(false);
  const [opening, setOpening] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    type: 'info' as 'success' | 'error' | 'info',
    message: ''
  });
  const [modal, setModal] = useState({
    open: false,
    title: '',
    body: '',
    retry: false
  });

  const showToast = (type: 'success' | 'error' | 'info', message: string, ms = 2200) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast((s) => ({ ...s, show: false })), ms);
  };

  useEffect(() => {
    let cancelled = false;

    if (!affirmEnabled) {
      setReady(false);
      setLoadingSdk(false);
      return;
    }

    setLoadingSdk(true);
    loadAffirm(PUBLIC_KEY, ENV)
      .then(() => {
        if (cancelled) return;
        const ok = !!(window as any).affirm?.checkout;
        setReady(ok);
      })
      .catch((e) => {
        console.error('[AffirmButton] loadAffirm failed:', e);
        if (cancelled) return;
        setReady(false);
      })
      .finally(() => {
        if (cancelled) return;
        setLoadingSdk(false);
      });

    return () => {
      cancelled = true;
    };
  }, [affirmEnabled, PUBLIC_KEY, ENV]);

  const mapped: Item[] = useMemo(
    () =>
      cartItems.map((it, i) => ({
        id: it.id ?? it.sku ?? i + 1,
        title: it.name,
        price: it.price,
        qty: Math.max(1, Number(it.qty) || 1),
        url: it.url ?? '/',
        image: it.image
      })),
    [cartItems]
  );

  const subtotalC = mapped.reduce((acc, it) => acc + toCents(it.price) * it.qty, 0);
  const shippingC = toCents(shippingUSD);
  const taxC = toCents(taxUSD);
  const totalC = typeof totalUSD === 'number' ? toCents(totalUSD) : subtotalC + shippingC + taxC;

  const hasItems = mapped.length > 0;
  const meetsMin = totalC >= MIN_TOTAL_CENTS;

  const canPay = affirmEnabled && ready && hasItems && meetsMin;

  async function handleClick() {
    if (!affirmEnabled) {
      showToast('info', 'Financing will be available after approval.');
      return;
    }

    if (loadingSdk) {
      showToast('info', 'Loading financing…');
      return;
    }

    const affirm = (window as any).affirm;
    if (!affirm?.checkout) {
      showToast('error', 'Affirm is not ready');
      return;
    }

    if (!hasItems) {
      showToast('info', 'Your cart is empty.');
      return;
    }

    if (!meetsMin) {
      setModal({
        open: true,
        title: 'Amount unavailable',
        body: 'The total amount is too low for Affirm (minimum $50).',
        retry: false
      });
      return;
    }

    const base = window.location.origin.replace('http://', 'https://');

    const checkout = buildAffirmCheckout(
      mapped,
      { subtotalUSD: subtotalC / 100, shippingUSD, taxUSD },
      customer,
      base
    );

    setOpening(true);

    try {
      affirm.checkout(checkout);

      affirm.checkout.open({
        onSuccess: async ({ checkout_token }: { checkout_token: string }) => {
          try {
            const r = await fetch('/.netlify/functions/affirm-authorize', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                checkout_token,
                order_id: 'ORDER-' + Date.now(),
                amount_cents: checkout.total,
                capture: true
              })
            });

            console.log('affirm-authorize →', await r.json());
            showToast('success', 'Request submitted!');
          } catch (e) {
            setModal({
              open: true,
              title: 'We could not confirm your request',
              body: 'There was a problem confirming with the server.',
              retry: true
            });
          } finally {
            setOpening(false);
          }
        },

        onFail: () => {
          setOpening(false);
          setModal({
            open: true,
            title: 'Financing was not completed',
            body: 'You can try again.',
            retry: true
          });
        },

        onValidationError: () => {
          setOpening(false);
          setModal({
            open: true,
            title: 'Invalid information',
            body: 'Please check the buyer’s name and address.',
            retry: false
          });
        },

        onClose: () => {
          setOpening(false);
          setModal({
            open: true,
            title: 'Process canceled',
            body: 'No charges were made. Would you like to try again?',
            retry: true
          });
        }
      });
    } catch (e) {
      console.error(e);
      setOpening(false);
      showToast('error', 'Could not open Affirm.');
    }
  }

  const buttonLabel = opening
    ? 'Opening…'
    : !affirmEnabled
    ? 'Financing (coming soon)'
    : loadingSdk
    ? 'Loading…'
    : 'Pay with Affirm';

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={opening || (!affirmEnabled ? false : !canPay && !loadingSdk)}
        className="h-9 px-3 text-sm rounded-md font-semibold bg-black text-white border border-white/20 shadow hover:bg-neutral-900 transition disabled:opacity-60"
        title={!affirmEnabled ? 'Affirm will be enabled after approval' : undefined}
      >
        {buttonLabel}
      </button>

      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((s) => ({ ...s, show: false }))}
      />

      <NiceModal
        open={modal.open}
        title={modal.title}
        onClose={() => setModal({ open: false, title: '', body: '', retry: false })}
        secondaryLabel="Close"
        primaryLabel={modal.retry ? 'Retry' : undefined}
        onPrimary={modal.retry ? handleClick : undefined}
      >
        {modal.body}
      </NiceModal>
    </>
  );
}
