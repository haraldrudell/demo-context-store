ig.module(
    'game.entities.treasure'
).requires(
    'impact.entity',
    'game.entities.clickable'
).defines(
    function()
    {
        EntityTreasure = ig.Entity.extend
        ({
             animSheet: new ig.AnimationSheet( 'media/special/treasure-64.png', 64, 96 ),
             // visitType: 'treasure',
             size: { x:48, y:48},
             offset: {x: 8, y: 40},

             init: function(x, y, settings) {
                 this.parent(x, y, settings);
                 this.addAnim( 'idle', 1, [0], true );
                 this.addAnim( 'open', 0.1, [0,1,2,3,4], true );
                 this.addAnim( 'close', 1, [4,3,2,1,0], true );
                 this.addAnim( 'glow', .1, [4,5,6,7,6,5], false );
                 this.state = 0;
             },

             triggeredBy: function(other, trig) {
                 if (trig.evt == "open" ) {
                     this.currentAnim = this.anims['open'];
                     setTimeout(this.glow.bind(this), 500 );
                 } else {
                     this.currentAnim = this.anims['close'];
                 }
                 this.state = trig.evt;
             },

             glow: function() {
                 this.currentAnim = this.anims['glow'];
             },

             update: function() {
                 this.parent();
             }


         });

    });
