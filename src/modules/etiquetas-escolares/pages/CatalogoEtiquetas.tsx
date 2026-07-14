import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import BackgroundDecorations from '../components/BackgroundDecorations';
import { mockData, BASE_URL } from '../data/designs';
import type { LabelDesign } from '../data/designs';
import imgDtfUv from '../assets/paquetes/dtf-uv.png';
import imgTextiles from '../assets/paquetes/textiles.png';
import imgEsencial from '../assets/paquetes/esencial.png';
import imgClasico from '../assets/paquetes/clasico.png';
import imgPremium from '../assets/paquetes/premium.png';
import imgContorno from '../assets/paquetes/contorno.png';

const WHATSAPP_NUMBER = '525650469993'; // Replace with actual number

interface PackageOption {
  id: string;
  material: 'DTF UV' | 'Textiles' | 'Etiquetas Adhesivas';
  tier?: string;
  label: string;
  price: number;
  includes: string[];
  laminadoPrice?: number;
  previewImage: string;
  popular?: boolean;
  popularLabel?: string;
}

const PACKAGES: PackageOption[] = [
  { id: 'dtf-uv', material: 'DTF UV', label: 'DTF UV', price: 150, includes: ['Etiquetas 100% lavables', 'Organiza tu plantilla a tu gusto', 'Tamaño carta', 'Un nombre y diseño por hoja', 'Con o sin fondo blanco'], previewImage: imgDtfUv },
  { id: 'textiles', material: 'Textiles', label: 'Textiles', price: 100, includes: ['Etiquetas 100% lavables', 'Organiza tu plantilla a tu gusto', 'Tamaño carta', 'Un nombre y diseño por hoja'], previewImage: imgTextiles },
  { id: 'adhesivas-esencial', material: 'Etiquetas Adhesivas', tier: 'Esencial', label: 'Etiquetas Adhesivas · Esencial', price: 150, includes: ['20 pz libretas 9x5 cm', '30 pz lápices 6x2.5 cm'], laminadoPrice: 30, previewImage: imgEsencial },
  { id: 'adhesivas-clasico', material: 'Etiquetas Adhesivas', tier: 'Clásico', label: 'Etiquetas Adhesivas · Clásico', price: 250, includes: ['20 pz libretas 9x5 cm', '30 pz lápices 6x2.5 cm', '14 circulares 5 cm (vinil)', '1 tag grande'], laminadoPrice: 40, previewImage: imgClasico, popular: true, popularLabel: '⭐ Más vendido' },
  { id: 'adhesivas-premium', material: 'Etiquetas Adhesivas', tier: 'Premium', label: 'Etiquetas Adhesivas · Premium', price: 360, includes: ['24 pz libretas 9x5 cm', '48 pz lápices 6x2.5 cm', '9 circulares 5 cm (vinil)', '8 circulares 4 cm (vinil)', '1 tag grande con llavero', '1 tag chico'], laminadoPrice: 50, previewImage: imgPremium, popular: true, popularLabel: '🔥 Recomendado' },
  { id: 'adhesivas-contorno', material: 'Etiquetas Adhesivas', tier: 'Contorno', label: 'Etiquetas Adhesivas · Contorno', price: 180, includes: ['24 pz, largo 8 cm', '25 pz, largo 5 cm', '1 tag grande'], laminadoPrice: 30, previewImage: imgContorno, popular: true, popularLabel: '💡 Económico' },
];

interface ExtraOption {
  id: string;
  label: string;
  price: number;
}

const EXTRAS: ExtraOption[] = [
  { id: 'extra-libretas', label: '10 pz Libretas 9x5cm', price: 60 },
  { id: 'extra-lapices', label: '30 pz Lápices 6x2.5cm', price: 60 },
  { id: 'extra-contorno', label: '12 pz Contorno, largo 8cm', price: 60 },
  { id: 'extra-tag-grande', label: 'Tag Grande', price: 50 },
  { id: 'extra-tag-chico', label: 'Tag Chico', price: 35 },
  { id: 'extra-materias', label: 'Materias en etiqueta libreta', price: 30 },
];

