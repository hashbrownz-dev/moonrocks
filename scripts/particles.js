class Particle{
    constructor(x, y, duration, speed, dir, scrollRate = 0){
        this.duration = duration;
        this.decay = this.duration;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.dir = dir;
        this.scrollRate = scrollRate;
        // this.clear = false;
    }
    get clear(){
        return this.decay === 0;
    }
    updatePos(dir=0){
        // Update the direction of the particle.
        // turnActor(this,dir)
        // Move the particle
        moveActor(this);
        // Move with background
        this.y += this.scrollRate;
    }
}

class Emitter{
    constructor(x,y,duration,particles = []){
        this.x = x;
        this.y = y;
        this.duration = duration;
        // this.clear = false;
        this.particles = particles;
    }
    // Emitters will clear if their duration === 0 OR they have no more particles
    get clear(){
        return !this.duration || !this.particles.length;
    }
    update(game){
        this.duration--;
        this.particles.forEach( particle => {
            particle.update(game)
        })
        this.particles = this.particles.filter(particle => !particle.clear);
    }
    draw(){
        this.particles.forEach( part => part.draw() );
    }
}

// UPDATE COLOR
const updateColor = (particle, palette) => {
    const interval = 1 / palette.length;
    return palette[ Math.floor((particle.decay / particle.duration) / interval) ]
}

// PARTICLE - SPARK
// 1px Square, Color is White, Move in a straight line, Random decay...

class Spark extends Particle{
    constructor(x,y,dir,speed,duration){
        super(x,y,duration,speed,dir);
        this.fill = 'white';
    }
    update(){
        this.decay--;
        this.updatePos();
        // UPDATE COLOR
        this.fill = updateColor(this, explosionPalette);
    }
    draw(){
        ctx.fillStyle = this.fill;
        ctx.fillRect(this.x,this.y,3,3);
    }
}

class Bloom extends Particle{
    constructor(x, y, duration, radius, innerDecay = false){
        super(x,y,duration,0,0,0);
        this.radius = radius;
        this.innerDecay = innerDecay;
    }
    update(){
        this.decay--;
        // INCREASE SIZE
        // size is the inverse... of decay / duration
        // decay / duration is a value between 1 and 0 that decreases over time... so we need a number that increases over time... that we can multiply by our base radius
        // (1 - (decay / duration)) * baseRadius = Current Size
        // As the OUTER circle gets bigger... the INNER Circle gets bigger too.
        // So for the INNER CIRCLE we it's size should be equal to the OUTER CIRCLE * (1 - (decay / duration))
        // UPDATE COLOR
        this.fill = updateColor(this, explosionPalette);
    }
    draw(){
        // Get Current Size
        const currentRadius = (1 - (this.decay / this.duration)) * this.radius;
        ctx.fillStyle = updateColor(this, explosionPalette);
        ctx.beginPath();
        ctx.arc(this.x, this.y, currentRadius, 0, 7);
        if(this.innerDecay){
            ctx.arc(this.x, this.y, currentRadius * (1 - (this.decay / this.duration)), 0, 7);
        }
        ctx.fill('evenodd');
    }
}

class Fade extends Particle {
    constructor(x,y, duration, radius, scrollRate){
        super(x,y,duration,0,0,scrollRate);
        this.radius = radius;
    }
    update(){
        this.decay--;
        this.y+=this.scrollRate;
    }
    draw(){
        const currentRadius = (this.decay / this.duration) * this.radius;
        ctx.fillStyle = updateColor(this, explosionPalette);
        ctx.beginPath();
        ctx.arc(this.x,this.y,currentRadius,0,7);
        ctx.fill();
    }
}

