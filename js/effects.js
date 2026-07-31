/**
 * effects.js – Particles, camera shake, floating text, trails
 */
export class Effects {
  constructor() {
    this.particles = [];
    this.floatTexts = [];
    this.shake = { x: 0, y: 0, time: 0, intensity: 0 };
    this.trails = [];
  }

  // Object pool helpers
  spawnParticle(x, y, opts = {}) {
    this.particles.push({
      x, y,
      vx: opts.vx || (Math.random()-0.5)*4,
      vy: opts.vy || (Math.random()-0.5)*4 - 2,
      life: opts.life || 0.6,
      maxLife: opts.life || 0.6,
      size: opts.size || 3 + Math.random()*4,
      color: opts.color || '#fff',
      gravity: opts.gravity !== undefined ? opts.gravity : 0.15
    });
  }

  landDust(x, y) {
    for (let i = 0; i < 12; i++) {
      this.spawnParticle(x, y, {
        vx: (Math.random()-0.5)*6,
        vy: -Math.random()*3,
        color: `hsl(${30+Math.random()*20},70%,60%)`,
        size: 2 + Math.random()*3,
        life: 0.4 + Math.random()*0.3
      });
    }
  }

  perfectFlash(x, y) {
    for (let i = 0; i < 20; i++) {
      const a = (i / 20) * Math.PI * 2;
      this.spawnParticle(x, y, {
        vx: Math.cos(a)*6,
        vy: Math.sin(a)*6,
        color: '#ffeb3b',
        size: 4,
        life: 0.5,
        gravity: 0
      });
    }
  }

  coinBurst(x, y) {
    for (let i = 0; i < 10; i++) {
      this.spawnParticle(x, y, {
        vx: (Math.random()-0.5)*5,
        vy: -2 - Math.random()*4,
        color: '#ffd700',
        size: 3,
        life: 0.7
      });
    }
  }

  addFloatText(text, x, y, color = '#fff') {
    this.floatTexts.push({ text, x, y, life: 1, color });
  }

  shakeCamera(intensity = 8, duration = 0.25) {
    this.shake.intensity = intensity;
    this.shake.time = duration;
  }

  update(dt) {
    // particles
    for (let i = this.particles.length-1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.life -= dt;
      if (p.life <= 0) this.particles.splice(i, 1);
    }
    // float texts
    for (let i = this.floatTexts.length-1; i >= 0; i--) {
      const t = this.floatTexts[i];
      t.y -= 40 * dt;
      t.life -= dt;
      if (t.life <= 0) this.floatTexts.splice(i, 1);
    }
    // shake
    if (this.shake.time > 0) {
      this.shake.time -= dt;
      this.shake.x = (Math.random()-0.5) * this.shake.intensity * (this.shake.time / 0.25);
      this.shake.y = (Math.random()-0.5) * this.shake.intensity * (this.shake.time / 0.25);
    } else {
      this.shake.x = this.shake.y = 0;
    }
  }

  draw(ctx) {
    for (const p of this.particles) {
      ctx.globalAlpha = p.life / p.maxLife;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    for (const t of this.floatTexts) {
      ctx.globalAlpha = t.life;
      ctx.fillStyle = t.color;
      ctx.font = 'bold 22px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(t.text, t.x, t.y);
    }
    ctx.globalAlpha = 1;
  }
}
