(function() {
    'use strict';

    // Инициализация переключения табов
    function initTabs() {
        const $sections = $('.le-structure-section');
        const $contents = $('.le-structure-content');

        if (!$sections.length || !$contents.length) {
            return;
        }

        // Обработчик клика на таб
        $sections.on('click', function() {
            const $clickedTab = $(this);
            const tabIndex = $clickedTab.data('tab-index');
            const tabName = $clickedTab.text().trim();

            // Убираем активный класс у всех табов
            $sections.removeClass('le-structure-section_active');
            
            // Добавляем активный класс к кликнутому табу
            $clickedTab.addClass('le-structure-section_active');

            // Скрываем весь контент
            $contents.addClass('le-structure-content_hidden');
            
            // Показываем контент, соответствующий выбранному табу
            $contents.filter('[data-content-index="' + tabIndex + '"]')
                .removeClass('le-structure-content_hidden');

            // Обновляем название таба в хлебных крошках
            const $breadcrumbsBlockName = $('#breadcrumbs-block-name');
            if ($breadcrumbsBlockName.length) {
                $breadcrumbsBlockName.text(tabName);
            }
        });
    }

    // Инициализация при загрузке DOM
    $(document).ready(function() {
        initTabs();
    });
})();

