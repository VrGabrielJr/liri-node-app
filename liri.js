require("dotenv").config();

var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var keys = require("./keys.js");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var command = process.argv[2];
var input = process.argv;
var item = "";

//Gathers third process.argv argument User Input With multiple Spaces
for (var i = 3; i < input.length; i++) {
    if (i > 3 && i < input.length) {
        item = item + "+" + input[i];
    } else {
        item += input[i];
    };
};
 
function main()
{
    switch(command)
    {  
        
        case "my-tweets":
            getTweets();
            break;
        
        case "spotify-this-song":
            if (item == "")
            {
                searchDefault();
            }
            else
            {
                spotifyThis();
            }
            break;

        case "movie-this":
            if (item == "")
            {
                movieThis("Mr.Nobody");
            }
            else
            {
                movieThis(item);
            }
            break;

        case "do-what-it-says":
            doIt();
    }
}

//Twitter Function
function getTweets()
{
    var params = {
        q: 'oxkillz',
        count: 20
    };

    client.get("search/tweets", params, function(error, tweets, response){
        if (!error)
        {
            console.log("\n------------------------------------------------------");
            console.log("\n--------------------TWITTER TWEETS--------------------\n");
            console.log("------------------------------------------------------\n");
            for (var i = 0; i < tweets.statuses.length; i++) {
                var tweetText = tweets.statuses[i].text;
                console.log("Tweet Text: [DATE: " + tweets.statuses[i].created_at + 
                            "]: " + tweetText +"\n");
            }
            console.log("------------------------------------------------------");
            console.log("\n-----------------------END TWEETS---------------------\n")
            console.log("------------------------------------------------------");
            //console.log(response);
            //console.log(tweets);
        }
        else
        {
            console.log("error");
        }
    })
}

//Spotify Function
function spotifyThis()
{
    var params = {
        type: 'track',
        query: item
    }

    spotify.search(params , function(error, data) {
        if (!error)
        {
            var artistsArr = [];


            for (var i = 0; i < data.tracks.items[0].album.artists.length; i++) {
                artistsArr.push(data.tracks.items[0].album.artists[i].name);
            }

            var artists = artistsArr.join(", ");
            console.log("\n------------------------------------------------------");
            console.log("\n--------------------Spotify Results-------------------\n")
            console.log("------------------------------------------------------\n");
            console.log("Artist(s): " + artists + "\n\n" +
                        "Song: " + data.tracks.items[0].name + "\n\n" +
                        "Spotify Preview URL: " + data.tracks.items[0].preview_url + "\n\n" +
                        "Album Name: " + data.tracks.items[0].album.name + "\n");
            console.log("------------------------------------------------------");
            console.log("\n----------------------END RESULTS---------------------\n")
            console.log("------------------------------------------------------");

        }
        else
        {
            console.log(error);
        }    
            
    })
}

//DEFAULT SPOTIFY SEARCH
function searchDefault()
{
    var params = {
        type: 'track',
        query: "the+sign+ace+of+base"
    }

    spotify.search(params , function(error, data) {
        console.log("\n------------------------------------------------------");
        console.log("\n--------------------Spotify DEFAULT-------------------\n")
        console.log("------------------------------------------------------\n");
        console.log("Artist[s]: " + data.tracks.items[0].album.artists[0].name + "\n\n" +
                    "Song: " + data.tracks.items[0].name + "\n\n" +
                    "Spotify Preview URL: " + data.tracks.items[0].preview_url + "\n\n" +
                    "Album Name: " + data.tracks.items[0].album.name + "\n");
        console.log("------------------------------------------------------\n");
        console.log("-----------------------END RESULTS--------------------\n")
        console.log("------------------------------------------------------");
    })
}

//MOVIE THIS FUNCTION
function movieThis(movie)
{
    var apiKey = "df9949b5";
    var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=" + apiKey;
    request(queryUrl, function(error, response, body) 
    {
        if (!error && response.statusCode === 200) 
        {
          var movie = JSON.parse(body);
          console.log("\n------------------------------------------------------");
          console.log("\n--------------------MOVIE RESULTS!--------------------\n");
          console.log("------------------------------------------------------\n");
          console.log("Movie Title: " + movie.Title + "\n\n" +
                      "Release Year: " + movie.Year + "\n\n" +
                      "Actors: " + movie.Actors + "\n\n" +
                      "Made in: " + movie.Country + "\n\n" +
                      "Language: " + movie.Language + "\n\n" +
                      "IMDB Rating: " + movie.imdbRating + "\n\n" +
                      "Rotten Tomatoes Rating: " + movie.Ratings[2].Value + "\n\n" +
                      "Plot: " + movie.Plot);
          console.log("\n------------------------------------------------------");
          console.log("\n---------------------END RESULTS!---------------------\n")
          console.log("------------------------------------------------------");
        }
    });
}

function doIt()
{
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (!error) 
        {
            var toDo = data.split(",");
            command = toDo[0];
            item = toDo[1];
            main();
        } 
        else 
        {
            console.log(error);
		}
	});
}

main();
