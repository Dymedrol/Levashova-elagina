$(document).ready(function() {
    const $headerCross = $('.le-header-cross');
    const $headerDropdown = $('.le-header-dropdown');
    const $header = $('.le-header');
    const $mobileTabs = $('.le-header-dropdown-menu-mobile');
    const $mobileTabButtons = $('.le-header-dropdown-menu-mobile-header__item');
    const $mobileTabBodies = $('.le-header-dropdown-menu-mobile .le-header-dropdown-menu-mobile-body');
    
    // Функция для открытия/закрытия дропдауна
    function toggleDropdown() {
        $headerDropdown.toggleClass('active');
        $headerCross.toggleClass('active');
        $header.toggleClass('dropdown-open');
    }
    
    // Функция для закрытия дропдауна
    function closeDropdown() {
        $headerDropdown.removeClass('active');
        $headerCross.removeClass('active');
        $header.removeClass('dropdown-open');
    }

    // Инициализация вкладок мобильного меню (если есть несколько тел вкладок)
    (function initMobileTabs() {
        if (!$mobileTabs.length || !$mobileTabButtons.length) return;

        // Если тел вкладок столько же, сколько кнопок — включаем режим вкладок
        if ($mobileTabBodies.length > 1 && $mobileTabBodies.length === $mobileTabButtons.length) {
            $mobileTabs.addClass('has-tabs');

            // Активируем первую вкладку
            $mobileTabButtons.removeClass('le-header-dropdown-menu-mobile-header__item_active')
                .first().addClass('le-header-dropdown-menu-mobile-header__item_active');
            $mobileTabBodies.removeClass('is-active')
                .first().addClass('is-active');

            // Обработчики клика по кнопкам вкладок
            $mobileTabButtons.each(function(index) {
                $(this).on('click', function(e) {
                    e.preventDefault();
                    // Переключаем активную кнопку
                    $mobileTabButtons.removeClass('le-header-dropdown-menu-mobile-header__item_active');
                    $(this).addClass('le-header-dropdown-menu-mobile-header__item_active');
                    // Переключаем активное тело вкладки
                    $mobileTabBodies.removeClass('is-active')
                        .eq(index).addClass('is-active');
                });
            });
        } else {
            // Если тело одно, просто помечаем первую кнопку активной для визуального состояния
            $mobileTabButtons.first().addClass('le-header-dropdown-menu-mobile-header__item_active');
        }
    })();
    
    // Обработчик клика по крестику
    $headerCross.on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleDropdown();
    });
    
    // Обработчик клика вне хедера и дропдауна
    $(document).on('click', function(e) {
        if (!$(e.target).closest($header).length) {
            closeDropdown();
        }
    });
    
    // Обработчик клика по самому дропдауну (чтобы не закрывался при клике внутри)
    $headerDropdown.on('click', function(e) {
        e.stopPropagation();
    });
    
    // Обработчик нажатия Escape для закрытия дропдауна
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape') {
            closeDropdown();
        }
    });
});
