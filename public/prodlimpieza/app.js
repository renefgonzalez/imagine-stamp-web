// =============================================================
// Estado y utilidades
// =============================================================

let datos = null;
let productos = [];
let materiales = [];
let ingredientesUsados = []; // nombres únicos de componentes usados en fórmulas
let compras = []; // lista de compras/pedidos
let comprasHistorial = []; // historial de compras reales para rastrear variación de precios
let historialTablaDisponible = true;

// --- Operación ---
let puntos = [];      // [{id, nombre, ubicacion, activo, creado_en}]
let ventas = [];      // [{id, fecha, punto_id, monto, notas}]
let resurtidos = [];  // [{id, fecha, punto_id, items:[{producto_nombre,kg,costo_kg_unit}], notas}]
let gastos = [];      // [{id, fecha, categoria, descripcion, monto, punto_id}]

// =============================================================
// Supabase: conversores fila <-> objeto
// =============================================================

const IVA = 0.16;

function materialToRow(m) {
  return {
    descripcion: m.descripcion,
    proveedor: m.proveedor || '-',
    funcion: m.funcion || '',
    precio_kg_sin_iva: Number(m.precio_kg_sin_iva) || 0,
    stock_kg: Number(m.stock_kg) || 0,
    stock_infinito: !!m.stock_infinito,
  };
}
function rowToMaterial(r) {
  const pkg = Number(r.precio_kg_sin_iva) || 0;
  return {
    descripcion: r.descripcion,
    proveedor: r.proveedor || '-',
    funcion: r.funcion || '',
    precio_kg_sin_iva: pkg,
    precio_gr_sin_iva: pkg / 1000,
    precio_gr_con_iva: (pkg / 1000) * (1 + IVA),
    stock_kg: Number(r.stock_kg) || 0,
    stock_infinito: !!r.stock_infinito,
  };
}
function productoToRow(p) {
  return {
    nombre: p.nombre,
    pv_publico: Number(p.pv_publico) || 0,
    pv_sugerido: Number(p.pv_sugerido) || 0,
    componentes: p.componentes || [],
  };
}
function rowToProducto(r) {
  return {
    nombre: r.nombre,
    pv_publico: Number(r.pv_publico) || 0,
    pv_sugerido: Number(r.pv_sugerido) || 0,
    componentes: r.componentes || [],
    costo_kg: 0,   // se calcula con recalcularCostosProductos
    ganancia: 0,
  };
}
function puntoToRow(p) {
  return {
    id: p.id,
    nombre: p.nombre,
    ubicacion: p.ubicacion || '',
    activo: p.activo !== false,
    productos_disponibles: p.productos_disponibles || [],
    creado_en: p.creado_en || new Date().toISOString(),
  };
}
function ventaToRow(v) {
  return { id: v.id, fecha: v.fecha, punto_id: v.punto_id || null, monto: Number(v.monto) || 0, notas: v.notas || '' };
}
function resurtidoToRow(r) {
  return { id: r.id, fecha: r.fecha, punto_id: r.punto_id || null, items: r.items || [], notas: r.notas || '' };
}
function gastoToRow(g) {
  return { id: g.id, fecha: g.fecha, categoria: g.categoria || '', descripcion: g.descripcion || '', punto_id: g.punto_id || null, monto: Number(g.monto) || 0 };
}
function compraToRow(c) {
  return { descripcion: c.descripcion, proveedor: c.proveedor || '-', cantidad: Number(c.cantidad) || 0 };
}
function compraHistorialToRow(h) {
  return {
    id: h.id,
    fecha: h.fecha,
    descripcion: h.descripcion,
    proveedor: h.proveedor || '-',
    cantidad_kg: Number(h.cantidad_kg) || 0,
    precio_kg_sin_iva: Number(h.precio_kg_sin_iva) || 0,
    total_sin_iva: Number(h.total_sin_iva) || 0,
    total_con_iva: Number(h.total_con_iva) || 0,
    creado_en: h.creado_en || new Date().toISOString(),
  };
}

async function fetchAllSupabase() {
  const [mat, prod, pt, vt, res, gst, cmp, hist] = await Promise.all([
    sb.from('materiales').select('*').order('descripcion'),
    sb.from('productos').select('*').order('nombre'),
    sb.from('puntos').select('*').order('creado_en'),
    sb.from('ventas').select('*').order('fecha', { ascending: false }),
    sb.from('resurtidos').select('*').order('fecha', { ascending: false }),
    sb.from('gastos').select('*').order('fecha', { ascending: false }),
    sb.from('compras').select('*'),
    sb.from('compras_historial').select('*').order('fecha', { ascending: false }).order('creado_en', { ascending: false }),
  ]);
  for (const r of [mat, prod, pt, vt, res, gst, cmp]) {
    if (r.error) throw new Error('Supabase: ' + r.error.message);
  }
  let histData = [];
  if (hist.error) {
    historialTablaDisponible = false;
    histData = JSON.parse(localStorage.getItem('catalogo_compras_historial') || '[]');
  } else {
    historialTablaDisponible = true;
    histData = hist.data || [];
  }
  return {
    materiales: mat.data || [],
    productos: prod.data || [],
    puntos: pt.data || [],
    ventas: vt.data || [],
    resurtidos: res.data || [],
    gastos: gst.data || [],
    compras: cmp.data || [],
    compras_historial: histData,
  };
}

// Migración one-shot: localStorage → Supabase
async function migrarDeLocalStorage() {
  const localDatos = JSON.parse(localStorage.getItem('catalogo_datos') || 'null');
  const localPuntos = JSON.parse(localStorage.getItem('catalogo_puntos') || '[]');
  const localVentas = JSON.parse(localStorage.getItem('catalogo_ventas') || '[]');
  const localResurt = JSON.parse(localStorage.getItem('catalogo_resurtidos') || '[]');
  const localGastos = JSON.parse(localStorage.getItem('catalogo_gastos') || '[]');
  const localCompras = JSON.parse(localStorage.getItem('catalogo_compras') || '[]');

  if (localDatos?.materiales?.length) {
    const { error } = await sb.from('materiales').upsert(localDatos.materiales.map(materialToRow));
    if (error) throw new Error('Migrar materiales: ' + error.message);
  }
  if (localDatos?.productos?.length) {
    const { error } = await sb.from('productos').upsert(localDatos.productos.map(productoToRow));
    if (error) throw new Error('Migrar productos: ' + error.message);
  }
  if (localPuntos.length) {
    const { error } = await sb.from('puntos').upsert(localPuntos.map(puntoToRow));
    if (error) throw new Error('Migrar puntos: ' + error.message);
  }
  if (localVentas.length) {
    const { error } = await sb.from('ventas').upsert(localVentas.map(ventaToRow));
    if (error) throw new Error('Migrar ventas: ' + error.message);
  }
  if (localResurt.length) {
    const { error } = await sb.from('resurtidos').upsert(localResurt.map(resurtidoToRow));
    if (error) throw new Error('Migrar resurtidos: ' + error.message);
  }
  if (localGastos.length) {
    const { error } = await sb.from('gastos').upsert(localGastos.map(gastoToRow));
    if (error) throw new Error('Migrar gastos: ' + error.message);
  }
  if (localCompras.length) {
    const { error } = await sb.from('compras').upsert(localCompras.map(compraToRow));
    if (error) throw new Error('Migrar compras: ' + error.message);
  }
}

function chequearMigracionLocal() {
  const tieneLocal = localStorage.getItem('catalogo_datos') || localStorage.getItem('catalogo_ventas') || localStorage.getItem('catalogo_resurtidos') || localStorage.getItem('catalogo_gastos');
  const yaMigrado = localStorage.getItem('migrado_a_supabase');

  if (tieneLocal && !yaMigrado) {
    const banner = document.getElementById('migration-banner');
    if (banner) {
      banner.style.display = 'flex';
      
      document.getElementById('btn-migrar-local').addEventListener('click', async () => {
        const btn = document.getElementById('btn-migrar-local');
        try {
          btn.disabled = true;
          btn.textContent = 'Subiendo...';
          
          await migrarDeLocalStorage();
          localStorage.setItem('migrado_a_supabase', 'true');
          banner.style.display = 'none';
          
          alert('¡Tus ventas, gastos y stock locales se han subido correctamente a la nube (Supabase)! Ahora los verás en tu celular. La página se reiniciará.');
          window.location.reload();
        } catch (err) {
          alert('Error al subir los datos: ' + err.message);
          btn.disabled = false;
          btn.textContent = 'Subir a la nube';
        }
      });

      document.getElementById('btn-ignorar-migracion').addEventListener('click', () => {
        localStorage.setItem('migrado_a_supabase', 'true');
        banner.style.display = 'none';
      });
    }
  }
}

async function sembrarDeDatosJson() {
  const resp = await fetch('datos.json');
  if (!resp.ok) throw new Error('No se pudo cargar datos.json: HTTP ' + resp.status);
  const j = await resp.json();
  if (j.materiales?.length) {
    const { error } = await sb.from('materiales').upsert(j.materiales.map(materialToRow));
    if (error) throw new Error('Seed materiales: ' + error.message);
  }
  if (j.productos?.length) {
    const { error } = await sb.from('productos').upsert(j.productos.map(productoToRow));
    if (error) throw new Error('Seed productos: ' + error.message);
  }
  const { error: errPts } = await sb.from('puntos').upsert(PUNTOS_DEFAULT.map(puntoToRow));
  if (errPts) throw new Error('Seed puntos: ' + errPts.message);
}

const PRODUCTOS_CHALCO = [
  'Fabuloso Lavanda', 'Fabuloso Mar Fresco', 'Fabuloso Pino Fresco',
  'Mas Color', 'Zote', 'Suavizante', 'Salvo', 'Cloro',
];
const PRODUCTOS_VGUERRERO = [
  'Cloro', 'Fabuloso Lavanda', 'Pinol', 'Zote', 'Mas Color', 'Suavizante', 'Salvo',
];

const PUNTOS_DEFAULT = [
  { id: 'pv_chalco', nombre: 'Chalco', ubicacion: '', activo: true, productos_disponibles: PRODUCTOS_CHALCO.slice(), creado_en: new Date().toISOString() },
  { id: 'pv_vguerrero', nombre: 'Unidad Vicente Guerrero, Iztapalapa', ubicacion: '', activo: true, productos_disponibles: PRODUCTOS_VGUERRERO.slice(), creado_en: new Date().toISOString() },
];

const moneda = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const numero = new Intl.NumberFormat('es-MX', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const numeroEntero = new Intl.NumberFormat('es-MX');

function fmt(n) { return moneda.format(n || 0); }
function fmtNum(n) { return numero.format(n || 0); }

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function mostrarError(msg) {
  const banner = document.getElementById('error-banner');
  banner.textContent = msg;
  banner.hidden = false;
  setTimeout(() => { banner.hidden = true; }, 6000);
}

// =============================================================
// Carga inicial
// =============================================================

async function init() {
  try {
    let loaded = await fetchAllSupabase();
    const total = loaded.materiales.length + loaded.productos.length + loaded.puntos.length +
                  loaded.ventas.length + loaded.resurtidos.length + loaded.gastos.length + loaded.compras.length;

    if (total === 0) {
      const tieneLocal = localStorage.getItem('catalogo_datos') || localStorage.getItem('catalogo_ventas');
      if (tieneLocal) {
        console.log('[Supabase] Vacío. Migrando desde localStorage...');
        await migrarDeLocalStorage();
      } else {
        console.log('[Supabase] Vacío. Sembrando desde datos.json...');
        await sembrarDeDatosJson();
      }
      loaded = await fetchAllSupabase();
    }

    // Poblar estado en memoria desde Supabase
    materiales = loaded.materiales.map(rowToMaterial);
    productos = loaded.productos.map(rowToProducto);
    puntos = loaded.puntos.map(p => ({ ...p, activo: p.activo !== false }));
    ventas = loaded.ventas;
    resurtidos = loaded.resurtidos;
    gastos = loaded.gastos;
    compras = loaded.compras;
    comprasHistorial = loaded.compras_historial || [];

    // Asegurar puntos de venta virtuales para ventas directas y autoconsumo
    await asegurarPuntosVirtuales();

    // datos como wrapper para compatibilidad con código existente
    datos = { meta: { iva: IVA, moneda: 'MXN' }, productos, materiales };

    // Migraciones idempotentes (también persisten a Supabase si hubo cambios)
    aplicarMigracionesCatalogo();
    aplicarMigracionesPuntos();

    // Set de ingredientes únicos
    const set = new Set();
    productos.forEach(p => p.componentes.forEach(c => set.add(c.nombre)));
    ingredientesUsados = Array.from(set).sort((a, b) => a.localeCompare(b, 'es'));

    // Recalcular costos con base en los precios actuales
    recalcularCostosProductos();

    initNav();
    renderDashboard();
    renderProductos();
    initProduccion();
    initInversa();
    renderMateriales();
    initModal();
    initBackupActions();
    initCompras();
    initHistorialCompras();
    initPuntos();
    initOperacion();

    // Sincronizar datos de local storage a Supabase si existen
    chequearMigracionLocal();
  } catch (err) {
    mostrarError('No se pudo conectar con Supabase: ' + err.message);
    console.error(err);
  }
}

// =============================================================
// Navegación por tabs
// =============================================================

function initNav() {
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.view;
      tabs.forEach(t => t.classList.toggle('active', t === tab));
      document.querySelectorAll('.view').forEach(v => {
        v.classList.toggle('active', v.id === `view-${target}`);
      });
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
  });
}

// =============================================================
// Dashboard
// =============================================================

function renderDashboard() {
  const cont = document.getElementById('dashboard-cards');
  const masRentable = [...productos].sort((a, b) => b.ganancia - a.ganancia)[0];
  const masBarato = [...productos].sort((a, b) => a.costo_kg - b.costo_kg)[0];

  const mesActual = mesISO(hoyISO());
  const ventasMes = ventas.filter(v => mesISO(v.fecha) === mesActual).reduce((s, v) => s + (Number(v.monto) || 0), 0);
  const gastosMes = gastos.filter(g => mesISO(g.fecha) === mesActual).reduce((s, g) => s + (Number(g.monto) || 0), 0);
  const utilidadMes = ventasMes - gastosMes;

  const bajosStock = materiales
    .filter(m => !m.stock_infinito && (Number(m.stock_kg) || 0) < 1)
    .sort((a, b) => (Number(a.stock_kg) || 0) - (Number(b.stock_kg) || 0));
  const agotadosCount = bajosStock.filter(m => (Number(m.stock_kg) || 0) <= 0).length;

  cont.innerHTML = `
    <div class="card hero-card">
      <div class="card-title">Operación (${nombreMes(mesActual)})</div>
      <div class="big-number" style="color:${utilidadMes >= 0 ? 'var(--success)' : 'var(--danger)'};">${fmt(utilidadMes)}</div>
      <div class="sub">Utilidad neta del mes</div>
      <div class="card-row" style="margin-top:0.5rem;">
        <span class="label">Ventas</span>
        <span class="value success">${fmt(ventasMes)}</span>
      </div>
      <div class="card-row">
        <span class="label">Gastos</span>
        <span class="value" style="color:var(--danger);">${fmt(gastosMes)}</span>
      </div>
    </div>
    <div class="card hero-card">
      <div class="card-title">Alertas de Stock (&lt; 1 kg)</div>
      <div class="big-number" style="color:${bajosStock.length > 0 ? 'var(--danger)' : 'var(--success)'};">${numeroEntero.format(bajosStock.length)}</div>
      <div class="sub">${bajosStock.length > 0 ? `${agotadosCount} agotados · ${bajosStock.length - agotadosCount} bajos` : 'Inventario saludable'}</div>
    </div>
    <div class="card hero-card">
      <div class="card-title">Productos / M. Primas</div>
      <div class="big-number">${numeroEntero.format(productos.length)} / ${numeroEntero.format(materiales.length)}</div>
      <div class="sub">Fórmulas · Insumos en catálogo</div>
    </div>
    <div class="card">
      <div class="card-title">Más rentable</div>
      <div class="big-number" style="color:var(--success);font-size:1.3rem;">
        ${masRentable ? escapeHtml(masRentable.nombre) : '-'}
      </div>
      <div class="card-row">
        <span class="label">Ganancia/kg</span>
        <span class="value success">${masRentable ? fmt(masRentable.ganancia) : fmt(0)}</span>
      </div>
      <div class="card-row">
        <span class="label">Más barato: ${masBarato ? escapeHtml(masBarato.nombre) : '-'}</span>
        <span class="value">${masBarato ? fmt(masBarato.costo_kg) : fmt(0)}</span>
      </div>
    </div>
  `;

  renderTopTable('top-rentables', [...productos].sort((a, b) => b.ganancia - a.ganancia).slice(0, 5), 'ganancia');
  renderTopTable('top-baratos', [...productos].sort((a, b) => a.costo_kg - b.costo_kg).slice(0, 5), 'costo_kg');

  const stockCont = document.getElementById('dashboard-stock-bajo');
  const btnDashPedir = document.getElementById('btn-dash-pedir-faltantes');
  if (stockCont && btnDashPedir) {
    if (!btnDashPedir.dataset.bound) {
      btnDashPedir.dataset.bound = '1';
      btnDashPedir.addEventListener('click', () => agregarFaltantesACompras());
    }
    if (bajosStock.length === 0) {
      btnDashPedir.style.display = 'none';
      stockCont.innerHTML = `<p class="hint" style="margin:0;color:var(--success);">Todas las materias primas tienen al menos 1 kg en bodega.</p>`;
    } else {
      btnDashPedir.style.display = 'inline-flex';
      stockCont.innerHTML = `
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Materia Prima</th>
                <th>Proveedor</th>
                <th class="num">Stock actual</th>
                <th class="num">Precio/kg s/IVA</th>
                <th style="width:110px;text-align:center;">Acción</th>
              </tr>
            </thead>
            <tbody>
              ${bajosStock.map(m => `
                <tr>
                  <td><strong>${escapeHtml(m.descripcion)}</strong></td>
                  <td><span class="pill">${escapeHtml(m.proveedor)}</span></td>
                  <td class="num">${stockBadgeHTML(m.stock_kg, m.stock_infinito)}</td>
                  <td class="num">${fmt(m.precio_kg_sin_iva)}</td>
                  <td style="text-align:center;">
                    <button class="btn-action btn-action-save" onclick="abrirModalCompra('${escapeHtml(m.descripcion)}')">+ Compra</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }
  }
}

