'use strict';
require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const requestIp = require('request-ip');
const httpStatus = require('http-status');
const { initSettings } = require('./helper/setting');
const mongoURI = process.env.MONGODB_URI;
const sendResponse = require('./helper/sendResponse');

const app = express();
// Logger middleware
app.use(logger('dev'));
// Body parser middleware
// create application/json parser
app.use(
  bodyParser.json({
    limit: '50mb',
  }),
);
// create application/x-www-form-urlencoded parser
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: false,
  }),
);

// DB Config
mongoose.Promise = global.Promise;

Promise.resolve(app)
  .then(MongoDBConnection())
  .catch(err => console.error.bind(console, `MongoDB connection error: ${JSON.stringify(err)}`));

// Database Connection
async function MongoDBConnection() {
  console.log(`| MongoDB URL  : ${mongoURI}`);
  await mongoose
    .connect(mongoURI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(() => {
      console.log('| MongoDB Connected');
      console.log('|--------------------------------------------');
      SettingInitiate();
    });

  return null;
}

async function SettingInitiate() {
  await initSettings();
  return null;
}

// CORS setup for dev
app.use(function (req, res, next) {
  req.client_ip_address = requestIp.getClientIp(req);
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'DELETE, GET, POST, PUT, PATCH, OPTIONS');
  next();
});

const routes = require('./routes/index');
const logMiddleware = require('./middleware/log.middleware');

app.use(logMiddleware.saveLog);

// Use Routes
app.use('/api/v1', routes);
app.use('/public', express.static(path.join(__dirname, 'public')));
// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
// no stacktraces leaked to user unless in development environment
app.use((err, req, res, next) => {
  if (err.status === 404) {
    return sendResponse(res, httpStatus.NOT_FOUND, false, null, err, 'Route Not Found', null);
  } else {
    console.log('\x1b[41m', err);
    let path = req.baseUrl + req.route && req.route.path;
    if (path.substr(path.length - 1) === '/') {
      path = path.slice(0, path.length - 1);
    }
    err.method = req.method;
    err.path = req.path;
    return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, null, err, null, null);
  }
});



module.exports = app;
