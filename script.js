document.addEventListener('DOMContentLoaded', () => {
    const garden = document.getElementById('growth-is-not-linear');
    const spacer = document.querySelector('.spacer');

    const pathScale = 0.65;
    const pathOffset = 17.5; // Offset to account for centered SVG (50% - 65%/2 = 17.5%)

    // SVG Path Data (from basepunto.svg)
    const svgPathData = "M183.71,20.65c98.02,67.38,108.15,166.55-62.17,72.5C33.72,44.66-20.73,275.38,75.89,244.3c22.22-7.15,68.38-25.84,84.44,6.75,20.75,42.11-50.84,53.85-59.71,79.67-22.74,66.18,101,22.34,118.21,75.51,22.13,68.36-35.51,129.37-61.15,128.41-32.2-1.2-63.97-27.44-96.52-19.08-45.4,11.66-51.57,105.11-24.09,148.09,43.92,68.69,150.15,42.23,178.34-17.41,46.17-97.66,132.21-52.33,131.41-7.42-1.89,105.8-181.34,116.65-185.47,210.91-3.81,86.93,103.6-2.09,112.61,55.5,6.85,43.76-58.67,77.75-58.67,140.03,0,36.47,21.69,91.83,94.72,50.67";

    // Create SVG Element
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    // Original viewBox from basepunto.svg: 0 0 367 1130.63
    const originalWidth = 367;
    const originalHeight = 1130.63;
    svg.setAttribute("viewBox", `0 0 ${originalWidth} ${originalHeight}`);
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "50%"; // Center the SVG
    svg.style.transform = "translateX(-50%)"; // Center using transform
    svg.style.width = "65%"; // Smaller size for better fit
    svg.style.height = "auto"; // Maintain aspect ratio
    svg.style.overflow = "visible";

    // Add Definitions (Gradient and Filter from basepunto.svg)
    const defs = document.createElementNS(svgNS, "defs");
    defs.innerHTML = `
        <linearGradient id="Degradado_sin_nombre_850" data-name="Degradado sin nombre 850" x1="58" y1="291.67" x2="1166.71" y2="291.67" gradientTransform="translate(572.82 -42.82) rotate(90)" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="#bdeaa3"/>
            <stop offset=".12" stop-color="#9ad9e0"/>
            <stop offset=".35" stop-color="#fdf4a0"/>
            <stop offset=".58" stop-color="#eeaa42"/>
            <stop offset=".81" stop-color="#eba0ad"/>
            <stop offset="1" stop-color="#ad8cb9"/>
        </linearGradient>
        <filter id="outer-glow-1" x="0" y="0" width="562" height="1139" filterUnits="userSpaceOnUse">
            <feOffset dx="0" dy="0"/>
            <feGaussianBlur result="blur" stdDeviation="5"/>
            <feFlood flood-color="#fff" flood-opacity=".5"/>
            <feComposite in2="blur" operator="in"/>
            <feComposite in="SourceGraphic"/>
        </filter>
    `;
    svg.appendChild(defs);


    // Create Path (for mask)
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", svgPathData);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "white");
    path.setAttribute("stroke-width", "60"); // Increased width to cover the start circle
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");

    // Setup Drawing Animation
    const pathLength = path.getTotalLength();
    path.style.strokeDasharray = pathLength;
    path.style.strokeDashoffset = pathLength;

    // Create Mask
    const mask = document.createElementNS(svgNS, "mask");
    mask.setAttribute("id", "path-mask");
    mask.appendChild(path);
    svg.appendChild(mask);

    // Create Image to be revealed
    const img = document.createElementNS(svgNS, "image");
    img.setAttribute("href", "flower graphs/newgrowth/growthbase.svg");
    img.setAttribute("width", originalWidth);
    img.setAttribute("height", originalHeight);
    img.setAttribute("mask", "url(#path-mask)");
    svg.appendChild(img);

    // Append svg to garden
    garden.appendChild(svg);

    // Set Garden Dimensions
    // Width = Window Width
    // Height = Width * Aspect Ratio (1139/562)
    const aspectRatio = originalHeight / originalWidth;

    function updateDimensions() {
        // Update to match the visual size of the SVG (65% of window width)
        const visualWidth = window.innerWidth * 0.65;
        const gardenHeight = visualWidth * aspectRatio;
        // Add extra margin (40% more height) to ensure full visibility and spacing with next section
        const gardenHeightWithMargin = gardenHeight * 1.4;

        garden.style.width = `${window.innerWidth}px`; // Container still full width
        garden.style.height = `${gardenHeightWithMargin}px`;
        spacer.style.height = `${gardenHeightWithMargin}px`;

        return { width: visualWidth, height: gardenHeight };
    }

    let dims = updateDimensions();

    // Add start.svg at the beginning of the path
    const startPoint = path.getPointAtLength(0);
    const startElement = document.createElement('div');

    // Convert SVG coordinates to percentages
    let startLeft = pathOffset + (startPoint.x / originalWidth) * 100 * pathScale;
    let startTop = pathOffset + (startPoint.y / originalHeight) * 100 * pathScale;
    // Move it up by reducing the top position
    startTop = startTop - 18.5; // Move up more

    startElement.style.position = 'absolute';
    startElement.style.left = `${startLeft}%`;
    startElement.style.top = `${startTop}%`;
    startElement.style.width = '100px';
    startElement.style.height = '100px';
    startElement.style.marginLeft = '-50px';
    startElement.style.marginTop = '-50px';
    startElement.style.zIndex = '10';
    startElement.style.opacity = '1';
    startElement.style.transform = 'scale(1)';
    startElement.style.filter = 'none';

    const startImg = document.createElement('img');
    startImg.src = 'flower graphs/newgrowth/start.svg';
    startImg.style.width = '100%';
    startImg.style.height = '100%';
    startImg.style.objectFit = 'contain';
    startImg.style.filter = 'none';
    startElement.appendChild(startImg);
    garden.appendChild(startElement);

    // Add all elements from newgrowth folder
    // EASY TO EDIT: Use percentages for left (0-100) and top (0-100), and size in pixels
    const elements = [
        { file: 'lightgreenleaf.svg', left: 52, top: 22, size: 100 },
        { file: 'green fan.svg', left: 22, top: 7, size: 200 },
        { file: 'blueflower.svg', left: 80, top: 7, size: 220 },
        { file: 'blueflower.svg', left: 25, top: 50, size: 220 },
        { file: 'orangeleaf.svg', left: 16, top: 38, size: 100 },
        { file: 'orangeleaf.svg', left: 76, top: 47, size: 100 },
        { file: 'darkgreenleaf.svg', left: 16, top: 12, size: 100 },
        { file: 'pinkleaf.svg', left: 70, top: 60, size: 100 },
        { file: 'purpleleaf.svg', left: 52, top: 69, size: 100 },
        { file: 'yellowfan.svg', left: 40, top: 34.5, size: 200 },
        { file: 'finalpinkflower.png', left: 75, top: 71, size: 300 }
    ];

    // Store elements for animation
    const animatedElements = [];

    // Function to add an element at a specific position
    function addElement(file, left, top, size) {
        const element = document.createElement('div');

        // Set styles using direct percentages
        element.style.position = 'absolute';
        element.style.left = `${left}%`;
        element.style.top = `${top}%`;
        element.style.width = `${size}px`;
        element.style.height = `${size}px`;
        element.style.marginLeft = `-${size / 2}px`;
        element.style.marginTop = `-${size / 2}px`;
        element.style.zIndex = '10';
        element.style.opacity = '0'; // Start invisible for fade-in
        element.style.transform = 'scale(0.8)'; // Start slightly smaller
        element.style.filter = 'none';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

        // Add image
        const img = document.createElement('img');
        img.src = `flower graphs/newgrowth/${file}`;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'contain';
        img.style.filter = 'none';

        // Add specific animation classes based on file name
        if (file.includes('blueflower')) {
            img.classList.add('blue-flower');
        } else if (file.includes('finalpinkflower')) {
            img.classList.add('pink-flower');
        } else if (file.includes('leaf')) {
            img.classList.add('leaf-animation');
        }

        element.appendChild(img);
        garden.appendChild(element);

        // Calculate position along path based on top percentage
        // Top percentage represents position along the path (0% = start, 100% = end)
        const pathPosition = top / 100; // Convert to 0-1 range

        // Store element with its top position for scroll-based animation
        animatedElements.push({
            element: element,
            topPercent: top // Top position percentage (0-100)
        });
    }

    // Add all elements
    elements.forEach(e => addElement(e.file, e.left, e.top, e.size));

    // Scroll Text Logic
    const words = document.querySelectorAll('.word');
    const wordPositions = [0.1, 0.3, 0.5, 0.7, 0.85, 0.95];

    function updatePositions() {
        const gardenTop = window.innerHeight * 2.2; // After hero (100vh) + waves (100vh) + margin (20vh)
        dims = updateDimensions(); // Update dims on resize

        words.forEach((word, index) => {
            let relativeTop = wordPositions[index] * dims.height;

            // All words centered
            word.style.left = '50%';

            const absoluteTop = gardenTop + relativeTop;
            word.style.top = `${absoluteTop}px`;
            word.dataset.triggerY = relativeTop;
        });

    }

    updatePositions();

    // Scroll Handler
    let currentScroll = 0;
    const heroContent = document.querySelector('.hero-content');
    const heroTitle = document.querySelector('.hero h1');

    function handleScroll() {
        currentScroll = window.scrollY;
        const windowHeight = window.innerHeight;
        const gardenTop = windowHeight * 2.2; // After hero (100vh) + waves (100vh) + margin (20vh)

        // Hero Fade Out
        if (heroContent) {
            const opacity = Math.max(0, 1 - currentScroll / 300);
            heroContent.style.opacity = opacity;
        }

        // Hero Title Zoom Out
        if (heroTitle) {
            const scale = 1 - (currentScroll / 1000);
            heroTitle.style.transform = `scale(${Math.max(0.8, scale)})`;
        }

        // Fade animations for section titles and subtitles
        const sections = [
            { selector: '.waves-header', offset: 0.7 },
            { selector: '.emotions-header', offset: 0.7 },
            { selector: '#regulation-explanation', offset: 0.7 },
            { selector: '#regulation-practice', offset: 0.7 },
            { selector: '#practice-emotions', offset: 0.7 },
            { selector: '#how-it-works', offset: 0.7 },
            { selector: '#step-observe', offset: 0.7 }
        ];

        sections.forEach(({ selector, offset }) => {
            const section = document.querySelector(selector);
            if (section) {
                const rect = section.getBoundingClientRect();
                const sectionTop = rect.top;
                const sectionBottom = rect.bottom;
                const windowHeight = window.innerHeight;

                // Fade in when entering viewport
                if (sectionTop < windowHeight * offset && sectionBottom > 0) {
                    const fadeInProgress = Math.min(1, (windowHeight * offset - sectionTop) / 200);
                    section.style.opacity = fadeInProgress;
                    section.style.transform = `translateY(${20 * (1 - fadeInProgress)}px)`;
                }
                // Fade out when leaving viewport (scrolling past)
                else if (sectionBottom < windowHeight * 0.3) {
                    const fadeOutProgress = Math.max(0, sectionBottom / (windowHeight * 0.3));
                    section.style.opacity = fadeOutProgress;
                }
                // Reset when not in view yet
                else if (sectionTop > windowHeight) {
                    section.style.opacity = 0;
                    section.style.transform = 'translateY(20px)';
                }
            }
        });

        // Path Drawing Logic
        const revealOffset = windowHeight * 0.6; // Trigger earlier
        const relativeScroll = currentScroll + revealOffset - gardenTop;
        // Calculate length based on actual SVG height (dims.height)
        // The animation should complete when scrolling through the full SVG height
        // Use the actual SVG height, not the container height with margin
        let revealPercentage = relativeScroll / dims.height;
        revealPercentage = Math.max(0, Math.min(1, revealPercentage));

        const drawLength = pathLength * revealPercentage;
        path.style.strokeDashoffset = pathLength - drawLength;

        // Text Visibility
        const checkVisibility = (elementY) => {
            const absoluteY = gardenTop + elementY;
            const isVisible = absoluteY < currentScroll + windowHeight - 100 && absoluteY > currentScroll - 100;
            return isVisible;
        };

        words.forEach(word => {
            const relativeTriggerY = parseFloat(word.dataset.triggerY);
            if (checkVisibility(relativeTriggerY)) {
                word.classList.add('visible');
            } else {
                word.classList.remove('visible');
            }
        });

        // Animate elements in order from top to bottom based on scroll
        animatedElements.forEach(({ element, topPercent }) => {
            // Calculate element's vertical position
            const relativeTop = (topPercent / 100) * dims.height;
            const absoluteY = gardenTop + relativeTop;

            // Calculate scroll progress: element appears when it enters viewport
            // Start fading in 100px before element reaches viewport center
            const triggerPoint = absoluteY - (windowHeight * 0.3);
            const fadeDistance = 200; // Fade in over 200px of scroll
            const scrollProgress = (currentScroll - triggerPoint) / fadeDistance;
            const clampedProgress = Math.max(0, Math.min(1, scrollProgress));

            // Apply fade-in and scale animation based on scroll progress
            element.style.opacity = clampedProgress.toString();
            const scale = 0.8 + (clampedProgress * 0.2); // Scale from 0.8 to 1.0
            element.style.transform = `scale(${scale})`;
        });

        requestAnimationFrame(handleScroll);
    }

    window.addEventListener('resize', () => {
        updatePositions();
        handleScroll();
    });

    // Emotions Section Transformation
    const emotionsSection = document.getElementById('emotions');
    const emotionRows = document.querySelectorAll('.opacity-squares');
    let isTransformed = false;

    // Original State Configuration
    const originalState = [
        { color: 'yellow', opacities: [0.2, 0.36, 0.52, 0.68, 0.84, 1], text: 'some days will be splendid' },
        { color: 'blue', opacities: [0.2, 0.36, 0.52, 0.68, 0.84, 1], text: 'some days will be sorrowfull' },
        { color: 'red', opacities: [0.2, 0.36, 0.52, 0.68, 0.84, 1], text: 'some days will be stressfull' },
        { color: 'green', opacities: [0.2, 0.36, 0.52, 0.68, 0.84, 1], text: 'some days will be satisfying' },
        { colors: ['blue', 'blue', 'green', 'green', 'red', 'yellow'], opacities: [1, 0.46, 0.82, 0.28, 0.64, 0.1], text: 'most are a mix of everything' }
    ];

    // New State Configuration
    const newState = [
        {
            colors: ['red', 'red', 'blue', 'green', 'yellow', 'yellow'],
            opacities: [0.82, 0.28, 1, 0.46, 0.64, 0.1],
            text: 'but what you must remember is that'
        },
        {
            colors: ['blue', 'blue', 'red', 'red', 'green', 'green'],
            opacities: [0.46, 1, 0.64, 0.1, 0.82, 0.28],
            text: 'no matter how the day unfolds'
        },
        {
            colors: ['green', 'red', 'red', 'yellow', 'yellow', 'blue'],
            opacities: [1, 0.64, 0.28, 0.82, 0.1, 0.46],
            text: 'all emotions are valid'
        },
        {
            colors: ['yellow', 'yellow', 'blue', 'blue', 'red', 'red'],
            opacities: [0.64, 0.1, 0.46, 0.82, 1, 0.28],
            text: 'so embrace them proudly'
        },
        {
            colors: ['yellow', 'red', 'green', 'blue', 'red', 'yellow'],
            opacities: [0.28, 0.82, 0.46, 1, 0.64, 0.1],
            text: 'and find your balance'
        }
    ];

    const squaresGallery = document.getElementById('squares-gallery');

    // Remove the window scroll listener and replace with wheel listener on gallery
    squaresGallery.addEventListener('wheel', (e) => {
        // Always prevent default page scroll when hovering this section
        e.preventDefault();

        const scrollingDown = e.deltaY > 0;
        const scrollingUp = e.deltaY < 0;

        if (scrollingDown && !isTransformed) {
            isTransformed = true;
            applyNewState();
        } else if (scrollingUp && isTransformed) {
            isTransformed = false;
            applyOriginalState();
        }
    }, { passive: false }); // passive: false is required to use preventDefault()

    function applyNewState() {
        emotionRows.forEach((row, index) => {
            const config = newState[index];
            const textEl = row.querySelector('.row-text');
            const squares = row.querySelectorAll('.square');

            // Update Text with fade effect
            textEl.style.opacity = 0;
            setTimeout(() => {
                textEl.textContent = config.text;
                textEl.style.opacity = 1;
            }, 300);

            // Update Squares with staggered animation
            squares.forEach((square, sqIndex) => {
                // Add a slight scale and transform effect before changing color
                square.style.transform = `scale(0.8) translateY(-10px)`;

                setTimeout(() => {
                    // Remove old color classes
                    square.classList.remove('square-yellow', 'square-blue', 'square-red', 'square-green', 'square-purple');
                    // Add new color class
                    square.classList.add(`square-${config.colors[sqIndex]}`);
                    // Apply new opacity
                    square.style.opacity = config.opacities[sqIndex];
                    // Animate back to normal with stagger
                    square.style.transform = 'scale(1) translateY(0)';
                }, 50 * sqIndex); // Stagger each square by 50ms
            });
        });
    }

    function applyOriginalState() {
        emotionRows.forEach((row, index) => {
            const config = originalState[index];
            const textEl = row.querySelector('.row-text');
            const squares = row.querySelectorAll('.square');

            // Update Text with fade effect
            textEl.style.opacity = 0;
            setTimeout(() => {
                textEl.textContent = config.text;
                textEl.style.opacity = 1;
            }, 300);

            // Update Squares with staggered animation
            squares.forEach((square, sqIndex) => {
                // Add a slight scale and transform effect before changing color
                square.style.transform = `scale(0.8) translateY(-10px)`;

                setTimeout(() => {
                    // Remove old color classes
                    square.classList.remove('square-yellow', 'square-blue', 'square-red', 'square-green', 'square-purple');
                    // Add original color class
                    if (config.colors) {
                        square.classList.add(`square-${config.colors[sqIndex]}`);
                    } else {
                        square.classList.add(`square-${config.color}`);
                    }
                    // Restore original opacity
                    square.style.opacity = config.opacities[sqIndex];
                    // Animate back to normal with stagger
                    square.style.transform = 'scale(1) translateY(0)';
                }, 50 * sqIndex); // Stagger each square by 50ms
            });
        });
    }

    handleScroll();

    // Circles Grid Interaction
    const circles = document.querySelectorAll('.circle');
    const circlesText = document.querySelector('.circles-text');
    const observingContainer = document.querySelector('.observing-container');

    function updateCirclesText() {
        const poppedCount = document.querySelectorAll('.circle.popped').length;
        const totalCircles = circles.length;

        if (poppedCount === totalCircles) {
            // Hide top text, show bottom container
            circlesText.style.opacity = '0';
            observingContainer.style.opacity = '1';
        } else {
            // Show top text, hide bottom container
            circlesText.style.opacity = '1';
            observingContainer.style.opacity = '0';
        }
    }

    // Reusable function to pop a circle
    function popCircle(circle) {
        if (circle.classList.contains('popped') || circle.classList.contains('exploding')) return;

        // Add exploding class to trigger animation
        circle.classList.add('exploding');

        // Wait for explosion animation to finish (400ms)
        setTimeout(() => {
            circle.classList.remove('exploding');
            circle.classList.add('popped');
            updateCirclesText(); // Update text after popping
        }, 380); // Slightly less than 400ms to ensure smooth transition
    }

    // Restart Button Logic
    const restartBtn = document.querySelector('.restart-circles-btn');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            circles.forEach(circle => {
                circle.classList.remove('popped', 'exploding');
            });
            updateCirclesText();
        });
    }

    // Mouse state tracking for drag interaction
    let isMouseDown = false;
    document.addEventListener('mousedown', () => isMouseDown = true);
    document.addEventListener('mouseup', () => isMouseDown = false);

    circles.forEach(circle => {
        // Click interaction
        circle.addEventListener('click', () => {
            popCircle(circle);
        });

        // Drag interaction (hover while holding click)
        circle.addEventListener('mouseenter', () => {
            if (isMouseDown) {
                popCircle(circle);
            }
        });
    });

    // Problem Visualization Interaction
    const yellowCircleSmall = document.querySelector('.yellow-circle-small');
    const blueSemicircle = document.querySelector('.blue-semicircle');
    const visualizationText = document.querySelector('.visualization-text');

    if (yellowCircleSmall && blueSemicircle) {
        yellowCircleSmall.addEventListener('click', () => {
            yellowCircleSmall.classList.toggle('solved');
            blueSemicircle.classList.toggle('solved');

            if (yellowCircleSmall.classList.contains('solved')) {
                visualizationText.textContent = 'a problem at a distance feels more solvable';
            } else {
                visualizationText.textContent = 'a problem upclose can feel overwhelming';
            }
        });
    }

    // How It Works Interaction - Agitation vs Acceptance
    const purpleCircle = document.querySelector('.small-purple-circle');
    const feelingText = document.querySelector('.feeling-text');
    const instructionText = document.querySelector('.instruction-text');

    if (purpleCircle && feelingText) {
        let scale = 1;
        let opacity = 0.3; // Initial opacity from CSS
        let isHolding = false;
        let isHovering = false;
        let isTextTransitioning = false;
        let animationFrameId;
        let holdInterval;
        const maxScale = 2.0; // 200%
        const minScale = 0;
        let isMaxedOut = false;

        // Continuous Growth Logic
        function smoothGrow() {
            if (isHolding || isMaxedOut || !isHovering) {
                cancelAnimationFrame(animationFrameId);
                return;
            }

            if (scale < maxScale) {
                // Even slower growth rate for more deliberate feel
                scale += 0.004; // Decreased from 0.008 for slower growth
                opacity = Math.min(opacity + 0.003, 1); // Proportionally slower opacity change

                purpleCircle.style.transform = `scale(${scale})`;
                purpleCircle.style.background = `rgba(173, 136, 185, 1)`;

                // Remove breathing animation while interacting
                purpleCircle.style.animation = 'none';

                // Change text to "if you fight it" as soon as it starts growing significantly
                if (scale > 1.1 && feelingText.textContent !== 'if you fight it' && !isTextTransitioning) {
                    isTextTransitioning = true;
                    feelingText.style.opacity = '0';
                    setTimeout(() => {
                        if (!isMaxedOut) {
                            feelingText.textContent = 'if you fight it';
                            feelingText.style.opacity = '1';
                        }
                        isTextTransitioning = false;
                    }, 500);
                }

                // Check for max state
                if (scale >= maxScale) {
                    isMaxedOut = true;

                    // Stop the growth animation
                    cancelAnimationFrame(animationFrameId);

                    // Simply add the pulsing class - keep the inline transform
                    purpleCircle.classList.add('pulsing');

                    // Fade out text, change content to "it will persist", fade in
                    feelingText.style.opacity = '0';
                    setTimeout(() => {
                        feelingText.textContent = 'it will persist';
                        feelingText.style.opacity = '1';
                    }, 300);

                    if (instructionText) {
                        instructionText.style.opacity = '0';
                        setTimeout(() => {
                            instructionText.textContent = 'Click and hold';
                            instructionText.style.opacity = '1';
                            instructionText.style.transform = 'translateY(-10px)'; // Subtle lift
                        }, 500);
                    }

                    cancelAnimationFrame(animationFrameId);
                } else {
                    animationFrameId = requestAnimationFrame(smoothGrow);
                }
            }
        }

        // Hover start
        purpleCircle.addEventListener('mouseenter', () => {
            isHovering = true;
            if (!isMaxedOut && !isHolding) {
                smoothGrow();
            }
        });

        // Hover end
        purpleCircle.addEventListener('mouseleave', () => {
            isHovering = false;
            cancelAnimationFrame(animationFrameId);

            // If not maxed out, slowly revert to initial state (Reset logic)
            if (!isMaxedOut && !isHolding) {
                // Re-enable breathing if scale is close to 1
                if (scale <= 1.1) {
                    purpleCircle.style.animation = 'breathe 4s ease-in-out infinite';
                }
            }

            if (isHolding) {
                isHolding = false;
                clearInterval(holdInterval);

                // Revert state if mouse leaves while holding
                if (scale > 0.1 && isMaxedOut) {
                    feelingText.textContent = 'if you fight it, it will persist';
                    purpleCircle.classList.add('pulsing');
                    if (instructionText) instructionText.style.opacity = '1';
                }
            }
        });

        // Acceptance Logic (Shrink on Hold)
        purpleCircle.addEventListener('mousedown', () => {
            // Only allow shrinking if maxed out
            if (!isMaxedOut) return;

            isHolding = true;

            // Fade out text, change content to "if you accept it", fade in
            feelingText.style.opacity = '0';
            setTimeout(() => {
                feelingText.textContent = 'if you accept it';
                feelingText.style.opacity = '1';
            }, 500);

            // Hide instruction text
            if (instructionText) {
                instructionText.style.opacity = '0';
            }

            // Remove pulsing if present
            purpleCircle.classList.remove('pulsing');

            holdInterval = setInterval(() => {
                if (scale > 0) {
                    // Slower deflate logic
                    scale -= 0.02; // Decreased from 0.04 for slower shrinking
                    opacity = Math.max(opacity - 0.02, 0); // Slower opacity reduction

                    if (scale < 0) scale = 0;

                    purpleCircle.style.transform = `scale(${scale})`;
                    purpleCircle.style.background = `rgba(173, 136, 185, 1)`;

                    if (scale <= 0.1) {
                        purpleCircle.style.opacity = '0';
                        clearInterval(holdInterval);

                        // Final text change: "it will fade away"
                        feelingText.style.opacity = '0';
                        setTimeout(() => {
                            feelingText.textContent = 'it will fade away';
                            feelingText.style.opacity = '1';
                        }, 500);

                        // Show restart button
                        setTimeout(() => {
                            if (instructionText) {
                                instructionText.textContent = 'Restart';
                                instructionText.style.opacity = '1';
                                instructionText.style.cursor = 'pointer';
                                instructionText.dataset.isRestart = 'true';
                            }
                        }, 1000);
                    }
                }
            }, 50); // Slower interval for smoother animation
        });

        purpleCircle.addEventListener('mouseup', () => {
            if (!isHolding) return;

            isHolding = false;
            clearInterval(holdInterval);

            // If released before disappearing, revert text if not fully gone
            if (scale > 0.1) {
                if (isMaxedOut) {
                    // Fade out, revert text, fade in
                    feelingText.style.opacity = '0';
                    setTimeout(() => {
                        feelingText.textContent = 'it will persist';
                        feelingText.style.opacity = '1';
                    }, 500);

                    purpleCircle.classList.add('pulsing');
                    if (instructionText) instructionText.style.opacity = '1';
                }
            }
        });

        purpleCircle.addEventListener('mouseleave', () => {
            if (!isHolding) return;

            isHolding = false;
            clearInterval(holdInterval);

            // Revert state if mouse leaves while holding
            if (scale > 0.1 && isMaxedOut) {
                feelingText.textContent = 'If you fight it, it will persist';
                purpleCircle.classList.add('pulsing');
            }
        });

        // Restart button handler
        if (instructionText) {
            instructionText.addEventListener('click', () => {
                if (instructionText.dataset.isRestart === 'true') {
                    // Reset all state
                    scale = 1;
                    opacity = 0.3;
                    isMaxedOut = false;
                    isHolding = false;
                    isTextTransitioning = false;

                    // Reset circle appearance
                    purpleCircle.style.transform = '';
                    purpleCircle.style.opacity = '1';
                    purpleCircle.style.background = 'rgba(173, 136, 185, 1)';
                    purpleCircle.style.animation = 'breathe 4s ease-in-out infinite';
                    purpleCircle.classList.remove('pulsing');

                    // Reset text
                    feelingText.textContent = 'A feeling arises';
                    feelingText.style.opacity = '1';

                    // Reset instruction
                    instructionText.textContent = 'Touch the bubble';
                    instructionText.style.cursor = '';
                    delete instructionText.dataset.isRestart;
                }
            });
        }
    }

    // Instruction Text Logic - Show immediately when section is visible
    const howItWorksSection = document.querySelector('#how-it-works');
    let instructionShown = false;

    if (howItWorksSection && instructionText) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !instructionShown) {
                    setTimeout(() => {
                        instructionText.style.opacity = '1';
                        instructionText.style.transform = 'translateY(0)';
                        instructionShown = true;
                    }, 1000);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(howItWorksSection);
    }

    // Radar Logic
    function initRadar() {
        const blips = document.querySelectorAll('.radar-blip');
        const centerX = 200;
        const centerY = 200;
        const sweepDuration = 4; // Seconds (must match CSS)

        blips.forEach(blip => {
            const cx = parseFloat(blip.getAttribute('cx'));
            const cy = parseFloat(blip.getAttribute('cy'));
            const dx = cx - centerX;
            const dy = cy - centerY;
            let theta = Math.atan2(dy, dx);
            let degrees = theta * (180 / Math.PI);
            let cssDegrees = degrees + 90;
            if (cssDegrees < 0) cssDegrees += 360;
            const delay = (cssDegrees / 360) * sweepDuration;
            blip.style.animationDelay = `${delay}s`;
        });
    }

    initRadar();

    // Continue Button Logic
    const continueBtn = document.getElementById('continue-btn');
    const continueContainer = document.querySelector('.continue-container');
    const emotionsOptions = document.getElementById('emotions-options');

    if (continueBtn) {
        continueBtn.addEventListener('click', () => {
            // Hide continue button container
            if (continueContainer) {
                continueContainer.style.display = 'none';
            }

            // Show emotion grid
            const emotionsGrid = document.getElementById('emotions-grid');
            if (emotionsGrid) {
                emotionsGrid.innerHTML = ''; // Clear previous content if any
                emotionsGrid.classList.remove('hidden');

                // Add images 12 to 36
                for (let i = 12; i <= 36; i++) {
                    // Create Card Container
                    const card = document.createElement('div');
                    card.classList.add('emotion-card');

                    // Create Inner Wrapper
                    const cardInner = document.createElement('div');
                    cardInner.classList.add('emotion-card-inner');

                    // Create Front Face
                    const cardFront = document.createElement('div');
                    cardFront.classList.add('emotion-card-front');
                    const imgFront = document.createElement('img');
                    imgFront.src = `flower graphs/emotion cards/emotioncards-${i}.png`;
                    imgFront.alt = `Emotion ${i}`;
                    cardFront.appendChild(imgFront);

                    // Create Back Face
                    const cardBack = document.createElement('div');
                    cardBack.classList.add('emotion-card-back');
                    const imgBack = document.createElement('img');
                    // Back image corresponds to i + 25 (12 -> 37)
                    imgBack.src = `flower graphs/emotion cards/emotioncards-${i + 25}.png`;
                    imgBack.alt = `Emotion ${i + 25}`;
                    cardBack.appendChild(imgBack);

                    // Assemble Card
                    cardInner.appendChild(cardFront);
                    cardInner.appendChild(cardBack);
                    card.appendChild(cardInner);

                    // Add Click Event for Flip
                    card.addEventListener('click', () => {
                        card.classList.toggle('flipped');
                    });

                    emotionsGrid.appendChild(card);

                    // Staggered Animation
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, (i - 12) * 50); // Stagger delay
                }

                // Make grid visible
                setTimeout(() => {
                    emotionsGrid.classList.add('visible');
                }, 100);
            }
        });
    }

    // Canvas Animation removed - replaced with Lottie
});

