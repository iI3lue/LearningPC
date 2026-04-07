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
    toggleTheme: () => ipcRenderer.send('theme:toggle'),
    openDevTools: () => ipcRenderer.send('window:openDevTools'),

    // ── Navegación entre páginas ───────────────────────────────
    irA: (pagina) =>
        ipcRenderer.send('nav:irA', pagina),

    // ── Datos Jerárquicos (Nueva estructura) ───────────────────
    
    // Categorías (Nivel 0)
    getCategorias: () =>
        ipcRenderer.invoke('data:getCategorias'),

    // Subcategorías (Nivel 1)
    getSubcategoriasPorCategoria: (idCategoria) =>
        ipcRenderer.invoke('data:getSubcategoriasPorCategoria', idCategoria),

    // Niveles (Nivel 2)
    getNivelesPorSubcategoria: (idSubcategoria) =>
        ipcRenderer.invoke('data:getNivelesPorSubcategoria', idSubcategoria),

    // Niveles por categoría (legacy -兼容性)
    getNivelesPorCategoria: (idCategoria) =>
        ipcRenderer.invoke('data:getNivelesPorCategoria', idCategoria),

    // ── Progreso ───────────────────────────────────────────────
    getProgreso: (idUsuario) =>
        ipcRenderer.invoke('data:getProgreso', idUsuario),

    marcarNivelCompletado: (idUsuario, idNivel) =>
        ipcRenderer.invoke('data:marcarNivelCompletado', { idUsuario, idNivel }),

    // ── Administración (CRUD) ──────────────────────────────────
    getTodosLosNiveles: () => ipcRenderer.invoke('admin:getTodosLosNiveles'),
    getTodasLasSubcategorias: () => ipcRenderer.invoke('admin:getTodasLasSubcategorias'),
    guardarNivel: (datos) => ipcRenderer.invoke('admin:guardarNivel', datos),
    eliminarNivel: (idNivel) => ipcRenderer.invoke('admin:eliminarNivel', idNivel),
    actualizarRutaNivel: (idNivel, ruta) => ipcRenderer.invoke('admin:actualizarRutaNivel', { idNivel, rutaArchivo: ruta }),
    getReporteGeneral: () => ipcRenderer.invoke('admin:getReporteGeneral'),
});