function renderTopTable(id, items, campo) {
  const cont = document.getElementById(id);
  const label = campo === 'ganancia' ? 'Ganancia/kg' : 'Costo/kg';
  const colorClass = campo === 'ganancia' ? 'success' : '';
  cont.innerHTML = `
    <table>
      <thead>
        <tr><th>#</th><th>Producto</th><th class="num">${label}</th></tr>
      </thead>
      <tbody>
        ${items.map((p, i) => `
          <tr>
            <td>${i + 1}</td>
            <td>${escapeHtml(p.nombre)}</td>
            <td class="num"><strong class="${colorClass}">${fmt(p[campo])}</strong></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// =============================================================
// Catálogo de productos
// =============================================================

function renderProductos() {
  const input = document.getElementById('search-productos');
  if (input && !input.dataset.bound) {
    input.dataset.bound = '1';
    input.addEventListener('input', () => pintarProductos(input.value));
  }
  const btnNuevoProd = document.getElementById('btn-nuevo-producto');
  if (btnNuevoProd && !btnNuevoProd.dataset.bound) {
    btnNuevoProd.dataset.bound = '1';
    btnNuevoProd.addEventListener('click', abrirModalNuevoProducto);
  }
  pintarProductos(input ? input.value : '');
}

function pintarProductos(filtro) {
  const grid = document.getElementById('productos-grid');
  const q = filtro.trim().toLowerCase();
  const lista = q
    ? productos.filter(p => p.nombre.toLowerCase().includes(q))
    : productos;

  if (lista.length === 0) {
    grid.innerHTML = `<div class="empty-state">No hay productos que coincidan con "${escapeHtml(filtro)}"</div>`;
    return;
  }

  grid.innerHTML = lista.map((p, idx) => {
    const margenPct = p.pv_sugerido > 0 ? ((p.pv_sugerido - p.costo_kg) / p.pv_sugerido) * 100 : 0;
    // Buscar índice real en `productos` para abrir el detalle correcto
    const realIdx = productos.indexOf(p);
    return `
      <div class="card clickable" data-producto-idx="${realIdx}">
        <div class="card-title">${escapeHtml(p.nombre)}</div>
        <div class="card-row">
          <span class="label">Costo/kg</span>
          <span class="value">${fmt(p.costo_kg)}</span>
        </div>
        <div class="card-row">
          <span class="label">PV sugerido</span>
          <span class="value">${fmt(p.pv_sugerido)}</span>
        </div>
        <div class="card-row">
          <span class="label">Ganancia/kg</span>
          <span class="value success">${fmt(p.ganancia)}</span>
        </div>
        <div class="card-row">
          <span class="label">Margen vs PV sug.</span>
          <span class="pill success">${fmtNum(margenPct)}%</span>
        </div>
      </div>
    `;
  }).join('');

  grid.querySelectorAll('.card.clickable').forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.dataset.productoIdx, 10);
      abrirDetalleProducto(idx);
    });
  });
}

function abrirDetalleProducto(idx) {
  const p = productos[idx];
  if (!p) return;
  const body = document.getElementById('modal-body');
  const totalPct = p.componentes.reduce((s, c) => s + c.porcentaje, 0);
  const totalCosto = p.componentes.reduce((s, c) => s + c.costo_kg, 0);

  body.innerHTML = `
    <h3 id="modal-title">${escapeHtml(p.nombre)}</h3>
    <div class="result-summary" style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem 1.5rem; align-items: center;">
      <div class="item"><span class="label">Costo/kg:</span> <span class="value">${fmt(p.costo_kg)}</span></div>
      <div class="item"><span class="label">Ganancia/kg:</span> <span class="value success" id="modal-ganancia">${fmt(p.ganancia)}</span></div>
      <div class="item" style="display: flex; align-items: center; gap: 0.25rem;">
        <span class="label" style="margin-bottom: 0;">PV público:</span>
        <input type="number" step="0.1" min="0" id="modal-edit-pv-publico" class="table-edit-input" style="max-width: 90px; font-weight: bold; padding: 0.25rem 0.4rem;" value="${p.pv_publico}" />
      </div>
      <div class="item" style="display: flex; align-items: center; gap: 0.25rem;">
        <span class="label" style="margin-bottom: 0;">PV sugerido:</span>
        <input type="number" step="0.1" min="0" id="modal-edit-pv-sugerido" class="table-edit-input" style="max-width: 90px; font-weight: bold; padding: 0.25rem 0.4rem;" value="${p.pv_sugerido}" />
      </div>
    </div>
    <div style="margin-top: 0.75rem; display: flex; justify-content: flex-end;">
      <button class="btn-primary" id="modal-save-prices-btn" style="font-size: 0.82rem; padding: 0.35rem 0.75rem;">
        Guardar Precios
      </button>
    </div>

    <h3 style="margin-top: 1rem;">Fórmula (por kg producido)</h3>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Componente</th>
            <th class="num">% peso</th>
            <th class="num">gr/kg</th>
            <th class="num">Costo/kg</th>
          </tr>
        </thead>
        <tbody>
          ${p.componentes.map(c => `
            <tr>
              <td>${escapeHtml(c.nombre)}</td>
              <td class="num">${fmtNum(c.porcentaje)}%</td>
              <td class="num">${fmtNum(c.gr_por_kg)}</td>
              <td class="num">${fmt(c.costo_kg)}</td>
            </tr>
          `).join('')}
          <tr>
            <td><strong>Total</strong></td>
            <td class="num"><strong>${fmtNum(totalPct)}%</strong></td>
            <td class="num"><strong>${fmtNum(totalPct * 10)}</strong></td>
            <td class="num"><strong>${fmt(totalCosto)}</strong></td>
          </tr>
        </tbody>
      </table>
    </div>
  `;

  // Setup dynamic gain calculation
  const inputPvPublico = document.getElementById('modal-edit-pv-publico');
  const inputPvSugerido = document.getElementById('modal-edit-pv-sugerido');
  const spanGanancia = document.getElementById('modal-ganancia');

  const updateGanancia = () => {
    const pvPublico = parseFloat(inputPvPublico.value) || 0;
    const ganancia = pvPublico - p.costo_kg;
    spanGanancia.textContent = fmt(ganancia);
    if (ganancia >= 0) {
      spanGanancia.style.color = 'var(--success)';
    } else {
      spanGanancia.style.color = 'var(--danger)';
    }
  };

  inputPvPublico.addEventListener('input', updateGanancia);

  // Setup save button
  const saveBtn = document.getElementById('modal-save-prices-btn');
  saveBtn.addEventListener('click', () => {
    const pvPublico = parseFloat(inputPvPublico.value);
    const pvSugerido = parseFloat(inputPvSugerido.value);

    if (isNaN(pvPublico) || pvPublico < 0 || isNaN(pvSugerido) || pvSugerido < 0) {
      mostrarError('Los precios de venta deben ser números válidos mayores o iguales a 0');
      return;
    }

    // Update in memory
    p.pv_publico = pvPublico;
    p.pv_sugerido = pvSugerido;
    p.ganancia = pvPublico - p.costo_kg;

    // Guardar en Supabase
    saveDatos();

    // UI feedback on button
    const oldText = saveBtn.textContent;
    const oldBg = saveBtn.style.backgroundColor;
    saveBtn.textContent = '¡Guardado!';
    saveBtn.style.backgroundColor = 'var(--success)';
    saveBtn.disabled = true;

    setTimeout(() => {
      saveBtn.textContent = oldText;
      saveBtn.style.backgroundColor = oldBg;
      saveBtn.disabled = false;
    }, 1500);

    // Sync other parts of the application
    renderDashboard();
    renderProductos();
    
    // Refresh production calculator selects
    const selectProd = document.getElementById('prod-select');
    const currentSelectVal = selectProd.value;
    selectProd.innerHTML = productos.map((p, i) => `<option value="${i}">${escapeHtml(p.nombre)}</option>`).join('');
    selectProd.value = currentSelectVal;
    const prodCantidad = document.getElementById('prod-cantidad');
    calcularProduccion(parseInt(selectProd.value, 10), parseFloat(prodCantidad.value) || 0);

    // Refresh inverse calculator
    const selectInv = document.getElementById('inv-ingrediente');
    const currentInvVal = selectInv.value;
    selectInv.innerHTML = ingredientesUsados.map(n => `<option value="${escapeHtml(n)}">${escapeHtml(n)}</option>`).join('');
    selectInv.value = currentInvVal;
    const invCantidad = document.getElementById('inv-cantidad');
    calcularInversa(selectInv.value, parseFloat(invCantidad.value) || 0);
  });

  document.getElementById('modal').hidden = false;
}

function initModal() {
  const overlay = document.getElementById('modal');
  document.getElementById('modal-close').addEventListener('click', () => { overlay.hidden = true; });
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.hidden = true;
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') overlay.hidden = true;
  });
}

// =============================================================
// Calculadora de producción
// =============================================================

function initProduccion() {
  const select = document.getElementById('prod-select');
  const cantidad = document.getElementById('prod-cantidad');
  select.innerHTML = productos.map((p, i) => `<option value="${i}">${escapeHtml(p.nombre)}</option>`).join('');
  const recalc = () => calcularProduccion(parseInt(select.value, 10), parseFloat(cantidad.value) || 0);
  select.addEventListener('change', recalc);
  cantidad.addEventListener('input', recalc);
  recalc();
}

