// // import React, { useState, useEffect } from "react";
// // import socket from "../services/websocket";

// // const GameBoard = () => {
// //   const [gameState, setGameState] = useState(null);
// //   const [player, setPlayer] = useState(null); // Track player identifier
// //   const [selectedCharacter, setSelectedCharacter] = useState(null);
// //   const [selectedPosition, setSelectedPosition] = useState(null);

// //   useEffect(() => {
// //     socket.onmessage = (event) => {
// //       const data = JSON.parse(event.data);
// //       console.log("Message received:", data);

// //       if (data.type === "INITIAL_STATE") {
// //         setGameState(data.gameState);
// //         setPlayer(data.player); // Set player identifier
// //       } else if (data.type === "UPDATE_STATE") {
// //         setGameState(data.gameState);
// //       }
// //     };

// //     socket.onclose = () => {
// //       console.log("Disconnected from server");
// //       setPlayer(null); // Reset player on disconnection
// //     };
// //   }, []);

// //   const handleCellClick = (row, col) => {
// //     if (selectedCharacter) {
// //       // Move character to the clicked cell
// //       if (
// //         gameState &&
// //         gameState.board[row][col] === null &&
// //         gameState.turn === player
// //       ) {
// //         socket.send(
// //           JSON.stringify({
// //             type: "MAKE_MOVE",
// //             fromRow: selectedPosition.row,
// //             fromCol: selectedPosition.col,
// //             toRow: row,
// //             toCol: col,
// //             player,
// //             character: selectedCharacter,
// //           })
// //         );
// //         setSelectedCharacter(null);
// //         setSelectedPosition(null);
// //       }
// //     } else {
// //       // Select character if it's a valid move
// //       const character = gameState.board[row][col];
// //       if (character && character.startsWith(player)) {
// //         setSelectedCharacter(character);
// //         setSelectedPosition({ row, col });
// //       }
// //     }
// //   };

// //   const renderCell = (row, col) => {
// //     return (
// //       <div
// //         key={`${row}-${col}`}
// //         className="cell"
// //         onClick={() => handleCellClick(row, col)}
// //         style={{
// //           width: "60px",
// //           height: "60px",
// //           display: "flex",
// //           alignItems: "center",
// //           justifyContent: "center",
// //           border: "1px solid #333",
// //           backgroundColor:
// //             gameState.board[row][col] !== null ? "#f0f0f0" : "#fff",
// //           fontSize: "24px",
// //           cursor:
// //             gameState.board[row][col] === null && gameState.turn === player
// //               ? "pointer"
// //               : "not-allowed",
// //           transition: "background-color 0.3s",
// //         }}
// //       >
// //         {gameState.board[row][col]}
// //       </div>
// //     );
// //   };

// //   if (!gameState) {
// //     return (
// //       <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>
// //     );
// //   }

// //   return (
// //     <div
// //       style={{
// //         display: "flex",
// //         flexDirection: "column",
// //         alignItems: "center",
// //         justifyContent: "center",
// //         height: "100vh",
// //       }}
// //     >
// //       <div style={{ marginBottom: "20px", fontSize: "18px" }}>
// //         {player
// //           ? gameState.turn === player
// //             ? "Your turn!"
// //             : "Waiting for opponent..."
// //           : "Connecting..."}
// //       </div>
// //       <div
// //         style={{
// //           display: "flex",
// //           flexDirection: "column",
// //           border: "2px solid #333",
// //           borderRadius: "8px",
// //           boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
// //         }}
// //       >
// //         {gameState.board.map((row, rowIndex) => (
// //           <div key={rowIndex} style={{ display: "flex" }}>
// //             {row.map((_, colIndex) => renderCell(rowIndex, colIndex))}
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };

// // export default GameBoard;

// import React, { useState, useEffect } from "react";
// import socket from "../services/websocket";

