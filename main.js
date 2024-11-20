import HomeScene from './home.js';
import GameScene from './game.js';

const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1920,
    height: 1080,
    orientation: 'landscape'
  },
  scene: [HomeScene, GameScene],
  audio: {
		disableWebAudio: true
	},
  dom: {
    createContainer: true
  },
  parent: 'phaser-container'
};

const game = new Phaser.Game(config);