//Create variables here

function preload()
{
  //load images here
  dogImg=loadImage("images/dogImg.png");
  dogHappy=loadImage("images/dogImg1.png");
}

var dog, dogImg, dogHappy;
var foodStock, foodS, database;

function setup() {
  createCanvas(800, 700);
  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
  dog=createSprite(400,350,10,10);
  dog.addImage(dogImg);
  dog.sclae=0.1;
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
  database=firebase.database();
   foodStock=database.ref('Food')
   foodStock.on("value",readStock)
}


function draw() {  

  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }
   
   if(gameState!="Hungry"){
     feed.hide();
     addFood.hide();
     dog.remove();
   }else{
    feed.show();
    addFood.show();
   }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(dogHappy);
  
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
}

function writeStock(x){
  database.ref('/').update({
    Food:x
  })
}

function readStock(){
  foodS=data.val();

  function addFoods(){
    foodS++;
    database.ref('/').update({
      Food:foodS
    })
  }
}