// const GameBoard = () => {
//   const [gameState, setGameState] = useState(null);
//   const [player, setPlayer] = useState(null); // Track player identifier
//   const [selectedCharacter, setSelectedCharacter] = useState(null);
//   const [selectedPosition, setSelectedPosition] = useState(null);
//   const [history, setHistory] = useState({ A: [], B: [] }); // Movement history for both players

//   useEffect(() => {
//     socket.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       console.log("Message received:", data);

//       if (data.type === "INITIAL_STATE") {
//         setGameState(data.gameState);
//         setPlayer(data.player); // Set player identifier
//         setHistory(data.history || { A: [], B: [] }); // Initialize history if not provided
//       } else if (data.type === "UPDATE_STATE") {
//         setGameState(data.gameState);
//         setHistory(data.history || { A: [], B: [] }); // Update history and handle missing history
//       }
//     };

//     socket.onclose = () => {
//       console.log("Disconnected from server");
//       setPlayer(null); // Reset player on disconnection
//     };
//   }, []);

//   const handleCellClick = (row, col) => {
//     if (selectedCharacter) {
//       // Move character to the clicked cell
//       if (
//         gameState &&
//         gameState.board[row][col] === null &&
//         gameState.turn === player
//       ) {
//         socket.send(
//           JSON.stringify({
//             type: "MAKE_MOVE",
//             fromRow: selectedPosition.row,
//             fromCol: selectedPosition.col,
//             toRow: row,
//             toCol: col,
//             player,
//             character: selectedCharacter,
//           })
//         );
//         setSelectedCharacter(null);
//         setSelectedPosition(null);
//       }
//     } else {
//       // Select character if it's a valid move
//       const character = gameState.board[row][col];
//       if (character && character.startsWith(player)) {
//         setSelectedCharacter(character);
//         setSelectedPosition({ row, col });
//       }
//     }
//   };

//   const renderCell = (row, col) => {
//     return (
//       <div
//         key={`${row}-${col}`}
//         className="cell"
//         onClick={() => handleCellClick(row, col)}
//         style={{
//           width: "60px",
//           height: "60px",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           border: "1px solid #333",
//           backgroundColor:
//             gameState.board[row][col] !== null ? "#f0f0f0" : "#fff",
//           fontSize: "24px",
//           cursor:
//             gameState.board[row][col] === null && gameState.turn === player
//               ? "pointer"
//               : "not-allowed",
//           transition: "background-color 0.3s",
//           borderColor:
//             selectedCharacter &&
//             selectedPosition.row === row &&
//             selectedPosition.col === col
//               ? "green"
//               : "#333",
//         }}
//       >
//         {gameState.board[row][col]}
//       </div>
//     );
//   };

//   if (!gameState) {
//     return (
//       <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>
//     );
//   }

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         height: "100vh",
//       }}
//     >
//       <div style={{ marginBottom: "20px", fontSize: "18px" }}>
//         {player
//           ? gameState.turn === player
//             ? "Your turn!"
//             : "Waiting for opponent..."
//           : "Connecting..."}
//       </div>
//       <div
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           border: "2px solid #333",
//           borderRadius: "8px",
//           boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//         }}
//       >
//         {gameState.board.map((row, rowIndex) => (
//           <div key={rowIndex} style={{ display: "flex" }}>
//             {row.map((_, colIndex) => renderCell(rowIndex, colIndex))}
//           </div>
//         ))}
//       </div>
//       <div
//         style={{
//           marginTop: "20px",
//           padding: "10px",
//           border: "2px solid #333",
//           borderRadius: "8px",
//           width: "300px",
//           backgroundColor: "#f9f9f9",
//           boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//         }}
//       >
//         <h3 style={{ textAlign: "center" }}>Movement History</h3>
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             padding: "5px",
//           }}
//         >
//           <div style={{ flex: 1, paddingRight: "10px" }}>
//             <h4>Player A</h4>
//             <ul>
//               {(history.A || []).map((entry, index) => (
//                 <li key={index}>
//                   {entry.character} moved from ({entry.fromRow}, {entry.fromCol}
//                   ) to ({entry.toRow}, {entry.toCol})
//                 </li>
//               ))}
//             </ul>
//           </div>
//           <div style={{ flex: 1, paddingLeft: "10px" }}>
//             <h4>Player B</h4>
//             <ul>
//               {(history.B || []).map((entry, index) => (
//                 <li key={index}>
//                   {entry.character} moved from ({entry.fromRow}, {entry.fromCol}
//                   ) to ({entry.toRow}, {entry.toCol})
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GameBoard;

