import { Scene } from 'phaser'
import { config } from '../config'
import Player from '../sprites/Player'
import Enemy from '../sprites/Enemy'

class Platformer extends Scene {
	constructor() {
		super('platformer');
	}

    create(data) {
		// instance variables
		this.level = data.level;
		this.volume = data.volume;
		this.paused = false;
		this.startX = 100; this.startY = 450;
		this.deathHeight = 1000;
		
		if (this.level == 4)
		{
			this.startY = 2000;
			this.deathHeight = 2900;
		}

		// Load in the background
		if (this.level < 4) this.sky = this.add.image(config.width/2, config.height/2, "forest");
		else this.sky = this.add.image(config.width/2, config.height/2, "cave");
		this.sky.setScrollFactor(0);
		this.createScore();
		// Load in the player
		this.player = new Player(this, this.startX, this.startY);
		// Load other assets/game effects
		this.loadSounds();
		this.loadTiles();
		this.loadObjects();
		this.loadCollisions();
		this.loadPause();
		this.coinAnimate();

		// Set up the camera to follow the player
		this.cameras.main.startFollow(this.player.sprite, false, 0.08, 0.08);
		this.cameras.main.setBounds(0, 0, this.map.widthInPixels-32, this.map.heightInPixels);
	}

	/**
	 * Creates the score 
	 */
	createScore() {
		this.score = 0;
		this.scoreText = this.add
			.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#fff' })
			.setDepth(100)
			.setScrollFactor(0);
	}

	/**
	 * updates the score
	 */
	updateScore() {
		this.score += 10;
		this.scoreText.setText("Score: " + this.score);

	}

	/**
	 * Loads the sounds in
	 */
	loadSounds() {
		if (this.level < 4) {
			this.music = this.sound.add('technoLevel', {volume: 0.7, loop: true});
		} else {
			this.music = this.sound.add('intenseLevel', {volume: 0.6, loop: true});
		}

		this.coinCollect = this.sound.add('collect');
		this.drown = this.sound.add('drown');
		this.death = this.sound.add('death');
		this.victory = this.sound.add('victory');
		this.click = this.sound.add('click');

		// Mutes audio if the game has been muted in levelselect scene
		if (!this.volume) {
			this.music.volume = 0;
			this.coinCollect.volume = 0;
			this.drown.volume = 0;
			this.death.volume = 0;
			this.victory.volume = 0;
			this.click.volume = 0;
		}

		this.music.play();
	}

	/**
	 * Loads in the level
	 */
	loadTiles() {
		// Open the correct .JSON depending on the selected level
		this.map = this.make.tilemap({key: "map"+this.level});

		// Add the extruded tileset
		this.tileset = this.map.addTilesetImage("cool", "tiles", 32, 32, 1, 2);

		// Load each layer of the level 
		this.tiles = this.map.createStaticLayer("Tiles", this.tileset, 0, 0);
		// This sets Phaser collision based on the custom properties of the tiles (which are set in Tiled)
		this.tiles.setCollisionByProperty({ collides: true });
		this.decor = this.map.createStaticLayer("Decor", this.tileset, 0, 0);
		this.enemyColl = this.map.createStaticLayer("EnemyCollision", this.tileset, 0, 0);
		this.enemyColl.setCollisionByProperty({ collides: true });
	}

	/**
	 * Loads in the game objects of the level
	 */
	loadObjects() {
		// Adds collectable coins to the world
		this.coin = this.map.getObjectLayer("Coins")["objects"];
		this.coins = this.physics.add.staticGroup();
		this.coin.forEach(object => {
			let obj = this.coins.create(object.x, object.y-25, "coin"); 
				obj.setCircle(12);
				obj.setOffset(20, 5)
				obj.setOrigin(0, 0.5); 
		});

		// Adds the goalzone to the world
		this.goal = this.map.getObjectLayer("Goal")["objects"];
		this.endGoal = this.physics.add.staticGroup();
		this.goal.forEach(object => {
			let obj = this.endGoal.create(object.x, object.y, "goal"); 
				obj.setScale(object.width/64, object.height/64); 
				obj.setOrigin(1); 
				obj.body.width = object.width; 
				obj.body.height = object.height; 
		});

		// Adds the spikes to the world
		this.spike = this.map.getObjectLayer("Spikes")["objects"];
		this.spikes = this.physics.add.staticGroup();
		this.spike.forEach(object => {
			let obj = this.spikes.create(object.x+18, object.y-8, "spike"); 
				obj.setScale(object.width/32, object.height/32);
				obj.setOrigin(0.5);
				obj.body.width = object.width; 
				obj.body.height = object.height; 
		});

		// Adds enemies to the world
		this.enemy = this.map.getObjectLayer("Enemies")["objects"];
		this.enemies = this.physics.add.group();
		this.enemy.forEach(object => {
			let obj = new Enemy(this, object.x, object.y)
				obj.setScale(object.width/24, object.height/24); 
				obj.setOrigin(1); 
				obj.body.width = object.width; 
				obj.body.height = object.height; 
			this.enemies.add(obj);
		});
	}

