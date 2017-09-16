ig.module(
    'game.entities.cocktail'
).requires(
    'impact.entity',
    'game.entities.building'
).defines(
    function()
    {
        EntityCocktail = EntityBuilding.extend
        ({
             animSheet: new ig.AnimationSheet( 'media/icons/40/cocktail.png', 40, 40 ),
             visitType: 'cocktail',
             size: {x:40, y:40},
             offset: {x: 0, y: 0},
             MAX_STAGE: 1,

             init: function(x, y, settings) {
                 this.addAnim( 'idle0', 1, [0], false );
                 this.addAnim( 'ready', 1, [0], false );
                 this.parent();
             },

             triggeredBy: function(other) {
                 console.log("cocktail triggered by:");
                 console.log(other);
                 this.build();
             },

             drink: function() {
                 console.log("drink");
             }


         });

    });
