/**
 * storage.js – LocalStorage wrapper + daily reward + achievements + progress
 */
export class Storage {
  constructor() {
    this.key = 'stackJump_v1';
    this.data = this.load();
  }

  load() {
    try {
      const raw = localStorage.getItem(this.key);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return this.defaultData();
  }

  defaultData() {
    return {
      bestScore: 0,
      coins: 0,
      totalPerfects: 0,
      totalJumps: 0,
      maxCombo: 0,
      unlockedCharacters: ['cube'],
      unlockedThemes: ['forest'],
      unlockedTrails: ['none'],
      selectedCharacter: 'cube',
      selectedTheme: 'forest',
      selectedTrail: 'none',
      music: true,
      sfx: true,
      vibration: true,
      showFps: false,
      lastDaily: 0,
      dailyStreak: 0,
      achievements: {},
      level: 1,
      xp: 0,
      gamesPlayed: 0
    };
  }

  save() {
    try {
      localStorage.setItem(this.key, JSON.stringify(this.data));
    } catch (e) {}
  }

  get(key) {
    return this.data[key];
  }

  set(key, value) {
    this.data[key] = value;
    this.save();
  }

  addCoins(n) {
    this.data.coins += n;
    this.save();
  }

  unlockCharacter(id) {
    if (!this.data.unlockedCharacters.includes(id)) {
      this.data.unlockedCharacters.push(id);
      this.save();
    }
  }

  unlockTheme(id) {
    if (!this.data.unlockedThemes.includes(id)) {
      this.data.unlockedThemes.push(id);
      this.save();
    }
  }

  canClaimDaily() {
    const now = Date.now();
    const last = this.data.lastDaily || 0;
    return now - last > 20 * 60 * 60 * 1000; // 20 hours
  }

  claimDaily() {
    if (!this.canClaimDaily()) return 0;
    const streak = (this.data.dailyStreak || 0) + 1;
    const reward = Math.min(50 + streak * 15, 300);
    this.data.coins += reward;
    this.data.lastDaily = Date.now();
    this.data.dailyStreak = streak;
    this.save();
    return reward;
  }

  addXP(amount) {
    this.data.xp += amount;
    while (this.data.xp >= this.xpForLevel(this.data.level)) {
      this.data.xp -= this.xpForLevel(this.data.level);
      this.data.level++;
    }
    this.save();
  }

  xpForLevel(lvl) {
    return 100 + (lvl - 1) * 50;
  }

  unlockAchievement(id) {
    if (!this.data.achievements[id]) {
      this.data.achievements[id] = true;
      this.save();
      return true;
    }
    return false;
  }
}
