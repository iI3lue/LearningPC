// registro.js - Lógica de la pantalla de registro
const formRegistro = document.getElementById('form-registro');
const errorRegistro = document.getElementById('error-registro');
const exitoRegistro = document.getElementById('exito-registro');
const linkLogin = document.getElementById('link-login');

// Función para mostrar toast
function showToast(message, type = 'info') {
    const toast = document.getElementById('registro-toast');
    const toastMessage = document.getElementById('toast-message');
    if (!toast || !toastMessage) return;
    
    toast.classList.remove('success', 'error', 'info');
    toast.classList.add(type);
    toastMessage.textContent = message;
    toast.classList.add('visible');
    
    setTimeout(() => {
        toast.classList.remove('visible');
    }, 3000);
}

// Enviar formulario de registro
formRegistro.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!window.api) {
        showToast('Error: API no disponible. Por favor, reinicia la aplicación.', 'error');
        return;
    }

    errorRegistro.hidden = true;
    exitoRegistro.hidden = true;

    const usuario = document.getElementById('usuario').value.trim();
    const contraseña = document.getElementById('contraseña').value;
    const contraseñaConfirm = document.getElementById('contraseña-confirm').value;
    const edad = parseInt(document.getElementById('edad').value) || null;

    // Validaciones del lado del cliente
    if (usuario.length < 3) {
        showToast('El usuario debe tener al menos 3 caracteres.', 'error');
        return;
    }

    if (contraseña.length < 4) {
        showToast('La contraseña debe tener al menos 4 caracteres.', 'error');
        return;
    }

    if (contraseña !== contraseñaConfirm) {
        showToast('Las contraseñas no coinciden.', 'error');
        return;
    }

    const datos = {
        usuario: usuario,
        contraseña: contraseña,
        edad: edad,
    };

    const resultado = await window.api.registrar(datos);

    if (resultado.ok) {
        showToast('¡Registro exitoso! Ya puedes iniciar sesión.', 'success');
        setTimeout(() => window.api.irA('login'), 2000);
    } else {
        if (resultado.codigo === 'usuario_existe') {
            showToast('El nombre de usuario ya está en uso. Prueba otro.', 'error');
        } else {
            showToast(resultado.mensaje || 'Error al registrar. Intenta de nuevo.', 'error');
        }
    }
});

// Ir a login
linkLogin.addEventListener('click', (e) => {
    e.preventDefault();
    window.api.irA('login');
});
