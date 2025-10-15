// const light = document.querySelector('.light')
// const grid = document.querySelector('#hex-grid')
// grid.addEventListener('mousemove', (e) => {
//   light.style.left = `${e.clientX}px`
//   light.style.top = `${e.clientY}px`
// })
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.hex-grid').forEach((grid) => {
    const light = grid.querySelector('.light')
    let mouse = { x: 0, y: 0 }
    let lightPos = { x: 0, y: 0 }
    let trails = []
    const trailCount = 10 // number of trailing glows

    // Create trail elements
    for (let i = 0; i < trailCount; i++) {
      const trail = document.createElement('div')
      trail.classList.add('trail')
      grid.appendChild(trail)
      trails.push({ el: trail, x: 0, y: 0 })
    }

    // Track mouse movement
    grid.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    })

    // Smoothly animate the light & trail
    function animateGlow() {
      // interpolate the main glow position
      lightPos.x += (mouse.x - lightPos.x) * 0.15
      lightPos.y += (mouse.y - lightPos.y) * 0.15

      light.style.left = `${lightPos.x}px`
      light.style.top = `${lightPos.y}px`

      // make the first trail follow the main glow closely
      let prevX = lightPos.x
      let prevY = lightPos.y

      trails.forEach((t, i) => {
        const speed = 0.25 - i * 0.015 // smaller difference for smoother blend
        t.x += (prevX - t.x) * speed
        t.y += (prevY - t.y) * speed

        // No offset subtraction — center trail exactly on main glow
        t.el.style.left = `${t.x}px`
        t.el.style.top = `${t.y}px`
        t.el.style.transform = `translate(-50%, -50%) scale(${1 - i * 0.05})`
        t.el.style.opacity = 0.5 - i * 0.04

        prevX = t.x
        prevY = t.y
      })

      requestAnimationFrame(animateGlow)
    }

    animateGlow()
  })
})

