ig.module(
    'game.entities.store'
).requires(
    'impact.entity',
    'game.entities.building'
).defines(
    function()
    {
        EntityStore = EntityBuilding.extend
        ({
             animSheet: new ig.AnimationSheet( 'media/img/buildings/store.png', 96, 96 ),
	     size: {x:96, y:96 },
             visitType: 'store',
	     maxStage: 4
	     
         });


    });