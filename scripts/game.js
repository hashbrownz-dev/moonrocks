class Game {
    constructor(){
        this.score = 0;
        this.hiScore = getHiScore();
        this.newHiScore = false;
        this.lives = 5;
        this.level = 1;
        this.player = new Player();
        this.actors = [];
        this.alarms = [];
        this.projectiles = [];
        this.collectibles = [];
        this.particles = [];
        this.gameOver = false;
        this.UFOtimer = 900;
        this.spawnMoonRocks();
        // DEBUG
        this.showColShapes = false;
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
        this.spawnMoonRocks();
        this.projectiles = [];
        this.collectibles = [];
        this.particles = [];
        this.gameOver = false;
        this.gameOverTimer = 300;
        this.spawnTimer = 0;
    }
    spawnMoonRocks(amount = 3){
        for(let i = amount; i > 0; i--){
            this.actors.push(new MoonRock(this.player));
        }
    }
    spawnPlayer(){
        const testCirc = new Circ(320, 180, 24);
        let isSafe = true;
        for( const actor of this.actors ){
            if( colCirc(testCirc, actor.colShapes[0])){
                isSafe = false;
            }
        }
        this.player = isSafe ? new Player() : undefined;
    }
    update(){
        if(_Keyboard[' ']){
            _State = 'pause';
            return;
        }
        // UFO
        this.UFOtimer--;
        if(this.UFOtimer <= 0){
            // SPAWN A UFO
            // SET THE UFO TIMER TO (15 - level (this value cannot go lower than 8))
            this.actors.push(new UFO());
            let mod = 15 - this.level;
            if(mod < 7) mod = 7;
            this.UFOtimer = 60 * mod;
        }
        // UPDATE ACTORS
        this.actors.forEach( (actor) => actor.update(this) );
        // UPDATE PROJECTILES
        this.projectiles.forEach( (proj) => proj.update(this) );
        // UPDATE COLLECTIBLES
        this.collectibles.forEach( c => c.update(this) );
        // UPDATE PLAYER
        if(this.player){
            this.player.update(this);
        }
        // UPDATE PARTICLES
        this.particles.forEach( part => part.update(this) );

        // CLEAN UP

        if(this.player){
            if(this.player.clear){
                this.player = undefined;
                this.lives--;
                if(this.lives >= 0){
                    this.spawnTimer = 60;
                } else {
                    this.gameOver = true;
                    this.gameOverTimer = 300;
                }
            }
        } else {
            this.spawnTimer--;
            if( this.spawnTimer <= 0 && !this.gameOver ){
                this.spawnPlayer();
            }
        }
        this.actors = this.actors.filter( (actor) => !actor.clear );
        this.projectiles = this.projectiles.filter( p => !p.clear );
        this.collectibles = this.collectibles.filter( c => !c.clear );
        this.particles = this.particles.filter( part => !part.clear );

        if(this.actors.length === 0){
            this.level++;
            this.spawnMoonRocks(2+this.level);
        }

        // SCORE CHECK
        if(this.score > this.hiScore) this.newHiScore = true;
        if(this.newHiScore) this.hiScore = this.score;
        if(this.gameOver && this.newHiScore){
            setHiScore(this.score);
            this.newHiScore = false;
        }

        // RESET
        if(this.gameOver){
            this.gameOverTimer--;
            if(this.gameOverTimer <= 0) _State = 'game over';
        }
    }
    
    draw(){
        // DRAW PLAYER
        if(this.player)this.player.draw();
        // DRAW ACTORS
        this.actors.forEach( actor => actor.draw() );
        // DRAW COLLECTIBLES
        this.collectibles.forEach( c => c.draw() );
        // DRAW PROJECTILES
        this.projectiles.forEach( proj => proj.draw() );
        // DRAW PARTICLES
        this.particles.forEach( part => part.draw() );

        if(this.gameOver && this.gameOverTimer > 0){
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