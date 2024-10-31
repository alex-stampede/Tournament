let participants = [];
let rounds = [];
let currentRound = 0;

function updateTitle() {
  const titleInput = document.getElementById("titleInput").value.trim();
  if (titleInput) {
    document.getElementById("tournamentTitle").textContent = titleInput;
  }
}

function addParticipant() {
  const nameInput = document.getElementById("participantName");
  const name = nameInput.value.trim();
  
  if (name) {
    participants.push(name);
    nameInput.value = "";
    updateParticipantsTable();

    // Habilitar el botón si el número de participantes es mayor o igual a 4 y divisible entre 2
    document.getElementById("generateTournament").disabled = participants.length < 4 || participants.length % 2 !== 0;
  }
}

function updateParticipantsTable() {
  const tableBody = document.getElementById("participantsTable").getElementsByTagName("tbody")[0];
  tableBody.innerHTML = "";

  participants.forEach(participant => {
    const row = tableBody.insertRow();
    const cell = row.insertCell();
    cell.textContent = participant;
  });
}

function generateTournament() {
  if (participants.length < 4 || participants.length % 2 !== 0) {
    alert("Debe haber al menos 4 participantes y el número total debe ser divisible entre 2.");
    return;
  }

  // Ordenar aleatoriamente los participantes
  participants = shuffle(participants);

  rounds = [];
  currentRound = 0;
  createRound(participants);
  renderRounds();
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createRound(participants) {
  const round = participants.map((participant, index, array) => 
    index % 2 === 0 ? { player1: participant, player2: array[index + 1], winner: null } : null
  ).filter(Boolean);

  rounds.push(round);
}

function renderRounds() {
  const roundsDiv = document.getElementById("tournamentRounds");
  roundsDiv.innerHTML = "";

  rounds[currentRound].forEach((match, matchIndex) => {
    const matchDiv = document.createElement("div");
    matchDiv.classList.add("match");

    const player1 = document.createElement("span");
    player1.textContent = match.player1;
    const winnerButton1 = document.createElement("button");
    winnerButton1.textContent = "Ganador";
    winnerButton1.onclick = () => selectWinner(matchIndex, match.player1);

    const vs = document.createElement("span");
    vs.textContent = " vs ";

    const player2 = document.createElement("span");
    player2.textContent = match.player2;
    const winnerButton2 = document.createElement("button");
    winnerButton2.textContent = "Ganador";
    winnerButton2.onclick = () => selectWinner(matchIndex, match.player2);

    matchDiv.append(player1, winnerButton1, vs, player2, winnerButton2);
    roundsDiv.appendChild(matchDiv);
  });

  // Botón para avanzar de ronda
  const nextRoundButton = document.createElement("button");
  nextRoundButton.textContent = rounds[currentRound].length === 1 ? "Seleccionar Ganador" 
                                     : rounds[currentRound + 1] && rounds[currentRound + 1].length === 1 ? "Generar Ronda Final" : "Siguiente Ronda";
  nextRoundButton.id = "nextRoundButton";
  nextRoundButton.style.display = "none";
  nextRoundButton.onclick = () => nextRound();
  roundsDiv.appendChild(nextRoundButton);
}

function selectWinner(matchIndex, winner) {
  const match = rounds[currentRound][matchIndex];
  match.winner = winner;

  const matchDivs = document.getElementsByClassName("match");
  const player1Div = matchDivs[matchIndex].children[0];
  const player2Div = matchDivs[matchIndex].children[3];

  // Aplicar clase de ganador y perdedor
  if (winner === match.player1) {
    player1Div.classList.add("winner");
    player2Div.classList.add("loser");
  } else {
    player1Div.classList.add("loser");
    player2Div.classList.add("winner");
  }

  checkRoundCompletion();
}

function checkRoundCompletion() {
  const roundComplete = rounds[currentRound].every(match => match.winner);
  const nextRoundButton = document.getElementById("nextRoundButton");
  nextRoundButton.style.display = roundComplete ? "block" : "none";
}

function nextRound() {
  const winners = rounds[currentRound].map(match => match.winner);
  
  if (winners.length === 1) {
    displayWinner(winners[0]);
  } else {
    currentRound++;
    createRound(winners);
    renderRounds();
  }
}

function displayWinner(winner) {
  document.getElementById("tournamentRounds").innerHTML = "";
  const winnerDiv = document.getElementById("winnerMessage");
  winnerDiv.textContent = `¡${winner} es el ganador del torneo!`;
  winnerDiv.style.display = "block";
}
