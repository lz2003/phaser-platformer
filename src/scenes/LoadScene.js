import { Scene } from 'phaser';

class LoadScene extends Scene {

    constructor() {
        super('load')
    }

    preload() {
        // Load title screen
        this.load.image('background', '../assets/bg/background.png');
        this.load.image('titleSelect', '../assets/ui/title.png');

        // load level select icons
        this.load.spritesheet('levels', 
        'assets/ui/levels.png',
        { frameWidth: 141, frameHeight: 140 });

        // Load tileset image
        this.load.image('tiles', "../assets/cool-extruded.png");

        // Levels to be loaded in
        this.load.tilemapTiledJSON('map1', "../assets/levels/level1.json");
        this.load.tilemapTiledJSON('map2', "../assets/levels/level2.json");
        this.load.tilemapTiledJSON('map3', "../assets/levels/level3.json");
        this.load.tilemapTiledJSON('map4', "../assets/levels/level4.json");
        this.load.tilemapTiledJSON('map5', "../assets/levels/level5.json");

        // Load level backgrounds
        this.load.image('forest', "../assets/bg/forest.png");
        this.load.image('cave', "../assets/bg/cave.png");
        
        // Load ui buttons
        this.load.image('sbutton', "../assets/ui/start_button.png");
        this.load.image('pbutton', "../assets/ui/pause_button.png");
        this.load.image('cbutton', "../assets/ui/controls_button.png");
        this.load.image('rbutton', "../assets/ui/return.png");
        this.load.image('control', "../assets/ui/controls.png");
        this.load.image('unmute', "../assets/ui/unmute.png");
        this.load.image('mute', "../assets/ui/mute.png");

        // Load game object sprites
        this.load.spritesheet('coin', "../assets/sprites/coin.png", { frameWidth: 32, frameHeight: 32 })
        this.load.spritesheet('slime', '../assets/sprites/slimes.png',{ frameWidth: 27, frameHeight: 16 });
        this.load.spritesheet('player', '../assets/sprites/player.png', { frameWidth: 32, frameHeight: 24 });
        this.load.image('goal', "../assets/sprites/Sign_2.png");
        this.load.image('spike', "../assets/sprites/spike.png");

        // Load logo and particles
        this.load.image('logo', '../assets/ui/logo.png');
        this.load.image('particle', '../assets/ui/blue.png');

        // Load music
        this.load.audio('mainTheme', ["../assets/sounds/calm_intro.ogg", "assets/sounds/calm_intro.mp3"]);
        this.load.audio('selectTheme', ["../assets/sounds/upbeat_intro.ogg", "assets/sounds/upbeat_intro.mp3"]);
        this.load.audio('technoLevel', ["../assets/sounds/techno.ogg", "assets/sounds/techno.mp3"]);
        this.load.audio('intenseLevel', ["../assets/sounds/intense.ogg", "assets/sounds/intense.mp3"]);

        // Load sounds
        this.load.audio('click', ["../assets/sounds/click.ogg", "assets/sounds/click.mp3"]);
        this.load.audio('drown', ["../assets/sounds/death.ogg", "assets/sounds/death.mp3"]);
        this.load.audio('death', ["../assets/sounds/object_death.ogg", "assets/sounds/object_death.mp3"]);
        this.load.audio('collect', ["../assets/sounds/collect.ogg", "assets/sounds/collect.mp3"]);
        this.load.audio('victory', ["../assets/sounds/victory.ogg", "assets/sounds/victory.mp3"]);
        this.load.audio('jump', ["../assets/sounds/jump.ogg", "assets/sounds/jump.mp3"]);

        // Make the loading bar
        this.progressBar = this.add.graphics();
        this.progressBox = this.add.graphics();
        this.progressBox.fillStyle(0x222222, 0.8);
        this.progressBox.fillRect(240, 270, 320, 50);

        // Draws the loading bar
        this.load.on('progress', (value) => {
            this.progressBar.clear();
            this.progressBar.fillStyle(0xffffff, 1);
            this.progressBar.fillRect(250, 280, 300 * value, 30);
        });
         
        // Starts the game once all assets have been loaded
        this.load.on('complete', () => {
            console.log('complete');
            this.progressBar.destroy(); 
            this.progressBox.destroy();
            this.scene.start('menu');
        });

    }
}

export default LoadScene