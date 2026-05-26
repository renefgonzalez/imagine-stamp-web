import re

with open('c:/Users/RF/Documents/IMAGINE&STAMP/Pagina Web/imagine-&-stamp/src/MundoHalloween.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix activeCategory type (useState(0) -> useState(''))
content = content.replace('useState(0)', "useState('')")
# Wait, maybe it's const [activeCategory, setActiveCategory] = useState(0);
content = content.replace('const [activeCategory, setActiveCategory] = useState(0);', "const [activeCategory, setActiveCategory] = useState<string>('');")
content = content.replace('const [activeCategory, setActiveCategory] = useState<number>(0);', "const [activeCategory, setActiveCategory] = useState<string>('');")

# Fix rating/calories around 457
rating_cal_pattern2 = '''<div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ color: '#F59E0B', fontSize: '13px', fontWeight: 700 }}>⭐ {item.rating}</span>
                <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px' }}>•</span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontWeight: 600 }}>{item.calories} Cal</span>
              </div>'''
content = content.replace(rating_cal_pattern2, '')

# Fix badge 'oferta' comparison vs 'MÁS VENDIDO' which I replaced earlier but created a type conflict
# Let's just fix it by replacing "item.badge === 'oferta'" with "item.badge === 'EN OFERTA'"
content = content.replace("item.badge === 'oferta'", "item.badge === 'EN OFERTA'")

with open('c:/Users/RF/Documents/IMAGINE&STAMP/Pagina Web/imagine-&-stamp/src/MundoHalloween.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
