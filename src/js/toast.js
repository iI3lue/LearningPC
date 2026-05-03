/**
 * toast.js - Módulo compartido de notificaciones toast
 * Uso: incluir <script src="../js/toast.js"></script> antes del script de la página.
 * Requiere un elemento con clase .toast-notification y .toast-message en el HTML.
 */
(function () {
    function showToast(message, type = 'info') {
        // Buscar cualquier toast container en la página
        const toast = document.querySelector('.toast-notification');
        const toastMessage = toast ? toast.querySelector('.toast-message') : null;
        if (!toast || !toastMessage) return;

        toast.classList.remove('success', 'error', 'info', 'exito');
        toast.classList.add(type);
        toastMessage.textContent = message;
        toast.classList.add('visible');

        setTimeout(() => {
            toast.classList.remove('visible');
        }, 3000);
    }

    // Exponer globalmente
    window.showToast = showToast;
})();
