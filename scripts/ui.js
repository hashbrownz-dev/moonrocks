// HUD

const drawHUD = (game) => {
    // SET FILL AND STROKE PROPERTIES
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.strokeStyle = 'white';

    // DRAW LEFT ELEMENT

    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(0,42);
    ctx.lineTo(107,42);
    ctx.lineTo(150,0);
    ctx.closePath();

    ctx.fill();
    ctx.stroke();

    // DRAW RIGHT ELEMENT

    ctx.beginPath();
    ctx.moveTo(640,0);
    ctx.lineTo(640,42);
    ctx.lineTo(533,42);
    ctx.lineTo(490,0);
    ctx.closePath();

    ctx.fill();
    ctx.stroke();

    // DRAW CENTER ELEMENT

    ctx.beginPath();
    ctx.moveTo(250,0);
    ctx.lineTo(274,24);
    ctx.lineTo(366,24);
    ctx.lineTo(390,0);
    ctx.closePath();

    ctx.fill();
    ctx.stroke();

    // DRAW LABELS
    ctx.fillStyle = 'white';
    ctx.font = `300 12px Orbitron, sans-serif`;

    ctx.textAlign = 'left';
    ctx.fillText('SCORE', 10,15);
    ctx.textAlign = 'right';
    ctx.fillText('HI SCORE', 630,15);

    // DRAW CURRENT WAVE
    ctx.textAlign = 'center';
    let waveText = game ? game.getWave() : 'GAME OVER';
    ctx.fillText(waveText, 320, 15);

    // DRAW SCORE
    ctx.font = `300 18px Orbitron, sans-serif`;

    ctx.textAlign = 'left';
    let scoreText = game ? String(game.score).padStart(6,'0') : '000000';
    ctx.fillText(scoreText, 10, 35);

    // DRAW HI SCORE
    ctx.textAlign = 'right';
    let hiScoreText = game ? String(game.hiScore).padStart(6,'0') : String(getHiScore()).padStart(6,'0');
    ctx.fillText(hiScoreText, 630, 35);

    // DRAW LIVES
    if(game && game.lives > 0){
        drawLives(game.lives);
    }
}

const drawLives = (amount) => {
    // GET START X
    // START X = 360 - (amount * 15) + ((lives-1) * 4) / 2
    const offset = ((amount * 15) + ((amount-1) *4)) / 2;
    const startX = 320 - offset;
    if(amount <= 5){
        for ( let i = 0; i < amount; i++){
            // take our start
            // add the draw w and 4 pixel margin (19)
            // multiply this by i [ 0, 19, 38, ...]
            renderSprite(LifeIcon, startX + 19 * i, 28);
        }
    }
}

// TITLE

const updateMenu = (event) => {
    if(_Menu){
        const keys = ['a','d','j','ArrowLeft','ArrowRight'];
        if(keys.includes(event.key)){
            event.preventDefault();
            switch(event.key){
                case 'a':
                case 'ArrowLeft':
                    _Menu.updateSelection(-1);
                    break;
                case 'd':
                case 'ArrowRight':
                    _Menu.updateSelection(1);
                    break;
                case 'j':
                    _Menu.select();
                    break;
            }
        }
    }
}

