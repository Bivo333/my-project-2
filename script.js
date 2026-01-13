window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.card').forEach(card => {
    card.style.opacity = 0;
    setTimeout(() => {
      card.style.transition = "opacity 1s";
      card.style.opacity = 1;
    }, 200);
  });
});
