$(function() {

  MicroModal.init({
    disableFocus: true,
    disableScroll: true,
    // onShow: ,
    onClose: function(modal, element, event) {
      event.preventDefault();
      event.stopPropagation();
    },
  });

  let videos = [...$("video.fslightbox-source")];
  for (var i = 0; i < videos.length; i++) {
    console.log(videos[i]);
    videos[i].controls = false;
    videos[i].autoplay = "true";
    videos[i].playsinline = "true";
    videos[i].loop = "true";
    videos[i].muted = "true";
  }

  $(".splide__slide video").each(function() {
    $(this).attr("autoplay", "true");
    $(this).attr("muted", "true");
    $(this).attr("playsinline", "true");
    $(this).attr("loop", "true");
  });

  $widget.each(function() {
    let productGalleryBlock = $(this).find(".js-product-gallery");

    if (productGalleryBlock.length > 0) {
      initProductGallerySlider(productGalleryBlock);
    }
  });

  $widget.on("click", ".js-product-gallery-tumbs-slide", function() {
    let slide_index = $(this).attr("data-product-img-index");
    let slider_main_inst = $(this)
      .parents(".js-product-gallery")
      .find(".js-product-gallery-main")[0].splide;

    if (slider_main_inst) {
      slider_main_inst.go(Number(slide_index));
    }
  });

  fixedBuyBtnOnMobile($widget);

  $(widget)
    .find(".product__back-btn")
    .on("click", function() {
      if (history.length > 2) {
        window.history.back();
      } else {
        window.location.href = "/";
      }
    });

  $(widget)
    .find(".product__block-title")
    .on("click", function() {
      $(this).parent(".toggle-menu").toggleClass("is-show");
    });

  $widget.find(".js-show-replied-manager").on("click", function() {
    $(this).parents(".reviews-item").addClass("is-show-replied");
  });

  $widget.find(".js-hide-replied-manager").on("click", function() {
    $(this).parents(".reviews-item").removeClass("is-show-replied");
  });

  $widget.find(".js-show-all-reviews").on("click", function() {
    $(this)
      .parents(".reviews")
      .find(".reviews-item.is-hide")
      .removeClass("is-hide");
    $(this).hide();
  });

  $widget.find(".js-show-review-form").on("click", function() {
    $(this)
      .toggleClass("is-hide")
      .parents(".product__reviews")
      .find(".reviews-wrapper")
      .toggleClass("is-hide");
  });

  EventBus.subscribe(
    [
      "widget:input-setting:insales:system:editor",
      "widget:change-setting:insales:system:editor",
    ],
    (data) => {
      if (
        data.widget_id == $widget.parents(".editable-widget").data("widgetId")
      ) {
        if (data.setting_name == "show-selected-variant-photos") {
          let product_node = $widget.find("[data-product-id]:first");

          product_node.attr(
            "data-gallery-type",
            data.value ? "variant-photos" : "all-photos"
          );
          configurateVariantsPhoto(product_node);
        } else {
          updateProductGallerySlider(data);
        }
      }
    }
  );

  EventBus.subscribe("init_instance:insales:product", (data) => {
    if (data.action && data.action.productJSON) {
      let product_block = `[data-product-id="${data.action.productJSON.id}"]`;
      let $product_block = $(product_block);
      $product_block.addClass("product-inited");
    }
  });

  EventBus.subscribe("change_variant:insales:product", function(data) {
    $widget.each(function(index, el) {
      let product_node = data.action.product || $('<div>');
      let product_id = product_node.attr("data-product-id");
      let is_cur_product_instance =
      $(data.action.product[0])
        .parents(".layout:first").is($(el));

      if (
        data.action &&
        data.action.product &&
        data.first_image.url &&
        data.product_id == product_id &&
        is_cur_product_instance
      ) {
        let variant_photos = [];
        let product_img_ids = [];

        let product_imgs = data.action.productJSON.images;
        let product_variants = data.action.productJSON.variants;

        if (data.image_id) {
          if (data.image_ids && data.image_ids.length > 0) {
            variant_photos.push.apply(variant_photos, data.image_ids);
          }

          product_imgs.forEach(function(item) {
            product_img_ids.push(item.id);
          });

          product_img_ids.forEach(function(imageId) {
            let is_image_for_all_variants = true;

            product_variants.forEach(function(variantItem) {
              let variant_imgs = variantItem.image_ids;

              if (variant_imgs.indexOf(imageId) != -1) {
                is_image_for_all_variants = false;
              }
            });

            if (is_image_for_all_variants) {
              variant_photos.push(imageId);
            }
          });
        }

        product_node.attr("data-variant-photos", variant_photos);
        product_node.attr("data-variant-id", data.id);
        product_node.attr("data-variant-first-img-id", data.first_image.id);

        let gallery_type = product_node.attr("data-gallery-type");

        if (gallery_type == "variant-photos") {
          configurateVariantsPhoto(product_node);
        } else {
          if (product_node.is("[data-is-gallery-type-all-photos]")) {
            goToCurrentVariantPhoto(product_node);
          } else {
            configurateVariantsPhoto(product_node);
          }
        }
      }
    });
  });

  EventBus.subscribe("reviews-open:insales:site", function() {
    let reviews_block = $widget.find(".reviews");

    if (reviews_block.length) {
      $("html, body").animate(
        { scrollTop: reviews_block.offset().top - 20 },
        500
      );
    }
  });

  EventBus.subscribe('send-review:insales:ui_reviews', (data) => {
    const $thisWidget = $(data.form[0].closest('.layout'));

    // Проверяем что событие прилетело для этого виджета
    if ($thisWidget.attr('class') !== $widget.attr('class')) { return; }

    const review_notice_success = $thisWidget.find("[data-reviews-form-success]");
    const file_input = $thisWidget.find("[data-reviews-file-input-name]");

    if (file_input.length) {
      file_input.text(file_input.data('reviews-file-input-name'));
    }

    if (review_notice_success.length) {
      $('html,body').animate({
        scrollTop: review_notice_success.offset().top
      }, 'smooth');
    }
  });
});

