// login.js - Lógica de la pantalla de inicio de sesión
const formLogin = document.getElementById('form-login');
const errorLogin = document.getElementById('error-login');
const linkRegistro = document.getElementById('link-registro');

// Debug: verificar que window.api existe
console.log('[LOGIN] window.api disponible:', typeof window.api);

if (!window.api || !window.api.login) {
    console.error('[LOGIN] window.api.login NO disponible');
    errorLogin.textContent = 'Error: API no disponible. Recarga la página.';
    errorLogin.hidden = false;
}

// Enviar formulario de login
formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorLogin.hidden = true;

    const usuario = document.getElementById('usuario').value.trim();
    const contraseña = document.getElementById('contraseña').value;

    console.log('[LOGIN] Intentando login con:', usuario);

    if (!window.api || !window.api.login) {
        errorLogin.textContent = 'Error: API no disponible.';
        errorLogin.hidden = false;
        return;
    }

    try {
        const resultado = await window.api.login(usuario, contraseña);
        console.log('[LOGIN] Resultado:', resultado);

        if (resultado.ok) {
            // Guardar usuario en sessionStorage para usarlo en home.html
            sessionStorage.setItem('usuario', JSON.stringify(resultado.usuario));
            window.api.irA('home');
        } else {
            errorLogin.textContent = resultado.mensaje || 'Usuario o contraseña incorrectos.';
            errorLogin.hidden = false;
        }
    } catch (err) {
        console.error('[LOGIN] Error:', err);
        errorLogin.textContent = 'Error de conexión: ' + err.message;
        errorLogin.hidden = false;
    }
});

// Ir a registro
linkRegistro.addEventListener('click', (e) => {
    e.preventDefault();
    window.api.irA('registro');
});
