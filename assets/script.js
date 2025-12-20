document.addEventListener('DOMContentLoaded', function () {
  const enterButton = document.querySelector('.enter-button');
  if (enterButton) {
    enterButton.addEventListener('click', function () {
      document.body.classList.toggle('active');
    });
  }
});
