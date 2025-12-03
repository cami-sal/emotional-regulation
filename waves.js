const canvas = document.getElementById('waveCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let animationId;

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight * 0.6;
}

window.addEventListener('resize', resize);
resize();

// Configuration
const colors = ['#c86056', '#ad88b9', '#ffdb73', '#4a9dcd', '#6db5a0'];
const baseFrequency = 0.01;
const waves = [];

class Wave {
    constructor(color, frequencyMultiplier, amplitudeMultiplier, speed) {
        this.color = color;
        this.frequency = baseFrequency * frequencyMultiplier;
        this.amplitude = 50 * amplitudeMultiplier;
        this.phase = Math.random() * Math.PI * 2;
        this.speed = speed;
        this.circleProgress = Math.random(); // Random starting position for circle (0 to 1)
        this.circleSpeed = 0.001; // Speed at which circle moves along the wave (slower)
    }

    update() {
        this.phase += this.speed;
        this.circleProgress += this.circleSpeed;
        if (this.circleProgress > 1) {
            this.circleProgress = 0; // Loop back to start
        }
    }

    draw(ctx, startX, endX, y) {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;

        const length = endX - startX;

        for (let i = 0; i <= length; i++) {
            // Calculate x relative to start
            const x = startX + i;

            // Sine wave formula with dampening at ends to connect to circles
            // Dampening factor: 0 at ends, 1 in middle
            // Using a sine curve for dampening: sin(pi * progress)
            const progress = i / length;
            const dampening = Math.sin(Math.PI * progress);

            const waveY = Math.sin(i * this.frequency + this.phase) * this.amplitude * dampening;

            ctx.lineTo(x, y + waveY);
        }
        ctx.stroke();
    }

    drawCircle(ctx, startX, endX, y) {
        const length = endX - startX;
        const i = this.circleProgress * length;
        const x = startX + i;

        const progress = i / length;
        const dampening = Math.sin(Math.PI * progress);
        const waveY = Math.sin(i * this.frequency + this.phase) * this.amplitude * dampening;

        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(x, y + waveY, 8, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Initialize Waves
// 5 waves with more varied properties for visual distinction
waves.push(new Wave(colors[0], 0.8, 2.0, 0.02));   // Slower frequency, large amplitude
waves.push(new Wave(colors[1], 2.0, 1.2, 0.035));  // Faster frequency, medium amplitude
waves.push(new Wave(colors[2], 1.2, 2.5, 0.015));  // Medium frequency, largest amplitude
waves.push(new Wave(colors[3], 3.5, 0.9, 0.045));  // Very fast frequency, smaller amplitude
waves.push(new Wave(colors[4], 1.5, 1.8, 0.025));  // Medium-fast frequency, large amplitude

function animate() {
    ctx.clearRect(0, 0, width, height);

    const centerY = height / 2;
    const margin = 100;
    const startX = margin;
    const endX = width - margin;

    // Draw Connecting Line
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.moveTo(startX, centerY);
    ctx.lineTo(endX, centerY);
    ctx.stroke();

    // Draw Waves
    waves.forEach(wave => {
        wave.update();
        wave.draw(ctx, startX, endX, centerY);
    });

    // Draw traveling circles on waves
    waves.forEach(wave => {
        wave.drawCircle(ctx, startX, endX, centerY);
    });

    // Draw Circles
    const circleRadius = 8;
    ctx.fillStyle = '#1a1a1a'; // Match text color

    // Start Circle
    ctx.beginPath();
    ctx.arc(startX, centerY, circleRadius, 0, Math.PI * 2);
    ctx.fill();

    // End Circle
    ctx.beginPath();
    ctx.arc(endX, centerY, circleRadius, 0, Math.PI * 2);
    ctx.fill();

    animationId = requestAnimationFrame(animate);
}

animate();
