#!/usr/bin/env node

// Module dependencies
var colors = require('colors');
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var util = require('util');

var app = express();

// Configurations
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('secret'));
  app.use(express.session());
  app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
  });

  app.use(app.router);
  app.use(require('less-middleware')(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// Routes
app.get('/', routes.index);
app.get('/oauth', routes.oauth);
app.get('/oauth_callback', routes.oauth_callback);
app.get('/clear', routes.clear);

// Run
http.createServer(app).listen(app.get('port'), function(){
  console.log('Server running.'.green)
  console.log(util.format(
    "Please visit %s to authenticate and view your notebooks.",
    util.format("http://localhost:%s".underline, app.get('port'))));
  console.log();
});
