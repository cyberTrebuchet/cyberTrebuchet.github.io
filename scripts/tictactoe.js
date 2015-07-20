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

  this.checkForTie = function checkForTie(){
    console.log("Checking for tie...")
    return newGame.boxes.every(   function(row){
      console.log("In the row...")
      return row.every(          function(boxID){
        console.log($("#" + boxID).hasClass("clicked"));
        return $("#" + boxID).hasClass("clicked");
      });
    });
  }

  this.checkForWin = function checkForWin(player, currentBoxID){
    var $currentBoxID = currentBoxID;

    // Note player move in array of "wins"
    newGame.forTheWin.forEach(function(winSet){
      if (winSet[$currentBoxID.slice(1)]){
        winSet[$currentBoxID.slice(1)] = player;
      }
    });

    if (newGame.checkForTie()){
      newGame.dimmer("Tie!");
      return false;
    }

    return newGame.forTheWin.some(function(winSet){
      
      var inARow = 0;

      console.log(Object.keys(winSet));

      if (Object.keys(winSet).every(function(boxID){
        console.log(boxID + " is " + winSet[boxID]);
        return winSet[boxID] === player;
      })){
        console.log("Game won? True! by " + player);
        return true;
      } else {
        console.log("Game won? False! by " + player);
        return false;
      }
    });
  }

  this.playerMove = function playerMove(clickEvent){

    // console.log(clickEvent.target + " is the click event target");
    // console.log(clickEvent.target.id + " is the target's id");

    var $currentPlayer = $("#whose-turn").text().toLowerCase(); // Whose turn is it, anyway?
    var $currentBoxID = "#" + clickEvent.target.id; // Will be image, after image is shown

    // console.log($currentPlayer + " is currentPlayer");
    // console.log($currentBoxID + " is currentBox's id");

    // Modify the box only if unclicked
    if (!($($currentBoxID).hasClass("clicked"))) {

      // To prevent this.playerMove() from being called again in the same box
      $($currentBoxID).addClass("clicked");
      $($currentBoxID).children().addClass("clicked");

      // Check whose turn it is
      if ($currentPlayer.includes("x")){             // If X's turn...

        // Show only the correct graphic on the clicked box
        $($currentBoxID + " > #x-pic").show();

        // Play audio
        $("#fire").trigger("pause");
        $("#fire").prop("currentTime", 0);
        $("#fire").trigger("play");
        
        // Briefly show the big player graphic
        $("#big-x").show();
        $("#big-x").fadeOut(1000);

        // Check for the win!
        if (newGame.checkForWin("x", $currentBoxID)){
          newGame.dimmer("x");
        }
        // Toggle currentPlayer
        $("#whose-turn").text("Player O - go!");

      } else {                                       // If O's turn...
        // Show only the correct graphic on the clicked box
        $($currentBoxID + " > #o-pic").show();

        // Play audio
        $("#fire").trigger("pause");
        $("#fire").prop("currentTime", 0);
        $("#fire").trigger("play");
        
        // Briefly show the big player graphic
        $("#big-o").show();
        $("#big-o").fadeOut(1000);
        
        // Check for the win!
        if (newGame.checkForWin("o", $currentBoxID)){
          newGame.dimmer("o");
        }
        // Toggle currentPlayer
        $("#whose-turn").text("Player X - go!");
      }
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

  // Display congratulations and offer to start new game
  this.dimmer = function dimmer(player){
    // Clear any previous gratz
    $("#dimmer > h1").remove();

    var $gratz = $("<h1>");

    if (player != "Tie!"){
      // Up the appropriate player's score
      var $score = $("." + player + "-score > h2");
      $score.text(parseInt($score.text()) + 1);
      
      $gratz.text("Congratulations, Player " + player.toUpperCase());
    } else {
      $gratz.text("Congratulations, Player " + player);      
    }

    $("#dimmer").prepend($gratz);
    $("#dimmer").show();
  }
}

// Declared newGame outside the first click event because "this" was being a pain
var newGame;

// Inititalize and render a new game when button clicked
$(".button-primary").click(function(){
  $("#dimmer").hide();
  newGame = new Game();
  newGame.render();
});

});