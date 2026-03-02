// registro.js - Lógica de la pantalla de registro
const formRegistro = document.getElementById('form-registro');
const errorRegistro = document.getElementById('error-registro');
const exitoRegistro = document.getElementById('exito-registro');
const linkLogin = document.getElementById('link-login');

// Enviar formulario de registro
formRegistro.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorRegistro.hidden = true;
    exitoRegistro.hidden = true;

    const datos = {
        usuario: document.getElementById('usuario').value.trim(),
        contraseña: document.getElementById('contraseña').value,
        edad: parseInt(document.getElementById('edad').value) || null,
    };

    const resultado = await window.api.registrar(datos);

    if (resultado.ok) {
        exitoRegistro.hidden = false;
        setTimeout(() => window.api.irA('login'), 1500);
    } else {
        errorRegistro.textContent = resultado.mensaje;
        errorRegistro.hidden = false;
    }
});

// Ir a login
linkLogin.addEventListener('click', (e) => {
    e.preventDefault();
    window.api.irA('login');
});
