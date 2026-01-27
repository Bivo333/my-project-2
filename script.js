/**
 * 1. ЗАГРУЗКА КОМПОНЕНТОВ
 */
async function loadComponent(id, url) {
    const element = document.getElementById(id);
    if (!element) return;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Ошибка загрузки: ${url}`);
        const html = await response.text();
        element.innerHTML = html;

        // Инициализация маски телефона при загрузке модалки
        if (id === 'callback-modal-res') {
            initPhoneMask();
        }

        // Подсветка ссылок при загрузке навигации
        if (id === 'nav-res') {
            setActiveLink();
        }

        // Обновление крошек при их загрузке
        if (id === 'breadcrumbs-res') {
            updateBreadcrumbs();
        }
    } catch (error) {
        console.error(`Ошибка компонента #${id}:`, error);
    }
}

/**
 * 2. ПОДСВЕТКА АКТИВНОЙ ССЫЛКИ
 */
function setActiveLink() {
    let currentPage = window.location.pathname.split("/").pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.classList.remove('active');
        // Добавлена проверка для catalog-page.html, чтобы ссылка "Каталог" была активна
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === 'catalog-page.html' && href === 'catalog.html')) {
            link.classList.add('active');
        }
    });
}

/**
 * 3. ХЛЕБНЫЕ КРОШКИ
 */
function updateBreadcrumbs() {
    const breadcrumbLabel = document.getElementById('current-page-name');
    const breadcrumbContainer = document.getElementById('breadcrumbs-res');
    if (!breadcrumbLabel || !breadcrumbContainer) return;

    const pageTitles = {
        'index.html': 'Главная',
        'catalog.html': 'Каталог',
        'catalog-page.html': 'Каталог', // Добавлена новая страница
        'prices.html': 'Цены',
        'gallery.html': 'Галерея',
        'delivery.html': 'Доставка',
        'about.html': 'О компании',
        'contacts.html': 'Контакты'
    };

    let currentPage = window.location.pathname.split("/").pop() || 'index.html';
    
    // Скрываем крошки на главной
    if (currentPage === 'index.html') {
        breadcrumbContainer.classList.add('hidden');
    } else {
        breadcrumbContainer.classList.remove('hidden');
        breadcrumbLabel.innerText = pageTitles[currentPage] || 'Страница';
    }
}

/**
 * 4. МОДАЛЬНОЕ ОКНО (Заказать звонок)
 */
function openCallbackModal() {
    const modal = document.getElementById('callback-modal');
    const content = document.getElementById('modal-content');
    if (!modal || !content) return;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        content.classList.replace('scale-95', 'scale-100');
        content.classList.replace('opacity-0', 'opacity-100');
    }, 10);
}

function closeCallbackModal() {
    const modal = document.getElementById('callback-modal');
    const content = document.getElementById('modal-content');
    if (!modal || !content) return;

    content.classList.replace('scale-100', 'scale-95');
    content.classList.replace('opacity-100', 'opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = 'auto';
    }, 200);
}

/**
 * 5. МАСКА ТЕЛЕФОНА
 */
function initPhoneMask() {
    const phoneInput = document.getElementById("user-phone");
    if (phoneInput && typeof Inputmask !== "undefined") {
        Inputmask({"mask": "+7 (999) 999-99-99"}).mask(phoneInput);
    }
}

/**
 * 6. ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ
 */
document.addEventListener('DOMContentLoaded', () => {
    // Основные компоненты
    loadComponent('header-top-res', 'components/header.html');
    loadComponent('nav-res', 'components/nav.html');
    loadComponent('breadcrumbs-res', 'components/breadcrumbs.html');
    loadComponent('footer-res', 'components/footer.html');
    loadComponent('callback-modal-res', 'components/callback-modal.html');

    // Загрузка каталога (теперь берется из components/catalog.html)
    if (document.getElementById('catalog-res')) {
        loadComponent('catalog-res', 'components/catalog.html');
    }

    // Подгрузка скрипта маски
    if (!document.querySelector('script[src*="inputmask"]')) {
        const maskScript = document.createElement('script');
        maskScript.src = "https://cdn.jsdelivr.net/npm/inputmask@5.0.8/dist/inputmask.min.js";
        maskScript.onload = initPhoneMask;
        document.head.appendChild(maskScript);
    }
});

/**
 * 7. ОБРАБОТКА КЛИКОВ
 */
document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.trigger-callback');
    
    if (trigger) {
        const isTouchDevice = (('ontouchstart' in window) || (navigator.maxTouchPoints > 0));
        const isMobileWidth = window.innerWidth <= 1024;
        const isMobile = isTouchDevice || isMobileWidth;
        const isPhoneLink = trigger.tagName === 'A' && trigger.getAttribute('href')?.startsWith('tel:');

        if (!isMobile) {
            if (isPhoneLink) e.preventDefault();
            openCallbackModal();
        } else {
            if (!isPhoneLink) {
                e.preventDefault();
                openCallbackModal();
            }
        }
    }

    const modal = document.getElementById('callback-modal');
    if (e.target.closest('#close-modal') || e.target === modal) {
        closeCallbackModal();
    }
});