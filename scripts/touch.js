// TOUCH OVERLAY

const drawTouchControls = () => {
    const y = 294;
    // LEFT
    renderSprite(touchLeft, 16, y);
    // RIGHT
    renderSprite(touchRight, 83, y);
    // SHOOT
    renderSprite(touchShoot, 459, y);
    // ACCELERATE
    renderSprite(touchGo, 517, y);
    // DECELERATE
    renderSprite(touchStop, 574, y);
}