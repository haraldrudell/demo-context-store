ig.module(
	'game.entities.ball'
)
.requires(
	'impact.entity',
	'plugins.box2d.entity'
)
.defines(function(){

EntityBall = ig.Box2DEntity.extend({
    size: {x: 40, y:40},

    type: ig.Entity.TYPE.A,
    checkAgainst: ig.Entity.TYPE.NONE,
	  collides: ig.Entity.COLLIDES.NEVER, // Collision is already handled by Box2D!

	  animSheet: new ig.AnimationSheet( 'media/items/ball.png', 40, 40 ),


	  init: function( x, y, settings ) {
		  this.parent( x, y, settings );
      this.addAnim( 'idle', 1, [0] );
      this.currentAnim = this.anims.idle;
    }
  })
});