function initProductGallerySlider(galleryBlock) {
  let mainSliderBlock = galleryBlock.find(".js-product-gallery-main");
  let tumbsSliderBlock = galleryBlock.find(".js-product-gallery-tumbs");

  mainSliderBlock.find('.product__slide-main.play-video').each(function(index, el) {
    let $splideVideoItem = $(el)

    $(el).find('iframe[src*="rutube"]').each(function(index, iframe) {
      let $controlPlay = $splideVideoItem.find('.control.play');
      $controlPlay[0].dataset.iframeSrc = iframe.src;
      iframe.src = '';

      $controlPlay.on('click', function(e) {
        let targetSrc = e.target.parentNode.dataset.iframeSrc;

        if (targetSrc === $controlPlay[0].dataset.iframeSrc) {
          $(`.fslightbox-absoluted .fslightbox-fade-in-strong #${iframe.id}`).attr('src', targetSrc);
        }
      })
    })
  });
  let img_id = mainSliderBlock.parents('[data-variant-first-img-id]:first').attr("data-variant-first-img-id");
  let startIndex = 0;
  let currentImage = mainSliderBlock.find(`[data-product-img-id="${img_id}"]`);
  if (currentImage.length) {
    startIndex = currentImage.index()
  }

  mainSliderBlock[0].splide = new Splide(mainSliderBlock[0], {
    gap: 1,
    start: startIndex
  });

  mainSliderBlock[0].splide.on("move", function(newIndex) {
    let slide_index = newIndex;
    let slider_tumbs_node = mainSliderBlock
      .parents(".js-product-gallery")
      .find(".js-product-gallery-tumbs");
    let slider_tumbs_inst = slider_tumbs_node[0].splide;

    if (slider_tumbs_inst) {
      slider_tumbs_inst.go(Number(slide_index));
      slider_tumbs_node
        .find(".splide__slide.is-current")
        .removeClass("is-current");
      slider_tumbs_node
        .find(".splide__slide[data-product-img-index=" + slide_index + "]")
        .addClass("is-current");
    }
  });

  mainSliderBlock[0].splide.mount();

  tumbsSliderBlock[0].splide = new Splide(tumbsSliderBlock[0], {
    perPage: 5,
    perMove: 1,
    gap: "1rem",
    pagination: false,
    start: startIndex
  });

  tumbsSliderBlock
    .find(".splide__slide.is-current")
    .removeClass("is-current");
  tumbsSliderBlock
    .find(".splide__slide[data-product-img-index=" + startIndex + "]")
    .addClass("is-current");

  tumbsSliderBlock[0].splide.mount();
}

