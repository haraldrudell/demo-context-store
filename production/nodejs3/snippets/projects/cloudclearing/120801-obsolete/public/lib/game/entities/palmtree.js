ig.module(
    'game.entities.palmtree'
).requires(
    'impact.entity',
    'game.entities.building'
).defines(
    function()
    {
        EntityPalmtree = EntityClickable.extend
        ({
             animSheet: new ig.AnimationSheet( 'media/img/buildings/palmtree.png', 64, 96 ),
             visitType: 'beachhouse',
             size: {x: 64, y: 96},
             offset: {x: 0, y: 0},
             maxStage: 1,

             init: function( x, y, settings ) {
	     	 this.addAnim( 'idle', 1, [0], true );
	     	 this.addAnim( 'shake', 0.1, [0,1], false );  // anim
	     	 this.parent(x,y,settings);
                 this.currentAnim = this.anims.idle;
               this.triggerTimer = new ig.Timer(30);
               this.tourist = null;
             },

             reset: function() {
                 this.currentAnim = this.anims.idle;
             },

          //same tourist can only trigger each 30 seconds
	     triggeredBy: function(other, trig) {
                if ((this.tourist != other || this.triggerTimer.delta() > 0) && !other.movingTourist) {
                  ig.gameState.statsbar.addStats({ hp: -2, xp: 2});
                  console.log("palmtree.triggeredBy()");
                  this.tourist = other;
                  this.triggerTimer.reset();
                  other.currentAnim = other.anims.dance;
                  this.currentAnim = this.anims['shake'];
                  other.showEmoji('music');
                  setTimeout(other.reset.bind(other), 2000);
                  setTimeout(this.reset.bind(this), 2000 );
                }
            },

            reset: function() {
              this.currentAnim = this.anims.idle;
              ig.game.spawnEntity(EntityCoconut, this.pos.x + 20, this.pos.y + 20)
            },

	     update: function(){
		 this.parent();
		 // dont parent
	     }

         });
    });
