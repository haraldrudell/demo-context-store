var TRACKER_TIME = 5;  // default

ig.module(
    'game.entities.tracker'
).requires(
    'impact.entity'
).defines(function()
          {
              EntityTracker = ig.Entity.extend
              ({
                   type: ig.Entity.TYPE.NONE,
                   checkAgainst: ig.Entity.TYPE.NONE, 
                   collides: ig.Entity.COLLIDES.NONE,
                   animSheet: new ig.AnimationSheet('media/img/bubbles/bubble-100x50.png', 100, 50),
                   size: {x: 100, y: 100 },
                   
                   init: function(caller) {
                       this.caller = caller;
                       this.done = false;
                       this.pos.x = caller.pos.x ;
                       this.pos.y = caller.pos.y - 50;
                       this.addAnim( 'anim', 0.2, [0], false );
                       this.ctx = ig.system.context;
                       this.vel.y = 0;

                       // create timer in child instance
                       // this.timer = new ig.Timer(TRACKER_TIME);
                       // ig.merge( this, settings );
                   },
                   
                   complete: function() {
                       this.done = true;
                       console.log("note done");
                   },
                   
                   draw: function() {
                       this.pos.x = this.caller.pos.x ;
                       this.pos.y = this.caller.pos.y - 50 - this.vel.y;
                       this.parent();

                       if(this.timer && this.timer.delta() > 0 ){
                           this.kill();
                       }
                   }
                   
               });

          });