function configurateVariantsPhoto(productNode) {
  let product_gallery_block = productNode.find(".js-product-gallery");
  let videoFirst = productNode.find(".js-product-all-images.video-first");

  if (product_gallery_block.length > 0) {
    let gallery_type = productNode.attr("data-gallery-type");
    let variant_id = productNode.attr("data-variant-id");
    let variant_photos_ids = productNode
      .attr("data-variant-photos")
      .split(",")
      .filter((element) => element !== "");
    let sizeVideo = productNode.data('video-size')

    if (variant_photos_ids.length > 0 && sizeVideo && sizeVideo > 0) {
      for (let i = sizeVideo - 1; i >= 0; i--) {
        if (videoFirst.length > 0) {
          variant_photos_ids.unshift(i);
        } else {
          variant_photos_ids.push(i);
        }
      }
    }

    let slider_main_inst = productNode.find(".js-product-gallery-main")[0]
      .splide;
    let slider_tumbs_inst = productNode.find(".js-product-gallery-tumbs")[0]
      .splide;

    let showVariantPhotos = () => {
      for (let i = 0; i < variant_photos_ids.length; i++) {
        let result_main_slide = productNode.find(
          '.js-product-all-images .product__slide-main[data-product-img-id="' +
            variant_photos_ids[i] +
            '"]'
        );
        let result_tumbs_slide = productNode.find(
          '.js-product-all-images .product__slide-tumbs[data-product-img-id="' +
            variant_photos_ids[i] +
            '"]'
        );

        if (result_main_slide.length > 0) {
          let main_slide_clone = result_main_slide
            .clone()
            .attr("data-product-img-index", i);
          main_slide_clone
            .find(".product__photo")
            .attr("data-fslightbox", "product-photos-lightbox-" + variant_id);
          main_slide_clone.appendTo(
            $(slider_main_inst.Components.Elements.list)
          );
        }

        if (result_tumbs_slide.length > 0) {
          let tumbs_slide_clone = result_tumbs_slide
            .clone()
            .attr("data-product-img-index", i);

          if (i == 0) {
            tumbs_slide_clone.addClass("is-current");
          }

          tumbs_slide_clone.appendTo(
            $(slider_tumbs_inst.Components.Elements.list)
          );
        }
      }

      if (variant_photos_ids.length > 1) {
        product_gallery_block.removeClass("is-shown-one-photo");
      } else {
        product_gallery_block.addClass("is-shown-one-photo");
      }
    };

    let showAllProductPhotos = () => {
      let all_main_photos = productNode.find(
        ".js-product-all-images .product__slide-main"
      );
      let all_tumbs_photos = productNode.find(
        ".js-product-all-images .product__slide-tumbs"
      );

      all_main_photos.each(function(index, el) {
        let main_slide_clone = $(el)
          .clone()
          .attr("data-product-img-index", index);
        main_slide_clone
          .find(".product__photo")
          .attr("data-fslightbox", "product-photos-lightbox-" + variant_id);
        main_slide_clone.appendTo($(slider_main_inst.Components.Elements.list));
      });

      all_tumbs_photos.each(function(index, el) {
        let tumbs_slide_clone = $(el)
          .clone()
          .attr("data-product-img-index", index);

        if (index == 0) {
          tumbs_slide_clone.addClass("is-current");
        }

        tumbs_slide_clone.appendTo(
          $(slider_tumbs_inst.Components.Elements.list)
        );
      });

      if (all_main_photos.length > 1) {
        product_gallery_block.removeClass("is-shown-one-photo");
      } else {
        product_gallery_block.addClass("is-shown-one-photo");
      }
    };

    $(slider_main_inst.Components.Elements.list).html("");
    $(slider_tumbs_inst.Components.Elements.list).html("");

    slider_main_inst.destroy();
    slider_tumbs_inst.destroy();

    if (gallery_type == "variant-photos") {
      if (variant_photos_ids.length > 0) {
        showVariantPhotos();
      } else {
        showAllProductPhotos();
      }
      initProductGallerySlider(product_gallery_block);
      productNode.removeAttr("data-is-gallery-type-all-photos");
    } else {
      showAllProductPhotos();
      initProductGallerySlider(product_gallery_block);
      goToCurrentVariantPhoto(productNode);
      productNode.attr("data-is-gallery-type-all-photos", "");
    }

    refreshFsLightbox();
  }
}

function updateProductGallerySlider(data) {
  let widget_slider_main_node = $(
    '[data-widget-id="' + data.widget_id + '"] .js-product-gallery-main'
  );
  let widget_slider_tumbs_node = $(
    '[data-widget-id="' + data.widget_id + '"] .js-product-gallery-tumbs'
  );

  if (widget_slider_main_node.length) {
    let sliderMainInst = widget_slider_main_node[0].splide;
    setTimeout(function() {
      sliderMainInst.refresh();
    }, 0);
  }

  if (widget_slider_tumbs_node.length) {
    let sliderTumbsInst = widget_slider_tumbs_node[0].splide;
    setTimeout(function() {
      sliderTumbsInst.refresh();
    }, 0);
  }
}

