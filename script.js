// Корзина
let cartTotal = 0;

// Функция для обновления суммы в корзине
function updateCartTotal() {
    const cartElement = document.getElementById('cart-total');
    if (cartElement) {
        cartElement.textContent = cartTotal > 0 ? `${cartTotal} руб` : '0 руб';
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    updateCartTotal();
    
    // Пример: добавление товара в корзину (можно вызывать при клике на товар)
    // addToCart(1500);
});

// Функция для добавления товара в корзину
function addToCart(price) {
    cartTotal += price;
    updateCartTotal();
}

// Функция для очистки корзины
function clearCart() {
    cartTotal = 0;
    updateCartTotal();
}

// Поиск
document.addEventListener('DOMContentLoaded', function() {
    const searchIcon = document.querySelector('.fa-search');
    if (searchIcon) {
        searchIcon.addEventListener('click', function() {
            const query = prompt('Что вы ищете?');
            if (query) {
                console.log('Поиск для:', query);
                // Здесь можно добавить логику поиска
            }
        });
    }
});

// Плавный скролл для навигации
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
