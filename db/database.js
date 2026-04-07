// database.js - Inicialización y conexión a SQLite3
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// La BD se guarda junto a la app (en producción se puede mover a userData)
const DB_PATH = path.join(__dirname, '..', 'learning_pc.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

let db;

/**
 * Inicializa la base de datos.
 * Si no existe, la crea y ejecuta el schema.
 * Si existe, aplica migraciones si es necesario.
 * @returns {Database} instancia de la BD
 */
function initDatabase() {
    const esNueva = !fs.existsSync(DB_PATH);

    db = new Database(DB_PATH);

    // Activar foreign keys
    db.pragma('foreign_keys = ON');

    // Si la BD es nueva, ejecutar el schema completo
    if (esNueva) {
        const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8');
        db.exec(schema);
        console.log('[DB] Base de datos creada y schema aplicado.');
    } else {
        console.log('[DB] Base de datos existente cargada.');
        // Verificar y crear tablas que falten (migración)
        aplicarMigraciones();
    }

    return db;
}

/**
 * Migra la base de datos existente agregando las tablas nuevas
 * sin eliminar los datos existentes.
 */
function aplicarMigraciones() {
    try {
        // Verificar tablas existentes
        const tablas = db.prepare(
            "SELECT name FROM sqlite_master WHERE type='table'"
        ).all();
        const nombresTablas = tablas.map(t => t.name);
        
        console.log('[DB] Tablas existentes:', nombresTablas.join(', '));
        
        // 1. Crear tabla subcategorías si no existe
        if (!nombresTablas.includes('subcategorias')) {
            console.log('[DB] Creando tabla subcategorias...');
            db.exec(`
                CREATE TABLE IF NOT EXISTS subcategorias (
                    id_subcategoria   INTEGER PRIMARY KEY AUTOINCREMENT,
                    id_categoria      INTEGER NOT NULL,
                    nombre            TEXT    NOT NULL,
                    descripcion       TEXT,
                    icono             TEXT,
                    orden             INTEGER DEFAULT 0,
                    activa            INTEGER DEFAULT 1,
                    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
                );
            `);
        }
        
        // 2. Verificar estructura de niveles (vieja vs nueva)
        const columnasNiveles = db.prepare("PRAGMA table_info(niveles)").all();
        const nombresColumnas = columnasNiveles.map(c => c.name);
        
        // Si tiene id_categoria pero no id_subcategoria, es estructura vieja
        const tieneIdCategoria = nombresColumnas.includes('id_categoria');
        const tieneIdSubcategoria = nombresColumnas.includes('id_subcategoria');
        
        if (tieneIdCategoria && !tieneIdSubcategoria) {
            console.log('[DB] Migrando estructura de niveles (vieja -> nueva)...');
            
            // Agregar columna id_subcategoria
            db.exec("ALTER TABLE niveles ADD COLUMN id_subcategoria INTEGER");
            
            // Crear subcategorías por defecto para cada categoría
            const categorias = db.prepare("SELECT id_categoria, nombre FROM categorias").all();
            
            for (const cat of categorias) {
                // Crear subcategoría por defecto
                const result = db.prepare(
                    "INSERT INTO subcategorias (id_categoria, nombre, descripcion, orden) VALUES (?, ?, ?, ?)"
                ).run(cat.id_categoria, cat.nombre, 'Contenido de ' + cat.nombre, 1);
                
                // Actualizar niveles para que apunten a esta subcategoría
                db.prepare("UPDATE niveles SET id_subcategoria = ? WHERE id_categoria = ?")
                    .run(result.lastInsertRowid, cat.id_categoria);
            }
            
            // Ahora agregar FK y quitar id_categoria temporal
            // (En SQLite no se puede eliminar columna fácilmente, así que la dejamos)
            console.log('[DB] Migración de niveles completada.');
        }
        
        // 3. Crear tabla progreso_usuario si no existe
        if (!nombresTablas.includes('progreso_usuario')) {
            console.log('[DB] Creando tabla progreso_usuario...');
            db.exec(`
                CREATE TABLE IF NOT EXISTS progreso_usuario (
                    id                INTEGER PRIMARY KEY AUTOINCREMENT,
                    id_usuario        INTEGER NOT NULL,
                    id_nivel          INTEGER NOT NULL,
                    completado        INTEGER DEFAULT 0,
                    fecha_completado  TEXT,
                    intentos          INTEGER DEFAULT 0,
                    tiempo_usado_seg  INTEGER DEFAULT 0,
                    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
                    FOREIGN KEY (id_nivel)   REFERENCES niveles(id_nivel)
                );
            `);
        }
        
        // 4. Si no hay categorías, insertar datos iniciales
        const countCategorias = db.prepare("SELECT COUNT(*) as total FROM categorias").get();
        console.log('[DB] Count categorias:', countCategorias.total);
        if (countCategorias.total === 0) {
            console.log('[DB] Insertando datos iniciales...');
            db.exec(`
                INSERT INTO categorias (nombre, descripcion, icono, orden) VALUES
                    ('Office', 'Manejo de herramientas de Microsoft Office', '📎', 1),
                    ('Navegación en Internet', 'Uso del navegador y motores de búsqueda', '🌐', 2),
                    ('Navegación en Windows', 'Uso del sistema operativo Windows', '🪟', 3),
                    ('Trucos Adicionales', 'Atajos y consejos útiles del computador', '💡', 4);
            `);
        }
        
        // 5. Si no hay subcategorías, crear por defecto
        const countSubcategorias = db.prepare("SELECT COUNT(*) as total FROM subcategorias").get();
        console.log('[DB] Count subcategorias:', countSubcategorias.total);
        if (countSubcategorias.total === 0) {
            console.log('[DB] Creando subcategorías por defecto...');
            const categorias = db.prepare("SELECT id_categoria, nombre FROM categorias").all();
            for (const cat of categorias) {
                db.prepare("INSERT INTO subcategorias (id_categoria, nombre, descripcion, orden) VALUES (?, ?, ?, ?)")
                    .run(cat.id_categoria, cat.nombre, 'Contenido principal', 1);
            }
        }
        
        // 6. Si no hay niveles, insertar datos de ejemplo
        const countNiveles = db.prepare("SELECT COUNT(*) as total FROM niveles").get();
        console.log('[DB] Count niveles:', countNiveles.total);
        if (countNiveles.total === 0) {
            console.log('[DB] Insertando niveles de ejemplo...');
            const subcategorias = db.prepare("SELECT id_subcategoria, id_categoria FROM subcategorias").all();
            
            const nivelesEjemplo = [
                { titulo: 'Introducción', descripcion: 'Conceptos básicos', tiempo: 10 },
                { titulo: 'Primeros pasos', descripcion: 'Guía de inicio', tiempo: 15 },
                { titulo: 'Funciones básicas', descripcion: 'Aprende las operaciones fundamentales', tiempo: 20 },
            ];
            
            for (const sub of subcategorias) {
                nivelesEjemplo.forEach((nivel, idx) => {
                    db.prepare(
                        "INSERT INTO niveles (id_subcategoria, titulo, descripcion, nivel_ordinal, orden, tiempo_estimado_min) VALUES (?, ?, ?, ?, ?, ?)"
                    ).run(sub.id_subcategoria, nivel.titulo, nivel.descripcion, idx + 1, idx + 1, nivel.tiempo);
                });
            }
        } else {
            // Verificar si los niveles tienen id_subcategoria
            const nivelSinSub = db.prepare("SELECT COUNT(*) as total FROM niveles WHERE id_subcategoria IS NULL OR id_subcategoria = 0").get();
            console.log('[DB] Niveles sin subcategoría:', nivelSinSub.total);
            if (nivelSinSub.total > 0) {
                console.log('[DB] Corrigiendo niveles sin subcategoría...');
                // Obtener primera subcategoría por cada categoría
                const subcats = db.prepare("SELECT id_subcategoria, id_categoria FROM subcategorias").all();
                const subcatPorCat = {};
                subcats.forEach(s => { subcatPorCat[s.id_categoria] = s.id_subcategoria; });
                
                // Actualizar niveles
                const nivelesSinSub = db.prepare("SELECT id_nivel, id_categoria FROM niveles WHERE id_subcategoria IS NULL OR id_subcategoria = 0").all();
                for (const niv of nivelesSinSub) {
                    const idSub = subcatPorCat[niv.id_categoria];
                    if (idSub) {
                        db.prepare("UPDATE niveles SET id_subcategoria = ? WHERE id_nivel = ?").run(idSub, niv.id_nivel);
                    }
                }
                console.log('[DB] Niveles corregidos.');
            }
        }
        
        console.log('[DB] Migraciones completadas.');
    } catch (err) {
        console.error('[DB] Error en migración:', err.message);
    }
}

/**
 * Devuelve la instancia activa de la BD.
 * Debe llamarse después de initDatabase().
 */
function getDatabase() {
    if (!db) throw new Error('La base de datos no ha sido inicializada.');
    return db;
}

module.exports = { initDatabase, getDatabase };
