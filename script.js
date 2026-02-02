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
    // Получаем имя текущего файла
    let currentPage = window.location.pathname.split("/").pop() || 'index.html';
    currentPage = currentPage.split('?')[0]; 

    // Выбираем ссылки из ПК-меню (nav-link) И из мобильного (внутри mobile-menu-dropdown)
    const navLinks = document.querySelectorAll('.nav-link, #mobile-menu-dropdown a');

    navLinks.forEach(link => {
        link.classList.remove('active', 'text-gold-accent'); // Очищаем старые стили
        
        const href = link.getAttribute('href');
        
        if (href && href.trim() === currentPage) {
            link.classList.add('active');
            
            // Если это ссылка в мобильном меню, подсветим её золотым
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
    // Сбрасываем кнопки: Чат активен (серый), Звонок неактивен (белый)
    if (typeof switchMode === 'function') {
        switchMode('chat');
    }

    const modal = document.getElementById('callback-modal');
    const content = document.getElementById('modal-content');
    const titleElement = modal?.querySelector('h3');
    const subjectInput = document.getElementById('form-subject');
    
    const extraFields = document.getElementById('extra-fields');
    const phoneField = document.getElementById('phone-field-wrapper');
    const emailInput = document.getElementById('user-email');
    const phoneInput = document.getElementById('user-phone');

    if (!modal || !content) return;

    document.getElementById('callbackForm')?.reset();

    if (isEmailMode) {
        extraFields?.classList.remove('hidden');
        phoneField?.classList.add('hidden');
        if (titleElement) titleElement.innerText = 'Написать нам';
        if (subjectInput) subjectInput.value = 'Письмо с сайта (Email)';
        if (emailInput) emailInput.required = true;
        if (phoneInput) phoneInput.required = false;
    } else {
        extraFields?.classList.add('hidden');
        phoneField?.classList.remove('hidden');
        if (phoneInput) phoneInput.required = true;
        if (emailInput) emailInput.required = false;

        if (productName && productName.trim().length > 0) {
            let cleanName = productName.trim();
            cleanName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1).toLowerCase();
            if (titleElement) titleElement.innerText = 'Заказать: ' + cleanName;
            if (subjectInput) subjectInput.value = 'Заказ товара: ' + cleanName;
        } else {
            if (titleElement) titleElement.innerText = 'Заказать звонок';
            if (subjectInput) subjectInput.value = 'Обратный звонок';
        }
    }

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

    // Сбрасываем визуальное состояние кнопок к "Чату" перед закрытием
    if (typeof switchMode === 'function') {
        switchMode('chat');
    }

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
    loadComponent('header-top-res', 'components/header.html');
    loadComponent('nav-res', 'components/nav.html');
    loadComponent('breadcrumbs-res', 'components/breadcrumbs.html');
    loadComponent('footer-res', 'components/footer.html');
    loadComponent('callback-modal-res', 'components/zakaz-zvonka.html');

    if (document.getElementById('catalog-res')) {
        loadComponent('catalog-res', 'components/blok-kataloga.html');
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
    
    // 9.1 Модальное окно
    const trigger = e.target.closest('.trigger-callback');
    if (trigger) {
        const isMobile = window.innerWidth <= 768;
        const isPhoneLink = trigger.tagName === 'A' && trigger.getAttribute('href')?.startsWith('tel:');

        if (!isMobile || (isMobile && !isPhoneLink)) {
            e.preventDefault();
            let productName = '';

            const row = trigger.closest('tr');
            if (row) {
                // 1. Ищем заголовок с colspan выше по таблице (для первой таблицы)
                let prevRow = row.previousElementSibling;
                while (prevRow) {
                    const headerCell = prevRow.querySelector('td[colspan]');
                    if (headerCell) {
                        productName = headerCell.innerText.trim();
                        break;
                    }
                    prevRow = prevRow.previousElementSibling;
                }

                // 2. Если не нашли выше, проверяем первую ячейку строки (для второй таблицы)
                if (!productName) {
                    const firstCell = row.querySelector('td:first-child');
                    if (firstCell && firstCell.innerText.trim().length > 1) {
                        productName = firstCell.innerText.trim();
                    }
                }
            }

            // 3. Логика для мобильных карточек (H3)
            if (!productName) {
                const card = trigger.closest('.p-5') || trigger.closest('section');
                const h3Title = card?.querySelector('h3');
                if (h3Title) productName = h3Title.innerText.trim();
            }

            openCallbackModal(productName);
        }
    }

    // 9.2 Анимация корзины
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

    /**
 * 10. ОБРАБОТКА ОТПРАВКИ ФОРМЫ В TELEGRAM
 * Данный блок перехватывает событие отправки формы, собирает данные 
 * и передает их в PHP-обработчик (send.php) без перезагрузки страницы.
 */
document.addEventListener('submit', async (e) => {
    // Проверяем, что отправлена именно наша форма заказа
    if (e.target && e.target.id === 'callbackForm') {
        e.preventDefault(); // Блокируем стандартную перезагрузку страницы
        
        const form = e.target;
        const btn = form.querySelector('button[type="submit"]');
        const originalBtnText = btn.innerText;

        // Подготавливаем данные формы для отправки
        const formData = new FormData(form);

        try {
            // Визуальная индикация процесса отправки
            btn.disabled = true;
            btn.innerText = 'ОТПРАВКА...';

            // Отправляем данные в PHP-файл методом POST
            const response = await fetch('send.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.text();

            // Если сервер вернул "success", значит бот отправил сообщение в ТГ
            if (result.trim() === 'success') {
                alert('Спасибо! Заявка принята. Мы свяжемся с вами в ближайшее время.');
                form.reset(); // Очищаем поля формы
                
                // Закрываем модальное окно, если функция закрытия доступна
                if (typeof closeCallbackModal === 'function') {
                    closeCallbackModal();
                }
            } else {
                throw new Error('Ошибка сервера');
            }
        } catch (error) {
            // В случае сетевой ошибки или сбоя PHP
            alert('Произошла ошибка при отправке. Пожалуйста, позвоните нам по телефону.');
            console.error('Ошибка отправки в Telegram:', error);
        } finally {
            // Возвращаем кнопку в исходное состояние
            btn.disabled = false;
            btn.innerText = originalBtnText;
        }
    }

    function switchFormMode(mode) {
        const btnChat = document.getElementById('btn-chat');
        const btnCall = document.getElementById('btn-call');
        const phoneWrap = document.getElementById('phone-field-wrapper');
        const extraFields = document.getElementById('extra-fields');
        const subject = document.getElementById('form-subject');
    
        if (mode === 'chat') {
            // Показываем поля чата, скрываем телефон
            phoneWrap.classList.add('hidden');
            extraFields.classList.remove('hidden');
            subject.value = "Письмо из чата";
    
            // Кнопка Чат -> Активная (Белая)
            btnChat.className = "flex-1 py-2.5 px-2 bg-white shadow-sm rounded-xl border border-gray-200 transition-all flex items-center justify-center gap-2 border-0 outline-none cursor-pointer group";
            btnChat.querySelector('i').className = "fas fa-comments text-primary-green text-sm";
            btnChat.querySelector('span').className = "text-[9px] font-bold uppercase tracking-wider text-primary-green";
    
            // Кнопка Звонок -> Пассивная (Серая)
            btnCall.className = "flex-1 py-2.5 px-2 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-100 transition-all flex items-center justify-center gap-2 border-0 outline-none cursor-pointer group";
            btnCall.querySelector('i').className = "fas fa-phone-alt text-gray-400 group-hover:text-primary-green text-sm";
            btnCall.querySelector('span').className = "text-[9px] font-bold uppercase tracking-wider text-gray-500";
        } else {
            // Показываем телефон, скрываем чат
            phoneWrap.classList.remove('hidden');
            extraFields.classList.add('hidden');
            subject.value = "Обратный звонок";
    
            // Кнопка Звонок -> Активная (Белая)
            btnCall.className = "flex-1 py-2.5 px-2 bg-white shadow-sm rounded-xl border border-gray-200 transition-all flex items-center justify-center gap-2 border-0 outline-none cursor-pointer group";
            btnCall.querySelector('i').className = "fas fa-phone-alt text-primary-green text-sm";
            btnCall.querySelector('span').className = "text-[9px] font-bold uppercase tracking-wider text-primary-green";
    
            // Кнопка Чат -> Пассивная (Серая)
            btnChat.className = "flex-1 py-2.5 px-2 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-100 transition-all flex items-center justify-center gap-2 border-0 outline-none cursor-pointer group";
            btnChat.querySelector('i').className = "fas fa-comments text-gray-400 group-hover:text-primary-green text-sm";
            btnChat.querySelector('span').className = "text-[9px] font-bold uppercase tracking-wider text-gray-500";
        }
    }

});