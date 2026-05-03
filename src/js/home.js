// home.js - Dashboard Informativo Learning PC

(function() {
    // showToast viene de toast.js (módulo compartido)
    const showToast = window.showToast || function() {};

    const usuario = JSON.parse(sessionStorage.getItem('usuario'));

    if (!usuario) {
        window.api.irA('login');
        return;
    }

    // Función helper para obtener elementos del DOM cuando se necesites
    function getEl(id) {
        const el = document.getElementById(id);
        return el;
    }
    
    // User info - obtener elementos cuando se usen
    const nombreUsuario = getEl('nombre-usuario');
    if (nombreUsuario) nombreUsuario.textContent = usuario.usuario;
    
    const profileName = getEl('profile-name');
    if (profileName) profileName.textContent = usuario.usuario;
    
    const profileAvatar = getEl('profile-avatar');
    if (profileAvatar) {
        const initial = usuario.usuario.charAt(0).toUpperCase();
        profileAvatar.innerHTML = `<span style="font-size: 18px; font-weight: 700; color: var(--accent-solid, #0078D4);">${initial}</span>`;
    }

    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const page = item.dataset.page;
            if (page === 'reportes') {
                window.api.irA('reportes');
            } else if (page === 'ajustes') {
                window.api.irA('ajustes');
            }
        });
    });

    // Admin link
    const linkAdmin = getEl('link-admin');
    if (linkAdmin) {
        // Mostrar botón solo si es admin
        if (usuario && usuario.usuario === 'admin') {
            linkAdmin.style.display = 'flex';
        }
        linkAdmin.addEventListener('click', () => {
            window.api.irA('gestion');
        });
    }

    // Helpers
    function getNivelUsuario(progreso) {
        if (progreso >= 100) return { nombre: 'Experto', clase: 'experto' };
        if (progreso >= 76) return { nombre: 'Avanzado', clase: 'avanzado' };
        if (progreso >= 26) return { nombre: 'Intermedio', clase: 'intermedio' };
        return { nombre: 'Principiante', clase: 'principiante' };
    }

    function getMensajeProgreso(progreso, nombre) {
        if (progreso >= 100) return `Felicidades, ${nombre}! Completaste todo.`;
        if (progreso >= 76) return `Casi lo logras, ${nombre}!`;
        if (progreso >= 51) return `Impresionante progreso, ${nombre}!`;
        if (progreso >= 26) return `Vas bien, ${nombre}. Sigue aprendiendo.`;
        if (progreso > 0) return `Bienvenido, ${nombre}. Cada paso cuenta.`;
        return `Comienza tu viaje de aprendizaje!`;
    }

    function getMensajeRacha(dias) {
        if (dias <= 0) return 'Comienza tu racha hoy mismo.';
        return `${dias} dias de aprendizaje consecutivo`;
    }

    // Progress Bar animation (updated for new UI)
    function animateProgressRing(percent) {
        const progressFill = getEl('progress-bar-fill');
        if (progressFill) {
            progressFill.style.width = `${percent}%`;
        }
        
        // Mantener compatibilidad si existe el anillo legacy
        const progressRing = getEl('progress-ring');
        if (progressRing && progressRing.tagName === 'circle') {
            const circumference = 283;
            const offset = circumference - (percent / 100) * circumference;
            progressRing.style.strokeDashoffset = offset;
        }
    }

    // Render stats
    function renderStats(progresoData, categoriasData) {
        let totalNiveles = 0;
        let completadosCount = 0;
        
        categoriasData.forEach(cat => {
            if (cat.subcategorias) {
                cat.subcategorias.forEach(sub => {
                    if (sub.niveles) {
                        totalNiveles += sub.niveles.length;
                        sub.niveles.forEach(nivel => {
                            if (progresoData.some(p => p.id_nivel === nivel.id_nivel && p.completado)) {
                                completadosCount++;
                            }
                        });
                    }
                });
            }
        });
        
        const progreso = totalNiveles > 0 ? Math.round((completadosCount / totalNiveles) * 100) : 0;

        const nivel = getNivelUsuario(progreso);
        
        const profileBadge = getEl('profile-badge');
        if (profileBadge) {
            profileBadge.textContent = nivel.nombre;
            profileBadge.className = `profile-badge badge-${nivel.clase}`;
        }

        const progresoTexto = getEl('progreso-texto');
        if (progresoTexto) progresoTexto.textContent = `${progreso}%`;
        
        const progresoMensaje = getEl('progreso-mensaje');
        if (progresoMensaje) progresoMensaje.textContent = getMensajeProgreso(progreso, usuario.usuario);
        
        const nivelesCompletados = getEl('niveles-completados');
        if (nivelesCompletados) nivelesCompletados.textContent = completadosCount;
        
        const nivelesTotal = getEl('niveles-total');
        if (nivelesTotal) nivelesTotal.textContent = totalNiveles;

        animateProgressRing(progreso);

        const streak = usuario.racha || 0;
        
        const streakCount = getEl('streak-count');
        if (streakCount) streakCount.textContent = streak <= 0 ? '0 días' : `${streak} días`;

        const restantes = 3 - (streak % 3 || 0);
        const periodoMensaje = getEl('periodo-mensaje');
        if (periodoMensaje) {
            if (restantes > 0 && streak > 0) {
                periodoMensaje.textContent = `Completa ${restantes} niveles para mantener tu racha`;
            } else if (streak > 0) {
                periodoMensaje.textContent = `Racha activa! Sigue asi`;
            } else {
                periodoMensaje.textContent = 'Completa niveles para comenzar tu racha';
            }
        }

        return { progreso, completadosCount, totalNiveles, progresoData };
    }

    // Get next level
    function getSiguienteNivel(categoriasData, progresoData) {
        const completados = new Set(progresoData.filter(p => p.completado).map(p => p.id_nivel));
        
        for (const cat of categoriasData) {
            if (cat.subcategorias) {
                for (const sub of cat.subcategorias) {
                    if (sub.niveles) {
                        for (const nivel of sub.niveles) {
                            if (!completados.has(nivel.id_nivel)) {
                                return nivel.titulo;
                            }
                        }
                    }
                }
            }
        }
        return 'Todos completados';
    }

    // Render category cards
    function renderCategorias(categoriasData, progresoData, stats) {
        const categoriasGrid = getEl('categorias-grid');
        if (!categoriasGrid) {
            return;
        }

        categoriasGrid.innerHTML = '';

        categoriasData.forEach((cat, index) => {
            let totalNiveles = 0;
            let completadosCount = 0;
            
            if (cat.subcategorias) {
                cat.subcategorias.forEach(sub => {
                    if (sub.niveles) {
                        totalNiveles += sub.niveles.length;
                        sub.niveles.forEach(nivel => {
                            if (progresoData.some(p => p.id_nivel === nivel.id_nivel && p.completado)) {
                                completadosCount++;
                            }
                        });
                    }
                });
            }
            
            const percent = totalNiveles > 0 ? Math.round((completadosCount / totalNiveles) * 100) : 0;
            const catClass = cat.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');

            const card = document.createElement('article');
            card.className = `categoria-card animate-scale-in cat-${catClass}`;
            card.style.animationDelay = `${index * 100}ms`;

            let subcategoriasHtml = '';
            if (cat.subcategorias) {
                const subcategoriasConNiveles = cat.subcategorias.filter(sub => 
                    sub.niveles && sub.niveles.length > 0
                ).slice(0, 3);
                
                subcategoriasHtml = subcategoriasConNiveles.map(sub => {
                    const subCompletados = sub.niveles ? sub.niveles.filter(n => 
                        progresoData.some(p => p.id_nivel === n.id_nivel && p.completado)
                    ).length : 0;
                    const subTotal = sub.niveles ? sub.niveles.length : 0;
                    const isDone = subCompletados === subTotal && subTotal > 0;

                    return `
                        <div class="subcategoria ${isDone ? 'done' : ''}">
                            <span>${sub.nombre}</span>
                            <span class="sub-progress">${subCompletados}/${subTotal}</span>
                        </div>`;
                }).join('');
            }

            card.innerHTML = `
                <div class="categoria-header" style="display: flex; align-items: center; gap: 16px;">
                    <div class="categoria-icon">${getCategoriaIcon(cat.nombre)}</div>
                    <div style="flex: 1;">
                        <h4 style="margin: 0; font-size: 18px;">${cat.nombre}</h4>
                        <p style="font-size: 12px; opacity: 0.7; margin: 4px 0 0 0;">${completadosCount}/${totalNiveles} Niveles</p>
                    </div>
                </div>
                <div class="categoria-progress-bar" style="height: 6px; background: var(--hover-bg); border-radius: 3px; margin: 16px 0; overflow: hidden;">
                    <div class="progress-fill" style="width: ${percent}%; height: 100%; background: var(--accent-solid); border-radius: 3px; transition: width 1s ease-out;"></div>
                </div>
                <div class="niveles-resumen" style="display: flex; flex-direction: column; gap: 8px;">
                    ${subcategoriasHtml}
                </div>
                <button class="btn-expandir" data-id="${cat.id_categoria}" style="
                    margin-top: 20px;
                    width: 100%;
                    padding: 12px;
                    background: var(--bg-color);
                    border: 1px solid var(--border-color);
                    border-radius: 10px;
                    color: var(--text-color);
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                " onmouseover="this.style.background='var(--hover-bg)'; this.style.borderColor='var(--accent-solid)'" onmouseout="this.style.background='var(--bg-color)'; this.style.borderColor='var(--border-color)'">
                    Explorar niveles
                    <span>→</span>
                </button>
            `;

            card.querySelector('.btn-expandir').addEventListener('click', () => toggleNiveles(cat.id_categoria, card));
            categoriasGrid.appendChild(card);
        });
    }

    function getCategoriaIcon(nombre) {
        const icons = {
            'Office': '📎', 'office': '📎',
            'Navegación en Internet': '🌐', 'Internet': '🌐', 'internet': '🌐',
            'Navegación en Windows': '🪟', 'Windows': '🪟', 'windows': '🪟',
            'Trucos Adicionales': '💡', 'Trucos': '💡', 'trucos': '💡'
        };
        return icons[nombre] || '📚';
    }

