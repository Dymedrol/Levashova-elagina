console.log('@!!!')

EventBus.subscribe('remove_items:insales:cart', function (data) {
    console.log('Товары удалены');
});

EventBus.subscribe('delete_items:insales:cart', function (data) {
    console.log('Товары удалены');
  });