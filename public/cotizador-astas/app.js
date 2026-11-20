// ============================================================================
// LÓGICA PRINCIPAL — COTIZADOR INTELIGENTE ASTAS Y MANTENIMIENTO
// Sincronización Supabase + Respaldo Local + Soporte IA + Dictado de Calle
// ============================================================================

const STORAGE_KEYS = {
  insumos: 'astas_insumos_v1',
  historialInsumos: 'astas_insumos_hist_v1',
  cotizaciones: 'astas_cotizaciones_v1',
  ajustes: 'astas_ajustes_v1',
  borrador: 'astas_borrador_actual_v1',
  geminiLocalKey: 'astas_gemini_device_key_v1',
};

let estadoNube = false;
let usuarioActual = null;
let ajustes = { ...AJUSTES_DEFAULT };
let insumos = [];
let historialInsumos = [];
let cotizaciones = [];
let cotActual = crearCotizacionEnBlanco();
let propuestosAceroTemp = [];

// ── UTILIDADES ───────────────────────────────────────────────────────────────
function uid() {
  return crypto.randomUUID ? crypto.randomUUID() : 'id-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
}

function hoyISO() {
  const d = new Date();
  const off = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - off).toISOString().slice(0, 10);
}

function moneda(n) {
  return '$' + (Number(n) || 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function mostrarToast(texto) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = texto;
  t.hidden = false;
  clearTimeout(mostrarToast._timer);
  mostrarToast._timer = setTimeout(() => {
    t.hidden = true;
  }, 3200);
}

function generarSiguienteFolio() {
  const anio = new Date().getFullYear();
  const seq = Math.max(1, Number(ajustes.consecutivo_folio) || 1);
  return `COT-${anio}-${String(seq).padStart(3, '0')}`;
}

function crearCotizacionEnBlanco() {
  return {
    id: uid(),
    folio: `COT-${new Date().getFullYear()}-001`,
    fecha: hoyISO(),
    estado: 'Enviada',
    titulo_proyecto: 'Cotización de Asta Bandera 10m en Acero al Carbón',
    cliente_nombre: 'A quien corresponda',
    cliente_empresa: '',
    cliente_ciudad: '',
    cliente_telefono: '',
    cliente_correo: '',
    material_principal: OPCIONES_MATERIAL[0],
    tipo_pintura: OPCIONES_PINTURA[0].label,
    color_acabado: 'Color a elegir',
    anticipo_pct: 75,
    vigencia_dias: 30,
    tiempo_entrega: '10 a 15 días hábiles a partir de anticipo',
    garantia: '12 meses contra defectos de fabricación',
    partidas: [
      {
        id: uid(),
        categoria: 'Fabricación',
        concepto: PLANTILLAS_RAPIDAS[0].concepto,
        descripcion: PLANTILLAS_RAPIDAS[0].descripcion,
        cantidad: 1,
        unidad: 'pieza',
        costo_unitario_directo: 4157.00,
        factor: 3.5,
        precio_unitario_venta: +(4157.00 * 3.5).toFixed(2),
        es_estimado_ia: false,
        nota_interna: 'Base taller asta 10m',
      },
    ],
    viaje: {
      activo: false,
      ruta_id: 'puebla',
      destino: 'Puebla, Pue.',
      modo_cobro: 'separado',
      km_redondos: 210,
      casetas_total: 452,
      personas: 3,
      dias: 1,
      noches_hotel: 0,
      costo_hotel_noche: 1900,
      factor_viaje: 1.35,
      costo_operativo_viaje: 0,
      precio_venta_viaje: 0,
      manual_override: false,
    },
    clausulas: {
      cimentacion_canastilla: false,
      no_incluye_flete: true,
      no_incluye_grua: false,
      requiere_trifasica: false,
      mostrar_datos_bancarios: false,
      nota_extra: '',
    },
    notas_internas: '',
    costo_directo_total: 0,
    subtotal: 0,
    iva: 0,
    total: 0,
    utilidad_estimada: 0,
  };
}

// ── CARGA Y SINCRONIZACIÓN CON SUPABASE ──────────────────────────────────────
function cargarRespaldoLocal() {
  const ajLocal = JSON.parse(localStorage.getItem(STORAGE_KEYS.ajustes) || 'null');
  if (ajLocal) ajustes = { ...AJUSTES_DEFAULT, ...ajLocal };

  const insLocal = JSON.parse(localStorage.getItem(STORAGE_KEYS.insumos) || 'null');
  if (Array.isArray(insLocal) && insLocal.length > 0) {
    insumos = insLocal;
  } else {
    const ahora = new Date().toISOString();
    insumos = INSUMOS_INICIALES.map((m) => ({ ...m, id: uid(), actualizado_en: ahora }));
    localStorage.setItem(STORAGE_KEYS.insumos, JSON.stringify(insumos));
  }

  historialInsumos = JSON.parse(localStorage.getItem(STORAGE_KEYS.historialInsumos) || '[]');
  cotizaciones = JSON.parse(localStorage.getItem(STORAGE_KEYS.cotizaciones) || '[]');

  const borrador = JSON.parse(localStorage.getItem(STORAGE_KEYS.borrador) || 'null');
  if (borrador && borrador.partidas) {
    cotActual = borrador;
  } else {
    cotActual = crearCotizacionEnBlanco();
    cotActual.folio = generarSiguienteFolio();
    cotActual.anticipo_pct = ajustes.anticipo_default;
    cotActual.vigencia_dias = ajustes.vigencia_default;
  }
}

function guardarRespaldoLocal() {
  localStorage.setItem(STORAGE_KEYS.ajustes, JSON.stringify(ajustes));
  localStorage.setItem(STORAGE_KEYS.insumos, JSON.stringify(insumos));
  localStorage.setItem(STORAGE_KEYS.historialInsumos, JSON.stringify(historialInsumos));
  localStorage.setItem(STORAGE_KEYS.cotizaciones, JSON.stringify(cotizaciones));
  localStorage.setItem(STORAGE_KEYS.borrador, JSON.stringify(cotActual));
}

async function sincronizarDesdeSupabase() {
  const pill = document.getElementById('sync-status');
  const bannerSql = document.getElementById('banner-sql');
  try {
    const [resIns, resHist, resCot, resCfg] = await Promise.all([
      sb.from('astas_insumos').select('*').order('categoria').order('nombre'),
      sb.from('astas_insumos_historial').select('*').order('fecha', { ascending: false }).limit(80),
      sb.from('astas_cotizaciones').select('*').order('creado_en', { ascending: false }).limit(150),
      sb.from('astas_config').select('*').maybeSingle(),
    ]);

    if (resIns.error) throw resIns.error;

    estadoNube = true;
    if (bannerSql) bannerSql.hidden = true;
    if (pill) {
      pill.textContent = '☁️ Nube activa';
      pill.classList.remove('local');
    }

    // Si la tabla en la nube está vacía la primera vez, sembramos el catálogo inicial automáticamente
    if (Array.isArray(resIns.data) && resIns.data.length === 0 && insumos.length > 0) {
      const filasSemilla = insumos.map((m) => ({
        user_id: usuarioActual.id,
        codigo: m.codigo,
        categoria: m.categoria,
        nombre: m.nombre,
        unidad: m.unidad,
        costo_sin_iva: Number(m.costo_sin_iva) || 0,
        proveedor: m.proveedor || '-',
        notas: m.notas || '',
        actualizado_en: m.actualizado_en || new Date().toISOString(),
      }));
      const { data: insertados } = await sb
        .from('astas_insumos')
        .upsert(filasSemilla, { onConflict: 'user_id,codigo' })
        .select('*');
      if (insertados && insertados.length) insumos = insertados;
    } else if (Array.isArray(resIns.data) && resIns.data.length > 0) {
      insumos = resIns.data;
    }

    if (!resHist.error && Array.isArray(resHist.data)) {
      historialInsumos = resHist.data;
    }
    if (!resCot.error && Array.isArray(resCot.data)) {
      cotizaciones = resCot.data;
    }
    if (!resCfg.error && resCfg.data && resCfg.data.ajustes) {
      ajustes = { ...AJUSTES_DEFAULT, ...resCfg.data.ajustes };
    }

    guardarRespaldoLocal();
  } catch (err) {
    estadoNube = false;
    if (pill) {
      pill.textContent = '📱 Respaldo Local';
      pill.classList.add('local');
    }
    if (bannerSql) bannerSql.hidden = false;
  }
}

// ── CÁLCULOS DE COSTO, PINTURA, VIAJE, UTILIDAD Y ANTICIPO 75% ───────────────
function calcularViajeInterno() {
  const v = cotActual.viaje;
  if (!v.activo) {
    v.costo_operativo_viaje = 0;
    v.precio_venta_viaje = 0;
    return;
  }
  const km = Number(v.km_redondos) || 0;
  const casetas = Number(v.casetas_total) || 0;
  const personas = Math.max(1, Number(v.personas) || 1);
  const dias = Math.max(1, Number(v.dias) || 1);
  const noches = Math.max(0, Number(v.noches_hotel) || 0);
  const hotelNoche = Number(v.costo_hotel_noche) || 0;
  const factor = Math.max(1, Number(v.factor_viaje) || 1.35);

  const litros = km / Math.max(1, Number(ajustes.rendimiento_km_litro) || 10);
  const gasolina = litros * (Number(ajustes.gasolina_litro) || 24.5);
  const desgaste = km * (Number(ajustes.desgaste_por_km) || 1.8);
  const comidas = personas * dias * (Number(ajustes.comida_persona_dia) || 250);
  const ayudantes = Math.max(0, personas - 1);
  const manoObra =
    dias * ((Number(ajustes.sueldo_oficial_dia) || 1000) + ayudantes * (Number(ajustes.sueldo_ayudante_dia) || 600));
  const hotel = noches * hotelNoche;

  const costoTotalViaje = gasolina + casetas + desgaste + comidas + manoObra + hotel;
  v.costo_operativo_viaje = +costoTotalViaje.toFixed(2);
  if (!v.manual_override) {
    v.precio_venta_viaje = +(costoTotalViaje * factor).toFixed(2);
  }
  v._desglose = { gasolina, casetas, desgaste, comidas, manoObra, hotel };
}

function recalcularTotalesCotizacion() {
  calcularViajeInterno();

  let costoPartidas = 0;
  let subtotalPartidas = 0;

  cotActual.partidas.forEach((p) => {
    const cant = Math.max(0.01, Number(p.cantidad) || 1);
    const costoU = Math.max(0, Number(p.costo_unitario_directo) || 0);
    const ventaU = Math.max(0, Number(p.precio_unitario_venta) || 0);
    costoPartidas += cant * costoU;
    subtotalPartidas += cant * ventaU;
  });

  const costoViaje = cotActual.viaje.activo ? Number(cotActual.viaje.costo_operativo_viaje) || 0 : 0;
  const ventaViaje = cotActual.viaje.activo ? Number(cotActual.viaje.precio_venta_viaje) || 0 : 0;

  const costoDirectoTotal = +(costoPartidas + costoViaje).toFixed(2);
  const subtotal = +(subtotalPartidas + ventaViaje).toFixed(2);
  const iva = +(subtotal * ((Number(ajustes.iva_pct) || 16) / 100)).toFixed(2);
  const total = +(subtotal + iva).toFixed(2);
  const utilidad = +(subtotal - costoDirectoTotal).toFixed(2);
  const pctUtilidad = subtotal > 0 ? +((utilidad / subtotal) * 100).toFixed(1) : 0;

  cotActual.costo_directo_total = costoDirectoTotal;
  cotActual.subtotal = subtotal;
  cotActual.iva = iva;
  cotActual.total = total;
  cotActual.utilidad_estimada = utilidad;

  const anticipoPct = Number(cotActual.anticipo_pct) || 75;
  const montoAnticipo = total * (anticipoPct / 100);

  // Actualizar KPIs privados
  document.getElementById('kpi-costo-directo').textContent = moneda(costoDirectoTotal);
  document.getElementById('kpi-ganancia').textContent = `${moneda(utilidad)} (${pctUtilidad}%)`;
  document.getElementById('kpi-total-iva').textContent = moneda(total);
  document.getElementById('kpi-pct-anticipo').textContent = anticipoPct;
  document.getElementById('kpi-monto-anticipo').textContent = moneda(montoAnticipo);

  // Barra inferior móvil
  document.getElementById('bar-pct-anticipo').textContent = anticipoPct;
  document.getElementById('bar-total-mxn').textContent = `${moneda(total)} MXN`;
  document.getElementById('badge-folio-actual').textContent = cotActual.folio || 'COT';

  // Resumen viaje si aplica
  const badgeViaje = document.getElementById('badge-resumen-viaje');
  const divDesglose = document.getElementById('desglose-interno-viaje');
  if (cotActual.viaje.activo) {
    badgeViaje.hidden = false;
    badgeViaje.textContent = `Venta viaje: ${moneda(ventaViaje)} s/IVA`;
    const d = cotActual.viaje._desglose || {};
    divDesglose.innerHTML = `<strong>🔒 Tu costo operativo real del viaje: ${moneda(costoViaje)}</strong> · Gasolina: ${moneda(d.gasolina)} · Casetas: ${moneda(d.casetas)} · Desgaste: ${moneda(d.desgaste)} · Comidas: ${moneda(d.comidas)} · Mano de obra (${cotActual.viaje.personas} pers × ${cotActual.viaje.dias}d): ${moneda(d.manoObra)} · Hotel: ${moneda(d.hotel)} · <strong>Ganancia en viaje: ${moneda(ventaViaje - costoViaje)}</strong>`;
  } else {
    badgeViaje.hidden = true;
  }

  guardarRespaldoLocal();
}

// ── RENDERIZADO DEL FORMULARIO DE COTIZACIÓN ─────────────────────────────────
function poblarSelectoresFijos() {
  const selMat = document.getElementById('cot-material');
  selMat.innerHTML = OPCIONES_MATERIAL.map((m) => `<option value="${m}">${m}</option>`).join('');

  const selPin = document.getElementById('cot-pintura');
  selPin.innerHTML = OPCIONES_PINTURA.map(
    (p) => `<option value="${p.label}" data-extra="${p.extraPct}">${p.label}${p.extraPct ? ` (+${p.extraPct}% sugerido)` : ''}</option>`
  ).join('');

  const dlCol = document.getElementById('lista-colores');
  dlCol.innerHTML = COLORES_SUGERIDOS.map((c) => `<option value="${c}"></option>`).join('');

  const selRuta = document.getElementById('viaje-ruta');
  selRuta.innerHTML = RUTAS_DESDE_CHALCO.map((r) => `<option value="${r.id}">${r.nombre}</option>`).join('');

  const chips = document.getElementById('chips-plantillas');
  chips.innerHTML = PLANTILLAS_RAPIDAS.map(
    (pl) => `<button type="button" class="chip" data-plantilla="${pl.id}">${pl.icono} + ${pl.boton}</button>`
  ).join('');

  chips.querySelectorAll('[data-plantilla]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const pl = PLANTILLAS_RAPIDAS.find((x) => x.id === btn.dataset.plantilla);
      if (!pl) return;
      // Buscar si el usuario actualizó el costo equivalente en su catálogo de acero
      let costoReal = pl.costo_unitario_directo;
      if (pl.id === 'asta_10m_carbon') {
        const ref = insumos.find((i) => i.codigo === 'BASE-ASTA-10C');
        if (ref) costoReal = Number(ref.costo_sin_iva);
      } else if (pl.id === 'asta_25ft') {
        const ref = insumos.find((i) => i.codigo === 'BASE-ASTA-762');
        if (ref) costoReal = Number(ref.costo_sin_iva);
      } else if (pl.id === 'asta_30ft') {
        const ref = insumos.find((i) => i.codigo === 'BASE-ASTA-914');
        if (ref) costoReal = Number(ref.costo_sin_iva);
      }
      // Si tiene seleccionada pintura epóxica, sumar suplemento sugerido al costo si es fabricación
      const extraEpox = cotActual.tipo_pintura.toLowerCase().includes('epóxica') && pl.categoria === 'Fabricación' ? 1150 : 0;
      const costoFinal = +(costoReal + extraEpox).toFixed(2);
      const factor = Number(pl.factor) || Number(ajustes.factor_default) || 3.5;

      cotActual.partidas.push({
        id: uid(),
        categoria: pl.categoria,
        concepto: pl.concepto,
        descripcion: pl.descripcion,
        cantidad: 1,
        unidad: pl.unidad,
        costo_unitario_directo: costoFinal,
        factor,
        precio_unitario_venta: +(costoFinal * factor).toFixed(2),
        es_estimado_ia: false,
        nota_interna: extraEpox ? 'Incluye ajuste por pintura epóxica' : 'Desde plantilla rápida',
      });
      renderPartidas();
      recalcularTotalesCotizacion();
      mostrarToast(`Agregada: ${pl.boton}`);
    });
  });
}