// SoundCloud Player Integration
document.addEventListener('DOMContentLoaded', () => {
    // Check if script is already added
    if (!document.querySelector('script[src="https://w.soundcloud.com/player/api.js"]')) {
        const scScript = document.createElement('script');
        scScript.src = 'https://w.soundcloud.com/player/api.js';
        document.body.appendChild(scScript);

        scScript.onload = initAudioPlayer;
    } else {
        initAudioPlayer();
    }

    function initAudioPlayer() {
        const iframeElement = document.querySelector('#sc-player');
        if (!iframeElement) return;

        const widget = SC.Widget(iframeElement);
        const audioControl = document.getElementById('audio-control');

        if (!audioControl) return;

        const iconSpan = audioControl.querySelector('.icon');
        const textSpan = audioControl.querySelector('.text');
        let isPlaying = false;

        audioControl.addEventListener('click', () => {
            if (isPlaying) {
                widget.pause();
                iconSpan.textContent = '♫';
                textSpan.textContent = 'Play Music';
                isPlaying = false;
                audioControl.classList.remove('playing');
            } else {
                widget.play();
                iconSpan.textContent = '❚❚';
                textSpan.textContent = 'Pause Music';
                isPlaying = true;
                audioControl.classList.add('playing');
            }
        });

        // Ensure loop is active
        widget.bind(SC.Widget.Events.FINISH, () => {
            widget.play();
        });
    }
});