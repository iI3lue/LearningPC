/**
 * theme-manager.js
 * Gestiona el cambio de tema (Light/Dark) de forma global y persistente.
 */

function initTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeButtonUI(theme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeButtonUI(newTheme);
}

function updateThemeButtonUI(theme) {
    // Ya no necesita actualizar texto porque los botones ahora son solo iconos
    // Los iconos SVG ya están definidos en los HTMLs correspondientes
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
} else {
    initTheme();
}

// Agregar listeners a los botones de tema
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('#btn-toggle-theme');
    buttons.forEach(btn => {
        // Remover listeners existentes para evitar duplicados
        btn.replaceWith(btn.cloneNode(false));
    });
    
    // Volver a buscar después de clonar
    document.querySelectorAll('#btn-toggle-theme').forEach(btn => {
        btn.addEventListener('click', toggleTheme);
    });
});

// También exportar para uso global
window.toggleTheme = toggleTheme;
window.initTheme = initTheme;