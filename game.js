var cards = [...document.getElementsByClassName("card")];

for (var i = 0; i < cards.length; i++){
    var card = cards[i];
    card.addEventListener("click", selectCard);
}

var selectedCards = [];
var matchedCards = 0;
var score = document.getElementById("score-num");
var timer = document.getElementById("timer");
var second = 0;
var minute = 0;
var timerInterval;
var timeMultiplyer = 1;
var wrongWait = false;

function selectCard(){
    if(!this.classList.contains("disabled") && !wrongWait){
        this.classList.toggle("selected");
        if(this.classList.contains("selected")) {
            selectedCards.push(this);
        } else {
            selectedCards.pop();
        }
        if(selectedCards.length === 2){
            selectedCards[0].classList.remove("selected");
            selectedCards[1].classList.remove("selected");
            if(checkMatch(selectedCards[0], selectedCards[1])){
                increaseScore();
                selectedCards[0].classList.add("matched", "disabled");
                selectedCards[1].classList.add("matched", "disabled");
                matchedCards += 2;
            } else {
                wrongWait = true;
                decreaseScore();
                wrong1 = selectedCards[0];
                wrong2 = selectedCards[1];
                wrong1.classList.add("wrong", "disabled");
                wrong2.classList.add("wrong", "disabled");
                setTimeout(function(){
                    wrong1.classList.remove("wrong", "disabled");
                    wrong2.classList.remove("wrong", "disabled");
                    wrongWait = false;
                },1000);
            }
            selectedCards = [];
            checkWin();
        }
    }
}

function checkMatch(card1, card2){
    return card1.textContent === card2.dataset.match || card2.textContent === card1.dataset.match;
}

function checkWin(){
    if(matchedCards === cards.length){
        stopTimer();
        setTimeout(function(){
            displayWinScreen();
        }, 250);
    }
}

function displayWinScreen(){
    $('#winScore').text(score.textContent);
    $('#winTime').text(minute + " Mins " + second + " Segs");
    $('#WinModal').modal('show');
}

function increaseScore(){
    score.textContent = parseInt(score.textContent) + (100 * timeMultiplyer);
}

function decreaseScore() {
    score.textContent = parseInt(score.textContent) - 50;
}


function playagain(){
    $('#WinModal').modal('hide');
    start();
}

document.body.onload = start();

function start(){
    stopTimer();
    for (var i = 0; i < cards.length; i++){
        let card = cards[i];
        card.classList.remove("matched", "disabled", "selected", "wrong");
        card.setAttribute("data-match", "Blank Card");
        card.textContent = "Blank Card";
    }
    selectedCards = [];
    matchedCards = 0;
    score.textContent = 0;
    second = 0;
    minute = 0;
    timer.textContent = minute + " Mins " + second + " Segs";
    fillCards();

    timerInterval = setInterval(startTimer, 1000);
}

function startTimer(){
    second++;
    if (second === 60){
        minute++;
        second = 0;
    }
    timer.textContent = minute + " Mins " + second + " Segs";
}

function stopTimer(){
    clearInterval(timerInterval);
}

function shuffleArray(array) {
    let currentIndex = array.length,  randomIndex;
  
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
  
    return array;
}

function fillCards(){
    var randomCards = shuffleArray([...Array(cards.length).keys()]);
    var randomVocab = [];
    while(randomVocab.length < 8){
        var r = Math.floor(Math.random() * vocab.length);
        if(randomVocab.indexOf(r) === -1) randomVocab.push(r);
    }
    
    for (var i = 0; i < randomVocab.length; i++){
        var k = randomVocab[i];
        var j = 2*i;
        var card1 = cards[randomCards[j]];
        var card2 = cards[randomCards[j + 1]];
        card1.textContent = vocab[k]["spanish"];
        card1.setAttribute('data-match', vocab[k]['english']);
        card2.textContent = vocab[k]["english"];
        card2.setAttribute("data-match", vocab[k]["spanish"]);
    }
}