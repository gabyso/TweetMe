//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const Twitter = require('twitter');

const app = express();

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// creates user based authetication
const client = new Twitter({
  consumer_key: process.env.API_key,
  consumer_secret: process.env.API_Secrets,
  access_token_key: process.env.Access_token,
  access_token_secret: process.env.Access_token_Secrets
});

//*********************** functions ***********************

// display tweets as simple HTML
function showTweets(tweet, res){
  res.write('<html><body>');
  for(var i = 0; i < tweet.length; i++){
    res.write("<h1>" + tweet[i].text + "</h1>");
  }
  res.write('<form action="/" method="get"><button>Back</button></form></body></html>');
  res.end();
}

// using Twitter API to get list of the last 20 tweets if there is more than 20 from a spesific user's wall
function getTweets(res, ui){
  client.get('statuses/user_timeline', {count: 20}, function(error, tweet, response) {
    if (error){
      res.sendFile(__dirname, "/public/HTML/failure.html");
    }
    else if(ui){ // if the request is from the UI
      showTweets(tweet, res); // shows tweets in a simple html
    }
    else {
      res.json(tweet); // sends back a JSON file
    }
  });
}

// using Twitter API to Tweet into spesific user's wall
function sendTweets(message, res, ui){

  client.post('statuses/update', {
    status: message
  }, function(error, tweet, response) {
    if (error) {
      if(ui) res.sendFile(__dirname, "/public/HTML/failure.html");
      else res.send("Sorry, there is an error with the twitter-API");
    }
    else{
      var status = response.statusCode;

      res.status = status; //set the HTML status code to response

      if(ui){ // if the request is from the UI
        if(status === 200){
          res.sendFile(__dirname + "/public/HTML/success.html");
        } else res.sendFile("/public/HTML/failure.html");
      }
      else if(status === 200){  // if the request was not from the UI
        res.send("Wowwwwww what a brillient tweet!!");
      }
      else res.send("Error, Status Code:" + status);
    }
  });
}

//*********************** GET request ***********************

// UI
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/public/HTML/index.html");
});

//list of tweets for  the UI
app.get("/show-list", function(req, res) {
  getTweets(res, true);
});

//list of tweets as JSON
app.get("/list-JSON", function(req, res) {
  getTweets(res, false);
});

//*********************** POST request ***********************

// tweet UI
app.post("/tweet-ui", function(req, res) {
  var message = req.body.msg;
  sendTweets(message, res, true);
});

// tweet without UI
app.post("/tweet", function(req, res) {
  var message = req.body.msg;
  sendTweets(message, res, false);
});


app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running!");
});
