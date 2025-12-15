var mobile_point = 767;

function sortProductsByIds(productIds, productsObj) {
  // Возвращаем массив товаров, отсортированный как в productIds
  return productIds.map(id => productsObj[id]);
}

$widget.each(function(index, el) {
  let $widget = $(el)
  Products.getRecentlyViewed()
    .done(function(products) {
      let viewed_products = products;

      if (viewed_products) {
        let cur_product_id = $widget.find("[data-is-page-product]").data("isPageProduct");

        if (typeof cur_product_id !== 'undefined') {
          let index_cur_product = viewed_products.indexOf(cur_product_id);

          if (index_cur_product !== -1) {
            viewed_products.splice(index_cur_product, 1);
          }
        }

        if (viewed_products.length == 0) {
          $widget.addClass("is-empty-viewed_products");
          return false;
        }

        // Ограничиваем до 4 товаров
        viewed_products = viewed_products.slice(0, 4);

        let special_products = $widget.find(".js-special-products");
        let products_list = $widget.find(".special-products__list");
        let price_label = products_list.data("priceLabel");
        let slide_gap = products_list.data("slideGap");

        // Применяем gap из настроек (только горизонтальный gap для одной линии)
        if (slide_gap !== undefined) {
          products_list.css('gap', `${slide_gap}px`);
        }

        Products.getList(viewed_products).done(function(data) {
          const sortedProducts = sortProductsByIds(viewed_products, data);

          sortedProducts.forEach(item_info => {
            if (!item_info) { return; }

            let product_elem = addViewedProduct(item_info, price_label);
            products_list.append(product_elem);
          });

        }).fail(function(onFail) { console.log('onFail', onFail) });
      } else {
        $widget.addClass("is-empty-viewed_products");
      }
    });
});

function addViewedProduct(productData, priceLabel) {
  let price_text = Shop.money.format(productData.price_min);
  
  if (productData.price_varies) {
    price_text = priceLabel + ' ' + price_text;
  }

  return `
    <a href="${productData.url}" class="le-shop-product">
      <img src="${productData.first_image.medium_url}" alt="${productData.title}" class="le-shop-product__pic" loading="lazy">
      <div class="le-shop-product__title">${productData.title}</div>
      <span class="le-shop-product__price">${price_text}</span>
    </a>
  `;
}

