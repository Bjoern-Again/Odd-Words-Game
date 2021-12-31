import { displayTime } from './module/timer.js';
import { shuffleWord } from './module/shuffle.js';




"use strict"
// the word selection isn't working probably words - old words are kept in the selected array 
// get different api


// fetchs word list fron a separate json file 
fetch('words.json').then(function (response) {
  return response.json();
}).then(function (obj) {
  // commons english word are attached to arr variable 
  wordArr = obj.commonWords;
  // console.log(wordArr)
  GAME.selectWord(wordArr);
  // calls count down timer 
  displayTime();
}).catch(function (err) {
  console.log('Fetch problem: ' + err.message);
});

// might need to add an extra function to add wordArray to GAME namespace
// as selected word the secound round will not recognise wordArray it will output undefined

const GAME = {
  // Global variables 
  selectedWords: [],
  arr: Array, 
  dataArr: Array,
  oddWord: String,
  count: 0,
  isBtnOne: false,
  isBtnTwo: false,
  isBtnThree: false,
  btn1: document.getElementById('btn-one'),
  btn2: document.getElementById('btn-two'),
  btn3: document.getElementById('btn-three'),
  scoreCount = document.getElementById('counter'),
  // selects random word from common words array
  selectWord: function(wordArr) {
    this.arr = wordArr; 
    // the selected words array has to be empty for new selected words  
    if(selectedWords.length > 0) {
      this.selectedWords = [];
    }
    // actual logic to select word 
    let word = this.arr[Math.floor(Math.random() * this.arr.length)];
    console.log(word)
    // chosen word is pushed into empty selected words array 
    this.selectedWords.push(word);
    // related word api is called with chosen word
    relatedWordApi(word);
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
        'x-rapidapi-key':
          '5c0aa20435msh600e631e34b017cp1d6a08jsn5653f978c215',
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
      // associated words array is attached to global variable 
      this.dataArr = response.associations_array;
      // when associated word array is recieved only then a random word function is called 
      this.randomSelectWord();	
    })
    .catch((err) => {
      console.error(err);
    });
  },
  // selectes random associated word from dataArray and added to selected word list
  randomSelectWord: function() {
    let relatedWord = this.dataArr[Math.floor(Math.random() * this.dataArr.length)];
    this.selectedWords.push(relatedWord);
    this.unrelateWord();
  },
  // finds unrelated word by chosen another word from words array 
  unrelateWord: function() {
    oddWord = this.arr[Math.floor(Math.random() * this.arr.length)];
    // checks if word is not equal to all words from associated word array before being pushed into selected word array
    if(this.dataArr.indexOf(oddWord) === -1) {
      this.selectedWords.push(oddWord)
    } else {
      // if word equals associated word array then function is called again
      this.unrelateWord();
    }
    // display all selected words 
    this.display();
  },
  // 1st created a copy of array, then shuffles the word positions and then displays each word 
  display: function() {
    let array = this.selectedWords.slice();
    let shuffledArr = shuffleWord(array); 
    btn1.innerHTML = shuffledArr[0];
    btn2.innerHTML = shuffledArr[1];
    btn3.innerHTML = shuffledArr[2]; 
    // displaying score is optional 
    this.scoreCount.innerHTML = this.count + ' / 80';
  },
  // score: checks which button is true and if word equals the unrelated word if yes score is added 
  // put score into individual app
  score: function() {
    (this.isBtnOne && this.btn1.innerHTML === this.oddWord) ? this.count++:
    (this.isBtnTwo && this.btn2.innerHTML === this.oddWord) ? this.count++:
    (this.isBtnThree && this.btn3.innerHTML === this.oddWord) ? this.count++:
    (this.count > 0) ? this.count--: this.count = 0; 
    // all button are set to false 
    this.isBtnOne = false;
    this.isBtnTwo = false;
    this.isBtnThree = false;
  }  
}

// const SCORE = {} add another object



// each button represents a word, when pressed runs score function and resets words array 
btn1.addEventListener('click', () => {
  GAME.isBtnOne = true;
  GAME.score();
  GAME.selectWord();
});
btn2.addEventListener('click', () => {
  GAME.isBtnTwo = true;
  GAME.score();
  GAME.selectWord();
});
btn3.addEventListener('click', () => {
  isBtnThree = true;
  GAME.score();
  GAME.selectWord();
});

// export { GAME.count }
