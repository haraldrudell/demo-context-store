ig.module(
    'game.entities.photo'
).requires(
    'impact.entity',
    'game.entities.building'
).defines(
    function()
    {
        EntityPhoto = EntityBuilding.extend
        ({
             animSheet: new ig.AnimationSheet( 'media/img/buildings/photo.png', 64,64 ),
             visitType: 'photo'
         });


    });