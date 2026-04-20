/**
 * Pyodide Loader - Carga el intérprete Python en el navegador
 * Uso: await loadPyodide(); luego runPython('codigo')
 */

let pyodideInstance = null;
let isLoading = false;
let loadPromise = null;

// URL del CDN de Pyodide (versión estable)
const PYODIDE_CDN = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';

/**
 * Inicializa Pyodide (solo una vez)
 * @returns {Promise<PyodideInterface>}
 */
async function loadPyodide() {
    if (pyodideInstance) {
        return pyodideInstance;
    }

    if (isLoading && loadPromise) {
        return loadPromise;
    }

    isLoading = true;
    loadPromise = _loadPyodide();
    
    try {
        pyodideInstance = await loadPromise;
        // Pyodide loaded, ready to use
        return pyodideInstance;
    } catch (error) {
        isLoading = false;
        loadPromise = null;
        throw error;
    }
}

async function _loadPyodide() {
    return new Promise((resolve, reject) => {
        if (typeof loadPyodide === 'function') {
            loadPyodide().then(resolve).catch(reject);
            return;
        }

        const script = document.createElement('script');
        script.src = PYODIDE_CDN;
        script.onload = () => {
            window.loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' })
                .then(resolve)
                .catch(reject);
        };
        script.onerror = () => reject(new Error('Failed to load Pyodide from CDN'));
        document.head.appendChild(script);
    });
}

/**
 * Ejecuta código Python y retorna el resultado
 * @param {string} code - Código Python a ejecutar
 * @returns {Promise<string>} - Output del código
 */
async function runPython(code) {
    const pyodide = await loadPyodide();
    
    try {
        // Ejecutar el código
        pyodide.runPython(code);
        
        // Capturar el stdout si hay print()
        const output = pyodide.runPython(`
            import sys
            from io import StringIO
            sys.stdout.get_value() if hasattr(sys.stdout, 'get_value') else StringIO().getvalue()
        `);
        
        return output || '';
    } catch (error) {
        throw new Error(error.message);
    }
}

/**
 * Ejecuta código y retorna el valor de una variable
 * @param {string} code - Código a ejecutar
 * @param {string} varName - Nombre de la variable a retornar
 * @returns {Promise<any>}
 */
async function runPythonAndGet(code, varName) {
    const pyodide = await loadPyodide();
    pyodide.runPython(code);
    return pyodide.globals.get(varName);
}

/**
 * Verifica si el código produce el output esperado
 * @param {string} code - Código Python
 * @param {string} expectedOutput - Output esperado
 * @returns {Promise<{correct: boolean, output: string}>}
 */
async function verifyOutput(code, expectedOutput) {
    const pyodide = await loadPyodide();
    let output = '';
    
    try {
        // Redirect stdout para capturar print()
        pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
        `);
        
        pyodide.runPython(code);
        
        output = pyodide.runPython('sys.stdout.getvalue()');
        output = output ? output.trim() : output;
        
        const correct = output === expectedOutput;
        return { correct, output };
    } catch (error) {
        return { correct: false, output: error.message };
    }
}

/**
 * Verifica si el código produce output que contiene texto
 * @param {string} code
 * @param {string} text - Texto que debe contener
 * @returns {Promise<{correct: boolean, output: string}>}
 */
async function verifyOutputContains(code, text) {
    const result = await verifyOutput(code, '');
    const correct = result.output.includes(text);
    return { correct, output: result.output };
}

/**
 * Limpia el estado de Pyodide
 */
function resetPyodide() {
    if (pyodideInstance) {
        pyodideInstance.runPython(`
import sys
sys.stdout = sys.__stdout__
        `);
    }
}

/**
 * Verifica si Pyodide está cargado
 * @returns {boolean}
 */
function isPyodideReady() {
    return pyodideInstance !== null;
}

/**
 * Muestra mensaje de carga en el elemento
 * @param {HTMLElement} element - Elemento para mostrar estado
 */
function showLoadingStatus(element) {
    if (!element) return;
    
    if (isLoading) {
        element.textContent = 'Cargando Python...';
        element.className = 'loading';
    } else if (pyodideInstance) {
        element.textContent = '✓ Python listo';
        element.className = 'ready';
    } else {
        element.textContent = 'Python no disponible';
        element.className = 'error';
    }
}

// Exportar funciones globalmente
window.loadPyodide = loadPyodide;
window.runPython = runPython;
window.runPythonAndGet = runPythonAndGet;
window.verifyOutput = verifyOutput;
window.verifyOutputContains = verifyOutputContains;
window.resetPyodide = resetPyodide;
window.isPyodideReady = isPyodideReady;
window.showLoadingStatus = showLoadingStatus;