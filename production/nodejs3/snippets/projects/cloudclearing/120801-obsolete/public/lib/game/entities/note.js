var NOTE_TIME = 5;

ig.module(
    'game.entities.note'
).requires(
    'impact.entity'
).defines(function()
          {
              EntityNote = ig.Entity.extend
              ({
                   type: ig.Entity.TYPE.NONE,
                   checkAgainst: ig.Entity.TYPE.NONE, 
                   collides: ig.Entity.COLLIDES.NONE,
                   noteTime: NOTE_TIME,
                   
                   init: function( x, y, options ) {
                       this.done = false;
                       this.ctx = ig.system.context;
                       // console.log(options);
                       this.caller = options.caller;
                       this.pos.x = this.caller.pos.x - ig.game.screen.x;
                       this.pos.y = this.caller.pos.y - ig.game.screen.y;
                       this.callerMessage = options.message;
                       if (options.time != undefined) {
                         this.noteTime = options.time;
                       }
                       
                       this.timer = new ig.Timer(this.noteTime);
                       // ig.merge( this, caller );
                   },
                   
                   drawBar: function(){
                      if (this.callerMessage == undefined) {
                       this.message(" " + (this.progress) + "%");
                       } else {
                         this.message(this.callerMessage);
                       }
                   },

                   message: function(str) {
                       // Select a different font and color here
                       if (this.callerMesage) {
                           this.ctx.font = "bold 16pt sans-serif";
                       } else {
                         this.ctx.font = "bold 16pt sans-serif";
                       }
                       this.ctx.fillStyle = "#FFFFFF";
                       // var txWidth = this.ctx.measureText(str).width + 10;
                       var barwide = this.progress / 2;
                       var px = this.caller.pos.x - ig.game.screen.x; 
                       var py = this.caller.pos.y - ig.game.screen.y;
                       this.ctx.fillRect(px -5 , py -20, barwide, 20);
                       this.ctx.fillStyle = "#000000";
                       this.ctx.fillText(str, px, py);
                   },

                   //FIXME - seems to get stomped on by update/draw cycle?
                   complete: function() {
                       this.done = true;
                       console.log("note done");
                       // this.message("done!");  // getting overwritten
                       setTimeout(this.kill, 1000);
                       this.vel.y = -1;
                   },

                   update: function() {   
                       this.progress = ((this.noteTime + this.timer.delta()) / this.noteTime * 100).round();
                       this.parent();
                   },
                   
                   draw: function() {
                       this.parent();
                       // Call function to draw progress info
                       if( this.timer.delta() < 0 ){
                           this.drawBar();
                       } else {
                           this.kill();
                       }        
                   }
                   
               });

          });