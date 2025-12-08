// src/components/Hero.tsx
import React from 'react';
import { ArrowRight, Star, Shield, Wrench } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';

interface HeroProps {
  onNavigate: (section: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const { t } = useI18n();

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050509]"
    >
      {/* Background image + overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/IMG/electricBike.jpeg"
          alt="Electric & urban vehicles"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm md:text-base tracking-[0.35em] uppercase text-white/60 mb-5">
            nextDrive • Electric & Used
          </p>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight leading-tight">
            {t('hero.title.pre')}{' '}
            <span className="bg-gradient-to-r from-sky-400 to-sky-300 bg-clip-text text-transparent">
              {t('hero.title.highlight')}
            </span>
            <br />
            {t('hero.title.post')}
          </h1>

          <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-2xl mx-auto font-medium">
            {t('hero.subtitle')}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
            <button
              onClick={() => onNavigate('catalogo')}
              className="inline-flex items-center justify-center gap-3 rounded-full px-10 py-3.5
                         bg-white text-black text-base md:text-lg font-semibold
                         shadow-[0_18px_45px_rgba(15,23,42,0.45)]
                         hover:shadow-[0_22px_65px_rgba(15,23,42,0.75)]
                         hover:-translate-y-[1px]
                         transition-all duration-300"
            >
              <span>{t('hero.cta.explore')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('contacto')}
              className="inline-flex items-center justify-center rounded-full px-10 py-3.5
                         border border-white/15 bg-white/5
                         text-sky-300 text-base md:text-lg font-semibold
                         hover:bg-white/10 hover:border-white/30
                         transition-all duration-300"
            >
              {t('hero.cta.finance')}
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 text-white">
              <Star className="w-6 h-6 text-sky-400" />
              <span className="text-base md:text-lg font-semibold">
                {t('hero.feature.quality')}
              </span>
            </div>
            <div className="flex items-center justify-center gap-3 text-white">
              <Shield className="w-6 h-6 text-sky-400" />
              <span className="text-base md:text-lg font-semibold">
                {t('hero.feature.warranty')}
              </span>
            </div>
            <div className="flex items-center justify-center gap-3 text-white">
              <Wrench className="w-6 h-6 text-sky-400" />
              <span className="text-base md:text-lg font-semibold">
                {t('hero.feature.service')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