function poblarSelectorInsumosEnCotizacion() {
  const sel = document.getElementById('sel-insumo-catalogo');
  if (!sel) return;
  sel.innerHTML = insumos
    .map((i) => `<option value="${i.codigo}">[${i.categoria}] ${i.nombre} — Costo s/IVA: ${moneda(i.costo_sin_iva)}</option>`)
    .join('');
}

function volcarCotizacionAInputs() {
  document.getElementById('cot-folio').value = cotActual.folio || '';
  document.getElementById('cot-fecha').value = cotActual.fecha || hoyISO();
  document.getElementById('cot-estado').value = cotActual.estado || 'Enviada';
  document.getElementById('cot-ciudad').value = cotActual.cliente_ciudad || '';
  document.getElementById('cot-titulo').value = cotActual.titulo_proyecto || '';
  document.getElementById('cot-cliente').value = cotActual.cliente_nombre || '';
  document.getElementById('cot-empresa').value = cotActual.cliente_empresa || '';
  document.getElementById('cot-telefono').value = cotActual.cliente_telefono || '';
  document.getElementById('cot-correo').value = cotActual.cliente_correo || '';

  const selMat = document.getElementById('cot-material');
  if ([...selMat.options].some((o) => o.value === cotActual.material_principal)) {
    selMat.value = cotActual.material_principal;
  }
  const selPin = document.getElementById('cot-pintura');
  if ([...selPin.options].some((o) => o.value === cotActual.tipo_pintura)) {
    selPin.value = cotActual.tipo_pintura;
  }
  document.getElementById('cot-color').value = cotActual.color_acabado || 'Color a elegir';

  document.getElementById('cot-anticipo').value = cotActual.anticipo_pct ?? 75;
  document.getElementById('cot-vigencia').value = cotActual.vigencia_dias ?? 30;
  document.getElementById('cot-entrega').value = cotActual.tiempo_entrega || '';
  document.getElementById('cot-garantia').value = cotActual.garantia || '';

  const cl = cotActual.clausulas || {};
  document.getElementById('cl-cimentacion').checked = !!cl.cimentacion_canastilla;
  document.getElementById('cl-flete').checked = cl.no_incluye_flete !== false;
  document.getElementById('cl-grua').checked = !!cl.no_incluye_grua;
  document.getElementById('cl-trifasica').checked = !!cl.requiere_trifasica;
  document.getElementById('cl-banco').checked = !!cl.mostrar_datos_bancarios;
  document.getElementById('cl-nota-extra').value = cl.nota_extra || '';
  document.getElementById('cot-notas-internas').value = cotActual.notas_internas || '';

  // Viaje
  const v = cotActual.viaje || {};
  document.getElementById('viaje-activo').checked = !!v.activo;
  document.getElementById('panel-viaje').hidden = !v.activo;
  document.getElementById('viaje-ruta').value = v.ruta_id || 'custom';
  document.getElementById('viaje-destino').value = v.destino || '';
  document.getElementById('viaje-modo').value = v.modo_cobro || 'separado';
  document.getElementById('viaje-km').value = v.km_redondos ?? 210;
  document.getElementById('viaje-casetas').value = v.casetas_total ?? 452;
  document.getElementById('viaje-personas').value = v.personas ?? 3;
  document.getElementById('viaje-dias').value = v.dias ?? 1;
  document.getElementById('viaje-noches').value = v.noches_hotel ?? 0;
  document.getElementById('viaje-hotel').value = v.costo_hotel_noche ?? 1900;
  document.getElementById('viaje-factor').value = v.factor_viaje ?? 1.35;

  renderPartidas();
  recalcularTotalesCotizacion();
  document.getElementById('viaje-venta-manual').value = cotActual.viaje.precio_venta_viaje || 0;
}

