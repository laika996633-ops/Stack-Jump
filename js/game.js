/**
 * game.js – Core game loop, state machine, spawning, scoring
 */
import { Storage } from './storage.js';
import { AudioManager } from './audio.js';
import { Player } from './player.js';
import { PlatformPool } from './platform.js';
import { Effects } from './effects.js';
import { PowerupManager } from './powerups.js';
import { Weather } from './weather.js';
import { UI } from './ui.js';
import { CHARACTERS } from './characters.js';
import { THEMES, THEME_ORDER } from './themes.js';

class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.storage = new Storage();
    this.audio = new AudioManager(this.storage);
    this.effects = new Effects();
    this.powerups = new PowerupManager();
    this.weather = new Weather();
    this.characters = CHARACTERS;
    this.themes = THEMES;

    this.state = 'loading';
    this.score = 0;
    this.coins = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.perfects = 0;
    this.jumps = 0;
    this.multiplier = 1;
    this.speed = 2.2;
    this.platformGap = 110;
    this.nextDir = 1;
    this.lastPlatformY = 0;
    this.themeTimer = 0;
    this.dayPhase = 0; // 0-1 cycle
    this.fps = 60;
    this.frameCount = 0;
    this.lastFpsTime = performance.now();

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.bindInput();

    this.player = new Player(this);
    this.platforms = new PlatformPool(this.width);
    this.ui = new UI(this);

    // coins on platforms
    this.coinsOnMap = [];

    this.init();
  }

  async init() {
    this.audio.init();
    this.player.setCharacter(this.storage.get('selectedCharacter'));
    this.setTheme(this.storage.get('selectedTheme'));
    document.getElementById('loading').classList.add('hidden');
    this.ui.showScreen('menu');
    this.ui.updateMenu();
    this.loop(performance.now());
  }

  resize() {
    const container = document.getElementById('game-container');
    const rect = container.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = this.width * devicePixelRatio;
    this.canvas.height = this.height * devicePixelRatio;
    this.ctx.scale(devicePixelRatio, devicePixelRatio);
    this.canvas.style.width = this.width + 'px';
    this.canvas.style.height = this.height + 'px';
    if (this.platforms) this.platforms.gameWidth = this.width;
  }

  bindInput() {
    const action = () => {
      this.audio.resume();
      if (this.state === 'playing') this.player.jump();
    };
    this.canvas.addEventListener('pointerdown', action);
    window.addEventListener('keydown', e => {
      if (e.code === 'Space') {
        e.preventDefault();
        action();
      }
    });
  }

  setTheme(id) {
    this.currentTheme = THEMES[id] || THEMES.forest;
  }

  startGame() {
    this.state = 'playing';
    this.score = 0;
    this.coins = this.storage.get('coins');
    this.combo = 0;
    this.maxCombo = 0;
    this.perfects = 0;
    this.jumps = 0;
    this.multiplier = 1;
    this.speed = 2.2;
    this.nextDir = 1;
    this.powerups.reset();
    this.effects.particles = [];
    this.coinsOnMap = [];
    this.player.reset();
    this.player.setCharacter(this.storage.get('selectedCharacter'));
    this.platforms.pool.forEach(p => p.active = false);

    // first platform under player
    const start = this.platforms.get();
    start.spawn(this.height * 0.7, 0, 0, this.currentTheme.platformColors);
    start.x = this.width / 2 - start.width / 2;
    start.vx = 0;
    this.player.x = this.width / 2;
    this.player.y = start.y - this.player.size / 2;
    this.player.onGround = true;
    this.lastPlatformY = start.y;

    this.ui.showHUD();
    this.audio.startMusic();
    this.spawnNextPlatform();
  }

  pause() {
    if (this.state !== 'playing') return;
    this.state = 'paused';
    this.ui.showScreen('pause-screen');
  }

  resume() {
    if (this.state !== 'paused') return;
    this.state = 'playing';
    this.ui.showHUD();
  }

  spawnNextPlatform() {
    const p = this.platforms.get();
    const y = this.lastPlatformY - this.platformGap;
    p.spawn(y, this.nextDir, this.speed, this.currentTheme.platformColors);
    this.lastPlatformY = y;
    this.nextDir *= -1;

    // chance of coin
    if (Math.random() < 0.35) {
      this.coinsOnMap.push({
        x: p.x + p.width / 2,
        y: p.y - 30,
        platform: p,
        collected: false
      });
    }
  }

  onLand(platform) {
    this.jumps++;
    const center = platform.x + platform.width / 2;
    const dist = Math.abs(this.player.x - center);
    const perfectThreshold = platform.width * 0.18;

    let points = 1;
    let isPerfect = false;

    if (dist < perfectThreshold) {
      isPerfect = true;
      points = 3;
      this.perfects++;
      this.combo++;
      this.maxCombo = Math.max(this.maxCombo, this.combo);
      this.multiplier = 1 + Math.floor(this.combo / 5) * 0.5;
      this.effects.perfectFlash(this.player.x, this.player.y);
      this.effects.addFloatText('PERFECT!', this.player.x, this.player.y - 40, '#ffeb3b');
      this.audio.perfect();
      if (this.combo % 5 === 0) this.audio.combo();
      if (this.storage.get('vibration') && navigator.vibrate) navigator.vibrate([20, 30, 20]);
    } else {
      this.combo = 0;
      this.multiplier = 1;
      this.effects.landDust(this.player.x, this.player.y + this.player.size / 2);
      this.audio.land();
    }

    this.score += Math.floor(points * this.multiplier);
    this.effects.shakeCamera(isPerfect ? 6 : 3, 0.15);

    // progress
    if (this.score > 0 && this.score % 10 === 0) {
      this.speed = Math.min(this.speed + 0.12, 5.5);
      this.platformGap = Math.max(this.platformGap - 1.5, 85);
    }

    this.spawnNextPlatform();

    // achievements
    if (isPerfect && this.perfects === 1) this.storage.unlockAchievement('first_perfect');
    if (this.combo >= 10) this.storage.unlockAchievement('combo_10');
    if (this.score >= 100) this.storage.unlockAchievement('score_100');
  }

  onGameOver() {
    this.state = 'gameover';
    this.audio.gameOver();
    this.audio.stopMusic();

    const best = Math.max(this.storage.get('bestScore'), this.score);
    this.storage.set('bestScore', best);
    this.storage.set('coins', this.coins);
    this.storage.set('maxCombo', Math.max(this.storage.get('maxCombo'), this.maxCombo));
    this.storage.set('totalPerfects', this.storage.get('totalPerfects') + this.perfects);
    this.storage.set('gamesPlayed', this.storage.get('gamesPlayed') + 1);
    this.storage.addXP(this.score + this.perfects * 5);

    const accuracy = this.jumps ? Math.round((this.perfects / this.jumps) * 100) : 0;

    this.ui.showGameOver({
      score: this.score,
      best,
      coins: this.coins - this.storage.get('coins') + this.score, // rough
      perfects: this.perfects,
      maxCombo: this.maxCombo,
      accuracy
    });
  }

  update(dt) {
    if (this.state !== 'playing') return;

    this.player.update(dt, this.platforms.active);
    this.platforms.update(dt);
    this.effects.update(dt);
    this.powerups.update(dt);
    this.weather.update(dt, this.width, this.height);

    // theme auto cycle
    this.themeTimer += dt;
    if (this.themeTimer > 90) {
      this.themeTimer = 0;
      const idx = THEME_ORDER.indexOf(this.currentTheme.id);
      const next = THEME_ORDER[(idx + 1) % THEME_ORDER.length];
      if (this.storage.get('unlockedThemes').includes(next)) {
        this.setTheme(next);
      }
    }

    // day/night
    this.dayPhase = (this.dayPhase + dt * 0.02) % 1;

    // coin collection
    for (const c of this.coinsOnMap) {
      if (c.collected) continue;
      if (c.platform.active) {
        c.x = c.platform.x + c.platform.width / 2;
      }
      const dx = this.player.x - c.x;
      const dy = this.player.y - c.y;
      if (dx*dx + dy*dy < 900) {
        c.collected = true;
        this.coins++;
        this.effects.coinBurst(c.x, c.y);
        this.audio.coin();
        this.effects.addFloatText('+1', c.x, c.y, '#ffd700');
      }
    }
    this.coinsOnMap = this.coinsOnMap.filter(c => !c.collected && c.platform.active);

    this.ui.updateHUD(this.score, this.coins, this.combo, this.multiplier);
  }

  draw() {
    const ctx = this.ctx;
    const t = this.currentTheme;

    // sky gradient with day/night tint
    const sky0 = t.sky[0];
    const sky1 = t.sky[1];
    const grad = ctx.createLinearGradient(0, 0, 0, this.height);
    grad.addColorStop(0, sky0);
    grad.addColorStop(1, sky1);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.width, this.height);

    // simple ground
    ctx.fillStyle = t.ground;
    ctx.fillRect(0, this.height - 40, this.width, 40);

    // weather
    this.weather.draw(ctx, this.width, this.height);

    // shake
    ctx.save();
    ctx.translate(this.effects.shake.x, this.effects.shake.y);

    this.platforms.draw(ctx);

    // coins
    for (const c of this.coinsOnMap) {
      if (c.collected) continue;
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.arc(c.x, c.y, 8, 0, Math.PI*2);
      ctx.fill();
      ctx.strokeStyle = '#ff8f00';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    this.player.draw(ctx);
    this.effects.draw(ctx);
    this.powerups.draw(ctx, this.width);

    ctx.restore();

    // FPS
    if (this.storage.get('showFps')) {
      ctx.fillStyle = '#0f0';
      ctx.font = '12px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`FPS ${this.fps}`, 8, this.height - 10);
    }
  }

  loop(now) {
    const dt = Math.min((now - (this.lastTime || now)) / 1000, 0.05);
    this.lastTime = now;

    this.frameCount++;
    if (now - this.lastFpsTime > 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastFpsTime = now;
    }

    this.update(dt);
    this.draw();
    requestAnimationFrame(t => this.loop(t));
  }
}

// boot
window.addEventListener('load', () => {
  new Game();
});
