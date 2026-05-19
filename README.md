# PrimerClic

Aplicación de escritorio educativa para aprender a usar Windows, Office, Internet y programación básica de forma interactiva.

---

## 👤 Autor

**Desarrollado por I3lue** — Aprendizaje interactivo para todos.

---

## 📱 Descripción

PrimerClic es una aplicación de escritorio construida con Electron que enseña informática básica mediante simulaciones interactivas. Cada módulo guía al usuario paso a paso con un tutor integrado, validación automática y feedback inmediato.

**Público objetivo**: Personas que quieren aprender a usar Windows, Office, navegar por Internet y programar en Python desde cero.

---

## 🛠️ Tecnologías

| Capa | Tecnología |
|------|-----------|
| Escritorio | [Electron](https://www.electronjs.org/) |
| Base de datos | SQLite via [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) |
| Frontend | HTML, CSS, JavaScript vanilla |
| Autenticación | bcryptjs |

---

## 🚀 Cómo ejecutar

### Prerequisitos

- Node.js ≥ 18
- npm

### Instalación

```bash
npm install
npm run rebuild   # recompila better-sqlite3 para Electron
```

### Desarrollo

```bash
npm start
```

---

## 📂 Estructura del proyecto

```
PrimerClic/
├── main.js              # Proceso principal de Electron
├── preload.js           # Bridge seguro renderer ↔ main
├── package.json
├── primer_clic.db       # Base de datos SQLite con todo el contenido
├── db/
│   ├── database.js      # Inicialización y migraciones automáticas
│   └── schema.sql       # Esquema de tablas
├── src/                 # Vistas y lógica del frontend
├── assets/              # Iconos y recursos gráficos
└── contenido/           # Simulaciones interactivas HTML
    ├── internet/        # Módulo de Navegación en Internet
    ├── office/          # Módulo de Office (Word, Excel, PowerPoint)
    │   ├── word/
    │   ├── excel/
    │   └── powerpoint/
    ├── programacion/    # Módulo de Programación Python
    │   ├── ide-interprete/
    │   ├── variables/
    │   ├── condicionales/
    │   └── funciones/
    └── trucos/          # Trucos de Windows (personalización)
```

---

## 📊 Contenido disponible

### 1. 🌐 Navegación en Internet
| Nivel | Título |
|-------|--------|
| 1 | Navegador vs. Motor de búsqueda |
| 2 | Comandos de navegación |
| 3 | Seguridad online (HTTPS / Phishing) |

### 2. 📎 Office
| Subcategoría | Niveles | Temas |
|---|---|---|
| Word | 3 | Formato de texto, Alineación de párrafos, Combinación de comandos |
| Excel | 3 | Formato de celdas, Bordes y alineación, Fórmulas básicas |
| PowerPoint | 3 | Formato de texto, Diseño de diapositiva, Insertar elementos |

### 3. 🐍 Programación Python
| Subcategoría | Niveles | Temas |
|---|---|---|
| IDE e Intérprete | 3 | ¿Qué es un IDE?, El intérprete, Tu primer programa |
| Variables | 3 | ¿Qué es una variable?, Tipos de datos, Operaciones con tipos |
| Condicionales | 3 | Decisiones con if, else, elif |
| Funciones | 3 | Crear funciones, Parámetros, Retornar valores |

### 4. 💡 Trucos de Windows
| Nivel | Título |
|-------|--------|
| 1–3 | Personalización del escritorio |

### 5. 🪟 Atajos y Navegación en Windows *(contenido base)*
- Copiar y pegar (`Ctrl+C`, `Ctrl+V`)
- Deshacer y rehacer (`Ctrl+Z`, `Ctrl+Y`)
- Atajos con `Win` (`Win+E`, `Win+D`, etc.)
- Explorador: abrir, navegar, organizar carpetas
- Arrastre a bordes, botones de control, dividir pantalla

---

## ⚙️ Interfaz y personalización

- **Diseño**: Fluent Design (Windows 11)
- **Temas**: Claro / Oscuro
- **Colores de acento**: Esmeralda, Violeta, Ámbar, Rojo, Rosa, Cyan
- **Effectos visuales**: Activables/desactivables

---

## 📄 Licencia

Uso educativo — PrimerClic © I3lue
