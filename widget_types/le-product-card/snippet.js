

EventBus.subscribe('accessories-rendered:insales:ui_accessories', function (data) {
  // Находим элемент с атрибутом data-product-accessory-values-item-name, содержащий "Добавить гравировку"
  var nameElements = document.querySelectorAll('[data-product-accessory-values-item-name]');
  
  for (var i = 0; i < nameElements.length; i++) {
    var nameElement = nameElements[i];
    var textContent = nameElement.textContent || nameElement.innerText;
    
    if (textContent.indexOf('Добавить гравировку') !== -1) {
      // Находим родительский контейнер
      var container = nameElement.closest('[data-product-accessory-values-item]');
      
      if (container) {
        // Ищем элемент с атрибутом data-product-accessory-valuesitem-price рядом
        var priceElement = container.querySelector('[data-product-accessory-valuesitem-price]');
        
        // Если не найден внутри контейнера, ищем в соседних элементах
        if (!priceElement) {
          var parent = container.parentElement;
          if (parent) {
            priceElement = parent.querySelector('[data-product-accessory-valuesitem-price]');
          }
        }
        
        if (priceElement) {
          // Получаем текстовое содержимое элемента
          var priceValue = priceElement.textContent || priceElement.innerText;
          
          // Подставляем значение в элемент #product-accessory-price
          var targetElement = document.getElementById('product-accessory-price');
          if (targetElement && priceValue) {
            targetElement.textContent = priceValue;
          }
        }
      }
      break; // Прерываем цикл после нахождения нужного элемента
    }
  }
});

// Синхронизация цены между desktop и mobile версиями
document.addEventListener('DOMContentLoaded', function() {
  var priceDesktop = document.getElementById('product-price-desktop');
  var priceMobile = document.getElementById('product-price-mobile');

  if (priceDesktop && priceMobile) {
    // Функция для копирования содержимого
    function syncPrice() {
      priceMobile.innerHTML = priceDesktop.innerHTML;
    }

    // Копируем начальное значение
    syncPrice();

    // Отслеживаем изменения через MutationObserver
    var observer = new MutationObserver(function(mutations) {
      syncPrice();
    });

    // Наблюдаем за изменениями в содержимом и дочерних элементах
    observer.observe(priceDesktop, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }
});

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

// Отслеживание заполнения инпута гравировки и автоматическая отметка чекбокса
document.addEventListener('DOMContentLoaded', function() {
  var engraveInput = document.getElementById('engrave');
  
  if (engraveInput) {
    // Функция для поиска чекбокса "Добавить гравировку"
    function findEngraveCheckbox() {
      // Находим все элементы с атрибутом data-product-accessory-values-item-name
      var nameElements = document.querySelectorAll('[data-product-accessory-values-item-name]');
      
      // Ищем элемент, содержащий "Добавить гравировку"
      for (var i = 0; i < nameElements.length; i++) {
        var nameElement = nameElements[i];
        var textContent = nameElement.textContent || nameElement.innerText;
        
        if (textContent.indexOf('Добавить гравировку') !== -1) {
          // Находим родительский label
          var label = nameElement.closest('[data-product-accessory-values-item]');
          
          if (label) {
            // Ищем чекбокс внутри label или перед ним
            var checkbox = label.querySelector('input[type="checkbox"]');
            
            // Если чекбокс не найден внутри, ищем перед label
            if (!checkbox && label.previousElementSibling) {
              var prevSibling = label.previousElementSibling;
              if (prevSibling.tagName === 'INPUT' && prevSibling.type === 'checkbox') {
                checkbox = prevSibling;
              }
            }
            
            // Если чекбокс все еще не найден, ищем по id (если у label есть for)
            if (!checkbox && label.htmlFor) {
              checkbox = document.getElementById(label.htmlFor);
            }
            
            return checkbox;
          }
          break; // Прерываем цикл после нахождения нужного элемента
        }
      }
      return null;
    }
    
    function checkAndMarkEngraveCheckbox() {
      var inputValue = engraveInput.value.trim();
      var checkbox = findEngraveCheckbox();
      
      if (checkbox && checkbox.type === 'checkbox') {
        // Если есть хотя бы один символ - отмечаем, если пусто - снимаем отметку
        checkbox.checked = inputValue.length > 0;
        
        // Триггерим событие change для уведомления других скриптов
        var changeEvent = new Event('change', { bubbles: true });
        checkbox.dispatchEvent(changeEvent);
      }
      
      // Синхронизация с инпутом comment
      var commentInput = document.querySelector('input[name="comment"]');
      if (commentInput) {
        if (inputValue.length > 0) {
          commentInput.value = 'Текст гравировки: ' + inputValue;
        } else {
          commentInput.value = '';
        }
      }
      
      // Управление классом is-active для кнопки гравировки
      var engraveButton = document.querySelector('.le-product-form-item-controls__button_engrave');
      if (engraveButton) {
        if (inputValue.length > 0) {
          engraveButton.classList.add('is-active');
        } else {
          engraveButton.classList.remove('is-active');
        }
      }
    }
    
    // Отслеживаем изменения в инпуте
    engraveInput.addEventListener('input', checkAndMarkEngraveCheckbox);
    engraveInput.addEventListener('change', checkAndMarkEngraveCheckbox);
    
    // Также проверяем при загрузке страницы (на случай, если инпут уже заполнен)
    checkAndMarkEngraveCheckbox();
    
    // Отслеживаем динамическое добавление элементов аксессуаров
    // Используем MutationObserver для отслеживания появления новых элементов
    var accessoriesContainer = document.querySelector('[data-product-accessories]');
    if (accessoriesContainer) {
      var observer = new MutationObserver(function(mutations) {
        // Проверяем снова после добавления новых элементов
        setTimeout(checkAndMarkEngraveCheckbox, 100);
      });
      
      observer.observe(accessoriesContainer, {
        childList: true,
        subtree: true
      });
    }
  }
});