ig.module(
    'game.entities.zebrafish'
).requires(
    'impact.entity',
    'game.entities.building'
).defines(
    function()
    {
        EntityZebrafish = EntityClickable.extend
        ({
             animSheet: new ig.AnimationSheet( 'media/scuba/100px/zebrafish.png', 100, 100 ),
             size: {x: 25, y: 25},
             offset: {x: 42, y: 37},
             visitType: 'zebrafish',
	     motionPath: { x: 10, y: 0 }
	     /*
	     init: function(x,y,settings) {
		 this.parent(x,y,settings);
                 this.maxWidth = 500; // FIXME ig.game.backgroundMaps[0].width * tilesize;
		 this.parent(x,y,settings);
                 this.addAnim('idle', 1, [0], true);
                 this.currentAnim = this.anims.idle;
		 this.turn();
		 zb=this;
	     },

	     turn: function() {
		 if (pikkle) {
		     this.vel.x = pikkle.randomInt(this.motionPath.x) * pikkle.randomSign();
		     this.vel.y = pikkle.randomInt(this.motionPath.y) * pikkle.randomSign();
                     this.currentAnim.flip.x = this.vel.x < 0;
                     this.currentAnim.flip.y = this.vel.y < 0;
		     console.log("turning" + this.vel.x);		     
		 }
	     },

	     update: function() {
		 if (Math.random() < 0.005) {
		     this.turn();
		 }
		 if (this.pos.x < 0) {
		     this.vel = Math.ciel(-this.vel, this.vel);
		 }
		 if (this.pos.x > this.maxWidth) {
		     this.vel = Math.floor(-this.vel, this.vel);
		 }
		 this.parent();
	     }
	      */

         });


    });