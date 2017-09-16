var glob;
var gameDirector;// global to navigate levels
var pk = {};// global pikkle namespace

/* notes:
 to add new levels
 you need to add to the "director\" code below"
*/

ig.module(
    'game.main' 
).requires(
    'impact.game',
    'impact.font',

    // comment out for production!
    // 'impact.debug.debug',

    'plugins.box2d.game',
    'plugins.director',

    // base classes
    'game.entities.drawable',
    'game.entities.clickable',
    'game.entities.consumable',

    'game.entities.player',
    'game.entities.tourist',
    'game.entities.note',
    'game.entities.dust',
    'game.entities.location',

    'game.entities.thief',
    'game.entities.treasure',

    // player tracking items
    'game.entities.tracker',
    'game.entities.bubble',
    'game.entities.statspop',
    'game.entities.emo',

    // ui items
    'game.entities.statsbar',

    'game.entities.diver',
    'game.entities.zebrafish',
    'game.entities.seahorse',

    // buildings
    'game.entities.building',
    'game.entities.cafe',
    'game.entities.store',

    'game.entities.beachhouse',
    'game.entities.palmtree',

    //active items
    'game.entities.coffee',
    'game.entities.photo',
    'game.entities.relax',
    
    'game.entities.cocktail',
    'game.entities.coconut',
    'game.entities.drink',

    'game.entities.billboard',
    'game.entities.trigger',


    'game.entities.ball',
    'game.entities.goal',

    // levels
    'game.levels.worldmap',
    'game.levels.paris',
    'game.levels.newyork',
    'game.levels.bermuda',
    'game.levels.reef',
    'game.levels.village',
    'game.levels.village2',
    'game.levels.beach',
    'game.levels.arena'


).defines(function(){

              //TODO - game doesnt need to be using box2d? will make it faster...
              MyGame = ig.Box2DGame.extend
              ({
                   gravity: 0, // All entities are affected by this

                   // Load a font
                   font: new ig.Font( 'media/04b03.font.png' ),
                   clearColor: '#1b2026',
                   // friction: {x:10, y: 10},

                   //TODO - this should read player state from server/DB
                   // only when needed?
                   loadState: function() {
                       ig.gameState = {};
                       ig.gameState.stats = {
                           coins: 1000,
                           hp: 100,
                           xp: 20
                       };
                   },
                   
                   init: function() {
                       this.loadState();
                       ig.gameState.enabledCollisions = true;

                       // Bind keys
                       ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
                       ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
                       ig.input.bind( ig.KEY.UP_ARROW, 'up' );
                       ig.input.bind( ig.KEY.DOWN_ARROW, 'down' );
                       ig.input.bind( ig.KEY.X, 'jump' );
                       ig.input.bind( ig.KEY.C, 'shoot' );

                       ig.input.bind(ig.KEY.MOUSE1, 'click');
                       this.mouseLast = {};
                       
                       gameDirector = new ig.Director(this, LevelArena,
                                                      [LevelWorldmap, LevelNewyork, 
                                                       LevelParis, LevelBermuda, LevelReef, 
						                                           LevelVillage, LevelBeach, LevelVillage2],
                                                      ["arena", "worldmap", "newyork", 
                                                       "paris", "bermuda", "reef", 
						                                           "village", "beach", "village2" ]);

                       // gameDirector.jumpNamed("newyork");
                       gameDirector.jumpTo(LevelArena);
                       this.currentDialog = null;
                       this.updatePossibleLocation();
                   },

                   updatePossibleLocation: function() {
                     this.possibleLocations = [];
                     this.entities.forEach(function(entity) {
                       if (entity.visitType && entity.visitable && ig.game.possibleLocations.indexOf(entity.visitType) == -1) {
                         ig.game.possibleLocations.push(entity.visitType);
                       }
                     });
                     console.log(this.possibleLocations);
                   },

                   loadLevel: function( data ) {
                       this.parent( data );
                       for( var i = 0; i < this.backgroundMaps.length; i++ ) {
                           this.backgroundMaps[i].preRender = false;
                       }
                       var tilesize = ig.game.backgroundMaps[0].tilesize;
                       pk.maxWidth = ig.game.backgroundMaps[0].width * tilesize;
                       pk.maxHeight = ig.game.backgroundMaps[0].height * tilesize;
                       // stats are last
                       ig.gameState.statsbar = ig.game.spawnEntity(EntityStatsbar, {} );
                   },

                   // followPlayer: function() {
                   //     // screen follows the player
                   //     var player = this.getEntitiesByType( EntityPlayer )[0];
                   //     if( player ) {
                   //         this.screen.x = player.pos.x - ig.system.width/2;
                   //         this.screen.y = player.pos.y - ig.system.height/2;
                   //     }
                   // },
                   
                   update: function() {    

                       if (ig.input.pressed('click')) {
                           this.stashMouse();
                           if (ig.gameState.mode == "building") {
                               console.log("build here");
                               this.buildItem();
                           }
                       }
                       
                       if (ig.input.state('click') && !ig.gameState.isDragging ) {
                           this.dragMap();
                       }
                       
                       // Update all entities and BackgroundMaps
                       this.parent();
                   },
                   
                   draw: function() {
                       // Draw all entities and BackgroundMaps
                       this.parent();
                       if( !ig.ua.mobile ) {
//                           this.font.draw( 'Arrow Keys, X, C', 2, 2 );
                           this.font.draw( ig.input.mouse.x + "x" + ig.input.mouse.y, 2, 2 );
                       }
                   },
                   
                   stashMouse: function() {
                       // cos all JS is a pointer, so need to use the ints directly..
                       this.mouseLast.x = ig.input.mouse.x;
                       this.mouseLast.y = ig.input.mouse.y;
                   },

                   dragMap: function() {
                       var dx = ig.input.mouse.x - this.mouseLast.x;
                       var dy = ig.input.mouse.y - this.mouseLast.y;

                       var newx = ig.game.screen.x - dx;
                       var newy = ig.game.screen.y - dy;
                       newx = Math.max(newx, 0);
                       newy = Math.max(newy, 0);
                       newx = Math.min(newx, pk.maxWidth - ig.system.width);
                       newy = Math.min(newy, pk.maxHeight  - ig.system.height);

                       //FIXME - stop screen being dragged off
                       // based on mapheight and window height
                       // need to find out height of the map? background
                       ig.game.screen.x = newx;
                       ig.game.screen.y = newy;
                       // console.log(newx + "," + newy);
                       this.stashMouse();
                   },
                   
                   // drawPaths: function() {
                   //     console.log("drawPaths");
                   //     px = ig.input.mouse.x + ig.game.screen.x;
                   //     py = ig.input.mouse.y + ig.game.screen.y;
                   //     // var tile = ig.Map.getTile( px, py);
                   //     // console.log(tile);
                   // },
                   
                   // called from HTML page when you place a building
                   buildMode: function(itemName) {
                       console.log("building:" + itemName);
                       ig.gameState.mode = "building";
                       ig.gameState.buildItem = itemName;
                   },
                   
                   buildItem: function() {
                       gx = ig.input.mouse.x + ig.game.screen.x;
                       gy = ig.input.mouse.y + ig.game.screen.y;
                       building = this.spawnEntity( EntityBuilding, gx, gy, {bought: true});
                       console.log("building at:" + gx + ", " + gy);
                       ig.gameState.mode = "waiting"; // FIXME? default state
                   },

                  showDialog: function(message, caller, yesFunction, noFunction) {
                    if (this.currentDialog) {
                        return false;
                    } else {
                        this.currentDialog = {true: yesFunction, false: noFunction, caller: caller};
                        ig.$("#dialog").style.visibility = 'visible';
                        ig.$("#dialog_message").innerHTML = message;
                    }
		                  // fixme - return a value here too
                  },

                  dialogAction: function(flag) {
                    var func = this.currentDialog[flag];
                    if (func) {
                      this.currentDialog.caller[func]();
                    }
                    this.currentDialog = null;
                  },

                   fight: function(d1, d2) {
                       // var d1 = { name: "p1", likes: 10, videos: 3 };
                       console.log("d2", d2);
                       p1 = ig.game.getEntityByName("p1");
                       p2 = ig.game.getEntityByName("p2");
                       console.log("fight", d1, d2);
                       console.log("fight", p1, p2);

                       console.log("d1 likes", d1.likes);

                       p2.currentAnim.flip.x = true;

                       p1.paths.push(ig.game.spawnEntity(EntityTouristPath, 300, 300));
                       p1.paths.push(ig.game.spawnEntity(EntityTouristPath, 300, 250));
                       p1.paths.push(ig.game.spawnEntity(EntityTouristPath, 400, 220));
                       p1.paths.push(ig.game.spawnEntity(EntityTouristPath, 400, 280));
                       p1.delayedWant(1000);
                       p1.delayedWant(5000);

                       p1.showEmoji("happy");
                       p2.showEmoji("angry");

                       window.setTimeout( function() {
                                              p1.showEmoji("star");
                                          }, 2000);

                       window.setTimeout( function() {
                                              p1.showEmoji("heart");
                                          }, 8000);

                       // window.setTimeout( p2.showEmoji("angry"), 100);
                       // window.setTimeout( p1.emoHappy, 100);

                       p2.paths.push(ig.game.spawnEntity(EntityTouristPath, 450, 200));
                       p2.paths.push(ig.game.spawnEntity(EntityTouristPath, 350, 300));
                       p2.paths.push(ig.game.spawnEntity(EntityTouristPath, 400, 300));
                       p2.paths.push(ig.game.spawnEntity(EntityTouristPath, 550, 300));

                       window.setTimeout( function() {
                                              p2.showEmoji("coin");
                                          }, 500);

                       window.setTimeout( function() {
                                              p2.showEmoji("sad");
                                          }, 8000);

                       
                       // p1.startBub(d1.nickname);
                       p1.startBub(d1.nickname);
                       p2.startBub(d2.nickname);

                       p2.delayedWant(5000);
                       p2.delayedWant(8000);

                       p1.movingTourist=true;
                       p2.movingTourist=true;
                       
                   }

               });


              if( ig.ua.iPad ) {
		  console.log("ua.iPad");
                  // ig.Sound.enabled = false;
                  // ig.main('#canvas', MyGame, 60, 240, 160, 4);
		  console.log("ua.mobile");
                  ig.Sound.enabled = false;
                  var scaleFactor = 2 * ig.ua.pixelRatio;
                  ig.main('#canvas', MyGame, 30, 640, 800, 1);
                  ig.system.canvas.style.width = '640px';
                  ig.system.canvas.style.height = '800px';
              } else if( ig.ua.mobile ) {   
		  console.log("ua.mobile");
                  ig.Sound.enabled = false;
                  var scaleFactor = 2 * ig.ua.pixelRatio;
                  ig.main('#canvas', MyGame, 30, 320, 400, 1);
                  ig.system.canvas.style.width = '320px';
                  ig.system.canvas.style.height = '400px';
                  
                  // ig.$('#body').style.height = '800px';
              }
              else {
		              // default
		              console.log("ua.default", ig.ua);
                  ig.main('#canvas', MyGame, 30, 320, 400, 1);
              }

          });
