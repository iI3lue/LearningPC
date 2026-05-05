/**
 * ajustes.js
 * Lógica de la vista de Ajustes del dashboard SPA.
 * Se inicializa lazy: solo cuando el router activa la vista por primera vez.
 */

let _ajustesInitialized = false;

function initAjustes() {
    if (_ajustesInitialized) {
        // Re-entrada: solo refrescar valores visuales
        cargarAjustes();
        _sincronizarUserSettings();
        return;
    }
    _ajustesInitialized = true;
    cargarAjustes();
    _sincronizarUserSettings();
}

function cargarAjustes() {
    // Tema
    const tema = localStorage.getItem('theme') || 'light';
    const toggleTemaEl = document.getElementById('toggle-tema');
    if (toggleTemaEl) toggleTemaEl.classList.toggle('active', tema === 'dark');

    // Color secundario
    const colorSec = localStorage.getItem('secondaryColor') || 'emerald';
    document.querySelectorAll('.color-opcion').forEach(el => {
        el.classList.toggle('seleccionado', el.dataset.color === colorSec);
    });

    // Efectos
    const efectos = localStorage.getItem('efectos') !== 'false';
    const toggleEfectosEl = document.getElementById('toggle-efectos');
    if (toggleEfectosEl) toggleEfectosEl.classList.toggle('active', efectos);

    // Sonido
    const sonido = localStorage.getItem('sonido') !== 'false';
    const toggleSonidoEl = document.getElementById('toggle-sonido');
    if (toggleSonidoEl) toggleSonidoEl.classList.toggle('active', sonido);
}

function _sincronizarUserSettings() {
    if (!window.LearningPCSettings) return;
    const autoEl = document.getElementById('toggle-auto-subcat');
    const promptEl = document.getElementById('toggle-show-prompt');
    if (autoEl) autoEl.classList.toggle('active', !!window.LearningPCSettings.getAutoContinue());
    if (promptEl) promptEl.classList.toggle('active', !!window.LearningPCSettings.getShowPrompt());
}

function toggleTema() {
    const toggle = document.getElementById('toggle-tema');
    if (!toggle) return;
    toggle.classList.toggle('active');
    const nuevoTema = toggle.classList.contains('active') ? 'dark' : 'light';
    localStorage.setItem('theme', nuevoTema);
    document.documentElement.setAttribute('data-theme', nuevoTema);
}

function cambiarColorSecundario(color) {
    localStorage.setItem('secondaryColor', color);

    const colores = {
        emerald: { solid: '#10B981', light: '#D1FAE5', dark: '#065F46' },
        violeta: { solid: '#8B5CF6', light: '#EDE9FE', dark: '#4C1D95' },
        amber:   { solid: '#F59E0B', light: '#FEF3C7', dark: '#92400E' },
        rojo:    { solid: '#EF4444', light: '#FEE2E2', dark: '#991B1B' },
        rosa:    { solid: '#EC4899', light: '#FCE7F3', dark: '#9D174D' },
        cyan:    { solid: '#06B6D4', light: '#CFFAFE', dark: '#155E75' }
    };

    const c = colores[color];
    if (c) {
        document.documentElement.style.setProperty('--secondary-1', c.solid);
        document.documentElement.style.setProperty('--secondary-1-light', c.light);
        document.documentElement.style.setProperty('--secondary-1-dark', c.dark);
    }

    document.querySelectorAll('.color-opcion').forEach(el => {
        el.classList.toggle('seleccionado', el.dataset.color === color);
    });
}

function toggleEfectos() {
    const toggle = document.getElementById('toggle-efectos');
    if (!toggle) return;
    toggle.classList.toggle('active');
    localStorage.setItem('efectos', toggle.classList.contains('active'));
}

function toggleSonido() {
    const toggle = document.getElementById('toggle-sonido');
    if (!toggle) return;
    toggle.classList.toggle('active');
    localStorage.setItem('sonido', toggle.classList.contains('active'));
}

function reiniciarProgreso() {
    if (confirm('¿Estás seguro de que quieres reiniciar todo el progreso? Esta acción no se puede deshacer.')) {
        localStorage.removeItem('progreso_global');
        localStorage.removeItem('player_stats');
        localStorage.removeItem('navegacion_actual');
        alert('Progreso reiniciado. Recargá la aplicación para comenzar desde cero.');
    }
}

function toggleAutoSubcat() {
    const el = document.getElementById('toggle-auto-subcat');
    if (!el) return;
    el.classList.toggle('active');
    if (window.LearningPCSettings) {
        window.LearningPCSettings.setAutoContinue(el.classList.contains('active'));
    }
}

function toggleShowPrompt() {
    const el = document.getElementById('toggle-show-prompt');
    if (!el) return;
    el.classList.toggle('active');
    if (window.LearningPCSettings) {
        window.LearningPCSettings.setShowPrompt(el.classList.contains('active'));
    }
}

function aplicarCambios() {
    const toggleTemaEl = document.getElementById('toggle-tema');
    const toggleEfectosEl = document.getElementById('toggle-efectos');
    const toggleSonidoEl = document.getElementById('toggle-sonido');

    if (toggleTemaEl) localStorage.setItem('theme', toggleTemaEl.classList.contains('active') ? 'dark' : 'light');
    if (toggleEfectosEl) localStorage.setItem('efectos', toggleEfectosEl.classList.contains('active'));
    if (toggleSonidoEl) localStorage.setItem('sonido', toggleSonidoEl.classList.contains('active'));

    // Notificar sin reload (estamos en SPA)
    const toast = window.showToast || ((msg) => alert(msg));
    toast('Cambios aplicados correctamente');
}

// Exponer para uso desde el router y onclick inline
window.Ajustes = { init: initAjustes };

// Exponer funciones globales usadas en onclick del HTML
window.toggleTema = toggleTema;
window.cambiarColorSecundario = cambiarColorSecundario;
window.toggleEfectos = toggleEfectos;
window.toggleSonido = toggleSonido;
window.reiniciarProgreso = reiniciarProgreso;
window.toggleAutoSubcat = toggleAutoSubcat;
window.toggleShowPrompt = toggleShowPrompt;
window.aplicarCambios = aplicarCambios;
