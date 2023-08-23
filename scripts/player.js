class Player extends Actor{
    constructor(){
        super(playerShip01);
        this.x = 360;
        this.y = 180;
        this.dir = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.thruster = 0.1;
    }
    update(input){
        // GET PLAYER INPUT
        if(input['d']) this.dir -= 2;
        if(input['f']) this.dir += 2;

        // DIR CLAMP
        if(this.dir < 0) this.dir = 359 + this.dir;
        if(this.dir > 359) this.dir = this.dir - 359;

        // THRUSTERS
        if(input['j']){
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

        // DISPLAY SPEED (DEBUG)

        document.getElementById('speed').innerText = `Direction : ${this.dir}; Speed : ${speed}; Trajectory : ${trajectory}; xSpeed : ${this.xSpeed}; ySpeed : ${this.ySpeed}`

        // WRAP
        if(this.y > 360) this.y = -this.drawH;
        if(this.y < -this.drawH) this.y = 360;
        if(this.x > 640) this.x = -this.drawW;
        if(this.x < -this.drawW) this.x = 640;

        // LASERS
    }
}