const TAB_STYLE = {
  personajes: {
    imageBg: 'bg-purple-50',
    topBar: 'bg-gradient-to-r from-purple-400 to-pink-400',
    hoverBorder: 'hover:border-purple-200',
    hoverShadow: 'hover:shadow-purple-100',
  },
  siluetas_nina: {
    imageBg: 'bg-pink-50',
    topBar: 'bg-gradient-to-r from-pink-400 to-rose-400',
    hoverBorder: 'hover:border-pink-200',
    hoverShadow: 'hover:shadow-pink-100',
  },
  siluetas_nino: {
    imageBg: 'bg-sky-50',
    topBar: 'bg-gradient-to-r from-sky-400 to-blue-400',
    hoverBorder: 'hover:border-sky-200',
    hoverShadow: 'hover:shadow-sky-100',
  },
} as const;

// Estado del formulario de pedido vive aquí, aislado del catálogo:
// así escribir en estos campos no re-renderiza las 300+ tarjetas de personajes.
interface OrderModalProps {
  design: string;
  pkg: PackageOption;
  laminadoCost: number;
  whatsappNumber: string;
  onClose: () => void;
  onComplete: () => void;
}

function OrderModal({ design, pkg, laminadoCost, whatsappNumber, onClose, onComplete }: OrderModalProps) {
  const [childName, setChildName] = useState('');
  const [grade, setGrade] = useState('');
  const [group, setGroup] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [selectedExtraIds, setSelectedExtraIds] = useState<string[]>([]);

  const extrasCost = selectedExtraIds.reduce((sum, id) => sum + (EXTRAS.find(e => e.id === id)?.price || 0), 0);
  const orderTotal = pkg.price + laminadoCost + extrasCost;

  const toggleExtra = (id: string) => {
    setSelectedExtraIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSendWhatsApp = () => {
    let text = `¡Hola Imagine & Stamp! Quiero hacer mi pedido de etiquetas escolares con el diseño de ${design}.\n\n`;
    text += `*Paquete:* ${pkg.label} - $${pkg.price}\n`;
    if (laminadoCost > 0) {
      text += `*Laminado:* +$${laminadoCost}\n`;
    }
    if (selectedExtraIds.length > 0) {
      text += `*Extras:*\n`;
      selectedExtraIds.forEach(id => {
        const extra = EXTRAS.find(e => e.id === id);
        if (extra) text += `- ${extra.label} (+$${extra.price})\n`;
      });
    }
    text += `*Total estimado:* $${orderTotal}\n\n`;
    text += `Nombre del niño(a): ${childName}\nGrado escolar: ${grade}\nGrupo: ${group}\nDatos adicionales: ${additionalInfo}`;

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl relative max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">Pedido: {design}</h2>
        <p className="text-gray-600 mb-6">Agrega extras si quieres, luego llena tus datos para enviar el pedido por WhatsApp.</p>

        <div className="space-y-5">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex gap-3">
            <img
              src={pkg.previewImage}
              alt={`Paquete elegido: ${pkg.label}`}
              className="w-16 h-20 object-cover rounded-lg flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-700 mb-1">Paquete: {pkg.label} · ${pkg.price}{laminadoCost > 0 ? ` + laminado $${laminadoCost}` : ''}</p>
              <ul className="text-xs text-gray-600 list-disc list-inside space-y-0.5">
                {pkg.includes.map(item => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Extras (opcional)</label>
            <div className="space-y-1.5">
              {EXTRAS.map(extra => (
                <label key={extra.id} className="flex items-center justify-between gap-2 text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-2 cursor-pointer hover:border-gray-300">
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedExtraIds.includes(extra.id)}
                      onChange={() => toggleExtra(extra.id)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    {extra.label}
                  </span>
                  <span className="font-bold text-gray-900">+${extra.price}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
            <span className="text-sm font-bold text-blue-900">Total estimado</span>
            <span className="text-xl font-black text-blue-700">${orderTotal}</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del niño(a) *</label>
            <input
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
              placeholder="Ej. Juan Pérez"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grado</label>
              <input
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                placeholder="Ej. 2do Primaria"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grupo</label>
              <input
                type="text"
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                placeholder="Ej. A"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Datos adicionales (opcional)</label>
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow resize-none"
              rows={3}
              placeholder="Materia, escuela, etc."
            />
          </div>

          <button
            onClick={handleSendWhatsApp}
            disabled={!childName.trim()}
            className="w-full mt-2 bg-[#25D366] hover:bg-[#128C7E] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Enviar por WhatsApp
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// Cuadrícula memoizada: no se re-renderiza cuando cambia el estado del modal
// de pedido ni del selector de paquete, solo cuando cambian los diseños/pestaña.
interface DesignGridProps {
  designs: LabelDesign[];
  activeTab: 'personajes' | 'siluetas_nina' | 'siluetas_nino';
  onSelectDesign: (name: string) => void;
  whatsappNumber: string;
}

const DesignGrid = React.memo(function DesignGrid({ designs, activeTab, onSelectDesign, whatsappNumber }: DesignGridProps) {
  const tabStyle = TAB_STYLE[activeTab];
  const noResultsMsg = encodeURIComponent('¡Hola! Busco un personaje que no vi en el catálogo, ¿me lo pueden diseñar?');

  return (
    <AnimatePresence mode="wait">
      {designs.length === 0 ? (
        <motion.div
          key="empty"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-center py-20"
        >
          <div className="max-w-md mx-auto">
            <p className="text-5xl mb-4">🎨</p>
            <p className="text-gray-700 font-bold text-lg mb-2">
              No encontramos ese diseño
            </p>
            <p className="text-gray-500 text-base mb-6">
              ¡Pero podemos crearlo para ti sin costo extra! Dinos qué personaje buscas y lo diseñamos especialmente.
            </p>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${noResultsMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-sm"
            >💬 Pedirlo por WhatsApp</a>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="grid"
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6"
        >
          <AnimatePresence>
            {designs.map((design) => {
              const imageUrl = encodeURI(`${BASE_URL}${design.folder}/${design.imageFile}`);

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  key={design.id}
                  className={`bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 ${tabStyle.hoverBorder} ${tabStyle.hoverShadow} flex flex-col`}
                  style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 320px' }}
                >
                  {/* Barra de color superior */}
                  <div className={`h-1.5 ${tabStyle.topBar}`} />
                  {/* Image container */}
                  <div className={`aspect-square ${tabStyle.imageBg} relative overflow-hidden`}>
                    <img
                      src={imageUrl}
                      alt={`Diseño ${design.name}`}
                      className="w-full h-full object-contain p-1 sm:p-2"
                      loading="lazy"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-3 sm:p-5 flex flex-col flex-1">
                    <h3 className="text-sm sm:text-xl font-bold text-gray-900 text-center mb-2 sm:mb-4 flex-1">
                      {design.name}
                    </h3>

                    <button
                      onClick={() => onSelectDesign(design.name)}
                      className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-2 px-2 sm:py-3 sm:px-4 rounded-lg sm:rounded-xl flex items-center justify-center gap-1 sm:gap-2 transition-colors shadow-sm text-xs sm:text-base"
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 fill-current">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      Pedir diseño
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default function CatalogoEtiquetas() {
  const [searchQuery, setSearchQuery] = useState('');
  // El filtro real usa este valor con un pequeño retraso, para no re-renderizar
  // la cuadrícula completa en cada tecla mientras se escribe rápido.
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'personajes' | 'siluetas_nina' | 'siluetas_nino'>('personajes');

  const [selectedDesign, setSelectedDesign] = useState<string | null>(null);
  // Paso 1: paquete (elegido antes de navegar el catálogo de personajes)
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [wantsLaminado, setWantsLaminado] = useState(false);
  const [highlightPackages, setHighlightPackages] = useState(false);

  const packageSectionRef = useRef<HTMLDivElement>(null);
  const catalogSectionRef = useRef<HTMLDivElement>(null);

  const selectedPackage = useMemo(
    () => PACKAGES.find(p => p.id === selectedPackageId) || null,
    [selectedPackageId]
  );
  const laminadoCost = wantsLaminado && selectedPackage?.laminadoPrice ? selectedPackage.laminadoPrice : 0;

  useEffect(() => {
    if (selectedPackageId) {
      catalogSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedPackageId]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 150);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const filteredDesigns = useMemo(() => {
    return mockData.filter(design => {
      const designCategory = design.category || 'personajes';
      const matchesCategory = designCategory === activeTab;
      const matchesSearch = design.name.toLowerCase().includes(debouncedQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [debouncedQuery, activeTab]);

  // Estable entre renders (useCallback) para que DesignGrid, memoizado, no
  // se re-renderice solo porque el componente padre cambió de estado.
  const handleOpenModal = useCallback((designName: string) => {
    if (!selectedPackageId) {
      setHighlightPackages(true);
      packageSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => setHighlightPackages(false), 1600);
      return;
    }
    setSelectedDesign(designName);
  }, [selectedPackageId]);

  const handleCloseModal = () => {
    setSelectedDesign(null);
  };

  const handleCompleteOrder = () => {
    setSelectedDesign(null);
    setSelectedPackageId(null);
    setWantsLaminado(false);
    setSearchQuery('');
    setActiveTab('personajes');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPackage = (packageId: string) => {
    setSelectedPackageId(packageId);
    setWantsLaminado(false);
  };


  return (
    <div 
      className="min-h-screen flex flex-col font-['Fredoka',_sans-serif] relative overflow-hidden"
      style={{
        backgroundColor: '#ffffff',
        backgroundImage: 'linear-gradient(#bae6fd 1px, transparent 1px), linear-gradient(90deg, #bae6fd 1px, transparent 1px)',
        backgroundSize: '30px 30px',
        backgroundPosition: 'center top'
      }}
    >
      <BackgroundDecorations />

      {/* Hero Section */}
      <header className="relative bg-white/70 backdrop-blur-md shadow-sm border-b-4 border-yellow-400 z-10">
        <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 tracking-tight drop-shadow-sm mb-3">
            🎒 Catálogo de Etiquetas 2026 🖍️
          </h1>
          <p className="text-center text-purple-600 font-bold text-xl sm:text-2xl mb-4">🍎 ¡Arma el kit perfecto para el regreso a clases!</p>

          {/* Ilustración decorativa del hero */}
          <div className="flex justify-center gap-6 sm:gap-10 py-4 mb-2">
            <div className="flex flex-col items-center gap-1">
              <span className="text-4xl sm:text-5xl">✏️</span>
              <span className="text-[10px] sm:text-xs text-purple-400 font-medium">Lápices</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-4xl sm:text-5xl">📓</span>
              <span className="text-[10px] sm:text-xs text-pink-400 font-medium">Libretas</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-4xl sm:text-5xl">🎒</span>
              <span className="text-[10px] sm:text-xs text-cyan-400 font-medium">Mochilas</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-4xl sm:text-5xl">💧</span>
              <span className="text-[10px] sm:text-xs text-blue-400 font-medium">Lavables</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-4xl sm:text-5xl">🎨</span>
              <span className="text-[10px] sm:text-xs text-pink-400 font-medium">Diseños</span>
            </div>
          </div>

          {/* Franja de confianza */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-2">
            <div className="flex items-center gap-1.5 bg-purple-50 border border-purple-200 rounded-full px-3 py-1.5 text-xs sm:text-sm text-purple-700 font-medium">
              <span>🎨</span> 282 diseños
            </div>
            <div className="flex items-center gap-1.5 bg-pink-50 border border-pink-200 rounded-full px-3 py-1.5 text-xs sm:text-sm text-pink-700 font-medium">
              <span>🚚</span> Envíos a todo México
            </div>
            <div className="flex items-center gap-1.5 bg-cyan-50 border border-cyan-200 rounded-full px-3 py-1.5 text-xs sm:text-sm text-cyan-700 font-medium">
              <span>⭐</span> 100% personalizado
            </div>
            <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-full px-3 py-1.5 text-xs sm:text-sm text-blue-700 font-medium">
              <span>💧</span> 100% lavables
            </div>
          </div>

          {/* Paso 1: Elegir paquete */}
          <div
            ref={packageSectionRef}
            className={`mt-8 relative p-4 sm:p-8 rounded-3xl transition-shadow bg-white/50 backdrop-blur-sm border-2 border-dashed border-purple-200 overflow-hidden shadow-sm ${highlightPackages ? 'ring-4 ring-blue-400' : ''}`}
          >
            {/* Elementos decorativos del paquete */}
            <div className="absolute top-4 right-4 sm:right-10 text-gray-800 opacity-60 rotate-12 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13" />
                <path d="M22 2L15 22L11 13L2 9L22 2z" />
              </svg>
            </div>
            <div className="absolute -top-4 -left-4 text-purple-400 opacity-60 -rotate-12 pointer-events-none">
               <svg viewBox="0 0 100 100" width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                 <path d="M 10,90 Q 30,10 60,50 T 110,10" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="6 6" strokeLinecap="round" />
               </svg>
            </div>
            <div className="absolute bottom-10 right-1/4 text-yellow-400 opacity-80 pointer-events-none rotate-45">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>

            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-purple-600 mb-1 flex items-center gap-2">
                <span className="bg-purple-500 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-lg sm:text-xl shadow-md">1</span> 
                Elige tu paquete
              </h2>
              <p className="text-sm sm:text-base font-semibold text-purple-400 mb-6 ml-10 sm:ml-12">Toca una imagen para ver el ejemplo real de cada paquete.</p>

            {!selectedPackage ? (
              <>
                <div className="mb-8">
                  <p className="text-sm sm:text-base font-bold text-pink-500 uppercase tracking-wider mb-3 ml-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-pink-400"></span>
                    Etiquetas Adhesivas
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                    {PACKAGES.filter(p => p.material === 'Etiquetas Adhesivas').map(pkg => (
                      <button
                        key={pkg.id}
                        type="button"
                        onClick={() => handleSelectPackage(pkg.id)}
                        className="text-left border-4 border-transparent hover:border-pink-300 rounded-3xl overflow-hidden bg-white/90 backdrop-blur-md transition-all transform hover:-translate-y-1 shadow-md hover:shadow-xl hover:shadow-pink-500/20 group"
                      >
                        <div className="h-60 sm:h-72 bg-[#fdf2f8] flex items-center justify-center overflow-hidden relative">
                          {pkg.popular && (
                            <span className="absolute top-2 left-2 z-10 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
                              {pkg.popularLabel}
                            </span>
                          )}
                          <img
                            src={pkg.previewImage}
                            alt={`Ejemplo del paquete ${pkg.tier || pkg.label}`}
                            className="w-full h-full object-contain scale-110 group-hover:scale-125 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                        <div className="p-3 sm:p-4">
                          <p className="text-sm sm:text-lg font-bold text-purple-700">{pkg.tier || pkg.label}</p>
                          <p className="text-base sm:text-xl text-pink-500 font-extrabold">${pkg.price}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm sm:text-base font-bold text-cyan-500 uppercase tracking-wider mb-3 ml-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    Especiales (DTF UV / Textiles)
                  </p>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-md">
                    {PACKAGES.filter(p => p.material === 'DTF UV' || p.material === 'Textiles').map(pkg => (
                      <button
                        key={pkg.id}
                        type="button"
                        onClick={() => handleSelectPackage(pkg.id)}
                        className="text-left border-4 border-transparent hover:border-cyan-300 rounded-3xl overflow-hidden bg-white/90 backdrop-blur-md transition-all transform hover:-translate-y-1 shadow-md hover:shadow-xl hover:shadow-cyan-500/20 group"
                      >
                        <div className="h-60 sm:h-72 bg-[#f0fdfa] flex items-center justify-center overflow-hidden relative">
                          {pkg.popular && (
                            <span className="absolute top-2 left-2 z-10 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
                              {pkg.popularLabel}
                            </span>
                          )}
                          <img
                            src={pkg.previewImage}
                            alt={`Ejemplo del paquete ${pkg.tier || pkg.label}`}
                            className="w-full h-full object-contain scale-110 group-hover:scale-125 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                        <div className="p-3 sm:p-4">
                          <p className="text-sm sm:text-lg font-bold text-purple-700">{pkg.tier || pkg.label}</p>
                          <p className="text-base sm:text-xl text-pink-500 font-extrabold">${pkg.price}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white/80 backdrop-blur-sm border-2 border-pink-200 shadow-md rounded-3xl p-4 sm:p-6 mt-4">
                <img
                  src={selectedPackage.previewImage}
                  alt={`Paquete elegido: ${selectedPackage.label}`}
                  className="w-28 h-36 object-cover rounded-2xl flex-shrink-0 mx-auto sm:mx-0 shadow-sm border border-gray-100"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-lg sm:text-xl font-extrabold text-purple-700">{selectedPackage.tier || selectedPackage.label} · <span className="text-pink-500">${selectedPackage.price}</span></p>
                  <ul className="text-sm text-gray-600 list-disc list-inside space-y-1 mt-2 font-medium">
                    {selectedPackage.includes.map(item => <li key={item}>{item}</li>)}
                  </ul>
                  {selectedPackage.laminadoPrice && (
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mt-4 cursor-pointer bg-pink-50 p-3 rounded-xl border border-pink-100 hover:bg-pink-100 transition-colors w-max">
                      <input
                        type="checkbox"
                        checked={wantsLaminado}
                        onChange={(e) => setWantsLaminado(e.target.checked)}
                        className="w-5 h-5 rounded text-pink-500 focus:ring-pink-400"
                      />
                      Agregar laminado (+${selectedPackage.laminadoPrice})
                    </label>
                  )}
                </div>
                <button
                  onClick={() => setSelectedPackageId(null)}
                  className="text-sm sm:text-base font-bold text-white bg-purple-400 hover:bg-purple-500 py-2 px-4 rounded-full flex-shrink-0 self-start sm:self-center shadow-md transition-colors"
                >
                  Cambiar paquete
                </button>
              </div>
            )}
            </div>
          </div>

          {/* Paso 2: Elegir personaje */}
          <div ref={catalogSectionRef} className="mt-10 scroll-mt-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-cyan-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg shadow-md">2</span>
              <h2 className="text-xl font-bold text-gray-900">🎨 ¡Elige el diseño que más le guste!</h2>
            </div>
            <p className="text-sm text-gray-500 mb-4 ml-10">Busca entre cientos de personajes, siluetas y estilos.</p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder='¿Buscas a Bluey, Stitch, Mario Bros, Among Us...?'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 border-2 border-purple-200 rounded-2xl text-lg focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all shadow-sm outline-none bg-white placeholder:text-gray-400"
              />
            </div>

            {/* Tabs */}
            <div className="mt-8 flex justify-start sm:justify-center gap-2 sm:gap-4 flex-nowrap overflow-x-auto pb-4 snap-x no-scrollbar">
              <button
                onClick={() => setActiveTab('personajes')}
                className={`flex-shrink-0 px-4 sm:px-6 py-2.5 rounded-full font-bold text-sm sm:text-base transition-all transform hover:scale-105 snap-center ${
                  activeTab === 'personajes'
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-white text-gray-500 border-2 border-purple-100 hover:border-purple-300'
                }`}
              >
                Personajes
              </button>
              <button
                onClick={() => setActiveTab('siluetas_nina')}
                className={`flex-shrink-0 px-4 sm:px-6 py-2.5 rounded-full font-bold text-sm sm:text-base transition-all transform hover:scale-105 snap-center ${
                  activeTab === 'siluetas_nina'
                    ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30'
                    : 'bg-white text-gray-500 border-2 border-pink-100 hover:border-pink-300'
                }`}
              >
                Siluetas Niñas
              </button>
              <button
                onClick={() => setActiveTab('siluetas_nino')}
                className={`flex-shrink-0 px-4 sm:px-6 py-2.5 rounded-full font-bold text-sm sm:text-base transition-all transform hover:scale-105 snap-center ${
                  activeTab === 'siluetas_nino'
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-white text-gray-500 border-2 border-blue-100 hover:border-blue-300'
                }`}
              >
                Siluetas Niños
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full">
        <DesignGrid designs={filteredDesigns} activeTab={activeTab} onSelectDesign={handleOpenModal} whatsappNumber={WHATSAPP_NUMBER} />

        {/* Banner: ¿no viste tu personaje? */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 bg-purple-50 border border-purple-200 rounded-2xl px-6 py-4 text-sm text-purple-800">
            <span className="text-xl">✨</span>
            <span>¿Buscas un personaje que no viste? Te lo diseñamos sin costo extra.</span>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('¡Hola! Busco un personaje que no vi en el catálogo, ¿me lo pueden diseñar?')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold px-4 py-2 rounded-xl transition-colors shadow-sm text-xs"
            >💬 Escríbenos</a>
          </div>
        </div>
      </main>

      {/* Footer personalizado */}
      <footer className="bg-white border-t-4 border-yellow-400 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Col 1 — Marca */}
          <div>
            <h3 className="text-xl font-extrabold bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 bg-clip-text text-transparent mb-3">
              🎒 Etiquetas Escolares 2026
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Etiquetas 100% personalizadas y lavables para que los útiles de tus peques
              siempre regresen a casa. Diseños únicos, material de calidad y envíos a todo México.
            </p>
            <p className="text-xs text-gray-400 mt-4 italic">
              Hecho con ❤️ para los peques del hogar
            </p>
          </div>

          {/* Col 2 — Contacto */}
          <div>
            <h4 className="text-gray-900 font-bold mb-4 uppercase tracking-wider text-xs">Contacto</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-sm">💬</span>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="hover:text-green-600 transition-colors">
                  WhatsApp: {WHATSAPP_NUMBER}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-sm">📦</span>
                Envíos a toda la República Mexicana
              </li>
              <li className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 text-sm">🎨</span>
                Diseños personalizados sin costo extra
              </li>
            </ul>
          </div>

          {/* Col 3 — Horario / Extra */}
          <div>
            <h4 className="text-gray-900 font-bold mb-4 uppercase tracking-wider text-xs">Pedidos</h4>
            <p className="text-gray-500 text-sm leading-relaxed">
              Recibimos pedidos todo el año. Elige tu paquete, selecciona tu diseño
              favorito y recibe tus etiquetas directamente en casa. ¡Sin complicaciones!
            </p>
            <p className="text-xs text-gray-400 mt-4">
              &copy; {new Date().getFullYear()} Etiquetas Escolares. Todos los derechos reservados.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-100 py-4 text-center">
          <p className="text-[10px] text-gray-400 tracking-wider">
            Diseñado por IMAGINE &amp; STAMP
          </p>
        </div>
      </footer>

      {/* Modal de Pedido */}
      <AnimatePresence>
        {selectedDesign && selectedPackage && (
          <OrderModal
            design={selectedDesign}
            pkg={selectedPackage}
            laminadoCost={laminadoCost}
            whatsappNumber={WHATSAPP_NUMBER}
            onClose={handleCloseModal}
            onComplete={handleCompleteOrder}
          />
        )}
      </AnimatePresence>

      {/* WhatsApp flotante */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('¡Hola! Tengo una duda sobre las etiquetas escolares 🙋')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#128C7E] text-white w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-lg shadow-green-500/30 hover:shadow-green-500/50 flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
        aria-label="Chatea por WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 sm:w-8 sm:h-8 fill-current">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
        </svg>
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          ¿Dudas? Te ayudamos
        </span>
      </a>
    </div>
  );
}
