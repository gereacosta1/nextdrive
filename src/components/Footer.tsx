// src/components/Footer.tsx
import React from 'react';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';

const Footer: React.FC = () => {
  const { t } = useI18n();

  const socialLinks = [
    { id: 'facebook', icon: Facebook, href: 'https://facebook.com/motocentral', labelKey: 'social.facebook' },
    { id: 'instagram', icon: Instagram, href: 'https://instagram.com/motocentral', labelKey: 'social.instagram' },
    { id: 'twitter', icon: Twitter, href: 'https://twitter.com/motocentral', labelKey: 'social.twitter' },
    { id: 'youtube', icon: Youtube, href: 'https://youtube.com/motocentral', labelKey: 'social.youtube' },
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
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  const handleLinkClick = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.getElementById(href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.open(href, '_blank', 'noopener,noreferrer');
    }
  };

  const handleTermsClick = () => {
    alert(t('footer.legal.termsMsg'));
  };
  const handlePrivacyClick = () => {
    alert(t('footer.legal.privacyMsg'));
  };
  const handleCookiesClick = () => {
    alert(t('footer.legal.cookiesMsg'));
  };

  return (
    <footer className="bg-[#050509] border-t border-white/10">
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
                <p className="text-sm md:text-base text-white/60 font-medium">
                  {t('footer.tagline')}
                </p>
              </div>
            </button>

            <p className="text-sm md:text-base text-white/70 max-w-md mb-6">
              {t('footer.desc')}
            </p>

            <div className="flex space-x-3">
              {socialLinks.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSocialClick(s.href)}
                  className="p-2.5 rounded-full bg-white/5 border border-white/10
                             hover:bg-white/10 hover:border-white/30
                             transition-all duration-200"
                  aria-label={t(s.labelKey)}
                  title={t(s.labelKey)}
                >
                  <s.icon className="w-4 h-4 text-sky-300" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-lg md:text-xl font-semibold text-white mb-4">
              {t('footer.quickLinks.title')}
            </h4>
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
            <h4 className="text-lg md:text-xl font-semibold text-white mb-4">
              {t('footer.services.title')}
            </h4>
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
              onClick={handleTermsClick}
              className="hover:text-white transition-colors"
            >
              {t('footer.legal.terms')}
            </button>
            <button
              onClick={handlePrivacyClick}
              className="hover:text-white transition-colors"
            >
              {t('footer.legal.privacy')}
            </button>
            <button
              onClick={handleCookiesClick}
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
