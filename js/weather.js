/**
 * weather.js – Procedural weather particles
 */
export class Weather {
  constructor() {
    this.type = 'sunny';
    this.particles = [];
    this.timer = 0;
    this.changeInterval = 45; // seconds
  }

  setRandom() {
    const types = ['sunny', 'rain', 'snow', 'fog', 'sakura', 'meteor', 'wind'];
    this.type = types[Math.floor(Math.random() * types.length)];
    this.particles = [];
  }

  update(dt, w, h) {
    this.timer += dt;
    if (this.timer > this.changeInterval) {
      this.timer = 0;
      this.setRandom();
    }

    // spawn
    if (this.type === 'rain' && Math.random() < 0.4) {
      this.particles.push({ x: Math.random()*w, y: -10, vx: -1, vy: 12 + Math.random()*6, life: 1, type: 'rain' });
    }
    if (this.type === 'snow' && Math.random() < 0.25) {
      this.particles.push({ x: Math.random()*w, y: -5, vx: (Math.random()-0.5)*1.5, vy: 1.5+Math.random()*2, life: 1, type: 'snow', size: 2+Math.random()*3 });
    }
    if (this.type === 'sakura' && Math.random() < 0.15) {
      this.particles.push({ x: Math.random()*w, y: -5, vx: (Math.random()-0.5)*2, vy: 1+Math.random()*2, life: 1, type: 'sakura', rot: Math.random()*Math.PI*2 });
    }
    if (this.type === 'meteor' && Math.random() < 0.02) {
      this.particles.push({ x: Math.random()*w, y: -20, vx: 3+Math.random()*4, vy: 8+Math.random()*6, life: 1, type: 'meteor' });
    }

    // update
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt * 60;
      p.y += p.vy * dt * 60;
      p.life -= dt * 0.3;
      if (p.y > h + 20 || p.life <= 0) this.particles.splice(i, 1);
    }
  }

  draw(ctx, w, h) {
    if (this.type === 'fog') {
      ctx.fillStyle = 'rgba(200,200,220,0.15)';
      ctx.fillRect(0, 0, w, h);
    }
    for (const p of this.particles) {
      ctx.save();
      if (p.type === 'rain') {
        ctx.strokeStyle = 'rgba(150,200,255,0.6)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.vx*2, p.y + p.vy*2);
        ctx.stroke();
      } else if (p.type === 'snow') {
        ctx.fillStyle = `rgba(255,255,255,${p.life})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
        ctx.fill();
      } else if (p.type === 'sakura') {
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = `rgba(255,180,200,${p.life})`;
        ctx.beginPath();
        ctx.ellipse(0, 0, 4, 2, 0, 0, Math.PI*2);
        ctx.fill();
      } else if (p.type === 'meteor') {
        const grad = ctx.createLinearGradient(p.x, p.y, p.x - p.vx*8, p.y - p.vy*8);
        grad.addColorStop(0, 'rgba(255,255,200,0.9)');
        grad.addColorStop(1, 'rgba(255,100,0,0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx*8, p.y - p.vy*8);
        ctx.stroke();
      }
      ctx.restore();
    }
  }
}
