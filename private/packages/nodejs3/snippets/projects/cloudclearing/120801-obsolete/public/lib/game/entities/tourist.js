
//FIXME - move to config section inside the parent Drawable object
var CURSOR_SZ=75;
var ENERGY_PER_VISIT = 20;
var STAMINA_PER_COLLISION = 20;
var HP_PER_COLLISION = 20;
var HP_PER_HAZARD = 20;
var STAMINA_PER_SECOND = 1;
var ENERGY_PER_SECOND = 1;
var IMPATIENT_STAMINA = 50;
var TOURIST_SPEED = 30;


var gTourist;

var touristImgPath = 'media/img/tourists/anims/t1-64.png';

ig.module(
    'game.entities.tourist'
).requires(
    'impact.entity',
    'game.entities.drawable'
).defines(function() {
              EntityTourist = EntityDrawable.extend
              ({
                   animSheet: new ig.AnimationSheet(touristImgPath, 64, 64), // graphic size
                   size: {x: 32, y: 32 },  // collision size
                   offset: {x: 16, y: 22 },  // collision offset from gaphic

                   type: ig.Entity.TYPE.B,
                   checkAgainst: ig.Entity.TYPE.BOTH,
                   collides: ig.Entity.COLLIDES.NEVER,
                   zIndex: 5,

		   // config 
                   entityType: 'tourist',
		   xpPenalty: -10,

                   // see also config vars in parent class for REZ etc

                   init: function(x, y, settings) {
                       this.addAnim('idle', 1, [0], true);
                       this.addAnim('walk', 0.2, [1,0,2,0], false);
                       this.addAnim('picked', 1, [3], true);
                       this.addAnim('dance', 0.05, [4,1,5,1], false);
                       this.addAnim('halo', 0.05, [6,7,1], false);
                       this.currentAnim = this.anims.idle;
                       this.parent(x, y, settings);
                       this.picked = false; // if user is dragging tourist
                       this.movingTourist = false; // if tourist is moving on path
                       this.lastFixedPath = null;  // last high path
                       this.step = 0; // for moving
                       this.coins = 0;
                       this.dragAnim = null;
                       this.paths = []; // walking path
                       this.note = null;
                       this.currentLocation = null;
                       this.collidingTourist = null;
                       this.visitTimer = null;
                       this.bubble = null;
                       this.gotVisitBonus = false;
                       this.health = 100;  // collide with thief reduces
                       this.impatientTimer = new ig.Timer(30);
                       this.statsPopup = null;
                       this.contactEdge = false;

                       // when colines with other player, stamina gets lower, user gets less money
                       this.stamina = 100;
                       // energy needed to move tourist. visiting one building consume 20
                       this.energy = 100;

                       this.variableTimer = new ig.Timer(); // timer for restoring energy/stamina
                       
                       this.delayedWant(500); // after config

                       gTourist = this;

                   },

                   showEmoji: function(mood) {
                       this.emoji = ig.game.spawnEntity( EntityEmo, this, mood);
                   },

                   emoHappy: function(wot) {
                       console.log("emoH", wot, this);
                       this.showEmoji("happy");
                   },

                   showBubble: function() {
                       this.bubble = ig.game.spawnEntity( EntityBubble, this);
                   },

                   startBub: function(str) {
                       this.wantMsg = str;
                       this.bubble = ig.game.spawnEntity( EntityBubble, this);
                   },

                   delayedWant: function(millis) {
                       this.wantMsg = null;
                       // bind this to this object, not javascript default of window
                       // see http://impactjs.com/documentation/class-reference/ig-core
                       setTimeout(this.newWant.bind(this), millis );
                   },

                   newWant: function() {
		                  if (ig.game.possibleLocations) {  // need this for editor
			                  this.wantMsg = ig.game.possibleLocations.random();
			                  console.log("newWant:" + this.wantMsg);
			                  this.showBubble();
		                  }
                   },

                   update: function() {
                       if (Math.random() > 0.999 && this.wantMsg) {
                           this.showBubble(); // Only show bubble
                       }

                       if (ig.input.pressed('click') && this.inFocus() && !ig.gameState.isDragging) {
                           this.showBubble();
                           this.statsPopup = ig.game.spawnEntity(EntityStatspop, this);
                           ig.gameState.isDragging = true;
                           this.edgeContact = false;
                           this.picked = true;
                           this.visitingLocation = false;
                           this.visitedBuildings = [];
                           if (this.note) {
                               this.note.kill();
                               this.note = null;
                           }
                           this.lastFixedPath = null;
                           //FIXME - jslint says line below is error
                           var path = null;
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


                       if (this.movingTourist) {
                           this.moveTourist();

                       } else if (this.picked) {
                           this.currentAnim = this.anims.picked;
                           if (ig.input.state('click')) {
                               this.storePath();
                           } else {
                               this.finishDragging();
                               this.statsPopup.kill();
                           }
                       } else {
                         this.body.angle = 0;
                         this.body.SetLinearVelocity({x: 0, y: 0});
                       }

                       if (this.variableTimer.delta() > 1) {
                           this.stamina = (this.stamina + STAMINA_PER_SECOND).limit(0, 100);
                           this.energy = (this.energy + ENERGY_PER_SECOND).limit(0, 100);
                           //  console.log(this.stamina, this.energy)
                           this.variableTimer.reset();
                       }

                       if (this.impatientTimer.delta() > 0) {
                         this.showEmoji("timeout");
                         this.impatientTimer.reset();
                         this.stamina = (this.stamina - IMPATIENT_STAMINA).limit(0, 100);
                       }

                       this.body.SetXForm(this.body.GetPosition(), 0);

                       this.parent();

                       if (this.body.m_contactList && this.body.m_contactList.contact) {
                         console.log(this.body.m_contactList);
                         this.edgeContact = true;
                       }

                   },

                   check: function(other) {
                       if (ig.gameState.isDragging)
                           return null;

                       switch(other.entityType){
                       case 'building':
                           if (!this.movingTourist)
                               this.checkAgainstBuilding(other);
                           break;
                       case 'tourist':
                           this.checkAgainstTourist(other);
                           break;
                       case 'hazard':
                           this.checkAgainstHazard(other);
                           break;
                       }
                       return true;
                   },

                   reset: function() {
                     this.currentAnim = this.anims.idle;
                   },

                   addBonus: function(bonuses) {
                     for (var bonus in bonuses) {
                       this.showEmoji("happy");
                       this[bonus] = (this[bonus] + bonuses[bonus]).limit(0, 100);
                     }
                   },

                   checkAgainstTourist: function(other) {
                       if (this.collidingTourist != other) {
                           this.collidingTourist = other;
                           this.stamina = (this.stamina - STAMINA_PER_COLLISION).limit(0, 100);
                           this.showEmoji("angry");
                           console.log('collided with tourist. Current stamina: ' + this.stamina);
                       }
                   },

                   arrived: function(other) {
                       var coins = 0;
                       if (other.visitType == this.wantMsg) {
                           this.impatientTimer.reset();
                           console.log('visited correct building');
                           this.showEmoji("happy");
                           this.delayedWant(100);
                           coins = other.coins();  // * this.stamina / 100;
                       } else {
                           this.showEmoji("angry");
                           console.log('visited wrong building:' + 
                                       other.visitType + " wanted:" + this.wantMsg);
                           coins = 0;
                       }
                       var noteParams = {caller: this, message: "+" + coins + "!!!!", time: 3};
                       this.note = ig.game.spawnEntity( EntityNote, 
                                                        this.pos.x, this.pos.y + 20, noteParams);
                       this.gotVisitBonus = true;
                       ig.gameState.statsbar.addStats({ coins: coins, xp: 2, hp: -1});
                   },

                   checkAgainstBuilding: function(other) {
                       if (other != this.currentLocation) {
                           other.tourist = this;
                           if (this.energy < ENERGY_PER_VISIT)
                               return false;
                           this.note = ig.game.spawnEntity( EntityNote, 
                                                            this.pos.x, this.pos.y + 20, 
                                                            {caller: this});
                           this.currentLocation = other;
                           this.visitTimer = new ig.Timer(5);
                           this.gotVisitBonus = false;
                           this.energy = (this.energy - ENERGY_PER_VISIT).limit(0, 100);
                       } else if (!this.gotVisitBonus && this.currentLocation && this.visitTimer.delta() > 0) {
                           this.arrived(other);
                       }
                       return true;
                   },

                   checkAgainstHazard: function(other) {
                      this.receiveDamage( 1, other );
                      this.showEmoji("sad");
                      ig.gameState.stats.xp = (ig.gameState.stats.xp - 10).limit(0, 100);
                      other.kill();
                   },

                   finishDragging: function() {
                       this.currentAnim = this.anims.walk;


                       this.picked = false;
                       ig.gameState.isDragging = null;
                       if (this.paths.length > 0) {
                         this.pushOnPath();
                         this.movingTourist = true;

                       }
                       this.currentLocation = null;
                       this.collidingTourist = null;

                   },

                   pushOnPath: function() {
                     this.body.SetLinearVelocity({x: 0, y: 0});
                     this.body.angle = 0;
                       this.body.ApplyImpulse(new b2.Vec2(this.nextCord('x'), 
                                                          this.nextCord('y')), 
                                              this.body.GetPosition());
                   },

                   moveTourist: function() {
                       if (this.paths.length > 0) {
                         if (this.edgeContact) {
                           var path;
                           while(path = this.paths.shift())
                             path.kill();
                         } else {
                           this.currentAnim.flip.x = true;

                           var x = Math.round(this.pos.x);
                           var y = Math.round(this.pos.y);

                           if (this.note) {
                             this.note.pos.x = x;
                             this.note.pos.y = y;
                           }
                           if ((x + this.TILE_SIZE / 2) == this.paths[0].pos.x && (y + this.TILE_SIZE / 2) == this.paths[0].pos.y) {
                             this.paths.shift().kill();
                           }
                           this.pushOnPath();
                         }
                       } else {
                           this.movingTourist = false;
                           this.currentAnim = this.anims.idle;
                           this.edgeContact = false;
                           this.body.SetLinearVelocity({x: 0, y: 0});
                           if (this.dragAnim) {
                               this.dragAnim.kill();
                           }
                           console.log("tourist visited: " + this.visitedBuildings);
                       }
                   },

//                   handleMovementTrace: function( res ) {
//                     if (ig.gameState.enabledCollisions && (res.collision.x || res.collision.y)) {
//                       console.log(res.collision.x, res.collision.y)
//                       if (this.note) {
//                         this.note.kill();
//                       }
//                       this.note = ig.game.spawnEntity(
//                         EntityNote, this.pos.x, this.pos.y + 20,
//                         {caller:this, message:"ouch!", time:3}
//                       );
//                       while (path = this.paths.shift()) {
//                         path.kill();
//                       }
//
//
//                       this.vel.x *= 100;
//                       this.vel.y *= 100;
//                       this.accel.x = this.vel.x / -100;
//                       this.accel.y = this.vel.y / -100;
//                       console.log(this.vel.x, this.vel.y, this.accel.x, this.accel.y)
////                       var dx = res.collision.x ? Math.floor(this.vel.x) * (-2) : 0;
////                       this.vel.x = 0;
////                       this.vel.y = 0;
////                       var dy = res.collision.y ? Math.floor(this.vel.y) * (-2) : 0;
////                       this.paths.push({pos:{x:this.pos.x + dx, y:this.pos.y + dy },kill:function() {}});
//                     }
//
//                     this.parent( res );
//                   },

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

                   nextCord: function(type) {
                       if (this.paths.length == 0)
                         return 0;
                       var next_cord = this.paths[0].pos[type];
                       var cord = Math.round(this.pos[type]) + this.TILE_SIZE / 2;
                       if (cord == next_cord)
                           return 0;
                       else
                           return ((cord > next_cord) ? -1 : 1) * TOURIST_SPEED / 2;
                   },

                   addDragAnim: function(cords) {
                       var x_diff = cords[0] - this.lastFixedPath[0];
                       var y_diff = cords[1] - this.lastFixedPath[1];
                       var x_step = (x_diff > 0) ? this.PATH_STEP : - this.PATH_STEP;
                       var y_step = (y_diff > 0) ? this.PATH_STEP : - this.PATH_STEP;
                       // abs(max_diff) / this.PATH_STEP
                       var len = Math.abs(((Math.abs(x_diff) > Math.abs(y_diff)) ? 
                                           x_diff : y_diff)) / this.PATH_STEP;
                       var x = this.lastFixedPath[0] + this.TILE_SIZE / 2;
                       var y = this.lastFixedPath[1] + this.TILE_SIZE / 2;
                       var new_x = 0;
                       var new_y = 0;

                       for (var i = 0; i < len; i++) {
                           this.paths.push(ig.game.spawnEntity(EntityTouristPath, x + new_x, y + new_y));
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
              
              EntityTouristPath = EntityDragCoursor.extend
              ({
                   size: {x: 12, y: 12 },
                   zIndex: 3,
                   animSheet: new ig.AnimationSheet('media/img/icons/donut-12-sm.png', 12, 12)
               });

          });
