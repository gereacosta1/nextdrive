// src/components/MotorcycleModal.tsx
import React from "react";
import {
  X,
  Calendar,
  Fuel,
  Gauge,
  Star,
  Shield,
  Wrench,
  Phone,
  Zap,
} from "lucide-react";
import { Motorcycle } from "../App";
import { useI18n } from "../i18n/I18nProvider";

interface MotorcycleModalProps {
  motorcycle: Motorcycle;
  onClose: () => void;
  onPhoneCall: () => void;
  onWhatsApp: () => void;
}

/** 🔁 mismo mapeo que en Catalog (para features) */
const FEATURE_KEY_BY_ES: Record<string, string> = {
  "Motor eléctrico": "feature.motor",
  "Ligero y ágil": "feature.lightAgile",
  "Batería de alta capacidad": "feature.batteryHigh",
  "Motor eléctrico de alta potencia": "feature.motorHighPower",
  "Pantalla táctil": "feature.touchscreen",
  "Conectividad Bluetooth": "feature.bluetooth",
  "Sistema de navegación GPS": "feature.gps",
};

// helper: intenta traducir una key y si no existe, vuelve al fallback
const tr = (t: (k: string) => string, key: string, fallback?: string) => {
  const val = (t as any)(key);
  return val === key ? (fallback ?? key) : val;
};

