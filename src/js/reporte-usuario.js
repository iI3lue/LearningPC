// reporte-usuario.js - Lógica visual para el estudiante

const btnVolver = document.getElementById('btn-volver');
const userNameDisplay = document.getElementById('user-name');
const progresoTexto = document.getElementById('progreso-texto');
const nivelesSuperados = document.getElementById('niveles-superados');
const tiempoPractica = document.getElementById('tiempo-practica');
const listaHabilidades = document.getElementById('lista-habilidades');

// Obtener usuario de la sesión
const usuario = JSON.parse(sessionStorage.getItem('usuario'));

async function inicializarReporte() {
    if (!usuario) {
        window.api.irA('login');
        return;
    }

    userNameDisplay.textContent = usuario.usuario;

    try {
        // Obtener progreso real del usuario desde la BD
        const progresoData = await window.api.getProgreso(usuario.id_usuario);
        const totalNiveles = progresoData.total || 0;
        const completados = progresoData.completados || 0;
        const progreso = totalNiveles > 0 ? Math.round((completados / totalNiveles) * 100) : 0;

        progresoTexto.textContent = `${progreso}%`;
        nivelesSuperados.textContent = `${completados}`;

        // Tiempo estimado basado en niveles completados (cada nivel ~5 min promedio)
        const minutosEstimados = completados * 5;
        if (minutosEstimados >= 60) {
            tiempoPractica.textContent = `${(minutosEstimados / 60).toFixed(1)} Horas`;
        } else {
            tiempoPractica.textContent = `${minutosEstimados} Min`;
        }

        // Mostrar categorías completadas como habilidades
        if (progresoData.categorias && progresoData.categorias.length > 0) {
            listaHabilidades.innerHTML = progresoData.categorias
                .filter(cat => cat.completados > 0)
                .map(cat => `
                    <div class="item-diploma">
                        <div class="diploma-badge">🎯</div>
                        <div class="diploma-info">
                            <h4>${cat.nombre.toUpperCase()}</h4>
                            <p>${cat.completados}/${cat.total} NIVELES COMPLETADOS</p>
                        </div>
                    </div>
                `).join('');

            if (listaHabilidades.innerHTML.trim() === '') {
                listaHabilidades.innerHTML = `
                    <div class="item-diploma">
                        <div class="diploma-badge">🚀</div>
                        <div class="diploma-info">
                            <h4>AÚN NO HAY HABILIDADES</h4>
                            <p>COMPLETA NIVELES PARA DESBLOQUEAR HABILIDADES</p>
                        </div>
                    </div>
                `;
            }
        } else {
            listaHabilidades.innerHTML = `
                <div class="item-diploma">
                    <div class="diploma-badge">🚀</div>
                    <div class="diploma-info">
                        <h4>AÚN NO HAY HABILIDADES</h4>
                        <p>COMPLETA NIVELES PARA DESBLOQUEAR HABILIDADES</p>
                    </div>
                </div>
            `;
        }
    } catch (err) {
        console.error('Error cargando reporte:', err);
        progresoTexto.textContent = '0%';
        nivelesSuperados.textContent = '0';
        tiempoPractica.textContent = '0 Min';
    }
}

// Navegación (volvemos al dashboard/home)
btnVolver.addEventListener('click', () => {
    window.api.irA('home');
});

inicializarReporte();
