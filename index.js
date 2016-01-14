var express = require("express");
var app = express();
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
var cache = require('memory-cache');
var guardian = require('guardian-news');

var http = require('http'); //the variable doesn't necessarily have to be named http

app.post('/', function(req,res){
  cache.put('houdini', 'disappear', 100000) // Time in ms
})

guardian.config({
  apiKey : process.env.GUARDIAN_KEY
});


var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
           console.log("Listening on " + port);
           });
