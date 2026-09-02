# TemplateMenu — Scaffold para Nuevos Demos

## Cómo usar

1. Copiar esta carpeta completa → renombrar a `src/modules/<nombre-cliente>/`
2. Editar `config.ts` con los datos reales
3. Editar `pages/TemplateMenu.tsx`: PRODUCTS, categorías, colores hex
4. Registrar ruta en `src/App.tsx`
5. `npm run dev` → revisar → push

## Qué incluye

- Catálogo con buscador y categorías con íconos
- Carrito lateral de 2 pasos (items → datos cliente → WhatsApp)
- Footer de 3 columnas con datos del negocio
- Toast de confirmación al agregar
- Animaciones con Framer Motion
- Diseño responsive (2 cols móvil, 4 cols escritorio)
- Paginación "Ver más"
- Todo hardcodeado — sin Supabase, sin AdminPanel

## Checklist de personalización

- [ ] PRODUCTS: reemplazar con el menú real
- [ ] DEFAULT_CATEGORIES: ajustar nombres e íconos
- [ ] clientConfig: nombre, WhatsApp, email, dirección, horarios
- [ ] Colores: buscar y reemplazar todos los hex en TemplateMenu.tsx
- [ ] Hero image: cambiar backgroundImage URL
- [ ] Footer: verificar que muestre datos del negocio (no defaults)
- [ ] WhatsApp: verificar número en `const WHATSAPP`
