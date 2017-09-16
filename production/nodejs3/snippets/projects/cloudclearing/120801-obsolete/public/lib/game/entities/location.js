/* notes: adding new locations
 * add here and also in game director
 * 
 * 
 */


var LOC_SIZE = 80;

ig.module(
    'game.entities.location'
).requires(
    'impact.entity',
    'game.entities.clickable'
).defines(function() {
              EntityLocation = EntityClickable.extend
              ({
                   size: {x: LOC_SIZE, y: LOC_SIZE },
                   type: ig.Entity.TYPE.B,
                   checkAgainst: ig.Entity.TYPE.NONE,
                   collides: ig.Entity.COLLIDES.NONE,

                   animSheet: new ig.AnimationSheet( 'media/img/cities/cities-anim-80.png', LOC_SIZE, LOC_SIZE),

                   init: function(x, y, settings) {

                       // these are hardwired currently
                       this.addAnim( 'newyork', 1, [1], true );
                       this.addAnim( 'paris', 1, [2], true );
                       this.addAnim( 'horror', 1, [3], true );
                       this.addAnim( 'venice', 1, [4], true );
                       this.addAnim( 'village', 1, [5], true );
                       this.addAnim( 'reef', 1, [6], true );
                       this.addAnim( 'bermuda', 1, [7], true );
                       this.addAnim( 'treasure', 1, [8], true );
                       this.addAnim( 'beach', 1, [9], true );

                       this.addAnim( 'worldmap', 1, [0], true );

                       this.parent(x, y, settings);    // retrieve locname

                       this.currentAnim = this.anims[this.locname];
                       console.log("found loca:" + this.locname );
                   },

                   pick: function() {
                       console.log("location.pick: " + this.locname);
                       gameDirector.jumpNamed(this.locname);
                       ig.game.updatePossibleLocation();
                   },

                   clicked: function() {
                     if (!ig.input.pressed('click') || !this.inFocus())
                       return false;
                     var inFocus = false;
                     ig.game.getEntitiesByType(EntityTourist).forEach(function(element){
                        if (element.inFocus())
                          inFocus = true;
                     });
                     return !inFocus;
                   },

                   update: function() {
                       if (this.clicked() ) {
                           this.pick();
                       }
                       this.parent();
                   }

               });
          });
