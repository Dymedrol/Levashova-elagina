

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

// Отслеживание изменения варианта и отображение данных по складам
document.addEventListener('DOMContentLoaded', function() {
  var warehouseBlock = document.getElementById('warehouse');
  
  if (!warehouseBlock || !window.variantQuantity) {
    return;
  }
  
  // Функция для форматирования даты в формате "дд месяц гггг"
  function formatDeliveryDate(days) {
    var months = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];
    
    var today = new Date();
    var deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + days);
    
    var day = deliveryDate.getDate();
    var month = months[deliveryDate.getMonth()];
    var year = deliveryDate.getFullYear();
    
    return day + ' ' + month + ' ' + year;
  }
  
  // Функция для отображения данных по складам
  function updateWarehouseDisplay(variantId) {
    if (!variantId) return;
    
    var variantIdNum = parseInt(variantId, 10);
    var warehouseData = window.variantQuantity[variantIdNum];
    var deliveryDateWrapper = document.getElementById('delivery-date-wrapper');
    var deliveryDateElement = document.getElementById('delivery-date');
    
    // Очищаем предыдущее содержимое (кроме скрипта с window.variantQuantity)
    var scriptTag = warehouseBlock.querySelector('script');
    warehouseBlock.innerHTML = '';
    if (scriptTag) {
      warehouseBlock.appendChild(scriptTag);
    }
    
    if (warehouseData) {
      // Создаем контейнер для данных о складах
      var dataContainer = document.createElement('div');
      dataContainer.className = 'warehouse-data';
      
      // Проходим по всем складам и выводим те, где товар в наличии
      var hasItems = false;
      for (var warehouseName in warehouseData) {
        if (warehouseData.hasOwnProperty(warehouseName)) {
          var quantity = parseInt(warehouseData[warehouseName], 10);
          if (quantity > 0) {
            hasItems = true;
            var warehouseItem = document.createElement('div');
            warehouseItem.className = 'warehouse-item';
            warehouseItem.textContent = 'Товар в наличии в магазине (' + warehouseName + ')';
            dataContainer.appendChild(warehouseItem);
          }
        }
      }
      
      // Если товара нет ни в одном магазине, выводим соответствующее сообщение
      if (!hasItems) {
        var noItemsMessage = document.createElement('div');
        noItemsMessage.className = 'warehouse-no-items';
        noItemsMessage.textContent = 'Нет в наличии в магазинах';
        dataContainer.appendChild(noItemsMessage);
      }
      
      warehouseBlock.appendChild(dataContainer);
      
      // Управление видимостью блока с датой доставки
      if (deliveryDateWrapper) {
        if (hasItems && window.deliveryDuration !== undefined && window.deliveryDuration !== null && !isNaN(window.deliveryDuration)) {
          // Показываем блок и обновляем дату доставки
          deliveryDateWrapper.style.display = '';
          if (deliveryDateElement) {
            deliveryDateElement.textContent = formatDeliveryDate(parseInt(window.deliveryDuration, 10));
          }
        } else {
          // Скрываем блок, если товара нет в магазинах или нет данных о доставке
          deliveryDateWrapper.style.display = 'none';
        }
      }
    } else {
      // Если данных нет, скрываем блок с датой доставки
      if (deliveryDateWrapper) {
        deliveryDateWrapper.style.display = 'none';
      }
    }
  }
  
  // Функция для получения текущего ID варианта
  function getCurrentVariantId() {
    // Сначала пытаемся найти select с name="variant_d"
    var variantSelect = document.querySelector('select[name="variant_d"]');
    if (variantSelect && variantSelect.value) {
      return variantSelect.value;
    }
    
    // Если не найден, ищем select с name="variant_id"
    variantSelect = document.querySelector('select[name="variant_id"]');
    if (variantSelect && variantSelect.value) {
      return variantSelect.value;
    }
    
    // Ищем скрытое поле variant_id
    var hiddenInput = document.querySelector('input[name="variant_id"]');
    if (hiddenInput && hiddenInput.value) {
      return hiddenInput.value;
    }
    
    return null;
  }
  
  // Обработчик изменения select с name="variant_d"
  var variantSelectD = document.querySelector('select[name="variant_d"]');
  if (variantSelectD) {
    variantSelectD.addEventListener('change', function() {
      updateWarehouseDisplay(this.value);
    });
  }
  
  // Обработчик изменения select с name="variant_id" (на случай, если используется он)
  var variantSelectId = document.querySelector('select[name="variant_id"]');
  if (variantSelectId) {
    variantSelectId.addEventListener('change', function() {
      updateWarehouseDisplay(this.value);
    });
  }
  
  // Отслеживание изменения варианта через EventBus (система Insales UI)
  if (typeof EventBus !== 'undefined') {
    EventBus.subscribe('change_variant:insales:product', function(data) {
      if (data && data.id) {
        updateWarehouseDisplay(data.id);
      }
    });
  }
  
  // Отслеживаем изменения в скрытом поле variant_id через MutationObserver
  var hiddenVariantInput = document.querySelector('input[name="variant_id"]');
  if (hiddenVariantInput) {
    var hiddenObserver = new MutationObserver(function(mutations) {
      if (hiddenVariantInput.value) {
        updateWarehouseDisplay(hiddenVariantInput.value);
      }
    });
    
    hiddenObserver.observe(hiddenVariantInput, {
      attributes: true,
      attributeFilter: ['value']
    });
    
    // Также отслеживаем изменение свойства value напрямую через события
    var lastValue = hiddenVariantInput.value;
    setInterval(function() {
      if (hiddenVariantInput.value !== lastValue) {
        lastValue = hiddenVariantInput.value;
        updateWarehouseDisplay(lastValue);
      }
    }, 100);
  }
  
  // Обновляем отображение при загрузке страницы с начальным значением
  var initialVariantId = getCurrentVariantId();
  if (initialVariantId) {
    updateWarehouseDisplay(initialVariantId);
  }
});