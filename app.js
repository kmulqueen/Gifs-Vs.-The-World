$(document).ready(function () {
    var blackCardImg = $("#imgg");
    console.log("linked");

    // ============================================================================ GIF SECTION =====================================================================================

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
            $("#player-name").prepend(playerName);
            $("#player-name-form").hide();
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
            console.log(response.data);
            // Referencing the player's gif dump
            var playerGifs = $("#player-gif-dump");
            // Looping through the JSON data
            for (var i = 0; i < data.length; i++) {
                // Creating a variable to access the gifs URL
                var gifURL = response.data[i].images.fixed_width_small.url;
                // Creating a variable that creates an HTML button element to submit the desired gif
                var submitGif = $("<button>").addClass("btn btn-dark player-pick");
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
    var votes = 1;
    // gifSubmit function
    function gifSubmit() {
        // Empty the players gif dump
        $("#player-gif-dump").empty();
        // Create a variable that creates an HTML image element with the source of the gif
        var submittedGifHolder = $("<img>").attr("src", $(this).attr("gifURL"));
        submittedGifHolder.addClass("submitted");
        // Create a vote button to append to the gif
        var voteBtn = $("<button>").addClass("btn btn-dark vote-button customButton");
        voteBtn.text("Vote For Me");
        // Append button to submitted gif holder
        submittedGifHolder.append(voteBtn);
        // Display the chosen gif into the community gif dump
        var gifDiv = $("<div>").append(submittedGifHolder, voteBtn);
        gifDiv.addClass("customGif");
        $("#community-gif-dump").append(gifDiv);
        $("#community-gif-dump").append(submittedGifHolder, voteBtn);
        // Update gifLink
        database.ref().child("players/" + playerName).update({
            gifLink: $(this).attr("gifURL")
        });
        // Make firebase reference
        database.ref("gifs/").push({
            gifpick: $(this).attr("gifURL")
        })
        // update page
        database.ref("gifs/").on('child_added', function(childsnapshot) {
            console.log("Gifs childsnapshot : " + childsnapshot.val().gifpick);
            var newHolder = $("<img>").attr("src", childsnapshot.val().gifpick);
            $("#community-gif-dump").append(newHolder);
        })
        // Update gifs on page hopefully
        database.ref("players/").child('gifLink').on("value", function(snapshot) {
            console.log("gifLink snapshot : " + snapshot.val());
            $("community-gif-dump").append(snapshot.val());
        })
        
        voteBtn.on("click", function () {
            console.log("votes" + votes);
            database.ref().child("players/" + playerName).update({
                voteCount: votes
            })
            votes++;
            voteBtn.hide();
        })



    };




    // ======================================================================== CARD SECTION ===================================================================================
    $(document).on("click", "#newRoundButton", function () {

        database.ref().child("players/" + playerName).update({
            status: 'Ready'
        })

        $("#newRoundButton").hide();



    })

    // ==================================================START GAME SECTION =============================================================================

    function startGame() {

        countDown();

        $("#blackCardText").empty();
        $("#community-gif-dump").empty();
        var queryURL = "https://api.myjson.com/bins/19wq0e";
        var blackCard = 0;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            var blackCardsLen = response.blackCards.length
            var randomIdx = Math.floor(Math.random() * (blackCardsLen + 1))
            var text = response.blackCards[randomIdx].text
            var pick = response.blackCards[randomIdx].pick;
            // console.log("picked " + pick);
            // console.log(blackCardsLen)
            // console.log(response.blackCards[randomIdx]);
            // !!!!!!!! I tried to make it that it would only choose cards that had a pick one, didnt work, we may have to find a way to append two gifs to one vote button
            if (pick > 1) {
                blackCardsLen++;
            }


            // Function that sets and rewrites question when new question is generated
            function setquestion() {
                database.ref('question/').set({
                    cardquestion: text,
                })
            };


            // Pushes question to database when button is clicked
            setquestion();
            callQuestion();

            // var questionText = database.ref('question/' + cardquestion)
            // console.log(questionText)

            // $("#blackCardText").append(questionText);



        })

    }

    function pickCard(){
        
    }

    function callQuestion() {
        database.ref('question/').child("cardquestion").on('value', function (snapshot) {
            console.log("Question Snapshot: " + snapshot.val());
            $("#blackCardText").html(snapshot.val());
        })
    }

    function countDown() {
        // console.log(counter);
        counter--;
        $("#timer").html(counter);
        if (!timerRunning) {
            timeId = setInterval(countDown, 1000);
            timerRunning = true;
        };
        if (counter == 0) {
            $("#timer").html("Time to vote!")
            $("#blackCardText").html("Winner won!");
            clearInterval(timeId);
            timerRunning = false;
            blackCardImg.animate({
                height: "80px"
            });
            setTimeout(progressGame, 4500)
        }
    }

    function progressGame() {
        $("#community-gif-dump").empty();
        $("#gif-input").val("");
        votes = 1;
        counter = 30;
        callQuestion();
        countDown();
    };

    database.ref("players/").on("value", function (snapshot) {

        console.log(playerName);
        var playerNamesObject = snapshot.val();
        var playernames = Object.keys(playerNamesObject);
        numPlayers = playernames.length;
        console.log(playerNamesObject);
        console.log(playernames);
        console.log(numPlayers);
        var sum = 0;
        var readyValueArray = []
        for (i = 0; i < numPlayers; i++) {
            console.log(playerNamesObject[playernames[i]].status)
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
        console.log(readyValueArray)
        console.log(sum)
        console.log(numPlayers)
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

    database.ref("StartGame/").on("value", function (snapshot) {
        var startGameStat = snapshot.val().Status;
        console.log(startGameStat)
        if (startGameStat == "Yes") {
            startGame();
        }
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });



});