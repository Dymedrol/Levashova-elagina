// Аккордеон для блока le-product-accordion__item
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.le-product-accordion__item-header').forEach(function(header) {
      header.addEventListener('click', function() {
        var item = header.closest('.le-product-accordion__item');
        var content = item.querySelector('.le-product-accordion__item-content');
        var svg = header.querySelector('svg');
        var isOpen = item.classList.contains('open');

        if (!isOpen) {
          item.classList.add('open');
          content.style.maxHeight = content.scrollHeight + 'px';
          if (svg) svg.style.transform = 'rotate(180deg)';
        } else {
          item.classList.remove('open');
          content.style.maxHeight = null;
          if (svg) svg.style.transform = '';
        }
      });
    });
    // Изначально все скрыты
    document.querySelectorAll('.le-product-accordion__item-content').forEach(function(content) {
      content.style.maxHeight = null;
    });
});