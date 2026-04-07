// reportes-admin.js - Lógica para mostrar estadísticas generales

const btnVolver = document.getElementById('btn-volver');
const totalUsuarios = document.getElementById('total-usuarios');
const totalNiveles = document.getElementById('total-niveles');
const progresoPromedio = document.getElementById('progreso-promedio');
const tablaRecientes = document.getElementById('tabla-usuarios-recientes');

async function cargarReportes() {
    const stats = await window.api.getReporteGeneral();

    // Actualizar tarjetas
    totalUsuarios.textContent = stats.totalUsuarios;
    totalNiveles.textContent = stats.totalNiveles;
    progresoPromedio.textContent = Math.round(stats.progresoPromedio) + '%';

    // Llenar tabla recientes
    stats.usuariosRecientes.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${user.usuario}</td>
            <td>${Math.round(user.progreso_total)}%</td>
        `;
        tablaRecientes.appendChild(tr);
    });
}

btnVolver.addEventListener('click', () => window.api.irA('gestion'));

cargarReportes();
