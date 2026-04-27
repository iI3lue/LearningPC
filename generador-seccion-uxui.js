const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = require('docx');
const fs = require('fs');

const FORMAT = {
  font: 'Times New Roman',
  fontSize: 22,
  lineSpacing: 480,
  firstLineIndent: 720,
};

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
    } else if (item.type === 'note') {
      paragraphs.push(new Paragraph({
        spacing: { line: FORMAT.lineSpacing },
        children: [new TextRun({ text: `NOTA: ${item.content}`, italics: true, size: 20, font: FORMAT.font })],
      }));
    } else if (item.type === 'table') {
      paragraphs.push(new Paragraph({
        spacing: { line: FORMAT.lineSpacing },
        children: [new TextRun({ text: item.content, bold: true, size: 20, font: FORMAT.font })],
      }));
    }
  });

  return paragraphs;
}

async function generateUXSection(outputPath) {
  const sections = [
    ...createSection('4. USABILIDAD, EFICIENCIA Y EFICACIA (UX/UI)', [
      { type: 'text', content: 'La usabilidad, eficiencia y eficacia en LearningPC se manifiestan a través de elementos diseñados para mejorar la experiencia del usuario. Este proyecto aplica principios de UX/UI para crear una experiencia de aprendizaje intuitiva y efectiva.' },
      { type: 'text', content: '' },
      
      { type: 'text', content: '4.1 USABILIDAD' },
      { type: 'text', content: 'La usabilidad en LearningPC se manifiesta a través de varios elementos diseñados para facilitar la experiencia del usuario:' },
      { type: 'bullet', content: 'Navegación intuitiva - Barra lateral con categorías claras y iconos representativos' },
      { type: 'bullet', content: 'Sistema de breadcrumb para ubicación del usuario' },
      { type: 'bullet', content: 'Marcador visual del nivel actual' },
      { type: 'bullet', content: 'Retroalimentación inmediata (Feedback) - Toast notifications que aparecen durante 3 segundos' },
      { type: 'bullet', content: 'Indicadores de progreso visuales (anillo de progreso)' },
      { type: 'bullet', content: 'Validación en tiempo real del código escrito' },
      { type: 'bullet', content: 'Tours paso a paso - Popups informativos que guían al usuario' },
      { type: 'bullet', content: 'Auto-avance configurable (5-10 segundos)' },
      { type: 'bullet', content: 'Botones para omitir o continuar' },
      { type: 'bullet', content: 'Accesibilidad - Soporte para atajos de teclado (F5 para ejecutar)' },
      { type: 'bullet', content: 'Tooltips en botones con información contextual' },
      { type: 'bullet', content: 'Diseño responsivo según tamaño de ventana' },
      { type: 'text', content: '' },

      { type: 'text', content: '4.2 EFICIENCIA' },
      { type: 'text', content: 'La eficiencia del sistema se refleja en:' },
      { type: 'bullet', content: 'Ejecución local - Pyodide se carga desde CDN una sola vez, no requiere servidor backend para simulaciones Python' },
      { type: 'bullet', content: 'SQLite funciona localmente sin configuración' },
      { type: 'bullet', content: 'Validación estricta - Validación de código antes de permitir avanzar' },
      { type: 'bullet', content: 'Verificación de sintaxis específica requerida' },
      { type: 'bullet', content: 'Mensajes de error claros y específicos' },
      { type: 'bullet', content: 'Persistencia de datos - Progreso guardado en SQLite local' },
      { type: 'bullet', content: 'Sesión recordable (checkbox "Recordarme")' },
      { type: 'bullet', content: 'Tema preferido persiste en localStorage' },
      { type: 'bullet', content: 'Carga optimizada - Archivos modulares (simulacion-core.js, CSS compartido)' },
      { type: 'bullet', content: 'lazy loading de componentes' },
      { type: 'bullet', content: 'Solo se carga lo necesario por nivel' },
      { type: 'text', content: '' },

      { type: 'text', content: '4.3 EFICACIA (UX/UI)' },
      { type: 'text', content: 'El diseño UX/UI de LearningPC sigue los principios de Windows 11:' },
      { type: 'bullet', content: 'Diseño Visual - Esquema de colores consistente, bordes redondeados (border-radius), sombras y depth para jerarquía visual, modo claro y modo oscuro' },
      { type: 'bullet', content: 'Interacción - Clicks en ventanas para traer al frente (z-index dinámico), drag & drop funcional en simulaciones, teclas de atajo soporte (Escape, F5, Tab)' },
      { type: 'bullet', content: 'Gamificación - Sistema de progreso porcentual, niveles desbloqueados secuencialmente, feedback visual al completar niveles' },
      { type: 'bullet', content: 'Consistencia - Mismo patrón en todas las simulaciones, componentes reutilizables (simulacion-core.js), estilos CSS centralizados en styles.css' },
      { type: 'text', content: '' },

      { type: 'text', content: '4.4 MÉTRICAS DE UX IMPLEMENTADAS' },
      { type: 'table', content: 'MÉTRICA              | IMPLEMENTACIÓN' },
      { type: 'table', content: '-------------------|---------------------------------' },
      { type: 'table', content: 'Tiempo de aprendizaje | Duración estimada por nivel' },
      { type: 'table', content: 'Tasa de completación | Progreso guardado por usuario' },
      { type: 'table', content: 'Interactividad      | Validaciones en tiempo real' },
      { type: 'table', content: 'Retención          | Sesión persistente en localStorage' },
      { type: 'table', content: 'Satisfacción      | Toast notifications + badges' },
      { type: 'text', content: '' },

      { type: 'text', content: '4.5 EJEMPLOS CONCRETOS DEL PROYECTO' },
      { type: 'text', content: '1. En simulaciones Python:' },
      { type: 'bullet', content: 'El usuario debe escribir código específico para avanzar' },
      { type: 'bullet', content: 'Si el código no es correcto, aparece error en terminal' },
      { type: 'bullet', content: 'Solo avanza cuando Pyodide valida el output esperado' },
      { type: 'text', content: '2. En navegación:' },
      { type: 'bullet', content: 'Sistema de niveles requiere completar actual para desbloquear siguiente' },
      { type: 'bullet', content: 'Progress ring muestra porcentaje de avance' },
      { type: 'bullet', content: 'Badge "Completado" aparece cuando termina' },
      { type: 'text', content: '3. En interfaz:' },
      { type: 'bullet', content: 'Tema switcher con efecto de transición suave' },
      { type: 'bullet', content: 'Ventanas pueden maximizarse-restaurarse' },
      { type: 'bullet', content: 'Sidebar collapsible para más espacio de contenido' },
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
  console.log(`Sección UX/UI generada: ${outputPath}`);
}

const outputPath = process.argv[2] || 'Seccion_UXUI_LearningPC.docx';

generateUXSection(outputPath).catch(console.error);