const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } = require('docx');
const fs = require('fs');
const path = require('path');

const FORMAT = {
  font: 'Times New Roman',
  fontSize: 22,
  lineSpacing: 480,
  firstLineIndent: 720,
};

function createCoverPage(data) {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: FORMAT.lineSpacing },
      children: [new TextRun({ text: data.titulo || 'MANUAL DE USUARIO', bold: true, size: 36, font: FORMAT.font })],
    }),
    new Paragraph({
      children: [new TextRun({ text: '', break: 1 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: FORMAT.lineSpacing },
      children: [new TextRun({ text: data.subtitulo || 'LearningPC - Aplicación de Aprendizaje Interactivo', size: 26, font: FORMAT.font })],
    }),
    new Paragraph({ children: [new TextRun({ text: '', break: 2 })] }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: FORMAT.lineSpacing },
      children: [new TextRun({ text: `Versión: ${data.version || '1.0.0'}`, size: 22, font: FORMAT.font })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: FORMAT.lineSpacing },
      children: [new TextRun({ text: `Autor: ${data.autor || 'I3lue'}`, size: 22, font: FORMAT.font })],
    }),
    new Paragraph({ children: [new TextRun({ text: '', break: 2 })] }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: FORMAT.lineSpacing },
      children: [new TextRun({ text: `Fecha: ${data.fecha || new Date().toLocaleDateString('es-CO')}`, size: 22, font: FORMAT.font })],
    }),
  ];
}

function createSection(title, contentArray) {
  const paragraphs = [
    new Paragraph({
      spacing: { before: 360, after: 240, line: FORMAT.lineSpacing },
      children: [new TextRun({ text: title, bold: true, size: 26, font: FORMAT.font })],
    }),
  ];

  contentArray.forEach(item => {
    if (item.type === 'text') {
      paragraphs.push(new Paragraph({
        indent: { firstLine: FORMAT.firstLineIndent },
        alignment: AlignmentType.BOTH,
        spacing: { line: FORMAT.lineSpacing },
        children: [new TextRun({ text: item.content, size: FORMAT.fontSize, font: FORMAT.font })],
      }));
    } else if (item.type === 'bullet') {
      paragraphs.push(new Paragraph({
        indent: { firstLine: FORMAT.firstLineIndent, left: 720 },
        spacing: { line: FORMAT.lineSpacing },
        children: [new TextRun({ text: `• ${item.content}`, size: FORMAT.fontSize, font: FORMAT.font })],
      }));
    } else if (item.type === 'numbered') {
      paragraphs.push(new Paragraph({
        indent: { firstLine: FORMAT.firstLineIndent, left: 720 },
        spacing: { line: FORMAT.lineSpacing },
        children: [new TextRun({ text: `${item.num}. ${item.content}`, size: FORMAT.fontSize, font: FORMAT.font })],
      }));
    } else if (item.type === 'note') {
      paragraphs.push(new Paragraph({
        spacing: { line: FORMAT.lineSpacing },
        children: [new TextRun({ text: `NOTA: ${item.content}`, italics: true, size: 20, font: FORMAT.font })],
      }));
    } else if (item.type === 'image') {
      paragraphs.push(new Paragraph({
        spacing: { line: FORMAT.lineSpacing },
        children: [new TextRun({ text: `[INSERTAR IMAGEN: ${item.label}]`, bold: true, size: 20, color: 'FF0000', font: FORMAT.font })],
      }));
      paragraphs.push(new Paragraph({
        spacing: { line: FORMAT.lineSpacing },
        children: [new TextRun({ text: item.description || '', italics: true, size: 18, font: FORMAT.font })],
      }));
    }
  });

  return paragraphs;
}

