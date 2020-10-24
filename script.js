// set up global variables
var rows = 5;
var cols = 5
var mines = 4;
var openSquares;



// get elements
var board = document.getElementById("board");
var squares = initialize(board, rows, cols);
resetGame()



// converts the 1d array of squares to a 2d array.
// adds the event listeners to the squares.
function initialize(table, rows, cols) {
  //create new array for squares.
  var newArr = [];
  //row loop
  for (var r = 0; r < rows; r++) {
    // add row to table and 2d array
    var row = table.insertRow(r);
    newArr[r] = [];
    //column loop
    for (var c = 0; c < cols; c++) {
      // add cell to table and get the element
      var cell = row.insertCell(c);
      cell.setAttribute("class", "square");
      newArr[r][c] = cell;
      cell.row = r;
      cell.col = c;
      // add onclick function
      cell.onclick = function() {
        clickSquare(this.row, this.col);
      }
      cell.oncontextmenu = function() {
        rightClick(this.row, this.col);
      }
    }
  }
  return newArr;
}

// Assign mines to random locations
function resetGame() {
  openSquares = rows * cols - mines;

  // clear all mines
  for (var r = 0; r < rows; r++) {
    for (var c = 0; c < cols; c++) {
      var elem = squares[r][c];
      elem.setAttribute("mine", "0");
      elem.innerHTML = "";
      elem.style.backgroundColor = "white";
      elem.style.color = "black";
    }
  }

  // set mine location
  var count = mines;
  while (count > 0) {
    var mineRow = randomInt(0, rows);
    var mineCol = randomInt(0, cols);
    var elem = squares[mineRow][mineCol];
    if (elem.getAttribute("mine") != "1") {
      elem.setAttribute("mine", "1");
      count--;
      console.log(mineRow, mineCol)
    }
  }
}

// When you click on a square, check if it is a mine
function clickSquare(row, col) {
  var elem = squares[row][col];
  if (elem.innerHTML == "") {
    if (elem.getAttribute("mine") == "1") {
      elem.style.backgroundColor = "red";
      elem.innerHTML = "X";
      alert("Game Over");
      resetGame();
    } else {
      checkTouching(row, col);
      if (openSquares == 0) {
        alert("You Win");
        resetGame();
      }
    }
  }
}

// When you right click on a square, if it is empty
// set it to "!", otherwise make it blank
function rightClick(row, col) {
  event.preventDefault();
  var elem = squares[row][col];
  if (elem.innerHTML == "") {
    elem.innerHTML = "!";
    elem.style.color = "darkRed";
  } else if (elem.innerHTML == "!") {
    elem.innerHTML = "";
    elem.style.color = "black";
  }
}

// Return a random integer between min and max
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// Check if square is a mine
function checkMine(row, col) {
  if (squares[row][col].getAttribute("mine") == "1") {
    return true;
  } else false;
}

// Check squares surrounding one square (X) for a mine
//   1 2 3
//   4 X 5
//   6 7 8
function checkTouching(row, col) {
  var mineCount = 0; // mines the square is touching
  for (var r = row - 1; r < row + 2; r++) {
    for (var c = col - 1; c < col + 2; c++) {
      // check boundary conditions
      if (!((r == row && c == col) || r < 0 || r >= rows ||
          c < 0 || c >= cols)) {
        if (checkMine(r, c)) {
          mineCount++;
        }
      }
    }
  }
  squares[row][col].innerHTML = mineCount;
  openSquares--;

  // If the square is not touching any mines,
  // check if surrounding squares are touching mines
  if (mineCount == 0) {
    for (var r = row - 1; r < row + 2; r++) {
      for (var c = col - 1; c < col + 2; c++) {
        if (!((r == row && c == col) || r < 0 || r >= rows ||
            c < 0 || c >= cols)) {
          if (squares[r][c].innerHTML == "") {
            checkTouching(r, c);
          }
        }
      }
    }
  }
}
