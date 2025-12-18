// src/components/Header.tsx
import React, { useState } from 'react';
import { Menu, X, Phone, MapPin, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

import LangToggle from './LangToggle';
import { useI18n } from '../i18n/I18nProvider';

interface HeaderProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeSection, onNavigate }) => {
  const { t } = useI18n();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { open, items } = useCart();
  const cartCount = items.reduce((sum, it) => sum + it.qty, 0);

  const menuItems: { id: string; labelKey: keyof (typeof import('../i18n/dict.es').default) }[] = [
    { id: 'inicio', labelKey: 'nav.home' },
    { id: 'catalogo', labelKey: 'nav.catalog' },
    { id: 'nosotros', labelKey: 'nav.about' },
    { id: 'contacto', labelKey: 'nav.contact' },
  ];

  const handlePhoneCall = () => {
    window.open('tel:+17862530995', '_self');
  };

  const handleLogoClick = () => {
    onNavigate('inicio');
    setIsMenuOpen(false);
  };

  const handleOpenCart = () => {
    open();
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#050509]/90 backdrop-blur-xl border-b border-white/10">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <button
            onClick={handleLogoClick}
            className="flex items-center space-x-3 hover:opacity-90 transition-opacity duration-200"
          >
            <div className="bg-white rounded-xl p-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.45)]">
              <img
                src="/IMG/logo-mini.png"
                alt="nextDrive logo"
                className="w-9 h-9 object-contain rounded-lg"
              />
            </div>
            <div className="text-left">
              <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-white">
                next<span className="font-bold">Drive</span>
              </h1>
              <p className="text-xs md:text-sm text-white/55 font-medium">
                {t('footer.tagline')}
              </p>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative text-sm lg:text-base font-semibold tracking-wide transition-all duration-200
                  ${activeSection === item.id ? 'text-sky-300' : 'text-white/70 hover:text-white'}`}
              >
                {t(item.labelKey)}
                {activeSection === item.id && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-[2px] rounded-full bg-sky-400" />
                )}
              </button>
            ))}

            {/* Cart button */}
            <button
              onClick={handleOpenCart}
              className="relative flex items-center gap-2 text-white/80 hover:text-white transition-colors"
              aria-label={t('nav.cart')}
              title={t('nav.cart')}
            >
              <ShoppingCart className="w-5 h-5 text-sky-400" />
              <span className="text-sm font-semibold">{t('nav.cart')}</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-sky-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Lang toggle */}
            <LangToggle />
          </nav>

          {/* Desktop right side: phone + location */}
          <div className="hidden lg:flex items-center space-x-5 text-white/70 text-sm font-medium">
            <button
              onClick={handlePhoneCall}
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <Phone className="w-4 h-4 text-sky-400" />
              <span>+1 (786) 253 0995</span>
            </button>
            <button
              onClick={() => onNavigate('contacto')}
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <MapPin className="w-4 h-4 text-sky-400" />
              <span>MIAMI</span>
            </button>
          </div>

          {/* Mobile actions */}
          <div className="md:hidden flex items-center gap-3">
            {/* Cart */}
            <button
              onClick={handleOpenCart}
              className="relative text-white/80 hover:text-white transition-colors"
              aria-label={t('nav.cart')}
              title={t('nav.cart')}
            >
              <ShoppingCart className="w-6 h-6 text-sky-400" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-sky-500 text-white text-[10px] font-bold rounded-full px-1.5 py-[2px]">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Phone */}
            <button
              onClick={handlePhoneCall}
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-white/70 hover:text-white transition-colors"
            >
              <Phone className="w-4 h-4 text-sky-400" />
              <span>{t('contact.call')}</span>
            </button>

            {/* Lang toggle */}
            <LangToggle />

            {/* Burger */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Toggle menu"
              title="Menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {isMenuOpen && (
          <div className="md:hidden mt-3 pb-3 border-t border-white/10">
            <nav className="flex flex-col space-y-1 pt-3">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`text-left py-2.5 px-3 rounded-lg text-sm font-semibold transition-colors
                    ${
                      activeSection === item.id
                        ? 'bg-sky-500/10 text-sky-300'
                        : 'text-white/75 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  {t(item.labelKey)}
                </button>
              ))}

              <div className="mt-2 flex items-center justify-between px-3 text-xs text-white/50">
                <button
                  onClick={handlePhoneCall}
                  className="flex items-center gap-1 hover:text-white/80 transition-colors"
                >
                  <Phone className="w-3 h-3 text-sky-400" />
                  <span>+1 (786) 253 0995</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate('contacto');
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-1 hover:text-white/80 transition-colors"
                >
                  <MapPin className="w-3 h-3 text-sky-400" />
                  <span>MIAMI</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