function renderPartidas() {
  const cont = document.getElementById('lista-partidas');
  if (!cotActual.partidas.length) {
    cont.innerHTML = `<p style="color: var(--muted); font-size: 0.88rem; text-align: center; padding: 1rem;">No hay partidas aún. Toca una plantilla rápida arriba o "+ Partida Libre".</p>`;
    return;
  }

  cont.innerHTML = cotActual.partidas
    .map((p, idx) => {
      const importe = (Number(p.cantidad) || 1) * (Number(p.precio_unitario_venta) || 0);
      const badgeIA = p.es_estimado_ia
        ? `<span class="badge badge-warn" title="Calculado como soporte IA; verifica costo de acero">🤖 Estimado Soporte IA</span>`
        : `<span class="badge badge-ok">✓ Tu Precio Base</span>`;

      return `
      <div class="partida-item" data-idx="${idx}">
        <div class="partida-top">
          <div style="display: flex; align-items: center; gap: 0.45rem; flex-wrap: wrap;">
            <strong>Partida #${idx + 1}</strong>
            ${badgeIA}
            ${p.nota_interna ? `<span style="font-size:0.75rem; color:var(--muted);">(${escaparHTML(p.nota_interna)})</span>` : ''}
          </div>
          <div style="display: flex; align-items: center; gap: 0.45rem;">
            <strong style="color: var(--blue);">${moneda(importe)} s/IVA</strong>
            <button type="button" class="btn btn-danger btn-sm" data-del="${idx}" title="Eliminar partida">✕</button>
          </div>
        </div>

        <div class="grid-3" style="margin-bottom: 0.6rem;">
          <div class="field" style="grid-column: span 2;">
            <label>Concepto principal</label>
            <input type="text" data-field="concepto" data-idx="${idx}" value="${escaparAttr(p.concepto)}" />
          </div>
          <div class="field">
            <label>Categoría</label>
            <select data-field="categoria" data-idx="${idx}">
              ${['Fabricación', 'Mantenimiento', 'Izaje Motorizado', 'Banderas / Escritorio', 'Instalación']
                .map((c) => `<option value="${c}" ${p.categoria === c ? 'selected' : ''}>${c}</option>`)
                .join('')}
            </select>
          </div>
        </div>

        <div class="field" style="margin-bottom: 0.65rem;">
          <label>Descripción técnica detallada (viñetas que verá el cliente en el PDF)</label>
          <textarea rows="4" data-field="descripcion" data-idx="${idx}">${escaparHTML(p.descripcion)}</textarea>
        </div>

        <div class="grid-4 grid-mobile-2">
          <div class="field">
            <label>Cantidad / Unidad</label>
            <div style="display: flex; gap: 0.35rem;">
              <input type="number" min="0.1" step="1" data-field="cantidad" data-idx="${idx}" value="${p.cantidad}" style="width: 48%;" />
              <input type="text" data-field="unidad" data-idx="${idx}" value="${escaparAttr(p.unidad || 'pieza')}" style="width: 52%;" />
            </div>
          </div>
          <div class="field">
            <label>🔒 Tu Costo Unit. s/IVA ($)</label>
            <input type="number" min="0" step="1" data-field="costo_unitario_directo" data-idx="${idx}" value="${p.costo_unitario_directo}" />
          </div>
          <div class="field">
            <label>Factor Margen (<span class="factor-pills">
              <button type="button" class="factor-pill ${Number(p.factor) === 2 ? 'active' : ''}" data-setfactor="2" data-idx="${idx}">×2</button>
              <button type="button" class="factor-pill ${Number(p.factor) === 3 ? 'active' : ''}" data-setfactor="3" data-idx="${idx}">×3</button>
              <button type="button" class="factor-pill ${Number(p.factor) === 3.5 ? 'active' : ''}" data-setfactor="3.5" data-idx="${idx}">×3.5</button>
            </span>)</label>
            <input type="number" min="1" step="0.1" data-field="factor" data-idx="${idx}" value="${p.factor}" />
          </div>
          <div class="field">
            <label>📄 Precio Venta Unit. s/IVA ($)</label>
            <input type="number" min="0" step="1" data-field="precio_unitario_venta" data-idx="${idx}" value="${p.precio_unitario_venta}" />
          </div>
        </div>
      </div>`;
    })
    .join('');

  // Eventos de edición por partida
  cont.querySelectorAll('[data-del]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const i = Number(btn.dataset.del);
      cotActual.partidas.splice(i, 1);
      renderPartidas();
      recalcularTotalesCotizacion();
    });
  });

  cont.querySelectorAll('[data-setfactor]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const i = Number(btn.dataset.idx);
      const f = Number(btn.dataset.setfactor);
      const item = cotActual.partidas[i];
      item.factor = f;
      item.precio_unitario_venta = +((Number(item.costo_unitario_directo) || 0) * f).toFixed(2);
      renderPartidas();
      recalcularTotalesCotizacion();
    });
  });

  cont.querySelectorAll('[data-field]').forEach((inp) => {
    inp.addEventListener('input', () => {
      const i = Number(inp.dataset.idx);
      const campo = inp.dataset.field;
      const item = cotActual.partidas[i];
      if (!item) return;

      if (campo === 'costo_unitario_directo') {
        item.costo_unitario_directo = Number(inp.value) || 0;
        item.es_estimado_ia = false;
        item.precio_unitario_venta = +(item.costo_unitario_directo * (Number(item.factor) || 1)).toFixed(2);
        const ventaInput = cont.querySelector(`[data-field="precio_unitario_venta"][data-idx="${i}"]`);
        if (ventaInput) ventaInput.value = item.precio_unitario_venta;
      } else if (campo === 'factor') {
        item.factor = Number(inp.value) || 1;
        item.precio_unitario_venta = +((Number(item.costo_unitario_directo) || 0) * item.factor).toFixed(2);
        const ventaInput = cont.querySelector(`[data-field="precio_unitario_venta"][data-idx="${i}"]`);
        if (ventaInput) ventaInput.value = item.precio_unitario_venta;
      } else if (campo === 'precio_unitario_venta') {
        item.precio_unitario_venta = Number(inp.value) || 0;
        if (Number(item.costo_unitario_directo) > 0) {
          item.factor = +(item.precio_unitario_venta / item.costo_unitario_directo).toFixed(2);
          const factorInput = cont.querySelector(`[data-field="factor"][data-idx="${i}"]`);
          if (factorInput) factorInput.value = item.factor;
        }
      } else if (campo === 'cantidad') {
        item.cantidad = Number(inp.value) || 1;
      } else {
        item[campo] = inp.value;
      }
      recalcularTotalesCotizacion();
    });
  });
}

