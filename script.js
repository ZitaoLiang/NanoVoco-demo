"use strict";

const players = Array.from(document.querySelectorAll("audio"));
const status = document.getElementById("audio-status");
const inlineAudio = new Map();
const pendingAudio = new Map();
let activePlayer = null;

// The anonymous host does not serve byte ranges, which Safari's media loader
// needs. Classic scripts also work in its opaque-origin sandbox, unlike fetch.
window.NanoVocoAudio = {
  register(path, base64) {
    inlineAudio.set(path, `data:audio/wav;base64,${base64}`);
  },
};

function loadInlineAudio(path) {
  if (inlineAudio.has(path)) return Promise.resolve(inlineAudio.get(path));
  if (pendingAudio.has(path)) return pendingAudio.get(path);
  const promise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    const finish = (error) => {
      clearTimeout(timeout);
      script.remove();
      if (error) reject(error);
      else resolve(inlineAudio.get(path));
    };
    const timeout = setTimeout(() => finish(new Error("Audio load timed out")), 30000);
    script.src = `audio-inline/${path.replace(/\.wav$/, ".js")}`;
    script.onload = () => finish(inlineAudio.has(path) ? null : new Error("Missing audio"));
    script.onerror = () => finish(new Error("Audio download failed"));
    document.head.append(script);
  });
  pendingAudio.set(path, promise);
  promise.catch(() => pendingAudio.delete(path));
  return promise;
}

// Keep comparisons clear: starting one sample pauses the other players.
for (const player of players) {
  player.addEventListener("play", () => {
    activePlayer = player;
    for (const other of players) {
      if (other !== player) other.pause();
    }
    status.textContent = "";
  });
  player.addEventListener("pause", () => {
    if (activePlayer === player && player.paused) activePlayer = null;
  });
  const source = player.querySelector("source");
  const path = source.getAttribute("src");
  let recovering = false;
  let usingInlineAudio = false;
  const showError = async () => {
    if (recovering) return;
    const label = player.getAttribute("aria-label");
    if (usingInlineAudio || !path.endsWith(".wav")) {
      if (activePlayer === player) status.textContent = `Unable to play ${label}. Please reload the page and try again.`;
      return;
    }
    recovering = true;
    if (activePlayer === player) status.textContent = `Loading ${label}…`;
    try {
      const data = await loadInlineAudio(path);
      usingInlineAudio = true;
      player.src = data;
      player.load();
      if (activePlayer === player) {
        status.textContent = "";
        try {
          await player.play();
        } catch (error) {
          if (activePlayer === player) {
            status.textContent = error.name === "NotAllowedError"
              ? `${label} is ready. Press Play to listen.`
              : `Unable to play ${label}. Please reload the page and try again.`;
          }
        }
      }
    } catch {
      if (activePlayer === player) status.textContent = `Unable to download ${label}. Please reload the page and try again.`;
    } finally {
      recovering = false;
    }
  };
  player.addEventListener("error", showError);
  source.addEventListener("error", showError);
}

document.getElementById("sample-select").addEventListener("change", (event) => {
  activePlayer = null;
  for (const player of players) player.pause();
  for (const cell of document.querySelectorAll("[data-sample]")) {
    cell.classList.toggle("selected", cell.dataset.sample === event.target.value);
  }
  status.textContent = "";
});
