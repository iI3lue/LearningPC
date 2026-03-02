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
 * @returns {Database} instancia de la BD
 */
function initDatabase() {
    const esNueva = !fs.existsSync(DB_PATH);

    db = new Database(DB_PATH);

    // Activar foreign keys
    db.pragma('foreign_keys = ON');

    // Si la BD es nueva, ejecutar el schema (crear tablas + datos iniciales)
    if (esNueva) {
        const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8');
        db.exec(schema);
        console.log('[DB] Base de datos creada y schema aplicado.');
    } else {
        console.log('[DB] Base de datos existente cargada.');
    }

    return db;
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
