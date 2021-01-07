

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


//Once page loads, create new board with existing tic-tac-table

document.onload = () => {

}