//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

const PORT = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  var name = req.body.fName;
  var last = req.body.lName;
  var email = req.body.email;

  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: name,
          LNAME: last
        }
      }
    ]
  };

  var jsonData = JSON.stringify(data);

  var options = {
    url: "https://us7.api.mailchimp.com/3.0/lists/aa4a4f68ee",
    method: "POST",
    headers: {
      "Authorization": "gaby1 008266b0fd2df83ae38880c8415def05-us7"
    },
    body: jsonData
  };

  request(options, function(err, response, body){
    if(err || response.statusCode !== 200) {
      res.sendFile(__dirname + "/failure.html");
    }
    else {
      res.sendFile(__dirname + "/success.html");
    }
  })
});

app.post("/failure", function(req, res){
  res.redirect("/");
});

app.listen(process.env.PORT || PORT, function(){
  console.log("Server is running");
});

//API key
// 008266b0fd2df83ae38880c8415def05-us7

//list ID
// aa4a4f68ee
