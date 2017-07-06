var coinPickupCount = 0;
var hasKey = false;
var level = 0;

function init(){
  
}

function preload(){
  game.load.image('background', 'images/1920x1080-yellow-solid-color-background.jpg');
  game.load.json('level:1', 'data/level01.json');
  game.load.json('level:0', 'data/level00.json');
  //spawn platform sprites
    game.load.image('ground', 'images/ground.png');
    game.load.image('grass:8x1', 'images/grass_8x1.png');
    game.load.image('grass:6x1', 'images/grass_6x1.png');
    game.load.image('grass:4x1', 'images/grass_4x1.png');
    game.load.image('grass:2x1', 'images/grass_2x1.png');
    game.load.image('grass:1x1', 'images/grass_1x1.png');

    // load the hero image=
    game.load.image('hero', 'images/goku (1).png');
    game.load.audio('sfx:jump', 'audio/jump.wav');
    game.load.audio('sfx:coin', 'audio/coin.wav');
    game.load.audio('sfx:stomp', 'audio/stomp.wav');
    game.load.spritesheet('coin', 'images/coin_animated.png', 22, 22);
    game.load.spritesheet('spider', 'images/spider.png', 42, 32);
    game.load.image('invisible-wall', 'images/invisible_wall.png');
    game.load.image('icon:coin', 'images/coin_icon.png');
    game.load.image('font:numbers', 'images/numbers.png');
    game.load.spritesheet('door', 'images/door.png', 42, 66);
    game.load.image('key', 'images/key.png');
    game.load.audio('sfx:key', 'audio/key.wav');
    game.load.audio('sfx:door', 'audio/door.wav');
    game.load.spritesheet('icon:key', 'images/key_icon.png', 34, 30);

};

function create(){
  game.add.image(0, 0, 'background');
  sfxJump = game.add.audio('sfx:jump');

  sfxCoin = game.add.audio('sfx:coin');
  sfxStomp = game.add.audio('sfx:stomp');
  sfxKey = game.add.audio('sfx:key');
    sfxDoor = game.add.audio('sfx:door');
    keyIcon = game.make.image(0, 19, 'icon:key');
    keyIcon.anchor.set(0, 0.5);
  coinIcon = game.make.image(40, 0, 'icon:coin');
  loadLevel(this.game.cache.getJSON('level:' + level));
  leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    upKey.onDown.add(function(){
        jump();
    });


    hud = game.add.group();
    hud.add(coinIcon);
    hud.position.set(10, 10);

    // ? - Declare a variable 'NUMBERS_STR' and set its value as string '0123456789X '
    var NUMBERS_STR = '0123456789X ';
    coinFont = game.add.retroFont('font:numbers', 20, 26, NUMBERS_STR, 6);

    var coinScoreImg = game.make.image(100 + coinIcon.width, coinIcon.height / 2, coinFont);
    coinScoreImg.anchor.set(1, 0.5);

    hud.add(coinScoreImg);
    hud.add(keyIcon);
}

function update(){
  handleInput();
  handleCollisions();
  moveSpider();
  keyIcon.frame = hasKey ? 1 : 0;
}

function loadLevel(data) {
  console.log(data);
  platforms = game.add.group();
  coins = game.add.group();
  spiders = game.add.group();
  enemyWalls = game.add.group();
  bgDecoration = game.add.group();
  enemyWalls.visible = false;
  data.platforms.forEach(spawnPlatform, this);
  // spawn hero and enemies
    spawnCharacters({hero: data.hero, spiders: data.spiders});  
    spawnDoor(data.door.x, data.door.y);
    spawnKey(data.key.x, data.key.y);
    // spawn important objects
    data.coins.forEach(spawnCoin, this);
    game.physics.arcade.gravity.y = 1200;
};

function spawnPlatform(platform) {
    game.add.sprite(platform.x, platform.y, platform.image);
    var sprite = platforms.create(platform.x, platform.y, platform.image);
    spawnEnemyWall(platform.x, platform.y, 'left');
    spawnEnemyWall(platform.x + sprite.width, platform.y, 'right');
    game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;
};

function spawnCharacters (data) {
    // spawn hero
    hero = game.add.sprite(data.hero.x, data.hero.y, 'hero');
    hero.anchor.set(0.5, 0.8);
    //Make the main character use the physics engine for movement
    game.physics.enable(hero);
    hero.body.collideWorldBounds = true;
     data.spiders.forEach(function (spider){
        var sprite = game.add.sprite(spider.x, spider.y, 'spider');
        spiders.add(sprite);
        sprite.anchor.set(0.5);
        // animation
        sprite.animations.add('crawl', [0, 1, 2], 8, true);
        sprite.animations.add('die', [0, 4, 0, 4, 0, 4, 3, 3, 3, 3, 3, 3], 12);
        sprite.animations.play('crawl');
        game.physics.enable(sprite);
        sprite.body.collideWorldBounds = true;
        // ? - Set the sprite.body.velocity.x to value 100
        sprite.body.velocity.x = 100;
    })
};

