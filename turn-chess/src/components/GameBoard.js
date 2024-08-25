import React, { useState, useEffect } from "react";
import socket from "../services/websocket";

const GameBoard = () => {
  const [gameState, setGameState] = useState(null);
  const [player, setPlayer] = useState(null); // Track player identifier

  useEffect(() => {
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "INITIAL_STATE") {
        setGameState(data.gameState);
        setPlayer(data.player); // Set player identifier
      } else if (data.type === "UPDATE_STATE") {
        setGameState(data.gameState);
      }
    };

    socket.onclose = () => {
      console.log("Disconnected from server");
      setPlayer(null); // Reset player on disconnection
    };
  }, []);

  const handleCellClick = (row, col) => {
    if (
      gameState &&
      gameState.board[row][col] === null &&
      gameState.turn === player
    ) {
      socket.send(JSON.stringify({ type: "MAKE_MOVE", row, col, player }));
    }
  };

  const renderCell = (row, col) => {
    return (
      <div
        key={`${row}-${col}`}
        className="cell"
        onClick={() => handleCellClick(row, col)}
        style={{
          width: "50px",
          height: "50px",
          display: "inline-block",
          border: "1px solid black",
          textAlign: "center",
          lineHeight: "50px",
          fontSize: "24px",
          cursor:
            gameState.board[row][col] === null && gameState.turn === player
              ? "pointer"
              : "not-allowed",
          backgroundColor:
            gameState.board[row][col] !== null ? "#f0f0f0" : "#fff",
        }}
      >
        {gameState.board[row][col]}
      </div>
    );
  };

  if (!gameState) {
    return <div>Loading...</div>; //error message
  }

  return (
    <div>
      <h1>Turn-Based Chess-Like Game</h1>
      <div style={{ marginBottom: "20px", fontSize: "18px" }}>
        {player
          ? gameState.turn === player
            ? "Your turn!"
            : "Waiting for opponent..."
          : "Connecting..."}
      </div>
      {gameState.board.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: "flex" }}>
          {row.map((_, colIndex) => renderCell(rowIndex, colIndex))}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;
