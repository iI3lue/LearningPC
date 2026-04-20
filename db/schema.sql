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

-- Tabla de categorías (Nivel 0 - Categoría principal)
CREATE TABLE IF NOT EXISTS categorias (
    id_categoria  INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre        TEXT    NOT NULL,
    descripcion   TEXT,
    icono         TEXT,           -- Emoji o nombre de icono
    orden         INTEGER DEFAULT 0,
    activa        INTEGER DEFAULT 1
);

-- Tabla de subcategorías (Nivel 1 - Subtema dentro de categoría)
-- Ejemplo: Categoría "Trucos" → Subcategoría "Pantallas divididas"
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

-- Tabla de niveles (Nivel 2 - Lecciones/Temas secuenciales)
-- Simplemente niveles ordinales: 1, 2, 3, 4... (sin básico/intermedio/avanzado)
CREATE TABLE IF NOT EXISTS niveles (
    id_nivel              INTEGER PRIMARY KEY AUTOINCREMENT,
    id_subcategoria       INTEGER NOT NULL,
    titulo                TEXT    NOT NULL,
    descripcion           TEXT,
    ruta_archivo          TEXT,
    nivel_ordinal         INTEGER DEFAULT 1,  -- 1, 2, 3, 4... (nivel secuencial)
    orden                 INTEGER DEFAULT 0,
    porcentaje_completado REAL    DEFAULT 0.0,
    tiempo_estimado_min   INTEGER,            -- Tiempo estimado en minutos
    FOREIGN KEY (id_subcategoria) REFERENCES subcategorias(id_subcategoria)
);

-- Tabla de progreso por usuario y nivel
CREATE TABLE IF NOT EXISTS progreso_usuario (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario        INTEGER NOT NULL,
    id_nivel          INTEGER NOT NULL,
    completado        INTEGER DEFAULT 0,         -- 0 = no, 1 = sí
    fecha_completado  TEXT,
    intentos          INTEGER DEFAULT 0,        -- Cuántas veces lo intentó
    tiempo_usado_seg  INTEGER DEFAULT 0,       -- Tiempo total en segundos
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_nivel)   REFERENCES niveles(id_nivel)
);

-- =============================================
-- Nueva categoría: Programación
-- =============================================
INSERT OR IGNORE INTO categorias (id_categoria, nombre, descripcion, icono, orden) VALUES
    (5, 'Programación', 'Introducción a la programación con Python', '💻', 5);

-- Subcategorías de Programación
INSERT OR IGNORE INTO subcategorias (id_subcategoria, id_categoria, nombre, descripcion, icono, orden) VALUES
    (16, 5, 'IDE e Intérprete', 'Conceptos básicos del entorno de desarrollo', '🖥️', 1),
    (17, 5, 'Variables', 'Almacena y usa datos', '📦', 2),
    (18, 5, 'Condicionales', 'Toma de decisiones', '🔀', 3),
    (19, 5, 'Funciones', 'Código reutilizable', '⚡', 4);

-- Niveles: IDE e Intérprete (id=16)
INSERT OR IGNORE INTO niveles (id_subcategoria, titulo, descripcion, ruta_archivo, nivel_ordinal, orden, tiempo_estimado_min) VALUES
    (16, '¿Qué es un IDE?', 'Introducción al entorno de desarrollo integrado', 'programacion/ide-interprete/ide-1.html', 1, 1, 10),
    (16, 'El Intérprete', 'Cómo se ejecuta el código Python', 'programacion/ide-interprete/ide-2.html', 2, 2, 10),
    (16, 'Tu primer programa', 'Hola Mundo tu primer código', 'programacion/ide-interprete/ide-3.html', 3, 3, 15);

-- Niveles: Variables (id=17)
INSERT OR IGNORE INTO niveles (id_subcategoria, titulo, descripcion, ruta_archivo, nivel_ordinal, orden, tiempo_estimado_min) VALUES
    (17, '¿Qué es una variable?', 'Guardar y usar datos', 'programacion/variables/variables-1.html', 1, 1, 10),
    (17, 'Tipos de datos', 'str, int, float, bool', 'programacion/variables/variables-2.html', 2, 2, 15),
    (17, 'Operaciones con tipos', 'Concatenación y conversión', 'programacion/variables/variables-3.html', 3, 3, 15);

-- Niveles: Condicionales (id=18)
INSERT OR IGNORE INTO niveles (id_subcategoria, titulo, descripcion, ruta_archivo, nivel_ordinal, orden, tiempo_estimado_min) VALUES
    (18, 'Decisiones con if', 'Tomar decisiones en código', 'programacion/condicionales/condicionales-1.html', 1, 1, 10),
    (18, 'Si no, entonces...', 'Usando else', 'programacion/condicionales/condicionales-2.html', 2, 2, 10),
    (18, 'Múltiples condiciones', 'Usando elif', 'programacion/condicionales/condicionales-3.html', 3, 3, 15);

