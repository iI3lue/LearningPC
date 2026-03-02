// preload.js - Puente seguro entre el proceso principal (Node) y el renderer (HTML/JS)
const { contextBridge, ipcRenderer } = require('electron');

// Expone funciones controladas al frontend mediante window.api
contextBridge.exposeInMainWorld('api', {

    // ── Autenticación ──────────────────────────────────────────
    login: (usuario, contraseña) =>
        ipcRenderer.invoke('auth:login', { usuario, contraseña }),

    registrar: (datos) =>
        ipcRenderer.invoke('auth:registrar', datos),

    // Ventana
    toggleFullScreen: () => ipcRenderer.send('window:toggleFullScreen'),

    // ── Navegación entre páginas ───────────────────────────────
    irA: (pagina) =>
        ipcRenderer.send('nav:irA', pagina),

    // ── Categorías ─────────────────────────────────────────────
    getCategorias: () =>
        ipcRenderer.invoke('data:getCategorias'),

    // ── Niveles ────────────────────────────────────────────────
    getNivelesPorCategoria: (idCategoria) =>
        ipcRenderer.invoke('data:getNivelesPorCategoria', idCategoria),

    // ── Progreso ───────────────────────────────────────────────
    getProgreso: (idUsuario) =>
        ipcRenderer.invoke('data:getProgreso', idUsuario),

    marcarNivelCompletado: (idUsuario, idNivel) =>
        ipcRenderer.invoke('data:marcarNivelCompletado', { idUsuario, idNivel }),
});