const MotorcycleModal: React.FC<MotorcycleModalProps> = ({
  motorcycle,
  onClose,
  onPhoneCall,
  onWhatsApp,
}) => {
  const { t, lang, fmtMoney } = useI18n();

  const condLabel =
    motorcycle.condition === "Nueva"
      ? t("product.condition.new")
      : t("product.condition.used");

  const pid = String(motorcycle.id);
  const description = tr(t, `product.${pid}.desc`, motorcycle.description);

  const features = (motorcycle.features ?? []).map((f, i) => {
    const keyByIndex = `product.${pid}.feature.${i}`;
    const viaIndex = tr(t, keyByIndex, "__MISS__");
    if (viaIndex !== "__MISS__") return viaIndex;

    const mapped = FEATURE_KEY_BY_ES[f];
    return mapped ? t(mapped as any) : f;
  });

  // galería opcional (no rompe el tipo de Motorcycle)
  const gallery = ((motorcycle as any).gallery as string[] | undefined) || [
    motorcycle.image,
  ];

  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const activeImage =
    gallery[currentImageIndex] ?? gallery[0] ?? motorcycle.image;

  const handleFinancing = () => {
    const msgEs = `¡Hola! Me interesa información sobre financiamiento para la ${motorcycle.name} ${motorcycle.year}. ¿Qué opciones tienen disponibles?`;
    const msgEn = `Hi! I'm interested in financing options for the ${motorcycle.name} ${motorcycle.year}. Could you share what's available?`;
    const message = encodeURIComponent(lang === "es" ? msgEs : msgEn);
    const whatsappUrl = `https://wa.me/+17862530995?text=${message}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-lg px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative max-w-5xl w-full max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#050509]/95 shadow-[0_40px_120px_rgba(0,0,0,0.9)]">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-white/10">
          <div className="space-y-1">
            <p className="text-xs tracking-[0.25em] uppercase text-white/50">
              nextDrive • Electric & Used
            </p>
            <h2 className="text-2xl md:text-3xl font-black text-white">
              {motorcycle.name}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs md:text-sm font-bold tracking-wide ${
                motorcycle.condition === "Nueva"
                  ? "bg-sky-500/15 text-sky-300 border border-sky-500/50"
                  : "bg-white/10 text-white border border-white/30"
              }`}
            >
              {condLabel}
            </span>
            {motorcycle.featured && (
              <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-sky-500 to-cyan-400 text-black shadow-lg">
                <Zap className="w-3 h-3" />
                {t("product.badge.featured")}
              </span>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/20 transition-colors"
              aria-label={t("modal.close")}
              title={t("modal.close")}
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="p-6 md:p-8">
          <div className="grid lg:grid-cols-[1.1fr,1.1fr] gap-8">
            {/* LEFT: image + thumbs */}
            <div>
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                <img
                  src={activeImage}
                  alt={motorcycle.name}
                  className="w-full h-80 md:h-96 object-cover transition-transform duration-500 hover:scale-105"
                />

                {/* small gradient strip bottom-left */}
                <div className="absolute left-4 bottom-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                  <span className="text-xs font-semibold uppercase tracking-wide text-white/80">
                    {motorcycle.engine?.toLowerCase().includes("electric")
                      ? t("hero.feature.quality")
                      : t("hero.feature.service")}
                  </span>
                </div>
              </div>

              {/* Thumbnails si hay galería */}
              {gallery.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                  {gallery.map((src, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-xl border transition-all ${
                        idx === currentImageIndex
                          ? "border-sky-400 ring-2 ring-sky-500/60"
                          : "border-white/15 hover:border-sky-300/70"
                      }`}
                    >
                      <img
                        src={src}
                        alt={`${motorcycle.name} ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: info */}
            <div className="space-y-6">
              {/* Brand / model / desc */}
              <div>
                <p className="text-sm font-semibold text-sky-300 mb-1">
                  {motorcycle.brand} • {motorcycle.model}
                </p>
                {description && (
                  <p className="text-sm md:text-base text-white/80 leading-relaxed">
                    {description}
                  </p>
                )}
              </div>

              {/* Specs row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/15 px-3 py-3">
                  <Calendar className="w-5 h-5 text-sky-400" />
                  <div>
                    <p className="text-xs text-white/60 font-semibold uppercase tracking-wide">
                      {t("modal.year")}
                    </p>
                    <p className="text-lg font-bold text-white">
                      {motorcycle.year}
                    </p>
                  </div>
                </div>

                {motorcycle.engine && (
                  <div className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/15 px-3 py-3">
                    <Fuel className="w-5 h-5 text-sky-400" />
                    <div>
                      <p className="text-xs text-white/60 font-semibold uppercase tracking-wide">
                        {t("modal.engine")}
                      </p>
                      <p className="text-lg font-bold text-white">
                        {motorcycle.engine}
                      </p>
                    </div>
                  </div>
                )}

                {motorcycle.mileage && (
                  <div className="col-span-2 flex items-center gap-3 rounded-2xl bg-white/5 border border-white/15 px-3 py-3">
                    <Gauge className="w-5 h-5 text-sky-400" />
                    <div>
                      <p className="text-xs text-white/60 font-semibold uppercase tracking-wide">
                        {t("modal.mileage")}
                      </p>
                      <p className="text-lg font-bold text-white">
                        {motorcycle.mileage.toLocaleString()} km
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Features as tech chips */}
              {features.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60 mb-2">
                    {t("modal.features")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold text-white"
                      >
                        <Star className="w-3 h-3 text-sky-300" />
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Price & actions */}
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-sky-500/15 via-red-600/20 to-black/80 p-5 space-y-4">
                {Number(motorcycle.price) > 0 && (
                  <p className="text-3xl md:text-4xl font-black text-white">
                    {fmtMoney(Number(motorcycle.price))}
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={onPhoneCall}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-black/80 px-4 py-3 text-sm md:text-base font-bold text-white hover:bg-white hover:text-black transition-all"
                    aria-label={t("modal.contact")}
                    title={t("modal.contact")}
                  >
                    <Phone className="w-4 h-4" />
                    {t("modal.contact")}
                  </button>

                  <button
                    onClick={handleFinancing}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-3 text-sm md:text-base font-black text-black shadow-lg hover:brightness-110 transition-all"
                  >
                    {t("modal.financing")}
                  </button>
                </div>

                <button
                  onClick={onWhatsApp}
                  className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm md:text-base font-black text-black hover:bg-[#1ebe57] transition-all"
                  aria-label={t("modal.whatsapp")}
                  title={t("modal.whatsapp")}
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
                  </svg>
                  {t("modal.whatsapp")}
                </button>
              </div>

              {/* Guarantees strip */}
              <div className="grid grid-cols-3 gap-4 pt-2 border-t border-white/10 mt-2">
                <div className="text-center text-white/80">
                  <Shield className="w-7 h-7 mx-auto mb-1 text-sky-400" />
                  <p className="text-xs md:text-sm font-semibold">
                    {t("guarantee.warranty")}
                  </p>
                </div>
                <div className="text-center text-white/80">
                  <Wrench className="w-7 h-7 mx-auto mb-1 text-sky-400" />
                  <p className="text-xs md:text-sm font-semibold">
                    {t("guarantee.service")}
                  </p>
                </div>
                <div className="text-center text-white/80">
                  <Star className="w-7 h-7 mx-auto mb-1 text-sky-400" />
                  <p className="text-xs md:text-sm font-semibold">
                    {t("guarantee.quality")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>      
    </div>
  );
};

export default MotorcycleModal;
