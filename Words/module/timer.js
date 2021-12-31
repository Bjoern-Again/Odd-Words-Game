import { count } from'../game.js';


let timeUnit = 180;
let stopWatch;


// the function runs the count down timer 
// starts the timer and stops the time 
const displayTime = function() {
    // starts the timer 
    if(timeUnit === 180) {
      stopWatch = setInterval(displayTime, 1000)      
    }
    // Calculate current hours, minutes, and sceonds
    let hours = Math.floor(timeUnit / 3600);
    let min = Math.floor((timeUnit % 3600) / 60);
    let sec = Math.floor(timeUnit % 60);
  
    // display extra zero in the display
    let displayHour = (hours < 10) ? '0' + hours : hours;
    let displayMin = (min < 10) ? '0' + min : min;
    let displaySec = (sec < 10) ? '0' + sec : sec;
  
    document.querySelector('.clock').textContent = displayHour + ':' + displayMin + ':' + displaySec;
    timeUnit--;
  
    // ends the timer by cancelling setIneterval store
    if (displayMin === '02' && displaySec === '00') {
      clearInterval(stopWatch);
      console.log('My score is ' + count)
      // location.href = "/End/end.html"
    }  
  }  

export { displayTime };