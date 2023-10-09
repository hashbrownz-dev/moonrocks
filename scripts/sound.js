const path = `./assets/sound/`;

const sfxBulletImpact = new Audio(path + `BulletImpact.ogg`);
const sfxGemCollect = new Audio(path + `GemCollect.wav`);
const sfxMenuSelect = new Audio(path + `MenuSelect.wav`);
const sfxPlayerDeath = new Audio(path + `PlayerDeath.wav`);
sfxPlayerDeath.volume = 0.75;
const sfxPlayerShoot = new Audio(path + `PlayerShoot.wav`);
sfxPlayerShoot.volume = 0.25;
const sfxPlayerThrust = new Audio(path + `PlayerThrust.wav`);
sfxPlayerThrust.volume = 0.5;
const sfxRockExplode = new Audio(path + `RockExplode.wav`);
const sfxUFOAppear = new Audio(path + `UFOAppear.ogg`);
const sfxUFOExplode = new Audio(path + `UFOExplode.wav`);
const sfxUFOShoot = new Audio(path + `UFOShoot.ogg`);