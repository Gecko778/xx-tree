import { useRef, useEffect, useCallback } from 'react';
import { BRANCH_COLORS } from '../data/mockData';

/**
 * NodeParticleOverlay — Canvas layer rendered on top of the SVG tree.
 * Draws tiny energy particles drifting around revealed nodes.
 * Receives the current D3 zoom transform to stay in sync.
 */
export default function NodeParticleOverlay({ nodes, revealedNodeIds, zoomTransform }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef([]);

  // Spawn particles for newly-revealed nodes
  const spawnForNode = useCallback((node) => {
    const branchColor = BRANCH_COLORS[node.branch] || '#4a9eff';
    const r = parseInt(branchColor.slice(1, 3), 16) || 100;
    const g = parseInt(branchColor.slice(3, 5), 16) || 160;
    const b = parseInt(branchColor.slice(5, 7), 16) || 255;

    const count = node.depth === 0 ? 18 : node.depth === 1 ? 10 : 5;
    const newParticles = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.15 + Math.random() * 0.4;
      const orbitRadius = 12 + Math.random() * 25;
      newParticles.push({
        nodeId: node.id,
        nx: node.x,
        ny: node.y,
        angle,
        orbitRadius,
        orbitSpeed: (0.003 + Math.random() * 0.008) * (Math.random() > 0.5 ? 1 : -1),
        radius: 0.6 + Math.random() * 1.2,
        r, g, b,
        opacity: 0.3 + Math.random() * 0.5,
        life: 1.0,
        decay: 0.0001 + Math.random() * 0.00015,
        driftX: (Math.random() - 0.5) * 0.03,
        driftY: (Math.random() - 0.5) * 0.03,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.02 + Math.random() * 0.04,
      });
    }
    return newParticles;
  }, []);

  // Track which nodes have had particles spawned
  const spawnedRef = useRef(new Set());

  useEffect(() => {
    if (!nodes.length) return;
    const newParticles = [];
    revealedNodeIds.forEach(id => {
      if (!spawnedRef.current.has(id)) {
        spawnedRef.current.add(id);
        const node = nodes.find(n => n.id === id);
        if (node) newParticles.push(...spawnForNode(node));
      }
    });
    if (newParticles.length) {
      particlesRef.current = [...particlesRef.current, ...newParticles];
    }
  }, [nodes, revealedNodeIds, spawnForNode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const animate = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const t = zoomTransform || { x: 0, y: 0, k: 1 };
      const particles = particlesRef.current;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Update orbit
        p.angle += p.orbitSpeed;
        p.orbitRadius += p.driftX;

        // Calculate world position
        const wx = p.nx + Math.cos(p.angle) * p.orbitRadius;
        const wy = p.ny + Math.sin(p.angle) * p.orbitRadius;

        // Apply zoom transform to get screen position
        const sx = wx * t.k + t.x;
        const sy = wy * t.k + t.y;

        // Fade
        p.life -= p.decay;
        if (p.life <= 0) {
          // Respawn
          p.life = 0.8 + Math.random() * 0.2;
          p.angle = Math.random() * Math.PI * 2;
          p.orbitRadius = 12 + Math.random() * 25;
          continue;
        }

        const twinkle = Math.sin(time * p.twinkleSpeed + p.twinklePhase);
        const alpha = p.opacity * p.life * (0.7 + twinkle * 0.3);

        if (sx < -20 || sx > canvas.width + 20 || sy < -20 || sy > canvas.height + 20) continue;

        const drawRadius = Math.max(0.3, p.radius * t.k);

        // Glow
        ctx.beginPath();
        ctx.arc(sx, sy, drawRadius * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${Math.max(0, alpha * 0.15)})`;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(sx, sy, drawRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${Math.max(0, alpha)})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [zoomTransform]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 2,
      }}
    />
  );
}
