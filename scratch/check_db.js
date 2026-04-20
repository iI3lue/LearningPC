const Database = require('better-sqlite3');
const db = new Database('learning_pc.db');
const rows = db.prepare('SELECT id_nivel, titulo, ruta_archivo FROM niveles').all();
console.log(JSON.stringify(rows, null, 2));
db.close();
