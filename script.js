document.addEventListener('DOMContentLoaded', () => {
    const garden = document.getElementById('growth-is-not-linear');
    const spacer = document.querySelector('.spacer');

    const pathScale = 0.8;
    const pathOffset = 10; // 10% margin
    // Configuration
    const flowerAssets = ['flower graphs/growth is not linear/solos/blue flower.png', 'flower graphs/growth is not linear/solos/pink flower.png'];
    const flowers = [];

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
    svg.style.left = "20%"; // Center: (100% - 60%) / 2
    svg.style.width = "60%"; // Reduced size (was 80%)
    svg.style.height = "auto"; // Maintain aspect ratio
    svg.style.overflow = "visible"; // Allow flowers to overflow if needed

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
    img.setAttribute("href", "flower graphs/growth is not linear/basepunto.svg");
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
        // Update to match the visual size of the SVG (60% of window width)
        const visualWidth = window.innerWidth * 0.6;
        const gardenHeight = visualWidth * aspectRatio;

        garden.style.width = `${window.innerWidth}px`; // Container still full width
        garden.style.height = `${gardenHeight}px`;
        spacer.style.height = `${gardenHeight}px`;

        return { width: visualWidth, height: gardenHeight };
    }

    let dims = updateDimensions();

    // Generate Flowers and Leaves along the path
    // We use getPointAtLength to find positions

    const targetFlowers = [
        { type: 'pink', src: 'flower graphs/growth is not linear/solos/pink flower.png', animation: 'pulse' },
        { type: 'blue', src: 'flower graphs/growth is not linear/solos/blue flower.png', animation: 'rotate' },
        { type: 'pink', src: 'flower graphs/growth is not linear/solos/pink flower.png', animation: 'pulse' },
        { type: 'blue', src: 'flower graphs/growth is not linear/solos/blue flower.png', animation: 'rotate' },
        { type: 'pink', src: 'flower graphs/growth is not linear/solos/pink flower.png', animation: 'pulse' },
        { type: 'blue', src: 'flower graphs/growth is not linear/solos/blue flower.png', animation: 'rotate' },
        { type: 'bigpink', src: 'flower graphs/growth is not linear/solos/bigpink flower.png', animation: 'pulse' }
    ];

    // Positions along the path (0 to 1)
    const flowerPositions = [0.15, 0.30, 0.45, 0.60, 0.75, 0.90, 0.98];

    flowerPositions.forEach((pos, i) => {
        const flowerConfig = targetFlowers[i];
        const point = path.getPointAtLength(pos * pathLength);

        const flower = document.createElement('div');
        flower.classList.add('flower');
        flower.classList.add(flowerConfig.animation);

        // Add special class for big pink flower
        if (flowerConfig.type === 'bigpink') {
            flower.classList.add('bigpink');
        }

        // Convert SVG coordinates to percentages
        let left = pathOffset + (point.x / originalWidth) * 100 * pathScale;
        let top = pathOffset + (point.y / originalHeight) * 100 * pathScale;

        // Add offsets for big pink flower
        if (flowerConfig.type === 'bigpink') {
            const gardenHeight = dims.height;
            const gardenWidth = window.innerWidth;
            const verticalOffsetPercent = (220 / gardenHeight) * 100;
            const horizontalOffsetPercent = (50 / gardenWidth) * 100; // Move 50px to the right
            top += verticalOffsetPercent;
            left += horizontalOffsetPercent;
        }

        flower.style.left = `${left}%`;
        flower.style.top = `${top}%`;

        if (flowerConfig.animation === 'rotate') {
            flower.style.setProperty('--rotation', `${Math.random() * 360}deg`);
        }

        const img = document.createElement('img');
        img.src = flowerConfig.src;
        flower.appendChild(img);
        garden.appendChild(flower);

        flowers.push({
            element: flower,
            triggerY: (pathOffset / 100 + (point.y / originalHeight) * pathScale) * dims.height,
            normY: pathOffset / 100 + (point.y / originalHeight) * pathScale,
            active: false,
            baseRotation: Math.random() * 360,
            animation: flowerConfig.animation,
            isBigPink: flowerConfig.type === 'bigpink'
        });
    });

    // Leaves
    const leafConfig = [
        { position: 0.08 }, { position: 0.22 }, { position: 0.24 },
        { position: 0.38 }, { position: 0.52 }, { position: 0.82 }
    ];

    leafConfig.forEach(config => {
        const point = path.getPointAtLength(config.position * pathLength);

        const leaf = document.createElement('div');
        leaf.classList.add('leaf');

        const left = pathOffset + (point.x / originalWidth) * 100 * pathScale;
        const top = pathOffset + (point.y / originalHeight) * 100 * pathScale;

        leaf.style.left = `${left}%`;
        leaf.style.top = `${top}%`;
        leaf.style.setProperty('--rotation', `${Math.random() * 360}deg`);

        const img = document.createElement('img');
        img.src = 'flower graphs/growth is not linear/solos/leaf.png';
        leaf.appendChild(img);
        garden.appendChild(leaf);

        flowers.push({
            element: leaf,
            triggerY: (pathOffset / 100 + (point.y / originalHeight) * pathScale) * dims.height,
            normY: pathOffset / 100 + (point.y / originalHeight) * pathScale,
            active: false,
            baseRotation: Math.random() * 360,
            animation: 'leaf'
        });
    });

    // Scroll Text Logic
    const words = document.querySelectorAll('.word');
    const wordPositions = [0.1, 0.35, 0.65, 0.9];

    function updatePositions() {
        const gardenTop = window.innerHeight;
        dims = updateDimensions(); // Update dims on resize

        words.forEach((word, index) => {
            const relativeTop = wordPositions[index] * dims.height;
            const absoluteTop = gardenTop + relativeTop;
            word.style.top = `${absoluteTop}px`;
            word.dataset.triggerY = relativeTop;
        });

        // Update flower trigger points
        flowers.forEach(f => {
            f.triggerY = f.normY * dims.height;
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
        const gardenTop = windowHeight;

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

        // Path Drawing Logic
        const revealOffset = windowHeight * 0.6; // Trigger earlier
        const relativeScroll = currentScroll + revealOffset - gardenTop;
        // Calculate length based on garden height
        // The path covers the full height of the garden
        let revealPercentage = relativeScroll / dims.height;
        revealPercentage = Math.max(0, Math.min(1, revealPercentage));

        const drawLength = pathLength * revealPercentage;
        path.style.strokeDashoffset = pathLength - drawLength;

        // Text and Flower Visibility
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

        flowers.forEach(f => {
            // Special handling for big pink flower - only show when path is 98% revealed
            if (f.isBigPink) {
                const shouldBloom = revealPercentage >= 0.98;
                if (shouldBloom && !f.active) {
                    f.element.classList.add('bloomed');
                    f.active = true;
                } else if (!shouldBloom && f.active) {
                    f.element.classList.remove('bloomed');
                    f.active = false;
                }
            } else {
                // Normal visibility check for other flowers
                const isVisible = checkVisibility(f.triggerY);
                if (isVisible) {
                    if (!f.active) {
                        f.element.classList.add('bloomed');
                        f.active = true;
                    }
                    if (f.animation === 'rotate') {
                        const spin = currentScroll * 0.2 + f.baseRotation;
                        f.element.style.setProperty('--rotation', `${spin}deg`);
                    }
                } else {
                    if (f.active) {
                        f.element.classList.remove('bloomed');
                        f.active = false;
                    }
                }
            }
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

    // Play Button Scroll Logic
    const playBtn = document.querySelector('.hero-play-btn');
    if (playBtn && garden) {
        playBtn.addEventListener('click', () => {
            garden.scrollIntoView({ behavior: 'smooth' });
        });
    }
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