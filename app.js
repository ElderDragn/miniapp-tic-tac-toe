

/*

Construct Tic-Tac-Toe with instances of classes GameBoard and Square, which will handle game state internally.

–––––––––––––––––––––
Classes

- - - - - - - - -
Gameboard:
  Constructor:
    Populate itself with squares
    Initiate game

  Methods:
    (Re)set game
    Swap active player
    Check for win (If won, remove all listeners)

  onClick:
    Check for win
- - - - - - - - -
Square:
  Constructor:
    Add event listeners on its node

  Methods:
    Play move (Add symbol to DOM, remove listener)

  onClick:
    Play move
- - - - - - - - -
–––––––––––––––––––––

*/

class GameSquare {
  constructor(domNode, parentBoard = {currentPlayer:'X'}) {
    this.parentBoard = parentBoard;
    this.played = false;
    this.node = domNode;
    this.playMove = this.playMove.bind(this);
    this.reset = this.reset.bind(this);
    this.node.addEventListener('click', this.playMove);
  }

  reset() {
    this.played = false;
    // this.node.innerText = this.parentBoard.currentPlayer;
    this.node.innerText = 0;
    this.node.addEventListener('click', this.playMove);
  }

  playMove() {
    this.played = true;
    this.node.innerText = this.parentBoard.currentPlayer;
    this.node.removeEventListener('click', this.playMove);
  }

}

class GameBoard {

  constructor(nodes) {
    this.currentPlayer = 'X';
    this.n = Math.sqrt(nodes.length);
    this.squares = Array(this.n).fill(0).map(() => Array(this.n));
    this.initiate(nodes, this.n);
  }

  initiate(nodes, n) {
    if (n % 1) {
      throw new RangeError(`Invalid board length ${n}`);
    }

    let i = 0;
    for (let x = 0; x < n; x++) {
      for (let y = 0; y < n; y++) {
        let node = nodes[i];
        let square = new GameSquare(node, this)
        this.squares[x][y] = square;
        i += n;
        i -= (i >= nodes.length) ? (nodes.length - 1) : 0;
      }
    }
  }
  reset() {
    this.squares.forEach((column) =>
      column.forEach((square) => {
        square.reset();
      })
    )
  }

  swapPlayer() {
    this.currentPlayer = (this.currentPlayer = 'X') ? 'O' : 'X';
  }

  checkWin() {

  }
}

//Once page loads, create new board with existing tic-tac-table

window.onload = () => {
  console.log('loaded');
  var squares = document.getElementsByClassName('square');
  window.board = new GameBoard(squares);
  document.getElementsByClassName('resetButton')[0].addEventListener('click', board.resetAll);
}