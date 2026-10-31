const games = [
  { id: "neon-dash", title: "Neon Dash", genre: "Arcade", rating: "4.9", emoji: "⚡", art: "violet", badge: "Trending", kind: "snake", players: "2.4k" },
  { id: "pocket-pairs", title: "Pocket Pairs", genre: "Puzzle", rating: "4.8", emoji: "🃏", art: "pink", badge: "Popular", kind: "memory", players: "1.8k" },
  { id: "orbit-escape", title: "Orbit Escape", genre: "Action", rating: "4.7", emoji: "🪐", art: "blue", badge: "New", kind: "reaction", players: "960" },
  { id: "tile-twist", title: "Tile Twist", genre: "Puzzle", rating: "4.9", emoji: "🧩", art: "teal", badge: "Trending", kind: "merge", players: "3.1k" },
  { id: "pixel-pong", title: "Pixel Pong", genre: "Arcade", rating: "4.6", emoji: "🏓", art: "orange", badge: "Classic", kind: "pong", players: "1.2k" },
  { id: "garden-gems", title: "Garden Gems", genre: "Casual", rating: "4.8", emoji: "🌷", art: "green", badge: "New", kind: "garden", players: "780" },
  { id: "tiny-tactics", title: "Tiny Tactics", genre: "Strategy", rating: "4.7", emoji: "♟️", art: "yellow", badge: "Popular", kind: "tictactoe", players: "1.6k" },
  { id: "star-catcher", title: "Star Catcher", genre: "Action", rating: "4.8", emoji: "🌟", art: "violet", badge: "Trending", kind: "catch", players: "2.1k" },
  { id: "cosmic-cubes", title: "Cosmic Cubes", genre: "Puzzle", rating: "4.6", emoji: "🧊", art: "cyan", badge: "New", kind: "simon", players: "540" },
  { id: "fruit-frenzy", title: "Fruit Frenzy", genre: "Casual", rating: "4.8", emoji: "🍓", art: "pink", badge: "Popular", kind: "slice", players: "2.8k" },
  { id: "shadow-sprint", title: "Shadow Sprint", genre: "Action", rating: "4.5", emoji: "🥷", art: "blue", badge: "Trending", kind: "dodge", players: "1.1k" },
  { id: "memory-mix", title: "Memory Mix", genre: "Puzzle", rating: "4.7", emoji: "🎴", art: "orange", badge: "Classic", kind: "word", players: "890" },
  { id: "bubble-bop", title: "Bubble Bop", genre: "Arcade", rating: "4.8", emoji: "🫧", art: "cyan", badge: "New", kind: "bubbles", players: "1.5k" },
  { id: "mini-mages", title: "Mini Mages", genre: "Strategy", rating: "4.6", emoji: "🪄", art: "violet", badge: "Popular", kind: "rps", players: "670" },
  { id: "lucky-lanes", title: "Lucky Lanes", genre: "Casual", rating: "4.5", emoji: "🎳", art: "yellow", badge: "Classic", kind: "bowling", players: "430" },
  { id: "deep-blue", title: "Deep Blue", genre: "Puzzle", rating: "4.9", emoji: "🐙", art: "teal", badge: "Trending", kind: "typing", players: "2.2k" },
  { id: "rocket-rally", title: "Rocket Rally", genre: "Arcade", rating: "4.7", emoji: "🚀", art: "orange", badge: "New", kind: "shooter", players: "1.3k" },
  { id: "cozy-cafe", title: "Cozy Cafe", genre: "Casual", rating: "4.8", emoji: "☕", art: "pink", badge: "Popular", kind: "cafe", players: "1.9k" },
  { id: "grid-guardians", title: "Grid Guardians", genre: "Strategy", rating: "4.6", emoji: "🛡️", art: "blue", badge: "Classic", kind: "mines", players: "620" },
  { id: "lunar-loop", title: "Lunar Loop", genre: "Puzzle", rating: "4.9", emoji: "🌙", art: "violet", badge: "Trending", kind: "connect", players: "1.7k" },
  { id: "panda-pop", title: "Panda Pop", genre: "Casual", rating: "4.7", emoji: "🐼", art: "green", badge: "New", kind: "whack", players: "730" },
  { id: "circuit-break", title: "Circuit Break", genre: "Action", rating: "4.8", emoji: "🔋", art: "cyan", badge: "Popular", kind: "breaker", players: "980" },
  { id: "castle-check", title: "Castle Check", genre: "Strategy", rating: "4.5", emoji: "🏰", art: "yellow", badge: "Classic", kind: "connect4", players: "510" },
  { id: "cloud-nine", title: "Cloud Nine", genre: "Arcade", rating: "4.8", emoji: "☁️", art: "teal", badge: "Trending", kind: "flappy", players: "1.4k" }
];

const featuredGames = [
  { id: "neon-dash", description: "Dodge, dash, and see how long you can last in this neon arcade favorite." },
  { id: "pocket-pairs", description: "Flip the cards, find every pair, and put your memory to the test." },
  { id: "cloud-nine", description: "Take to the sky and guide your cloud through the gates." },
  { id: "grid-guardians", description: "Read the clues, avoid the mines, and clear the whole grid." }
];

const storageKey = "gamehub-library";
const playerNameKey = "gamehub-player-name";
let favorites = [];
try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
  if (Array.isArray(saved)) favorites = saved.filter((id) => games.some((game) => game.id === id));
} catch (error) {
  console.warn("Could not read the saved GameHub library.", error);
}
let playerName = "Player";
try {
  const savedName = localStorage.getItem(playerNameKey);
  if (savedName && savedName.trim()) playerName = savedName.trim().slice(0, 24);
} catch (error) {
  console.warn("Could not read the saved GameHub account name.", error);
}

let activeGenre = "All";
let activeFilter = "All";
let searchText = "";
let visibleCount = 12;
let libraryOnly = false;
let sortMode = "Featured";
let toastTimer;
let gameTimer;
let additionalGameTimers = [];
let gameKeyHandler;
let activeGame;
const grid = document.querySelector("#game-grid");
const modal = document.createElement("div");
modal.className = "game-modal";
modal.id = "game-modal";
modal.hidden = true;
modal.setAttribute("role", "dialog");
modal.setAttribute("aria-modal", "true");
modal.setAttribute("aria-labelledby", "modal-title");
modal.innerHTML = '<div class="modal-panel"><div class="modal-head"><h2 id="modal-title"></h2><div class="modal-head-actions"><button class="game-restart" type="button" aria-label="Restart game" title="Restart game">↻ <span>Restart</span></button><button class="modal-close" aria-label="Close game">×</button></div></div><div class="modal-content"></div></div>';
document.body.append(modal);
const modalContent = modal.querySelector(".modal-content");

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2100);
}

function scheduleGameTimeout(callback, delay) {
  const timer = setTimeout(() => {
    additionalGameTimers = additionalGameTimers.filter((item) => item !== timer);
    if (!modal.hidden) callback();
  }, delay);
  additionalGameTimers.push(timer);
  return timer;
}

function saveFavorites() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(favorites));
  } catch (error) {
    showToast("Your browser couldn't save the library.");
    console.error("Could not save the GameHub library.", error);
  }
}

function updateLibraryCount() {
  document.querySelector("#library-count").textContent = String(favorites.length);
  document.querySelector("#favorite-stat").textContent = String(favorites.length);
}

function filteredGames() {
  let result = games.filter((game) => {
    const matchesGenre = activeGenre === "All" || game.genre === activeGenre;
    const matchesFilter = activeFilter === "All" || game.badge === activeFilter;
    const matchesLibrary = !libraryOnly || favorites.includes(game.id);
    const matchesSearch = `${game.title} ${game.genre}`.toLowerCase().includes(searchText);
    return matchesGenre && matchesFilter && matchesLibrary && matchesSearch;
  });
  if (sortMode === "Top rated") result = result.slice().sort((a, b) => Number(b.rating) - Number(a.rating));
  if (sortMode === "A–Z") result = result.slice().sort((a, b) => a.title.localeCompare(b.title));
  return result;
}

function renderGames() {
  const result = filteredGames();
  const shown = result.slice(0, visibleCount);
  grid.innerHTML = shown.map((game) => `
    <article class="game-card">
      <div class="game-art art-${game.art}">
        <span class="game-emoji" aria-hidden="true">${game.emoji}</span>
        <span class="card-badge">${game.badge}</span>
        <button class="favorite-button ${favorites.includes(game.id) ? "is-favorite" : ""}" data-favorite="${game.id}" aria-label="${favorites.includes(game.id) ? "Remove" : "Add"} ${game.title} ${favorites.includes(game.id) ? "from" : "to"} your library" aria-pressed="${favorites.includes(game.id)}">${favorites.includes(game.id) ? "♥" : "♡"}</button>
      </div>
      <div class="card-body">
        <div class="card-title-row"><span class="card-title">${game.title}</span><span class="game-rating">★ ${game.rating}</span></div>
        <div class="card-meta"><span>${game.genre}</span><span>◉ ${game.players} playing</span></div>
        <button class="play-card-button" data-play="${game.id}">Play now&nbsp; ↗</button>
      </div>
    </article>`).join("");
  document.querySelector("#empty-state").hidden = result.length > 0;
  document.querySelector("#load-more").hidden = shown.length >= result.length || result.length === 0;
  document.querySelector("#load-more").innerHTML = `Show ${Math.min(12, result.length - shown.length)} more games <span>↓</span>`;
  document.querySelector("#library-count").textContent = String(favorites.length);
  document.querySelector("#favorite-stat").textContent = String(favorites.length);
  document.querySelector("#library").classList.toggle("active", libraryOnly);
  document.querySelector("#empty-state p").textContent = libraryOnly && !favorites.length ? "Save a game with the heart button and it will show up here." : "Try a different search or genre.";
}

