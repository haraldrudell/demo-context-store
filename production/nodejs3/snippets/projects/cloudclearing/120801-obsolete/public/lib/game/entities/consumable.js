ig.module(
    'game.entities.consumable'
).requires(
    'plugins.box2d.entity'
).defines(
    function()
    {
      EntityConsumable = ig.Box2DEntity.extend(
        {
          type: ig.Entity.TYPE.NONE,
          checkAgainst: ig.Entity.TYPE.B,
          collides: ig.Entity.COLLIDES.NEVER,
          offset: {x: 0, y: 0},
          stats: {},
          bonus: {},

          init: function(x, y, settings) {
            this.parent(x, y, settings)

          },

          check: function(tourist) {
            if (!tourist.movingTourist) {
              tourist.addBonus(this.bonus);
              tourist.currentAnim = tourist.anims.halo;
              ig.gameState.statsbar.addStats(this.stats);
              setTimeout(tourist.reset.bind(tourist), 2000)
              this.kill();
            }
          }
        });
    });