function move(direction){
    hero.body.velocity.x = direction * 200;
    if (hero.body.velocity.x < 0) {
        hero.scale.x = -1;
    }
    else if (hero.body.velocity.x > 0) {
        hero.scale.x = 1;
    }
}

function handleInput(){
    if (leftKey.isDown) { // move hero left
        move(-1);
    }
    else if (rightKey.isDown) { // move hero right
        move(1);
    } 
    else {
      move(0);
    }
}
function handleCollisions(){
   game.physics.arcade.collide(hero, platforms);
   game.physics.arcade.collide(spiders, platforms);
   game.physics.arcade.collide(spiders, enemyWalls);
   game.physics.arcade.overlap(hero, coins, onHeroVsCoin, null);
   game.physics.arcade.overlap(hero, spiders, onHeroVsEnemy, null);
   game.physics.arcade.overlap(hero, key, onHeroVsKey, null);
   game.physics.arcade.overlap(hero, door, onHeroVsDoor,
        // ignore if there is no key or the player is on air
        function (hero, door) {
            return hasKey && hero.body.touching.down;
        });
};

function jump(){
    var canJump = hero.body.touching.down;
    //Ensures hero is on the ground or on a platform
    if (canJump) {
        hero.body.velocity.y = -600;
        sfxJump.play();
    }
    return canJump;
}

function spawnCoin(coin) {
    var sprite = coins.create(coin.x, coin.y, 'coin');
    sprite.anchor.set(0.5, 0.5);
    sprite.animations.add('rotate', [0, 1, 2, 1], 6, true); // 6fps, looped
    sprite.animations.play('rotate');
    game.physics.enable(sprite);
    sprite.body.allowGravity = false;
};

function onHeroVsCoin(hero, coin){
  sfxCoin.play();
    coin.kill();
};

function spawnEnemyWall(x, y, side){
    var sprite = enemyWalls.create(x, y, 'invisible-wall');
    sprite.anchor.set(side === 'left' ? 1 : 0, 1);
    game.physics.enable(sprite);
    sprite.body.immovable = true;
    sprite.body.allowGravity = false;
}

function moveSpider(){
    spiders.forEach(function (spider){
        if (spider.body.touching.right || spider.body.blocked.right) {
            spider.body.velocity.x = -100; // turn left
        }
        else if (spider.body.touching.left || spider.body.blocked.left) {
            // ? - Change spiders velocity to turn right
            spider.body.velocity.x = 100;
        }
    })
}

function onHeroVsEnemy(hero, enemy){
    if (hero.body.velocity.y > 0) { // kill enemies when hero is falling
        hero.body.velocity.y = -200;
        die(enemy);
        sfxStomp.play();
    }
    else { // game over -> restart the game
        sfxStomp.play();
        game.state.restart();
    }
}

function die(spider) {
  spider.body.enable = false;
  spider.animations.play('die');
  spider.animations.play('die').onComplete.addOnce(function () {
    spider.kill();
  });
}

function spawnSpider(){
    spider = spiders.create(spider.x, spider.y, 'spider');
    spider.anchor.set(0.5);
    spider.animations.add('crawl', [0, 1, 2], 8, true);
    spider.animations.add('die', [0, 4, 0, 4, 0, 4, 3, 3, 3, 3, 3, 3], 1);
    spider.animations.play('crawl');

    // physic properties
    game.physics.enable(spider);
    spider.body.collideWorldBounds = true;
    spider.body.velocity.x = Spider.speed;
}

function onHeroVsCoin(hero, coin){
    coinPickupCount++;
    coin.kill();
    coinFont.text = `x${coinPickupCount}`;
}

function spawnDoor(x, y){
    door = bgDecoration.create(x, y, 'door');
    door.anchor.setTo(0.5, 1);
    game.physics.enable(door);
    door.body.allowGravity = false;
}

function spawnKey(x, y){
    key = bgDecoration.create(x, y, 'key');
    key.anchor.set(0.5, 0.5);
    game.physics.enable(key);
    key.body.allowGravity = false;
}

function onHeroVsKey(hero, key){
    sfxKey.play();
    key.kill();
    hasKey = true;
}

function onHeroVsDoor(hero, door){
    sfxDoor.play();
    if (level === 0){
      level = level + 1;
    }
    else {
      level = 0;
    }
    hasKey = false;
    game.state.restart();
}

//Create a game state
var game = new Phaser.Game(960, 600, Phaser.AUTO, 'game', {init: init, preload: preload, create: create, update: update});