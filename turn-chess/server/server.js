// // const express = require("express");
// // const { WebSocketServer } = require("ws");

// // const app = express();
// // const PORT = 8080;

// // // Start the server
// // const server = app.listen(PORT, () => {
// //   console.log(`Server is listening on port ${PORT}`);
// // });

// // // Initialize WebSocket server instance
// // const wss = new WebSocketServer({ server });

// // // Object to store the game state
// // let gameState = {
// //   board: Array(5)
// //     .fill()
// //     .map(() => Array(5).fill(null)),
// //   turn: "A", // Default to player A starting
// // };

// // // Set initial positions of the characters
// // const playerA = ["AP1", "AP2", "AP3", "AH1", "AH2"];
// // const playerB = ["BP1", "BP2", "BP3", "BH1", "BH2"];

// // gameState.board[0] = playerA;
// // gameState.board[4] = playerB;

// // wss.on("connection", (ws) => {
// //   console.log("New client connected");

// //   // Assign player to the client
// //   const playerId = [...wss.clients].length % 2 === 0 ? "A" : "B";

// //   // Send the initial game state and player ID to the new client
// //   ws.send(
// //     JSON.stringify({ type: "INITIAL_STATE", gameState, player: playerId })
// //   );

// //   ws.on("message", (message) => {
// //     const data = JSON.parse(message);
// //     console.log("Received:", data);

// //     // Handle incoming move commands
// //     if (data.type === "MAKE_MOVE") {
// //       const { fromRow, fromCol, toRow, toCol, player, character } = data;

// //       // Check if the move is valid
// //       if (
// //         gameState.turn === player &&
// //         gameState.board[fromRow][fromCol] === character &&
// //         gameState.board[toRow][toCol] === null
// //       ) {
// //         // Perform the move
// //         gameState.board[toRow][toCol] = character;
// //         gameState.board[fromRow][fromCol] = null;

// //         // Switch turn
// //         gameState.turn = gameState.turn === "A" ? "B" : "A";

// //         // Broadcast the updated game state to all clients
// //         wss.clients.forEach((client) => {
// //           if (client.readyState === ws.OPEN) {
// //             client.send(JSON.stringify({ type: "UPDATE_STATE", gameState }));
// //           }
// //         });
// //       }
// //     }
// //   });

// //   ws.on("close", () => {
// //     console.log("Client disconnected");
// //   });
// // });

// const express = require("express");
// const { WebSocketServer } = require("ws");

// const app = express();
// const PORT = 8080;

// // Start the server
// const server = app.listen(PORT, () => {
//   console.log(`Server is listening on port ${PORT}`);
// });

// // Initialize WebSocket server instance
// const wss = new WebSocketServer({ server });

// // Object to store the game state and movement history
// let gameState = {
//   board: Array(5)
//     .fill()
//     .map(() => Array(5).fill(null)),
//   turn: "A", // Default to player A starting
// };

// // Movement history for both players
// const history = {
//   A: [],
//   B: [],
// };

// // Set initial positions of the characters
// const playerA = ["AP1", "AP2", "AP3", "AH1", "AH2"];
// const playerB = ["BP1", "BP2", "BP3", "BH1", "BH2"];

// gameState.board[0] = playerA;
// gameState.board[4] = playerB;

// wss.on("connection", (ws) => {
//   console.log("New client connected");

//   // Assign player to the client
//   const playerId = [...wss.clients].length % 2 === 0 ? "A" : "B";

//   // Send the initial game state and player ID to the new client
//   ws.send(
//     JSON.stringify({
//       type: "INITIAL_STATE",
//       gameState,
//       player: playerId,
//       history,
//     })
//   );

//   ws.on("message", (message) => {
//     const data = JSON.parse(message);
//     console.log("Received:", data);

//     if (data.type === "MAKE_MOVE") {
//       const { fromRow, fromCol, toRow, toCol, player, character } = data;

