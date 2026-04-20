const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType, LevelFormat } = require('docx');
const fs = require('fs');

const contenido = JSON.parse(fs.readFileSync('documento.json', 'utf8'));

const doc = new Document({
    styles: {
        default: { document: { run: { font: "Arial", size: 22 } } },
        paragraphStyles: [
            { id: "Title", name: "Title", basedOn: "Normal", run: { size: 44, bold: true, color: "0078D4" }, paragraph: { spacing: { before: 400, after: 200 }, alignment: AlignmentType.CENTER } },
            { id: "Heading1", name: "Heading 1", basedOn: "Normal", run: { size: 28, bold: true, color: "1F2937" }, paragraph: { spacing: { before: 360, after: 180 }, outlineLevel: 0 } },
            { id: "Heading2", name: "Heading 2", basedOn: "Normal", run: { size: 24, bold: true, color: "374151" }, paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
            { id: "Heading3", name: "Heading 3", basedOn: "Normal", run: { size: 22, bold: true, color: "6B7280" }, paragraph: { spacing: { before: 180, after: 100 }, outlineLevel: 2 } },
            { id: "Subtitle", name: "Subtitle", basedOn: "Normal", run: { size: 20, color: "6B7280" }, paragraph: { spacing: { after: 240 } } },
            { id: "Body", name: "Body", basedOn: "Normal", run: { size: 22, color: "1F2937" }, paragraph: { spacing: { after: 120, lineSpacing: 276 } } },
        ]
    },
    numbering: {
        config: [
            { reference: "numbered", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
            { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }
        ]
    },
    sections: [{
        properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
        children: [
            // ===== PORTADA =====
            new Paragraph({ spacing: { before: 1800, after: 400 }, children: [new TextRun({ text: contenido.portada.titulo, bold: true, size: 44, color: "0078D4", alignment: AlignmentType.CENTER })] }),
            new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: contenido.portada.subtitulo, bold: true, size: 28, color: "1F2937", alignment: AlignmentType.CENTER })] }),
            new Paragraph({ spacing: { before: 400, after: 100 }, children: [new TextRun({ text: contenido.portada.tipo, italics: true, size: 24, color: "6B7280", alignment: AlignmentType.CENTER })] }),
            new Paragraph({ spacing: { before: 600 }, children: [new TextRun({ text: contenido.portada.version, size: 20, color: "6B7280", alignment: AlignmentType.CENTER })] }),
            new Paragraph({ spacing: { before: 100 }, children: [new TextRun({ text: contenido.portada.fecha, size: 20, color: "6B7280", alignment: AlignmentType.CENTER })] }),

            // Page break
            new Paragraph({ children: [new TextRun({ text: "" })] }),

            // ===== INTRODUCCIÓN =====
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "INTRODUCCIÓN" })] }),
            ...contenido.introduccion.parrafos.map(p => new Paragraph({ style: "Body", children: [new TextRun({ text: p })] })),
            new Paragraph({ style: "Body", children: [new TextRun({ text: "Justificación del Proyecto:", bold: true }) ] }),
            new Paragraph({ style: "Body", children: [new TextRun({ text: contenido.introduccion.justificacion })] }),
            new Paragraph({ style: "Body", children: [new TextRun({ text: "Alcance del Proyecto:", bold: true }) ] }),
            new Paragraph({ style: "Body", children: [new TextRun({ text: contenido.introduccion.alcance })] }),

            // ===== OBJETIVOS =====
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "OBJETIVOS" })]}),
            new Paragraph({ style: "Body", children: [new TextRun({ text: "Objetivo General:", bold: true }) ] }),
            new Paragraph({ style: "Body", children: [new TextRun({ text: contenido.objetivos.general })] }),
            new Paragraph({ style: "Body", children: [new TextRun({ text: "Objetivos Específicos:", bold: true }) ] }),
            ...contenido.objetivos.especificos.map(texto => new Paragraph({ numbering: { reference: "numbered", level: 0 }, children: [new TextRun({ text: texto })] })),

            // ===== TABLA DE CONTENIDOS =====
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "TABLA DE CONTENIDOS" })]}),
            ...contenido.tablaContenido.map(item => new Paragraph({ children: [new TextRun({ text: item.titulo + " ".repeat(60 - item.titulo.length - item.pagina.length) + item.pagina, size: 20 })] })),

            // ===== DESARROLLO - Sección 1: Arquitectura Técnica =====
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "1. ARQUITECTURA TÉCNICA" })]}),
            
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "1.1 Capas de la Arquitectura" })]}),
            new Paragraph({ style: "Body", children: [new TextRun({ text: "LearningPC implementa una arquitectura de tres capas que combina tecnologías web modernas con capacidades de escritorio. Esta separación permite mantener el código organizado, facilitar el mantenimiento y garantizar la seguridad mediante el aislamiento de procesos." })] }),
            new Paragraph({ style: "Body", children: [new TextRun({ text: "Capa de Presentación (Frontend):", bold: true }) ] }),
            ...contenido.arquitectura.capas.presentacion.map(texto => new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: texto })] })),
            
            new Paragraph({ style: "Body", children: [new TextRun({ text: "Capa de Lógica (Electron Main Process):", bold: true }) ] }),
            ...contenido.arquitectura.capas.logica.map(texto => new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: texto })] })),
            
            new Paragraph({ style: "Body", children: [new TextRun({ text: "Capa de Datos:", bold: true }) ] }),
            ...contenido.arquitectura.capas.datos.map(texto => new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: texto })] })),
            
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "1.2 Estructura de Archivos" })]}),
            new Paragraph({ style: "Body", children: [new TextRun({ text: "El proyecto sigue una organización modular y clara que facilita la navegación y el mantenimiento del código." })] }),
            new Paragraph({ style: "Body", children: [new TextRun({ text: "Archivos Principales:", bold: true }) ] }),
            ...contenido.arquitectura.estructura.archivos.map(texto => new Paragraph({ children: [new TextRun({ text: "• " + texto })] })),
            new Paragraph({ style: "Body", children: [new TextRun({ text: "Estructura de Carpetas:", bold: true }) ] }),
            ...contenido.arquitectura.estructura.carpetas.map(texto => new Paragraph({ children: [new TextRun({ text: "• " + texto })] })),

            // ===== DESARROLLO - Sección 2: Base de Datos =====
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "2. BASE DE DATOS" })]}),
            
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "2.1 Esquema de Tablas" })]}),
            new Paragraph({ style: "Body", children: [new TextRun({ text: "La base de datos SQLite utiliza un esquema jerárquico de tres niveles que permite una organización lógica del contenido educativo. Este diseño permite escalabilidad y facilidad para agregar nuevo contenido sin modificar la estructura existente." })] }),
            
            new Table({
                columnWidths: [2340, 4680, 2340],
                rows: [
                    new TableRow({
                        tableHeader: true,
                        children: [
                            new TableCell({ borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } }, width: { size: 2340, type: WidthType.DXA }, shading: { fill: "D5E8F0", type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Tabla", bold: true })] })] }),
                            new TableCell({ borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } }, width: { size: 4680, type: WidthType.DXA }, shading: { fill: "D5E8F0", type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Descripción", bold: true })] })] }),
                            new TableCell({ borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } }, width: { size: 2340, type: WidthType.DXA }, shading: { fill: "D5E8F0", type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Campos Principales", bold: true })] })] }),
                        ]
                    }),
                    ...contenido.baseDeDatos.tablas.map(t => new TableRow({
                        children: [
                            new TableCell({ borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } }, width: { size: 2340, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: t.nombre })] })] }),
                            new TableCell({ borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } }, width: { size: 4680, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: t.descripcion })] })] }),
                            new TableCell({ borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } }, width: { size: 2340, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: t.campos })] })] }),
                        ]
                    })),
                ]
            }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "2.2 Relaciones y Cardinalidad" })]}),
            new Paragraph({ style: "Body", children: [new TextRun({ text: "Las relaciones entre tablas siguen un patrón jerárquico que refleja la estructura del contenido educativo:" })]}),
            ...contenido.baseDeDatos.relaciones.map(texto => new Paragraph({ children: [new TextRun({ text: "• " + texto })] })),
            new Paragraph({ style: "Body", children: [new TextRun({ text: "La tabla progreso_usuario establece la relación muchos a muchos entre usuarios y niveles, con campos adicionales para tracking del aprendizaje." })] }),

            // ===== DESARROLLO - Sección 3: Estructura del Frontend =====
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "3. ESTRUCTURA DEL FRONTEND" })]}),
            
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "3.1 Páginas Principales" })]}),
            new Paragraph({ style: "Body", children: [new TextRun({ text: "El frontend está implementado como una aplicación web embebida dentro de Electron, utilizando un sistema de navegación entre páginas sin recarga completa (SPA-like). Cada página cumple una función específica dentro del flujo de usuario." })] }),
            
            new Table({
                columnWidths: [2340, 3510, 3510],
                rows: [
                    new TableRow({
                        tableHeader: true,
                        children: [
                            new TableCell({ borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } }, width: { size: 2340, type: WidthType.DXA }, shading: { fill: "D5E8F0", type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Página", bold: true })] })] }),
                            new TableCell({ borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } }, width: { size: 3510, type: WidthType.DXA }, shading: { fill: "D5E8F0", type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Propósito", bold: true })] })] }),
                            new TableCell({ borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } }, width: { size: 3510, type: WidthType.DXA }, shading: { fill: "D5E8F0", type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Funcionalidades", bold: true })] })] }),
                        ]
                    }),
                    ...contenido.frontend.paginas.map(p => new TableRow({
                        children: [
                            new TableCell({ borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } }, width: { size: 2340, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: p.nombre })] })] }),
                            new TableCell({ borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } }, width: { size: 3510, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: p.proposito })] })] }),
                            new TableCell({ borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } }, width: { size: 3510, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: p.funcionalidades })] })] }),
                        ]
                    })),
                ]
            }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "3.2 Sistema de Estilos CSS" })]}),
            new Paragraph({ style: "Body", children: [new TextRun({ text: "El archivo styles.css (~1700 líneas) implementa un sistema de diseño profesional basado en tokens CSS que permite mantener consistencia visual en toda la aplicación y facilita los cambios de tema." })] }),
            new Paragraph({ style: "Body", children: [new TextRun({ text: "Variables CSS Principales (Tokens de Diseño):", bold: true }) ] }),
            new Paragraph({ children: [new TextRun({ text: "• " + contenido.frontend.css.variables })]}),
            new Paragraph({ children: [new TextRun({ text: "• " + contenido.frontend.css.estados })]}),
            new Paragraph({ children: [new TextRun({ text: "• " + contenido.frontend.css.elevaciones })]}),
            new Paragraph({ children: [new TextRun({ text: "• " + contenido.frontend.css.animaciones })]}),
            new Paragraph({ style: "Body", children: [new TextRun({ text: "Fases de Implementación del Diseño:", bold: true }) ] }),
            ...contenido.frontend.fases.map((texto, i) => new Paragraph({ numbering: { reference: "numbered", level: 0 }, children: [new TextRun({ text: texto })]})),
            new Paragraph({ style: "Body", children: [new TextRun({ text: "Este enfoque por fases permitió iterar sobre el diseño e ir agregando complejidad visual de manera incremental, manteniendo siempre un producto funcional." })] }),

            // ===== DESARROLLO - Sección 4: Funcionalidades =====
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "4. FUNCIONALIDADES IMPLEMENTADAS" })]}),
            
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "4.1 Autenticación y Sesión" })]}),
            new Paragraph({ style: "Body", children: [new TextRun({ text: "El sistema de autenticación proporciona seguridad básica y persistencia de sesión:" })]}),
            ...contenido.funcionalidades.autenticacion.map(texto => new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: texto })]})),
            
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "4.2 Dashboard y Progreso" })]}),
            new Paragraph({ style: "Body", children: [new TextRun({ text: "El dashboard de home.html muestra información personalizada y motivación para el usuario:" })]}),
            ...contenido.funcionalidades.dashboard.map(texto => new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: texto })]})),
            new Paragraph({ style: "Body", children: [new TextRun({ text: "El cálculo del progreso total se realiza automáticamente en el backend cada vez que un usuario marca un nivel como completado." })] }),
            
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "4.3 Simulaciones Interactivas" })]}),
            new Paragraph({ style: "Body", children: [new TextRun({ text: "Sistema de contenido dinámico que carga archivos HTML externos para práctica:" })]}),
            ...contenido.funcionalidades.simulaciones.map(texto => new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: texto })]})),
            new Paragraph({ style: "Body", children: [new TextRun({ text: "Las simulaciones utilizan un núcleo común (simulacion-core.js/css) que proporciona estructura consistente y funcionalidad compartida." })] }),
            
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "4.4 Panel de Administración" })]}),
            new Paragraph({ style: "Body", children: [new TextRun({ text: "CRUD completo para gestión de contenidos accesible solo para el usuario administrador (id_usuario=1):" })]}),
            ...contenido.funcionalidades.admin.map(texto => new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: texto })]})),

            // ===== DESARROLLO - Sección 5: Diseño UI/UX =====
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "5. DISEÑO UI/UX" })]}),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "5.1 Estilo Windows 11 / Fluent Design" })]}),
            new Paragraph({ style: "Body", children: [new TextRun({ text: "La aplicación implementa el lenguaje de diseño de Microsoft Fluent, proporcionando una experiencia familiar para usuarios de Windows 11:" })]}),
            ...contenido.diseno.windows11.map(texto => new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: texto })]})),
            
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "5.2 Sistema de Temas (Light/Dark)" })]}),
            new Paragraph({ style: "Body", children: [new TextRun({ text: "Tema Claro (Light Mode):", bold: true }) ] }),
            new Paragraph({ children: [new TextRun({ text: contenido.diseno.temas.light.bg })]}),
            new Paragraph({ children: [new TextRun({ text: contenido.diseno.temas.light.text })]}),
            new Paragraph({ children: [new TextRun({ text: contenido.diseno.temas.light.border })]}),
            new Paragraph({ children: [new TextRun({ text: contenido.diseno.temas.light.textSecondary })]}),
            new Paragraph({ style: "Body", children: [new TextRun({ text: "Tema Oscuro (Dark Mode):", bold: true }) ] }),
            new Paragraph({ children: [new TextRun({ text: contenido.diseno.temas.dark.bg })]}),
            new Paragraph({ children: [new TextRun({ text: contenido.diseno.temas.dark.text })]}),
            new Paragraph({ children: [new TextRun({ text: contenido.diseno.temas.dark.border })]}),
            new Paragraph({ children: [new TextRun({ text: contenido.diseno.temas.dark.accent })]}),
            new Paragraph({ style: "Body", children: [new TextRun({ text: "La implementación se realiza mediante theme-manager.js que sincroniza con localStorage y actualiza el atributo data-theme en el elemento <html>, activando los selectores [data-theme=\"dark\"] en CSS." })] }),
            
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "5.3 Componentes UI" })]}),
            new Paragraph({ style: "Body", children: [new TextRun({ text: "Toast Notifications:", bold: true }) ] }),
            new Paragraph({ style: "Body", children: [new TextRun({ text: contenido.diseno.componentes.toast })] }),
            new Paragraph({ style: "Body", children: [new TextRun({ text: "Tooltips:", bold: true }) ] }),
            new Paragraph({ style: "Body", children: [new TextRun({ text: contenido.diseno.componentes.tooltips })]}),
            new Paragraph({ style: "Body", children: [new TextRun({ text: "Progress Ring:", bold: true }) ] }),
            new Paragraph({ style: "Body", children: [new TextRun({ text: contenido.diseno.componentes.progressRing })] }),
            new Paragraph({ style: "Body", children: [new TextRun({ text: "Sidebar:", bold: true }) ] }),
            new Paragraph({ style: "Body", children: [new TextRun({ text: contenido.diseno.componentes.sidebar })] }),

            // ===== DESARROLLO - Sección 6: Contenido Educativo =====
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "6. CONTENIDO EDUCATIVO" })]}),
            
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "6.1 Estructura de Categorías" })]}),
            new Paragraph({ style: "Body", children: [new TextRun({ text: "El contenido educativo se organiza en 4 categorías principales, cada una con múltiples subcategorías y niveles progresivos:" })]}),
            
            new Table({
                columnWidths: [2340, 3510, 3510],
                rows: [
                    new TableRow({
                        tableHeader: true,
                        children: [
                            new TableCell({ borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } }, width: { size: 2340, type: WidthType.DXA }, shading: { fill: "D5E8F0", type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Categoría", bold: true })] })] }),
                            new TableCell({ borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } }, width: { size: 3510, type: WidthType.DXA }, shading: { fill: "D5E8F0", type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Descripción", bold: true })] })] }),
                            new TableCell({ borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } }, width: { size: 3510, type: WidthType.DXA }, shading: { fill: "D5E8F0", type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Subcategorías", bold: true })] })] }),
                        ]
                    }),
                    ...contenido.contenido.categorias.map(c => new TableRow({
                        children: [
                            new TableCell({ borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } }, width: { size: 2340, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: c.nombre })] })] }),
                            new TableCell({ borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } }, width: { size: 3510, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: c.descripcion })] })] }),
                            new TableCell({ borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } }, width: { size: 3510, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: c.subcategorias })] })] }),
                        ]
                    })),
                ]
            }),
            
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "6.2 Simulaciones Disponibles" })]}),
            new Paragraph({ style: "Body", children: [new TextRun({ text: "Actualmente existen 8 niveles con contenido de simulación interactiva implementada:" })]}),
            ...contenido.contenido.simulaciones.map(texto => new Paragraph({ children: [new TextRun({ text: "• " + texto })] })),
            new Paragraph({ style: "Body", children: [new TextRun({ text: "Los niveles con NULL en el campo ruta_archivo tienen contenido por desarrollar, lo cual permite expandir fácilmente el catálogo." })] }),
            
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "6.3 Sistema de Badges de Progreso" })]}),
            new Paragraph({ style: "Body", children: [new TextRun({ text: "Sistema de niveles basado en porcentaje de niveles completados:" })]}),
            ...contenido.contenido.badges.map(b => new Paragraph({ children: [new TextRun({ text: "• " + b.nombre + ": " + b.rango })] })),
            new Paragraph({ style: "Body", children: [new TextRun({ text: "El badge se muestra en el perfil del usuario y se actualiza automáticamente según su progreso." })] }),
            
            // ===== DESARROLLO - Sección 7: Decisiones de Diseño =====
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "7. CONFIGURACIONES Y DECISIONES DE DISEÑO" })]}),
            
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "7.1 Ventana Maximizada por Defecto" })]}),
            new Paragraph({ style: "Body", children: [new TextRun({ text: contenido.configuraciones.ventanaMaximizada })] }),
            
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "7.2 Contraste en Modo Claro" })]}),
            new Paragraph({ style: "Body", children: [new TextRun({ text: contenido.configuraciones.contrasteModoClaro })] }),
            
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "7.3 Feedback Visual (Toasts)" })]}),
            new Paragraph({ style: "Body", children: [new TextRun({ text: contenido.configuraciones.feedbackVisual })] }),
            
            // ===== SECCIÓN 8: TECNOLOGÍAS =====
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: "8. TECNOLOGÍAS" })]}),
            
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "8.1 Dependencias del Proyecto" })]}),
            new Paragraph({ style: "Body", children: [new TextRun({ text: "El proyecto utiliza las siguientes tecnologías y dependencias:" })]}),
            
            new Table({
                columnWidths: [2340, 2340, 2340, 2340],
                rows: [
                    new TableRow({
                        tableHeader: true,
                        children: [
                            new TableCell({ borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } }, width: { size: 2340, type: WidthType.DXA }, shading: { fill: "D5E8F0", type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Tecnología", bold: true })] })] }),
                            new TableCell({ borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } }, width: { size: 2340, type: WidthType.DXA }, shading: { fill: "D5E8F0", type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Versión", bold: true })] })] }),
                            new TableCell({ borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } }, width: { size: 2340, type: WidthType.DXA }, shading: { fill: "D5E8F0", type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Tipo", bold: true })] })] }),
                            new TableCell({ borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } }, width: { size: 2340, type: WidthType.DXA }, shading: { fill: "D5E8F0", type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Propósito", bold: true })] })] }),
                        ]
                    }),
                    ...contenido.tecnologias.dependencias.map(d => new TableRow({
                        children: [
                            new TableCell({ borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } }, width: { size: 2340, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: d.nombre })] })] }),
                            new TableCell({ borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } }, width: { size: 2340, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: d.version })] })] }),
                            new TableCell({ borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } }, width: { size: 2340, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: d.tipo })] })] }),
                            new TableCell({ borders: { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }, right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } }, width: { size: 2340, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: d.proposito })] })] }),
                        ]
                    })),
                ]
            }),
            
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "8.2 Cómo Ejecutar la Aplicación" })]}),
            new Paragraph({ style: "Body", children: [new TextRun({ text: "Para ejecutar la aplicación en un entorno de desarrollo:" })]}),
            ...contenido.tecnologias.ejecutar.map(texto => new Paragraph({ children: [new TextRun({ text: texto })] })),
            new Paragraph({ style: "Body", children: [new TextRun({ text: contenido.tecnologias.nota })] }),
            
            // ===== FIN =====
            new Paragraph({ spacing: { before: 600 }, children: [new TextRun({ text: "--- Fin del Documento ---", italics: true, color: "6B7280", alignment: AlignmentType.CENTER })] }),
            new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "LearningPC - Aplicación Educativa de Computación", italics: true, color: "6B7280", alignment: AlignmentType.CENTER })] }),
        ]
    }]
});

Packer.toBuffer(doc).then(buffer => {
    const filename = `LearningPC_Documentacion_Tecnica_${Date.now()}.docx`;
fs.writeFileSync(filename, buffer);
    console.log("Document created successfully: LearningPC_Documentacion_Tecnica.docx");
});