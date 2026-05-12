const fs = require('fs');

const css = `
/* --- Word Specific Styles --- */
.app-word .document-area { flex: 1; background: #e5e5e5; display: flex; justify-content: center; padding: 32px; overflow: auto; pointer-events: auto; }
.app-word .document-page-container { position: relative; background: #fff; box-shadow: 0 4px 16px rgba(0,0,0,0.1); border: 1px solid #d0d0d0; transition: transform 0.2s; }
.app-word .document-margins { position: relative; background: #fff; }
.app-word .document-page { width: 100%; max-width: 650px; min-height: 800px; background: #fff; padding: 64px 72px; font-size: 11pt; line-height: 1.8; color: #333; cursor: text; outline: none; }
.app-word .document-page:focus { caret-color: #000; }
.app-word .document-page p { margin: 0 0 12px 0; padding: 2px 4px; border-radius: 2px; min-height: 20px; transition: background 0.1s; }
.app-word .document-page p:hover { background: #f8f9fa; }
.app-word .document-page ::selection { background: #cce4f7; color: #000; }

.app-word .ruler-area { background: #fafafa; height: 24px; border-bottom: 1px solid #ccc; display: none; }
.app-word .ruler-area.visible { display: block; }
.app-word .ruler { position: relative; height: 20px; margin: 2px 48px 0 48px; background: repeating-linear-gradient(90deg, #ccc 0px, #ccc 1px, transparent 1px, transparent 36px); }
.app-word .ruler-number { position: absolute; top: 2px; font-size: 9px; color: #666; transform: translateX(-50%); }

/* --- Excel Specific Styles --- */
.app-excel .formula-bar { display: flex; align-items: center; padding: 4px 12px; background: #fff; border-bottom: 1px solid #e0e0e0; gap: 12px; }
.app-excel .cell-reference { width: 80px; padding: 4px; border: 1px solid #ccc; text-align: center; font-size: 12px; background: #fff; }
.app-excel .formula-input { flex: 1; padding: 4px 8px; border: 1px solid #ccc; font-size: 13px; font-family: 'Segoe UI', sans-serif; outline: none; }
.app-excel .formula-input:focus { border-color: #107c41; }
.app-excel .spreadsheet-area { flex: 1; display: flex; background: #fff; overflow: auto; }
.app-excel .row-headers { width: 40px; background: #f3f3f3; border-right: 1px solid #ccc; display: flex; flex-direction: column; }
.app-excel .row-header { height: 26px; border-bottom: 1px solid #ccc; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #444; user-select: none; }
.app-excel .spreadsheet { flex: 1; display: flex; flex-direction: column; }
.app-excel .col-headers { display: flex; background: #f3f3f3; border-bottom: 1px solid #ccc; }
.app-excel .col-header { width: 100px; height: 26px; border-right: 1px solid #ccc; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #444; user-select: none; }
.app-excel .cells-container { display: flex; flex-direction: column; }
.app-excel .cell-row { display: flex; height: 26px; }
.app-excel .cell { width: 100px; border-right: 1px solid #e0e0e0; border-bottom: 1px solid #e0e0e0; padding: 0 4px; display: flex; align-items: center; font-size: 13px; color: #000; cursor: cell; outline: none; white-space: nowrap; overflow: hidden; }
.app-excel .cell.selected { border: 2px solid #107c41; background: rgba(16, 124, 65, 0.1); position: relative; z-index: 2; outline: none; }
.app-excel .cell.selected::after { content: ''; position: absolute; bottom: -3px; right: -3px; width: 6px; height: 6px; background: #107c41; border: 1px solid #fff; cursor: crosshair; }
.app-excel .cell.bold { font-weight: bold; }
.app-excel .cell.italic { font-style: italic; }
.app-excel .cell.underline { text-decoration: underline; }

/* --- PowerPoint Specific Styles --- */
.app-powerpoint .slide-area { flex: 1; display: flex; background: #f3f3f3; overflow: hidden; }
.app-powerpoint .slides-panel { width: 200px; background: #fff; border-right: 1px solid #e0e0e0; padding: 16px; overflow-y: auto; }
.app-powerpoint .slide-thumb { width: 100%; aspect-ratio: 16/9; background: #fff; border: 1px solid #ccc; border-radius: 4px; margin-bottom: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #666; transition: all 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
.app-powerpoint .slide-thumb:hover { border-color: #c43e1c; }
.app-powerpoint .slide-thumb.active { border: 2px solid #c43e1c; font-weight: 600; color: #c43e1c; }
.app-powerpoint .slide-canvas { flex: 1; display: flex; align-items: center; justify-content: center; background: #e5e5e5; padding: 32px; overflow: auto; }
.app-powerpoint .slide { width: 100%; max-width: 800px; aspect-ratio: 16/9; background: #fff; box-shadow: 0 8px 24px rgba(0,0,0,0.15); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px; text-align: center; cursor: text; outline: none; }
.app-powerpoint .slide:focus { outline: 1px solid #c43e1c; }
.app-powerpoint .slide h1 { font-size: 36px; margin: 0 0 16px 0; color: #333; font-weight: 300; }
.app-powerpoint .slide h2 { font-size: 24px; margin: 0 0 24px 0; color: #666; font-weight: 300; }
.app-powerpoint .slide p { font-size: 16px; margin: 8px 0; color: #555; }
`;

fs.appendFileSync('contenido/simulacion-office.css', css);
console.log("Appended successfully");
