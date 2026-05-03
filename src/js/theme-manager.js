/**
 * theme-manager.js
 * Gestiona el cambio de tema (Light/Dark) y color secundario de forma global y persistente.
 */

function initTheme() {
    // Delegado a iniciar() que se auto-ejecuta al cargar
    iniciar();
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeButtonUI(newTheme);
}

function cargarColorSecundario() {
    const colorSec = localStorage.getItem('secondaryColor') || 'emerald';
    
    const colores = {
        emerald: { solid: '#10B981', light: '#D1FAE5', dark: '#065F46' },
        violeta: { solid: '#8B5CF6', light: '#EDE9FE', dark: '#4C1D95' },
        amber: { solid: '#F59E0B', light: '#FEF3C7', dark: '#92400E' },
        rojo: { solid: '#EF4444', light: '#FEE2E2', dark: '#991B1B' },
        rosa: { solid: '#EC4899', light: '#FCE7F3', dark: '#9D174D' },
        cyan: { solid: '#06B6D4', light: '#CFFAFE', dark: '#155E75' }
    };
    
    const c = colores[colorSec];
    if (c) {
        // Aplicar a todos los elementos de interfaz
        document.documentElement.style.setProperty('--accent-solid', c.solid);
        document.documentElement.style.setProperty('--accent-pastel', c.light);
        document.documentElement.style.setProperty('--secondary-1-solid', c.solid);
        document.documentElement.style.setProperty('--secondary-1-light', c.light);
        
        // Actualizar toggles y progress bars
        document.querySelectorAll('.toggle-switch.active').forEach(el => {
            el.style.background = c.solid;
        });
        
        document.querySelectorAll('.progress-fill, .progreso-fill').forEach(el => {
            el.style.background = `linear-gradient(90deg, ${c.solid}, ${c.light})`;
        });
    }
}

function updateThemeButtonUI(theme) {
    const btn = document.getElementById('btn-toggle-theme');
    const icono = document.getElementById('icono-tema');
    
    if (btn && icono) {
        // Obtener color secundario guardado
        const colorSec = localStorage.getItem('secondaryColor') || 'emerald';
        const colores = {
            emerald: '#10B981', violeta: '#8B5CF6', amber: '#F59E0B',
            rojo: '#EF4444', rosa: '#EC4899', cyan: '#06B6D4'
        };
        const color = colores[colorSec] || '#10B981';
        
        // Aplicar color secundario al botón
        btn.style.background = color;
        btn.style.border = 'none';
        
        // Mostrar icono según tema (emoji simple)
        icono.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}

// Inicializar cuando el DOM esté listo
function iniciar() {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    cargarColorSecundario();
    updateThemeButtonUI(theme);
    
    // Agregar listener al botón
    const btn = document.getElementById('btn-toggle-theme');
    if (btn) {
        btn.addEventListener('click', toggleTheme);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
} else {
    iniciar();
}

// También exportar para uso global
window.toggleTheme = toggleTheme;
window.initTheme = initTheme;