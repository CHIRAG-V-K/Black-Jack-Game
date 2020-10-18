let blackjackGame ={
   'you':{'scoreSpan':'#your-blackjack-result','div':'#your-div','score':0},
   'dealer':{'scoreSpan':'#dealer-blackjack-result','div':'#dealer-div','score':0},
   'cards':['2','3', '4', '5', '6', '7', '8', '9', '10', 'K', 'J', 'Q', 'A' ],
   'cardsMap':{'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9, '10':10,'K':10,'J':10,'Q':10,'A':[1,10]},
   'wins':0,
   'losses':0,
   'draws':0,
   'isStand': false,
   'turnsOver':false
};
const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];

const hitSound = new Audio('/all/sounds/swish.m4a');
const winSound = new Audio('/all/sounds/cash.mp3');
const lostSound = new Audio('/all/sounds/aww.mp3');

// initializing the button to its functions
document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit);
document.querySelector('#blackjack-stand-button').addEventListener('click', blackjackStand);
document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackDeal);
document.querySelector('#reset').addEventListener('click', resetButton);


// hit button fn
function blackjackHit(){
   if(blackjackGame['isStand']=== false){
   let card = randomCard();
   showCard(card,YOU);
   updateScore(card,YOU);
   showScore(YOU);
   }
}

// sleep function for bot to work slowly
function sleep(ms){
   return new Promise(resolve => setTimeout(resolve, ms));
}
// stand button or bot button
// async fn for execute all code in this fn simultaneosly not one by one 
 async function blackjackStand(){
   blackjackGame['isStand']= true;
   
   while(DEALER['score']< 17){
      let card =randomCard();
      showCard(card,DEALER);
      updateScore(card,DEALER);
      showScore(DEALER);
      await sleep(1000);
   }  
   blackjackGame['turnsOver']= true;
   let Winner = computeWinner();
   showResult(Winner);
}


// Deal button or result button
function blackjackDeal(){
   if (blackjackGame['turnsOver']=== true){
   let yourImages = document.querySelector(YOU['div']).querySelectorAll('img');
   let dealerImages = document.querySelector(DEALER['div']).querySelectorAll('img');
   // remove each card image
   for(let i=0; i< yourImages.length; i++){
      yourImages[i].remove();
   }
   for(let i=0; i< dealerImages.length; i++){
      dealerImages[i].remove();
   }
// erasing backend counted score and displaying score and setting it to 0
   YOU['score']= 0;
   DEALER['score'] = 0;
   document.querySelector(YOU['scoreSpan']).textContent = 0; 
   document.querySelector(DEALER['scoreSpan']).textContent = 0; 
   // set its color back to white
   document.querySelector(YOU['scoreSpan']).style.color = 'white'; 
   document.querySelector(DEALER['scoreSpan']).style.color = 'white'; 
   // set result colour and text to initial one
   document.querySelector('#blackjack-result').textContent = "Let's Play";
   document.querySelector('#blackjack-result').style.color = 'black';
   blackjackGame['isStand']= false; 
   blackjackGame['turnsOver']= false;
   }
}


// to display the random cards when hit button is clicked
function showCard(card,activePlayer){
   let cardImage = document.createElement('img');
   cardImage.src = `/all/images/${card}.png`;
   document.querySelector(activePlayer['div']).appendChild(cardImage);
   hitSound.play();
}

// to generate random number to select random card
function randomCard(){
   let number = Math.floor(Math.random()*13);
   return blackjackGame['cards'][number];
}


// to show calculated score of each player at the span score
function showScore(activePlayer){
   if (activePlayer['score'] > 21){
      document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!';
      document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
   }else {
   document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
   }
}

// to covert cards into its value
function updateScore(card,activePlayer){
   if (card ==='A'){
      if(activePlayer['score'] + blackjackGame['cardsMap'][1] <= 21){
         activePlayer['score'] += blackjackGame['cardsMap'][card][1];
      }else{
         activePlayer['score'] += blackjackGame['cardsMap'][card][0];
      }
   }else {
   activePlayer['score'] += blackjackGame['cardsMap'][card];
   }
}

// to compute who is the winner 
// and update wins, losses, draws
function computeWinner(){
   let winner;
   // when user scores under 21
   if(YOU['score'] <= 21){
      if(YOU['score'] > DEALER['score'] || DEALER['score'] > 21){
         winner = YOU;
         blackjackGame['wins']++;
      }else if(YOU['score'] < DEALER['score']){
         winner = DEALER;
         blackjackGame['losses']++;
      }else if(YOU['score'] === DEALER['score']){
         blackjackGame['draws']++;
      }
      // when user bust and bot does'nt
   }else if(YOU['score'] > 21 && DEALER['score'] <=21){
      blackjackGame['losses']++;
      winner = DEALER;
   }
   // when user and bot both bust
   else if(YOU['score'] > 21 && DEALER['score'] > 21){
      blackjackGame['draws']++;
   }
   return winner;
}

function showResult(winner){
   if (blackjackGame['turnsOver']=== true){
   let message, messageColor;
   if(winner === YOU){
      document.querySelector('#wins').textContent = blackjackGame['wins'];
      message= "You WON!"
      messageColor='green';
      winSound.play();

   }else if(winner === DEALER){
      document.querySelector('#losses').textContent = blackjackGame['losses'];
      message = "You Lost:(";
      messageColor = 'red';
      lostSound.play();

   }else{
      document.querySelector('#draws').textContent = blackjackGame['draws'];
      message = "Draw";
      messageColor= 'black';
   }

   document.querySelector('#blackjack-result').textContent = message;
   document.querySelector('#blackjack-result').style.color = messageColor;
   }
}


function resetButton(){
   window.location.reload();
}