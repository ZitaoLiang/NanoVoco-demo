"use strict";

const players = Array.from(document.querySelectorAll("audio"));
const status = document.getElementById("audio-status");

// Keep comparisons clear: starting one sample pauses the other players.
for (const player of players) {
  player.addEventListener("play", () => {
    for (const other of players) {
      if (other !== player) other.pause();
    }
    status.textContent = "";
  });
  const showError = () => {
    status.textContent = `Unable to load ${player.getAttribute("aria-label")}. Please refresh the page and try again.`;
  };
  player.addEventListener("error", showError);
  player.querySelector("source").addEventListener("error", showError);
}

document.getElementById("sample-select").addEventListener("change", (event) => {
  for (const player of players) player.pause();
  for (const cell of document.querySelectorAll("[data-sample]")) {
    cell.classList.toggle("selected", cell.dataset.sample === event.target.value);
  }
  status.textContent = "";
});
