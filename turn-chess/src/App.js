import React from "react";
import GameBoard from "./components/GameBoard";

// Your React component
function App() {
  const headingStyle = {
    textAlign: "center",
    margin: "0",
  };

  return (
    <div className="App">
      <h1 style={headingStyle}>Turn-Based Chess-Like Game</h1>
      <GameBoard />
    </div>
  );
}

export default App;
