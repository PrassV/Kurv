// Network Graph Animation for Hero Section
class NetworkGraph {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.nodes = [];
        this.connections = [];
        this.nodeCount = 50;
        this.maxConnections = 3;
        this.mouse = { x: 0, y: 0, radius: 150 };

        this.resize();
        this.init();
        this.animate();

        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
    }
    
    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
    }
    
    init() {
        // Create nodes in 3D space (simulated)
        for (let i = 0; i < this.nodeCount; i++) {
            const angle = (Math.PI * 2 * i) / this.nodeCount;
            const radius = Math.random() * 200 + 150;
            const z = (Math.random() - 0.5) * 300;
            
            this.nodes.push({
                x: this.centerX + Math.cos(angle) * radius,
                y: this.centerY + Math.sin(angle) * radius,
                z: z,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                vz: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }
        
        // Create connections
        this.updateConnections();
    }
    
    updateConnections() {
        this.connections = [];
        for (let i = 0; i < this.nodes.length; i++) {
            const nodeA = this.nodes[i];
            const connections = [];
            
            for (let j = i + 1; j < this.nodes.length; j++) {
                const nodeB = this.nodes[j];
                const dx = nodeA.x - nodeB.x;
                const dy = nodeA.y - nodeB.y;
                const dz = nodeA.z - nodeB.z;
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
                
                if (distance < 150 && connections.length < this.maxConnections) {
                    connections.push({ node: j, distance });
                }
            }
            
            connections.sort((a, b) => a.distance - b.distance);
            connections.slice(0, this.maxConnections).forEach(conn => {
                this.connections.push({ from: i, to: conn.node });
            });
        }
    }
    
    update() {
        // Rotate nodes around center
        const time = Date.now() * 0.0005;

        this.nodes.forEach((node, i) => {
            // Mouse interaction - repel nodes from cursor
            const dx = node.x - this.mouse.x;
            const dy = node.y - this.mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.mouse.radius) {
                const force = (this.mouse.radius - distance) / this.mouse.radius;
                const angle = Math.atan2(dy, dx);
                node.vx += Math.cos(angle) * force * 0.5;
                node.vy += Math.sin(angle) * force * 0.5;
            }

            // Apply damping
            node.vx *= 0.95;
            node.vy *= 0.95;
            node.vz *= 0.98;

            // Update position
            node.x += node.vx;
            node.y += node.vy;
            node.z += node.vz;

            // Boundary check and wrap
            const centerDx = node.x - this.centerX;
            const centerDy = node.y - this.centerY;
            const centerDistance = Math.sqrt(centerDx * centerDx + centerDy * centerDy);

            if (centerDistance > 400) {
                node.vx *= -1;
                node.vy *= -1;
            }

            if (node.z > 200) node.vz *= -1;
            if (node.z < -200) node.vz *= -1;
        });

        // Periodically update connections
        if (Math.random() < 0.02) {
            this.updateConnections();
        }
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 0.5;
        
        // Draw connections
        this.connections.forEach(conn => {
            const nodeA = this.nodes[conn.from];
            const nodeB = this.nodes[conn.to];
            
            const depthA = 1 - Math.abs(nodeA.z) / 300;
            const depthB = 1 - Math.abs(nodeB.z) / 300;
            const avgDepth = (depthA + depthB) / 2;
            
            if (avgDepth > 0) {
                this.ctx.globalAlpha = avgDepth * 0.3;
                this.ctx.beginPath();
                this.ctx.moveTo(nodeA.x, nodeA.y);
                this.ctx.lineTo(nodeB.x, nodeB.y);
                this.ctx.stroke();
            }
        });
        
        // Draw nodes
        this.nodes.forEach(node => {
            const depth = 1 - Math.abs(node.z) / 300;
            if (depth > 0) {
                // Calculate distance to mouse for glow effect
                const dx = node.x - this.mouse.x;
                const dy = node.y - this.mouse.y;
                const distanceToMouse = Math.sqrt(dx * dx + dy * dy);
                const glowIntensity = Math.max(0, 1 - distanceToMouse / this.mouse.radius);

                // Apply glow if near mouse
                if (glowIntensity > 0) {
                    this.ctx.globalAlpha = depth * 0.6 * glowIntensity;
                    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                    this.ctx.beginPath();
                    this.ctx.arc(node.x, node.y, (node.radius * depth + 3) * (1 + glowIntensity), 0, Math.PI * 2);
                    this.ctx.fill();
                }

                this.ctx.globalAlpha = depth * 0.6;
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                this.ctx.beginPath();
                this.ctx.arc(node.x, node.y, node.radius * depth, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });

        this.ctx.globalAlpha = 1;
    }
    
    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// 47-Dimension Psychometric Helix Visualization
class HumanVisualization {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.helixNodes = [];
        this.animationProgress = 0;
        this.isVisible = false;
        this.rotation = 0;
        
        this.resize();
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.isVisible = true;
                }
            });
        }, { threshold: 0.3 });
        
        this.observer.observe(canvas.parentElement);
    }
    
    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
    }
    
    init() {
        // Create Helix Nodes
        const strands = 2;
        const nodesPerStrand = 15;
        const radius = 60;
        const height = 300;
        
        for (let s = 0; s < strands; s++) {
            for (let i = 0; i < nodesPerStrand; i++) {
                const y = (i / (nodesPerStrand - 1)) * height - height / 2;
                const angle = (i / nodesPerStrand) * Math.PI * 4 + (s * Math.PI); // 2 full turns
                
                this.helixNodes.push({
                    baseX: Math.cos(angle) * radius,
                    baseZ: Math.sin(angle) * radius,
                    y: y,
                    angle: angle,
                    radius: radius,
                    strand: s
                });
            }
        }

        // Create scattered psychometric particles
        for(let i=0; i<47; i++) {
            this.particles.push({
                x: (Math.random() - 0.5) * 400,
                y: (Math.random() - 0.5) * 400,
                z: (Math.random() - 0.5) * 200,
                baseX: 0, 
                baseY: 0,
                targetY: (Math.random()-0.5) * 200,
                speed: 0.02 + Math.random() * 0.03,
                size: Math.random() * 2 + 1
            });
        }
    }
    
    update() {
        if (!this.isVisible) return;
        
        this.rotation += 0.02;
        this.animationProgress = Math.min(this.animationProgress + 0.01, 1);
        
        // Floating particles
        this.particles.forEach(p => {
            p.y -= p.speed;
            if(p.y < -200) p.y = 200;
        });
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (!this.isVisible) return;
        
        // Center coordinate system
        this.ctx.save();
        this.ctx.translate(this.centerX, this.centerY);
        
        // Sort nodes by Z depth for correct rendering order
        const projectedNodes = this.helixNodes.map(node => {
            // Rotate
            const x = node.baseX * Math.cos(this.rotation) - node.baseZ * Math.sin(this.rotation);
            const z = node.baseX * Math.sin(this.rotation) + node.baseZ * Math.cos(this.rotation);
            
            // Perspective project
            const fov = 300;
            const scale = fov / (fov + z);
            
            return {
                x: x * scale,
                y: node.y * scale,
                scale: scale,
                z: z,
                strand: node.strand
            };
        });
        
        // Draw connections (Base Pairs)
        this.ctx.lineWidth = 1;
        for (let i = 0; i < projectedNodes.length / 2; i++) {
            const nodeA = projectedNodes[i]; // Strand 0
            const nodeB = projectedNodes[i + projectedNodes.length/2]; // Strand 1 needs to find matching index
            // Actually, my generation loop order is 0..14 then 15..29.
            // So corresponding node on strand 1 is i + nodesPerStrand.
            // Wait, let's just loop half the array size
        }

        const nodesPerStrand = 15;
        for (let i = 0; i < nodesPerStrand; i++) {
            const nodeA = projectedNodes[i];
            const nodeB = projectedNodes[i + nodesPerStrand];
            
            if (nodeA.z > -100 && nodeB.z > -100) { // simple culling
                const alpha = Math.min(nodeA.scale, nodeB.scale) * 0.3 * this.animationProgress;
                this.ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                this.ctx.beginPath();
                this.ctx.moveTo(nodeA.x, nodeA.y);
                this.ctx.lineTo(nodeB.x, nodeB.y);
                this.ctx.stroke();
            }
        }
        
        // Draw Nodes
        projectedNodes.forEach(node => {
            const alpha = node.scale * 0.8 * this.animationProgress;
            this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, 3 * node.scale, 0, Math.PI*2);
            this.ctx.fill();
        });

        // Draw "Psychometric Particles" (The 47 Dimensions) surrounding the helix
        this.particles.forEach(p => {
             // Rotate particles too
            const x = p.x * Math.cos(this.rotation * 0.5) - p.z * Math.sin(this.rotation * 0.5);
            const z = p.x * Math.sin(this.rotation * 0.5) + p.z * Math.cos(this.rotation * 0.5);
            const scale = 300 / (300 + z);
            
            if (z < 200 && z > -200) {
                 this.ctx.fillStyle = `rgba(255, 255, 255, ${scale * 0.4})`;
                 this.ctx.beginPath();
                 this.ctx.arc(x * scale, p.y * scale, p.size * scale, 0, Math.PI*2);
                 this.ctx.fill();
            }
        });

        this.ctx.restore();
    }
    
    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Isometric Logic Grid Visualization
