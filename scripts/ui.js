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