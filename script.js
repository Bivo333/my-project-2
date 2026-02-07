/**
 * 1. АНИМАЦИЯ КОРЗИНЫ
 */
function animateCart() {
    const cartBtn = document.getElementById('cart-button');
    if (!cartBtn) return;
    
    cartBtn.classList.remove('cart-animate');
    void cartBtn.offsetWidth; // Force reflow
    cartBtn.classList.add('cart-animate');
    
    setTimeout(() => {
        cartBtn.classList.remove('cart-animate');
    }, 500);
}

/**
 * ПЕРЕКЛЮЧЕНИЕ РЕЖИМОВ ФОРМЫ (Глобальная функция)
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

    // Проверяем, не заказывает ли пользователь конкретный товар
    // Если в заголовке есть "Заказать:", мы его не трогаем (Пункт 1)
    const isProductOrder = titleElement?.innerText.includes('Заказать:');

    if (mode === 'chat') {
        phoneWrap?.classList.add('hidden');
        extraFields?.classList.remove('hidden');
        if (subject) subject.value = "Заявка на чат (Email)";
        if (phoneInput) phoneInput.required = false;
        if (emailInput) emailInput.required = true;

        // Меняем заголовок на "Написать нам", если это не заказ товара (Пункт 2)
        if (!isProductOrder && titleElement) {
            titleElement.innerText = 'Написать нам';
        }

        // Дизайн активной кнопки Чат
        btnChat.className = "flex-1 py-2.5 px-2 bg-white shadow-sm rounded-xl border border-gray-200 transition-all flex items-center justify-center gap-2 border-0 outline-none cursor-pointer group";
        btnCall.className = "flex-1 py-2.5 px-2 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-100 transition-all flex items-center justify-center gap-2 border-0 outline-none cursor-pointer group";
        
        updateBtnContent(btnChat, true);
        updateBtnContent(btnCall, false);
    } else {
        phoneWrap?.classList.remove('hidden');
        extraFields?.classList.add('hidden');
        if (subject) subject.value = "Обратный звонок";
        if (phoneInput) phoneInput.required = true;
        if (emailInput) emailInput.required = false;

        // Меняем заголовок на "Заказать звонок", если это не заказ товара (Пункт 3)
        if (!isProductOrder && titleElement) {
            titleElement.innerText = 'Заказать звонок';
        }

        // Дизайн активной кнопки Звонок
        btnCall.className = "flex-1 py-2.5 px-2 bg-white shadow-sm rounded-xl border border-gray-200 transition-all flex items-center justify-center gap-2 border-0 outline-none cursor-pointer group";
        btnChat.className = "flex-1 py-2.5 px-2 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-100 transition-all flex items-center justify-center gap-2 border-0 outline-none cursor-pointer group";
        
        updateBtnContent(btnCall, true);
        updateBtnContent(btnChat, false);
    }
}

// Вспомогательная функция для иконок (чтобы код был чище)
function updateBtnContent(btn, active) {
    if (!btn) return;
    const icon = btn.querySelector('i');
    const span = btn.querySelector('span');
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

    try {
        // Добавляем return, чтобы функция возвращала промис
        return fetch(url) 
            .then(response => {
                if (!response.ok) throw new Error(`Ошибка загрузки: ${url}`);
                return response.text();
            })
            .then(html => {
                element.innerHTML = html;
                
                // Внутренняя логика после вставки HTML
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
            });
    } catch (error) {
        console.error(`Ошибка компонента #${id}:`, error);
    }
}

/**
 * 4. ПОДСВЕТКА АКТИВНОЙ ССЫЛКИ (ФИНАЛЬНЫЙ ФИКС)
 */
