// eslint-disable-next-line no-unused-vars

import loaderAnimation from './loaderAnimation.js';
import navigationToggle from './navigationToggle.js';
import pointerAnimation from './pointerAnimation.js';

document.addEventListener('DOMContentLoaded', () => {

  const video = document.querySelector('.hero-section video');
  const playButton = document.querySelector('.video-play-button');
  let home = document.querySelector('.home')
  const isHome = document.querySelector('.home');

  const dynamicHeightEl = document.getElementById('horizontal-scroll');
  const objectEl = document.getElementById('scrollWrapper');

  // Easing config
  const ease = 0.12; // lower = smoother/laggier, higher = snappier
  let targetX = 0;
  let currentX = 0;
  let animating = false;

  function calcDynamicHeight(objectWidth) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    return objectWidth - vw + vh + 150;
  }

  function setDynamicHeight() {
    if (!objectEl || !dynamicHeightEl) return;
    const objectWidth = objectEl.scrollWidth;
    const dynamicHeight = calcDynamicHeight(objectWidth);
    dynamicHeightEl.style.height = `${dynamicHeight}px`;
    updateTarget(); // refresh target after layout change
    kickAnimation(); // ensure animation loop is running
  }

  function getSectionProgress() {
    if (!dynamicHeightEl) return 0;
    const sectionTop = dynamicHeightEl.offsetTop;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    const vh = window.innerHeight;
    const sectionHeight = dynamicHeightEl.offsetHeight;
    const maxScroll = Math.max(sectionHeight - vh, 0);
    const current = Math.min(Math.max(scrollY - sectionTop, 0), maxScroll);
    return current;
  }

  function updateTarget() {
    targetX = -getSectionProgress();
  }

  // Animation loop that eases currentX towards targetX
  function animate() {
    animating = true;

    const dx = targetX - currentX;
    // snap if close enough to avoid subpixel jitter
    if (Math.abs(dx) < 0.1) {
      currentX = targetX;
    } else {
      currentX += dx * ease;
    }

    if (objectEl) {
      objectEl.style.transform = `translate3d(${currentX}px, 0, 0)`;
    }

    // keep animating while not settled OR while user is scrolling
    if (Math.abs(dx) >= 0.1) {
      requestAnimationFrame(animate);
    } else {
      animating = false;
    }
  }

  function kickAnimation() {
    if (!animating) requestAnimationFrame(animate);
  }

  // Scroll & resize handlers
  function onScroll() {
    updateTarget();
    kickAnimation();
  }

  function onResize() {
    setDynamicHeight();
  }

  // Recalculate after images load (in case widths change)
  function whenImagesReady(cb) {
    const imgs = Array.from(objectEl.querySelectorAll('img'));
    if (imgs.length === 0) return cb();
    let loaded = 0;
    const done = () => (++loaded === imgs.length && cb());
    imgs.forEach(img => {
      if (img.complete) return done();
      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', done, { once: true });
    });
  }

  // Observe size changes to the horizontal content
  if ('ResizeObserver' in window && objectEl) {
    const ro = new ResizeObserver(() => setDynamicHeight());
    ro.observe(objectEl);
  }

  // Init
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);

  // Run after fonts & images for accurate widths
  const ready = () => whenImagesReady(setDynamicHeight);
  if (document.readyState === 'complete') {
    ready();
  } else {
    window.addEventListener('load', ready, { once: true });
  }

  // If fonts affect width, recalc when fonts settle
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => setDynamicHeight());
  }



  
  pointerAnimation()
  // scrollAnimation()
  navigationToggle()



  



  function videoAnimation() {

    if (video && playButton) {
      // Ensure video starts paused and muted
      video.pause();
      video.muted = true;

      // Show the play button initially (video is paused)
      playButton.style.opacity = '1';

      // Manual play button functionality (toggle play/pause)
      playButton.addEventListener('click', () => {
        if (video.paused) {
          video.play();
          video.muted = false;
        } else {
          video.pause();
        }
      });

      // Video click to play/pause
      video.addEventListener('click', () => {
        if (video.paused) {
          video.play();
          video.muted = false;
        } else {
          video.pause();
        }
      });

      // Sync button visibility with playback state
      video.addEventListener('play', () => {
        playButton.style.opacity = '0';
      });

      video.addEventListener('pause', () => {
        playButton.style.opacity = '1';
      });

      video.addEventListener('ended', () => {
        playButton.style.opacity = '1';
      });

      // Pause video on scroll
      let isScrolling = false;
      let scrollTimeout;

      function handleScroll() {
        if (!isScrolling) {
          isScrolling = true;
          // Pause video when scrolling starts
          if (!video.paused) {
            video.pause();
          }
        }

        // Clear existing timeout
        clearTimeout(scrollTimeout);
        
        // Set timeout to detect when scrolling stops
        scrollTimeout = setTimeout(() => {
          isScrolling = false;
        }, 150); // 150ms delay after scroll stops
      }

      // Add scroll event listener
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
  }

  function atsAnimation() {

    gsap.from('.panel-2 .ats-title', {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.panel-2',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    })

    gsap.from('.panel-2 .ats-description', {
      y: 150,
      opacity: 0,
      duration: 1,
      delay: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.panel-2',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    })

    // Cards animation - 3D stacked to horizontally spread
    const cards = gsap.utils.toArray('.panel-2 .ats-card')

    // Add perspective to the container to prevent shrinking
    gsap.set('.panel-2 .ats-cards', {
      perspective: 1200,
      transformStyle: 'preserve-3d',
    })

    // Set initial 3D stacked state with preserved scale
    gsap.set(cards, {
      transformOrigin: 'center center',
      transformStyle: 'preserve-3d',
      opacity: 0.9,
      scale: 1,
    })

    // Stagger the cards in a stacked formation with less extreme rotations
    gsap.set(cards[0], {
      x: 280,
      y: 150,
      z: -50,
      rotationY: -65,
      rotationX: -3,
      rotationZ: 3,
      opacity: 0.9,
    })

    gsap.set(cards[1], {
      x: 0,
      y: 150,
      z: 0,
      rotationY: -65,
      rotationX: -3,
      rotationZ: 3,
      opacity: 0.9,
    })

    gsap.set(cards[2], {
      x: -250,
      y: 150,
      z: 50,
      rotationY: -65,
      rotationX: -3,
      rotationZ: 3,
      opacity: 0.9,
    })

    // Animate from stacked to normal positions
    gsap.fromTo(
      cards,
      {},
      {
        x: 0,
        y: 0,
        z: 0,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        opacity: 1,
        duration: 0.5,
        delay: 0.5,
        ease: 'power3.out',
        stagger: {
          each: 0.2,
          from: 'center',
        },
        scrollTrigger: {
          trigger: '.panel-2 .ats-cards',
          markers: false,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        onComplete: function () {
          gsap.set(cards, {
            clearProps: 'all',
          })
        },
      }
    )
  }
  if (home) atsAnimation();

  videoAnimation();

  new Swiper('.blogSwiper', {

    speed: 800,
    slidesPerView: 1.5,
    centeredSlides: true,
    slidesOffsetBefore: 0,
    slidesOffsetAfter: 0,
    spaceBetween: 30,
    grabCursor: true,
    // loop: true,
    useCSS3D: true,
    useCSS3DTransform: true,
    on: {
      init(swiper) {
        // remove initial left offset added by centeredSlides
        swiper.setTranslate(0)
      }
    },

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


})

/* ---------------------- Loader Animation ---------------------- */
window.addEventListener('load', async () => {
  loaderAnimation()
})
