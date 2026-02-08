/**
 * ЧИСТЫЙ РОУТЕР ДЛЯ ДИНАМИЧЕСКОГО САЙТА (SPA)
 */
const Router = {
    init() {
        if (window.isRouterInitialized) return;
        window.isRouterInitialized = true;

        document.addEventListener('click', e => {
            const link = e.target.closest('a');
            if (link && link.href.includes(window.location.origin) && !link.hasAttribute('data-no-dynamic') && !link.hasAttribute('data-fancybox')) {
                const href = link.getAttribute('href');
                if (href && (href.endsWith('.html') || href.startsWith('/') || href.startsWith('./'))) {
                    // Игнорируем якоря и открытие в новой вкладке
                    if (link.hash || link.target === '_blank') return;
                    e.preventDefault();
                    this.loadPage(link.href);
                }
            }
        });

        window.addEventListener('popstate', () => this.loadPage(window.location.href, false));

        // --- ЛОГИКА ПОДХВАТА ПРЯМЫХ ССЫЛОК ---
        const urlParams = new URLSearchParams(window.location.search);
        const pageToLoad = urlParams.get('load');
        if (pageToLoad) {
            window.history.replaceState({}, '', pageToLoad);
            this.loadPage(pageToLoad, false);
        }
    },

    // 1. Метод для закрытия мобильного меню
    closeMobileMenu() {
        const dropdown = document.getElementById('mobile-menu-dropdown');
        const btn = document.getElementById('mobile-menu-btn');
        if (dropdown && !dropdown.classList.contains('hidden')) {
            dropdown.classList.add('hidden');
            if (btn) btn.innerHTML = '<i class="fas fa-bars text-2xl"></i>';
        }
    },

    async loadPage(url, pushState = true) {
        try {
            const mainContent = document.getElementById('main-content') || document.querySelector('main');
            if (!mainContent) return;
    
            this.closeMobileMenu();
            mainContent.classList.add('loading');
    
            const response = await fetch(url);
            if (!response.ok) throw new Error('Сетевая ошибка');
            
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const newMain = doc.querySelector('main');
    
            if (newMain) {
                setTimeout(async () => {
                    // 1. Обновляем контент и метаданные
                    mainContent.innerHTML = newMain.innerHTML;
                    mainContent.className = newMain.className;
                    document.title = doc.title;
                    
                    if (pushState) window.history.pushState({}, '', url);
    
                    // 2. УНИВЕРСАЛЬНАЯ ЗАГРУЗКА КОМПОНЕНТОВ
                    // Роутер просто ищет ID на странице и подгружает нужные файлы
                    const tasks = [];
    
                    if (document.getElementById('hero-slider-res')) {
                        tasks.push(window.loadComponent('hero-slider-res', '/components/hero-slider.html'));
                    }
                    
                    if (document.getElementById('catalog-res')) {
                        tasks.push(window.loadComponent('catalog-res', '/components/blok-kataloga.html'));
                    }
    
                    if (document.getElementById('catalog-sm-res')) {
                        tasks.push(window.loadComponent('catalog-sm-res', '/components/blok-kataloga-sm.html'));
                    }
    
                    // Ждем загрузки всех найденных компонентов
                    if (tasks.length > 0) await Promise.all(tasks);
    
                    // 3. Перезапуск скриптов (Swiper, маски и т.д.)
                    if (typeof initAllScripts === 'function') {
                        initAllScripts();
                    }
                    
                    mainContent.classList.remove('loading');
                    window.scrollTo(0, 0);
                }, 100); 
            }
        } catch (error) {
            console.error('Ошибка роутера:', error);
            if (pushState) window.location.href = url;
        }
    },
};

window.AppRouter = Router;