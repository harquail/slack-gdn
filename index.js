require('dotenv').load();
var express = require("express");
var app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({
  extended: true
}));
var cache = require('memory-cache');
var guardian = require('guardian-news');
var http = require('http');

guardian.config({
  apiKey: process.env.GUARDIAN_KEY
});

app.post('/', function(req, res) {

  var desiredResults = 5;
  var responsesSent = 0;
  
  guardian.content({
    page:1,
    pageSize: 50,
    q: req.body.text
  }).then(function(response) {

    var totalPages = response.response.pages;
    var currentPage = response.response.currentPage;
    var results = response.response.results;

console.log("hiya");

    // var responseData;
    // var i = 0;
    while (results.length > 0) {
      var currentResult = results.shift();
      // console.log(currentResult);
      if(responsesSent >= desiredResults){
        break;
      }

      var webUrl = currentResult.webUrl;
      if (cache.get(webUrl) == null){
        console.log(webUrl)
        cache.put(webUrl, webUrl, 1000000); // Time in ms (10s)
        // i += 1;
        responsesSent +=1;
      }
      else{
        console.log("+ already visited: " + webUrl);
        // i += 1;
      }

    }
    console.log("page " + currentPage + " of "+ totalPages);


    res.send()
  }, function(err) {
    console.log(err);
  });

})


var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
