// var TILE_SIZE = 40;
// var this.PATH_STEP = 1;
// var REZ = 10;

var CURSOR_SZ=75;

var ENERGY_PER_VISIT = 20;
var STAMINA_PER_COLLISION = 20;
var HP_PER_COLLISION = 20;
var HP_PER_HAZARD = 20;
var STAMINA_PER_SECOND = 1;
var ENERGY_PER_SECOND = 1;
var WRONG_LOCATION_PENALTY = 0.2;

var WOBBLE_SPEED = 0.1;  // diver waves up and down

var gDiver;

var diverImgPath = 'media/scuba/32px/diver.png';

ig.module(
    'game.entities.diver'
).requires(
    'impact.entity',
    'game.entities.drawable'
).defines(function() {
              EntityDiver = EntityDrawable.extend
              ({
                   animSheet: new ig.AnimationSheet(diverImgPath, 32, 32), // graphic size
                   size: {x: 32, y: 32 },  // collision size
                   offset: {x: 0, y: 0 },  // collision offset from gaphic

                   type: ig.Entity.TYPE.B,
                   checkAgainst: ig.Entity.TYPE.BOTH,
                   collides: ig.Entity.COLLIDES.NEVER,
                   zIndex: 5,
                   entityType: 'diver',

                   init: function(x, y, settings) {
                       this.addAnim('idle', 1, [0], true);
                       this.addAnim('walk', 0.2, [0], false);
                       this.addAnim('picked', 1, [0], true);
                       this.currentAnim = this.anims.idle;
                       this.parent(x, y, settings);
                       this.picked = false; // if user is dragging diver
                       this.movingDiver = false; // if diver is moving on path
                       this.lastFixedPath = null;  // last high path
                       this.step = 0; // for moving
                       this.coins = 0;
                       this.dragAnim = null;
                       this.paths = []; // walking path
                       this.note = null;
                       this.currentLocation = null;
                       this.collidingDiver = null;
                       this.visitTimer = null;
                       this.bubble = null;
                       this.gotVisitBonus = false;
                       this.stamina = 100;// when colines with other player, stamina gets lower, user gets less money 
                       this.energy = 100;// energy needed to move diver. visiting one building consume 20
                       this.variableTimer = new ig.Timer(); // timer for restoring energy/stamina
                       this.wantMsg = ['cafe', 'store'].random();
                       this.sinAngle = 0.0;

                       gDiver = this;

                   },

                   showBubble: function() {
                       // choose new bubble
                       this.wantMsg = "cafe";
                       this.bubble = ig.game.spawnEntity( EntityBubble, this);
                   },

                   //FIXME - this causes diver to freeze...
                   wobble: function() {
                       return;
                       this.sinAngle += WOBBLE_SPEED;
                       var wobbleDist = Math.sin(this.sinAngle);
                       this.pos.y += wobbleDist;
                   },

                   update: function() {
                       if (Math.random() > 0.9999) {
                           this.wantMsg = ['cafe', 'store'].random();
                           this.showBubble();
                       }
                       if (ig.input.pressed('click') && this.inFocus() && !ig.gameState.isDragging) {
                           this.showBubble();
                           ig.gameState.isDragging = true;
                           this.picked = true;
                           this.visitingLocation = false;
                           this.visitedBuildings = [];
                           if (this.note) {
                               this.note.kill();
                               this.note = null;
                           }
                           this.currentLocation = null;
                           this.lastFixedPath = null;
                           //FIXME - jslint says line below is error
                           while (path = this.paths.shift() ) {
                               path.kill();
                           }

                           this.step = 0;
                           if (this.dragAnim) {
                               this.dragAnim.kill();
                           }

                           this.dragAnim = ig.game.spawnEntity(
                               EntityDragCoursor, 
                               this.pos.x + ig.game.screen.x, this.pos.y + ig.game.screen.y
                           ); // dragging cursor
                       }

                       if (this.currentLocation && !this.touches(this.currentLocation)) {
                           if (this.note) {
                               this.note.timer.set(-10);
                               this.note = null;
                           }
                           this.currentLocation = null;
                           this.timmer = null;
                       }

                       if (this.movingDiver) {
                           this.moveDiver();
                       } else {
                       }

                       this.wobble();

                       if (this.picked) {
                           this.currentAnim = this.anims.picked;
                           if (ig.input.state('click')) {
                               this.storePath();
                           } else {
                               this.finishDragging();
                           }
                       }

                       if (this.variableTimer.delta() > 1) {
                           this.stamina = (this.stamina + STAMINA_PER_SECOND).limit(0, 100);
                           this.energy = (this.energy + ENERGY_PER_SECOND).limit(0, 100);
                           //  console.log(this.stamina, this.energy)
                           this.variableTimer.reset();
                       }

                       this.parent();
                   },

                   check: function(other) {
                       if (ig.gameState.isDragging)
                           return null;

                       switch(other.entityType){
                       case 'building':
                           if (!this.movingDiver)
                               this.checkAgainstBuilding(other);
                           break;
                       case 'diver':
                           this.checkAgainstDiver(other);
                           break;
                       case 'hazard':
                           this.checkAgainstHazard(other);
                           break;
                       }
                       return true;
                   },

                   checkAgainstDiver: function(other) {
                       if (this.collidingDiver != other) {
                           this.collidingDiver = other;
                           this.stamina = (this.stamina - STAMINA_PER_COLLISION).limit(0, 100);
                           console.log('collided with diver. Current stamina: ' + this.stamina);
                       }
                   },

                   checkAgainstBuilding: function(other) {
                       if (other != this.currentLocation) {
                           if (this.energy < ENERGY_PER_VISIT)
                               return false;
                           this.note = ig.game.spawnEntity( EntityNote, this.pos.x, this.pos.y + 20, {caller: this});
                           this.currentLocation = other;
                           this.visitTimer = new ig.Timer(5);
                           this.gotVisitBonus = false;
                           this.energy = (this.energy - ENERGY_PER_VISIT).limit(0, 100);
                       } else if (!this.gotVisitBonus && this.currentLocation && this.visitTimer.delta() > 0) {
                           var coins = other.coins() * this.stamina / 100;
                           if (other.visitType == this.wantMsg) {
                               console.log('visited correct building!!!');
                           } else {
                               coins *= WRONG_LOCATION_PENALTY;
                           }
                           var noteParams = {caller: this, message: "+" + coins + "!!!!", time: 3};
                           this.gotVisitBonus = true;
                           this.coins += coins;
                           this.note = ig.game.spawnEntity( EntityNote, this.pos.x, this.pos.y + 20, noteParams);
                       }
                       return true; // jslint requires return
                   },

                   checkAgainstHazard: function(other) {
                       
                   },

                   finishDragging: function() {
                       this.picked = false;
                       ig.gameState.isDragging = null;
                       if (this.paths.length > 0)
                           this.movingDiver = true;
                   },

                   moveDiver: function() {
                       if (this.paths.length > 0) {
                           this.currentAnim = this.anims.walk;

                           //FIXME - only if moving left then flip anim
                           this.currentAnim.flip.x = true;

                           this.step += 1;
                           if (this.step == this.DRAWABLE_SPEED) {
                               this.step = 0;
                               var dx = this.nextCord(this.pos.x + this.TILE_SIZE / 2, this.paths[0].pos.x);
                               var dy = this.nextCord(this.pos.y + this.TILE_SIZE / 2, this.paths[0].pos.y);

                               var result = ig.game.collisionMap.trace(this.pos.x, this.pos.y, dx, dy, 40, 40);
                               if (ig.gameState.enabledCollisions && (result.collision.x || result.collision.y)) {
                                   if (this.note)
                                       this.note.kill();
                                   this.note = ig.game.spawnEntity( EntityNote, 
                                                                    this.pos.x, this.pos.y + 20, 
                                                                    {caller: this, 
                                                                     message: "ouch!", time: 3});
                                   while (path = this.paths.shift()) {
                                       path.kill();
                                   }
                                   if (result.collision.x) dx = dx * (-40);
                                   if (result.collision.y) dx = dy * (-40);
                                   this.paths.push({pos: {x: this.pos.x + dx, y: this.pos.y + dy }, 
                                                    kill: function(){}});
                               } else {
                                   this.pos.x += dx;
                                   this.pos.y += dy;
                                   if (this.note) {
                                       this.note.pos.x = this.pos.x;
                                       this.note.pos.y = this.pos.y;
                                   }
                                   if ((this.pos.x + this.TILE_SIZE / 2) == this.paths[0].pos.x && 
                                       (this.pos.y + this.TILE_SIZE / 2) == this.paths[0].pos.y) {
                                       this.paths.shift().kill();
                                   }
                               }
                           }
                       } else {
                           this.movingDiver = false;
                           this.currentAnim = this.anims.idle;
                           if (this.dragAnim) {
                               this.dragAnim.kill();
                           }
                           console.log("diver visited: " + this.visitedBuildings);
                       }
                   },

                   storePath: function() {
                       var c_x = ig.input.mouse.x + ig.game.screen.x - this.TILE_SIZE / 2;
                       var c_y = ig.input.mouse.y + ig.game.screen.y - this.TILE_SIZE / 2;
                       var cords = [Math.round(c_x / (this.TILE_SIZE / this.REZ)) * (this.TILE_SIZE / this.REZ),
                                    Math.round(c_y / (this.TILE_SIZE / this.REZ)) * (this.TILE_SIZE / this.REZ)];

                       if (!this.lastFixedPath || this.lastFixedPath[0] != cords[0] || 
                           this.lastFixedPath[1] != cords[1]) {
                           if (this.lastFixedPath) {
                               this.addDragAnim(cords);
                           }
                           this.lastFixedPath = cords;

                       }
                       this.dragAnim.updatePosition();
                   },


                   nextCord: function(cord, next_cord) {
                       if (cord == next_cord)
                           return 0;
                       else
                           return (cord > next_cord) ? -1 : 1;
                   },


                   addDragAnim: function(cords) {
                       var x_diff = cords[0] - this.lastFixedPath[0];
                       var y_diff = cords[1] - this.lastFixedPath[1];
                       var x_step = (x_diff > 0) ? this.PATH_STEP : - this.PATH_STEP;
                       var y_step = (y_diff > 0) ? this.PATH_STEP : - this.PATH_STEP;
                       // abs(max_diff) / this.PATH_STEP
                       var len = Math.abs(((Math.abs(x_diff) > Math.abs(y_diff)) ? x_diff : y_diff)) / this.PATH_STEP;
                       var x = this.lastFixedPath[0] + this.TILE_SIZE / 2;
                       var y = this.lastFixedPath[1] + this.TILE_SIZE / 2;
                       var new_x = 0;
                       var new_y = 0;

                       for (var i = 0; i < len; i++) {
                           this.paths.push(ig.game.spawnEntity(EntityDiverPath, x + new_x, y + new_y));
                           if (Math.abs(x_diff - new_x) > 0) new_x += x_step;
                           if (Math.abs(y_diff - new_y) > 0) new_y += y_step;
                       }
                   }
               });

              EntityDragCoursor = ig.Entity.extend
              ({
                   size: {x: 20, y: 20},
                   type: ig.Entity.TYPE.NONE,
                   checkAgainst: ig.Entity.TYPE.B,
                   collides: ig.Entity.COLLIDES.NEVER,
                   animSheet: new ig.AnimationSheet('media/img/icons/cursor-75.png', CURSOR_SZ, CURSOR_SZ),
                   init: function(x, y, settings) {
                       this.parent(x, y, settings);
                       this.addAnim('idle', 1, [0]);
                   },

                   updatePosition: function() {
                       this.pos.x = ig.input.mouse.x + ig.game.screen.x - CURSOR_SZ/2;
                       this.pos.y = ig.input.mouse.y + ig.game.screen.y - CURSOR_SZ/2;
                   }

               });
              
              EntityDiverPath = EntityDragCoursor.extend
              ({
                   size: {x: 3, y: 3 },
                   zIndex: 3,
                   animSheet: new ig.AnimationSheet('media/img/icons/redframe-40x40.png', 3, 3)
               });

          });
