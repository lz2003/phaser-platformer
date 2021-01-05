import { Scene } from 'phaser';
import { config } from '../config';
 
class LoadScene extends Scene {

    constructor() {
        super('levelSelect')
    }

    create(data) {
        this.volume = data.volume;

        // Assets to be added to the scene
        this.add.image(config.width/2, config.height/2, 'background');
        this.add.image(config.width/2, 100, 'titleSelect');
        this.levels = this.add.group();

        // Music and sounds
        this.music = this.sound.add('selectTheme', {volume: 0.5, loop: true});
        this.music.play();
        this.clickSound = this.sound.add('click');

        this.addMusicControls();
        this.addControls();

        var offsetX = 100;
        // looping through each level thumbnails
        for(let i = 0; i < 5; i ++){
            var levelThumb = this.add
                .sprite(offsetX+i*(140+8), 300, "levels", i)
                .setScale(0.8)
                .setInteractive();
            
            // Starts the level of the corresponding level thumbnail
            levelThumb.on('pointerdown', (pointer) => {
                this.music.stop();
                this.clickSound.play();
                if (pointer.leftButtonDown()) this.scene.start('platformer', {level: i+1, volume: this.volume});
            });
            
            this.levels.add(levelThumb);
        }

    }

    /**
     * Adds the controls menu to the levelselect scene
     */
    addControls() {
        this.controls = this.add.image(400, 500, "cbutton").setInteractive();

        this.veil = this.add
        .image(config.width/2, config.height/2, "control")
        .setInteractive()
        .setDepth(100)
        .setVisible(false);

        this.veil.on('pointerdown', (pointer) => {
            if (pointer.leftButtonDown()) this.setControls(false);
            this.clickSound.play();
        });

        this.controls.on('pointerdown', (pointer) => {
            if (pointer.leftButtonDown()) this.setControls(true);
            this.clickSound.play();
        });
    }

    /**
     * Adds the ability to mute and unmute music
     */
    addMusicControls() {
        this.mute = this.add
            .image(config.width-50, config.height-50, 'mute')
            .setScale(1.5)
            .setInteractive();

        this.unmute = this.add
            .image(config.width-50, config.height-50, 'unmute')
            .setScale(1.5)
            .setInteractive();
        
        if (this.volume) {
            this.mute.setVisible(false);
            this.updateSounds(true);
        } else {
            this.unmute.setVisible(false);
            this.updateSounds(false);
        }

        this.mute.on('pointerdown', (pointer) => {
            if (pointer.leftButtonDown()) {
                this.mute.setVisible(false);
                this.unmute.setVisible(true);
                this.updateSounds(true);
            }
        });

        this.unmute.on('pointerdown', (pointer) => {
            if (pointer.leftButtonDown()) {
                this.mute.setVisible(true);
                this.unmute.setVisible(false);
                this.updateSounds(false);
            }
        });
    }

    /**
     * Updates the sounds by either muting or unmuting them
     * @param {boolean} status true if music can play, otherwise false if muted
     */
    updateSounds(status) {
        this.volume = status;
        if (!this.volume) {
            this.music.mute = true;
            this.clickSound.mute = true;
        } else {
            this.music.mute = false;
            this.clickSound.mute = false;
        }
    }

    /**
     * Makes the controls menu visible/invisible
     * @param {boolean} status true if the controls menu should be visible, otherwise false
     */
    setControls(status) {
        this.veil.setVisible(status);
    }

}

export default LoadScene;