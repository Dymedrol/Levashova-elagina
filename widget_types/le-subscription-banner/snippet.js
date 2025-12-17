$widget.each(function(index, el) {
  let $widget = $(el);
  let $form = $widget.find('.js-subscription-form');

  $form.on('submit', function(e) {
    e.preventDefault();
    
    let email = $form.find('input[type="email"]').val();
    let consent = $form.find('input[type="checkbox"]').is(':checked');
    
    if (!email) {
      return false;
    }
    
    if (!consent) {
      alert('Необходимо дать согласие на обработку персональных данных');
      return false;
    }
    
    // Здесь можно добавить отправку данных на сервер
    // Например, через AJAX запрос или стандартную отправку формы
    // this.submit(); // для стандартной отправки
    
    // Временное сообщение об успехе
    alert('Спасибо за подписку!');
    
    return false;
  });
});


