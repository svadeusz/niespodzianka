/**
 * 1. BIBLIOTEKA KONFETTI (Twoja oryginalna logika)
 */
(function() {
    var canvasConfetti = {
        canvas: null,
        context: null,
        particles: [],
        colors: ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'],
        
        init: function(canvasId) {
            this.canvas = document.getElementById(canvasId);
            if (!this.canvas) {
                this.canvas = document.createElement('canvas');
                this.canvas.id = canvasId;
                this.canvas.style.position = 'fixed';
                this.canvas.style.top = '0';
                this.canvas.style.left = '0';
                this.canvas.style.width = '100%';
                this.canvas.style.height = '100%';
                this.canvas.style.pointerEvents = 'none';
                this.canvas.style.zIndex = '999';
                document.body.appendChild(this.canvas);
            }
            
            this.context = this.canvas.getContext('2d');
            this.resizeCanvas();
            window.addEventListener('resize', this.resizeCanvas.bind(this));
            
            return this;
        },
        
        resizeCanvas: function() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        },
        
        createParticles: function(options) {
            var defaults = {
                particleCount: 100,
                startPosition: { x: 0.5, y: 0.6 },
                spread: 80,
                velocity: 30,
                gravity: 0.8,
                colors: this.colors
            };
            
            options = Object.assign({}, defaults, options || {});
            
            var startX = this.canvas.width * options.startPosition.x;
            var startY = this.canvas.height * options.startPosition.y;
            
            for (var i = 0; i < options.particleCount; i++) {
                var angle = (Math.random() * options.spread - options.spread/2) * Math.PI / 180;
                var velocity = options.velocity * (0.8 + Math.random() * 0.4);
                var size = Math.random() * 8 + 5;
                var color = options.colors[Math.floor(Math.random() * options.colors.length)];
                var shape = Math.random() > 0.5 ? 'circle' : 'square';
                
                this.particles.push({
                    x: startX,
                    y: startY,
                    size: size,
                    color: color,
                    vx: Math.cos(angle) * velocity,
                    vy: Math.sin(angle) * velocity,
                    gravity: options.gravity * (0.8 + Math.random() * 0.4),
                    rotation: Math.random() * 360,
                    rotationSpeed: (Math.random() - 0.5) * 10,
                    opacity: 1,
                    shape: shape,
                    life: 1
                });
            }
            
            if (!this.animating) {
                this.animating = true;
                this.animate();
            }
        },
        
        animate: function() {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            for (var i = 0; i < this.particles.length; i++) {
                var p = this.particles[i];
                
                p.x += p.vx;
                p.y += p.vy;
                p.vy += p.gravity;
                p.rotation += p.rotationSpeed;
                p.opacity -= 0.005;
                p.life -= 0.01;
                
                this.context.save();
                this.context.translate(p.x, p.y);
                this.context.rotate(p.rotation * Math.PI / 180);
                this.context.globalAlpha = p.opacity;
                this.context.fillStyle = p.color;
                
                if (p.shape === 'circle') {
                    this.context.beginPath();
                    this.context.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                    this.context.fill();
                } else {
                    this.context.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                }
                
                this.context.restore();
            }
            
            this.particles = this.particles.filter(function(p) {
                return p.opacity > 0 && p.y < this.canvas.height;
            }.bind(this));
            
            if (this.particles.length > 0) {
                requestAnimationFrame(this.animate.bind(this));
            } else {
                this.animating = false;
            }
        },
        
        fire: function(options) {
            this.createParticles(options);
        }
    };
    
    window.confetti = canvasConfetti;
})();

const canvas = document.getElementById('scratch-canvas');
const ctx = canvas.getContext('2d');
const cursor = document.getElementById('custom-cursor');
const sourceImg = document.getElementById('source-overlay');
let isDrawing = false;

// 1. Funkcja rysująca obrazek na Canvasie
function drawOverlay() {
    // Ustawiamy tryb rysowania na "normalny" (nakładanie)
    ctx.globalCompositeOperation = 'source-over';
    
    // Rysujemy obrazek wierzchni
    ctx.drawImage(sourceImg, 0, 0, canvas.width, canvas.height);
    
    console.log("Obrazek narysowany!");
}

// 2. Bezpieczne ładowanie obrazka
// Jeśli obrazek już jest w cache przeglądarki:
if (sourceImg.complete && sourceImg.naturalHeight !== 0) {
    drawOverlay();
} 
// Jeśli dopiero się ładuje:
else {
    sourceImg.onload = drawOverlay;
    // Zabezpieczenie: Jeśli obrazka nie ma, narysuj szare tło
    sourceImg.onerror = function() {
        console.error("Błąd: Nie znaleziono pliku zdrapka.png!");
        ctx.fillStyle = '#CCCCCC';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'black';
        ctx.fillText("Brak obrazka", 120, 150);
    };
}

// 3. Ruch gumki za myszką (zawsze przyklejona)
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    if (isDrawing) {
        scratch(e);
    }
});

// 4. Logika drapania
function scratch(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Magia: destination-out sprawia, że rysowanie "usuwa" to co jest pod spodem
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2); // 30 to rozmiar dziury
    ctx.fill();
}

// Obsługa kliknięcia (drapanie tylko jak trzymasz przycisk)
canvas.addEventListener('mousedown', () => isDrawing = true);
window.addEventListener('mouseup', () => isDrawing = false);

// Inicjalizacja dźwięku i konfetti
window.addEventListener('load', () => {
    if(window.confetti) {
        confetti.init('confetti-canvas');
        confetti.fire({ particleCount: 150 });
    }
    
    document.addEventListener('click', function() {
        document.getElementById('bgm').play().catch(()=>{});
    }, { once: true });
});