-- Niveles: Funciones (id=19)
INSERT OR IGNORE INTO niveles (id_subcategoria, titulo, descripcion, ruta_archivo, nivel_ordinal, orden, tiempo_estimado_min) VALUES
    (19, 'Crear funciones', 'Definiendo funciones con def', 'programacion/funciones/funciones-1.html', 1, 1, 10),
    (19, 'Parámetros', 'Funciones con entradas', 'programacion/funciones/funciones-2.html', 2, 2, 15),
    (19, 'Retornar valores', 'Funciones con salidas', 'programacion/funciones/funciones-3.html', 3, 3, 15);

-- =============================================
-- Datos iniciales de categorías
-- =============================================
INSERT OR IGNORE INTO usuarios (usuario, contraseña, edad, progreso_total) VALUES
    ('admin', 'admin123', 25, 0.0);

INSERT OR IGNORE INTO categorias (id_categoria, nombre, descripcion, icono, orden) VALUES
    (1, 'Office', 'Manejo de herramientas de Microsoft Office', '📎', 1),
    (2, 'Navegación en Internet', 'Uso del navegador y motores de búsqueda', '🌐', 2),
    (3, 'Navegación en Windows', 'Uso del sistema operativo Windows', '🪟', 3),
    (4, 'Trucos Adicionales', 'Atajos y consejos útiles del computador', '💡', 4);

-- =============================================
-- Subcategorías iniciales (Nivel 1)
-- =============================================
INSERT OR IGNORE INTO subcategorias (id_subcategoria, id_categoria, nombre, descripcion, icono, orden) VALUES
    -- Trucos Adicionales
    (1, 4, 'Pantallas divididas', 'Aprende a dividir tu pantalla para trabajar con dos ventanas', '🖥️', 1),
    (3, 4, 'Explorador de archivos', 'Navegación y organización de archivos', '📁', 2),
    (4, 4, 'Personalización', 'Personalizar el escritorio y Windows', '🎨', 3),
    
    -- Navegación en Windows
    (5, 3, 'Escritorio', 'Uso del escritorio y manejador de ventanas', '🖥️', 1),
    (6, 3, 'Menú Inicio', 'Buscar aplicaciones y archivos', '🔍', 2),
    (7, 3, 'Barra de tareas', 'Anclar aplicaciones y usar la barra', '📌', 3),
    (8, 3, 'Configuración', 'Ajustes básicos del sistema', '⚙️', 4),
    
    -- Navegación en Internet
    (9, 2, 'Navegador Edge', 'Uso del navegador de Microsoft', '🌐', 1),
    (10, 2, 'Búsqueda efectiva', 'Cómo buscar en internet', '🔎', 2),
    (11, 2, 'Marcadores', 'Guardar páginas favoritas', '⭐', 3),
    
    -- Office
    (12, 1, 'Word', 'Procesador de texto', '📝', 1),
    (13, 1, 'Excel', 'Hojas de cálculo', '📊', 2),
    (14, 1, 'PowerPoint', 'Presentaciones', '📽️', 3),
    (15, 1, 'Atajos de teclado', 'Combinaciones de teclas para ser más productivo', '⌨️', 4);

-- =============================================
-- Niveles iniciales (Nivel 2: niveles ordinales 1, 2, 3...)
-- =============================================
INSERT OR IGNORE INTO niveles (id_subcategoria, titulo, descripcion, ruta_archivo, nivel_ordinal, orden, tiempo_estimado_min) VALUES
    -- Subcategoría: Pantallas divididas (id=1)
    (1, 'Comandos de teclas', 'Aprende los atajos de teclado básicos para dividir pantalla', 'trucos-dividir-pantalla.html', 1, 1, 10),
    (1, 'Arrastre a bordes', 'Divide ventanas arrastrando a los bordes de la pantalla', 'trucos-arrastre-bordes.html', 2, 2, 15),
    (1, 'Botones de control', 'Usa los botones de la barra de título para dividir', NULL, 3, 3, 10),
    
    -- Subcategoría: Atajos de teclado (id=15) - ahora en Office
    (15, 'Copiar y pegar', 'Los atajos Ctrl+C y Ctrl+V', 'atajos-copiar-pegar.html', 1, 1, 5),
    (15, 'Deshacer y rehacer', 'Ctrl+Z y Ctrl+Y', 'atajos-deshacer-rehacer.html', 2, 2, 8),
    (15, 'Atajos con Win', 'Win+D, Win+E, Win+L y más', 'atajos-win.html', 3, 3, 12),
    
    -- Subcategoría: Explorador de archivos (id=3)
    (3, 'Abrir explorador', 'Cómo abrir el explorador de archivos', NULL, 1, 1, 5),
    (3, 'Navegar carpetas', 'Moverse entre carpetas', NULL, 2, 2, 10),
    (3, 'Crear y organizar', 'Crear carpetas y mover archivos', NULL, 3, 3, 15),
    
    -- Subcategoría: Personalización (id=4)
    (4, 'Cambiar fondo de pantalla', 'Personalizar el fondo del escritorio', NULL, 1, 1, 5),
    (4, 'Organizar escritorio', 'Alinear y agrupar iconos', NULL, 2, 2, 8),
    (4, 'Widgets', 'Usar widgets de Windows 11', NULL, 3, 3, 10);
