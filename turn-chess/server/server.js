const express = require("express");
const { WebSocketServer } = require("ws");

const app = express();
const PORT = 8080;

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

// Initialize WebSocket server instance
const wss = new WebSocketServer({ server });

// Object to store the game state
let gameState = {
  board: Array(5)
    .fill()
    .map(() => Array(5).fill(null)),
  turn: "A", // Default to player A starting
};

// Set initial positions of the characters
const playerA = ["AP1", "AP2", "AP3", "AH1", "AH2"];
const playerB = ["BP1", "BP2", "BP3", "BH1", "BH2"];

gameState.board[0] = playerA;
gameState.board[4] = playerB;

wss.on("connection", (ws) => {
  console.log("New client connected");

  // Assign player to the client
  const playerId = [...wss.clients].length % 2 === 0 ? "A" : "B";

  // Send the initial game state and player ID to the new client
  ws.send(
    JSON.stringify({ type: "INITIAL_STATE", gameState, player: playerId })
  );

  ws.on("message", (message) => {
    const data = JSON.parse(message);
    console.log("Received:", data);

    // Handle incoming move commands
    if (data.type === "MAKE_MOVE") {
      const { fromRow, fromCol, toRow, toCol, player, character } = data;

      // Check if the move is valid
      if (
        gameState.turn === player &&
        gameState.board[fromRow][fromCol] === character &&
        gameState.board[toRow][toCol] === null
      ) {
        // Perform the move
        gameState.board[toRow][toCol] = character;
        gameState.board[fromRow][fromCol] = null;

        // Switch turn
        gameState.turn = gameState.turn === "A" ? "B" : "A";

        // Broadcast the updated game state to all clients
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
  });
});
