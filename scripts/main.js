const _Keyboard = trackKeys();

let _Game, _State = 'play';

const main = () => {
    let previousTime;

    const update = (timeStamp) => {
        if(!previousTime) previousTime = timeStamp;
        const elapsed = timeStamp - previousTime;
        previousTime = timeStamp;

        // Clear Screen

        ctx.clearRect(0,0,viewport.width,viewport.height);

        // Draw BG

        ctx.fillStyle = 'black';
        ctx.fillRect(0,0,viewport.width,viewport.height);

        // Set Global Scale
        const s = getScale();
        ctx.scale(s,s);

        // Get State

        switch(_State.toLowerCase()){
            case 'play':
                if(!_Game)_Game = new Game();
                _Game.update(_Keyboard);
                _Game.draw();
                break;
            default:
                console.log('Oops!');
                return;
        }

        // DRAW HUD

        // RESET TRANSFORMATION
        ctx.resetTransform();

        // LOOP
        requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

// Set Initial Screen Resolution
resizeCanvas(1024);
main();