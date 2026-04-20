/**
 * Simulator Editor - Componente IDE reutilizable para simulaciones Python
 * Uso: initSimulatorEditor(config) en cada pagina
 */

const SimulatorEditor = {
    config: null,
    currentStep: 1,
    totalSteps: 3,
    pyodideReady: false,
    initAttempts: 0,
    
};

function initSimulatorEditor(config) {
    SimulatorEditor.config = config;
    SimulatorEditor.currentStep = config.startStep || 1;
    SimulatorEditor.totalSteps = config.totalSteps || 3;
    SimulatorEditor.initAttempts = 0;
    
    renderEditor();
    bindEditorEvents();
    initPyodideEditor();
}

function renderEditor() {
    const container = document.getElementById('simulator-container');
    if (!container) return;
    
    const stepTitle = SimulatorEditor.config.steps[SimulatorEditor.currentStep - 1]?.title || 'Completar';
    
    container.innerHTML = `
        <div class="simulator-editor">
            <div class="step-indicator" id="step-indicator">
                Paso ${SimulatorEditor.currentStep}/${SimulatorEditor.totalSteps}: ${stepTitle}
            </div>
            <div class="editor-layout">
                <div class="editor-panel">
                    <div class="explanation">
                        ${SimulatorEditor.config.explanation || ''}
                    </div>
                    <div class="code-editor-wrapper">
                        <div class="line-numbers" id="line-numbers">1</div>
                        <textarea id="code-editor" class="code-editor" placeholder="Escribe tu codigo aqui..." spellcheck="false">${SimulatorEditor.config.initialCode || ''}</textarea>
                    </div>
                    <div class="editor-buttons">
                        <button id="btn-ejecutar" class="btn btn-primary"><span class="icon">&#9654;</span> Ejecutar</button>
                        <button id="btn-verificar" class="btn btn-success"><span class="icon">&#10004;</span> Verificar paso</button>
                        <button id="btn-reiniciar" class="btn btn-secondary"><span class="icon">&#8634;</span> Reiniciar</button>
                    </div>
                </div>
                <div class="output-panel">
                    <div class="output-header"><span>Salida</span><button class="btn-clear" id="btn-limpiar">Limpiar</button></div>
                    <pre id="code-output" class="code-output"></pre>
                </div>
            </div>
            <div class="feedback" id="feedback-message"></div>
        </div>
    `;
    
    updateLineNumbers();
}

function bindEditorEvents() {
    const editor = document.getElementById('code-editor');
    if (editor) {
        editor.addEventListener('input', updateLineNumbers);
        editor.addEventListener('scroll', syncScroll);
        editor.addEventListener('keydown', handleKeydown);
    }
    
    document.getElementById('btn-ejecutar')?.addEventListener('click', executeCode);
    document.getElementById('btn-verificar')?.addEventListener('click', verifyStep);
    document.getElementById('btn-reiniciar')?.addEventListener('click', resetCode);
    document.getElementById('btn-limpiar')?.addEventListener('click', clearOutput);
}

function initPyodideEditor() {
    setOutput('Cargando Python...');
    
    loadPyodide().then(() => {
        SimulatorEditor.pyodideReady = true;
        setOutput('Python listo. Escribe tu codigo y presiona "Ejecutar"');
    }).catch(err => {
        setOutput('Error al cargar Python: ' + err.message);
    });
}

function updateLineNumbers() {
    const editor = document.getElementById('code-editor');
    const lineNumbers = document.getElementById('line-numbers');
    if (!editor || !lineNumbers) return;
    
    const lines = editor.value.split('\n').length;
    let numbers = '';
    for (let i = 1; i <= lines; i++) numbers += i + '\n';
    lineNumbers.textContent = numbers;
}

function syncScroll() {
    const editor = document.getElementById('code-editor');
    const lineNumbers = document.getElementById('line-numbers');
    if (editor && lineNumbers) lineNumbers.scrollTop = editor.scrollTop;
}

function handleKeydown(e) {
    if (e.key === 'Tab') {
        e.preventDefault();
        const start = this.selectionStart;
        e.target.value = e.target.value.substring(0, start) + '    ' + e.target.value.substring(this.selectionEnd);
        this.selectionStart = this.selectionEnd = start + 4;
        updateLineNumbers();
    }
}

function getCode() {
    return document.getElementById('code-editor')?.value || '';
}

function setOutput(text) {
    const output = document.getElementById('code-output');
    if (output) output.textContent = text;
}

