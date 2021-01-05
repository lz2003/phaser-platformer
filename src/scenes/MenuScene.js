import { Scene } from 'phaser';
var context = new AudioContext();
class MenuScene extends Scene {

    constructor() {
        super('menu')
    }

    create() {
        // Assets
        const logo = this.add.image(400, 300, 'logo');
        const start = this.add.image(400, 500, 'sbutton');
        
        // Music
        //this.music = this.sound.add('mainTheme');
        //this.music.loop = true;
        //this.music.play();

        // Sets the z level of objects
        // Objects with greater depth appear in front of other objects
        logo.setDepth(1);
        start.setDepth(1);

        // Click to start
        this.input.on('pointerdown', (pointer) => {
            //this.music.stop();
            if (pointer.leftButtonDown()) {
                this.scene.start('levelSelect', {volume: true});
                context.resume();
            }
        });

        // Adds particles to logo
        const p = this.add.particles('particle');
        const e = p.createEmitter();
        e.setPosition(400, 300);
        e.setSpeed(200);
        e.setBlendMode(Phaser.BlendModes.ADD);

    }
}

export default MenuScene