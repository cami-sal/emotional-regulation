document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const mainCircle = document.querySelector('.main-circle');
    const rings = document.querySelectorAll('.ring');
    const breathText = document.getElementById('breath-text');
    const cycleCountEl = document.getElementById('cycle-count');
    const timeRemainingEl = document.getElementById('time-remaining');
    const playBtn = document.getElementById('main-play-btn');
    const resetBtn = document.getElementById('reset-btn');
    const tabs = document.querySelectorAll('.tab-btn');
    const patternInfo = document.querySelector('.pattern-info');
    const playIcon = document.querySelector('.play-icon');
    const pauseIcon = document.querySelector('.pause-icon');
    const footerText = document.querySelector('.footer-instruction');

    // Audio
    const bellSound = new Audio('bellcut.mp3');
    bellSound.volume = 0.5;

    // State
    let isPlaying = false;
    let currentPhase = 'ready';
    let cycles = 0;
    let phaseTimeLeft = 0;
    let timerInterval;
    let phaseTimeout;

    // Patterns (durations in ms)
    const patterns = {
        relaxing: {
            name: '4-4-4-4 pattern',
            steps: [
                { type: 'inhale', duration: 4000, text: 'Inhale', scale: 1.5 },
                { type: 'hold', duration: 4000, text: 'Hold', scale: 1.5 },
                { type: 'exhale', duration: 4000, text: 'Exhale', scale: 1.0 },
                { type: 'hold', duration: 4000, text: 'Hold', scale: 1.0 }
            ]
        },
        calming: {
            name: '4-7-8 pattern',
            steps: [
                { type: 'inhale', duration: 4000, text: 'Inhale', scale: 1.5 },
                { type: 'hold', duration: 7000, text: 'Hold', scale: 1.5 },
                { type: 'exhale', duration: 8000, text: 'Exhale', scale: 1.0 }
            ]
        },
        energizing: {
            name: '4-2 pattern',
            steps: [
                { type: 'inhale', duration: 4000, text: 'Inhale', scale: 1.5 },
                { type: 'exhale', duration: 2000, text: 'Exhale', scale: 1.0 }
            ]
        }
    };

    let currentPatternKey = 'relaxing';
    let currentStepIndex = 0;

    // Initialization
    function init() {
        setupTabs();
        setupControls();
        createStars();
        resetSession();
    }

    function createStars() {
        const starContainer = document.querySelector('.background-stars');
        const starCount = 20;
        const colors = ['#ad8cb9', '#4a9dcd', '#eeaa42', '#6db5a0', '#c86056'];

        for (let i = 0; i < starCount; i++) {
            const svgNS = "http://www.w3.org/2000/svg";
            const star = document.createElementNS(svgNS, "svg");
            star.setAttribute("viewBox", "0 0 100 100");
            star.classList.add("star");

            const path = document.createElementNS(svgNS, "path");
            path.setAttribute("d", "M 50 0 C 60 40 100 50 100 50 C 60 60 50 100 50 100 C 40 60 0 50 0 50 C 40 40 50 0 50 0 Z");

            // Random Color
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            path.setAttribute("fill", randomColor);
            path.setAttribute("opacity", "0.3"); // Base opacity

            star.appendChild(path);

            // Random Properties
            const size = Math.random() * 30 + 15; // 15px to 45px
            const top = Math.random() * 100;
            const left = Math.random() * 100;
            const delay = Math.random() * 5; // 0s to 5s delay

            star.style.width = `${size}px`;
            star.style.height = `${size}px`; // Keep aspect ratio
            star.style.top = `${top}%`;
            star.style.left = `${left}%`;
            star.style.animationDelay = `${delay}s`;

            // Avoid center area (roughly) to not overlap main content too much
            // Center is approx 50% 50%. Let's say we allow it everywhere for now as stars are background
            // but if we wanted to avoid the very center:
            // if (top > 30 && top < 70 && left > 30 && left < 70) continue; 
            // However, low z-index handles overlap visually.

            starContainer.appendChild(star);
        }
    }

    function setupTabs() {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                if (isPlaying) stopSession();

                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                currentPatternKey = tab.getAttribute('data-pattern');
                patternInfo.textContent = patterns[currentPatternKey].name;
                resetSession();
            });
        });
    }

    function setupControls() {
        playBtn.addEventListener('click', togglePlay);
        resetBtn.addEventListener('click', () => {
            stopSession();
            resetSession();
        });
    }

    function togglePlay() {
        if (isPlaying) {
            resetSession();
        } else {
            startSession();
            footerText.textContent = "Breathe with the circle";
        }
    }

    function startSession() {
        isPlaying = true;
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');

        if (currentPhase === 'ready') {
            currentStepIndex = 0;
            runStep();
        } else {
            // Resume logic (simplified: restart current step or just restart cycle)
            // For simplicity, we restart the current step
            runStep();
        }
    }

    function stopSession() {
        isPlaying = false;
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');

        clearTimeout(phaseTimeout);
        clearInterval(timerInterval);

        // Stop Audio
        bellSound.pause();
        bellSound.currentTime = 0;

        // Pause visual
        const computedStyle = window.getComputedStyle(mainCircle);
        const currentScale = computedStyle.transform;
        mainCircle.style.transition = 'none';
        mainCircle.style.transform = currentScale;

        rings.forEach(ring => {
            const ringStyle = window.getComputedStyle(ring);
            const ringTransform = ringStyle.transform;
            ring.style.transition = 'none';
            ring.style.transform = ringTransform;
        });
    }

    function resetSession() {
        stopSession();
        currentPhase = 'ready';
        cycles = 0;
        currentStepIndex = 0;

        cycleCountEl.textContent = '0';
        timeRemainingEl.textContent = '0s';
        breathText.textContent = 'Ready';

        mainCircle.style.transition = 'transform 0.5s ease';
        mainCircle.style.transform = 'scale(1)';

        rings.forEach(ring => {
            ring.style.transition = 'transform 0.5s ease';
            ring.style.transform = 'translate(-50%, -50%) scale(1)';
        });
        footerText.textContent = "Press play to begin";
    }

    function runStep() {
        if (!isPlaying) return;

        const pattern = patterns[currentPatternKey];
        const step = pattern.steps[currentStepIndex];

        // Update State
        currentPhase = step.type;
        breathText.textContent = step.text;

        // Visual Style Updates
        mainCircle.classList.remove('hold', 'exhale');

        if (step.type === 'hold') {
            mainCircle.classList.add('hold');
            footerText.textContent = "Hold your breath...";
        } else if (step.type === 'exhale') {
            mainCircle.classList.add('exhale');
            footerText.textContent = "Slowly release...";
        } else {
            if (step.type === 'inhale') footerText.textContent = "Breathe in...";
        }

        // Audio
        playBell();

        // Visual Animation
        mainCircle.style.transition = `transform ${step.duration}ms linear`;
        mainCircle.style.transform = `scale(${step.scale})`;

        rings.forEach(ring => {
            ring.style.transition = `transform ${step.duration}ms linear`;
            ring.style.transform = `translate(-50%, -50%) scale(${step.scale})`;
        });

        // Timer
        phaseTimeLeft = step.duration / 1000;
        timeRemainingEl.textContent = `${Math.ceil(phaseTimeLeft)}s`;

        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            phaseTimeLeft -= 1;
            if (phaseTimeLeft < 0) phaseTimeLeft = 0;
            timeRemainingEl.textContent = `${Math.ceil(phaseTimeLeft)}s`;
        }, 1000);

        // Next Step
        phaseTimeout = setTimeout(() => {
            currentStepIndex++;
            if (currentStepIndex >= pattern.steps.length) {
                currentStepIndex = 0;
                cycles++;
                cycleCountEl.textContent = cycles;
            }
            runStep();
        }, step.duration);
    }

    function playBell() {
        bellSound.currentTime = 0;
        bellSound.play().catch(() => { });
    }

    init();

    // SoundCloud Player Integration
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

        // Wait for SC to be available if script just loaded
        if (typeof SC === 'undefined') {
            setTimeout(initAudioPlayer, 100);
            return;
        }

        const widget = SC.Widget(iframeElement);
        const audioControl = document.getElementById('audio-control');
        const audioWrapper = document.querySelector('.audio-wrapper');

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
                if (audioWrapper) audioWrapper.classList.remove('active');
            } else {
                widget.play();
                iconSpan.textContent = '❚❚';
                textSpan.textContent = 'Pause Music';
                isPlaying = true;
                audioControl.classList.add('playing');
                if (audioWrapper) audioWrapper.classList.add('active');
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
                if (audioWrapper) audioWrapper.classList.add('active');
            });
        });

        // Volume Control
        const volumeSlider = document.getElementById('volume-slider');
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                const volume = e.target.value;
                widget.setVolume(volume);
            });
        }
    }
});
