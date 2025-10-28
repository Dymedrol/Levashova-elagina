$(document).ready(function() {
    const $headerCross = $('.le-header-cross');
    const $headerDropdown = $('.le-header-dropdown');
    const $header = $('.le-header');
    
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
