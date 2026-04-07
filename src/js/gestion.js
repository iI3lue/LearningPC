// gestion.js - Control de la tabla de niveles (Nueva estructura)

// Referencias DOM
const tablaNiveles = document.getElementById('tabla-niveles');
const btnVolver = document.getElementById('btn-volver');
const btnNuevo = document.getElementById('btn-nuevo');
const btnReportes = document.getElementById('btn-reportes');
const tituloTabla = document.getElementById('titulo-tabla') || null;

// Cargar niveles con nueva estructura
async function cargarNiveles() {
    try {
        const niveles = await window.api.getTodosLosNiveles();
        tablaNiveles.innerHTML = '';

        if (niveles.length === 0) {
            tablaNiveles.innerHTML = '<tr><td colspan="5">No hay niveles disponibles.</td></tr>';
            return;
        }

        niveles.forEach(nivel => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${nivel.nivel_ordinal || '-'}</td>
                <td>${nivel.nombre_categoria}</td>
                <td>${nivel.nombre_subcategoria}</td>
                <td>${nivel.titulo}</td>
                <td class="actions-cell">
                    <button class="btn-edit" onclick="editarNivel(${nivel.id_nivel})">Editar</button>
                    <button class="btn-delete" onclick="eliminarNivel(${nivel.id_nivel})">Eliminar</button>
                </td>
            `;
            tablaNiveles.appendChild(tr);
        });
    } catch (error) {
        console.error('Error cargando niveles:', error);
        tablaNiveles.innerHTML = '<tr><td colspan="5">Error al cargar niveles.</td></tr>';
    }
}

// Navegación
if (btnVolver) btnVolver.addEventListener('click', () => window.api.irA('home'));
if (btnReportes) btnReportes.addEventListener('click', () => window.api.irA('reportes'));
if (btnNuevo) btnNuevo.addEventListener('click', () => {
    sessionStorage.removeItem('editNivelId');
    window.api.irA('formulario');
});

// Funciones globales para botones dinámicos
window.editarNivel = (id) => {
    sessionStorage.setItem('editNivelId', id);
    window.api.irA('formulario');
};

window.eliminarNivel = async (id) => {
    if (confirm('¿Estás seguro de que deseas eliminar este nivel?')) {
        try {
            const result = await window.api.eliminarNivel(id);
            if (result.ok) {
                cargarNiveles();
            } else {
                alert('Error: ' + result.mensaje);
            }
        } catch (error) {
            alert('Error al eliminar nivel');
        }
    }
};

// Iniciar
cargarNiveles();
