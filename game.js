const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//start game
rl.question(`How many players: `, (manyPlayers) => {

  //deciding player roles
  manyPlayers = parseInt(manyPlayers);
  let role = [];
  if (manyPlayers <= 3) {
    console.log("Please enter at least 4 players");
    rl.close();
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
    console.log(`You are The ${playerRoles[0].role}`);
    
    //reveal werewolves
    if (playerRoles[0].role == "Werewolf") {
      let werewolves = playerRoles.filter(player => player.role == "Werewolf" && player.status == "alive");
      console.log(`The werewolves are: Player ${werewolves.map(player => `${playerRoles.indexOf(player) + 1}`).join(', ')}`);
    }

    //start cycle
    gameLoop(playerRoles, manyPlayers);
  }
});

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
  console.log("\nVotes:");
  for (let player in votes) {
    console.log(`Player ${player}: ${votes[player]}`);
  }
  if (maxVotedPlayers.length == 1) {
    console.log(`Player ${maxVotedPlayers[0]} was a ${playerRoles[maxVotedPlayers[0] - 1].role} and was voted out`);
    playerRoles[maxVotedPlayers[0] - 1].status = "dead";
  } else {
    console.log(`There was a tie between players ${maxVotedPlayers.join(', ')}...`);
  }
  
  //end game
  let aliveWerewolves = playerRoles.filter(player => player.role === "Werewolf" && player.status === "alive").length;
  let aliveTownies = playerRoles.filter(player => player.role === "Townie" && player.status === "alive").length;
  if (aliveWerewolves >= aliveTownies) {
    console.log("\nWerewolves win!");
    rl.close();
    return true;
  } else if (aliveWerewolves == 0) {
    console.log("\nTownies win!");
    rl.close();
    return true;
  } else {
    gameLoop(playerRoles, manyPlayers);
  }
}

function day(playerRoles, manyPlayers) {

  //end game
  let aliveWerewolves = playerRoles.filter(player => player.role == "Werewolf" && player.status == "alive").length;
  let aliveTownies = playerRoles.filter(player => player.role == "Townie" && player.status == "alive").length;
  if (aliveWerewolves >= aliveTownies) {
    console.log("\nWerewolves win!");
    rl.close();
    return true;
  }

  //day
  console.log(`\nDay comes and everybody wake up...`);
  
  //voting time
  let alivePlayers = playerRoles.filter(player => player.status === "alive");
  if (alivePlayers.length > 0) {
    if (playerRoles[0].status == "alive") {
      rl.question(`Who do you vote (1-${manyPlayers}): `, (votedPlayer) => {

        //player 1 votes
        let votes = {};
        for (let i = 0; i < manyPlayers; i++) {
          if (playerRoles[i].status == "alive") {
            votes[i + 1] = 0;
          }
        }
        votes[parseInt(votedPlayer)]++;
        voting(playerRoles, manyPlayers, votes);
      });
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
    console.log("No players left alive...");
    return true;
  }
}

//the cycle
function gameLoop(playerRoles, manyPlayers) {

  //night
  console.log(`\nNight comes and everybody sleep...`);
  
  //killing one townie
  if (playerRoles[0].role == "Werewolf") {
    if (playerRoles[0].status == "alive") {
      rl.question(`Who do you kill (1-${manyPlayers}): `, (killedPlayer) => {
        killedPlayer = parseInt(killedPlayer);
        playerRoles[killedPlayer - 1].status = "dead";
        console.log(`Player ${killedPlayer} was a ${playerRoles[killedPlayer - 1].role} and was killed`);
        day(playerRoles, manyPlayers);
      });
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
        console.log(`Player ${killedIndex + 1} was a ${playerRoles[killedIndex].role} and was killed`);
      } else {
        console.log(`No townies left to kill...`);
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
      console.log(`Player ${killedIndex + 1} was a ${playerRoles[killedIndex].role} and was killed`);
    } else {
      console.log(`No townies left to kill...`);
    }
    day(playerRoles, manyPlayers);
  }
}