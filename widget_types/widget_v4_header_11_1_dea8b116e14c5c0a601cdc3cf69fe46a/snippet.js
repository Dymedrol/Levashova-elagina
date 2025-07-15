/* eslint-disable linebreak-style */
$(function() {
  var isTouch = !!('ontouchstart' in window || navigator.msMaxTouchPoints);
  var mobilePoint = 768;

  $(function() {
    if (isTouch) {
      $(widget).find(".header").addClass("is-touch");
    }

    $(window).on('load', function() {
      $(widget).find(".js-cut-list").resize();
      $(widget).find(".side-panel").css("visibility", "");
    });

    if ($(widget).find(".header__collections .is-current").length) {
      if ($(window).width() < mobilePoint || $(widget).css("--catalog-location") == 'side-panel') {
        $(widget).find(".header__collections .is-current").addClass("is-show");
      }
    }

    $(".header__collections-item").hover(
      function() {
        let submenu = $(this).find("> .header__collections-submenu");

        if (submenu.length && submenu.offset().left + submenu.innerWidth() > $(window).width()) {
          submenu.addClass("is-right");
        }
      },
      function() {
        $(this).find("> .header__collections-submenu").removeClass("is-right");
      }
    )

    $(widget).find(".js-show-touch-submenu").on("click", function() {
      let root_item = $(this).parents(".header__collections-item:last");
      let cur_item = $(this).parents(".header__collections-item:first");
      let submenu = cur_item.find("> .header__collections-submenu");

      if ($(window).width() >= mobilePoint) {
        if ($(this).parents(".cut-list__more-content").length) {
          $(this).parents(".cut-list__more-content").find("> .header__collections-item.is-show").each(function() {
            if ($(this).is(root_item) == false) {
              $(this).removeClass("is-show is-right").find(".header__collections-item.is-show").removeClass("is-show is-right");
            }
          });
        } else {
          $(widget).find(".header__collections > .header__collections-item.is-show").each(function() {
            if ($(this).is(root_item) == false) {
              $(this).removeClass("is-show is-right").find(".header__collections-item.is-show").removeClass("is-show is-right");
            }
          });
        }
      }

      cur_item.toggleClass("is-show");

      if (submenu.length && submenu.offset().left + submenu.innerWidth() > $(window).width()) {
        submenu.addClass("is-right");
      }
    });

    $(document).on("click", function(event) {
      if ($(event.target).closest(".header__collections").length) {
        return;
      }

      if ($(window).width() >= mobilePoint && $(widget).css("--catalog-location") != 'side-panel') {
        $(widget).find(".header__collections-item").removeClass("is-show is-right");
      }
    });

    $(widget).find(".cut-list__drop-toggle").on("click", function() {
      if ($(window).width() >= mobilePoint) {
        $(widget).find(".header__collections-item").removeClass("is-show is-right");
      }
    })

    $(widget).find(".js-show-search").on("click", function() {
      let window_w = $(window).width();
      let search_block = $(this).parents(".header__search");
      let search_form = search_block.find(".header__search-form");
      let search_field_width = 0;

      if (window_w > 1024) {
        search_field_width = window_w - (window_w - $(this).offset().left) * 2;
      } else {
        search_field_width = $(widget).find(".header__area-logo").innerWidth() - 20;
      }

      if (search_block.is(".is-show")) {
        search_block.removeClass("is-show");
        $(widget).find(".header__logo").removeClass("is-hide");
      } else {
        search_form.css("width", search_field_width)
        $(widget).find(".header__logo").addClass("is-hide");
        search_block.addClass("is-show");

        setTimeout(function() {
          search_block.find(".header__search-field").focus();
        }, 50);
      }
    });

    $(widget).find(".js-show-side-panel").on("click", function() {
      $(widget).find(".header-overlay").addClass("is-show");
      $(widget).find(".side-panel").addClass("is-show");
      $(widget).find(".side-panel").css("visibility", "");
    });

    $(widget).find(".js-hide-side-panel").on("click", function() {
      $(widget).find(".header-overlay").removeClass("is-show");
      $(widget).find(".side-panel").removeClass("is-show");
    });

    $(widget).find(".js-toggle-languages-list").on("click", function() {
      $(this).parents(".header__languages").toggleClass("is-show");
    });

    if ($(window).width() >= mobilePoint) {
      new InsalesCutList($(widget).find(".js-cut-list"), {
        moreBtnTitle: '<span class="icon icon-ellipsis-h"></span>',
        showMoreOnHover: true
      });
    }
  });

  $(window).on('resize', function() {
  // Для touch-устройств resize срабатывает при появление клавиатуры
    if (!isTouch) {
      $(widget).find(".header__search").removeClass("is-show");
      $(widget).find(".header__logo").removeClass("is-hide");
    }
  });

  EventBus.subscribe(
    [
      "widget:input-setting:insales:system:editor",
      "widget:change-setting:insales:system:editor",
    ],
    () => {
      $(widget).find(".js-cut-list-collections").resize();
      $(widget).find(".header__search").removeClass("is-show");
      $(widget).find(".header__logo").removeClass("is-hide");
    }
  );
});
