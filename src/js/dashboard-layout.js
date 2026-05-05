(function() {
    const usuario = JSON.parse(sessionStorage.getItem('usuario'));
    
    function initSidebar() {
        if (!usuario) {
            // No redirigir aquí para evitar loops si estamos en login, 
            // pero la mayoría de páginas dashboard ya tienen su propio check.
            return;
        }

        // Poblar información de perfil en el sidebar
        const profileName = document.getElementById('profile-name-sidebar');
        const profileAvatar = document.getElementById('profile-avatar-sidebar');
        
        if (profileName) profileName.textContent = usuario.usuario;
        if (profileAvatar) {
            const initial = usuario.usuario.charAt(0).toUpperCase();
            profileAvatar.innerHTML = `<span style="font-size: 16px; font-weight: 700;">${initial}</span>`;
        }
        
        // Mostrar Admin si corresponde (para el sidebar)
        const linkAdminSidebar = document.querySelector('.sidebar-item[data-page="gestion"]');
        if (linkAdminSidebar && usuario.usuario === 'admin') {
            linkAdminSidebar.style.display = 'flex';
        }

        // Manejar navegación del sidebar
        document.querySelectorAll('.sidebar-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.getAttribute('data-page');
                const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
                
                if (page && page !== currentPage) {
                    window.api.irA(page);
                }
            });
        });

        // Toggle Tema (desde el sidebar)
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                if (window.toggleTheme) {
                    window.toggleTheme();
                } else if (typeof toggleTheme === 'function') {
                    toggleTheme();
                }
            });
        }

        // Cerrar Sesión (desde el sidebar)
        const btnLogout = document.getElementById('btn-cerrar-sesion');
        if (btnLogout) {
            btnLogout.addEventListener('click', () => {
                sessionStorage.removeItem('usuario');
                localStorage.removeItem('usuario');
                window.api.irA('login');
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSidebar);
    } else {
        initSidebar();
    }
})();
