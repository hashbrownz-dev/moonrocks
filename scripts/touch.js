// TOUCH OVERLAY

const setTouchCol = (sprite, x, y) => {
    const shape = sprite.col[0];
    switch(shape.type){
        case 'circ':
            return new Circ(x + shape.x, y + shape.y, shape.r);
        case 'rect':
            return new Rect(x + shape.x, y + shape.y, shape.w, shape.h);
    }
}

class TouchButton {
    constructor(sprite, x, y){
        this.sprite = sprite;
        this.x = x;
        this.y = y;
        this.active = false;
        this.col = setTouchCol(this.sprite, this.x, this.y);
    }
    draw(){
        // so if we want a simple version of renderSprite... we can essentially get the single layer object from our sprite and draw each shape...
        // TRANSLATE
        ctx.save();
        ctx.translate(this.x, this.y);
        for (const shape of this.sprite.layers[0].shapes){
            const path = drawShape(shape);
            if(shape.fill !== 'none'){
                if(!this.active){
                    ctx.fillStyle = shape.fill;
                    path ? ctx.fill(path) : ctx.fill();
                } else {
                    ctx.fillStyle = '#000000';
                    path ? ctx.fill(path) : ctx.fill();
                }
            }
            if(shape.hasOwnProperty('stroke') && shape.stroke){
                if(!this.active){
                    ctx.strokeStyle = shape.stroke;
                    path ? ctx.stroke(path) : ctx.stroke();
                } else {
                    ctx.fillStyle = shape.stroke;
                    path ? ctx.fill(path) : ctx.fill();
                }
            }
        }
        ctx.restore();
    }
}

const handleTouch = (e) => {
    e.preventDefault();
    if(_Interface !== 'touch') _Interface = 'touch';
    // GET THE X,Y COORDS OF OUR VIEWPORT
    const { x, y } = viewport.getBoundingClientRect();
    for( const b of TouchButtons ){
        b.active = false;
        for( const touch of e.touches ){
            const tCol = new Circ((touch.clientX - x) / getScale(), (touch.clientY - y) / getScale(), touch.radiusX);
            if(colCirc(b.col, tCol)){
                b.active = true;
            }
        }
    }
}

viewport.addEventListener('touchstart', handleTouch);
viewport.addEventListener('touchend', handleTouch);
viewport.addEventListener('touchmove', handleTouch);

const TouchButtons = [
    new TouchButton(touchLeft, 16, 294),
    new TouchButton(touchRight, 83, 294),
    new TouchButton(touchShoot, 443, 294),
    new TouchButton(touchGo, 509, 294),
    new TouchButton(touchStop, 574, 294),
]