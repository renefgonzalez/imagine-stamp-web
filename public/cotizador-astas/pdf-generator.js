// ============================================================================
// GENERADOR DE PDF PROFESIONAL B2B — ASTAS Y MANTENIMIENTO
// Genera PDF vectorial nítido (jsPDF + AutoTable), vista previa y envío directo
// como archivo adjunto a WhatsApp en iPhone / Android (Web Share API).
// ============================================================================

let cachedLogoNavy = null;
let cachedLogoWhite = null;

async function cargarImagenDataUrl(ruta) {
  try {
    const resp = await fetch(ruta);
    const blob = await resp.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (_) {
    return null;
  }
}

async function asegurarLogosCargados() {
  if (!cachedLogoWhite) cachedLogoWhite = await cargarImagenDataUrl('assets/logo-astas-blanco.png');
  if (!cachedLogoNavy) cachedLogoNavy = await cargarImagenDataUrl('assets/logo-astas.png');
}

function formatoMonedaPDF(valor) {
  const num = Number(valor) || 0;
  return '$' + num.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatearFechaLargaMX(fechaISO) {
  const meses = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
  ];
  const partes = (fechaISO || '').split('-');
  if (partes.length === 3) {
    const anio = partes[0];
    const mes = meses[parseInt(partes[1], 10) - 1] || '';
    const dia = String(parseInt(partes[2], 10)).padStart(2, '0');
    return `${dia} de ${mes} de ${anio}`;
  }
  const hoy = new Date();
  return `${String(hoy.getDate()).padStart(2, '0')} de ${meses[hoy.getMonth()]} de ${hoy.getFullYear()}`;
}

async function construirDocumentoPDF(cot, ajustes) {
  await asegurarLogosCargados();
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });

  const pageW = doc.internal.pageSize.getWidth();  // 215.9 mm
  const pageH = doc.internal.pageSize.getHeight(); // 279.4 mm
  const marginX = 14;
  const contentW = pageW - marginX * 2;

  const NAVY = [15, 23, 42];       // #0f172a
  const BLUE = [29, 78, 216];      // #1d4ed8
  const SLATE = [71, 85, 105];     // #475569
  const LIGHT_BG = [248, 250, 252];// #f8fafc
  const BORDER = [203, 213, 225];  // #cbd5e1

  // ── 1. ENCABEZADO CORPORATIVO SUPERIOR ─────────────────────────────────────
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, pageW, 38, 'F');
  doc.setFillColor(...BLUE);
  doc.rect(0, 38, pageW, 2.2, 'F');

  if (cachedLogoWhite) {
    doc.addImage(cachedLogoWhite, 'PNG', marginX, 4.5, 26, 28);
  } else if (cachedLogoNavy) {
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(marginX, 4.5, 28, 28, 2, 2, 'F');
    doc.addImage(cachedLogoNavy, 'PNG', marginX + 1, 5.5, 26, 26);
  }

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(ajustes.empresa_nombre || 'ASTAS Y MANTENIMIENTO', marginX + 31, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.8);
  doc.setTextColor(191, 219, 254);
  doc.text(
    ajustes.empresa_subtitulo || 'Ingeniería, Fabricación y Mantenimiento de Astas Bandera',
    marginX + 31,
    19.8
  );

  doc.setTextColor(226, 232, 240);
  doc.setFontSize(8);
  doc.text(`${ajustes.ubicacion_planta || 'Chalco, Estado de México'}  |  Tel/WA: ${ajustes.telefono || '56-6004-0372'}`, marginX + 31, 25.5);
  doc.text(`${ajustes.correo || 'astasymantenimiento@gmail.com'}  |  ${ajustes.sitio_web || 'https://astasymantenimiento.com'}`, marginX + 31, 30.2);

  // Caja derecha de Folio y Fecha
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(pageW - marginX - 58, 6, 58, 26, 2, 2, 'F');
  doc.setTextColor(147, 197, 253);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('COTIZACIÓN COMERCIAL', pageW - marginX - 29, 11.5, { align: 'center' });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text(cot.folio || 'COT-2026-001', pageW - marginX - 29, 18.2, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(203, 213, 225);
  doc.text(`Vigencia: ${cot.vigencia_dias || 30} días naturales`, pageW - marginX - 29, 24, { align: 'center' });
  doc.text(`Anticipo: ${cot.anticipo_pct || 75}%`, pageW - marginX - 29, 28.8, { align: 'center' });

  let cursorY = 46;

  // ── 2. LUGAR, FECHA Y TÍTULO DE PROYECTO ───────────────────────────────────
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.8);
  doc.setTextColor(...SLATE);
  doc.text(
    `${ajustes.ubicacion_planta || 'Chalco, Estado de México'} a ${formatearFechaLargaMX(cot.fecha)}`,
    pageW - marginX,
    cursorY,
    { align: 'right' }
  );

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...NAVY);
  const tituloLimpio = (cot.titulo_proyecto || 'COTIZACIÓN DE ASTA BANDERA').toUpperCase();
  const lineasTitulo = doc.splitTextToSize(tituloLimpio, contentW - 72);
  doc.text(lineasTitulo, marginX, cursorY);
  cursorY += Math.max(lineasTitulo.length * 5.2, 6) + 3;

  // ── 3. TARJETA DOBLE: DATOS DEL CLIENTE + ESPECIFICACIÓN DE ACABADO ────────
  const boxH = 27;
  doc.setFillColor(...LIGHT_BG);
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.3);
  doc.roundedRect(marginX, cursorY, contentW, boxH, 2, 2, 'FD');
  doc.line(marginX + contentW * 0.52, cursorY + 3, marginX + contentW * 0.52, cursorY + boxH - 3);

  // Columna Izquierda: Cliente
  const col1X = marginX + 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...BLUE);
  doc.text('ATENCIÓN / CLIENTE', col1X, cursorY + 5.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...NAVY);
  const atencion = (cot.cliente_nombre || 'A quien corresponda').trim();
  doc.text(doc.splitTextToSize(atencion, contentW * 0.48)[0], col1X, cursorY + 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.3);
  doc.setTextColor(...SLATE);
  const lineaEmpresa = [cot.cliente_empresa, cot.cliente_ciudad].filter(Boolean).join(' · ') || 'P R E S E N T E';
  doc.text(doc.splitTextToSize(lineaEmpresa, contentW * 0.48)[0], col1X, cursorY + 16.5);

  const lineaContacto = [cot.cliente_telefono, cot.cliente_correo].filter(Boolean).join('  |  ');
  if (lineaContacto) {
    doc.text(doc.splitTextToSize(lineaContacto, contentW * 0.48)[0], col1X, cursorY + 21.8);
  } else {
    doc.setFont('helvetica', 'bold');
    doc.text('P R E S E N T E', col1X, cursorY + 21.8);
  }

  // Columna Derecha: Material, Tipo de Pintura (Normal vs Epóxica) y Color
  const col2X = marginX + contentW * 0.52 + 4;
  const maxSpecW = contentW * 0.48 - 7;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...BLUE);
  doc.text('ESPECIFICACIÓN GENERAL DE MATERIAL Y ACABADO', col2X, cursorY + 5.5);

  doc.setFontSize(8.1);
  doc.setTextColor(...NAVY);
  doc.setFont('helvetica', 'bold');
  doc.text('Material: ', col2X, cursorY + 11);
  doc.setFont('helvetica', 'normal');
  doc.text(doc.splitTextToSize(cot.material_principal || 'Acero al Carbón Cédula 40', maxSpecW - 15)[0], col2X + 15, cursorY + 11);

  doc.setFont('helvetica', 'bold');
  doc.text('Recubrimiento: ', col2X, cursorY + 16.5);
  doc.setFont('helvetica', 'normal');
  doc.text(doc.splitTextToSize(cot.tipo_pintura || 'Esmalte Anticorrosivo', maxSpecW - 23)[0], col2X + 23, cursorY + 16.5);

  doc.setFont('helvetica', 'bold');
  doc.text('Color / Entrega: ', col2X, cursorY + 21.8);
  doc.setFont('helvetica', 'normal');
  const colorYEntrega = `${cot.color_acabado || 'Color a elegir'}  ·  ${cot.tiempo_entrega || '10 a 15 días hábiles'}`;
  doc.text(doc.splitTextToSize(colorYEntrega, maxSpecW - 24)[0], col2X + 24, cursorY + 21.8);

  cursorY += boxH + 5;

  // Texto introductorio formal
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.6);
  doc.setTextColor(...SLATE);
  doc.text(
    'Por medio de la presente ponemos a su amable consideración la siguiente propuesta técnica y económica:',
    marginX,
    cursorY
  );
  cursorY += 3.5;

  // ── 4. CONSTRUIR FILAS DE LA TABLA DE INGENIERÍA ───────────────────────────
  const filasTabla = [];
  const partidas = Array.isArray(cot.partidas) ? cot.partidas : [];
  const viaje = cot.viaje || {};

  // Si el viaje está en modo prorrateado, repartimos su precio de venta entre las partidas
  const ventaViaje = viaje.activo ? Number(viaje.precio_venta_viaje || 0) : 0;
  const totalBasePartidas = partidas.reduce(
    (acc, p) => acc + (Number(p.cantidad) || 1) * (Number(p.precio_unitario_venta) || 0),
    0
  );

  partidas.forEach((p, idx) => {
    const cant = Number(p.cantidad) || 1;
    let unitario = Number(p.precio_unitario_venta) || 0;
    if (viaje.activo && viaje.modo_cobro === 'integrado' && ventaViaje > 0 && totalBasePartidas > 0) {
      const proporcion = (cant * unitario) / totalBasePartidas;
      unitario += (ventaViaje * proporcion) / cant;
    }
    const importe = cant * unitario;
    const bloqueTexto = [
      p.concepto ? p.concepto.toUpperCase() : `PARTIDA ${idx + 1}`,
      (p.descripcion || '').trim(),
    ]
      .filter(Boolean)
      .join('\n');

    filasTabla.push([
      String(idx + 1).padStart(2, '0'),
      bloqueTexto,
      `${cant} ${p.unidad || 'pza'}`,
      formatoMonedaPDF(unitario),
      formatoMonedaPDF(importe),
    ]);
  });

  // Si el viaje está activo y se cobra como partida separada (recomendado)
  if (viaje.activo && viaje.modo_cobro !== 'integrado' && ventaViaje > 0) {
    filasTabla.push([
      String(filasTabla.length + 1).padStart(2, '0'),
      `TRASLADO, LOGÍSTICA E INSTALACIÓN TÉCNICA EN SITIO\n- Destino de obra: ${viaje.destino || cot.cliente_ciudad || 'Foráneo'}\n- Traslado de cuadrilla especializada, herramienta, maniobra de montaje, nivelación y puesta en operación`,
      '1 servicio',
      formatoMonedaPDF(ventaViaje),
      formatoMonedaPDF(ventaViaje),
    ]);
  }

  doc.autoTable({
    startY: cursorY,
    margin: { left: marginX, right: marginX, bottom: 32 },
    head: [['Part.', 'Descripción Técnica y Alcance', 'Cantidad', 'Precio Unitario', 'Importe']],
    body: filasTabla,
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 8.5,
      cellPadding: { top: 3.2, right: 3, bottom: 3.2, left: 3 },
      textColor: [30, 41, 59],
      lineColor: [203, 213, 225],
      lineWidth: 0.25,
      valign: 'top',
    },
    headStyles: {
      fillColor: NAVY,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      halign: 'center',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center', fontStyle: 'bold' },
      1: { cellWidth: contentW - 12 - 24 - 31 - 31 },
      2: { cellWidth: 24, halign: 'center' },
      3: { cellWidth: 31, halign: 'right' },
      4: { cellWidth: 31, halign: 'right', fontStyle: 'bold' },
    },
  });

  cursorY = doc.lastAutoTable.finalY + 5;

  // Si queda poco espacio en la hoja para totales + cláusulas + firma, abrimos página nueva limpia
  if (cursorY > pageH - 88) {
    doc.addPage();
    cursorY = 18;
  }

  // ── 5. BLOQUE INFERIOR: CONDICIONES / CLÁUSULAS (IZQ) + TOTALES Y 75% (DER) ─
  const subtotal = Number(cot.subtotal) || 0;
  const iva = Number(cot.iva) || 0;
  const total = Number(cot.total) || 0;
  const anticipoPct = Number(cot.anticipo_pct) || 75;
  const saldoPct = Math.max(0, 100 - anticipoPct);
  const montoAnticipo = total * (anticipoPct / 100);
  const montoSaldo = total - montoAnticipo;

  const totW = 74;
  const totX = pageW - marginX - totW;

  doc.setFillColor(...LIGHT_BG);
  doc.setDrawColor(...BORDER);
  doc.roundedRect(totX, cursorY, totW, 38, 2, 2, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.8);
  doc.setTextColor(...SLATE);
  doc.text('Subtotal:', totX + 4, cursorY + 6.5);
  doc.setTextColor(...NAVY);
  doc.text(formatoMonedaPDF(subtotal), totX + totW - 4, cursorY + 6.5, { align: 'right' });

  doc.setTextColor(...SLATE);
  doc.text('IVA (16%):', totX + 4, cursorY + 12.5);
  doc.setTextColor(...NAVY);
  doc.text(formatoMonedaPDF(iva), totX + totW - 4, cursorY + 12.5, { align: 'right' });

  doc.setFillColor(...NAVY);
  doc.rect(totX, cursorY + 15.5, totW, 9, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text('TOTAL NETO MXN:', totX + 4, cursorY + 21.5);
  doc.text(formatoMonedaPDF(total), totX + totW - 4, cursorY + 21.5, { align: 'right' });

  // Desglose automático del 75% de anticipo
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  doc.setTextColor(...BLUE);
  doc.text(`Anticipo (${anticipoPct}%):`, totX + 4, cursorY + 29.5);
  doc.text(formatoMonedaPDF(montoAnticipo), totX + totW - 4, cursorY + 29.5, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...SLATE);
  doc.text(`Contra aviso/entrega (${saldoPct}%):`, totX + 4, cursorY + 34.8);
  doc.text(formatoMonedaPDF(montoSaldo), totX + totW - 4, cursorY + 34.8, { align: 'right' });

  // Lista de Cláusulas Comerciales y Técnicas a la izquierda
  const notasW = contentW - totW - 6;
  const cl = cot.clausulas || {};
  const listaNotas = [];

  listaNotas.push(
    `• Condiciones de pago: ${anticipoPct}% de anticipo (${formatoMonedaPDF(montoAnticipo)}) al autorizar pedido y ${saldoPct}% (${formatoMonedaPDF(montoSaldo)}) contra aviso de entrega / término.`
  );
  listaNotas.push(
    `• Vigencia de la cotización: ${cot.vigencia_dias || 30} días naturales (sujeta a variaciones en el precio del acero posterior a esta fecha).`
  );
  if (cot.tiempo_entrega) {
    listaNotas.push(`• Tiempo estimado de entrega: ${cot.tiempo_entrega}.`);
  }
  if (cot.garantia) {
    listaNotas.push(`• Garantía: ${cot.garantia}.`);
  }
  if (cl.cimentacion_canastilla) {
    listaNotas.push(
      '• Cimentación: Incluye suministro de canastilla de anclaje y plano técnico. No incluye obra civil (excavación ni colado de concreto f\'c 250 kg/cm²), la cual ejecuta el cliente en sitio con mínimo 7 días de fraguado previo al montaje.'
    );
  }
  if (cl.no_incluye_flete) {
    listaNotas.push('• Flete: No incluye flete ni maniobras de envío foráneo (entrega en planta Chalco o envío por cobrar).');
  }
  if (cl.no_incluye_grua) {
    listaNotas.push('• Maquinaria de elevación: No incluye renta de grúa articulada/telescópica ni plataforma elevadora.');
  }
  if (cl.requiere_trifasica) {
    listaNotas.push('• Acometida eléctrica: El cliente deberá proveer alimentación eléctrica 220V trifásica a pie de asta.');
  }
  if (cl.nota_extra && cl.nota_extra.trim()) {
    listaNotas.push(`• Nota adicional: ${cl.nota_extra.trim()}`);
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.2);
  doc.setTextColor(...NAVY);
  doc.text('CONDICIONES COMERCIALES Y ALCANCE TÉCNICO', marginX, cursorY + 4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.7);
  doc.setTextColor(...SLATE);
  let notaY = cursorY + 8.8;
  listaNotas.forEach((linea) => {
    const envueltas = doc.splitTextToSize(linea, notasW);
    if (notaY + envueltas.length * 3.6 > pageH - 36) {
      doc.addPage();
      notaY = 18;
    }
    doc.text(envueltas, marginX, notaY);
    notaY += envueltas.length * 3.6 + 1.1;
  });

  cursorY = Math.max(notaY + 2, cursorY + 42);

  // Datos bancarios opcionales
  if (cl.mostrar_datos_bancarios && (ajustes.banco_clabe || ajustes.banco_cuenta)) {
    if (cursorY > pageH - 44) {
      doc.addPage();
      cursorY = 18;
    }
    doc.setFillColor(239, 246, 255);
    doc.setDrawColor(147, 197, 253);
    doc.roundedRect(marginX, cursorY, contentW, 13, 1.5, 1.5, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.8);
    doc.setTextColor(...BLUE);
    doc.text('DATOS BANCARIOS PARA DEPÓSITO / TRANSFERENCIA:', marginX + 3, cursorY + 5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...NAVY);
    const infoBanco = [
      ajustes.banco_nombre ? `Banco: ${ajustes.banco_nombre}` : '',
      ajustes.banco_titular ? `Titular: ${ajustes.banco_titular}` : '',
      ajustes.banco_clabe ? `CLABE: ${ajustes.banco_clabe}` : '',
      ajustes.banco_cuenta ? `Cuenta: ${ajustes.banco_cuenta}` : '',
      ajustes.rfc_emisor ? `RFC: ${ajustes.rfc_emisor}` : '',
    ]
      .filter(Boolean)
      .join('   |   ');
    doc.text(infoBanco, marginX + 3, cursorY + 9.8);
    cursorY += 16;
  }

  // ── 6. DESPEDIDA Y FIRMA EJECUTIVA ─────────────────────────────────────────
  if (cursorY > pageH - 34) {
    doc.addPage();
    cursorY = 20;
  }
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.4);
  doc.setTextColor(...SLATE);
  doc.text(
    'Sin otro particular por el momento, agradecemos su preferencia y quedamos a sus órdenes para cualquier duda o comentario.',
    marginX,
    cursorY + 3
  );

  const firmaY = Math.max(cursorY + 17, pageH - 27);
  doc.setDrawColor(...NAVY);
  doc.setLineWidth(0.4);
  doc.line(pageW / 2 - 38, firmaY, pageW / 2 + 38, firmaY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...NAVY);
  doc.text(ajustes.director_nombre || 'Lic. René Félix González Granados', pageW / 2, firmaY + 4.8, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...SLATE);
  doc.text(
    `${ajustes.director_cargo || 'Dirección General'} · ${ajustes.empresa_nombre || 'Astas y Mantenimiento'}`,
    pageW / 2,
    firmaY + 9,
    { align: 'center' }
  );

  // Barra de pie de página en todas las hojas
  const totalPages = doc.internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFillColor(...NAVY);
    doc.rect(0, pageH - 11, pageW, 11, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(226, 232, 240);
    doc.text(
      `${ajustes.ubicacion_planta || 'Chalco, Edo. Méx.'}   ·   Tel: ${ajustes.telefono || '56-6004-0372'}   ·   ${ajustes.correo || 'astasymantenimiento@gmail.com'}   ·   ${ajustes.sitio_web || 'https://astasymantenimiento.com'}`,
      marginX,
      pageH - 4.3
    );
    doc.text(`Página ${p} de ${totalPages}`, pageW - marginX, pageH - 4.3, { align: 'right' });
  }

  return doc;
}

