// reporte-usuario.js - Lógica visual para el estudiante

const btnVolver = document.getElementById('btn-volver');
const userNameDisplay = document.getElementById('user-name');
const progresoTexto = document.getElementById('progreso-texto');
const nivelesSuperados = document.getElementById('niveles-superados');
const tiempoPractica = document.getElementById('tiempo-practica');

// Obtener usuario de la sesión
const usuario = JSON.parse(sessionStorage.getItem('usuario'));

async function inicializarReporte() {
    if (!usuario) {
        window.api.irA('login');
        return;
    }

    // Datos reales del usuario
    userNameDisplay.textContent = usuario.usuario;
    const progreso = Math.round(usuario.progreso_total || 0);
    progresoTexto.textContent = `${progreso}%`;

    // Datos simulados (como pidió el usuario, solo visual por ahora)
    // En el futuro, estos vendrían de una tabla de estadísticas
    nivelesSuperados.textContent = Math.floor(progreso / 10) || 1;

    // Simulación de tiempo: 30 min por cada 10% de progreso aprox.
    const horasSimuladas = (progreso * 0.1).toFixed(1);
    tiempoPractica.textContent = `${horasSimuladas} Horas`;

    console.log("Reporte visual cargado para:", usuario.usuario);
}

// Navegación (volvemos al dashboard/home)
btnVolver.addEventListener('click', () => {
    window.api.irA('home');
});

inicializarReporte();
