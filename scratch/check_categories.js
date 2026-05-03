const Database = require('better-sqlite3');
const path = require('path');
const db = new Database('learning_pc.db');
const categories = db.prepare('SELECT * FROM categorias').all();
console.log(JSON.stringify(categories, null, 2));
db.close();
