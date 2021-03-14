$('#toggle').on('click', function (event) {
  // Отменять действие по умолчанию
  event.preventDefault();

  // Переключать бургер
  navToggle();
});

function navToggle() {
  // Переключать класс active у бургера
  $('#toggle').toggleClass('active');
  // Переключать класс active у меню
  $('#nav').toggleClass('active');
}
