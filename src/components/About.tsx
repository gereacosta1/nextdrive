// src/components/About.tsx
import React, { useMemo, useState } from 'react';
import { Award, Users, Clock, Wrench, ChevronLeft, ChevronRight } from 'lucide-react';
import UnderlineGrow from '../components/UnderlineGrow';
import { useI18n } from '../i18n/I18nProvider';

const FALLBACK_SVG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700">
    <defs>
      <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#0b1220"/>
        <stop offset="1" stop-color="#050509"/>
      </linearGradient>
      <radialGradient id="r" cx="70%" cy="35%" r="70%">
        <stop offset="0" stop-color="#38bdf8" stop-opacity="0.28"/>
        <stop offset="1" stop-color="#38bdf8" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="1200" height="700" fill="url(#g)"/>
    <rect width="1200" height="700" fill="url(#r)"/>
    <g fill="none" stroke="#ffffff" stroke-opacity="0.18">
      <rect x="90" y="90" width="1020" height="520" rx="28"/>
      <path d="M180 520 L520 260 L760 420 L1020 210" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <g fill="#ffffff" fill-opacity="0.75" font-family="Arial, Helvetica, sans-serif">
      <text x="110" y="650" font-size="34" font-weight="700">nextDrive</text>
      <text x="110" y="680" font-size="18" fill-opacity="0.55">Upload your store/gallery images to /public/IMG/nextdrive/</text>
    </g>
  </svg>
`);

const About: React.FC = () => {
  const { t } = useI18n();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  /**
   * Importante:
   * - Poné tus fotos reales de nextDrive en: /public/IMG/nextdrive/
   * - Nombres sugeridos (podés cambiarlos):
   *   store-1.jpg, store-2.jpg, store-3.jpg, store-4.jpg
   */
  const storeImages = useMemo(
    () => [
      '/IMG/electricBike.jpeg',
      '/IMG/electricBike2.jpeg',
      '/IMG/electricBike3.jpeg',
      '/IMG/triciclo-negro.jpeg',
    ],
    []
  );

  const nextImage = () => setCurrentImageIndex((p) => (p + 1) % storeImages.length);
  const prevImage = () => setCurrentImageIndex((p) => (p - 1 + storeImages.length) % storeImages.length);

  const stats = [
    { icon: Award, number: '15+', textKey: 'about.stats.years' },
    { icon: Users, number: '5000+', textKey: 'about.stats.clients' },
    { icon: Clock, number: '24/7', textKey: 'about.stats.support' },
    { icon: Wrench, number: '100%', textKey: 'about.stats.quality' },
  ] as const;

  const services = [
    { id: 'new', icon: '🏍️', titleKey: 'about.services.new.title', descKey: 'about.services.new.desc' },
    { id: 'used', icon: '✅', titleKey: 'about.services.used.title', descKey: 'about.services.used.desc' },
    { id: 'fin', icon: '💳', titleKey: 'about.services.fin.title', descKey: 'about.services.fin.desc' },
    { id: 'tech', icon: '🔧', titleKey: 'about.services.tech.title', descKey: 'about.services.tech.desc' },
  ] as const;

  return (
    <section id="nosotros" className="py-20 bg-[#050509]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
            <UnderlineGrow>{t('about.title')}</UnderlineGrow>
          </h2>
          <p className="text-white/80 text-xl md:text-2xl max-w-4xl mx-auto font-medium">
            {t('about.subtitle')}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl inline-flex items-center justify-center mb-4 shadow-[0_18px_55px_rgba(15,23,42,0.95)]">
                <stat.icon className="w-7 h-7 text-sky-400" />
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-1">{stat.number}</h3>
              <p className="text-white/70 text-sm md:text-base font-medium">{t(stat.textKey)}</p>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-3xl font-black text-white mb-6">{t('about.trust.title')}</h3>
            <p className="text-white/80 text-lg font-medium mb-6">{t('about.trust.p1')}</p>
            <p className="text-white/80 text-lg font-medium mb-6">{t('about.trust.p2')}</p>

            <div className="flex flex-wrap gap-3">
              <span className="bg-white/5 border border-white/10 text-white/80 px-5 py-2.5 rounded-full text-sm md:text-base font-semibold shadow-[0_14px_40px_rgba(15,23,42,0.85)]">
                {t('about.chips.quality')}
              </span>
              <span className="bg-white/5 border border-white/10 text-white/80 px-5 py-2.5 rounded-full text-sm md:text-base font-semibold shadow-[0_14px_40px_rgba(15,23,42,0.85)]">
                {t('about.chips.prices')}
              </span>
              <span className="bg-white/5 border border-white/10 text-white/80 px-5 py-2.5 rounded-full text-sm md:text-base font-semibold shadow-[0_14px_40px_rgba(15,23,42,0.85)]">
                {t('about.chips.service')}
              </span>
            </div>
          </div>

          {/* Gallery */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-[0_22px_70px_rgba(15,23,42,0.95)]">
              <img
                src={storeImages[currentImageIndex]}
                alt={t('about.gallery.alt')}
                className="w-full h-80 object-cover transition-transform duration-500"
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  img.src = FALLBACK_SVG;
                }}
              />

              {/* Navigation Buttons */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/75 backdrop-blur-md border border-white/20 text-white p-3 rounded-full hover:border-sky-400 hover:text-sky-300 transition-colors shadow-lg"
                aria-label={t('about.gallery.prev')}
                title={t('about.gallery.prev')}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/75 backdrop-blur-md border border-white/20 text-white p-3 rounded-full hover:border-sky-400 hover:text-sky-300 transition-colors shadow-lg"
                aria-label={t('about.gallery.next')}
                title={t('about.gallery.next')}
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {storeImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2.5 h-2.5 rounded-full border transition-colors ${
                      index === currentImageIndex
                        ? 'bg-sky-400 border-sky-300'
                        : 'bg-white/40 border-white/40 hover:bg-white/80'
                    }`}
                    aria-label={`${t('about.gallery.seeImage')} ${index + 1}`}
                    title={`${t('about.gallery.seeImage')} ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <p className="mt-3 text-xs text-white/55">
              Tip: Replace the gallery images in <span className="text-white/75 font-semibold">/public/IMG/nextdrive/</span> to match nextDrive.
            </p>
          </div>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-3xl font-black text-white text-center mb-12">
            <UnderlineGrow>{t('about.services.title')}</UnderlineGrow>
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((s) => {
              const serviceTitle = t(s.titleKey);
              return (
                <div
                  key={s.id}
                  className="bg-[#070b14]/95 backdrop-blur-xl border border-white/10 p-6 rounded-2xl hover:border-sky-400 hover:shadow-[0_22px_70px_rgba(56,189,248,0.25)] transition-all duration-300 transform hover:-translate-y-1 text-left"
                >
                  <div className="text-3xl mb-4" aria-hidden="true">
                    {s.icon}
                  </div>
                  <h4 className="text-xl font-black text-white mb-3">{serviceTitle}</h4>
                  <p className="text-white/80 text-sm md:text-base font-medium">
                    {t(s.descKey)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
