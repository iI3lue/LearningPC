/**
 * reporte-usuario.js
 * Lógica de la vista de Reportes del dashboard SPA.
 * Se inicializa lazy: solo cuando el router activa la vista por primera vez.
 */

let _reportesInitialized = false;

async function initReportes() {
    if (_reportesInitialized) return;
    _reportesInitialized = true;
    await inicializarReporte();
}

async function inicializarReporte() {
    const usuario = JSON.parse(sessionStorage.getItem('usuario'));
    if (!usuario) {
        window.api.irA('login');
        return;
    }

    const userNameDisplay = document.getElementById('user-name');
    const userNameSidebar = document.getElementById('profile-name');
    const profileBadge = document.getElementById('profile-badge');
    const nivelesCompletadosSidebar = document.getElementById('niveles-completados');
    const streakCountSidebar = document.getElementById('streak-count');
    const tiempoPractica = document.getElementById('tiempo-practica');
    const listaHabilidades = document.getElementById('lista-habilidades');

    if (userNameDisplay) userNameDisplay.textContent = usuario.usuario;
    if (userNameSidebar) userNameSidebar.textContent = usuario.usuario;
    if (profileBadge) profileBadge.textContent = 'Principiante';

    try {
        const progresoData = await window.api.getProgreso(usuario.id_usuario);
        const totalNiveles = progresoData.total || 0;
        const completados = progresoData.completados || 0;
        const progreso = totalNiveles > 0 ? Math.round((completados / totalNiveles) * 100) : 0;

        if (nivelesCompletadosSidebar) nivelesCompletadosSidebar.textContent = completados;

        const streak = usuario.racha || 0;
        if (streakCountSidebar) streakCountSidebar.textContent = streak <= 0 ? '0 días' : `${streak} días`;

        const minutosEstimados = completados * 5;
        if (tiempoPractica) {
            tiempoPractica.textContent = minutosEstimados >= 60
                ? `${(minutosEstimados / 60).toFixed(1)} Horas`
                : `${minutosEstimados} Min`;
        }

        // Actualizar niveles superados (nuevo elemento en SPA)
        const nivelesSuperados = document.getElementById('niveles-superados');
        if (nivelesSuperados) nivelesSuperados.textContent = completados;

        // Progreso total
        const progresoTexto = document.getElementById('progreso-texto');
        if (progresoTexto) progresoTexto.textContent = `${progreso}%`;

        if (listaHabilidades) {
            if (progresoData.categorias && progresoData.categorias.length > 0) {
                const itemsConProgreso = progresoData.categorias.filter(cat => cat.completados > 0);
                listaHabilidades.innerHTML = itemsConProgreso.length > 0
                    ? itemsConProgreso.map(cat => `
                        <div class="item-diploma">
                            <div class="diploma-badge">🎯</div>
                            <div class="diploma-info">
                                <h4>${cat.nombre.toUpperCase()}</h4>
                                <p>${cat.completados}/${cat.total} NIVELES COMPLETADOS</p>
                            </div>
                        </div>
                    `).join('')
                    : _emptyHabilidades();
            } else {
                listaHabilidades.innerHTML = _emptyHabilidades();
            }
        }
    } catch (err) {
        console.error('Error cargando reporte:', err);
    }
}

function _emptyHabilidades() {
    return `
        <div class="item-diploma">
            <div class="diploma-badge">🚀</div>
            <div class="diploma-info">
                <h4>AÚN NO HAY HABILIDADES</h4>
                <p>COMPLETÁ NIVELES PARA DESBLOQUEAR HABILIDADES</p>
            </div>
        </div>
    `;
}

// Exponer para el router
window.Reportes = { init: initReportes };