function escaparHTML(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escaparAttr(str) {
  return escaparHTML(str).replace(/"/g, '&quot;');
}

// ── GUARDAR COTIZACIÓN EN SUPABASE + HISTORIAL ───────────────────────────────
async function guardarCotizacionActual(silencioso = false) {
  recalcularTotalesCotizacion();

  const existenteIdx = cotizaciones.findIndex((c) => c.folio === cotActual.folio);
  const registro = {
    ...JSON.parse(JSON.stringify(cotActual)),
    actualizado_en: new Date().toISOString(),
  };

  if (existenteIdx >= 0) {
    cotizaciones[existenteIdx] = registro;
  } else {
    cotizaciones.unshift(registro);
    // Avanzar consecutivo si el folio coincide con el sugerido
    if (cotActual.folio === generarSiguienteFolio()) {
      ajustes.consecutivo_folio = (Number(ajustes.consecutivo_folio) || 1) + 1;
      await guardarAjustesEnNube();
    }
  }
  guardarRespaldoLocal();
  renderHistorial();

  if (estadoNube && usuarioActual) {
    const filaNube = {
      user_id: usuarioActual.id,
      folio: registro.folio,
      fecha: registro.fecha,
      estado: registro.estado,
      cliente_nombre: registro.cliente_nombre,
      cliente_empresa: registro.cliente_empresa,
      cliente_ciudad: registro.cliente_ciudad,
      cliente_telefono: registro.cliente_telefono,
      cliente_correo: registro.cliente_correo,
      titulo_proyecto: registro.titulo_proyecto,
      material_principal: registro.material_principal,
      tipo_pintura: registro.tipo_pintura,
      color_acabado: registro.color_acabado,
      anticipo_pct: registro.anticipo_pct,
      vigencia_dias: registro.vigencia_dias,
      tiempo_entrega: registro.tiempo_entrega,
      garantia: registro.garantia,
      partidas: registro.partidas,
      viaje: registro.viaje,
      clausulas: registro.clausulas,
      costo_directo_total: registro.costo_directo_total,
      subtotal: registro.subtotal,
      iva: registro.iva,
      total: registro.total,
      utilidad_estimada: registro.utilidad_estimada,
      notas_internas: registro.notas_internas || '',
      actualizado_en: new Date().toISOString(),
    };
    const { error } = await sb.from('astas_cotizaciones').upsert(filaNube, { onConflict: 'user_id,folio' });
    if (error && !silencioso) {
      mostrarToast('Guardado local (ejecuta SQL para nube)');
      return;
    }
  }

  if (!silencioso) mostrarToast(`Cotización ${cotActual.folio} guardada`);
}

function renderHistorial() {
  const tbody = document.getElementById('tbody-historial');
  const filtro = (document.getElementById('buscar-historial')?.value || '').toLowerCase().trim();

  const lista = cotizaciones.filter((c) => {
    if (!filtro) return true;
    const texto = `${c.folio} ${c.cliente_nombre} ${c.cliente_empresa} ${c.cliente_ciudad} ${c.titulo_proyecto}`.toLowerCase();
    return texto.includes(filtro);
  });

  if (!lista.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:var(--muted); padding:1.2rem;">Aún no hay cotizaciones guardadas.</td></tr>`;
    return;
  }

  tbody.innerHTML = lista
    .map((c) => {
      const badgeCls =
        c.estado === 'Aprobada' ? 'badge-ok' : c.estado === 'Perdida' ? 'badge-danger' : 'badge';
      return `
      <tr>
        <td><strong>${escaparHTML(c.folio)}</strong><br/><span style="font-size:0.75rem;color:var(--muted);">${escaparHTML(c.fecha)}</span></td>
        <td><strong>${escaparHTML(c.titulo_proyecto)}</strong><br/><span style="font-size:0.78rem;color:var(--muted);">${escaparHTML(c.cliente_empresa || c.cliente_nombre)} ${c.cliente_ciudad ? '· ' + escaparHTML(c.cliente_ciudad) : ''}</span></td>
        <td style="font-size:0.78rem;">${escaparHTML(c.material_principal)}<br/><span style="color:var(--muted);">${escaparHTML(c.tipo_pintura)} (${escaparHTML(c.color_acabado)})</span></td>
        <td><strong>${moneda(c.total)}</strong></td>
        <td style="color: var(--emerald); font-weight:700;">${moneda(c.utilidad_estimada)}</td>
        <td><span class="badge ${badgeCls}">${escaparHTML(c.estado)}</span></td>
        <td>
          <div style="display:flex; gap:0.35rem; flex-wrap:wrap;">
            <button type="button" class="btn btn-secondary btn-sm" data-cargar="${escaparAttr(c.folio)}">Abrir</button>
            <button type="button" class="btn btn-primary btn-sm" data-pdfhist="${escaparAttr(c.folio)}">PDF</button>
            <button type="button" class="btn btn-secondary btn-sm" data-duplicar="${escaparAttr(c.folio)}">Duplicar</button>
          </div>
        </td>
      </tr>`;
    })
    .join('');

  tbody.querySelectorAll('[data-cargar]').forEach((b) => {
    b.addEventListener('click', () => {
      const encontrada = cotizaciones.find((x) => x.folio === b.dataset.cargar);
      if (!encontrada) return;
      cotActual = JSON.parse(JSON.stringify(encontrada));
      volcarCotizacionAInputs();
      cambiarPestana('cotizar');
      mostrarToast(`Cargada ${cotActual.folio}`);
    });
  });

  tbody.querySelectorAll('[data-pdfhist]').forEach((b) => {
    b.addEventListener('click', async () => {
      const encontrada = cotizaciones.find((x) => x.folio === b.dataset.pdfhist);
      if (encontrada) await descargarCotizacionPDF(encontrada, ajustes);
    });
  });

  tbody.querySelectorAll('[data-duplicar]').forEach((b) => {
    b.addEventListener('click', () => {
      const encontrada = cotizaciones.find((x) => x.folio === b.dataset.duplicar);
      if (!encontrada) return;
      cotActual = JSON.parse(JSON.stringify(encontrada));
      cotActual.id = uid();
      cotActual.folio = generarSiguienteFolio();
      cotActual.fecha = hoyISO();
      cotActual.estado = 'Borrador';
      volcarCotizacionAInputs();
      cambiarPestana('cotizar');
      mostrarToast(`Duplicada con nuevo folio ${cotActual.folio}`);
    });
  });
}

// ── CATÁLOGO DE PRECIOS DE ACERO E INSUMOS (VIGENCIA QUINCENAL/MENSUAL) ──────
function diasDesde(fechaISO) {
  if (!fechaISO) return 0;
  const ms = Date.now() - new Date(fechaISO).getTime();
  return Math.max(0, Math.floor(ms / 86400000));
}

function revisarVigenciaAceroBanner() {
  const limite = Number(ajustes.dias_alerta_acero) || 18;
  const vencidos = insumos.filter(
    (i) => i.categoria === 'Acero y Tubería' && diasDesde(i.actualizado_en) >= limite
  );
  const banner = document.getElementById('banner-acero');
  const txt = document.getElementById('banner-acero-texto');
  if (vencidos.length > 0) {
    banner.hidden = false;
    txt.innerHTML = `<strong>🔩 Revisión quincenal/mensual de acero:</strong> Tienes <strong>${vencidos.length} precios de acero</strong> con más de ${limite} días sin actualizar. Sube tu cotización más reciente de proveedor para mantener tus márgenes exactos.`;
  } else {
    banner.hidden = true;
  }
}

function renderInsumos() {
  const tbody = document.getElementById('tbody-insumos');
  const filtro = (document.getElementById('buscar-insumo')?.value || '').toLowerCase().trim();
  const limite = Number(ajustes.dias_alerta_acero) || 18;

  const filtrados = insumos.filter((i) => {
    if (!filtro) return true;
    return `${i.codigo} ${i.categoria} ${i.nombre} ${i.proveedor}`.toLowerCase().includes(filtro);
  });

  tbody.innerHTML = filtrados
    .map((i) => {
      const dias = diasDesde(i.actualizado_en);
      let badgeVig = `<span class="badge badge-ok">Al día (${dias}d)</span>`;
      if (dias >= limite * 1.6) {
        badgeVig = `<span class="badge badge-danger">⚠️ Hace ${dias}d · Actualizar</span>`;
      } else if (dias >= limite) {
        badgeVig = `<span class="badge badge-warn">⏱ Hace ${dias}d</span>`;
      }

      return `
      <tr>
        <td><strong>${escaparHTML(i.codigo)}</strong><br/><span style="font-size:0.74rem;color:var(--muted);">${escaparHTML(i.categoria)}</span></td>
        <td>${escaparHTML(i.nombre)}<br/><span style="font-size:0.74rem;color:var(--muted);">Unidad: ${escaparHTML(i.unidad)}</span></td>
        <td>
          <input type="number" step="0.01" min="0" value="${i.costo_sin_iva}" data-editcosto="${escaparAttr(i.codigo)}" style="max-width: 125px; font-weight:700;" />
        </td>
        <td>
          <input type="text" value="${escaparAttr(i.proveedor || '-')}" data-editprov="${escaparAttr(i.codigo)}" style="max-width: 145px;" />
        </td>
        <td>${badgeVig}</td>
        <td>
          <button type="button" class="btn btn-primary btn-sm" data-saveins="${escaparAttr(i.codigo)}">Actualizar</button>
        </td>
      </tr>`;
    })
    .join('');

  tbody.querySelectorAll('[data-saveins]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const cod = btn.dataset.saveins;
      const inpCosto = tbody.querySelector(`[data-editcosto="${CSS.escape(cod)}"]`);
      const inpProv = tbody.querySelector(`[data-editprov="${CSS.escape(cod)}"]`);
      const nuevoCosto = Number(inpCosto.value) || 0;
      const nuevoProv = inpProv.value.trim() || '-';
      await actualizarPrecioInsumo(cod, nuevoCosto, nuevoProv, 'Edición manual');
    });
  });

  renderHistorialInsumos();
  poblarSelectorInsumosEnCotizacion();
  revisarVigenciaAceroBanner();
}

async function actualizarPrecioInsumo(codigo, nuevoCosto, proveedor, origen = 'Manual', datosNuevos = null) {
  let item = insumos.find((x) => x.codigo === codigo);
  const ahora = new Date().toISOString();
  let costoAnterior = item ? Number(item.costo_sin_iva) || 0 : 0;

  if (item) {
    item.costo_sin_iva = +nuevoCosto.toFixed(2);
    item.proveedor = proveedor || item.proveedor;
    item.actualizado_en = ahora;
  } else if (datosNuevos) {
    item = {
      id: uid(),
      codigo,
      categoria: datosNuevos.categoria || 'Acero y Tubería',
      nombre: datosNuevos.nombre || codigo,
      unidad: datosNuevos.unidad || 'pieza',
      costo_sin_iva: +nuevoCosto.toFixed(2),
      proveedor: proveedor || '-',
      notas: datosNuevos.notas || '',
      actualizado_en: ahora,
    };
    insumos.unshift(item);
  } else {
    return;
  }

  const variacionPct = costoAnterior > 0 ? +(((nuevoCosto - costoAnterior) / costoAnterior) * 100).toFixed(2) : 0;
  const regHist = {
    id: uid(),
    insumo_codigo: item.codigo,
    nombre: item.nombre,
    proveedor: item.proveedor,
    costo_anterior: costoAnterior,
    costo_nuevo: item.costo_sin_iva,
    variacion_pct: variacionPct,
    origen,
    fecha: ahora,
  };
  historialInsumos.unshift(regHist);
  guardarRespaldoLocal();

  if (estadoNube && usuarioActual) {
    await Promise.all([
      sb.from('astas_insumos').upsert(
        {
          user_id: usuarioActual.id,
          codigo: item.codigo,
          categoria: item.categoria,
          nombre: item.nombre,
          unidad: item.unidad,
          costo_sin_iva: item.costo_sin_iva,
          proveedor: item.proveedor,
          notas: item.notas || '',
          actualizado_en: ahora,
        },
        { onConflict: 'user_id,codigo' }
      ),
      sb.from('astas_insumos_historial').insert({
        user_id: usuarioActual.id,
        insumo_codigo: regHist.insumo_codigo,
        nombre: regHist.nombre,
        proveedor: regHist.proveedor,
        costo_anterior: regHist.costo_anterior,
        costo_nuevo: regHist.costo_nuevo,
        variacion_pct: regHist.variacion_pct,
        origen: regHist.origen,
        fecha: ahora,
      }),
    ]);
  }

  renderInsumos();
  mostrarToast(`Precio actualizado: ${item.codigo} (${moneda(item.costo_sin_iva)} s/IVA)`);
}

function renderHistorialInsumos() {
  const tbody = document.getElementById('tbody-historial-insumos');
  if (!historialInsumos.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:1rem;">Aquí verás cuánto subió o bajó el acero cada mes cuando actualices precios.</td></tr>`;
    return;
  }
  tbody.innerHTML = historialInsumos
    .slice(0, 40)
    .map((h) => {
      const v = Number(h.variacion_pct) || 0;
      const cls = v > 0 ? 'badge-danger' : v < 0 ? 'badge-ok' : 'badge';
      const signo = v > 0 ? '+' : '';
      return `
      <tr>
        <td style="font-size:0.78rem;">${new Date(h.fecha).toLocaleDateString('es-MX')}</td>
        <td><strong>${escaparHTML(h.nombre)}</strong><br/><span style="font-size:0.74rem;color:var(--muted);">${escaparHTML(h.origen || '')}</span></td>
        <td>${escaparHTML(h.proveedor)}</td>
        <td>${moneda(h.costo_anterior)}</td>
        <td><strong>${moneda(h.costo_nuevo)}</strong></td>
        <td><span class="badge ${cls}">${signo}${v}%</span></td>
      </tr>`;
    })
    .join('');
}

