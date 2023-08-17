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
            }
        })
    }
    get isOutOfBounds(){
        return ( this.x + (this.drawW/2) < 0 || this.x > 640 + (this.drawW/2) || this.y + (this.drawH/2) < 0 || this.y > 360 + (this.drawH/2) )
    }
    update(game){

    }
    draw(){
        renderSprite(this.sprite, this.drawX, this.drawY, { dir:this.dir })
    }
}