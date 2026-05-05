/**
 * theme-manager.js
 * Gestiona el cambio de tema (Light/Dark) y color secundario de forma global y persistente.
 */

function initTheme() {
    iniciar();
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeButtonUI(newTheme);
}

function toggleSidebar() {
    const dashboard = document.querySelector('.dashboard');
    if (!dashboard) return;

    // En mobile el sidebar es off-canvas, no usar slim
    if (window.innerWidth <= 768) return;

    const isSlim = dashboard.classList.toggle('slim-sidebar');
    localStorage.setItem('sidebar-slim', isSlim);

    // No tocar --sidebar-width en tablet (ya lo maneja el media query)
    if (window.innerWidth > 1024) {
        if (isSlim) {
            document.documentElement.style.setProperty('--sidebar-width', '72px');
        } else {
            const savedWidth = localStorage.getItem('sidebar-width') || '280';
            document.documentElement.style.setProperty('--sidebar-width', savedWidth + 'px');
        }
    }
}



function logout() {
    sessionStorage.removeItem('usuario');
    localStorage.removeItem('usuario');
    if (window.api && window.api.irA) {
        window.api.irA('login');
    } else {
        window.location.href = 'login.html';
    }
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
        document.documentElement.style.setProperty('--accent-solid', c.solid);
        document.documentElement.style.setProperty('--accent-pastel', c.light);
        document.documentElement.style.setProperty('--secondary-1-solid', c.solid);
        document.documentElement.style.setProperty('--secondary-1-light', c.light);
        
        document.querySelectorAll('.toggle-switch.active').forEach(el => {
            el.style.background = c.solid;
        });
        
        document.querySelectorAll('.progress-fill, .progreso-fill').forEach(el => {
            el.style.background = `linear-gradient(90deg, ${c.solid}, ${c.light})`;
        });
    }
}

function updateThemeButtonUI(theme) {
    const btn = document.getElementById('btn-toggle-theme') || document.getElementById('theme-toggle');
    const icono = document.getElementById('icono-tema') || (btn ? btn.querySelector('i, span') : null);
    
    const colorSec = localStorage.getItem('secondaryColor') || 'emerald';
    const colores = {
        emerald: '#10B981', violeta: '#8B5CF6', amber: '#F59E0B',
        rojo: '#EF4444', rosa: '#EC4899', cyan: '#06B6D4'
    };
    const color = colores[colorSec] || '#10B981';

    if (btn && icono) {
        if (btn.classList.contains('header-btn')) {
            btn.style.background = color;
            btn.style.border = 'none';
        }

        if (icono.tagName === 'I') {
            icono.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        } else {
            icono.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }
}

function iniciar() {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    cargarColorSecundario();
    updateThemeButtonUI(theme);

    // Restaurar estado del sidebar
    const isSlim = localStorage.getItem('sidebar-slim') === 'true';
    const savedWidth = localStorage.getItem('sidebar-width') || '280';
    const dashboard = document.querySelector('.dashboard');

    if (isSlim) {
        dashboard?.classList.add('slim-sidebar');
        document.documentElement.style.setProperty('--sidebar-width', '72px');
    } else {
        document.documentElement.style.setProperty('--sidebar-width', savedWidth + 'px');
    }
    
    initSidebarResizer();
    
    // Listeners para botones comunes
    const btnTheme = document.getElementById('btn-toggle-theme') || document.getElementById('theme-toggle');
    if (btnTheme) btnTheme.addEventListener('click', toggleTheme);

    const btnLogout = document.getElementById('btn-cerrar-sesion');
    if (btnLogout) btnLogout.addEventListener('click', logout);

    const btnToggleSidebar = document.getElementById('toggle-sidebar');
    if (btnToggleSidebar) btnToggleSidebar.addEventListener('click', toggleSidebar);

    // Fullscreen support
    const btnFullscreen = document.getElementById('btn-fullscreen');
    if (btnFullscreen) {
        btnFullscreen.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            } else {
                if (document.exitFullscreen) document.exitFullscreen();
            }
        });
    }

    // ── Mobile sidebar con overlay ──────────────────────────
    function openMobileSidebar() {
        const dash = document.querySelector('.dashboard');
        if (!dash) return;
        dash.classList.add('mobile-sidebar-open');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileSidebar() {
        const dash = document.querySelector('.dashboard');
        if (!dash) return;
        dash.classList.remove('mobile-sidebar-open');
        document.body.style.overflow = '';
    }

    // Inyectar overlay si no existe
    const dashNode = document.querySelector('.dashboard');
    if (dashNode && !dashNode.querySelector('.sidebar-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        overlay.addEventListener('click', closeMobileSidebar);
        dashNode.appendChild(overlay);
    }

    // Botón hamburguesa
    const btnMobileMenu = document.getElementById('mobile-menu-toggle');
    if (btnMobileMenu) {
        btnMobileMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            openMobileSidebar();
        });
    }

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMobileSidebar();
    });
}

function initSidebarResizer() {
    const resizer = document.querySelector('.sidebar-resizer');
    const dashboard = document.querySelector('.dashboard');
    if (!resizer || !dashboard) return;

    let isResizing = false;

    resizer.addEventListener('mousedown', (e) => {
        isResizing = true;
        dashboard.classList.add('resizing');
        document.body.style.cursor = 'col-resize';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isResizing) return;

        let newWidth = e.clientX;
        
        // Límites
        if (newWidth < 72) newWidth = 72;
        if (newWidth > 450) newWidth = 450;

        document.documentElement.style.setProperty('--sidebar-width', newWidth + 'px');
        
        // Si es muy pequeño, activamos modo slim visualmente
        if (newWidth <= 100) {
            dashboard.classList.add('slim-sidebar');
            localStorage.setItem('sidebar-slim', 'true');
        } else {
            dashboard.classList.remove('slim-sidebar');
            localStorage.setItem('sidebar-slim', 'false');
        }
    });

    window.addEventListener('mouseup', () => {
        if (!isResizing) return;
        isResizing = false;
        dashboard.classList.remove('resizing');
        document.body.style.cursor = 'default';
        
        // Guardar ancho actual (solo si no es slim)
        const currentWidth = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width'));
        if (currentWidth > 100) {
            localStorage.setItem('sidebar-width', currentWidth);
        }
    });
}

document.addEventListener('DOMContentLoaded', iniciar);

window.toggleTheme = toggleTheme;
window.logout = logout;
window.initTheme = initTheme;