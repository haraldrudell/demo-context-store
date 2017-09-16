var hitobj;

ig.module(
    'game.entities.building'
).requires(
    'impact.entity',
    'game.entities.clickable'
).defines(
    function(){
        EntityBuilding = EntityClickable.extend
        ({
             size: {x: 64, y: 64},
             offset: {x: 0, y: 0},
             type: ig.Entity.TYPE.A,
             checkAgainst: ig.Entity.TYPE.NONE,
             collides: ig.Entity.COLLIDES.NEVER,
             friendly: true,
             entityType: 'building',
             maxStage: 0, // default
	           buildStage: 0,
             visitable: true,

             // default gets overridden by child
             animSheet: new ig.AnimationSheet( 'media/img/buildings/storeanim-80.png', 80, 80 ),
             
             init: function( x, y, settings ) {
		 // can override in children
                 this.addAnim( 'idle0', 1, [0], true );
                 this.addAnim( 'idle1', 1, [1], true );
                 this.addAnim( 'idle2', 1, [2], true );
                 this.addAnim( 'idle3', 1, [3], true );
                 this.addAnim( 'idle4', 1, [4], true );
                 this.addAnim( 'idle5', 1, [5], true );
                 this.addAnim( 'idle6', 1, [6], true );
                 this.parent( x, y, settings );
                 this.picked = false;
                 this.bought = settings.bought;
                 this.tourist = null;
                 hitobj = this;  // global for debug
		 this.parent(x,y,settings);
             },

             coins: function() {
               return [10, 20, 50, 100].random() * (this.buildStage + 1);  
             },

             showEmoji: function(mood) {
                 this.emoji = ig.game.spawnEntity( EntityEmo, this, mood);
             },

             build: function() {
                 this.progress = 0;
                 this.state = "building";
                 this.dust = ig.game.spawnEntity( EntityDust, this );
             },
             
             buildDone: function() {
                 this.note.complete();
                 this.note.complete();
                 this.progress = 0;
                 this.state = "idle";
                 this.showEmoji('star');
                 ig.gameState.statsbar.addStats({ coins: -100, xp: 10, hp: -10});
                 this.buildStage++;
		 this.buildStage = Math.min(this.buildStage, this.maxStage);
             },

             // clicked on
             clicked: function() {
                 if (this.bought) {
                   this.bough = false;
                   this.startBuilding();
                 } else {
                   ig.game.showDialog("do you want to upgrade this building?", this, "startBuilding");
                 }
             },

             startBuilding: function() {
                 if (this.state == "building") {
                     this.offerSpeedup();
                 } else {
                     this.build();
                 }
                 this.picked=true;
                 this.showState();
                 console.log("pick building");
             },
             
             showState: function() {
                 var settings = {
                     progress: this.progress, 
                     vel: {x: 0, y: -1}, 
                     flip: this.flip,
                     caller: this
                 };
                 var NOTEOFFSETY = 20;
                 if (this.note) {
                     this.note.kill();
                 }
                 this.note = ig.game.spawnEntity( EntityNote, this.pos.x, this.pos.y + NOTEOFFSETY, {caller: this} );
                 console.log("progbar:" + this.note);
             },

             touristInside: function() {
               if (this.tourist) {
                 if (this.touches(this.tourist)) {
                   return true
                 } else {
                   this.tourist = null
                   return false;
                 }
               } else {
                 return false;
               }
             },

          selected: function() {
               return ig.input.pressed('click') && this.inFocus() && !this.touristInside();
             },

             
             update: function() {
                 if (this.selected()) {
                     this.clicked();
                 }
                 if (this.state == "building") {
                     this.progress++;
                     this.note.progress = this.progress;
                     if (this.progress >= 100) {
                         this.buildDone();
                     }
                 } 
                 var animName = "idle" + this.buildStage;
                 var anim = this.anims[animName];
                 this.currentAnim = anim;
                 this.parent();
             },
             
             offerSpeedup: function() {
                 popup("boost", true, this);
             },
             
             buyItem: function(wot) {
                 console.log("building - bought:" + wot);
                 if (wot == "boost1") {
                     this.state = "done";
                     this.currentAnim = this.anims.done;
                 }
             }

         });

    });
