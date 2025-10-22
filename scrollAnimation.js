
// eslint-disable-next-line no-unused-vars

gsap.registerPlugin(Observer);

document.addEventListener('DOMContentLoaded', () => {
    let home = document.querySelector('.home')
    let sections = document.querySelectorAll("section"),
        images = document.querySelectorAll(".bg"),
        outerWrappers = gsap.utils.toArray(".outer"),
        innerWrappers = gsap.utils.toArray(".inner"),

        currentIndex = -1,
        // wrap removed to prevent infinite looping
        animating;

    let horizontalScroll = null;
    const video = document.querySelector('.hero-section video');
    const playButton = document.querySelector('.video-play-button');
    gsap.set(outerWrappers, { yPercent: 100 });
    gsap.set(innerWrappers, { yPercent: -100 });

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
        }
    }

    if (home) videoAnimation();

    function horizontalScrollFunction() {
        const teamCards = document.querySelectorAll('.team-card');
        const teamWrapper = document.querySelector('.team-wrapper');
        // console.log(teamCards, teamWrapper)
        let currentCardIndex = 0;
        let isScrolling = false;

        if (!teamCards.length || !teamWrapper) return;

        // Calculate scroll distance
        const calculateScrollDistance = () => {
            const scrollDistance = teamWrapper.scrollWidth - window.innerWidth;
            return scrollDistance;
        };

        const calc = calculateScrollDistance();

        // Horizontal scroll animation
        function animateToCard(index) {
            if (isScrolling || index < 0 || index >= teamCards.length) return;

            isScrolling = true;
            currentCardIndex = index;

            console.log(teamWrapper.scrollWidth);

            const scrollDistance = calculateScrollDistance();
            const targetX = -(index * (scrollDistance / (teamCards.length - 1)));

            gsap.to(teamWrapper, {
                x: targetX,
                duration: 0.8,
                ease: "power2.out",
                onComplete: () => {
                    isScrolling = false;
                }
            });
        }

        // Next card function
        function nextCard() {
            if (currentCardIndex < teamCards.length - 1) {
                animateToCard(currentCardIndex + 1);
            } else {
                // Last card reached, go to next section
                gotoSection(3, 1); // Go to section 4 (News)
            }
        }

        // Previous card function
        function prevCard() {
            if (currentCardIndex > 0) {
                animateToCard(currentCardIndex - 1);
            } else {
                // First card reached, go to previous section
                gotoSection(1, -1); // Go to section 2 (ATS)
            }
        }

        return {
            nextCard,
            prevCard,
            animateToCard,
            getCurrentIndex: () => currentCardIndex,
            getTotalCards: () => teamCards.length
        };
    }

    function gotoSection(index, direction) {
        // clamp / guard - no wrap-around
        if (index < 0 || index > sections.length - 1) {
            return;
        }

        animating = true;
        let fromTop = direction === -1,
            dFactor = fromTop ? -1 : 1,
            tl = gsap.timeline({
                defaults: { duration: 1.25, ease: "power1.inOut" },
                onComplete: () => animating = false
            });
        if (currentIndex >= 0) {
            // The first time this function runs, current is -1
            gsap.set(sections[currentIndex], { zIndex: 0 });
            tl.to(images[currentIndex], { yPercent: -15 * dFactor })
                .set(sections[currentIndex], { autoAlpha: 0 });
        }

        // if entering section 2, reset carousel to first item
        if (index !== 0 && home) {
            video.pause();
            playButton.style.opacity = '1';
        }

        gsap.set(sections[index], { autoAlpha: 1, zIndex: 1 });
        // Toggle header visibility: show only on first section
        // document.body.classList.toggle('hide-header', index !== 0 && home);
        tl.fromTo([outerWrappers[index], innerWrappers[index]], {
            yPercent: i => i ? -100 * dFactor : 100 * dFactor
        }, {
            yPercent: 0
        }, 0)
            .fromTo(images[index], { yPercent: 15 * dFactor }, { yPercent: 0 }, 0);

        currentIndex = index;
    }
    gotoSection(0, 1);

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

    /* Optional: keyboard left/right when inside carousel */
    window.addEventListener('keydown', (e) => {
        if (currentIndex === 2 && home) {
            if (e.key === 'ArrowLeft') {
                if (!horizontalScroll) {
                    horizontalScroll = horizontalScrollFunction();
                }
                if (horizontalScroll) {
                    horizontalScroll.prevCard();
                    return;
                }
                e.preventDefault();
            } else if (e.key === 'ArrowRight') {
                if (!horizontalScroll) {
                    horizontalScroll = horizontalScrollFunction();
                }
                if (horizontalScroll) {
                    horizontalScroll.nextCard();
                    return;
                }
                e.preventDefault();
            }
        }
    })

    // Create observer instance
    let observer = Observer.create({
        type: "wheel,touch,pointer",
        wheelSpeed: -1,
        onDown: () => {
            // Check if team popup is open - if so, allow normal scrolling
            const teamPopup = document.querySelector('.team-popup-overlay');
            if (teamPopup && !teamPopup.classList.contains('hidden')) {
                return;
            }

            if (animating) return;

            // If we're on section 2, enable horizontal scroll
            if (currentIndex === 2 && home) {
                if (!horizontalScroll) {
                    horizontalScroll = horizontalScrollFunction();
                }
                if (horizontalScroll) {
                    horizontalScroll.prevCard();
                    return;
                }
            }

            if (home) atsAnimation()
            gotoSection(currentIndex - 1, -1);
        },
        onUp: () => {
            // Check if team popup is open - if so, allow normal scrolling
            const teamPopup = document.querySelector('.team-popup-overlay');
            if (teamPopup && !teamPopup.classList.contains('hidden')) {
                return;
            }

            if (animating) return;

            // If we're on section 2, enable horizontal scroll
            if (currentIndex === 2 && home) {
                if (!horizontalScroll) {
                    horizontalScroll = horizontalScrollFunction();
                }
                if (horizontalScroll) {
                    horizontalScroll.nextCard();
                    return;
                }
            }

            if (home) atsAnimation();

            gotoSection(currentIndex + 1, 1);
        },
        tolerance: 10,
        preventDefault: true
    });

    // Function to disable/enable observer based on popup state
    function toggleObserver() {
        const teamPopup = document.querySelector('.team-popup-overlay');
        if (teamPopup && !teamPopup.classList.contains('hidden')) {
            observer.disable();
        } else {
            observer.enable();
        }
    }

    // Monitor popup state changes
    const popupObserver = new MutationObserver(toggleObserver);
    const teamPopupOverlay = document.querySelector('.team-popup-overlay');
    if (teamPopupOverlay) {
        popupObserver.observe(teamPopupOverlay, {
            attributes: true,
            attributeFilter: ['class']
        });
    }
})
