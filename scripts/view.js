// ///////////////////////////////////////// //
// CODE BELOW THIS POINT CAN BE USED IN GAME //
// ///////////////////////////////////////// //

// CANVAS

const viewport = document.querySelector('canvas');
const ctx = viewport.getContext('2d');
ctx.imageSmoothingEnabled = true;
ctx.lineWidth = 1.5;

const getScale = () => {
    return viewport.width / 640;
}

const resizeCanvas = (size = 640) => {
    if(size < 640) size = 640;
    viewport.width = size;
    const s = getScale();
    viewport.height = 360 * s;
    ctx.imageSmoothingEnabled = true;
    ctx.lineWidth = 1.5;
}

const fitToWindow = () => {
    // exit fullscreen
    if(document.fullscreenElement){
        document.exitFullscreen();
    }
    // get the width of the window...
    let width = window.innerWidth;
    let height = 360 * (width / 640);
    if(height > window.innerHeight){
        // resize the canvas based on the height
        width = 640 * (window.innerHeight / 360);
    }
    resizeCanvas(width);
}

const setFullscreen = () => {
    // console.log('go fullscreen');
    resizeCanvas(window.outerWidth);
    document.getElementById('game').requestFullscreen();
    
}

// TRANSFORMATION FUNCTIONS

/**
 * Mirrors a shape on the x axis
 * @param {Number} anchor the x coordinate to perform the translation around
 */
const flipX = (anchor) =>{
    ctx.translate(anchor,0);
    ctx.scale(-1,1);
    ctx.translate(-anchor,0);
}

/**
 * Mirrors a shape on the y axis
 * @param {Number} anchor the y coordinate
 */
const flipY = (anchor) => {
    ctx.translate(0,anchor);
    ctx.scale(1,-1);
    ctx.translate(0,-anchor)
}

/**
 * Rotates a shape
 * @param {Object} anchor an object containing the x and y coordinates of the anchor point
 * @param {Number} angle the amount, in degrees, by which to rotate the shape
 */
const rotate = (anchor, angle) => {
    const { x, y } = anchor;
    ctx.translate(x,y);
    ctx.rotate(degToRad(angle));
    ctx.translate(-x,-y);
}

/**
 * Sets the horizontal scale of a shape.  A value of 1 results in no horizontal scaling
 * @param {Number} x the x coordinate of the horizontal axis
 * @param {Number} y the y coordinate of the vertical axis
 * @param {Number} scale the scaling factor
 */
const scaleX = (x, y, scale) => {
    ctx.translate(x,y);
    ctx.scale(scale,1);
    ctx.translate(-x,-y);
}

/**
 * Sets the vertical scale of a shape.  A value of 1 results in no vertical scaling
 * @param {Number} x the x coordinate of the horizontal axis
 * @param {Number} y the y coordinate of the vertical axis
 * @param {Number} scale the scaling factor
 */
const scaleY = (x, y, scale) => {
    ctx.translate(x,y);
    ctx.scale(1,scale);
    ctx.translate(-x,-y);
}

// SHAPE FUNCTIONS

/**
 * Returns a Path2D object
 * @param {Object} path a 'path' shape object. { type: 'path', coords:String }
 * @returns {Path2D} a Path2D object
 */
const drawPath = (path) => {
    ctx.beginPath();
    return new Path2D(path.coords);
}

/**
 * Return a rectangular path
 * @param {Object} rect a 'rect' shape object. { type: 'rect', x : Number, y : Number, w : Number , h : Number }
 */
const drawRect = (rect) => {
    ctx.beginPath();
    const { x, y, w, h } = rect;
    ctx.rect(x,y,w,h)
}

/**
 * Creates a linear path
 * @param {Object} line a 'line' shape object: { type : 'line', x1 : Number, y1 : Number, x2 : Number, y2 : Number}
 */
const drawLine = (line) => {
    ctx.beginPath();
    const { x1, y1, x2, y2 } = line;
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
}

/**
 * Creates a polylinear path
 * @param {Object} poly a 'polyline' shape object: { type : 'polyline', points : [ { x : Number, y : Number }, ... ]
 */
const drawPolyline = (poly) => {
    const { points } = poly;
    const { x:startX, y:startY } = points[0];
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    for(let i = 1; i < points.length; i++){
        if(points[i].hasOwnProperty('y')){
            ctx.lineTo(points[i].x, points[i].y);
        }
    }
}

/**
 * Creates a polygonal path
 * @param {Object} poly a 'polygon' shape object: { type : 'polygon', points : [ { x : Number, y : Number }, ... ]
 */
const drawPolygon = (poly) => {
    drawPolyline(poly);
    ctx.closePath();
}

/**
 * Creates a circular path
 * @param {Object} circ a 'circle' shape object: { type : 'circ', x : Number, y : Number, r : Number }
 */
const drawCirc = (circ) => {
    ctx.beginPath();
    ctx.arc(circ.x, circ.y, circ.r, 0,7);
}

/**
 * Either returns a new Path2D object or creates a path
 * @param {Object} shape 
 * @returns a path or 'undefined'
 */
