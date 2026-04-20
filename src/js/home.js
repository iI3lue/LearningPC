// home.js - Dashboard Informativo Learning PC

(function() {
    // Función para mostrar toast
    function showToast(message, type = 'info') {
        const toast = document.getElementById('home-toast');
        const toastMessage = toast ? toast.querySelector('.toast-message') : null;
        if (!toast || !toastMessage) return;
        
        toast.classList.remove('success', 'error', 'info');
        toast.classList.add(type);
        toastMessage.textContent = message;
        toast.classList.add('visible');
        
        setTimeout(() => {
            toast.classList.remove('visible');
        }, 3000);
    }

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
    if (profileAvatar) profileAvatar.textContent = usuario.usuario.charAt(0).toUpperCase();

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

    // Progress ring animation
    function animateProgressRing(percent) {
        const progressRing = getEl('progress-ring');
        if (!progressRing) return;
        const circumference = 283;
        const offset = circumference - (percent / 100) * circumference;
        progressRing.style.strokeDashoffset = offset;
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
            let completados = 0;
            
            if (cat.subcategorias) {
                cat.subcategorias.forEach(sub => {
                    if (sub.niveles) {
                        totalNiveles += sub.niveles.length;
                        sub.niveles.forEach(nivel => {
                            if (progresoData.some(p => p.id_nivel === nivel.id_nivel && p.completado)) {
                                completados++;
                            }
                        });
                    }
                });
            }
            
            const percent = totalNiveles > 0 ? Math.round((completados / totalNiveles) * 100) : 0;

            const card = document.createElement('article');
            card.className = 'categoria-card';
            card.style.cssText = 'background: var(--sidebar-bg); border-radius: 8px; padding: 20px; border: 1px solid var(--border-color); margin-bottom: 16px; box-shadow: var(--elevation-1);';
            card.dataset.idCategoria = cat.id_categoria;

            let subcategoriasHtml = '';
            if (cat.subcategorias) {
                subcategoriasHtml = cat.subcategorias.map(sub => {
                    const subCompletados = sub.niveles ? sub.niveles.filter(n => 
                        progresoData.some(p => p.id_nivel === n.id_nivel && p.completado)
                    ).length : 0;
                    const subTotal = sub.niveles ? sub.niveles.length : 0;
                    return `<li style="padding: 8px 0; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; color: var(--text-color);"><span>${sub.nombre}</span><span style="color: var(--accent-solid); font-weight: 600;">${subCompletados}/${subTotal}</span></li>`;
                }).join('');
            }

            card.innerHTML = `
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                    <span style="font-size: 24px;">${getCategoriaIcon(cat.nombre)}</span>
                    <h4 style="margin: 0; flex: 1;">${cat.nombre}</h4>
                    <span style="font-weight: 600; color: var(--accent-solid);">${completados}/${totalNiveles}</span>
                </div>
                <div style="height: 6px; background: var(--border-color); border-radius: 3px; margin-bottom: 16px; overflow: hidden;">
                    <div style="height: 100%; width: ${percent}%; background: var(--accent-solid); border-radius: 3px;"></div>
                </div>
                <ul style="list-style: none; padding: 0; margin: 0 0 16px 0; color: var(--text-color);">${subcategoriasHtml}</ul>
                <button class="btn-expandir" data-id="${cat.id_categoria}" style="width: 100%; padding: 10px; background: var(--accent-pastel); color: var(--accent-solid); border: none; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer;">Ver niveles</button>
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

// Toggle niveles
    async function toggleNiveles(idCategoria, cardElement) {
        try {
            const progreso = await window.api.getProgreso(usuario.id_usuario);
            const completados = new Set(progreso.filter(p => p.completado).map(p => p.id_nivel));

            // Obtener subcategorías para esta categoría
            const subcategorias = await window.api.getSubcategoriasPorCategoria(idCategoria);
            for (const sub of subcategorias) {
                sub.niveles = await window.api.getNivelesPorSubcategoria(sub.id_subcategoria);
            }

            const container = document.createElement('div');
            container.className = 'niveles-expandidos';
            container.style.cssText = 'margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border-color);';

            if (subcategorias.length === 0) {
                container.innerHTML = '<p>No hay subcategorías disponibles.</p>';
            } else {
                let html = '';
                subcategorias.forEach(sub => {
                    html += `<div style="font-weight: 600; color: var(--accent-solid); margin: 16px 0 8px 0;">${sub.nombre}</div>`;
                    if (sub.niveles && sub.niveles.length > 0) {
                        sub.niveles.forEach(nivel => {
                            const estaCompletado = completados.has(nivel.id_nivel);
                            const ruta = nivel.ruta_archivo || '';
                            const tiempo = nivel.tiempo_estimado_min ? `(${nivel.tiempo_estimado_min} min)` : '';
                            
                            html += `
                                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: 8px;">
                                    <div>
                                        <strong style="font-size: 13px; color: var(--text-color);">Nivel ${nivel.nivel_ordinal}: ${nivel.titulo}</strong>
                                        <div style="font-size: 12px; color: var(--text-secondary);">${nivel.descripcion || ''} ${tiempo}</div>
                                        ${estaCompletado ? '<span style="display: inline-block; margin-left: 8px; padding: 2px 8px; background: var(--accent-pastel); color: var(--accent-solid); border-radius: 4px; font-size: 11px;">✓ Completado</span>' : ''}
                                    </div>
                                    <button class="btn-iniciar" data-id="${nivel.id_nivel}" data-ruta="${encodeURIComponent(ruta)}" data-titulo="${encodeURIComponent(nivel.titulo)}" data-idsub="${sub.id_subcategoria}" style="padding: 8px 16px; background: var(--accent-solid); color: white; border: none; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer;">${estaCompletado ? 'Repetir' : 'Iniciar'}</button>
                                </div>
                            `;
                        });
                    } else {
                        html += '<p style="font-size: 12px; color: var(--text-secondary);">No hay niveles en esta subcategoría.</p>';
                    }
                });
                container.innerHTML = html;
            }

            cardElement.appendChild(container);

            container.querySelectorAll('.btn-iniciar').forEach(btn => {
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
            // Error loading levels
        }
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

            const stats = renderStats(progreso, categoriasConDatos);
            const siguiente = getSiguienteNivel(categoriasConDatos, progreso);
            const siguienteNivelNombre = getEl('siguiente-nivel-nombre');
            if (siguienteNivelNombre) siguienteNivelNombre.textContent = siguiente;

            renderCategorias(categoriasConDatos, progreso, stats);
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