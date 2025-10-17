function navigationToggle() {
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
}

export default navigationToggle;