import { Scene } from 'phaser'

class Player {
	constructor(scene, x, y) {
        this.scene = scene;

        this.jump = this.scene.sound.add('jump');

        // mutes the jumping noise 
        if (!this.scene.volume) {
            this.jump.mute = true;
        }

        // Creates the animation frames for the player
        this.anims = scene.anims;
        this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers('player', { start: 4, end: 9 }),
			frameRate: 10,
			repeat: -1
		});
        
		this.anims.create({
			key: 'stayRight',
			frames: [ { key: 'player', frame: 4 } ],
			frameRate: 20
        });
        
        this.anims.create({
			key: 'stayLeft',
			frames: [ { key: 'player', frame: 10 } ],
			frameRate: 20
        });
        
		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('player', { start: 10, end: 16 }),
			frameRate: 10,
			repeat: -1
        });

        // The sprite of the player
        this.sprite = this.scene.physics.add
            .sprite(x, y, 'player', 0)
            .setSize(16, 25)
            .setBounce(0);

        this.sprite.setScale(1.2)
        
        const { LEFT, RIGHT, UP, W, A, D } = Phaser.Input.Keyboard.KeyCodes;
        this.keys = scene.input.keyboard.addKeys({
          left: LEFT,
          right: RIGHT,
          up: UP,
          w: W,
          a: A,
          d: D
        });

        this.right = true;
    }
    
    update() {
        const { keys, sprite } = this;
        const onGround = sprite.body.blocked.down;

        // Move left
        if (keys.left.isDown || keys.a.isDown) {
            if (onGround) {
                this.sprite.setVelocityX(-160);
                this.sprite.anims.play('left', true);
            }
            else {
                this.sprite.setVelocityX(-110);
                this.sprite.anims.play('stayLeft', true);
            }
            this.right = false;
        // Move right
        } else if (keys.right.isDown || keys.d.isDown) {
            if (onGround) {
                this.sprite.setVelocityX(160);
                this.sprite.anims.play('right', true);
            }
            else {
                this.sprite.setVelocityX(110);
                this.sprite.anims.play('stayRight', true);
            }         
            this.right = true;
        // Stay
        } else {
            if (onGround) this.sprite.setVelocityX(0);
            else this.sprite.setDrag(108, 0); 
            if (this.right) this.sprite.anims.play('stayRight', true);
            else this.sprite.anims.play('stayLeft', true);
        }

        // Only allow the player to jump if they are on the ground
        if (onGround && (keys.up.isDown || keys.w.isDown)) {
            this.jump.play();
            this.sprite.setVelocityY(-250);
        }

    }

    stopMoving() {
        this.sprite.setVelocity(0);
    }
    
    
    destroy() {
        this.sprite.destroy();
    }

}

export default Player;