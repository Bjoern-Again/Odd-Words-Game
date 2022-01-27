const player = document.getElementById('username');
const scoreTable = document.getElementById("scoreArray")
const storedName = JSON.parse(localStorage.getItem("player"));
const storedScore = localStorage.getItem("scoreCount");
const highScore = JSON.parse(localStorage.getItem('highScore')) || [];


const SAVE = { 
  score: Number,
  saveName: function() {
    let name = player.value;
    if(name === "") {
      name = "player 1";
    }
    localStorage.setItem("player", JSON.stringify(name))
    location.href = "../index.html"
  },
  saveScore: function() {

      if(storedScore === null) {
        return;
      }
      score = {
          scoreCount: storedScore,
          name: storedName
      }

      highScore.push(score);
      highScore.sort( (a, b) => b.scoreCount - a.scoreCount);
      highScore.splice(5);
      localStorage.setItem('highScore', JSON.stringify(highScore)); 
      localStorage.removeItem('player');
      localStorage.removeItem('scoreCount')
  }, 
  displayScore: function() {
    
    scoreTable.innerHTML = highScore.map(score => {
      return `
        <tr>
          <td>${score.name}</td>
          <td></td>
          <td class="text">${score.scoreCount}
      `
    })
  }
}

SAVE.saveScore(); 
SAVE.displayScore();