function showFeedback(message, type = 'info') {
    const feedback = document.getElementById('feedback-message');
    if (feedback) {
        feedback.textContent = message;
        feedback.className = 'feedback ' + type;
    }
}

async function executeCode() {
    const code = getCode();
    const output = document.getElementById('code-output');
    
    if (!code.trim()) {
        showFeedback('Escribe algum codigo primero', 'warning');
        return;
    }
    
    if (!SimulatorEditor.pyodideReady) {
        showFeedback('Python aun esta cargando... espera un momento', 'warning');
        return;
    }
    
    output.textContent = 'Ejecutando...\n';
    
    try {
        await window.loadPyodide();
        
        window.runPython('import sys\nfrom io import StringIO\nsys.stdout = StringIO()');
        window.runPython(code);
        
        const result = window.runPython('sys.stdout.getvalue()');
        output.textContent = result || '(sin output)';
        showFeedback('Codigo ejecutado', 'success');
    } catch (error) {
        output.textContent = 'Error: ' + error.message;
        showFeedback('Error en el codigo', 'error');
    }
}

async function verifyStep() {
    const code = getCode();
    const expected = SimulatorEditor.config.steps[SimulatorEditor.currentStep - 1];
    
    if (!expected) {
        showFeedback('No hay validacion configurada para este paso', 'warning');
        return;
    }
    
    if (!SimulatorEditor.pyodideReady) {
        showFeedback('Python aun esta cargando...', 'warning');
        return;
    }
    
    try {
        await window.loadPyodide();
        
        window.runPython('import sys\nfrom io import StringIO\nsys.stdout = StringIO()');
        window.runPython(code);
        
        let output = window.runPython('sys.stdout.getvalue()');
        output = output ? output.trim() : '';
        
        let isCorrect = false;
        
        if (expected.type === 'exact') {
            isCorrect = output === expected.expected;
        } else if (expected.type === 'contains') {
            isCorrect = output.includes(expected.expected);
        } else if (expected.type === 'none') {
            isCorrect = true;
        }
        
        if (isCorrect) {
            showFeedback('Correcto! ' + expected.successMessage, 'success');
            nextStep();
        } else {
            SimulatorEditor.initAttempts++;
            if (SimulatorEditor.initAttempts >= 3 && expected.hint) {
                showFeedback('Pista: ' + expected.hint, 'info');
            } else {
                showFeedback('Casi... revisa el codigo e intenta de nuevo', 'warning');
            }
        }
    } catch (error) {
        showFeedback('Error: ' + error.message, 'error');
    }
}

function nextStep() {
    if (SimulatorEditor.currentStep < SimulatorEditor.totalSteps) {
        SimulatorEditor.currentStep++;
        SimulatorEditor.initAttempts = 0;
        
        const nextStepConfig = SimulatorEditor.config.steps[SimulatorEditor.currentStep - 1];
        if (nextStepConfig?.code) {
            const editor = document.getElementById('code-editor');
            if (editor) editor.value = nextStepConfig.code;
            updateLineNumbers();
        }
        
        const indicator = document.getElementById('step-indicator');
        if (indicator) {
            const stepTitle = nextStepConfig?.title || 'Completar';
            indicator.textContent = 'Paso ' + SimulatorEditor.currentStep + '/' + SimulatorEditor.totalSteps + ': ' + stepTitle;
        }
        
        clearOutput();
    } else {
        showFeedback('Felicitaciones! Has completado este nivel.', 'success');
        
        if (SimulatorEditor.config.completionMessage) {
            setTimeout(() => showFeedback(SimulatorEditor.config.completionMessage, 'success'), 1000);
        }
        
        if (typeof onLevelComplete === 'function') {
            onLevelComplete();
        }
    }
}

function resetCode() {
    const editor = document.getElementById('code-editor');
    if (editor) {
        editor.value = SimulatorEditor.config.initialCode || '';
        updateLineNumbers();
    }
    
    clearOutput();
    SimulatorEditor.initAttempts = 0;
    showFeedback('Codigo reiniciado', 'info');
}

function clearOutput() {
    const output = document.getElementById('code-output');
    if (output) output.textContent = '';
}

function updateStepIndicator() {
    const indicator = document.getElementById('step-indicator');
    if (indicator) {
        const stepTitle = SimulatorEditor.config.steps[SimulatorEditor.currentStep - 1]?.title || 'Completar';
        indicator.textContent = 'Paso ' + SimulatorEditor.currentStep + '/' + SimulatorEditor.totalSteps + ': ' + stepTitle;
    }
}

window.SimulatorEditor = SimulatorEditor;
window.initSimulatorEditor = initSimulatorEditor;