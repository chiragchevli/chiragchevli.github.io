/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

// Get All Data 
var sum;
var p1_name = document.querySelector("#name-0");
var p2_name = document.querySelector("#name-1");

var p1_score = document.querySelector("#score-0");
var p2_score = document.querySelector("#score-1");

var p1_cur = document.querySelector("#current-0");
var p2_cur = document.querySelector("#current-1");

var img = document.querySelector(".dice");

var btn_roll = document.querySelector(".btn-roll");
var btn_hold = document.querySelector(".btn-hold");
var btn_new = document.querySelector(".btn-new");

btn_roll.addEventListener("click", add_score);
btn_hold.addEventListener("click", change_player);
btn_new.addEventListener("click", newgame);
var active = document.querySelector(".active").getAttribute("id");

function randomimage()
{
  var random = Math.floor(Math.random() * (7 - 1)) + 1;
  src = "dice-" + random + ".png";
  img.setAttribute("src", src);
}

function newgame()
{
  p1_score.textContent = 0;
  p2_score.textContent = 0;
  p1_cur.textContent = 0;
  p1_cur.textContent = 0;
  document.querySelector(".btn-roll").style.display = "inline-block";
  document.querySelector(".btn-hold").style.display = "inline-block";
  document.querySelector(".player-0-panel").classList.remove("winner");
  document.querySelector(".player-0-panel").classList.add("active");
  document.querySelector(".player-1-panel").classList.remove("winner","active");
  p1_name.textContent = "Player 1";
  p2_name.textContent = "Player 2";
  active = document.querySelector(".active").getAttribute("id");  
  randomimage();
}

function change_player() 
{
  if (active == "p1") {
    p1_score.textContent =
      parseInt(p1_score.textContent) + parseInt(p1_cur.textContent);
    p1_cur.textContent = 0;
  } else {
    p2_score.textContent =
      parseInt(p2_score.textContent) + parseInt(p2_cur.textContent);
    p2_cur.textContent = 0;
  }
  document.querySelector(".player-0-panel").classList.toggle("active");
  document.querySelector(".player-1-panel").classList.toggle("active");
  active = document.querySelector(".active").getAttribute("id");  
}

function add_score()
 {
  randomimage();
  var incr = parseInt(document.querySelector(".dice").getAttribute("src").charAt(5));

  if (incr == 1)
   {
    if (active == "p1") {
      p1_cur.textContent = 0;
    } else {
      p2_cur.textContent = 0;
    }
    change_player();
    return;
  }

  if (active == "p1") {
    sum = parseInt(p1_cur.textContent) + incr;
    p1_cur.textContent = sum;
  } else {
    sum = parseInt(p2_cur.textContent) + incr;
    p2_cur.textContent = sum;
  }
  checkwin();
}

function checkwin()
{
  if (active=="p1" && sum + parseInt(p1_score.textContent) >= 100)
   {
    sum = sum + parseInt(p1_score.textContent);
    p1_cur.textContent = 0;
    p1_score.textContent = sum;
    document.querySelector(".player-0-panel").classList.add("winner");
    document.querySelector(".player-1-panel").classList.remove("active");
    document.querySelector(".btn-roll").style.display = "none";
    document.querySelector(".btn-hold").style.display = "none";
    p1_name.innerHTML="PLAYER 1 <i class=\"fa fa-trophy\"></i>"; 
  }
  else if (active=="p2" && sum + parseInt(p2_score.textContent) >= 100) 
  {
    sum = sum + parseInt(p2_score.textContent);
    p2_cur.textContent = 0;
    p2_score.textContent = sum;
    document.querySelector(".player-1-panel").classList.add("winner");
    document.querySelector(".player-0-panel").classList.remove("active");
    document.querySelector(".btn-roll").style.display = "none";
    document.querySelector(".btn-hold").style.display = "none";
    p2_name.innerHTML="PLAYER 2 <i class=\"fa fa-trophy\"></i>"; 
  }
}


