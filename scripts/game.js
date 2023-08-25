class Game {
    constructor(){
        this.score = 0;
        this.hiScore = getHiScore();
        this.newHiScore = false;
        this.lives = 5;
        this.level = 1;
        this.player = new Player();
        this.actors = MoonRock.spawn();
        this.projectiles = [];
        // DEBUG
        this.showColShapes = false;
    }
    get gameOver(){
        return this.lives < 0;
    }
    getWave(){
        // if(this.gameOver) return 'GAME OVER';
        return `WAVE ${String(this.level).padStart(2,'0')}`;
    }
    reset(){
        this.score = 0;
        this.newHiScore = false;
        this.lives = 5;
        this.level = 1;
        this.player = new Player();
        this.actors = MoonRock.spawn();
        this.projectiles = [];
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
            if(this.lives >= 0) this.player = new Player();
        }
        this.actors = this.actors.filter( (actor) => !actor.clear );
        this.projectiles = this.projectiles.filter( (proj) => !proj.clear );
        if(this.actors.length === 0){
            this.level++;
            this.actors = MoonRock.spawn(2+this.level);
        }

        // SCORE CHECK
        if(this.score > this.hiScore) this.newHiScore = true;
        if(this.newHiScore) this.hiScore = this.score;
        if(this.gameOver && this.newHiScore){
            setHiScore(this.score);
            this.newHiScore = false;
        }

        // RESET
        if(this.gameOver && keyboard['j']) this.reset();
    }
    
    draw(){
        // DRAW PLAYER
        if(this.player)this.player.draw();
        // DRAW ACTORS
        this.actors.forEach( actor => actor.draw() );
        // DRAW PROJECTILES
        this.projectiles.forEach( proj => proj.draw() );
        if(this.gameOver){
            // DRAW GAME OVER
            ctx.font = `300 18px Orbitron, sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillStyle = 'white';
            ctx.fillText('GAME OVER', 320, 180);
        }
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