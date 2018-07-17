$(document).ready(function () {

    // configure firebase
    var config = {
        apiKey: "AIzaSyDpa1D5fuqUy0FtgpKNdJEfTEwqlQoutYg",
        authDomain: "group-project-1-dbc.firebaseapp.com",
        databaseURL: "https://group-project-1-dbc.firebaseio.com/",
        projectId: "group-project-1-dbc",
        storageBucket: "group-project-1-dbc.appspot.com",
        messagingSenderId: "110968687261"
    };

    firebase.initializeApp(config);


    var database = firebase.database();

    // Player variables
    var playerName;
    var wins = 0;
    var voteCount = 0;
    var timeId;
    var timerRunning = false;
    var counter = 30
    var voteSumbitted = 'a';
    var gifLink = '';
    //Reference to player in database
    var playerRef;

    $("#ready-button").click(function (p) {

        p.preventDefault();

        // Declare variable for Player Name
        var newPlayerName = $("#player-name-input").val().trim();
        playerName = newPlayerName;
        playerRef = database.ref("players/" + playerName);

        // Removes player when they disconnect
        playerRef.onDisconnect().remove();


        if (playerName.length > 0) {

            // Replaces name form with actual name

            // $("#player-name").prepend(playerName;
            $("#player-name-form").html($("<p>").append(playerName).attr("id", "player-name-para"));
            $("#player-name-form").append($("<button>").attr("type", "button").attr("class", "btn btn-dark").attr("id", "newRoundButton").attr("value", "New Round"));
            $("#newRoundButton").append("New Round");

            // Writes data to database when button is clicked
            writePlayerData(playerName);
        }

        // Function to create player object in database
        function writePlayerData(playerName) {
            database.ref("players/" + playerName).set({
                Name: playerName,
                wins: wins,
                voteCount: voteCount,
                voteSumbitted: voteSumbitted,
                status: 'Not Ready',
                gifLink: gifLink
            });
        };
    });

    // Creating event listener for gif search box
    $("#gif-search").on("click", gifSearch);
    // Creating event listener for gif submit button "Pick Me"
    $(document).on("click", ".player-pick", gifSubmit);
    // Event listener for vote button
    $(document).on("click", ".vote-button", voteFunction)

    // gifSearch Function
    function gifSearch(e) {
        // Prevent default action of submitting form
        e.preventDefault();
        // Emptying the player's gifs from previous searches.
        $("#player-gif-dump").empty();
        // Declaring a variable to store the user's search.
        var search = $("#gif-input").val().trim();
        // Creating queryURL for Giphy
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + search + "&api_key=bT0Bfggu7F3mM9Jgkebl5gAoWCvoHzi9&limit=5";
        // Setting Up AJAX Call to giphy api
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            // Creating a variable to get access to the response JSON data
            var data = response.data;
            // Referencing the player's gif dump
            var playerGifs = $("#player-gif-dump");
            // Looping through the JSON data
            for (var i = 0; i < data.length; i++) {
                // Creating a variable to access the gifs URL
                var gifURL = response.data[i].images.fixed_width_small.url;
                // Creating a variable that creates an HTML button element to submit the desired gif
                var submitGif = $("<button>").addClass("btn btn-dark player-pick").attr("id", playerName);
                submitGif.attr("gifURL", gifURL);
                submitGif.text("Pick Me");
                // Creating a variable that creates an HTML image element with the source of the gif
                var gifHolder = $("<img>").attr("src", gifURL);
                // Append everything
                gifHolder.append(submitGif);
                playerGifs.append(gifHolder, submitGif);
            }
        });
    };

    // gifSubmit function
    function gifSubmit() {
        // Empty the players gif dump
        $("#player-gif-dump").empty();
        database.ref().child("players/" + playerName).update({
            gifLink: $(this).attr("gifURL")
        });
        // Make firebase reference
        database.ref("gifs/").push({
            gifpick: $(this).attr("gifURL")
        });

    };

    database.ref("gifs/").on('child_added', function (childsnapshot) {
        var voteBtn = $("<button>").addClass("btn btn-dark vote-button customButton");
        voteBtn.text("Vote For Me");
        voteBtn.attr("pick", childsnapshot.val().gifpick)
        console.log("Gifs childsnapshot : " + childsnapshot.val().gifpick);
        var newHolder = $("<img>").attr("src", childsnapshot.val().gifpick);
        var gifDiv = $("<div>").append(newHolder)
        gifDiv.append(voteBtn);
        $("#community-gif-dump").append(gifDiv);

    });

    function voteFunction() {
        // create a variable that references an attribute on the clicked vote button. The attribute's value is gifpick
        var pick = $(this).attr("pick");
        // create a variable to register vote counts. set it to 0 so that each vote only counts as one point
        var vote = 0

        database.ref().once("value", function (snapshot) {
            // create a variable to reference snapshot object
            var dbObj = snapshot.val();
            // create a variable to reference the players key
            var players = dbObj.players;
            // loop through all of the players and retrieve their name and gifLink
            for (var key in players) {
                // If the pick matches any of the gifs, then the correct user should recieve a vote
                if (pick === players[key].gifLink) {
                    // Increment voteCount of specific player
                    vote = parseInt(players[key].voteCount) + 1;
                    // Update player's votecount on database
                    database.ref("players/" + players[key].Name).update({
                        voteCount: vote
                    })
                }
            }
        });
    };


   
    $(document).on("click", "#newRoundButton", function () {
        database.ref().child("players/" + playerName).update({
            status: 'Ready'
        })
        $("#newRoundButton").hide();
        $("#gif-holder").css("display", "block")
    })

    
    function startGame() {
        console.log("Start Game Function Ran")
        countDown();
        $("#blackCardText").empty();
        $("#community-gif-dump").empty();
        callQuestion();
    }


    function pickQuestion() {
        var queryURL = "https://api.myjson.com/bins/19wq0e";
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            var blackCardsLen = response.blackCards.length
            var randomIdx = Math.floor(Math.random() * (blackCardsLen + 1))
            var text = response.blackCards[randomIdx].text
            var pick = response.blackCards[randomIdx].pick;

            // Function that sets and rewrites question when new question is generated
            function setquestion() {
                database.ref('question/').set({
                    cardquestion: text,
                })
            };

            // Pushes question to database when button is clicked
            setquestion();
        })
    }

    var blackCardImg = $("#imgg");    
    function callQuestion() {
        blackCardImg.animate({
            height: "80px"
        });
        database.ref('question/').child("cardquestion").on('value', function (snapshot) {
            console.log("Question Snapshot: " + snapshot.val());
            $("#blackCardText").html(snapshot.val());
            
        })
    }

    // Created variable to reference the set timeout(progressGame) so we can clear it when the game ends
    var setTimeOutPG;
    function countDown() {
        counter--;
        $("#timer").html(counter);
        if (!timerRunning) {
            timeId = setInterval(countDown, 1000);
            timerRunning = true;
        };
        gameOver();
        if (counter == 0) {
            $("#timer").html("Time to vote!")
            clearInterval(timeId);
            timerRunning = false;
            blackCardImg.animate({
                height: ".05px"
            });
            setTimeOutPG = setTimeout(progressGame, 5000);
            setTimeout(progressGame, 5000)
        }
    }

    function progressGame() {
        console.log("Progress Game Ran")
        pickQuestion();
        $("#community-gif-dump").empty();
        $("#gif-input").val("");
        database.ref("gifs/").remove();
        votes = 1;
        counter = 30;
        callQuestion();
        countDown();
    };

    
    // Setting the StartGame Status in Firebase. If there are 3 or more ready players the game starts.
    database.ref("players/").on("value", function (snapshot) {
        var playerNamesObject = snapshot.val();
        var playernames = Object.keys(playerNamesObject);
        var numPlayers = playernames.length;
        var sum = 0;
        var readyValueArray = []
        for (i = 0; i < numPlayers; i++) {
            var playerStatus = playerNamesObject[playernames[i]].status
            var readyValue;

            if (playerStatus == "Ready") {
                readyValue = 1
                readyValueArray.push(readyValue)
            } else {
                readyValue = 0
                readyValueArray.push(readyValue)
            }

            sum += readyValueArray[i]
        }
        if (numPlayers == 1) {
            database.ref('StartGame/').update({
                Status: "No",
            })
        }
        if (numPlayers >= 3 && sum == numPlayers) {
            database.ref('StartGame/').update({
                Status: "Yes",
            })
        }

    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

    // Runs the game if the startGame stat is equal to yes in firebase
    database.ref("StartGame/").on("value", function (snapshot) {
        var startGameStat = snapshot.val().Status;
        console.log(startGameStat)
        if (startGameStat == "Yes") {
            startGame();
        }
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });


    // Stop time when game ends
    function stopTime() {
        clearInterval(timeId);
    }

    // // End game 
    function gameOver() {
        console.log("Timer Running from game over: " + timerRunning)
        // Set up variable to reference all players in database
        var dbPlayers = database.ref("players/").orderByKey();
        // Looping through the snapshot data
        dbPlayers.once("value")
        .then(function(snapshot) {
            snapshot.forEach(function(childsnapshot) {
                // Creating a variable to access data, the players Names and vote counts
                var playersData = childsnapshot.val();
                var dvpName = playersData.Name;
                var dbpVotes = playersData.voteCount;
                // If any player has 10 or more votes, stop the timers, replace the text with winnter text and change firebse Startgame to no
                if(dbpVotes >= 10) {
                    timerRunning = false
                    stopTime();
                    console.log("Player " + dvpName + " wins with " + dbpVotes + " votes!");
                    $("#blackCardText").html("Player " + dvpName + " wins with " + dbpVotes + " votes!");
                    $("#timer").html("");
                    if (!timerRunning) {
                        timeId = setInterval(countDown, 1000);
                        clearInterval(timeId);
                        clearInterval(setTimeOutPG);
                    };
                    database.ref('StartGame/').update({
                        Status: "No",
                    })
                } 

            })
        })
    }


});