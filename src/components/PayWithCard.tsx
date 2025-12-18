// src/components/PayWithCard.tsx
import React, { useMemo, useState } from 'react';
import { useCart } from '../context/CartContext';
import { startCardCheckout } from '../lib/cardCheckout';

const PayWithCard: React.FC = () => {
  const { items, totalUSD } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalLabel = useMemo(() => {
    const n = Number(totalUSD);
    const safe = Number.isFinite(n) ? n : 0;
    return safe.toFixed(2);
  }, [totalUSD]);

  const stripeEnabled = true; // si querés, más adelante lo validamos con env/health

  const handleClick = async () => {
    try {
      setError(null);

      if (!items.length) {
        setError('Your cart is empty.');
        return;
      }

      if (!stripeEnabled) {
        setError('Card payments are not available right now.');
        return;
      }

      setLoading(true);
      await startCardCheckout(items);
      // Stripe redirige — no hacemos nada más acá
    } catch (e: any) {
      console.error(e);
      setError(e?.message || 'An error occurred while starting the payment.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading || !items.length}
        className="w-full bg-white text-black px-4 py-3 rounded-lg font-bold hover:bg-white/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Redirecting to payment…' : 'Pay by card (credit/debit)'}
      </button>

      <p className="text-xs text-white/55">
        Total <span className="font-semibold">${totalLabel} USD</span>
      </p>

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
};

export default PayWithCard;
