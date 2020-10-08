
var currentQuestion = 0;  // the question we are currently on 

var score = 0;  // numbers of correct questions

// questions is an array of question objects
var questions = [
   {
	"question": "In what century does the series take place?",
	"a": "24th century",
	"b": "22th century",
	"c": "26th century",
	"d": "28th century",
	"image":"quizimages/q1.jpg",
	"answer": "a"
   },
   {
	"question": "Which frightening antagonists are cyborgs that often attack the Enterprise?",
	"a": "The Ferengi",
	"b": "The Cardassians",
	"c": "The Borg",
	"d": "The Romulans",
	"image":"quizimages/q2.jpg",
	"answer": "c"
   }
 ];
 
 
 // run code when the body loads
 function initialize() {
     document.getElementById("lightbox").style.display="none"; 
     loadQuestion();
 };
 
 
 
 // load the current question on the page
 function loadQuestion() {
     
     // check for last question
     let message = "";
     if (currentQuestion == questions.length) {
         message = "Congrats, you have finished. Your score is " +  score + " / " + questions.length + ". Click to start again";
         
         // show the lightbox with feedback
        document.getElementById("lightbox").style.display="block";
        document.getElementById("message").innerHTML = message; 
        currentQuestion = 0;
     }
     
     // preload the image 
     var img = document.getElementById("image");
     var preLoadImg = new Image();
     preLoadImg.src = questions[currentQuestion].image;

     preLoadImg.onLoad = function () {
        img.width = this.width;
     }
     img.style.maxWidth = "500px";
     img.src = preLoadImg.src;     
     
     
     
     // load the question
     document.getElementById("question").innerHTML = questions[currentQuestion].question;
     document.getElementById("a").innerHTML = "A. " + questions[currentQuestion].a;
     document.getElementById("b").innerHTML = "B. " + questions[currentQuestion].b;
     document.getElementById("c").innerHTML = "C. " + questions[currentQuestion].c;
     document.getElementById("d").innerHTML = "D. " + questions[currentQuestion].d;

     
 } // loadQuestion
 
 
 // mark the current question
 function markIt(ans) {
    let message = "";    
    
    // if the answer is correct 
    if (ans == questions[currentQuestion].answer) {
       
        // add to score and move to next question
        score = score + 1;  // or score++  or score += 1
        document.getElementById("score").innerHTML = score + " / " + questions.length;
       
        message = "Correct Answer! Your score is " + score + " / " + questions.length;
    } // if
   
    // otherwise notify user the answer is incorrect
    else {
        message = "Incorrect Answer! Your score is " + score + " / " + questions.length;
    }  // else
        
    // show the lightbox with feedback
    document.getElementById("lightbox").style.display="block";
    document.getElementById("message").innerHTML = message; 
    
    // move to the next question
    currentQuestion++;  // add 1 to currentQuestion
    loadQuestion();


 }  // markIt
   
 // close the lightbox
 function closeLightBox(){
     document.getElementById("lightbox").style.display="none";
 } // closeLightBox     
   
   

   
   
   
   
   
   
   
   
   
   