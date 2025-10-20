// eslint-disable-next-line no-unused-vars

function pointerAnimation() {
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
}

export default pointerAnimation;

