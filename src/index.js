import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
    return (
      <button
        className="square"
        onClick={() => props.onClick()}
        key={props.value}
      >
        {props.value}
      </button>
    );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        key={i}
      />
    );
  }

  render() {
    const boardRows = [...Array(3)].map((_, i) => {
      const squares = [...Array(3)].map((_, j) => {
        return this.renderSquare(i * 3 + j)
      });
      return <div className="board-row" key={i}>{squares}</div>
    });
    return boardRows;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history:[{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const desc = move ?
      'Go to move #' + move :
      'Go to game start'; 

      const currentSquare = step.squares.slice();
      const previousSquare = move ? history[move - 1].squares.slice() : null;
      const latestMove = previousSquare ? currentSquare.findIndex((square, index) => square !== previousSquare[index]) : null;
      const latestMoveDesc = latestMove != null ? ` [position : (${Math.floor(latestMove / 3) + 1}, ${latestMove % 3 + 1})]` : '';

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}{latestMoveDesc}</button>
        </li>
      )
    })

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}