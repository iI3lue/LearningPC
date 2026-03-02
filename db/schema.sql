-- =============================================
-- Learning PC - Esquema de Base de Datos SQLite
-- =============================================

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario       INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario          TEXT    UNIQUE NOT NULL,
    contraseña       TEXT    NOT NULL,
    edad             INTEGER,
    progreso_total   REAL    DEFAULT 0.0
);

-- Tabla de categorías
CREATE TABLE IF NOT EXISTS categorias (
    id_categoria  INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre        TEXT    NOT NULL,
    descripcion   TEXT
);

-- Tabla de niveles (vinculada a categorías)
CREATE TABLE IF NOT EXISTS niveles (
    id_nivel              INTEGER PRIMARY KEY AUTOINCREMENT,
    id_categoria          INTEGER NOT NULL,
    titulo                TEXT    NOT NULL,
    descripcion           TEXT,
    ruta_archivo          TEXT,
    orden                 INTEGER DEFAULT 0,
    porcentaje_completado REAL    DEFAULT 0.0,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
);

-- Tabla de progreso por usuario y nivel
CREATE TABLE IF NOT EXISTS progreso_usuario (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario        INTEGER NOT NULL,
    id_nivel          INTEGER NOT NULL,
    completado        INTEGER DEFAULT 0,         -- 0 = no, 1 = sí
    fecha_completado  TEXT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_nivel)   REFERENCES niveles(id_nivel)
);

-- =============================================
-- Datos iniciales de categorías
-- =============================================
INSERT OR IGNORE INTO categorias (id_categoria, nombre, descripcion) VALUES
    (1, 'Office',               'Manejo de herramientas de Microsoft Office'),
    (2, 'Navegación en Internet','Uso del navegador y motores de búsqueda'),
    (3, 'Navegación en Windows', 'Uso del sistema operativo Windows'),
    (4, 'Trucos Adicionales',   'Atajos y consejos útiles del computador');
