const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const methodOverride = require('method-override');
require('dotenv').config();

mongoose.connect(
  process.env.DB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true, retryWrites: false },
  (e) => {
    if (e) {
      throw e;
    }
    console.log('Connected to database!');
  },
);

const apiRouter = require('./api/routes');
const callbackRouter = require('./callback/routes');
const homeRouter = require('./app/home/routes');
const authRouter = require('./app/auth/routes');
const teamRouter = require('./app/team/routes');

const app = express();

const corsOptions = {
  origin: ['https://plbx.coderitts.tech', 'https://plbx.irvansn.com', 'http://localhost:5050'],
  methods: ['GET', 'PUT', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('trust proxy', true);

app.use(methodOverride('_method'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', apiRouter);
app.use('/cb', callbackRouter);
app.use('/', homeRouter);
app.use('/auth', authRouter);
app.use('/team', teamRouter);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
  next();
});

module.exports = app;
