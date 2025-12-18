// src/components/Footer.tsx
import React, { useState, type ReactNode } from 'react';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';

function LegalModal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[10020] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-[#050509] shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h3 className="text-white font-black text-lg">{title}</h3>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
            aria-label="Close"
            title="Close"
          >
            ✕
          </button>
        </div>
        <div className="px-5 py-4 text-white/80 text-sm leading-relaxed">{children}</div>
        <div className="px-5 pb-5 flex justify-end">
          <button
            onClick={onClose}
            className="h-10 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

const Footer: React.FC = () => {
  const { t } = useI18n();
  const [legal, setLegal] = useState<{ open: boolean; title: string; body: string }>({
    open: false,
    title: '',
    body: '',
  });

  // IMPORTANTE: poné los links reales de nextDrive acá cuando los tengas.
  const NEXTDRIVE_SOCIAL = {
    facebook: '',   // 'https://facebook.com/xxxxx'
    instagram: '',  // 'https://instagram.com/xxxxx'
    twitter: '',    // 'https://twitter.com/xxxxx'
    youtube: '',    // 'https://youtube.com/@xxxxx'
  };

  const socialLinks = [
    { id: 'facebook', icon: Facebook, href: NEXTDRIVE_SOCIAL.facebook, labelKey: 'social.facebook' },
    { id: 'instagram', icon: Instagram, href: NEXTDRIVE_SOCIAL.instagram, labelKey: 'social.instagram' },
    { id: 'twitter', icon: Twitter, href: NEXTDRIVE_SOCIAL.twitter, labelKey: 'social.twitter' },
    { id: 'youtube', icon: Youtube, href: NEXTDRIVE_SOCIAL.youtube, labelKey: 'social.youtube' },
  ] as const;

  const quickLinks = [
    { id: 'home', textKey: 'nav.home', href: '#inicio' },
    { id: 'catalog', textKey: 'nav.catalog', href: '#catalogo' },
    { id: 'about', textKey: 'nav.about', href: '#nosotros' },
    { id: 'contact', textKey: 'nav.contact', href: '#contacto' },
  ] as const;

  const services = [
    { id: 'new', textKey: 'services.new', href: '#catalogo' },
    { id: 'used', textKey: 'services.used', href: '#catalogo' },
    { id: 'finance', textKey: 'services.finance', href: '#contacto' },
    { id: 'tech', textKey: 'services.tech', href: '#contacto' },
  ] as const;

  const handleSocialClick = (href: string) => {
    if (!href) return;
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  const handleLinkClick = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.getElementById(href.substring(1));
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.open(href, '_blank', 'noopener,noreferrer');
    }
  };

  const openLegal = (title: string, body: string) => setLegal({ open: true, title, body });

  return (
    <footer className="bg-[#050509] border-t border-white/10">
      <LegalModal
        open={legal.open}
        title={legal.title}
        onClose={() => setLegal({ open: false, title: '', body: '' })}
      >
        {legal.body}
      </LegalModal>

      <div className="container mx-auto px-4 py-10 md:py-14">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Logo + description */}
          <div className="md:col-span-2">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center space-x-3 mb-5 hover:opacity-90 transition-opacity"
              aria-label="Back to top"
              title="Back to top"
            >
              <div className="bg-white rounded-xl p-1.5 shadow-[0_12px_35px_rgba(15,23,42,0.6)]">
                <img
                  src="/IMG/logo-mini.png"
                  alt="nextDrive logo"
                  className="w-9 h-9 object-contain rounded-lg"
                />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
                  next<span className="font-bold">Drive</span>
                </h3>
                <p className="text-sm md:text-base text-white/60 font-medium">{t('footer.tagline')}</p>
              </div>
            </button>

            <p className="text-sm md:text-base text-white/70 max-w-md mb-6">{t('footer.desc')}</p>

            <div className="flex space-x-3">
              {socialLinks.map((s) => {
                const disabled = !s.href;
                return (
                  <button
                    key={s.id}
                    onClick={() => handleSocialClick(s.href)}
                    disabled={disabled}
                    className={`p-2.5 rounded-full bg-white/5 border border-white/10 transition-all duration-200
                      ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10 hover:border-white/30'}`}
                    aria-label={t(s.labelKey)}
                    title={disabled ? `${t(s.labelKey)} (coming soon)` : t(s.labelKey)}
                  >
                    <s.icon className="w-4 h-4 text-sky-300" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-lg md:text-xl font-semibold text-white mb-4">{t('footer.quickLinks.title')}</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => handleLinkClick(link.href)}
                    className="text-sm md:text-base text-white/70 hover:text-white transition-colors"
                  >
                    {t(link.textKey)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg md:text-xl font-semibold text-white mb-4">{t('footer.services.title')}</h4>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => handleLinkClick(s.href)}
                    className="text-sm md:text-base text-white/70 hover:text-white transition-colors"
                  >
                    {t(s.textKey)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs md:text-sm text-white/50">
            © {new Date().getFullYear()} nextDrive. {t('footer.rights')}
          </p>
          <div className="flex flex-wrap gap-4 text-xs md:text-sm text-white/55">
            <button
              onClick={() => openLegal(t('footer.legal.terms'), t('footer.legal.termsMsg'))}
              className="hover:text-white transition-colors"
            >
              {t('footer.legal.terms')}
            </button>
            <button
              onClick={() => openLegal(t('footer.legal.privacy'), t('footer.legal.privacyMsg'))}
              className="hover:text-white transition-colors"
            >
              {t('footer.legal.privacy')}
            </button>
            <button
              onClick={() => openLegal(t('footer.legal.cookies'), t('footer.legal.cookiesMsg'))}
              className="hover:text-white transition-colors"
            >
              {t('footer.legal.cookies')}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