class AssetVisualization {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.isVisible = false;
        this.gridSize = 40;
        this.rotation = 0.8; // Isometric angle
        this.blocks = [];
        this.packets = []; // Data packets moving
        this.scanLine = -200;
        
        this.resize();
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.isVisible = true;
                }
            });
        }, { threshold: 0.3 });
        
        this.observer.observe(canvas.parentElement);
    }
    
    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
    }
    
    init() {
        // Create random "buildings" or logic blocks
        for(let x = -3; x <= 3; x++) {
            for(let y = -3; y <= 3; y++) {
                if (Math.random() > 0.4) {
                    const height = Math.random() * 80 + 20;
                    this.blocks.push({
                        x: x * this.gridSize,
                        y: y * this.gridSize,
                        w: this.gridSize * 0.8,
                        h: this.gridSize * 0.8,
                        z: height,
                        currentZ: 0,
                        delay: Math.sqrt(x*x + y*y) * 10 
                    });
                }
            }
        }
    }
    
    toIso(x, y, z) {
        // Simple isometric projection
        const isoX = (x - y) * Math.cos(0.5236); // 30 degrees
        const isoY = (x + y) * Math.sin(0.5236) - z; 
        return { x: this.centerX + isoX, y: this.centerY + isoY + 100 }; // +100 to push down
    }
    
    update() {
        if (!this.isVisible) return;
        
        this.scanLine += 2;
        if(this.scanLine > 300) this.scanLine = -300;

        // Grow buildings
        this.blocks.forEach(b => {
            // Logic: if scanline passes, grow
            // Simplified: just grow based on visibility
            b.currentZ += (b.z - b.currentZ) * 0.05;
        });
        
        // Spawn packets randomly
        if (Math.random() < 0.05) {
            this.packets.push({
                x: (Math.floor(Math.random()*7)-3) * this.gridSize,
                y: (Math.floor(Math.random()*7)-3) * this.gridSize,
                z: 0,
                targetZ: 100, // go up
                progress: 0
            });
        }
        
        this.packets.forEach((p, i) => {
             p.progress += 0.05;
             if(p.progress > 1) this.packets.splice(i, 1);
        });
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (!this.isVisible) return;
        
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        
        // Draw Grid Floor
        const range = 4;
        for(let i = -range; i <= range; i++) {
            const startX = this.toIso(i * this.gridSize, -range * this.gridSize, 0);
            const endX = this.toIso(i * this.gridSize, range * this.gridSize, 0);
            this.ctx.beginPath();
            this.ctx.moveTo(startX.x, startX.y);
            this.ctx.lineTo(endX.x, endX.y);
            this.ctx.stroke();
            
            const startY = this.toIso(-range * this.gridSize, i * this.gridSize, 0);
            const endY = this.toIso(range * this.gridSize, i * this.gridSize, 0);
            this.ctx.beginPath();
            this.ctx.moveTo(startY.x, startY.y);
            this.ctx.lineTo(endY.x, endY.y);
            this.ctx.stroke();
        }
        
        // Draw Blocks
        this.blocks.sort((a,b) => (a.y - a.x) - (b.y - b.x)); // z-sortish for iso
        
        this.blocks.forEach(b => {
             if (b.currentZ < 1) return;
             
             const bottom = 0;
             const top = b.currentZ;
             
             // Corners
             const c1 = this.toIso(b.x - b.w/2, b.y - b.h/2, top);
             const c2 = this.toIso(b.x + b.w/2, b.y - b.h/2, top);
             const c3 = this.toIso(b.x + b.w/2, b.y + b.h/2, top);
             const c4 = this.toIso(b.x - b.w/2, b.y + b.h/2, top);
             
             const b1 = this.toIso(b.x - b.w/2, b.y - b.h/2, bottom);
             const b2 = this.toIso(b.x + b.w/2, b.y - b.h/2, bottom);
             const b3 = this.toIso(b.x + b.w/2, b.y + b.h/2, bottom);
             const b4 = this.toIso(b.x - b.w/2, b.y + b.h/2, bottom);
             
             // Draw Pillars
             this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
             this.ctx.beginPath();
             this.ctx.moveTo(b1.x, b1.y); this.ctx.lineTo(c1.x, c1.y);
             this.ctx.moveTo(b2.x, b2.y); this.ctx.lineTo(c2.x, c2.y);
             this.ctx.moveTo(b3.x, b3.y); this.ctx.lineTo(c3.x, c3.y);
             this.ctx.moveTo(b4.x, b4.y); this.ctx.lineTo(c4.x, c4.y);
             this.ctx.stroke();
             
             // Draw Top
             this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
             this.ctx.beginPath();
             this.ctx.moveTo(c1.x, c1.y);
             this.ctx.lineTo(c2.x, c2.y);
             this.ctx.lineTo(c3.x, c3.y);
             this.ctx.lineTo(c4.x, c4.y);
             this.ctx.closePath();
             this.ctx.fill();
             this.ctx.stroke();
        });
        
        // Draw Packets (little logic sparks)
        this.packets.forEach(p => {
             const z = p.targetZ * p.progress;
             const pos = this.toIso(p.x, p.y, z);
             this.ctx.fillStyle = '#ffffff';
             this.ctx.beginPath();
             this.ctx.arc(pos.x, pos.y, 2, 0, Math.PI*2);
             this.ctx.fill();
        });
    }
    
    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Scroll animations for stack layers
