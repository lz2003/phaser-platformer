import MenuScene from './scenes/MenuScene';
import LoadScene from './scenes/LoadScene';
import Platformer from './scenes/Platformer';
import LevelSelect from './scenes/LevelSelect';

const config = {
    type: Phaser.AUTO,
    width: 800,
	height: 600,
	physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [LoadScene, MenuScene, LevelSelect, Platformer]
};

export { config };