//       // Check if the move is valid
//       if (
//         gameState.turn === player &&
//         gameState.board[fromRow][fromCol] === character &&
//         gameState.board[toRow][toCol] === null
//       ) {
//         // Perform the move
//         gameState.board[toRow][toCol] = character;
//         gameState.board[fromRow][fromCol] = null;

//         // Add to history
//         history[player].push({
//           character,
//           fromRow,
//           fromCol,
//           toRow,
//           toCol,
//         });

//         // Switch turn
//         gameState.turn = gameState.turn === "A" ? "B" : "A";

//         // Broadcast the updated game state and history to all clients
//         wss.clients.forEach((client) => {
//           if (client.readyState === ws.OPEN) {
//             client.send(
//               JSON.stringify({
//                 type: "UPDATE_STATE",
//                 gameState,
//                 history,
//               })
//             );
//           }
//         });
//       }
//     }
//   });

//   ws.on("close", () => {
//     console.log("Client disconnected");
//   });
// });

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

// Object to store the game state and movement history
let gameState = {
  board: Array(5)
    .fill()
    .map(() => Array(5).fill(null)),
  turn: "A", // Default to player A starting
};

// Movement history for both players
const history = {
  A: [],
  B: [],
};

// Set initial positions of the characters
const playerA = ["AP1", "AP2", "AP3", "AH1", "AH2"];
const playerB = ["BP1", "BP2", "BP3", "BH1", "BH2"];

gameState.board[0] = playerA;
gameState.board[4] = playerB;

// Helper functions to handle moves
const isMoveValid = (character, fromRow, fromCol, toRow, toCol, player) => {
  const rowDiff = toRow - fromRow;
  const colDiff = toCol - fromCol;

  switch (character[1]) {
    case "P": // Pawn
      return Math.abs(rowDiff) <= 1 && Math.abs(colDiff) <= 1;

    case "H": // Hero
      if (character[2] === "1") {
        // Hero1
        return (
          (Math.abs(rowDiff) === 2 && colDiff === 0) ||
          (Math.abs(colDiff) === 2 && rowDiff === 0)
        );
      } else if (character[2] === "2") {
        // Hero2
        return Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 2;
      }
      break;

    default:
      return false;
  }

  return false;
};

// Check if the move results in a kill
const isKillMove = (toRow, toCol, player) => {
  const target = gameState.board[toRow][toCol];
  if (!target) return false;

  return player === "A" ? target.startsWith("B") : target.startsWith("A");
};

wss.on("connection", (ws) => {
  console.log("New client connected");

  // Assign player to the client
  const playerId = [...wss.clients].length % 2 === 0 ? "A" : "B";

  // Send the initial game state and player ID to the new client
  ws.send(
    JSON.stringify({
      type: "INITIAL_STATE",
      gameState,
      player: playerId,
      history,
    })
  );

  ws.on("message", (message) => {
    const data = JSON.parse(message);
    console.log("Received:", data);

    if (data.type === "MAKE_MOVE") {
      const { fromRow, fromCol, toRow, toCol, player, character } = data;

      // Check if the move is valid
      if (
        gameState.turn === player &&
        gameState.board[fromRow][fromCol] === character &&
        (gameState.board[toRow][toCol] === null ||
          isKillMove(toRow, toCol, player)) &&
        isMoveValid(character, fromRow, fromCol, toRow, toCol, player)
      ) {
        // Perform the move or attack
        gameState.board[toRow][toCol] = character;
        gameState.board[fromRow][fromCol] = null;

        // Add to history
        history[player].push({
          character,
          fromRow,
          fromCol,
          toRow,
          toCol,
        });

        // Switch turn
        gameState.turn = gameState.turn === "A" ? "B" : "A";

        // Broadcast the updated game state and history to all clients
        wss.clients.forEach((client) => {
          if (client.readyState === ws.OPEN) {
            client.send(
              JSON.stringify({
                type: "UPDATE_STATE",
                gameState,
                history,
              })
            );
          }
        });
      }
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});
