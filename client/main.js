const font = "Roboto Mono";

class CanvasManager {
  constructor(id) {
    this.canvas = document.getElementById(id);
    const fullSize = Math.min(window.innerWidth, window.innerHeight);
    this.margin = fullSize * 0.02;
    this.refSize = fullSize - 2 * this.margin;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight - 10;
    this.ctx = this.canvas.getContext("2d");
    this.lastDrawTimes = [Date.now()];
    const smallFontSize = this.getSmallFontSize();
    this.verySmallFont = (0.5 * smallFontSize).toFixed() + "px " + font;
    this.smallFont = smallFontSize.toFixed() + "px " + font;
    this.mediumFont = (1.5 * smallFontSize).toFixed() + "px " + font;
    this.bigFont = (2.5 * smallFontSize).toFixed() + "px " + font;
  }

  getSmallFontSize() {
    // text and textSize are references, they don't matter
    // but they affect the text size
    const text = "abcdefghijklmnopqrstuvwxyz";
    const textSize = 0.5 * this.refSize;
    let fontsize = 50;
    do {
      fontsize--;
      this.ctx.font = fontsize + "px " + font;
    } while (this.ctx.measureText(text).width > textSize);
    return fontsize;
  }

  drawTicksPerSecond() {
    this.lastDrawTimes.push(Date.now());
    this.lastDrawTimes = this.lastDrawTimes.slice(-10);
    const dt =
      this.lastDrawTimes[this.lastDrawTimes.length - 1] - this.lastDrawTimes[0];
    const tps = ((this.lastDrawTimes.length - 1) * 1000.0) / dt;
    const tpsStr = Math.round(tps).toFixed().padStart(3, " ");

    this.ctx.font = this.verySmallFont;
    this.ctx.textAlign = "end";
    this.ctx.textBaseline = "bottom";
    this.ctx.fillStyle = "white";
    this.ctx.fillText(
      "ticks/s: " + tpsStr,
      this.refSize + this.margin - 10,
      this.refSize + this.margin - 10
    );
  }

  drawLimits() {
    this.ctx.strokeStyle = "red";
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.setLineDash([5, 5]);
    this.ctx.moveTo(this.margin, this.margin);
    this.ctx.lineTo(this.margin + this.refSize, this.margin);
    this.ctx.lineTo(this.margin + this.refSize, this.margin + this.refSize);
    this.ctx.lineTo(this.margin, this.margin + this.refSize);
    this.ctx.lineTo(this.margin, this.margin);
    this.ctx.stroke();
  }

  drawScore(player) {
    this.ctx.font = this.smallFont;
    this.ctx.textAlign = "start";
    this.ctx.textBaseline = "hanging";
    this.ctx.fillStyle = "white";
    let scoreStr = player.score.toFixed().padStart(8, " ");
    this.ctx.fillText("Score: " + scoreStr, this.margin + 10, this.margin + 10);
  }

  drawPlayer(player) {
    const accSize = (0.05 * this.refSize) / maxDd;

    const playerSize = this.refSize * player.size;
    const x = player.x * this.refSize;
    const y = (1 - player.y) * this.refSize;

    // draw score
    if (player.is_me) {
      this.drawScore(player);
    }

    // draw acceleration line
    this.ctx.strokeStyle = "rgb(150, 150, 150)";

    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.setLineDash([]);
    this.ctx.moveTo(this.margin + x, this.margin + y);
    this.ctx.lineTo(
      this.margin + x - accSize * player.ddx,
      this.margin + y + accSize * player.ddy
    );
    this.ctx.stroke();

    // draw player
    this.ctx.beginPath();
    if (player.is_me) {
      this.ctx.fillStyle = "rgb(0, 255, 0)";
    } else if (!player.alive) {
      this.ctx.fillStyle = "rgb(50, 50, 50)";
    } else if (!player.fake) {
      this.ctx.fillStyle = "rgb(255, 0, 0)";
    } else {
      this.ctx.fillStyle = "rgb(255, 100, 0)";
    }

    this.strokeStyle = "black";
    this.ctx.arc(
      this.margin + x,
      this.margin + y,
      playerSize / 2,
      0,
      2 * Math.PI
    );
    this.ctx.stroke();
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.fillStyle = "black";
    this.ctx.arc(
      this.margin + x,
      this.margin + y,
      playerSize / 5,
      0,
      2 * Math.PI
    );
    this.ctx.fill();

    // draw player score
    this.ctx.font = this.verySmallFont;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "hanging";
    this.ctx.fillStyle = "white";
    let scoreStr = player.score.toFixed();
    this.ctx.fillText(scoreStr, this.margin + x, this.margin + y + playerSize);
  }

