require('dotenv').load();
var Promise = require('promise');
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
  apiKey: process.env.GUARDIAN_KEY || ""
});

app.get('/', function(req, res) {
  res.send("visited urls: " + cache.keys().toString());
})
app.post('/', function(req, res) {
  fetchArticles(req, res, 0, 1);
})

function postArticleToSlack(url, title, articleUrl) {
  var options = {
    uri: url,
    method: 'POST',
    json: {
      "text": title + ": " + articleUrl,
      "response_type": "in_channel",
      "unfurl_links": "true"
    }
  };
  // console.log("mid-post")

  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(response) // Print the shortened url.
    } else {
      console.log(error);
    }
  });
}

function fetchArticles(req, res, responsesSent, page) {

  var splitText = req.body.text.split(/[ ,]+/);
  var lastWord = splitText.pop();
  var lastWordAsInt = parseInt(lastWord);

  var desiredResults = 1;

  var query = req.body.text;
  if(lastWordAsInt && lastWordAsInt <= 5){
    desiredResults = Math.min(lastWordAsInt,5);
    query = splitText.join(" ");
  }
  // console.log(query);

  guardian.content({
    page: page,
    pageSize: desiredResults * 10,
    q: query
  }).then(function(response) {
    var totalPages = response.response.pages;
    var currentPage = response.response.currentPage;
    var results = response.response.results;

    while (results.length > 0) {
      var currentResult = results.shift();
      if (responsesSent >= desiredResults) {
        break;
      }
      // console.log(currentResult);
      var webUrl = currentResult.webUrl;
      var webTitle = currentResult.webTitle;
      if (cache.get(webUrl) == null) {
        cache.put(webUrl, webUrl, 1000000); // Time in ms (10s)
        var responseURL = req.body.response_url;

        // console.log("before post");
        postArticleToSlack(responseURL,webTitle,webUrl);
        // console.log("after post");

        responsesSent += 1;
      }
    }

    if (responsesSent < desiredResults && currentPage < totalPages) {
      fetchArticles(req, res, responsesSent, currentPage + 1);
    } else {
      res.send();
    }
  }, function(err) {
    console.log(err);
  });
}

// var port = Number();
app.set('port', process.env.PORT || 5000);
// app.set('ip', process.env.IP || "127.0.0.1");
app.listen(app.get('port'), function() {
  console.log("Listening on " + app.get('port'));
});
