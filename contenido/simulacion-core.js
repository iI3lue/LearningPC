/**
 * simulacion-core.js
 * Funciones compartidas para todas las simulaciones de Windows 11
 * Este archivo se carga en todas las simulaciones y contiene las funciones base
 */

// ═══════════════════════════════════════════════════════════
// VARIABLES GLOBALES COMPARTIDAS
// ═══════════════════════════════════════════════════════════

let contadorZIndex = 10;     // Para manejar z-index dinámicamente
let ventanaActiva = null;     //跟踪当前活动的窗口 (ventana activa)

// ═══════════════════════════════════════════════════════════
// RELOJ - Actualiza el reloj de la taskbar
// ═══════════════════════════════════════════════════════════

function initClock() {
    const updateClock = () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const day = now.getDate();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const year = now.getFullYear();
        
        const clockHora = document.getElementById('clock-hora');
        const clockFecha = document.getElementById('clock-fecha');
        
        if (clockHora) clockHora.textContent = hours + ':' + minutes;
        if (clockFecha) clockFecha.textContent = day + '/' + month + '/' + year;
    };
    
    updateClock();
    setInterval(updateClock, 1000);
}

// ═══════════════════════════════════════════════════════════
// VENTANAS - Funciones básicas
// ═══════════════════════════════════════════════════════════

/**
 * Abre una ventana y la trae al frente
 * @param {string} tipo - Identificador de la ventana (ej: 'navegador', 'biblioteca')
 */
function abrirVentana(tipo) {
    const ventana = document.getElementById('ventana-' + tipo);
    const taskbar = document.getElementById('taskbar-' + tipo);
    
    if (!ventana) return;
    
    ventana.classList.add('visible');
    if (taskbar) taskbar.classList.add('active');
    
    // Posición inicial por tipo
    if (tipo === 'navegador') {
        ventana.style.left = '80px';
        ventana.style.top = '60px';
    } else {
        ventana.style.left = '160px';
        ventana.style.top = '100px';
    }
    
    // Traer la ventana al frente
    bringToFront(ventana);
    
    // Dar foco a la ventana
    ventana.focus();
    
    // Callback opcional para actualizar estado
    if (typeof onVentanaAbierta === 'function') {
        onVentanaAbierta(tipo);
    }
}

/**
 * Trae una ventana al frente (z-index más alto)
 * @param {HTMLElement} ventana - Elemento de la ventana
 */
function bringToFront(ventana) {
    contadorZIndex++;
    ventana.style.zIndex = contadorZIndex;
    
    // Quitar estado activa de la anterior
    if (ventanaActiva && ventanaActiva !== ventana) {
        ventanaActiva.classList.remove('activa');
    }
    
    // Activar esta ventana
    ventana.classList.add('activa');
    ventanaActiva = ventana;
}

/**
 * Cierra una ventana
 * @param {string} tipo - Identificador de la ventana
 */
function cerrarVentana(tipo) {
    const ventana = document.getElementById('ventana-' + tipo);
    const taskbar = document.getElementById('taskbar-' + tipo);
    
    if (!ventana) return;
    
    ventana.classList.remove('visible', 'maximizada', 'izquierda', 'derecha', 'activa');
    if (taskbar) taskbar.classList.remove('active');
    
    // Si era la ventana activa, limpiar referencia
    if (ventanaActiva === ventana) {
        ventanaActiva = null;
    }
    
    // Callback opcional
    if (typeof onVentanaCerrada === 'function') {
        onVentanaCerrada(tipo);
    }
}

/**
 * Minimiza una ventana
 * @param {string} tipo - Identificador de la ventana
 */
function minimizarVentana(tipo) {
    const ventana = document.getElementById('ventana-' + tipo);
    if (ventana) {
        ventana.classList.remove('visible');
    }
}

/**
 * Alterna maximize/restore de una ventana
 * @param {string} tipo - Identificador de la ventana
 */
