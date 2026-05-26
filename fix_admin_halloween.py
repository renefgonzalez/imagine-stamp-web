import re

with open('c:/Users/RF/Documents/IMAGINE&STAMP/Pagina Web/imagine-&-stamp/src/AdminHalloween.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Payload parsing
old_payload = """                const newProduct = {
                  name: fd.get('name') as string,
                  description: fd.get('description') as string,
                  price: parseFloat(fd.get('price') as string) || 0,
                  image: imageUrl || 'https://picsum.photos/seed/new/800/1000',
                  category: fd.get('category') as string,
                  sub_category: fd.get('sub1') as string || '',
                  sub_category_2: fd.get('sub2') as string || '',
                };"""

new_payload = """                const newProduct = {
                  name: fd.get('name') as string,
                  description: fd.get('description') as string,
                  price: parseFloat(fd.get('price') as string) || 0,
                  rentalPrice: parseFloat(fd.get('rentalPrice') as string) || 0,
                  image: imageUrl || 'https://picsum.photos/seed/new/800/1000',
                  category: fd.get('category') as string,
                  type: fd.get('type') as string || 'Venta',
                  sizes: (fd.get('sizes') as string).split(',').map(s => s.trim()).filter(s => s),
                  badge: fd.get('badge') as string || '',
                };"""

content = content.replace(old_payload, new_payload)

# Replace Form Fields
old_form_fields = """                {/* Precio + Categoría */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Precio ($)">
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={17} />
                      <input name="price" type="number" step="0.01" required placeholder="0.00"
                        className="w-full bg-background text-primary p-4 pl-12 rounded-2xl border border-primary/5 focus:border-secondary outline-none text-xs font-black tracking-widest" />
                    </div>
                  </Field>
                  <Field label="Categoría Principal">
                    <div className="relative">
                      <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={17} />
                      <select name="category"
                        onChange={(e) => { setNewProdCat(e.target.value); setNewProdSub1(''); }}
                        className="w-full bg-background text-primary p-4 pl-12 rounded-2xl border border-primary/5 focus:border-secondary outline-none text-xs font-black tracking-widest appearance-none cursor-pointer">
                        <option value="">— Seleccionar —</option>
                        {categories.map((cat: any) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </Field>
                </div>

                {/* Sub 1 + Sub 2 (cascada) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Sub-Categoría 1 (opcional)">
                    <div className="relative">
                      <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={17} />
                      <select name="sub1"
                        value={newProdSub1}
                        onChange={(e) => setNewProdSub1(e.target.value)}
                        className="w-full bg-background text-primary p-4 pl-12 rounded-2xl border border-primary/5 focus:border-secondary outline-none text-xs font-black tracking-widest appearance-none cursor-pointer">
                        <option value="">— Seleccionar —</option>
                        {(() => {
                          const cat = categories.find(c => c.id === newProdCat);
                          if (!cat) return null;
                          return normalizeSubs(cat.submenus).map((s: any) => (
                            <option key={s.name} value={s.name}>{s.name}</option>
                          ));
                        })()}
                      </select>
                    </div>
                  </Field>
                  <Field label="Sub-Categoría 2 (opcional)">
                    <div className="relative">
                      <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={17} />
                      <select name="sub2"
                        className="w-full bg-background text-primary p-4 pl-12 rounded-2xl border border-primary/5 focus:border-secondary outline-none text-xs font-black tracking-widest appearance-none cursor-pointer">
                        <option value="">— Seleccionar —</option>
                        {(() => {
                          const cat = categories.find(c => c.id === newProdCat);
                          if (!cat) return null;
                          const sub = normalizeSubs(cat.submenus).find((s: any) => s.name === newProdSub1);
                          if (!sub) return null;
                          return (sub.children || []).map((child: string) => (
                            <option key={child} value={child}>{child}</option>
                          ));
                        })()}
                      </select>
                    </div>
                  </Field>
                </div>"""

new_form_fields = """                {/* Precios */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Precio Venta ($)">
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={17} />
                      <input name="price" type="number" step="0.01" required placeholder="0.00"
                        className="w-full bg-background text-primary p-4 pl-12 rounded-2xl border border-primary/5 focus:border-secondary outline-none text-xs font-black tracking-widest" />
                    </div>
                  </Field>
                  <Field label="Precio Renta ($)">
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={17} />
                      <input name="rentalPrice" type="number" step="0.01" placeholder="0.00 (Opcional)"
                        className="w-full bg-background text-primary p-4 pl-12 rounded-2xl border border-primary/5 focus:border-secondary outline-none text-xs font-black tracking-widest" />
                    </div>
                  </Field>
                </div>

                {/* Categoría y Modalidad */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Categoría">
                    <div className="relative">
                      <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={17} />
                      <select name="category"
                        className="w-full bg-background text-primary p-4 pl-12 rounded-2xl border border-primary/5 focus:border-secondary outline-none text-xs font-black tracking-widest appearance-none cursor-pointer">
                        <option value="">— Seleccionar —</option>
                        <option value="Todo">🎃 Todo</option>
                        <option value="Terror">🧟‍♂️ Terror</option>
                        <option value="Superhéroes">🦸‍♂️ Superhéroes</option>
                        <option value="Infantiles">🧸 Infantiles</option>
                        <option value="Accesorios">🎭 Accesorios</option>
                      </select>
                    </div>
                  </Field>
                  <Field label="Modalidad">
                    <div className="relative">
                      <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={17} />
                      <select name="type"
                        className="w-full bg-background text-primary p-4 pl-12 rounded-2xl border border-primary/5 focus:border-secondary outline-none text-xs font-black tracking-widest appearance-none cursor-pointer">
                        <option value="Venta">Venta</option>
                        <option value="Renta">Renta</option>
                        <option value="Renta y Venta">Renta y Venta</option>
                      </select>
                    </div>
                  </Field>
                </div>

                {/* Tallas y Etiqueta */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Tallas (separadas por coma)">
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={17} />
                      <input name="sizes" placeholder="S, M, L, XL"
                        className="w-full bg-background text-primary p-4 pl-12 rounded-2xl border border-primary/5 focus:border-secondary outline-none text-xs font-black tracking-widest" />
                    </div>
                  </Field>
                  <Field label="Etiqueta Visual">
                    <div className="relative">
                      <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={17} />
                      <select name="badge"
                        className="w-full bg-background text-primary p-4 pl-12 rounded-2xl border border-primary/5 focus:border-secondary outline-none text-xs font-black tracking-widest appearance-none cursor-pointer">
                        <option value="">Ninguna</option>
                        <option value="NOVEDAD">Nuevo (NOVEDAD)</option>
                        <option value="EN OFERTA">En Oferta (EN OFERTA)</option>
                        <option value="MÁS VENDIDO">Más Vendido (🔥 MÁS VENDIDO)</option>
                      </select>
                    </div>
                  </Field>
                </div>"""

content = content.replace(old_form_fields, new_form_fields)

with open('c:/Users/RF/Documents/IMAGINE&STAMP/Pagina Web/imagine-&-stamp/src/AdminHalloween.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
