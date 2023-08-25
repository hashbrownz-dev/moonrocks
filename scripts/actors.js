// ACTORS

class Actor {
    constructor(sprite){
        this.sprite = sprite;
        this.x = 0;
        this.y = 0;
        this.dir = 0;
        this.speed = 0;
        this.clear = false;
    }
    get drawX(){
        return this.x - (this.drawW / 2);
    }
    get drawY(){
        return this.y - (this.drawH / 2);
    }
    get drawW(){
        return Number(this.sprite.dimensions.drawW);
    }
    get drawH(){
        return Number(this.sprite.dimensions.drawH);
    }
    get colShapes(){
        return this.sprite.col.map( (shape) => {
            switch(shape.type){
                case 'circ':
                    return new Circ(this.drawX + Number(shape.x),this.drawY + Number(shape.y),Number(shape.r));
                case 'rect':
                    return new Rect(this.drawX + Number(shape.x),this.drawY + Number(shape.y),Number(shape.w),Number(shape.h));
                case 'line':
                    return new Line(this.drawX + Number(shape.x1),this.drawY + Number(shape.y1),this.drawX + Number(shape.x2),this.drawY + Number(shape.y2));
                case 'polygon':
                    return new Poly(this.x,this.y,shape.tethers,this.dir);
            }
        })
    }
    get isOutOfBounds(){
        return ( this.x + (this.drawW/2) < 0 || this.x > 640 + (this.drawW/2) || this.y + (this.drawH/2) < 0 || this.y > 360 + (this.drawH/2) )
    }
    wrap(){
        if(this.y > 360 + this.drawH / 2) this.y = -this.drawH/2;
        if(this.y < -this.drawH / 2) this.y = 360 + this.drawH/2;
        if(this.x > 640 + this.drawH / 2) this.x = -this.drawW/2;
        if(this.x < -this.drawW / 2) this.x = 640 + this.drawW/2;
    }
    update(game){

    }
    draw(){
        renderSprite(this.sprite, this.drawX, this.drawY, { dir:this.dir })
    }
}

class MoonRock extends Actor{
    constructor(player){
        const sprites = [
            MoonRock01,
            MoonRock02,
            MoonRock03,
        ]
        super(sprites[getRandom(0,2)]);
        const anchor = player ? {x:player.x,y:player.y} : {x:320,y:180};
        let clear = false;
        while(!clear){
            this.x = getRandom(0,640);
            this.y = getRandom(0,360);
            if(getDistance(anchor, this) >= 100) clear = true;
        }
        this.trajectory = getRandom(0,359);
        this.speed = 1;
        this.dir = getRandom(0,359);
        this.spinDir = Math.round(Math.random()) ? -0.1 : 0.1;
        this.hp = 3;
    }
    static spawn(amount = 3){
        const output = [];
        for(let i = amount; i > 0; i--){
            output.push(new MoonRock());
        }
        return output;
    }
    update(game){
        // ROTATE
        this.dir+=this.spinDir;
        // MOVE
        const {x,y} = getDestination(this.speed, this.trajectory);
        this.x+=x;
        this.y+=y;
        // WRAP
        this.wrap();
        // COLLISIONS
        // Projectiles
        game.projectiles.forEach( (projectile) => {
            // check for projectile collision
            if(colCirc(this.colShapes[0],projectile.colShapes[0])){
                projectile.clear = true;
                this.hp -= projectile.power;
                if(this.hp <= 0) {
                    this.clear = true;
                    game.actors.push(new MoonRockMed(this), new MoonRockMed(this))
                }
            }
        })
    }
}

class MoonRockMed extends Actor{
    constructor(parent){
        const sprites = [
            MoonRock04,
            MoonRock05,
            MoonRock06,
        ]
        super(sprites[getRandom(0,2)]);
        this.x = parent.x;
        this.y = parent.y;
        this.trajectory = getRandom(0,359);
        this.speed = 2;
        this.dir = getRandom(0,359);
        this.spinDir = Math.round(Math.random()) ? -0.2 : 0.2;
        this.hp = 2;
    }
    update(game){
        // ROTATE
        this.dir+=this.spinDir;
        // MOVE
        const {x,y} = getDestination(this.speed, this.trajectory);
        this.x+=x;
        this.y+=y;
        // WRAP
        this.wrap();
        // COLLISIONS
        game.projectiles.forEach( (projectile) => {
            // check for projectile collision
            if(colCirc(this.colShapes[0],projectile.colShapes[0])){
                projectile.clear = true;
                this.hp -= projectile.power;
                if(this.hp <= 0) {
                    this.clear = true;
                    game.actors.push(new MoonRockSmall(this), new MoonRockSmall(this));
                }
            }
        })
    }
}

class MoonRockSmall extends Actor{
    constructor(parent){
        const sprites = [
            MoonRock07,
            MoonRock08,
            MoonRock09,
        ]
        super(sprites[getRandom(0,2)]);
        this.x = parent.x;
        this.y = parent.y;
        this.trajectory = getRandom(0,359);
        this.speed = 3;
        this.dir = getRandom(0,359);
        this.spinDir = Math.round(Math.random()) ? -0.4 : 0.4;
        this.hp = 1;
    }
    update(game){
        // ROTATE
        this.dir+=this.spinDir;
        // MOVE
        const {x,y} = getDestination(this.speed, this.trajectory);
        this.x+=x;
        this.y+=y;
        // WRAP
        this.wrap();
        // COLLISIONS
        game.projectiles.forEach( (projectile) => {
            // check for projectile collision
            if(colCirc(this.colShapes[0],projectile.colShapes[0])){
                projectile.clear = true;
                this.hp -= projectile.power;
                if(this.hp <= 0) {
                    this.clear = true;
                }
            }
        })
    }
}