function goToCurrentVariantPhoto(productNode) {
  let img_id = productNode.attr("data-variant-first-img-id");
  let videoFirst = productNode.find(".js-product-all-images.video-first").not('.after-inited');
  let result_slide_elem_first_video = productNode.find(
    '.js-product-gallery-main [data-product-img-id="0"]'
  );
  let result_slide_elem = productNode.find(
    '.js-product-gallery-main [data-product-img-id="' + img_id + '"]'
  );

  if (result_slide_elem.length > 0) {
    let sliderMainInst = productNode.find(".js-product-gallery-main")[0].splide;

    if (sliderMainInst) {
      if (videoFirst.length > 0) {
        sliderMainInst.go(
          Number(result_slide_elem_first_video.attr("data-product-img-index"))
        );
      } else {
        sliderMainInst.go(
          Number(result_slide_elem.attr("data-product-img-index"))
        );
      }

      let slider_tumbs_node = productNode.find(".js-product-gallery-tumbs");
      slider_tumbs_node
        .find(".splide__slide.is-current")
        .removeClass("is-current");
      if (videoFirst.length > 0) {
        slider_tumbs_node
          .find(
            ".splide__slide[data-product-img-index=" +
               result_slide_elem_first_video.attr("data-product-img-index") +
              "]"
          )
          .addClass("is-current");
      } else {
        slider_tumbs_node
          .find(
            ".splide__slide[data-product-img-index=" +
              result_slide_elem.attr("data-product-img-index") +
              "]"
          )
          .addClass("is-current");
      }
    }
  }
  if (videoFirst.length > 0) {
    videoFirst.addClass('after-inited')
  }
}

$widget.find(".js-load-review-image").on("change", function() {
  let str = $(this).val();
  let i = str.lastIndexOf("/") + 1;

  if (str.lastIndexOf("\\")) {
    i = str.lastIndexOf("\\") + 1;
  }

  let filename = str.slice(i);

  $widget.find(".load-review-image-name").html(filename);
});

function fixedBuyBtnOnMobile(widgetLayout) {
  if (widgetLayout.find("#product-detail-buy-area").length === 0) {
    return false;
  }

  configureBuyBtn();

  $(window).on("scroll resize", configureBuyBtn);
  EventBus.subscribe("init_instance:insales:product", configureBuyBtn);

  function configureBuyBtn() {
    if (widgetLayout.find('.hide-all-buttons').length || widgetLayout.find('.is-show-marketplace-button').length) {
      return; // Если один из классов найден, выходим из функции
    }
    let buy_area = widgetLayout.find("#product-detail-buy-area");
        let isVisible = buy_area.is(":visible")
    if (!isVisible) {
      return
    }

    let buy_area_height = buy_area.innerHeight();
    let fixed_bottom_panel = $('[data-fixed-panels="bottom"]');

    if ($(window).width() < 768) {
      let fixed_bottom_panel_height = 0;

      if (
        fixed_bottom_panel.length &&
        !fixed_bottom_panel.is(".is-no-layouts")
      ) {
        fixed_bottom_panel_height = fixed_bottom_panel.innerHeight();
      }

      let btn_area_height = buy_area
        .find(".product__buy-btn-area-inner")
        .innerHeight();
      let new_bottom_offset = `${
        fixed_bottom_panel_height + btn_area_height
      }px`;

      buy_area
        .css("height", buy_area_height)
        .addClass("is-fixed-state")
        .css("--product-buy-fixed-position", `${fixed_bottom_panel_height}px`);
      if (widgetLayout.find(".product-form__area-not-available").is(":hidden")) {
        buy_area.parent().css("height", "0");
      } else {
        buy_area.parent().css("height", "auto");
      }
      $("html").css("--fixed-panels-bottom-offset", new_bottom_offset);
    } else {
      let fixed_bottom_panel_height = 0;

      if (
        fixed_bottom_panel.length &&
        !fixed_bottom_panel.is(".is-no-layouts")
      ) {
        fixed_bottom_panel_height = fixed_bottom_panel.innerHeight();
      }

      buy_area.css("height", "auto").removeClass("is-fixed-state");
      buy_area.parent().css("height", "auto");
      $("html").css(
        "--fixed-panels-bottom-offset",
        `${fixed_bottom_panel_height}px`
      );
    }
  }
}

// Отключаем увеличение картинок в галерее
let fs_gallery = document.querySelector(".product__area-photo");

if (fs_gallery) {
  fs_gallery.addEventListener("click", (event) => {
    $(".fslightbox-absoluted video").each(function() {
      $(this).get(0).play();
      $(this).get(0).controls = false;
      $(this).get(0).autoplay = true;
      $(this).get(0).muted = true;
      $(this).get(0).playsinline = true;
      $(this).get(0).loop = true;
    });

    if (
      event.target.nodeName === "IMG" &&
      event.target.closest(".product__gallery-main")
    ) {
      let items = document.querySelectorAll(".fslightbox-absoluted");
      items.forEach(function(item) {
        item.addEventListener(
          "touchmove",
          (event) => {
            event.preventDefault();
          },
          { passive: false }
        );
      });
    }
  });
}
