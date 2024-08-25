const express = require("express");
const { WebSocketServer } = require("ws");

const app = express();
const PORT = 8080;

const server = app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
const wss = new WebSocketServer({ server });

let gameState = {
  board: Array(5)
    .fill()
    .map(() => Array(5).fill(null)),
  turn: "A", // Starting player
};

let players = {}; //storing player connections

wss.on("connection", (ws) => {
  console.log("New client connected");

  let player = Object.keys(players).length === 0 ? "A" : "B";
  players[player] = ws;

  ws.send(JSON.stringify({ type: "INITIAL_STATE", gameState, player }));

  ws.on("message", (message) => {
    const data = JSON.parse(message);
    console.log("Received:", data);

    if (data.type === "MAKE_MOVE") {
      const { row, col, player } = data;
      if (gameState.board[row][col] === null && gameState.turn === player) {
        gameState.board[row][col] = player;
        gameState.turn = player === "A" ? "B" : "A"; // Switch turn

        wss.clients.forEach((client) => {
          if (client.readyState === ws.OPEN) {
            client.send(JSON.stringify({ type: "UPDATE_STATE", gameState }));
          }
        });
      }
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");

    // Remove player on disconnection
    if (players[player] === ws) {
      delete players[player];
    }

    // Reset game state if both players are disconnected
    if (Object.keys(players).length === 0) {
      gameState = {
        board: Array(5)
          .fill()
          .map(() => Array(5).fill(null)),
        turn: "A",
      };
    }
  });
});
