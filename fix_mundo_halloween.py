import re

with open('c:/Users/RF/Documents/IMAGINE&STAMP/Pagina Web/imagine-&-stamp/src/MundoHalloween.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix typing where id is treated as number
# getItemQty, updateQty, etc expected number
content = content.replace('(id: number', '(id: string')
content = content.replace('activeCategory === 0', 'activeCategory === \'\'')
content = content.replace('setActiveCategory(0)', 'setActiveCategory(\'\')')
content = content.replace('setActiveCategory(cat.id)', 'setActiveCategory(cat.id.toString())')
content = content.replace('activeCategory !== 0', 'activeCategory !== \'\'')

# 2. Fix rating and calories logic remaining from DemoMenu
rating_calories_pattern = '''<div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ color: '#F59E0B', fontWeight: 800, fontSize: '18px' }}>⭐ {selectedItem.rating}</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>Rating</div>
                  </div>
                  <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ color: '#FF8C00', fontWeight: 800, fontSize: '18px' }}>{selectedItem.calories}</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>Calorías</div>
                  </div>'''
content = content.replace(rating_calories_pattern, '')

# 3. Fix badge comparison
content = content.replace("item.badge === 'spicy'", "item.badge === 'MÁS VENDIDO'")

with open('c:/Users/RF/Documents/IMAGINE&STAMP/Pagina Web/imagine-&-stamp/src/MundoHalloween.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
