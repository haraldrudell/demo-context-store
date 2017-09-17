ig.module(
    'game.entities.clickable'
).requires(
    'impact.entity'
).defines(function()
          {
              EntityClickable = ig.Entity.extend
              ({

                   // config stuff
                   REZ: 2,
                   TOURIST_SPEED: 2,
                   TILE_SIZE: 40,
                   PATH_STEP: 10,

                   init: function(x, y, settings) {
                       this.picked = false;
                       this.parent(x, y, settings);
                   },

                   inFocus: function() {
                       // need coords offset on map game2world?
                       mousex = ig.input.mouse.x + ig.game.screen.x;
                       mousey = ig.input.mouse.y + ig.game.screen.y;
                       
                       // trouble with ints and strings >,<
                       xmax = this.pos.x + this.size.x;
                       ymax = this.pos.y + this.size.y;
                       
                       xhit = (this.pos.x <= mousex && mousex <= xmax );
                       yhit = (this.pos.y <= mousey && mousey <= ymax );
                       flag = xhit && yhit;                                              
                       return(flag);
                   },

                   clicked: function() {
                       return (ig.input.pressed('click') && this.inFocus());
                   }

               });
          });