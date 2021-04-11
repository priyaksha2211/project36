var dog, sadDog, happyDog, database;
var foodS, foodStock;
var addFood;
var foodObj;

//create feed and lastFed variable here
var feedTheDog, feeds;
var feedTime;
var milkImg, milk;

function preload() {
  sadDog = loadImage("Dog.png");
  happyDog = loadImage("happy dog.png");
  milkImg = loadImage("milkImage.png");
}

function setup() {
  database = firebase.database();
  createCanvas(1000, 400);

  foodObj = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  feedTime = database.ref('FeedTime');
  feedTime.on("value", readTime);

  dog = createSprite(800, 200, 150, 150);
  dog.addImage(sadDog);
  dog.scale = 0.15;

  //create feed the dog button here

  feedTheDog = createButton("Feed The Dog");
  feedTheDog.position(680, 95);
  feedTheDog.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46, 139, 87);
  foodObj.display();

  //write code to read fedtime value from the database 

  //write code to display text lastFed time here.

  fill('white');
  textSize(15);
  text("Last Feed:" + foodObj.lastFed, 330, 29);

  drawSprites();
}

//function to read food Stock
function readStock(data) {
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function readTime(data) {
  foodObj.lastFed = data.val();
}

function feedDog() {
  dog.addImage(happyDog);

  //write code here to update food stock and last fed time
  var dt = new Date();
  var hr = dt.getHours();
  if (hr < 12) {
    if (hr === 0) {
      hr = hr + 12;
    }
    foodObj.lastFed = hr + ':' + dt.getMinutes() + ' AM';

  } else if (hr === 12) {
    foodObj.lastFed = hr + ':' + dt.getMinutes() + ' PM';
  } else {
    foodObj.lastFed = (hr - 12) + ':' + dt.getMinutes() + ' PM';
  }

  foodS = foodS - 1;
  if (foodS < 0) {
    foodS = 0;
    dog.addImage(sadDog);
  } else {
    database.ref('/').update({
      Food: foodS,
      FeedTime: foodObj.lastFed
    });
  }
}

//function to add food in stock
function addFoods() {
  foodS++;
  database.ref('/').update({
    Food: foodS
  })
}