function setActiveLink() {
    const currentPath = window.location.pathname;
    
    // Собираем все ссылки: и из десктопного меню (.nav-link), и из мобильного
    const navLinks = document.querySelectorAll('.nav-link, #mobile-menu-dropdown a');

    navLinks.forEach(link => {
        // Очищаем старые стили
        link.classList.remove('active', 'text-gold-accent', 'text-white');
        link.classList.add('text-white/70'); // Базовый цвет (полупрозрачный)

        const href = link.getAttribute('href');
        if (!href) return;

        // 1. Прямое совпадение (например, для Цены, Галерея и т.д.)
        const isExactMatch = currentPath.endsWith(href) || (currentPath === '/' && href === '/index.html');

        // 2. Умная проверка КАТАЛОГА (учитываем разницу k/c)
        // Если мы в папке /catalog/ или на странице /katalog.html
        const isCatalogPage = currentPath.includes('catalog') || currentPath.includes('katalog');
        const isCatalogLink = href.includes('katalog') || href.includes('catalog');
        
        const isCatalogActive = isCatalogPage && isCatalogLink;

        if (isExactMatch || isCatalogActive) {
            link.classList.add('active', 'text-gold-accent');
            link.classList.remove('text-white/70');
            
            // Если это мобильное меню, там текст обычно чисто белый, если не активен
            if (link.closest('#mobile-menu-dropdown')) {
                link.classList.add('text-gold-accent');
            }
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
        'katalog.html': 'Каталог',
        'ceny.html': 'Цены',
        'nashi-raboty.html': 'Галерея',
        'dostavka-i-oplata.html': 'Доставка',
        'o-kompanii.html': 'О компании',
        'kontakty.html': 'Контакты',
        'politika-konfidencialnosti.html': 'Политика конфиденциальности',
        'politika-obrabotki-cookie.html': 'Политика обработки файлов cookie',
        'soglasie-na-reklamu.html': 'Согласие на рекламу',
        '404.html': 'Ошибка 404',
        // Страницы каталога
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
    // Улучшенное извлечение имени файла
    let currentPage = fullPath.split("/").pop() || 'index.html';
    currentPage = currentPage.split('?')[0].trim();

    // Скрываем на главной (корень или index.html)
    if (currentPage === 'index.html' || fullPath === '/') {
        breadcrumbContainer.classList.add('hidden');
    } else {
        breadcrumbContainer.classList.remove('hidden');
        
        // 1. Устанавливаем текст текущей страницы
        breadcrumbLabel.innerText = pageTitles[currentPage] || 'Страница';

        // 2. Убираем старые динамические ссылки, чтобы они не дублировались при повторном вызове
        const oldDynamic = breadcrumbContainer.querySelectorAll('.dynamic-link');
        oldDynamic.forEach(el => el.remove());

        // 3. Логика вложенности
        // Проверяем вхождение папки /catalog/ в пути
        if (fullPath.includes('/catalog/') && currentPage !== 'katalog.html') {
            const catalogLink = document.createElement('span');
            catalogLink.className = 'dynamic-link flex items-center space-x-2'; 
            
            // Ссылка на каталог теперь всегда абсолютная (от корня)
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
    const titleElement = modal?.querySelector('h3');
    const subjectInput = document.getElementById('form-subject');

    if (!modal || !content) return;

    // Сбрасываем форму перед открытием
    document.getElementById('callbackForm')?.reset();

    // ПУНКТ 1: Если передан товар, ставим заголовок "Заказать: Товар"
    if (productName && productName.trim().length > 0) {
        let cleanName = productName.trim();
        // Делаем первую букву заглавной, остальные строчными
        cleanName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1).toLowerCase();
        
        if (titleElement) {
            // ИСПРАВЛЕНО: замещаем скобку на перенос строки + скобку
            // Используем innerHTML вместо innerText
            const formattedTitle = cleanName.replace('(', '<br>(');
            titleElement.innerHTML = 'Заказать: ' + formattedTitle;
        }
        
        if (subjectInput) {
            // В тему письма пишем чистый текст без тега <br>
            subjectInput.value = 'Заказ товара: ' + cleanName;
        }
    } 
    // ПУНКТ 2 и 3: Если товара нет, ставим базовый заголовок в зависимости от кнопки
    else {
        if (titleElement) {
            titleElement.innerHTML = isEmailMode ? 'Написать нам' : 'Заказать звонок';
        }
    }

    // Включаем нужный режим (телефон или почта)
    window.switchFormMode(isEmailMode ? 'chat' : 'call');

    // Показываем модалку
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        content.classList.replace('scale-95', 'scale-100');
        content.classList.replace('opacity-0', 'opacity-100');
        document.getElementById('user-name')?.focus();
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
 * 8. ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Загружаем обычные компоненты (ДОБАВЛЕН "/" В НАЧАЛЕ ПУТЕЙ)
    loadComponent('header-top-res', '/components/header.html');
    loadComponent('nav-res', '/components/nav.html');
    loadComponent('breadcrumbs-res', '/components/breadcrumbs.html');
    loadComponent('footer-res', '/components/footer.html');
    loadComponent('callback-modal-res', '/components/zakaz-zvonka.html');

    // 2. Большой каталог
    if (document.getElementById('catalog-res')) {
        // ИСПРАВЛЕНО: Теперь фильтр инициализируется ТОЛЬКО после загрузки HTML каталога
        loadComponent('catalog-res', '/components/blok-kataloga.html').then(() => {
            if (typeof initGalleryFilter === 'function') {
                initGalleryFilter();
            }
        });
    }

    // 3. Компактный каталог
    if (document.getElementById('catalog-sm-res')) {
        loadComponent('catalog-sm-res', '/components/blok-kataloga-sm.html');
    }

    // 4. ЗАГРУЖАЕМ СЛАЙДЕР (ДОБАВЛЕН "/")
    loadComponent('hero-slider-res', '/components/hero-slider.html').then(() => {
        if (typeof Swiper !== 'undefined' && document.querySelector('.myHeroSwiper')) {
            new Swiper(".myHeroSwiper", {
                loop: true,
                speed: 1200,
                touchRatio: 2,
                touchAngle: 45,
                shortSwipes: true,
                longSwipes: false,
                grabCursor: true,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false,
                },
                pagination: {
                    el: ".swiper-pagination",
                    clickable: true,
                },
                navigation: {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                },
            });
        }
    });

    // Маска телефона
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
    const trigger = e.target.closest('.trigger-callback');
    if (trigger) {
        const isMobile = window.innerWidth <= 768;
        const isPhoneLink = trigger.tagName === 'A' && trigger.getAttribute('href')?.startsWith('tel:');

        if (!isMobile || (isMobile && !isPhoneLink)) {
            e.preventDefault();
            let productName = '';

            // 1. Поиск в таблице (твоя логика)
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
                    if (firstCell && firstCell.innerText.trim().length > 1) {
                        productName = firstCell.innerText.trim();
                    }
                }
            }

            // 2. Поиск в карточке (h3)
            if (!productName) {
                const card = trigger.closest('.p-5') || trigger.closest('section');
                const h3Title = card?.querySelector('h3');
                if (h3Title) productName = h3Title.innerText.trim();
            }

            // 3. ИСПРАВЛЕНИЕ: Поиск в заголовке страницы (H1), если остальное не сработало
            if (!productName) {
                const pageTitle = document.querySelector('h1');
                if (pageTitle) productName = pageTitle.innerText.trim();
            }

            openCallbackModal(productName);
        }
    }

    // Обработка кнопки "В корзину"
    const buyBtn = e.target.closest('.buy-btn') || (e.target.closest('button') && e.target.innerText.toLowerCase().includes('корзину'));
    if (buyBtn) {
        animateCart();
    }

    // Закрытие модального окна
    const modal = document.getElementById('callback-modal');
    if (modal && (e.target.closest('#close-modal') || e.target === modal)) {
        closeCallbackModal();
    }
});

