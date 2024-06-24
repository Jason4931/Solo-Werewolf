let text = document.getElementById("text");
let input = document.getElementById("input");
let start = document.getElementById("start");
let br = document.getElementById("br");
start.addEventListener("click", function () {
  //refresh buttons
  br.classList.add('hidden');
  input.classList.remove('hidden');
  let button = document.querySelectorAll('button');
  button.forEach(button => button.classList.add('hidden'));
  button = document.getElementById("manyPlayers");
  button.classList.remove('hidden');
  //start game
  text.innerHTML = "How many players: ";
  button = document.getElementById("manyPlayers");
  button.addEventListener("click", manyPlayers);
});
function manyPlayers() {
  let button = document.getElementById("manyPlayers");
  button.classList.add('hidden');
  let manyPlayers = input.value;
  input.value = "";
  manyPlayers = parseInt(manyPlayers);
  let role = [];
  if (manyPlayers <= 3) {
    text.innerHTML += `<br><font color="darkred">Please enter at least 4 players</font>`;
    start.classList.remove('hidden');
    br.classList.remove('hidden');
    return;
  } else {
    let werewolves = Math.floor(manyPlayers / 3);
    let townies = manyPlayers - werewolves;
    for (let i = 0; i < werewolves; i++) {
      role.push({ role: "Werewolf", status: "alive" });
    }
    for (let i = 0; i < townies; i++) {
      role.push({ role: "Townie", status: "alive" });
    }
    //dividing player roles
    let playerRoles = [];
    for (let i = 0; i < manyPlayers; i++) {
      let randomIndex = Math.floor(Math.random() * role.length);
      let playerRole = role[randomIndex];
      playerRoles.push(playerRole);
      role.splice(randomIndex, 1);
    }
    //reveal your own role (player 1)
    text.innerHTML += `${manyPlayers}`;
    text.innerHTML += `<br>You are The ${playerRoles[0].role}`;
    //reveal werewolves
    if (playerRoles[0].role == "Werewolf") {
      let werewolves = playerRoles.filter(player => player.role == "Werewolf" && player.status == "alive");
      text.innerHTML += `<br>The werewolves are: Player ${werewolves.map(player => `${playerRoles.indexOf(player) + 1}`).join(', ')}`;
    }

    //start cycle
    gameLoop(playerRoles, manyPlayers);
  }
}
function gameLoop(playerRoles, manyPlayers) {

  //night
  text.innerHTML += `<br><br><i>Night comes and everybody sleep...</i>`;
  
  //killing one townie
  if (playerRoles[0].role == "Werewolf") {
    if (playerRoles[0].status == "alive") {
      text.innerHTML += `<br>Who do you kill (1-${manyPlayers}): `;
      let button = document.getElementById("killedPlayer");
      button.classList.remove('hidden');
      button.addEventListener("click", function () { killedPlayer(playerRoles, manyPlayers); });
    } else {
      let townies = [];
      for (let i = 0; i < playerRoles.length; i++) {
        if (playerRoles[i].role == "Townie" && playerRoles[i].status == "alive") {
          townies.push(i);
        }
      }
      if (townies.length > 0) {
        let killedIndex = townies[Math.floor(Math.random() * townies.length)];
        playerRoles[killedIndex].status = "dead";
        text.innerHTML += `<br>Player ${killedIndex + 1} was a ${playerRoles[killedIndex].role} and was killed`;
      } else {
        text.innerHTML += `<br>No townies left to kill...`;
      }
      day(playerRoles, manyPlayers);
    }
  } else {
    let townies = [];
    for (let i = 0; i < playerRoles.length; i++) {
      if (playerRoles[i].role == "Townie" && playerRoles[i].status == "alive") {
        townies.push(i);
      }
    }
    if (townies.length > 0) {
      let killedIndex = townies[Math.floor(Math.random() * townies.length)];
      playerRoles[killedIndex].status = "dead";
      text.innerHTML += `<br>Player ${killedIndex + 1} was a ${playerRoles[killedIndex].role} and was killed`;
    } else {
      text.innerHTML += `<br>No townies left to kill...`;
    }
    day(playerRoles, manyPlayers);
  }
}
function killedPlayer(playerRoles, manyPlayers) {
  let button = document.getElementById("killedPlayer");
  button.classList.add('hidden');
  let killedPlayer = input.value;
  input.value = "";
  killedPlayer = parseInt(killedPlayer);
  playerRoles[killedPlayer - 1].status = "dead";
  text.innerHTML += `${killedPlayer}`;
  text.innerHTML += `<br>Player ${killedPlayer} was a ${playerRoles[killedPlayer - 1].role} and was killed`;
  day(playerRoles, manyPlayers);
}
function day(playerRoles, manyPlayers) {
  //end game
  let aliveWerewolves = playerRoles.filter(player => player.role == "Werewolf" && player.status == "alive").length;
  let aliveTownies = playerRoles.filter(player => player.role == "Townie" && player.status == "alive").length;
  if (aliveWerewolves >= aliveTownies) {
    text.innerHTML += `<br><h3 style="color: darkgreen">Werewolves win!</h3>`;
    start.classList.remove('hidden');
    br.classList.remove('hidden');
    return;
  }
  //day
  text.innerHTML += `<br><br><i>Day comes and everybody wake up...</i>`;
  
  //voting time
  let alivePlayers = playerRoles.filter(player => player.status === "alive");
  if (alivePlayers.length > 0) {
    if (playerRoles[0].status == "alive") {
      text.innerHTML += `<br>Who do you vote (1-${manyPlayers}): `;
      let button = document.getElementById("votedPlayer");
      button.classList.remove('hidden');
      button.addEventListener("click", function () { votedPlayer(playerRoles, manyPlayers); });
    } else {
      let votes = {};
      for (let i = 0; i < manyPlayers; i++) {
        if (playerRoles[i].status == "alive") {
          votes[i + 1] = 0;
        }
      }
      voting(playerRoles, manyPlayers, votes);
    }
  } else {
    text.innerHTML += `<br>No players left alive...`;
    start.classList.remove('hidden');
    br.classList.remove('hidden');
    return;
  }
}
function votedPlayer(playerRoles, manyPlayers) {
  let button = document.getElementById("votedPlayer");
  button.classList.add('hidden');
  let votedPlayer = input.value;
  input.value = "";
  let votes = {};
  for (let i = 0; i < manyPlayers; i++) {
    if (playerRoles[i].status == "alive") {
      votes[i + 1] = 0;
    }
  }
  //player 1 votes
  votes[parseInt(votedPlayer)]++;
  text.innerHTML += `${votedPlayer}`;
  voting(playerRoles, manyPlayers, votes);
}
function voting(playerRoles, manyPlayers, votes) {
  //everybody votes at random
  for (let i = 0; i < manyPlayers; i++) {
    if (playerRoles[i].status == "alive" && i != 0) {
      let vote = Math.floor(Math.random() * manyPlayers);
      while (playerRoles[vote].status == "dead" || vote == i) {
        vote = Math.floor(Math.random() * manyPlayers);
      }
      vote++;
      votes[vote]++;
    }
  }
  let maxVotes = 0;
  let maxVotedPlayers = [];
  for (let player in votes) {
    if (votes[player] > maxVotes) {
      maxVotes = votes[player];
      maxVotedPlayers = [player];
    } else if (votes[player] === maxVotes) {
      maxVotedPlayers.push(player);
    }
  }
  //votes on each player
  text.innerHTML += `<br><br>Votes:`;
  for (let player in votes) {
    text.innerHTML += `<br>Player ${player}: ${votes[player]}`;
  }
  if (maxVotedPlayers.length == 1) {
    text.innerHTML += `<br>Player ${maxVotedPlayers[0]} was a ${playerRoles[maxVotedPlayers[0] - 1].role} and was voted out`;
    playerRoles[maxVotedPlayers[0] - 1].status = "dead";
  } else {
    text.innerHTML += `<br>There was a tie between players ${maxVotedPlayers.join(', ')}...`;
  }
  
  //end game
  let aliveWerewolves = playerRoles.filter(player => player.role === "Werewolf" && player.status === "alive").length;
  let aliveTownies = playerRoles.filter(player => player.role === "Townie" && player.status === "alive").length;
  if (aliveWerewolves >= aliveTownies) {
    text.innerHTML += `<br><h3 style="color: darkgreen">Werewolves win!</h3>`;
    start.classList.remove('hidden');
    br.classList.remove('hidden');
    return;
  } else if (aliveWerewolves == 0) {
    text.innerHTML += `<br><h3 style="color: darkgreen">Townies win!</h3>`;
    start.classList.remove('hidden');
    br.classList.remove('hidden');
    return;
  } else {
    gameLoop(playerRoles, manyPlayers);
  }
}