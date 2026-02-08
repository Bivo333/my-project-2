/**
 * ГЛОБАЛЬНЫЕ ФЛАГИ
 */
window.isRouterActive = true; 

/**
 * ГЛОБАЛЬНАЯ ИНИЦИАЛИЗАЦИЯ (Для SPA)
 */
function initAllScripts() {
    console.log("Перезапуск всех скриптов страницы...");
    
    setActiveLink();
    updateBreadcrumbs();
    initMobileMenu();
    initHeroSlider(); 
    initGalleryFilter(); 
    initFancybox(); 
    initPhoneMask(); 
}

/**
 * 1. АНИМАЦИЯ КОРЗИНЫ
 */
function animateCart() {
    const cartBtn = document.getElementById('cart-button');
    if (!cartBtn) return;
    
    cartBtn.classList.remove('cart-animate');
    void cartBtn.offsetWidth; 
    cartBtn.classList.add('cart-animate');
    
    setTimeout(() => {
        cartBtn.classList.remove('cart-animate');
    }, 500);
}

/**
 * ПЕРЕКЛЮЧЕНИЕ РЕЖИМОВ ФОРМЫ
 */
window.switchFormMode = function(mode) {
    const btnChat = document.getElementById('btn-chat');
    const btnCall = document.getElementById('btn-call');
    const phoneWrap = document.getElementById('phone-field-wrapper');
    const extraFields = document.getElementById('extra-fields');
    const subject = document.getElementById('form-subject');
    const phoneInput = document.getElementById('user-phone');
    const emailInput = document.getElementById('user-email');
    const titleElement = document.querySelector('#callback-modal h3');

    const isProductOrder = titleElement?.innerText.includes('Заказать:');

    if (mode === 'chat') {
        phoneWrap?.classList.add('hidden');
        extraFields?.classList.remove('hidden');
        if (subject) subject.value = "Заявка на чат (Email)";
        if (phoneInput) phoneInput.required = false;
        if (emailInput) emailInput.required = true;
        if (!isProductOrder && titleElement) titleElement.innerText = 'Написать нам';

        btnChat.className = "flex-1 py-2.5 px-2 bg-white shadow-sm rounded-xl border border-gray-200 transition-all flex items-center justify-center gap-2 outline-none cursor-pointer group";
        btnCall.className = "flex-1 py-2.5 px-2 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-100 transition-all flex items-center justify-center gap-2 outline-none cursor-pointer group";
        
        updateBtnContent(btnChat, true);
        updateBtnContent(btnCall, false);
    } else {
        phoneWrap?.classList.remove('hidden');
        extraFields?.classList.add('hidden');
        if (subject) subject.value = "Обратный звонок";
        if (phoneInput) phoneInput.required = true;
        if (emailInput) emailInput.required = false;
        if (!isProductOrder && titleElement) titleElement.innerText = 'Заказать звонок';

        btnCall.className = "flex-1 py-2.5 px-2 bg-white shadow-sm rounded-xl border border-gray-200 transition-all flex items-center justify-center gap-2 outline-none cursor-pointer group";
        btnChat.className = "flex-1 py-2.5 px-2 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-100 transition-all flex items-center justify-center gap-2 outline-none cursor-pointer group";
        
        updateBtnContent(btnCall, true);
        updateBtnContent(btnChat, false);
    }
}

function updateBtnContent(btn, active) {
    if (!btn) return;
    const icon = btn.querySelector('i');
    const span = btn.querySelector('span');
    if (!icon || !span) return;
    if (active) {
        icon.className = icon.className.replace('text-gray-400', 'text-primary-green');
        span.className = span.className.replace('text-gray-500', 'text-primary-green');
    } else {
        icon.className = icon.className.replace('text-primary-green', 'text-gray-400');
        span.className = span.className.replace('text-primary-green', 'text-gray-500');
    }
}

