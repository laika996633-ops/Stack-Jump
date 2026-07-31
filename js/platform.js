/**
 * platform.js – Moving platforms with materials, sizes, special behaviors
 */
const SIZES = {
  large: 140,
  medium: 100,
  small: 70,
  tiny: 45
};

const MATERIALS = ['grass', 'wood', 'stone', 'ice', 'neon'];

export class Platform {
  constructor(pool) {
    this.pool = pool;
    this.reset();
  }

  reset() {
    this.active = false;
    this.x = 0;
    this.y = 0;
    this.width = 100;
    this.height = 18;
    this.vx = 0;
    this.dir = 1;
    this.material = 'grass';
    this.sizeKey = 'medium';
    this.special = null; // 'disappear', 'bounce', 'slide', 'rotate', 'moving'
    this.life = 1;
    this.rot = 0;
    this.bounceForce = 0;
    this.alpha = 1;
    this.passed = false;
  }

  spawn(y, dir, speed, themeColors) {
    this.reset();
    this.active = true;
    this.y = y;
    this.dir = dir;
    this.vx = dir * speed;
    this.sizeKey = this.randomSize();
    this.width = SIZES[this.sizeKey];
    this.material = MATERIALS[Math.floor(Math.random() * MATERIALS.length)];
    this.x = dir > 0 ? -this.width - 20 : (this.pool.gameWidth + 20);
    this.colors = themeColors || { grass: '#4caf50', wood: '#8d6e63', stone: '#78909c' };

    // special behaviors
    const r = Math.random();
    if (r < 0.12) this.special = 'disappear';
    else if (r < 0.2) this.special = 'bounce';
    else if (r < 0.28) this.special = 'slide';
    else if (r < 0.33) this.special = 'rotate';
  }

  randomSize() {
    const r = Math.random();
    if (r < 0.15) return 'tiny';
    if (r < 0.4) return 'small';
    if (r < 0.75) return 'medium';
    return 'large';
  }

  update(dt, gameWidth) {
    if (!this.active) return;
    this.x += this.vx * dt * 60;

    if (this.special === 'slide') {
      this.vx *= 0.995;
    }
    if (this.special === 'rotate') {
      this.rot += 0.03 * this.dir;
    }
    if (this.special === 'disappear' && this.passed) {
      this.alpha -= dt * 1.5;
      if (this.alpha <= 0) this.active = false;
    }

    // off screen
    if ((this.dir > 0 && this.x > gameWidth + 50) ||
        (this.dir < 0 && this.x < -this.width - 50)) {
      this.active = false;
    }
  }

  draw(ctx) {
    if (!this.active) return;
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.translate(this.x + this.width/2, this.y + this.height/2);
    ctx.rotate(this.rot);

    const color = this.colors[this.material] || this.colors.grass || '#4caf50';
    ctx.fillStyle = color;
    ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);

    // material details
    if (this.material === 'wood') {
      ctx.strokeStyle = 'rgba(0,0,0,0.25)';
      ctx.lineWidth = 1;
      for (let i = -this.width/2 + 10; i < this.width/2; i += 15) {
        ctx.beginPath();
        ctx.moveTo(i, -this.height/2);
        ctx.lineTo(i, this.height/2);
        ctx.stroke();
      }
    } else if (this.material === 'ice') {
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height/3);
    } else if (this.material === 'neon') {
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.strokeRect(-this.width/2, -this.height/2, this.width, this.height);
      ctx.shadowBlur = 0;
    }

    // top highlight
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fillRect(-this.width/2, -this.height/2, this.width, 4);

    ctx.restore();
    ctx.globalAlpha = 1;
  }

  getBounds() {
    return {
      left: this.x,
      right: this.x + this.width,
      top: this.y,
      bottom: this.y + this.height
    };
  }
}

export class PlatformPool {
  constructor(gameWidth) {
    this.gameWidth = gameWidth;
    this.pool = [];
    this.active = [];
    for (let i = 0; i < 20; i++) this.pool.push(new Platform(this));
  }

  get() {
    let p = this.pool.find(p => !p.active);
    if (!p) {
      p = new Platform(this);
      this.pool.push(p);
    }
    return p;
  }

  update(dt) {
    this.active = this.pool.filter(p => p.active);
    for (const p of this.active) p.update(dt, this.gameWidth);
  }

  draw(ctx) {
    for (const p of this.active) p.draw(ctx);
  }
}
