ig.module(
    'game.entities.seahorse'
).requires(
    'impact.entity',
    'game.entities.building'
).defines(
    function()
    {
        EntitySeahorse = EntityBuilding.extend
        ({
             animSheet: new ig.AnimationSheet( 'media/scuba/100px/seahorse.png', 100, 100 ),
             size: {x: 25, y: 25},
             offset: {x: 42, y: 37},
             visitType: 'seahorse'
         });


    });