var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var tweets = require('./routes/tweets');

var app = express();

/*
// workaround that works behind proxy
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

/*
client.get('statuses/user_timeline', {count: '30', screen_name: 'appdirect'}, function(error, tweets, response) {
	  if (!error) {
	    console.log(tweets);
	  } else {
        console.log('error');
	  }
	});
*/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/tweets', tweets);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
