// KEYBOARD

const trackKeys = (keys = ['w', 'a', 's', 'd', 'f', 'j', 'k', 'l', ' ']) => {
    let down = Object.create(null);
    const track = (event) => {
        if(keys.includes(event.key)){
            event.preventDefault();
            down[event.key] = event.type == 'keydown';
        }
    }
    window.addEventListener('keydown', track);
    window.addEventListener('keyup', track);
    return down;
}

const getMenuInput = (event) => {
    event.preventDefault();
    console.log(event.key);
}

// MOUSE

const handleMouse = (e) => {
    e.preventDefault();
    if(_Menu && e.type === 'mousedown'){
        const mx = Math.round(e.offsetX / getScale()),
            my = Math.round(e.offsetY / getScale());
        
        for( const item of _Menu.items ){
            if(colPointRect({x:mx,y:my}, item.col)){
                _Menu = undefined;
                return item.func();
            }
        }
    }
}

viewport.addEventListener('mousedown', handleMouse);