/**
 * 10. ОБРАБОТКА ОТПРАВКИ ФОРМЫ
 */
document.addEventListener('submit', async (e) => {
    if (e.target && e.target.id === 'callbackForm') {
        e.preventDefault();
        const form = e.target;
        const btn = form.querySelector('button[type="submit"]');
        const originalBtnText = btn.innerText;
        const formData = new FormData(form);

        try {
            btn.disabled = true;
            btn.innerText = 'ОТПРАВКА...';

            // ИСПРАВЛЕНО: добавлен "/" перед названием файла
            const response = await fetch('/send.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.text();

            if (result.trim() === 'success') {
                alert('Спасибо! Заявка принята. Мы свяжемся с вами в ближайшее время.');
                form.reset();
                closeCallbackModal();
            } else {
                throw new Error('Ошибка сервера');
            }
        } catch (error) {
            alert('Произошла ошибка при отправке. Пожалуйста, позвоните нам по телефону.');
            console.error('Ошибка отправки:', error);
        } finally {
            btn.disabled = false;
            btn.innerText = originalBtnText;
        }
    }
});

/**
 * 11. ФИЛЬТРАЦИЯ ГАЛЕРЕИ (РАБОТЫ)
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
                const link = card.querySelector('a[data-fancybox]');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('hidden');
                    if (link) link.setAttribute('data-fancybox', 'gallery');
                } else {
                    card.classList.add('hidden');
                    if (link) link.setAttribute('data-fancybox', 'hidden');
                }
            });
        });
    });
}

/**
 * 12. ИНИЦИАЛИЗАЦИЯ FANCYBOX
 */
function initFancybox() {
    if (typeof Fancybox !== "undefined") {
        // Отвязываем старые события, если они были, чтобы не дублировать
        Fancybox.unbind('[data-fancybox="gallery"]');
        Fancybox.bind('[data-fancybox="gallery"]', {
            Hash: false,
            Thumbs: { autoStart: false },
            Toolbar: {
                display: {
                    left: ["infobar"],
                    right: ["iterateZoom", "slideshow", "fullScreen", "download", "thumbs", "close"],
                },
            },
            Carousel: { friction: 0.8 },
            Images: { Panzoom: { maxScale: 3 } },
        });
    }
}

// Запуск при прямой загрузке страницы (если контент не динамический)
document.addEventListener('DOMContentLoaded', () => {
    initGalleryFilter();
    initFancybox();
});