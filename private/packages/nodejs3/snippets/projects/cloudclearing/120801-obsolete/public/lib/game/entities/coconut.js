ig.module(
    'game.entities.coconut'
).requires(
    'game.entities.consumable',
    'impact.entity'
).defines(
    function()
    {
      EntityCoconut = EntityConsumable.extend(
        {
          animSheet: new ig.AnimationSheet( 'media/icons/64/coconut.png', 64, 64 ),
          bonus: {stamina: 100},
          size: {x: 64, y: 64},
          stats: {xp: 1, hp: 10},


          init: function(x, y, settings) {
            this.parent(x, y, settings)
            this.addAnim( 'idle', 1, [0], true );
            this.currentAnim = this.anims.idle;
          }
        });
    });
