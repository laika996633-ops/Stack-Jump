/**
 * characters.js – All playable characters + unlock costs
 */
export const CHARACTERS = {
  cube: {
    id: 'cube',
    name: 'Cube',
    cost: 0,
    color: '#4fc3f7',
    accent: '#0288d1',
    draw(ctx, x, y, size, rot, squash) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.scale(1, squash);
      ctx.fillStyle = this.color;
      ctx.fillRect(-size/2, -size/2, size, size);
      ctx.strokeStyle = this.accent;
      ctx.lineWidth = 2;
      ctx.strokeRect(-size/2, -size/2, size, size);
      // eyes
      ctx.fillStyle = '#fff';
      ctx.fillRect(-size*0.25, -size*0.2, size*0.15, size*0.15);
      ctx.fillRect(size*0.1, -size*0.2, size*0.15, size*0.15);
      ctx.restore();
    }
  },
  robot: {
    id: 'robot',
    name: 'Robot',
    cost: 150,
    color: '#90a4ae',
    accent: '#546e7a',
    draw(ctx, x, y, size, rot, squash) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.scale(1, squash);
      ctx.fillStyle = this.color;
      ctx.fillRect(-size/2, -size/2, size, size);
      ctx.fillStyle = '#263238';
      ctx.fillRect(-size*0.3, -size*0.15, size*0.2, size*0.12);
      ctx.fillRect(size*0.1, -size*0.15, size*0.2, size*0.12);
      ctx.fillStyle = '#ff5252';
      ctx.beginPath();
      ctx.arc(0, size*0.15, size*0.1, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
    }
  },
  ninja: {
    id: 'ninja',
    name: 'Ninja',
    cost: 250,
    color: '#212121',
    accent: '#f44336',
    draw(ctx, x, y, size, rot, squash) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.scale(1, squash);
      ctx.fillStyle = this.color;
      ctx.fillRect(-size/2, -size/2, size, size);
      ctx.fillStyle = this.accent;
      ctx.fillRect(-size/2, -size*0.1, size, size*0.15);
      ctx.fillStyle = '#fff';
      ctx.fillRect(-size*0.25, -size*0.25, size*0.12, size*0.08);
      ctx.fillRect(size*0.13, -size*0.25, size*0.12, size*0.08);
      ctx.restore();
    }
  },
  knight: {
    id: 'knight',
    name: 'Knight',
    cost: 400,
    color: '#b0bec5',
    accent: '#ffd54f',
    draw(ctx, x, y, size, rot, squash) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.scale(1, squash);
      ctx.fillStyle = this.color;
      ctx.fillRect(-size/2, -size/2, size, size);
      ctx.fillStyle = this.accent;
      ctx.fillRect(-size*0.15, -size/2, size*0.3, size*0.2);
      ctx.strokeStyle = '#78909c';
      ctx.lineWidth = 2;
      ctx.strokeRect(-size/2, -size/2, size, size);
      ctx.restore();
    }
  },
  alien: {
    id: 'alien',
    name: 'Alien',
    cost: 500,
    color: '#69f0ae',
    accent: '#00c853',
    draw(ctx, x, y, size, rot, squash) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.scale(1, squash);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.roundRect(-size/2, -size/2, size, size, size*0.3);
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.ellipse(-size*0.18, -size*0.1, size*0.12, size*0.18, 0, 0, Math.PI*2);
      ctx.ellipse(size*0.18, -size*0.1, size*0.12, size*0.18, 0, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
    }
  },
  astronaut: {
    id: 'astronaut',
    name: 'Astronaut',
    cost: 600,
    color: '#eceff1',
    accent: '#42a5f5',
    draw(ctx, x, y, size, rot, squash) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.scale(1, squash);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(0, 0, size/2, 0, Math.PI*2);
      ctx.fill();
      ctx.fillStyle = this.accent;
      ctx.beginPath();
      ctx.arc(0, -size*0.05, size*0.28, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
    }
  },
  wizard: {
    id: 'wizard',
    name: 'Wizard',
    cost: 700,
    color: '#7e57c2',
    accent: '#ffeb3b',
    draw(ctx, x, y, size, rot, squash) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.scale(1, squash);
      ctx.fillStyle = this.color;
      ctx.fillRect(-size/2, -size/2, size, size);
      // hat
      ctx.fillStyle = '#4527a0';
      ctx.beginPath();
      ctx.moveTo(-size*0.4, -size/2);
      ctx.lineTo(0, -size*0.95);
      ctx.lineTo(size*0.4, -size/2);
      ctx.fill();
      ctx.fillStyle = this.accent;
      ctx.beginPath();
      ctx.arc(0, -size*0.55, size*0.08, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
    }
  },
  cyber: {
    id: 'cyber',
    name: 'Cyber Cube',
    cost: 900,
    color: '#00e5ff',
    accent: '#ff00aa',
    draw(ctx, x, y, size, rot, squash) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.scale(1, squash);
      ctx.fillStyle = this.color;
      ctx.fillRect(-size/2, -size/2, size, size);
      ctx.strokeStyle = this.accent;
      ctx.lineWidth = 3;
      ctx.strokeRect(-size/2, -size/2, size, size);
      ctx.fillStyle = this.accent;
      ctx.fillRect(-size*0.3, -size*0.15, size*0.6, size*0.08);
      ctx.restore();
    }
  },
  golden: {
    id: 'golden',
    name: 'Golden Cube',
    cost: 1500,
    color: '#ffd700',
    accent: '#ff8f00',
    draw(ctx, x, y, size, rot, squash) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.scale(1, squash);
      ctx.fillStyle = this.color;
      ctx.fillRect(-size/2, -size/2, size, size);
      ctx.strokeStyle = this.accent;
      ctx.lineWidth = 3;
      ctx.strokeRect(-size/2, -size/2, size, size);
      ctx.fillStyle = '#fff8e1';
      ctx.fillRect(-size*0.2, -size*0.2, size*0.15, size*0.15);
      ctx.restore();
    }
  },
  crystal: {
    id: 'crystal',
    name: 'Crystal Cube',
    cost: 2000,
    color: '#e1bee7',
    accent: '#ce93d8',
    draw(ctx, x, y, size, rot, squash) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.scale(1, squash);
      ctx.globalAlpha = 0.85;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.moveTo(0, -size/2);
      ctx.lineTo(size/2, 0);
      ctx.lineTo(0, size/2);
      ctx.lineTo(-size/2, 0);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = this.accent;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.restore();
    }
  }
};
