///////////////////
//    MOVEMENT   //
///////////////////

// GET DIRECTION

const getDirection = (actor, target) => {
    const y = target.y - actor.y;
    const x = target.x - actor.x;
    let opp, adj, d;

    // Determine the Sector

    // SECTOR I
    if(x > 0 && y >= 0){
        opp = y;
        adj = x;
        d = 0;
    }

    // SECTOR II
    else if(x <= 0 && y > 0){
        opp = x;
        adj = y;
        d = 89;
    }

    // SECTOR III
    else if(x < 0 && y <= 0){
        opp = y;
        adj = x;
        d = 179;
    }

    // SECTOR IV
    else if(x >= 0 && y < 0){
        opp = x;
        adj = y;
        d = 269
    }

    return radToDeg(Math.abs(Math.atan(opp/adj))) + d;
}

// GET DISTANCE

const getDistance = (p1, p2) => {
    const a = Math.abs(p1.y - p2.y),
        b = Math.abs(p1.x - p2.x);

    return Math.sqrt((a*a)+(b*b))
}

// MOVE ACTOR

const moveActor = (actor) => {
    // Get Hypotenuse and Direction
    const { speed, dir } = actor;

    // Convert direction to Radians
    const theta = degToRad(dir);

    // Get new coordinates
    let newY = speed * Math.sin(theta);
    let newX = speed * Math.cos(theta);

    // Update actors coordinates
    actor.x += newX;
    actor.y += newY;

    // Return new coordinates (as object)
    return {x:actor.x, y:actor.y}
}
//////////////////////
// COLLISION SHAPES //
//////////////////////

class Rect{
    constructor(x,y,w,h){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.type = 'rect';
    }

    get top(){
        return {
            x1 : this.x,
            y1 : this.y,
            x2 : this.x + this.w,
            y2 : this.y,
        }
    }

    get left(){
        return {
            x1 : this.x,
            y1 : this.y,
            x2 : this.x,
            y2 : this.y + this.h,
        }
    }

    get right(){
        return {
            x1 : this.x + this.w,
            y1 : this.y,
            x2 : this.x + this.w,
            y2 : this.y + this.h,
        }
    }

    get bottom(){
        return {
            x1 : this.x,
            y1 : this.y + this.h,
            x2 : this.x + this.w,
            y2 : this.y + this.h,
        }
    }
}

class Circ{
    constructor(x,y,r){
        this.x = x;
        this.y = y;
        this.r = r;
        this.type = 'circ';
    }

    get boundingRect(){
        return {
            x : this.x - this.r,
            y : this.y - this.r,
            w : this.r * 2,
            h : this.r * 2,
        }
    }
}

class Line{
    constructor(x1,y1,x2,y2){
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.type = 'line';
    }

    get boundingRect(){
        return {
            x : this.x1 < this.x2 ? this.x1 : this.x2,
            y : this.y1 < this.y2 ? this.y1 : this.y2,
            w : Math.abs(this.x1 - this.x2),
            h : Math.abs(this.y1 - y2),
        }
    }

    draw(){
        ctx.strokeStyle = 'red';
        ctx.beginPath();
        ctx.moveTo(this.x1,this.y1);
        ctx.lineTo(this.x2,this.y2);
        ctx.stroke();
    }
}

//////////////////////
//  COLLISION TYPES //
//////////////////////

// POINT X POINT

const colPoint = (p1, p2) => {
    return p1.x === p2.x && p1.y === p2.y;
}

// POINT X CIRC

const colCircPoint = (circ, point) => {
    const dist = getDistance(point, circ);
    return dist < circ.r;
}

// CIRC X CIRC

const colCirc = (c1, c2) => {
    const dist = getDistance(c1, c2);
    return dist < c1.r + c2.r;
}

// POINT X RECT

const colPointRect = (point, rect) => {
    return point.x > rect.x &&
        point.x < rect.x + rect.w &&
        point.y > rect.y &&
        point.y < rect.y + rect.h;
}

// RECT x RECT

const colRect = (r1, r2) => {
    return r1.x + r1.w > r2.x &&
        r1.x < r2.x + r2.w &&
        r1.y + r1.h > r2.y &&
        r1.y < r2.y + r2.h;
}

// CIRC X RECT

const colCircRect = (circ, rect) => {
    let testX = circ.x, testY = circ.y;

    if(circ.x < rect.x) testX = rect.x;
    else if(circ.x > rect.x + rect.w) testX = rect.x + rect.w;

    if(circ.y < rect.y) testY = rect.y;
    else if(circ.y > rect.y + rect.h) testY = rect.y + rect.h;

    const dist = getDistance(circ, {x:testX,y:testY});

    return dist <= circ.r;
}

// LINE X POINT

const colLinePoint = (line, point) => {
    const lineLength = getDistance({x:line.x1,y:line.y1},{x:line.x2,y:line.y2});
    const d1 = getDistance(point, {x:line.x1,y:line.y1});
    const d2 = getDistance(point, {x:line.x2,y:line.y2});

    // Higher Buffer => Less Accurate Collision
    const buffer = 0.1;

    return d1+d2 >= lineLength - buffer && d1+d2 <= lineLength + buffer;
}

// CIRCLE X LINE

const colCircLine = (circ, line) => {
    const lineLength = getDistance({x:line.x1,y:line.y1},{x:line.x2,y:line.y2});
    
    const dot = ( ((circ.x - line.x1) * (line.x2 - line.x1)) + ((circ.y - line.y1) * (line.y2-line.y1)) ) / (lineLength * lineLength);

    const closestX = line.x1 + (dot * (line.x2 - line.x1)),
        closestY = line.y1 + (dot * (line.y2 - line.y1));

    if(!colLinePoint(line,{x:closestX,y:closestY})) return false;

    if(colCircPoint(circ, {x:closestX, y:closestY})){
        return {
            x:closestX,
            y:closestY
        }
    } else {
        return false;
    }
}

// LINE X LINE

const colLine = (l1, l2) => {
    const { x1,x2,y1,y2 } = l1;
    const { x1:x3, x2:x4, y1:y3, y2:y4 } = l2;
    const uA = ( (x4-x3)*(y1-y3) - (y4-y3)*(x1-x3) ) / ( (y4-y3)*(x2-x1) - (x4-x3)*(y2-y1) );
    const uB = ( (x2-x1)*(y1-y3) - (y2-y1)*(x1-x3) ) / ( (y4-y3)*(x2-x1) - (x4-x3)*(y2-y1) );

    // If the lines intersect, return the point at which they intersect; else return false

    if( uA >= 0 && uA <= 1 && uB >=0 && uB <= 1 ){
        const intersectX = x1 + (uA * (x2-x1));
        const intersectY = y1 + (uA * (y2-y1));
        return {
            x:intersectX,
            y:intersectY
        }
    } else {
        return false;
    }
}

// LINE X RECT

const colLineRect = (line, rect) => {
    // Perform four line x line collision checks...
    const top = colLine(line, rect.top),
        left = colLine(line, rect.left),
        right = colLine(line, rect.right),
        bottom = colLine(line, rect.bottom);
    
    if( top || left || right || bottom ){
        return {top,left,right,bottom};
    } else {
        return false;
    }
}

// PHYSICS PARAMS

const _Gravity = 0.5;