function initScrollAnimations() {
    const stackLayers = document.querySelectorAll('.stack-layer');
    const sectionTitles = document.querySelectorAll('.section-title');
    const featureItems = document.querySelectorAll('.feature-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });

    // Observe stack layers
    stackLayers.forEach(layer => {
        observer.observe(layer);
    });

    // Animate section titles with underline
    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, { threshold: 0.5 });

    sectionTitles.forEach(title => {
        titleObserver.observe(title);
    });

    // Stagger feature items
    featureItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `all 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${index * 0.15}s`;
    });

    const featureObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.2 });

    featureItems.forEach(item => {
        featureObserver.observe(item);
    });
}

// Smooth scroll for buttons
function initSmoothScroll() {
    const exploreBtn = document.querySelector('.btn-primary');
    const deploymentsBtn = document.querySelector('.btn-secondary');
    
    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            document.querySelector('.architecture').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    if (deploymentsBtn) {
        deploymentsBtn.addEventListener('click', () => {
            document.querySelector('.deployment-human').scrollIntoView({ behavior: 'smooth' });
        });
    }
}

// Contact button handler
function initContactButton() {
    const contactBtn = document.getElementById('contactBtn');
    if (contactBtn) {
        contactBtn.addEventListener('click', () => {
            window.location.href = 'mailto:engineering@kurve.ai?subject=Kurve Inquiry';
        });
    }
}

