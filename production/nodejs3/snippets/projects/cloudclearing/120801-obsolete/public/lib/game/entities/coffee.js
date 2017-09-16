ig.module(
    'game.entities.coffee'
).requires(
    'impact.entity',
    'game.entities.building'
).defines(
    function()
    {
        EntityCoffee = EntityBuilding.extend
        ({
             animSheet: new ig.AnimationSheet( 'media/img/buildings/coffee.png', 64,64 ),
             visitType: 'coffee'
         });


    });