// KEYBOARD

const trackKeys = (keys = ['w', 'a', 'd', 'f', 'j', 'k', ' ']) => {
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

const trackMouse = () => {
    const mouse = { x:0, y:0 };
    document.querySelector('canvas').addEventListener('mousemove', e => {
        mouse.x = e.offsetX;
        mouse.y = e.offsetY;
    })
    window.addEventListener('mousedown', e => {
        mouse.down = true;
    })
    window.addEventListener('mouseup', e => {
        mouse.down = false;
    })
    return mouse;
}