class Player extends Actor{
    constructor(){
        super(playerShip01);
        this.x = 320;
        this.y = 180;
        this.dir = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.thruster = 0.1;
        this.shotCooldown = 20;
    }
    update(input, game){
        // GET PLAYER INPUT
        if(input['a']) this.dir -= 2;
        if(input['d']) this.dir += 2;

        // DIR CLAMP
        if(this.dir < 0) this.dir = 359 + this.dir;
        if(this.dir > 359) this.dir = this.dir - 359;

        // THRUSTERS
        if(input['j'] || input['w']){
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
        }

        // CALCULATE SPEED

        let nx = this.x + this.xSpeed, ny = this.y + this.ySpeed;
        let speed = getDistance( { x:this.x, y:this.y }, { x:nx, y:ny } ),
            trajectory = getDirection( { x:this.x, y:this.y }, { x:nx, y:ny });


        // UPDATE POSITION

        if(speed > 5){
            const coords = getDestination(5, trajectory);
            this.x += coords.x;
            this.y += coords.y;
        } else {
            this.x = nx;
            this.y = ny;
        }

        // DISPLAY SPEED

        // WRAP
        this.wrap();

        // LASERS
        // based on the direction of the ship...
        // we can find the x,y coordinates of the ships tip
        // which is basically a distance of 12 from the center...
        this.shotCooldown--;
        if(input['k'] && this.shotCooldown <= 0){
            const offset = getDestination(12,this.dir);
            game.projectiles.push(new PShot(this.x+offset.x,this.y+offset.y,this.dir));
            this.shotCooldown = 10;
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