  drawInputRef(x, y) {
    if (x === null || y === null) {
      return;
    }

    this.ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    this.ctx.beginPath();
    this.ctx.arc(x, y, 0.02 * this.refSize, 0, 2 * Math.PI);
    this.ctx.fill();
  }

  drawGameOver() {
    this.ctx.font = this.bigFont;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "bottom";
    this.ctx.fillStyle = "red";
    this.ctx.fillText(
      "GAME OVER",
      this.margin + this.refSize / 2,
      this.margin + this.refSize / 2 - 5
    );

    this.ctx.font = this.smallFont;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "top";
    this.ctx.fillStyle = "white";
    this.ctx.fillText(
      "tap to retry",
      this.margin + this.refSize / 2,
      this.margin + this.refSize / 2 + 5
    );
  }

  drawError(text) {
    this.clear();
    this.ctx.font = this.mediumFont;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillStyle = "red";

    this.ctx.fillText(
      text.toUpperCase(),
      this.margin + this.refSize / 2,
      this.margin + this.refSize / 2 - 20
    );
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

class GameEngine {
  constructor(url, canvasId) {
    this.playerId = this.getPlayerId();
    this.inputRefX = null;
    this.inputRefY = null;
    this.gameIsOver = false;
    this.canvas = new CanvasManager(canvasId);

    this.sock = new WebSocket(url);

    this.sock.onopen = function () {
      this.onOpen();
    }.bind(this);

    this.sock.onclose = function (event) {
      this.onClose(event);
    }.bind(this);

    // Log errors
    this.sock.onerror = function (error) {
      this.onError(error);
    }.bind(this);

    // Log messages from the server
    this.sock.onmessage = function (e) {
      const msg = JSON.parse(e.data);
      this.onMessage(msg);
    }.bind(this);
  }

  getPlayerId() {
    if (window.localStorage.playerId === undefined) {
      function uuidv4() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
          /[xy]/g,
          function (c) {
            var r = (Math.random() * 16) | 0,
              v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
          }
        );
      }

      const id = uuidv4();
      console.log("new player ID: ", id);
      window.localStorage.playerId = id;
    }
    return window.localStorage.playerId;
  }

  clearInputRef() {
    this.inputRefX = null;
    this.inputRefY = null;
  }

  setInputRef(x, y) {
    this.inputRefX = x;
    this.inputRefY = y;
  }

  onOpen() {
    console.log("Starting communication");
    this.send({ command: { register: this.playerId } });
  }

  onClose(event) {
    console.log("Closing communication");
    if (event.reason) {
      this.canvas.drawError(event.reason);
    } else {
      this.canvas.drawError("CONNECTION CLOSED");
    }
  }

  onError(error) {
    console.error("WebSocket error", error);
    this.canvas.drawError("CONNECTION ERROR");
  }

  onMessage(msg) {
    if (msg.game_over) {
      this.gameOver();
      return;
    }

    this.canvas.clear();
    this.canvas.drawTicksPerSecond();
    this.canvas.drawLimits();
    this.canvas.drawInputRef(this.inputRefX, this.inputRefY);
    for (let player of msg.players) {
      this.canvas.drawPlayer(player);
    }
  }

  onInput(input) {
    if (this.gameIsOver) {
      if (input.startInput) {
        this.restartGame();
      }
      return;
    }

    if (input.startInput) {
      this.setInputRef(input.x, input.y);
      return;
    }
    if (input.endInput) {
      this.clearInputRef();
      return;
    }

    this.send({ input: input });
  }

  send(msg) {
    this.sock.send(JSON.stringify(msg));
  }

  gameOver() {
    this.canvas.drawGameOver();
    this.gameIsOver = true;
  }

  restartGame() {
    this.gameIsOver = false;
    this.send({ command: { respawn: true } });
  }
}

class GameManager {
  constructor() {
    this.currentGame = null;
    const canvas = document.getElementById("canvas");
    this.input = new Input(
      canvas,
      Math.min(window.innerWidth, window.innerHeight),
      this.onInput.bind(this)
    );
  }

  newGame() {
    if (this.currentGame) {
      this.currentGame.gameOver();
    }
    this.currentGame = new GameEngine(
      "ws://" + window.location.hostname + ":" + window.location.port + "/ws",
      "canvas"
    );
  }

  onInput(input) {
    const CLOSED = 3;
    const OPEN = 1;
    if (!this.currentGame) {
      return;
    }

    if (this.currentGame.sock.readyState == CLOSED && input.startInput) {
      this.newGame();
      return;
    }

    if (this.currentGame.sock.readyState == OPEN) {
      this.currentGame.onInput(input);
    }
  }
}

function startGame() {
  console.log("Running ...");
  manager = new GameManager();
  manager.newGame();
}

window.onload = startGame;
