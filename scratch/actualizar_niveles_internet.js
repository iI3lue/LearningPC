const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'learning_pc.db');
const db = new Database(dbPath);

console.log('--- ACTUALIZANDO NIVELES DE INTERNET ---');

try {
    const updateLevels = db.transaction(() => {
        // Limpiar niveles anteriores de estas subcategorías si existen
        db.prepare('DELETE FROM niveles WHERE id_subcategoria IN (9, 10, 11)').run();

        // Actualizar nombres de subcategorías para que coincidan con el nuevo contenido
        db.prepare('UPDATE subcategorias SET nombre = ? WHERE id_subcategoria = 9').run('¿Qué es un Navegador?');
        db.prepare('UPDATE subcategorias SET nombre = ? WHERE id_subcategoria = 10').run('Comandos y Navegación');
        db.prepare('UPDATE subcategorias SET nombre = ? WHERE id_subcategoria = 11').run('Seguridad y Peligros');

        // Insertar nuevos niveles
        const insert = db.prepare(`
            INSERT INTO niveles (id_subcategoria, titulo, descripcion, ruta_archivo, nivel_ordinal, orden, tiempo_estimado_min) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        insert.run(9, 'Navegador vs Buscador', 'Aprendé a diferenciar la herramienta del servicio.', 'contenido/internet/internet-1.html', 1, 1, 10);
        insert.run(10, 'Controlando el Navegador', 'Botones atrás, adelante y recargar.', 'contenido/internet/internet-2.html', 1, 1, 10);
        insert.run(11, 'Navegación Segura', 'HTTPS, candados y cómo evitar el phishing.', 'contenido/internet/internet-3.html', 1, 1, 15);
    });

    updateLevels();
    console.log('¡Base de datos actualizada con éxito!');
} catch (err) {
    console.error('Error al actualizar la base de datos:', err);
} finally {
    db.close();
}
