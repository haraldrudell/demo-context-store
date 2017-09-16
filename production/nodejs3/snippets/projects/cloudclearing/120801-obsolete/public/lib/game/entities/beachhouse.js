  ig.module(
    'game.entities.beachhouse'
).requires(
    'impact.entity',
    'game.entities.building'
).defines(
    function()
    {
        EntityBeachhouse = EntityBuilding.extend
        ({
             animSheet: new ig.AnimationSheet( 'media/img/buildings/beachhouse.png', 128, 192 ),
             visitType: 'beachhouse',
             size: {x: 128, y: 192},
             offset: {x: 0, y: 0},
             maxStage: 4,
             type: ig.Entity.TYPE.NONE,
             checkAgainst: ig.Entity.TYPE.B,
             tourist: null,
             visitable: false,


             init: function( x, y, settings ) {
	     	 this.addAnim( 'idle0', 1, [0], true );
	     	 this.addAnim( 'idle1', 1, [1], true );
	     	 this.addAnim( 'idle2', 1, [2], true );
	     	 this.addAnim( 'idle3', 1, [3], true );
	     	 this.addAnim( 'idle4', 1, [4], true );
	     	 this.parent(x,y,settings);
             },

             check: function(tourist) {
               if (this.tourist != tourist) {
                 this.tourist = tourist;
               }
             },

             selected: function() {
               return ig.input.pressed('click') && this.inFocus();
             },

             clicked: function() {
               if (!this.touristInside() || this.bought) {
                 this.parent();
               } else if (this.touristInside() && !this.tourist.inFocus()) {
                 ig.game.showDialog("do you want to buy drinks?", this, "buyDrinks");
               }
             },

             buyDrinks: function() {
               ig.gameState.statsbar.addStats({ coins: -10, xp: 10, hp: -2});
               var xDelta = (this.tourist.pos.x + 20 > this.pos.x + this.size.x / 2) ? -70 : 50
               console.log(this.tourist.pos.x, this.pos.x, xDelta)
               ig.game.spawnEntity(EntityDrink, this.tourist.pos.x + xDelta, this.tourist.pos.y, {level: this.buildStage});
             }
         });
    });
