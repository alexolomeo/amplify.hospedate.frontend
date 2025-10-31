export const changeSlide = (targetId: string) => {
  const targetSlide = document.getElementById(targetId);
  if (targetSlide) {
    targetSlide.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }
};

export const initializeCarousel = () => {
  const navButtons = document.querySelectorAll('.carousel-nav');
  navButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const targetId = button.getAttribute('data-target');
      if (targetId) {
        changeSlide(targetId);
      }
    });
  });
};

initializeCarousel();