// ── CLIENTE SEGURO DE IA (EDGE FUNCTION PRIMERO + RESPALDO DISPOSITIVO) ─────
async function archivoABase64(file) {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const res = String(reader.result || '');
      const base64 = res.includes(',') ? res.split(',')[1] : res;
      resolve({ base64, mime: file.type || 'image/jpeg' });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function invocarSoporteIA({ modo, prompt, file }) {
  const catalogoResumen = insumos.map((i) => ({
    codigo: i.codigo,
    categoria: i.categoria,
    nombre: i.nombre,
    unidad: i.unidad,
    costo_sin_iva: i.costo_sin_iva,
  }));

  let archivoBase64 = null;
  let archivoMime = null;
  if (file) {
    const conv = await archivoABase64(file);
    archivoBase64 = conv.base64;
    archivoMime = conv.mime;
  }

  // 1) Intentar primero la Edge Function segura en Supabase (sin clave en navegador)
  try {
    const { data: sessionData } = await sb.auth.getSession();
    const token = sessionData?.session?.access_token;
    if (token) {
      for (const slug of ['quick-action', 'cotizador-astas-ai']) {
        const resp = await fetch(`${SUPABASE_URL}/functions/v1/${slug}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            apikey: SUPABASE_KEY,
          },
          body: JSON.stringify({
            modo,
            prompt,
            catalogo: catalogoResumen,
            ajustes,
            archivoBase64,
            archivoMime,
          }),
        });
        if (resp.ok) {
          const json = await resp.json();
          if (json?.ok && json.data) return json.data;
        }
        if (resp.status !== 404) break;
      }
    }
  } catch (_) {
    // Caer al respaldo local si aún no se despliega la Edge Function
  }

  // 2) Respaldo opcional si René guardó una clave privada de AI Studio en este dispositivo
  const localKey = (localStorage.getItem(STORAGE_KEYS.geminiLocalKey) || '').trim();
  if (localKey) {
    return await invocarGeminiDirectoDispositivo({
      localKey,
      modo,
      prompt,
      catalogoResumen,
      archivoBase64,
      archivoMime,
    });
  }

  // 3) Si aún no hay Edge Function ni clave en el dispositivo y el modo es armar_cotizacion,
  //    usamos el motor inteligente local de ingeniería para no dejar a René tirado en la calle.
  if (modo === 'armar_cotizacion') {
    return motorIngenieriaLocalCalle(prompt);
  }

  throw new Error(
    'Para leer imágenes/PDF con IA, despliega la función cotizador-astas-ai en Supabase o pega tu clave Gemini en la pestaña ⚙️ Ajustes.'
  );
}

async function invocarGeminiDirectoDispositivo({ localKey, modo, prompt, catalogoResumen, archivoBase64, archivoMime }) {
  let instruccion = '';
  if (modo === 'armar_cotizacion') {
    instruccion = `Eres el cotizador de "Astas y Mantenimiento" (Chalco, Edo. Méx.). Usa PRIMERO los costos reales del catálogo de René y la IA solo como soporte. Factor default ${ajustes.factor_default || 3.5}. Devuelve SOLO JSON con: titulo_proyecto, cliente_nombre, cliente_empresa, cliente_ciudad, material_principal, tipo_pintura, color_acabado, tiempo_entrega, partidas:[{categoria,concepto,descripcion,cantidad,unidad,costo_unitario_directo,factor,precio_unitario_venta,es_estimado_ia,nota_interna}], viaje:{activo,destino,km_redondos,casetas_total,personas,dias,noches_hotel,costo_hotel_noche,factor_viaje,modo_cobro}, clausulas_sugeridas:{cimentacion_canastilla,no_incluye_flete,no_incluye_grua,requiere_trifasica}, resumen_ia.`;
  } else if (modo === 'actualizar_acero') {
    instruccion = `Extrae precios de acero/herrajes SIN IVA (si traen IVA 16% divide entre 1.16). Empareja con códigos del catálogo de René si existen. Devuelve SOLO JSON: {proveedor_detectado, resumen, materiales:[{codigo,categoria,nombre,unidad,costo_sin_iva,notas}]}.`;
  } else {
    instruccion = `Audita esta cotización comparándola contra el catálogo real de René y precios reales de México (MXN). Devuelve SOLO JSON: {veredicto, nivel_alerta, total_cotizado_detectado, costo_directo_real_min, costo_directo_real_max, precio_justo_venta_con_iva_min, precio_justo_venta_con_iva_max, desglose_real:[{concepto,rango_costo_mxn,fuente}], alertas_tecnicas:[string], vacios_comerciales:[string], recomendacion_rene}.`;
  }

  const parts = [
    {
      text: `CATÁLOGO REAL DE RENÉ:\n${JSON.stringify(catalogoResumen)}\n\nPARÁMETROS CHALCO:\n${JSON.stringify(ajustes)}\n\nSOLICITUD:\n${prompt || 'Analiza el documento adjunto.'}`,
    },
  ];
  if (archivoBase64 && archivoMime) {
    parts.push({ inlineData: { mimeType: archivoMime, data: archivoBase64 } });
  }

  const r = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': localKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: instruccion }] },
        contents: [{ role: 'user', parts }],
        generationConfig: { temperature: 0.2, responseMimeType: 'application/json' },
      }),
    }
  );
  const j = await r.json();
  if (!r.ok) throw new Error(j?.error?.message || 'Error al conectar con Gemini');
  return JSON.parse(j.candidates[0].content.parts[0].text);
}

// Motor inteligente offline/instantáneo para la calle si aún no se configura la API key
function motorIngenieriaLocalCalle(texto) {
  const t = (texto || '').toLowerCase();
  const factor = Number(ajustes.factor_default) || 3.5;
  const esEpoxica = t.includes('epox') || t.includes('epóx') || t.includes('poliuretano');
  const esInox = t.includes('inox');
  const esAluminio = t.includes('aluminio');

  const material = esInox
    ? 'Acero Inoxidable AISI 304'
    : esAluminio
    ? 'Aluminio Estructural Anodizado'
    : OPCIONES_MATERIAL[0];
  const pintura = esEpoxica ? OPCIONES_PINTURA[1].label : OPCIONES_PINTURA[0].label;
  let color = 'Color a elegir';
  if (t.includes('blanc')) color = 'Blanco Institucional';
  else if (t.includes('negro')) color = 'Negro Mate Estructural';
  else if (t.includes('gris') || t.includes('plata')) color = 'Gris Acero / Plata Metálico';

  const partidas = [];
  const base10 = Number(insumos.find((i) => i.codigo === 'BASE-ASTA-10C')?.costo_sin_iva) || 4157;

  // Caso 1: René dictó costos sueltos tipo "material 1007 matraca 2650 pintura 500"
  const numerosGrandes = [...t.matchAll(/(\d{3,6}(?:\.\d+)?)/g)].map((m) => Number(m[1]));
  if ((t.includes('matraca') || t.includes('material')) && numerosGrandes.length >= 2 && !t.includes("25'") && !t.includes('pies')) {
    const sumaCostos = numerosGrandes.reduce((a, b) => a + b, 0);
    const altMatch = t.match(/(\d+(?:\.\d+)?)\s*(?:m|metros|mts)/);
    const altura = altMatch ? altMatch[1] : '10';
    partidas.push({
      categoria: 'Fabricación',
      concepto: `Fabricación y suministro de Asta Bandera de ${altura}m (${material})`,
      descripcion: `- Asta bandera estructural de ${altura} metros de altura\n- Tubería estructural Cédula 40 soldada bajo norma AWS\n- Placa base con cartabones, aguilón con poleas, matraca y cable de acero\n- Esfera de remate y acabado en ${pintura} (${color})`,
      cantidad: 1,
      unidad: 'pieza',
      costo_unitario_directo: +sumaCostos.toFixed(2),
      factor,
      precio_unitario_venta: +(sumaCostos * factor).toFixed(2),
      es_estimado_ia: false,
      nota_interna: `Suma directa de tus materiales dictados (${numerosGrandes.join(' + ')})`,
    });
  } else {
    // Caso 2: Detectar piezas en pies o metros (ej. "2 piezas de 25' y 2 de 30'" o "asta de 15 metros")
    const regexPies = /(\d+)\s*(?:piezas?|pzas?|astas?)?\s*(?:de\s*)?(\d+)\s*(?:'|pies|ft)/gi;
    let mPies;
    while ((mPies = regexPies.exec(texto)) !== null) {
      const cant = Number(mPies[1]) || 1;
      const pies = Number(mPies[2]);
      const metros = +(pies * 0.3048).toFixed(2);
      const costoEscala = +(base10 * Math.pow(metros / 10, 0.36) * (esInox ? 2.2 : 1) + (esEpoxica ? 950 : 0)).toFixed(2);
      partidas.push({
        categoria: 'Fabricación',
        concepto: `Fabricación y suministro de Asta Bandera de ${pies}' (${metros} m)`,
        descripcion: `- Asta bandera institucional de ${metros} m (${pies} pies) en tramos ensamblables\n- Fabricada en ${material}\n- Incluye placa base, cartabones, canastilla de anclaje, poleas, cable de acero y remate\n- Acabado: ${pintura} (${color})`,
        cantidad: cant,
        unidad: 'pieza',
        costo_unitario_directo: costoEscala,
        factor,
        precio_unitario_venta: +(costoEscala * factor).toFixed(2),
        es_estimado_ia: pies !== 25 && pies !== 30,
        nota_interna: `Escalado desde tu base de 10m (${moneda(base10)})`,
      });
    }

    if (!partidas.length) {
      const mMetros = t.match(/(?:(\d+)\s*(?:piezas?|astas?)\s*(?:de\s*)?)?(\d+(?:\.\d+)?)\s*(?:m|metros|mts)\b/);
      const cant = mMetros && mMetros[1] ? Number(mMetros[1]) : 1;
      const metros = mMetros ? Number(mMetros[2]) : 10;
      const costoEscala =
        metros === 10
          ? base10 + (esEpoxica ? 1150 : 0)
          : +(base10 * Math.pow(metros / 10, metros > 12 ? 1.45 : 0.85) * (esInox ? 2.2 : 1) + (esEpoxica ? 1150 : 0)).toFixed(2);
      partidas.push({
        categoria: 'Fabricación',
        concepto: `Fabricación y suministro de Asta Bandera de ${metros} m`,
        descripcion: `- Asta bandera estructural de ${metros} metros de altura en ${material}\n- Placa base calculada, cartabones de refuerzo, sistema de izaje completo y remate superior\n- Recubrimiento: ${pintura} (${color})`,
        cantidad: cant,
        unidad: 'pieza',
        costo_unitario_directo: costoEscala,
        factor,
        precio_unitario_venta: +(costoEscala * factor).toFixed(2),
        es_estimado_ia: metros !== 10,
        nota_interna: metros === 10 ? 'Tu precio real catálogo 10m' : 'Escalado proporcional desde tu base 10m',
      });
    }
  }

  // Detectar si menciona ciudad/viaje
  let rutaDetectada = null;
  if (t.includes('puebla')) rutaDetectada = RUTAS_DESDE_CHALCO.find((r) => r.id === 'puebla');
  else if (t.includes('monterrey') || t.includes('santa catarina') || t.includes('nuevo le'))
    rutaDetectada = RUTAS_DESDE_CHALCO.find((r) => r.id === 'monterrey');
  else if (t.includes('queretaro') || t.includes('querétaro')) rutaDetectada = RUTAS_DESDE_CHALCO.find((r) => r.id === 'queretaro');
  else if (t.includes('veracruz')) rutaDetectada = RUTAS_DESDE_CHALCO.find((r) => r.id === 'veracruz');
  else if (t.includes('tampico') || t.includes('madero')) rutaDetectada = RUTAS_DESDE_CHALCO.find((r) => r.id === 'tampico');
  else if (t.includes('guadalajara') || t.includes('jalisco')) rutaDetectada = RUTAS_DESDE_CHALCO.find((r) => r.id === 'guadalajara');
  else if (t.includes('pachuca') || t.includes('hidalgo')) rutaDetectada = RUTAS_DESDE_CHALCO.find((r) => r.id === 'pachuca');
  else if (t.includes('cuernavaca') || t.includes('morelos')) rutaDetectada = RUTAS_DESDE_CHALCO.find((r) => r.id === 'cuernavaca');

  const pideInstalacion = t.includes('instalac') || t.includes('viaje') || t.includes('traslado') || !!rutaDetectada;

  return {
    titulo_proyecto: partidas[0]?.concepto || 'Cotización de Asta Bandera',
    cliente_nombre: 'A quien corresponda',
    cliente_empresa: '',
    cliente_ciudad: rutaDetectada ? rutaDetectada.nombre : '',
    material_principal: material,
    tipo_pintura: pintura,
    color_acabado: color,
    tiempo_entrega: '10 a 15 días hábiles a partir de anticipo',
    partidas,
    viaje: rutaDetectada
      ? {
          activo: pideInstalacion,
          destino: rutaDetectada.nombre,
          km_redondos: rutaDetectada.km_redondos,
          casetas_total: rutaDetectada.casetas,
          personas: 3,
          dias: rutaDetectada.dias,
          noches_hotel: rutaDetectada.noches,
          costo_hotel_noche: ajustes.hotel_noche_default,
          factor_viaje: 1.35,
          modo_cobro: 'separado',
        }
      : { activo: false },
    clausulas_sugeridas: {
      cimentacion_canastilla: pideInstalacion,
      no_incluye_flete: !pideInstalacion,
      no_incluye_grua: t.includes('15m') || t.includes('20m') || t.includes('25m'),
      requiere_trifasica: t.includes('motor') || t.includes('trif'),
    },
    resumen_ia:
      'Calculado al instante con tus precios base de taller y rutas desde Chalco (conecta Gemini en Ajustes o Edge Function cuando quieras lectura avanzada con IA).',
  };
}

// ── AJUSTES Y AUTH ───────────────────────────────────────────────────────────
function volcarAjustesAInputs() {
  document.getElementById('aj-factor').value = ajustes.factor_default ?? 3.5;
  document.getElementById('aj-anticipo').value = ajustes.anticipo_default ?? 75;
  document.getElementById('aj-vigencia').value = ajustes.vigencia_default ?? 30;
  document.getElementById('aj-alerta-acero').value = ajustes.dias_alerta_acero ?? 18;
  document.getElementById('aj-gasolina').value = ajustes.gasolina_litro ?? 24.5;
  document.getElementById('aj-rendimiento').value = ajustes.rendimiento_km_litro ?? 10;
  document.getElementById('aj-oficial').value = ajustes.sueldo_oficial_dia ?? 1000;
  document.getElementById('aj-ayudante').value = ajustes.sueldo_ayudante_dia ?? 600;
  document.getElementById('aj-comida').value = ajustes.comida_persona_dia ?? 250;
  document.getElementById('aj-desgaste').value = ajustes.desgaste_por_km ?? 1.8;
  document.getElementById('aj-hotel').value = ajustes.hotel_noche_default ?? 1900;
  document.getElementById('aj-folio-seq').value = ajustes.consecutivo_folio ?? 1;
  document.getElementById('aj-banco').value = ajustes.banco_nombre || '';
  document.getElementById('aj-titular').value = ajustes.banco_titular || '';
  document.getElementById('aj-clabe').value = ajustes.banco_clabe || '';
  document.getElementById('aj-rfc').value = ajustes.rfc_emisor || '';
  document.getElementById('aj-gemini-local').value = localStorage.getItem(STORAGE_KEYS.geminiLocalKey) || '';
}

async function guardarAjustesEnNube() {
  guardarRespaldoLocal();
  if (estadoNube && usuarioActual) {
    await sb.from('astas_config').upsert(
      {
        user_id: usuarioActual.id,
        ajustes,
        actualizado_en: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );
  }
}

function cambiarPestana(tabId) {
  document.querySelectorAll('#main-tabs .tab-btn').forEach((b) => {
    b.classList.toggle('active', b.dataset.tab === tabId);
  });
  document.querySelectorAll('.tab-panel').forEach((sec) => {
    sec.hidden = sec.id !== `tab-${tabId}`;
  });
  document.getElementById('bottom-bar').hidden = tabId !== 'cotizar';
}

// ── ENLAZAR EVENTOS DE INTERFAZ ──────────────────────────────────────────────
function enlazarEventosUI() {
  // Navegación pestañas
  document.querySelectorAll('#main-tabs .tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => cambiarPestana(btn.dataset.tab));
  });

  document.getElementById('btn-ir-acero').addEventListener('click', () => cambiarPestana('insumos'));
  document.getElementById('btn-reintentar-sync').addEventListener('click', async () => {
    await sincronizarDesdeSupabase();
    renderInsumos();
    renderHistorial();
  });

  // Botón + Nueva cotización limpia
  document.getElementById('btn-nueva-limpia').addEventListener('click', () => {
    cotActual = crearCotizacionEnBlanco();
    cotActual.folio = generarSiguienteFolio();
    cotActual.anticipo_pct = ajustes.anticipo_default || 75;
    cotActual.vigencia_dias = ajustes.vigencia_default || 30;
    volcarCotizacionAInputs();
    cambiarPestana('cotizar');
    mostrarToast(`Nueva cotización ${cotActual.folio}`);
  });

  // Campos generales de la cotización
  const mapeoInputs = [
    ['cot-folio', 'folio'],
    ['cot-fecha', 'fecha'],
    ['cot-estado', 'estado'],
    ['cot-ciudad', 'cliente_ciudad'],
    ['cot-titulo', 'titulo_proyecto'],
    ['cot-cliente', 'cliente_nombre'],
    ['cot-empresa', 'cliente_empresa'],
    ['cot-telefono', 'cliente_telefono'],
    ['cot-correo', 'cliente_correo'],
    ['cot-material', 'material_principal'],
    ['cot-color', 'color_acabado'],
    ['cot-entrega', 'tiempo_entrega'],
    ['cot-garantia', 'garantia'],
    ['cot-notas-internas', 'notas_internas'],
  ];

  mapeoInputs.forEach(([id, prop]) => {
    const el = document.getElementById(id);
    el.addEventListener('input', () => {
      cotActual[prop] = el.value;
      recalcularTotalesCotizacion();
    });
  });

  // Cambio entre Pintura Normal vs Pintura Epóxica
  document.getElementById('cot-pintura').addEventListener('change', (e) => {
    const anteriorEraEpox = (cotActual.tipo_pintura || '').toLowerCase().includes('epóx');
    const nuevaPintura = e.target.value;
    const ahoraEsEpox = nuevaPintura.toLowerCase().includes('epóx');
    cotActual.tipo_pintura = nuevaPintura;

    if (anteriorEraEpox !== ahoraEsEpox) {
      const diff = ahoraEsEpox ? 1150 : -1150;
      cotActual.partidas.forEach((p) => {
        if (p.categoria === 'Fabricación' || p.categoria === 'Mantenimiento') {
          p.costo_unitario_directo = Math.max(0, +(Number(p.costo_unitario_directo) + diff).toFixed(2));
          p.precio_unitario_venta = +(p.costo_unitario_directo * (Number(p.factor) || 3.5)).toFixed(2);
        }
      });
      renderPartidas();
      mostrarToast(ahoraEsEpox ? 'Pintura Epóxica aplicada (+costo recubrimiento)' : 'Pintura Esmalte Normal aplicada');
    }
    recalcularTotalesCotizacion();
  });

  document.getElementById('cot-anticipo').addEventListener('input', (e) => {
    cotActual.anticipo_pct = Number(e.target.value) || 0;
    recalcularTotalesCotizacion();
  });
  document.getElementById('cot-vigencia').addEventListener('input', (e) => {
    cotActual.vigencia_dias = Number(e.target.value) || 30;
    recalcularTotalesCotizacion();
  });

  // Cláusulas de 1 clic
  const bindCheck = (id, key) => {
    document.getElementById(id).addEventListener('change', (e) => {
      cotActual.clausulas[key] = e.target.checked;
      guardarRespaldoLocal();
    });
  };
  bindCheck('cl-cimentacion', 'cimentacion_canastilla');
  bindCheck('cl-flete', 'no_incluye_flete');
  bindCheck('cl-grua', 'no_incluye_grua');
  bindCheck('cl-trifasica', 'requiere_trifasica');
  bindCheck('cl-banco', 'mostrar_datos_bancarios');
  document.getElementById('cl-nota-extra').addEventListener('input', (e) => {
    cotActual.clausulas.nota_extra = e.target.value;
    guardarRespaldoLocal();
  });

  // Agregar partida libre o desde catálogo
  document.getElementById('btn-agregar-vacia').addEventListener('click', () => {
    cotActual.partidas.push({
      id: uid(),
      categoria: 'Fabricación',
      concepto: 'Concepto de fabricación / suministro / servicio',
      descripcion: '- Especificación técnica del trabajo a realizar',
      cantidad: 1,
      unidad: 'pieza',
      costo_unitario_directo: 1000,
      factor: Number(ajustes.factor_default) || 3.5,
      precio_unitario_venta: +(1000 * (Number(ajustes.factor_default) || 3.5)).toFixed(2),
      es_estimado_ia: false,
      nota_interna: '',
    });
    renderPartidas();
    recalcularTotalesCotizacion();
  });

  document.getElementById('btn-agregar-desde-insumo').addEventListener('click', () => {
    poblarSelectorInsumosEnCotizacion();
    document.getElementById('box-selector-insumo').hidden = false;
  });
  document.getElementById('btn-cerrar-insumo').addEventListener('click', () => {
    document.getElementById('box-selector-insumo').hidden = true;
  });
  document.getElementById('btn-confirmar-insumo').addEventListener('click', () => {
    const cod = document.getElementById('sel-insumo-catalogo').value;
    const ins = insumos.find((x) => x.codigo === cod);
    if (!ins) return;
    const f = Number(ajustes.factor_default) || 3.5;
    cotActual.partidas.push({
      id: uid(),
      categoria: ins.categoria.includes('Motor') ? 'Izaje Motorizado' : ins.categoria.includes('Bandera') ? 'Banderas / Escritorio' : 'Fabricación',
      concepto: ins.nombre,
      descripcion: `- Suministro e integración de ${ins.nombre}\n- Unidad: ${ins.unidad}`,
      cantidad: 1,
      unidad: ins.unidad,
      costo_unitario_directo: Number(ins.costo_sin_iva) || 0,
      factor: f,
      precio_unitario_venta: +((Number(ins.costo_sin_iva) || 0) * f).toFixed(2),
      es_estimado_ia: false,
      nota_interna: `Código catálogo: ${ins.codigo}`,
    });
    document.getElementById('box-selector-insumo').hidden = true;
    renderPartidas();
    recalcularTotalesCotizacion();
  });

  // Calculadora de viaje desde Chalco
  document.getElementById('viaje-activo').addEventListener('change', (e) => {
    cotActual.viaje.activo = e.target.checked;
    document.getElementById('panel-viaje').hidden = !e.target.checked;
    if (e.target.checked) {
      // Si activa viaje foráneo, sugerimos desactivar "no incluye flete" si lleva traslado
      cotActual.clausulas.no_incluye_flete = false;
      document.getElementById('cl-flete').checked = false;
    }
    recalcularTotalesCotizacion();
    document.getElementById('viaje-venta-manual').value = cotActual.viaje.precio_venta_viaje || 0;
  });

  document.getElementById('viaje-ruta').addEventListener('change', (e) => {
    const r = RUTAS_DESDE_CHALCO.find((x) => x.id === e.target.value);
    if (!r) return;
    cotActual.viaje.ruta_id = r.id;
    cotActual.viaje.manual_override = false;
    if (r.id !== 'custom') {
      cotActual.viaje.destino = r.nombre;
      cotActual.viaje.km_redondos = r.km_redondos;
      cotActual.viaje.casetas_total = r.casetas;
      cotActual.viaje.dias = r.dias;
      cotActual.viaje.noches_hotel = r.noches;
      if (!cotActual.cliente_ciudad) {
        cotActual.cliente_ciudad = r.nombre;
        document.getElementById('cot-ciudad').value = r.nombre;
      }
    }
    volcarCotizacionAInputs();
  });

  const bindViajeNum = (id, key) => {
    document.getElementById(id).addEventListener('input', (e) => {
      cotActual.viaje[key] = Number(e.target.value) || 0;
      cotActual.viaje.manual_override = false;
      recalcularTotalesCotizacion();
      document.getElementById('viaje-venta-manual').value = cotActual.viaje.precio_venta_viaje || 0;
    });
  };
  bindViajeNum('viaje-km', 'km_redondos');
  bindViajeNum('viaje-casetas', 'casetas_total');
  bindViajeNum('viaje-personas', 'personas');
  bindViajeNum('viaje-dias', 'dias');
  bindViajeNum('viaje-noches', 'noches_hotel');
  bindViajeNum('viaje-hotel', 'costo_hotel_noche');
  bindViajeNum('viaje-factor', 'factor_viaje');

  document.getElementById('viaje-destino').addEventListener('input', (e) => {
    cotActual.viaje.destino = e.target.value;
    guardarRespaldoLocal();
  });
  document.getElementById('viaje-modo').addEventListener('change', (e) => {
    cotActual.viaje.modo_cobro = e.target.value;
    recalcularTotalesCotizacion();
  });
  document.getElementById('viaje-venta-manual').addEventListener('input', (e) => {
    cotActual.viaje.manual_override = true;
    cotActual.viaje.precio_venta_viaje = Number(e.target.value) || 0;
    recalcularTotalesCotizacion();
  });

  // Dictado por voz para cuando René va en la calle
  document.getElementById('btn-voz-dictar').addEventListener('click', () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      mostrarToast('Usa el micrófono del teclado de tu iPhone para dictar');
      document.getElementById('ai-street-prompt').focus();
      return;
    }
    const rec = new SpeechRec();
    rec.lang = 'es-MX';
    rec.interimResults = false;
    const btn = document.getElementById('btn-voz-dictar');
    btn.textContent = '🔴 Escuchando...';
    rec.onresult = (ev) => {
      const trans = ev.results[0][0].transcript;
      const box = document.getElementById('ai-street-prompt');
      box.value = (box.value ? box.value + ' ' : '') + trans;
    };
    rec.onend = () => {
      btn.textContent = '🎙️ Dictar por voz';
    };
    rec.start();
  });

  // Armar cotización rápida con Soporte IA
  document.getElementById('btn-ai-armar').addEventListener('click', async () => {
    const prompt = document.getElementById('ai-street-prompt').value.trim();
    if (!prompt) {
      mostrarToast('Escribe o dicta primero lo que te pidió el cliente');
      return;
    }
    const btn = document.getElementById('btn-ai-armar');
    const fb = document.getElementById('ai-street-feedback');
    btn.disabled = true;
    btn.textContent = '⏳ Calculando con tus precios...';

    try {
      const r = await invocarSoporteIA({ modo: 'armar_cotizacion', prompt });
      if (r.titulo_proyecto) cotActual.titulo_proyecto = r.titulo_proyecto;
      if (r.cliente_nombre) cotActual.cliente_nombre = r.cliente_nombre;
      if (r.cliente_empresa) cotActual.cliente_empresa = r.cliente_empresa;
      if (r.cliente_ciudad) cotActual.cliente_ciudad = r.cliente_ciudad;
      if (r.material_principal) cotActual.material_principal = r.material_principal;
      if (r.tipo_pintura) cotActual.tipo_pintura = r.tipo_pintura;
      if (r.color_acabado) cotActual.color_acabado = r.color_acabado;
      if (r.tiempo_entrega) cotActual.tiempo_entrega = r.tiempo_entrega;

      if (Array.isArray(r.partidas) && r.partidas.length) {
        cotActual.partidas = r.partidas.map((p) => {
          const costo = Number(p.costo_unitario_directo) || 0;
          const fac = Number(p.factor) || Number(ajustes.factor_default) || 3.5;
          const venta = Number(p.precio_unitario_venta) || +(costo * fac).toFixed(2);
          return {
            id: uid(),
            categoria: p.categoria || 'Fabricación',
            concepto: p.concepto || 'Partida',
            descripcion: p.descripcion || '',
            cantidad: Number(p.cantidad) || 1,
            unidad: p.unidad || 'pieza',
            costo_unitario_directo: costo,
            factor: fac,
            precio_unitario_venta: venta,
            es_estimado_ia: !!p.es_estimado_ia,
            nota_interna: p.nota_interna || '',
          };
        });
      }

      if (r.viaje && typeof r.viaje.activo === 'boolean') {
        cotActual.viaje = {
          ...cotActual.viaje,
          ...r.viaje,
          manual_override: false,
        };
      }
      if (r.clausulas_sugeridas) {
        cotActual.clausulas = {
          ...cotActual.clausulas,
          ...r.clausulas_sugeridas,
        };
      }

      volcarCotizacionAInputs();
      fb.hidden = false;
      fb.textContent = `✓ ${r.resumen_ia || 'Cotización armada. Revisa los montos y descarga o envía el PDF por WhatsApp.'}`;
      mostrarToast('¡Cotización armada!');
    } catch (err) {
      mostrarToast(err.message || 'Error al armar cotización');
    } finally {
      btn.disabled = false;
      btn.textContent = '⚡ Armar Cotización con IA';
    }
  });

  // Acciones PDF y WhatsApp (Barra inferior + Modal)
  document.getElementById('btn-guardar-cot').addEventListener('click', () => guardarCotizacionActual(false));

  document.getElementById('btn-vista-previa').addEventListener('click', async () => {
    await guardarCotizacionActual(true);
    const url = await previsualizarCotizacionPDF(cotActual, ajustes);
    document.getElementById('iframe-pdf').src = url;
    document.getElementById('modal-pdf-titulo').textContent = `${cotActual.folio} — ${cotActual.titulo_proyecto}`;
    document.getElementById('modal-pdf').hidden = false;
  });

  document.getElementById('btn-modal-cerrar').addEventListener('click', () => {
    document.getElementById('modal-pdf').hidden = true;
  });

  const accionDescargar = async () => {
    await guardarCotizacionActual(true);
    await descargarCotizacionPDF(cotActual, ajustes);
    mostrarToast('PDF descargado');
  };
  const accionWA = async () => {
    await guardarCotizacionActual(true);
    await compartirCotizacionWhatsApp(cotActual, ajustes);
  };

  document.getElementById('btn-descargar-pdf').addEventListener('click', accionDescargar);
  document.getElementById('btn-modal-descargar').addEventListener('click', accionDescargar);
  document.getElementById('btn-enviar-wa').addEventListener('click', accionWA);
  document.getElementById('btn-modal-wa').addEventListener('click', accionWA);

  // Filtros en Historial e Insumos
  document.getElementById('buscar-historial').addEventListener('input', renderHistorial);
  document.getElementById('buscar-insumo').addEventListener('input', renderInsumos);

  // Nuevo insumo manual
  document.getElementById('btn-nuevo-insumo').addEventListener('click', () => {
    document.getElementById('form-nuevo-insumo').hidden = false;
  });
  document.getElementById('btn-cancelar-nuevo-insumo').addEventListener('click', () => {
    document.getElementById('form-nuevo-insumo').hidden = true;
  });
  document.getElementById('btn-guardar-nuevo-insumo').addEventListener('click', async () => {
    const cod = document.getElementById('ni-codigo').value.trim().toUpperCase();
    const nom = document.getElementById('ni-nombre').value.trim();
    const costo = Number(document.getElementById('ni-costo').value) || 0;
    if (!cod || !nom) {
      mostrarToast('Pon código y nombre del material');
      return;
    }
    await actualizarPrecioInsumo(cod, costo, document.getElementById('ni-proveedor').value.trim(), 'Alta manual', {
      categoria: document.getElementById('ni-categoria').value,
      nombre: nom,
      unidad: document.getElementById('ni-unidad').value.trim() || 'pieza',
    });
    document.getElementById('form-nuevo-insumo').hidden = true;
  });

  // Lector quincenal/mensual de cotización de proveedores de acero
  document.getElementById('btn-procesar-acero').addEventListener('click', async () => {
    const file = document.getElementById('acero-archivo').files[0];
    const texto = document.getElementById('acero-texto').value.trim();
    if (!file && !texto) {
      mostrarToast('Sube la foto/PDF de tu proveedor o pega los precios');
      return;
    }
    const btn = document.getElementById('btn-procesar-acero');
    const preview = document.getElementById('panel-preview-acero');
    btn.disabled = true;
    btn.textContent = '⏳ Leyendo precios del proveedor...';

    try {
      const res = await invocarSoporteIA({ modo: 'actualizar_acero', prompt: texto, file });
      propuestosAceroTemp = Array.isArray(res.materiales) ? res.materiales : [];
      if (!propuestosAceroTemp.length) throw new Error('No se detectaron precios claros en el documento.');

      const prov = res.proveedor_detectado || 'Proveedor Acero';
      preview.hidden = false;
      preview.innerHTML = `
        <h4 style="margin:0 0 0.4rem;">✓ Precios detectados (${escaparHTML(prov)})</h4>
        <p style="margin:0 0 0.7rem;font-size:0.82rem;color:var(--muted);">${escaparHTML(res.resumen || 'Marca los materiales que deseas actualizar en tu catálogo:')}</p>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Aplicar</th><th>Código</th><th>Material</th><th>Anterior s/IVA</th><th>Nuevo s/IVA</th></tr></thead>
            <tbody>
              ${propuestosAceroTemp
                .map((m, idx) => {
                  const actual = insumos.find((x) => x.codigo === m.codigo);
                  return `<tr>
                    <td><input type="checkbox" checked data-chkacero="${idx}" /></td>
                    <td><strong>${escaparHTML(m.codigo)}</strong></td>
                    <td>${escaparHTML(m.nombre)}</td>
                    <td>${actual ? moneda(actual.costo_sin_iva) : '<em>Nuevo</em>'}</td>
                    <td><strong>${moneda(m.costo_sin_iva)}</strong></td>
                  </tr>`;
                })
                .join('')}
            </tbody>
          </table>
        </div>
        <div style="margin-top:0.75rem;display:flex;gap:0.5rem;">
          <button type="button" class="btn btn-primary btn-sm" id="btn-aplicar-lote-acero">✅ Actualizar Materiales Seleccionados</button>
        </div>
      `;

      document.getElementById('btn-aplicar-lote-acero').addEventListener('click', async () => {
        const checks = preview.querySelectorAll('[data-chkacero]:checked');
        for (const ch of checks) {
          const m = propuestosAceroTemp[Number(ch.dataset.chkacero)];
          await actualizarPrecioInsumo(m.codigo, Number(m.costo_sin_iva) || 0, prov, 'Cotización proveedor IA', m);
        }
        preview.hidden = true;
        mostrarToast('¡Catálogo de acero actualizado!');
      });
    } catch (err) {
      mostrarToast(err.message || 'No se pudo leer la cotización');
    } finally {
      btn.disabled = false;
      btn.textContent = '🔍 Extraer Precios de Proveedor';
    }
  });

  // Auditor IA de cotizaciones externas
  document.getElementById('btn-ejecutar-auditoria').addEventListener('click', async () => {
    const file = document.getElementById('auditor-archivo').files[0];
    const texto = document.getElementById('auditor-texto').value.trim();
    if (!file && !texto) {
      mostrarToast('Sube foto/PDF o pega la cotización que quieres auditar');
      return;
    }
    const btn = document.getElementById('btn-ejecutar-auditoria');
    const out = document.getElementById('resultado-auditoria');
    btn.disabled = true;
    btn.textContent = '⏳ Auditando costos vs tu taller...';

    try {
      const r = await invocarSoporteIA({ modo: 'auditar_cotizacion', prompt: texto, file });
      const badgeCls = r.nivel_alerta === 'alto' ? 'badge-danger' : r.nivel_alerta === 'medio' ? 'badge-warn' : 'badge-ok';
      out.hidden = false;
      out.innerHTML = `
        <div style="border:1px solid var(--border); border-radius:12px; padding:1rem; background:#f8fafc;">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:0.5rem;flex-wrap:wrap;margin-bottom:0.75rem;">
            <h3 style="margin:0;">${escaparHTML(r.veredicto || 'Resultado de Auditoría')}</h3>
            <span class="badge ${badgeCls}">Alerta: ${escaparHTML((r.nivel_alerta || 'revisión').toUpperCase())}</span>
          </div>
          <div class="grid-3" style="margin-bottom:0.85rem;">
            <div class="card" style="margin:0;">
              <span style="font-size:0.75rem;color:var(--muted);">Monto Cotizado Detectado</span>
              <strong style="display:block;font-size:1.15rem;">${moneda(r.total_cotizado_detectado)}</strong>
            </div>
            <div class="card" style="margin:0;">
              <span style="font-size:0.75rem;color:var(--muted);">Costo Directo Real Estimado</span>
              <strong style="display:block;font-size:1.15rem;color:var(--blue);">${moneda(r.costo_directo_real_min)} – ${moneda(r.costo_directo_real_max)}</strong>
            </div>
            <div class="card" style="margin:0;">
              <span style="font-size:0.75rem;color:var(--muted);">Precio Justo Venta (c/IVA)</span>
              <strong style="display:block;font-size:1.15rem;color:var(--emerald);">${moneda(r.precio_justo_venta_con_iva_min)} – ${moneda(r.precio_justo_venta_con_iva_max)}</strong>
            </div>
          </div>
          <h4>Desglose Real Estimado</h4>
          <ul>${(r.desglose_real || []).map((d) => `<li><strong>${escaparHTML(d.concepto)}:</strong> ${escaparHTML(d.rango_costo_mxn)} <em>(${escaparHTML(d.fuente)})</em></li>`).join('')}</ul>
          <h4>Alertas Técnicas y Vacíos Comerciales</h4>
          <ul>
            ${(r.alertas_tecnicas || []).map((a) => `<li>⚠️ ${escaparHTML(a)}</li>`).join('')}
            ${(r.vacios_comerciales || []).map((v) => `<li>🔎 ${escaparHTML(v)}</li>`).join('')}
          </ul>
          <p style="margin-bottom:0;"><strong>Recomendación para René:</strong> ${escaparHTML(r.recomendacion_rene || '')}</p>
        </div>
      `;
    } catch (err) {
      mostrarToast(err.message || 'Error al auditar cotización');
    } finally {
      btn.disabled = false;
      btn.textContent = '⚖️ Analizar Costo Real vs Sobreprecio';
    }
  });

  // Guardar Ajustes
  document.getElementById('btn-guardar-ajustes').addEventListener('click', async () => {
    ajustes.factor_default = Number(document.getElementById('aj-factor').value) || 3.5;
    ajustes.anticipo_default = Number(document.getElementById('aj-anticipo').value) || 75;
    ajustes.vigencia_default = Number(document.getElementById('aj-vigencia').value) || 30;
    ajustes.dias_alerta_acero = Number(document.getElementById('aj-alerta-acero').value) || 18;
    ajustes.gasolina_litro = Number(document.getElementById('aj-gasolina').value) || 24.5;
    ajustes.rendimiento_km_litro = Number(document.getElementById('aj-rendimiento').value) || 10;
    ajustes.sueldo_oficial_dia = Number(document.getElementById('aj-oficial').value) || 1000;
    ajustes.sueldo_ayudante_dia = Number(document.getElementById('aj-ayudante').value) || 600;
    ajustes.comida_persona_dia = Number(document.getElementById('aj-comida').value) || 250;
    ajustes.desgaste_por_km = Number(document.getElementById('aj-desgaste').value) || 1.8;
    ajustes.hotel_noche_default = Number(document.getElementById('aj-hotel').value) || 1900;
    ajustes.consecutivo_folio = Math.max(1, Number(document.getElementById('aj-folio-seq').value) || 1);
    ajustes.banco_nombre = document.getElementById('aj-banco').value.trim();
    ajustes.banco_titular = document.getElementById('aj-titular').value.trim();
    ajustes.banco_clabe = document.getElementById('aj-clabe').value.trim();
    ajustes.rfc_emisor = document.getElementById('aj-rfc').value.trim();

    const gKey = document.getElementById('aj-gemini-local').value.trim();
    if (gKey) localStorage.setItem(STORAGE_KEYS.geminiLocalKey, gKey);
    else localStorage.removeItem(STORAGE_KEYS.geminiLocalKey);

    await guardarAjustesEnNube();
    recalcularTotalesCotizacion();
    revisarVigenciaAceroBanner();
    mostrarToast('Ajustes guardados');
  });
}