/**
 * 2. МОБИЛЬНОЕ МЕНЮ
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
    
    // Если в блоке уже есть дети, значит он загружен — не грузим второй раз
    if (element.children.length > 0) return true;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Ошибка загрузки: ${url}`);
        const html = await response.text();
        element.innerHTML = html;
        return true; 
    } catch (error) {
        console.error(`Ошибка компонента #${id}:`, error);
        return false;
    }
}

/**
 * 4. ПОДСВЕТКА АКТИВНОЙ ССЫЛКИ
 */
function setActiveLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link, #mobile-menu-dropdown a');
    const cartBtn = document.getElementById('cart-button');

    navLinks.forEach(link => {
        link.classList.remove('active', 'text-gold-accent');
        link.classList.add('text-white/70');

        const href = link.getAttribute('href');
        if (!href) return;

        const isExactMatch = currentPath.endsWith(href) || (currentPath === '/' && (href === '/index.html' || href === './'));
        const isCatalogActive = (currentPath.includes('catalog') || currentPath.includes('katalog')) && (href.includes('katalog') || href.includes('catalog'));

        if (isExactMatch || isCatalogActive) {
            link.classList.add('active', 'text-gold-accent');
            link.classList.remove('text-white/70');
        }
    });

    // 2. Логика для корзины (Акцентный фон и цвет текста)
    if (cartBtn) {
        // Сбрасываем активные стили (возвращаем прозрачный фон и белый текст)
        cartBtn.classList.remove('bg-dark-green', 'text-gold-accent', 'px-3', 'py-2', 'rounded-xl');
        cartBtn.classList.add('text-white');

        // Если путь страницы содержит cart.html
        if (currentPath.includes('cart.html')) {
            cartBtn.classList.add('bg-dark-green', 'text-gold-accent', 'px-3', 'py-2', 'rounded-xl');
            cartBtn.classList.remove('text-white');
        }
    }
}

/**
 * 5. ХЛЕБНЫЕ КРОШКИ
 */
function updateBreadcrumbs() {
    const breadcrumbLabel = document.getElementById('current-page-name');
    const breadcrumbContainer = document.getElementById('breadcrumbs-res');
    if (!breadcrumbLabel || !breadcrumbContainer) return;

    const pageTitles = {
    // Корень сайта
    'index.html': 'Главная',
    'cart.html': 'Корзина',
    'katalog.html': 'Каталог',
    'ceny.html': 'Цены',
    'nashi-raboty.html': 'Галерея',
    'dostavka-i-oplata.html': 'Доставка',
    'o-kompanii.html': 'О компании',
    'kontakty.html': 'Контакты',
    '404.html': 'Страница не найдена',

    // Юридические страницы
    'politika-konfidencialnosti.html': 'Политика конфиденциальности',
    'politika-obrabotki-cookie.html': 'Политика Cookie',
    'soglasie-na-reklamu.html': 'Согласие на рекламу',

    // Папка /catalog/
    'doska-pola.html': 'Доска пола',
    'imitaciya-brusa.html': 'Имитация бруса',
    'krepezh.html': 'Крепеж',
    'palubnaya-doska.html': 'Палубная доска',
    'pilomaterialy.html': 'Пиломатериалы',
    'planken.html': 'Планкен',
    'pogonazh.html': 'Погонаж',
    'vagonka.html': 'Вагонка'
    };

    const fullPath = window.location.pathname;
    let currentPage = fullPath.split("/").pop() || 'index.html';
    currentPage = currentPage.split('?')[0].trim();

    if (currentPage === 'index.html' || fullPath === '/') {
        breadcrumbContainer.classList.add('hidden');
    } else {
        breadcrumbContainer.classList.remove('hidden');
        breadcrumbLabel.innerText = pageTitles[currentPage] || 'Страница';

        const oldDynamic = breadcrumbContainer.querySelectorAll('.dynamic-link');
        oldDynamic.forEach(el => el.remove());

        if (fullPath.includes('/catalog/') && currentPage !== 'katalog.html') {
            const catalogLink = document.createElement('span');
            catalogLink.className = 'dynamic-link flex items-center space-x-2'; 
            catalogLink.innerHTML = `
                <a href="/katalog.html" class="text-gray-400 hover:text-primary-green transition-colors">Каталог</a>
                <i class="fas fa-chevron-right text-[11px] text-gray-300 transform translate-y-[1.5px]"></i>
            `;
            breadcrumbLabel.before(catalogLink);
        }
    }
}

