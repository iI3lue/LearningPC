---
name: windows-simulation
description: >
  Crea simulaciones interactivas de Windows 11 para tutorials de aprendizaje.
  Trigger: Cuando necesitas crear una simulación de Windows 11, "crear simulación windows", "nueva simulación", "simular windows 11"
license: MIT
metadata:
  author: learning-pc
  version: "1.0"
---

## Purpose

Generas simulaciones interactivas de Windows 11 para los tutorials de LearningPC. Cada simulación reproduce una parte de la interfaz de Windows 11 con fondo negro y barra de tareas, permitiendo al usuario practicar sin riesgos.

## When to Run

- Cuando el usuario quiere crear un nuevo tutorial de Windows
- Cuando necesitas generar una simulación para un nivel específico
- Cuando se requiere un entorno seguro para practicar atajos

## Project Context

El proyecto LearningPC está en: `C:\Workspaces\UCC\Desarrollo Sostenible\LearningPC`

- Las simulaciones se guardan en: `contenido/`
- Es una app Electron que enseña Windows
- Usa SQLite para categorías y niveles

## What to Do

### Step 1: Understand the Request

El usuario te dará:
- **Título** de la simulación
- **Categoría** (trucos, navegación, office, etc.)
- **Contenido** del tutorial (instrucciones, atajos, etc.)
- **Tipo de simulación** (opcional): desktop, window, menu, etc.

### Step 2: Generate Simulation HTML

