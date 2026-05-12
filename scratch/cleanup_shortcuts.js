const fs = require('fs');
const path = require('path');

const baseDir = 'c:\\Workspaces\\UCC\\Desarrollo Sostenible\\PrimerClic\\contenido';

// 1. Fix atajos-copiar-pegar.html
const cpPath = path.join(baseDir, 'atajos-copiar-pegar.html');
if (fs.existsSync(cpPath)) {
    let content = fs.readFileSync(cpPath, 'utf8');
    
    // Replace huge style block with link to office css
    content = content.replace(/<style>[\s\S]*?<\/style>/, '<link rel="stylesheet" href="simulacion-office.css">');
    
    // Remove duplicate status bar (the one outside .ventana)
    // Looking for the one that has "Página 1 de 1" and 📐 or simpler icons
    const duplicateStatusBarRegex = /<!-- Status Bar -->\s*<div class="status-bar">[\s\S]*?Español<\/span>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
    // Wait, let's be more precise.
    // The first status bar ends at line 1067.
    // The second starts at 1071.
    
    const secondStatusBarRegex = /<!-- Status Bar -->\s*<div class="status-bar">\s*<div class="status-left">\s*<span class="status-item">Página 1 de 1<\/span>\s*<span class="status-item">Español<\/span>\s*<\/div>\s*<div class="status-right">\s*<span class="status-item">📐<\/span>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
    
    if (secondStatusBarRegex.test(content)) {
        content = content.replace(secondStatusBarRegex, '');
        console.log("Fixed duplicate status bar in atajos-copiar-pegar.html");
    }
    
    fs.writeFileSync(cpPath, content);
}

// 2. Fix atajos-deshacer-rehacer.html
const drPath = path.join(baseDir, 'atajos-deshacer-rehacer.html');
if (fs.existsSync(drPath)) {
    let content = fs.readFileSync(drPath, 'utf8');
    content = content.replace(/<style>[\s\S]*?<\/style>/, '<link rel="stylesheet" href="simulacion-office.css">');
    fs.writeFileSync(drPath, content);
    console.log("Linked office css in atajos-deshacer-rehacer.html");
}

// 3. Fix atajos-win.html
// This one is special (Desktop sim), so we don't link office-css directly as it might break desktop styles.
// But we can clean up some of it. For now, let's leave it as is unless it has a visible bug.
// Actually, let's at least link a dark-theme core for it.
