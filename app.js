$(document).ready(function() {
console.log("linked");
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














    
});