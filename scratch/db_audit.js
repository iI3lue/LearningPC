const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'learning_pc.db');
const db = new Database(dbPath);

console.log('--- AUDITORÍA DE CONTENIDO ---');

const rows = db.prepare(`
    SELECT c.nombre as categoria, s.id_subcategoria, s.nombre as subcategoria, 
    (SELECT COUNT(*) FROM niveles n WHERE n.id_subcategoria = s.id_subcategoria) as level_count
    FROM categorias c
    JOIN subcategorias s ON c.id_categoria = s.id_categoria
    ORDER BY c.nombre, s.id_subcategoria
`).all();

rows.forEach(row => {
    console.log(`[${row.categoria}] ${row.id_subcategoria}: ${row.subcategoria} -> ${row.level_count} niveles`);
});

db.close();
