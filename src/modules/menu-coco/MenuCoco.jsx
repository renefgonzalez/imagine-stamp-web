import { useState, useEffect } from 'react';

// ──────────────────────────────────────────────────────────────
//  Módulo AISLADO: Agua de Coco 100% Natural
//  No comparte estado ni variables con otros módulos del proyecto.
// ──────────────────────────────────────────────────────────────

const WHATSAPP_NUMBER = '523328199159';

// Catálogo local (base de datos del módulo)
const PRODUCTOS = [
  { id: 'medio-litro', nombre: 'Medio Litro', detalle: '500 ml bien frío', precio: 30 },
  { id: 'litro', nombre: 'Litro', detalle: '1 litro para compartir', precio: 50 },
  { id: 'galon', nombre: 'Galón (4 litros)', detalle: 'Rinde para toda la familia', precio: 180 },
];

const formatoMXN = (n) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n);

export default function MenuCoco() {
  // Estado del carrito: { [id]: cantidad }
  const [cart, setCart] = useState({});
  const [form, setForm] = useState({
    nombre: '',
    direccion: '',
    metodoPago: 'Efectivo',
    notas: '',
  });

  // Metadatos dinámicos
  useEffect(() => {
    const prev = document.title;
    document.title = 'Agua de Coco | 100% Natural';
    return () => {
      document.title = prev;
    };
  }, []);

  const addItem = (id) =>
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));

  const removeItem = (id) =>
    setCart((c) => {
      const cant = (c[id] || 0) - 1;
      const next = { ...c };
      if (cant <= 0) delete next[id];
      else next[id] = cant;
      return next;
    });

  const lineas = PRODUCTOS
    .filter((p) => cart[p.id] > 0)
    .map((p) => ({ ...p, cantidad: cart[p.id], importe: cart[p.id] * p.precio }));

  const subtotal = lineas.reduce((acc, l) => acc + l.importe, 0);
  const totalItems = lineas.reduce((acc, l) => acc + l.cantidad, 0);

  // Envío gratis al incluir un Galón (4 litros)
  const envioGratis = (cart['galon'] || 0) >= 1;

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const enviarPedido = () => {
    if (lineas.length === 0) {
      alert('Agrega al menos un producto a tu pedido 🥥');
      return;
    }
    if (!form.nombre.trim() || !form.direccion.trim()) {
      alert('Por favor completa tu nombre y dirección de entrega.');
      return;
    }

    const resumen = lineas
      .map((l) => `• ${l.cantidad}x ${l.nombre} — ${formatoMXN(l.importe)}`)
      .join('%0A');

    const envioTexto = envioGratis
      ? 'ENVÍO GRATIS 🍃 (incluye Galón)'
      : 'Envío con costo extra (compra menor a un Galón)';

    const mensaje =
      `¡Hola! 🥥 Quiero hacer un pedido de Agua de Coco 100%25 Natural:` +
      `%0A%0A` +
      `*Resumen del pedido:*%0A${resumen}` +
      `%0A%0A*Subtotal:* ${formatoMXN(subtotal)}` +
      `%0A*Envío:* ${envioTexto}` +
      `%0A%0A*Método de pago:* ${form.metodoPago}` +
      `%0A%0A*Datos de entrega:*` +
      `%0ANombre: ${form.nombre}` +
      `%0ADirección: ${form.direccion}` +
      (form.notas.trim() ? `%0ANotas: ${form.notas}` : '') +
      `%0A%0A_Recordatorio: mantener el producto frío 🌡️_`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-stone-50 text-green-950">
      {/* ── Encabezado ── */}
      <header className="bg-green-900 text-white">
        <div className="max-w-4xl mx-auto px-6 py-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Agua de Coco <span className="text-green-400">100% Natural</span> 🥥
          </h1>
          <p className="mt-2 text-green-100 text-sm md:text-base">
            Lo natural siempre es mejor. Fresca, sin azúcares añadidos.
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* ── Catálogo ── */}
        <section>
          <h2 className="text-xl font-bold text-green-900 mb-4">Nuestros productos</h2>
          <div className="space-y-4">
            {PRODUCTOS.map((p) => {
              const cant = cart[p.id] || 0;
              return (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-green-100 shadow-sm p-5 flex items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="font-bold text-green-900">{p.nombre}</h3>
                    <p className="text-sm text-stone-500">{p.detalle}</p>
                    <p className="mt-1 text-lg font-extrabold text-green-500">
                      {formatoMXN(p.precio)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => removeItem(p.id)}
                      disabled={cant === 0}
                      aria-label={`Quitar ${p.nombre}`}
                      className="w-9 h-9 rounded-full bg-green-100 text-green-900 font-bold text-lg flex items-center justify-center hover:bg-green-200 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-bold tabular-nums">{cant}</span>
                    <button
                      onClick={() => addItem(p.id)}
                      aria-label={`Agregar ${p.nombre}`}
                      className="w-9 h-9 rounded-full bg-green-900 text-white font-bold text-lg flex items-center justify-center hover:bg-green-800 transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Carrito + Checkout ── */}
        <aside className="lg:sticky lg:top-6 h-fit space-y-4">
          {/* Banners de promoción */}
          <div className="space-y-2">
            <div className="bg-green-500 text-green-950 font-bold rounded-xl px-4 py-3 text-center shadow-sm">
              En la compra de 4 Litros (Galón) ENVÍO GRATIS 🍃
            </div>
            <p className="text-xs text-center text-stone-500">
              Para compras menores, el envío tiene costo extra
            </p>
            <div className="bg-green-900 text-white text-sm rounded-xl px-4 py-2 text-center">
              Importante: Mantenerse frío 🌡️
            </div>
          </div>

          {/* Resumen del carrito */}
          <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-5">
            <h2 className="text-lg font-bold text-green-900 mb-3">
              Tu pedido {totalItems > 0 && <span className="text-green-500">({totalItems})</span>}
            </h2>

            {lineas.length === 0 ? (
              <p className="text-sm text-stone-400 py-4 text-center">
                Tu carrito está vacío 🥥
              </p>
            ) : (
              <ul className="space-y-2 mb-4">
                {lineas.map((l) => (
                  <li key={l.id} className="flex justify-between text-sm">
                    <span className="text-stone-600">
                      {l.cantidad}× {l.nombre}
                    </span>
                    <span className="font-semibold text-green-900">
                      {formatoMXN(l.importe)}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <div className="border-t border-green-100 pt-3 flex justify-between items-center">
              <span className="font-bold text-green-900">Subtotal</span>
              <span className="text-xl font-extrabold text-green-500">
                {formatoMXN(subtotal)}
              </span>
            </div>
            {envioGratis && (
              <p className="mt-2 text-xs font-semibold text-green-600 text-center">
                ¡Felicidades! Tu pedido incluye ENVÍO GRATIS 🍃
              </p>
            )}
          </div>

          {/* Formulario de checkout */}
          <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-5 space-y-3">
            <h2 className="text-lg font-bold text-green-900">Datos de entrega</h2>

            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Nombre"
              className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="text"
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              placeholder="Dirección de entrega"
              className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <select
              name="metodoPago"
              value={form.metodoPago}
              onChange={handleChange}
              className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="Efectivo">Efectivo</option>
              <option value="Transferencia">Transferencia</option>
            </select>
            <textarea
              name="notas"
              value={form.notas}
              onChange={handleChange}
              placeholder="Notas adicionales (opcional)"
              rows={2}
              className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <button
              onClick={enviarPedido}
              className="w-full bg-green-900 hover:bg-green-800 text-white font-bold py-3 rounded-xl transition shadow-md"
            >
              Enviar pedido por WhatsApp 🍃
            </button>
          </div>
        </aside>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-green-900 text-white mt-8">
        <div className="max-w-4xl mx-auto px-6 py-10 grid gap-8 sm:grid-cols-3">
          <div>
            <h3 className="font-bold text-green-400 mb-3">Visítanos</h3>
            <p className="text-sm text-green-100">
              Av. Siempre Fresca #123,<br />
              Col. Las Palmas,<br />
              Guadalajara, Jal.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-green-400 mb-3">Contacto</h3>
            <p className="text-sm text-green-100">
              Tel: 332 819 9159<br />
              Pedidos por WhatsApp
            </p>
          </div>
          <div>
            <h3 className="font-bold text-green-400 mb-3">Síguenos</h3>
            <ul className="text-sm text-green-100 space-y-1">
              <li><a href="#" className="hover:text-green-400 transition">Facebook</a></li>
              <li><a href="#" className="hover:text-green-400 transition">Instagram</a></li>
              <li><a href="#" className="hover:text-green-400 transition">TikTok</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-green-800">
          <p className="max-w-4xl mx-auto px-6 py-4 text-center text-sm text-green-200 italic">
            Lo natural siempre es mejor. Disfruta lo natural, disfruta lo fresco.
          </p>
        </div>
      </footer>
    </div>
  );
}
