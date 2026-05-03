/**
 * navigation.js
 * Componentes de navegación global: Breadcrumbs, Barra de Progreso, Mapa de Lecciones
 */

// ─────────────────────────────────────────────
// BREADCRUMBS
// ─────────────────────────────────────────────
let navegacionActual = {
    categoria: '',
    subcategoria: '',
    nivel: '',
    nivelIndex: 0
};

function initBreadcrumbs(containerId = 'breadcrumbs-container') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    renderBreadcrumbs();
}

function setBreadcrumb(categoria, subcategoria, nivel, nivelIndex = 0) {
    navegacionActual = { categoria, subcategoria, nivel, nivelIndex };
    renderBreadcrumbs();
    guardarNavegacion();
}

function renderBreadcrumbs() {
    const container = document.getElementById('breadcrumbs-container');
    if (!container) return;
    
    const homeIcon = '<span class="bc-icon">🏠</span>';
    const catIcon = '<span class="bc-icon">📁</span>';
    const subcatIcon = '<span class="bc-icon">📂</span>';
    const nivelIcon = '<span class="bc-icon">📝</span>';
    
    const items = [
        { label: 'Inicio', icon: homeIcon, action: () => irAHome() },
        navegacionActual.categoria && { label: navegacionActual.categoria, icon: catIcon, action: () => irACategoria(navegacionActual.categoria) },
        navegacionActual.subcategoria && { label: navegacionActual.subcategoria, icon: subcatIcon, action: () => irASubcategoria(navegacionActual.subcategoria) },
        navegacionActual.nivel && { label: navegacionActual.nivel, icon: nivelIcon }
    ].filter(Boolean);
    
    container.innerHTML = items.map((item, i) => {
        const sep = i < items.length - 1 ? '<span class="bc-sep">›</span>' : '';
        const isLast = i === items.length - 1;
        return `<button class="bc-item ${isLast ? 'bc-active' : ''}" onclick="${item.action ? `(${item.action})()` : ''}" ${isLast ? 'disabled' : ''}>${item.icon}${item.label}</button>${sep}`;
    }).join('');
    
    // Cargar navegación guardada al iniciar
    if (!navegacionActual.categoria) cargarNavegacion();
}

function irAHome() {
    window.location.href = '../pages/home.html';
}

function irACategoria(cat) {
    window.location.href = `../pages/home.html?cat=${encodeURIComponent(cat)}`;
}

function irASubcategoria(subcat) {
    window.location.href = `../pages/home.html?subcat=${encodeURIComponent(subcat)}`;
}

function guardarNavegacion() {
    localStorage.setItem('navegacion_actual', JSON.stringify(navegacionActual));
}

function cargarNavegacion() {
    try {
        const saved = localStorage.getItem('navegacion_actual');
        if (saved) navegacionActual = JSON.parse(saved);
    } catch(e) {}
}

// ─────────────────────────────────────────────
// BARRA DE PROGRESO
// ─────────────────────────────────────────────
let progresoGlobal = {
    total: 0,
    completados: 0,
    porCategoria: {}
};

function initProgreso(containerId = 'progreso-container') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    cargarProgreso();
    renderProgreso();
}

function cargarProgreso() {
    try {
        const saved = localStorage.getItem('progreso_global');
        if (saved) progresoGlobal = JSON.parse(saved);
    } catch(e) {}
}

function guardarProgreso() {
    localStorage.setItem('progreso_global', JSON.stringify(progresoGlobal));
}

function marcarNivelCompletado(categoria, subcategoria, nivelIndex) {
    const key = `${categoria}_${subcategoria}_${nivelIndex}`;
    if (!progresoGlobal.completados) progresoGlobal.completados = new Set();
    if (!progresoGlobal.completados.has && progresoGlobal.completados.push) {
        progresoGlobal.completados.push(key);
    } else if (!progresoGlobal.completados.has(key)) {
        progresoGlobal.completados.add(key);
        guardarProgreso();
        renderProgreso();
        verificarLogros();
    }
}

