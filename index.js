import loaderAnimation from './loaderAnimation.js';
import navigationToggle from './navigationToggle.js';
import pointerAnimation from './pointerAnimation.js';

document.addEventListener('DOMContentLoaded', () => {
  
  const isHome = document.querySelector('.home');
  pointerAnimation()
  // scrollAnimation()
  navigationToggle()


  if (isHome) {
    new Swiper('.blogSwiper', {
      speed: 800,
      slidesPerView: 1.2,
      centeredSlides: true,
      spaceBetween: 30,
      grabCursor: true,
      // useCSS3D: true,
      // useCSS3DTransform: true,
      
      // Full width
      // width: '100vw',
      navigation: {
        nextEl: '.blog-button-next',
        prevEl: '.blog-button-prev',
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 40,
        },
        1024: {
          slidesPerView: 2.5,
          spaceBetween: 50,
        },
        1200: {
          slidesPerView: 3,
          spaceBetween: 60,
        },
      },
    });
  }

})

/* ---------------------- Loader Animation ---------------------- */
window.addEventListener('load', async () => {
  loaderAnimation()
})
