const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const passport = require('passport');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const expressLayout = require('express-ejs-layouts');
const session = require('express-session');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const api = require('./routes/api');

const app = express();

//passport
require('./config/passport')(passport);

//monogdb
const db = require('./config/keys').mongoUrl;

mongoose.connect(db, { useNewUrlParser: true })
  .then(() => console.log('Mongo Connected...'))
  .catch((err) => console.log(err));

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.use(expressLayout);
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//express session
app.use(session({
  secret: 'sldkj234kfl#sldkjaDvC',
  resave: true,
  saveUninitialized: true
}));

//passport mid
app.use(passport.initialize());
app.use(passport.session());


// Flash Connected
app.use(flash());
// app.use((req, res, next) => {
//   //res.local.msg_success = req.flash('msg_success');
// });

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