function calcularProduccion(idx, kg) {
  const cont = document.getElementById('produccion-resultado');
  const p = productos[idx];
  if (!p) { cont.innerHTML = ''; return; }
  if (kg <= 0) {
    cont.innerHTML = `<div class="empty-state">Ingresa una cantidad mayor a 0</div>`;
    return;
  }

  const filas = p.componentes.map(c => {
    const gramos = c.gr_por_kg * kg;
    const costo = c.costo_kg * kg;
    return { nombre: c.nombre, gramos, costo, porcentaje: c.porcentaje };
  });

  const costoTotal = filas.reduce((s, f) => s + f.costo, 0);
  const ingresoSug = p.pv_sugerido * kg;
  const gananciaTotal = ingresoSug - costoTotal;

  cont.innerHTML = `
    <div class="result-summary">
      <div class="item"><span class="label">Producir:</span> <span class="value">${fmtNum(kg)} kg de ${escapeHtml(p.nombre)}</span></div>
      <div class="item"><span class="label">Costo total:</span> <span class="value">${fmt(costoTotal)}</span></div>
      <div class="item"><span class="label">Ingreso a PV sug.:</span> <span class="value">${fmt(ingresoSug)}</span></div>
      <div class="item"><span class="label">Ganancia estimada:</span> <span class="value success">${fmt(gananciaTotal)}</span></div>
    </div>

    <h3 style="margin-top:1rem;">Componentes necesarios</h3>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Componente</th>
            <th class="num">% peso</th>
            <th class="num">Gramos</th>
            <th class="num">Kilos</th>
            <th class="num">Costo</th>
          </tr>
        </thead>
        <tbody>
          ${filas.map(f => `
            <tr>
              <td>${escapeHtml(f.nombre)}</td>
              <td class="num">${fmtNum(f.porcentaje)}%</td>
              <td class="num">${fmtNum(f.gramos)}</td>
              <td class="num">${fmtNum(f.gramos / 1000)}</td>
              <td class="num">${fmt(f.costo)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// =============================================================
// Calculadora inversa
// =============================================================

function initInversa() {
  const select = document.getElementById('inv-ingrediente');
  const cantidad = document.getElementById('inv-cantidad');
  select.innerHTML = ingredientesUsados
    .map(n => `<option value="${escapeHtml(n)}">${escapeHtml(n)}</option>`).join('');
  const recalc = () => calcularInversa(select.value, parseFloat(cantidad.value) || 0);
  select.addEventListener('change', recalc);
  cantidad.addEventListener('input', recalc);
  recalc();
}

function calcularInversa(ingrediente, kgDisponibles) {
  const cont = document.getElementById('inversa-resultado');
  if (!ingrediente) { cont.innerHTML = ''; return; }
  if (kgDisponibles <= 0) {
    cont.innerHTML = `<div class="empty-state">Ingresa una cantidad mayor a 0</div>`;
    return;
  }

  const filas = productos
    .map(p => {
      const comp = p.componentes.find(c => c.nombre === ingrediente);
      if (!comp || comp.porcentaje <= 0) return null;
      const fraccion = comp.porcentaje / 100;
      const kgProducto = kgDisponibles / fraccion;
      const costoTotal = kgProducto * p.costo_kg;
      const ingreso = kgProducto * p.pv_sugerido;
      return {
        nombre: p.nombre,
        porcentaje: comp.porcentaje,
        kgProducto,
        costoTotal,
        ingreso,
        ganancia: ingreso - costoTotal,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.kgProducto - a.kgProducto);

  if (filas.length === 0) {
    cont.innerHTML = `<div class="empty-state">Ningún producto del catálogo usa "${escapeHtml(ingrediente)}"</div>`;
    return;
  }

  cont.innerHTML = `
    <div class="result-summary">
      <div class="item">
        <span class="label">Disponible:</span>
        <span class="value">${fmtNum(kgDisponibles)} kg de ${escapeHtml(ingrediente)}</span>
      </div>
      <div class="item">
        <span class="label">Productos compatibles:</span>
        <span class="value">${filas.length}</span>
      </div>
    </div>

    <h3 style="margin-top:1rem;">Producción máxima por producto</h3>
    <p class="hint">Asume que tienes el resto de ingredientes disponibles.</p>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th class="num">% del ingrediente</th>
            <th class="num">Kg producibles</th>
            <th class="num">Costo total</th>
            <th class="num">Ingreso PV sug.</th>
            <th class="num">Ganancia</th>
          </tr>
        </thead>
        <tbody>
          ${filas.map(f => `
            <tr>
              <td>${escapeHtml(f.nombre)}</td>
              <td class="num">${fmtNum(f.porcentaje)}%</td>
              <td class="num"><strong>${fmtNum(f.kgProducto)} kg</strong></td>
              <td class="num">${fmt(f.costoTotal)}</td>
              <td class="num">${fmt(f.ingreso)}</td>
              <td class="num"><strong class="success" style="color:var(--success);">${fmt(f.ganancia)}</strong></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// =============================================================
// Materias primas
// =============================================================

// =============================================================
// Mapeo y Recálculo de Costos
// =============================================================

function getMaterialForComponent(productoNombre, componenteNombre) {
  const compNorm = (componenteNombre || '').toLowerCase().trim();
  const prodNorm = (productoNombre || '').toLowerCase().trim();

  // Buscar coincidencia exacta
  let found = materiales.find(m => m.descripcion.toLowerCase().trim() === compNorm);
  if (found) return found;

  // Reglas específicas de mapeo por nombre
  if (compNorm === 'agua') {
    return materiales.find(m => m.descripcion.toLowerCase().includes('agua'));
  }
  if (compNorm === 'sal industrial') {
    return materiales.find(m => m.descripcion.toLowerCase().includes('sal de grano'));
  }
  if (compNorm === 'hidantoina') {
    return materiales.find(m => m.descripcion.toLowerCase().includes('hydantoin') || m.descripcion.toLowerCase().includes('hidantoina'));
  }
  if (compNorm === 'dodecilbencen sulfonato de sodio 80%') {
    return materiales.find(m => m.descripcion.toLowerCase().includes('dodecil bencen'));
  }
  if (compNorm === 'sunny pops manecaps') {
    return materiales.find(m => m.descripcion.toLowerCase().includes('sunny pop'));
  }
  if (compNorm === 'emulsificante de pino') {
    return materiales.find(m => m.descripcion.toLowerCase().includes('emulsificante de pino'));
  }
  if (compNorm === 'base uc lavatrastes') {
    return materiales.find(m => m.descripcion.toLowerCase() === 'base uc lavatrastes');
  }

  // Mapeo de aromas genéricos a específicos del producto
  if (compNorm === 'fragancia') {
    if (prodNorm.includes('mas color')) {
      return materiales.find(m => m.descripcion.toLowerCase() === 'base mas color');
    }
    if (prodNorm.includes('zote')) {
      return materiales.find(m => m.descripcion.toLowerCase() === 'base zote');
    }
    if (prodNorm.includes('suavizante')) {
      return materiales.find(m => m.descripcion.toLowerCase() === 'base dawmi');
    }
    // Variantes específicas de Fabuloso (deben ir antes del check genérico)
    if (prodNorm.includes('mar fresco')) {
      return materiales.find(m => m.descripcion.toLowerCase() === 'base mar fresco');
    }
    if (prodNorm.includes('pino fresco')) {
      return materiales.find(m => m.descripcion.toLowerCase() === 'base pino fresco');
    }
    if (prodNorm.includes('fabuloso')) {
      return materiales.find(m => m.descripcion.toLowerCase() === 'base lavanda');
    }
    if (prodNorm.includes('salvo')) {
      return materiales.find(m => m.descripcion.toLowerCase() === 'base salvo');
    }
    if (prodNorm.includes('vel rosita') || prodNorm.includes('ariel')) {
      return materiales.find(m => m.descripcion.toLowerCase() === 'base vel rosita');
    }
    return materiales.find(m => m.funcion.toLowerCase() === 'aroma');
  }

  // Mapeo de colorantes
  if (compNorm === 'color en solucion') {
    if (prodNorm.includes('mas color') || prodNorm.includes('fabuloso') || prodNorm.includes('vel rosita')) {
      return materiales.find(m => m.descripcion.toLowerCase() === 'rosa brillante');
    }
    if (prodNorm.includes('suavizante')) {
      return materiales.find(m => m.descripcion.toLowerCase() === 'azul fd&c');
    }
    if (prodNorm.includes('pinol') || prodNorm.includes('salvo')) {
      return materiales.find(m => m.descripcion.toLowerCase() === 'verde esmeralda');
    }
    return materiales.find(m => m.funcion.toLowerCase() === 'colorante');
  }

  // Fallback por inclusión parcial
  return materiales.find(m => m.descripcion.toLowerCase().includes(compNorm) || compNorm.includes(m.descripcion.toLowerCase()));
}

function recalcularCostosProductos() {
  productos.forEach(p => {
    let nuevoCostoKg = 0;
    p.componentes.forEach(c => {
      const mat = getMaterialForComponent(p.nombre, c.nombre);
      if (mat) {
        c.costo_kg = c.gr_por_kg * mat.precio_gr_con_iva;
      }
      nuevoCostoKg += c.costo_kg;
    });
    p.costo_kg = nuevoCostoKg;
    p.ganancia = (p.pv_publico || 0) - p.costo_kg;
  });
}

// =============================================================
// Materias primas
// =============================================================

let editandoMaterial = null; // Guardará la descripción de la materia prima en edición

function actualizarFiltrosMateriales(selectedProv = '', selectedFunc = '') {
  const selProv = document.getElementById('filter-proveedor');
  const selFunc = document.getElementById('filter-funcion');

  const proveedores = [...new Set(materiales.map(m => m.proveedor))].sort();
  const funciones = [...new Set(materiales.map(m => m.funcion))].sort();

  selProv.innerHTML = '<option value="">Todos</option>' + 
    proveedores.map(p => `<option value="${escapeHtml(p)}" ${p === selectedProv ? 'selected' : ''}>${escapeHtml(p)}</option>`).join('');
  
  selFunc.innerHTML = '<option value="">Todas</option>' + 
    funciones.map(f => `<option value="${escapeHtml(f)}" ${f === selectedFunc ? 'selected' : ''}>${escapeHtml(f)}</option>`).join('');
}

function renderMateriales() {
  actualizarFiltrosMateriales();

  const search = document.getElementById('search-materiales');
  const reset = document.getElementById('reset-filters');
  const selProv = document.getElementById('filter-proveedor');
  const selFunc = document.getElementById('filter-funcion');
  const selStock = document.getElementById('filter-stock');

  const pintar = () => pintarMateriales(search.value, selProv.value, selFunc.value, selStock ? selStock.value : '');
  if (!search.dataset.bound) {
    search.dataset.bound = '1';
    search.addEventListener('input', pintar);
    selProv.addEventListener('change', pintar);
    selFunc.addEventListener('change', pintar);
    if (selStock) selStock.addEventListener('change', pintar);
    reset.addEventListener('click', () => {
      search.value = ''; selProv.value = ''; selFunc.value = ''; if (selStock) selStock.value = ''; pintar();
    });
  }

  const btnRegistrarCompra = document.getElementById('btn-registrar-compra-mat');
  if (btnRegistrarCompra && !btnRegistrarCompra.dataset.bound) {
    btnRegistrarCompra.dataset.bound = '1';
    btnRegistrarCompra.addEventListener('click', () => abrirModalCompra());
  }

  const btnNuevaMateria = document.getElementById('btn-nueva-materia');
  if (btnNuevaMateria && !btnNuevaMateria.dataset.bound) {
    btnNuevaMateria.dataset.bound = '1';
    btnNuevaMateria.addEventListener('click', abrirModalNuevaMateria);
  }

  const btnPedirFaltantes = document.getElementById('btn-pedir-faltantes');
  if (btnPedirFaltantes && !btnPedirFaltantes.dataset.bound) {
    btnPedirFaltantes.dataset.bound = '1';
    btnPedirFaltantes.addEventListener('click', () => agregarFaltantesACompras());
  }

  pintar();
}

function pintarMateriales(filtro, proveedor, funcion, stockFiltro = '') {
  const tbody = document.querySelector('#materiales-table tbody');
  const count = document.getElementById('materiales-count');
  const q = (filtro || '').trim().toLowerCase();

  const lista = materiales.filter(m => {
    if (proveedor && m.proveedor !== proveedor) return false;
    if (funcion && m.funcion !== funcion) return false;
    if (q && !m.descripcion.toLowerCase().includes(q)) return false;
    if (stockFiltro === 'bajo' && (m.stock_infinito || (Number(m.stock_kg) || 0) >= 1)) return false;
    if (stockFiltro === 'agotado' && (m.stock_infinito || (Number(m.stock_kg) || 0) > 0)) return false;
    if (stockFiltro === 'ok' && !m.stock_infinito && (Number(m.stock_kg) || 0) < 1) return false;
    return true;
  });

  if (lista.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:1.5rem;color:var(--text-soft);">Sin resultados</td></tr>`;
  } else {
    tbody.innerHTML = lista.map(m => {
      const isEditing = editandoMaterial === m.descripcion;
      const stockBadge = stockBadgeHTML(m.stock_kg, m.stock_infinito);
      if (isEditing) {
        return `
          <tr data-materia-id="${escapeHtml(m.descripcion)}">
            <td><strong>${escapeHtml(m.descripcion)}</strong></td>
            <td><span class="pill">${escapeHtml(m.funcion)}</span></td>
            <td>
              <input type="text" class="table-edit-input edit-prov-input" value="${escapeHtml(m.proveedor)}" />
            </td>
            <td class="num">
              <input type="number" step="0.01" min="0" class="table-edit-input edit-precio-input num" style="text-align: right; max-width: 120px;" value="${m.precio_kg_sin_iva}" />
            </td>
            <td class="num edit-gr-sin-iva">${fmt(m.precio_gr_sin_iva)}</td>
            <td class="num edit-gr-con-iva">${fmt(m.precio_gr_con_iva)}</td>
            <td class="num">
              <div style="display:flex;flex-direction:column;gap:0.25rem;align-items:flex-end;">
                <input type="number" step="0.01" min="0" class="table-edit-input edit-stock-input num" style="text-align: right; max-width: 90px;" value="${m.stock_kg}" ${m.stock_infinito ? 'disabled' : ''} />
                <label style="font-size:0.75rem;color:var(--text-soft);display:flex;align-items:center;gap:0.25rem;cursor:pointer;">
                  <input type="checkbox" class="edit-stock-infinito" ${m.stock_infinito ? 'checked' : ''} /> ∞ continuo
                </label>
              </div>
            </td>
            <td style="text-align: center;">
              <div class="btn-action-group">
                <button class="btn-action btn-action-save" title="Guardar" onclick="guardarEdicion('${escapeHtml(m.descripcion)}', this)">
                  Guardar
                </button>
                <button class="btn-action btn-action-cancel" title="Cancelar" onclick="cancelarEdicion()">
                  Cancelar
                </button>
              </div>
            </td>
          </tr>
        `;
      } else {
        return `
          <tr>
            <td><strong>${escapeHtml(m.descripcion)}</strong></td>
            <td><span class="pill">${escapeHtml(m.funcion)}</span></td>
            <td>${escapeHtml(m.proveedor)}</td>
            <td class="num">${fmt(m.precio_kg_sin_iva)}</td>
            <td class="num">${fmt(m.precio_gr_sin_iva)}</td>
            <td class="num">${fmt(m.precio_gr_con_iva)}</td>
            <td class="num">${stockBadge}</td>
            <td style="text-align: center;">
              <div class="btn-action-group">
                <button class="btn-action btn-action-save" title="Registrar compra recibida" onclick="abrirModalCompra('${escapeHtml(m.descripcion)}')">
                  + Compra
                </button>
                <button class="btn-action btn-action-edit" title="Editar" onclick="iniciarEdicion('${escapeHtml(m.descripcion)}')">
                  Editar
                </button>
              </div>
            </td>
          </tr>
        `;
      }
    }).join('');

    // Setup live calculation listener for row in edit mode
    const rowEdit = tbody.querySelector('tr[data-materia-id]');
    if (rowEdit) {
      const inputPrecio = rowEdit.querySelector('.edit-precio-input');
      const tdGrSinIva = rowEdit.querySelector('.edit-gr-sin-iva');
      const tdGrConIva = rowEdit.querySelector('.edit-gr-con-iva');
      const iva = datos.meta.iva || 0.16;

      inputPrecio.addEventListener('input', () => {
        const val = parseFloat(inputPrecio.value) || 0;
        const grSinIva = val / 1000;
        const grConIva = grSinIva * (1 + iva);
        tdGrSinIva.textContent = fmt(grSinIva);
        tdGrConIva.textContent = fmt(grConIva);
      });

      // Toggle del checkbox "∞ continuo" deshabilita/habilita el input de kg
      const cbInfinito = rowEdit.querySelector('.edit-stock-infinito');
      const inputStock = rowEdit.querySelector('.edit-stock-input');
      if (cbInfinito && inputStock) {
        cbInfinito.addEventListener('change', () => {
          inputStock.disabled = cbInfinito.checked;
        });
      }
    }
  }
  count.textContent = `Mostrando ${lista.length} de ${materiales.length} materiales`;
}

// =============================================================
// Controladores de Edición Inline
// =============================================================

window.iniciarEdicion = function(descripcion) {
  editandoMaterial = descripcion;
  const search = document.getElementById('search-materiales').value;
  const selProv = document.getElementById('filter-proveedor').value;
  const selFunc = document.getElementById('filter-funcion').value;
  const selStock = document.getElementById('filter-stock')?.value || '';
  pintarMateriales(search, selProv, selFunc, selStock);
};

window.cancelarEdicion = function() {
  editandoMaterial = null;
  const search = document.getElementById('search-materiales').value;
  const selProv = document.getElementById('filter-proveedor').value;
  const selFunc = document.getElementById('filter-funcion').value;
  const selStock = document.getElementById('filter-stock')?.value || '';
  pintarMateriales(search, selProv, selFunc, selStock);
};

function sincronizarVistasTrasCambioMaterial() {
  renderDashboard();
  renderProductos();

  const selectProd = document.getElementById('prod-select');
  if (selectProd) {
    const currentSelectVal = selectProd.value;
    selectProd.innerHTML = productos.map((p, i) => `<option value="${i}">${escapeHtml(p.nombre)}</option>`).join('');
    if (currentSelectVal !== '') selectProd.value = currentSelectVal;
    const prodCantidad = document.getElementById('prod-cantidad');
    calcularProduccion(parseInt(selectProd.value, 10) || 0, parseFloat(prodCantidad?.value) || 0);
  }

  const selectInv = document.getElementById('inv-ingrediente');
  if (selectInv) {
    const currentInvVal = selectInv.value;
    selectInv.innerHTML = ingredientesUsados.map(n => `<option value="${escapeHtml(n)}">${escapeHtml(n)}</option>`).join('');
    if (currentInvVal) selectInv.value = currentInvVal;
    const invCantidad = document.getElementById('inv-cantidad');
    calcularInversa(selectInv.value, parseFloat(invCantidad?.value) || 0);
  }

  const selCompMat = document.getElementById('comp-material-select');
  if (selCompMat) {
    const prevComp = selCompMat.value;
    selCompMat.innerHTML = materiasPrimasOrdenadas();
    if (prevComp && materiales.some(m => m.descripcion === prevComp)) selCompMat.value = prevComp;
  }

  const search = document.getElementById('search-materiales')?.value || '';
  const selProv = document.getElementById('filter-proveedor')?.value || '';
  const selFunc = document.getElementById('filter-funcion')?.value || '';
  const selStock = document.getElementById('filter-stock')?.value || '';

  actualizarFiltrosMateriales(selProv, selFunc);
  pintarMateriales(search, document.getElementById('filter-proveedor')?.value || '', selFunc, selStock);
  pintarCompras();
}

function agregarFaltantesACompras() {
  const faltantes = materiales.filter(m => !m.stock_infinito && (Number(m.stock_kg) || 0) < 1);
  if (faltantes.length === 0) {
    mostrarError('No hay materias primas con stock bajo (< 1 kg).');
    return;
  }

  let agregados = 0;
  faltantes.forEach(m => {
    if (!compras.some(c => c.descripcion === m.descripcion)) {
      compras.push({
        descripcion: m.descripcion,
        proveedor: m.proveedor || '-',
        cantidad: 5
      });
      agregados++;
    }
  });

  if (agregados > 0) {
    saveCompras();
    pintarCompras();
  }

  // Cambiar a la pestaña Compras para que quede lista para pedir por WhatsApp
  const tabCompras = document.querySelector('#tabs .tab[data-view="compras"]');
  if (tabCompras) tabCompras.click();
}

function abrirModalNuevaMateria() {
  const modal = document.getElementById('modal');
  const body = document.getElementById('modal-body');
  if (!modal || !body) return;

  const proveedores = [...new Set(materiales.map(m => m.proveedor).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es'));
  const funciones = [...new Set(materiales.map(m => m.funcion).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es'));

  body.innerHTML = `
    <h2 id="modal-title" style="margin-bottom: 0.35rem;">Nueva Materia Prima</h2>
    <p class="hint" style="margin-bottom: 1rem;">Da de alta un insumo nuevo para usarlo en tus fórmulas y compras.</p>
    <div class="form-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.85rem;">
      <div class="form-field" style="grid-column: 1 / -1;">
        <label for="nueva-mat-desc">Descripción / Nombre</label>
        <input type="text" id="nueva-mat-desc" placeholder="Ej. Lauril Éter Sulfato 70%" />
      </div>
      <div class="form-field">
        <label for="nueva-mat-func">Función</label>
        <input list="nueva-mat-func-list" id="nueva-mat-func" placeholder="Ej. Tensoactivo, Aroma..." />
        <datalist id="nueva-mat-func-list">${funciones.map(f => `<option value="${escapeHtml(f)}"></option>`).join('')}</datalist>
      </div>
      <div class="form-field">
        <label for="nueva-mat-prov">Proveedor</label>
        <input list="nueva-mat-prov-list" id="nueva-mat-prov" placeholder="Ej. Pochteca" />
        <datalist id="nueva-mat-prov-list">${proveedores.map(p => `<option value="${escapeHtml(p)}"></option>`).join('')}</datalist>
      </div>
      <div class="form-field">
        <label for="nueva-mat-precio">Precio por kg s/IVA ($)</label>
        <input type="number" id="nueva-mat-precio" min="0" step="0.01" value="0" />
      </div>
      <div class="form-field">
        <label for="nueva-mat-stock">Stock inicial (kg)</label>
        <input type="number" id="nueva-mat-stock" min="0" step="0.01" value="0" />
        <label style="font-size:0.8rem;color:var(--text-soft);display:flex;align-items:center;gap:0.35rem;margin-top:0.35rem;cursor:pointer;">
          <input type="checkbox" id="nueva-mat-infinito" /> Stock ∞ continuo (ej. agua de red)
        </label>
      </div>
    </div>
    <div class="form-actions" style="margin-top: 1.25rem; display: flex; justify-content: flex-end; gap: 0.6rem;">
      <button type="button" class="btn-secondary" id="nueva-mat-cancelar">Cancelar</button>
      <button type="button" class="btn-primary" id="nueva-mat-guardar">Guardar Materia Prima</button>
    </div>
  `;

  const cbInf = document.getElementById('nueva-mat-infinito');
  const inpStock = document.getElementById('nueva-mat-stock');
  cbInf.addEventListener('change', () => { inpStock.disabled = cbInf.checked; });
  document.getElementById('nueva-mat-cancelar').addEventListener('click', () => { modal.hidden = true; });
  document.getElementById('nueva-mat-guardar').addEventListener('click', () => {
    const desc = document.getElementById('nueva-mat-desc').value.trim();
    const func = document.getElementById('nueva-mat-func').value.trim() || 'Otro';
    const prov = document.getElementById('nueva-mat-prov').value.trim() || '-';
    const precio = parseFloat(document.getElementById('nueva-mat-precio').value);
    const stock = parseFloat(inpStock.value) || 0;
    const infinito = cbInf.checked;

    if (!desc) { mostrarError('Ingresa la descripción de la materia prima.'); return; }
    if (materiales.some(m => m.descripcion.toLowerCase() === desc.toLowerCase())) {
      mostrarError('Ya existe una materia prima con ese nombre.');
      return;
    }
    if (isNaN(precio) || precio < 0) { mostrarError('El precio debe ser mayor o igual a 0.'); return; }

    const iva = datos.meta.iva || 0.16;
    const grSin = precio / 1000;
    materiales.push({
      descripcion: desc,
      funcion: func,
      proveedor: prov,
      precio_kg_sin_iva: +precio.toFixed(4),
      precio_gr_sin_iva: grSin,
      precio_gr_con_iva: grSin * (1 + iva),
      stock_kg: infinito ? 0 : Math.max(0, stock),
      stock_infinito: infinito
    });
    materiales.sort((a, b) => a.descripcion.localeCompare(b.descripcion, 'es'));

    recalcularCostosProductos();
    saveDatos();
    modal.hidden = true;
    sincronizarVistasTrasCambioMaterial();
  });

  modal.hidden = false;
}

function abrirModalNuevoProducto() {
  const modal = document.getElementById('modal');
  const body = document.getElementById('modal-body');
  if (!modal || !body || materiales.length === 0) return;

  const optsMat = materiasPrimasOrdenadas();

  body.innerHTML = `
    <h2 id="modal-title" style="margin-bottom: 0.35rem;">Nuevo Producto</h2>
    <p class="hint" style="margin-bottom: 1rem;">Define el nombre, precios de venta y los ingredientes por cada 1 kg (1,000 g) de producto.</p>
    <div class="form-grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.85rem;">
      <div class="form-field" style="grid-column: 1 / -1;">
        <label for="nuevo-prod-nombre">Nombre del Producto</label>
        <input type="text" id="nuevo-prod-nombre" placeholder="Ej. Jabón Líquido Manos Coco" />
      </div>
      <div class="form-field">
        <label for="nuevo-prod-pv-pub">Precio Venta Público ($/kg)</label>
        <input type="number" id="nuevo-prod-pv-pub" min="0" step="0.5" value="25" />
      </div>
      <div class="form-field">
        <label for="nuevo-prod-pv-sug">Precio Venta Sugerido ($/kg)</label>
        <input type="number" id="nuevo-prod-pv-sug" min="0" step="0.5" value="25" />
      </div>
    </div>

    <h3 style="margin-top: 1.1rem; margin-bottom: 0.5rem;">Fórmula (gramos por 1 kg)</h3>
    <div id="nuevo-prod-componentes" style="display: flex; flex-direction: column; gap: 0.5rem;"></div>
    <button type="button" class="btn-secondary" id="nuevo-prod-add-comp" style="margin-top: 0.5rem;">+ Agregar ingrediente</button>

    <div class="result-summary" id="nuevo-prod-preview" style="margin-top: 1rem;"></div>

    <div class="form-actions" style="margin-top: 1.25rem; display: flex; justify-content: flex-end; gap: 0.6rem;">
      <button type="button" class="btn-secondary" id="nuevo-prod-cancelar">Cancelar</button>
      <button type="button" class="btn-primary" id="nuevo-prod-guardar">Guardar Producto</button>
    </div>
  `;

  const contComps = document.getElementById('nuevo-prod-componentes');
  const preview = document.getElementById('nuevo-prod-preview');
  const inpPvPub = document.getElementById('nuevo-prod-pv-pub');

  const actualizarPreview = () => {
    let totalGr = 0;
    let costoKg = 0;
    contComps.querySelectorAll('.comp-row').forEach(row => {
      const desc = row.querySelector('select').value;
      const gr = parseFloat(row.querySelector('input').value) || 0;
      const mat = materiales.find(m => m.descripcion === desc);
      totalGr += gr;
      if (mat) costoKg += gr * mat.precio_gr_con_iva;
    });
    const pv = parseFloat(inpPvPub.value) || 0;
    const gan = pv - costoKg;
    preview.innerHTML = `
      <span class="label">Total fórmula:</span> <span class="value" style="margin-right:1rem;">${fmtNum(totalGr)} g</span>
      <span class="label">Costo/kg:</span> <span class="value" style="margin-right:1rem;">${fmt(costoKg)}</span>
      <span class="label">Ganancia/kg:</span> <span class="value ${gan >= 0 ? 'success' : ''}">${fmt(gan)}</span>
    `;
  };

  const agregarFilaComp = () => {
    const row = document.createElement('div');
    row.className = 'comp-row';
    row.style.cssText = 'display:flex;gap:0.5rem;align-items:center;';
    row.innerHTML = `
      <select style="flex:1;">${optsMat}</select>
      <input type="number" min="0" step="0.1" value="100" style="width:100px;text-align:right;" placeholder="gr/kg" />
      <button type="button" class="btn-action btn-action-cancel">Quitar</button>
    `;
    row.querySelector('select').addEventListener('change', actualizarPreview);
    row.querySelector('input').addEventListener('input', actualizarPreview);
    row.querySelector('button').addEventListener('click', () => {
      if (contComps.querySelectorAll('.comp-row').length > 1) {
        row.remove();
        actualizarPreview();
      }
    });
    contComps.appendChild(row);
    actualizarPreview();
  };

  agregarFilaComp();
  inpPvPub.addEventListener('input', actualizarPreview);
  document.getElementById('nuevo-prod-add-comp').addEventListener('click', agregarFilaComp);
  document.getElementById('nuevo-prod-cancelar').addEventListener('click', () => { modal.hidden = true; });
  document.getElementById('nuevo-prod-guardar').addEventListener('click', () => {
    const nombre = document.getElementById('nuevo-prod-nombre').value.trim();
    const pvPub = parseFloat(inpPvPub.value) || 0;
    const pvSug = parseFloat(document.getElementById('nuevo-prod-pv-sug').value) || 0;

    if (!nombre) { mostrarError('Ingresa el nombre del producto.'); return; }
    if (productos.some(p => p.nombre.toLowerCase() === nombre.toLowerCase())) {
      mostrarError('Ya existe un producto con ese nombre.');
      return;
    }

    const comps = [];
    contComps.querySelectorAll('.comp-row').forEach(row => {
      const desc = row.querySelector('select').value;
      const gr = parseFloat(row.querySelector('input').value) || 0;
      if (desc && gr > 0) comps.push({ nombre: desc, gr_por_kg: gr, costo_kg: 0 });
    });

    if (comps.length === 0) {
      mostrarError('Agrega al menos un ingrediente con gramos mayores a 0.');
      return;
    }

    productos.push({ nombre, pv_publico: pvPub, pv_sugerido: pvSug, componentes: comps, costo_kg: 0, ganancia: 0 });
    productos.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));

    const set = new Set();
    productos.forEach(p => p.componentes.forEach(c => set.add(c.nombre)));
    ingredientesUsados = Array.from(set).sort((a, b) => a.localeCompare(b, 'es'));

    recalcularCostosProductos();
    saveDatos();
    modal.hidden = true;
    sincronizarVistasTrasCambioMaterial();
  });

  modal.hidden = false;
}

window.abrirModalCompra = function(descripcionPre = '', cantidadPre = 1, desdeListaCompras = false) {
  const modal = document.getElementById('modal');
  const body = document.getElementById('modal-body');
  if (!modal || !body || materiales.length === 0) return;

  const iva = datos.meta.iva || 0.16;
  const matInicial = materiales.find(m => m.descripcion === descripcionPre) || materiales[0];
  const cantInicial = parseFloat(cantidadPre) > 0 ? parseFloat(cantidadPre) : 1;
  const precioInicial = matInicial ? (matInicial.precio_kg_sin_iva || 0) : 0;
  const totalInicial = +(cantInicial * precioInicial).toFixed(2);

  body.innerHTML = `
    <h2 id="modal-title" style="margin-bottom: 0.35rem;">Registrar Compra de Materia Prima</h2>
    <p class="hint" style="margin-bottom: 1rem;">Captura cuánto compraste y el costo <strong>sin IVA</strong>. Se sumará al stock, se actualizará el precio/kg, precio/gr y los costos y ganancias de todos los productos.</p>

    <div class="form-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.85rem;">
      <div class="form-field" style="grid-column: 1 / -1;">
        <label for="compra-mat-select">Materia Prima</label>
        <select id="compra-mat-select">${materiasPrimasOrdenadas()}</select>
      </div>
      <div class="form-field">
        <label for="compra-mat-kg">Cantidad comprada (kg)</label>
        <input type="number" id="compra-mat-kg" min="0.01" step="0.01" value="${cantInicial}" />
      </div>
      <div class="form-field">
        <label for="compra-mat-total-sin-iva">Costo total pagado s/IVA ($)</label>
        <input type="number" id="compra-mat-total-sin-iva" min="0" step="0.01" value="${totalInicial}" />
      </div>
      <div class="form-field">
        <label for="compra-mat-precio-kg">Precio por kg s/IVA ($/kg)</label>
        <input type="number" id="compra-mat-precio-kg" min="0" step="0.01" value="${precioInicial.toFixed(2)}" />
      </div>
    </div>

    <div class="result-summary" id="compra-mat-preview" style="margin-top: 1rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 0.75rem;"></div>

    <div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.5rem;">
      <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; cursor: pointer;">
        <input type="checkbox" id="compra-mat-gasto" />
        Registrar también como gasto en Operación (monto con IVA)
      </label>
      <label id="compra-mat-quitar-wrap" style="display: none; align-items: center; gap: 0.5rem; font-size: 0.9rem; cursor: pointer;">
        <input type="checkbox" id="compra-mat-quitar-lista" />
        Quitar esta materia prima de la Lista de Compras
      </label>
    </div>

    <div class="form-actions" style="margin-top: 1.25rem; display: flex; justify-content: flex-end; gap: 0.6rem;">
      <button type="button" class="btn-secondary" id="compra-mat-cancelar">Cancelar</button>
      <button type="button" class="btn-primary" id="compra-mat-confirmar">Aplicar compra y actualizar</button>
    </div>
  `;

  const selMat = document.getElementById('compra-mat-select');
  const inpKg = document.getElementById('compra-mat-kg');
  const inpTotal = document.getElementById('compra-mat-total-sin-iva');
  const inpPrecioKg = document.getElementById('compra-mat-precio-kg');
  const preview = document.getElementById('compra-mat-preview');
  const quitarWrap = document.getElementById('compra-mat-quitar-wrap');
  const cbQuitar = document.getElementById('compra-mat-quitar-lista');

  if (matInicial) selMat.value = matInicial.descripcion;

  const actualizarCheckboxLista = () => {
    const enLista = compras.some(c => c.descripcion === selMat.value);
    quitarWrap.style.display = enLista ? 'flex' : 'none';
    cbQuitar.checked = enLista && desdeListaCompras;
  };

  const actualizarPreview = () => {
    const mat = materiales.find(m => m.descripcion === selMat.value);
    if (!mat) return;
    const kg = Math.max(0, parseFloat(inpKg.value) || 0);
    const precioKg = Math.max(0, parseFloat(inpPrecioKg.value) || 0);
    const totalSinIva = Math.max(0, parseFloat(inpTotal.value) || 0);
    const totalConIva = totalSinIva * (1 + iva);
    const nuevoGrSin = precioKg / 1000;
    const nuevoGrCon = nuevoGrSin * (1 + iva);
    const stockActual = parseFloat(mat.stock_kg) || 0;
    const nuevoStockTxt = mat.stock_infinito ? '∞ continuo' : `${fmtNum(stockActual)} → <strong>${fmtNum(stockActual + kg)} kg</strong>`;

    preview.innerHTML = `
      <div><span class="label">Stock (kg):</span><br><span class="value">${nuevoStockTxt}</span></div>
      <div><span class="label">Precio/kg s/IVA:</span><br><span class="value">${fmt(mat.precio_kg_sin_iva)} → <strong>${fmt(precioKg)}</strong></span></div>
      <div><span class="label">Precio/gr s/IVA → c/IVA:</span><br><span class="value">${fmt(nuevoGrSin)} → <strong>${fmt(nuevoGrCon)}</strong></span></div>
      <div><span class="label">Total compra c/IVA (${Math.round(iva * 100)}%):</span><br><span class="value success"><strong>${fmt(totalConIva)}</strong></span></div>
    `;
  };

  let ultimoCampoEditado = 'total';

  selMat.addEventListener('change', () => {
    const mat = materiales.find(m => m.descripcion === selMat.value);
    const kg = parseFloat(inpKg.value) || 0;
    const p = mat ? (mat.precio_kg_sin_iva || 0) : 0;
    inpPrecioKg.value = p.toFixed(2);
    inpTotal.value = (kg * p).toFixed(2);
    actualizarCheckboxLista();
    actualizarPreview();
  });

  inpKg.addEventListener('input', () => {
    const kg = parseFloat(inpKg.value) || 0;
    if (ultimoCampoEditado === 'precio') {
      const p = parseFloat(inpPrecioKg.value) || 0;
      inpTotal.value = (kg * p).toFixed(2);
    } else if (kg > 0) {
      const t = parseFloat(inpTotal.value) || 0;
      inpPrecioKg.value = (t / kg).toFixed(2);
    }
    actualizarPreview();
  });

  inpTotal.addEventListener('input', () => {
    ultimoCampoEditado = 'total';
    const kg = parseFloat(inpKg.value) || 0;
    const t = parseFloat(inpTotal.value) || 0;
    if (kg > 0) inpPrecioKg.value = (t / kg).toFixed(2);
    actualizarPreview();
  });

  inpPrecioKg.addEventListener('input', () => {
    ultimoCampoEditado = 'precio';
    const kg = parseFloat(inpKg.value) || 0;
    const p = parseFloat(inpPrecioKg.value) || 0;
    inpTotal.value = (kg * p).toFixed(2);
    actualizarPreview();
  });

  document.getElementById('compra-mat-cancelar').addEventListener('click', () => { modal.hidden = true; });
  document.getElementById('compra-mat-confirmar').addEventListener('click', () => {
    const desc = selMat.value;
    const kg = parseFloat(inpKg.value);
    const totalSinIva = parseFloat(inpTotal.value);
    const precioKgDirecto = parseFloat(inpPrecioKg.value);

    if (isNaN(kg) || kg <= 0) {
      mostrarError('La cantidad comprada debe ser mayor a 0 kg.');
      return;
    }
    if (isNaN(totalSinIva) || totalSinIva < 0 || isNaN(precioKgDirecto) || precioKgDirecto < 0) {
      mostrarError('El costo sin IVA debe ser un número válido mayor o igual a 0.');
      return;
    }

    // Calcular con precisión completa si se editó el total sin IVA
    const nuevoPrecioKg = ultimoCampoEditado === 'total' ? (totalSinIva / kg) : precioKgDirecto;
    const mat = materiales.find(m => m.descripcion === desc);
    if (!mat) return;

    if (!mat.stock_infinito) {
      mat.stock_kg = +((parseFloat(mat.stock_kg) || 0) + kg).toFixed(4);
    }
    mat.precio_kg_sin_iva = +nuevoPrecioKg.toFixed(4);
    mat.precio_gr_sin_iva = mat.precio_kg_sin_iva / 1000;
    mat.precio_gr_con_iva = mat.precio_gr_sin_iva * (1 + iva);

    recalcularCostosProductos();
    saveDatos();

    const nuevoHist = {
      id: genId('ch'),
      fecha: hoyISO(),
      descripcion: desc,
      proveedor: mat.proveedor || '-',
      cantidad_kg: +kg.toFixed(4),
      precio_kg_sin_iva: mat.precio_kg_sin_iva,
      total_sin_iva: +totalSinIva.toFixed(2),
      total_con_iva: +(totalSinIva * (1 + iva)).toFixed(2),
      creado_en: new Date().toISOString()
    };
    comprasHistorial.unshift(nuevoHist);
    saveCompraHistorial(nuevoHist);

    if (cbQuitar.checked) {
      sb.from('compras').delete().eq('descripcion', desc).then(_onSyncErr('compras'));
      compras = compras.filter(c => c.descripcion !== desc);
    }

    if (document.getElementById('compra-mat-gasto').checked) {
      const montoConIva = +((totalSinIva * (1 + iva)).toFixed(2));
      gastos.push({
        id: genId('g'),
        fecha: hoyISO(),
        categoria: 'Compra de materia prima',
        descripcion: `Compra ${fmtNum(kg)} kg de ${desc} (${fmt(totalSinIva)} s/IVA)`,
        punto_id: '',
        monto: montoConIva
      });
      saveGastos();
      pintarGastos();
    }

    modal.hidden = true;
    sincronizarVistasTrasCambioMaterial();
    pintarHistorialCompras();
  });

  actualizarCheckboxLista();
  actualizarPreview();
  modal.hidden = false;
};

window.guardarEdicion = function(descripcion, btn) {
  const row = btn.closest('tr');
  const provInput = row.querySelector('.edit-prov-input');
  const precioInput = row.querySelector('.edit-precio-input');
  const stockInput = row.querySelector('.edit-stock-input');
  const cbInfinito = row.querySelector('.edit-stock-infinito');

  const nuevoProveedor = provInput.value.trim();
  const nuevoPrecioKg = parseFloat(precioInput.value);
  const nuevoStock = stockInput ? parseFloat(stockInput.value) : NaN;
  const nuevoInfinito = cbInfinito ? cbInfinito.checked : false;

  if (isNaN(nuevoPrecioKg) || nuevoPrecioKg < 0) {
    mostrarError('El precio debe ser un número válido mayor o igual a 0');
    return;
  }

  // Buscar y actualizar el material
  const mat = materiales.find(m => m.descripcion === descripcion);
  if (mat) {
    mat.proveedor = nuevoProveedor || '-';
    mat.precio_kg_sin_iva = nuevoPrecioKg;
    mat.precio_gr_sin_iva = nuevoPrecioKg / 1000;
    mat.precio_gr_con_iva = mat.precio_gr_sin_iva * (1 + (datos.meta.iva || 0.16));
    mat.stock_infinito = nuevoInfinito;
    if (!isNaN(nuevoStock) && nuevoStock >= 0) mat.stock_kg = nuevoStock;
  }

  // Recalcular costos y ganancias de productos terminados
  recalcularCostosProductos();

  // Persistir en Supabase
  saveDatos();

  // Salir de modo edición
  editandoMaterial = null;

  // Sincronizar todos los componentes y vistas de la app
  sincronizarVistasTrasCambioMaterial();
};

// =============================================================
// Exportación e Importación de datos
// =============================================================

function initBackupActions() {
  const btnExportar = document.getElementById('btn-exportar');
  const btnRestablecer = document.getElementById('btn-restablecer');

  if (btnExportar) {
    btnExportar.addEventListener('click', () => {
      try {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(datos, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "datos.json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
      } catch (err) {
        mostrarError('Error al exportar los datos: ' + err.message);
      }
    });
  }

  if (btnRestablecer) {
    btnRestablecer.addEventListener('click', async () => {
      if (!confirm('¿Restablecer TODO en la base? Se borrarán precios, inventario, compras, puntos, ventas, resurtidos y gastos. Esto NO se puede deshacer.')) return;
      try {
        // Borrar primero las tablas con FK a puntos, luego puntos, luego el resto
        await Promise.all([
          sb.from('ventas').delete().neq('id', '__never__'),
          sb.from('resurtidos').delete().neq('id', '__never__'),
          sb.from('gastos').delete().neq('id', '__never__'),
          sb.from('compras').delete().neq('descripcion', '__never__'),
          ...(historialTablaDisponible ? [sb.from('compras_historial').delete().neq('id', '__never__')] : []),
        ]);
        await sb.from('puntos').delete().neq('id', '__never__');
        await Promise.all([
          sb.from('materiales').delete().neq('descripcion', '__never__'),
          sb.from('productos').delete().neq('nombre', '__never__'),
        ]);
        // Limpiar también el localStorage por si tuviera datos viejos
        ['catalogo_datos','catalogo_compras','catalogo_compras_historial','catalogo_puntos','catalogo_ventas','catalogo_resurtidos','catalogo_gastos']
          .forEach(k => localStorage.removeItem(k));
        location.reload();
      } catch (err) {
        mostrarError('No se pudo restablecer: ' + err.message);
      }
    });
  }
}

// =============================================================
// Lista de Compras y Whatsapp
// =============================================================

function initCompras() {
  const select = document.getElementById('comp-material-select');
  const btnAgregar = document.getElementById('btn-agregar-compra');
  const inputCantidad = document.getElementById('comp-cantidad');

  if (!select || !btnAgregar || !inputCantidad) return;

  // Llenar select con materias primas ordenadas alfabéticamente
  select.innerHTML = materiasPrimasOrdenadas();

  btnAgregar.addEventListener('click', () => {
    const descripcion = select.value;
    const cantidad = parseFloat(inputCantidad.value);

    if (isNaN(cantidad) || cantidad <= 0) {
      mostrarError('Ingresa una cantidad válida y mayor a 0');
      return;
    }

    agregarCompra(descripcion, cantidad);
    inputCantidad.value = 1; // reset a 1
  });

  pintarCompras();
}

function saveCompraHistorial(item) {
  localStorage.setItem('catalogo_compras_historial', JSON.stringify(comprasHistorial));
  if (historialTablaDisponible) {
    sb.from('compras_historial').upsert(compraHistorialToRow(item)).then(_onSyncErr('compras_historial'));
  }
}

function initHistorialCompras() {
  const fMat = document.getElementById('filter-hist-material');
  const fProv = document.getElementById('filter-hist-proveedor');
  if (!fMat || !fProv) return;

  fMat.addEventListener('change', pintarHistorialCompras);
  fProv.addEventListener('change', pintarHistorialCompras);
  pintarHistorialCompras();
}

window.eliminarHistorialCompra = function(id) {
  if (!confirm('¿Eliminar este registro del historial de compras?')) return;
  comprasHistorial = comprasHistorial.filter(h => h.id !== id);
  localStorage.setItem('catalogo_compras_historial', JSON.stringify(comprasHistorial));
  if (historialTablaDisponible) {
    sb.from('compras_historial').delete().eq('id', id).then(_onSyncErr('compras_historial'));
  }
  pintarHistorialCompras();
};

function pintarHistorialCompras() {
  const tbody = document.querySelector('#compras-historial-table tbody');
  const resumen = document.getElementById('compras-historial-resumen');
  const fMat = document.getElementById('filter-hist-material');
  const fProv = document.getElementById('filter-hist-proveedor');
  const hint = document.getElementById('compras-historial-sync-hint');
  if (!tbody || !resumen || !fMat || !fProv) return;

  if (hint && !historialTablaDisponible) {
    hint.innerHTML = 'Guardando historial localmente en este navegador. Para sincronizarlo entre PC y celular, ejecuta <code>compras_historial.sql</code> en Supabase.';
  }

  const prevMat = fMat.value;
  const prevProv = fProv.value;
  const matsDisp = [...new Set(comprasHistorial.map(h => h.descripcion))].sort((a, b) => a.localeCompare(b, 'es'));
  const provsDisp = [...new Set(comprasHistorial.map(h => h.proveedor || '-'))].sort((a, b) => a.localeCompare(b, 'es'));

  fMat.innerHTML = '<option value="">Todas las materias primas</option>' + matsDisp.map(m => `<option value="${escapeHtml(m)}">${escapeHtml(m)}</option>`).join('');
  fProv.innerHTML = '<option value="">Todos los proveedores</option>' + provsDisp.map(p => `<option value="${escapeHtml(p)}">${escapeHtml(p)}</option>`).join('');
  if (matsDisp.includes(prevMat)) fMat.value = prevMat;
  if (provsDisp.includes(prevProv)) fProv.value = prevProv;

  // Calcular variación cronológica por materia prima (de más antigua a más reciente)
  const crono = [...comprasHistorial].sort((a, b) => {
    const cmpFecha = (a.fecha || '').localeCompare(b.fecha || '');
    if (cmpFecha !== 0) return cmpFecha;
    return (a.creado_en || '').localeCompare(b.creado_en || '');
  });

  const ultimoPrecioPorMat = {};
  const variacionPorId = {};
  crono.forEach(h => {
    const precio = Number(h.precio_kg_sin_iva) || 0;
    const prev = ultimoPrecioPorMat[h.descripcion];
    if (prev === undefined) {
      variacionPorId[h.id] = { tipo: 'first', diff: 0, pct: null };
    } else {
      const diff = precio - prev;
      const pct = prev > 0 ? (diff / prev) * 100 : null;
      if (diff > 0.005) variacionPorId[h.id] = { tipo: 'up', diff, pct };
      else if (diff < -0.005) variacionPorId[h.id] = { tipo: 'down', diff, pct };
      else variacionPorId[h.id] = { tipo: 'same', diff: 0, pct: 0 };
    }
    ultimoPrecioPorMat[h.descripcion] = precio;
  });

  // Mostrar de más reciente a más antigua aplicando filtros
  const lista = [...crono].reverse().filter(h => {
    if (fMat.value && h.descripcion !== fMat.value) return false;
    if (fProv.value && (h.proveedor || '-') !== fProv.value) return false;
    return true;
  });

  const totalKg = lista.reduce((s, h) => s + (Number(h.cantidad_kg) || 0), 0);
  const totalSinIva = lista.reduce((s, h) => s + (Number(h.total_sin_iva) || 0), 0);
  const totalConIva = lista.reduce((s, h) => s + (Number(h.total_con_iva) || 0), 0);
  resumen.innerHTML = `
    <span class="label">Compras:</span> <span class="value" style="margin-right: 1rem;">${lista.length}</span>
    <span class="label">Total comprado:</span> <span class="value" style="margin-right: 1rem;">${fmtNum(totalKg)} kg</span>
    <span class="label">Total s/IVA:</span> <span class="value" style="margin-right: 1rem;">${fmt(totalSinIva)}</span>
    <span class="label">Total c/IVA:</span> <span class="value success">${fmt(totalConIva)}</span>
  `;

  if (lista.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:1.5rem;color:var(--text-soft);">Aún no hay compras registradas en el historial.</td></tr>`;
    return;
  }

  tbody.innerHTML = lista.map(h => {
    const v = variacionPorId[h.id] || { tipo: 'first', diff: 0, pct: null };
    let varHtml = '<span class="badge-var badge-var-first">1ª compra</span>';
    if (v.tipo === 'up') {
      const pctTxt = v.pct !== null ? ` (${v.pct >= 0 ? '+' : ''}${v.pct.toFixed(1)}%)` : '';
      varHtml = `<span class="badge-var badge-var-up">▲ +${fmt(v.diff)}${pctTxt}</span>`;
    } else if (v.tipo === 'down') {
      const pctTxt = v.pct !== null ? ` (${v.pct.toFixed(1)}%)` : '';
      varHtml = `<span class="badge-var badge-var-down">▼ -${fmt(Math.abs(v.diff))}${pctTxt}</span>`;
    } else if (v.tipo === 'same') {
      varHtml = '<span class="badge-var badge-var-same">= Sin cambio</span>';
    }

    return `
      <tr>
        <td>${escapeHtml(h.fecha || '-')}</td>
        <td><strong>${escapeHtml(h.descripcion)}</strong></td>
        <td><span class="pill">${escapeHtml(h.proveedor || '-')}</span></td>
        <td class="num">${fmtNum(h.cantidad_kg)}</td>
        <td class="num"><strong>${fmt(h.precio_kg_sin_iva)}</strong></td>
        <td>${varHtml}</td>
        <td class="num">${fmt(h.total_sin_iva)}</td>
        <td class="num">${fmt(h.total_con_iva)}</td>
        <td style="text-align: center;">
          <button class="btn-action btn-action-cancel" title="Eliminar registro" onclick="eliminarHistorialCompra('${escapeHtml(h.id)}')">Eliminar</button>
        </td>
      </tr>
    `;
  }).join('');
}

function materiasPrimasOrdenadas() {
  return materiales
    .map(m => m.descripcion)
    .sort((a, b) => a.localeCompare(b, 'es'))
    .map(desc => `<option value="${escapeHtml(desc)}">${escapeHtml(desc)}</option>`)
    .join('');
}

function agregarCompra(descripcion, cantidad) {
  const itemExistente = compras.find(item => item.descripcion === descripcion);
  if (itemExistente) {
    itemExistente.cantidad += cantidad;
  } else {
    const mat = materiales.find(m => m.descripcion === descripcion);
    compras.push({
      descripcion,
      proveedor: mat ? mat.proveedor : '-',
      cantidad: cantidad
    });
  }

  saveCompras();
  pintarCompras();
}

window.eliminarCompra = function(descripcion) {
  sb.from('compras').delete().eq('descripcion', descripcion).then(_onSyncErr('compras'));
  compras = compras.filter(item => item.descripcion !== descripcion);
  pintarCompras();
};

window.actualizarCantidadCompra = function(descripcion, input) {
  const cantidad = parseFloat(input.value);
  if (isNaN(cantidad) || cantidad <= 0) {
    mostrarError('La cantidad debe ser mayor a 0');
    return;
  }

  const item = compras.find(x => x.descripcion === descripcion);
  if (item) {
    item.cantidad = cantidad;
    saveCompras();

    // Solo recalculamos los totales en tiempo de edición rápida para evitar que el cursor pierda el focus del input
    actualizarTotalesCompras();
  }
};

function actualizarTotalesCompras() {
  const totalItemsSpan = document.getElementById('compras-total-items');
  const costoTotalSpan = document.getElementById('compras-costo-total');
  
  if (!totalItemsSpan || !costoTotalSpan) return;

  let totalCosto = 0;
  compras.forEach(item => {
    const mat = materiales.find(m => m.descripcion === item.descripcion);
    const precioKgConIva = mat ? (mat.precio_kg_sin_iva * (1 + (datos.meta.iva || 0.16))) : 0;
    totalCosto += item.cantidad * precioKgConIva;
  });

  totalItemsSpan.textContent = compras.length;
  costoTotalSpan.textContent = fmt(totalCosto);
}

function pintarCompras() {
  const tbody = document.querySelector('#compras-table tbody');
  const totalItemsSpan = document.getElementById('compras-total-items');
  const costoTotalSpan = document.getElementById('compras-costo-total');
  const waContainer = document.getElementById('whatsapp-buttons-container');

  if (!tbody || !totalItemsSpan || !costoTotalSpan || !waContainer) return;

  if (compras.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:1.5rem;color:var(--text-soft);">La lista de compras está vacía.</td></tr>`;
    totalItemsSpan.textContent = '0';
    costoTotalSpan.textContent = fmt(0);
    waContainer.innerHTML = '';
    return;
  }

  let totalCosto = 0;
  const iva = datos.meta.iva || 0.16;

  tbody.innerHTML = compras.map(item => {
    const mat = materiales.find(m => m.descripcion === item.descripcion);
    const precioKgConIva = mat ? (mat.precio_kg_sin_iva * (1 + iva)) : 0;
    const prov = mat ? mat.proveedor : (item.proveedor || '-');
    const costoItemConIva = item.cantidad * precioKgConIva;
    totalCosto += costoItemConIva;

    return `
      <tr>
        <td><strong>${escapeHtml(item.descripcion)}</strong></td>
        <td><span class="pill">${escapeHtml(prov)}</span></td>
        <td class="num">
          <input type="number" step="0.1" min="0.01" class="table-edit-input num" style="text-align: right; max-width: 90px; padding: 0.25rem 0.4rem;" value="${item.cantidad}" oninput="actualizarCantidadCompra('${escapeHtml(item.descripcion)}', this)" />
        </td>
        <td class="num">${fmt(precioKgConIva)}</td>
        <td class="num" style="font-weight: bold;">${fmt(costoItemConIva)}</td>
        <td style="text-align: center;">
          <div class="btn-action-group">
            <button class="btn-action btn-action-save" title="Registrar compra recibida" onclick="abrirModalCompra('${escapeHtml(item.descripcion)}', ${item.cantidad}, true)">
              Registrar
            </button>
            <button class="btn-action btn-action-cancel" title="Eliminar" onclick="eliminarCompra('${escapeHtml(item.descripcion)}')">
              Eliminar
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  totalItemsSpan.textContent = compras.length;
  costoTotalSpan.textContent = fmt(totalCosto);

  // Crear botones de Whatsapp
  const proveedoresSet = new Set(compras.map(item => {
    const mat = materiales.find(m => m.descripcion === item.descripcion);
    return mat ? mat.proveedor : (item.proveedor || '-');
  }));
  const proveedores = Array.from(proveedoresSet).sort();

  let waButtonsHtml = '';
  proveedores.forEach(prov => {
    if (prov !== '-' && prov !== '') {
      waButtonsHtml += `
        <button class="btn-whatsapp" onclick="enviarWhatsAppProveedor('${escapeHtml(prov)}')">
          Pedir a ${escapeHtml(prov)}
        </button>
      `;
    }
  });

  if (compras.length > 0) {
    waButtonsHtml += `
      <button class="btn-primary" onclick="enviarWhatsAppCompleto()" style="background-color: var(--primary);">
        Enviar Lista Completa
      </button>
    `;
  }

  waContainer.innerHTML = waButtonsHtml;
}

window.enviarWhatsAppProveedor = function(proveedor) {
  const items = compras.filter(item => {
    const mat = materiales.find(m => m.descripcion === item.descripcion);
    const prov = mat ? mat.proveedor : (item.proveedor || '-');
    return prov === proveedor;
  });

  if (items.length === 0) return;

  let msg = `*Pedido de Materias Primas - ${proveedor}*\n\n`;
  msg += `Hola, me gustaría cotizar/pedir los siguientes insumos:\n\n`;
  
  items.forEach(item => {
    msg += `• *${item.descripcion}*: ${fmtNum(item.cantidad)} kg\n`;
  });

  msg += `\nTotal de artículos: ${items.length}\n`;
  msg += `¡Muchas gracias!`;

  const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
};

window.enviarWhatsAppCompleto = function() {
  if (compras.length === 0) return;

  const grouped = {};
  compras.forEach(item => {
    const mat = materiales.find(m => m.descripcion === item.descripcion);
    const prov = mat ? mat.proveedor : (item.proveedor || 'Sin Proveedor');
    if (!grouped[prov]) grouped[prov] = [];
    grouped[prov].push(item);
  });

  let msg = `*Lista Completa de Compras de Materias Primas*\n\n`;
  
  for (const prov in grouped) {
    msg += `*Proveedor: ${prov}*\n`;
    grouped[prov].forEach(item => {
      msg += `• ${item.descripcion}: ${fmtNum(item.cantidad)} kg\n`;
    });
    msg += `\n`;
  }

  msg += `Total de artículos diferentes: ${compras.length}\n`;
  msg += `¡Muchas gracias!`;

  const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
};

// =============================================================
// Operación: helpers compartidos
// =============================================================

function genId(prefix) {
  return prefix + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
}

function hoyISO() {
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function mesISO(fecha) {
  // "2026-05-15" → "2026-05"
  return (fecha || '').slice(0, 7);
}

function nombreMes(mesIso) {
  if (!mesIso) return '';
  const [y, m] = mesIso.split('-');
  const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  return `${meses[parseInt(m, 10) - 1]} ${y}`;
}

function fmtFecha(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function nombrePunto(punto_id) {
  const p = puntos.find(x => x.id === punto_id);
  return p ? p.nombre : '— Desconocido —';
}

function stockBadgeHTML(kg, infinito) {
  if (infinito) return `<span class="stock-badge ok">∞ continuo</span>`;
  const v = Number(kg) || 0;
  let cls = 'ok';
  if (v <= 0) cls = 'empty';
  else if (v < 1) cls = 'low';
  return `<span class="stock-badge ${cls}">${fmtNum(v)} kg</span>`;
}

// Migra el catálogo persistido en localStorage para incluir productos/materiales
// nuevos sin perder los stocks ni precios que el usuario ya editó.
function aplicarMigracionesCatalogo() {
  let cambios = false;

  // 0) Marcar Agua como stock continuo (no descuenta del inventario)
  const agua = materiales.find(m => m.descripcion === 'Agua');
  if (agua && agua.stock_infinito !== true) {
    agua.stock_infinito = true;
    cambios = true;
  }

  // 1) Asegurar materia prima "Base Pino Fresco"
  if (!materiales.find(m => m.descripcion === 'Base Pino Fresco')) {
    materiales.push({
      proveedor: 'ABC Quimicos',
      funcion: 'Aroma',
      descripcion: 'Base Pino Fresco',
      precio_kg_sin_iva: 181.03,
      precio_gr_sin_iva: 0.18103,
      precio_gr_con_iva: 0.2099948,
      stock_kg: 0,
    });
    cambios = true;
  }

  // 2) Renombrar "Fabuloso" → "Fabuloso Lavanda" (si aún tiene el nombre viejo)
  const fabViejo = productos.find(p => p.nombre === 'Fabuloso');
  if (fabViejo && !productos.find(p => p.nombre === 'Fabuloso Lavanda')) {
    fabViejo.nombre = 'Fabuloso Lavanda';
    cambios = true;
  }

  // 3) Agregar variantes Mar Fresco y Pino Fresco copiando la fórmula base
  const plantilla = productos.find(p => p.nombre === 'Fabuloso Lavanda');
  if (plantilla) {
    ['Fabuloso Mar Fresco', 'Fabuloso Pino Fresco'].forEach(nombre => {
      if (!productos.find(p => p.nombre === nombre)) {
        productos.push({
          nombre,
          costo_kg: plantilla.costo_kg,
          pv_publico: plantilla.pv_publico,
          pv_sugerido: plantilla.pv_sugerido,
          ganancia: plantilla.ganancia,
          componentes: plantilla.componentes.map(c => ({ ...c })),
        });
        cambios = true;
      }
    });
  }

  if (cambios) saveDatos();
}

// Asegura que cada punto tenga `productos_disponibles`. Asigna las listas
// reales para Chalco y Vicente Guerrero; otros puntos quedan con todo permitido.
function aplicarMigracionesPuntos() {
  let cambios = false;
  puntos.forEach(p => {
    if (!Array.isArray(p.productos_disponibles)) {
      const nombreNorm = (p.nombre || '').toLowerCase();
      if (p.id === 'pv_chalco' || nombreNorm.includes('chalco')) {
        p.productos_disponibles = PRODUCTOS_CHALCO.slice();
      } else if (p.id === 'pv_vguerrero' || nombreNorm.includes('vicente guerrero') || nombreNorm.includes('iztapalapa')) {
        p.productos_disponibles = PRODUCTOS_VGUERRERO.slice();
      } else {
        // Puntos nuevos / desconocidos: por defecto pueden dispensar todo
        p.productos_disponibles = productos.map(x => x.nombre);
      }
      cambios = true;
    }
  });
  if (cambios) savePuntos();
}

// Guardado en Supabase (fire-and-forget; errores van a la consola y banner)
function _onSyncErr(tabla) {
  return ({ error }) => { if (error) { console.error('Sync ' + tabla + ':', error); mostrarError('Sync ' + tabla + ': ' + error.message); } };
}
function savePuntos() {
  sb.from('puntos').upsert(puntos.map(puntoToRow)).then(_onSyncErr('puntos'));
}
function saveVentas() {
  sb.from('ventas').upsert(ventas.map(ventaToRow)).then(_onSyncErr('ventas'));
}
function saveResurtidos() {
  sb.from('resurtidos').upsert(resurtidos.map(resurtidoToRow)).then(_onSyncErr('resurtidos'));
}
function saveGastos() {
  sb.from('gastos').upsert(gastos.map(gastoToRow)).then(_onSyncErr('gastos'));
}
function saveCompras() {
  sb.from('compras').upsert(compras.map(compraToRow)).then(_onSyncErr('compras'));
}
function saveDatos() {
  sb.from('materiales').upsert(materiales.map(materialToRow)).then(_onSyncErr('materiales'));
  sb.from('productos').upsert(productos.map(productoToRow)).then(_onSyncErr('productos'));
}

// Devuelve [{material, kg}] de materias primas necesarias para producir kg de un producto
function materiasParaProducir(productoNombre, kg) {
  const p = productos.find(x => x.nombre === productoNombre);
    return p.componentes.map(c => {
    const mat = getMaterialForComponent(p.nombre, c.nombre);
    return {
      material: mat || null,
      componenteNombre: c.nombre,
      kg: (c.gr_por_kg / 1000) * kg,
    };
  });
}

// Refresca todos los selects que muestran puntos de venta
function refrescarSelectsPuntos() {
  // Puntos reales (excluyendo virtuales) para captura
  const reales = puntos.filter(p => p.id !== 'pv_venta_directa' && p.id !== 'pv_uso_personal');
  const activos = reales.filter(p => p.activo);
  const optsActivos = activos.map(p => `<option value="${p.id}">${escapeHtml(p.nombre)}</option>`).join('');
  
  // Todos los puntos (incluyendo virtuales) para filtros
  const optsTodos = puntos.map(p => `<option value="${p.id}">${escapeHtml(p.nombre)}${p.activo ? '' : ' (inactivo)'}</option>`).join('');

  // Selects de captura (solo puntos activos)
  ['venta-punto', 'resurt-punto'].forEach(id => {
    const sel = document.getElementById(id);
    if (sel) {
      const prev = sel.value;
      sel.innerHTML = optsActivos || '<option value="">— Sin puntos activos —</option>';
      if (prev && activos.some(p => p.id === prev)) sel.value = prev;
    }
  });

  // Select de gasto (puede ser sin asignar)
  const selGasto = document.getElementById('gasto-punto');
  if (selGasto) {
    const prev = selGasto.value;
    selGasto.innerHTML = '<option value="">— Sin asignar —</option>' + optsActivos;
    selGasto.value = prev;
  }

  // Filtros (incluyen inactivos y virtuales)
  ['filter-venta-punto', 'filter-resurt-punto', 'filter-gasto-punto'].forEach(id => {
    const sel = document.getElementById(id);
    if (sel) {
      const prev = sel.value;
      sel.innerHTML = '<option value="">Todos los puntos</option>' + optsTodos;
      sel.value = prev;
    }
  });
}

async function asegurarPuntosVirtuales() {
  let modificado = false;
  if (!puntos.some(p => p.id === 'pv_venta_directa')) {
    const nuevo = {
      id: 'pv_venta_directa',
      nombre: 'Ventas Directas (Fuera de máquina)',
      ubicacion: 'Bodega / Manual',
      activo: true,
      productos_disponibles: productos.map(p => p.nombre),
      creado_en: new Date().toISOString()
    };
    puntos.push(nuevo);
    await sb.from('puntos').upsert(puntoToRow(nuevo));
    modificado = true;
  }
  if (!puntos.some(p => p.id === 'pv_uso_personal')) {
    const nuevo = {
      id: 'pv_uso_personal',
      nombre: 'Uso Personal / Autoconsumo',
      ubicacion: 'Interno',
      activo: true,
      productos_disponibles: productos.map(p => p.nombre),
      creado_en: new Date().toISOString()
    };
    puntos.push(nuevo);
    await sb.from('puntos').upsert(puntoToRow(nuevo));
    modificado = true;
  }
  if (modificado) {
    savePuntos();
  }
}

function initPuntos() {
  document.getElementById('btn-agregar-punto').addEventListener('click', () => {
    const nombre = document.getElementById('punto-nombre').value.trim();
    const ubicacion = document.getElementById('punto-ubicacion').value.trim();
    if (!nombre) { mostrarError('El nombre del punto es obligatorio'); return; }
    puntos.push({
      id: genId('pv'),
      nombre, ubicacion,
      activo: true,
      productos_disponibles: productos.map(p => p.nombre),
      creado_en: new Date().toISOString(),
    });
    savePuntos();
    document.getElementById('punto-nombre').value = '';
    document.getElementById('punto-ubicacion').value = '';
    pintarPuntos();
    refrescarSelectsPuntos();
    renderDashboard();
  });
  pintarPuntos();
}

function pintarPuntos() {
  const grid = document.getElementById('puntos-grid');
  // Excluir los puntos de venta virtuales de la administración general
  const puntosFiltrados = puntos.filter(p => p.id !== 'pv_venta_directa' && p.id !== 'pv_uso_personal');
  if (puntosFiltrados.length === 0) {
    grid.innerHTML = `<div class="empty-state">No hay puntos de venta. Agrega uno arriba.</div>`;
    return;
  }
  grid.innerHTML = puntosFiltrados.map(p => {
    const ventasP = ventas.filter(v => v.punto_id === p.id);
    const gastosP = gastos.filter(g => g.punto_id === p.id);
    const resP = resurtidos.filter(r => r.punto_id === p.id);
    const totalVentas = ventasP.reduce((s, v) => s + (v.monto || 0), 0);
    const totalGastos = gastosP.reduce((s, g) => s + (g.monto || 0), 0);
    const totalKgResurtido = resP.reduce((s, r) => s + r.items.reduce((a, i) => a + i.kg, 0), 0);
    const dispensa = p.productos_disponibles || [];
    const chips = dispensa.length
      ? dispensa.map(n => `<span class="pill">${escapeHtml(n)}</span>`).join(' ')
      : '<span style="color:var(--text-soft);font-size:0.85rem;">Sin productos asignados</span>';
    return `
      <div class="punto-card ${p.activo ? '' : 'inactive'}">
        <div class="punto-nombre">${escapeHtml(p.nombre)}</div>
        ${p.ubicacion ? `<div class="punto-ubicacion">${escapeHtml(p.ubicacion)}</div>` : ''}
        <div style="margin-top:0.4rem;display:flex;flex-wrap:wrap;gap:0.3rem;">
          ${chips}
        </div>
        <div class="punto-stats">
          <div class="stat"><span class="label">Ventas acum.</span><span class="value">${fmt(totalVentas)}</span></div>
          <div class="stat"><span class="label">Gastos acum.</span><span class="value">${fmt(totalGastos)}</span></div>
          <div class="stat"><span class="label">Cortes</span><span class="value">${ventasP.length}</span></div>
          <div class="stat"><span class="label">Kg resurtidos</span><span class="value">${fmtNum(totalKgResurtido)}</span></div>
        </div>
        <div class="punto-actions">
          <button class="btn-action btn-action-edit" onclick="renombrarPunto('${p.id}')">Renombrar</button>
          <button class="btn-action btn-action-edit" onclick="editarProductosPunto('${p.id}')">Productos (${dispensa.length})</button>
          <button class="btn-action ${p.activo ? 'btn-action-cancel' : 'btn-action-save'}" onclick="togglePunto('${p.id}')">
            ${p.activo ? 'Desactivar' : 'Activar'}
          </button>
          <button class="btn-action btn-action-cancel" onclick="eliminarPunto('${p.id}')">Eliminar</button>
        </div>
      </div>
    `;
  }).join('');
}

window.editarProductosPunto = function(id) {
  const p = puntos.find(x => x.id === id);
  if (!p) return;
  const disponibles = new Set(p.productos_disponibles || []);
  const body = document.getElementById('modal-body');
  body.innerHTML = `
    <h3>Productos en ${escapeHtml(p.nombre)}</h3>
    <p class="hint">Marca los productos que esta máquina dispensa. El formulario de resurtido sólo mostrará estos.</p>
    <div style="display:flex;flex-direction:column;gap:0.4rem;margin:0.75rem 0;">
      ${productos.map(prod => `
        <label style="display:flex;align-items:center;gap:0.5rem;padding:0.4rem 0.6rem;border:1px solid var(--border);border-radius:6px;cursor:pointer;">
          <input type="checkbox" data-prod="${escapeHtml(prod.nombre)}" ${disponibles.has(prod.nombre) ? 'checked' : ''} />
          <span>${escapeHtml(prod.nombre)}</span>
        </label>
      `).join('')}
    </div>
    <div style="display:flex;justify-content:space-between;gap:0.5rem;flex-wrap:wrap;">
      <div style="display:flex;gap:0.4rem;">
        <button class="btn-secondary" id="modal-prod-all">Marcar todos</button>
        <button class="btn-secondary" id="modal-prod-none">Desmarcar todos</button>
      </div>
      <button class="btn-primary" id="modal-prod-save">Guardar</button>
    </div>
  `;
  document.getElementById('modal').hidden = false;

  const checks = body.querySelectorAll('input[type="checkbox"]');
  document.getElementById('modal-prod-all').addEventListener('click', () => checks.forEach(c => c.checked = true));
  document.getElementById('modal-prod-none').addEventListener('click', () => checks.forEach(c => c.checked = false));
  document.getElementById('modal-prod-save').addEventListener('click', () => {
    p.productos_disponibles = Array.from(checks).filter(c => c.checked).map(c => c.dataset.prod);
    savePuntos();
    document.getElementById('modal').hidden = true;
    pintarPuntos();
    // Re-aplicar filtro del resurtido si está abierto en ese punto
    filtrarSelectsResurtidoPorPunto();
  });
};

window.renombrarPunto = function(id) {
  const p = puntos.find(x => x.id === id);
  if (!p) return;
  const nuevoNombre = prompt('Nuevo nombre del punto:', p.nombre);
  if (nuevoNombre === null) return;
  const nuevaUbic = prompt('Ubicación (opcional):', p.ubicacion || '');
  if (nuevaUbic === null) return;
  p.nombre = nuevoNombre.trim() || p.nombre;
  p.ubicacion = nuevaUbic.trim();
  savePuntos();
  pintarPuntos();
  refrescarSelectsPuntos();
  pintarVentas(); pintarResurtidos(); pintarGastos();
  renderDashboard();
};

window.togglePunto = function(id) {
  const p = puntos.find(x => x.id === id);
  if (!p) return;
  p.activo = !p.activo;
  savePuntos();
  pintarPuntos();
  refrescarSelectsPuntos();
};

window.eliminarPunto = function(id) {
  const ventasP = ventas.filter(v => v.punto_id === id).length;
  const resP = resurtidos.filter(r => r.punto_id === id).length;
  const gastosP = gastos.filter(g => g.punto_id === id).length;
  let msg = '¿Eliminar este punto de venta?';
  if (ventasP + resP + gastosP > 0) {
    msg += `\n\nTiene asociados: ${ventasP} venta(s), ${resP} resurtido(s), ${gastosP} gasto(s). Esos registros se conservarán pero quedarán como "Desconocido". Mejor desactívalo en vez de eliminarlo si quieres mantener el historial legible.`;
  }
  if (!confirm(msg)) return;
  sb.from('puntos').delete().eq('id', id).then(_onSyncErr('puntos'));
  puntos = puntos.filter(x => x.id !== id);
  pintarPuntos();
  refrescarSelectsPuntos();
  pintarVentas(); pintarResurtidos(); pintarGastos();
  renderDashboard();
};

// =============================================================
// Operación: sub-tabs + init
// =============================================================

function initOperacion() {
  // Sub-tabs
  document.querySelectorAll('.subtab').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.subview;
      document.querySelectorAll('.subtab').forEach(b => b.classList.toggle('active', b === btn));
      document.querySelectorAll('.subview').forEach(v => v.classList.toggle('active', v.id === `subview-${target}`));
    });
  });

  initVentas();
  initResurtidos();
  initGastos();
  initDirectas();
  refrescarSelectsPuntos();
}

// =============================================================
// Ventas
// =============================================================

function initVentas() {
  document.getElementById('venta-fecha').value = hoyISO();
  document.getElementById('btn-guardar-venta').addEventListener('click', guardarVenta);
  document.getElementById('btn-importar-ventas').addEventListener('click', abrirModalImportVentas);
  ['filter-venta-punto', 'filter-venta-mes'].forEach(id => {
    document.getElementById(id).addEventListener('change', pintarVentas);
  });
  pintarVentas();
}

// =============================================================
// Importación bulk de ventas históricas
// =============================================================

function abrirModalImportVentas() {
  const body = document.getElementById('modal-body');
  const ejemplosPuntos = puntos.map(p => p.nombre).join(', ');
  body.innerHTML = `
    <h3>Importar ventas históricas</h3>
    <p class="hint">Pega una venta por línea. Formatos aceptados:</p>
    <ul style="font-size:0.85rem;color:var(--text-soft);margin:0 0 0.75rem 1rem;">
      <li><code>fecha, punto, monto</code> (separado por coma)</li>
      <li><code>fecha &lt;tab&gt; punto &lt;tab&gt; monto</code> (pegado directo desde Excel)</li>
      <li>Fecha: <code>AAAA-MM-DD</code> o <code>DD/MM/AAAA</code></li>
      <li>4ta columna opcional: notas</li>
      <li>Alias: <strong>"Princess" se mapea al punto Vicente Guerrero</strong></li>
    </ul>
    <p style="font-size:0.85rem;color:var(--text-soft);margin:0 0 0.5rem;">
      Puntos disponibles: <em>${escapeHtml(ejemplosPuntos)}</em>
    </p>
    <textarea id="import-textarea" rows="8" style="width:100%;font-family:monospace;font-size:0.85rem;padding:0.5rem;border:1px solid var(--border);border-radius:6px;" placeholder="2025-04-15, Chalco, 1200&#10;2025-04-15, Princess, 950, mantenimiento&#10;2025-05-15, Chalco, 1350"></textarea>
    <div style="display:flex;justify-content:space-between;gap:0.5rem;margin-top:0.75rem;flex-wrap:wrap;">
      <button class="btn-secondary" id="import-preview-btn">Vista previa</button>
      <div style="display:flex;gap:0.5rem;">
        <button class="btn-secondary" id="import-cancel-btn">Cancelar</button>
        <button class="btn-primary" id="import-commit-btn" disabled>Importar 0 cortes</button>
      </div>
    </div>
    <div id="import-preview"></div>
  `;
  document.getElementById('modal').hidden = false;

  let entradasOk = [];
  const btnCommit = document.getElementById('import-commit-btn');
  const btnPreview = document.getElementById('import-preview-btn');

  btnPreview.addEventListener('click', () => {
    const texto = document.getElementById('import-textarea').value;
    const { entradas, errores } = parsearImportVentas(texto);
    entradasOk = entradas;
    btnCommit.disabled = entradas.length === 0;
    btnCommit.textContent = `Importar ${entradas.length} cortes`;
    pintarPreviewImport(entradas, errores);
  });

  btnCommit.addEventListener('click', () => {
    if (entradasOk.length === 0) return;
    if (!confirm(`Se agregarán ${entradasOk.length} cortes al histórico. ¿Continuar?`)) return;
    entradasOk.forEach(e => {
      ventas.push({
        id: genId('v'),
        fecha: e.fecha,
        punto_id: e.punto_id,
        monto: e.monto,
        notas: e.notas || '',
      });
    });
    saveVentas();
    document.getElementById('modal').hidden = true;
    pintarVentas();
    renderDashboard();
  });

  document.getElementById('import-cancel-btn').addEventListener('click', () => {
    document.getElementById('modal').hidden = true;
  });
}

function pintarPreviewImport(entradas, errores) {
  const cont = document.getElementById('import-preview');
  let html = '';
  if (errores.length > 0) {
    html += `<div class="stock-warning" style="margin-top:0.75rem;"><strong>Errores (${errores.length}):</strong><ul>${errores.map(e => `<li>${escapeHtml(e)}</li>`).join('')}</ul></div>`;
  }
  if (entradas.length > 0) {
    html += `<div style="margin-top:0.75rem;"><strong>Listos para importar (${entradas.length}):</strong></div>`;
    html += `<div class="table-wrap" style="margin-top:0.4rem;max-height:240px;overflow-y:auto;"><table><thead><tr><th>Fecha</th><th>Punto</th><th class="num">Monto</th><th>Notas</th></tr></thead><tbody>`;
    entradas.forEach(e => {
      html += `<tr><td>${fmtFecha(e.fecha)}</td><td>${escapeHtml(e.punto_nombre)}</td><td class="num">${fmt(e.monto)}</td><td>${escapeHtml(e.notas || '')}</td></tr>`;
    });
    html += `</tbody></table></div>`;
  } else if (errores.length === 0) {
    html += `<div class="empty-state" style="margin-top:0.75rem;">No hay líneas para importar</div>`;
  }
  cont.innerHTML = html;
}

function parsearImportVentas(texto) {
  const errores = [];
  const entradas = [];
  texto.split(/\r?\n/).forEach((linea, i) => {
    const l = linea.trim();
    if (!l) return;
    let cols;
    if (l.includes('\t')) cols = l.split('\t');
    else if (l.includes(';')) cols = l.split(';');
    else cols = l.split(',');
    cols = cols.map(c => c.trim());

    if (cols.length < 3) {
      errores.push(`Línea ${i + 1}: faltan columnas (necesito fecha, punto, monto)`);
      return;
    }
    const [fechaStr, puntoStr, montoStr, ...rest] = cols;
    const notas = rest.join(',').trim();

    const fecha = parsearFechaImport(fechaStr);
    if (!fecha) {
      errores.push(`Línea ${i + 1}: fecha inválida "${fechaStr}" (usa AAAA-MM-DD o DD/MM/AAAA)`);
      return;
    }
    const punto = matcheoPuntoImport(puntoStr);
    if (!punto) {
      errores.push(`Línea ${i + 1}: no encuentro el punto "${puntoStr}"`);
      return;
    }
    const monto = parseFloat(montoStr.replace(/[$,\s]/g, ''));
    if (isNaN(monto) || monto < 0) {
      errores.push(`Línea ${i + 1}: monto inválido "${montoStr}"`);
      return;
    }
    entradas.push({ fecha, punto_id: punto.id, punto_nombre: punto.nombre, monto, notas });
  });
  return { entradas, errores };
}

function parsearFechaImport(s) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const m = s.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/);
  if (m) {
    const [, d, mo, y] = m;
    return `${y}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  return null;
}

function matcheoPuntoImport(s) {
  const norm = s.toLowerCase().trim();
  // Match exacto
  let p = puntos.find(x => x.nombre.toLowerCase() === norm);
  if (p) return p;
  // Alias: "princess" → Vicente Guerrero
  if (norm.includes('princess')) {
    p = puntos.find(x => x.nombre.toLowerCase().includes('vicente guerrero'));
    if (p) return p;
  }
  // Match parcial bidireccional
  p = puntos.find(x => {
    const n = x.nombre.toLowerCase();
    return n.includes(norm) || norm.includes(n);
  });
  return p || null;
}

function guardarVenta() {
  const fecha = document.getElementById('venta-fecha').value;
  const punto_id = document.getElementById('venta-punto').value;
  const monto = parseFloat(document.getElementById('venta-monto').value);
  const notas = document.getElementById('venta-notas').value.trim();

  if (!fecha) { mostrarError('Selecciona una fecha'); return; }
  if (!punto_id) { mostrarError('Selecciona un punto de venta'); return; }
  if (isNaN(monto) || monto < 0) { mostrarError('El monto debe ser un número válido'); return; }

  ventas.push({ id: genId('v'), fecha, punto_id, monto, notas });
  saveVentas();

  document.getElementById('venta-monto').value = '';
  document.getElementById('venta-notas').value = '';
  pintarVentas();
  renderDashboard();
}

window.eliminarVenta = function(id) {
  if (!confirm('¿Eliminar este corte de ventas?')) return;
  sb.from('ventas').delete().eq('id', id).then(_onSyncErr('ventas'));
  ventas = ventas.filter(v => v.id !== id);
  pintarVentas();
  renderDashboard();
};

function pintarVentas() {
  const fProv = document.getElementById('filter-venta-punto');
  const fMes = document.getElementById('filter-venta-mes');
  if (!fProv || !fMes) return;

  // Actualizar filtro de meses con los meses disponibles
  const mesesDisp = [...new Set(ventas.map(v => mesISO(v.fecha)))].sort().reverse();
  const prevMes = fMes.value;
  fMes.innerHTML = '<option value="">Todos los meses</option>' + mesesDisp.map(m => `<option value="${m}">${nombreMes(m)}</option>`).join('');
  fMes.value = prevMes;

  const fp = fProv.value;
  const fm = fMes.value;
  const lista = ventas
    .filter(v => (!fp || v.punto_id === fp) && (!fm || mesISO(v.fecha) === fm))
    .sort((a, b) => b.fecha.localeCompare(a.fecha));

  const total = lista.reduce((s, v) => s + v.monto, 0);
  const resumen = document.getElementById('ventas-resumen');
  resumen.innerHTML = `
    <div class="item"><span class="label">Cortes:</span> <span class="value">${lista.length}</span></div>
    <div class="item"><span class="label">Total vendido:</span> <span class="value success">${fmt(total)}</span></div>
    <div class="item"><span class="label">Promedio por corte:</span> <span class="value">${fmt(lista.length ? total / lista.length : 0)}</span></div>
  `;

  const tbody = document.querySelector('#ventas-table tbody');
  if (lista.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:1.5rem;color:var(--text-soft);">Sin ventas registradas</td></tr>`;
    return;
  }
  tbody.innerHTML = lista.map(v => `
    <tr>
      <td>${fmtFecha(v.fecha)}</td>
      <td>${escapeHtml(nombrePunto(v.punto_id))}</td>
      <td class="num"><strong>${fmt(v.monto)}</strong></td>
      <td>${escapeHtml(v.notas || '')}</td>
      <td style="text-align:center;">
        <button class="btn-action btn-action-cancel" onclick="eliminarVenta('${v.id}')">Eliminar</button>
      </td>
    </tr>
  `).join('');
}

// =============================================================
// Resurtidos
// =============================================================

let resurtItems = []; // estado del formulario: [{producto_nombre, kg}]

function initResurtidos() {
  document.getElementById('resurt-fecha').value = hoyISO();
  document.getElementById('btn-resurt-add-row').addEventListener('click', () => {
    const dispon = productosDelPuntoSeleccionado();
    const primer = dispon[0] || productos[0]?.nombre || '';
    resurtItems.push({ producto_nombre: primer, kg: 0 });
    pintarResurtItems();
  });
  document.getElementById('btn-guardar-resurtido').addEventListener('click', guardarResurtido);
  ['filter-resurt-punto', 'filter-resurt-mes'].forEach(id => {
    document.getElementById(id).addEventListener('change', pintarResurtidos);
  });

  // Cuando cambia el punto seleccionado, refrescar productos disponibles
  document.getElementById('resurt-punto').addEventListener('change', filtrarSelectsResurtidoPorPunto);

  // Iniciar con una fila vacía
  if (resurtItems.length === 0 && productos.length > 0) {
    const dispon = productosDelPuntoSeleccionado();
    resurtItems.push({ producto_nombre: dispon[0] || productos[0].nombre, kg: 0 });
  }
  pintarResurtItems();
  pintarResurtidos();
}

// Devuelve los nombres de productos disponibles en el punto actualmente
// seleccionado en el form de resurtido. Si no hay punto, retorna todos.
function productosDelPuntoSeleccionado() {
  const puntoId = document.getElementById('resurt-punto')?.value;
  const p = puntos.find(x => x.id === puntoId);
  if (p && Array.isArray(p.productos_disponibles) && p.productos_disponibles.length > 0) {
    return p.productos_disponibles;
  }
  return productos.map(x => x.nombre);
}

// Cuando cambia el punto: limpiar items que ya no aplican y re-pintar
function filtrarSelectsResurtidoPorPunto() {
  const disponibles = new Set(productosDelPuntoSeleccionado());
  // Cualquier item con producto que ya no aplica se cambia al primero disponible
  const primerDisp = [...disponibles][0] || productos[0]?.nombre || '';
  resurtItems.forEach(it => {
    if (!disponibles.has(it.producto_nombre)) it.producto_nombre = primerDisp;
  });
  pintarResurtItems();
}

function pintarResurtItems() {
  const tbody = document.querySelector('#resurt-items-table tbody');
  if (resurtItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:1rem;color:var(--text-soft);">Agrega un producto al resurtido</td></tr>`;
    document.getElementById('resurt-stock-aviso').innerHTML = '';
    return;
  }
  const dispon = productosDelPuntoSeleccionado();
  const productosFiltrados = productos.filter(pp => dispon.includes(pp.nombre));
  tbody.innerHTML = resurtItems.map((it, i) => {
    const p = productos.find(x => x.nombre === it.producto_nombre);
    const costo = p ? (p.costo_kg * (it.kg || 0)) : 0;
    return `
      <tr>
        <td>
          <select onchange="resurtCambiarProducto(${i}, this.value)" style="min-width:160px;">
            ${productosFiltrados.map(pp => `<option value="${escapeHtml(pp.nombre)}" ${pp.nombre === it.producto_nombre ? 'selected' : ''}>${escapeHtml(pp.nombre)}</option>`).join('')}
          </select>
        </td>
        <td class="num">
          <input type="number" min="0" step="0.1" value="${it.kg}" oninput="resurtCambiarKg(${i}, this.value)" class="table-edit-input num" style="text-align:right; max-width:100px;" />
        </td>
        <td class="num">${fmt(costo)}</td>
        <td style="text-align:center;">
          <button class="btn-action btn-action-cancel" onclick="resurtQuitarFila(${i})">×</button>
        </td>
      </tr>
    `;
  }).join('');

  actualizarAvisoStock();
}

window.resurtCambiarProducto = function(idx, val) {
  if (resurtItems[idx]) { resurtItems[idx].producto_nombre = val; pintarResurtItems(); }
};
window.resurtCambiarKg = function(idx, val) {
  const v = parseFloat(val) || 0;
  if (resurtItems[idx]) { resurtItems[idx].kg = v; pintarResurtItems(); }
};
window.resurtQuitarFila = function(idx) {
  resurtItems.splice(idx, 1);
  pintarResurtItems();
};

function calcularConsumoMaterias(items) {
  // Retorna Map<descripcion_material, kg_necesarios>
  const consumo = new Map();
  const sinMapeo = []; // componentes sin material asociado
  items.forEach(it => {
    if (!it.kg || it.kg <= 0) return;
    materiasParaProducir(it.producto_nombre, it.kg).forEach(req => {
      if (!req.material) {
        sinMapeo.push({ componente: req.componenteNombre, producto: it.producto_nombre, kg: req.kg });
        return;
      }
      // Stock continuo (ej. Agua de la red): no se descuenta del inventario
      if (req.material.stock_infinito) return;
      const acc = consumo.get(req.material.descripcion) || 0;
      consumo.set(req.material.descripcion, acc + req.kg);
    });
  });
  return { consumo, sinMapeo };
}

function actualizarAvisoStock() {
  const cont = document.getElementById('resurt-stock-aviso');
  const { consumo, sinMapeo } = calcularConsumoMaterias(resurtItems);
  if (consumo.size === 0 && sinMapeo.length === 0) { cont.innerHTML = ''; return; }

  const faltantes = [];
  consumo.forEach((kg, desc) => {
    const mat = materiales.find(m => m.descripcion === desc);
    if (mat && mat.stock_kg < kg) {
      faltantes.push({ desc, requerido: kg, disponible: mat.stock_kg, falta: kg - mat.stock_kg });
    }
  });

  if (faltantes.length === 0 && sinMapeo.length === 0) {
    cont.innerHTML = '';
    return;
  }

  let html = '<div class="stock-warning"><strong>Aviso de inventario:</strong>';
  if (faltantes.length > 0) {
    html += '<div style="margin-top:0.3rem;">Stock insuficiente para:</div><ul>';
    faltantes.forEach(f => {
      html += `<li><strong>${escapeHtml(f.desc)}</strong>: necesitas ${fmtNum(f.requerido)} kg, tienes ${fmtNum(f.disponible)} kg (faltan ${fmtNum(f.falta)} kg)</li>`;
    });
    html += '</ul>';
  }
  if (sinMapeo.length > 0) {
    const unicos = [...new Set(sinMapeo.map(x => x.componente))];
    html += `<div style="margin-top:0.3rem;">No se pudo mapear a una materia prima: <em>${unicos.map(escapeHtml).join(', ')}</em> (no se descontará).</div>`;
  }
  html += '</div>';
  cont.innerHTML = html;
}

function guardarResurtido() {
  const fecha = document.getElementById('resurt-fecha').value;
  const punto_id = document.getElementById('resurt-punto').value;
  const notas = document.getElementById('resurt-notas').value.trim();

  if (!fecha) { mostrarError('Selecciona una fecha'); return; }
  if (!punto_id) { mostrarError('Selecciona un punto de venta'); return; }

  const items = resurtItems.filter(it => it.kg > 0 && it.producto_nombre);
  if (items.length === 0) { mostrarError('Agrega al menos un producto con kg mayor a 0'); return; }

  // Verificar stock
  const { consumo } = calcularConsumoMaterias(items);
  const faltantes = [];
  consumo.forEach((kg, desc) => {
    const mat = materiales.find(m => m.descripcion === desc);
    if (mat && mat.stock_kg < kg) faltantes.push(desc);
  });
  if (faltantes.length > 0) {
    if (!confirm(`Stock insuficiente para: ${faltantes.join(', ')}.\n\n¿Guardar de todos modos? (el stock quedará en negativo)`)) return;
  }

  // Snapshot del costo
  const itemsConCosto = items.map(it => {
    const p = productos.find(x => x.nombre === it.producto_nombre);
    return { producto_nombre: it.producto_nombre, kg: it.kg, costo_kg_unit: p ? p.costo_kg : 0 };
  });

  // Descontar stock
  consumo.forEach((kg, desc) => {
    const mat = materiales.find(m => m.descripcion === desc);
    if (mat) mat.stock_kg = +(mat.stock_kg - kg).toFixed(4);
  });

  resurtidos.push({ id: genId('r'), fecha, punto_id, items: itemsConCosto, notas });
  saveResurtidos();
  saveDatos();

  // Reset formulario
  resurtItems = [{ producto_nombre: productos[0]?.nombre || '', kg: 0 }];
  document.getElementById('resurt-notas').value = '';
  document.getElementById('resurt-fecha').value = hoyISO();

  pintarResurtItems();
  pintarResurtidos();
  pintarMateriales(
    document.getElementById('search-materiales')?.value || '',
    document.getElementById('filter-proveedor')?.value || '',
    document.getElementById('filter-funcion')?.value || ''
  );
  renderDashboard();
}

window.eliminarResurtido = function(id) {
  const r = resurtidos.find(x => x.id === id);
  if (!r) return;
  if (!confirm('¿Eliminar este resurtido? Las materias primas descontadas se restituirán al inventario.')) return;
  // Restituir stock
  const { consumo } = calcularConsumoMaterias(r.items);
  consumo.forEach((kg, desc) => {
    const mat = materiales.find(m => m.descripcion === desc);
    if (mat) mat.stock_kg = +(mat.stock_kg + kg).toFixed(4);
  });
  sb.from('resurtidos').delete().eq('id', id).then(_onSyncErr('resurtidos'));
  resurtidos = resurtidos.filter(x => x.id !== id);
  saveDatos();
  pintarResurtidos();
  pintarMateriales(
    document.getElementById('search-materiales')?.value || '',
    document.getElementById('filter-proveedor')?.value || '',
    document.getElementById('filter-funcion')?.value || ''
  );
  renderDashboard();
};

function pintarResurtidos() {
  const fProv = document.getElementById('filter-resurt-punto');
  const fMes = document.getElementById('filter-resurt-mes');
  if (!fProv || !fMes) return;

  const mesesDisp = [...new Set(resurtidos.map(r => mesISO(r.fecha)))].sort().reverse();
  const prevMes = fMes.value;
  fMes.innerHTML = '<option value="">Todos los meses</option>' + mesesDisp.map(m => `<option value="${m}">${nombreMes(m)}</option>`).join('');
  fMes.value = prevMes;

  const fp = fProv.value;
  const fm = fMes.value;
  const lista = resurtidos
    .filter(r => (!fp || r.punto_id === fp) && (!fm || mesISO(r.fecha) === fm))
    .sort((a, b) => b.fecha.localeCompare(a.fecha));

  // Resumen + producto más entregado
  let totalKg = 0;
  let totalCosto = 0;
  const kgPorProd = new Map();
  lista.forEach(r => r.items.forEach(it => {
    totalKg += it.kg;
    totalCosto += it.kg * (it.costo_kg_unit || 0);
    kgPorProd.set(it.producto_nombre, (kgPorProd.get(it.producto_nombre) || 0) + it.kg);
  }));
  const masResurtido = [...kgPorProd.entries()].sort((a, b) => b[1] - a[1])[0];

  document.getElementById('resurtidos-resumen').innerHTML = `
    <div class="item"><span class="label">Resurtidos:</span> <span class="value">${lista.length}</span></div>
    <div class="item"><span class="label">Kg totales:</span> <span class="value">${fmtNum(totalKg)}</span></div>
    <div class="item"><span class="label">Costo de producción:</span> <span class="value">${fmt(totalCosto)}</span></div>
    <div class="item"><span class="label">Producto más entregado:</span> <span class="value">${masResurtido ? `${escapeHtml(masResurtido[0])} (${fmtNum(masResurtido[1])} kg)` : '—'}</span></div>
  `;

  const tbody = document.querySelector('#resurtidos-table tbody');
  if (lista.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:1.5rem;color:var(--text-soft);">Sin resurtidos registrados</td></tr>`;
    return;
  }
  tbody.innerHTML = lista.map(r => {
    const kg = r.items.reduce((s, i) => s + i.kg, 0);
    const costo = r.items.reduce((s, i) => s + i.kg * (i.costo_kg_unit || 0), 0);
    const detalle = r.items.map(i => `${escapeHtml(i.producto_nombre)} (${fmtNum(i.kg)} kg)`).join(', ');
    return `
      <tr>
        <td>${fmtFecha(r.fecha)}</td>
        <td>${escapeHtml(nombrePunto(r.punto_id))}</td>
        <td>${detalle}${r.notas ? `<br><small style="color:var(--text-soft);">${escapeHtml(r.notas)}</small>` : ''}</td>
        <td class="num">${fmtNum(kg)}</td>
        <td class="num">${fmt(costo)}</td>
        <td style="text-align:center;">
          <button class="btn-action btn-action-cancel" onclick="eliminarResurtido('${r.id}')">Eliminar</button>
        </td>
      </tr>
    `;
  }).join('');
}

// =============================================================
// Gastos
// =============================================================

function initGastos() {
  document.getElementById('gasto-fecha').value = hoyISO();
  document.getElementById('btn-guardar-gasto').addEventListener('click', guardarGasto);
  ['filter-gasto-punto', 'filter-gasto-mes', 'filter-gasto-categoria'].forEach(id => {
    document.getElementById(id).addEventListener('change', pintarGastos);
  });
  pintarGastos();
}

function guardarGasto() {
  const fecha = document.getElementById('gasto-fecha').value;
  const categoria = document.getElementById('gasto-categoria').value.trim();
  const descripcion = document.getElementById('gasto-descripcion').value.trim();
  const punto_id = document.getElementById('gasto-punto').value;
  const monto = parseFloat(document.getElementById('gasto-monto').value);

  if (!fecha) { mostrarError('Selecciona una fecha'); return; }
  if (!categoria) { mostrarError('Indica una categoría'); return; }
  if (isNaN(monto) || monto < 0) { mostrarError('El monto debe ser un número válido'); return; }

  gastos.push({ id: genId('g'), fecha, categoria, descripcion, punto_id: punto_id || '', monto });
  saveGastos();

  document.getElementById('gasto-descripcion').value = '';
  document.getElementById('gasto-monto').value = '';
  pintarGastos();
  renderDashboard();
}

window.eliminarGasto = function(id) {
  if (!confirm('¿Eliminar este gasto?')) return;
  sb.from('gastos').delete().eq('id', id).then(_onSyncErr('gastos'));
  gastos = gastos.filter(g => g.id !== id);
  pintarGastos();
  renderDashboard();
};

function pintarGastos() {
  const fProv = document.getElementById('filter-gasto-punto');
  const fMes = document.getElementById('filter-gasto-mes');
  const fCat = document.getElementById('filter-gasto-categoria');
  if (!fProv || !fMes || !fCat) return;

  const mesesDisp = [...new Set(gastos.map(g => mesISO(g.fecha)))].sort().reverse();
  const prevMes = fMes.value;
  fMes.innerHTML = '<option value="">Todos los meses</option>' + mesesDisp.map(m => `<option value="${m}">${nombreMes(m)}</option>`).join('');
  fMes.value = prevMes;

  const catsDisp = [...new Set(gastos.map(g => g.categoria))].sort();
  const prevCat = fCat.value;
  fCat.innerHTML = '<option value="">Todas las categorías</option>' + catsDisp.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');
  fCat.value = prevCat;

  const fp = fProv.value;
  const fm = fMes.value;
  const fc = fCat.value;
  const lista = gastos
    .filter(g => (!fp || g.punto_id === fp) && (!fm || mesISO(g.fecha) === fm) && (!fc || g.categoria === fc))
    .sort((a, b) => b.fecha.localeCompare(a.fecha));

  const total = lista.reduce((s, g) => s + g.monto, 0);
  document.getElementById('gastos-resumen').innerHTML = `
    <div class="item"><span class="label">Gastos:</span> <span class="value">${lista.length}</span></div>
    <div class="item"><span class="label">Total:</span> <span class="value" style="color:var(--danger);font-weight:700;">${fmt(total)}</span></div>
  `;

  const tbody = document.querySelector('#gastos-table tbody');
  if (lista.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:1.5rem;color:var(--text-soft);">Sin gastos registrados</td></tr>`;
    return;
  }
  tbody.innerHTML = lista.map(g => `
    <tr>
      <td>${fmtFecha(g.fecha)}</td>
      <td><span class="pill">${escapeHtml(g.categoria)}</span></td>
      <td>${escapeHtml(g.descripcion || '')}</td>
      <td>${g.punto_id ? escapeHtml(nombrePunto(g.punto_id)) : '<span style="color:var(--text-soft);">—</span>'}</td>
      <td class="num"><strong>${fmt(g.monto)}</strong></td>
      <td style="text-align:center;">
        <button class="btn-action btn-action-cancel" onclick="eliminarGasto('${g.id}')">Eliminar</button>
      </td>
    </tr>
  `).join('');
}

// =============================================================
// Dashboard: cards de operación
// =============================================================

// Sobreescribir renderDashboard para incluir resumen de operación
const _renderDashboardOriginal = renderDashboard;
renderDashboard = function() {
  _renderDashboardOriginal();
  const cont = document.getElementById('dashboard-cards');
  if (!cont || !puntos) return;

  const mesActual = mesISO(hoyISO());
  const ventasMes = ventas.filter(v => mesISO(v.fecha) === mesActual).reduce((s, v) => s + v.monto, 0);
  const gastosMes = gastos.filter(g => mesISO(g.fecha) === mesActual).reduce((s, g) => s + g.monto, 0);
  const resurtMes = resurtidos
    .filter(r => mesISO(r.fecha) === mesActual)
    .reduce((s, r) => s + r.items.reduce((a, i) => a + i.kg * (i.costo_kg_unit || 0), 0), 0);
  const utilidadMes = ventasMes - gastosMes - resurtMes;

  // Producto más resurtido en total (proxy del más vendido)
  const kgPorProd = new Map();
  resurtidos.forEach(r => r.items.forEach(it => {
    kgPorProd.set(it.producto_nombre, (kgPorProd.get(it.producto_nombre) || 0) + it.kg);
  }));
  const masResurtido = [...kgPorProd.entries()].sort((a, b) => b[1] - a[1])[0];
  const puntosReales = puntos.filter(p => p.id !== 'pv_venta_directa' && p.id !== 'pv_uso_personal');
  const puntosActivos = puntosReales.filter(p => p.activo).length;

  cont.insertAdjacentHTML('beforeend', `
    <div class="card">
      <div class="card-title">Ventas — ${nombreMes(mesActual)}</div>
      <div class="big-number" style="color:var(--success);font-size:1.5rem;">${fmt(ventasMes)}</div>
      <div class="card-row">
        <span class="label">Costo resurtidos</span>
        <span class="value">${fmt(resurtMes)}</span>
      </div>
      <div class="card-row">
        <span class="label">Gastos</span>
        <span class="value" style="color:var(--danger);">${fmt(gastosMes)}</span>
      </div>
      <div class="card-row">
        <span class="label">Utilidad estimada</span>
        <span class="value ${utilidadMes >= 0 ? 'success' : ''}" style="${utilidadMes < 0 ? 'color:var(--danger);' : ''}">${fmt(utilidadMes)}</span>
      </div>
    </div>
    <div class="card">
      <div class="card-title">Más resurtido (histórico)</div>
      <div class="big-number" style="color:var(--warning);font-size:1.4rem;">${masResurtido ? escapeHtml(masResurtido[0]) : '—'}</div>
      <div class="card-row">
        <span class="label">Kg entregados</span>
        <span class="value">${masResurtido ? fmtNum(masResurtido[1]) + ' kg' : '0'}</span>
      </div>
    </div>
    <div class="card">
      <div class="card-title">Puntos activos</div>
      <div class="big-number">${puntosActivos}</div>
      <div class="sub" style="color:var(--text-soft);font-size:0.85rem;">de ${puntosReales.length} totales</div>
    </div>
    <div class="card">
      <div class="card-title">Inventario bajo</div>
      <div class="big-number" style="color:var(--danger);font-size:1.5rem;">${materiales.filter(m => !m.stock_infinito && m.stock_kg < 1).length}</div>
      <div class="sub" style="color:var(--text-soft);font-size:0.85rem;">materias primas con &lt; 1 kg</div>
    </div>
  `);
};

// =============================================================
// Ventas Directas / Uso Personal
// =============================================================
let directaItems = []; // estado del formulario: [{producto_nombre, kg}]

function initDirectas() {
  document.getElementById('directa-fecha').value = hoyISO();
  
  document.getElementById('btn-directa-add-row').addEventListener('click', () => {
    const primer = productos[0]?.nombre || '';
    directaItems.push({ producto_nombre: primer, kg: 0 });
    pintarDirectaItems();
  });
  
  document.getElementById('btn-guardar-directa').addEventListener('click', guardarDirecta);
  
  document.getElementById('directa-tipo').addEventListener('change', (e) => {
    const tipo = e.target.value;
    const montoField = document.getElementById('directa-monto');
    if (tipo === 'uso') {
      montoField.value = '0.00';
      montoField.disabled = true;
    } else {
      montoField.disabled = false;
      actualizarMontoSugeridoDirecta();
    }
  });

  if (directaItems.length === 0 && productos.length > 0) {
    directaItems.push({ producto_nombre: productos[0].nombre, kg: 0 });
  }
  
  pintarDirectaItems();
}

function pintarDirectaItems() {
  const tbody = document.querySelector('#directa-items-table tbody');
  if (!tbody) return;
  
  if (directaItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:1rem;color:var(--text-soft);">Agrega un producto a la salida</td></tr>`;
    document.getElementById('directa-stock-aviso').innerHTML = '';
    return;
  }
  
  tbody.innerHTML = directaItems.map((it, i) => {
    const p = productos.find(x => x.nombre === it.producto_nombre);
    const precioUnit = p ? (p.pv_sugerido || p.pv_publico || 0) : 0;
    const precioSugeridoTotal = precioUnit * (it.kg || 0);
    
    return `
      <tr>
        <td>
          <select onchange="directaCambiarProducto(${i}, this.value)" style="min-width:160px;">
            ${productos.map(pp => `<option value="${escapeHtml(pp.nombre)}" ${pp.nombre === it.producto_nombre ? 'selected' : ''}>${escapeHtml(pp.nombre)}</option>`).join('')}
          </select>
        </td>
        <td class="num">
          <input type="number" min="0" step="0.1" value="${it.kg}" oninput="directaCambiarKg(${i}, this.value)" class="table-edit-input num" style="text-align:right; max-width:100px;" />
        </td>
        <td class="num">${fmt(precioSugeridoTotal)}</td>
        <td style="text-align:center;">
          <button class="btn-action btn-action-cancel" onclick="directaQuitarFila(${i})">×</button>
        </td>
      </tr>
    `;
  }).join('');
  
  actualizarAvisoStockDirecta();
  actualizarMontoSugeridoDirecta();
}

window.directaCambiarProducto = function(idx, val) {
  if (directaItems[idx]) { 
    directaItems[idx].producto_nombre = val; 
    pintarDirectaItems(); 
  }
};
window.directaCambiarKg = function(idx, val) {
  const v = parseFloat(val) || 0;
  if (directaItems[idx]) { 
    directaItems[idx].kg = v; 
    pintarDirectaItems(); 
  }
};
window.directaQuitarFila = function(idx) {
  directaItems.splice(idx, 1);
  pintarDirectaItems();
};

function actualizarMontoSugeridoDirecta() {
  const tipo = document.getElementById('directa-tipo').value;
  if (tipo === 'uso') return;
  
  let totalSugerido = 0;
  directaItems.forEach(it => {
    const p = productos.find(x => x.nombre === it.producto_nombre);
    const precioUnit = p ? (p.pv_sugerido || p.pv_publico || 0) : 0;
    totalSugerido += precioUnit * (it.kg || 0);
  });
  
  const montoInput = document.getElementById('directa-monto');
  if (montoInput) {
    montoInput.value = totalSugerido.toFixed(2);
  }
}

function actualizarAvisoStockDirecta() {
  const cont = document.getElementById('directa-stock-aviso');
  if (!cont) return;
  
  const { consumo, sinMapeo } = calcularConsumoMaterias(directaItems);
  if (consumo.size === 0 && sinMapeo.length === 0) { cont.innerHTML = ''; return; }

  const faltantes = [];
  consumo.forEach((kg, desc) => {
    const mat = materiales.find(m => m.descripcion === desc);
    if (mat && mat.stock_kg < kg) {
      faltantes.push({ desc, requerido: kg, disponible: mat.stock_kg, falta: kg - mat.stock_kg });
    }
  });

  if (faltantes.length === 0 && sinMapeo.length === 0) {
    cont.innerHTML = '';
    return;
  }

  let html = '<div class="stock-warning"><strong>Aviso de inventario:</strong>';
  faltantes.forEach(f => {
    html += `<div style="margin-top:0.2rem;">• Quedará en negativo <strong>${escapeHtml(f.desc)}</strong> (requiere: ${fmtNum(f.requerido)} kg, tiene: ${fmtNum(f.disponible)} kg).</div>`;
  });
  if (sinMapeo.length > 0) {
    const unicos = Array.from(new Set(sinMapeo.map(x => x.componente)));
    html += `<div style="margin-top:0.3rem;">No se pudo mapear a una materia prima: <em>${unicos.map(escapeHtml).join(', ')}</em> (no se descontará).</div>`;
  }
  html += '</div>';
  cont.innerHTML = html;
}

function guardarDirecta() {
  const fecha = document.getElementById('directa-fecha').value;
  const tipo = document.getElementById('directa-tipo').value;
  const monto = parseFloat(document.getElementById('directa-monto').value) || 0;
  const notas = document.getElementById('directa-notas').value.trim();

  if (!fecha) { mostrarError('Selecciona una fecha'); return; }

  const items = directaItems.filter(it => it.kg > 0 && it.producto_nombre);
  if (items.length === 0) { mostrarError('Agrega al menos un producto con litros/kg mayor a 0'); return; }

  const { consumo } = calcularConsumoMaterias(items);
  const faltantes = [];
  consumo.forEach((kg, desc) => {
    const mat = materiales.find(m => m.descripcion === desc);
    if (mat && mat.stock_kg < kg) faltantes.push(desc);
  });
  if (faltantes.length > 0) {
    if (!confirm(`Stock insuficiente para: ${faltantes.join(', ')}.\n\n¿Guardar de todos modos? (el stock quedará en negativo)`)) return;
  }

  const itemsConCosto = items.map(it => {
    const p = productos.find(x => x.nombre === it.producto_nombre);
    return { producto_nombre: it.producto_nombre, kg: it.kg, costo_kg_unit: p ? p.costo_kg : 0 };
  });

  consumo.forEach((kg, desc) => {
    const mat = materiales.find(m => m.descripcion === desc);
    if (mat) mat.stock_kg = +(mat.stock_kg - kg).toFixed(4);
  });

  const punto_id = tipo === 'venta' ? 'pv_venta_directa' : 'pv_uso_personal';
  const literalTipo = tipo === 'venta' ? 'Venta Directa' : 'Uso Personal';
  const notasCompletas = (notes => (notes ? `[${literalTipo}] ${notes}` : `[${literalTipo}]`).trim())(notas);

  const nuevoResurtido = { id: genId('r'), fecha, punto_id, items: itemsConCosto, notas: notasCompletas };
  resurtidos.push(nuevoResurtido);
  sb.from('resurtidos').insert(resurtidoToRow(nuevoResurtido)).then(_onSyncErr('resurtidos'));

  if (tipo === 'venta') {
    const nuevaVenta = { id: genId('v'), fecha, punto_id, monto, notas: notasCompletas };
    ventas.push(nuevaVenta);
    sb.from('ventas').insert(ventaToRow(nuevaVenta)).then(_onSyncErr('ventas'));
  }

  saveDatos();

  directaItems = [{ producto_nombre: productos[0]?.nombre || '', kg: 0 }];
  document.getElementById('directa-notes' || 'directa-notas').value = '';
  document.getElementById('directa-monto').value = '0.00';
  document.getElementById('directa-fecha').value = hoyISO();
  document.getElementById('directa-tipo').value = 'venta';
  document.getElementById('directa-monto').disabled = false;

  pintarDirectaItems();
  pintarResurtidos();
  pintarVentas();
  pintarMateriales(
    document.getElementById('search-materiales')?.value || '',
    document.getElementById('filter-proveedor')?.value || '',
    document.getElementById('filter-funcion')?.value || ''
  );
  renderDashboard();
  
  mostrarError('Salida de inventario registrada con éxito');
}

// =============================================================
// Arranque con autenticación Supabase Auth
// =============================================================

function mostrarAppAutenticada(mostrar) {
  const authScreen = document.getElementById('auth-screen');
  const topbar = document.querySelector('.topbar');
  const appMain = document.getElementById('app');
  const btnLogout = document.getElementById('btn-logout');

  if (authScreen) authScreen.hidden = mostrar;
  if (topbar) topbar.hidden = !mostrar;
  if (appMain) appMain.hidden = !mostrar;
  if (btnLogout) btnLogout.hidden = !mostrar;
}

async function iniciarConAuth() {
  const authForm = document.getElementById('auth-form');
  const authError = document.getElementById('auth-error');
  const btnSubmit = document.getElementById('btn-auth-submit');
  const btnLogout = document.getElementById('btn-logout');

  if (btnLogout && !btnLogout.dataset.bound) {
    btnLogout.dataset.bound = '1';
    btnLogout.addEventListener('click', async () => {
      await sb.auth.signOut();
      location.reload();
    });
  }

  const btnTogglePass = document.getElementById('btn-toggle-pass');
  if (btnTogglePass && !btnTogglePass.dataset.bound) {
    btnTogglePass.dataset.bound = '1';
    btnTogglePass.addEventListener('click', () => {
      const inp = document.getElementById('auth-password');
      if (inp) inp.type = inp.type === 'password' ? 'text' : 'password';
    });
  }

  if (authForm && !authForm.dataset.bound) {
    authForm.dataset.bound = '1';
    authForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (authError) authError.hidden = true;
      const email = document.getElementById('auth-email').value.trim();
      const password = document.getElementById('auth-password').value;

      btnSubmit.disabled = true;
      btnSubmit.textContent = 'Entrando...';
      const { error } = await sb.auth.signInWithPassword({ email, password });
      btnSubmit.disabled = false;
      btnSubmit.textContent = 'Entrar';

      if (error) {
        if (authError) {
          authError.textContent = error.message === 'Invalid login credentials'
            ? 'Correo o contraseña incorrectos.'
            : error.message;
          authError.hidden = false;
        }
        return;
      }

      mostrarAppAutenticada(true);
      await init();
    });
  }

  const { data: { session } } = await sb.auth.getSession();
  if (session) {
    mostrarAppAutenticada(true);
    await init();
  } else {
    mostrarAppAutenticada(false);
  }
}

iniciarConAuth();
