class Game {
    constructor(){
        this.player = new Player();
        this.actors = [];
        this.projectiles = [];
        this.score = 0;
    }
    update(keyboard){
        // UPDATE PLAYER
        if(this.player){
            this.player.update(keyboard, this);
        }
        // UPDATE ACTORS
        this.actors.forEach( (actor) => actor.update(this) );
        // UPDATE PROJECTILES
        this.projectiles.forEach( (proj) => proj.update(this) );

        // CLEAN UP
        this.actors = this.actors.filter( (actor) => !actor.clear );
        this.projectiles = this.projectiles.filter( (proj) => !proj.clear );

    }
    draw(){
        // DRAW ACTORS
        // DRAW PLAYER
        if(this.player)this.player.draw();
        // DRAW PROJECTILES
        this.projectiles.forEach( proj => proj.draw() );
    }
}