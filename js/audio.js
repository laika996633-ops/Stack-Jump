/**
 * audio.js – Procedural Web Audio SFX + ambient music
 */
export class AudioManager {
  constructor(storage) {
    this.storage = storage;
    this.ctx = null;
    this.master = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.musicNodes = [];
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.master = this.ctx.createGain();
      this.master.connect(this.ctx.destination);
      this.master.gain.value = 0.7;

      this.musicGain = this.ctx.createGain();
      this.musicGain.connect(this.master);
      this.musicGain.gain.value = this.storage.get('music') ? 0.25 : 0;

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.connect(this.master);
      this.sfxGain.gain.value = this.storage.get('sfx') ? 0.6 : 0;

      this.initialized = true;
    } catch (e) {
      console.warn('Audio not available');
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  }

  setMusic(on) {
    if (this.musicGain) this.musicGain.gain.value = on ? 0.25 : 0;
  }

  setSfx(on) {
    if (this.sfxGain) this.sfxGain.gain.value = on ? 0.6 : 0;
  }

  // ----- SFX -----
  playTone(freq, type, dur, vol = 0.3, slide = 0) {
    if (!this.initialized || !this.storage.get('sfx')) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    if (slide) osc.frequency.linearRampToValueAtTime(freq + slide, this.ctx.currentTime + dur);
    g.gain.setValueAtTime(vol, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
    osc.connect(g);
    g.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + dur);
  }

  jump() {
    this.playTone(420, 'square', 0.12, 0.25, 180);
  }

  land() {
    this.playTone(180, 'triangle', 0.15, 0.3);
  }

  perfect() {
    this.playTone(660, 'sine', 0.2, 0.35);
    setTimeout(() => this.playTone(880, 'sine', 0.25, 0.3), 60);
  }

  coin() {
    this.playTone(900, 'sine', 0.1, 0.25);
    setTimeout(() => this.playTone(1200, 'sine', 0.12, 0.2), 50);
  }

  combo() {
    this.playTone(500, 'sawtooth', 0.08, 0.2);
    setTimeout(() => this.playTone(700, 'sawtooth', 0.1, 0.2), 40);
    setTimeout(() => this.playTone(900, 'sawtooth', 0.12, 0.2), 80);
  }

  gameOver() {
    this.playTone(200, 'sawtooth', 0.4, 0.35, -120);
  }

  click() {
    this.playTone(600, 'square', 0.05, 0.15);
  }

  powerup() {
    this.playTone(400, 'sine', 0.3, 0.3, 400);
  }

  // Simple ambient loop
  startMusic() {
    if (!this.initialized || !this.storage.get('music')) return;
    this.stopMusic();
    const notes = [261.63, 329.63, 392.00, 523.25];
    let i = 0;
    const playNext = () => {
      if (!this.storage.get('music')) return;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = notes[i % notes.length];
      g.gain.setValueAtTime(0.08, this.ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.8);
      osc.connect(g);
      g.connect(this.musicGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 1.8);
      this.musicNodes.push(osc);
      i++;
      this._musicTimer = setTimeout(playNext, 900);
    };
    playNext();
  }

  stopMusic() {
    clearTimeout(this._musicTimer);
    this.musicNodes.forEach(n => { try { n.stop(); } catch(e){} });
    this.musicNodes = [];
  }
}
