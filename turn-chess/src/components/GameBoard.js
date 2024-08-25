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
          width: "60px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid #333",
          backgroundColor:
            gameState.board[row][col] !== null ? "#f0f0f0" : "#fff",
          fontSize: "24px",
          cursor:
            gameState.board[row][col] === null && gameState.turn === player
              ? "pointer"
              : "not-allowed",
          transition: "background-color 0.3s",
        }}
      >
        {gameState.board[row][col]}
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
        }}
      >
        {gameState.board.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: "flex" }}>
            {row.map((_, colIndex) => renderCell(rowIndex, colIndex))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
