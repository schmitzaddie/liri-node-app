require("dotenv").config();
var Spotify = require("node-spotify-api");
var keys = require("./keys.js");
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");


moment().format();

var request = process.argv[2];
var item = process.argv.slice(3);
var search = item.join("+");
var bandsURL = "https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp";
var omdbURL = "http://www.omdbapi.com/?t=" + search + "&apikey=triology";

function bandsSearch() {
    axios.get(bandsURL).then(
        function (response) {
            console.log("\n" + response.data[0].lineup);
            console.log("\n--Concert Info--");
            console.log("Venue: " + response.data[0].venue.name);
            console.log("Where: " + response.data[0].venue.city + ", " + response.data[0].venue.region);
            console.log("When: " + moment(response.data[0].datetime).format("L"));
            console.log("---------------");
        }
    );
}

function spotifySearch() {
    var keys = require("./keys.js");
    var spotify = new Spotify(keys.spotify);
    var song = item;

    if (item.length < 1) {
        song = "The Sign - Ace of Base";
    }

    spotify.search({ type: "track", query: song}, function(err, data) {
        if (err) {
            console.log("Uh Oh! Error: " + err);
        }
        console.log("\n" + data.tracks.items[0].name + " - " + data.tracks.items[0].artists[0].name);
        console.log("\n--Song Info--");
        console.log("Artist: " + data.tracks.items[0].artists[0].name);
        console.log("Check it out: " + data.tracks.items[0].album.external_urls.spotify);
        console.log("Album: " + data.tracks.items[0].album.name);
        console.log("---------------");
    });
}

function omdbSearch() {

    // if (item.length < 1) {
    //     console.log("Mr. Nobody");
    // }

    axios.get(omdbURL).then(
        function(response) {
            console.log("\n" + response.data.Title + " (" + response.data.Year + ")");
            console.log("\n--Movie Info--");
            console.log("Rating: " + response.data.imbdRating);
            console.log("Rotten Tomatoes Says: " + response.data.rottenRating);
            console.log("Country: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Actors: " + response.data.Actors);
            console.log("Plot: " + response.data.Plot);
            console.log("---------------");
        }
    );
}

if (request === "spotify-this") {
    spotifySearch();
}

else if (request === "concert-this") {
    bandsSearch();
}

else if (request === "movie-this") {
    omdbSearch();
}

else if (request === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) { console.log(err); }
        console.log(data);
        var dataArr = data.split('"');
        request = dataArr[0];
        item = dataArr[1];
        spotifySearch();
    });
}
