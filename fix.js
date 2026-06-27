const fs = require('fs');
const file = 'c:/Users/RF/Documents/IMAGINE&STAMP/Pagina Web/imagine-and-stamp/src/modules/tortas-jimmy/pages/TortasJimmyMenu.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/\\\`/g, '`');
content = content.replace(/\\\$/g, '$');
fs.writeFileSync(file, content);
console.log('Fixed file');
