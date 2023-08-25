class Game {
    constructor(){
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.player = new Player();
        this.actors = MoonRock.spawn();
        this.projectiles = [];
        // DEBUG
        this.showColShapes = false;
    }
    update(keyboard){
        // UPDATE ACTORS
        this.actors.forEach( (actor) => actor.update(this) );
        // UPDATE PROJECTILES
        this.projectiles.forEach( (proj) => proj.update(this) );
        // UPDATE PLAYER
        if(this.player){
            this.player.update(keyboard, this);
        }

        // CLEAN UP
        if(this.player){
            this.player = this.player.clear ? undefined : this.player;   
        } else {
            this.lives --;
            this.player = new Player();
        }
        this.actors = this.actors.filter( (actor) => !actor.clear );
        this.projectiles = this.projectiles.filter( (proj) => !proj.clear );
        if(this.actors.length === 0){
            this.level++;
            this.actors = MoonRock.spawn(2+this.level);
        }
    }
    draw(){
        // DRAW PLAYER
        if(this.player)this.player.draw();
        // DRAW ACTORS
        this.actors.forEach( actor => actor.draw() );
        // DRAW PROJECTILES
        this.projectiles.forEach( proj => proj.draw() );
        // DRAW COL SHAPES
        if(this.showColShapes){
            // Player
            ctx.strokeStyle = 'lime';
            if(this.player){
                drawPolygon(this.player.colShapes[0]);
                ctx.stroke();
            }
            // Actors
            ctx.strokeStyle = 'red';
            this.actors.forEach( actor => {
                actor.colShapes.forEach( shape => {
                    drawShape(shape)
                    ctx.stroke();
                });
            })
            // Projectiles
        }
    }
}