// Parallax scrolling effect
function initParallax() {
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;

        if (heroContent && scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.8;
        }
    });
}

// Add loading animation
function initLoadingAnimation() {
    document.body.style.opacity = '0';
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.8s ease';
            document.body.style.opacity = '1';
        }, 100);
    });
}

// Custom cursor
function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth cursor follow
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effect on interactive elements
    const interactiveElements = document.querySelectorAll('button, a, .feature-item, .deployment-outcome');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}

// Scroll progress indicator
function initScrollIndicator() {
    const indicator = document.createElement('div');
    indicator.classList.add('scroll-indicator');
    document.body.appendChild(indicator);

    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        indicator.style.width = scrolled + '%';
    });
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize loading animation
    initLoadingAnimation();

    // Initialize custom cursor
    initCustomCursor();

    // Initialize scroll indicator
    initScrollIndicator();

    // Initialize network graph
    const networkCanvas = document.getElementById('networkCanvas');
    if (networkCanvas) {
        new NetworkGraph(networkCanvas);
    }

    // Initialize human visualization
    const humanCanvas = document.getElementById('humanVisualization');
    if (humanCanvas) {
        new HumanVisualization(humanCanvas);
    }

    // Initialize asset visualization
    const assetCanvas = document.getElementById('assetVisualization');
    if (assetCanvas) {
        new AssetVisualization(assetCanvas);
    }

    // Initialize scroll animations
    initScrollAnimations();

    // Initialize smooth scroll
    initSmoothScroll();

    // Initialize contact button
    initContactButton();

    // Initialize parallax
    initParallax();
});

