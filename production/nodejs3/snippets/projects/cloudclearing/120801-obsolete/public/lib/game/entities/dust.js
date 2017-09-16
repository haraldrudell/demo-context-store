var DUST_TIME = 5;
var DUST_SIZE = 96;
var dustImagePath = 'media/img/buildings/dust.png';

ig.module(
    'game.entities.dust'
).requires(
    'impact.entity'
).defines(function()
          {
              EntityDust = ig.Entity.extend
              ({
                   type: ig.Entity.TYPE.NONE,
                   checkAgainst: ig.Entity.TYPE.NONE, 
                   collides: ig.Entity.COLLIDES.NONE,
                   animSheet: new ig.AnimationSheet(dustImagePath, DUST_SIZE, DUST_SIZE),
                   size: {x: DUST_SIZE, y: DUST_SIZE },
                   
                   init: function( caller ) {
                       this.done = false;
                       this.pos.x = caller.pos.x;
                       this.pos.y = caller.pos.y;  
                       this.addAnim( 'anim', 0.1, [0,1,2,3], false );
                       
                       this.timer = new ig.Timer(DUST_TIME);
                       // ig.merge( this, settings );
                   },
                   
                   complete: function() {
                       this.done = true;
                       console.log("note done");
                       this.vel.y = -1;
                   },
                   
                   update: function() {
                       this.parent();
                   },
                   
                   draw: function() {
                       this.parent();
                       // Call function to draw progress info
                       if( this.timer.delta() < 0 ){
                           // this.drawBar();
                       } else {
                           this.kill();
                       }        
                   }
                   
               });

          });