	/**
	 * Sets the collision of game objects
	 */
	loadCollisions() {
		// Add collisions of the player to the ground and platforms
		this.physics.add.collider(this.player.sprite, this.tiles);

		// If the player touches certain game objects
		this.physics.add.overlap(this.player.sprite, this.endGoal, () => {
			this.victory.play();
			this.music.stop();
			this.scene.start('levelSelect', {volume: this.volume});
		});
		
		this.physics.add.overlap(this.player.sprite, this.enemies, () => {
			this.death.play();
			this.playerToStart();
		});

		this.physics.add.overlap(this.player.sprite, this.spikes, () => {
			this.death.play();
			this.playerToStart();
		});

		this.physics.add.overlap(this.player.sprite, this.coins, (player, coin) =>{
			coin.disableBody(true)
			this.coinCollect.play();
			// Adds a special effect when coins are collected
			this.tweens.add({
			  targets: coin,
			  y: coin.body.y-50,
			  scaleX: 0,
			  ease: 'Linear',
			  duration: 160,
			  yoyo: false,
			  repeat: 0,
			  onStart: () => {},
			  onComplete: () => { coin.disableBody(true, true) }
			})
			this.updateScore();
			return false;
		});

		// Adds collisions of the enemies to the ground and platforms
		this.physics.add.collider(this.enemies, this.tiles);
		this.physics.add.collider(this.enemies, this.enemyColl);
	}

	/**
	 * Sets up the pause menu
	 */
	loadPause() {
		// Represents the transulcent dark veil that appears when the game is paused
		this.veil = this.add
			.graphics({x: 0, y: 0})
			.fillStyle('0x000000', 0.4)
			.setScrollFactor(0)
			.setDepth(100)
			.fillRect(0, 0, config.width, config.height)
			.setVisible(false);

		// Represents a button that returns to the levelselect scene
		this.return = this.add
			.image(400, 300, 'rbutton')
			.setScale(2)
			.setInteractive()
			.setDepth(102)
			.setScrollFactor(0)
			.setVisible(false);

		this.return.on('pointerdown', (pointer) => {
			if (pointer.leftButtonDown()) {
				this.click.play();
				this.pause();
				this.music.stop();
				this.scene.start('levelSelect', {volume: this.volume});
			}
		})
		
		// The pause button
		this.menu = this.add
			.image(750, 50, "pbutton")
			.setInteractive()
			.setDepth(101)
			.setScrollFactor(0);
	
		this.menu.on('pointerdown', (pointer) => {
			if (pointer.leftButtonDown()) {
				this.click.play();
				this.pause();
			}
		})

		this.input.keyboard.on('keydown', (key) => {
			if (key.keyCode == Phaser.Input.Keyboard.KeyCodes.ESC) {
				this.pause();
			}
		});
	}

	/**
	 * pauses or unpauses the game
	 */
	pause() {
		if (!this.paused) {
			this.paused = true;
			this.veil.setVisible(true);
			this.return.setVisible(true);
			this.anims.pauseAll();
			this.player.stopMoving();
			this.enemies.children.iterate((child) => {
				child.stopMoving();
			});
		} else {
			this.paused = false;
			this.veil.setVisible(false);
			this.return.setVisible(false);
			this.anims.resumeAll();
			this.enemies.children.iterate((child) => {
				child.startMoving();
			});
		}
	}
	
	/**
	 * Essentially an act method for the game
	 */
	update() {
		if (!this.paused)
		{
			this.player.update();

			if(this.player.sprite.y > this.deathHeight) {
				this.drown.play();
				this.playerToStart();
			}

			this.enemies.children.iterate((child) => {
				child.update();
			});

			this.coins.children.iterate((child) => {
				child.anims.play('spin', true);
			})
		}
	}

	/**
	 * Creates the animation for the coins
	 */
	coinAnimate() {
		this.anims.create({
			key: 'spin',
			frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 5 }),
			frameRate: 10
		});
		
	}

	// Puts the player back at the start of the level when they die
	playerToStart() {
		this.player.sprite.x = this.startX;
		this.player.sprite.y = this.startY;
	}

}

export default Platformer;