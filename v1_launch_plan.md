# Plan de Lanzamiento V1: Branding y Pulido Profesional

Este documento establece la hoja de ruta para finalizar la primera versión (V1) de la aplicación, transformándola de un prototipo funcional a un producto profesional, instalable y con una identidad de marca clara.

## Fase 1: Identidad Visual y Branding (Naming y Logo)

Actualmente el proyecto se llama "PrimerClic". Necesitamos un nombre más amigable, memorable y en español, dado el enfoque educativo.

### 1.1. Propuestas de Nombre
*   **PrimerClic:** Directo, enfocado en dar el primer paso en la tecnología.
*   **DigiGuía:** Enfatiza el acompañamiento en el aprendizaje digital.
*   **CompuFácil:** Tradicional pero muy claro para el público objetivo (adultos mayores, principiantes).
*   **NexoPC:** Más moderno, sugiere conexión con la tecnología.

### 1.2. Diseño de Logo y Assets
*   **Estilo:** Minimalista, formas redondeadas (amigable), paleta de colores basada en el sistema actual (azul corporativo/educativo, tonos pastel).
*   **Formatos necesarios:**
    *   `.ico` para el icono del ejecutable en Windows.
    *   `.png` (512x512) para pantallas de carga y splash screen.
    *   `.svg` para la barra de título (titlebar) y escalabilidad interna.

## Fase 2: Modernización de la Interfaz Base (Electron)

Para que la aplicación se sienta como un software nativo y profesional de Windows 11, debemos eliminar los bordes por defecto del sistema operativo y crear los nuestros.

### 2.1. Titlebar (Barra de Título) Customizada
*   **Configuración Electron:** Modificar `main.js` para usar `frame: false` o `titleBarStyle: 'hidden'`.
*   **Implementación HTML/CSS:** Crear un componente de barra superior inyectado en todas las vistas.
    *   Región arrastrable (`-webkit-app-region: drag`).
    *   Botones de control personalizados (Minimizar, Maximizar, Cerrar) usando iconos Fluent Design.
    *   Integración del nuevo logo y nombre en la esquina superior izquierda.

### 2.2. Estandarización de Estilos Globales
*   Auditoría de fuentes: Asegurar el uso consistente de 'Segoe UI' (Windows) o una fuente embebida como 'Inter' u 'Outfit' para evitar dependencias del sistema.
*   Variables CSS: Consolidar colores, bordes y sombras en `:root` para asegurar que el cambio entre Modo Claro y Oscuro sea perfecto en todas las pantallas.

## Fase 3: Escalabilidad y Arquitectura del Código

Para asegurar que añadir nuevos módulos o niveles sea trivial en el futuro.

### 3.1. Refactorización de Navegación
*   Asegurar que el sistema de carga de niveles sea completamente dinámico basado en la base de datos, evitando rutas "quemadas" (hardcoded) en el HTML.
*   Centralizar el gestor de progreso del usuario (pasar de localStorage/DB a un gestor de estado único y predecible).

### 3.2. Gestión de Errores
*   Implementar una pantalla de "Fallback" (pantalla de error amigable) en caso de que un nivel o simulación falle, evitando que la aplicación quede en blanco.

## Fase 4: Empaquetado y Distribución Profesional

El usuario final no debe ejecutar comandos de consola. Necesitamos un instalador.

### 4.1. Configuración de Electron Builder
*   Configurar `electron-builder` en el `package.json`.
*   Definir metadatos: Nombre de la empresa, descripción, versión (1.0.0), y copyright.

### 4.2. Creación del Instalador (NSIS)
*   Generar un instalador `.exe` de un solo clic para Windows.
*   Añadir licencia (EULA) opcional y selección de directorio de instalación.
*   Configurar la creación automática de accesos directos en el Escritorio y Menú Inicio.
