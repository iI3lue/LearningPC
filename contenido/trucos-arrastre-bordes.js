/**
 * tru cs-arrastre-bordes.js
 * Lógica de la simulación: Arrastrar ventanas a los bordes
 * Sigue el patrón de simulacion-core.js
 */

// Variables locales
let arrastrando = false;
let offsetX = 0;
let offsetY = 0;
let intentos = 0;
let exito = false;

// Elementos
const ventana = document.getElementById('ventana-documentos');
const guiaIzq = document.getElementById('guia-izq');
const guiaDer = document.getElementById('guia-der');
const feedbackPanel = document.getElementById('feedback-panel');
const feedbackTexto = document.getElementById('feedback-texto');

/**
 * Abre la ventana de documentos al hacer click en el botón
 */
function abrirVentanaDocumentos() {
    abrirVentana('documentos');
    ventana.style.left = '150px';
    ventana.style.top = '80px';
    mostrarFeedback('Arrastrá la ventana hacia un borde de la pantalla');
}

// Agregar al onclick del botón en el HTML
document.querySelector('.btn-abrir').onclick = abrirVentanaDocumentos;

/**
 * Inicia el arrastre cuando se hace click en la title-bar
 */
const titleBar = document.getElementById('title-bar-documentos');
if (titleBar) {
    titleBar.addEventListener('mousedown', function(e) {
        if (e.target.closest('.window-btn')) return;
        iniciarArrastre(e);
    });
}

function iniciarArrastre(e) {
    if (exito) return;
    e.preventDefault();
    
    const rect = ventana.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    
    arrastrando = true;
    ventana.classList.add('dragging');
    
    // Traer al frente
    ventanaActiva = 'documentos';
    ventana.classList.add('visible', 'activa');
    actualizarZIndex();
    
    document.addEventListener('mousemove', moverVentana);
    document.addEventListener('mouseup', soltarVentana);
}

function moverVentana(e) {
    if (!arrastrando || exito) return;
    e.preventDefault();
    
    let nuevoX = e.clientX - offsetX;
    let nuevoY = e.clientY - offsetY;
    
    // Limitar movimiento vertical
    nuevoY = Math.max(0, Math.min(nuevoY, window.innerHeight - 200));
    
    ventana.style.left = nuevoX + 'px';
    ventana.style.top = nuevoY + 'px';
    
    // Verificar si está cerca de los bordes para mostrar guías
    const anchoPantalla = window.innerWidth;
    
    if (nuevoX < 80) {
        guiaIzq.classList.add('visible');
        guiaDer.classList.remove('visible');
    } else if (nuevoX > anchoPantalla - 560) {
        guiaDer.classList.add('visible');
        guiaIzq.classList.remove('visible');
    } else {
        guiaIzq.classList.remove('visible');
        guiaDer.classList.remove('visible');
    }
}

function soltarVentana() {
    if (!arrastrando) return;
    
    arrastrando = false;
    ventana.classList.remove('dragging');
    
    document.removeEventListener('mousemove', moverVentana);
    document.removeEventListener('mouseup', soltarVentana);
    
    // Verificar posición
    const rect = ventana.getBoundingClientRect();
    const anchoPantalla = window.innerWidth;
    
    // Limpiar guías
    guiaIzq.classList.remove('visible');
    guiaDer.classList.remove('visible');
    
    if (rect.left < 40) {
        // División a la izquierda
        dividirIzquierda();
    } else if (rect.right > anchoPantalla - 40) {
        // División a la derecha
        dividirDerecha();
    } else {
        // No soltó en zona de división
        intentos++;
        if (intentos >= 3) {
            mostrarFeedback('💡 Hint: Arrastrá hasta el borde izquierdo o derecho', 'info');
        } else {
            mostrarFeedback('Intentalo de nuevo: arrastrá hacia un borde', 'info');
        }
    }
}

function dividirIzquierda() {
    exito = true;
    
    // Aplicar clase de división izquierda
    ventana.classList.remove('activa');
    ventana.classList.add('izquierda');
    
    // Ocultar guías y panel
    guiaIzq.classList.remove('visible');
    guiaDer.classList.remove('visible');
    
    // Mostrar éxito
    mostrarFeedback('¡Perfecto! Ventana dividida a la izquierda', 'exito');
    
    setTimeout(reiniciarSimulacion, 2500);
}

function dividirDerecha() {
    exito = true;
    
    // Aplicar clase de división derecha
    ventana.classList.remove('activa');
    ventana.classList.add('derecha');
    
    // Ocultar guías
    guiaIzq.classList.remove('visible');
    guiaDer.classList.remove('visible');
    
    // Mostrar éxito
    mostrarFeedback('¡Perfecto! Ventana dividida a la derecha', 'exito');
    
    setTimeout(reiniciarSimulacion, 2500);
}

function reiniciarSimulacion() {
    exito = false;
    intentos = 0;
    
    // Restaurar ventana
    ventana.classList.remove('izquierda', 'derecha', 'activa', 'dragging');
    ventana.style.left = '150px';
    ventana.style.top = '80px';
    ventana.style.width = '';
    ventana.style.height = '';
    
    // Ocultar feedback
    feedbackPanel.classList.remove('visible', 'exito');
    
    mostrarFeedback('Intentá de nuevo: arrastrá la ventana hacia un borde');
}

function mostrarFeedback(mensaje, tipo = 'info') {
    feedbackTexto.textContent = mensaje;
    feedbackPanel.classList.add('visible');
    
    if (tipo === 'exito') {
        feedbackPanel.classList.add('exito');
    } else {
        feedbackPanel.classList.remove('exito');
    }
    
    setTimeout(() => {
        feedbackPanel.classList.remove('visible');
    }, 2500);
}

// Funciones de ventana (compatibilidad con simulacion-core)
function minimizarVentana(tipo) {
    console.log('Minimizar:', tipo);
}

function maximizarVentana(tipo) {
    console.log('Maximizar:', tipo);
}

function cerrarVentana(tipo) {
    if (tipo === 'documentos') {
        reiniciarSimulacion();
        abrirVentana('documentos');
    }
}

// Inicializar al cargar
console.log('[Arrastre] Simulación cargada');