// home.js - Lógica de la pantalla principal (categorías y progreso)

// Recuperar el usuario guardado en sesión
const usuario = JSON.parse(sessionStorage.getItem('usuario'));

// Si no hay sesión activa, redirigir al login
if (!usuario) {
    window.api.irA('login');
}

// Referencias al DOM
const nombreUsuario = document.getElementById('nombre-usuario');
const progresoValor = document.getElementById('progreso-valor');
const listaCategorias = document.getElementById('lista-categorias');
const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');

// Mostrar nombre y progreso inicial del usuario
nombreUsuario.textContent = usuario.usuario;
progresoValor.textContent = `${usuario.progreso_total ?? 0}%`;

// Cargar y renderizar categorías
async function cargarCategorias() {
    const categorias = await window.api.getCategorias();

    listaCategorias.innerHTML = '';

    for (const cat of categorias) {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-categoria';
        tarjeta.dataset.idCategoria = cat.id_categoria;

        tarjeta.innerHTML = `
            <h3>${cat.nombre}</h3>
            <p>${cat.descripcion ?? ''}</p>
            <button class="btn-ver-niveles" data-id="${cat.id_categoria}">
                Ver niveles
            </button>
            <ul class="lista-niveles" id="niveles-${cat.id_categoria}" hidden></ul>
        `;

        listaCategorias.appendChild(tarjeta);
    }

    // Escuchar clics en "Ver niveles"
    document.querySelectorAll('.btn-ver-niveles').forEach((btn) => {
        btn.addEventListener('click', () => toggleNiveles(btn.dataset.id));
    });
}

// Mostrar/ocultar niveles de una categoría
async function toggleNiveles(idCategoria) {
    const lista = document.getElementById(`niveles-${idCategoria}`);

    if (!lista.hidden) {
        lista.hidden = true;
        return;
    }

    // Cargar niveles si aún no se han cargado
    if (lista.children.length === 0) {
        const niveles = await window.api.getNivelesPorCategoria(idCategoria);
        const progreso = await window.api.getProgreso(usuario.id_usuario);
        const completados = new Set(progreso.filter(p => p.completado).map(p => p.id_nivel));

        if (niveles.length === 0) {
            lista.innerHTML = '<li>No hay niveles disponibles aún.</li>';
        } else {
            niveles.forEach((nivel) => {
                const li = document.createElement('li');
                const estaCompletado = completados.has(nivel.id_nivel);

                li.className = estaCompletado ? 'nivel completado' : 'nivel';
                li.innerHTML = `
                    <strong>${nivel.orden}. ${nivel.titulo}</strong>
                    <span>${nivel.descripcion ?? ''}</span>
                    ${estaCompletado ? '<span class="badge">✓ Completado</span>' : ''}
                `;
                lista.appendChild(li);
            });
        }
    }

    lista.hidden = false;
}

// Pantalla completa
const btnFullScreen = document.getElementById('btn-fullscreen');
if (btnFullScreen) {
    btnFullScreen.addEventListener('click', () => {
        window.api.toggleFullScreen();
    });
}

// Cerrar sesión
btnCerrarSesion.addEventListener('click', () => {
    sessionStorage.removeItem('usuario');
    window.api.irA('login');
});

// Inicializar
cargarCategorias();
