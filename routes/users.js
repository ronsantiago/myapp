var express = require('express');
var router = express.Router();

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

/* GET users listing. */
router.get('/:count/:screen_name', function(req, res, next) {
	client.get('statuses/user_timeline', {count: req.params.count, screen_name: req.params.screen_name}, function(error, tweets, response) {
	  if (!error) {
		res.render('index', { listTweets: tweets })
	  } else {
	    res.send('error');
	  }
	});
});

module.exports = router;