function nombreArchivoPDF(cot) {
  const clienteSlug = (cot.cliente_empresa || cot.cliente_nombre || 'Cliente')
    .replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 28);
  return `Cotizacion_${cot.folio || 'ASTAS'}_${clienteSlug || 'Cliente'}.pdf`;
}

async function descargarCotizacionPDF(cot, ajustes) {
  const doc = await construirDocumentoPDF(cot, ajustes);
  doc.save(nombreArchivoPDF(cot));
}

async function previsualizarCotizacionPDF(cot, ajustes) {
  const doc = await construirDocumentoPDF(cot, ajustes);
  const blobUrl = doc.output('bloburl');
  return blobUrl;
}

async function compartirCotizacionWhatsApp(cot, ajustes) {
  const doc = await construirDocumentoPDF(cot, ajustes);
  const fileName = nombreArchivoPDF(cot);
  const pdfBlob = doc.output('blob');
  const pdfFile = new File([pdfBlob], fileName, { type: 'application/pdf' });

  const anticipoMonto = formatoMonedaPDF((Number(cot.total) || 0) * ((Number(cot.anticipo_pct) || 75) / 100));
  const mensajeWA = `Buen día${cot.cliente_nombre && cot.cliente_nombre !== 'A quien corresponda' ? ' ' + cot.cliente_nombre : ''}. Le comparto la cotización *${cot.folio}* referente a *${cot.titulo_proyecto}* por un total de *${formatoMonedaPDF(cot.total)} MXN* (IVA incluido).\n\n• Material: ${cot.material_principal}\n• Acabado: ${cot.tipo_pintura} (${cot.color_acabado})\n• Anticipo (${cot.anticipo_pct || 75}%): ${anticipoMonto}\n• Vigencia: ${cot.vigencia_dias || 30} días naturales.\n\nQuedo atento a sus comentarios.\n*Lic. René Félix González Granados*\nAstas y Mantenimiento`;

  // En iPhone / Android modernos: abre hoja nativa de compartir con el PDF adjunto directo a WhatsApp
  if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
    try {
      await navigator.share({
        title: `Cotización ${cot.folio} — Astas y Mantenimiento`,
        text: mensajeWA,
        files: [pdfFile],
      });
      return { compartidoNativo: true };
    } catch (err) {
      if (err && err.name === 'AbortError') return { cancelado: true };
    }
  }

  // En PC / Escritorio: descarga el PDF y abre WhatsApp con el mensaje listo
  doc.save(fileName);
  const telLimpio = (cot.cliente_telefono || '').replace(/\D/g, '');
  const telFinal = telLimpio.length === 10 ? `52${telLimpio}` : telLimpio;
  const waUrl = telFinal
    ? `https://wa.me/${telFinal}?text=${encodeURIComponent(mensajeWA)}`
    : `https://wa.me/?text=${encodeURIComponent(mensajeWA)}`;
  setTimeout(() => {
    window.open(waUrl, '_blank', 'noopener');
  }, 350);
  return { compartidoNativo: false };
}
