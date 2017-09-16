ig.module(
    'game.entities.statspop'
).requires(
    'impact.entity',
    'game.entities.tracker'
).defines(function()
          {
              EntityStatspop = EntityTracker.extend
              ({
		   animSheet: new ig.AnimationSheet('media/img/bubbles/stamina-bar.png', 80, 40),
		   size: {x: 100, y: 100 },

		   init: function(caller) {
                       console.log("new bubble");
                       this.parent(caller);
                       this.pos.x = caller.pos.x + 20;
                       this.pos.y = caller.pos.y - 110;
                       this.timer = null;
		   },

		   draw: function() {
                       this.parent();
		       var px = this.pos.x - ig.game.screen.x;
		       var py = this.pos.y - ig.game.screen.y;
                       this.ctx.fillStyle = "#FFFFFF";
                       this.ctx.font = "bold 8pt sans-serif";
                       this.ctx.fillText("stamina: " + this.caller.stamina, px, py);
		   }

               });
          });