function setGenre(genre) {
  activeGenre = genre;
  libraryOnly = false;
  visibleCount = 12;
  document.querySelector("#sidebar").classList.remove("open");
  document.querySelectorAll(".genre-link").forEach((button) => button.classList.toggle("selected", button.dataset.genre === genre));
  document.querySelector("#discover").scrollIntoView({ behavior: "smooth", block: "start" });
  renderGames();
}

document.querySelectorAll(".genre-link").forEach((button) => {
  button.addEventListener("click", () => setGenre(button.dataset.genre));
});
document.querySelectorAll(".filter-pill").forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    visibleCount = 12;
    document.querySelectorAll(".filter-pill").forEach((pill) => pill.classList.toggle("active", pill === button));
    renderGames();
  });
});
document.querySelector("#search-input").addEventListener("input", (event) => {
  searchText = event.target.value.trim().toLowerCase();
  visibleCount = 12;
  renderGames();
});
document.querySelector("#search-input").addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    event.currentTarget.value = "";
    searchText = "";
    renderGames();
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName) && !modal.hidden) return;
  if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    document.querySelector("#search-input").focus();
  }
  if (event.key === "Escape" && !modal.hidden) closeGame();
  if (event.key === "Escape" && !accountModal.hidden) closeAccountSettings();
});
document.querySelector("#load-more").addEventListener("click", () => {
  visibleCount += 12;
  renderGames();
});
document.querySelector("#library").addEventListener("click", (event) => {
  event.preventDefault();
  document.querySelector("#sidebar").classList.remove("open");
  libraryOnly = true;
  activeGenre = "All";
  activeFilter = "All";
  visibleCount = 24;
  document.querySelectorAll(".genre-link").forEach((button) => button.classList.toggle("selected", button.dataset.genre === "All"));
  document.querySelectorAll(".filter-pill").forEach((button) => button.classList.toggle("active", button.dataset.filter === "All"));
  document.querySelector("#discover").scrollIntoView({ behavior: "smooth", block: "start" });
  renderGames();
});
document.querySelectorAll('.main-nav a[href="#home"], .main-nav a[href="#discover"]').forEach((link) => {
  link.addEventListener("click", () => {
    libraryOnly = false;
    document.querySelector("#sidebar").classList.remove("open");
    document.querySelectorAll(".nav-link").forEach((item) => item.classList.toggle("active", item === link));
    renderGames();
  });
});
document.querySelector("#sort-button").addEventListener("click", () => {
  sortMode = sortMode === "Featured" ? "Top rated" : sortMode === "Top rated" ? "A–Z" : "Featured";
  document.querySelector("#sort-button").innerHTML = `✦ <span>${sortMode}</span> <b>⌄</b>`;
  renderGames();
});
document.querySelector("#menu-toggle").addEventListener("click", () => document.querySelector("#sidebar").classList.toggle("open"));
const accountModal = document.querySelector("#account-modal");
const accountForm = document.querySelector("#account-form");
const nameInput = document.querySelector("#player-name");

function updatePlayerName() {
  document.querySelectorAll(".profile-name").forEach((element) => { element.textContent = playerName; });
  document.querySelectorAll(".profile-avatar, .mini-avatar").forEach((element) => {
    element.textContent = Array.from(playerName.trim())[0]?.toLocaleUpperCase() || "P";
    element.setAttribute("aria-label", `${playerName} account`);
  });
}

function openAccountSettings() {
  nameInput.value = playerName;
  accountModal.hidden = false;
  document.body.style.overflow = "hidden";
  nameInput.focus();
  nameInput.select();
}

function closeAccountSettings() {
  accountModal.hidden = true;
  document.body.style.overflow = "";
}

document.querySelector(".more-button").addEventListener("click", openAccountSettings);
document.querySelector(".mini-avatar").addEventListener("click", openAccountSettings);
document.querySelector(".account-close").addEventListener("click", closeAccountSettings);
document.querySelector(".account-cancel").addEventListener("click", closeAccountSettings);
accountModal.addEventListener("click", (event) => {
  if (event.target === accountModal) closeAccountSettings();
});
accountForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const nextName = nameInput.value.trim();
  if (!nextName) {
    nameInput.setCustomValidity("Please enter a name.");
    nameInput.reportValidity();
    return;
  }
  nameInput.setCustomValidity("");
  try {
    localStorage.setItem(playerNameKey, nextName);
  } catch (error) {
    console.error("Could not save the GameHub account name.", error);
    showToast("Your browser couldn't save the account name.");
    return;
  }
  playerName = nextName;
  updatePlayerName();
  closeAccountSettings();
  showToast(`Your name is now ${playerName}.`);
});
nameInput.addEventListener("input", () => nameInput.setCustomValidity(""));

grid.addEventListener("click", (event) => {
  const favoriteButton = event.target.closest("[data-favorite]");
  if (favoriteButton) {
    const id = favoriteButton.dataset.favorite;
    favorites = favorites.includes(id) ? favorites.filter((favorite) => favorite !== id) : [...favorites, id];
    saveFavorites();
    updateLibraryCount();
    renderGames();
    showToast(favorites.includes(id) ? "Added to your library" : "Removed from your library");
    return;
  }
  const playButton = event.target.closest("[data-play]");
  if (playButton) openGame(games.find((game) => game.id === playButton.dataset.play));
});

function openGame(game) {
  if (!game) return;
  activeGame = game;
  clearInterval(gameTimer);
  additionalGameTimers.forEach((timer) => { clearInterval(timer); clearTimeout(timer); });
  additionalGameTimers = [];
  if (gameKeyHandler) document.removeEventListener("keydown", gameKeyHandler);
  modal.querySelector("#modal-title").textContent = game.title;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  const gamesByKind = {
    memory: renderMemory,
    reaction: renderReaction,
    tictactoe: renderTicTacToe,
    snake: renderSnake,
    merge: renderMerge,
    catch: renderCatch,
    pong: renderPong,
    garden: renderGarden,
    simon: renderSimon,
    slice: renderSlice,
    dodge: renderDodge,
    word: renderWord,
    bubbles: renderBubbles,
    rps: renderRps,
    bowling: renderBowling,
    typing: renderTyping,
    shooter: renderShooter,
    cafe: renderCafe,
    mines: renderMines,
    connect: renderConnect,
    whack: renderWhack,
    breaker: renderBreaker,
    connect4: renderConnect4,
    flappy: renderFlappy
  };
  (gamesByKind[game.kind] || renderReaction)(game);
  modal.querySelector(".modal-close").focus();
}

function closeGame() {
  modal.hidden = true;
  document.body.style.overflow = "";
  clearInterval(gameTimer);
  additionalGameTimers.forEach((timer) => { clearInterval(timer); clearTimeout(timer); });
  additionalGameTimers = [];
  if (gameKeyHandler) document.removeEventListener("keydown", gameKeyHandler);
}

modal.querySelector(".modal-close").addEventListener("click", closeGame);
modal.querySelector(".game-restart").addEventListener("click", () => {
  if (activeGame) openGame(activeGame);
});
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeGame();
});

function modalIntro(description, action, callback) {
  modalContent.innerHTML = `<p>${description}</p><button class="game-action">${action}</button>`;
  modalContent.querySelector(".game-action").addEventListener("click", callback);
}

function renderMemory() {
  const symbols = ["✦", "☾", "♡", "♟", "☀", "◆", "♫", "✿", "♣", "♦", "☯", "⚑"];
  let score = 0;
  let open = [];
  let locked = false;
  modalIntro("Find all 12 matching pairs. Flip two cards at a time and test your memory.", "Start matching", start);
  function start() {
    let deck = [...symbols, ...symbols].sort(() => Math.random() - .5);
    modalContent.innerHTML = `<div class="modal-score">Pairs found: <span>0</span> / 12</div><div class="memory-board">${deck.map((symbol, index) => `<button class="memory-card" data-index="${index}" data-symbol="${symbol}" aria-label="Hidden card">?</button>`).join("")}</div><p>Match the pairs to win!</p>`;
    modalContent.querySelectorAll(".memory-card").forEach((card) => card.addEventListener("click", () => {
      if (locked || card.classList.contains("revealed") || card.dataset.matched) return;
      card.classList.add("revealed");
      card.textContent = card.dataset.symbol;
      open.push(card);
      if (open.length === 2) {
        locked = true;
        if (open[0].dataset.symbol === open[1].dataset.symbol) {
          open.forEach((item) => { item.dataset.matched = "true"; });
          score += 1;
          modalContent.querySelector(".modal-score span").textContent = String(score);
          open = [];
          locked = false;
          if (score === 12) modalContent.querySelector("p").textContent = "All pairs found! Impressive memory.";
        } else {
          scheduleGameTimeout(() => {
            open.forEach((item) => { item.classList.remove("revealed"); item.textContent = "?"; });
            open = [];
            locked = false;
          }, 700);
        }
      }
    }));
  }
}

