let text = document.getElementById("text");
let input = document.getElementById("input");
let rules = document.getElementById("rules");
let roles = document.getElementById("roles");
roles.addEventListener("click", function () {
  let selectRole = document.getElementById("selectRole");
  if(selectRole.classList.contains('hidden')) {
    selectRole.classList.remove('hidden'); 
  } else {
    selectRole.classList.add('hidden');
  }
});
let start = document.getElementById("start");
let br = document.getElementById("br");
let gameOver = false;
let language = document.getElementById("language");
let selectedLang = language.value;
language.addEventListener("change", function () {
  selectedLang = language.value;
  if (selectedLang == "en") {
    roles.innerHTML = "Change Roles";
    start.innerHTML = "Start Game";
    rules.innerHTML = "Rules";
  } else {
    roles.innerHTML = "Ubah Role";
    start.innerHTML = "Mulai Permainan";
    rules.innerHTML = "Aturan";
  }
});

function removeEventListenerFromElement(element) {
  let newElement = element.cloneNode(true);
  element.parentNode.replaceChild(newElement, element);
  return newElement;
}
start.addEventListener("click", function () {
  //refresh buttons
  gameOver = false;
  br.classList.add('hidden');
  input.classList.remove('hidden');
  let button = document.querySelectorAll('button');
  button.forEach(button => button.classList.add('hidden'));
  language.classList.add('hidden');
  rules.classList.add('hidden');
  roles.classList.add('hidden');
  selectRole.classList.add('hidden');
  button = document.getElementById("manyPlayers");
  button.classList.remove('hidden');
  //start game
  if(selectedLang == "en") {
    text.innerHTML = "How many players: ";
  } else {
    text.innerHTML = "Berapa banyak orang: ";
  }
  // text.innerHTML += selectedLang;
  button = document.getElementById("manyPlayers");
  button.addEventListener("click", manyPlayers);
});
function manyPlayers() {
  // text.innerHTML += `manyPlayers`;
  let button = document.getElementById("manyPlayers");
  button.classList.add('hidden');
  let manyPlayers = input.value;
  input.value = "";
  manyPlayers = parseInt(manyPlayers);
  let role = [];
  if (manyPlayers <= 3) {
    if (selectedLang == "en") {
      text.innerHTML += `<br><font color="darkred">Please enter at least 4 players</font>`;
    } else {
      text.innerHTML += `<br><font color="darkred">Masukkan minimal 4 orang</font>`;
    }
    language.classList.remove('hidden');
    rules.classList.remove('hidden');
    roles.classList.remove('hidden');
    start.classList.remove('hidden');
    br.classList.remove('hidden');
    gameOver = true;
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
    if(selectedLang == "en") {
      text.innerHTML += `<br>You are The ${playerRoles[0].role}`;
    } else {
      text.innerHTML += `<br>Anda adalah ${playerRoles[0].role}`;
    }
    //reveal werewolves
    if (playerRoles[0].role == "Werewolf") {
      let werewolves = playerRoles.filter(player => player.role == "Werewolf" && player.status == "alive");
      if (selectedLang == "en") {
        text.innerHTML += `<br>The werewolves are: Player ${werewolves.map(player => `${playerRoles.indexOf(player) + 1}`).join(', ')}`;
      } else {
        text.innerHTML += `<br>Werewolfnya adalah: Player ${werewolves.map(player => `${playerRoles.indexOf(player) + 1}`).join(', ')}`;
      }
    }
    //start cycle
    // text.innerHTML += `start`;
    gameLoop(playerRoles, manyPlayers);
  }
}
function gameLoop(playerRoles, manyPlayers) {
  if (gameOver) { return; }
  // text.innerHTML += `gameLoop`;
  //night
  if (selectedLang == "en") {
    text.innerHTML += `<br><br><i>Night comes and everybody sleep...</i>`;
  } else {
    text.innerHTML += `<br><br><i>Malam muncul dan semua tidur...</i>`;
  }
  //killing one townie
  if (playerRoles[0].role == "Werewolf") {
    if (playerRoles[0].status == "alive") {
      if (selectedLang == "en") {
        text.innerHTML += `<br>Who do you kill (1-${manyPlayers}): `;
      } else {
        text.innerHTML += `<br>Siapa yang ingin dibunuh (1-${manyPlayers}): `;
      }
      let button = document.getElementById("killedPlayer");
      button.classList.remove('hidden');
      button = removeEventListenerFromElement(button);
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
        if (selectedLang == "en") {
          text.innerHTML += `<br>Player ${killedIndex + 1} was a ${playerRoles[killedIndex].role} and was killed`;
        } else {
          text.innerHTML += `<br>Player ${killedIndex + 1} adalah ${playerRoles[killedIndex].role} dan telah dibunuh`;
        }
      } else {
        if (selectedLang == "en") {
          text.innerHTML += `<br>No townies left to kill...`;
        } else {
          text.innerHTML += `<br>Tidak ada townie yang dapat dibunuh...`;
        }
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
      if (selectedLang == "en") {
        text.innerHTML += `<br>Player ${killedIndex + 1} was a ${playerRoles[killedIndex].role} and was killed`;
      } else {
        text.innerHTML += `<br>Player ${killedIndex + 1} adalah ${playerRoles[killedIndex].role} dan telah dibunuh`;
      }
    } else {
      if (selectedLang == "en") {
        text.innerHTML += `<br>No townies left to kill...`;
      } else {
        text.innerHTML += `<br>Tidak ada townie yang dapat dibunuh...`;
      }
    }
    day(playerRoles, manyPlayers);
  }
}
function killedPlayer(playerRoles, manyPlayers) {
  if (gameOver) { return; }
  // text.innerHTML += `killedPlayer`;
  let button = document.getElementById("killedPlayer");
  button.classList.add('hidden');
  let killedPlayer = input.value;
  input.value = "";
  killedPlayer = parseInt(killedPlayer);
  playerRoles[killedPlayer - 1].status = "dead";
  text.innerHTML += `${killedPlayer}`;
  if (selectedLang == "en") {
    text.innerHTML += `<br>Player ${killedPlayer} was a ${playerRoles[killedPlayer - 1].role} and was killed`;
  } else {
    text.innerHTML += `<br>Player ${killedPlayer} adalah ${playerRoles[killedPlayer - 1].role} dan telah dibunuh`;
  }
  day(playerRoles, manyPlayers);
}
function day(playerRoles, manyPlayers) {
  if (gameOver) { return; }
  // text.innerHTML += `<br>${JSON.stringify(playerRoles)}`;
  // text.innerHTML += `day`;
  //end game
  let aliveWerewolves = playerRoles.filter(player => player.role == "Werewolf" && player.status == "alive").length;
  let aliveTownies = playerRoles.filter(player => player.role == "Townie" && player.status == "alive").length;
  if (aliveWerewolves >= aliveTownies) {
    if (selectedLang == "en") {
      text.innerHTML += `<br><h3 style="color: darkgreen">Werewolves win!</h3>`;
    } else {
      text.innerHTML += `<br><h3 style="color: darkgreen">Werewolf menang!</h3>`;
    }
    language.classList.remove('hidden');
    rules.classList.remove('hidden');
    roles.classList.remove('hidden');
    start.classList.remove('hidden');
    br.classList.remove('hidden');
    gameOver = true;
    return;
  }
  //day
  if (selectedLang == "en") {
    text.innerHTML += `<br><br><i>Day comes and everybody wake up...</i>`;
  } else {
    text.innerHTML += `<br><br><i>Pagi muncul dan semua bangun...</i>`;
  }
  // text.innerHTML += `<br>${JSON.stringify(playerRoles)}`;
  //voting time
  let alivePlayers = playerRoles.filter(player => player.status == "alive");
  if (alivePlayers.length > 0) {
    if (playerRoles[0].status == "alive") {
      if (selectedLang == "en") {
        text.innerHTML += `<br>Who do you vote (1-${manyPlayers}): `;
      } else {
        text.innerHTML += `<br>Siapa yang ingin dipilih (1-${manyPlayers}): `;
      }
      let button = document.getElementById("votedPlayer");
      button.classList.remove('hidden');
      // text.innerHTML += `<br>${JSON.stringify(playerRoles)}`;
      button = removeEventListenerFromElement(button);
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
    if (selectedLang == "en") {
      text.innerHTML += `<br>No players left alive...`;
    } else {
      text.innerHTML += `<br>Tidak ada player yang hidup...`;
    }
    language.classList.remove('hidden');
    rules.classList.remove('hidden');
    roles.classList.remove('hidden');
    start.classList.remove('hidden');
    br.classList.remove('hidden');
    gameOver = true;
    return;
  }
}
function votedPlayer(playerRoles, manyPlayers) {
  if (gameOver) { return; }
  // text.innerHTML += `<br>${JSON.stringify(playerRoles)}`;
  // text.innerHTML += `votedPlayer`;
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
  if (gameOver) { return; }
  // text.innerHTML += `voting`;
  //everybody votes at random
  for (let i = 0; i < manyPlayers; i++) {
    // text.innerHTML += `<br>${i} -> ${i+1} ${playerRoles[i].status}`;
    if (playerRoles[i].status == "alive" && i != 0) {
      let vote = Math.floor(Math.random() * manyPlayers);
      while (playerRoles[vote].status == "dead" || vote == i) {
        vote = Math.floor(Math.random() * manyPlayers);
      }
      // text.innerHTML += `<br>Vote ${vote} ${i}`;
      // text.innerHTML += `<br>Player ${i+1} voted ${vote+1}`;
      vote++;
      votes[vote]++;
    }
  }
  // text.innerHTML += `<br>${JSON.stringify(votes)}`;
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
  if (selectedLang == "en") {
    text.innerHTML += `<br><br>Votes:`;
  } else {
    text.innerHTML += `<br><br>Hasil voting:`;
  }
  for (let player in votes) {
    text.innerHTML += `<br>Player ${player}: ${votes[player]}`;
  }
  if (maxVotedPlayers.length == 1) {
    if (selectedLang == "en") {
      text.innerHTML += `<br>Player ${maxVotedPlayers[0]} was a ${playerRoles[maxVotedPlayers[0] - 1].role} and was voted out`;
    } else {
      text.innerHTML += `<br>Player ${maxVotedPlayers[0]} adalah ${playerRoles[maxVotedPlayers[0] - 1].role} dan telah dikeluarkan`;
    }
    playerRoles[maxVotedPlayers[0] - 1].status = "dead";
  } else {
    if (selectedLang == "en") {
      text.innerHTML += `<br>There was a tie between players ${maxVotedPlayers.join(', ')}...`;
    } else {
      text.innerHTML += `<br>Ada yang seri antara player ${maxVotedPlayers.join(', ')}...`;
    }
  }
  
  //end game
  let aliveWerewolves = playerRoles.filter(player => player.role === "Werewolf" && player.status === "alive").length;
  let aliveTownies = playerRoles.filter(player => player.role === "Townie" && player.status === "alive").length;
  if (aliveWerewolves >= aliveTownies) {
    if (selectedLang == "en") {
      text.innerHTML += `<br><h3 style="color: darkgreen">Werewolves win!</h3>`;
    } else {
      text.innerHTML += `<br><h3 style="color: darkgreen">Werewolf menang!</h3>`;
    }
    language.classList.remove('hidden');
    rules.classList.remove('hidden');
    roles.classList.remove('hidden');
    start.classList.remove('hidden');
    br.classList.remove('hidden');
    gameOver = true;
    return;
  } else if (aliveWerewolves == 0) {
    if (selectedLang == "en") {
      text.innerHTML += `<br><h3 style="color: darkgreen">Townies win!</h3>`;
    } else {
      text.innerHTML += `<br><h3 style="color: darkgreen">Townie menang!</h3>`;
    }
    language.classList.remove('hidden');
    rules.classList.remove('hidden');
    roles.classList.remove('hidden');
    start.classList.remove('hidden');
    br.classList.remove('hidden');
    gameOver = true;
    return;
  } else {
    gameLoop(playerRoles, manyPlayers);
  }
}