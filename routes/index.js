var express = require('express');
var router = express.Router();
var request = require('request');
var url = require('url');

router.get('/', function(req, res, next) {
  var screenName = localStorage.getItem('screenName');
  var count = localStorage.getItem('count');
  var timeRange = localStorage.getItem('timeRange');

  var options = {
      protocol: 'http:',
      host: 'localhost:7890',
      pathname: '/1.1/statuses/user_timeline.json',
      query: { screen_name: screenName, count: count },
  }

  var requestUrl = url.format(options);
  
  // fetch the tweets
  request(requestUrl, processTweets);
  
  function processTweets(err, res1, body) {
    var tweets = JSON.parse(body);
    var listTweets = [];
    
    for (var i = 0; i < tweets.length; i++) {
      var tweet = tweets[i];
      var tweetText = tweetDateTime = tweetLink = retweetBy = retweetFrom = '';
      var retweet = false;
      
      tweetLink = 'https://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str;
      
      // datetime
      //tweetDateTime = tweet.created_at;
      var tweetDate = new Date(Date.parse(tweet.created_at));
      var currentDate = new Date();
      var secondsAgo = Math.floor((currentDate - tweetDate) / 1000);
      var secondsPerMinute = 60;
      var secondsPerHour = 3600;
      var secondsPerDay = 86400;
      var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      if (secondsAgo < secondsPerMinute) {
        tweetDateTime = secondsAgo + 's';
      } else if (secondsAgo < secondsPerHour) {
        tweetDateTime = Math.round(secondsAgo / secondsPerMinute) + 'm';
      } else if (secondsAgo < secondsPerDay) {
        tweetDateTime = Math.round(secondsAgo / secondsPerHour) + 'h';
      } else {
        tweetDateTime = month[tweetDate.getMonth()] + ' ' + tweetDate.getDate();
        
        if (currentDate.getFullYear() != tweetDate.getFullYear()) {
          tweetDateTime += ' ' + tweetDate.getFullYear();
        }
      }
      
      // retweets
      if (tweet.retweeted_status != null) {
        retweet = true;
        retweetBy = tweet.user.name + ' @' + tweet.user.screen_name;
        retweetFrom = tweet.retweeted_status.user.name + ' @' + tweet.retweeted_status.user.screen_name;
        tweetText = tweet.text.replace('RT @' + tweet.retweeted_status.user.screen_name + ': ', '');
      } else {
        tweetText = tweet.text;
      }
      
      // user mentions
      for (var j = 0; j < tweet.entities.user_mentions.length; j++) {
        var mention = tweet.entities.user_mentions[j];
        var replace = '@' + mention.screen_name;
        var re = new RegExp(replace,"gi");
        
        tweetText = tweetText.replace(re, mention.name + ' @' + mention.screen_name); 
      }
      
      listTweets.push({text: tweetText, date_time: tweetDateTime, link: tweetLink, retweet: retweet, retweet_by: retweetBy, retweet_from: retweetFrom});
    }
    
    res.render('index', { title: 'Tweets', listTweets: listTweets});
  }
});

module.exports = router;
