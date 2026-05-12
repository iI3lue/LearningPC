const fs = require('fs');
const path = require('path');

function refactorFile(filePath, appClass) {
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');

    // Remove the entire <style> block
    content = content.replace(/<style>[\s\S]*?<\/style>/, '<link rel="stylesheet" href="../../simulacion-office.css">');

    // Add app-class to body
    content = content.replace(/<body>/, `<body class="${appClass}">`);

    // Remove the extra status bar
    const extraStatusBarRegex = /<div class="status-bar">\s*<span>Página 1 de 1<\/span>\s*<span>Español<\/span>\s*<\/div>/;
    content = content.replace(extraStatusBarRegex, '');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Refactored ${filePath}`);
}

const wordDir = path.join(__dirname, '../contenido/office/word');
refactorFile(path.join(wordDir, 'word-comandos-1.html'), 'app-word');
refactorFile(path.join(wordDir, 'word-comandos-2.html'), 'app-word');
refactorFile(path.join(wordDir, 'word-comandos-3.html'), 'app-word');

const excelDir = path.join(__dirname, '../contenido/office/excel');
refactorFile(path.join(excelDir, 'excel-comandos-1.html'), 'app-excel');
refactorFile(path.join(excelDir, 'excel-comandos-2.html'), 'app-excel');
refactorFile(path.join(excelDir, 'excel-comandos-3.html'), 'app-excel');

const pptDir = path.join(__dirname, '../contenido/office/powerpoint');
refactorFile(path.join(pptDir, 'powerpoint-comandos-1.html'), 'app-powerpoint');
refactorFile(path.join(pptDir, 'powerpoint-comandos-2.html'), 'app-powerpoint');
refactorFile(path.join(pptDir, 'powerpoint-comandos-3.html'), 'app-powerpoint');
