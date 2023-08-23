class Game {
    constructor(){
        this.player = new Player();
        this.actors = [];
        this.score = 0;
    }
    update(keyboard){
        // UPDATE PLAYER
        if(this.player){
            this.player.update(keyboard);
        }
    }
    draw(){
        // DRAW ACTORS
        // DRAW PLAYER
        if(this.player)this.player.draw();
    }
}