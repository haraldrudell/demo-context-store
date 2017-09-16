ig.module(
	  'game.entities.goal'
)
    .requires(
	      'impact.entity',
	      'plugins.box2d.entity'
    ).defines(
        function(){
            EntityGoal = ig.Box2DEntity.extend
            ({
                 size: {x: 150, y: 102},

                 type: ig.Entity.TYPE.A,
                 checkAgainst: ig.Entity.TYPE.NONE,
	               collides: ig.Entity.COLLIDES.NEVER, // Collision is already handled by Box2D!
	               animSheet: new ig.AnimationSheet( 'media/items/goal.png', 150, 102 ),

	               init: function( x, y, settings ) {
		                 this.parent( x, y, settings );
                     this.addAnim( 'idle', 1, [0] );
                     this.currentAnim = this.anims.idle;
                     // this gives error  
                     // this.goalTimmer = new ig.Timer.new(30);
                 },

                 triggeredBy: function(other) {
                     this.emoji = ig.game.spawnEntity( EntityEmo, this, 'star');
                     other.pos.y = this.pos.y + 200;
                 }
             });

        });