Crea un archivo HTML en `contenido/` con:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{Título de la simulación}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            background: #000;
            font-family: 'Segoe UI', sans-serif;
            overflow: hidden;
            height: 100vh;
        }
        .desktop {
            height: calc(100vh - 48px);
            padding: 20px;
        }
        .window {{
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 8px;
            padding: 20px;
            max-width: 600px;
            margin: 20px auto;
            color: #fff;
        }}
        .title-bar {{
            background: #1a1a1a;
            padding: 8px 12px;
            border-radius: 8px 8px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #333;
        }}
        .window-controls {{
            display: flex;
            gap: 8px;
        }}
        .control {{
            width: 12px;
            height: 12px;
            border-radius: 50%;
        }}
        .close {{ background: #ff5f57; }}
        .minimize {{ background: #febc2e; }}
        .maximize {{ background: #28c840; }}
        .content {{
            padding: 20px;
            color: #ddd;
            line-height: 1.6;
        }}
        .instruction {{
            background: #252525;
            padding: 15px;
            border-radius: 6px;
            margin: 10px 0;
            border-left: 3px solid #0078d4;
        }}
        .key {{
            background: #333;
            padding: 4px 10px;
            border-radius: 4px;
            font-family: monospace;
            border: 1px solid #555;
        }}
        .taskbar {{
            background: #1a1a1a;
            height: 48px;
            display: flex;
            align-items: center;
            padding: 0 10px;
            border-top: 1px solid #333;
            position: fixed;
            bottom: 0;
            width: 100%;
        }}
        .start-button {{
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            cursor: pointer;
        }}
        .start-button:hover {{ background: #333; }}
        .start-icon {{
            width: 20px;
            height: 20px;
            background: linear-gradient(135deg, #0078d4 0%, #00bcf2 100%);
            border-radius: 2px;
        }}
        .taskbar-icons {{
            display: flex;
            gap: 4px;
            margin-left: 20px;
        }}
        .taskbar-icon {{
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            cursor: pointer;
        }}
        .taskbar-icon:hover {{ background: #333; }}
        .tray {{
            margin-left: auto;
            display: flex;
            align-items: center;
            gap: 10px;
        }}
        .tray-icon {{
            width: 20px;
            height: 20px;
            background: #333;
            border-radius: 2px;
        }}
    </style>
</head>
<body>
    <div class="desktop">
        <!-- Tu contenido aquí -->
    </div>
    <div class="taskbar">
        <div class="start-button">
            <div class="start-icon"></div>
        </div>
        <div class="taskbar-icons">
            <div class="taskbar-icon">📁</div>
            <div class="taskbar-icon">🌐</div>
        </div>
        <div class="tray">
            <div class="tray-icon"></div>
            <div class="tray-icon"></div>
        </div>
    </div>
</body>
</html>
```

### Step 3: Customize the Content

Según el tipo de tutorial, agrega:

**Para Trucos (ejemplo: Win + flechas):**
```html
<div class="window">
    <div class="title-bar">
        <span>💡 Truco: Dividir pantalla</span>
        <div class="window-controls">
            <div class="control minimize"></div>
            <div class="control maximize"></div>
            <div class="control close"></div>
        </div>
    </div>
    <div class="content">
        <h2>Cómo dividir tu pantalla</h2>
        <p>Windows te permite dividir la pantalla para trabajar con varias ventanas.</p>
        
        <div class="instruction">
            <strong>Paso 1:</strong> Mantén presionada la tecla <span class="key">Win</span>
        </div>
        
        <div class="instruction">
            <strong>Paso 2:</strong> Sin soltar, presiona una <span class="key">flecha de dirección</span>:
            <ul>
                <li><span class="key">←</span> Divide a la izquierda</li>
                <li><span class="key">→</span> Divide a la derecha</li>
                <li><span class="key">↑</span> Maximiza la ventana</li>
                <li><span class="key">↓</span> Minimiza la ventana</li>
            </ul>
        </div>
        
        <div class="instruction">
            <strong>Práctica:</strong> Try it now! Press <span class="key">Win</span> + <span class="key">←</span>
        </div>
    </div>
</div>
```

**Para Navegación Windows:**
```html
<div class="window">
    <div class="title-bar">
        <span>📁 Explorador de Archivos</span>
        <div class="window-controls">
            <div class="control minimize"></div>
            <div class="control maximize"></div>
            <div class="control close"></div>
        </div>
    </div>
    <div class="content">
        <!-- Contenido del tutorial -->
    </div>
</div>
```

### Step 4: Save the File

1. Nombre del archivo: `{categoria}-{titulo-slug}.html`
   - Ejemplo: `trucos-dividir-pantalla.html`, `navegacion-explorador.html`
2. Guarda en: `C:\Workspaces\UCC\Desarrollo Sostenible\LearningPC\contenido\`
3. Usa minúsculas y guiones para el slug

### Step 5: Return Summary

```
## Simulación Creada

**Archivo**: contenido/{nombre}.html
**Título**: {título}
**Categoría**: {categoría}

### Contenido incluido:
- Fondo negro estilo Windows 11
- Barra de tareas con menú Inicio
- Ventana interactiva con controles
- Instrucciones del tutorial

### Siguiente paso:
Integrar esta simulación en un nivel de la base de datos.
```

## Examples

### Ejemplo 1: Truco de pantalla dividida

Input del usuario:
- Título: "Dividir pantalla con Win + Flechas"
- Categoría: Trucos
- Contenido: Explicar atajo Win + flechas

Output: Archivo `contenido/trucos-dividir-pantalla.html` con la simulación mostrando:
- Ventana explicativa
- Teclas Win + ← → ↑ ↓ resaltadas
- Instrucciones paso a paso

### Ejemplo 2: Explorador de archivos

Input del usuario:
- Título: "Cómo usar el Explorador"
- Categoría: Navegación Windows
- Contenido: Explicar navegación de carpetas

Output: Archivo `contenido/navegacion-explorador.html` simulando el Explorador de Windows

## Rules

- SIEMPRE usa fondo negro (#000) como fondo principal
- SIEMPRE incluye la barra de tareas de Windows 11
- Usa iconos unicode simples (📁, 🌐, etc.)
- Limita la simulación a lo que el tutorial necesita
- Guarda siempre en la carpeta `contenido/` del proyecto
- Usa slug (minúsculas, guiones) para nombres de archivo

## IMPORTANTE: Convención de Rutas

Las simulaciones se cargan desde `src/pages/simulacion.html`, que está en un nivel superior a `contenido/`.

### Ruta para la Base de Datos

Las simulaciones se cargan desde `src/pages/simulacion.html`, que está en:
`src/pages/`

Para llegar a `contenido/` en la raíz, necesitas:
```
../../contenido/{nombre-del-archivo}.html
```

Ejemplo:
- Archivo: `contenido/trucos-dividir-pantalla.html`
- Ruta en BD: `../../contenido/trucos-dividir-pantalla.html`

### Por qué es importante

- `src/pages/simulacion.html` + `../../contenido/` = raíz del proyecto → `contenido/`
- Si usas `contenido/...` o `../contenido/...`, NO funcionará

### Protección de teclado

El archivo `simulacion.html` ya incluye protección:
- **Cuando el iframe tiene foco**: Win y Meta están bloqueados
- **Siempre**: Ctrl+C, Ctrl+X, Ctrl+V, Ctrl+Z, Ctrl+Y funcionan normalmente
