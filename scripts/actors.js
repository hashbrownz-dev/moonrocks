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
        this.points = 25;
        this.type = 'rock';
    }

    update(game){
        if(this.hp <= 0) {
            this.clear = true;
            game.actors.push(new MoonRockMed(this), new MoonRockMed(this))
            game.particles.push(setEffectMaskExplosion(this.sprite.mask,this.x,this.y,this.dir,this.sprite.palette[1]));
            game.particles.push(setEffectPartExplosion(this.x,this.y));
            return;
        }
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
                game.score+=5;
                game.particles.push(setEffectBulletImpact(projectile.x, projectile.y, projectile.dir));
                if(this.hp <= 0) {
                    this.clear = true;
                    if(projectile.type !== 'ufo') game.score+=this.points - 15;
                    game.actors.push(new MoonRockMed(this), new MoonRockMed(this))
                    game.particles.push(setEffectMaskExplosion(this.sprite.mask,this.x,this.y,this.dir,this.sprite.palette[1]));
                    game.particles.push(setEffectPartExplosion(this.x,this.y));
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
        this.points = 50;
        this.type = 'rock';
    }
    update(game){
        if(this.hp <= 0){
            this.clear = true;
            game.actors.push(new MoonRockSmall(this), new MoonRockSmall(this));
            game.particles.push(setEffectMaskExplosion(this.sprite.mask,this.x,this.y,this.dir,this.sprite.palette[1]));
            game.particles.push(setEffectPartExplosion(this.x,this.y));
            return;
        }
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
                game.score += 5;
                game.particles.push(setEffectBulletImpact(projectile.x, projectile.y, projectile.dir));
                if(this.hp <= 0) {
                    this.clear = true;
                    game.actors.push(new MoonRockSmall(this), new MoonRockSmall(this));
                    if(projectile.type !== 'ufo') game.score += this.points - 10;
                    game.particles.push(setEffectMaskExplosion(this.sprite.mask,this.x,this.y,this.dir,this.sprite.palette[1]));
                    game.particles.push(setEffectPartExplosion(this.x,this.y));
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
        this.points = 100;
        this.type = 'rock';
    }
    update(game){
        if(this.hp <= 0) {
            this.clear = true;
            game.particles.push(setEffectMaskExplosion(this.sprite.mask,this.x,this.y,this.dir,this.sprite.palette[1]));
            game.particles.push(setEffectPartExplosion(this.x,this.y));
        }
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
                game.particles.push(setEffectBulletImpact(projectile.x, projectile.y, projectile.dir));
                if(this.hp <= 0) {
                    this.clear = true;
                    if(projectile.type !== 'ufo') game.score += this.points;
                    game.collectibles.push(new CollectStar(this.x,this.y,this.trajectory,this.speed));
                    game.particles.push(setEffectMaskExplosion(this.sprite.mask,this.x,this.y,this.dir,this.sprite.palette[1]));
                    game.particles.push(setEffectPartExplosion(this.x,this.y));
                }
            }
        })
    }
}

class UFO extends Actor {
    constructor(){
        super(Saucer);
        const left = coinToss();
        this.x = left ? -this.drawW : 640 + this.drawW;
        this.y = getRandom(60,300);
        this.xSpeed = getRandom(1,2);
        if(!left) this.xSpeed =- this.xSpeed;
        this.ySpeed = 0;
        this.hp = 2;
        this.points = 200;
        this.toShoot = getRandom(100,200);
        this.type = 'ufo';
        this.nearest = undefined;
        this.bankCheck = 60;
    }
    getNearest(game){
        // GET THE NEAREST TARGET
        // AIM AND FIRE!!!
        const targets = game.actors.filter( actor => actor != this );
        if(game.player) targets.push(game.player);
        // GET THE NEAREST...
        this.nearest = targets[0];
        for( let i = 1; i < targets.length; i++ ){
            let nd = getDistance( { x:this.x, y:this.y }, { x: this.nearest.x, y: this.nearest.y } );
            let td = getDistance( { x:this.x, y:this.y }, { x:targets[i].x, y:targets[i].y } );
            if( td < nd )this.nearest = targets[i];
        }
    }
    update(game){
        if(!this.nearest) this.getNearest(game);
        // UPDATE X POS
        this.x += this.xSpeed;
        // CHECK BOUNDARIES
        if(this.xSpeed > 0){
            if(this.x > 640 + this.drawW) this.clear = true;
        } else {
            if(this.x < -this.drawW) this.clear = true;
        }
        // UPDATE Y POS

        this.bankCheck--;
        if(this.bankCheck <= 0){
            this.bankCheck = getRandom(60,120);
            const n = getRandom(0,2);
            switch (n){
                case 2:
                    this.ySpeed = 1;
                    break;
                case 1:
                    this.ySpeed = -1;
                    break;
                case 0:
                default:
                    this.ySpeed = 0;
                    break;
            }
        }

        this.y += this.ySpeed;

        // VERTICAL WRAP

        if(this.y > 360 + this.drawH / 2) this.y = -this.drawH/2;
        if(this.y < -this.drawH / 2) this.y = 360 + this.drawH/2;
        
        // SHOOT
        this.toShoot--;
        this.getNearest(game);

        if( this.toShoot <= 0 ){
            // RESET TO SHOOT
            this.toShoot = getRandom(100,200);
            // GET NEAREST
            
            // SHOOT
            if(this.nearest){
                const dir = getDirection(this, this.nearest);
                game.projectiles.push(new UFOShot(this.x,this.y,dir));
            }
        }

        // COLLISIONS
        const projs = game.projectiles.filter( p => p.type != 'ufo');
        projs.forEach( (proj) => {
            if(colPolyCirc(this.colShapes[0], proj.colShapes[0])){
                proj.clear = true;
                this.hp -= proj.power;
                game.particles.push(setEffectBulletImpact(proj.x,proj.y,proj.dir));
                if(this.hp <= 0){
                    this.clear = true;
                    game.score += this.points;
                    const d = this.xSpeed < 0 ? 180 : 0;
                    game.collectibles.push(new CollectStar(this.x,this.y,d,Math.abs(this.xSpeed)));
                    game.particles.push(setEffectMaskExplosion(this.sprite.mask,this.x,this.y,this.dir,this.sprite.palette[2]));
                    game.particles.push(setEffectPartExplosion(this.x,this.y));
                }
            }
        })

        const rocks = game.actors.filter( a => a.type === 'rock');
        rocks.forEach( rock => {
            if(colPolyCirc(this.colShapes[0], rock.colShapes[0])){
                rock.hp = 0;
                this.clear = true;
                game.particles.push(setEffectMaskExplosion(this.sprite.mask,this.x,this.y,this.dir,this.sprite.palette[2]));
                game.particles.push(setEffectPartExplosion(this.x,this.y));
            }
        })
    }
    draw(){
        renderSprite(this.sprite, this.drawX, this.drawY);
    }
}

class UFOShot extends Actor{
    constructor(x,y,dir){
        super(UFOProj);
        this.x = x;
        this.y = y;
        this.dir = dir;
        this.speed = 4;
        this.power = 3;
        this.type = 'ufo';
    }
    update(game){
        moveActor(this);
        if(this.isOutOfBounds) this.clear = true;
    }
}