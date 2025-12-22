// Аккордеон для блока le-product-accordion__item
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.le-product-accordion__item-header').forEach(function(header) {
      header.addEventListener('click', function() {
        var item = header.closest('.le-product-accordion__item');
        var content = item.querySelector('.le-product-accordion__item-content');
        var svg = header.querySelector('svg');
        var isOpen = item.classList.contains('open');

        if (!isOpen) {
          // Открываем аккордеон
          item.classList.add('open');
          // Сначала получаем реальную высоту контента
          var scrollHeight = content.scrollHeight;
          // Устанавливаем max-height для плавной анимации
          // Добавляем небольшой запас для избежания обрезки
          content.style.maxHeight = (scrollHeight + 20) + 'px';
          if (svg) svg.style.transform = 'rotate(180deg)';
        } else {
          // Закрываем аккордеон
          // Сохраняем текущую высоту перед закрытием для плавной анимации
          var currentHeight = content.scrollHeight;
          content.style.maxHeight = currentHeight + 'px';
          
          // Небольшая задержка для применения стиля, затем начинаем анимацию закрытия
          requestAnimationFrame(function() {
            requestAnimationFrame(function() {
              item.classList.remove('open');
              content.style.maxHeight = '0px';
              if (svg) svg.style.transform = '';
            });
          });
        }
      });
    });
    // Изначально все скрыты
    document.querySelectorAll('.le-product-accordion__item-content').forEach(function(content) {
      content.style.maxHeight = '0px';
    });

    // Управление disabled состоянием кнопки в зависимости от поля comment
    var commentInput = document.querySelector('input[name="comment"]');
    var submitButton = document.querySelector('.le-product-form__submit');
    
    if (commentInput && submitButton) {
      // Функция для проверки и обновления состояния кнопки
      function updateSubmitButtonState() {
        if (commentInput.value.trim() === '') {
          submitButton.disabled = true;
        } else {
          submitButton.disabled = false;
        }
      }
      
      // Проверка при загрузке страницы
      updateSubmitButtonState();
      
      // Отслеживание изменений в поле
      commentInput.addEventListener('input', updateSubmitButtonState);
      commentInput.addEventListener('change', updateSubmitButtonState);
    }
});