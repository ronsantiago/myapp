var express = require('express');
var router = express.Router();
var request = require('request');
var url = require('url');

router.get('/', function(req, res, next) {
  var screenName = localStorage.getItem('screenName');
  var count = localStorage.getItem('count');
  var timeRange = localStorage.getItem('timeRange');
  var columnOrder = localStorage.getItem('columnOrder').split(',');
  var style = localStorage.getItem('style');
  
  var options = {
      protocol: 'http:',
      host: 'localhost:7890',
  }
  
  // fetch user profile for dynamic style and store it
  options.pathname = '/1.1/users/lookup.json';
  options.query = { screen_name: screenName };
  
  request(url.format(options), function(err, res, body) {
    if (err) {
      return;
    }
    
    var profiles = JSON.parse(body);
    
    if (profiles.errors && profiles.errors[0].code == 17) {
      localStorage.setItem('validUser', false);
    } else {
      localStorage.setItem('validUser', true);
      localStorage.setItem('userProfile', body);
    }
  });
  
  // fetch tweets
  options.pathname = '/1.1/statuses/user_timeline.json';
  options.query = { screen_name: screenName, count: count };
  
  var requestUrl = url.format(options);
  
  // fetch the tweets
  request(requestUrl, processTweets);
  
  function processTweets(err, res1, body) {
    if (err) {
      return;
    }
    
    var tweets = JSON.parse(body);
    var listTweets = [];
    var secondsPerMinute = 60;
    var secondsPerHour = 3600;
    var secondsPerDay = 86400;
    var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (var i = 0; i < tweets.length; i++) {
      var tweet = tweets[i];
      var tweetText = tweetDateTime = tweetLink = tweetImage = retweetBy = retweetFrom = retweetImage = '';
      var retweet = false;
      
      // datetime
      var tweetDate = new Date(Date.parse(tweet.created_at));
      var currentDate = new Date();
      var secondsAgo = Math.floor((currentDate - tweetDate) / 1000);
      
      // process list up to specified time range only
      if (secondsAgo > timeRange) {
        break;
      }
      
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
      
      tweetLink = 'https://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str;
      
      // retweets
      if (tweet.retweeted_status != null) {
        retweet = true;
        retweetBy = tweet.user.name + ' @' + tweet.user.screen_name;
        retweetFrom = tweet.retweeted_status.user.name + ' @' + tweet.retweeted_status.user.screen_name;
        tweetImage = tweet.retweeted_status.user.profile_image_url;
        tweetText = tweet.text.replace('RT @' + tweet.retweeted_status.user.screen_name + ': ', '');
      } else {
        tweetImage = tweet.user.profile_image_url;
        tweetText = tweet.text;
      }
      
      // user mentions
      for (var j = 0; j < tweet.entities.user_mentions.length; j++) {
        var mention = tweet.entities.user_mentions[j];
        var replace = '@' + mention.screen_name;
        var re = new RegExp(replace,"gi");
        
        tweetText = tweetText.replace(re, mention.name + ' @' + mention.screen_name); 
      }
      
      listTweets.push({ text: tweetText, date_time: tweetDateTime, link: tweetLink, linkImage: tweetImage, retweet: retweet, retweet_by: retweetBy, retweet_from: retweetFrom });
    }
    
    res.render('index', { title: 'Tweets', listTweets: listTweets, columnOrder, columnOrder });
  }
});

router.post('/', function(req, res) {
  localStorage.setItem('screenName', req.body.screenName);
  localStorage.setItem('timeRange', req.body.timeRange);
  
  res.redirect('/');
});

module.exports = router;
