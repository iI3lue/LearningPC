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
    if (!window.PrimerClicSettings) return;
    const autoEl = document.getElementById('toggle-auto-subcat');
    const promptEl = document.getElementById('toggle-show-prompt');
    if (autoEl) autoEl.classList.toggle('active', !!window.PrimerClicSettings.getAutoContinue());
    if (promptEl) promptEl.classList.toggle('active', !!window.PrimerClicSettings.getShowPrompt());
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
        document.documentElement.style.setProperty('--accent-solid', c.solid);
        document.documentElement.style.setProperty('--accent-pastel', c.light);
        document.documentElement.style.setProperty('--secondary-1', c.solid);
        document.documentElement.style.setProperty('--secondary-1-light', c.light);
        document.documentElement.style.setProperty('--secondary-1-dark', c.dark);

        // Actualizar toggles activos inmediatamente
        document.querySelectorAll('.toggle-switch.active').forEach(el => {
            el.style.background = c.solid;
        });
    }

    document.querySelectorAll('.color-opcion').forEach(el => {
        el.classList.toggle('seleccionado', el.dataset.color === color);
    });
}

function toggleEfectos() {
    const toggle = document.getElementById('toggle-efectos');
    if (!toggle) return;
    toggle.classList.toggle('active');
    const colorSec = localStorage.getItem('secondaryColor') || 'emerald';
    const colores = { emerald: '#10B981', violeta: '#8B5CF6', amber: '#F59E0B', rojo: '#EF4444', rosa: '#EC4899', cyan: '#06B6D4' };
    const solidColor = colores[colorSec] || '#10B981';
    toggle.style.background = toggle.classList.contains('active') ? solidColor : 'var(--text-secondary)';
    localStorage.setItem('efectos', toggle.classList.contains('active'));
}

function toggleSonido() {
    const toggle = document.getElementById('toggle-sonido');
    if (!toggle) return;
    toggle.classList.toggle('active');
    const colorSec = localStorage.getItem('secondaryColor') || 'emerald';
    const colores = { emerald: '#10B981', violeta: '#8B5CF6', amber: '#F59E0B', rojo: '#EF4444', rosa: '#EC4899', cyan: '#06B6D4' };
    const solidColor = colores[colorSec] || '#10B981';
    toggle.style.background = toggle.classList.contains('active') ? solidColor : 'var(--text-secondary)';
    localStorage.setItem('sonido', toggle.classList.contains('active'));
}

function reiniciarProgreso() {
    if (confirm('¿Estás seguro de que querés reiniciar todo el progreso? Esta acción no se puede deshacer.')) {
        // BUG-07: el progreso real está en SQLite. Limpiar localStorage no es suficiente.
        // Intentar llamar al IPC si está disponible
        const usuario = JSON.parse(sessionStorage.getItem('usuario') || 'null');
        if (usuario && window.api && window.api.resetProgreso) {
            window.api.resetProgreso(usuario.id_usuario)
                .then(() => {
                    localStorage.removeItem('progreso_global');
                    localStorage.removeItem('player_stats');
                    localStorage.removeItem('navegacion_actual');
                    if (window.showToast) window.showToast('Progreso reiniciado correctamente.', 'success');
                })
                .catch(() => {
                    if (window.showToast) window.showToast('Error al reiniciar el progreso en la base de datos.', 'error');
                });
        } else {
            // Fallback: solo localStorage (progreso de BD persiste hasta que admin lo limpie)
            localStorage.removeItem('progreso_global');
            localStorage.removeItem('player_stats');
            localStorage.removeItem('navegacion_actual');
            if (window.showToast) {
                window.showToast('Progreso local reiniciado. El progreso en BD requiere al administrador.', 'info');
            } else {
                alert('Progreso local reiniciado. Recargá la aplicación.');
            }
        }
    }
}

function toggleAutoSubcat() {
    const el = document.getElementById('toggle-auto-subcat');
    if (!el) return;
    el.classList.toggle('active');
    const colorSec = localStorage.getItem('secondaryColor') || 'emerald';
    const colores = { emerald: '#10B981', violeta: '#8B5CF6', amber: '#F59E0B', rojo: '#EF4444', rosa: '#EC4899', cyan: '#06B6D4' };
    const solidColor = colores[colorSec] || '#10B981';
    el.style.background = el.classList.contains('active') ? solidColor : 'var(--text-secondary)';
    
    if (window.PrimerClicSettings) {
        window.PrimerClicSettings.setAutoContinue(el.classList.contains('active'));
    }
}

function toggleShowPrompt() {
    const el = document.getElementById('toggle-show-prompt');
    if (!el) return;
    el.classList.toggle('active');
    const colorSec = localStorage.getItem('secondaryColor') || 'emerald';
    const colores = { emerald: '#10B981', violeta: '#8B5CF6', amber: '#F59E0B', rojo: '#EF4444', rosa: '#EC4899', cyan: '#06B6D4' };
    const solidColor = colores[colorSec] || '#10B981';
    el.style.background = el.classList.contains('active') ? solidColor : 'var(--text-secondary)';

    if (window.PrimerClicSettings) {
        window.PrimerClicSettings.setShowPrompt(el.classList.contains('active'));
    }
}

function aplicarCambios() {
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
