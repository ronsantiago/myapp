var express = require('express');
var router = express.Router();
var request = require('request');
var url = require('url');

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
	/*
	client.get('statuses/user_timeline', {screen_name: req.params.screen_name, count: req.query.count}, function(error, tweets, response) {
	  if (!error) {
		res.render('tweets', {title: 'Tweets', listTweets: tweets })
	  } else {
	    res.send('error');
	  }
	});
	*/
	
	var screenName = req.params.screen_name;
	var count = req.query.count;

	var options = {
	    protocol: 'http:',
	    host: 'localhost:7890',
	    pathname: '/1.1/statuses/user_timeline.json',
	    query: { screen_name: screenName, count: count },
	}

	var twitterUrl = url.format(options);
	
	// use local JSON response at work
	if (/^win/.test(process.platform)) {
		var path = require('path');
		var body = require(path.join(process.cwd(), './tweets.json'));
	  
		processTweets(null, null, JSON.stringify(body));
	} else {
		request(twitterUrl, processTweets);
	}
	
	function processTweets(err, res1, body) {
	  var tweets = JSON.parse(body);
	  var listTweets = [];
	  
	  for (var i = 0; i < tweets.length; i++) {
	    var tweet = tweets[i];
	    var tweetText = tweetDateTime = tweetLink = retweetBy = retweetFrom = '';
	    var retweet = false;
	    
	    tweetDateTime = tweet.created_at;
	    tweetLink = 'https://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str;
	    
	    if (tweet.retweeted_status != null) {
	      retweet = true;
	      retweetBy = tweet.user.name + ' @' + tweet.user.screen_name;
	      retweetFrom = tweet.retweeted_status.user.name + ' @' + tweet.retweeted_status.user.screen_name;
	      tweetText = tweet.text.replace('RT @' + tweet.retweeted_status.user.screen_name + ': ', '');
	    } else {
	      tweetText = tweet.text;
	    }
	    
	    listTweets.push({text: tweetText, date_time: tweetDateTime, link: tweetLink, retweet: retweet, retweet_by: retweetBy, retweet_from: retweetFrom});
	  }
	  
	  res.render('tweets', { title: 'Tweets', listTweets: listTweets});
	}
	
});

module.exports = router;
