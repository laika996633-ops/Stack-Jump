/**
 * themes.js – Background themes + auto-cycle
 */
export const THEMES = {
  forest: {
    id: 'forest',
    name: 'Forest',
    cost: 0,
    sky: ['#87CEEB', '#228B22'],
    ground: '#2e7d32',
    platformColors: { grass: '#4caf50', wood: '#8d6e63', stone: '#78909c' }
  },
  snow: {
    id: 'snow',
    name: 'Snow',
    cost: 200,
    sky: ['#e3f2fd', '#90caf9'],
    ground: '#eceff1',
    platformColors: { grass: '#b0bec5', wood: '#a1887f', stone: '#90a4ae' }
  },
  desert: {
    id: 'desert',
    name: 'Desert',
    cost: 250,
    sky: ['#ffe082', '#ff8f00'],
    ground: '#f57c00',
    platformColors: { grass: '#ffb74d', wood: '#d7ccc8', stone: '#a1887f' }
  },
  sky: {
    id: 'sky',
    name: 'Sky',
    cost: 300,
    sky: ['#81d4fa', '#0288d1'],
    ground: '#4fc3f7',
    platformColors: { grass: '#4dd0e1', wood: '#80cbc4', stone: '#b2ebf2' }
  },
  night: {
    id: 'night',
    name: 'Night',
    cost: 350,
    sky: ['#0d1b2a', '#1b263b'],
    ground: '#415a77',
    platformColors: { grass: '#778da9', wood: '#5c6b73', stone: '#415a77' }
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    cost: 500,
    sky: ['#12005e', '#4a148c'],
    ground: '#00e5ff',
    platformColors: { grass: '#00bcd4', wood: '#ff00aa', stone: '#7c4dff' }
  },
  space: {
    id: 'space',
    name: 'Space',
    cost: 600,
    sky: ['#000000', '#1a237e'],
    ground: '#311b92',
    platformColors: { grass: '#7e57c2', wood: '#5c6bc0', stone: '#3949ab' }
  },
  candy: {
    id: 'candy',
    name: 'Candy Land',
    cost: 700,
    sky: ['#f8bbd0', '#f48fb1'],
    ground: '#f06292',
    platformColors: { grass: '#ec407a', wood: '#ab47bc', stone: '#7e57c2' }
  },
  volcano: {
    id: 'volcano',
    name: 'Volcano',
    cost: 800,
    sky: ['#3e2723', '#bf360c'],
    ground: '#d84315',
    platformColors: { grass: '#ff5722', wood: '#5d4037', stone: '#424242' }
  },
  temple: {
    id: 'temple',
    name: 'Temple',
    cost: 900,
    sky: ['#fff3e0', '#ffcc80'],
    ground: '#a1887f',
    platformColors: { grass: '#8d6e63', wood: '#6d4c41', stone: '#5d4037' }
  }
};

export const THEME_ORDER = Object.keys(THEMES);
