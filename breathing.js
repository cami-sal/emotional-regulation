document.addEventListener('DOMContentLoaded', () => {
    // Box Breathing Logic
    const boxText = document.getElementById('box-text');
    const boxAnim = document.getElementById('box-anim');
    const pathAnim = document.getElementById('path-anim'); // Get path animation
    const boxCircle = document.getElementById('box-circle');

    // Audio (Bell)
    const bellSound = new Audio('bell.mp3');
    bellSound.volume = 0.5;

    function playBell() {
        bellSound.volume = 0.5; // Reset volume
        bellSound.currentTime = 0;
        bellSound.play().catch(e => console.log("Audio play failed:", e));

        // Start fade out at 800ms
        setTimeout(() => {
            const fadeAudio = setInterval(() => {
                if (bellSound.volume > 0.05) {
                    bellSound.volume -= 0.05;
                } else {
                    clearInterval(fadeAudio);
                    bellSound.pause();
                    bellSound.currentTime = 0;
                    bellSound.volume = 0.5; // Reset for next time
                }
            }, 20); // Fade over ~200ms
        }, 800);
    }

    // Music Player Logic (SoundCloud)
    const iframe = document.getElementById('sc-player');
    // Wait for SC API to load if not ready, but usually it loads fast.
    // We assume SC is available globally since we added the script.
    // However, the script is async. Let's wrap in a check or just init.
    // Ideally we'd wait for onload, but let's try direct init.

    let widget;
    let isPlaying = false;
    const audioControl = document.getElementById('audio-control');
    const iconSpan = audioControl.querySelector('.icon');
    const textSpan = audioControl.querySelector('.text');

    // Initialize widget when API is ready
    // We can use a simple interval check or just try.
    // Since we put the script before this file (or in body), it might race.
    // Let's use a safe init.

    function initWidget() {
        if (typeof SC !== 'undefined') {
            widget = SC.Widget(iframe);
            setupPlayerControls();
        } else {
            setTimeout(initWidget, 100);
        }
    }

    function setupPlayerControls() {
        // Play/Pause Toggle
        audioControl.addEventListener('click', () => {
            if (isPlaying) {
                widget.pause();
                iconSpan.textContent = '♫';
                textSpan.textContent = 'Play Music';
                audioControl.classList.remove('playing');
            } else {
                widget.play();
                iconSpan.textContent = '❚❚';
                textSpan.textContent = 'Pause Music';
                audioControl.classList.add('playing');
            }
            isPlaying = !isPlaying;
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

        // Volume Control
        const volumeSlider = document.getElementById('volume-slider');
        volumeSlider.addEventListener('input', (e) => {
            const volume = e.target.value;
            widget.setVolume(volume);
        });
    }

    initWidget();

    const dots = document.querySelectorAll('.dot');

    function resetDots() {
        dots.forEach(dot => dot.classList.remove('active'));
    }

    function startDotAnimation() {
        resetDots();
        // Light up dots one by one every second
        dots.forEach((dot, index) => {
            setTimeout(() => {
                dot.classList.add('active');
            }, index * 1000);
        });
    }

    // Box Cycle: Inhale (4s), Hold (4s), Exhale (4s), Hold (4s)
    // Total 16s.

    function runBoxCycle() {
        // 0-4s: Inhale (Up)
        playBell();
        startDotAnimation(); // Start counting
        boxText.innerText = 'Inhale';
        boxText.style.opacity = 1; // Fade In

        // Fade out before Hold
        setTimeout(() => { boxText.style.opacity = 0; }, 3500);

        // 4-8s: Hold (Right) - Maintain Inhale Size
        setTimeout(() => {
            playBell();
            startDotAnimation(); // Start counting
            boxText.innerText = 'Hold';
            boxText.style.opacity = 1; // Fade In
        }, 4000);

        // Fade out before Exhale
        setTimeout(() => { boxText.style.opacity = 0; }, 7500);

        // 8-12s: Exhale (Down)
        setTimeout(() => {
            playBell();
            startDotAnimation(); // Start counting
            boxText.innerText = 'Exhale';
            boxText.style.opacity = 1; // Fade In
        }, 8000);

        // Fade out before Hold
        setTimeout(() => { boxText.style.opacity = 0; }, 11500);

        // 12-16s: Hold (Left) - Maintain Exhale Size
        setTimeout(() => {
            playBell();
            startDotAnimation(); // Start counting
            boxText.innerText = 'Hold';
            boxText.style.opacity = 1; // Fade In
        }, 12000);

        // Fade out before loop restarts (Inhale)
        setTimeout(() => { boxText.style.opacity = 0; }, 15500);
    }

    // Start Button Logic
    const startBtn = document.getElementById('start-btn');
    const startOverlay = document.getElementById('start-overlay');

    // Box circle start (25, 320) - Start of new offset path
    boxCircle.setAttribute('cx', 25);
    boxCircle.setAttribute('cy', 320);

    boxText.innerText = 'Get Ready...';

    startBtn.addEventListener('click', () => {
        // 1. Unlock Audio
        bellSound.play().then(() => {
            bellSound.pause();
            bellSound.currentTime = 0;
        }).catch(e => console.log("Audio unlock failed:", e));

        // 2. Hide Overlay
        startOverlay.classList.add('hidden');

        // 3. Start "Get Ready" Countdown (4 seconds)
        startDotAnimation(); // Visual count 1-4

        // 4. Start Sequence after 4 seconds
        setTimeout(() => {
            // Reset circle positions
            boxCircle.setAttribute('cx', 0);
            boxCircle.setAttribute('cy', 0);

            // Start SVG Animations
            boxAnim.beginElement();
            pathAnim.beginElement(); // Start drawing the box

            // Start Cycles
            runBoxCycle();

            // Repeat cycles
            setInterval(runBoxCycle, 16000);      // Box (16s)

        }, 4000); // 4 second "Get Ready"
    });
});
