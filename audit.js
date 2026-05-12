const fs = require('fs');
const path = require('path');

function findFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            findFiles(filePath, fileList);
        } else if (filePath.endsWith('.html')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const allHtmlFiles = findFiles(path.join(__dirname, 'contenido'));
const missingFiles = [];

for (const file of allHtmlFiles) {
    const content = fs.readFileSync(file, 'utf8');
    if (!content.includes('pasoCompletado')) {
        missingFiles.push(file);
    }
}

console.log('--- Archivos SIN lógica de pasoCompletado ---');
missingFiles.forEach(f => console.log(f.replace(__dirname, '')));
