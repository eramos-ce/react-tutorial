import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { tsPropertySignature } from '@babel/types';

/**
 * Square expressed as a React.Component
 */
/* class Square extends React.Component {

  render() {
    return (
      <button 
        className="square" 
        onClick={() => this.props.onClick()}>
        {this.props.value}
      </button>
    );
  }
}
*/

/**
 * Square expressed as a simpler Function component
 * @param  props 
 */
function Square(props) {
  return (
    <button 
      className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  )
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square 
        value={ this.props.squares[i] }
        onClick={ ()=> {this.props.onClick(i)}} 
      />);
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      history: [
        {
          // First item in history is an empty board
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  render() {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]

    const moves = history.map( (step, move) => {
      const desc = move?
        'Go to move #' + move :
        'Go to game start';
      
      return (
        <li key={move}>
          <button onClick={ () => this.jumpTo(move) }>{desc}</button>
        </li>
      )
    })

    const winner = calculateWinner(current.squares)
    let status
    if(winner) {
      status = "Winner: " + winner
    } else {
      status = 'Next player: ' + (this.state.xIsNext? 'X': 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={ (i)=> {this.handleClick(i)} }
            />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }

  handleClick(i) {
    let history = this.state.history.slice(0, this.state.stepNumber + 1)
    let current = history[history.length - 1]
    let squares = current.squares.slice()

    // Check if there was a winner of if the square has already been used
    if(calculateWinner(squares) || squares[i])
    {
      // Ignore move
      return;
    }

    // Update local copy
    squares[i] = this.state.xIsNext? 'X': 'O'
    // Trigger update of state (and re-ren  der)
    this.setState(
      {
        history: history.concat([{
          squares: squares,
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
      }
    )
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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