// Horizontall Scroll Animation GSAP
document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
  ScrollTrigger.normalizeScroll(true)
  const isHomePage = document.querySelector('#horizontal-scroll') !== null
  // Clear any existing ScrollTriggers
  ScrollTrigger.getAll().forEach((st) => st.kill())

  const isContentPage =
    document.body.classList.contains('privacy-page') ||
    document.body.classList.contains('terms-page') ||
    document.body.classList.contains('content-page')
  // Helper function to check if mobile
  const isMobile = () => window.innerWidth <= 991
  // ===== HOMEPAGE SCROLL LOGIC =====
  if (isHomePage) {
    console.log('Home page detected - Applying full scroll animations')
    // Video play/pause functionality
    const video = document.querySelector('.hero-section video')
    let videoPlayPromise = null
    if (video) {
      // Remove autoplay attribute and set muted for better control
      video.removeAttribute('autoplay')
      video.muted = true
      // Initialize video as paused
      video.pause()

      // Enhanced ScrollTrigger for video with better visibility detection
      ScrollTrigger.create({
        trigger: '.panel-1',
        start: 'top top',
        end: 'bottom top',
        onEnter: () => {
          // console.log('Entering video section from top')
          playVideoSafely(video)
          video.muted = true
        },
        onLeave: () => {
          // console.log('Leaving video section downward')
          video.pause()
        },
        onEnterBack: () => {
          // console.log('Entering back to video section from bottom')
          playVideoSafely(video)
          video.muted = true
        },
        onLeaveBack: () => {
          // console.log('Leaving back from video section upward')
          playVideoSafely(video)
        },
        onUpdate: (self) => {
          // Additional check for when user is within the panel-1 section
          const isVideoInView = self.progress > 0 && self.progress < 1
          if (isVideoInView && video.paused) {
            playVideoSafely(video)
          } else if (!isVideoInView && !video.paused) {
            video.pause()
            video.muted = true
          }
        },
      })

      // Helper function to safely play video with error handling
      function playVideoSafely(videoElement) {
        if (videoElement.paused) {
          // Cancel any existing play promise
          if (videoPlayPromise) {
            videoPlayPromise
              .catch(() => {})
              .finally(() => {
                videoPlayPromise = videoElement.play().catch((e) => {
                  console.log('Video play failed:', e)
                  video.muted = true
                  return null
                })
              })
          } else {
            videoPlayPromise = videoElement.play().catch((e) => {
              console.log('Video play failed:', e)
              return null
            })
          }
        }
      }

      // Also add manual play/pause for better control
      const videoContainer = document.querySelector('.video-container')
      const playButton = document.querySelector('.video-play-button')

      if (playButton && videoContainer) {
        playButton.addEventListener('click', () => {
          if (video.paused) {
            playVideoSafely(video)
            playButton.style.opacity = '0'
          } else {
            video.pause()
            playButton.style.opacity = '1'
          }
        })

        video.addEventListener('click', () => {
          if (video.paused) {
            playVideoSafely(video)
            playButton.style.opacity = '0'
          } else {
            video.pause()
            playButton.style.opacity = '1'
          }
        })

        video.addEventListener('play', () => {
          playButton.style.opacity = '0'
        })

        video.addEventListener('pause', () => {
          playButton.style.opacity = '1'
        })

        // Initial state - show play button since video starts paused
        playButton.style.opacity = '1'
      }
    }

    // Animation for Platform Panel-2
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
    gsap.from('.panel-2 .ats-plat', {
      y: 120,
      opacity: 1,
      duration: 1,
      delay: 0.3,
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
      // y: 150,
      opacity: 0.9,
      scale: 1, // Ensure scale is maintained
    })

    // Stagger the cards in a stacked formation with less extreme rotations
    gsap.set(cards[0], {
      x: 280,
      y: 150,
      z: -50,
      rotationY: -65, // Reduced from -70
      rotationX: -3,
      rotationZ: 3, // Reduced from 5
      opacity: 0.9,
    })

    gsap.set(cards[1], {
      x: 0,
      y: 150,
      z: 0, // Changed from -900 to prevent extreme depth
      rotationY: -65, // Reduced from -70
      rotationX: -3,
      rotationZ: 3, // Reduced from 5
      opacity: 0.9,
    })

    gsap.set(cards[2], {
      x: -250,
      y: 150,
      z: 50,
      rotationY: -65, // Reduced from -70
      rotationX: -3,
      rotationZ: 3, // Reduced from 5
      opacity: 0.9,
    })

    // Animate from stacked to normal positions
    gsap.fromTo(
      cards,
      {
        // Start state is already set above
      },
      {
        // End state - cards spread to natural flex positions
        x: 0,
        y: 0,
        z: 0,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        opacity: 1,
        duration: 0.5, // Reduced from 1000 (which was 1000 seconds!)
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
          // Reset to natural flex layout after animation
          gsap.set(cards, {
            clearProps: 'all',
          })
        },
      }
    )

    // Animation for Platform Panel-3
    gsap.from('.panel-3 .teams-title', {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.panel-3',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    })

    gsap.from('.panel-3 .teams-description', {
      y: 150,
      opacity: 0,
      duration: 1,
      delay: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.panel-3',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    })

    gsap.from('.panel-3.teams-scroll-wrapper .team-footer', {
      y: 150,
      opacity: 0,
      duration: 1,
      delay: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.panel-3',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    })
    // ===== HORIZONTAL SCROLL FOR PANEL-3 =====
    const horizontalSection = document.querySelector('#horizontal-scroll')
    const teamWrapper = document.querySelector('.team-wrapper')
    if (isMobile()) {
      gsap.fromTo(
        teamWrapper,
        {
          x: 700,
        },
        {
          x: () => -teamWrapper.scrollWidth,
          ease: 'none',
          scrollTrigger: {
            trigger: '.panel-3', // Trigger specifically on panel-3
            start: 'top top', // Start when panel-3 reaches viewport top
            end: () => `+=${teamWrapper.scrollWidth} - ${window.innerWidth}`,
            pin: '.panel-3', // Pin panel-3 during horizontal scroll
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            markers: false, // Keep enabled for debugging
            id: 'horizontal-scroll',
          },
        }
      )
    }
    if (horizontalSection && teamWrapper && !isMobile()) {
      // CRITICAL FIX: Trigger on panel-3, not on horizontal-scroll container
      gsap.fromTo(
        teamWrapper,
        {
          x: 50,
        },
        {
          x: () => -(teamWrapper.scrollWidth - window.innerWidth + 600),
          ease: 'none',
          scrollTrigger: {
            trigger: '.panel-3', // Trigger specifically on panel-3
            start: 'top top', // Start when panel-3 reaches viewport top
            end: () => `+=${teamWrapper.scrollWidth}`,
            pin: '.panel-3', // Pin panel-3 during horizontal scroll
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            markers: false, // Keep enabled for debugging
            id: 'horizontal-scroll',
          },
        }
      )
    }

    // Team cards inner animation
    document.querySelectorAll('.team-card').forEach((card) => {
      gsap.from(card, {
        x: 0,
        duration: 0.6,
        scrollTrigger: {
          trigger: card,
          toggleActions: 'play none none reverse',
        },
      })
    })

    // ===== VERTICAL PANEL PINNING =====
    const panels = gsap.utils.toArray('.panel')

    panels.forEach((panel, index) => {
      // Skip panel-3 since it's pinned by horizontal scroll
      if (panel.classList.contains('panel-3')) return

      ScrollTrigger.create({
        trigger: panel,
        start: 'top top',
        end: 'bottom top',
        pin: true,
        pinSpacing: false,
        anticipatePin: 1,
        markers: false, // Keep for debugging
      })
    })

    // ===== SMOOTH SNAPPING BETWEEN SECTIONS =====
    ScrollTrigger.create({
      trigger: 'main',
      start: 'top top',
      end: () => `+=${panels.length * window.innerHeight}`,
      snap: {
        snapTo: 1 / panels.length,
        duration: { min: 0.3, max: 0.8 },
        ease: 'power1.inOut',
        delay: 0.1,
      },
    })

    // gsap.utils.toArray('.panel').forEach((sections) => {
    //   ScrollTrigger.create({
    //     trigger: sections,
    //     start: 'top top',
    //     end: '+=100vh',
    //     pin: true,
    //     pinSpacing: true,
    //     srub: true,
    //     markers: true,
    //     snap: {
    //       snapTo: 1 / (gsap.utils.toArray('.panel-container').length - 1),
    //       duration: { min: 0.3, max: 1 },
    //       delay: 0.1,
    //       ease: 'power1.inOut',
    //     },
    //   })
    // })
  }
  // ===== CONTENT PAGES SCROLL LOGIC =====
  if (isContentPage) {
    console.log('Content page detected - Applying simple scroll')

    // NO pinning for content pages - just normal scroll
    // Only add fade-in animation for content if desired
    gsap.from('.privacy-content', {
      opacity: 0,
      y: 50,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.privacy-content',
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
    })
  }

  // Refresh on window resize to recalculate center position
  window.addEventListener('resize', () => {
    ScrollTrigger.refresh()
  })
})

// gsap.to(popupOverlay, { autoAlpha: 1, duration: 0.4, display: 'flex' })

// gsap.to(popupOverlay, {
//   autoAlpha: 0,
//   duration: 0.3,
//   onComplete: () => popupOverlay.classList.add('hidden'),
// })

/* ---------------------- Loader Animation ---------------------- */
window.addEventListener('load', async () => {
  const loader = document.querySelector('.loader-overlay')
  const logo = document.querySelector('.logo')
  const icon = document.querySelector('.icon')
  const wrap = document.querySelector('.logowrap')
  const wordmark = document.querySelector('.wordmark')
  const panels = document.querySelectorAll('.reveal-panel')
  const headerLogo = document.querySelector('.mosaic-header .logo .mosaic-logo')
  const headerMenu = document.querySelector('.mosaic-header .nav-menu')
  const headerContact = document.querySelector('.mosaic-header .connect-btn')
  const video = document.querySelector('.hero-section video')
  const playButton = document.querySelector('.video-play-button')

  // Ensure images load
  const waitForImage = (img) =>
    img.complete && img.naturalWidth > 0
      ? Promise.resolve()
      : new Promise((res) => img.addEventListener('load', res, { once: true }))

  await Promise.all([waitForImage(icon), waitForImage(wordmark)])

  gsap.set(icon, { y: 100, opacity: 0, scale: 0.9, filter: 'blur(4px)' })
  gsap.set(wrap, { width: 0 })
  gsap.set(wordmark, { opacity: 0, clipPath: 'inset(0% 100% 0% 0%)' })
  gsap.set(logo, { opacity: 1 })
  gsap.set(panels, { scaleX: 1, transformOrigin: 'right center' })
  gsap.set([headerLogo, headerMenu, headerContact], { y: -150 })
  gsap.set(video, { opacity: 0 }) // start hidden
  gsap.set(playButton, { opacity: 0, scale: 0.5 })

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  // Logo animation first
  tl.to(icon, {
    y: 0,
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    duration: 1.2,
  })
    .to(
      wrap,
      { width: wordmark.getBoundingClientRect().width, duration: 0.7 },
      '-=0.5'
    )
    .to(
      wordmark,
      { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 0.7 },
      '<'
    )
    .to(logo, { opacity: 0, duration: 0.8, delay: 1 })

    // Right-to-left staggered rectangular reveal
    .to(panels, {
      scaleY: 0,
      duration: 1,
      ease: 'power4.inOut',
      transformOrigin: 'bottom center',
      stagger: { each: 0.15, from: 'end' },
    })
    .set(loader, { display: 'none' })
    .call(() => document.body.classList.add('loaded'))

    // Page content animation (after loader)
    // Header slide down
    .to(headerLogo, { y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
    .to(headerContact, { y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')

    .to(
      headerMenu,
      { y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1 },
      '-=0.5'
    )
    // Video slide-up + scale-in
    .fromTo(
      video,
      {
        y: 150, // start lower
        opacity: 0,
        scale: 0.2,
        transformOrigin: 'bottom center',
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.6,
        ease: 'power4.out',
      },
      '-=0.3' // overlap slightly with header
    )
    // Play button fade in and scale
    .to(
      playButton,
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        delay: 1.2,
        ease: 'back.out(1.7)',
      },
      '-=0.8'
    )
})

document.addEventListener('DOMContentLoaded', function () {
  const slidesCount = document.querySelectorAll(
    '.blogSwiper .swiper-slide'
  ).length

  const swiper = new Swiper('.blogSwiper', {
    loop: slidesCount > 2, // enable loop only if more than 2 slides
    effect: 'slide',
    speed: 800,
    slidesPerView: 1.2,
    centeredSlides: true,
    spaceBetween: 30,
    grabCursor: true,
    // autoplay: {
    //   delay: 5000,
    //   disableOnInteraction: false,
    // },
    navigation: {
      nextEl: '.blog-button-next',
      prevEl: '.blog-button-prev',
    },
    breakpoints: {
      640: {
        slidesPerView: 1.5,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 1.8,
        spaceBetween: 30,
      },
      1024: {
        slidesPerView: 2.2,
        spaceBetween: 40,
      },
    },
  })
})

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function () {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle')
  const mobileNavOverlay = document.querySelector('.mobile-nav-overlay')
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-menu a')

  if (mobileMenuToggle && mobileNavOverlay) {
    mobileMenuToggle.addEventListener('click', function () {
      mobileMenuToggle.classList.toggle('active')
      mobileNavOverlay.classList.toggle('active')

      // Prevent body scroll when menu is open
      if (mobileNavOverlay.classList.contains('active')) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    })

    // Close menu when clicking on nav links
    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', function () {
        mobileMenuToggle.classList.remove('active')
        mobileNavOverlay.classList.remove('active')
        document.body.style.overflow = ''
      })
    })

    // Close menu when clicking outside
    mobileNavOverlay.addEventListener('click', function (e) {
      if (e.target === mobileNavOverlay) {
        mobileMenuToggle.classList.remove('active')
        mobileNavOverlay.classList.remove('active')
        document.body.style.overflow = ''
      }
    })

    // Close menu on escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNavOverlay.classList.contains('active')) {
        mobileMenuToggle.classList.remove('active')
        mobileNavOverlay.classList.remove('active')
        document.body.style.overflow = ''
      }
    })
  }
})
