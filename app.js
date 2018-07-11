$(document).ready(function () {
    console.log("linked");

    // ============================================================================ GIF SECTION =====================================================================================
    // Declaring a variable to store the user's search.
    var gif = $("#gif-input").val().trim();
    // Creating queryURL for Giphy
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + gif + "&api_key=bT0Bfggu7F3mM9Jgkebl5gAoWCvoHzi9";
    // Setting Up AJAX Call to giphy api
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        // Creating a variable to get access to the response JSON data
        var data = response.data;
        // Referencing the player's gif dump
        var playerGifs = $("#player-gif-dump");
    });

    // ======================================================================== CARD SECTION ===================================================================================
    $(document).on("click", "#newRoundButton", function () {

        var queryURL = "https://api.myjson.com/bins/19wq0e";
        var blackCard = 0;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            var blackCardsLen = response.blackCards.length
            var randomIdx = Math.floor(Math.random() * (blackCardsLen + 1))
            var text = response.blackCards[randomIdx].text
            console.log(blackCardsLen)
            console.log(response.blackCards[randomIdx]);
            // for (var i = 0; i < response.blackCards.length; i++) {
            //     response.blackCards[i];
            //     console.log(response.blackCards[i].text)
            // }

            // var blackCardText = $("<p>");
            // blackCardText.attr("id", "blackText");
            // blackCardText.attr(response.blackCards[randomIdx])
            // $("#blackText").append(text);

            $("#blackCardText").append(text);

        })
    })




    // ======================================================================== UNDECLARED SECTION =============================================================================













});