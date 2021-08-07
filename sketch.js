//Setting up the variables for gamestates, sprites and spriteImages 

var START = 1;
var PLAY = 2;
var END = 3;
var gameState = START;
var start, startImage;
var end, endImage;
var track1, track2, track3, track4, track5, track6, trackGp;
var player, playerAnimation;
var rail1, rail2, rail3, railGroup;
var bombs, bombImage, bombRand, bombGp;
var energyDrink, energyRand, energyImage, energyGp;
var coins, coinRand, coinImage, coinGp;
var sound;
var score;

function preload(){
  //Loading the images and animation.
  // playerAnimation = loadAnimation("images/sprite1.png", "images/sprite2.png", "images/sprite3.png", "images/sprite4.PNG","images/sprite5.png");
  playerImg = loadImage("images/unnamed.gif")

  startImage = loadImage("images/live-game-telecast-video-player-260nw-469262051(1).jpg");
  endImage = loadImage("images/game-over-1.jpeg")
  
  bombImage = loadImage("images/bomb.png"); 
  energyImage = loadImage("images/energyDrink.png");
  coinImage = loadImage("images/coin.png");
  
  sound = loadSound("sound.mp3");
}

function setup(){
  //creating the canvas of width 600 and height 600. 
  createCanvas(600,600);
  
  //Creating the player, tracks, startImage and groups.
  player = createSprite(300,500,20,20);
  // player.addAnimation("player", playerAnimation);
  player.addImage("player", playerImg);
  player.scale = 0.3;
  player.visible = false;
  
  // track1 = createSprite(50, -550, 10, 1200);
  // track2 = createSprite(150, -550, 10,1200);
  // track3 = createSprite(250, -550, 10, 1200);
  // track4 = createSprite(350, -550, 10, 1200);
  // track5 = createSprite(450, -550, 10, 1200);
  // track6 = createSprite(550, -550, 10, 1200);

  track1 = createSprite(0, 50, 1200, 10);
  track2 = createSprite(0, 150, 1200, 10);
  track3 = createSprite(0, 250, 1200, 10);
  track4 = createSprite(0, 350, 1200, 10);
  track5 = createSprite(0, 450, 1200, 10);
  track6 = createSprite(0, 550, 1200, 10);
   
  coinRand = Math.round(random(1,3));
  energyRand = Math.round(random(1,3));
  bombRand = Math.round(random(1,3));
  
  track1.shapeColor = "black";
  track2.shapeColor = "black";
  track3.shapeColor = "black";
  track4.shapeColor = "black";
  track5.shapeColor = "black";
  track6.shapeColor = "black";
   
  start = createSprite(285,290,30,30)
  start.addImage("start", startImage);
  start.scale = 0.79;
  
  end = createSprite(300,300,20,20);
  end.addImage("end", endImage);
  end.visible = false;
  
  sound.loop();
  
  railGroup = new Group();
  coinGp = new Group();
  energyGp = new Group();
  bombGp = new Group();

  score = 0;
}

function draw() {
  //clearing the canvas
  background("#c2b280");

  if(gameState === START){
    fill("#c2b280");
    stroke("#c2b280");
  } else if (gameState === END) {
    fill("white");
    stroke("white");
  }

  textSize(30);
  text("score :" + score, 360, 30);
  
  //Calling the functions for the rails
  rails();
  
  camera.position.x = player.x;
  // camera.position.y = displayHeight/2;

  if(gameState === PLAY)
  score = score + Math.round(getFrameRate()/60);
  
  if(gameState === START){
    if(keyDown("space")){
      gameState = PLAY;
    }   
  } else if (gameState === PLAY){
    start.destroy();
    player.visible = true;
    rail1.visible = true; 
    rail2.visible = true;
    rail3.visible = true;  
    
   //Selecting random things to spawn it
   var select_object = Math.round(random(1,3));
   if(World.frameCount % 30 == 0){
     if(select_object == 1){
       coin();
     }
     else if(select_object == 2){
       bomb();
     }
     else{
       energy();
     }
   }
    // track1.velocityY = 4;
    // track2.velocityY = 4;
    // track3.velocityY = 4;
    // track4.velocityY = 4;
    // track5.velocityY = 4;
    // track6.velocityY = 4;

    track1.velocityX = 4;
    track2.velocityX = 4;
    track3.velocityX = 4;
    track4.velocityX = 4;
    track5.velocityX = 4;
    track6.velocityX = 4;
    
    if(track1.x>600||track2.x>600||track3.x>600||track4.x>600||track5.x>600||track6.x>600){
      track1.velocityX = 0;
      track2.velocityX = 0;
      track3.velocityX = 0;
      track4.velocityX = 0;
      track5.velocityX = 0;
      track6.velocityX = 0;    
    }

    console.log(player.y)

    if(player.y == 300||player.y == 500||player.y == 100){
      player.velocityY = 0;
    } 

    if(keyDown("up")/*&&player.y<500*/){
      player.velocityY = -8;
    }

    if(keyDown("down")/*&&player.y>100*/){
      player.velocityY = 8;
    }
    
    if(coinGp.isTouching(player)){
      coinGp.destroyEach();
    }
    
    if(bombGp.isTouching(player)){
      gameState = END;
    }
    
    if(energyGp.isTouching(player)){
      energyGp.destroyEach();
    }
  }  else if (gameState === END){
     player.destroy();
     coinGp.destroyEach();
     bombGp.destroyEach();
     energyGp.destroyEach();
     track1.destroy();
     track2.destroy();
     track3.destroy();
     track4.destroy();
     track5.destroy();
     track6.destroy();     
     railGroup.destroyEach();
    
     background(0);
     
    end.visible = true; 
  }
  
  drawSprites();
  
  if(gameState == START){
    stroke("white");
    fill("white")
    textSize(30);
    text("Press Space to continue ", 170, 500); 
    text("Use right and left keys to move", 150, 450);
  }
}

