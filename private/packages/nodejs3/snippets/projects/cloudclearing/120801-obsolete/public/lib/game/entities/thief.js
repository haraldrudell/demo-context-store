ig.module(
    'game.entities.thief'
)
    .requires(
        'impact.entity'
    )
    .defines(function(){
                 EntityThief = ig.Entity.extend
                 ({
                      size: {x: 40, y: 40},
                      offset: { x:20, y:20 },
                      
                      maxVel: {x: 100, y: 100},
                      friction: {x: 150, y: 0},
                      friendly: false,
                      
                      type: ig.Entity.TYPE.A, // Evil enemy group
                      checkAgainst: ig.Entity.TYPE.NONE, // Check against friendly
                      collides: ig.Entity.COLLIDES.PASSIVE,
                      entityType: 'hazard',

                      health: 10,
                      
                      
                      speed: 14,
                      flipX: false,
                      flipY: false,

                      animSheet: new ig.AnimationSheet( 'media/img/thief/thief.png', 80, 80 ),
                      
                      
                      init: function( x, y, settings ) {
                          this.parent( x, y, settings );
                          this.addAnim( 'crawl', 0.08, [0,1,2] );
                          this.health = 10;
                          this.movementTimerX = new ig.Timer();
                          this.movementTimerY = new ig.Timer();
                      },
                      
                      
                      update: function() {
//                        near an edge? return!
//                        if (ig.game.collisionMap.getTile(this.pos.x + (this.flipX ? 4 : this.size.x - 4), this.pos.y))
//                          this.flipX = !this.flipX;
//                        if (ig.game.collisionMap.getTile(this.pos.x, this.pos.y + (this.flipY ? -4 : this.size.y + 4)))
//                          this.flipY = !this.flipY;

                        if (this.movementTimerX.delta() > 0) {
                          if (Math.random() > 0.996) {
                            if (Math.random() > 0.8)
                              this.flipX = !this.flipX;
                            this.movementTimerX.set(2 + Math.random() * 4);
                            this.movementTimerX.reset();
//                            console.log('no X movement', this.movementTimerX.delta())
                            this.vel.x = 0;
                          } else {
                            this.vel.x = this.speed * (this.flipX ? -1 : 1);
                          }
                        }

                        if (this.movementTimerY.delta() > 0) {
                          if (Math.random() > 0.996) {
                            if (Math.random() > 0.8)
                              this.flipY = !this.flipY;
                            this.movementTimerY.set(2 + Math.random() * 4);
                            this.movementTimerY.reset();
//                            console.log('no Y movement', this.movementTimerY.delta())
                            this.vel.y = 0;
                          } else {
                            this.vel.y = this.speed * (this.flipY ? -1 : 1);
                          }
                        }


//                        this.vel.y = this.speed * (this.flipY ? -1 : 1);

                        this.parent();
                      },

                      handleMovementTrace: function( res ) {
                          this.parent( res );

//                          collision with a wall? return!
                          if( res.collision.x ) {
                              this.flipX = !this.flipX;
                          }
                        if( res.collision.y ) {
                          this.flipY = !this.flipY;
                        }
                      }//,
////
//                      check: function( other ) {
//                          other.receiveDamage( 1, this );
//                          other.showEmoji("sad");
//                          this.kill();
//                      }
                  });

             });