function renderProgreso() {
    const container = document.getElementById('progreso-container');
    if (!container) return;
    
    const total = progresoGlobal.total || 27; // Total de niveles
    const completados = progresoGlobal.completados?.size || 0;
    const porcentaje = total > 0 ? Math.round((completados / total) * 100) : 0;
    
    container.innerHTML = `
        <div class="progreso-barra">
            <div class="progreso-info">
                <span class="progreso-texto">${completados}/${total} niveles (${porcentaje}%)</span>
                <span class="progreso-label">Progreso Global</span>
            </div>
            <div class="progreso-track">
                <div class="progreso-fill" style="width: ${porcentaje}%"></div>
            </div>
        </div>
    `;
}

// ─────────────────────────────────────────────
// MAPA DE LECCIONES
// ─────────────────────────────────────────────
let mapaAbierto = false;

function toggleMapa() {
    mapaAbierto = !mapaAbierto;
    const panel = document.getElementById('mapa-lecciones');
    if (panel) {
        panel.classList.toggle('mapa-visible', mapaAbierto);
    }
}

function initMapaLecciones() {
    const mapaBtn = document.getElementById('btn-mapa');
    if (mapaBtn) {
        mapaBtn.addEventListener('click', toggleMapa);
    }
    
    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mapaAbierto) toggleMapa();
    });
}

function renderMapaLecciones() {
    const container = document.getElementById('mapa-lista');
    if (!container) return;
    
    // Estructura del mapa
    const estructura = [
        {
            nombre: 'Programación',
            icon: '🐍',
            subcategorias: [
                { nombre: 'IDE e Intérpretes', niveles: 3, icono: '💻' },
                { nombre: 'Variables', niveles: 3, icono: '📦' },
                { nombre: 'Condicionales', niveles: 3, icono: '🔀' },
                { nombre: 'Funciones', niveles: 3, icono: '📤' },
                { nombre: 'Bucles', niveles: 3, icono: '🔄' }
            ]
        },
        {
            nombre: 'Explorador de Windows',
            icon: '📁',
            subcategorias: [
                { nombre: 'Navegar', niveles: 3, icono: '🧭' },
                { nombre: 'Abrir archivos', niveles: 3, icono: '📂' },
                { nombre: 'Organizar', niveles: 3, icono: '📋' }
            ]
        },
        {
            nombre: 'Atajos de Teclado',
            icon: '⌨️',
            subcategorias: [
                { nombre: 'Copiar y Pegar', niveles: 3, icono: '📋' },
                { nombre: 'Deshacer y Rehacer', niveles: 3, icono: '↩️' },
                { nombre: 'Atajos Windows', niveles: 3, icono: '🪟' }
            ]
        },
        {
            nombre: 'Trucos de Ventanas',
            icon: '🪟',
            subcategorias: [
                { nombre: 'Dividir pantalla', niveles: 3, icono: '📐' },
                { nombre: 'Arrastre de bordes', niveles: 3, icono: '↔️' },
                { nombre: 'Botones de control', niveles: 3, icono: '🎛️' }
            ]
        }
    ];
    
    container.innerHTML = estructura.map(cat => `
        <div class="mapa-categoria">
            <div class="mapa-cat-header">
                <span class="mapa-cat-icon">${cat.icon}</span>
                <span class="mapa-cat-nombre">${cat.nombre}</span>
            </div>
            <div class="mapa-subcats">
                ${cat.subcategorias.map(subcat => `
                    <div class="mapa-subcat" data-subcat="${subcat.nombre}">
                        <span class="mapa-subcat-icon">${subcat.icono}</span>
                        <span class="mapa-subcat-nombre">${subcat.nombre}</span>
                        <div class="mapa-niveles">
                            ${Array.from({length: subcat.niveles}, (_, i) => {
                                const nivelKey = `${cat.nombre}_${subcat.nombre}_${i}`;
                                const completado = progresoGlobal.completados?.has?.(nivelKey) || progresoGlobal.completados?.includes?.(nivelKey);
                                return `<span class="mapa-nivel ${completado ? 'completado' : ''}">${i + 1}</span>`;
                            }).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// ─────────────────────────────────────────────
// EXPORTAR
// ─────────────────────────────────────────────
window.Navigation = {
    init: () => { initBreadcrumbs(); initProgreso(); initMapaLecciones(); },
    setBreadcrumb,
    marcarNivelCompletado,
    toggleMapa,
    renderMapaLecciones,
    navegacionActual: () => navegacionActual,
    progresoGlobal: () => progresoGlobal
};

// Auto-init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Navigation.init());
} else {
    Navigation.init();
}