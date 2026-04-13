// Actualizar la ruta del nivel 2 de Pantallas divididas
const idNivel = 2; // El segundo nivel de la subcategoría 1
const nuevaRuta = 'trucos-arrastre-bordes.html';

async function actualizarRuta() {
    try {
        const resultado = await window.api.actualizarRutaNivel(idNivel, nuevaRuta);
        console.log('[OK] Ruta actualizada:', resultado);
        alert('¡Nivel actualizado!');
    } catch (err) {
        console.error('[ERROR]', err);
    }
}

// Ejecutar automáticamente
actualizarRuta();