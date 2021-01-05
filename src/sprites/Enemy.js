import { Scene } from 'phaser'

class Enemy extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y) {
        super(scene, x, y, 'slime', 0);
        this.scene = scene;

        // Adds the slimes to the world
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        // Creates the animations
        this.body.anims = scene.anims;
        this.body.anims.create({
			key: 'slimeLeft',
			frames: this.body.anims.generateFrameNumbers('slime', { start: 3, end: 5 }),
			frameRate: 10,
			repeat: -1
		});

		this.body.anims.create({
			key: 'slimeRight',
			frames: this.body.anims.generateFrameNumbers('slime', { start: 0, end: 2 }),
			frameRate: 10,
			repeat: -1
        });

        this.start = false;
        this.right = true;
    }
    
    /**
     * Act method for the slimes
     */
    update() {
        if (!this.start) {
            this.body.setVelocityX(50);
            this.anims.play('slimeRight', true);
            this.start = true;
		} // move right
        if (this.body.blocked.left && !this.right) {
            this.body.setVelocityX(50);
            this.anims.play('slimeRight', true);
            this.right = true;
        } // move left
        else if (this.body.blocked.right && this.right) {
            this.body.setVelocityX(-50);
            this.anims.play('slimeLeft', true);
            this.right = false;
        }
    }

    stopMoving() {
        this.body.setVelocity(0);
    }

    startMoving() {
        if (this.right) this.body.setVelocityX(50);
        else this.body.setVelocityX(-50);
    }
    
    destroy() {
        this.body.destroy();
    }

}

export default Enemy;