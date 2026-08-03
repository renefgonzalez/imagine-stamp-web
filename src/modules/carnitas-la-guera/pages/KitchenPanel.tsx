import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChefHat, Printer, CheckCircle2, Trash2, Clock,
  Phone, MapPin, User, ArrowLeft, UtensilsCrossed,
  Flame, ShoppingBag, Coffee, AlertCircle, RotateCcw
} from 'lucide-react';
import { clientConfig } from '../config';
import {
  KitchenOrder,
  loadOrders,
  saveOrders,
  formatTime,
  printKitchenTicket,
} from '../utils/kitchenOrders';

const C = clientConfig.colors;

function categoryIcon(category: string) {
  switch (category) {
    case 'carnitas': return <Flame size={14} />;
    case 'guisados': return <ChefHat size={14} />;
    case 'menudo': return <UtensilsCrossed size={14} />;
    case 'bebidas': return <Coffee size={14} />;
    default: return <ShoppingBag size={14} />;
  }
}

export default function KitchenPanel() {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'ready' | 'delivered'>('pending');
  const [justArrived, setJustArrived] = useState<string | null>(null);

  useEffect(() => {
    setOrders(loadOrders());

    const handleStorage = () => {
      const latest = loadOrders();
      setOrders(prev => {
        const newIds = latest.filter(o => !prev.some(p => p.id === o.id) && o.status === 'pending').map(o => o.id);
        if (newIds.length > 0) {
          setJustArrived(newIds[0]);
          setTimeout(() => setJustArrived(null), 4000);
        }
        return latest;
      });
    };

    window.addEventListener('storage', handleStorage);
    const interval = setInterval(handleStorage, 3000);
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  const filteredOrders = useMemo(() => {
    if (filter === 'all') return orders;
    return orders.filter(o => o.status === filter);
  }, [orders, filter]);

  const stats = useMemo(() => ({
    pending: orders.filter(o => o.status === 'pending').length,
    ready: orders.filter(o => o.status === 'ready').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    totalSales: orders.filter(o => o.status !== 'delivered').reduce((s, o) => s + o.total, 0),
  }), [orders]);

  const updateStatus = (id: string, status: KitchenOrder['status']) => {
    const next = orders.map(o => (o.id === id ? { ...o, status } : o));
    setOrders(next);
    saveOrders(next);
  };

  const removeOrder = (id: string) => {
    const next = orders.filter(o => o.id !== id);
    setOrders(next);
    saveOrders(next);
  };

  const clearDelivered = () => {
    const next = orders.filter(o => o.status !== 'delivered');
    setOrders(next);
    saveOrders(next);
  };

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: C.bg, color: C.textPrimary }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-xl border-b" style={{ backgroundColor: '#FFFBF7ee', borderColor: '#E8A33D40' }}>
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: C.primary }}>
                <ChefHat size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-base font-extrabold tracking-tight" style={{ color: C.primary }}>
                  Panel de Cocina
                </h1>
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: C.textSecondary }}>
                  Carnitas y Gorditas La Güera
                </p>
              </div>
            </div>
            <a
              href="/#/carnitas-la-guera"
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border"
              style={{ borderColor: '#E8A33D50', color: C.textSecondary }}
            >
              <ArrowLeft size={14} /> Menú
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {[
              { label: 'Pendientes', value: stats.pending, color: C.primary },
              { label: 'Listos', value: stats.ready, color: C.secondary },
              { label: 'Entregados', value: stats.delivered, color: C.gold },
              { label: 'Venta activa', value: `$${stats.totalSales}`, color: C.accent },
            ].map(stat => (
              <div key={stat.label} className="rounded-2xl p-2.5 text-center border bg-white" style={{ borderColor: '#E8A33D20' }}>
                <div className="text-lg font-extrabold" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-[9px] font-bold uppercase tracking-wider" style={{ color: C.textSecondary }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex gap-2 mt-3 overflow-x-auto hide-scrollbar pb-1">
            {[
              { id: 'pending', label: 'Pendientes' },
              { id: 'ready', label: 'Listos' },
              { id: 'delivered', label: 'Entregados' },
              { id: 'all', label: 'Todos' },
            ].map(f => {
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id as any)}
                  className="px-4 py-2 rounded-full text-[11px] font-extrabold uppercase tracking-wider whitespace-nowrap transition-all"
                  style={{
                    backgroundColor: active ? C.primary : '#fff',
                    color: active ? '#fff' : C.textPrimary,
                    border: `1px solid ${active ? C.primary : '#E8A33D40'}`,
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* New order toast */}
      <AnimatePresence>
        {justArrived && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-white font-bold text-sm"
            style={{ backgroundColor: C.accent }}
          >
            <AlertCircle size={18} />
            ¡Nuevo pedido recibido!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Orders list */}
      <main className="max-w-5xl mx-auto px-4 py-5 pb-32">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#E8A33D15' }}>
              <ChefHat size={32} style={{ color: C.gold }} />
            </div>
            <h2 className="text-lg font-extrabold mb-1" style={{ color: C.textPrimary }}>Sin pedidos {filter === 'pending' ? 'pendientes' : ''}</h2>
            <p className="text-xs" style={{ color: C.textSecondary }}>
              Los pedidos que envíen los clientes por WhatsApp aparecerán aquí automáticamente.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {filteredOrders.map(order => (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="rounded-3xl border bg-white overflow-hidden shadow-sm"
                  style={{ borderColor: order.status === 'pending' ? `${C.primary}50` : '#E8A33D30' }}
                >
                  {/* Card header */}
                  <div className="px-5 py-4 border-b flex items-start justify-between" style={{ borderColor: '#E8A33D20', backgroundColor: order.status === 'pending' ? `${C.primary}08` : '#fff' }}>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-white border" style={{ borderColor: '#E8A33D40', color: C.primary }}>
                          #{order.id}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1" style={{ color: C.textSecondary }}>
                          <Clock size={10} /> {formatTime(order.createdAt)}
                        </span>
                      </div>
                      <div className="text-sm font-extrabold flex items-center gap-1" style={{ color: C.textPrimary }}>
                        <User size={14} style={{ color: C.primary }} /> {order.customer.name || 'Sin nombre'}
                      </div>
                    </div>
                    <div
                      className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: order.status === 'pending' ? `${C.primary}15` : order.status === 'ready' ? `${C.secondary}15` : `${C.gold}15`,
                        color: order.status === 'pending' ? C.primary : order.status === 'ready' ? C.secondary : C.gold,
                      }}
                    >
                      {order.status === 'pending' ? 'Pendiente' : order.status === 'ready' ? 'Listo' : 'Entregado'}
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="px-5 py-4 space-y-3">
                    <div className="flex flex-wrap gap-2 text-[10px] font-bold" style={{ color: C.textSecondary }}>
                      <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-zinc-50 border" style={{ borderColor: '#E8A33D20' }}>
                        <Phone size={10} /> {order.customer.phone || '—'}
                      </span>
                      <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-zinc-50 border" style={{ borderColor: '#E8A33D20' }}>
                        <MapPin size={10} /> {order.customer.deliveryMethod === 'recoger' ? 'Recoger' : 'Domicilio'}
                      </span>
                    </div>

                    {order.customer.deliveryMethod === 'domicilio' && order.customer.address && (
                      <div className="text-[11px] font-semibold p-2.5 rounded-xl bg-zinc-50 border" style={{ borderColor: '#E8A33D20', color: C.textPrimary }}>
                        <span style={{ color: C.textSecondary }}>Dirección:</span> {order.customer.address}
                      </div>
                    )}

                    {/* Items */}
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={`${item.id}-${idx}`} className="flex items-start gap-3 p-2.5 rounded-xl border" style={{ borderColor: '#E8A33D20' }}>
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white" style={{ backgroundColor: C.primary }}>
                            {categoryIcon(item.category)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline justify-between gap-2">
                              <p className="text-sm font-extrabold truncate" style={{ color: C.textPrimary }}>
                                {item.name}
                              </p>
                              <span className="text-sm font-extrabold shrink-0" style={{ color: C.primary }}>
                                x{item.quantity}
                              </span>
                            </div>
                            {item.guiso && (
                              <p className="text-[10px] font-semibold" style={{ color: C.secondary }}>
                                Guiso: {item.guiso}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {order.customer.salsas.length > 0 && (
                      <div className="text-[11px] font-semibold p-2.5 rounded-xl bg-amber-50 border" style={{ borderColor: '#E8A33D30', color: C.textPrimary }}>
                        <span style={{ color: C.textSecondary }}>Salsas:</span> {order.customer.salsas.join(', ')}
                      </div>
                    )}

                    {order.customer.notes && (
                      <div className="text-[11px] font-bold p-2.5 rounded-xl bg-red-50 border" style={{ borderColor: '#E85D7530', color: C.textPrimary }}>
                        <span style={{ color: C.accent }}>Nota:</span> {order.customer.notes}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs font-bold" style={{ color: C.textSecondary }}>Total</span>
                      <span className="text-lg font-extrabold" style={{ color: C.primary }}>${order.total} MXN</span>
                    </div>
                  </div>

                  {/* Card actions */}
                  <div className="px-5 py-4 border-t grid grid-cols-2 gap-2" style={{ borderColor: '#E8A33D20' }}>
                    <button
                      onClick={() => printKitchenTicket(order)}
                      className="col-span-2 py-3 rounded-2xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 text-white shadow-lg"
                      style={{ backgroundColor: C.primary }}
                    >
                      <Printer size={16} /> Imprimir Ticket Cocina
                    </button>

                    {order.status === 'pending' && (
                      <button
                        onClick={() => updateStatus(order.id, 'ready')}
                        className="py-3 rounded-2xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1 border"
                        style={{ borderColor: C.secondary, color: C.secondary }}
                      >
                        <CheckCircle2 size={16} /> Listo
                      </button>
                    )}
                    {order.status === 'ready' && (
                      <button
                        onClick={() => updateStatus(order.id, 'delivered')}
                        className="py-3 rounded-2xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1 border"
                        style={{ borderColor: C.gold, color: C.gold }}
                      >
                        <CheckCircle2 size={16} /> Entregado
                      </button>
                    )}
                    {order.status === 'delivered' && (
                      <button
                        onClick={() => updateStatus(order.id, 'pending')}
                        className="py-3 rounded-2xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1 border"
                        style={{ borderColor: C.textSecondary, color: C.textSecondary }}
                      >
                        <RotateCcw size={16} /> Reabrir
                      </button>
                    )}

                    <button
                      onClick={() => removeOrder(order.id)}
                      className="py-3 rounded-2xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1 border border-zinc-200 text-zinc-400 hover:text-red-500 hover:border-red-200 transition-colors"
                    >
                      <Trash2 size={16} /> Borrar
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {stats.delivered > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={clearDelivered}
              className="px-5 py-2.5 rounded-2xl text-[11px] font-bold uppercase tracking-wider border border-zinc-200 text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              Limpiar pedidos entregados ({stats.delivered})
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
