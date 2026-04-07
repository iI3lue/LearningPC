// formulario.js - Lógica para crear/editar niveles (Nueva estructura)

// Referencias DOM
const formNivel = document.getElementById('form-nivel');
const selectCategoria = document.getElementById('id_categoria');
const selectSubcategoria = document.getElementById('id_subcategoria');
const btnCancelar = document.getElementById('btn-cancelar');
const formTitle = document.getElementById('form-title');

// Cargar categorías
async function cargarCategorias() {
    const categorias = await window.api.getCategorias();
    selectCategoria.innerHTML = '<option value="">Selecciona una categoría</option>';
    categorias.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id_categoria;
        option.textContent = cat.nombre;
        selectCategoria.appendChild(option);
    });
}

// Cargar subcategorías según categoría seleccionada
async function cargarSubcategorias(idCategoria) {
    if (!idCategoria) {
        selectSubcategoria.innerHTML = '<option value="">Selecciona una subcategoría</option>';
        return;
    }
    
    const subcategorias = await window.api.getSubcategoriasPorCategoria(idCategoria);
    selectSubcategoria.innerHTML = '<option value="">Selecciona una subcategoría</option>';
    subcategorias.forEach(sub => {
        const option = document.createElement('option');
        option.value = sub.id_subcategoria;
        option.textContent = sub.nombre;
        selectSubcategoria.appendChild(option);
    });
}

// Listener para cambio de categoría
selectCategoria.addEventListener('change', (e) => {
    cargarSubcategorias(e.target.value);
});

// Cargar datos si es edición
async function checkEdicion() {
    await cargarCategorias();
    const idNivel = sessionStorage.getItem('editNivelId');

    if (idNivel) {
        formTitle.textContent = 'EDITAR NIVEL #' + idNivel;

        // Obtener nivel específico
        const niveles = await window.api.getTodosLosNiveles();
        const nivel = niveles.find(n => n.id_nivel == idNivel);

        if (nivel) {
            document.getElementById('id_nivel').value = nivel.id_nivel;
            document.getElementById('titulo').value = nivel.titulo;
            document.getElementById('id_categoria').value = nivel.id_categoria;
            
            // Cargar subcategorías de la categoría del nivel
            await cargarSubcategorias(nivel.id_categoria);
            document.getElementById('id_subcategoria').value = nivel.id_subcategoria;
            
            document.getElementById('descripcion').value = nivel.descripcion || '';
            document.getElementById('ruta_archivo').value = nivel.ruta_archivo || '';
            document.getElementById('nivel_ordinal').value = nivel.nivel_ordinal || 1;
            document.getElementById('orden').value = nivel.orden || 0;
            document.getElementById('tiempo_estimado_min').value = nivel.tiempo_estimado_min || '';
        }
    }
}

// Guardar nivel
formNivel.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validar que se seleccione subcategoría
    const idSubcategoria = parseInt(document.getElementById('id_subcategoria').value);
    if (!idSubcategoria) {
        alert('Por favor selecciona una subcategoría.');
        return;
    }

    const datos = {
        id_nivel: document.getElementById('id_nivel').value || null,
        titulo: document.getElementById('titulo').value.trim(),
        id_subcategoria: idSubcategoria,
        descripcion: document.getElementById('descripcion').value.trim(),
        ruta_archivo: document.getElementById('ruta_archivo').value.trim(),
        nivel_ordinal: parseInt(document.getElementById('nivel_ordinal').value) || 1,
        orden: parseInt(document.getElementById('orden').value) || 0,
        tiempo_estimado_min: parseInt(document.getElementById('tiempo_estimado_min').value) || null
    };

    try {
        const resultado = await window.api.guardarNivel(datos);

        if (resultado.ok) {
            alert('Contenido guardado exitosamente.');
            window.api.irA('gestion');
        } else {
            alert('Error al guardar: ' + resultado.mensaje);
        }
    } catch (error) {
        alert('Error al guardar: ' + error.message);
    }
});

if (btnCancelar) {
    btnCancelar.addEventListener('click', () => window.api.irA('gestion'));
}

// Iniciar
checkEdicion();