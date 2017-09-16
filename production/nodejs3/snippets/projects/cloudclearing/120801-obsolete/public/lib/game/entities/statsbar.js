ig.module(
    'game.entities.statsbar'
).requires(
    'impact.entity'
).defines(function()
          {
              EntityStatsbar = ig.Entity.extend
              ({
                   animSheet: new ig.AnimationSheet('media/img/bubbles/bubble-100x50.png', 100, 50),
                   size: {x: 100, y: 100 },
                   
                   //TODO - stats data should be coming from database
                   // but kept around in memory
                   // maybe store in this object rather than global ig.gameState ?
                   // but this object gets reloaded every level, so data will get reset
                   init: function(data) {
                       console.log("statsbar.init");
                       this.ctx = ig.system.context;
                       this.parent();
                   },
                   
                   draw: function() {
                       var px = 20;
                       var py = 10;
                       var str = "coins: " + ig.gameState.stats.coins +
                           " | rep: " + ig.gameState.stats.xp +
                           " | hp: " + ig.gameState.stats.hp;
                       this.ctx.fillStyle = "#FFFFFF";
                       this.ctx.roundRect(px-10, py, 300, 30, 10).fill();
                       this.ctx.fillStyle = "#000000";                       
                       this.ctx.font = "bold 12pt sans-serif";
                       this.ctx.fillText(str, px, py+20);
                       this.parent();
                   },

                   addStats: function(obj) {
                       for (prop in obj) {
                           ig.gameState.stats[prop] += obj[prop];
                       }
                   }

               });

          });