async function generateManual(outputPath, data) {
  const sections = [
    ...createCoverPage({ titulo: 'MANUAL DE USUARIO', version: '1.0', autor: 'I3lue', fecha: new Date().toLocaleDateString('es-CO') }),

    // 1. Introducción
    ...createSection('1. Introducción', [
      { type: 'text', content: 'LearningPC es una aplicación de escritorio diseñada para el aprendizaje interactivo de habilidades informáticas básicas. El aplicativo simula entornos de trabajo reales como Windows 11 y proporciona lecciones teórico-prácticas sobre programación básica con Python.' },
      { type: 'text', content: '' },
      { type: 'text', content: '¿A quién va dirigido?' },
      { type: 'text', content: 'Este manual está dirigido a usuarios que desean aprender:' },
      { type: 'bullet', content: 'Manejo básico de Windows' },
      { type: 'bullet', content: 'Navegación en Internet' },
      { type: 'bullet', content: 'Herramientas de Microsoft Office' },
      { type: 'bullet', content: 'Atajos y trucos del computador' },
      { type: 'bullet', content: 'Fundamentos de programación con Python' },
    ]),

    // 2. Primeros pasos
    ...createSection('2. Primeros Pasos', [
      { type: 'text', content: 'Esta sección describe cómo instalar y ejecutar la aplicación por primera vez.' },
      { type: 'text', content: '' },
      { type: 'numbered', num: 1, content: 'Descargar la aplicación del repositorio oficial' },
      { type: 'numbered', num: 2, content: 'Ejecutar el archivo install.bat o installer' },
      { type: 'numbered', num: 3, content: 'Launch la aplicación desde el menú Inicio o escritorio' },
      { type: 'note', content: 'La primera ejecución puede tomar algunos segundos mientras se cargan los componentes' },
      { type: 'image', label: 'Pantalla de inicio de la aplicación', description: 'Captura de pantalla de la ventana principal al iniciar la aplicación' },
    ]),

    // 3. Registro e inicio de sesión
    ...createSection('3. Registro e Inicio de Sesión', [
      { type: 'text', content: 'Para acceder al contenido de aprendizaje, el usuario debe crear una cuenta o iniciar sesión si ya tiene una.' },
      { type: 'text', content: '' },
      { type: 'text', content: 'Crear una nueva cuenta:' },
      { type: 'bullet', content: 'Hacer clic en "Registrarse" en la pantalla de login' },
      { type: 'bullet', content: 'Ingresar un nombre de usuario (único)' },
      { type: 'bullet', content: 'Ingresar una contraseña' },
      { type: 'bullet', content: 'Confirmar la contraseña' },
      { type: 'bullet', content: 'Ingresar la edad (opcional)' },
      { type: 'bullet', content: 'Hacer clic en "Crear cuenta"' },
      { type: 'image', label: 'Formulario de registro', description: 'Captura del formulario de registro de nueva cuenta' },
      { type: 'text', content: '' },
      { type: 'text', content: 'Iniciar sesión:' },
      { type: 'bullet', content: 'Ingresar el nombre de usuario' },
      { type: 'bullet', content: 'Ingresar la contraseña' },
      { type: 'bullet', content: 'Opcional: Marcar "Recordarme" para sessión persistente' },
      { type: 'bullet', content: 'Hacer clic en "Iniciar sesión"' },
      { type: 'image', label: 'Pantalla de inicio de sesión', description: 'Captura de la pantalla de login' },
    ]),

    // 4. Navegación principal
    ...createSection('4. Navegación Principal', [
      { type: 'text', content: 'La interfaz principal de LearningPC presenta una barra lateral con las categoría de aprendizaje y un área de contenido principal.' },
      { type: 'text', content: '' },
      { type: 'text', content: 'Estructura de categorías:' },
      { type: 'bullet', content: 'Office - Herramientas de Microsoft Office' },
      { type: 'bullet', content: 'Navegación en Internet - Uso del navegador' },
      { type: 'bullet', content: 'Navegación en Windows - Sistema operativo' },
      { type: 'bullet', content: 'Trucos Adicionales - Atajos y consejos' },
      { type: 'bullet', content: 'Programación - Fundamentos de Python' },
      { type: 'image', label: 'Home con categorías', description: 'Captura de la pantalla principal mostrando las categorías' },
      { type: 'text', content: '' },
      { type: 'text', content: 'Barra de navegación superior:' },
      { type: 'bullet', content: 'Reportes - Ver estadísticas de progreso' },
      { type: 'bullet', content: 'Ajustes - Configuración de la aplicación' },
      { type: 'bullet', content: 'Cambiar tema - Alternar entre modo claro y oscuro' },
    ]),

    // 5. Sistema de niveles
    ...createSection('5. Sistema de Niveles', [
      { type: 'text', content: 'Cada subcategoría contiene niveles secuenciales que el usuario debe completar para avanzar.' },
      { type: 'text', content: '' },
      { type: 'text', content: 'Cómo funciona:' },
      { type: 'bullet', content: 'Los niveles se organizan en orden secuencial (1, 2, 3...)' },
      { type: 'bullet', content: 'Cada nivel tiene una duración estimada en minutos' },
      { type: 'bullet', content: 'Es necesario completar el nivel actual para desbloquear el siguiente' },
      { type: 'bullet', content: 'El sistema guarda automáticamente el progreso' },
      { type: 'image', label: 'Lista de niveles', description: 'Captura de la lista de niveles dentro de una subcategoría' },
      { type: 'text', content: '' },
      { type: 'text', content: 'Indicadores de progreso:' },
      { type: 'bullet', content: 'Nivel completado - Marcado con check verde' },
      { type: 'bullet', content: 'Nivel actual - Resaltado o destacado' },
      { type: 'bullet', content: 'Nivel bloqueado - Con candado o en gris' },
    ]),

    // 6. Simulaciones
    ...createSection('6. Simulaciones', [
      { type: 'text', content: 'Las simulaciones son lecciones prácticas donde el usuario interactúa con un entorno simulado. Existen dos tipos principales:' },
      { type: 'text', content: '' },
      { type: 'text', content: 'A) Simulaciones de Windows:' },
      { type: 'bullet', content: 'Simulan el escritorio y aplicaciones de Windows 11' },
      { type: 'bullet', content: 'El usuario aprende interactuando con elementos visuales' },
      { type: 'bullet', content: 'Incluyen arrastrar, hacer clic, y navegacion por menús' },
      { type: 'image', label: 'Simulación Windows', description: 'Ejemplo de simulación del escritorio Windows' },
      { type: 'text', content: '' },
      { type: 'text', content: 'B) Simulaciones de Programación:' },
      { type: 'bullet', content: 'Utilizan un editor de código simulando VS Code' },
      { type: 'bullet', content: 'El usuario escribe código Python real' },
      { type: 'bullet', content: 'Pyodide ejecuta el código en el navegador' },
      { type: 'bullet', content: 'Validación automática del código escrito' },
      { type: 'text', content: '' },
      { type: 'text', content: 'Paso a paso en simulaciones:' },
      { type: 'numbered', num: 1, content: 'Leer la teoría y explicaciones en los popups informativos' },
      { type: 'numbered', num: 2, content: 'Realizar la tarea solicitada en la simulación' },
      { type: 'numbered', num: 3, content: 'Hacer clic en "Siguiente" o completar la acción requerida' },
      { type: 'numbered', num: 4, content: 'Recibir feedback de éxito o indicación de error' },
      { type: 'numbered', num: 5, content: 'Avanzar al siguiente nivel automáticamente' },
      { type: 'image', label: 'Simulación Python', description: 'Ejemplo de simulación de programación con editor de código' },
    ]),

    // 7. Perfil y ajustes
    ...createSection('7. Perfil y Ajustes', [
      { type: 'text', content: 'La página de ajustes permite personalizar la experiencia del usuario.' },
      { type: 'text', content: '' },
      { type: 'text', content: 'Opciones disponibles:' },
      { type: 'bullet', content: 'Cambiar tema - Modo claro / Modo oscuro' },
      { type: 'bullet', content: 'Ver progreso total de aprendizaje' },
      { type: 'bullet', content: 'Consultar estadísticas personales' },
      { type: 'image', label: 'Página de ajustes', description: 'Captura de la página de configuración' },
    ]),

    // 8. Administración (opcional)
    ...createSection('8. Administración', [
      { type: 'text', content: 'La función de administración permite gestionar el contenido del aplicativo. Esta sección está disponible para usuarios con privilegios de administrador.' },
      { type: 'text', content: '' },
      { type: 'text', content: 'Funciones de administración:' },
      { type: 'bullet', content: 'Agregar nuevas categorías' },
      { type: 'bullet', content: 'Crear subcategorías' },
      { type: 'bullet', content: 'Gestionar niveles (crear, editar, eliminar)' },
      { type: 'bullet', content: 'Actualizar rutas de contenidos' },
      { type: 'bullet', content: 'Ver reportes generales del sistema' },
      { type: 'image', label: 'Panel de administración', description: 'Captura del panel de gestión administrativa' },
    ]),

    // 9. Resolución de problemas
    ...createSection('9. Resolución de Problemas', [
      { type: 'text', content: 'Esta sección cubre problemas comunes y sus soluciones.' },
      { type: 'text', content: '' },
      { type: 'text', content: 'Problema: La aplicación no inicia' },
      { type: 'bullet', content: 'Verificar que Electron esté instalado' },
      { type: 'bullet', content: 'Ejecutar como administrador' },
      { type: 'bullet', content: 'Verificar los archivos de la aplicación' },
      { type: 'text', content: '' },
      { type: 'text', content: 'Problema: No se cargan las simulaciones' },
      { type: 'bullet', content: 'Verificar conexión a internet (para simulaciones Python)' },
      { type: 'bullet', content: 'Limpiar caché del aplicativo' },
      { type: 'bullet', content: 'Reiniciar la aplicación' },
      { type: 'text', content: '' },
      { type: 'text', content: 'Problema: No avanza de nivel' },
      { type: 'bullet', content: 'Completar todas las acciones requeridas' },
      { type: 'bullet', content: 'Verificar que el código sea correcto (en simulaciones Python)' },
      { type: 'bullet', content: 'Contactar soporte si el problema persiste' },
    ]),
  ];

  const doc = new Document({
    styles: {
      default: { document: { run: { font: FORMAT.font, size: FORMAT.fontSize } } },
    },
    sections: [{
      properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
      children: sections,
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
  console.log(`Manual de usuario generado: ${outputPath}`);
}

const outputPath = process.argv[2] || 'Manual_Usuario_LearningPC.docx';

generateManual(outputPath, {}).catch(console.error);