function rails(){
  
  //Creating the rails
  if(frameCount%20 === 0) {   
    // for (var a = 0; a < 50; a=a+50){
      // rail1 = createSprite(a,100,10,100);
      rail1 = createSprite(600,100,10,100);
      rail1.velocityX = -4;
                 
      rail2 = createSprite(600,300,10,100);
      rail2.velocityX = -4;
            
      rail3 = createSprite(600,500,10,100);
      rail3.velocityX = -4;
      
      railGroup.add(rail1);
      railGroup.add(rail2);
      railGroup.add(rail3);      
                 
      //adjusting the depths      
      player.depth = rail1.depth;
      rail1.depth = rail1.depth+1;
      
      player.depth = rail2.depth;
      rail2.depth = rail2.depth+1;
      
      player.depth = rail3.depth;
      rail3.depth = rail3.depth+1;
            
      rail1.visible = false;
      rail2.visible = false;
      rail3.visible = false;
  }
}

function coin(){
  
  // coins = createSprite(100, -40, 20, 20);
  coins = createSprite(600, 100, 20, 20);
  coins.addImage("coins", coinImage);
  coins.scale = 0.3;
  coins.lifetime = 120;
  coinGp.add(coins);
  
  //Asigning random places for the coins
  if(frameCount%30 === 0){
    switch(coinRand) {
        case 1: coins.y = 100;
                coins.velocityX = -(6 + 3*score/100);
                break;
        case 2: coins.y = 300;
                coins.velocityX = -(6 + 3*score/100);
                break;
        case 3: coins.y = 500;
                coins.velocityX = -(6 + 3*score/100);
                break;
        default: break;
    }
  }
}
function energy(){
  
  // energyDrink = createSprite(100, -50, 20, 20);
  energyDrink = createSprite(600, -50, 20, 20);
  energyDrink.addImage("energyDrink", energyImage);
  energyDrink.scale = 0.1;
  energyDrink.lifetime = 120;
  energyGp.add(energyDrink);
  
  energyDrink.depth = start.depth;
  start.depth = start.depth+1;
  
  //Asigning random places for the energyDrinks
  if(frameCount%30 === 0){
    switch(energyRand) {
        case 1: energyDrink.y = 100;
                energyDrink.velocityX = -(6 + 3*score/100);
                break;
        case 2: energyDrink.y = 300;
                energyDrink.velocityX = -(6 + 3*score/100);
                break;
        case 3: energyDrink.y = 500;
                energyDrink.velocityX = -(6 + 3*score/100);
                break;
        default: break;
    }
  }
}

function bomb(){
  // bombs = createSprite(100, -50, 20, 20);
  bombs = createSprite(600, 100, 20, 20);
  bombs.addImage("bombs", bombImage);
  bomb.scale = 0.1;
  bombs.scale = 0.09;
  bombs.lifetime = 120;
  bombGp.add(bombs);
  
  bombs.depth = start.depth;
  start.depth = start.depth+1;
  
  //Asigning random places for the bombs
  if(frameCount%30 === 0){
    switch(bombRand) {
        case 1: bombs.y = 100;
                bombs.velocityX = -(6 + 3*score/100);
                break;
        case 2: bombs.y = 300;
                bombs.velocityX = -(6 + 3*score/100);
                break;
        case 3: bombs.y = 500;
                bombs.velocityX = -(6 + 3*score/100);
                break;
        default: break;
    }
  }
}