// ── ARRANQUE CON SUPABASE AUTH ───────────────────────────────────────────────
async function iniciarAppAutenticada(sessionUser) {
  usuarioActual = sessionUser;
  document.getElementById('auth-screen').hidden = true;
  document.getElementById('app-topbar').hidden = false;
  document.getElementById('app-main').hidden = false;
  document.getElementById('bottom-bar').hidden = false;

  cargarRespaldoLocal();
  poblarSelectoresFijos();
  await sincronizarDesdeSupabase();
  volcarAjustesAInputs();
  volcarCotizacionAInputs();
  renderInsumos();
  renderHistorial();
  enlazarEventosUI();
}

async function boot() {
  const btnTogglePass = document.getElementById('btn-toggle-pass');
  btnTogglePass.addEventListener('click', () => {
    const inp = document.getElementById('auth-password');
    inp.type = inp.type === 'password' ? 'text' : 'password';
  });

  document.getElementById('btn-logout').addEventListener('click', async () => {
    await sb.auth.signOut();
    location.reload();
  });

  document.getElementById('auth-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;
    const btn = document.getElementById('btn-auth-submit');
    const errEl = document.getElementById('auth-error');

    errEl.hidden = true;
    btn.disabled = true;
    btn.textContent = 'Entrando...';

    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    btn.disabled = false;
    btn.textContent = 'Entrar al Cotizador';

    if (error) {
      errEl.hidden = false;
      errEl.textContent =
        error.message === 'Invalid login credentials'
          ? 'Correo o contraseña incorrectos (usa el mismo acceso que en ProdLimpieza).'
          : error.message;
      return;
    }

    if (data?.session?.user) {
      await iniciarAppAutenticada(data.session.user);
    }
  });

  const { data: { session } } = await sb.auth.getSession();
  if (session?.user) {
    await iniciarAppAutenticada(session.user);
  }
}

document.addEventListener('DOMContentLoaded', boot);
