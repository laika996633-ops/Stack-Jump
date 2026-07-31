/**
 * powerups.js – Active power-ups during a run
 */
export class PowerupManager {
  constructor() {
    this.active = {};
    this.spawnTimer = 0;
  }

  reset() {
    this.active = {};
    this.spawnTimer = 0;
  }

  activate(type, duration = 8) {
    this.active[type] = duration;
  }

  has(type) {
    return (this.active[type] || 0) > 0;
  }

  update(dt) {
    for (const k of Object.keys(this.active)) {
      this.active[k] -= dt;
      if (this.active[k] <= 0) delete this.active[k];
    }
  }

  // visual indicator
  draw(ctx, w) {
    let y = 80;
    for (const [type, time] of Object.entries(this.active)) {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(w - 110, y, 100, 22);
      ctx.fillStyle = '#fff';
      ctx.font = '12px system-ui';
      ctx.textAlign = 'left';
      ctx.fillText(`${type.toUpperCase()} ${time.toFixed(1)}s`, w - 105, y + 15);
      y += 26;
    }
  }
}
