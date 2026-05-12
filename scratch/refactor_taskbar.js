const fs = require('fs');
const path = require('path');

const baseDir = 'c:\\Workspaces\\UCC\\Desarrollo Sostenible\\PrimerClic\\contenido';
const officeCssPath = path.join(baseDir, 'simulacion-office.css');
const coreCssPath = path.join(baseDir, 'simulacion-core.css');

// 1. Modificar simulacion-office.css
let officeCss = fs.readFileSync(officeCssPath, 'utf8');

// Eliminar el bloque actual de taskbar de simulacion-office.css (ya que irá al core)
const taskbarBlockRegex = /\/\* Taskbar \(Windows 11 Style\) \*\/[\s\S]*?(?=\/\* Office App Specific Colors \*\/)/;
officeCss = officeCss.replace(taskbarBlockRegex, '');

// Reemplazar colores claros por oscuros para el entorno Office
officeCss = officeCss
    // Ventana y paneles
    .replace(/\.ventana \{.*?background: #fff;.*?\}/s, match => match.replace('#fff', '#2d2d2d'))
    .replace(/\.title-bar \{.*?background: #f3f3f3;.*?border-bottom: 1px solid #e0e0e0;.*?\}/s, match => match.replace('#f3f3f3', '#1a1a1a').replace('#e0e0e0', '#333'))
    .replace(/\.title-bar \.doc-name \{.*?color: #333;.*?\}/s, match => match.replace('#333', '#e0e0e0'))
    .replace(/\.window-btn:hover \{.*?background: #e5e5e5;.*?\}/s, match => match.replace('#e5e5e5', '#333'))
    
    // Quick Access y Ribbon
    .replace(/\.qat \{.*?background: #fafafa;.*?border-bottom: 1px solid #e0e0e0;.*?\}/s, match => match.replace('#fafafa', '#2d2d2d').replace('#e0e0e0', '#444'))
    .replace(/\.qat-btn:hover \{.*?background: #e5e5e5;.*?\}/s, match => match.replace('#e5e5e5', '#444'))
    .replace(/\.qat-btn\.active \{.*?background: #cce4f7;.*?\}/s, match => match.replace('#cce4f7', '#444'))
    .replace(/\.qat-btn svg \{.*?fill: #444;.*?\}/s, match => match.replace('#444', '#ccc'))
    .replace(/\.ribbon \{.*?background: #fafafa;.*?border-bottom: 1px solid #e0e0e0;.*?\}/s, match => match.replace('#fafafa', '#2d2d2d').replace('#e0e0e0', '#444'))
    .replace(/\.ribbon-tabs \{.*?background: #f3f3f3;.*?border-bottom: 1px solid #ddd;.*?\}/s, match => match.replace('#f3f3f3', '#1a1a1a').replace('#ddd', '#333'))
    .replace(/\.ribbon-tab \{.*?color: #444;.*?\}/s, match => match.replace('#444', '#ccc'))
    .replace(/\.ribbon-tab:hover \{.*?background: #e5e5e5;.*?\}/s, match => match.replace('#e5e5e5', '#333'))
    .replace(/\.ribbon-tab\.active \{.*?background: #fff;.*?border-bottom: 1px solid #fff;.*?\}/s, match => match.replace(/#fff/g, '#2d2d2d').replace(/#e0e0e0/g, '#444'))
    .replace(/\.ribbon-group \{.*?border-right: 1px solid #e0e0e0;.*?\}/s, match => match.replace('#e0e0e0', '#444'))
    .replace(/\.ribbon-btn:hover \{.*?background: #e5e5e5;.*?\}/s, match => match.replace('#e5e5e5', '#444'))
    .replace(/\.ribbon-btn\.active \{.*?background: #cce4f7;.*?\}/s, match => match.replace('#cce4f7', '#444'))
    .replace(/\.ribbon-btn svg \{.*?fill: #444;.*?\}/s, match => match.replace('#444', '#ccc'))
    .replace(/\.ribbon-group-title \{.*?color: #666;.*?\}/s, match => match.replace('#666', '#aaa'))
    
    // Controles varios
    .replace(/\.control-panel \{.*?background: #ffffff;.*?border: 1px solid #e0e0e0;.*?\}/s, match => match.replace('#ffffff', '#1f1f1f').replace('#e0e0e0', '#3d3d3d'))
    .replace(/\.control-panel h2 \{.*?color: #333;.*?\}/s, match => match.replace('#333', '#fff'))
    .replace(/\.control-panel p \{.*?color: #666;.*?\}/s, match => match.replace('#666', '#aaa'))
    .replace(/\.hint-box \{.*?background: #f8f9fa;.*?border: 1px solid #e0e0e0;.*?\}/s, match => match.replace('#f8f9fa', '#2d2d2d').replace('#e0e0e0', '#444'))
    .replace(/\.hint-box h4 \{.*?color: #333;.*?\}/s, match => match.replace('#333', '#60cdff'))
    .replace(/\.hint-box p \{.*?color: #555;.*?\}/s, match => match.replace('#555', '#ccc'))
    .replace(/\.key \{.*?background: #fff;.*?border: 1px solid #ccc;.*?color: #333;.*?\}/s, match => match.replace('#fff', '#333').replace('#ccc', '#555').replace('#333', '#fff'))

    // Word
    .replace(/\.app-word \.document-area \{.*?background: #e5e5e5;.*?\}/s, match => match.replace('#e5e5e5', '#1e1e1e'))
    .replace(/\.app-word \.document-page-container \{.*?background: #fff;.*?border: 1px solid #d0d0d0;.*?\}/s, match => match.replace('#fff', '#1a1a1a').replace('#d0d0d0', '#333'))
    .replace(/\.app-word \.document-margins \{.*?background: #fff;.*?\}/s, match => match.replace('#fff', '#1a1a1a'))
    .replace(/\.app-word \.document-page \{.*?background: #fff;.*?color: #333;.*?\}/s, match => match.replace('#fff', '#1a1a1a').replace('#333', '#d0d0d0'))
    .replace(/\.app-word \.document-page:focus \{.*?caret-color: #000;.*?\}/s, match => match.replace('#000', '#fff'))
    .replace(/\.app-word \.document-page p:hover \{.*?background: #f8f9fa;.*?\}/s, match => match.replace('#f8f9fa', '#2d2d2d'))
    .replace(/\.app-word \.document-page ::selection \{.*?background: #cce4f7;.*?color: #000;.*?\}/s, match => match.replace('#cce4f7', '#333').replace('#000', '#fff'))
    .replace(/\.app-word \.ruler-area \{.*?background: #fafafa;.*?border-bottom: 1px solid #ccc;.*?\}/s, match => match.replace('#fafafa', '#2d2d2d').replace('#ccc', '#444'))
    .replace(/\.app-word \.ruler \{.*?repeating-linear-gradient.*?#ccc.*?#ccc.*?\}/s, match => match.replace(/#ccc/g, '#555'))
    .replace(/\.app-word \.ruler-number \{.*?color: #666;.*?\}/s, match => match.replace('#666', '#999'))

    // Excel
    .replace(/\.app-excel \.formula-bar \{.*?background: #fff;.*?border-bottom: 1px solid #e0e0e0;.*?\}/s, match => match.replace('#fff', '#2d2d2d').replace('#e0e0e0', '#444'))
    .replace(/\.app-excel \.cell-reference \{.*?border: 1px solid #ccc;.*?background: #fff;.*?\}/s, match => match.replace('#ccc', '#444').replace('#fff', '#1a1a1a'))
    .replace(/\.app-excel \.formula-input \{.*?border: 1px solid #ccc;.*?\}/s, match => match.replace('#ccc', '#444'))
    .replace(/\.app-excel \.spreadsheet-area \{.*?background: #fff;.*?\}/s, match => match.replace('#fff', '#1a1a1a'))
    .replace(/\.app-excel \.row-headers \{.*?background: #f3f3f3;.*?border-right: 1px solid #ccc;.*?\}/s, match => match.replace('#f3f3f3', '#1e1e1e').replace('#ccc', '#444'))
    .replace(/\.app-excel \.row-header \{.*?border-bottom: 1px solid #ccc;.*?color: #444;.*?\}/s, match => match.replace('#ccc', '#444').replace('#444', '#aaa'))
    .replace(/\.app-excel \.col-headers \{.*?background: #f3f3f3;.*?border-bottom: 1px solid #ccc;.*?\}/s, match => match.replace('#f3f3f3', '#1e1e1e').replace('#ccc', '#444'))
    .replace(/\.app-excel \.col-header \{.*?border-right: 1px solid #ccc;.*?color: #444;.*?\}/s, match => match.replace('#ccc', '#444').replace('#444', '#aaa'))
    .replace(/\.app-excel \.cell \{.*?border-right: 1px solid #e0e0e0;.*?border-bottom: 1px solid #e0e0e0;.*?color: #000;.*?\}/s, match => match.replace(/#e0e0e0/g, '#333').replace('#000', '#d0d0d0'))

    // PowerPoint
    .replace(/\.app-powerpoint \.slide-area \{.*?background: #f3f3f3;.*?\}/s, match => match.replace('#f3f3f3', '#1e1e1e'))
    .replace(/\.app-powerpoint \.slides-panel \{.*?background: #fff;.*?border-right: 1px solid #e0e0e0;.*?\}/s, match => match.replace('#fff', '#2d2d2d').replace('#e0e0e0', '#444'))
    .replace(/\.app-powerpoint \.slide-thumb \{.*?background: #fff;.*?border: 1px solid #ccc;.*?color: #666;.*?\}/s, match => match.replace('#fff', '#1a1a1a').replace('#ccc', '#444').replace('#666', '#aaa'))
    .replace(/\.app-powerpoint \.slide-canvas \{.*?background: #e5e5e5;.*?\}/s, match => match.replace('#e5e5e5', '#1a1a1a'))
    .replace(/\.app-powerpoint \.slide \{.*?background: #fff;.*?color: #333;.*?\}/s, match => match.replace('#fff', '#2d2d2d').replace('#333', '#e0e0e0'))
    .replace(/\.app-powerpoint \.slide h1 \{.*?color: #333;.*?\}/s, match => match.replace('#333', '#fff'))
    .replace(/\.app-powerpoint \.slide h2 \{.*?color: #666;.*?\}/s, match => match.replace('#666', '#ccc'))
    .replace(/\.app-powerpoint \.slide p \{.*?color: #555;.*?\}/s, match => match.replace('#555', '#bbb'));

// Y añadir background negro para input formula Excel (que no estaba y ahora se necesita)
if (!officeCss.includes('color: #d0d0d0;') && officeCss.includes('.app-excel .formula-input {')) {
    officeCss = officeCss.replace(/\.app-excel \.formula-input \{([^}]*)\}/s, ".app-excel .formula-input { $1 color: #d0d0d0; background: #1a1a1a; }");
}

fs.writeFileSync(officeCssPath, officeCss);
console.log("simulacion-office.css modificado para modo oscuro y sin taskbar");

// 2. Modificar simulacion-core.css (Añadir la Taskbar mejorada)
const darkTaskbarCss = `
/* ═══════════════════════════════════════════════════════════
   TASKBAR (WINDOWS 11 STYLE - DARK MODE / SHARED)
   ═══════════════════════════════════════════════════════════ */
.taskbar { position: fixed; bottom: 0; left: 0; right: 0; height: 48px; background: #111111; display: flex; align-items: center; justify-content: center; border-top: 1px solid #2d2d2d; z-index: 500; }
.start-button { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; border-radius: 4px; transition: background 0.15s; margin-right: 4px; }
.start-button:hover { background: #2d2d2d; }
.start-icon { width: 22px; height: 22px; background: linear-gradient(135deg, #0078d4 0%, #005a9e 100%); border-radius: 2px; }
.taskbar-icons { display: flex; justify-content: center; gap: 4px; }
.taskbar-icon { display: flex; align-items: center; gap: 0; padding: 8px 12px; border-radius: 4px; cursor: pointer; transition: background 0.15s; }
.taskbar-icon:hover { background: #2d2d2d; }
.taskbar-icon.active { background: #2d2d2d; border-bottom: 3px solid #0078d4; }
.taskbar-icon .icono { width: 24px; height: 24px; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px; }
.taskbar-icon span { display: none; }
.tray { position: absolute; right: 16px; display: flex; align-items: center; gap: 16px; color: #ffffff; font-size: 13px; }
.tray-icons { display: flex; gap: 8px; font-size: 14px; }
.clock { text-align: right; }
.clock-hora { font-size: 12px; font-weight: 600; }
`;
fs.appendFileSync(coreCssPath, darkTaskbarCss);
console.log("simulacion-core.css actualizado con la nueva taskbar compartida");

// 3. Eliminar estilos de .taskbar anidados en archivos HTML
const filesWithTaskbar = [
    'atajos-copiar-pegar.html',
    'atajos-deshacer-rehacer.html',
    'atajos-win.html'
];

for (const file of filesWithTaskbar) {
    const filePath = path.join(baseDir, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Remove .taskbar {...} and its children from inline style tag.
        // It's safer to just remove all lines from "/* Taskbar" to the end of the style block,
        // or specifically match .taskbar through .clock.
        
        // Use a regex that finds the Taskbar comment and removes up to the </style>
        const inlineTaskbarRegex = /\/\*\s*Taskbar\s*\*\/[\s\S]*?(?=<\/style>)/i;
        if (inlineTaskbarRegex.test(content)) {
            content = content.replace(inlineTaskbarRegex, '');
            fs.writeFileSync(filePath, content);
            console.log("Limpiado", file);
        }
    }
}
