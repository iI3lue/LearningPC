// login.js - Lógica de la pantalla de inicio de sesión
const formLogin = document.getElementById('form-login');
const errorLogin = document.getElementById('error-login');
const linkRegistro = document.getElementById('link-registro');

// Función para mostrar toast
function showToast(message, type = 'info') {
    const toast = document.getElementById('login-toast');
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

// Verificar si hay sesión guardada (recordarme)
function checkSavedSession() {
    const savedUser = localStorage.getItem('usuario');
    if (savedUser) {
        try {
            const usuario = JSON.parse(savedUser);
            sessionStorage.setItem('usuario', savedUser);
            window.api.irA('home');
        } catch (e) {
            localStorage.removeItem('usuario');
        }
    }
}

// Llamar al cargar la página
checkSavedSession();

// Debug: verificar que window.api existe
console.log('[LOGIN] window.api disponible:', typeof window.api);

if (!window.api || !window.api.login) {
    console.error('[LOGIN] window.api.login NO disponible');
    showToast('Error: API no disponible. Recarga la página.', 'error');
}

// Enviar formulario de login
formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorLogin.hidden = true;

    const usuario = document.getElementById('usuario').value.trim();
    const contraseña = document.getElementById('contraseña').value;

    console.log('[LOGIN] Intentando login con:', usuario);

    if (!window.api || !window.api.login) {
        showToast('Error: API no disponible.', 'error');
        return;
    }

    try {
        const resultado = await window.api.login(usuario, contraseña);
        console.log('[LOGIN] Resultado:', resultado);

        if (resultado.ok) {
            // Guardar usuario en sessionStorage para usarlo en home.html
            sessionStorage.setItem('usuario', JSON.stringify(resultado.usuario));
            
            // Si "recordarme" está marcado, guardar en localStorage
            const recordarme = document.getElementById('recordarme')?.checked;
            if (recordarme) {
                localStorage.setItem('usuario', JSON.stringify(resultado.usuario));
            }
            
            showToast('¡Bienvenido! Iniciando sesión...', 'success');
            setTimeout(() => window.api.irA('home'), 1000);
        } else {
            // Feedback específico según el tipo de error
            if (resultado.codigo === 'usuario_no_existe') {
                showToast('El usuario no existe. ¿Quieres registrarte?', 'error');
            } else if (resultado.codigo === 'contraseña_incorrecta') {
                showToast('Contraseña incorrecta. Intenta de nuevo.', 'error');
            } else {
                showToast(resultado.mensaje || 'Usuario o contraseña incorrectos.', 'error');
            }
        }
    } catch (err) {
        console.error('[LOGIN] Error:', err);
        showToast('Error de conexión: ' + err.message, 'error');
    }
});

// Ir a registro


if (linkRegistro) {
    linkRegistro.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.api && window.api.irA) {
            window.api.irA('registro');
        } else {
            console.error('API no disponible para navegación');
        }
    });
}
