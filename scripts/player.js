class Player extends Actor{
    constructor(){
        super(PlayerShip01);
        this.x = 320;
        this.y = 180;
        this.dir = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.thruster = 0.1;
        this.shotCooldown = 20;
        this.beamTargets = [];
    }
    glow(game, color){
        game.particles.push(new Emitter(this.x,this.y,120,[
            new PartCirc(this.x,this.y,24,20,color),
        ]));
    }
    getNewPos(){
        // CALCULATE SPEED

        let nx = this.x + this.xSpeed, ny = this.y + this.ySpeed;
        let speed = getDistance( { x:this.x, y:this.y }, { x:nx, y:ny } ),
            trajectory = getDirection( { x:this.x, y:this.y }, { x:nx, y:ny });

        // UPDATE POSITION

        if(speed > 5){
            const coords = getDestination(5, trajectory);
            return {
                x : this.x + coords.x,
                y : this.y + coords.y
            }
        } else {
            return {
                x : nx,
                y : ny,
            }
        }
    }
    update(game){
        // GET PLAYER INPUT
        if(_Keyboard['a'] || TouchButtons[0].active ) this.dir -= 2;
        if(_Keyboard['d'] || TouchButtons[1].active ) this.dir += 2;

        // DIR CLAMP
        if(this.dir < 0) this.dir = 359 + this.dir;
        if(this.dir > 359) this.dir = this.dir - 359;

        // THRUSTERS
        if(_Keyboard['j'] || _Keyboard['w'] || TouchButtons[3].active){
            // Convert this.direction from degrees to radians.
            const theta = degToRad(this.dir);
            // Update xSpeed
            this.xSpeed += this.thruster * Math.cos(theta);
            if(this.xSpeed > 5) this.xSpeed = 5;
            if(this.xSpeed < -5) this.xSpeed = -5;
            // Update ySpeed
            this.ySpeed += this.thruster * Math.sin(theta);
            if(this.ySpeed > 5) this.ySpeed = 5;
            if(this.ySpeed < -5) this.ySpeed = -5;
            // Particles
            // the angle is the current direction - 180...
            const { x, y } = getDestination(16, this.dir - 180);
            game.particles.push(setEffectThrust(x+this.x,y+this.y));
        } else {
            let diff = 0.01;
            if( _Keyboard['s'] || _Keyboard['l'] || TouchButtons[4].active ) diff = 0.05;
            // DECELLERATE
            if(this.xSpeed > 0) this.xSpeed -= diff;
            if(this.xSpeed < 0) this.xSpeed += diff;
            if(this.ySpeed > 0) this.ySpeed -= diff;
            if(this.ySpeed < 0) this.ySpeed += diff;
        }

        // UPDATE POS
        const curPos = {x:this.x, y:this.y};
        const newPos = this.getNewPos();

        this.x = newPos.x;
        this.y = newPos.y;

        // COLLISION CHECK
        game.actors.forEach( actor => {
            if(colPolyCirc(this.colShapes[0], actor.colShapes[0])){
                this.clear = true;
                actor.hp = 0;
                game.particles.push(setEffectMaskExplosion(this.sprite.mask,this.x,this.y,this.dir,this.sprite.palette[1]));
                game.particles.push(setEffectPartExplosion(this.x,this.y));
            }
        })
        const projs = game.projectiles.filter( p => p.type === 'ufo' );
        if(projs.length){
            projs.forEach( proj => {
                if(colPolyCirc(this.colShapes[0],proj.colShapes[0])){
                    proj.clear = true;
                    this.clear = true;
                    game.particles.push(setEffectMaskExplosion(this.sprite.mask,this.x,this.y,this.dir,this.sprite.palette[1]));
                    game.particles.push(setEffectPartExplosion(this.x,this.y));
                }
            })
        }

        // WRAP
        this.wrap();

        // LASERS
        this.shotCooldown--;
        if(this.shotCooldown <= 0){
            if(_Keyboard['k'] || TouchButtons[2].active){
                const offset = getDestination(12,this.dir);
                game.projectiles.push(new PShot(this.x+offset.x,this.y+offset.y,this.dir));
                this.shotCooldown = 10;
            }
        }

        // TRACTOR BEAM

        this.beamTargets = [];
        const r = _Keyboard['k'] || TouchButtons[2].active ? 24 : 48;
        const t = new Circ(this.x, this.y, r);
        for( const collectible of game.collectibles ){
            if(colCirc(t, collectible.colShapes[0])){
                collectible.dir = getDirection(collectible, this);
                collectible.speed += 0.1;
                if(collectible.speed > 5)collectible.speed = 5;
                this.beamTargets.push( {x : collectible.x, y : collectible.y });
            }
        }
    }
    draw(){
        renderSprite(this.sprite, this.drawX, this.drawY, { dir:this.dir });
        // DRAW TRACTOR BEAM
        if(this.beamTargets.length){
            for( const target of this.beamTargets ){
                const { x, y } = target;
                ctx.strokeStyle = 'lime';
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(x,y);
                ctx.stroke();
            }
        }
    }
}

class PShot extends Actor {
    constructor(x,y,dir){
        super(PlayerShot);
        this.x = x;
        this.y = y;
        this.dir = dir;
        this.speed = 7;
        this.decay = 60;
        this.power = 1;
    }
    update(game){
        // UPDATE DECAY
        this.decay--;
        // CLEAR IF DECAYED
        if(this.decay <= 0){
            this.clear = true;
            return;
        }
        // UPDATE POS
        const { x,y } = getDestination(this.speed, this.dir);
        this.x += x;
        this.y += y;
        // WRAP
        this.wrap();
    }
}

// COLLECTIBLES

class CollectStar extends Actor{
    constructor(x,y,dir,speed){
        const sprites = [
            Gem01,
            Gem02,
            Gem03,
        ]
        const colors = [
            yellow,
            lime,
            orange,
            pink,
        ]
        super(sprites[getRandom(0,2)]);
        this.x = x;
        this.y = y;
        this.dir = dir;
        this.speed = speed;
        this.decay = 600;
        this.color = colors[getRandom(0,colors.length-1)];
    }
    update(game){
        // DECAY
        this.decay--;
        if(this.decay <= 0) this.clear = true;
        // UPDATE POSITION
        if(this.speed !== 0.1) this.speed -= 0.05;
        if(this.speed < 0.1) this.speed = 0.1;
        moveActor(this);
        this.wrap();
        // COLLISION CHECK
        if(game.player){
            const p = game.player;
            if(colPolyCirc(p.colShapes[0], this.colShapes[0])){
                this.clear = true;
                p.glow(game, this.color);
                // GET GAME MODE
                game.score += 100;
            }
        }
    }
    draw(){
        renderSprite(this.sprite, this.drawX, this.drawY,{ color : [{'#FFFF00' : this.color}] });
    }
}