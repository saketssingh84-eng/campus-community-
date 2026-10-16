/**
 * ====================================================================
 * Tech Mesh Connected Nodes — Interactive Background Canvas
 * Features:
 *   - Floating tech nodes connected by proximity lines (constellation)
 *   - Interactive repulsion: dots smoothly move away as cursor approaches
 *   - Cosmic celestial stars for depth (inspired by space aesthetic)
 *   - Auto-responsive with High-DPI support & performance optimizations
 * ====================================================================
 */

(function () {
  'use strict';

  // Prevent duplicate initialization
  if (window.__techMeshInitialized) return;
  window.__techMeshInitialized = true;

  function initTechMesh() {
    // 1. Locate or create canvas
    let canvas = document.getElementById('tech-mesh-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'tech-mesh-canvas';
      document.body.prepend(canvas);
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas styling fallback
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';

    let width = 0;
    let height = 0;
    let dpr = 1;

    // Mouse state
    const mouse = {
      x: -9999,
      y: -9999,
      targetX: -9999,
      targetY: -9999,
      radius: 155,       // Repulsion interaction distance (px)
      isActive: false
    };

    let nodes = [];
    let stars = [];
    let animationFrameId = null;
    let isTabVisible = true;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Node colors: cyan, purple, electric blue, soft white
    const COLOR_PALETTES = [
      { rgb: '0, 212, 255', weight: 0.45 },   // Cyan
      { rgb: '168, 85, 247', weight: 0.30 },  // Purple
      { rgb: '96, 165, 250', weight: 0.15 },  // Electric Blue
      { rgb: '241, 245, 249', weight: 0.10 }  // Starlight White
    ];

    function pickColor() {
      const rand = Math.random();
      let cumulative = 0;
      for (const p of COLOR_PALETTES) {
        cumulative += p.weight;
        if (rand <= cumulative) return p.rgb;
      }
      return '0, 212, 255';
    }

    // Tech Mesh Node Class
    class TechNode {
      constructor(w, h) {
        this.reset(w, h, true);
      }

      reset(w, h, initial = false) {
        this.x = initial ? Math.random() * w : (Math.random() < 0.5 ? -10 : w + 10);
        this.y = initial ? Math.random() * h : Math.random() * h;

        // Gentle floating speed
        const speed = prefersReducedMotion ? 0.1 : (0.28 + Math.random() * 0.42);
        const angle = Math.random() * Math.PI * 2;
        this.baseVx = Math.cos(angle) * speed;
        this.baseVy = Math.sin(angle) * speed;

        // Current velocity (natural + repulsion inertia)
        this.vx = this.baseVx;
        this.vy = this.baseVy;
        this.repelVx = 0;
        this.repelVy = 0;

        this.rgb = pickColor();
        this.isSpecialStar = this.rgb === '241, 245, 249';

        if (this.isSpecialStar) {
          this.radius = 2.4 + Math.random() * 1.2;
          this.hasGlow = true;
          this.baseAlpha = 0.75 + Math.random() * 0.25;
        } else {
          this.radius = 1.4 + Math.random() * 1.1;
          this.hasGlow = Math.random() < 0.25;
          this.baseAlpha = 0.45 + Math.random() * 0.4;
        }

        this.pulsePhase = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.02 + Math.random() * 0.025;
      }

      update(w, h) {
        // 1. Interactive Repulsion: when mouse goes toward dots, dots move away
        if (mouse.isActive) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            // Unit vector pointing AWAY from cursor
            let nx = 0, ny = 0;
            if (dist > 0.1) {
              nx = dx / dist;
              ny = dy / dist;
            } else {
              const randAngle = Math.random() * Math.PI * 2;
              nx = Math.cos(randAngle);
              ny = Math.sin(randAngle);
            }

            // Normalized proximity (1 at cursor center, 0 at boundary)
            const proximity = (mouse.radius - dist) / mouse.radius;
            // Smooth non-linear curve for fluid repulsion
            const force = Math.pow(proximity, 1.8) * 6.8;

            // Push dot position immediately away
            this.x += nx * force;
            this.y += ny * force;

            // Impart repulsion momentum
            this.repelVx += nx * proximity * 1.6;
            this.repelVy += ny * proximity * 1.6;
          }
        }

        // 2. Smoothly decay repulsion momentum
        this.repelVx *= 0.92;
        this.repelVy *= 0.92;

        // 3. Move particle with natural drift + remaining repulsion
        this.x += this.baseVx + this.repelVx;
        this.y += this.baseVy + this.repelVy;

        // 4. Wrap around edges smoothly
        const pad = 24;
        if (this.x < -pad) this.x = w + pad;
        if (this.x > w + pad) this.x = -pad;
        if (this.y < -pad) this.y = h + pad;
        if (this.y > h + pad) this.y = -pad;

        // 5. Breathing pulse
        this.pulsePhase += this.pulseSpeed;
      }

      draw(context) {
        const pulse = Math.sin(this.pulsePhase);
        const currentRadius = Math.max(0.7, this.radius + pulse * 0.35);
        const currentAlpha = Math.min(1, Math.max(0.15, this.baseAlpha + pulse * 0.2));

        // Outer glow halo for special/key nodes
        if (this.hasGlow) {
          const glowRadius = currentRadius * 3.6;
          const glow = context.createRadialGradient(this.x, this.y, 0, this.x, this.y, glowRadius);
          glow.addColorStop(0, `rgba(${this.rgb}, ${currentAlpha * 0.85})`);
          glow.addColorStop(0.35, `rgba(${this.rgb}, ${currentAlpha * 0.25})`);
          glow.addColorStop(1, 'transparent');

          context.fillStyle = glow;
          context.beginPath();
          context.arc(this.x, this.y, glowRadius, 0, Math.PI * 2);
          context.fill();
        }

        // Inner solid core
        context.beginPath();
        context.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
        context.fillStyle = `rgba(${this.rgb}, ${currentAlpha})`;
        context.fill();
      }
    }

    // Background Micro Cosmic Stars (depth layer from space reference)
    class CosmicStar {
      constructor(w, h) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.radius = 0.5 + Math.random() * 0.8;
        this.baseAlpha = 0.15 + Math.random() * 0.45;
        this.phase = Math.random() * Math.PI * 2;
        this.twinkleSpeed = 0.012 + Math.random() * 0.02;
      }

      draw(context) {
        this.phase += this.twinkleSpeed;
        const alpha = Math.max(0.06, this.baseAlpha + Math.sin(this.phase) * 0.2);
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(226, 232, 255, ${alpha})`;
        context.fill();
      }
    }

    // Resize handler
    function handleResize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Node count proportional to screen area
      // ~85 on 1080p, ~40 on mobile
      const targetCount = Math.min(115, Math.max(35, Math.floor((width * height) / 15500)));
      nodes = [];
      for (let i = 0; i < targetCount; i++) {
        nodes.push(new TechNode(width, height));
      }

      // 45 cosmic background stars
      stars = [];
      for (let i = 0; i < 45; i++) {
        stars.push(new CosmicStar(width, height));
      }
    }

    // Mouse tracking on entire window (retains reactivity even over cards/sidebar)
    window.addEventListener('mousemove', (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.isActive = true;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      mouse.isActive = false;
    });

    // Touch events for mobile screens
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches.length > 0) {
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
        mouse.isActive = true;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      mouse.isActive = false;
    });

    window.addEventListener('resize', handleResize);

    // Tab visibility handling (saves CPU/battery when in other tabs)
    document.addEventListener('visibilitychange', () => {
      isTabVisible = !document.hidden;
      if (isTabVisible && !animationFrameId) {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(animate);
      }
    });

    handleResize();

    let lastTime = performance.now();
    const MAX_LINE_DIST = 135; // Maximum distance to draw connecting line

    // Main animation loop
    function animate(currentTime) {
      if (!isTabVisible) {
        animationFrameId = null;
        return;
      }

      // Smooth cursor lerp
      if (mouse.isActive) {
        if (mouse.x === -9999) {
          mouse.x = mouse.targetX;
          mouse.y = mouse.targetY;
        } else {
          mouse.x += (mouse.targetX - mouse.x) * 0.35;
          mouse.y += (mouse.targetY - mouse.y) * 0.35;
        }
      } else {
        mouse.x = -9999;
        mouse.y = -9999;
      }

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Layer 1: Distant Cosmic Stars
      for (let i = 0; i < stars.length; i++) {
        stars[i].draw(ctx);
      }

      // Layer 2: Interactive Mouse Repulsion Aura (subtle force field)
      if (mouse.isActive && mouse.x > 0) {
        const aura = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, mouse.radius);
        aura.addColorStop(0, 'rgba(0, 212, 255, 0.045)');
        aura.addColorStop(0.55, 'rgba(168, 85, 247, 0.025)');
        aura.addColorStop(1, 'transparent');
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Layer 3: Update node positions
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].update(width, height);
      }

      // Layer 4: Draw Connecting Tech Mesh Lines
      const nodeCount = nodes.length;
      for (let i = 0; i < nodeCount; i++) {
        const n1 = nodes[i];
        for (let j = i + 1; j < nodeCount; j++) {
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < MAX_LINE_DIST) {
            // Opacity scales linearly with proximity
            const proximity = 1 - dist / MAX_LINE_DIST;
            const alpha = proximity * 0.28;

            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);

            // Tech line gradient blending the two connected node colors
            const grad = ctx.createLinearGradient(n1.x, n1.y, n2.x, n2.y);
            grad.addColorStop(0, `rgba(${n1.rgb}, ${alpha * 1.15})`);
            grad.addColorStop(1, `rgba(${n2.rgb}, ${alpha * 1.15})`);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }
      }

      // Layer 5: Draw Nodes
      for (let i = 0; i < nodeCount; i++) {
        nodes[i].draw(ctx);
      }

      animationFrameId = requestAnimationFrame(animate);
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTechMesh);
  } else {
    initTechMesh();
  }
})();
