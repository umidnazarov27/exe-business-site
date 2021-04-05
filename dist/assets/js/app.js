const toggle = document.querySelector('#toggle'),
  nav = document.querySelector('#nav'),
  header = document.querySelector('#header');

toggle.addEventListener('click', function (e) {
  e.preventDefault();

  toggleClass(toggle);
  toggleClass(nav);
  toggleClass(header);
});

function toggleClass(param) {
  if (param.classList.contains('active')) {
    param.classList.remove('active');
  } else {
    param.classList.add('active');
  }
}