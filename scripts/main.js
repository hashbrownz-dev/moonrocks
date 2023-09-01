const _Keyboard = trackKeys();

let _Game, _State = 'title', _Menu = new Title();

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
            case 'title':
                if(!_Menu) _Menu = new Title();
                _Menu.draw();
                break;
            case 'play':
                if(!_Game || _Game.gameOverTimer <= 0){
                    _Game = new Game();
                }
                _Game.update(_Keyboard);
                _Game.draw();
                break;
            case 'options':
                console.log('OPTIONS');
                break;
            case 'game over':
                if(!_Menu) _Menu = new GameOver();
                _Game.update(_Keyboard);
                _Game.draw();
                _Menu.draw(_Game.score);
                break;
            case 'reset':
                if(_Game) _Game.reset();
                _State = 'play';
                break;
            case 'pause':
                if(!_Menu) _Menu = new Pause();
                _Menu.draw();
                break;
            default:
                console.log('Oops!');
                return;
        }

        // DRAW HUD

        drawHUD(_Game);

        // RESET TRANSFORMATION
        ctx.resetTransform();

        // LOOP
        requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

// Set Initial Screen Resolution
fitToWindow();
// ADD MENU EVENT LISTENER
window.addEventListener('keydown', updateMenu);
main();