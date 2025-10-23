// eslint-disable-next-line no-unused-vars

async function loaderAnimation() {
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
  const home = document.querySelector('.home')

  // Disable scrolling while loader is active
  document.body.style.overflowY = 'hidden'
  document.documentElement.style.overflowY = 'hidden'

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
  if (home) gsap.set(video, { opacity: 0 }) // start hidden
  if (home) gsap.set(playButton, { opacity: 0, scale: 0.5 })

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
    .call(() => {
      document.body.classList.add('loaded')
      // Re-enable scrolling after loader finishes
      document.body.style.overflowY = ''
      document.documentElement.style.overflowY = ''
    })

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
        duration: 0.2,
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
        delay: 0.5,
        ease: 'back.out(1.7)',
      },
      '-=0.8'
    )
}

export default loaderAnimation;