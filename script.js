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
        // ДОБАВЬ RETURN ЗДЕСЬ, чтобы работало .then()
        return fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`Ошибка загрузки: ${url}`);
                return response.text();
            })
            .then(html => {
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
            });
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
    const navLinks = document.querySelectorAll('.nav-link, #mobile-menu-dropdown a');

    navLinks.forEach(link => {
        link.classList.remove('active', 'text-gold-accent');
        const href = link.getAttribute('href');
        if (href && href.trim() === currentPage) {
            link.classList.add('active');
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
        'kontakty.html': 'Контакты'
    };

    let currentPage = window.location.pathname.split("/").pop() || 'index.html';
    currentPage = currentPage.split('?')[0].trim();

    if (currentPage === 'index.html') {
        breadcrumbContainer.classList.add('hidden');
    } else {
        breadcrumbContainer.classList.remove('hidden');
        breadcrumbLabel.innerText = pageTitles[currentPage] || 'Страница';
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
        cleanName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1).toLowerCase();
        if (titleElement) titleElement.innerText = 'Заказать: ' + cleanName;
        if (subjectInput) subjectInput.value = 'Заказ товара: ' + cleanName;
    } 
    // ПУНКТ 2 и 3: Если товара нет, ставим базовый заголовок в зависимости от кнопки
    else {
        if (titleElement) {
            titleElement.innerText = isEmailMode ? 'Написать нам' : 'Заказать звонок';
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
    // 1. Загружаем обычные компоненты
    loadComponent('header-top-res', 'components/header.html');
    loadComponent('nav-res', 'components/nav.html');
    loadComponent('breadcrumbs-res', 'components/breadcrumbs.html');
    loadComponent('footer-res', 'components/footer.html');
    loadComponent('callback-modal-res', 'components/zakaz-zvonka.html');

    if (document.getElementById('catalog-res')) {
        loadComponent('catalog-res', 'components/blok-kataloga.html');
    }

    // 2. ЗАГРУЖАЕМ СЛАЙДЕР И ИНИЦИАЛИЗИРУЕМ ЕГО
    loadComponent('hero-slider-res', 'components/hero-slider.html').then(() => {
        // Этот код сработает только когда HTML слайдера уже на странице
        if (document.querySelector('.myHeroSwiper')) {
            new Swiper(".myHeroSwiper", {
                loop: true,
                speed: 1200,
                // 2. Чувствительность к движению пальца. 
                // 1 — стандарт. Поставь 1.5 или 2, чтобы слайд улетал от легкого касания.
                touchRatio: 2,
                // 3. Сопротивление (при значении 0 слайд переключается мгновенно)
                touchAngle: 45, // Чтобы слайд не дергался, если ты листаешь страницу вниз
                // 4. Убираем задержку после касания
                shortSwipes: true,
                longSwipes: false, // Отключает медленное дотягивание слайда
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
            if (!productName) {
                const card = trigger.closest('.p-5') || trigger.closest('section');
                const h3Title = card?.querySelector('h3');
                if (h3Title) productName = h3Title.innerText.trim();
            }
            openCallbackModal(productName);
        }
    }

    const buyBtn = e.target.closest('.buy-btn') || (e.target.closest('button') && e.target.innerText.toLowerCase().includes('корзину'));
    if (buyBtn) {
        animateCart();
    }

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

            const response = await fetch('send.php', {
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