function maximizarVentana(tipo) {
    const ventana = document.getElementById('ventana-' + tipo);
    if (!ventana) return;
    
    if (ventana.classList.contains('maximizada')) {
        ventana.classList.remove('maximizada');
    } else {
        ventana.classList.remove('izquierda', 'derecha');
        ventana.classList.add('maximizada');
    }
}

// ═══════════════════════════════════════════════════════════
// FOCO DE VENTANAS - Sistema de focus como Windows
// ═══════════════════════════════════════════════════════════

/**
 * Configura los eventos de foco para todas las ventanas
 */
function initFocoVentanas() {
    const ventanas = document.querySelectorAll('.ventana');
    
    ventanas.forEach(ventana => {
        // Cuando hace clic en la ventana, traerla al frente
        ventana.addEventListener('mousedown', () => {
            bringToFront(ventana);
        });
        
        // También en focus
        ventana.addEventListener('focus', () => {
            bringToFront(ventana);
        });
        
        // Hacer que la ventana pueda recibir foco de teclado
        ventana.setAttribute('tabindex', '0');
    });
    
    // Permitir mover foco con Tab entre ventanas
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab' && !window.selectorActivo) {
            const ventanasVisibles = Array.from(document.querySelectorAll('.ventana.visible'));
            if (ventanasVisibles.length > 1) {
                e.preventDefault();
                
                // Encontrar la actual
                let indiceActual = -1;
                if (ventanaActiva) {
                    indiceActual = ventanasVisibles.indexOf(ventanaActiva);
                }
                
                // Moverse a la siguiente
                let siguienteIndice = indiceActual + 1;
                if (siguienteIndice >= ventanasVisibles.length) {
                    siguienteIndice = 0;
                }
                
                const siguiente = ventanasVisibles[siguienteIndice];
                siguiente.focus();
            }
        }
    });
}

// ═══════════════════════════════════════════════════════════
// DRAG DE VENTANAS - Mover ventanas arrastrando
// ═══════════════════════════════════════════════════════════

function initDragVentanas() {
    let ventanaArrastrada = null;
    let offsetX = 0;
    let offsetY = 0;
    
    document.querySelectorAll('.title-bar').forEach(titleBar => {
        titleBar.addEventListener('mousedown', (e) => {
            // No arrastrar si se hace clic en los botones de controls
            if (e.target.closest('.window-controls')) return;
            
            ventanaArrastrada = titleBar.parentElement;
            offsetX = e.clientX - ventanaArrastrada.offsetLeft;
            offsetY = e.clientY - ventanaArrastrada.offsetTop;
            
            document.addEventListener('mousemove', arrastrar);
            document.addEventListener('mouseup', soltar);
        });
    });
    
    function arrastrar(e) {
        if (ventanaArrastrada && !ventanaArrastrada.classList.contains('maximizada')) {
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            ventanaArrastrada.style.left = x + 'px';
            ventanaArrastrada.style.top = y + 'px';
        }
    }
    
    function soltar() {
        ventanaArrastrada = null;
        document.removeEventListener('mousemove', arrastrar);
        document.removeEventListener('mouseup', soltar);
    }
}

// ═══════════════════════════════════════════════════════════
// TOAST - Mensajes de feedback
// ═══════════════════════════════════════════════════════════

/**
 * Muestra un mensaje toast en pantalla
 * @param {string} mensaje - Texto a mostrar
 * @param {number} duracion - Duración en ms (default: 1500)
 */
function mostrarToast(mensaje, duracion = 1500) {
    let toast = document.getElementById('toast-feedback');
    
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-feedback';
        document.body.appendChild(toast);
    }
    
    toast.textContent = mensaje;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    
    clearTimeout(toast.hideTimeout);
    toast.hideTimeout = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
    }, duracion);
}

// ═══════════════════════════════════════════════════════════
// SELECTOR DE VENTANAS - Para dividir pantalla
// ═══════════════════════════════════════════════════════════

