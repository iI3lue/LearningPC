// main.js - Proceso principal de Electron
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { initDatabase, getDatabase } = require('./db/database');

let mainWindow;

// ── Crear ventana principal ──────────────────────────────────────────────────
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 720,
        resizable: true, // Modificable
        minWidth: 800,   // Escala mínima para responsividad
        minHeight: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    // Cargar la pantalla de login al inicio
    mainWindow.loadFile(path.join(__dirname, 'src', 'pages', 'login.html'));
}

// ── Inicializar app ──────────────────────────────────────────────────────────
app.whenReady().then(() => {
    initDatabase(); // Crear/conectar BD al arrancar
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// ── Control de Ventana (Pantalla Completa) ───────────────────────────────────
ipcMain.on('window:toggleFullScreen', () => {
    const isFullScreen = mainWindow.isFullScreen();
    mainWindow.setFullScreen(!isFullScreen);
});

// Atajo F11 para pantalla completa (Global o local a la ventana)
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
    };
    if (paginas[pagina]) mainWindow.loadFile(paginas[pagina]);
});

// ── Autenticación ────────────────────────────────────────────────────────────
ipcMain.handle('auth:login', (event, { usuario, contraseña }) => {
    const db = getDatabase();
    const user = db.prepare(
        'SELECT * FROM usuarios WHERE usuario = ? AND contraseña = ?'
    ).get(usuario, contraseña);

    if (user) {
        return { ok: true, usuario: user };
    } else {
        return { ok: false, mensaje: 'Usuario o contraseña incorrectos.' };
    }
});

ipcMain.handle('auth:registrar', (event, { usuario, contraseña, edad }) => {
    const db = getDatabase();
    try {
        db.prepare(
            'INSERT INTO usuarios (usuario, contraseña, edad) VALUES (?, ?, ?)'
        ).run(usuario, contraseña, edad);
        return { ok: true };
    } catch (err) {
        return { ok: false, mensaje: 'El nombre de usuario ya existe.' };
    }
});

// ── Datos ────────────────────────────────────────────────────────────────────
ipcMain.handle('data:getCategorias', () => {
    const db = getDatabase();
    return db.prepare('SELECT * FROM categorias').all();
});

ipcMain.handle('data:getNivelesPorCategoria', (event, idCategoria) => {
    const db = getDatabase();
    return db.prepare(
        'SELECT * FROM niveles WHERE id_categoria = ? ORDER BY orden ASC'
    ).all(idCategoria);
});

ipcMain.handle('data:getProgreso', (event, idUsuario) => {
    const db = getDatabase();
    return db.prepare(
        'SELECT * FROM progreso_usuario WHERE id_usuario = ?'
    ).all(idUsuario);
});

ipcMain.handle('data:marcarNivelCompletado', (event, { idUsuario, idNivel }) => {
    const db = getDatabase();
    const fecha = new Date().toISOString();

    // Insertar o actualizar el progreso del nivel
    db.prepare(`
        INSERT INTO progreso_usuario (id_usuario, id_nivel, completado, fecha_completado)
        VALUES (?, ?, 1, ?)
        ON CONFLICT(id_usuario, id_nivel) DO UPDATE SET completado = 1, fecha_completado = ?
    `).run(idUsuario, idNivel, fecha, fecha);

    // Recalcular progreso_total del usuario
    const { total } = db.prepare(`
        SELECT ROUND(
            (COUNT(CASE WHEN pu.completado = 1 THEN 1 END) * 100.0) / COUNT(n.id_nivel), 2
        ) AS total
        FROM niveles n
        LEFT JOIN progreso_usuario pu ON n.id_nivel = pu.id_nivel AND pu.id_usuario = ?
    `).get(idUsuario);

    db.prepare('UPDATE usuarios SET progreso_total = ? WHERE id_usuario = ?')
        .run(total, idUsuario);

    return { ok: true, progreso_total: total };
});
