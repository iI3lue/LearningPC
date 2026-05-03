// main.js - Proceso principal de Electron
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

// Rutas de archivos
const DB_PATH = path.join(__dirname, 'learning_pc.db');

const { initDatabase, getDatabase } = require('./db/database');

let mainWindow;

// ── Crear ventana principal ──────────────────────────────────────────────────
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        resizable: true,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            webSecurity: true,
        },
    });

    // Abrir maximizada por defecto
    mainWindow.maximize();

    // Cargar la pantalla de login al inicio
    mainWindow.loadFile(path.join(__dirname, 'src', 'pages', 'login.html'));
}

// ── Inicializar app ──────────────────────────────────────────────────────────
app.whenReady().then(() => {
    // Solo inicializar (mantiene BD existente)
    initDatabase();

    // Restaurar rutas a su ruta completa relativa a la raíz del proyecto.
    // La migración anterior dejó rutas como '../../contenido/ide-1.html'
    // que perdían el subdirectorio real (ej: programacion/ide-interprete/).
    try {
        const db = getDatabase();
        const rutasCorrectas = {
            'ide-1.html':                  'contenido/programacion/ide-interprete/ide-1.html',
            'ide-2.html':                  'contenido/programacion/ide-interprete/ide-2.html',
            'ide-3.html':                  'contenido/programacion/ide-interprete/ide-3.html',
            'variables-1.html':            'contenido/programacion/variables/variables-1.html',
            'variables-2.html':            'contenido/programacion/variables/variables-2.html',
            'variables-3.html':            'contenido/programacion/variables/variables-3.html',
            'condicionales-1.html':        'contenido/programacion/condicionales/condicionales-1.html',
            'condicionales-2.html':        'contenido/programacion/condicionales/condicionales-2.html',
            'condicionales-3.html':        'contenido/programacion/condicionales/condicionales-3.html',
            'funciones-1.html':            'contenido/programacion/funciones/funciones-1.html',
            'funciones-2.html':            'contenido/programacion/funciones/funciones-2.html',
            'funciones-3.html':            'contenido/programacion/funciones/funciones-3.html',
            'atajos-copiar-pegar.html':    'contenido/atajos-copiar-pegar.html',
            'atajos-deshacer-rehacer.html':'contenido/atajos-deshacer-rehacer.html',
            'atajos-win.html':             'contenido/atajos-win.html',
            'explorador-abrir.html':       'contenido/explorador-abrir.html',
            'explorador-navegar.html':     'contenido/explorador-navegar.html',
            'explorador-organizar.html':   'contenido/explorador-organizar.html',
            'trucos-arrastre-bordes.html': 'contenido/trucos-arrastre-bordes.html',
            'trucos-botones-control.html': 'contenido/trucos-botones-control.html',
            'trucos-dividir-pantalla.html':'contenido/trucos-dividir-pantalla.html',
        };
        
        const niveles = db.prepare("SELECT id_nivel, ruta_archivo FROM niveles").all();
        console.log(`[DB] Verificando ${niveles.length} niveles...`);
        
        for (const nivel of niveles) {
            const rutaActual = nivel.ruta_archivo || '';
            const nombreArchivo = rutaActual.replace(/\\/g, '/').split('/').pop();
            const rutaCorrecta = rutasCorrectas[nombreArchivo];
            
            console.log(`[DB] Nivel ID ${nivel.id_nivel}: Archivo="${nombreArchivo}", Actual="${rutaActual}", Esperada="${rutaCorrecta}"`);
            
            if (rutaCorrecta && rutaActual !== rutaCorrecta) {
                db.prepare('UPDATE niveles SET ruta_archivo = ? WHERE id_nivel = ?')
                    .run(rutaCorrecta, nivel.id_nivel);
                console.log(`[DB] ✅ Ruta corregida para ID ${nivel.id_nivel}: ${rutaCorrecta}`);
            }
        }
    } catch (e) {
        console.error('[DB] ❌ Error en migración de rutas:', e.message);
    }

    // Migrar contraseñas en texto plano a bcrypt
    try {
        const db = getDatabase();
        const usuarios = db.prepare('SELECT id_usuario, contraseña FROM usuarios').all();
        for (const u of usuarios) {
            // Si la contraseña NO empieza con $2a$ o $2b$, es texto plano
            if (u.contraseña && !u.contraseña.startsWith('$2a$') && !u.contraseña.startsWith('$2b$')) {
                const hash = bcrypt.hashSync(u.contraseña, 10);
                db.prepare('UPDATE usuarios SET contraseña = ? WHERE id_usuario = ?').run(hash, u.id_usuario);
                console.log(`[DB] Contraseña hasheada para usuario ID ${u.id_usuario}`);
            }
        }
    } catch (e) {
        console.error('[DB] Error migrando contraseñas:', e.message);
    }

    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// ── Ruta base de la app ──────────────────────────────────────────────────────
ipcMain.handle('app:getPath', () => __dirname);

// ── Control de Ventana (Pantalla Completa) ───────────────────────────────────
ipcMain.on('window:toggleFullScreen', () => {
    const isFullScreen = mainWindow.isFullScreen();
    mainWindow.setFullScreen(!isFullScreen);
});

// DevTools shortcut (Ctrl+Shift+I)
ipcMain.on('window:openDevTools', () => {
    mainWindow.webContents.openDevTools();
});

// Atajo F11 para pantalla completa
app.on('browser-window-focus', () => {
    const { globalShortcut } = require('electron');
    globalShortcut.register('F11', () => {
        const isFullScreen = mainWindow.isFullScreen();
        mainWindow.setFullScreen(!isFullScreen);
    });
});

app.on('browser-window-blur', () => {
    const { globalShortcut } = require('electron');
    globalShortcut.unregister('F11');
});

// ── Navegación entre páginas ─────────────────────────────────────────────────
ipcMain.on('nav:irA', (event, pagina) => {
    const paginas = {
        login: path.join(__dirname, 'src', 'pages', 'login.html'),
        registro: path.join(__dirname, 'src', 'pages', 'registro.html'),
        home: path.join(__dirname, 'src', 'pages', 'home.html'),
        gestion: path.join(__dirname, 'src', 'pages', 'gestion.html'),
        formulario: path.join(__dirname, 'src', 'pages', 'formulario.html'),
        reportes: path.join(__dirname, 'src', 'pages', 'reportes.html'),
        simulacion: path.join(__dirname, 'src', 'pages', 'simulacion.html'),
        ajustes: path.join(__dirname, 'src', 'pages', 'ajustes.html'),
    };
    if (paginas[pagina]) mainWindow.loadFile(paginas[pagina]);
});

// ── Autenticación ────────────────────────────────────────────────────────────
ipcMain.handle('auth:login', (event, { usuario, contraseña }) => {
    const db = getDatabase();
    
    try {
        // Obtener el usuario por nombre
        const user = db.prepare(
            'SELECT * FROM usuarios WHERE usuario = ?'
        ).get(usuario);
        
        if (!user) {
            return { ok: false, mensaje: 'El usuario no existe.', codigo: 'usuario_no_existe' };
        }
        
        // Comparar contraseña (soporta texto plano para admin inicial o hash para nuevos)
        let passwordMatch = false;
        if (user.contraseña === contraseña) {
            // Caso legacy/admin inicial: texto plano
            passwordMatch = true;
        } else {
            // Caso normal: hash con bcrypt
            try {
                passwordMatch = bcrypt.compareSync(contraseña, user.contraseña);
            } catch (e) {
                passwordMatch = false;
            }
        }
        
        if (passwordMatch) {
            return { ok: true, usuario: user };
        } else {
            return { ok: false, mensaje: 'Contraseña incorrecta.', codigo: 'contraseña_incorrecta' };
        }
    } catch (err) {
        console.error('[AUTH] Error en login:', err);
        return { ok: false, mensaje: 'Error interno del servidor.' };
    }
});

ipcMain.handle('auth:registrar', (event, { usuario, contraseña, edad }) => {
    const db = getDatabase();
    try {
        const hash = bcrypt.hashSync(contraseña, 10);
        db.prepare(
            'INSERT INTO usuarios (usuario, contraseña, edad) VALUES (?, ?, ?)'
        ).run(usuario, hash, edad);
        return { ok: true };
    } catch (err) {
        return { ok: false, mensaje: 'El nombre de usuario ya existe.' };
    }
});

// ── Datos - Estructura jerárquica ────────────────────────────────────────────

// Obtener todas las categorías (mostrar todas, no solo activas)
ipcMain.handle('data:getCategorias', () => {
    const db = getDatabase();
    const cats = db.prepare('SELECT * FROM categorias ORDER BY orden').all();
    console.log('[MAIN] getCategorias:', cats.length, 'categorías');
    return cats;
});

// Obtener subcategorías por categoría (mostrar todas)
ipcMain.handle('data:getSubcategoriasPorCategoria', (event, idCategoria) => {
    const db = getDatabase();
    const subs = db.prepare(
        'SELECT * FROM subcategorias WHERE id_categoria = ? ORDER BY orden'
    ).all(idCategoria);
    console.log('[MAIN] getSubcategoriasPorCategoria(', idCategoria, '):', subs.length, 'subcategorías');
    return subs;
});

// Obtener una subcategoría específica por ID (para obtener id_categoria)
ipcMain.handle('data:getSubcategoria', (event, idSubcategoria) => {
    const db = getDatabase();
    const sub = db.prepare('SELECT * FROM subcategorias WHERE id_subcategoria = ?').get(idSubcategoria);
    console.log('[MAIN] getSubcategoria(', idSubcategoria, '):', sub ? sub.nombre : 'null');
    return sub;
});

// Obtener niveles por subcategoría
ipcMain.handle('data:getNivelesPorSubcategoria', (event, idSubcategoria) => {
    const db = getDatabase();
    const nivs = db.prepare(`
        SELECT n.*, s.id_categoria AS categoria_id
        FROM niveles n
        JOIN subcategorias s ON n.id_subcategoria = s.id_subcategoria
        WHERE n.id_subcategoria = ?
        ORDER BY n.nivel_ordinal ASC, n.orden ASC
    `).all(idSubcategoria);
    console.log('[MAIN] getNivelesPorSubcategoria(', idSubcategoria, '):', nivs.length, 'niveles');
    return nivs;
});

// Obtener niveles por categoría (legacy para compatibilidad)
ipcMain.handle('data:getNivelesPorCategoria', (event, idCategoria) => {
    const db = getDatabase();
    return db.prepare(`
        SELECT n.*, s.nombre as nombre_subcategoria, s.id_subcategoria
        FROM niveles n
        JOIN subcategorias s ON n.id_subcategoria = s.id_subcategoria
        WHERE s.id_categoria = ?
        ORDER BY s.orden, n.nivel_ordinal, n.orden
    `).all(idCategoria);
});

// Obtener progreso del usuario
ipcMain.handle('data:getProgreso', (event, idUsuario) => {
    const db = getDatabase();

    // Totales globales
    const resumen = db.prepare(`
        SELECT
            COUNT(n.id_nivel) AS total,
            COUNT(CASE WHEN pu.completado = 1 THEN 1 END) AS completados
        FROM niveles n
        JOIN subcategorias s ON n.id_subcategoria = s.id_subcategoria
        LEFT JOIN progreso_usuario pu ON n.id_nivel = pu.id_nivel AND pu.id_usuario = ?
    `).get(idUsuario);

    // Desglose por categoría
    const categorias = db.prepare(`
        SELECT
            c.nombre,
            COUNT(n.id_nivel) AS total,
            COUNT(CASE WHEN pu.completado = 1 THEN 1 END) AS completados
        FROM categorias c
        JOIN subcategorias s ON c.id_categoria = s.id_categoria
        JOIN niveles n ON s.id_subcategoria = n.id_subcategoria
        LEFT JOIN progreso_usuario pu ON n.id_nivel = pu.id_nivel AND pu.id_usuario = ?
        GROUP BY c.id_categoria
        ORDER BY c.id_categoria
    `).all(idUsuario);

    // Lista cruda de niveles (para compatibilidad con home.js)
    const nivelesRaw = db.prepare(`
        SELECT id_nivel, completado FROM progreso_usuario WHERE id_usuario = ?
    `).all(idUsuario);

    return {
        total: resumen.total || 0,
        completados: resumen.completados || 0,
        categorias: categorias,
        niveles: nivelesRaw
    };
});

// Marcar nivel como completado
ipcMain.handle('data:marcarNivelCompletado', (event, { idUsuario, idNivel }) => {
    const db = getDatabase();
    const fecha = new Date().toISOString();

    const existente = db.prepare(
        'SELECT id FROM progreso_usuario WHERE id_usuario = ? AND id_nivel = ?'
    ).get(idUsuario, idNivel);

    if (existente) {
        db.prepare('UPDATE progreso_usuario SET completado = 1, fecha_completado = ? WHERE id = ?')
            .run(fecha, existente.id);
    } else {
        db.prepare('INSERT INTO progreso_usuario (id_usuario, id_nivel, completado, fecha_completado) VALUES (?, ?, 1, ?)')
            .run(idUsuario, idNivel, fecha);
    }

    // Recalcular progreso total
    const { total } = db.prepare(`
        SELECT ROUND(
            (COUNT(CASE WHEN pu.completado = 1 THEN 1 END) * 100.0) / NULLIF(COUNT(n.id_nivel), 0), 2
        ) AS total
        FROM niveles n
        JOIN subcategorias s ON n.id_subcategoria = s.id_subcategoria
        LEFT JOIN progreso_usuario pu ON n.id_nivel = pu.id_nivel AND pu.id_usuario = ?
    `).get(idUsuario);

    db.prepare('UPDATE usuarios SET progreso_total = ? WHERE id_usuario = ?')
        .run(total || 0, idUsuario);

    return { ok: true, progreso_total: total || 0 };
});

// ── Administración (CRUD) ───────────────────────────────────────────────────

// Obtener todos los niveles
ipcMain.handle('admin:getTodosLosNiveles', () => {
    const db = getDatabase();
    return db.prepare(`
        SELECT n.*, s.nombre as nombre_subcategoria, c.nombre as nombre_categoria, c.id_categoria
        FROM niveles n
        JOIN subcategorias s ON n.id_subcategoria = s.id_subcategoria
        JOIN categorias c ON s.id_categoria = c.id_categoria
        ORDER BY c.orden, s.orden, n.nivel_ordinal, n.orden
    `).all();
});

// Obtener todas las subcategorías
ipcMain.handle('admin:getTodasLasSubcategorias', () => {
    const db = getDatabase();
    return db.prepare(`
        SELECT s.*, c.nombre as nombre_categoria
        FROM subcategorias s
        JOIN categorias c ON s.id_categoria = c.id_categoria
        ORDER BY c.orden, s.orden
    `).all();
});

// Guardar nivel
ipcMain.handle('admin:guardarNivel', (event, datos) => {
    const db = getDatabase();
    try {
        if (datos.id_nivel) {
            db.prepare(`
                UPDATE niveles SET 
                id_subcategoria = ?, titulo = ?, descripcion = ?, ruta_archivo = ?, 
                nivel_ordinal = ?, orden = ?, tiempo_estimado_min = ?
                WHERE id_nivel = ?
            `).run(
                datos.id_subcategoria, datos.titulo, datos.descripcion, 
                datos.ruta_archivo, datos.nivel_ordinal || 1, 
                datos.orden || 0, datos.tiempo_estimado_min,
                datos.id_nivel
            );
        } else {
            db.prepare(`
                INSERT INTO niveles (id_subcategoria, titulo, descripcion, ruta_archivo, nivel_ordinal, orden, tiempo_estimado_min)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `).run(
                datos.id_subcategoria, datos.titulo, datos.descripcion, 
                datos.ruta_archivo, datos.nivel_ordinal || 1, 
                datos.orden || 0, datos.tiempo_estimado_min
            );
        }
        return { ok: true };
    } catch (err) {
        return { ok: false, mensaje: err.message };
    }
});

// Eliminar nivel
ipcMain.handle('admin:eliminarNivel', (event, idNivel) => {
    const db = getDatabase();
    try {
        db.prepare('DELETE FROM niveles WHERE id_nivel = ?').run(idNivel);
        return { ok: true };
    } catch (err) {
        return { ok: false, mensaje: err.message };
    }
});

// Actualizar ruta del nivel
ipcMain.handle('admin:actualizarRutaNivel', (event, { idNivel, rutaArchivo }) => {
    const db = getDatabase();
    try {
        db.prepare('UPDATE niveles SET ruta_archivo = ? WHERE id_nivel = ?').run(rutaArchivo, idNivel);
        return { ok: true };
    } catch (err) {
        return { ok: false, mensaje: err.message };
    }
});

// Reporte general
ipcMain.handle('admin:getReporteGeneral', () => {
    const db = getDatabase();
    const stats = {
        totalUsuarios: db.prepare('SELECT COUNT(*) as count FROM usuarios').get().count,
        totalNiveles: db.prepare('SELECT COUNT(*) as count FROM niveles').get().count,
        totalSubcategorias: db.prepare('SELECT COUNT(*) as count FROM subcategorias').get().count,
        totalCategorias: db.prepare('SELECT COUNT(*) as count FROM categorias').get().count,
        progresoPromedio: db.prepare('SELECT AVG(progreso_total) as avg FROM usuarios').get().avg || 0,
        usuariosRecientes: db.prepare('SELECT usuario, progreso_total FROM usuarios ORDER BY id_usuario DESC LIMIT 5').all()
    };
    return stats;
});