class Title {
    constructor(){
        this.options = [
            'play',
            'options',
        ]
        this.items = [
            new MenuItem('Play', 268.5, 230, ()=>_State = 'play'),
            new MenuItem('Options', 371, 230, () => _State = 'options'),
        ]
        this.selection = 0;
        this.cursor = LifeIcon;
    }
    updateSelection(n){
        // handle selection
        // selection = something?
        this.selection += n;
        if(this.selection < 0) this.selection = this.options.length - 1;
        if(this.selection >= this.options.length) this.selection = 0;
    }
    select(){
        _State = this.options[this.selection];
        _Menu = undefined;
        // console.log(this.options[this.selection]);
    }
    draw(){
        // Draw BG Images / Demo
        // Draw Main Title As Image
        // Draw Main Title As Text
        ctx.fillStyle = 'white';
        ctx.font = `300 48px Orbitron, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('MOON ROCKS', 320, 140);
        // Draw Options

        this.items.forEach( item => item.draw() );

        // Draw SubText (A game by...)
        // ctx.font = `300 12px Orbitron, sans-serif`;
        // ctx.fillText('Move Cursor with "A" and "D" / Press "J" to Choose Selection', 320, 340);
        ctx.font = `300 10px Orbitron, sans-serif`;
        ctx.fillText('A Game by Hashbrownz', 320, 355);
    }
}

class Menu {
    constructor(options){
        this.options = options;
        this.selection = 0;
        this.cursor = LifeIcon;
    }
    updateSelection(n){
        this.selection += n;
        if(this.selection < 0) this.selection = this.options.length - 1;
        if(this.selection >= this.options.length) this.selection = 0;
    }
    select(){
        _State = this.options[this.selection];
        _Menu = undefined;
    }
    drawSubText(){
        // Draw SubText (A game by...)
        ctx.font = `300 12px Orbitron, sans-serif`;
        ctx.fillText('Move Cursor with "A" and "D" / Press "J" to Choose Selection', 320, 340);
        ctx.font = `300 10px Orbitron, sans-serif`;
        ctx.fillText('A Game by Hashbrownz', 320, 355);
    }
}

class MenuItem {
    // if scale doesn't affect text metrics... (i.e. if they are based on font) then we can just use the same code as bombardment
    constructor(text = 'default', x = 0, y = 0, func){
        this.text = text;
        this.x = x;
        this.y = y;
        this.func = func;

        this.font = `300 18px Orbitron, sans-serif`;
        this.align = `center`;

        // Set Font and Alignment
        ctx.font = this.font;
        ctx.textAlign = this.align;

        // Measure Text to Create Bounding Rect
        const { width, actualBoundingBoxAscent:top, actualBoundingBoxDescent:bottom, actualBoundingBoxLeft:left, actualBoundingBoxRight:right } = ctx.measureText(text);
        this.col = new Rect( this.x - left - 8, this.y - top, width + 16, top + bottom );
    }
    //
    draw(){
        ctx.font = this.font;
        ctx.align = this.align;
        ctx.fillStyle = 'white';
        ctx.fillText(this.text, this.x, this.y);

        ctx.strokeStyle = 'lime';
        ctx.strokeRect(this.col.x, this.col.y, this.col.w, this.col.h );
    }
}

class GameOver extends Menu{
    constructor(){
        super(['play','title']);
    }
    draw(score){
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        // Draw Thank You Message
        ctx.font = `300 21px Orbitron, sans-serif`;
        ctx.fillText('Thanks for Playing!', 320, 123);

        // Draw Final Score
        ctx.font = `300 12px Orbitron, sans-serif`;
        ctx.fillText('Final Score', 320, 156);
        ctx.font = `300 21px Orbitron, sans-serif`;
        ctx.fillText(String(score), 320, 179);

        // Draw Options
        const pax = 260;
        const qx = 380;
        const y = 230;

        ctx.font = `300 18px Orbitron, sans-serif`;
        ctx.fillText('Play Again', pax, y);
        ctx.fillText('Quit', qx, y);

        // Draw Cursor
        let cursorX = -7.5;
        switch(this.selection){
            case 0:
                cursorX += pax;
                break;
            case 1:
                cursorX += qx;
                break;
        }
        renderSprite(this.cursor, cursorX, y + 10);
        // Draw Sub Text
        this.drawSubText();
    }
}

class Pause extends Menu{
    constructor(){
        super([
            'play',
            'options',
            'reset',
            'title',
        ])
    }
    draw(){
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';

        // Draw Heading
        ctx.font = `300 48px Orbitron, sans-serif`;
        ctx.fillText('PAUSED', 320, 138);
        // Draw Options
        const resumeX = 157,
            optX = 259,
            restartX = 381,
            qx = 502,
            y = 230;

        ctx.font = `300 18px Orbitron, sans-serif`;
        ctx.fillText(`Resume`,resumeX,y);
        ctx.fillText(`Options`, optX,y);
        ctx.fillText(`Restart`,restartX,y);
        ctx.fillText(`Quit`,qx,y);

        // Draw Cursor
        let cursorX = -7.5;
        switch(this.selection){
            case 0:
                cursorX += resumeX;
                break;
            case 1:
                cursorX += optX;
                break;
            case 2:
                cursorX += restartX;
                break;
            case 3:
                cursorX += qx;
                break;
        }
        renderSprite(this.cursor, cursorX, y+10);
        // Draw Sub Text
        this.drawSubText();
    }
}