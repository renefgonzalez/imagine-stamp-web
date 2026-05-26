import re

with open('c:/Users/RF/Documents/IMAGINE&STAMP/Pagina Web/imagine-&-stamp/src/MundoHalloween.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix activeCategory type
content = re.sub(r'const \[activeCategory,\s*setActiveCategory\]\s*=\s*useState<number>\(0\);', "const [activeCategory, setActiveCategory] = useState<string>('');", content)
content = re.sub(r'const \[activeCategory,\s*setActiveCategory\]\s*=\s*useState\(0\);', "const [activeCategory, setActiveCategory] = useState<string>('');", content)

# Fix rating/calories
content = re.sub(r'<div style=\{\{\s*display:\s*\'flex\',\s*alignItems:\s*\'center\',\s*gap:\s*\'8px\',\s*marginBottom:\s*\'8px\'\s*\}\}>.*?</div>', '', content, flags=re.DOTALL)

# Fix badge comparison
content = content.replace("item.badge === 'oferta'", "item.badge === 'EN OFERTA'")
content = content.replace("item.badge === 'MÁS VENDIDO'", "item.badge === 'EN OFERTA'") # Revert that previous accidental fix if it happened

# Fix activeCategory === 0 comparisons left over
content = content.replace('activeCategory === 0', "activeCategory === ''")
content = content.replace('setActiveCategory(0)', "setActiveCategory('')")
content = content.replace('activeCategory !== 0', "activeCategory !== ''")

with open('c:/Users/RF/Documents/IMAGINE&STAMP/Pagina Web/imagine-&-stamp/src/MundoHalloween.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
