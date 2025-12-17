EventBus.subscribe('delete_items:insales:cart', function (data) {
    location.reload();
});

EventBus.subscribe('add_items:insales:cart', function (data) {
    // Перезагружаем страницу после успешного добавления
    location.reload();
});

// Обработчик клика на кнопку добавления подарочной упаковки
document.addEventListener('DOMContentLoaded', function() {
    var packageButton = document.getElementById('package-product-id-button');
    
    if (packageButton) {
        packageButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            var productId = this.getAttribute('data-package-product-id');
            
            if (!productId) {
                console.error('Product ID not found');
                return;
            }
            
            Cart.add({
                items: {
                    [productId]: 1
                }
            });
        });
    }
});