import React, { useState, useEffect } from "react";
import socket from "../services/websocket";

const GameBoard = () => {
  const [gameState, setGameState] = useState(null);
  const [player, setPlayer] = useState(null); // Track player identifier
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [history, setHistory] = useState({ A: [], B: [] }); // Track movement history

  useEffect(() => {
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Message received:", data);

      if (data.type === "INITIAL_STATE") {
        setGameState(data.gameState);
        setPlayer(data.player); // Set player identifier
        setHistory(data.history); // Set initial history
      } else if (data.type === "UPDATE_STATE") {
        setGameState(data.gameState);
        setHistory(data.history); // Update history
      }
    };

    socket.onclose = () => {
      console.log("Disconnected from server");
      setPlayer(null); // Reset player on disconnection
    };
  }, []);

  const handleCellClick = (row, col) => {
    if (!gameState || gameState.turn !== player) return;

    if (selectedCharacter) {
      // Attempt to move character to the clicked cell
      if (
        gameState.board[row][col] === null ||
        gameState.board[row][col].startsWith(player === "A" ? "B" : "A")
      ) {
        socket.send(
          JSON.stringify({
            type: "MAKE_MOVE",
            fromRow: selectedPosition.row,
            fromCol: selectedPosition.col,
            toRow: row,
            toCol: col,
            player,
            character: selectedCharacter,
          })
        );
        setSelectedCharacter(null);
        setSelectedPosition(null);
      }
    } else {
      // Select character if it's a valid move
      const character = gameState.board[row][col];
      if (character && character.startsWith(player)) {
        setSelectedCharacter(character);
        setSelectedPosition({ row, col });
      }
    }
  };

  const renderCell = (row, col) => {
    const isSelected =
      selectedPosition &&
      selectedPosition.row === row &&
      selectedPosition.col === col;
    return (
      <div
        key={`${row}-${col}`}
        className="cell"
        onClick={() => handleCellClick(row, col)}
        style={{
          width: "60px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid #333",
          backgroundColor: isSelected
            ? "#ddd"
            : gameState.board[row][col]
            ? "#f0f0f0"
            : "#fff",
          fontSize: "24px",
          cursor:
            gameState.turn === player &&
            (!gameState.board[row][col] ||
              gameState.board[row][col].startsWith(player))
              ? "pointer"
              : "not-allowed",
          transition: "background-color 0.3s",
        }}
      >
        {gameState.board[row][col]}
      </div>
    );
  };

  const renderHistory = (playerHistory, playerLabel) => {
    return (
      <div>
        <h3>{playerLabel} Movement History</h3>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {playerHistory.map((move, index) => (
            <li key={index}>
              {move.character} moved from ({move.fromRow}, {move.fromCol}) to (
              {move.toRow}, {move.toCol})
            </li>
          ))}
        </ul>
      </div>
    );
  };

  if (!gameState) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <div style={{ marginBottom: "20px", fontSize: "18px" }}>
        {player
          ? gameState.turn === player
            ? "Your turn!"
            : "Waiting for opponent..."
          : "Connecting..."}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          border: "2px solid #333",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          marginBottom: "20px",
        }}
      >
        {gameState.board.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: "flex" }}>
            {row.map((_, colIndex) => renderCell(rowIndex, colIndex))}
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "80%",
          marginTop: "20px",
        }}
      >
        {renderHistory(history.A, "Player A")}
        {renderHistory(history.B, "Player B")}
      </div>
    </div>
  );
};

export default GameBoard;
