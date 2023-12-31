// load the env consts
require('dotenv').config();
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');

// session middleware
const session = require('express-session');
const passport = require('passport');
const methodOverride = require('method-override');

// import routes
const indexRoutes = require('./routes/index');
const recipeRoutes = require('./routes/recipes');
const reviewRoutes = require('./routes/reviews');
const questionRoutes = require('./routes/questions');

// create the Express app
const app = express();

// connect to the MongoDB with mongoose
require('./config/database');

// configure Passport
require('./config/passport');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname + '/public')));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// mount the session middleware
// this creates the cookie with sid that remembers the browser
app.use(session({
  store: MongoStore.create({
    mongoUrl: process.env.DATABASE_URL
  }),
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true
}));

// app.use(session({
//   secret: process.env.SECRET,
//   resave: false,
//   saveUninitialized: true
// }));

app.use(passport.initialize());
app.use(passport.session());


// Add this middleware BELOW passport middleware
app.use(function (req, res, next) {
  res.locals.user = req.user; // assigning a property to res.locals, makes that said property (user) availiable in every
  // single ejs view
  next();
});



// mount routes
app.use('/', indexRoutes);
app.use('/recipes', recipeRoutes);
app.use('/recipes/:id/reviews', reviewRoutes);
app.use('/recipes/:id/questions', questionRoutes);

// invalid request, send 404 page
app.use(function(req, res) {
  res.status(404).send('Cant find that!');
});

// unauthorized user, send 403 page
app.use(function(req, res) {
  res.status(403).send('Unauthorized! Please Log In!');
});

module.exports = app;