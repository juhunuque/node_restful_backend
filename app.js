'use strict';
var express = require('express');
var path = require('path');
var FileStreamRotator = require('file-stream-rotator')
var fs = require('fs')
var favicon = require('serve-favicon');
var logger = require('morgan');
var winston = require('winston');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');

// MONGO
var mongo = require('mongodb');
var mongoose = require('mongoose');
var db = mongoose.connection;

var mongoConfig = require('./app/config/internalConfigs').mongo;
const mongoUrl = mongoConfig.host + ':' + mongoConfig.port + '/' + mongoConfig.dbName;
mongoose.connect(mongoUrl);

// db.on('error', console.error.bind(console, 'Mongo connection error:'));
db.on('error', ()=>{
  console.error.bind(console, 'Mongo connection error:');
  throw new Error('Mongo connection error');
});
db.once('open', ()=>{
  console.log('Mongo connected successfuly to: ' + mongoUrl );
});
// END MONGO

const catalog = require('./routes/catalog.route');
const user = require('./routes/user.route');
const material = require('./routes/material.route');
const project = require('./routes/project.route');
const security = require('./routes/security.route');

var app = express();

// Log Structure
var logsDirectory = path.join(__dirname, 'logs');
fs.existsSync(logsDirectory) || fs.mkdirSync(logsDirectory);
var logDirectory = path.join(__dirname, 'logs/log');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

var winston = new winston.Logger({
    transports: [
        new (require('winston-daily-rotate-file'))({
            filename: 'console.log',
            dirname: './logs',
            colorize: true,
            timestamp: function() {
              var p = new Date().toString().replace(/[A-Z]{3}\+/,'+').split(/ /);
              return( p[2]+'/'+p[1]+'/'+p[3]+':'+p[4]+' '+p[5] );
            }
        }),
        new winston.transports.File({
          filename: 'console.log',
          dirname: './logs/log',
          json: true,
          maxsize: 5242880,
          colorize: true,
          timestamp: function() {
            var p = new Date().toString().replace(/[A-Z]{3}\+/,'+').split(/ /);
            return( p[2]+'/'+p[1]+'/'+p[3]+':'+p[4]+' '+p[5] );
          }
        })
    ],
    exceptionHandlers: [
        new (require('winston-daily-rotate-file'))({
          filename: 'console.log',
          dirname: './logs',
          colorize: true,
          timestamp: function() {
            var p = new Date().toString().replace(/[A-Z]{3}\+/,'+').split(/ /);
            return( p[2]+'/'+p[1]+'/'+p[3]+':'+p[4]+' '+p[5] );
          }
        }),
        new winston.transports.File({
          filename: 'console.log',
          dirname: './logs/log',
          json: true,
          maxsize: 5242880,
          colorize: true,
          timestamp: function() {
            var p = new Date().toString().replace(/[A-Z]{3}\+/,'+').split(/ /);
            return( p[2]+'/'+p[1]+'/'+p[3]+':'+p[4]+' '+p[5] );
          }
        })
    ],
    exitOnError: false
});

logger.token('date', function() {
    var p = new Date().toString().replace(/[A-Z]{3}\+/,'+').split(/ /);
    return( p[2]+'/'+p[1]+'/'+p[3]+':'+p[4]+' '+p[5] );
});

if(app.get('env') === 'development'){
  app.use(logger('dev',{
    stream:{
      write: function(str){
        console.log(str);
        winston.info(str);
      }
    }
  }));
}else{
  app.use(logger('common',{
    stream:{
      write: function(str){
        winston.info(str);
      }
    }
  }))
}
// End Log Structure

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/v1/catalog', catalog);
app.use('/v1/user', user);
app.use('/v1/material', material);
app.use('/v1/project', project);
app.use('/v1/security', security);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.error('Caught err: ',err);
    winston.error(err);
    res.json({message: err.message, error: err});
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.error('Caught err: ',err);
  winston.error(err);
  res.json({message: err.message, error: {}});
});


module.exports = app;
