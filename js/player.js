/**
 * player.js – Cube character with animations, physics, trails
 */
import { CHARACTERS } from './characters.js';

export class Player {
  constructor(game) {
    this.game = game;
    this.size = 36;
    this.reset();
  }

  reset() {
    this.x = 0;
    this.y = 0;
    this.vy = 0;
    this.onGround = false;
    this.jumping = false;
    this.falling = false;
    this.rot = 0;
    this.squash = 1;
    this.squashTarget = 1;
    this.trail = [];
    this.combo = 0;
    this.perfects = 0;
    this.alive = true;
    this.currentPlatform = null;
  }

  setCharacter(id) {
    this.char = CHARACTERS[id] || CHARACTERS.cube;
  }

  jump(force = -11.5) {
    if (!this.onGround || !this.alive) return;
    this.vy = force;
    this.onGround = false;
    this.jumping = true;
    this.falling = false;
    this.currentPlatform = null;
    this.game.audio.jump();
    if (this.game.storage.get('vibration') && navigator.vibrate) {
      navigator.vibrate(15);
    }
  }

  update(dt, platforms) {
    if (!this.alive) return;

    // gravity
    this.vy += 28 * dt;
    this.y += this.vy * dt * 60;

    // rotation while in air
    if (!this.onGround) {
      this.rot += this.vy * 0.015;
    }

    // squash recovery
    this.squash += (this.squashTarget - this.squash) * 0.2;

    // trail for high combos
    if (this.combo >= 5) {
      this.trail.push({ x: this.x, y: this.y, life: 0.4 });
      if (this.trail.length > 12) this.trail.shift();
    }
    for (let i = this.trail.length-1; i >= 0; i--) {
      this.trail[i].life -= dt;
      if (this.trail[i].life <= 0) this.trail.splice(i, 1);
    }

    // collision with platforms
    this.onGround = false;
    for (const p of platforms) {
      if (!p.active) continue;
      const b = p.getBounds();
      if (this.vy > 0 &&
          this.x + this.size/2 > b.left + 4 &&
          this.x - this.size/2 < b.right - 4 &&
          this.y + this.size/2 > b.top &&
          this.y + this.size/2 < b.top + 22 &&
          this.y - this.vy * dt * 60 < b.top + 5) {

        this.y = b.top - this.size/2;
        this.vy = 0;
        this.onGround = true;
        this.jumping = false;
        this.rot = 0;
        this.squash = 0.6;
        this.squashTarget = 1;
        this.currentPlatform = p;
        p.passed = true;

        // bounce special
        if (p.special === 'bounce') {
          this.vy = -14;
          this.onGround = false;
        }

        this.game.onLand(p);
        break;
      }
    }

    // fall death
    if (this.y > this.game.height + 80) {
      this.alive = false;
      this.game.onGameOver();
    }
  }

  draw(ctx) {
    // trail
    for (const t of this.trail) {
      ctx.globalAlpha = t.life * 0.5;
      const color = this.combo >= 20 ? '#ff5722' : this.combo >= 10 ? '#e040fb' : '#ffeb3b';
      ctx.fillStyle = color;
      ctx.fillRect(t.x - this.size/3, t.y - this.size/3, this.size*0.66, this.size*0.66);
    }
    ctx.globalAlpha = 1;

    // shadow
    if (this.onGround || this.y < this.game.height) {
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.beginPath();
      ctx.ellipse(this.x, this.y + this.size/2 + 4, this.size*0.45, 6, 0, 0, Math.PI*2);
      ctx.fill();
    }

    this.char.draw(ctx, this.x, this.y, this.size, this.rot, this.squash);
  }
}
