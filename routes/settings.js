var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.json()); 

router.get('/', function(req, res, next) {
  res.render('settings', { title: 'Settings', localStorage: localStorage });
});

router.post('/', function(req, res) {
  localStorage.setItem('screenName', req.body.screenName);
  localStorage.setItem('screenNames', req.body.screenNames);
  localStorage.setItem('count', req.body.count);
  localStorage.setItem('timeRange', req.body.timeRange);
  localStorage.setItem('columnOrder', req.body.columnOrder);
  localStorage.setItem('style', req.body.style);
  
  res.redirect('/');
});

module.exports = router;
