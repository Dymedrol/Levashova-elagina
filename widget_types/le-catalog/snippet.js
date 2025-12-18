(function() {
    // Функция для фильтрации товаров
    function filterProducts() {
        const checkbox = document.getElementById('available');
        const products = document.querySelectorAll('.le-shop-product');
        
        if (!checkbox || !products.length) return;
        
        if (checkbox.checked) {
            // Если чекбокс выбран - показываем только товары с классом .le-shop-product_available
            products.forEach(function(product) {
                if (product.classList.contains('le-shop-product_available')) {
                    product.style.display = '';
                } else {
                    product.style.display = 'none';
                }
            });
        } else {
            // Если чекбокс не выбран - показываем все товары
            products.forEach(function(product) {
                product.style.display = '';
            });
        }
    }
    
    // Инициализация при загрузке страницы
    function init() {
        const checkbox = document.getElementById('available');
        
        if (!checkbox) return;
        
        // Проверяем URL параметры для установки начального состояния чекбокса
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('available')) {
            checkbox.checked = true;
        }
        
        // Применяем фильтрацию при загрузке
        filterProducts();
        
        // Слушаем изменения чекбокса
        checkbox.addEventListener('change', filterProducts);
    }
    
    // Запускаем инициализацию после загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

