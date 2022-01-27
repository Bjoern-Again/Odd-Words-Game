import { shuffleWord } from './module/shuffle.js';


"use strict"

const btn1 = document.getElementById('btn-one');
const btn2 = document.getElementById('btn-two');
const btn3 = document.getElementById('btn-three');
const scoreCount = document.getElementById('counter');
const loader = document.getElementById('loader');
const game = document.getElementById('game');

// imports word list if the most common english words  
const fetchCommonWords = async() => {
  const response = await fetch('words.json');
  const json = await response.json();
  let wordArr = json.commonWords;
  //add spinner/loader
  game.classList.add('hidden')
  loader.classList.remove('hidden');
  GAME.init(wordArr);
  // calls count down timer 
  TIMER.startTimer();
}

fetchCommonWords()
.catch(error => {
  console.log('Fetch problem: ' + err.message);    
});

const GAME = {
  // Global variables 
  selectedWords: [],
  arr: Array, 
  dataArr: Array,
  oddWord: String,
  
  init: function (wordArr) {
    this.arr = wordArr;
    this.selectWord();
  },
  selectWord: function() {
    if(this.selectedWords.length > 0) {
      this.selectedWords = [];
    }
    let word = this.arr[Math.floor(Math.random() * this.arr.length)];
    this.selectedWords.push(word);
    this.relatedWordApi(word);
  },
  // fn fetches related word from inital common chosen word
  relatedWordApi: function(word) {
    fetch(
      'https://twinword-word-associations-v1.p.rapidapi.com/associations/?entry=' +
      word,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'twinword-word-associations-v1.p.rapidapi.com',
          'x-rapidapi-key': '<API_Key>'
        },
      }
      )
      .then((response) => {    
        return response.json();
      })
      .then((response) => {
        console.log(response);
        // if "Entry word not found" then orginal selected word needs to get chosen again
        if(response.result_msg === "Entry word not found") {
          return this.selectWord();
        }
        this.dataArr = response.associations_array;
        this.randomSelectWord();	
      })
      .catch((err) => {
        console.error(err);
      });
    },
  randomSelectWord: function() {
    let relatedWord = this.dataArr[Math.floor(Math.random() * this.dataArr.length)];
    this.selectedWords.push(relatedWord);
    this.unrelateWord();
  },
  // finds unrelated word by choosing another word from most common English words
  unrelateWord: function() {
    this.oddWord = this.arr[Math.floor(Math.random() * this.arr.length)];
    // checks that words are not the same as the associated words
    if(this.dataArr.indexOf(this.oddWord) === -1) {
      this.selectedWords.push(this.oddWord)
    } else {
      // if common word than repeat
      this.unrelateWord();
    }
    //removes spinner/loader
    game.classList.remove('hidden');
    loader.classList.add('hidden')
    SHOW.display();
  }
  }

  // Score/Count correct words 
  
  const SCORE = {
    count: 0,
    isBtnOne: false,
    isBtnTwo: false,
    isBtnThree: false,

    // score: checks which button is true and if word equals the unrelated word, if yes, score is added 
    score: function() {
      const oddWord = GAME.oddWord;
      (this.isBtnOne && btn1.innerHTML === oddWord) ? this.count++:
      (this.isBtnTwo && btn2.innerHTML === oddWord) ? this.count++:
      (this.isBtnThree && btn3.innerHTML === oddWord) ? this.count++:

      this.isBtnOne = false;
      this.isBtnTwo = false;
      this.isBtnThree = false;
      SHOW.display();
    }  
  } 

  // Display word association buttons
  
  const SHOW = {
    display: function() {
      let array = GAME.selectedWords.slice();
      let shuffledArr = shuffleWord(array); 
      btn1.innerHTML = shuffledArr[0];
      btn2.innerHTML = shuffledArr[1];
      btn3.innerHTML = shuffledArr[2]; 
      // displaying score is optional 
      scoreCount.innerHTML = SCORE.count + '';
    }
  }

  // timer for game
  
  const TIMER = {
    // starting at 3 minutes counts backwards
    secounds: 180,
    stopWatch: null,

    // starts the timer and stops the time 
    startTimer: function() {
      if(TIMER.secounds === 180) {
        TIMER.stopWatch = setInterval(TIMER.displayTime, 1000)           
      }
    },
    displayTime: function() {
      
      // Calculate current hours, minutes, and sceonds
      let hours = Math.floor(TIMER.secounds / 3600);
      let min = Math.floor((TIMER.secounds % 3600) / 60);
      let sec = Math.floor(TIMER.secounds % 60);
      
      // display extra zero in the display
      let displayHour = (hours < 10) ? '0' + hours : hours;
      let displayMin = (min < 10) ? '0' + min : min;
      let displaySec = (sec < 10) ? '0' + sec : sec;
      
      document.querySelector('.clock').textContent = displayHour + ':' + displayMin + ':' + displaySec;
      // counting sec down
      TIMER.secounds--;
      
      // ends the timer by cancelling setIneterval 
      if (displayMin === '00' && displaySec === '00') {
        clearInterval(this.stopWatch);
        // stors data in local storage
        localStorage.setItem("scoreCount", JSON.stringify(SCORE.count))
        location.href = "/Front Page/index.html"
      }  
    }  
  }
  
  // each button represents 
  btn1.addEventListener('click', () => {
    game.classList.add('hidden');
    loader.classList.remove('hidden');
    SCORE.isBtnOne = true;
    SCORE.score()
    GAME.selectWord();
  });
  btn2.addEventListener('click', () => {
    game.classList.add('hidden');
    loader.classList.remove('hidden');
    SCORE.isBtnTwo = true;
    SCORE.score()
    GAME.selectWord();
  });
  btn3.addEventListener('click', () => {
    game.classList.add('hidden');
    loader.classList.remove('hidden');
    SCORE.isBtnThree = true;
    SCORE.score();
    GAME.selectWord();
  });
  
