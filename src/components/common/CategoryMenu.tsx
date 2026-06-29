import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { siteConfig } from '../../config/siteConfig';

interface CategoryMenuProps {
  isCategoryOpen: boolean;
  setIsCategoryOpen: (open: boolean) => void;
  activeCategory: string | 'all';
  setActiveCategory: (cat: string | 'all') => void;
  activeBadgeFilter: string | null;
  setActiveBadgeFilter: (badge: string | null) => void;
}

export const CategoryMenu: React.FC<CategoryMenuProps> = ({
  isCategoryOpen,
  setIsCategoryOpen,
  activeCategory,
  setActiveCategory,
  activeBadgeFilter,
  setActiveBadgeFilter,
}) => {
  const { THEME, BADGES, CATEGORIES } = siteConfig;

  // Utilidad simple para agregar opacidad a un HEX (ej. "#FF6A00" + "26" para 15%)
  const primaryBgAlpha = `${THEME.primaryColor}26`; // 15% opacity approx

  return (
    <AnimatePresence>
      {isCategoryOpen && (
        <motion.div
          key="cat-grid"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          style={{ overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div style={{
            background: THEME.bgColor,
            padding: '12px',
            maxHeight: 'calc(100vh - 180px)',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: THEME.secondaryColor }}>Filtros</h3>
              {(activeCategory !== 'all' || activeBadgeFilter !== null) && (
                <button 
                  onClick={() => { setActiveCategory('all'); setActiveBadgeFilter(null); setIsCategoryOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ background: 'none', border: 'none', color: THEME.primaryColor, fontSize: '12px', fontWeight: 700, cursor: 'pointer', marginRight: '16px' }}
                >
                  Limpiar filtros
                </button>
              )}
            </div>

            {BADGES.length > 0 && (
              <>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Destacados</h4>
                <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '4px', marginBottom: '14px', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '2px' }}>
                  {BADGES.map(badge => (
                    <button
                      key={badge.id}
                      onClick={() => {
                        setActiveBadgeFilter(activeBadgeFilter === badge.id ? null : badge.id);
                        setIsCategoryOpen(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      style={{
                        flexShrink: 0,
                        display: 'flex', alignItems: 'center', gap: '4px',
                        padding: '5px 8px', borderRadius: '50px',
                        background: activeBadgeFilter === badge.id ? primaryBgAlpha : 'rgba(255,255,255,0.05)',
                        border: activeBadgeFilter === badge.id ? `1px solid ${THEME.primaryColor}` : '1px solid rgba(255,255,255,0.1)',
                        color: activeBadgeFilter === badge.id ? THEME.primaryColor : THEME.secondaryColor,
                        fontSize: '10px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
                      }}
                    >
                      <span style={{ fontSize: '12px' }}>{badge.emoji}</span> {badge.label}
                    </button>
                  ))}
                </div>
              </>
            )}

            <h4 style={{ margin: '0 0 8px 0', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Categorías</h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '8px',
            }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setIsCategoryOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: '4px', padding: '10px 4px',
                    borderRadius: '12px',
                    border: activeCategory === cat.id ? `1.5px solid ${THEME.primaryColor}` : '1px solid rgba(255,255,255,0.08)',
                    background: activeCategory === cat.id ? primaryBgAlpha : 'rgba(255,255,255,0.03)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ fontSize: '22px' }}>{cat.emoji}</span>
                  <span style={{
                    fontSize: '10px', fontWeight: 700, textAlign: 'center',
                    color: activeCategory === cat.id ? THEME.primaryColor : 'rgba(255,255,255,0.75)',
                    lineHeight: 1.1,
                  }}>
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
