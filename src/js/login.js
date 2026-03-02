// login.js - Lógica de la pantalla de inicio de sesión
const formLogin = document.getElementById('form-login');
const errorLogin = document.getElementById('error-login');
const linkRegistro = document.getElementById('link-registro');

// Enviar formulario de login
formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorLogin.hidden = true;

    const usuario = document.getElementById('usuario').value.trim();
    const contraseña = document.getElementById('contraseña').value;

    const resultado = await window.api.login(usuario, contraseña);

    if (resultado.ok) {
        // Guardar usuario en sessionStorage para usarlo en home.html
        sessionStorage.setItem('usuario', JSON.stringify(resultado.usuario));
        window.api.irA('home');
    } else {
        errorLogin.textContent = resultado.mensaje;
        errorLogin.hidden = false;
    }
});

// Ir a registro
linkRegistro.addEventListener('click', (e) => {
    e.preventDefault();
    window.api.irA('registro');
});
