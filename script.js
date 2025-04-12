let flippedCards = [];
const cards = ['0️⃣','1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣'];
let deck = [...cards, ...cards];
let matched = [];
let lock = false;

const gameBoard = document.getElementById("game");
const timerDisplay = document.getElementById("timer");
const asciiWin = document.getElementById("ascii-win");

const specialSymbols = {
  "5️⃣": "circle-red",
  "8️⃣": "circle-blue",
  "9️⃣": "circle-yellow",
  "1️⃣": "circle-green"
};

let timeLeft = 300;
let timerInterval = setInterval(updateTimer, 1000);

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function renderBoard() {
  shuffle(deck);
  gameBoard.innerHTML = "";
  deck.forEach((symbol, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.symbol = symbol;
    card.dataset.index = index;
    card.addEventListener("click", () => flipCard(card));
    gameBoard.appendChild(card);
  });
}

function flipCard(card) {
    if (lock || card.classList.contains("matched") || flippedCards.includes(card)) return;
    card.innerText = card.dataset.symbol;
    flippedCards.push(card);
    if (flippedCards.length === 2) {
        lock = true;
        const [first, second] = flippedCards;
        if (first.dataset.symbol === second.dataset.symbol) {
            first.classList.add("matched");
            second.classList.add("matched");
            matched.push(first.dataset.index, second.dataset.index);
            checkSpecialSymbol(first.dataset.symbol);
            flippedCards = [];
            lock = false;
            if (matched.length === deck.length) {
                clearInterval(timerInterval);
                showWin();
            }
        } else {
            setTimeout(() => {
                first.innerText = "";
                second.innerText = "";
                flippedCards = [];
                lock = false;
                timeLeft -= 5; // Reduzir 5 segundos do tempo restante
                if (timeLeft < 0) {
                    timeLeft = 0; // Evitar tempo negativo
                }
            }, 1000);
        }
    }
}

function checkSpecialSymbol(symbol) {
  if (specialSymbols[symbol]) {
    const lightId = specialSymbols[symbol];
    document.getElementById(lightId).classList.add("active");

    document.querySelectorAll(`.card[data-symbol='${symbol}']`).forEach(card => {
      if (card.classList.contains("matched")) {
        card.classList.add("highlight");
      }
    });
  }
}

function updateTimer() {
  const min = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const sec = (timeLeft % 60).toString().padStart(2, "0");
  timerDisplay.innerText = `Tempo: ${min}:${sec}`;
  if (timeLeft <= 0) {
    gameBoard.innerHTML = "<h2>Tempo Esgotado!</h2>";
    clearInterval(timerInterval);
  }
  timeLeft--;
}

function showWin() {
  asciiWin.classList.remove("hidden");
  asciiWin.innerText = `
................................................
:...........*%*=::::....-+....:*:.:.............
:.........+%%#=-::::............................
:........:@@%###-...............................
:........*@%*=:.................................
:.......=*++:..........:..:::...::::............
.......=*=:=-...:..........:::--:-:-=+++++***...
.....=+=-:-:..=**=--:..***+++++======++++#*#%%+.
:..+*+=-......**=:...:+#*#*++++=---=+==+*=*%@%+.
:..++........=*+=-..:+#%*=**=+===+*+*++**=#%%*..
............*@%%#*+++*#%###*+========+++++**=...
...........#@@@@%#*+**##*+**+==-=====+++=-+=....
..........=@@@@%%%#****%#***+==-=-=+=*++++-.....
..........*@@@@@%%##***##+#***=+=++*+++*+=......
..........+%@@@%%%%%#***####*=++++++=+++=.......
.......:::=%%%%%@@%#%###=####*+*+++++++.........
........:-=+###%%%%#%###%###****+*+-............
............:-+#%%%%#%#####*+-:.................
................................................
  
  Apenas iscas por aqui. Parece que 
  você não 
  consegue adivinhar 
  o que fazer com essa mensagem. 
  mas vou te dar uma dica. 
  as vezes quando as coisas estão difíceis. 
  podemos simplesmente refazer nossos passos. 
  a melhor forma de fazer isso é olhando para trás
   . de trás para frente. 
  refazendo nossos passos.
  consegue imaginar
  para onde olhar agora? `;
}


renderBoard();
updateTimer();