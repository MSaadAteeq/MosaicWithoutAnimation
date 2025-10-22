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
  const objectEl = document.getElementById('teamCards');

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
    
    // Check if height is already set via CSS (like !important)
    const computedStyle = window.getComputedStyle(dynamicHeightEl);
    const currentHeight = computedStyle.height;
    
    // If height is already set to a specific value (not auto), don't override it
    if (currentHeight !== 'auto' && currentHeight !== '0px') {
      updateTarget(); // refresh target after layout change
      kickAnimation(); // ensure animation loop is running
      return;
    }
    
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
    
    // For fixed height sections, use the actual content width for scroll calculation
    const objectWidth = objectEl ? objectEl.scrollWidth : 0;
    const maxScroll = Math.max(sectionHeight - vh, 0);
    const current = Math.min(Math.max(scrollY - sectionTop, 0), maxScroll);
    
    // Calculate progress as a percentage of the section height
    const progress = maxScroll > 0 ? current / maxScroll : 0;
    
    // Map this progress to the actual horizontal scroll distance
    const horizontalScrollDistance = objectWidth - window.innerWidth;
    return progress * horizontalScrollDistance;
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
      opacity: 0.7,
    })

    gsap.set(cards[2], {
      x: -250,
      y: 150,
      z: 50,
      rotationY: -65,
      rotationX: -3,
      rotationZ: 3,
      opacity: 0.5,
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
          // each: 0.2,
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

  // Simple carousel implementation - starts from left edge
  const blogSwiper = document.querySelector('.blogSwiper');
  const blogWrapper = blogSwiper.querySelector('.swiper-wrapper');
  const blogSlides = blogSwiper.querySelectorAll('.swiper-slide');
  const prevBtn = document.querySelector('.blog-button-prev');
  const nextBtn = document.querySelector('.blog-button-next');
  
  let currentIndex = 0;
  let isAnimating = false;
  
  // Get responsive settings
  function getResponsiveSettings() {
    const width = window.innerWidth;
    if (width < 768) {
      return { slidesPerView: 1, spaceBetween: 20, padding: 20 };
    } else if (width < 1024) {
      return { slidesPerView: 2, spaceBetween: 30, padding: 0 };
    } else if (width < 1400) {
      return { slidesPerView: 2, spaceBetween: 40, padding: 0 };
    } else {
      return { slidesPerView: 3, spaceBetween: 30, padding: 0 };
    }
  }
  
  function updateCarousel() {
    if (isAnimating) return;
    
    const settings = getResponsiveSettings();
    const containerWidth = blogSwiper.offsetWidth;
    
    // Apply padding for mobile
    if (settings.padding > 0) {
      blogSwiper.style.paddingLeft = `${settings.padding}px`;
      blogSwiper.style.paddingRight = `${settings.padding}px`;
    } else {
      blogSwiper.style.paddingLeft = '0';
      blogSwiper.style.paddingRight = '0';
    }
    
    // Calculate effective container width (minus padding)
    const effectiveWidth = containerWidth - (settings.padding * 2);
    
    // Calculate slide width more precisely to prevent cutoff
    const totalSlides = Math.floor(settings.slidesPerView);
    const totalGaps = (totalSlides - 1) * settings.spaceBetween;
    let slideWidth = Math.floor((effectiveWidth - totalGaps) / totalSlides);
    
    // Ensure minimum slide width to prevent weird appearance
    const minSlideWidth = 280; // Minimum width for cards to look good
    if (slideWidth < minSlideWidth && totalSlides > 1) {
      // If cards would be too narrow, reduce slides per view
      const maxSlides = Math.floor((effectiveWidth + settings.spaceBetween) / (minSlideWidth + settings.spaceBetween));
      if (maxSlides < totalSlides) {
        // Recalculate with fewer slides
        const newTotalGaps = (maxSlides - 1) * settings.spaceBetween;
        slideWidth = Math.floor((effectiveWidth - newTotalGaps) / maxSlides);
        settings.slidesPerView = maxSlides;
      }
    }
    
    // Update totalSlides after potential adjustment
    const finalTotalSlides = Math.floor(settings.slidesPerView);
    
    // Set slide styles
    blogSlides.forEach((slide, index) => {
      slide.style.width = `${slideWidth}px`;
      slide.style.marginRight = index < blogSlides.length - 1 ? `${settings.spaceBetween}px` : '0';
      slide.style.flexShrink = '0';
    });
    
    // Calculate max translate to ensure last card is fully visible
    const totalContentWidth = (slideWidth + settings.spaceBetween) * blogSlides.length - settings.spaceBetween;
    const maxTranslate = Math.max(0, totalContentWidth - effectiveWidth);
    
    // Safety check: ensure we don't exceed container bounds
    const maxPossibleIndex = Math.max(0, blogSlides.length - finalTotalSlides);
    currentIndex = Math.min(currentIndex, maxPossibleIndex);
    
    // Calculate and apply transform with boundary check
    let translateX = -(currentIndex * (slideWidth + settings.spaceBetween));
    translateX = Math.max(-maxTranslate, Math.min(0, translateX));
    
    blogWrapper.style.transform = `translateX(${translateX}px)`;
    blogWrapper.style.transition = 'transform 0.6s ease';
  }
  
  function nextSlide() {
    if (isAnimating) return;
    const settings = getResponsiveSettings();
    const containerWidth = blogSwiper.offsetWidth;
    const effectiveWidth = containerWidth - (settings.padding * 2);
    const totalSlides = Math.floor(settings.slidesPerView);
    const totalGaps = (totalSlides - 1) * settings.spaceBetween;
    const slideWidth = Math.floor((effectiveWidth - totalGaps) / totalSlides);
    
    // Calculate if we can move to next slide without cutting off the last card
    const totalContentWidth = (slideWidth + settings.spaceBetween) * blogSlides.length - settings.spaceBetween;
    const maxTranslate = Math.max(0, totalContentWidth - effectiveWidth);
    const nextTranslate = -((currentIndex + 1) * (slideWidth + settings.spaceBetween));
    
    if (nextTranslate >= -maxTranslate) {
      currentIndex++;
      updateCarousel();
    }
  }
  
  function prevSlide() {
    if (isAnimating) return;
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  }
  
  // Event listeners
  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);
  
  // Initialize
  updateCarousel();
  window.addEventListener('resize', updateCarousel);
     // Touch support for carousel navigation
  let startX = 0;
  let startY = 0;
  let isDragging = false;
  let isScrolling = false;
  
  blogSwiper.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isDragging = true;
    isScrolling = false;
  });
  
  blogSwiper.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = Math.abs(startX - currentX);
    const diffY = Math.abs(startY - currentY);
    
    // If vertical movement is greater than horizontal, allow page scroll
    if (diffY > diffX && diffY > 10) {
      isScrolling = true;
      return; // Allow default scroll behavior
    }
    
    // If horizontal movement is significant, prevent default and handle carousel
    if (diffX > 10) {
      e.preventDefault();
      isScrolling = false;
    }
  });
  
  blogSwiper.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    
    // If it was a scroll gesture, don't handle carousel navigation
    if (isScrolling) return;
    
    const endX = e.changedTouches[0].clientX;
    const diffX = startX - endX;
    
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  });

  // Handle click events on blog cards to prevent conflicts with touch
  const blogCards = document.querySelectorAll('.blog-card');
  blogCards.forEach(card => {
    let touchStartTime = 0;
    let touchMoved = false;
    
    card.addEventListener('touchstart', (e) => {
      touchStartTime = Date.now();
      touchMoved = false;
    });
    
    card.addEventListener('touchmove', (e) => {
      touchMoved = true;
    });
    
    card.addEventListener('touchend', (e) => {
      const touchDuration = Date.now() - touchStartTime;
      
      // Only prevent default and navigate if it was a quick tap (not a scroll)
      if (!touchMoved && touchDuration < 300) {
        e.preventDefault();
        // Allow the default link behavior to proceed
        const href = card.getAttribute('href');
        if (href) {
          if (card.getAttribute('target') === '_blank') {
            window.open(href, '_blank');
          } else {
            window.location.href = href;
          }
        }
      }
    });
  });


})

/* ---------------------- Loader Animation ---------------------- */
window.addEventListener('load', async () => {
  loaderAnimation()
})