const drawShape = (shape) => {
    switch(shape.type){
        case 'path':
            return drawPath(shape);
        case 'line':
            return drawLine(shape);
        case 'polyline':
            return drawPolyline(shape);
        case 'polygon':
            return drawPolygon(shape);
        case 'rect':
            return drawRect(shape);
        case 'circ':
            return drawCirc(shape);
    }
}

// CONVERSION FUNCTIONS

/**
 * Converts degrees to radians
 * @param {Number} deg degrees
 * @returns degrees as radians
 */
const degToRad = (deg) => Math.PI / 180 * deg;

/**
 * Converts radians to degrees
 * @param {Number} rad radians
 * @returns radians as degrees
 */

const radToDeg = (rad) => 180 / Math.PI * rad;

// COLOR FUNCTIONS

/**
 * Given a color and a color palette, returns the hex color code of the given colors substitute
 * @param {String} color the hex color code of the color to be replaced
 * @param {[Object]} palette an array of objects with the target color's hex value as the sole property and the replacement color's hex value as the value
 * @returns {String} the hex color code of the replacement color
 */
const swapColor = (color, palette) => {
    // palette = [ {'target color' : 'new color'}, ... ]
    const newColor = palette.find( c => c[color]);
    return newColor ? Object.values(newColor)[0] : color;
}

// RENDER SPRITE

/**
 * Draws a sprite on the Canvas
 * @param {Object} sprite the sprite to render
 * @param {Number} x the x-axis coordinate of the sprite's starting point
 * @param {*} y the y-axis coordinate of the sprite's starting point
 * @param {Object} options an object consisting of additional parameters for transformation: scaleX {Number} (set horizontal scale), scaleY {Number} (set vertical scale), dir {Number} (sets rotation), mirrorX {Bool} (flips image horizontally), mirrorY {Bool} (flips image vertically), showCol {Bool} (displays collision shapes), color {Object[]} (an array of objects with a target color as it's sole property and that color's replacement as the sole value).  Transformations can be applied to individual layers by adding a property with the same name as the layer, and giving it a similar options object for it's value.
 */
const renderSprite = (sprite, x = 0, y = 0, options = {}) => {
    const { layers } = sprite;
    const { drawW:w, drawH:h } = sprite.dimensions;
    const { scale, dir, mirrorX, mirrorY, color, showCol } = options;
    const anchor = {
        x : x + (w/2),
        y : y + (h/2)
    }

    ctx.save();

    // SCALE

    if(scale){
        scaleX(x,y,scale);
        scaleY(x,y,scale);
    }

    // MIRROR

    if(mirrorX){
        flipX(anchor.x);
    }
    if(mirrorY){
        flipY(anchor.y);
    }

    // ROTATE

    if(dir){
        rotate(anchor, dir);
    }

    // TRANSLATE

    ctx.translate(x,y);

    // RENDER

    for( const layer of layers){

        // APPLY LAYER TRANSFORMATIONS

        let transformLayer = false;
        if(Object.keys(options).includes(layer.name)){
            // SAVE TRANSFORMATION MATRIX
            ctx.save();
            transformLayer = true;
            const { xScale, yScale, dir, mirrorX, mirrorY, offset } = options[layer.name];
            const { anchor, origin } = layer;

            // SCALE

            if(xScale) ctx.scale(xScale,1);
            if(yScale) ctx.scale(1,yScale);

            // MIRROR

            if(mirrorX) flipX(anchor.x);
            if(mirrorY) flipY(anchor.y);

            // ROTATE

            if(dir) rotate(anchor, dir);

            // TRANSLATE
            if(offset){
                if(dir){
                    const theta = degToRad(dir);
                    if(offset.y){
                        ctx.translate(offset.y * Math.sin(theta), offset.y * Math.cos(theta));
                    }
                    if(offset.x){
                        ctx.translate(offset.x * Math.sin(theta), offset.x * Math.cos(theta));
                    }
                } else {
                    ctx.translate(offset.x, offset.y);
                }
            }
        }

        // DRAW SHAPES

        for( const shape of layer.shapes){
            const path = drawShape(shape);
            if(shape.fill !== 'none'){
                if(color){
                    ctx.fillStyle = swapColor(shape.fill, color);
                } else {
                    ctx.fillStyle = shape.fill;
                }
                path ? ctx.fill(path) : ctx.fill();
            }
            if(shape.hasOwnProperty('stroke')  && shape.stroke){
                if(color){
                    ctx.strokeStyle = swapColor(shape.stroke, color);
                } else {
                    ctx.strokeStyle = shape.stroke;
                }
                path ? ctx.stroke(path) : ctx.stroke();
            }
        }

        // RESET

        if(transformLayer) {
            ctx.restore();
        }
    }

    // RESET

    ctx.restore();

    // DRAW HITBOXES

    if(showCol){
        drawCol(sprite, x, y, scale)
    }
}

/**
 * draws a sprites collision shapes on the canvas.
 * @param {Object} sprite a sprite object
 */
const drawCol = (sprite,x,y,scale) => {
    const { col } = sprite;
    scaleX(x,y,scale);
    scaleY(x,y,scale);
    ctx.strokeStyle = 'red';
    ctx.translate(10,10);
    col.forEach( c => {
        drawShape(c);
        ctx.stroke();
    })
    ctx.resetTransform();
}