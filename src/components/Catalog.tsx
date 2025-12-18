// src/components/Catalog.tsx
import React, { useMemo, useState } from 'react';
import { Heart, Eye, Fuel, Gauge, Calendar, Tag } from 'lucide-react';
import { Motorcycle } from '../App';
import UnderlineGrow from './UnderlineGrow';

import { useCart } from '../context/CartContext';
import { useI18n } from '../i18n/I18nProvider';

interface CatalogProps {
  onViewDetails: (motorcycle: Motorcycle) => void;
}

/** Toast simple */
function SimpleToast({
  show,
  text,
  onClose,
}: {
  show: boolean;
  text: string;
  onClose: () => void;
}) {
  if (!show) return null;
  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black/90 text-white border border-white/20 px-4 py-3 rounded-xl shadow-2xl z-[9999] text-sm font-semibold"
      onClick={onClose}
      role="status"
    >
      {text}
    </div>
  );
}

// --- Botón reutilizable ---
type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
};

const Btn: React.FC<BtnProps> = ({
  variant = 'primary',
  className = '',
  children,
  ...props
}) => {
  const base =
    'w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold ' +
    'transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-0 ' +
    'disabled:opacity-60 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-sky-500 text-black hover:bg-sky-400 shadow-[0_16px_45px_rgba(56,189,248,0.55)] active:scale-[.98]',
    secondary:
      'bg-white/5 text-white hover:bg-white/10 border border-white/10 shadow-[0_10px_30px_rgba(15,23,42,0.65)] active:scale-[.98]',
    ghost:
      'bg-transparent text-white/80 border border-white/15 hover:bg-white/5 hover:text-white',
  } as const;

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

/** 🔁 Mapeo: texto ES del array -> clave i18n */
const FEATURE_KEY_BY_ES: Record<string, string> = {
  'Motor eléctrico': 'feature.motor',
  'Ligero y ágil': 'feature.lightAgile',
  'Batería de alta capacidad': 'feature.batteryHigh',
  'Motor eléctrico de alta potencia': 'feature.motorHighPower',
  'Pantalla táctil': 'feature.touchscreen',
  'Conectividad Bluetooth': 'feature.bluetooth',
  'Sistema de navegación GPS': 'feature.gps',
};