/**
 * Muestra el selector de zonas para dividir pantalla
 * @param {string} direccion - 'izquierda' o 'derecha'
 */
function mostrarSelectorVentanas(direccion) {
    if (window.selectorActivo) return;
    
    window.selectorActivo = true;
    
    const overlay = document.getElementById('selector-overlay');
    const mensaje = document.getElementById('selector-mensaje');
    
    if (mensaje) {
        mensaje.textContent = 'Elija dónde desea colocar esta ventana';
    }
    if (overlay) {
        overlay.classList.add('visible');
    }
}

/**
 * Cierra el selector de ventanas
 */
function cerrarSelector() {
    const overlay = document.getElementById('selector-overlay');
    if (overlay) {
        overlay.classList.remove('visible');
    }
    window.selectorActivo = false;
    window.ventanaArrastrando = null;
}

// ═══════════════════════════════════════════════════════════
// DRAG & DROP PARA SELECTOR
// ═══════════════════════════════════════════════════════════

/**
 * Inicializa las zonas de drop para el selector
 */
function initZonasDrag() {
    const zonaIzquierda = document.getElementById('zona-izquierda');
    const zonaDerecha = document.getElementById('zona-derecha');
    
    if (!zonaIzquierda || !zonaDerecha) {
        setTimeout(initZonasDrag, 100);
        return;
    }
    
    [zonaIzquierda, zonaDerecha].forEach(zona => {
        zona.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            this.classList.add('drag-over');
        });
        
        zona.addEventListener('dragleave', function(e) {
            this.classList.remove('drag-over');
        });
        
        zona.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            const tipoVentana = e.dataTransfer.getData('text/plain');
            const zonaElegida = this.id === 'zona-izquierda' ? 'izquierda' : 'derecha';
            
            if (typeof ejecutarDividir === 'function') {
                ejecutarDividir(tipoVentana, zonaElegida);
            }
        });
    });
}

/**
 * Inicia el arrastre de una miniatura de ventana
 * @param {Event} event - Evento de drag
 * @param {string} tipoVentana - Tipo de ventana
 */
function iniciarArrastre(event, tipoVentana) {
    window.ventanaArrastrando = tipoVentana;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', tipoVentana);
}

// ═══════════════════════════════════════════════════════════
// CONTROLES DE TECLADO
// ═══════════════════════════════════════════════════════════

/**
 * Inicializa los listener de teclado
 */
function initControlesTeclado() {
    document.addEventListener('keydown', manejarTeclaGeneral, true);
    
    // Agregar a las ventanas
    document.querySelectorAll('.ventana').forEach(ventana => {
        ventana.addEventListener('keydown', manejarTeclaGeneral, true);
        ventana.setAttribute('tabindex', '0');
    });
    
    // Agregar al desktop
    const desktop = document.querySelector('.desktop');
    if (desktop) {
        desktop.setAttribute('tabindex', '0');
        desktop.addEventListener('keydown', manejarTeclaGeneral, true);
        desktop.focus();
    }
}

/**
 * Manejador general de teclas - se personaliza por simulación
 * @param {KeyboardEvent} e - Evento de teclado
 */
function manejarTeclaGeneral(e) {
    // Por defecto, maneja Escape para cerrar selector
    if (e.key === 'Escape' && window.selectorActivo) {
        cerrarSelector();
        e.preventDefault();
        e.stopPropagation();
    }
    
    // Personalizar en cada simulación
    if (typeof manejarTeclaPersonalizada === 'function') {
        manejarTeclaPersonalizada(e);
    }
}

// ═══════════════════════════════════════════════════════════
// INICIALIZACIÓN AUTOMÁTICA
// ═══════════════════════════════════════════════════════════

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initClock();
        initFocoVentanas();
        initDragVentanas();
        initZonasDrag();
        initControlesTeclado();
    });
} else {
    // DOM ya cargado
    initClock();
    initFocoVentanas();
    initDragVentanas();
    initZonasDrag();
    initControlesTeclado();
}