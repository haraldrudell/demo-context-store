ig.module(
    'game.entities.emo'
).requires(
    'impact.entity',
    'game.entities.tracker'
).defines(function()
          {
              EntityEmo = EntityTracker.extend
              ({
                   animSheet: new ig.AnimationSheet('media/emoji/emoji-40.png', 40,40),
                   size: {x: 40, y: 40 },
                   zIndex: 50,  // far front
                   
                   init: function(caller, mood) {
                       console.log("new emo:" + mood);
                       this.parent(caller);  // overrides are below
                       // this.VELO_Y = 0.1;  // speed it moves up
                       this.ANIM_TIME = 10;

                       this.mood = mood;
                       this.addAnim( 'idle', 0, [0], false );
                       this.addAnim( 'happy', 0, [0], false );
                       this.addAnim( 'sad', 0, [1], false );
                       this.addAnim( 'angry', 0, [2], false );
                       this.addAnim( 'coin', 0, [3], false );
                       this.addAnim( 'heart', 0, [4], false );
                       this.addAnim( 'timeout', 0.2, [5,6], false );
                       this.addAnim( 'check', 0, [7], false );
                       this.addAnim( 'question', 0, [8], false );
                       this.addAnim( 'wrong', 0, [9], false );
                       this.addAnim( 'star', 0, [10], false );
                       this.addAnim( 'music', 0.1, [11,12], false );
                       this.currentAnim = this.anims[mood];
                       this.timer = new ig.Timer(this.ANIM_TIME);
                       this.vel.y = 1;
                   },
                   
                   complete: function() {
                       console.log("emo done");
                   },
                   
                   update: function() {
                       this.vel.y++;
		       // this.parent();  //FIXME - need this for animation, but it makes most emoji disappear instantly
                   }

               });

          });