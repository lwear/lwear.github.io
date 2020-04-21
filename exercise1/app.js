// Write your JS in here
var pics = [
	"imgs/kitty_bed.jpg",
	"imgs/kitty_basket.jpg", 
	"imgs/kitty_laptop.jpg",
	"imgs/kitty_door.jpg",
	"imgs/kitty_sink.jpg",
	"imgs/kitty_wall.jpg"
]
var counter = 1;

var element = document.getElementById("catpic");
element.addEventListener("click", function(){
    element.src = pics[counter%6]; 
    counter++;
  }
);
