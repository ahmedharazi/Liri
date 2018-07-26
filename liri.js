require("dotenv").config();

var keys = require('./keys');
// var dotEnv = require("dotenv");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var getMyTweets = function () {

    var params = {
        screen_name: 'intracker',
        count: 5
    };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            // console.log(tweets);
            for (var i = 0; i < tweets.length; i++) {
                console.log(tweets[i].created_at);
                console.log(' ');
                console.log(tweets[i].text);
            }
        }

    });
};

var searchSong = function (song) {
    if (!song) {
        song = "";
    }
    spotify.search({
        type: 'track',
        query: song,
        limit: 1
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log("\nArtist: " + data.tracks.items[0].artists[0].name);
        console.log("\nSong name: " + data.tracks.items[0].name);
        console.log("\nPreview Link: " + data.tracks.items[0].preview_url);
        console.log("\nAlbum: " + data.tracks.items[0].album.name);
    });
}


var getMyMovie = function () {
    var nodeArgs = process.argv;
    var movieName = "";
    for (var i = 2; i < nodeArgs.length; i++) {
        if (i > 2 && i < nodeArgs.length) {
            movieName = movieName + "+" + nodeArgs[i];
        } else {
            movieName += nodeArgs[i];
        }

        var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";


        request(queryUrl, function (error, response, body) {

            // If the request is successful
            if (!error && response.statusCode === 200) {
                var jsonData = JSON.parse(body);
                console.log('Title: ' + jsonData.Title);
                console.log('Year: ' + jsonData.Year);
                console.log('IMDB Rating: ' + jsonData.imdbRating);
                console.log('Country: ' + jsonData.Country);
                console.log('Language: ' + jsonData.Language);
                console.log('Plot: ' + jsonData.Plot);
                console.log('Actors: ' + jsonData.Actors);
            }

        });
    }
};



var pick = function (caseData, functionData) {
    switch (caseData) {
        case 'my-tweets':
            getMyTweets();
            break;
        case 'spotify-this-song':
            searchSong(functionData);
            break;
        case 'movie-this':
            getMyMovie(functionData);
        default:
            console.log('LIRI does not know that');

    }
}
var runThis = function (argOne, argTwo) {
    pick(argOne, argTwo);
};

runThis(process.argv[2], process.argv[3]);