// Toggle niveles - abrir overlay modal
    let overlayActivo = null;
    
    async function toggleNiveles(idCategoria, cardElement) {
        // Si ya hay un overlay activo para esta categoría, cerrarlo
        if (overlayActivo === idCategoria) {
            cerrarOverlay();
            return;
        }
        
        // Cerrar cualquier overlay anterior
        if (overlayActivo !== null) {
            cerrarOverlay();
        }
        
        try {
            const progresoResult = await window.api.getProgreso(usuario.id_usuario);
            const progresoData = progresoResult.niveles || [];
            const completados = new Set(progresoData.filter(p => p.completado).map(p => p.id_nivel));

            // Obtener subcategorías para esta categoría
            const subcategorias = await window.api.getSubcategoriasPorCategoria(idCategoria);
            for (const sub of subcategorias) {
                sub.niveles = await window.api.getNivelesPorSubcategoria(sub.id_subcategoria);
            }

            // Filtrar solo subcategorías con niveles
            const subcategoriasConNiveles = subcategorias.filter(sub => 
                sub.niveles && sub.niveles.length > 0
            );

            if (subcategoriasConNiveles.length === 0) {
                showToast('No hay niveles disponibles en esta categoría.', 'info');
                return;
            }

            // Crear overlay
            const overlay = document.createElement('div');
            overlay.id = 'niveles-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.75);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.25s ease;
                backdrop-filter: blur(8px);
            `;

            // Obtener nombre de categoría para el título
            const categorias = await window.api.getCategorias();
            const categoria = categorias.find(c => c.id_categoria === idCategoria);
            const catNombre = categoria ? categoria.nombre : 'Niveles';

            let html = `
                <style>
                    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                    @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
                    @keyframes slideUp { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-20px); } }
                    #overlay-content::-webkit-scrollbar { width: 6px; }
                    #overlay-content::-webkit-scrollbar-track { background: transparent; }
                    #overlay-content::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 3px; }
                    #overlay-content::-webkit-scrollbar-thumb:hover { background: var(--text-secondary); }
                </style>
                <div id="overlay-content" style="
                    background: var(--bg-secondary);
                    border-radius: 12px;
                    width: 90%;
                    max-width: 720px;
                    max-height: 85vh;
                    overflow-y: auto;
                    padding: 28px;
                    box-shadow: 0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1);
                    animation: slideDown 0.25s ease;
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; border-bottom: 1px solid var(--border-color); padding-bottom: 20px;">
                        <h3 style="margin: 0; color: var(--text-color); font-size: 22px; font-weight: 600;">${catNombre}</h3>
                        <button id="btn-cerrar-overlay" style="
                            background: var(--bg-color);
                            border: 1px solid var(--border-color);
                            color: var(--text-color);
                            font-size: 18px;
                            width: 32px;
                            height: 32px;
                            cursor: pointer;
                            border-radius: 6px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            transition: all 0.15s;
                        " onmouseover="this.style.background='var(--accent-pastel)'; this.style.borderColor='var(--accent-solid)'" onmouseout="this.style.background='var(--bg-color)'; this.style.borderColor='var(--border-color)'">×</button>
                    </div>
            `;

            subcategoriasConNiveles.forEach(sub => {
                html += `<div style="font-weight: 600; color: var(--accent-solid); margin: 24px 0 14px 0; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px;">${sub.nombre}</div>`;
                sub.niveles.forEach(nivel => {
                    const estaCompletado = completados.has(nivel.id_nivel);
                    const ruta = nivel.ruta_archivo || '';
                    const tiempo = nivel.tiempo_estimado_min ? `(${nivel.tiempo_estimado_min} min)` : '';
                    
                    html += `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 10px; margin-bottom: 12px; transition: all 0.2s ease;">
                            <div style="flex: 1;">
                                <div style="display: flex; align-items: center; gap: 10px;">
                                    <span style="background: var(--accent-solid); color: white; padding: 4px 10px; border-radius: 5px; font-size: 12px; font-weight: 600;">${nivel.nivel_ordinal}</span>
                                    <strong style="color: var(--text-color); font-size: 15px; font-weight: 500;">${nivel.titulo}</strong>
                                </div>
                                <div style="font-size: 13px; color: var(--text-secondary); margin-top: 6px; margin-left: 44px;">${nivel.descripcion || ''} ${tiempo}</div>
                                ${estaCompletado ? '<span style="display: inline-block; margin-left: 44px; margin-top: 6px; padding: 3px 10px; background: var(--accent-pastel); color: var(--accent-solid); border-radius: 5px; font-size: 12px; font-weight: 600;">✓ Completado</span>' : ''}
                            </div>
                            <button class="btn-iniciar" data-id="${nivel.id_nivel}" data-ruta="${encodeURIComponent(ruta)}" data-titulo="${encodeURIComponent(nivel.titulo)}" data-idsub="${sub.id_subcategoria}" style="
                                padding: 10px 24px;
                                background: ${estaCompletado ? 'transparent' : 'var(--accent-solid)'};
                                color: ${estaCompletado ? 'var(--accent-solid)' : 'white'};
                                border: 2px solid ${estaCompletado ? 'var(--accent-solid)' : 'var(--accent-solid)'};
                                border-radius: 8px;
                                font-size: 14px;
                                font-weight: 600;
                                cursor: pointer;
                                white-space: nowrap;
                                transition: all 0.2s ease;
                            ">${estaCompletado ? 'Repetir' : 'Iniciar'}</button>
                        </div>
                    `;
                });
            });

            html += `
                    <button id="btn-ocultar-niveles" style="
                        width: 100%;
                        margin-top: 28px;
                        padding: 14px;
                        background: transparent;
                        color: var(--text-secondary);
                        border: 1px solid var(--border-color);
                        border-radius: 8px;
                        font-size: 14px;
                        font-weight: 500;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    ">Ocultar niveles</button>
                </div>
            `;

            overlay.innerHTML = html;
            document.body.appendChild(overlay);
            overlayActivo = idCategoria;

            // Event listeners
            overlay.querySelector('#btn-cerrar-overlay').addEventListener('click', cerrarOverlay);
            overlay.querySelector('#btn-ocultar-niveles').addEventListener('click', cerrarOverlay);
            
            // Hover effect for ocultar niveles button
            const btnOcultar = overlay.querySelector('#btn-ocultar-niveles');
            btnOcultar.addEventListener('mouseover', function() {
                this.style.background = 'var(--bg-color)';
                this.style.borderColor = 'var(--text-secondary)';
            });
            btnOcultar.addEventListener('mouseout', function() {
                this.style.background = 'transparent';
                this.style.borderColor = 'var(--border-color)';
            });
            
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) cerrarOverlay();
            });

            overlay.querySelectorAll('.btn-iniciar').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.dataset.id;
                    const ruta = decodeURIComponent(e.target.dataset.ruta);
                    const titulo = decodeURIComponent(e.target.dataset.titulo);
                    const idSub = e.target.dataset.idsub;
                    
                    if (ruta && ruta !== 'null' && ruta !== '') {
                        sessionStorage.setItem('simulacion_id', id);
                        sessionStorage.setItem('simulacion_ruta', ruta);
                        sessionStorage.setItem('simulacion_titulo', titulo);
                        sessionStorage.setItem('simulacion_id_subcategoria', idSub);
                        window.api.irA('simulacion');
                    } else {
                        showToast('Esta lección aún no tiene contenido disponible.', 'info');
                    }
                });
            });

        } catch (error) {
            console.error('Error:', error);
            showToast('Error al cargar niveles.', 'error');
        }
    }

    function cerrarOverlay() {
        const overlay = document.getElementById('niveles-overlay');
        if (overlay) {
            overlay.style.animation = 'slideUp 0.2s ease';
            setTimeout(() => {
                overlay.remove();
            }, 200);
        }
        overlayActivo = null;
    }

    // Load all data
    async function cargarDashboard() {
        try {
            const [categorias, progreso] = await Promise.all([
                window.api.getCategorias(),
                window.api.getProgreso(usuario.id_usuario)
            ]);
            
            if (!categorias || categorias.length === 0) {
                const grid = getEl('categorias-grid');
                if (grid) grid.innerHTML = '<p style="color: var(--accent-solid); padding: 20px;">No hay categorías disponibles en la base de datos</p>';
                return;
            }

            // Cargar subcategorías y niveles
            const categoriasConDatos = await Promise.all(
                categorias.map(async cat => {
                    const subcategorias = await window.api.getSubcategoriasPorCategoria(cat.id_categoria);
                    for (const sub of subcategorias) {
                        sub.niveles = await window.api.getNivelesPorSubcategoria(sub.id_subcategoria);
                    }
                    return { ...cat, subcategorias };
                })
            );

            // Extraer la lista de niveles para compatibilidad con funciones de renderizado
            const progresoData = progreso.niveles || [];

            const stats = renderStats(progresoData, categoriasConDatos);
            const siguiente = getSiguienteNivel(categoriasConDatos, progresoData);
            const siguienteNivelNombre = getEl('siguiente-nivel-nombre');
            if (siguienteNivelNombre) siguienteNivelNombre.textContent = siguiente;

            renderCategorias(categoriasConDatos, progresoData, stats);
        } catch (error) {
            // Error loading dashboard
        }
    }

    // Button handlers
    const btnCerrarSesion = getEl('btn-cerrar-sesion');
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', () => {
            sessionStorage.removeItem('usuario');
            localStorage.removeItem('usuario');
            window.api.irA('login');
        });
    }

    const btnFullscreen = getEl('btn-fullscreen');
    if (btnFullscreen) {
        btnFullscreen.addEventListener('click', () => {
            window.api.toggleFullScreen();
        });
    }

    // Init
    cargarDashboard();
})();