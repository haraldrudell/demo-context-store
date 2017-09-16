var BUBBLE_TIME = 5;

ig.module(
    'game.entities.bubble'
).requires(
    'impact.entity',
    'game.entities.tracker'
).defines(function()
          {
              EntityBubble = EntityTracker.extend
              ({
                   animSheet: new ig.AnimationSheet('media/img/bubbles/bubble-100x50.png', 100, 50),
                   size: {x: 100, y: 100 },
                   
                   init: function(caller) {
                       console.log("new bubble");
                       this.parent(caller);
                       this.timer = new ig.Timer(BUBBLE_TIME);
                   },
                   
                   complete: function() {
                       console.log("bubble done");
                   },
                   
                   draw: function() {
                       this.parent();
                       var px = this.caller.pos.x - ig.game.screen.x + 5; 
                       var py = this.caller.pos.y - ig.game.screen.y - 20;
                       this.ctx.fillStyle = "#000000";
                       this.ctx.font = "bold 12pt sans-serif";
                       this.ctx.fillText(this.caller.wantMsg, px, py);
                   }
                   
               });

          });
