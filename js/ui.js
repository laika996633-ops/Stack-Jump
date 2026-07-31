/**
 * ui.js – All menu & HUD management
 */
export class UI {
  constructor(game) {
    this.game = game;
    this.bind();
  }

  bind() {
    const $ = id => document.getElementById(id);

    // buttons
    $('btn-play')?.addEventListener('click', () => this.game.startGame());
    $('btn-playagain')?.addEventListener('click', () => this.game.startGame());
    $('btn-gohome')?.addEventListener('click', () => this.showScreen('menu'));
    $('btn-home')?.addEventListener('click', () => this.showScreen('menu'));
    $('btn-resume')?.addEventListener('click', () => this.game.resume());
    $('btn-restart')?.addEventListener('click', () => this.game.startGame());
    $('btn-pause')?.addEventListener('click', () => this.game.pause());

    // navigation
    document.querySelectorAll('[data-back]').forEach(btn => {
      btn.addEventListener('click', () => this.showScreen('menu'));
    });

    $('btn-characters')?.addEventListener('click', () => {
      this.renderCharacters();
      this.showScreen('characters-screen');
    });
    $('btn-themes')?.addEventListener('click', () => {
      this.renderThemes();
      this.showScreen('themes-screen');
    });
    $('btn-shop')?.addEventListener('click', () => {
      this.renderShop();
      this.showScreen('shop-screen');
    });
    $('btn-achievements')?.addEventListener('click', () => {
      this.renderAchievements();
      this.showScreen('achievements-screen');
    });
    $('btn-settings')?.addEventListener('click', () => this.showScreen('settings-screen'));
    $('btn-credits')?.addEventListener('click', () => this.showScreen('credits-screen'));

    // settings toggles
    $('toggle-music')?.addEventListener('change', e => {
      this.game.storage.set('music', e.target.checked);
      this.game.audio.setMusic(e.target.checked);
      if (e.target.checked) this.game.audio.startMusic();
      else this.game.audio.stopMusic();
    });
    $('toggle-sfx')?.addEventListener('change', e => {
      this.game.storage.set('sfx', e.target.checked);
      this.game.audio.setSfx(e.target.checked);
    });
    $('toggle-vib')?.addEventListener('change', e => {
      this.game.storage.set('vibration', e.target.checked);
    });
    $('toggle-fps')?.addEventListener('change', e => {
      this.game.storage.set('showFps', e.target.checked);
    });

    // daily
    $('btn-claim-daily')?.addEventListener('click', () => {
      const reward = this.game.storage.claimDaily();
      if (reward) {
        this.game.audio.coin();
        alert(`+${reward} coins!`);
        this.updateMenu();
      }
    });
  }

  showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    const el = document.getElementById(id);
    if (el) el.classList.remove('hidden');
    document.getElementById('hud')?.classList.add('hidden');
    if (id === 'menu') this.updateMenu();
  }

  showHUD() {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById('hud')?.classList.remove('hidden');
  }

  updateMenu() {
    const s = this.game.storage;
    document.getElementById('menu-best').textContent = s.get('bestScore');
    const daily = document.getElementById('daily-reward');
    if (s.canClaimDaily()) daily?.classList.add('show');
    else daily?.classList.remove('show');
  }

  updateHUD(score, coins, combo, mult) {
    document.getElementById('score-value').textContent = score;
    document.getElementById('coin-value').textContent = coins;
    document.getElementById('multiplier').textContent = `x${mult}`;
    const comboEl = document.getElementById('combo-text');
    if (combo >= 30) comboEl.textContent = 'LIGHTNING!';
    else if (combo >= 20) comboEl.textContent = 'FIRE!';
    else if (combo >= 10) comboEl.textContent = 'RAINBOW!';
    else if (combo >= 5) comboEl.textContent = 'GOLDEN!';
    else comboEl.textContent = combo > 1 ? `${combo} COMBO` : '';
  }

  showGameOver(stats) {
    document.getElementById('go-score').textContent = stats.score;
    document.getElementById('go-best').textContent = stats.best;
    document.getElementById('go-coins').textContent = stats.coins;
    document.getElementById('go-perfects').textContent = stats.perfects;
    document.getElementById('go-combo').textContent = stats.maxCombo;
    document.getElementById('go-accuracy').textContent = stats.accuracy + '%';
    this.showScreen('gameover-screen');
  }

  renderCharacters() {
    const grid = document.getElementById('character-grid');
    grid.innerHTML = '';
    const unlocked = this.game.storage.get('unlockedCharacters');
    const selected = this.game.storage.get('selectedCharacter');
    for (const [id, c] of Object.entries(this.game.characters)) {
      const div = document.createElement('div');
      div.className = `char-card ${unlocked.includes(id) ? '' : 'locked'} ${selected === id ? 'selected' : ''}`;
      div.innerHTML = `<div class="char-preview" style="background:${c.color}"></div><div>${c.name}</div><div style="font-size:11px;opacity:0.7">${unlocked.includes(id) ? 'OWNED' : c.cost + ' ●'}</div>`;
      div.onclick = () => {
        if (!unlocked.includes(id)) {
          if (this.game.storage.get('coins') >= c.cost) {
            this.game.storage.addCoins(-c.cost);
            this.game.storage.unlockCharacter(id);
            this.game.audio.powerup();
            this.renderCharacters();
          }
        } else {
          this.game.storage.set('selectedCharacter', id);
          this.game.player.setCharacter(id);
          this.renderCharacters();
        }
      };
      grid.appendChild(div);
    }
  }

  renderThemes() {
    const grid = document.getElementById('theme-grid');
    grid.innerHTML = '';
    const unlocked = this.game.storage.get('unlockedThemes');
    const selected = this.game.storage.get('selectedTheme');
    for (const [id, t] of Object.entries(this.game.themes)) {
      const div = document.createElement('div');
      div.className = `theme-card ${unlocked.includes(id) ? '' : 'locked'} ${selected === id ? 'selected' : ''}`;
      div.innerHTML = `<div style="height:40px;border-radius:8px;background:linear-gradient(180deg,${t.sky[0]},${t.sky[1]})"></div><div>${t.name}</div>`;
      div.onclick = () => {
        if (!unlocked.includes(id)) {
          if (this.game.storage.get('coins') >= t.cost) {
            this.game.storage.addCoins(-t.cost);
            this.game.storage.unlockTheme(id);
            this.renderThemes();
          }
        } else {
          this.game.storage.set('selectedTheme', id);
          this.game.setTheme(id);
          this.renderThemes();
        }
      };
      grid.appendChild(div);
    }
  }

  renderShop() {
    document.getElementById('shop-coins').textContent = this.game.storage.get('coins');
    // simple placeholder items – can expand
  }

  renderAchievements() {
    const list = document.getElementById('achievements-list');
    const ach = [
      { id: 'first_perfect', name: 'First Perfect', desc: 'Land a perfect jump' },
      { id: 'combo_10', name: 'Combo Master', desc: '10 perfects in a row' },
      { id: 'score_100', name: 'Century', desc: 'Reach 100 points' },
      { id: 'coins_500', name: 'Rich', desc: 'Collect 500 coins' }
    ];
    list.innerHTML = ach.map(a => {
      const unlocked = this.game.storage.get('achievements')[a.id];
      return `<div style="padding:10px;background:rgba(255,255,255,0.08);margin:6px 0;border-radius:10px;opacity:${unlocked?1:0.5}">
        <strong>${a.name}</strong><br><small>${a.desc}</small> ${unlocked ? '✓' : ''}
      </div>`;
    }).join('');
  }
}
