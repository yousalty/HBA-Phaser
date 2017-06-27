function init(){
    function init(){
    Make hero sprite more focused when moving around
    game.renderer.renderSession.roundPixels = true;
}

function preload() {
    game.load.image('background', 'images/background.png')
    game.load.json('level:1', 'data/level01.json');
    //spawn platform sprites
    game.load.image('ground', 'images/ground.png');
    game.load.image('grass:8x1', 'images/grass_8x1.png');
    game.load.image('grass:6x1', 'images/grass_6x1.png');
    game.load.image('grass:4x1', 'images/grass_4x1.png');
    game.load.image('grass:2x1', 'images/grass_2x1.png'); 
    game.load.image('grass:1x1', 'images/grass_1x1.png'); 
    game.load.image('hero', 'images/hero_stopped.png');
};

function create(){

	loadLevel(this.game.cache.getJSON('level:1'));
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
  
}   

function loadLevel(data) {
	console.log(data)
        game.add.image(0, 0, 'background')

    data.platforms.forEach(spawnPlatform, this);

};

function spawnPlatform(platform) {
    game.add.sprite(platform.x, platform.y, platform.image);
      var sprite = platforms.create(platform);
    console.log(sprite);
};
function spawnCharacter(){
    hero - game.add.sprite(data.hero.x, data.hero.y, 'hero');
    hero.anchor.set(0.5, 0.5);
    game.physics.enable(hero);
}

function update(){
 handleInput();
}            

function handleInput(){
    if (leftKey.isDown) { // move hero left
        move(-1);
    }
    else if (rightKey.isDown) { // move hero right
        move(1);
    }
}

function move(direction){
    hero.body.velocity.x = direction * 200;
    if (hero.body.velocity.x < 0){
        hero.scale.x = 1;
    }
    else if (hero.body.velocity.x > 0){
        hewro.scale.x = 1;
    }
}
//Create a game state
var game = new Phaser.Game(960, 600, Phaser.AUTO, 'game', {init: init, preload: preload, create: create, update: update});
