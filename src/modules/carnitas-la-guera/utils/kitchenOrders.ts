export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  guiso?: string;
  description?: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  deliveryMethod: 'recoger' | 'domicilio';
  address: string;
  paymentMethod: 'efectivo' | 'transferencia';
  cashAmount: string;
  notes: string;
  salsas: string[];
}

export interface KitchenOrder {
  id: string;
  items: CartItem[];
  customer: CustomerInfo;
  total: number;
  createdAt: string;
  whatsappUrl?: string;
  status: 'pending' | 'ready' | 'delivered';
}

export const STORAGE_KEY = 'carnitas-la-guera-orders';

export function loadOrders(): KitchenOrder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveOrders(orders: KitchenOrder[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }));
}

export function addOrder(order: Omit<KitchenOrder, 'id' | 'createdAt' | 'status'>): KitchenOrder {
  const now = new Date();
  const id = `LG${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}-${Math.floor(Math.random() * 900 + 100)}`;
  const newOrder: KitchenOrder = {
    ...order,
    id,
    createdAt: now.toISOString(),
    status: 'pending',
  };
  const orders = loadOrders();
  orders.unshift(newOrder);
  saveOrders(orders);
  return newOrder;
}

export function formatTime(iso: string) {
  return new Date(iso).toLocaleString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function printKitchenTicket(order: KitchenOrder) {
  const items = order.items.map(item => {
    const displayName = item.guiso ? `${item.name} (${item.guiso})` : item.name;
    return `
      <tr>
        <td class="qty">${item.quantity}</td>
        <td class="name">${displayName}</td>
      </tr>
      ${item.description ? `<tr><td></td><td class="desc">${item.description}</td></tr>` : ''}
    `;
  }).join('');

  const salsaList = order.customer.salsas.length > 0
    ? order.customer.salsas.join(', ')
    : 'Ninguna';

  const deliveryLabel = order.customer.deliveryMethod === 'recoger'
    ? 'RECoger EN LOCAL'
    : 'ENVÍO A DOMICILIO';

  const addressLine = order.customer.deliveryMethod === 'domicilio'
    ? `<div class="line"><span class="label">Dirección:</span> ${order.customer.address}</div>`
    : '';

  const notesLine = order.customer.notes
    ? `<div class="line highlight"><span class="label">NOTA:</span> ${order.customer.notes}</div>`
    : '';

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Pedido ${order.id}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @page { size: 58mm auto; margin: 0; }
    body {
      font-family: 'Courier New', Courier, monospace;
      width: 58mm;
      padding: 3mm 2mm;
      color: #1a1a1a;
      font-size: 11px;
      line-height: 1.25;
    }
    .brand { text-align: center; border: 2px solid #000; padding: 4px; margin-bottom: 4px; }
    .brand h1 { font-size: 14px; letter-spacing: 1px; }
    .brand h2 { font-size: 11px; }
    .meta { text-align: center; font-size: 9px; margin-bottom: 4px; color: #444; }
    .divider { border: none; border-top: 1px dashed #333; margin: 4px 0; }
    .line { margin-bottom: 2px; font-size: 10px; }
    .line .label { font-weight: bold; display: inline-block; min-width: 48px; }
    .line.highlight { background: #f5f5f5; padding: 2px; border-radius: 2px; margin-top: 3px; }
    table { width: 100%; border-collapse: collapse; margin: 4px 0; }
    th { text-align: left; border-bottom: 1px solid #000; font-size: 10px; padding-bottom: 2px; }
    td { vertical-align: top; padding: 2px 0; }
    td.qty { width: 22px; font-weight: bold; font-size: 14px; text-align: center; }
    td.name { font-weight: bold; font-size: 12px; padding-left: 4px; }
    td.desc { font-size: 9px; color: #444; padding-left: 4px; }
    .total { text-align: right; font-weight: bold; font-size: 12px; margin-top: 4px; }
    .footer { text-align: center; font-size: 8px; margin-top: 6px; color: #666; }
    @media print {
      body { width: 58mm; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="brand">
    <h1>CARNITAS Y GORDITAS</h1>
    <h2>LA GÜERA</h2>
  </div>
  <div class="meta">${formatTime(order.createdAt)} · #${order.id}</div>
  <div class="divider"></div>
  <div class="line"><span class="label">Cliente:</span> ${order.customer.name || '—'}</div>
  <div class="line"><span class="label">Tel:</span> ${order.customer.phone || '—'}</div>
  <div class="line"><span class="label">Entrega:</span> ${deliveryLabel}</div>
  ${addressLine}
  <div class="line"><span class="label">Salsas:</span> ${salsaList}</div>
  ${notesLine}
  <div class="divider"></div>
  <table>
    <tr><th class="qty">C</th><th>PRODUCTO</th></tr>
    ${items}
  </table>
  <div class="divider"></div>
  <div class="total">TOTAL: $${order.total} MXN</div>
  <div class="footer">Ticket generado desde el panel de cocina</div>
</body>
</html>`;

  const w = window.open('', '_blank', 'width=400,height=600');
  if (!w) return;
  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 350);
}
