require('dotenv').load();
var express = require('express');
var request = require('request');
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

  fetchArticles(req,res,0,1);

})

function fetchArticles(req, res,responsesSent,page){
  var desiredResults = 5;
  guardian.content({
    page:page,
    pageSize: desiredResults*10,
    q: req.body.text
  }).then(function(response) {

    var totalPages = response.response.pages;
    var currentPage = response.response.currentPage;
    var results = response.response.results;

    while (results.length > 0) {
      var currentResult = results.shift();
      if(responsesSent >= desiredResults){
        break;
      }

      var webUrl = currentResult.webUrl;
      if (cache.get(webUrl) == null){
        cache.put(webUrl, webUrl, 1000000); // Time in ms (10s)
        var responseURL = req.body.response_url;


        var options = {
          uri: responseURL,
          method: 'POST',
          json: {
            "text": webUrl
          }
        };

        request(options, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            console.log(response) // Print the shortened url.
          }
          else{
            console.log(error);
            console.log(response.statusCode);
          }
        });

console.log("chansey");
        responsesSent +=1;
      }
    }

    if(responsesSent < desiredResults && currentPage < totalPages){
      fetchArticles(req, res,responsesSent,currentPage+1);
    }else{
      res.send();
    }
  }, function(err) {
    console.log(err);
  });
}


var port = Number(process.env.OPENSHIFT_NODEJS_PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
