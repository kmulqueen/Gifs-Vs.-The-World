$(document).ready(function () {
    var numPlayers = 0;
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


   

    // Attaches submit player function to ready button
    $("#ready-button").on("click", submitPlayer)

    // Submit Player function
    function submitPlayer(p) {

        p.preventDefault();

        // Declare variable for Player Name
        var playerName = $("#player-name-input").val().trim();
              

        if (playerName.length > 0) {

            // Replaces name form with actual name
            $("#player-name").prepend(playerName);
            $("#player-name-form").hide();
            pushPlayer();
     }
    //  added number of players if it isn't 3 or more game wont start
        numPlayers++;
    }



    function pushPlayer(playerName) {
         
    };
    var playerName = $("#player-name-input").val().trim();
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
            var votes = 0;
    // gifSubmit function
    function gifSubmit() {
        // Empty the players gif dump
        $("#player-gif-dump").empty();
        // Create a variable that creates an HTML image element with the source of the gif
        var submittedGifHolder = $("<img>").attr("src", $(this).attr("gifURL"));
        submittedGifHolder.addClass("submitted");
        // Create a vote button to append to the gif
        var voteBtn = $("<button>").addClass("btn btn-dark vote-button");
        voteBtn.text("Vote For Me");
        // Append button to submitted gif holder
        submittedGifHolder.append(voteBtn);
        // Display the chosen gif into the community gif dump
        $("#community-gif-dump").append(submittedGifHolder, voteBtn);
        voteBtn.on("click",function(){
            console.log("votes" + votes);
            votes++;
        })
           
        

    };




    // ======================================================================== CARD SECTION ===================================================================================
    $(document).on("click", "#newRoundButton", function () {
        // !!!!!!!!!!!!!!!-----!!!this is making sure 3 people are playing, for coding purposes im making it zero but before we final this we need to change it to 3!
     
        if(numPlayers = 0){
            $("#blackCardText").html("You need 3 people or more to play this game!")
        } else{
            startGame();
            
        }


       
    })

    // ==================================================START GAME SECTION =============================================================================



        function startGame(){
          
            var timeStart = setInterval(function(){countDown(),counter}, 1000);
            counter = 30;
            function countDown() {
               console.log(counter);
               counter--;
               $("#timer").html(counter);
               if (counter == 0){
                $("#timer").html("Time to vote!")
                clearInterval(timeStart);
                voteTime();
                }
           }
           function stopTime(){
               clearInterval(timeStart);
           }
         
                  $("#blackCardText").empty()
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
            console.log("picked " + pick);
            console.log(blackCardsLen)
            console.log(response.blackCards[randomIdx]);
            // !!!!!!!! I tried to make it that it would only choose cards that had a pick one, didnt work, we may have to find a way to append two gifs to one vote button
            if (pick > 1){
                blackCardsLen++;
            }
            $("#blackCardText").append(text);

        })
    }
    function voteTime(){
        blackCardImg.animate({ height: "1px"  });
        var timeStart = setInterval(function(){countDown(),counter}, 1000);
        counter = 15;
        function countDown() {
            console.log(counter);
            counter--;
            $("#timer").html(counter);
            if (counter == 0){
                blackCardImg.animate({ height: "80px"  });
                clearInterval(timeStart);
                $("#blackCardText").html(playerName +" won!");
                // !!! tried to clear the imput but didnt work :/
                $("#gif-imput").val("");
                $("#community-gif-dump").empty();
                votes=0;
             startGame();
         // !!!!!!!  voting countdown,we need to change the if statement, im just seeing that it works
            // also we need to change votes=1 cause the first press is 0
        }else if (votes > 2){
       
                // $(this).playerWins++;
                blackCardImg.animate({ height: ".001px"  });
            
                $("#blackCardText").html(playerName +" won!");
         // this doesnt work either, may need some firebase^^ 
                votes=0;
                 
            }
            }
            timeStart; 
        }
     
       
      
  
    


 










});