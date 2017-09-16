var PLAYER_SIZE = 80;   // size of sprite sheet (square)
var PLAYER_HEIGHT = 40; // size of collision
var PLAYER_WIDTH = 40;

//var SLOWDOWN = 0.5;
//var ACCEL = 200;

var playerImgPath = 'media/img/tourists/anims/t1-' + PLAYER_SIZE + ".png";

ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityPlayer = ig.Entity.extend({

	size: {x: PLAYER_WIDTH, y: PLAYER_HEIGHT},
	offset: {x: (PLAYER_SIZE-PLAYER_WIDTH)/2, y: (PLAYER_SIZE-PLAYER_HEIGHT)},
	// maxVel: {x: 20, y: 20},

	type: ig.Entity.TYPE.A,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.NEVER, // Collision is already handled by Box2D!

	animSheet: new ig.AnimationSheet( playerImgPath, PLAYER_SIZE, PLAYER_SIZE ),
	
	flip: false,

	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		// Add the animations
		this.addAnim( 'idle', 1, [0] );
		this.addAnim( 'idleup', 1, [0] );
		this.addAnim( 'idledown', 1, [0] );
		this.addAnim( 'idleleft', 1, [0] );
		this.addAnim( 'idleright', 1, [0] );
		this.addAnim( 'picked', 1, [4] );
		this.addAnim( 'jump', 0.07, [1,2,3] );
		this.addAnim( 'walkup', 0.07, [1,2] );
		this.addAnim( 'walkdown', 0.07, [1,2] );
		this.addAnim( 'walkleft', 0.07, [1,2] );
		this.addAnim( 'walkright', 0.07, [1,2] );

	},
	
	receiveDamage: function(amount, other) {
        console.log("took damage of " + amount);
        console.log(other);
    },

	update: function() {

		this.vel.x = 0;
		this.vel.y = 0;
		
		// up or down
		if( ig.input.state('up') ) {
			this.vel.y = -300;
			this.currentAnim = this.anims.walkup;
		} 
		else if( ig.input.state('down') ) {
			this.vel.y = 300;
			this.currentAnim = this.anims.walkdown;
		}
		
		// and left or right?
		// checking this after the up/down overwrites the currentAnim
		// so left/right has essentially a higher priority for the 
		// chosen animation
		if( ig.input.state('right') ) {
			this.vel.x = 300;
			this.currentAnim = this.anims.walkright;
		}
		else if( ig.input.state('left') ) {
			this.currentAnim.flip.x = true;
			this.vel.x = -300;
			this.currentAnim = this.anims.walkleft;
		}
		
		// no movement in either direction?
		if( !this.vel.x && !this.vel.y ) {
			
			// not already idle? -> set idle anim
			if( !this.idle ) {
				this.idle = true;
				
				if ( this.currentAnim == this.anims.walkup ) {
					this.currentAnim = this.anims.idleup;
				} else if (this.currentAnim == this.anims.walkdown ) {
					this.currentAnim = this.anims.idledown;
				} else if (this.currentAnim == this.anims.walkleft ) {
					this.currentAnim = this.anims.idleleft;
				} else {
					this.currentAnim = this.anims.idleright;
				}
			}
		}
		else {
			this.idle = false;
		}
	

		if( ig.input.state('radioknob') ) {
			ig.music.fadeOut(1);
			this.radioOffSound.play();
			this.theMessage = 'Radio Off';
		}
	
		// move!
		this.parent();
	},

	goodEvent: function() {
			console.log("good thing!");
	}

});

//
//EntityProjectile = ig.Box2DEntity.extend({
//	size: {x: 8, y: 4},
//	
//	type: ig.Entity.TYPE.NONE,
//	checkAgainst: ig.Entity.TYPE.B, 
//	collides: ig.Entity.COLLIDES.NEVER, // Collision is already handled by Box2D!
//		
//	animSheet: new ig.AnimationSheet( 'media/projectile.png', 8, 4 ),	
//	
//	init: function( x, y, settings ) {
//		this.parent( x, y, settings );
//		
//		this.addAnim( 'idle', 1, [0] );
//		this.currentAnim.flip.x = settings.flip;
//		
//		var velocity = (settings.flip ? -10 : 10);
//		this.body.ApplyImpulse( new b2.Vec2(velocity,0), this.body.GetPosition() );
//	}	
//});

});