function renderReaction() {
  let timeout;
  modalIntro("Wait for green and click in under 220 ms. Click early or react too slowly and the round is lost.", "Start round", start);
  function start() {
    modalContent.innerHTML = '<div class="modal-score">Reaction time: <span>—</span></div><div class="game-board"><button class="reaction-target">Wait…</button></div><p>Wait for green!</p>';
    const target = modalContent.querySelector(".reaction-target");
    const status = modalContent.querySelector("p");
    let startTime = 0;
    let isReady = false;
    target.classList.add("waiting");
    const delay = 1200 + Math.random() * 2400;
    target.addEventListener("click", () => {
      if (!isReady) {
        clearTimeout(timeout);
        status.textContent = "Too soon! Start a new round and wait for green.";
        target.disabled = true;
        return;
      }
      const reactionTime = Math.round(performance.now() - startTime);
      modalContent.querySelector(".modal-score span").textContent = `${reactionTime} ms`;
      status.textContent = reactionTime <= 220 ? "Lightning fast! You beat the 220 ms target." : "Too slow! Restart and try to react in under 220 ms.";
      if (reactionTime > 220) target.classList.remove("ready");
      target.disabled = true;
    }, { once: true });
    timeout = scheduleGameTimeout(() => {
      isReady = true;
      target.classList.remove("waiting");
      target.classList.add("ready");
      target.textContent = "CLICK!";
      status.textContent = "Now!";
      startTime = performance.now();
    }, delay);
  }
}

function renderTicTacToe() {
  let cells = Array(9).fill("");
  let finished = false;
  modalIntro("You're ✕. The computer plays perfect defense and will take every winning move. Try to force a draw.", "Face the champion", start);
  function start() {
    cells = Array(9).fill("");
    finished = false;
    modalContent.innerHTML = '<div class="modal-score">Your move: ✕</div><div class="game-board"><div class="ttt-board"></div></div><p>Get three in a row to win.</p><button class="game-action">New game</button>';
    modalContent.querySelector(".game-action").addEventListener("click", start);
    const board = modalContent.querySelector(".ttt-board");
    function draw() {
      board.innerHTML = cells.map((cell, index) => `<button class="ttt-cell" data-index="${index}" aria-label="Cell ${index + 1}">${cell}</button>`).join("");
    }
    function outcome() {
      const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
      return lines.find(([a, b, c]) => cells[a] && cells[a] === cells[b] && cells[a] === cells[c])?.map((index) => cells[index])[0] || (cells.every(Boolean) ? "draw" : "");
    }
    function minimax(boardState, computerTurn, depth) {
      const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
      const winner = lines.find(([a, b, c]) => boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c])?.map((index) => boardState[index])[0];
      if (winner === "○") return 10 - depth;
      if (winner === "✕") return depth - 10;
      if (boardState.every(Boolean)) return 0;
      const scores = boardState.map((value, index) => {
        if (value) return null;
        const next = boardState.slice();
        next[index] = computerTurn ? "○" : "✕";
        return minimax(next, !computerTurn, depth + 1);
      }).filter((score) => score !== null);
      return computerTurn ? Math.max(...scores) : Math.min(...scores);
    }
    board.addEventListener("click", (event) => {
      const cell = event.target.closest("[data-index]");
      if (!cell || finished || cells[Number(cell.dataset.index)]) return;
      cells[Number(cell.dataset.index)] = "✕";
      let result = outcome();
      if (!result && cells.includes("")) {
        const options = cells.map((value, index) => {
          if (value) return null;
          const next = cells.slice();
          next[index] = "○";
          return { index, score: minimax(next, false, 0) };
        }).filter(Boolean).sort((a, b) => b.score - a.score);
        cells[options[0].index] = "○";
        result = outcome();
      }
      draw();
      if (result) {
        finished = true;
        modalContent.querySelector(".modal-score").textContent = result === "draw" ? "It's a draw!" : result === "✕" ? "You win! Great move." : "The computer got this one!";
        modalContent.querySelector("p").textContent = "Choose New game for a rematch.";
      }
    });
    draw();
  }
}

function renderSnake() {
  modalIntro("Collect the glowing dots and avoid the walls and your tail. Use the arrow keys to steer.", "Start Snake", start);
  function start() {
    let snake = [{ x: 8, y: 7 }, { x: 7, y: 7 }, { x: 6, y: 7 }];
    let direction = { x: 1, y: 0 };
    let nextDirection = direction;
    let food = { x: 13, y: 6 };
    let score = 0;
    modalContent.innerHTML = '<div class="modal-score">Score: <span>0</span> · Steer with arrows</div><canvas class="snake-canvas" width="320" height="240" aria-label="Snake game board"></canvas><div class="mini-controls snake-controls"><button class="mini-control" data-direction="ArrowUp">↑</button><button class="mini-control" data-direction="ArrowLeft">←</button><button class="mini-control" data-direction="ArrowDown">↓</button><button class="mini-control" data-direction="ArrowRight">→</button></div><p>Collect the glowing dots and avoid the walls.</p>';
    const canvas = modalContent.querySelector("canvas");
    const context = canvas.getContext("2d");
    const cell = 16;
    function paint() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "#18202a";
      context.fillRect(food.x * cell, food.y * cell, cell - 2, cell - 2);
      context.fillStyle = "#a990ff";
      snake.forEach((part, index) => {
        context.globalAlpha = index ? .8 : 1;
        context.fillRect(part.x * cell, part.y * cell, cell - 2, cell - 2);
      });
      context.globalAlpha = 1;
    }
    function tick() {
      direction = nextDirection;
      const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
      if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 15 || snake.some((part) => part.x === head.x && part.y === head.y)) {
        clearInterval(gameTimer);
        modalContent.querySelector("p").textContent = `Game over! Final score: ${score}. Start Snake again for another run.`;
        return;
      }
      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) {
        score += 1;
        modalContent.querySelector(".modal-score span").textContent = String(score);
        do { food = { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 15) }; } while (snake.some((part) => part.x === food.x && part.y === food.y));
      } else snake.pop();
      paint();
    }
    const steer = (key) => {
      const directions = { ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 }, ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 } };
      const candidate = directions[key];
      if (candidate && candidate.x !== -direction.x && candidate.y !== -direction.y) nextDirection = candidate;
    };
    gameKeyHandler = (event) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) event.preventDefault();
      steer(event.key);
    };
    modalContent.querySelector(".snake-controls").addEventListener("click", (event) => steer(event.target.dataset.direction));
    document.addEventListener("keydown", gameKeyHandler);
    paint();
    gameTimer = setInterval(tick, 78);
  }
}

