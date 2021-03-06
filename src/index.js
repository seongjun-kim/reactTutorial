import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

// class Square extends React.Component {
//   render() {
//     // const value = this.props.value;
//     return (
//       <button
//         className="square"
//         // prop으로 함수를 전달해 클릭하는 시점에만 함수를 호출!
//         onClick={() => this.props.onClick()}
//         // [주의 1]
//         // 위와 같이 함수(화살표 함수)를 전달하지 않고
//         // onClick에 수행할 동작을 직접 넣으면 컴포넌트가 다시 렌더링될 때 마다
//         // 동작(alert 경고창)이 수행됨.
//         // onClick={alert(`click!: ${this.props.value}`)}
//         //
//         // [주의 2]
//         // 아래와 같이 function() 으로 정의하면
//         // 함수 내부에서 다루는 this와 Square 컴포넌트에서 바라보는 this가 달라서
//         // 경고창에서 해당 칸의 숫자를 출력할 수 없다.
//         // + return 앞에 주석처리한 value를 활용하면 출력 가능!
//         // onClick={function () {
//         //   alert(`click!: ${this.props.value}`);
//         // }}
//       >
//         {this.props.value}
//       </button>
//     );
//   }
// }

function Square(props) {
  return (
    // <button className="square" onClick={() => props.onClick()}>
    // props로 전달받은 함수 자체를 바인딩하면서 기존 화살표 함수를 사용할 때 쓰인 두 괄호 모두 없앨 수 있다!
    <button className="square" onClick={props.onClick}>
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
      />
    );
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
    super();
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([{ squares: squares }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    let status;

    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
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

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
