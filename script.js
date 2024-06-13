document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.querySelector("#torneo tbody");
  const rondasDiv = document.getElementById("rondas");
  const agregarFilaBtn = document.getElementById("agregarFila");
  const generarTorneoBtn = document.getElementById("generarTorneo");
  const resetearBtn = document.getElementById("resetear");
  const nombreGanadorElem = document.getElementById("nombreGanador");
  let jugadorCount = 1;
  let currentRound = [];

  // Función para agregar una fila nueva
  function agregarFila() {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td contenteditable="true">Jugador ${jugadorCount}</td><td>${jugadorCount}</td>`;
    tbody.appendChild(tr);
    jugadorCount++;
  }

  // Crear una fila inicial de jugador con campos editables
  agregarFila();

  // Función para marcar jugador como eliminado en la tabla
  function marcarEliminado(jugador) {
    document.querySelectorAll("#torneo tbody tr").forEach((tr) => {
      if (tr.cells[0].textContent.trim() === jugador) {
        tr.classList.add("loser");
      }
    });
  }

  // Función para marcar jugador como ganador en la tabla
  function marcarGanador(jugador) {
    document.querySelectorAll("#torneo tbody tr").forEach((tr) => {
      if (tr.cells[0].textContent.trim() === jugador) {
        tr.classList.add("winner");
      }
    });
  }

  // Función para mezclar un array (algoritmo Fisher-Yates)
  function mezclarArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Función para crear rondas del torneo
  function crearRondas(jugadores) {
    rondasDiv.innerHTML = ""; // Limpiar rondas anteriores
    currentRound = jugadores;
    let roundNumber = 1;

    function generarRonda() {
      const roundDiv = document.createElement("div");
      roundDiv.className = "round";
      roundDiv.innerHTML = `<h2>Ronda ${roundNumber}</h2>`;
      const nextRound = [];
      for (let i = 0; i < currentRound.length; i += 2) {
        const matchDiv = document.createElement("div");
        matchDiv.className = "match";
        matchDiv.innerHTML = `
                    <button class="player">${currentRound[i]}</button>
                    <button class="player">${currentRound[i + 1]}</button>
                `;
        const playerButtons = matchDiv.querySelectorAll(".player");
        playerButtons.forEach((button) => {
          button.addEventListener("click", (e) => {
            const winner = e.target;
            const loser =
              winner === playerButtons[0] ? playerButtons[1] : playerButtons[0];
            winner.classList.add("winner");
            loser.classList.add("loser");
            winner.disabled = true;
            loser.disabled = true;
            nextRound.push(winner.textContent);
            marcarEliminado(loser.textContent);
          });
        });
        roundDiv.appendChild(matchDiv);
      }
      rondasDiv.appendChild(roundDiv);

      const nextRoundButton = document.createElement("button");
      nextRoundButton.textContent = `Generar Ronda ${roundNumber + 1}`;
      nextRoundButton.addEventListener("click", () => {
        if (nextRound.length === currentRound.length / 2) {
          if (nextRound.length === 1) {
            nombreGanadorElem.textContent = `¡El ganador es ${nextRound[0]}!`;
            marcarGanador(nextRound[0]);
          } else {
            roundNumber++;
            currentRound = nextRound;
            rondasDiv.innerHTML = "";
            generarRonda();
          }
        } else {
          alert("Selecciona un ganador para cada partida.");
        }
      });
      rondasDiv.appendChild(nextRoundButton);
    }

    mezclarArray(currentRound);
    generarRonda();
  }

  // Evento para agregar una fila nueva
  agregarFilaBtn.addEventListener("click", agregarFila);

  // Evento para generar el torneo cuando se hace clic en el botón
  generarTorneoBtn.addEventListener("click", () => {
    const jugadores = [];
    document.querySelectorAll("#torneo tbody tr").forEach((tr) => {
      const jugador = tr.cells[0].textContent.trim();
      if (jugador) {
        jugadores.push(jugador);
      }
    });
    if (jugadores.length % 2 === 0 && jugadores.length > 1) {
      crearRondas(jugadores);
    } else {
      alert("Debe haber un número par de jugadores y al menos 2 jugadores.");
    }
  });

  // Evento para resetear todos los datos
  resetearBtn.addEventListener("click", () => {
    tbody.innerHTML = "";
    rondasDiv.innerHTML = "";
    nombreGanadorElem.textContent = "";
    jugadorCount = 1;
    agregarFila();
  });
});
