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
  gsap.registerPlugin(ScrollTrigger)
  ScrollTrigger.normalizeScroll(true)

  // Animation for Platform Panel-2
  gsap.from('.ats-container .ats-title', {
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

  gsap.from('.ats-container .ats-description', {
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
  gsap.from('.ats-container .ats-subtitle', {
    y: 120,
    opacity: 0,
    duration: 1,
    delay: 0.3,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.panel-2',
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
  })
  gsap.from('.ats-container .ats-subdescription', {
    y: 150,
    opacity: 0,
    duration: 1,
    delay: 0.5,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.panel-2',
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
  })
  gsap.registerPlugin(ScrollTrigger)

  // Optional: starting absolute stacked look
  gsap.set('.card1', { x: -250, y: 120, position: 'absolute' })
  gsap.set('.card2', { x: -225, y: 100, position: 'absolute' })
  gsap.set('.card3', { x: -200, y: 80, position: 'absolute' })

  // Animate from below upward + fade-in + align into layout
  gsap.fromTo(
    '.ats-card',
    {
      y: 150, // start below the viewport
      opacity: 0, // start invisible
      scale: 0.9, // slightly smaller
    },
    {
      y: 0, // move up to natural layout position
      opacity: 1,
      scale: 1,
      duration: 1.2,
      ease: 'power3.out',
      stagger: 0.25,
      scrollTrigger: {
        trigger: '.ats-cards',
        start: 'top 85%', // start animating when section enters view
        toggleActions: 'play none none reverse',
      },
      onStart: () => {
        // Keep the absolute look at the start
        gsap.set('.ats-card', { position: 'absolute' })
      },
      onComplete: () => {
        // Reset position for natural flex layout
        gsap.set('.ats-card', { clearProps: 'position,top,left,transform' })
      },
    }
  )

  // Animation for Platform Panel-3
  gsap.from('.teams-header .teams-title', {
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

  gsap.from('.teams-header .teams-description', {
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

  gsap.from('.teams-header .teams-footer', {
    y: 150,
    opacity: 0,
    duration: 1,
    delay: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.panel-2',
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
  })

  // Horizontal scroll animation for team cards
  const horizontalSection = document.querySelector('#horizontal-scroll')
  const teamWrapper = document.querySelector('.team-wrapper')

  // Calculate the starting position (center of viewport minus header)
  const startX = (window.innerWidth - 600) / 2 // 600 is header width

  gsap.fromTo(
    teamWrapper,
    {
      x: startX, // Start from center
    },
    {
      x: () => -(teamWrapper.scrollWidth - window.innerWidth + 600),
      ease: 'none',
      scrollTrigger: {
        trigger: horizontalSection,
        start: 'top top',
        end: () => `+=${teamWrapper.scrollWidth + startX}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        markers: false,
      },
    }
  )

  // Teams inner cards
  document.querySelectorAll('.team-card').forEach((cards) => {
    gsap.from(cards, {
      x: 250,
      duration: 0.6,
      scrollTrigger: {
        trigger: cards,
        start: 'top bottom',
        toggleActions: 'play none none reverse',
      },
    })
  })
  // Vertical Scroll Animation GSAP
  // gsap.utils.toArray('.panel').forEach((sections) => {
  //   ScrollTrigger.create({
  //     trigger: sections,
  //     start: 'top top',
  //     end: '+=100vh',
  //     pin: true,
  //     pinSpacing: true,
  //     srub: 1,
  //     snap: {
  //       snapTo: 1 / (gsap.utils.toArray('.panel-container').length - 1),
  //       duration: { min: 0.3, max: 1 },
  //       delay: 0.1,
  //       ease: 'power1.inOut',
  //     },
  //   })
  // })

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
})

document.addEventListener('DOMContentLoaded', function () {
  const swiper = new Swiper('.blogSwiper', {
    loop: true,
    effect: 'slide',
    speed: 800,
    slidesPerView: 1.2,
    centeredSlides: true,
    spaceBetween: 30,
    grabCursor: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },

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
