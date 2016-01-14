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

var http = require('http'); //the variable doesn't necessarily have to be named http

guardian.config({
  apiKey: process.env.GUARDIAN_KEY
});


guardian.content({
  q: 'clowns',
}).then(function(response) {

  var desiredResults = 5;
  var totalPages = response.response.pages;
  var currentPage = response.response.page;
  var results = response.response.results;
  cache.put('houdini', 'disappear', 100000); // Time in ms

  var responseData;

  for (var i in results) {
    if(i >= desiredResults){
      break;
    }
    // responseData.response_type = 
    console.log(results[i].webUrl)
  }

  // res.send()
}, function(err) {
  console.log(err);
});


app.post('/', function(req, res) {



})




var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