/**
 * 6. ЛОГИКА МОДАЛЬНОГО ОКНА
 */
function openCallbackModal(productName = null, isEmailMode = false) {
    const modal = document.getElementById('callback-modal');
    const content = document.getElementById('modal-content');
    if (!modal || !content) return;

    const titleElement = modal.querySelector('h3');
    const subjectInput = document.getElementById('form-subject');

    document.getElementById('callbackForm')?.reset();

    let displayTitle = '';
    let emailSubject = '';

    if (productName && productName.trim().length > 0 && productName.toLowerCase() !== 'заказать звонок') {
        let cleanName = productName.trim();
        cleanName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1).toLowerCase();
        displayTitle = 'Заказать: ' + cleanName.replace('(', '<br>(');
        emailSubject = 'Заказ товара: ' + cleanName;
    } else {
        displayTitle = isEmailMode ? 'Написать нам' : 'Заказать звонок';
        emailSubject = isEmailMode ? 'Сообщение с сайта' : 'Заказ обратного звонка';
    }

    if (titleElement) titleElement.innerHTML = displayTitle;
    if (subjectInput) subjectInput.value = emailSubject;

    window.switchFormMode(isEmailMode ? 'chat' : 'call');

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        content.classList.remove('scale-95', 'opacity-0');
        content.classList.add('scale-100', 'opacity-100');
        document.getElementById('user-name')?.focus();
    }, 10);
}

function closeCallbackModal() {
    const modal = document.getElementById('callback-modal');
    const content = document.getElementById('modal-content');
    if (!modal || !content) return;

    content.classList.remove('scale-100', 'opacity-100');
    content.classList.add('scale-95', 'opacity-0');
    
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
 * 8. ГЛОБАЛЬНЫЙ ОБРАБОТЧИК КЛИКОВ
 */
document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.trigger-callback');
    if (trigger) {
        const isMobile = window.innerWidth <= 768;
        const isPhoneLink = trigger.tagName === 'A' && trigger.getAttribute('href')?.startsWith('tel:');

        if (!isMobile || (isMobile && !isPhoneLink)) {
            e.preventDefault();
            let productName = '';

            const row = trigger.closest('tr');
            if (row) {
                let prevRow = row.previousElementSibling;
                while (prevRow) {
                    const headerCell = prevRow.querySelector('td[colspan]');
                    if (headerCell) {
                        productName = headerCell.innerText.trim();
                        break;
                    }
                    prevRow = prevRow.previousElementSibling;
                }
                if (!productName) {
                    const firstCell = row.querySelector('td:first-child');
                    if (firstCell) productName = firstCell.innerText.trim();
                }
            }

            if (!productName) {
                const card = trigger.closest('.product-card') || trigger.closest('.item-container');
                const h3Title = card?.querySelector('h3');
                if (h3Title) productName = h3Title.innerText.trim();
            }

            openCallbackModal(productName);
        }
    }

    if (e.target.closest('#close-modal') || e.target.id === 'callback-modal') {
        closeCallbackModal();
    }

    const buyBtn = e.target.closest('.buy-btn') || (e.target.closest('button') && e.target.innerText.toLowerCase().includes('корзину'));
    if (buyBtn) animateCart();
});

/**
 * 9. ОТПРАВКА ФОРМЫ
 */
