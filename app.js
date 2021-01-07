

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

var delay = 40;

var colorChange = async function(arr, color, time = delay) {
  return new Promise (resolve => {
    window.setTimeout(()=>{
      setSquareColors(arr, color);
      resolve(arr);
    }, time)
  })
}

var testSquare = function(player, square, time = delay) {
  square.setColor('cyan');
  let text = square.node.innerText || 'EMPTY';
  return new Promise(resolve => {
    setTimeout(()=>{
      resolve(text !== player);
    }, time)
  })
}

var testSquareListForWin = async function(player, squareList, startPos) {

  var checks = [];
  let x = startPos.x;
  let y = startPos.y;

  let i = 0;
  var won = true;
  while (i < 3) {
    let square = squareList[i];
    var lost = await testSquare(player, square);
    if (lost) {
      won = false;
    }
    i++;
  }

  return Promise.resolve(won)
    .then((won)=>{
      if (!won) {
        return colorChange(squareList, 'red')
      } else {
        console.log(squareList);
        throw squareList;
      }
    })
    .then(() => {
      return Promise.resolve(false);
    })


  return Promise.resolve(true);

}

var canGo = function() {
  if (this.validMovesLeft <= 0) {
    return false;
  } else {
    return true;
  }
}

var setSquareColors = function(squaresArray, color) {
  squaresArray.forEach((sq)=>sq.setColor(color));
}

class GameSquare {
  constructor(domNode, pos, parentBoard = {currentPlayer:'X'}) {
    this.pos = pos;
    this.parentBoard = parentBoard;
    this.played = false;
    this.node = domNode;
    this.playMove = this.playMove.bind(this);
    this.reset = this.reset.bind(this);
    this.setColor = this.setColor.bind(this);
    this.node.addEventListener('click', this.playMove);
  }

  setColor(color) {
    this.node.style.backgroundColor = color;
  }

  reset() {
    this.played = false;
    // this.node.innerText = this.parentBoard.currentPlayer;
    this.node.innerText = '';
    this.node.addEventListener('click', this.playMove);
    this.setColor('white');
  }

  playMove() {
    if (this.played === false) {
      this.played = true;
      this.node.innerText = this.parentBoard.currentPlayer;
      this.parentBoard.playMove(this);
    }
      this.node.removeEventListener('click', this.playMove);
  }
}

class GameBoard {

  constructor(nodes) {
    this.currentPlayer = 'X';
    this.n = Math.sqrt(nodes.length);
    this.squares = Array(this.n).fill(0).map(() => Array(this.n));
    this.validMovesLeft = (nodes.length);

    this.playMove = this.playMove.bind(this);
    this.checkWin = this.checkWin.bind(this);
    this.resetAll = this.resetAll.bind(this);

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
        let square = new GameSquare(node, {x, y},this)
        this.squares[x][y] = square;
        i += n;
        i -= (i >= nodes.length) ? (nodes.length - 1) : 0;
      }
    }
  }

  resetAll() {
    this.squares.forEach((column) =>
      column.forEach((square) => {
        square.reset();
      })
    )
    this.validMovesLeft = (this.n * this.n);
    this.currentPlayer = 'X';
  }

  checkWin(startingSquare) {

    var player = startingSquare.node.innerText;
    var x = startingSquare.pos.x;
    var y = startingSquare.pos.y;
    var colSquares = this.squares[x];
    var rowSquares = [];
    this.squares.forEach((col) => {
      rowSquares.push(col[y]);
    });
    var majDiagSquares = []
    var minDiagSquares = []
    this.squares.forEach((col) => {
      rowSquares.push(col[y]);

      col.forEach((square, i) => {
        console.log(`square[${i}]: `, square[i]);
        let x = square.pos.x;
        let y = square.pos.y;
        console.log(square.node.className, x, y);
        if ((Math.abs(x - y) === 2) || (x === 1 & y === 1)) {
          minDiagSquares.push(square);
        }
        if (x - y === 0) {
          majDiagSquares.push(square);
        }
      });
    });

    var onMajDiagonal = false;
    var onMinDiagonal = false;
    if (Math.abs(x - y) === 2) {
      onMinDiagonal = true;
    } else
    if (x - y === 0) {
      onMajDiagonal = true;
    } else
    if (x === 1 & y === 1) {
      onMajDiagonal = true;
      onMinDiagonal = true;
    }

    //win and reset if:
    //row filled with same character
    return testSquareListForWin(player, rowSquares, startingSquare.pos)
      .then(() => {
        return testSquareListForWin(player, colSquares, startingSquare.pos);
      })
      .then(() => {
        if (onMajDiagonal) {
          return testSquareListForWin(player, majDiagSquares, startingSquare.pos);
        } else {
          return Promise.resolve();
        }
      })
      .then(() => {
        if (onMinDiagonal) {
          return testSquareListForWin(player, minDiagSquares, startingSquare.pos);
        } else {
          return Promise.resolve();
        }
      })
      .then(() => {
        colorChange(rowSquares, 'white');
        colorChange(colSquares, 'white');
        colorChange(majDiagSquares, 'white');
        colorChange(minDiagSquares, 'white');
      })
      .catch((winningRow) => {
        if (Array.isArray(winningRow)) {
          console.log('win!');
          this.squares.forEach((row) => {
            row.forEach((square) => {
              square.played = true;
              square.setColor('white');
            })
          })
          return colorChange(winningRow, 'lightgreen');
        } else {
          console.trace(winningRow);
        }
      })
    //col filled with same character
    //either diag filled with same character


    // console.log(`got row ${row} and col ${col}`)
    if (!canGo.call(this)) {
      window.setTimeout(this.reset, 500)
    }
  }

  playMove(square) {
    this.currentPlayer = (this.currentPlayer === 'X') ? 'O' : 'X';
    this.validMovesLeft -= 1;
    this.checkWin(square);
  }

}

//Once page loads, create new board with existing tic-tac-table

window.onload = () => {
  console.log('loaded');
  var squares = document.getElementsByClassName('square');
  window.board = new GameBoard(squares);
  document.getElementsByClassName('resetButton')[0].addEventListener('click', board.resetAll);

  // document.getElementsByClassName('board')[0].addEventListener('click', window.board.playMove);
}
this.validMovesLeft -= 0;