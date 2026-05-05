/**
 * spa-router.js
 * Router mínimo para el dashboard SPA de LearningPC.
 * Gestiona la activación de vistas sin recarga de página.
 *
 * Uso:
 *   window.SPA.goTo('reportes')   — navegar a una vista
 *   window.SPA.current()          — nombre de la vista activa
 */

(function () {
    // Mapa de vistas: id del elemento → config
    const VIEWS = {
        home: {
            title: 'LearningPC — Inicio',
            navId: 'nav-home',
            headerTitle: 'Panel Principal',
            init: () => { /* home.js se inicializa solo al cargar */ }
        },
        reportes: {
            title: 'LearningPC — Mis Logros',
            navId: 'nav-reportes',
            headerTitle: 'Mis Logros',
            init: () => window.Reportes?.init()
        },
        ajustes: {
            title: 'LearningPC — Ajustes',
            navId: 'nav-ajustes',
            headerTitle: 'Ajustes',
            init: () => window.Ajustes?.init()
        }
    };

    let _currentView = null;

    /**
     * Activa una vista y desactiva las demás.
     * @param {string} name — clave de VIEWS ('home' | 'reportes' | 'ajustes')
     */
    function goTo(name) {
        const config = VIEWS[name];
        if (!config) {
            console.warn(`[SPA] Vista desconocida: "${name}"`);
            return;
        }

        // Ocultar todas las vistas
        document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));

        // Mostrar la vista solicitada
        const viewEl = document.getElementById(`view-${name}`);
        if (viewEl) viewEl.classList.add('active');

        // Actualizar título de pestaña/ventana
        document.title = config.title;

        // Actualizar título del header
        const headerTitle = document.getElementById('header-title');
        if (headerTitle) headerTitle.textContent = config.headerTitle;

        // Actualizar estado activo del sidebar
        Object.keys(VIEWS).forEach(key => {
            const navBtn = document.getElementById(VIEWS[key].navId);
            if (navBtn) navBtn.classList.toggle('active', key === name);
        });

        _currentView = name;

        // Inicialización lazy del módulo de la vista
        try {
            config.init();
        } catch (err) {
            console.error(`[SPA] Error al inicializar vista "${name}":`, err);
        }

        // Actualizar hash para debugging / deep-link
        if (history.replaceState) {
            history.replaceState(null, '', `#${name}`);
        }
    }

    /** Retorna el nombre de la vista activa */
    function current() {
        return _currentView;
    }

    // Detectar hash inicial al cargar
    function _initFromHash() {
        const hash = window.location.hash.replace('#', '');
        const initialView = VIEWS[hash] ? hash : 'home';
        goTo(initialView);
    }

    // Exponer API pública
    window.SPA = { goTo, current };

    // Iniciar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', _initFromHash);
    } else {
        _initFromHash();
    }
})();
