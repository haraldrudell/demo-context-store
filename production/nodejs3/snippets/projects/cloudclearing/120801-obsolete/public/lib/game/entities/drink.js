ig.module(
    'game.entities.drink'
).requires(
    'game.entities.consumable',
    'impact.entity'
).defines(
    function()
    {
      EntityDrink = EntityConsumable.extend(
        {
          animSheet: new ig.AnimationSheet( 'media/items/drinks-48.png', 48, 48 ),
          bonus: {stamina: 100},
          size: {x: 64, y: 64},
          stats: {xp: 1, hp: 5},


          init: function(x, y, settings) {
            this.parent(x, y, settings)
            this.shopLevel = (settings.level ? settings.level : 0);
            this.addAnim( 'cocktail', 1, [0], true );
            this.addAnim( 'beer', 1, [1], true );
            this.addAnim( 'beer2', 1, [2], true );
            this.addAnim( 'pepsi', 1, [3], true );
            this.addAnim( 'cola', 1, [4], true );
            this.addAnim( 'soda', 1, [5], true );
            this.available = ['cocktail', 'beer', 'beer2', 'pepsi', 'cola', 'soda'];
            this.dringType = null;            this.drinkType = this.available.splice(0, this.shopLevel + 1).random();
            console.log(this.drinkType)
            this.currentAnim = this.anims[this.drinkType]
            console.log(this.currentAnim)
            console.log(this.pos)
          }
        });
    });

