/**
 * 1. АНИМАЦИЯ КОРЗИНЫ
 */
function animateCart() {
    const cartBtn = document.getElementById('cart-button');
    if (!cartBtn) return;
    
    // Сброс анимации для повторного срабатывания
    cartBtn.classList.remove('cart-animate');
    void cartBtn.offsetWidth; // Магия: принудительный пересчет стилей (reflow)
    cartBtn.classList.add('cart-animate');
    
    // Удаляем класс после завершения (0.5с как в CSS)
    setTimeout(() => {
        cartBtn.classList.remove('cart-animate');
    }, 500);
}

/**
 * 2. МОБИЛЬНОЕ МЕНЮ (Логика)
 */
function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const dropdown = document.getElementById('mobile-menu-dropdown');

    if (!btn || !dropdown) return;

    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    newBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = dropdown.classList.contains('hidden');
        
        if (isHidden) {
            dropdown.classList.remove('hidden');
            newBtn.innerHTML = '<i class="fas fa-times text-2xl"></i>';
        } else {
            dropdown.classList.add('hidden');
            newBtn.innerHTML = '<i class="fas fa-bars text-2xl"></i>';
        }
    });

    document.addEventListener('click', (e) => {
        if (!dropdown.classList.contains('hidden') && !dropdown.contains(e.target) && e.target !== newBtn) {
            dropdown.classList.add('hidden');
            newBtn.innerHTML = '<i class="fas fa-bars text-2xl"></i>';
        }
    });
}

/**
 * 3. ЗАГРУЗКА КОМПОНЕНТОВ
 */
async function loadComponent(id, url) {
    const element = document.getElementById(id);
    if (!element) return;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Ошибка загрузки: ${url}`);
        const html = await response.text();
        element.innerHTML = html;

        if (id === 'nav-res') {
            setActiveLink();
            initMobileMenu();
        }
        if (id === 'callback-modal-res') {
            initPhoneMask();
        }
        if (id === 'breadcrumbs-res') {
            updateBreadcrumbs();
        }
    } catch (error) {
        console.error(`Ошибка компонента #${id}:`, error);
    }
}

/**
 * 4. ПОДСВЕТКА АКТИВНОЙ ССЫЛКИ
 */
function setActiveLink() {
    let currentPage = window.location.pathname.split("/").pop() || 'index.html';
    currentPage = currentPage.split('?')[0]; 
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === 'blok-kataloga.html ' && href === 'blok-kataloga.html ')) {
            link.classList.add('active');
        }
    });
}

/**
 * 5. ХЛЕБНЫЕ КРОШКИ
 */
function updateBreadcrumbs() {
    const breadcrumbLabel = document.getElementById('current-page-name');
    const breadcrumbContainer = document.getElementById('breadcrumbs-res');
    if (!breadcrumbLabel || !breadcrumbContainer) return;

    const pageTitles = {
        'index.html': 'Главная',
        'katalog.html ': 'Каталог',
        'ceny.html ': 'Цены',
        'nashi-raboty.html ': 'Галерея',
        'dostavka-i-oplata.html ': 'Доставка',
        'o-kompanii.html ': 'О компании',
        'kontakty.html ': 'Контакты'
    };

    let currentPage = window.location.pathname.split("/").pop() || 'index.html';
    currentPage = currentPage.split('?')[0];

    if (currentPage === 'index.html') {
        breadcrumbContainer.classList.add('hidden');
    } else {
        breadcrumbContainer.classList.remove('hidden');
        breadcrumbLabel.innerText = pageTitles[currentPage] || 'Страница';
    }
}

/**
 * 6. МОДАЛЬНОЕ ОКНО
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
 * 7. МАСКА ТЕЛЕФОНА
 */
function initPhoneMask() {
    const phoneInput = document.getElementById("user-phone");
    if (phoneInput && typeof Inputmask !== "undefined") {
        Inputmask({"mask": "+7 (999) 999-99-99"}).mask(phoneInput);
    }
}

/**
 * 8. ИНИЦИАЛИЗАЦИЯ
 */
document.addEventListener('DOMContentLoaded', () => {
    loadComponent('header-top-res', 'components/header.html');
    loadComponent('nav-res', 'components/nav.html');
    loadComponent('breadcrumbs-res', 'components/breadcrumbs.html');
    loadComponent('footer-res', 'components/footer.html');
    loadComponent('callback-modal-res', 'components/zakaz-zvonka.html ');

    if (document.getElementById('catalog-res')) {
        loadComponent('catalog-res', 'components/blok-kataloga.html ');
    }

    if (!document.querySelector('script[src*="inputmask"]')) {
        const maskScript = document.createElement('script');
        maskScript.src = "https://cdn.jsdelivr.net/npm/inputmask@5.0.8/dist/inputmask.min.js";
        maskScript.onload = initPhoneMask;
        document.head.appendChild(maskScript);
    }
});

/**
 * 9. ГЛОБАЛЬНЫЙ ОБРАБОТЧИК КЛИКОВ
 */
document.addEventListener('click', (e) => {
    // 9.1 Модальное окно (Заказать звонок / Телефон)
    const trigger = e.target.closest('.trigger-callback');
    if (trigger) {
        const isMobile = window.innerWidth <= 768;
        const isPhoneLink = trigger.tagName === 'A' && trigger.getAttribute('href')?.startsWith('tel:');

        // На ПК открываем всегда. На мобилке — только если это НЕ ссылка "tel:"
        if (!isMobile || (isMobile && !isPhoneLink)) {
            e.preventDefault();
            openCallbackModal();
        }
    }

    // 9.2 Анимация корзины при клике на "В корзину"
    // Сработает на любой кнопке с классом .buy-btn или если внутри текст "корзину"
    const buyBtn = e.target.closest('.buy-btn') || (e.target.closest('button') && e.target.innerText.toLowerCase().includes('корзину'));
    if (buyBtn) {
        animateCart();
    }

    // 9.3 Закрытие модалки
    const modal = document.getElementById('callback-modal');
    if (modal && (e.target.closest('#close-modal') || e.target === modal)) {
        closeCallbackModal();
    }
});