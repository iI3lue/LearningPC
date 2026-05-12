const DB = require('better-sqlite3');
const path = require('path');

try {
    const dbPath = path.join(__dirname, '..', 'learning_pc.db');
    console.log('Abriendo base de datos en:', dbPath);
    const db = new DB(dbPath);
    
    // Activar FKs
    db.pragma('foreign_keys = ON');
    
    // Como las tablas existentes no tienen ON DELETE CASCADE, hay que borrar en orden (hijos -> padres)
    const idCat = 3;
    
    // 1. Obtener IDs de niveles que pertenecen a la categoría 3
    const niveles = db.prepare(`
        SELECT n.id_nivel 
        FROM niveles n
        JOIN subcategorias s ON n.id_subcategoria = s.id_subcategoria
        WHERE s.id_categoria = ?
    `).all(idCat);
    
    // 2. Borrar progreso_usuario de esos niveles
    for (const nivel of niveles) {
        db.prepare('DELETE FROM progreso_usuario WHERE id_nivel = ?').run(nivel.id_nivel);
    }
    
    // 3. Borrar niveles
    db.prepare(`
        DELETE FROM niveles 
        WHERE id_subcategoria IN (SELECT id_subcategoria FROM subcategorias WHERE id_categoria = ?)
    `).run(idCat);
    
    // 4. Borrar subcategorias
    db.prepare('DELETE FROM subcategorias WHERE id_categoria = ?').run(idCat);
    
    // 5. Borrar la categoria final
    const result = db.prepare('DELETE FROM categorias WHERE id_categoria = ?').run(idCat);
    console.log(`Eliminación exitosa. Categorías borradas: ${result.changes}`);
    
    // Limpiar base de datos para optimizar espacio luego del borrado masivo
    db.exec('VACUUM;');
    console.log('Base de datos optimizada (VACUUM).');
    
    db.close();
    process.exit(0);
} catch (error) {
    console.error('Error al borrar la categoría:', error.message);
    process.exit(1);
}