const Catalog: React.FC<CatalogProps> = ({ onViewDetails }) => {
  const { t, fmtMoney } = useI18n();
  const tOr = (key: string, fallback: string) => {
    const v = t(key);
    return v === key ? fallback : v;
  };

  const [filter, setFilter] = useState<'all' | 'nueva'>('all');
  const [category, setCategory] = useState<'all' | 'scooters' | 'ebikes' | 'accessories' | 'cargo'>('all');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [toast, setToast] = useState<{ show: boolean; text: string }>({ show: false, text: '' });

  const showToast = (text: string, ms = 2500) => {
    setToast({ show: true, text });
    window.setTimeout(() => setToast({ show: false, text: '' }), ms);
  };

  const { addItem, open } = useCart();

  // ⬇️ tus productos (mismos)
  const motorcycles: Motorcycle[] = [
    {
      id: 1,
      name: 'MISAKI GN 150',
      brand: 'MISAKI',
      model: 'GN 150',
      year: 2025,
      price: 450,
      image: '/IMG/MOTO-MISAKI-GN-150.jpeg',
      condition: 'Nueva',
      engine: '321cc',
      featured: true,
      description:
        'La MISAKI GN 150 es perfecta para principiantes y riders experimentados. Con su motor de 321cc, ofrece la potencia ideal para la ciudad y carretera.',
      features: ['ABS', 'Frenos de disco', 'Tablero digital', 'LED', 'Arranque eléctrico'],
    },
    {
      id: 2,
      name: 'falcon 200cc',
      brand: 'falcon',
      model: 'falcon 200cc',
      year: 2025,
      price: 1000,
      image: '/IMG/FALCON-200cc.jpeg',
      condition: 'Nueva',
      engine: '649cc',
      description:
        'La falcon 200cc combina estilo naked con tecnología avanzada. Motor de 4 cilindros en línea para máximo rendimiento.',
      features: [
        'ABS',
        'Control de tracción',
        'Modos de conducción',
        'Suspensión ajustable',
        'Frenos Brembo',
      ],
    },
    {
      id: 3,
      name: 'XMT 250',
      brand: 'Vitacc',
      model: 'G310R',
      year: 2025,
      price: 820,
      image: '/IMG/MOTO-XMT-250.jpeg',
      condition: 'Nueva',
      engine: '313cc',
      featured: true,
      description:
        'XMT 250 ofrece la calidad alemana en una moto accesible. Ideal para uso urbano con toque premium.',
      features: ['ABS', 'Suspensión invertida', 'Tablero LCD', 'Frenos de disco', 'Diseño premium'],
    },
    {
      id: 5,
      name: 'SCOOTER ELECTRICO',
      brand: 'SCOOTER',
      model: 'SCOOTER ELECTRICO',
      year: 2025,
      price: 1500,
      image: '/IMG/Scooter-electrico(1).jpeg',
      condition: 'Nueva',
      engine: 'Electric',
      mileage: 1200,
      description:
        'SCOOTER ELECTRICO, la italiana por excelencia. Potencia, estilo y exclusividad en una sola moto.',
      features: [
        'ABS',
        'Control de tracción',
        'Modos de conducción',
        'Suspensión Öhlins',
        'Escape Termignoni',
      ],
    },
    {
      id: 6,
      name: 'TITAN 250',
      brand: 'TITAN',
      model: 'TITAN 250',
      year: 2025,
      price: 840,
      image: '/IMG/TITAN-250.jpeg',
      condition: 'Nueva',
      engine: '373cc',
      description:
        'TITAN 250, la bestia VERDE que domina las calles. Máxima diversión y adrenalina garantizada.',
      features: ['ABS', 'Control de tracción', 'Ride by Wire', 'Suspensión WP', 'Frenos ByBre'],
    },
    {
      id: 7,
      name: 'FLASH 50cc',
      brand: 'FLASH',
      model: 'FLASH 50cc',
      year: 2025,
      price: 640,
      image: '/IMG/FLASH 50cc.jpeg',
      condition: 'Nueva',
      engine: '373cc',
      mileage: 1200,
      description:
        'Flash 50cc, la italiana por excelencia. Potencia, estilo y exclusividad en una sola moto.',
      features: [
        'ABS',
        'Control de tracción',
        'Modos de conducción',
        'Suspensión Öhlins',
        'Escape Termignoni',
      ],
    },
    {
      id: 8,
      name: 'ELECTRIC SCOOTER 2025',
      brand: 'master sonic',
      model: 'ELECTRIC SCOOTER',
      year: 2025,
      price: 1850,
      image: '/IMG/ELECTRIC SCOOTER.jpeg',
      condition: 'Nueva',
      engine: 'Electric',
      mileage: 1200,
      description:
        'ELECTRIC SCOOTER, la italiana por excelencia. Potencia, estilo y exclusividad en una sola moto.',
      features: ['Motor eléctrico', 'Ligero y ágil', 'Batería de alta capacidad'],
    },
    {
      id: 9,
      name: 'MISAKI GN 150',
      brand: 'MISAKI',
      model: 'GN 150',
      year: 2024,
      price: 730,
      image: '/IMG/MOTO-MISAKI-GN-150-(3).jpeg',
      condition: 'Nueva',
      engine: '321cc',
      featured: true,
      description:
        'La MISAKI GN 150 es perfecta para principiantes y riders experimentados. Con su motor de 321cc, ofrece la potencia ideal para la ciudad y carretera.',
      features: ['ABS', 'Frenos de disco', 'Tablero digital', 'LED', 'Arranque eléctrico'],
    },
    {
      id: 10,
      name: 'MISAKI GN 150',
      brand: 'MISAKI',
      model: 'GN 150',
      year: 2024,
      price: 1060,
      image: '/IMG/MOTO-MISAKI-GN-150-(3).jpeg',
      condition: 'Nueva',
      engine: '321cc',
      featured: true,
      description:
        'La MISAKI GN 150 es perfecta para principiantes y riders experimentados. Con su motor de 321cc, ofrece la potencia ideal para la ciudad y carretera.',
      features: ['ABS', 'Frenos de disco', 'Tablero digital', 'LED', 'Arranque eléctrico'],
    },
    {
      id: 11,
      name: 'Electric Bike Pro',
      brand: 'Electric Bike',
      model: 'EBike Pro 2025',
      year: 2025,
      price: 1000,
      image: '/IMG/electricBike2.jpeg',
      condition: 'Nueva',
      engine: 'Electric',
      featured: true,
      description:
        'Bicicleta eléctrica de alto rendimiento, ideal para ciudad y trayectos largos.',
      features: ['Motor eléctrico', 'Batería de larga duración', 'Tablero digital'],
    },
    {
      id: 12,
      name: 'Electric scooter Urban',
      brand: 'Electric scooter',
      model: 'Scooter Urban 2025',
      year: 2025,
      price: 1000,
      image: '/IMG/electricBike3.jpeg',
      condition: 'Nueva',
      engine: 'Electric',
      featured: true,
      description: 'Bicicleta eléctrica urbana, cómoda y eficiente para el día a día.',
      features: ['Motor eléctrico', 'Diseño compacto', 'Autonomía extendida'],
    },
    {
      id: 13,
      name: 'Parlante JBL GO',
      brand: 'JBL',
      model: 'GO 2025',
      year: 2025,
      price: 400,
      image: '/IMG/parlanteJBL.jpeg',
      condition: 'Nueva',
      engine: '373cc',
      featured: true,
      description: 'Parlante JBL portátil, sonido potente y diseño compacto.',
      features: ['Bluetooth', 'Resistente al agua', 'Batería recargable'],
    },
    {
      id: 14,
      name: 'Parlante JBL Flip',
      brand: 'JBL',
      model: 'Flip 2025',
      year: 2025,
      price: 300,
      image: '/IMG/parlanteJBL2.jpeg',
      condition: 'Nueva',
      engine: '373cc',
      featured: true,
      description: 'Parlante JBL Flip, ideal para fiestas y exteriores.',
      features: ['Bluetooth', 'Gran autonomía', 'Sonido envolvente'],
    },
    {
      id: 15,
      name: 'Ruedas (Neumáticos)',
      brand: 'Universal',
      model: 'Rueda Premium 2025',
      year: 2025,
      price: 60,
      image: '/IMG/ruedas.jpeg',
      condition: 'Nueva',
      engine: '373cc',
      featured: true,
      description: 'Neumáticos de alta calidad para motos y bicicletas eléctricas.',
      features: ['Alta durabilidad', 'Agarre superior', 'Diseño moderno'],
    },
    {
      id: 16,
      name: 'Bici electrica Premium',
      brand: 'Universal',
      model: 'Scooter Premium 2025',
      year: 2025,
      price: 3500,
      image: '/IMG/bici-electric-negra.jpeg',
      condition: 'Nueva',
      engine: 'electric',
      featured: true,
      description: 'Bicicleta eléctrica premium, ideal para viajes largos y confort en la ciudad.',
      features: ['Motor potente', 'Batería de larga duración', 'Diseño ergonómico'],
    },
    {
      id: 17,
      name: 'scooter Amazta',
      brand: 'Amazta',
      model: 'Scooter Amazta 2025',
      year: 2025,
      price: 2500,
      image: '/IMG/scooter-azul-oscuro.jpeg',
      condition: 'Nueva',
      engine: 'electric',
      featured: true,
      description:
        'Scooter Amazta, la combinación perfecta de estilo y tecnología. Ideal para desplazamientos urbanos.',
      features: ['Motor eléctrico', 'Diseño moderno', 'Batería de larga duración'],
    },
    {
      id: 18,
      name: 'scooter movelito',
      brand: 'movelito',
      model: 'Scooter Movelito 2025',
      year: 2025,
      price: 1850,
      image: '/IMG/scooter-azul.jpeg',
      condition: 'Nueva',
      engine: 'electric',
      featured: true,
      description: 'Scooter Movelito, compacto y eficiente. Perfecto para la ciudad con un diseño atractivo.',
      features: ['Motor eléctrico', 'Ligero y ágil', 'Batería de alta capacidad'],
    },
    {
      id: 19,
      name: 'scooter premium galaxy',
      brand: 'galaxy',
      model: 'Scooter Premium Galaxy 2025',
      year: 2025,
      price: 2000,
      image: '/IMG/scooter-rojo.jpeg',
      condition: 'Nueva',
      engine: 'electric',
      featured: true,
      description:
        'Scooter Premium Galaxy, la última innovación en movilidad urbana. Con un diseño futurista y tecnología avanzada.',
      features: [
        'Motor eléctrico de alta potencia',
        'Pantalla táctil',
        'Conectividad Bluetooth',
        'Sistema de navegación GPS',
      ],
    },
    {
      id: 20,
      name: 'scooter eléctrico hiboy',
      brand: 'hiboy',
      model: 'scooter eléctrico hiboy',
      year: 2025,
      price: 500,
      image: '/IMG/scooter-electrico-hiboy.jpg',
      condition: 'Nueva',
      engine: 'electric',
      featured: true,
      description: 'Scooter Movelito, compacto y eficiente. Perfecto para la ciudad con un diseño atractivo.',
      features: ['Motor eléctrico', 'Ligero y ágil', 'Batería de alta capacidad'],
    },
    {
      id: 5001,
      name: 'Electric Cargo Tricycle',
      brand: 'MZ',
      model: 'E-Cargo',
      year: 2025,
      price: 5000,
      image: '/IMG/triciclo-negro.jpeg',
      // @ts-ignore
      gallery: ['/IMG/triciclo-rojo.jpeg', '/IMG/triciclo-rojo2.jpeg', '/IMG/triciclo-rojo3.jpeg'],
      condition: 'Nueva',
      engine: 'Electric',
      featured: true,
      description:
        'Robust electric cargo tricycle ideal for deliveries and utility tasks. Durable chassis, large rear cargo bed, weather canopy and comfortable seating. Financing available.',
      features: ['Motor eléctrico', 'Ligero y ágil', 'Batería de alta capacidad'],
    },
  ];

  /** Helpers de categorización (para no depender de engine mal puesto en accesorios) */
  const lower = (s?: string) => String(s || '').toLowerCase();

  const isElectric = (m: Motorcycle) => lower((m as any).engine).includes('electric');
  const isCargo = (m: Motorcycle) =>
    m.id === 5001 || lower(m.name).includes('cargo') || lower(m.name).includes('tricycle') || lower(m.model).includes('cargo');

  const isAccessory = (m: Motorcycle) => {
    const n = lower(m.name);
    const b = lower(m.brand);
    return (
      b.includes('jbl') ||
      b.includes('universal') ||
      n.includes('parlante') ||
      n.includes('ruedas') ||
      n.includes('neum') ||
      n.includes('speaker')
    );
  };

  const isScooter = (m: Motorcycle) => isElectric(m) && lower(m.name).includes('scooter');
  const isEBike = (m: Motorcycle) => isElectric(m) && (lower(m.name).includes('bike') || lower(m.name).includes('bici'));

  const getCategory = (m: Motorcycle): 'scooters' | 'ebikes' | 'accessories' | 'cargo' | 'other' => {
    if (isCargo(m)) return 'cargo';
    if (isAccessory(m)) return 'accessories';
    if (isScooter(m)) return 'scooters';
    if (isEBike(m)) return 'ebikes';
    return 'other';
  };

  const categoryBadge = (m: Motorcycle) => {
    const c = getCategory(m);
    if (c === 'scooters') return { label: 'Electric Scooter', tone: 'sky' as const };
    if (c === 'ebikes') return { label: 'E-Bike', tone: 'sky' as const };
    if (c === 'accessories') return { label: 'Accessories', tone: 'neutral' as const };
    if (c === 'cargo') return { label: 'Cargo', tone: 'sky' as const };
    return { label: 'Other', tone: 'neutral' as const };
  };

  /** ✅ Curado nextDrive: eléctricos + accesorios + cargo (saca motos “gas” que te hacen ver igual a OneWay) */
  const curated = useMemo(() => {
    return motorcycles.filter((m) => isElectric(m) || isAccessory(m) || isCargo(m));
  }, []);

  // Mantener tu filtro "Todas / Nuevas"
  const filteredByCondition = useMemo(() => {
    return curated.filter((moto) => {
      if (filter === 'all') return true;
      return String(moto.condition || '').toLowerCase() === filter;
    });
  }, [curated, filter]);

  // Nuevo: filtro por categoría
  const filteredMotorcycles = useMemo(() => {
    const byCat =
      category === 'all'
        ? filteredByCondition
        : filteredByCondition.filter((m) => getCategory(m) === category);

    // Orden pro: featured -> año desc -> precio asc
    return [...byCat].sort((a, b) => {
      const af = a.featured ? 1 : 0;
      const bf = b.featured ? 1 : 0;
      if (bf !== af) return bf - af;

      const ay = Number(a.year || 0);
      const by = Number(b.year || 0);
      if (by !== ay) return by - ay;

      const ap = Number(a.price || 0);
      const bp = Number(b.price || 0);
      return ap - bp;
    });
  }, [filteredByCondition, category]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]));
  };

  /** Traducción robusta de features */
  const translateFeature = (productId: number, featureTextES: string, idx: number) => {
    const keyById = `product.${productId}.feature.${idx}`;
    const v1 = t(keyById);
    if (v1 !== keyById) return v1;

    const genericKey = FEATURE_KEY_BY_ES[featureTextES];
    if (genericKey) {
      const v2 = t(genericKey);
      if (v2 !== genericKey) return v2;
    }

    return featureTextES;
  };

  const categoryTabs = [
    { id: 'all' as const, label: 'All' },
    { id: 'scooters' as const, label: 'Electric Scooters' },
    { id: 'ebikes' as const, label: 'E-Bikes' },
    { id: 'accessories' as const, label: 'Accessories' },
    { id: 'cargo' as const, label: 'Cargo' },
  ];

  return (
    <section id="catalogo" className="py-20 bg-[#050509]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
            <UnderlineGrow>{t('catalog.title')}</UnderlineGrow>
          </h2>
          <p className="text-white/80 text-xl md:text-2xl max-w-3xl mx-auto font-medium">
            {t('catalog.subtitle')}
          </p>
        </div>

        {/* Row 1: Todas / Nuevas (compat) */}
        <div className="flex justify-center mb-5">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-full p-1 flex space-x-1 shadow-[0_18px_45px_rgba(15,23,42,0.85)]">
            <button
              onClick={() => setFilter('all')}
              className={`px-7 py-2.5 rounded-full text-sm md:text-base font-semibold transition-all duration-300
                ${filter === 'all' ? 'bg-white text-black shadow-[0_14px_40px_rgba(15,23,42,0.85)]' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
            >
              {t('catalog.filter.all')}
            </button>
            <button
              onClick={() => setFilter('nueva')}
              className={`px-7 py-2.5 rounded-full text-sm md:text-base font-semibold transition-all duration-300
                ${filter === 'nueva' ? 'bg-sky-500 text-black shadow-[0_14px_40px_rgba(56,189,248,0.65)]' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
            >
              {t('catalog.filter.new')}
            </button>
          </div>
        </div>

        {/* Row 2: Categorías (nuevo) */}
        <div className="flex justify-center mb-10">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-full p-1 flex flex-wrap gap-1 shadow-[0_18px_45px_rgba(15,23,42,0.85)]">
            {categoryTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCategory(tab.id)}
                className={`px-5 py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-300
                  ${category === tab.id ? 'bg-white text-black shadow-[0_14px_40px_rgba(15,23,42,0.85)]' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMotorcycles.map((moto) => {
            const condLabel =
              moto.condition === 'Nueva' ? t('product.condition.new') : t('product.condition.used');

            const badge = categoryBadge(moto);

            return (
              <div
                key={moto.id}
                className="bg-[#070b14]/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_22px_70px_rgba(15,23,42,0.95)] hover:border-sky-400/70 hover:shadow-[0_30px_90px_rgba(56,189,248,0.45)] transition-all duration-300 group transform hover:-translate-y-1"
              >
                <div className="relative">
                  <img
                    src={moto.image || '/fallback.png'}
                    alt={moto.name || t('image.altFallback')}
                    className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      if (!target.src.endsWith('/fallback.png')) target.src = '/fallback.png';
                    }}
                  />

                  {/* Condición */}
                  <div className="absolute top-4 left-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide
                        ${moto.condition === 'Nueva' ? 'bg-sky-500 text-black shadow-[0_8px_25px_rgba(56,189,248,0.6)]' : 'bg-white text-black/90 shadow-[0_8px_25px_rgba(15,23,42,0.7)]'}`}
                    >
                      {condLabel}
                    </span>
                  </div>

                  {/* Categoría */}
                  <div className="absolute bottom-4 left-4">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border shadow-lg
                        ${badge.tone === 'sky' ? 'bg-black/70 text-sky-200 border-sky-400/30' : 'bg-black/70 text-white/80 border-white/20'}`}
                    >
                      <Tag className="w-3.5 h-3.5" />
                      {badge.label}
                    </span>
                  </div>

                  {/* Favorito */}
                  <div className="absolute top-4 right-4">
                    <button
                      type="button"
                      onClick={() => toggleFavorite(moto.id)}
                      className="p-2 rounded-full bg-black/75 backdrop-blur-md hover:bg-black border border-white/20 transition-colors"
                      aria-label={
                        favorites.includes(moto.id)
                          ? tOr('favorites.remove', 'Remove favorite')
                          : tOr('favorites.add', 'Add to favorites')
                      }
                      title={
                        favorites.includes(moto.id)
                          ? tOr('favorites.remove', 'Remove favorite')
                          : tOr('favorites.add', 'Add to favorites')
                      }
                    >
                      <Heart
                        className="w-5 h-5"
                        color={favorites.includes(moto.id) ? '#38bdf8' : '#ffffff'}
                        fill={favorites.includes(moto.id) ? '#38bdf8' : 'none'}
                      />
                    </button>
                  </div>

                  {/* Featured */}
                  {moto.featured && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-white text-black/90 px-4 py-1.5 rounded-full text-xs font-semibold shadow-[0_10px_30px_rgba(15,23,42,0.7)]">
                        {t('product.badge.featured')}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="text-2xl font-black text-white mb-1">{moto.name}</h3>
                    <p className="text-sm md:text-base text-white/70 font-medium">
                      {moto.brand} • {moto.model}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-white/80 text-sm md:text-base">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-sky-400" />
                      <span className="font-semibold">{moto.year}</span>
                    </div>

                    {/* Solo mostrar engine si es eléctrico o si no es accesorio (para no poner “373cc” en JBL) */}
                    {moto.engine && !isAccessory(moto) && (
                      <div className="flex items-center gap-2">
                        <Fuel className="w-4 h-4 text-sky-400" />
                        <span className="font-semibold text-xs md:text-sm">{moto.engine}</span>
                      </div>
                    )}

                    {moto.mileage && (
                      <div className="flex items-center gap-2 col-span-2">
                        <Gauge className="w-4 h-4 text-sky-400" />
                        <span className="font-semibold">{moto.mileage.toLocaleString()} km</span>
                      </div>
                    )}
                  </div>

                  {/* precio */}
                  {Number(moto.price) > 0 && (
                    <p className="text-lg font-bold text-sky-300">
                      {fmtMoney(Number(moto.price))}
                    </p>
                  )}

                  {/* features */}
                  {moto.features?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {moto.features.slice(0, 6).map((f, idx) => {
                        const label = translateFeature(moto.id, f, idx);
                        return (
                          <span
                            key={`${moto.id}-feature-${idx}`}
                            className="bg-white/5 border border-white/10 text-white/80 text-xs px-2.5 py-1 rounded-full"
                          >
                            {label}
                          </span>
                        );
                      })}
                    </div>
                  ) : null}

                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Ver Detalles */}
                    <Btn
                      variant="secondary"
                      onClick={() => onViewDetails(moto)}
                      aria-label={`${t('product.viewDetails')} ${moto.name}`}
                      title={t('product.viewDetails')}
                    >
                      <Eye className="w-4 h-4" />
                      {t('product.viewDetails')}
                    </Btn>

                    {/* Agregar al carrito */}
                    <Btn
                      variant="primary"
                      type="button"
                      onClick={() => {
                        const priceNum = Number(moto.price);
                        if (!Number.isFinite(priceNum) || priceNum <= 0) {
                          showToast(t('product.price.toConfirm'));
                          return;
                        }
                        addItem({
                          id: String(moto.id),
                          name: moto.name,
                          price: priceNum,
                          qty: 1,
                          sku: String(moto.id),
                          image: moto.image,
                          url: window.location.href,
                        });
                        open();
                      }}
                    >
                      {t('cart.add')}
                    </Btn>
                  </div>

                  {/* Micro-copy pro (no “Affirm por item”, pero comunica financing) */}
                  <p className="text-xs text-white/55">
                    Financing options available at checkout.
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => showToast(t('catalog.toast.moreSoon'))}
            className="inline-flex items-center justify-center px-10 py-3.5 rounded-full bg-white/5 border border-white/10 text-sm md:text-base font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-all duration-300 shadow-[0_18px_45px_rgba(15,23,42,0.85)]"
          >
            {t('catalog.cta.moreBikes')}
          </button>
        </div>
      </div>

      <SimpleToast show={toast.show} text={toast.text} onClose={() => setToast({ show: false, text: '' })} />
    </section>
  );
};

export default Catalog;