function renderMerge() {
  modalIntro("Slide the tiles with your arrow keys. Matching numbers combine. Reach 2048 before the board fills.", "Start puzzling", start);
  function start() {
    let board = Array(16).fill(0);
    let score = 0;
    const spawn = () => {
      const open = board.map((value, index) => value ? -1 : index).filter((index) => index >= 0);
      if (open.length) board[open[Math.floor(Math.random() * open.length)]] = Math.random() < .9 ? 2 : 4;
    };
    const draw = () => {
      modalContent.querySelector(".number-board").innerHTML = board.map((value) => `<div class="number-tile" data-value="${value}">${value || ""}</div>`).join("");
      modalContent.querySelector(".modal-score span").textContent = String(score);
    };
    modalContent.innerHTML = '<div class="modal-score">Score: <span>0</span> · Use arrows or buttons</div><div class="game-board"><div class="number-board"></div></div><div class="mini-controls merge-controls"><button class="mini-control" data-direction="up">↑</button><button class="mini-control" data-direction="left">←</button><button class="mini-control" data-direction="down">↓</button><button class="mini-control" data-direction="right">→</button></div><p>Combine matching numbers to reach 2048.</p>';
    spawn(); spawn(); draw();
    const moveBoard = (move) => {
      const before = board.join(",");
      for (let line = 0; line < 4; line++) {
        let indexes = Array.from({ length: 4 }, (_, step) => move === "left" ? line * 4 + step : move === "right" ? line * 4 + (3 - step) : move === "up" ? step * 4 + line : (3 - step) * 4 + line);
        let values = indexes.map((index) => board[index]).filter(Boolean);
        for (let i = 0; i < values.length - 1; i++) {
          if (values[i] === values[i + 1]) {
            values[i] *= 2;
            score += values[i];
            values.splice(i + 1, 1);
          }
        }
        values = [...values, ...Array(4 - values.length).fill(0)];
        indexes.forEach((index, i) => { board[index] = values[i]; });
      }
      if (before !== board.join(",")) spawn();
      draw();
      if (board.includes(2048)) modalContent.querySelector("p").textContent = "2048! You're a tile-twisting champion.";
    };
    modalContent.querySelector(".merge-controls").addEventListener("click", (event) => {
      if (event.target.dataset.direction) moveBoard(event.target.dataset.direction);
    });
    gameKeyHandler = (event) => {
      const shifts = { ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down" };
      if (!shifts[event.key]) return;
      event.preventDefault();
      moveBoard(shifts[event.key]);
    };
    document.addEventListener("keydown", gameKeyHandler);
  }
}

function renderCatch() {
  let score = 0;
  let seconds = 10;
  modalIntro("Catch the tiny, fast-moving star as many times as you can in 10 seconds.", "Start catching", start);
  function start() {
    score = 0;
    seconds = 10;
    modalContent.innerHTML = '<div class="modal-score">Stars: <span class="score">0</span> · Time: <span class="seconds">10</span>s</div><div class="catch-board"><button class="catch-target" aria-label="Catch the star"></button></div><p>Catch the star!</p>';
    const board = modalContent.querySelector(".catch-board");
    const target = modalContent.querySelector(".catch-target");
    function move() {
      target.style.left = `${Math.random() * (board.clientWidth - 22)}px`;
      target.style.top = `${Math.random() * (board.clientHeight - 22)}px`;
    }
    target.addEventListener("click", () => {
      if (seconds <= 0) return;
      score += 1;
      modalContent.querySelector(".score").textContent = String(score);
      move();
    });
    move();
    const targetMoveTimer = setInterval(move, 700);
    additionalGameTimers.push(targetMoveTimer);
    gameTimer = setInterval(() => {
      seconds -= 1;
      modalContent.querySelector(".seconds").textContent = String(seconds);
      if (seconds <= 0) {
        clearInterval(gameTimer);
        clearInterval(targetMoveTimer);
        target.disabled = true;
        modalContent.querySelector("p").textContent = `Time's up! You caught ${score} stars. Start another round to beat your score.`;
      }
    }, 1000);
  }
}

function renderPong() {
  modalIntro("Keep the fast ball in play! The computer tracks quickly, and the ball speeds up after every return.", "Serve", start);
  function start() {
    modalContent.innerHTML = '<div class="modal-score">Rally: <span>0</span> · Move with ← →</div><canvas class="pong-canvas" width="360" height="210" aria-label="Pong game"></canvas><p>Keep the ball bouncing. The rally ends if it gets past you.</p>';
    const canvas = modalContent.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    let x = 180, y = 100, vx = 4.2, vy = 3.5, playerX = 163, cpuX = 163, rally = 0;
    function tick() {
      ctx.clearRect(0, 0, 360, 210);
      ctx.fillStyle = "#19172a"; ctx.fillRect(0, 0, 360, 210);
      ctx.setLineDash([5, 6]); ctx.strokeStyle = "#514a69"; ctx.beginPath(); ctx.moveTo(180, 0); ctx.lineTo(180, 210); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = "#ad91ff"; ctx.fillRect(playerX, 194, 34, 6);
      ctx.fillStyle = "#ff86c4"; ctx.fillRect(cpuX, 10, 40, 6);
      ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fillStyle = "#f4eaff"; ctx.fill();
      x += vx; y += vy; cpuX += Math.sign(x - (cpuX + 20)) * 3.2;
      if (x < 7 || x > 353) vx *= -1;
      if (y < 22 && x > cpuX - 3 && x < cpuX + 43) { vy = Math.min(7, Math.abs(vy) * 1.06); vx = Math.sign(vx) * Math.min(8, Math.abs(vx) * 1.04); rally++; }
      if (y > 187 && x > playerX - 3 && x < playerX + 37) { vy = -Math.min(7, Math.abs(vy) * 1.06); vx = Math.sign(vx) * Math.min(8, Math.abs(vx) * 1.04); rally++; }
      if (y < 0 || y > 215) { clearInterval(gameTimer); modalContent.querySelector("p").textContent = `Rally over! You returned ${rally} shots. Serve again to play.`; }
      modalContent.querySelector(".modal-score span").textContent = String(rally);
    }
    gameKeyHandler = (event) => {
      if (event.key === "ArrowLeft") playerX = Math.max(0, playerX - 18);
      if (event.key === "ArrowRight") playerX = Math.min(326, playerX + 18);
    };
    document.addEventListener("keydown", gameKeyHandler);
    canvas.addEventListener("pointermove", (event) => {
      const bounds = canvas.getBoundingClientRect();
      playerX = Math.max(0, Math.min(326, (event.clientX - bounds.left) * 360 / bounds.width - 17));
    });
    gameTimer = setInterval(tick, 24);
  }
}

function renderGarden() {
  const flowers = ["🌷", "🌼", "🌸", "🌻", "🌺"];
  const width = 6;
  const height = 6;
  const targetPetals = 32;
  const moveLimit = 18;
  modalIntro("Swap flowers to match four or more in a row. Flowers fall, new ones grow, and chain reactions earn extra petals. Reach 32 petals in 18 moves.", "Start the garden", start);
  function start() {
    let board = [];
    let selected = -1;
    let petals = 0;
    let movesLeft = moveLimit;
    let gameOver = false;
    modalContent.innerHTML = `<div class="modal-score">Petals: <span class="garden-petals">0</span> / ${targetPetals} · Moves: <span class="garden-moves">${moveLimit}</span></div><div class="garden-grid"></div><p>Swap neighboring flowers. Matches fall and refill!</p>`;
    const area = modalContent.querySelector(".garden-grid");
    const fallbackBoard = [
      0, 1, 0, 0, 2, 3,
      2, 0, 3, 2, 1, 0,
      3, 2, 1, 3, 0, 2,
      1, 3, 2, 0, 3, 1,
      2, 1, 0, 3, 2, 0,
      3, 0, 1, 2, 1, 3
    ].map((flowerIndex) => flowers[flowerIndex]);
    function findMatches(cells) {
      const matches = new Set();
      for (let row = 0; row < height; row++) {
        let start = 0;
        while (start < width) {
          let end = start + 1;
          while (end < width && cells[row * width + end] === cells[row * width + start]) end++;
          if (end - start >= 4) for (let col = start; col < end; col++) matches.add(row * width + col);
          start = end;
        }
      }
      for (let col = 0; col < width; col++) {
        let start = 0;
        while (start < height) {
          let end = start + 1;
          while (end < height && cells[end * width + col] === cells[start * width + col]) end++;
          if (end - start >= 4) for (let row = start; row < end; row++) matches.add(row * width + col);
          start = end;
        }
      }
      return matches;
    }
    function hasLegalMove(cells) {
      for (let index = 0; index < cells.length; index++) {
        for (const neighbor of [index % width < width - 1 ? index + 1 : -1, index + width < cells.length ? index + width : -1]) {
          if (neighbor < 0) continue;
          [cells[index], cells[neighbor]] = [cells[neighbor], cells[index]];
          const createsMatch = findMatches(cells).size > 0;
          [cells[index], cells[neighbor]] = [cells[neighbor], cells[index]];
          if (createsMatch) return true;
        }
      }
      return false;
    }
    function createPlayableBoard() {
      for (let attempt = 0; attempt < 1000; attempt++) {
        const candidate = Array.from({ length: width * height }, () => flowers[Math.floor(Math.random() * flowers.length)]);
        if (!findMatches(candidate).size && hasLegalMove(candidate)) return candidate;
      }
      return fallbackBoard.slice();
    }
    function draw() {
      area.innerHTML = board.map((flower, i) => `<button class="garden-tile ${selected === i ? "chosen" : ""}" data-index="${i}" aria-label="Flower ${i + 1}" ${gameOver ? "disabled" : ""}>${flower}</button>`).join("");
    }
    function finish(message) {
      gameOver = true;
      selected = -1;
      modalContent.querySelector("p").textContent = message;
      draw();
    }
    function resolveMatches() {
      let cascade = 0;
      let cleared = findMatches(board);
      while (cleared.size && cascade < 12) {
        petals += cleared.size;
        for (let col = 0; col < width; col++) {
          const remaining = [];
          for (let row = height - 1; row >= 0; row--) {
            const index = row * width + col;
            if (!cleared.has(index)) remaining.push(board[index]);
          }
          while (remaining.length < height) remaining.push(flowers[Math.floor(Math.random() * flowers.length)]);
          for (let row = height - 1; row >= 0; row--) board[row * width + col] = remaining[height - 1 - row];
        }
        cascade++;
        cleared = findMatches(board);
      }
      return cascade;
    }
    board = createPlayableBoard();
    draw();
    area.addEventListener("click", (event) => {
      const tile = event.target.closest("[data-index]");
      if (!tile || gameOver) return;
      const index = Number(tile.dataset.index);
      if (selected < 0) { selected = index; draw(); return; }
      if (selected === index) {
        selected = -1;
        draw();
        return;
      }
      const adjacent = Math.abs(selected - index) === width || (Math.floor(selected / width) === Math.floor(index / width) && Math.abs(selected - index) === 1);
      if (adjacent) {
        [board[selected], board[index]] = [board[index], board[selected]];
        if (findMatches(board).size) {
          movesLeft--;
          const cascades = resolveMatches();
          modalContent.querySelector(".garden-petals").textContent = String(petals);
          modalContent.querySelector(".garden-moves").textContent = String(movesLeft);
          draw();
          if (petals >= targetPetals) finish(`Garden grown! You collected ${petals} petals with ${movesLeft} moves left.`);
          else if (movesLeft === 0) finish(`Out of moves! You collected ${petals} of ${targetPetals} petals. Restart to try again.`);
          else if (!hasLegalMove(board)) {
            board = createPlayableBoard();
            selected = -1;
            modalContent.querySelector("p").textContent = `No moves left, so the garden reshuffled. ${cascades > 1 ? `Chain reaction x${cascades}!` : "Keep matching!"}`;
            draw();
          } else {
            modalContent.querySelector("p").textContent = cascades > 1 ? `Chain reaction x${cascades}! You earned ${petals} petals so far.` : "Lovely match! Keep growing your garden.";
          }
        } else {
          [board[selected], board[index]] = [board[index], board[selected]];
          modalContent.querySelector("p").textContent = "That swap doesn't make four. Try a neighboring flower.";
        }
      }
      selected = -1; draw();
    });
  }
}

function renderSimon() {
  modalIntro("Watch the quick color sequence, then repeat it exactly. Each round adds another color.", "Show me the sequence", start);
  function start() {
    let sequence = [];
    let turn = 0;
    const colors = ["coral", "mint", "sky", "gold"];
    modalContent.innerHTML = '<div class="modal-score">Level: <span>1</span></div><div class="simon-grid"></div><p>Watch, then repeat the pattern.</p><button class="game-action">Play sequence</button>';
    const board = modalContent.querySelector(".simon-grid");
    board.innerHTML = colors.map((color, i) => `<button class="simon-pad ${color}" data-pad="${i}" aria-label="Color ${i + 1}"></button>`).join("");
    function showSequence() {
      turn = 0;
      sequence.push(Math.floor(Math.random() * 4));
      modalContent.querySelector(".modal-score span").textContent = String(sequence.length);
      modalContent.querySelector("p").textContent = "Watch the colors…";
      board.querySelectorAll("button").forEach((button) => { button.disabled = true; });
      sequence.forEach((pad, index) => scheduleGameTimeout(() => {
        board.children[pad].classList.add("lit");
        scheduleGameTimeout(() => {
          board.children[pad].classList.remove("lit");
          if (index === sequence.length - 1) {
            modalContent.querySelector("p").textContent = "Your turn!";
            board.querySelectorAll("button").forEach((button) => { button.disabled = false; });
          }
        }, 210);
      }, index * 390));
    }
    board.addEventListener("click", (event) => {
      const pad = event.target.closest("[data-pad]");
      if (!pad || pad.disabled) return;
      if (Number(pad.dataset.pad) !== sequence[turn]) {
        modalContent.querySelector("p").textContent = `Oops! You reached level ${sequence.length}. Start a new sequence to try again.`;
        board.querySelectorAll("button").forEach((button) => { button.disabled = true; });
        return;
      }
      turn++;
      if (turn === sequence.length) { modalContent.querySelector("p").textContent = "Perfect! Watch the next one."; scheduleGameTimeout(showSequence, 650); }
    });
    modalContent.querySelector(".game-action").addEventListener("click", showSequence);
  }
}

function renderSlice() {
  modalIntro("Slice the fruit as it flashes past, avoid the frequent bombs, and try to last 20 seconds.", "Start slicing", start);
  function start() {
    let score = 0;
    let seconds = 20;
    let ended = false;
    let clock;
    modalContent.innerHTML = '<div class="modal-score">Fruit: <span class="slice-score">0</span> · Time: <span class="slice-time">20</span>s</div><div class="slice-board"></div><p>Slice fruit with a click. Avoid the bomb!</p>';
    const board = modalContent.querySelector(".slice-board");
    function spawn() {
      if (seconds <= 0 || ended) return;
      const bomb = Math.random() < .32;
      const button = document.createElement("button");
      button.className = `slice-item ${bomb ? "bomb" : ""}`;
      button.textContent = bomb ? "💣" : ["🍓", "🍊", "🍉", "🍍"][Math.floor(Math.random() * 4)];
      button.style.left = `${5 + Math.random() * 82}%`;
      button.style.top = `${10 + Math.random() * 72}%`;
      board.append(button);
      button.addEventListener("click", () => {
        if (bomb) {
          ended = true;
          clearInterval(gameTimer);
          clearInterval(clock);
          modalContent.querySelector("p").textContent = `Boom! You sliced ${score} fruit. Start a new round to try again.`;
          board.querySelectorAll("button").forEach((item) => { item.disabled = true; });
        } else {
          score++;
          button.remove();
          modalContent.querySelector(".slice-score").textContent = String(score);
        }
      });
      scheduleGameTimeout(() => button.remove(), 1300);
    }
    spawn();
    gameTimer = setInterval(spawn, 420);
    clock = setInterval(() => {
      seconds--;
      if (modal.hidden || ended || seconds <= 0) {
        clearInterval(clock);
        clearInterval(gameTimer);
        if (!modal.hidden && !ended) modalContent.querySelector("p").textContent = `Time! You sliced ${score} fruit. Start another round to beat your score.`;
      }
      if (!modal.hidden && !ended) modalContent.querySelector(".slice-time").textContent = String(Math.max(0, seconds));
    }, 1000);
    additionalGameTimers.push(clock);
  }
}

function renderDodge() {
  modalIntro("The shadows switch lanes quickly. Dodge them with the arrow keys or lane buttons.", "Run!", start);
  function start() {
    let lane = 1, score = 0, obstacle = Math.floor(Math.random() * 4);
    modalContent.innerHTML = '<div class="modal-score">Distance: <span>0</span></div><div class="dodge-track"><div class="dodge-obstacle"></div><div class="dodge-runner">🏃</div></div><div class="mini-controls"></div><p>Dodge the falling block.</p>';
    const runner = modalContent.querySelector(".dodge-runner");
    const block = modalContent.querySelector(".dodge-obstacle");
    const controls = modalContent.querySelector(".mini-controls");
    controls.innerHTML = [0, 1, 2, 3].map((n) => `<button class="mini-control" data-lane="${n}">${n + 1}</button>`).join("");
    function draw() {
      runner.style.left = `${12.5 + lane * 25}%`;
      block.style.left = `${12.5 + obstacle * 25}%`;
      modalContent.querySelector(".modal-score span").textContent = String(score);
    }
    function step() {
      if (lane === obstacle) {
        clearInterval(gameTimer);
        modalContent.querySelector("p").textContent = `Shadow caught you at ${score}m. Try another run!`;
        return;
      }
      score++;
      obstacle = Math.floor(Math.random() * 4);
      draw();
    }
    controls.addEventListener("click", (event) => { if (event.target.dataset.lane) { lane = Number(event.target.dataset.lane); draw(); } });
    gameKeyHandler = (event) => {
      if (event.key === "ArrowLeft") lane = Math.max(0, lane - 1);
      if (event.key === "ArrowRight") lane = Math.min(3, lane + 1);
      draw();
    };
    document.addEventListener("keydown", gameKeyHandler);
    draw();
    gameTimer = setInterval(step, 520);
  }
}

function renderWord() {
  const words = ["STARLIGHT", "GAMEBOARD", "CHALLENGE", "NIGHTFALL", "PIXELATED", "ADVENTURE"];
  let word = "";
  let score = 0;
  modalIntro("Unscramble the letters before time runs out. Each word solved earns a point.", "Start word mix", start);
  function start() {
    score = 0;
    let seconds = 15;
    modalContent.innerHTML = '<div class="modal-score">Solved: <span>0</span> · Time: <span class="word-time">15</span>s</div><div class="scramble-word"></div><div class="input-row"><input class="game-input" maxlength="12" placeholder="Type the word" aria-label="Unscrambled word" /><button class="game-action">Check</button></div><p>Unscramble the word before time runs out.</p>';
    const input = modalContent.querySelector(".game-input");
    function next() {
      word = words[Math.floor(Math.random() * words.length)];
      const letters = word.split("").sort(() => Math.random() - .5).join("");
      modalContent.querySelector(".scramble-word").textContent = letters === word ? `${letters.slice(1)}${letters[0]}` : letters;
      input.value = "";
      input.focus();
    }
    function check() {
      if (input.value.trim().toUpperCase() === word) {
        score++;
        modalContent.querySelector(".modal-score span").textContent = String(score);
        modalContent.querySelector("p").textContent = "That's it! Here's another.";
        next();
      } else modalContent.querySelector("p").textContent = "Not quite. Give it another try!";
    }
    modalContent.querySelector(".game-action").addEventListener("click", check);
    input.addEventListener("keydown", (event) => { if (event.key === "Enter") check(); });
    next();
    gameTimer = setInterval(() => {
      seconds--;
      modalContent.querySelector(".word-time").textContent = String(seconds);
      if (seconds <= 0) { clearInterval(gameTimer); input.disabled = true; modalContent.querySelector("p").textContent = `Time! You solved ${score} words.`; }
    }, 1000);
  }
}

function renderBubbles() {
  modalIntro("Pop all 12 bubbles in ascending order. One wrong pop resets the whole chain!", "Blow bubbles", start);
  function start() {
    let next = 1;
    const values = Array.from({ length: 12 }, (_, i) => i + 1).sort(() => Math.random() - .5);
    modalContent.innerHTML = '<div class="modal-score">Pop order: <span>1</span> → 12</div><div class="bubble-field"></div><p>Pop each bubble from 1 to 12.</p>';
    const field = modalContent.querySelector(".bubble-field");
    field.innerHTML = values.map((value) => `<button class="number-bubble" data-number="${value}">${value}</button>`).join("");
    field.addEventListener("click", (event) => {
      const bubble = event.target.closest("[data-number]");
      if (!bubble) return;
      if (Number(bubble.dataset.number) === next) {
        bubble.disabled = true;
        bubble.classList.add("popped");
        next++;
        modalContent.querySelector(".modal-score span").textContent = String(next);
        if (next === 13) modalContent.querySelector("p").textContent = "Lovely chain! You popped them all in order.";
      } else {
        next = 1;
        field.querySelectorAll("button").forEach((item) => { item.disabled = false; item.classList.remove("popped"); });
        modalContent.querySelector(".modal-score span").textContent = "1";
        modalContent.querySelector("p").textContent = "Pop order reset. Start again from 1!";
      }
    });
  }
}

function renderRps() {
  modalIntro("Challenge the tiny mage to rock, paper, scissors. The mage learns your favorite move. First to three wins.", "Challenge the mage", start);
  function start() {
    const choices = ["🪨", "📄", "✂️"];
    const names = ["Rock", "Paper", "Scissors"];
    let player = 0, mage = 0;
    const playerChoices = [0, 0, 0];
    modalContent.innerHTML = '<div class="modal-score">You <span>0</span> — 0 Mage</div><div class="mini-controls"></div><p>First to two wins the duel!</p>';
    const controls = modalContent.querySelector(".mini-controls");
    controls.innerHTML = choices.map((choice, i) => `<button class="mini-control rps-choice" data-choice="${i}">${choice} ${names[i]}</button>`).join("");
    modalContent.querySelector("p").textContent = "First to three wins. The mage adapts to your choices!";
    controls.addEventListener("click", (event) => {
      const item = event.target.closest("[data-choice]");
      if (!item || player === 3 || mage === 3) return;
      const a = Number(item.dataset.choice);
      playerChoices[a]++;
      const favorite = playerChoices.indexOf(Math.max(...playerChoices));
      const b = Math.random() < .7 ? (favorite + 1) % 3 : Math.floor(Math.random() * 3);
      if (a !== b) {
        if ((a - b + 3) % 3 === 1) player++;
        else mage++;
      }
      modalContent.querySelector(".modal-score").innerHTML = `You <span>${player}</span> — ${mage} Mage · First to 3`;
      const line = a === b ? "A draw!" : (a - b + 3) % 3 === 1 ? `${names[a]} beats ${names[b]} — you win this round!` : `${names[b]} beats ${names[a]} — the mage wins this round!`;
      modalContent.querySelector("p").textContent = player === 3 || mage === 3 ? `${line} ${player > mage ? "You won the duel!" : "The mage won this time!"}` : line;
    });
  }
}

function renderBowling() {
  modalIntro("Choose a lane and bowl three frames. The closer to center, the more pins you knock down!", "Take your turn", start);
  function start() {
    let frame = 0, total = 0;
    modalContent.innerHTML = '<div class="modal-score">Pins: <span>0</span> · Frame 1 / 3</div><div class="bowling-lane"><span class="pins">🎳</span><span class="ball">●</span></div><div class="mini-controls"></div><p>Choose your aim: left, center, or right.</p>';
    const choices = modalContent.querySelector(".mini-controls");
    choices.innerHTML = ["Left", "Center", "Right"].map((aim, i) => `<button class="mini-control" data-aim="${i}">${aim}</button>`).join("");
    choices.addEventListener("click", (event) => {
      const button = event.target.closest("[data-aim]");
      if (!button || frame >= 3) return;
      frame++;
      const aim = Number(button.dataset.aim);
      const pins = Math.max(0, Math.min(10, 10 - Math.abs(1 - aim) * 5 - Math.floor(Math.random() * 6)));
      total += pins;
      modalContent.querySelector(".modal-score").innerHTML = `Pins: <span>${total}</span> · Frame ${Math.min(frame + 1, 3)} / 3`;
      modalContent.querySelector(".pins").textContent = pins === 10 ? "✨ Strike!" : `${"🎳".repeat(Math.max(1, Math.ceil(pins / 4)))}`;
      modalContent.querySelector("p").textContent = frame === 3 ? `Game over! ${total} pins in three frames.` : `${pins} pins! Aim for your next frame.`;
    });
  }
}

function renderTyping() {
  const phrases = ["quickly memorize every glowing constellation", "careful players conquer challenging games", "bright stars shimmer across the midnight sky", "precision and practice make perfect players"];
  modalIntro("Type the long phrase exactly, including spaces, before the 12-second timer runs out.", "Start typing", start);
  function start() {
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    let seconds = 12, started = false;
    modalContent.innerHTML = `<div class="modal-score">Time: <span>12</span>s · Accuracy: <span class="accuracy">100%</span></div><blockquote class="typing-phrase">${phrase}</blockquote><input class="game-input typing-input" aria-label="Type the phrase" placeholder="Start typing here…" /><p>Type the phrase exactly.</p>`;
    const input = modalContent.querySelector(".typing-input");
    input.focus();
    input.addEventListener("input", () => {
      if (!started) {
        started = true;
        gameTimer = setInterval(() => {
          seconds--;
          modalContent.querySelector(".modal-score span").textContent = String(seconds);
          if (seconds <= 0) { clearInterval(gameTimer); input.disabled = true; modalContent.querySelector("p").textContent = "Time's up! Start another phrase for a new run."; }
        }, 1000);
      }
      const correct = [...input.value].filter((letter, i) => letter === phrase[i]).length;
      modalContent.querySelector(".accuracy").textContent = `${input.value ? Math.round(correct / input.value.length * 100) : 100}%`;
      if (input.value === phrase) {
        clearInterval(gameTimer);
        modalContent.querySelector("p").textContent = "Perfect typing! You got every character.";
      }
    });
  }
}

function renderShooter() {
  modalIntro("Defend your rocket! Meteors fall fast, and three misses end the mission. Click quickly!", "Launch!", start);
  function start() {
    let hits = 0, misses = 0, x = 30, ended = false;
    modalContent.innerHTML = '<div class="modal-score">Meteors: <span>0</span> · Misses: <span class="misses">0</span></div><div class="shooter-board"><span class="rocket">🚀</span><button class="meteor">☄️</button></div><p>Click the meteor to blast it.</p>';
    const meteor = modalContent.querySelector(".meteor");
    function move() {
      x = Math.random() * 82;
      meteor.style.left = `${x}%`;
      meteor.style.top = "8%";
      meteor.dataset.hit = "false";
    }
    meteor.addEventListener("click", () => {
      if (ended || meteor.dataset.hit === "true") return;
      meteor.dataset.hit = "true";
      hits++;
      modalContent.querySelector(".modal-score span").textContent = String(hits);
      meteor.textContent = "💥";
      scheduleGameTimeout(() => { meteor.textContent = "☄️"; move(); }, 320);
    });
    gameTimer = setInterval(() => {
      const top = Number.parseFloat(meteor.style.top || "8");
      if (top > 76) {
        if (meteor.dataset.hit !== "true") {
          misses++;
          modalContent.querySelector(".misses").textContent = String(misses);
        }
        if (misses >= 3) {
          ended = true;
          clearInterval(gameTimer);
          meteor.disabled = true;
          modalContent.querySelector("p").textContent = `Rocket down! You blasted ${hits} meteors. Launch another mission!`;
        } else move();
      } else meteor.style.top = `${top + 8}%`;
    }, 130);
    move();
  }
}

function renderCafe() {
  const ingredients = ["☕", "🥛", "🍯", "🍋", "🍫", "🍵"];
  modalIntro("Memorize each five-ingredient order and make it before the 8-second timer runs out.", "Open the cafe", start);
  function start() {
    let score = 0, order = [], step = 0, seconds = 8, ended = false;
    modalContent.innerHTML = '<div class="modal-score">Happy customers: <span>0</span> · Time: <span class="cafe-time">8</span>s</div><p class="cafe-order"></p><div class="mini-controls cafe-controls"></div><p class="cafe-status">Add ingredients in order!</p>';
    const controls = modalContent.querySelector(".cafe-controls");
    controls.innerHTML = ingredients.map((item) => `<button class="mini-control" data-ingredient="${item}">${item}</button>`).join("");
    function showOrder() {
      order = [...ingredients].sort(() => Math.random() - .5).slice(0, 5);
      seconds = 8;
      step = 0;
      modalContent.querySelector(".cafe-order").textContent = `Order: ${order.join("  →  ")}`;
      modalContent.querySelector(".cafe-time").textContent = String(seconds);
    }
    showOrder();
    controls.addEventListener("click", (event) => {
      const button = event.target.closest("[data-ingredient]");
      if (!button || ended) return;
      if (button.dataset.ingredient !== order[step]) {
        step = 0;
        modalContent.querySelector(".cafe-status").textContent = "Wrong ingredient! Start the order again.";
        return;
      }
      step++;
      if (step === order.length) {
        score++;
        modalContent.querySelector(".modal-score span").textContent = String(score);
        modalContent.querySelector(".cafe-status").textContent = "Perfect cup! Here's the next order.";
        showOrder();
      }
    });
    gameTimer = setInterval(() => {
      seconds--;
      modalContent.querySelector(".cafe-time").textContent = String(seconds);
      if (seconds <= 0) {
        ended = true;
        clearInterval(gameTimer);
        controls.querySelectorAll("button").forEach((button) => { button.disabled = true; });
        modalContent.querySelector(".cafe-status").textContent = `Time! You served ${score} customers. Restart to try again.`;
      }
    }, 1000);
  }
}

function renderMines() {
  modalIntro("Reveal all 18 safe tiles without uncovering one of the seven hidden mines. Numbers hint at danger!", "Explore the grid", start);
  function start() {
    const mines = new Set();
    while (mines.size < 7) mines.add(Math.floor(Math.random() * 25));
    let revealed = new Set();
    let gameOver = false;
    modalContent.innerHTML = '<div class="modal-score">Safe tiles: <span>0</span> / 18</div><div class="mine-grid"></div><p>Find all the safe tiles.</p>';
    const board = modalContent.querySelector(".mine-grid");
    function draw() {
      board.innerHTML = Array.from({ length: 25 }, (_, i) => `<button class="mine-tile ${revealed.has(i) ? "revealed" : ""}" data-cell="${i}" ${gameOver ? "disabled" : ""}>${revealed.has(i) ? (mines.has(i) ? "💣" : neighborCount(i) || "·") : ""}</button>`).join("");
    }
    function neighborCount(index) {
      const row = Math.floor(index / 5), col = index % 5;
      let total = 0;
      for (let r = row - 1; r <= row + 1; r++) for (let c = col - 1; c <= col + 1; c++) if (r >= 0 && c >= 0 && r < 5 && c < 5 && mines.has(r * 5 + c)) total++;
      return total;
    }
    board.addEventListener("click", (event) => {
      const tile = event.target.closest("[data-cell]");
      if (!tile || gameOver || revealed.has(Number(tile.dataset.cell))) return;
      const index = Number(tile.dataset.cell);
      revealed.add(index);
      if (mines.has(index)) {
        gameOver = true;
        modalContent.querySelector("p").textContent = "Boom! You found a mine. Start a fresh grid and try again.";
        board.classList.add("game-over");
        mines.forEach((mine) => revealed.add(mine));
      } else {
        modalContent.querySelector(".modal-score span").textContent = String(revealed.size);
        if (revealed.size === 18) {
          gameOver = true;
          modalContent.querySelector("p").textContent = "Grid cleared! You found every safe tile.";
          board.classList.add("game-over");
        }
      }
      draw();
    });
    draw();
  }
}

function renderConnect() {
  modalIntro("Connect all 10 numbered lunar beacons in order. Don't jump over a number or cross your trail.", "Start the orbit", start);
  function start() {
    let next = 1;
    const positions = [[12, 20], [50, 11], [83, 24], [72, 72], [35, 83], [18, 54], [28, 37], [61, 43], [48, 65], [9, 78]];
    let complete = false;
    modalContent.innerHTML = '<div class="modal-score">Beacon: <span>1</span> / 10</div><div class="orbit-board"></div><p>Connect beacons 1 through 10.</p>';
    const board = modalContent.querySelector(".orbit-board");
    board.innerHTML = positions.map(([x, y], i) => `<button class="orbit-node" style="left:${x}%;top:${y}%" data-node="${i + 1}">${i + 1}</button>`).join("");
    const nodes = [...board.querySelectorAll(".orbit-node")];
    board.addEventListener("click", (event) => {
      const node = event.target.closest("[data-node]");
      if (!node || complete) return;
      if (Number(node.dataset.node) === next) {
        node.classList.add("connected");
        if (next > 1) {
          const previous = nodes[next - 2].getBoundingClientRect();
          const current = node.getBoundingClientRect();
          const parent = board.getBoundingClientRect();
          const line = document.createElement("i");
          const x1 = previous.left + previous.width / 2 - parent.left, y1 = previous.top + previous.height / 2 - parent.top;
          const x2 = current.left + current.width / 2 - parent.left, y2 = current.top + current.height / 2 - parent.top;
          line.className = "orbit-line";
          line.style.left = `${x1}px`; line.style.top = `${y1}px`;
          line.style.width = `${Math.hypot(x2 - x1, y2 - y1)}px`;
          line.style.transform = `rotate(${Math.atan2(y2 - y1, x2 - x1)}rad)`;
          board.prepend(line);
        }
        next++;
        modalContent.querySelector(".modal-score span").textContent = String(Math.min(next, 10));
        if (next === 11) {
          complete = true;
          modalContent.querySelector("p").textContent = "A perfect orbit! All 10 beacons connected.";
        }
      } else modalContent.querySelector("p").textContent = "Follow the numbers in order. Try the next beacon!";
    });
  }
}

function renderWhack() {
  modalIntro("Catch the cheeky panda as it jumps between holes every 400 ms. You only have 8 seconds!", "Play whack-a-panda", start);
  function start() {
    let score = 0, seconds = 8, active = -1;
    modalContent.innerHTML = '<div class="modal-score">Pandas: <span>0</span> · Time: <span class="whack-time">8</span>s</div><div class="whack-grid"></div><p>Tap the panda!</p>';
    const board = modalContent.querySelector(".whack-grid");
    board.innerHTML = Array.from({ length: 9 }, (_, i) => `<button class="whack-hole" data-hole="${i}" aria-label="Hole ${i + 1}">·</button>`).join("");
    function pop() {
      active = Math.floor(Math.random() * 9);
      board.querySelectorAll("button").forEach((button) => { button.classList.toggle("panda-up", Number(button.dataset.hole) === active); button.textContent = Number(button.dataset.hole) === active ? "🐼" : "·"; });
    }
    board.addEventListener("click", (event) => {
      const hole = event.target.closest("[data-hole]");
      if (hole && Number(hole.dataset.hole) === active) {
        score++;
        modalContent.querySelector(".modal-score span").textContent = String(score);
        pop();
      }
    });
    pop();
    gameTimer = setInterval(() => {
      seconds--;
      modalContent.querySelector(".whack-time").textContent = String(seconds);
      if (seconds <= 0) {
        clearInterval(gameTimer);
        active = -1;
        board.querySelectorAll("button").forEach((button) => { button.textContent = "·"; button.classList.remove("panda-up"); });
        modalContent.querySelector("p").textContent = `Time! You caught ${score} pandas. Play again to beat your score.`;
      } else pop();
    }, 1000);
    const popTimer = setInterval(() => { if (seconds > 0) pop(); }, 400);
    additionalGameTimers.push(popTimer);
  }
}

function renderBreaker() {
  modalIntro("Power up the circuit by lighting every node. Click a node to flip it and its neighbors.", "Restore power", start);
  function start() {
    const boardValues = Array(9).fill(true);
    function flip(index) {
      [index, index - 3, index + 3, ...(index % 3 ? [index - 1] : []), ...(index % 3 < 2 ? [index + 1] : [])]
        .filter((neighbor) => neighbor >= 0 && neighbor < 9)
        .forEach((neighbor) => { boardValues[neighbor] = !boardValues[neighbor]; });
    }
    [0, 2, 4, 7].forEach(flip);
    let moves = 0, gameOver = false;
    modalContent.innerHTML = '<div class="modal-score">Lights on: <span>0</span> / 9 · Moves: <span class="breaker-moves">0</span> / 5</div><div class="breaker-grid"></div><p>Restore every light in five moves or fewer.</p>';
    const board = modalContent.querySelector(".breaker-grid");
    function draw() {
      board.innerHTML = boardValues.map((on, i) => `<button class="breaker-node ${on ? "on" : ""}" data-node="${i}" aria-label="Circuit node ${i + 1}" ${gameOver ? "disabled" : ""}>${on ? "⚡" : "○"}</button>`).join("");
      modalContent.querySelector(".modal-score span").textContent = String(boardValues.filter(Boolean).length);
    }
    board.addEventListener("click", (event) => {
      const item = event.target.closest("[data-node]");
      if (!item || gameOver) return;
      const i = Number(item.dataset.node);
      moves++;
      flip(i);
      draw();
      modalContent.querySelector(".breaker-moves").textContent = String(moves);
      if (boardValues.every(Boolean)) {
        gameOver = true;
        modalContent.querySelector("p").textContent = moves <= 5 ? `Power restored in ${moves} moves!` : "All circuits are online.";
        draw();
      } else if (moves >= 5) {
        gameOver = true;
        modalContent.querySelector("p").textContent = "The move limit is up. Restart and try a different sequence.";
        draw();
      }
    });
    draw();
  }
}

function renderConnect4() {
  modalIntro("Drop discs into a column. Connect four in a row before the computer does!", "Start a match", start);
  function start() {
    let boardState = Array.from({ length: 6 }, () => Array(7).fill(""));
    let done = false;
    modalContent.innerHTML = '<div class="modal-score">You are violet · Get four in a row</div><div class="connect4-board"></div><p>Choose a column to drop your disc.</p>';
    const board = modalContent.querySelector(".connect4-board");
    function draw() {
      board.innerHTML = boardState.map((row, r) => row.map((cell, c) => `<button class="connect4-cell ${cell}" data-column="${c}" data-row="${r}" aria-label="Row ${r + 1}, column ${c + 1}"></button>`).join("")).join("");
    }
    function winner() {
      for (let r = 0; r < 6; r++) for (let c = 0; c < 7; c++) {
        const color = boardState[r][c];
        if (color && [[0, 1], [1, 0], [1, 1], [1, -1]].some(([dr, dc]) => [1, 2, 3].every((n) => boardState[r + dr * n]?.[c + dc * n] === color))) return color;
      }
      return "";
    }
    board.addEventListener("click", (event) => {
      const cell = event.target.closest("[data-column]");
      if (!cell || done) return;
      const col = Number(cell.dataset.column);
      let row = 5;
      while (row >= 0 && boardState[row][col]) row--;
      if (row < 0) return;
      boardState[row][col] = "violet";
      let result = winner();
      if (!result) {
        const open = boardState[0].map((value, i) => value ? -1 : i).filter((i) => i >= 0);
        if (open.length) {
          const cpuCol = open[Math.floor(Math.random() * open.length)];
          let cpuRow = 5;
          while (cpuRow >= 0 && boardState[cpuRow][cpuCol]) cpuRow--;
          boardState[cpuRow][cpuCol] = "pink";
          result = winner();
        }
      }
      draw();
      if (result) {
        done = true;
        modalContent.querySelector("p").textContent = `${result === "violet" ? "You got four! Nice win." : "The computer connected four."} Start a new match to play again.`;
      }
    });
    modalContent.insertAdjacentHTML("beforeend", '<button class="game-action">New match</button>');
    modalContent.querySelector(".game-action").addEventListener("click", start);
    draw();
  }
}

function renderFlappy() {
  modalIntro("Tap, press Space, or use the flap button to guide the cloud through narrow gaps. Time each flap carefully.", "Take off", start);
  function start() {
    let height = 82, velocity = 0, gateX = 330, gapTop = 42, gapSize = 76, score = 0, ended = false, passedGate = false;
    modalContent.innerHTML = '<div class="modal-score">Gates passed: <span>0</span> · Press Space or flap</div><div class="flappy-board" aria-label="Cloud Nine game board"><span class="flappy-cloud">☁️</span><span class="flappy-gate"><i class="flappy-pipe-top"></i><i class="flappy-pipe-bottom"></i></span></div><button class="game-action flap-button">Flap!</button><p>Keep the cloud in the sky.</p>';
    const board = modalContent.querySelector(".flappy-board");
    const cloud = modalContent.querySelector(".flappy-cloud");
    const gate = modalContent.querySelector(".flappy-gate");
    const flap = () => { if (!ended) velocity = -4; };
    modalContent.querySelector(".flap-button").addEventListener("click", flap);
    board.addEventListener("pointerdown", flap);
    gameKeyHandler = (event) => { if (event.code === "Space" && !modal.hidden) { event.preventDefault(); flap(); } };
    document.addEventListener("keydown", gameKeyHandler);
    gameTimer = setInterval(() => {
      const boardHeight = board.clientHeight;
      const cloudHeight = cloud.offsetHeight;
      const cloudLeft = cloud.offsetLeft;
      const cloudWidth = cloud.offsetWidth;
      velocity += .24;
      height += velocity;
      gateX -= 2.2;
      if (gateX + gate.offsetWidth <= cloudLeft && !passedGate) {
        passedGate = true;
        score++;
        modalContent.querySelector(".modal-score span").textContent = String(score);
      }
      if (gateX < -gate.offsetWidth) {
        gateX = board.clientWidth;
        gapSize = 76;
        gapTop = 22 + Math.random() * Math.max(0, boardHeight - gapSize - 44);
        passedGate = false;
      }
      cloud.style.top = `${height}px`;
      gate.style.left = `${gateX}px`;
      gate.querySelector(".flappy-pipe-top").style.height = `${gapTop}px`;
      gate.querySelector(".flappy-pipe-bottom").style.top = `${gapTop + gapSize}px`;
      const overlapsGate = gateX < cloudLeft + cloudWidth && gateX + gate.offsetWidth > cloudLeft;
      const insideGap = height >= gapTop && height + cloudHeight <= gapTop + gapSize;
      if (height < 0 || height + cloudHeight > boardHeight || (overlapsGate && !insideGap)) {
        ended = true;
        clearInterval(gameTimer);
        modalContent.querySelector("p").textContent = `Cloud down! You passed ${score} gates. Press Restart to try again.`;
      }
    }, 40);
  }
}

let featuredIndex = 0;
const featuredCarousel = document.querySelector("#featured-carousel");

function showFeaturedGame(index) {
  featuredIndex = (index + featuredGames.length) % featuredGames.length;
  const featured = featuredGames[featuredIndex];
  const game = games.find((item) => item.id === featured.id);
  if (!game) return;
  featuredCarousel.dataset.theme = game.art;
  document.querySelector("#featured-title").textContent = game.title;
  document.querySelector("#featured-description").textContent = featured.description;
  document.querySelector("#featured-emoji").textContent = game.emoji;
  document.querySelector("#featured-play").innerHTML = `Play ${game.title} <span>↗</span>`;
  document.querySelector("#featured-index").textContent = String(featuredIndex + 1).padStart(2, "0");
  document.querySelectorAll(".pager-dot").forEach((dot, dotIndex) => {
    const active = dotIndex === featuredIndex;
    dot.classList.toggle("pager-current", active);
    if (active) dot.setAttribute("aria-current", "true");
    else dot.removeAttribute("aria-current");
  });
}

document.querySelector(".hero-previous").addEventListener("click", () => showFeaturedGame(featuredIndex - 1));
document.querySelector(".hero-next").addEventListener("click", () => showFeaturedGame(featuredIndex + 1));
document.querySelectorAll(".pager-dot").forEach((dot) => {
  dot.addEventListener("click", () => showFeaturedGame(Number(dot.dataset.slide)));
});
document.querySelector("#featured-play").addEventListener("click", () => {
  const featured = featuredGames[featuredIndex];
  openGame(games.find((game) => game.id === featured.id));
});
document.addEventListener("keydown", (event) => {
  if (!modal.hidden || !accountModal.hidden || ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    showFeaturedGame(featuredIndex - 1);
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    showFeaturedGame(featuredIndex + 1);
  }
});

updateLibraryCount();
updatePlayerName();
renderGames();
showFeaturedGame(featuredIndex);

const installButton = document.querySelector("#install-button");
let installPrompt;

function isAppInstalled() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

function updateInstallButton() {
  installButton.hidden = isAppInstalled();
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installPrompt = event;
  updateInstallButton();
});

window.addEventListener("appinstalled", () => {
  installPrompt = null;
  updateInstallButton();
  showToast("GameHub has been installed.");
});

installButton.addEventListener("click", async () => {
  if (!installPrompt) {
    showToast("To install, use your browser menu and choose Install GameHub or Add to Home Screen.");
    return;
  }

  const promptEvent = installPrompt;
  installPrompt = null;
  await promptEvent.prompt();
  const { outcome } = await promptEvent.userChoice;
  if (outcome === "accepted") updateInstallButton();
});

updateInstallButton();

if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((error) => {
      console.error("Could not register the GameHub service worker.", error);
      showToast("Offline support couldn't start. Try reloading the page.");
    });
  });
}