class PartLine{
    constructor(p1,p2,dir,speed,duration,spin){
        this.p1 = p1;
        this.p2 = p2;
        this.dir = dir;
        this.speed = speed;
        this.duration = duration;
        this.spin = spin;
        this.angle = 0;
    }
    get clear(){
        return this.duration < 0
    }
    get center(){
        const rx = this.p1.x < this.p2.x ? this.p1.x : this.p2.x,
            ry = this.p1.y < this.p2.y ? this.p1.y : this.p2.y,
            rw = Math.abs(this.p1.x - this.p2.x),
            rh = Math.abs(this.p1.y - this.p2.y);
        return {
            x : rw / 2 + rx,
            y : rh / 2 + ry,
        }
    }
    update(){
        this.duration--;
        // this.spin -= 0.01;
        this.speed -= 0.025;
        this.angle += this.spin;
        // Move each point
        const dest = getDestination(this.speed, this.dir);
        this.p1.x += dest.x;
        this.p1.y += dest.y;
        this.p2.x += dest.x;
        this.p2.y += dest.y;
    }
    draw(){
        ctx.strokeStyle = 'white';

        ctx.save();

        rotate(this.center,this.angle);

        ctx.beginPath();
        ctx.moveTo(this.p1.x,this.p1.y);
        ctx.lineTo(this.p2.x,this.p2.y);
        ctx.stroke();

        ctx.restore();
    }
}

// MASK DESTRUCTURING

const getMaskShape = (mask, x, y, dir) =>{

    if(mask.type === 'polygon'){
        const tethers = mask.tethers.map( tether => {
            return {
                l : tether.l,
                a : tether.a + dir
            }
        });
        const points = [];
        tethers.forEach( tether => {
            points.push(getDestination(tether.l, tether.a));
        });
        points.forEach( point => {
            point.x += x;
            point.y += y;
        })
        return points;
    }
}

const getPolyLines = (poly) => {
    const lines = [];
    for( let i = 0; i < poly.length; i++ ){
        if( poly[i+1] ){
            lines.push( [ poly[i], poly[i+1] ] );
        } else {
            lines.push( [ poly[i], poly[0] ] );
        }
    }
    return lines;
}

// EFFECT - BULLET IMPACT

const setEffectBulletImpact = (x,y,entry) => {
    const amount = Math.floor(Math.random() * 6 + 5);
    const particles = [];
    let inverse = entry - 180;
    inverse = inverse < 0 ? inverse + 360 : inverse;

    // Math.floor(Math.random() * (inverse + 15) + (inverse - 15))

    for(let i = amount; i > 0; i--){
        const   dir = getRandom(inverse - 30, inverse + 30),
                spd = Math.floor(Math.random() * 3 + 2),
                dur = getRandom(10, 20);
        particles.push(new Spark(x, y, dir, spd, dur));
    }
    return new Emitter(x,y,-1,particles)
}

// EFFECT - PARTICLE EXPLOSION

const setEffectPartExplosion = (x,y) => {
    const particles = [];
    for(let i = 0; i < 359; i+=10){
        const   spd = Math.floor(Math.random() * 3 + 2),
                dur = Math.floor(Math.random() * 16 + 30);
        particles.push(new Spark(x,y, i, spd, dur));
    }
    return new Emitter(x,y, -1, particles);
}

// EFFECT - CIRCLE EXPLOSION

const setEffectCircleExplosion = (x,y,radius) => {
    return new Emitter(x,y, -1, [new Bloom(x,y,15,radius,true)])
}

// EFFECT - MASK EXPLOSION

const setEffectMaskExplosion = (mask, mx, my, mdir) => {
    const lines = getPolyLines(getMaskShape(mask, mx, my, mdir));
    const parts = [];
    for ( const line of lines ) {
        const p1 = line[0], p2 = line[1],
            rx = p1.x < p2.x ? p1.x : p2.x,
            ry = p1.y < p2.y ? p1.y : p2.y,
            rw = Math.abs(p1.x - p2.x),
            rh = Math.abs(p1.y - p2.y),
            center = {
                x : rw / 2 + rx,
                y : rh / 2 + ry,
            },
            dir = getDirection({ x:mx, y:my }, center);
        parts.push(new PartLine( { x:p1.x, y:p1.y }, { x:p2.x, y:p2.y }, dir, getRandom(1,3), getRandom(30,60), getRandom(1,8)));
    }
    return new Emitter(mx,my,120,parts);
}