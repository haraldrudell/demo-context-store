ig.module(
    'game.entities.cafe'
).requires(
    'impact.entity',
    'game.entities.building'
).defines(
    function()
    {
        EntityCafe = EntityBuilding.extend
        ({
             animSheet: new ig.AnimationSheet( 'media/img/buildings/cafe.png', 64, 64 ),
             visitType: 'cafe',
	     maxStage: 4
         });

    });
