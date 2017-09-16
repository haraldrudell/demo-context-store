ig.module(
    'game.entities.relax'
).requires(
    'impact.entity',
    'game.entities.building'
).defines(
    function()
    {
        EntityRelax = EntityBuilding.extend
        ({
             animSheet: new ig.AnimationSheet( 'media/img/buildings/relax.png', 64,64 ),
             visitType: 'relax'
         });


    });