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

// Scroll Animations GSAP
document.addEventListener('DOMContentLoaded', function () {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

  // 🔹 All vertical panels
  const panels = gsap.utils.toArray('.panel')
  const horizontalSection = document.querySelector('#horizontal-scroll')

  // 🔹 Horizontal scroll animation (you already have this working)
  createHorizontalScroll(horizontalSection)

  // 🔹 Global scroll snapping for vertical panels
  setupVerticalSnapScroll(panels, horizontalSection)

  // 🔹 Background grid switching
  setupGridBackgroundTransitions()

  function setupVerticalSnapScroll(panels, horizontalSection) {
    let scrollTimeout

    ScrollTrigger.create({
      trigger: 'main',
      start: 'top 50%',
      end: 'bottom 80%',
      markers: true,
      onUpdate: (self) => {
        clearTimeout(scrollTimeout)
        scrollTimeout = setTimeout(() => {
          // Disable snapping inside the horizontal section
          if (!ScrollTrigger.isInViewport(horizontalSection, 0.5)) {
            snapToClosestPanel(panels)
          }
        }, 120)
      },
    })
  }

  function snapToClosestPanel(panels) {
    const scrollY = window.scrollY
    const positions = panels.map((p) => p.offsetTop)
    const closest = positions.reduce((prev, curr) =>
      Math.abs(curr - scrollY) < Math.abs(prev - scrollY) ? curr : prev
    )

    gsap.to(window, {
      scrollTo: { y: closest, autoKill: false },
      duration: 0.8,
      ease: 'power2.inOut',
    })
  }

  function setupGridBackgroundTransitions() {
    const grid1 = document.querySelector('.hex-grid .grid')
    const grid2 = document.querySelector('.hex-grid .grid-2')
    const teamsGrid = document.querySelector('.teams-container-overlay .grid')

    const mappings = [
      { trigger: '.panel-1', show: grid1, hide: grid2, teamsGrid: false },
      { trigger: '.panel-2', show: grid2, hide: grid1, teamsGrid: false },
      { trigger: '.panel-3', show: grid1, hide: grid2, teamsGrid: true },
      { trigger: '.panel-4', show: grid2, hide: grid1, teamsGrid: false },
      { trigger: '.panel-5', show: grid1, hide: grid2, teamsGrid: false },
    ]

    mappings.forEach(({ trigger, show, hide, teamsGrid: showTeamsGrid }) => {
      ScrollTrigger.create({
        trigger,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          if (showTeamsGrid) {
            // Hide main overlay, show teams overlay
            switchBackground(null, grid1)
            switchBackground(null, grid2)
            gsap.to(teamsGrid, {
              opacity: 1,
              duration: 0.6,
              ease: 'power2.out',
            })
          } else {
            // Show main overlay, hide teams overlay
            switchBackground(show, hide)
            gsap.to(teamsGrid, {
              opacity: 0,
              duration: 0.3,
              ease: 'power2.inOut',
            })
          }
        },
        onEnterBack: () => {
          if (showTeamsGrid) {
            // Hide main overlay, show teams overlay
            switchBackground(null, grid1)
            switchBackground(null, grid2)
            gsap.to(teamsGrid, {
              opacity: 1,
              duration: 0.6,
              ease: 'power2.out',
            })
          } else {
            // Show main overlay, hide teams overlay
            switchBackground(show, hide)
            gsap.to(teamsGrid, {
              opacity: 0,
              duration: 0.3,
              ease: 'power2.inOut',
            })
          }
        },
      })
    })

    function switchBackground(showBg, hideBg) {
      gsap
        .timeline()
        .to(hideBg, { opacity: 0, duration: 0.5, ease: 'power2.inOut' })
        .to(showBg, { opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.3')
    }
  }

  function createHorizontalScroll(section) {
    const teamWrapper = section.querySelector('.team-wrapper')
    if (!section || !teamWrapper) return

    const startX = (window.innerWidth - 600) / 2

    gsap.fromTo(
      teamWrapper,
      { x: 0 },
      {
        x: () => -(teamWrapper.scrollWidth - window.innerWidth + 600),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${teamWrapper.scrollWidth + startX}` - 160,
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          markers: true,
        },
      }
    )
  }
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
        delay: 0.5,
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
