// Thompson's Tic Tac Toe! v0.1

$(function () {

var Game = function Game(){

  // To be assigned to each boxID
  this.boxes = [["nw", "n", "ne"],
                ["w", "c", "e"],
                ["sw", "s", "se"]];

  // All possible wins, to be filled in with "x" or "o" in this.playerMove()
  this.forTheWin = [{
    "nw": true,
    "n": true,
    "ne": true
  },{
    "w": true,
    "c": true,
    "e": true
  },{
    "sw": true,
    "s": true,
    "se": true
  },{
    "nw": true,
    "c": true,
    "se": true
  },{
    "ne": true,
    "c": true,
    "sw": true
  },{
    "nw": true,
    "w": true,
    "sw": true
  },{
    "n": true,
    "c": true,
    "s": true
  },{
    "ne": true,
    "e": true,
    "se": true
  }]

  this.checkForWin = function checkForWin(player){
    var gameWon = false;
    return newGame.forTheWin.some(function(winSet){
      for (boxID in winSet){
        gameWon = winSet[boxID] === player ? true : false;
      }
      return gameWon;
    });
  }

  this.playerMove = function playerMove(clickEvent){

    console.log(clickEvent.target + " is the click event target");
    console.log(clickEvent.target.id + " is the target's id");

    var $currentPlayer = $("#whose-turn").text().toLowerCase(); // Whose turn is it, anyway?
    var $currentBoxID = "#" + clickEvent.target.id; // Will be image, after image is shown

    console.log($currentPlayer + " is currentPlayer");
    console.log($currentBoxID + " is currentBox's id");

    // Modify the box only if unclicked
    if (!($($currentBoxID).hasClass("clicked"))) {

      // Check whose turn it is
      if ($currentPlayer.includes("x")){             // If X's turn...

        // Show only the correct graphic on the clicked box
        $($currentBoxID + " > #x-pic").show();
        
        // Briefly show the big player graphic
        $("#big-x").show();
        $("#big-x").fadeOut(1000);

        // Note player move in array of "wins"
        newGame.forTheWin.forEach(function(winSet){
          if (winSet[$currentBoxID.slice(1)]){ // Slice the #
            winSet[$currentBoxID.slice(1)] = "x";
          }
        });
        // Check for the win!
        if (newGame.checkForWin("x")){
          newGame.dimmer();
        }
        // Toggle currentPlayer
        $("#whose-turn").text("Player O - go!");

      } else {                                       // If O's turn...
        $($currentBoxID + " > #o-pic").show();
        
        $("#big-o").show();
        $("#big-o").fadeOut(1000);

        newGame.forTheWin.forEach(function(winSet){
          if (winSet[$currentBoxID.slice(1)]){
            winSet[$currentBoxID.slice(1)] = "o";
          }
        });
        if (newGame.checkForWin("o")){
          newGame.dimmer();
        }
        $("#whose-turn").text("Player X - go!");
      }

      // To prevent this.playerMove() from being called again in the same box
      $($currentBoxID).addClass("clicked");
      $($currentBoxID).children().addClass("clicked");
    }
  }

  // Generate and display a fresh board
  this.render = function render(){

    var $container = $(".container");

    $container.empty();

    // whose-turn display
    var $whoseTurn = $("<h3>").attr("id", "whose-turn").text("Player X - go!")
    $container.append($whoseTurn);

    // Iterate through this.boxes to generate clickable 3x3 grid
    this.boxes.forEach(function(row){

      var $row = $("<div>").attr({
        "class": "row"
      });

      row.forEach(function(boxID){

        var $box = $("<div>").attr({
          "class": "one-third column",
          "class": "box",
          "id": boxID
        });
        $box.click(newGame.playerMove);

        // Add hidden images to each box
        var $x = $("<img>").hide().attr({
          "src": "graphics/burning-x.png",
          "id": "x-pic"
        });

        var $o = $("<img>").hide().attr({
          "src": "graphics/burning-o.png",
          "id": "o-pic"
        });

        $box.append($x, $o);
        $row.append($box);
      });

      $container.append($row).hide();

    });

    // Create big images, hidden
    $bigX = $("<img>").hide().attr({
      "src": "graphics/burning-x.png",
      "id": "big-x"
    });
    $bigO = $("<img>").hide().attr({
      "src": "graphics/burning-o.png",
      "id": "big-o"
    });

    $container.append($bigX, $bigO);

    $container.fadeIn(5000);

    console.log("The grid is up!");
  }

  // When game is won, display congratulations and offer to start new game
  this.dimmer = function dimmer(){
    
  }
}

// Load the landing page

var $landingPage = $("<div>").addClass("row").append($("<div>").addClass("half column"));
var $invite = $("<button>").addClass("button-primary").text("New Game...");

$landingPage.append($invite);

$(".container").append($landingPage);

// Declared newGame outside the first click event because "this" was being a pain
var newGame;

// Inititalize and render a new game when button clicked
$(".button-primary").click(function(){
  newGame = new Game();
  newGame.render();
});

});