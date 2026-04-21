/**
 * achievements.js
 * Sistema de Logros y Gamificación para LearningPC
 */

// ─────────────────────────────────────────────
// TIPOS DE LOGROS
// ─────────────────────────────────────────────
const LOGRO_TYPES = {
    PROGRESS: 'progress',     // Completar niveles
    CATEGORY: 'category',   // Completar categorías
    STREAK: 'streak',      // Racha de días
    SPEED: 'speed',        // Completar rápido
    EXPLORER: 'explorer',   // Explorar funciones
    MASTERY: 'mastery'      // Dominar una skill
};

// Definición de logros
const ACHIEVEMENTS = {
    // Progreso
    'first_step': {
        id: 'first_step',
        name: 'Primer Paso',
        description: 'Completa tu primer nivel',
        icon: '👣',
        type: LOGRO_TYPES.PROGRESS,
        condition: (stats) => stats.nivelesCompletados >= 1,
        points: 10
    },
    'five_levels': {
        id: 'five_levels',
        name: 'Aprendiz',
        description: 'Completa 5 niveles',
        icon: '📚',
        type: LOGRO_TYPES.PROGRESS,
        condition: (stats) => stats.nivelesCompletados >= 5,
        points: 25
    },
    'ten_levels': {
        id: 'ten_levels',
        name: 'Estudiante',
        description: 'Completa 10 niveles',
        icon: '🎓',
        type: LOGRO_TYPES.PROGRESS,
        condition: (stats) => stats.nivelesCompletados >= 10,
        points: 50
    },
    'half_way': {
        id: 'half_way',
        name: 'Mitad del Camino',
        description: 'Completa la mitad de los niveles',
        icon: '⚡',
        type: LOGRO_TYPES.PROGRESS,
        condition: (stats) => stats.nivelesCompletados >= 14,
        points: 100
    },
    'master': {
        id: 'master',
        name: 'Maestro',
        description: 'Completa todos los niveles',
        icon: '🏆',
        type: LOGRO_TYPES.PROGRESS,
        condition: (stats) => stats.nivelesCompletados >= 27,
        points: 200
    },
    
    // Rachas
    'streak_3': {
        id: 'streak_3',
        name: 'Racha de 3 Días',
        description: 'Inicia sesión 3 días seguidos',
        icon: '🔥',
        type: LOGRO_TYPES.STREAK,
        condition: (stats) => stats.rachaDias >= 3,
        points: 30
    },
    'streak_7': {
        id: 'streak_7',
        name: 'Semana de Trabajo',
        description: 'Inicia sesión 7 días seguidos',
        icon: '💪',
        type: LOGRO_TYPES.STREAK,
        condition: (stats) => stats.rachaDias >= 7,
        points: 75
    },
    'streak_30': {
        id: 'streak_30',
        name: 'Compromiso Mensual',
        description: 'Inicia sesión 30 días seguidos',
        icon: '🌟',
        type: LOGRO_TYPES.STREAK,
        condition: (stats) => stats.rachaDias >= 30,
        points: 300
    },
    
    // Velocidad
    'speed_demon': {
        id: 'speed_demon',
        name: 'Demonio de la Velocidad',
        description: 'Completa 3 niveles en menos de 5 minutos',
        icon: '⚡',
        type: LOGRO_TYPES.SPEED,
        condition: (stats) => stats.tiempoPromedio < 100, // segundos por nivel
        points: 50
    },
    
    // Categorías
    'python_programmer': {
        id: 'python_programmer',
        name: 'Programador Python',
        description: 'Completa la categoría Programación',
        icon: '🐍',
        type: LOGRO_TYPES.CATEGORY,
        condition: (stats) => stats.categoriasCompletadas.includes('Programación'),
        points: 100
    },
    'windows_explorer': {
        id: 'windows_explorer',
        name: 'Explorador de Windows',
        description: 'Completa la categoría Windows',
        icon: '📁',
        type: LOGRO_TYPES.CATEGORY,
        condition: (stats) => stats.categoriasCompletadas.includes('Explorador de Windows'),
        points: 100
    },
    'shortcut_master': {
        id: 'shortcut_master',
        name: 'Maestro de Atajos',
        description: 'Completa la categoría Atajos',
        icon: '⌨️',
        type: LOGRO_TYPES.CATEGORY,
        condition: (stats) => stats.categoriasCompletadas.includes('Atajos de Teclado'),
        points: 100
    },
    'window_tricks': {
        id: 'window_tricks',
        name: 'Experto en Ventanas',
        description: 'Completa la categoría Trucos',
        icon: '🪟',
        type: LOGRO_TYPES.CATEGORY,
        condition: (stats) => stats.categoriasCompletadas.includes('Trucos de Ventanas'),
        points: 100
    }
};

// ─────────────────────────────────────────────
// ESTADOS DEL JUGADOR
// ─────────────────────────────────────────────
let playerStats = {
    nivelesCompletados: 0,
    categoriasCompletadas: [],
    rachajSON: [],
    tiempoTotalSegundos: 0,
    nivelesCount: 0,
    ultimoLogin: null,
    rachaDias: 0,
    logrosDesbloqueados: [],
    puntos: 0
};

