import React, { useState, useMemo, useEffect } from 'react';

import t1Img from '../assets/t1.jpg';
import t2Img from '../assets/t2.jpg';
import tcImg from '../assets/tc.jpg';
import gImg from '../assets/g.jpg';
import b1Img from '../assets/b1.jpg';
import b2Img from '../assets/b2.jpg';
import b3b4Img from '../assets/b3b4.jpg';
import b5Img from '../assets/b5.jpg';

const NUMERO_WHATSAPP = "5218332038593";

const MENU = [
  { sec:"🍴 Tortas", items:[
    { id:"t1", nombre:"Torta de la Barda", desc:"La especialidad de la casa 🔥", precio:70, emoji:"🍔", img:t1Img, especial: true, ribbon: "⭐ ESPECIAL", hasNotes: true },
    { id:"t2", nombre:"Torta de Pierna", desc:"Pierna jugosa al estilo Jimmy", precio:75, emoji:"🍔", img:t2Img, hasNotes: true },
  ]},
  { sec:"🌮 Antojitos", items:[
    { id:"tc", nombre:"Tacos de Cochinita", desc:"Con tortilla recién hecha a mano", precio:15, unidad:"c/u", emoji:"🌮", img:tcImg, hasNotes: true },
    { id:"g", nombre:"Gorditas", desc:"Elige tu guiso favorito 👇", precio:14, unidad:"c/u", emoji:"🌮", img:gImg,
      guisos:["Huevo con verde","Chicharrón","Desebrada","Papa con chorizo","Frijol con queso","Carne molida"], hasNotes: true },
  ]},
  { sec:"🥤 Bebidas", items:[
    { id:"b1", nombre:"Refresco 600 ml", desc:"Bien frío", precio:26, emoji:"🥤", img:b1Img },
    { id:"b2", nombre:"Café", desc:"Calientito", precio:18, emoji:"☕", img:b2Img },
    { id:"b3", nombre:"Agua de sabor – 1 Litro", desc:"Sabor del día", precio:40, emoji:"🥤", img:b3b4Img, flavors: ["Manzana", "Naranja", "Limón", "Jamaica", "Horchata"] },
    { id:"b4", nombre:"Agua de sabor – ½ Litro", desc:"Sabor del día", precio:25, emoji:"🥤", img:b3b4Img, flavors: ["Manzana", "Naranja", "Limón", "Jamaica", "Horchata"] },
    { id:"b5", nombre:"Agua Ciel 500 ml", desc:"Natural", precio:26, emoji:"🥤", img:b5Img },
  ]},
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Lilita+One&family=Bebas+Neue&family=Outfit:wght@300;400;600;700;800&display=swap');

.tortas-jimmy-wrapper {
  --display: 'Lilita One', cursive;
  --num: 'Bebas Neue', cursive;
  --body: 'Outfit', sans-serif;
  --carbon:   #2e0610;
  --carbon-2: #4a0a16;
  --carbon-3: #5e0b1c;
  --rojo:     #8B1A2B;
  --rojo-osc: #5c0e1a;
  --rojo-vivo:#d42040;
  --oro:      #FFD54F;
  --oro-osc:  #c9a100;
  --crema:    #FFF8E1;
  --verde-wa: #25D366;
  --verde-wa-osc:#1da851;

  font-family: var(--body);
  background: 
    radial-gradient(1200px 600px at 50% -10%, #8a1226 0%, transparent 60%),
    radial-gradient(900px 500px at 100% 20%, #6a0f1f 0%, transparent 55%),
    linear-gradient(180deg, var(--carbon-2) 0%, var(--carbon) 100%);
  background-attachment: fixed;
  color: var(--crema);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
  position: relative;
}

.tortas-jimmy-wrapper * {
  box-sizing: border-box;
}

.tj-wrap {
  max-width: 520px;
  margin: 0 auto;
  padding: 0 0 100px;
  position: relative;
}

/* ---------- Embers (floating particles) ---------- */
.tj-embers { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
.tj-ember {
  position: absolute; bottom: -10px; border-radius: 50%;
  background: radial-gradient(circle, rgba(255,200,50,.9), rgba(255,80,10,.6));
  filter: blur(1px);
  animation: tj-rise linear infinite;
}
@keyframes tj-rise {
  0% { transform: translateY(0) translateX(0); opacity: 1; }
  100% { transform: translateY(-110vh) translateX(var(--drift)); opacity: 0; }
}

/* ---------- Header ---------- */
.tj-header {
  text-align: center;
  padding: 36px 18px 12px;
  position: relative; z-index: 2;
}
.tj-logo-glow {
  width: 120px; height: 120px; margin: 0 auto 14px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #ffd76b, #c2530f 70%);
  box-shadow: 0 0 40px rgba(255,160,50,.45), 0 0 80px rgba(255,100,20,.25);
  display: grid; place-items: center;
  overflow: hidden;
}
.tj-logo-img { width: 100%; height: 100%; object-fit: cover; }
.tj-logo-placeholder { font-size: 56px; line-height: 1; }
.tj-brand {
  font-family: var(--display);
  color: var(--oro);
  font-size: clamp(24px, 6.5vw, 36px);
  text-shadow: 0 3px 0 var(--rojo-osc), 0 0 24px rgba(255,180,50,.4);
  line-height: 1.1; margin: 0;
}
.tj-tagline {
  font-size: clamp(15px, 4.4vw, 22px);
  margin-top: 4px;
  text-shadow: 0 2px 0 var(--rojo-osc), 0 0 18px rgba(255,180,50,.5);
  animation: tj-fadeUp .9s ease .5s both; margin-bottom: 0;
}
.tj-subtag {
  font-size: 13px; color: #ffe9b8; opacity: .85; margin-top: 6px; letter-spacing: .4px;
  animation: tj-fadeUp .9s ease .65s both;
}
.tj-subtag span { margin: 0 7px; white-space: nowrap; }

/* ---------- Papel picado divider ---------- */
.tj-divider {
  height: 26px; margin: 18px 0 6px;
  background: radial-gradient(circle at 12px 0, var(--oro) 7px, transparent 8px) 0 0/24px 26px repeat-x;
  opacity: .7; mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
  animation: tj-fadeUp .8s ease .7s both;
}

/* ---------- Section heading ---------- */
.tj-section-head {
  display: flex; align-items: center; gap: 14px; margin: 30px 14px 16px;
}
.tj-section-head h2 {
  font-family: var(--display);
  font-size: clamp(26px, 7vw, 40px);
  color: var(--crema); margin: 0;
  text-shadow: 0 3px 0 var(--rojo-osc), 0 5px 12px rgba(0,0,0,.5);
  letter-spacing: .5px; line-height: 1;
}
.tj-section-head h2 b { color: var(--oro); font-weight: normal; }
.tj-section-head .line { flex: 1; height: 3px; border-radius: 3px; background: linear-gradient(90deg, var(--oro), transparent); }
.tj-section-head .ico { font-size: 30px; filter: drop-shadow(0 3px 4px rgba(0,0,0,.5)); }

/* ---------- Product card ---------- */
.tj-grid { display: grid; gap: 14px; padding: 0 14px; }
.tj-card {
  position: relative; display: flex; gap: 14px; align-items: center;
  background: linear-gradient(135deg, rgba(120,16,38,.94), rgba(74,10,22,.96));
  border: 1.5px solid rgba(255,180,60,.24);
  border-radius: 20px; padding: 14px;
  box-shadow: 0 10px 26px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.05);
  transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
  overflow: hidden;
  animation: tj-cardIn .6s cubic-bezier(.2,.8,.25,1) forwards;
}
@keyframes tj-cardIn {
  from { opacity: 0; transform: translateY(26px) scale(.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.tj-card::before {
  content: ""; position: absolute; top: 0; left: -60%; width: 50%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.10), transparent);
  transform: skewX(-20deg); transition: left .6s ease;
}
.tj-card:hover {
  transform: translateY(-4px); border-color: rgba(255,200,80,.55);
  box-shadow: 0 16px 34px rgba(0,0,0,.5), 0 0 0 1px rgba(255,200,80,.25);
}
.tj-card:hover::before { left: 130%; }

.tj-thumb {
  flex: none; width: 84px; height: 84px; border-radius: 16px;
  display: grid; place-items: center; font-size: 42px;
  background: radial-gradient(circle at 30% 25%, #ffd76b, #e06b16 70%, #a83c08);
  box-shadow: inset 0 0 0 2px rgba(255,255,255,.25), 0 6px 14px rgba(0,0,0,.4);
  overflow: hidden; position: relative;
}
.tj-thumb img { width: 100%; height: 100%; object-fit: cover; }
.tj-thumb.especial { border: 2px solid var(--oro); box-shadow: inset 0 0 0 2px rgba(255,255,255,.25), 0 0 16px rgba(255,200,50,.5); }

.tj-info { flex: 1; min-width: 0; }
.tj-info h3 {
  font-family: var(--display); font-size: 19px; color: var(--crema);
  line-height: 1.05; letter-spacing: .3px; margin: 0;
}
.tj-info .desc { font-size: 12.5px; color: #f2d6a6; opacity: .85; margin: 3px 0 0; line-height: 1.3; }
.tj-price-tag {
  font-family: var(--num); font-size: 30px; line-height: 1; color: var(--oro);
  text-shadow: 0 2px 0 var(--rojo-osc); margin-top: 6px; display: inline-flex; align-items: baseline; gap: 4px;
}
.tj-price-tag small { font-size: 13px; color: #ffd98a; font-family: var(--body); font-weight: 600; opacity: .8; }

/* Variants chips */
.tj-variants { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.tj-chip {
  background: rgba(0,0,0,.25); color: #f2d6a6; font-size: 11px; padding: 4px 10px; border-radius: 20px;
  border: 1px solid rgba(255,180,60,.15); cursor: pointer; transition: .2s; font-weight: 600;
}
.tj-chip.sel { background: var(--oro); color: #3a0a00; border-color: var(--oro); box-shadow: 0 0 10px rgba(255,200,50,.3); }

.tj-ribbon {
  position: absolute; top: 11px; right: -34px; transform: rotate(38deg);
  background: linear-gradient(90deg, var(--rojo), var(--rojo-vivo));
  color: #fff; font-family: var(--display); font-size: 11px; letter-spacing: 1px;
  padding: 4px 38px; box-shadow: 0 3px 8px rgba(0,0,0,.4); z-index: 3;
}

/* ---------- Quantity controls ---------- */
.tj-add-zone { flex: none; display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
.tj-btn-add {
  border: none; cursor: pointer; font-family: var(--display); font-size: 14px; letter-spacing: .5px;
  color: #3a0a00; background: linear-gradient(180deg, var(--oro), var(--oro-osc));
  padding: 9px 16px; border-radius: 12px; box-shadow: 0 5px 0 #9c6a06, 0 8px 14px rgba(0,0,0,.4);
  transition: transform .08s ease, box-shadow .08s ease; white-space: nowrap;
}
.tj-btn-add:active { transform: translateY(4px); box-shadow: 0 1px 0 #9c6a06, 0 3px 8px rgba(0,0,0,.4); }

.tj-stepper {
  display: flex; align-items: center; gap: 0; background: #3d0812; border-radius: 12px;
  border: 1px solid rgba(255,180,60,.3); overflow: hidden;
}
.tj-stepper button {
  width: 34px; height: 34px; border: none; cursor: pointer; font-size: 20px; font-weight: 800;
  background: transparent; color: var(--oro); display: grid; place-items: center;
  transition: background .15s;
}
.tj-stepper button:active { background: rgba(255,180,60,.25); }
.tj-stepper .qty { min-width: 30px; text-align: center; font-family: var(--num); font-size: 22px; color: #fff; }

/* ---------- Floating cart button ---------- */
.tj-cart-fab {
  position: fixed; left: 50%; bottom: 40px; transform: translateX(-50%); z-index: 40;
  display: flex; align-items: center; gap: 12px; cursor: pointer; border: none;
  font-family: var(--display); font-size: 17px; color: #fff; letter-spacing: .5px;
  padding: 14px 24px; border-radius: 50px;
  background: linear-gradient(180deg, var(--rojo-vivo), var(--rojo-osc));
  box-shadow: 0 8px 24px rgba(180,10,10,.6), 0 0 0 2px rgba(255,200,80,.4) inset;
  transition: transform .15s ease, opacity .3s;
  width: calc(100% - 32px); max-width: 420px; justify-content: center;
}
.tj-cart-fab:active { transform: translateX(-50%) scale(.97); }
.tj-cart-fab.hide { opacity: 0; pointer-events: none; transform: translateX(-50%) translateY(40px); }
.tj-cart-fab .badge {
  background: var(--oro); color: #3a0a00; min-width: 26px; height: 26px; border-radius: 50%;
  display: grid; place-items: center; font-size: 15px; padding: 0 6px;
}
.tj-cart-fab .total { margin-left: auto; }
.tj-cart-fab.bump { animation: tj-bump .45s ease; }
@keyframes tj-bump { 0% { transform: translateX(-50%) scale(1); } 30% { transform: translateX(-50%) scale(1.08); } 100% { transform: translateX(-50%) scale(1); } }

/* ---------- Cart sheet ---------- */
.tj-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.65); z-index: 50; opacity: 0;
  pointer-events: none; transition: opacity .3s; backdrop-filter: blur(2px);
}
.tj-overlay.show { opacity: 1; pointer-events: auto; }
.tj-sheet {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 55; max-height: 92vh; overflow-y: auto;
  background: linear-gradient(180deg, var(--carbon-3), var(--carbon));
  border-radius: 26px 26px 0 0; border-top: 2px solid rgba(255,180,60,.35);
  box-shadow: 0 -12px 40px rgba(0,0,0,.6);
  transform: translateY(110%); transition: transform .35s cubic-bezier(.2,.8,.2,1);
  padding: 18px 18px 30px; max-width: 760px; margin: 0 auto;
}
.tj-sheet.show { transform: translateY(0); }
.tj-sheet-grip { width: 46px; height: 5px; border-radius: 5px; background: rgba(255,255,255,.25); margin: 0 auto 14px; }
.tj-sheet h2 { font-family: var(--display); font-size: 26px; color: var(--oro); margin: 0 0 4px; text-align: center; }
.tj-sheet .hint { text-align: center; font-size: 12.5px; color: #f2d6a6; opacity: .8; margin: 0 0 16px; }

.tj-cart-empty { text-align: center; padding: 30px 0; color: #f2d6a6; opacity: .8; }
.tj-cart-empty .big { font-size: 54px; display: block; margin-bottom: 8px; }

.tj-cart-item { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px dashed rgba(255,180,60,.2); }
.tj-ci-emoji {
  font-size: 28px; flex: none; width: 44px; height: 44px; border-radius: 12px; display: grid; place-items: center;
  background: radial-gradient(circle at 30% 25%, #ffd76b, #c2530f); overflow: hidden;
}
.tj-ci-emoji img { width: 100%; height: 100%; object-fit: cover; }
.tj-ci-name { flex: 1; min-width: 0; }
.tj-ci-name b { font-size: 14.5px; color: var(--crema); }
.tj-ci-name span { display: block; font-size: 11.5px; color: #f2d6a6; opacity: .75; }
.tj-ci-price { font-family: var(--num); font-size: 20px; color: var(--oro); min-width: 54px; text-align: right; }

.tj-totals { margin: 16px 0; padding: 14px 16px; border-radius: 16px; background: rgba(0,0,0,.3); border: 1px solid rgba(255,180,60,.2); }
.tj-totals .row { display: flex; justify-content: space-between; font-size: 14px; margin: 4px 0; color: #ffe9b8; }
.tj-totals .row.grand { font-size: 18px; font-weight: 800; color: #fff; margin-top: 8px; }
.tj-totals .row.grand b { font-family: var(--num); font-size: 30px; color: var(--oro); font-weight: 400; }

/* ---------- Form ---------- */
.tj-form-block { margin-top: 20px; }
.tj-form-block h3 { font-family: var(--display); font-size: 18px; color: var(--crema); margin: 0 0 12px; display: flex; align-items: center; gap: 8px; }
.tj-toggle { display: flex; gap: 8px; margin-bottom: 14px; }
.tj-toggle button {
  flex: 1; cursor: pointer; border: 1.5px solid rgba(255,180,60,.3); background: #3d0812; color: #ffe9b8;
  font-weight: 700; font-size: 13.5px; padding: 11px; border-radius: 13px; transition: .15s; font-family: var(--body);
}
.tj-toggle button.active { background: linear-gradient(180deg, var(--oro), var(--oro-osc)); color: #3a0a00; border-color: transparent; }
.tj-field { margin-bottom: 12px; }
.tj-field label { display: block; font-size: 12.5px; font-weight: 600; color: #ffd98a; margin-bottom: 5px; letter-spacing: .2px; }
.tj-field input, .tj-field textarea, .tj-field select {
  width: 100%; font-family: var(--body); font-size: 15px; color: #fff;
  background: #3d0812; border: 1.5px solid rgba(255,180,60,.25); border-radius: 13px;
  padding: 12px 14px; transition: .15s;
}
.tj-field input.err, .tj-field textarea.err, .tj-field select.err {
  border-color: #ff4a4a; background: rgba(255,50,50,.05);
}
.tj-field input:focus, .tj-field textarea:focus, .tj-field select:focus { outline: none; border-color: var(--oro); box-shadow: 0 0 0 3px rgba(255,180,60,.15); }
.tj-field textarea { resize: vertical; min-height: 54px; }

.tj-send-wa {
  width: 100%; margin-top: 8px; cursor: pointer; border: none;
  font-family: var(--display); font-size: 19px; letter-spacing: .5px; color: #fff;
  background: linear-gradient(180deg, var(--verde-wa), var(--verde-wa-osc));
  padding: 16px; border-radius: 16px; display: flex; align-items: center; justify-content: center; gap: 10px;
  box-shadow: 0 8px 22px rgba(18,140,90,.5); transition: transform .1s;
}
.tj-send-wa:active { transform: scale(.98); }
.tj-send-wa svg { width: 26px; height: 26px; fill: #fff; }
.tj-send-wa:disabled { opacity: .5; filter: grayscale(.5); cursor: not-allowed; }

.tj-close-x {
  position: absolute; top: 14px; right: 16px; width: 36px; height: 36px; border-radius: 50%; border: none; cursor: pointer;
  background: rgba(255,255,255,.1); color: #fff; font-size: 20px; line-height: 1; display: grid; place-items: center;
}

.tj-footer { margin-top: 40px; padding: 30px 20px 20px; background: rgba(0,0,0,.35); border-top: 1px solid rgba(255,180,60,.15); color: #f2d6a6; }
.tj-footer-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 20px; margin-bottom: 24px; text-align: center; }
.tj-footer-col h4 { font-family: var(--display); color: var(--oro); font-size: 17px; margin: 0 0 10px; letter-spacing: .5px; }
.tj-footer-col p { margin: 4px 0; font-size: 13.5px; opacity: .85; }
.tj-footer-col a { color: inherit; text-decoration: none; }
.tj-socials { display: flex; justify-content: center; gap: 14px; margin-top: 6px; }
.tj-socials svg { width: 22px; height: 22px; fill: currentColor; opacity: .9; transition: transform .2s; }
.tj-socials a:hover svg { transform: scale(1.1); color: var(--oro); }
.tj-footer-bottom { text-align: center; border-top: 1px solid rgba(255,180,60,.1); padding-top: 20px; font-size: 11px; opacity: .6; letter-spacing: .5px; text-transform: uppercase; line-height: 1.6; }
.tj-footer-bottom p { margin: 4px 0; }
.tj-footer-bottom b { color: var(--oro); font-weight: normal; }

@keyframes tj-fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }

/* Fly animation */
.tj-fly {
  position: fixed; z-index: 100; pointer-events: none; font-size: 32px;
  transition: all .75s cubic-bezier(.2,.8,.2,1);
}
.tj-fly img { width: 36px; height: 36px; border-radius: 8px; object-fit: cover; }
`;

const Embers = () => {
  const embers = useMemo(() => {
    return Array.from({ length: 22 }).map((_, i) => {
      const size = 3 + Math.random() * 5;
      const left = (Math.random() * 100) + "%";
      const duration = (6 + Math.random() * 8) + "s";
      const delay = (Math.random() * 8) + "s";
      const drift = (Math.random() * 80 - 40) + "px";
      return { id: i, size, left, duration, delay, drift };
    });
  }, []);

  return (
    <div className="tj-embers">
      {embers.map((e) => (
        <div
          key={e.id}
          className="tj-ember"
          style={{
            left: e.left,
            width: e.size,
            height: e.size,
            animationDuration: e.duration,
            animationDelay: e.delay,
            '--drift': e.drift,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

export default function TortasJimmyMenu() {
  type CartItem = { nombre: string; precio: number; qty: number; emoji: string; img?: string; hasNotes?: boolean; flavors?: string[]; itemNote?: string };
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartStep, setCartStep] = useState<'cart'|'details'>('cart');
  const [bumpCart, setBumpCart] = useState(false);

  useEffect(() => {
    if (!isCartOpen) {
      setTimeout(() => setCartStep('cart'), 300);
    }
  }, [isCartOpen]);
  
  // Selection state per item ID for guisos
  const [selectedGuisos, setSelectedGuisos] = useState<Record<string, string>>({});

  useEffect(() => {
    // Initialize default guisos
    const initial: Record<string, string> = {};
    MENU.forEach(section => {
      section.items.forEach(item => {
        if (item.guisos && item.guisos.length > 0) {
          initial[item.id] = item.guisos[0];
        }
      });
    });
    setSelectedGuisos(initial);
  }, []);

  // Form State
  const [metodoEntrega, setMetodoEntrega] = useState<string>('recoger'); // 'domicilio' or 'recoger'
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  
  const [calle, setCalle] = useState('');
  const [colonia, setColonia] = useState('');
  const [entreCalles, setEntreCalles] = useState('');
  const [referencia, setReferencia] = useState('');
  
  const [formaPago, setFormaPago] = useState('Efectivo');
  const [cambio, setCambio] = useState('');
  const [notas, setNotas] = useState('');

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const totalItems = Object.values(cart).reduce((a, b) => a + b.qty, 0);
  const totalPrice = Object.values(cart).reduce((total, item) => total + (item.precio * item.qty), 0);

  const agregar = (item: any, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const guiso = selectedGuisos[item.id];
    const key = guiso ? `${item.id}__${guiso}` : item.id;
    const itemName = guiso ? `${item.nombre} (${guiso})` : item.nombre;

    setCart(prev => {
      const existing = prev[key];
      if (existing) {
        return { ...prev, [key]: { ...existing, qty: existing.qty + 1 } };
      }
      return { ...prev, [key]: { nombre: itemName, precio: item.precio, qty: 1, emoji: item.emoji, img: item.img, hasNotes: item.hasNotes, flavors: item.flavors } };
    });

    setBumpCart(true);
    setTimeout(() => setBumpCart(false), 500);
    
    // Flying animation
    const x = e.clientX;
    const y = e.clientY;
    const fly = document.createElement("div");
    fly.className="tj-fly";
    if (item.img) {
      fly.innerHTML = `<img src="${item.img}">`;
    } else {
      fly.textContent = item.emoji;
    }
    fly.style.left = x + "px";
    fly.style.top = y + "px";
    document.body.appendChild(fly);
    
    requestAnimationFrame(() => {
      const fab = document.querySelector(".tj-cart-fab") as HTMLElement;
      if (fab) {
        const fab_r = fab.getBoundingClientRect();
        fly.style.left = (fab_r.left + fab_r.width / 2) + "px";
        fly.style.top = (fab_r.top + 10) + "px";
        fly.style.transform = "scale(.3)"; 
        fly.style.opacity = "0";
      }
    });
    setTimeout(() => fly.remove(), 750);
  };

  const cambiarQty = (key: string, delta: number, e?: React.MouseEvent) => {
    if(e) e.stopPropagation();
    setCart(prev => {
      const existing = prev[key];
      if (!existing) return prev;
      const newQty = existing.qty + delta;
      if (newQty <= 0) {
        const newCart = { ...prev };
        delete newCart[key];
        return newCart;
      }
      return { ...prev, [key]: { ...existing, qty: newQty } };
    });
  };

  const updateItemNote = (key: string, note: string) => {
    setCart(prev => {
      const existing = prev[key];
      if (!existing) return prev;
      return { ...prev, [key]: { ...existing, itemNote: note } };
    });
  };

  const enviarWhatsApp = () => {
    if(totalItems === 0) {
      alert("Agrega productos a tu pedido primero 🙂");
      return;
    }

    const n = nombre.trim();
    const t = telefono.trim();
    
    let ok = true;
    const newErrs: Record<string, boolean> = {};
    if(!n) { newErrs.nombre = true; ok = false; }
    if(!t) { newErrs.telefono = true; ok = false; }
    
    if (metodoEntrega === "domicilio") {
      if(!calle.trim()) { newErrs.calle = true; ok = false; }
      if(!colonia.trim()) { newErrs.colonia = true; ok = false; }
    }
    
    setErrors(newErrs);
    
    if(!ok){ 
      alert("Completa los datos marcados en rojo para poder mandar tu pedido 🙏"); 
      return; 
    }

    let lineas = "";
    Object.keys(cart).forEach(k => {
      const it = cart[k];
      let itemText = `• ${it.qty}x ${it.nombre} — $${it.precio * it.qty}`;
      if (it.itemNote) {
        itemText += `\n   👉 ${it.itemNote}`;
      }
      lineas += itemText + `\n`;
    });

    let msg = `🍴 *NUEVO PEDIDO — Tortas de la Barda Jimmy*\n\n`;
    msg += `👤 *Cliente:* ${n}\n`;
    msg += `📱 *Teléfono:* ${t}\n`;
    
    if(metodoEntrega === "domicilio") {
      msg += `🛵 *Tipo:* Entrega a domicilio\n`;
      msg += `📍 *Dirección:* ${calle.trim()}, Col. ${colonia.trim()}\n`;
      if(entreCalles.trim()) msg += `↔️ *Entre calles:* ${entreCalles.trim()}\n`;
      if(referencia.trim()) msg += `📝 *Referencias:* ${referencia.trim()}\n`;
    } else {
      msg += `🏪 *Tipo:* Recoger en el local\n`;
    }
    
    msg += `\n🧾 *Pedido:*\n${lineas}`;
    msg += `\n💰 *Total productos:* $${totalPrice}\n`;
    if (formaPago === "Efectivo") {
      msg += `💵 *Pago:* Efectivo`;
      if (cambio) {
        const cambioNum = parseFloat(cambio);
        if (!isNaN(cambioNum) && cambioNum >= totalPrice) {
          msg += ` (Paga con $${cambioNum}, Cambio: ${money(cambioNum - totalPrice)})`;
        } else {
          msg += ` (Paga con $${cambio})`;
        }
      }
    } else {
      msg += `💳 *Pago:* ${formaPago}`;
    }
    msg += `\n`;
    
    if(notas.trim()) msg += `🗒️ *Comentarios:* ${notas.trim()}\n`;
    
    if(metodoEntrega === "domicilio") {
      msg += `\n❗ Por favor confírmenme el *costo de envío* a mi dirección. ¡Gracias! 🙌`;
    } else {
      msg += `\n✅ Paso a recogerlo. ¿Cuánto tiempo me dicen? 🙌`;
    }

    window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
    setIsCartOpen(false);
  };

  const money = (amount: number) => "$" + amount;

  const renderProductCard = (item: any, index: number) => {
    // Para ver si está en el carrito, revisamos las llaves si empieza con este id
    // (Por si tiene guisos)
    const cartKeys = Object.keys(cart).filter(k => k === item.id || k.startsWith(item.id + "__"));
    const qtyInCart = cartKeys.reduce((sum, k) => sum + cart[k].qty, 0);
    const selectedG = selectedGuisos[item.id];
    
    // Si tiene guisos y hay en el carrito, usamos el boton 'AGREGAR' siempre para que pueda agregar otro guiso
    // En el HTML original era así. Cada item tiene su botón +Agregar.
    // Si NO tiene guisos y ya se agregó, mostramos stepper en la tarjeta
    const canShowStepper = !item.guisos && qtyInCart > 0;

    return (
      <div className="tj-card" key={item.id} style={{ animationDelay: `${index * 0.08}s` }}>
        {item.ribbon && <div className="tj-ribbon">{item.ribbon}</div>}
        <div className={`tj-thumb ${item.especial ? 'especial' : ''}`}>
          {item.img ? <img src={item.img} alt={item.nombre} /> : <span>{item.emoji}</span>}
        </div>
        <div className="tj-info">
          <h3>{item.nombre}</h3>
          <div className="desc">{item.desc}</div>
          <div className="tj-price-tag">{money(item.precio)} <small>{item.unidad ? item.unidad : 'MXN'}</small></div>
          {item.guisos && (
            <div className="tj-variants">
              {item.guisos.map((g: string) => (
                <span 
                  key={g} 
                  className={`tj-chip ${selectedG === g ? 'sel' : ''}`}
                  onClick={() => setSelectedGuisos(prev => ({...prev, [item.id]: g}))}
                >
                  {g}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="tj-add-zone">
          {canShowStepper ? (
            <div className="tj-stepper">
              <button onClick={(e) => cambiarQty(cartKeys[0], -1, e)}>−</button>
              <span className="qty">{qtyInCart}</span>
              <button onClick={(e) => cambiarQty(cartKeys[0], 1, e)}>+</button>
            </div>
          ) : (
            <button className="tj-btn-add" onClick={(e) => agregar(item, e)}>+ Agregar</button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="tortas-jimmy-wrapper">
      <style>{CSS}</style>
      
      <Embers />

      <div className="tj-wrap">
        <header className="tj-header">
          <div className="tj-logo-glow">
            <span className="tj-logo-placeholder">🌮</span>
          </div>
          <h1 className="tj-brand">Tortas de la Barda<br/>El Chino Jimmy</h1>
          <p className="tj-tagline">¡Las Mejores Tortas!</p>
          <p className="tj-subtag">
            <span>📍 Barda Norte</span>
            <span>🕐 8:00 – 22:00</span>
          </p>
        </header>

        <div className="tj-divider"></div>

        {MENU.map((section, idx) => (
          <React.Fragment key={idx}>
            <div className="tj-section-head">
              <span className="ico">{section.sec.split(' ')[0]}</span>
              <h2><b>{section.sec.split(' ').slice(1).join(' ')}</b></h2>
              <div className="line"></div>
            </div>
            <div className="tj-grid">
              {section.items.map((item, i) => renderProductCard(item, i))}
            </div>
          </React.Fragment>
        ))}

        <footer className="tj-footer">
          <div className="tj-footer-grid">
            <div className="tj-footer-col">
              <h4>Contacto</h4>
              <p><a href="https://wa.me/5218332038593" target="_blank" rel="noreferrer">📞 WhatsApp</a></p>
              <p><a href="mailto:imagineandstamp@gmail.com">✉️ imagineandstamp@gmail.com</a></p>
            </div>
            <div className="tj-footer-col">
              <h4>Horarios</h4>
              <p>Lunes a Domingo</p>
              <p>8:00 - 22:00 hrs</p>
            </div>
            <div className="tj-footer-col">
              <h4>Ubicación</h4>
              <p>Barda Norte</p>
              <p>Tampico, Tamps.</p>
            </div>
            <div className="tj-footer-col">
              <h4>Síguenos</h4>
              <div className="tj-socials">
                <a href="#" target="_blank" rel="noreferrer" aria-label="Instagram">
                  <svg viewBox="0 0 24 24"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.64-.07-4.85s.01-3.58.07-4.85C2.38 3.86 3.89 2.3 7.15 2.15c1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07c-4.26.19-6.78 2.71-6.97 6.98C.01 8.33 0 8.74 0 12s.01 3.67.08 4.95c.19 4.27 2.71 6.79 6.97 6.98 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.08c4.27-.19 6.79-2.71 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.19-4.27-2.71-6.79-6.98-6.98C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4zm6.4-11.44a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"/></svg>
                </a>
                <a href="#" target="_blank" rel="noreferrer" aria-label="Facebook">
                  <svg viewBox="0 0 24 24"><path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07z"/></svg>
                </a>
              </div>
            </div>
          </div>
          <div className="tj-footer-bottom">
            <p>PÁGINA WEB REALIZADA POR <b>IMAGINE & STAMP</b></p>
            <p><a href="/privacidad" style={{color: 'inherit', textDecoration: 'underline'}}>AVISO DE PRIVACIDAD Y TÉRMINOS DE SERVICIO</a></p>
            <p>© {new Date().getFullYear()} IMAGINE & STAMP. TODOS LOS DERECHOS RESERVADOS.</p>
          </div>
        </footer>
      </div>

      {/* ═══════ Floating Cart Button ═══════ */}
      <button 
        className={`tj-cart-fab ${totalItems === 0 ? 'hide' : ''} ${bumpCart ? 'bump' : ''}`}
        onClick={() => setIsCartOpen(true)}
      >
        🛒 <span className="badge">{totalItems}</span>
        <span>VER PEDIDO</span>
        <span className="total">{money(totalPrice)}</span>
      </button>

      {/* ═══════ Cart Overlay & Sheet ═══════ */}
      <div 
        className={`tj-overlay ${isCartOpen ? 'show' : ''}`} 
        onClick={() => setIsCartOpen(false)}
      />
      <div className={`tj-sheet ${isCartOpen ? 'show' : ''}`}>
        <div className="tj-sheet-grip"></div>
        <button className="tj-close-x" onClick={() => setIsCartOpen(false)}>✕</button>
        
        {cartStep === 'cart' ? (
          <>
            <h2>🛒 Tu Pedido</h2>
            <p className="hint">Revisa tu orden y selecciona opciones</p>

            <div>
              {Object.keys(cart).length === 0 ? (
                <div className="tj-cart-empty"><span className="big">🛒</span>Tu pedido está vacío.<br/>¡Agrega algo rico del menú!</div>
              ) : (
                Object.entries(cart).map(([key, it]) => {
                  return (
                    <div className="tj-cart-item" key={key} style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="tj-ci-emoji">
                          {it.img ? <img src={it.img} alt={it.nombre} /> : it.emoji}
                        </div>
                        <div className="tj-ci-name">
                          <b>{it.nombre}</b>
                          <span>{money(it.precio)} c/u</span>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                          <div className="tj-stepper" style={{transform: 'scale(.85)'}}>
                            <button onClick={() => cambiarQty(key, -1)}>−</button>
                            <span className="qty">{it.qty}</span>
                            <button onClick={() => cambiarQty(key, 1)}>+</button>
                          </div>
                          <span className="tj-ci-price">{money(it.precio * it.qty)}</span>
                        </div>
                      </div>
                      {(it.hasNotes || it.flavors) && (
                        <div className="tj-field" style={{ marginTop: '8px', marginBottom: '0' }}>
                          {it.flavors ? (
                            <select 
                              value={it.itemNote || ''} 
                              onChange={(e) => updateItemNote(key, e.target.value)}
                              style={{ padding: '8px', fontSize: '13px' }}
                            >
                              <option value="">Selecciona sabor...</option>
                              {it.flavors.map(f => (
                                <option key={f} value={f}>{f}</option>
                              ))}
                            </select>
                          ) : (
                            <input 
                              type="text" 
                              placeholder="Notas (ej. sin cebolla, sin picante...)"
                              value={it.itemNote || ''}
                              onChange={(e) => updateItemNote(key, e.target.value)}
                              style={{ padding: '8px', fontSize: '13px' }}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {Object.keys(cart).length > 0 && (
              <>
                <div className="tj-totals">
                  <div className="row"><span>Subtotal</span><span>{money(totalPrice)}</span></div>
                  <div className="row grand"><span>Total</span><b>{money(totalPrice)}</b></div>
                </div>
                <button 
                  className="tj-send-wa" 
                  style={{ background: 'linear-gradient(180deg, var(--oro), var(--oro-osc))', color: '#3a0a00', boxShadow: '0 5px 0 #9c6a06, 0 8px 14px rgba(0,0,0,.4)' }}
                  onClick={() => setCartStep('details')}
                >
                  Siguiente — Datos de Entrega ➔
                </button>
              </>
            )}
          </>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <button onClick={() => setCartStep('cart')} style={{ background: 'transparent', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '24px', padding: '0 10px', marginLeft: '-10px' }}>⬅</button>
              <h2 style={{ margin: 0, flex: 1, textAlign: 'center', paddingRight: '34px' }}>📋 Datos de Entrega</h2>
            </div>

            <div className="tj-form-block" style={{ marginTop: 0 }}>
              <div className="tj-toggle">
                <button 
                  className={metodoEntrega === 'recoger' ? 'active' : ''} 
                  onClick={() => setMetodoEntrega('recoger')}
                >
                  🏪 Paso a recoger
                </button>
                <button 
                  className={metodoEntrega === 'domicilio' ? 'active' : ''} 
                  onClick={() => setMetodoEntrega('domicilio')}
                >
                  🛵 Envío a domicilio
                </button>
              </div>

              <div className="tj-field">
                <label>Tu nombre*</label>
                <input 
                  className={errors.nombre ? 'err' : ''}
                  placeholder="Ej: Juan Pérez" 
                  value={nombre} 
                  onChange={e => setNombre(e.target.value)} 
                />
              </div>

              <div className="tj-field">
                <label>Tu WhatsApp o celular*</label>
                <input 
                  type="tel"
                  className={errors.telefono ? 'err' : ''}
                  placeholder="10 dígitos" 
                  value={telefono} 
                  onChange={e => setTelefono(e.target.value)} 
                />
              </div>

              {metodoEntrega === 'domicilio' && (
                <>
                  <div className="tj-field">
                    <label>Calle y número*</label>
                    <input 
                      className={errors.calle ? 'err' : ''}
                      placeholder="Ej. Zaragoza 123" 
                      value={calle} 
                      onChange={e => setCalle(e.target.value)}
                    />
                  </div>
                  <div className="tj-field">
                    <label>Colonia*</label>
                    <input 
                      className={errors.colonia ? 'err' : ''}
                      placeholder="Ej. Centro" 
                      value={colonia} 
                      onChange={e => setColonia(e.target.value)}
                    />
                  </div>
                  <div className="tj-field">
                    <label>Entre calles (opcional)</label>
                    <input 
                      placeholder="Ej. Entre Madero y Juárez" 
                      value={entreCalles} 
                      onChange={e => setEntreCalles(e.target.value)}
                    />
                  </div>
                  <div className="tj-field">
                    <label>Referencias de la casa (opcional)</label>
                    <textarea 
                      placeholder="Portón blanco, junto a tienda..." 
                      value={referencia} 
                      onChange={e => setReferencia(e.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="tj-field">
                <label>Forma de Pago*</label>
                <select value={formaPago} onChange={e => setFormaPago(e.target.value)}>
                  <option value="Efectivo">💵 Efectivo</option>
                  <option value="Transferencia">🏦 Transferencia (te pasamos los datos por WA)</option>
                  <option value="Tarjeta">💳 Tarjeta (clip al repartidor)</option>
                </select>
              </div>

              {formaPago === 'Efectivo' && (
                <div className="tj-field">
                  <label>¿Con cuánto vas a pagar? (Total: {money(totalPrice)})</label>
                  <input 
                    type="number"
                    placeholder="Ej. 200, 500" 
                    value={cambio} 
                    onChange={e => setCambio(e.target.value)}
                  />
                  {!isNaN(parseFloat(cambio)) && parseFloat(cambio) > totalPrice && (
                    <div style={{ marginTop: '8px', padding: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '6px', fontSize: '13px', color: '#ffeb3b' }}>
                      💰 Cambio a entregar: <b>{money(parseFloat(cambio) - totalPrice)}</b>
                    </div>
                  )}
                  {!isNaN(parseFloat(cambio)) && parseFloat(cambio) > 0 && parseFloat(cambio) < totalPrice && (
                    <div style={{ marginTop: '8px', padding: '8px', background: 'rgba(255,0,0,0.2)', borderRadius: '6px', fontSize: '13px', color: '#ff8a80' }}>
                      ⚠️ La cantidad es menor al total ({money(totalPrice)}).
                    </div>
                  )}
                </div>
              )}

              {formaPago === 'Transferencia' && (
                <div className="tj-field" style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <label style={{ color: '#ffcc00', marginBottom: '8px' }}>🏦 Datos de Transferencia</label>
                  <div style={{ fontSize: '13px', lineHeight: '1.5', opacity: 0.9 }}>
                    <b>Banco:</b> BBVA (Ejemplo)<br/>
                    <b>Beneficiario:</b> Tortas Jimmy<br/>
                    <b>Clabe / Tarjeta:</b> 0123 4567 8901 2345<br/>
                    <b>Concepto:</b> Pago pedido<br/>
                    <br/>
                    <i>*Por favor, envíanos la captura del comprobante por WhatsApp una vez enviado tu pedido.</i>
                  </div>
                </div>
              )}

              <div className="tj-field">
                <label>Comentarios adicionales sobre la entrega (opcional)</label>
                <textarea 
                  placeholder="Ej. Tocar fuerte, dejar en caseta..." 
                  value={notas} 
                  onChange={e => setNotas(e.target.value)}
                />
              </div>
            </div>

            <button className="tj-send-wa" onClick={enviarWhatsApp}>
              <svg viewBox="0 0 24 24"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.64-.07-4.85s.01-3.58.07-4.85C2.38 3.86 3.89 2.3 7.15 2.15c1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07c-4.26.19-6.78 2.71-6.97 6.98C.01 8.33 0 8.74 0 12s.01 3.67.08 4.95c.19 4.27 2.71 6.79 6.97 6.98 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.08c4.27-.19 6.79-2.71 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.19-4.27-2.71-6.79-6.98-6.98C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4zm6.4-11.44a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"/></svg>
              Finalizar Pedido vía WhatsApp
            </button>
          </>
        )}
      </div>
      <a href="#/tortas-jimmy/admin" style={{ position: 'absolute', bottom: '10px', right: '10px', opacity: 0.2, fontSize: '12px', textDecoration: 'none' }}>
        🔒
      </a>
    </div>
  );
}
