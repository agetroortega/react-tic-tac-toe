import { useState } from "react";

let empty = null;
const players = ["X", "O"];


export default function Game(){
  const [history, setHistory] = useState([Array(9).fill(empty)])
  const [currentMove, setCurrentMove] = useState(0)
  const currentSquares = history[currentMove]
  const lastPlayer = currentMove % 2;

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function handleReset() {
    setHistory([Array(9).fill(empty)]);
    setCurrentMove(0);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((_, move) => {
    let description;
    description = 'Go to move #' + move;
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });


  
  return (
    <div className="game">
      <div className="game-board">
        <Board
          lastPlayer={lastPlayer} 
          squares={currentSquares}
          onPlay={handlePlay}
          />
          <button onClick={handleReset} className="reset-button">RESET</button>
      </div>
      <div className="game-info">
        <ol>
          {moves}
        </ol>
      </div>

    </div>
  )
}


function Board({lastPlayer, squares, onPlay}) {
  // const [squares, setSquares] = useState(Array(9).fill(empty));
  

  function handleClick(idx) {
    if (squares[idx] != empty || calculateWinner(squares)){
      return;
    }
    
    const nextSquares = squares.slice();
    nextSquares[idx] = players[lastPlayer];
    onPlay(nextSquares);
    

  }

  const rows = [];
  let n = 0;

  for (let i=0; i < 3; i++) {
    const buttons = [];
    for (let j=0; j < 3; j++) {
      buttons.push(
        <Square key={n} 
        value={squares[n]} 
        // Somehow arrow function didn't work directly
        onSquareClick={(function (index){return () => handleClick(index)})(n)}
        />
      );
      n++;
    }  

    rows.push(
      <div key={i} className="board-row">
        {buttons}
      </div>
    );
  }

  const winner = calculateWinner(squares);
  let status;

  status = winner ? "Winner is " + winner: "Next player: " + players[lastPlayer]
  return <>
        <div className="status">{status}</div>
        {rows}
        </>;

}


function Square({value, onSquareClick}) {

  return <button 
    className="square"
    onClick={onSquareClick}
    >
    {value}
    </button>;
}


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}