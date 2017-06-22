var express = require('express');
var router = express.Router();
var request = require('request');
var url = require('url');

var app = express();

/*
var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: '9M3GTJkryPoPO0I91sMl7IcjB',
  consumer_secret: '9z2HKb7Qx8YKtrS5jeBTRSpiQTHmmmNHHFB2XvcpvizyMLHvSe',
  access_token_key: '876821003103592449-Hr5V4R5lX9vZHGL6bdwWyC4WrSBuQrA',
  access_token_secret: 'idMwqdfLU60uqznfgEyLoJ0sThYjuXNzTJuCira0aUWAT',
  request_options: {
    proxy: 'http://bluecoat-proxy:8080'
  }
});
*/

/* GET user timeline */
router.get('/:screen_name', function(req, res, next) {
	var screenName = req.params.screen_name;
	var count = req.query.count;

	var options = {
	    protocol: "http:",
	    host: 'localhost:7890',
	    pathname: '/1.1/statuses/user_timeline.json',
	    query: { screen_name: screenName, count: count },
	}

	var twitterUrl = url.format(options);

	/*
	request(twitterUrl, function(err, res, body) {
	  if (!err) {
	    app.render('index', { listTweets: body });
	  }
	});
	*/
	request(twitterUrl, processTweets); 
  
	function processTweets(err, res1, body) {
	  var tweets = JSON.parse(body);
	  var c = 0, list = [];
	  
	  for (var i = 0; i < tweets.length; i++) {
	    var tweet = tweets[i];
	    var tweetUrl = tweet.entities.urls[0].url;
	    list.push({text: tweet.text, created_at: tweet.created_at, url: tweetUrl});
	  }
	  
	  res.render('tweets', { title: 'Tweets', listTweets: list});
	}
	/*
	client.get('statuses/user_timeline', {count: req.params.count, screen_name: req.params.screen_name}, function(error, tweets, response) {
	  if (!error) {
		res.render('index', { listTweets: tweets })
	  } else {
	    res.send('error');
	  }
	});
	*/
});

module.exports = router;
