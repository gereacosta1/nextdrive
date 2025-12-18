// src/components/CartDrawer.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, CreditCard, BadgeDollarSign } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useI18n } from '../i18n/I18nProvider';
import PayWithAffirm from './PayWithAffirm';
import PayWithCard from './PayWithCard';

const CartDrawer: React.FC = () => {
  const { t, fmtMoney } = useI18n();
  const { items, isOpen, close, removeItem, setQty, totalUSD, clear } = useCart();

  const [showItems, setShowItems] = useState(true);

  const cartCount = useMemo(() => items.reduce((sum, it) => sum + Number(it.qty || 0), 0), [items]);

  // Cerrar con ESC
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, close]);

  useEffect(() => {
    if (isOpen) setShowItems(true);
  }, [isOpen]);

  const handleDec = (id: string, qty: number) => setQty(id, Math.max(1, qty - 1));
  const handleInc = (id: string, qty: number) => setQty(id, qty + 1);

  const subtotal = Number(totalUSD) || 0;
  const shipping = 0; // si más adelante querés cálculo real, lo conectamos acá
  const tax = 0; // idem
  const grandTotal = subtotal + shipping + tax;

  return (
    <div
      className={`fixed inset-0 z-[10000] ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!isOpen}
    >
      {/* backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={close}
      />

      {/* panel */}
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-[#050509] text-white border-l border-white/10 shadow-2xl transform transition-transform
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-label={t('cart.title')}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-sky-300" />
            </div>
            <div className="leading-tight">
              <h3 className="text-lg font-black">{t('cart.title')}</h3>
              <p className="text-xs text-white/60">
                {cartCount > 0 ? `${cartCount} item${cartCount === 1 ? '' : 's'}` : t('cart.empty')}
              </p>
            </div>
          </div>

          <button
            onClick={close}
            className="p-2 rounded-lg hover:bg-white/10"
            aria-label={t('modal.close')}
            title={t('modal.close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 230px)' }}>
          {/* Order summary */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold text-white/90">Order summary</p>
              <button
                onClick={() => setShowItems((s) => !s)}
                className="text-xs font-semibold text-sky-300 hover:text-sky-200"
              >
                {showItems ? 'Hide items' : 'Show items'}
              </button>
            </div>

            <div className="space-y-2 text-sm text-white/80">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">{fmtMoney(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span className="font-semibold">{fmtMoney(shipping)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tax</span>
                <span className="font-semibold">{fmtMoney(tax)}</span>
              </div>

              <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-white font-bold">{t('cart.total')}</span>
                <span className="text-white text-lg font-black">{fmtMoney(grandTotal)}</span>
              </div>

              <p className="pt-2 text-xs text-white/50">
                Note: Shipping and taxes can be confirmed after contact.
              </p>
            </div>
          </div>

          {/* Items */}
          {showItems && (
            <div className="space-y-3">
              {items.length === 0 ? (
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-white/70 text-sm">
                  {t('cart.empty')}
                </div>
              ) : (
                items.map((it) => (
                  <div
                    key={it.id}
                    className="rounded-2xl bg-white/5 border border-white/10 p-3 flex gap-3"
                  >
                    <img
                      src={it.image || '/fallback.png'}
                      alt={it.name}
                      className="w-20 h-20 object-cover rounded-xl border border-white/10"
                      onError={(e) => {
                        const img = e.currentTarget as HTMLImageElement;
                        if (!img.src.endsWith('/fallback.png')) img.src = '/fallback.png';
                      }}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-black truncate">{it.name}</p>
                          <p className="text-xs text-white/60">{fmtMoney(Number(it.price) || 0)}</p>
                        </div>

                        <button
                          onClick={() => removeItem(it.id)}
                          className="p-2 rounded-lg hover:bg-white/10"
                          title={t('cart.remove')}
                          aria-label={t('cart.remove')}
                        >
                          <Trash2 className="w-4 h-4 text-white/80" />
                        </button>
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={() => handleDec(it.id, it.qty)}
                          className="h-9 w-9 rounded-xl bg-black/40 border border-white/10 hover:bg-white/10 flex items-center justify-center"
                          aria-label={t('cart.minus')}
                          title={t('cart.minus')}
                        >
                          <Minus className="w-4 h-4" />
                        </button>

                        <span className="h-9 min-w-[44px] px-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center font-bold">
                          {it.qty}
                        </span>

                        <button
                          onClick={() => handleInc(it.id, it.qty)}
                          className="h-9 w-9 rounded-xl bg-black/40 border border-white/10 hover:bg-white/10 flex items-center justify-center"
                          aria-label={t('cart.plus')}
                          title={t('cart.plus')}
                        >
                          <Plus className="w-4 h-4" />
                        </button>

                        <span className="ml-auto font-black text-sky-200">
                          {fmtMoney((Number(it.price) || 0) * (Number(it.qty) || 0))}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Payments */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-white/90">Payment</h4>

            {/* Affirm */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center">
                  <BadgeDollarSign className="w-5 h-5 text-sky-300" />
                </div>

                <div className="flex-1">
                  <p className="font-black leading-tight">Affirm financing</p>
                  <p className="text-xs text-white/60 mt-1">
                    Split your purchase into monthly payments (available after approval).
                  </p>

                  <div className="mt-3">
                    {items.length > 0 && totalUSD > 0 ? (
                      <PayWithAffirm />
                    ) : (
                      <button
                        disabled
                        className="w-full bg-white/10 text-white px-4 py-3 rounded-lg font-bold opacity-50 cursor-not-allowed"
                      >
                        {t('cart.payWithAffirm')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Card */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-sky-300" />
                </div>

                <div className="flex-1">
                  <p className="font-black leading-tight">Credit / debit card</p>
                  <p className="text-xs text-white/60 mt-1">
                    Secure checkout powered by Stripe.
                  </p>

                  <div className="mt-3">
                    <PayWithCard />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky footer actions */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="flex gap-2">
            <button
              onClick={clear}
              disabled={!items.length}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg font-bold disabled:opacity-50"
            >
              {t('cart.clear')}
            </button>

            <button
              onClick={close}
              className="flex-1 bg-black/40 hover:bg-white/10 border border-white/10 text-white px-4 py-3 rounded-lg font-bold"
            >
              Continue shopping
            </button>
          </div>

          <p className="text-[11px] text-white/45">
            By continuing you agree that this is a request checkout and final totals may be confirmed.
          </p>
        </div>
      </aside>
    </div>
  );
};

export default CartDrawer;
