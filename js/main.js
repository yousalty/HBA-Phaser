function init(){
	
}

function preload() {
    // game.load.json('level:1', 'data/level01.json');
    //spawn platform sprites
    game.load.image('ground', 'images/ground.png');
    game.load.image('grass:8x1', 'images/grass_8x1.png');
    game.load.image('grass:6x1', 'images/grass_6x1.png');
    // ? - load the image for grass:4x1
    // ? - load the image for grass:2x1
    // ? - load the image for grass:1x1
};

function create(){
	game.add.image(0, 0, 'background');
	loadLevel(this.game.cache.getJSON('level:1'));
}                   
function loadLevel(data) {
	console.log(data)
    data.platforms.forEach(spawnPlatform, this);
};

function spawnPlatform(platform) {
    game.add.sprite(platform.x, platform.y, platform.image);
};

function update(){

}            


//Create a game state
var game = new Phaser.Game(960, 600, Phaser.AUTO, 'game', {init: init, preload: preload, create: create, update: update});