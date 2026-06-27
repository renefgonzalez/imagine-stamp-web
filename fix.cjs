const fs = require('fs');
const file = 'c:/Users/RF/Documents/IMAGINE&STAMP/Pagina Web/imagine-and-stamp/src/modules/tortas-jimmy/pages/TortasJimmyMenu.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace escaped backticks \` with `
content = content.replace(/\\`/g, '`');

// Replace escaped dollar signs \$ with $
content = content.replace(/\\\$/g, '$');

fs.writeFileSync(file, content);
console.log('Fixed file');
