// All variables are defined 
var cardImagesArray = []; //original cards array

let cardsArray = []; //duplicated original cards to make two same cards

let gamePlay = false;

let timer = '';

var gameTimer = '';

let clickLock = false; //to lock the click after two cards are flipped

var lastMatch = '';

var second = 0; hours = 0; minutes = 0;

let cardFlipped = -1; // card is not flipped

let cardFlippedOver = []; //flipped cards push into this array to match with second opened card

var myMoves = 0;

var gameStars = '';

let board = ''; //initial blank board

var emoji = String.fromCodePoint(0x1F600);


// Used HTML DOM to get ids and classes
let startButton = document.getElementById('start');

let gameBoard = document.getElementById('gameboard');

var message = document.getElementById('message');

var mainImage = document.getElementById('mainImage');

var moves = document.querySelector('.moves');

var stars = document.querySelectorAll('.fa-star');

var allStars = document.getElementsByClassName('stars');

var myMusic = document.getElementById('my-music');

var timeTillStartedGame = document.getElementById('my-timer');

//event listener
startButton.addEventListener('click', startGame);


//functions

//first function that get called after clicking the start button
function startGame(){
    startButton.style.display = 'none';

    if(!gamePlay) {
    	gamePlay = true;
    	myImages();
    	cardsArray = cardImagesArray.concat(cardImagesArray);
    	shuffle(cardsArray);
    	newBoard(); //newboard starts every time the gamplay is true or restarting the game
        gameTimer = setInterval(myTimer, 1000); //timer starts    
    }

}


//shuffle function shuffles the position of the cards each time new game starts
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


function newBoard() {
	    //background of the game
	    mainImage.style.backgroundImage = "url('images/main-board-pic.jpeg')";
	    //background music plays everytime new game starts
	    myMusic.play();

     //loops through cardsArray which will create cards in html
	for(var i = 0; i <= (cardsArray.length - 1); i++) {
        board += '<div class="card"><div class="card">';
        board += '<img id="memory-cards' + i + '" src="images/card-face-down.jpeg" onclick="pickCard(' + i + ',this)" class="flipImage" style="width: 150; height= 150;"></div></div>';
    }

    gameBoard.innerHTML = board; //displays cards on the board of new game
}


function pickCard(index, tile) {

    //this checks if first card is opened or not
	if (!isinArray(tile.id, cardFlippedOver) && !clickLock) {
      
        //if the first card is already opened then this statement checks for second card
	    if (cardFlipped >= 0) {
	          tileFlip(tile, index);
	          clickLock = true;
	          counter();
               
              //this statements checks for first card 
	          if (compSrc(cardFlippedOver[cardFlippedOver.length-1]) == compSrc(cardFlippedOver[cardFlippedOver.length-2])) {
                   //if first card is flipped it makes clicklock false to choose the second card
                   clickLock = false;
                   cardFlipped = -1;
                   //both card matched
                   setTimeout(myMessage, 2000);
	            } else {
	            	//cards in the array is not a match then they need to flipped back after 1 second.
                   timer = setInterval(flipCardBack, 1000);
                }

	    } else {
	        	cardFlipped = index;
	            tileFlip(tile, index);
	            counter();
        }

	 } 

}	


//checks if the card is in the array or not
function isinArray(value, arr) {
	return arr.indexOf(value) > -1;
}


//when the card is flipped, it get pushed into cardFlippedOver array 
//with current index of the card with card's id
function tileFlip(tile, index) {
	tile.src = "images/" + cardsArray[index];
    cardFlippedOver.push(tile.id);
}


//this counts the clicks or moves of the cards clicked
function counter() {

	if (cardFlippedOver.length === 1) {
		myMoves++;
	} else {
		//this function is called to check moves that decreased stars accordingly
		myStars();
		myMoves++;
	}

	moves.innerHTML = myMoves; //prints moves to the webpage
}


//this function gets the source of the card to compare with other card source in an array
function compSrc(val) {
	var val = document.getElementById(val).src;
	return val;
}


//flip cards back if they do not match and set the image again card's back face
function flipCardBack() {

	for (i = 0; i < 2; i++) {
		var back = cardFlippedOver.pop();
		document.getElementById(back).src = "images/card-face-down.jpeg";
    }

	clearInterval(timer);
	clickLock = false;
	cardFlipped = -1;
}


//if all the pairs are found then this will pop the box by calling replayGamePopup function
function myMessage() {

	if (cardFlippedOver.length == cardsArray.length) {
	 replayGamePopup();
	} else {
		myMoves++;
	}
    
}


//collapses the stars according the moves are made
function myStars() {

	for (let i = 0; i < allStars.length; i++) {

		if (myMoves > 18 && myMoves < 20) {
	        stars[i].style.visibility = 'collapse';   
        } 

        if (myMoves > 21) {
		    stars[i+1].style.visibility = 'collapse';
	    } 
       
        //this sets all stars to visible again if game has been reset or page has been refreshed
	    if (myMoves === 0) {
            stars[i].style.visibility = 'visible'; 
            stars[i+1].style.visibility = 'visible';
	    }  

    }       
} 


//starts the time when this function is called
function myTimer() {
    timeTillStartedGame.innerHTML = ("Timer: " + hours+ ":" +minutes+ ":" +second);
    second++;

    if (second === 60) {
	    minutes++;
	    second = 0;
    } else if (minutes === 60) {
	    hours++;
	    minutes = 0;
    }

} 


//original card array with 9 images
function myImages() {
for (var i = 1; i < 9; i++) {
      cardImagesArray.push(i + '.png');
    }
}


//this message is shown when all pairs are found in the popup box
function replayGamePopup() {
	if (confirm('You Are The Best!!! '+emoji+'\n You found all the pairs\n with '+myMoves+' Moves in ' + hours+ ":" +minutes+ ":" +second+' duration\n Ratings: \n Play Again?')) {
		reset();
	} 
}


//this resets the game to its initial values as newgame so user can start over the game
function reset() {
	startButton.style.display = "block";
	board = '';
	gameBoard.innerHTML = board;
	clickLock = false;
	gamePlay = false;
	cardImagesArray = [];
	cardFlippedOver = [];
	second = 0; minutes = 0; hours = 0;
	clearInterval(gameTimer);
	timeTillStartedGame.innerHTML = ("Timer: " + hours+ ":" +minutes+ ":" +second);
	myMoves = 0;
	moves.innerHTML = myMoves;
    myStars();
    myMusic.pause();
}