document.addEventListener('submit', async (e) => {
    if (e.target && e.target.id === 'callbackForm') {
        e.preventDefault();
        const form = e.target;
        const btn = form.querySelector('button[type="submit"]');
        const originalBtnText = btn.innerText;

        try {
            btn.disabled = true;
            btn.innerText = 'ОТПРАВКА...';
            const response = await fetch('/send.php', { method: 'POST', body: new FormData(form) });
            const result = await response.text();

            if (result.trim() === 'success') {
                alert('Спасибо! Заявка принята.');
                form.reset();
                closeCallbackModal();
            } else { throw new Error(); }
        } catch (error) {
            alert('Ошибка отправки. Пожалуйста, позвоните нам.');
        } finally {
            btn.disabled = false;
            btn.innerText = originalBtnText;
        }
    }
});

/**
 * 10. ГАЛЕРЕЯ И СЛАЙДЕР
 */
function initGalleryFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.product-card');
    if (!filterButtons.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filterValue = button.getAttribute('data-filter');
            
            cards.forEach(card => {
                const category = card.getAttribute('data-category');
                const isMatch = filterValue === 'all' || category === filterValue;
                card.classList.toggle('hidden', !isMatch);
                const link = card.querySelector('a[data-fancybox]');
                if (link) link.setAttribute('data-fancybox', isMatch ? 'gallery' : 'hidden');
            });
        });
    });
}

function initFancybox() {
    if (typeof Fancybox !== "undefined") {
        Fancybox.unbind('[data-fancybox="gallery"]');
        Fancybox.bind('[data-fancybox="gallery"]', { Hash: false, Thumbs: { autoStart: false } });
    }
}

function initHeroSlider() {
    const slider = document.querySelector('.myHeroSwiper');
    if (slider && typeof Swiper !== 'undefined') {
        new Swiper(".myHeroSwiper", {
            loop: true,
            speed: 1200,
            autoplay: { delay: 5000, disableOnInteraction: false },
            pagination: { el: ".swiper-pagination", clickable: true },
            navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
        });
    }
}

/**
 * ПЕРВАЯ ЗАГРУЗКА (Layout)
 */
let isInitialLoaded = false;

document.addEventListener('DOMContentLoaded', () => {
    if (isInitialLoaded) return;
    isInitialLoaded = true;

    // 1. Грузим общие компоненты
    Promise.all([
        loadComponent('header-top-res', '/components/header.html'),
        loadComponent('nav-res', '/components/nav.html'),
        loadComponent('breadcrumbs-res', '/components/breadcrumbs.html'),
        loadComponent('footer-res', '/components/footer.html'),
        loadComponent('callback-modal-res', '/components/zakaz-zvonka.html')
    ]).then(() => {
        // 2. Проверяем, не находимся ли мы на главной
        const isIndex = window.location.pathname === '/' || window.location.pathname.endsWith('index.html');
        const urlParams = new URLSearchParams(window.location.search);
        
        // Если это главная и НЕТ параметра ?load=, грузим слайдер/каталог
        if (isIndex && !urlParams.has('load')) {
            const mainLoads = [];
            if (document.getElementById('hero-slider-res')) {
                mainLoads.push(loadComponent('hero-slider-res', '/components/hero-slider.html'));
            }
            if (document.getElementById('catalog-sm-res')) {
                mainLoads.push(loadComponent('catalog-sm-res', '/components/blok-kataloga-sm.html'));
            }

            Promise.all(mainLoads).then(() => {
                initAllScripts();
                if (window.AppRouter) window.AppRouter.init();
            });
        } else {
            // Если мы на странице типа Доставка (или есть ?load=), просто запускаем роутер
            initAllScripts();
            if (window.AppRouter) window.AppRouter.init();
        }
    });

    // Маска
    if (!document.querySelector('script[src*="inputmask"]')) {
        const maskScript = document.createElement('script');
        maskScript.src = "https://cdn.jsdelivr.net/npm/inputmask@5.0.8/dist/inputmask.min.js";
        maskScript.onload = initPhoneMask;
        document.head.appendChild(maskScript);
    }
});