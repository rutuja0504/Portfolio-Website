document.addEventListener('DOMContentLoaded', () => {

    /* --- Mobile Navigation --- */
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if(hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('toggle');
        });
    }

    /* --- Hero Background Animation (Starfield) --- */
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }

        class Star {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 1.5; // Smaller stars
                this.speedX = (Math.random() - 0.5) * 0.2; // Slow movement
                this.speedY = (Math.random() - 0.5) * 0.2;
                this.opacity = Math.random();
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Wrap around screen
                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
            }

            draw() {
                ctx.beginPath();
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initStars() {
            particles = [];
            const count = Math.floor(window.innerWidth / 10); // Dense starfield
            for (let i = 0; i < count; i++) {
                particles.push(new Star());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            
            // Draw connection lines for close stars (Constellation effect)
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = 'rgba(99, 102, 241, 0.15)'; // Very faint purple
            
            for (let i = 0; i < particles.length; i++) {
                let p = particles[i];
                p.update();
                p.draw();

                // Connect logic (optimized)
                for (let j = i + 1; j < particles.length; j++) {
                    let p2 = particles[j];
                    let dist = Math.sqrt((p.x - p2.x)**2 + (p.y - p2.y)**2);
                    if (dist < 80) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', () => {
            resize();
            initStars();
        });

        resize();
        initStars();
        animate();
    }

    /* --- Interactive Bar Chart (Neon Style) --- */
    const chartCanvas = document.getElementById('business-chart');
    if(chartCanvas) {
        const ctx = chartCanvas.getContext('2d');
        let cW, cH;

        // Data
        const chartData = {
            'Revenue': [40, 55, 45, 70, 65, 85, 95, 80],
            'Growth': [20, 30, 45, 40, 55, 50, 65, 75]
        };
        const labels = ['Q1', 'Q2', 'Q3', 'Q4', 'Q1', 'Q2', 'Q3', 'Q4'];
        
        let activeData = [...chartData['Revenue']];
        let targetData = [...chartData['Revenue']];

        function resizeChart() {
            cW = chartCanvas.width = chartCanvas.parentElement.offsetWidth - 40;
            cH = chartCanvas.height = 300;
        }

        function lerp(a, b, t) { return a + (b - a) * t; }

        function drawChart() {
            ctx.clearRect(0, 0, cW, cH);
            
            const barW = (cW / activeData.length) * 0.5;
            const gap = (cW / activeData.length);
            
            // Animation Interp
            for(let i=0; i<activeData.length; i++) {
                activeData[i] = lerp(activeData[i], targetData[i], 0.1);
            }

            // Draw
            activeData.forEach((val, i) => {
                const h = (val / 100) * (cH - 40);
                const x = i * gap + (gap - barW) / 2;
                const y = cH - h - 20;

                // Bar Gradient
                const grad = ctx.createLinearGradient(x, y, x, y + h);
                grad.addColorStop(0, '#6366f1'); // Indigo
                grad.addColorStop(1, '#0ea5e9'); // Sky Blue

                ctx.fillStyle = grad;
                ctx.beginPath();
                
                // Rounded top bars
                ctx.roundRect(x, y, barW, h, [4, 4, 0, 0]);
                ctx.fill();

                // Glow effect
                ctx.shadowColor = 'rgba(99, 102, 241, 0.5)';
                ctx.shadowBlur = 10;
                ctx.fill();
                ctx.shadowBlur = 0; // Reset

                // Text
                ctx.fillStyle = '#94a3b8';
                ctx.font = '12px Inter';
                ctx.textAlign = 'center';
                ctx.fillText(labels[i], x + barW/2, cH - 5);
            });

            requestAnimationFrame(drawChart);
        }

        document.getElementById('btn-c1').addEventListener('click', () => targetData = chartData['Revenue']);
        document.getElementById('btn-c2').addEventListener('click', () => targetData = chartData['Growth']);

        window.addEventListener('resize', resizeChart);
        resizeChart();
        drawChart();
    }

    /* --- Scroll Reveal Animation --- */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section').forEach(sec => {
        sec.classList.add('hidden-section'); // style.css needs this class or JS adds opacity style
        observer.observe(sec);
    });
    /* --- Typing Effect for About Me --- */
    const terminalBody = document.getElementById('terminal-body');
    if (terminalBody) {
        // Define the content with structure for syntax highlighting styling
        // We will construct the HTML string character by character but that's hard to animate smoothly with span tags injected mid-way.
        // Easier approach: Array of objects representing tokens or lines.
        
        // Let's treat the text as raw text but we want colors. 
        // Strategy: We will type out plain text for a "typing" feel, but that makes coloring hard.
        // Better Strategy: usage of a list of "actions" or "segments".
        
        const lines = [
            { text: "// User Profile Configuration\n", class: "token-comment" },
            { text: "const ", class: "token-keyword" },
            { text: "user", class: "token-variable" },
            { text: " = {\n", class: "token-plain" },
            
            { text: "    name", class: "token-key" },
            { text: ": ", class: "token-operator" },
            { text: "\"Rutuja Bothe\"", class: "token-string" },
            { text: ",\n", class: "token-plain" },

            { text: "    location", class: "token-key" },
            { text: ": ", class: "token-operator" },
            { text: "\"Galway, Ireland\"", class: "token-string" },
            { text: ",\n", class: "token-plain" },

            { text: "    education", class: "token-key" },
            { text: ": ", class: "token-operator" },
            { text: "\"University of Galway\"", class: "token-string" },
            { text: ",\n", class: "token-plain" },

            { text: "    skills", class: "token-key" },
            { text: ": [\n", class: "token-operator" },
            { text: "        \"Python\", \"SQL\", \"Tableau\",\n", class: "token-string" },
            { text: "        \"PowerBI\", \"React\", \"Spring Boot\"\n", class: "token-string" },
            { text: "    ],\n", class: "token-plain" },

            { text: "    status", class: "token-key" },
            { text: ": ", class: "token-operator" },
            { text: "\"Open to Work\"", class: "token-string" },
            { text: "\n};", class: "token-plain" }
        ];

        let lineIndex = 0;
        let charIndex = 0;
        let isTyping = false;
        
        // Cursor Element
        const cursorSpan = document.createElement('span');
        cursorSpan.classList.add('cursor');
        terminalBody.appendChild(cursorSpan);

        function typeLine() {
            if (lineIndex < lines.length) {
                const currentSegment = lines[lineIndex];
                const textToType = currentSegment.text;
                const className = currentSegment.class;

                // Create a span for the current segment if it's the start of it
                let currentSpan = terminalBody.querySelector(`span[data-index="${lineIndex}"]`);
                if (!currentSpan) {
                    currentSpan = document.createElement('span');
                    if (className) currentSpan.className = className;
                    currentSpan.setAttribute('data-index', lineIndex);
                    // Insert before cursor
                    terminalBody.insertBefore(currentSpan, cursorSpan);
                }

                if (charIndex < textToType.length) {
                    currentSpan.textContent += textToType.charAt(charIndex);
                    charIndex++;
                    setTimeout(typeLine, Math.random() * 30 + 20); // Random typing speed
                } else {
                    lineIndex++;
                    charIndex = 0;
                    setTimeout(typeLine, 50); // Small pause between segments
                }
            }
        }

        // Trigger typing when section is visible
        const terminalObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !isTyping) {
                    isTyping = true;
                    // Clear initial if needed (though it's empty in HTML)
                    // Start typing
                    typeLine();
                    terminalObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        terminalObserver.observe(terminalBody);
    }
});