// ─────────────────────────────────────────────
// FUNCIONES PRINCIPALES
// ─────────────────────────────────────────────
function initAchievements() {
    cargarStats();
    actualizarRacha();
    verificarTodosLogros();
    renderLogrosUI();
}

function cargarStats() {
    try {
        const saved = localStorage.getItem('player_stats');
        if (saved) playerStats = JSON.parse(saved);
    } catch(e) {
        console.log('Stats no encontrados, inicializando...');
    }
}

function guardarStats() {
    localStorage.setItem('player_stats', JSON.stringify(playerStats));
}

function actualizarRacha() {
    const ahora = new Date();
    const hoy = ahora.toDateString();
    const ultimo = playerStats.ultimoLogin;
    
    if (!ultimo) {
        playerStats.rachaDias = 1;
    } else {
        const ultimoDate = new Date(ultimo);
        const diffDias = Math.floor((ahora - ultimoDate) / (1000 * 60 * 60 * 24));
        
        if (diffDias === 1) {
            playerStats.rachaDias++;
        } else if (diffDias > 1) {
            playerStats.rachaDias = 1;
        }
    }
    
    playerStats.ultimoLogin = ahora.toISOString();
    guardarStats();
}

function verificarTodosLogros() {
    let nuevos = [];
    const stats = playerStats;
    
    Object.values(ACHIEVEMENTS).forEach(logro => {
        if (!stats.logrosDesbloqueados.includes(logro.id) && logro.condition(stats)) {
            unlockAchievement(logro);
            nuevos.push(logro);
        }
    });
    
    if (nuevos.length > 0) {
        mostrarNotificacionLogros(nuevos);
    }
}

function datosLogro(logro) {
    if (!playerStats.logrosDesbloqueados.includes(logro.id)) {
        playerStats.logrosDesbloqueados.push(logro.id);
        playerStats.puntos += logro.points;
        guardarStats();
    }
}

function getStats() {
    return {
        ...playerStats,
        logrosTotales: Object.keys(ACHIEVEMENTS).length,
        porcentaje: Math.round((playerStats.logrosDesbloqueados.length / Object.keys(ACHIEVEMENTS).length) * 100)
    };
}

// ─────────────────────────────────────────────
// UI
// ──────────────��──────────────────────────────
function renderLogrosUI() {
    renderPanelLogros();
    renderBadgePerfil();
}

function renderPanelLogros() {
    const container = document.getElementById('logros-panel');
    if (!container) return;
    
    const stats = getStats();
    const desbloqueados = playerStats.logrosDesbloqueados;
    
    container.innerHTML = `
        <div class="logros-header">
            <h3>🏆 Logros</h3>
            <span class="logros-puntos">${stats.puntos} pts</span>
        </div>
        <div class="logros-grid">
            ${Object.values(ACHIEVEMENTS).map(logro => {
                const unlocked = desbloqueados.includes(logro.id);
                return `
                    <div class="logro-card ${unlocked ? 'desbloqueado' : 'bloqueado'}" 
                         data-logro="${logro.id}"
                         title="${logro.description}">
                        <span class="logro-icon">${logro.icon}</span>
                        <span class="logro-name">${logro.name}</span>
                        <span class="logro-points">+${logro.points}</span>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function renderBadgePerfil() {
    const badge = document.getElementById('perfil-badge');
    if (!badge) return;
    
    const stats = getStats();
    
    // Badge según puntos
    let badgeTexto, badgeClase;
    if (stats.puntos >= 500) {
        badgeTexto = 'Experto';
        badgeClase = 'badge-experto';
    } else if (stats.puntos >= 200) {
        badgeTexto = 'Avanzado';
        badgeClase = 'badge-avanzado';
    } else if (stats.puntos >= 50) {
        badgeTexto = 'Intermedio';
        badgeClase = 'badge-intermedio';
    } else {
        badgeTexto = 'Principiante';
        badgeClase = 'badge-principiante';
    }
    
    badge.innerHTML = `<span class="badge ${badgeClase}">${badgeTexto}</span>`;
}

function mostrarNotificacionLogros(nuevos) {
    // Crear notificación flotante
    const notif = document.createElement('div');
    notif.className = 'logro-notification';
    notif.innerHTML = `
        <div class="logro-notif-icon">🏆</div>
        <div class="logro-notif-content">
            <h4>¡Nuevo Logro!</h4>
            <p>${nuevos[0].name}</p>
        </div>
    `;
    
    document.body.appendChild(notif);
    
    // Animación
    setTimeout(() => notif.classList.add('show'), 100);
    setTimeout(() => {
        notif.classList.remove('show');
        setTimeout(() => notif.remove(), 500);
    }, 3000);
}

function abrirPanelLogros() {
    const panel = document.getElementById('logros-panel');
    if (panel) panel.classList.toggle('open');
}

// ─────────────────────────────────────────────
// EVENTOS
// ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', initAchievements);

// Botón de logros
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btn-logros');
    if (btn) btn.addEventListener('click', abrirPanelLogros);
});