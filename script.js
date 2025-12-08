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

        garden.style.width = '100%'; // Use 100% to avoid overflow
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

    // Configuration for word positions
    // top: Percentage of the section height (0.0 to 1.0)
    // left: Horizontal position (e.g., '50%' for center)
    const wordConfig = [
        { top: 0.13, left: '50%' }, // Growth
        { top: 0.25, left: '60%' }, // is
        { top: 0.40, left: '40%' }, // not
        { top: 0.55, left: '45%' }, // a
        { top: 0.73, left: '65%' }, // straight
        { top: 0.90, left: '45%' }  // line
    ];

    function updatePositions() {
        const gardenTop = window.innerHeight * 2.2; // After hero (100vh) + waves (100vh) + margin (20vh)
        dims = updateDimensions(); // Update dims on resize

        words.forEach((word, index) => {
            if (index >= wordConfig.length) return;

            const config = wordConfig[index];
            let relativeTop = config.top * dims.height;

            // Set horizontal position from config
            word.style.left = config.left;

            // Remove inline transform to allow CSS animations to take over
            // The CSS classes (.word:nth-child, .word.visible) already include translateX(-50%)
            // to center the element relative to its left position.

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

        // Rotate Visualization Flower on Scroll
        const visFlower = document.querySelector('.visualization-flower');
        if (visFlower) {
            const rotation = currentScroll * 0.15; // Adjust speed as needed
            visFlower.style.setProperty('--rotation', `${rotation}deg`);
        }

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
        { color: 'yellow', opacities: [0.2, 0.36, 0.52, 0.68, 0.84, 1], text: 'Some days will be splendid<br><span class="korean-text">어떤 날은 눈부시게 빛납니다.</span>' },
        { color: 'blue', opacities: [0.2, 0.36, 0.52, 0.68, 0.84, 1], text: 'Some days will be sorrowfull<br><span class="korean-text">어떤 날은 슬픔이 찾아옵니다.</span>' },
        { color: 'red', opacities: [0.2, 0.36, 0.52, 0.68, 0.84, 1], text: 'Some days will be stressfull<br><span class="korean-text">어떤 날은 마음이 지칩니다.</span>' },
        { color: 'green', opacities: [0.2, 0.36, 0.52, 0.68, 0.84, 1], text: 'Some days will be satisfying<br><span class="korean-text">어떤 날은 깊은 만족이 느껴집니다.</span>' },
        { colors: ['blue', 'blue', 'green', 'green', 'red', 'yellow'], opacities: [1, 0.46, 0.82, 0.28, 0.64, 0.9], text: 'Most are a mix of everything<br><span class="korean-text">대부분의 날들은 그 모든 감정이 어우러져 있습니다.</span>' }
    ];

    // New State Configuration
    const newState = [
        {
            colors: ['red', 'red', 'blue', 'green', 'yellow', 'yellow'],
            opacities: [0.82, 0.28, 1, 0.46, 0.64, 0.1],
            text: 'But what you must remember is that<br><span class="korean-text">하지만 꼭 기억해야 할 것은,</span>'
        },
        {
            colors: ['blue', 'blue', 'red', 'red', 'green', 'green'],
            opacities: [0.2, 0.36, 0.52, 0.68, 0.84, 1],
            text: 'No matter how the day unfolds<br><span class="korean-text">하루가 어떻게 흘러가든</span>'
        },
        {
            colors: ['green', 'red', 'red', 'yellow', 'yellow', 'blue'],
            opacities: [0.82, 0.28, 1, 0.46, 0.64, 0.1],
            text: 'All emotions are valid<br><span class="korean-text">모든 감정은 소중합니다.</span>'
        },
        {
            colors: ['yellow', 'yellow', 'blue', 'blue', 'red', 'red'],
            opacities: [0.2, 0.36, 0.52, 0.68, 0.84, 1],
            text: 'So embrace them proudly<br><span class="korean-text">그러니 그 감정들을 당당히 안아 주십시오.</span>'
        },
        {
            colors: ['yellow', 'red', 'green', 'blue', 'red', 'yellow'],
            opacities: [0.82, 0.28, 1, 0.46, 0.64, 0.1],
            text: 'And find your balance<br><span class="korean-text">그리고 당신만의 균형을 찾아가십시오.</span>'
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
                textEl.innerHTML = config.text; // Use innerHTML for <br> and <span>
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
                textEl.innerHTML = config.text; // Use innerHTML for <br>
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

    // Apply initial state on load to ensure text is correct (with Korean)
    if (isTransformed) {
        applyNewState();
    } else {
        applyOriginalState();
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
    const visualizationFlower = document.querySelector('.visualization-flower');

    if (yellowCircleSmall && blueSemicircle) {
        yellowCircleSmall.addEventListener('click', () => {
            yellowCircleSmall.classList.toggle('solved');
            blueSemicircle.classList.toggle('solved');

            // Fade out text
            visualizationText.style.opacity = '0';

            setTimeout(() => {
                if (yellowCircleSmall.classList.contains('solved')) {
                    visualizationText.innerHTML = 'A problem at a distance feels more solvable<br><span class="korean-text-large">문제를 멀리서 바라보면 더 쉽게 해결할 수 있습니다.</span>';
                    if (visualizationFlower) visualizationFlower.classList.add('visible');
                } else {
                    visualizationText.innerHTML = 'A problem upclose can feel overwhelming<br><span class="korean-text-large">문제를 가까이에서 마주하면 압도적으로 느껴질 수 있습니다.</span>';
                    if (visualizationFlower) visualizationFlower.classList.remove('visible');
                }
                // Fade in text
                visualizationText.style.opacity = '1';
            }, 400); // Wait for fade out transition
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

            // Show emotion grid, title, and footer
            const emotionsGrid = document.getElementById('emotions-grid');
            const emotionsTitle = document.getElementById('emotions-title');
            const emotionsFooter = document.getElementById('emotions-footer');

            if (emotionsTitle) {
                emotionsTitle.classList.remove('hidden');
                setTimeout(() => {
                    emotionsTitle.classList.add('visible');
                }, 100);
            }

            if (emotionsFooter) {
                emotionsFooter.classList.remove('hidden');
                setTimeout(() => {
                    emotionsFooter.classList.add('visible');
                }, 1000); // Delay slightly after title/grid start
            }

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

        // Song Selection
        const songOptions = document.querySelectorAll('.song-option');
        songOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remove active class from all
                songOptions.forEach(opt => opt.classList.remove('active'));
                // Add to clicked
                option.classList.add('active');

                const url = option.getAttribute('data-url');
                // Load new song
                widget.load(url, {
                    auto_play: true,
                    loop: true,
                    show_artwork: false,
                    hide_related: true,
                    show_comments: false,
                    show_user: false,
                    show_reposts: false,
                    show_teaser: false,
                    visual: false,
                    color: '#ff5500'
                });

                // Update control state to playing
                iconSpan.textContent = '❚❚';
                textSpan.textContent = 'Pause Music';
                isPlaying = true;
                audioControl.classList.add('playing');
            });
        });
    }
    // Pipes Animation for Step 2 (Thin lines)
    function initPipes() {
        const canvas = document.getElementById('pipes-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let width, height;
        const gridSize = 40;
        const lineWidth = 12; // Thinner lines
        let pipes = [];
        let gridState = {}; // Map "x,y" -> { h: bool, v: bool }

        const colors = [
            'rgba(241, 196, 15, 0.8)',  // Yellow
            'rgba(233, 30, 99, 0.8)',   // Pink
            'rgba(52, 152, 219, 0.8)',  // Blue
            'rgba(46, 204, 113, 0.8)',  // Green
            'rgba(231, 76, 60, 0.8)',   // Red
            'rgba(155, 89, 182, 0.8)',  // Purple
            'rgba(26, 188, 156, 0.8)'   // Teal
        ];

        function resize() {
            width = canvas.parentElement.offsetWidth;
            height = canvas.parentElement.offsetHeight;
            canvas.width = width;
            canvas.height = height;
            gridState = {}; // Reset grid
            resetPipes();
        }

        function updateGrid(x, y, orientation, add) {
            const key = `${x},${y}`;
            if (!gridState[key]) gridState[key] = { h: 0, v: 0 };

            if (add) {
                gridState[key][orientation]++;
            } else {
                gridState[key][orientation]--;
                if (gridState[key][orientation] < 0) gridState[key][orientation] = 0;
            }
        }

        function isOccupied(x, y, orientation) {
            const key = `${x},${y}`;
            if (!gridState[key]) return false;
            return gridState[key][orientation] > 0;
        }

        class Pipe {
            constructor() {
                this.reset();
            }

            reset() {
                // Find a valid starting spot? Or just random and hope
                this.x = Math.floor(Math.random() * (width / gridSize)) * gridSize;
                this.y = Math.floor(Math.random() * (height / gridSize)) * gridSize;
                this.direction = Math.floor(Math.random() * 4);
                this.segments = [];
                this.currentSegment = {
                    startX: this.x,
                    startY: this.y,
                    endX: this.x,
                    endY: this.y,
                    color: colors[Math.floor(Math.random() * colors.length)]
                };

                // Mark start pos
                const orientation = (this.direction === 1 || this.direction === 3) ? 'h' : 'v';
                updateGrid(this.x, this.y, orientation, true);

                this.dead = false;
                this.speed = 2;
                this.progress = 0;
                this.maxSegments = 8;
            }

            update() {
                if (this.dead) return;

                this.progress += this.speed;

                // Update current segment end position visually
                switch (this.direction) {
                    case 0: this.currentSegment.endY = this.y - this.progress; break; // Up
                    case 1: this.currentSegment.endX = this.x + this.progress; break; // Right
                    case 2: this.currentSegment.endY = this.y + this.progress; break; // Down
                    case 3: this.currentSegment.endX = this.x - this.progress; break; // Left
                }

                if (this.progress >= gridSize) {
                    // Finished a grid step

                    // Update logical position
                    switch (this.direction) {
                        case 0: this.y -= gridSize; break;
                        case 1: this.x += gridSize; break;
                        case 2: this.y += gridSize; break;
                        case 3: this.x -= gridSize; break;
                    }

                    // Snap
                    this.currentSegment.endX = this.x;
                    this.currentSegment.endY = this.y;

                    // Mark new cell
                    const orientation = (this.direction === 1 || this.direction === 3) ? 'h' : 'v';
                    // Note: We already marked the cell we just entered? 
                    // No, we marked the previous one. We need to mark the one we just fully entered?
                    // Actually, it's better to mark AHEAD.
                    // But for now, let's mark the one we are IN.
                    updateGrid(this.x, this.y, orientation, true);

                    this.progress = 0;

                    // Logic to choose next move
                    // We need to check if continuing straight is valid
                    // And if turning is valid

                    let possibleMoves = [];

                    // Check straight
                    if (this.isValidMove(this.x, this.y, this.direction)) {
                        possibleMoves.push(this.direction);
                        possibleMoves.push(this.direction); // Weight straight higher
                        possibleMoves.push(this.direction);
                    }

                    // Check turns
                    const leftTurn = (this.direction + 3) % 4;
                    if (this.isValidMove(this.x, this.y, leftTurn)) {
                        possibleMoves.push(leftTurn);
                    }

                    const rightTurn = (this.direction + 1) % 4;
                    if (this.isValidMove(this.x, this.y, rightTurn)) {
                        possibleMoves.push(rightTurn);
                    }

                    if (possibleMoves.length === 0) {
                        this.kill();
                        return;
                    }

                    // Pick a move
                    const nextDir = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

                    if (nextDir !== this.direction) {
                        // Turn!
                        this.direction = nextDir;

                        // Push finished segment
                        this.segments.push(this.currentSegment);

                        // Prune old segments
                        if (this.segments.length > this.maxSegments) {
                            const removed = this.segments.shift();
                            this.unmarkSegment(removed);
                        }

                        // Start new segment
                        this.currentSegment = {
                            startX: this.x,
                            startY: this.y,
                            endX: this.x,
                            endY: this.y,
                            color: colors[Math.floor(Math.random() * colors.length)]
                        };
                    } else {
                        // Continue straight - check if we should force a turn for variety?
                        // Or just let the weighting handle it.
                        // But we need to check if we are forced to turn because straight was blocked (but turns weren't)
                        // The logic above handles picking a valid move.
                    }

                    // Check bounds (redundant with isValidMove but good for safety)
                    if (this.x < -gridSize || this.x > width + gridSize || this.y < -gridSize || this.y > height + gridSize) {
                        this.kill();
                    }
                }
            }

            isValidMove(cx, cy, dir) {
                let nx = cx;
                let ny = cy;
                switch (dir) {
                    case 0: ny -= gridSize; break;
                    case 1: nx += gridSize; break;
                    case 2: ny += gridSize; break;
                    case 3: nx -= gridSize; break;
                }

                // Bounds check
                if (nx < 0 || nx >= width || ny < 0 || ny >= height) return false;

                // Occupancy check
                const orientation = (dir === 1 || dir === 3) ? 'h' : 'v';
                if (isOccupied(nx, ny, orientation)) return false;

                return true;
            }

            unmarkSegment(seg) {
                // Walk from start to end and unmark
                let cx = seg.startX;
                let cy = seg.startY;
                const dx = Math.sign(seg.endX - seg.startX) * gridSize;
                const dy = Math.sign(seg.endY - seg.startY) * gridSize;

                // Determine orientation
                const orientation = (dx !== 0) ? 'h' : 'v';

                // We need to unmark the cells covered.
                // Start cell is already covered by previous segment end? 
                // Segments share joints.
                // Let's unmark inclusive of start, exclusive of end? Or...
                // The grid logic: each cell visited is marked.
                // A segment from (0,0) to (0, 100) covers multiple cells.
                // My segments are defined by start/end points which are grid coordinates.

                const steps = Math.max(Math.abs(seg.endX - seg.startX), Math.abs(seg.endY - seg.startY)) / gridSize;

                // Unmark start
                updateGrid(cx, cy, orientation, false);

                for (let i = 0; i < steps; i++) {
                    cx += dx;
                    cy += dy;
                    updateGrid(cx, cy, orientation, false);
                }
            }

            kill() {
                this.dead = true;
                // Unmark all
                this.unmarkSegment(this.currentSegment); // Unmark current progress? 
                // Current segment might be partially drawn, but logically we marked the head.
                // Actually, we marked the head cell in `reset` or `update`.
                // We need to be careful.
                // Let's just unmark everything in segments + current head.

                this.segments.forEach(s => this.unmarkSegment(s));

                // Unmark the head's current position if not in segments
                // The head position is tracked by x,y.
                // We marked it when we entered it.
                const orientation = (this.direction === 1 || this.direction === 3) ? 'h' : 'v';
                updateGrid(this.x, this.y, orientation, false);

                setTimeout(() => this.reset(), 1000);
            }

            draw(ctx) {
                ctx.lineWidth = lineWidth;

                // Draw finished segments
                this.segments.forEach(seg => {
                    ctx.beginPath();
                    ctx.strokeStyle = seg.color;
                    ctx.moveTo(seg.startX + gridSize / 2, seg.startY + gridSize / 2);
                    ctx.lineTo(seg.endX + gridSize / 2, seg.endY + gridSize / 2);
                    ctx.stroke();
                });

                // Draw current segment
                ctx.beginPath();
                ctx.strokeStyle = this.currentSegment.color;
                ctx.moveTo(this.currentSegment.startX + gridSize / 2, this.currentSegment.startY + gridSize / 2);
                ctx.lineTo(this.currentSegment.endX + gridSize / 2, this.currentSegment.endY + gridSize / 2);
                ctx.stroke();
            }
        }

        function resetPipes() {
            pipes = [];
            for (let i = 0; i < 12; i++) {
                pipes.push(new Pipe());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);

            ctx.globalCompositeOperation = 'multiply';
            ctx.lineCap = 'square';

            pipes.forEach(pipe => {
                pipe.update();
                pipe.draw(ctx);
            });

            ctx.globalCompositeOperation = 'source-over';

            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resize);
        resize();
        animate();
    }

    // Play button scroll functionality
    const playBtn = document.querySelector('.hero-play-btn');
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            const soundWavesSection = document.getElementById('sound-waves');
            if (soundWavesSection) {
                soundWavesSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    initPipes();

    // Snake Animation for Final Message
    function initSnake() {
        const canvas = document.getElementById('snake-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // Colors from the website theme
        const colors = [
            'rgba(255, 219, 115, 0.8)', // #ffdb73 Yellow
            'rgba(74, 157, 205, 0.8)',  // #4a9dcd Blue
            'rgba(200, 96, 86, 0.8)',   // #c86056 Red
            'rgba(109, 181, 160, 0.8)', // #6db5a0 Green
            'rgba(173, 136, 185, 0.8)'  // #ad88b9 Purple
        ];

        function resize() {
            // Set canvas size to match container
            const container = canvas.parentElement;
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
            drawSnake();
        }

        function drawSnake() {
            const width = canvas.width;
            const height = canvas.height;
            ctx.clearRect(0, 0, width, height);

            const circleRadius = 25;
            const spacing = 30;
            const rows = 6;
            const rowHeight = height / rows;
            const margin = 100;

            // Define path segments
            let segments = [];

            for (let i = 0; i < rows; i++) {
                const y = i * rowHeight + rowHeight / 2;
                const isRight = i % 2 === 0;

                // Straight line segment
                const startX = isRight ? margin : width - margin;
                const endX = isRight ? width - margin : margin;

                segments.push({
                    type: 'line',
                    start: { x: startX, y: y },
                    end: { x: endX, y: y },
                    length: Math.abs(endX - startX)
                });

                // Curve segment (if not last row)
                if (i < rows - 1) {
                    const nextY = (i + 1) * rowHeight + rowHeight / 2;
                    const cx = isRight ? width - margin : margin;
                    const cy = (y + nextY) / 2;
                    const radius = (nextY - y) / 2;

                    // Right curve: -PI/2 to PI/2
                    // Left curve: 3PI/2 to PI/2 (decreasing)
                    const startAngle = isRight ? -Math.PI / 2 : 1.5 * Math.PI;
                    const endAngle = isRight ? Math.PI / 2 : 0.5 * Math.PI;
                    const isCounterClockwise = !isRight; // Left curve goes 270 -> 90 (down via left) which is CCW? 
                    // Wait. 270 (Top) -> 90 (Bottom). 
                    // 270 is 3PI/2. 90 is PI/2.
                    // CCW: 270 -> 180 -> 90. Yes.

                    segments.push({
                        type: 'arc',
                        cx: cx,
                        cy: cy,
                        radius: radius,
                        startAngle: startAngle,
                        endAngle: endAngle,
                        isCCW: !isRight,
                        length: Math.PI * radius
                    });
                }
            }

            // Walk the path
            let totalLength = segments.reduce((acc, seg) => acc + seg.length, 0);
            let currentDist = 0;
            let points = [];

            // We want points at intervals of 'spacing'
            // We can iterate through segments

            let distanceCovered = 0;

            segments.forEach(seg => {
                // How many points fit in this segment starting from current offset?
                // We need to track "distance into current segment" vs "global distance"
                // Actually, just step along.

                // But simpler: just walk the segment.
                // We need to carry over remainder from previous segment?
                // Yes, to ensure perfect spacing.

                // Let's just generate points for the segment based on global steps?
                // No, that's hard.
                // Let's just walk.
            });

            // Better approach:
            // Iterate d from 0 to totalLength step spacing
            for (let d = 0; d <= totalLength; d += spacing) {
                // Find which segment contains d
                let localD = d;
                for (let seg of segments) {
                    if (localD <= seg.length) {
                        // Point is in this segment at localD
                        if (seg.type === 'line') {
                            // Interpolate line
                            const t = localD / seg.length;
                            points.push({
                                x: seg.start.x + (seg.end.x - seg.start.x) * t,
                                y: seg.start.y + (seg.end.y - seg.start.y) * t
                            });
                        } else {
                            // Interpolate arc
                            // Angle interpolation
                            // If CCW, angle decreases? Or we handle logic.
                            // startAngle to endAngle.
                            // If isCCW, we might need to handle wrap around?
                            // My angles: Right: -PI/2 to PI/2. Diff PI.
                            // Left: 3PI/2 to PI/2. Diff -PI.

                            const totalAngle = seg.endAngle - seg.startAngle;
                            // Check wrap? No, defined simply.

                            const t = localD / seg.length;
                            const currentAngle = seg.startAngle + totalAngle * t;

                            points.push({
                                x: seg.cx + seg.radius * Math.cos(currentAngle),
                                y: seg.cy + seg.radius * Math.sin(currentAngle)
                            });
                        }
                        break;
                    } else {
                        localD -= seg.length;
                    }
                }
            }

            // Draw circles
            points.forEach((p, index) => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, circleRadius, 0, Math.PI * 2);
                ctx.fillStyle = colors[index % colors.length];
                ctx.fill();
            });
        }

        window.addEventListener('resize', resize);
        resize();
    }

    initSnake();

    // Flip Card Interaction
    const flipCards = document.querySelectorAll('.gradient-circle');
    flipCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });
});