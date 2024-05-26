const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
//Load config
dotenv.config({ path: './config/config.env' });

//Passport config
require('./config/passport')(passport);
connectDB();
const app = express();

//Middleware (Body Parser) to accept form data.
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


//Sessions
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Set global variable
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

//Here we import router from routes/index
app.use('/auth', require('./routes/auth'));
const PORT = process.env.PORT || 4000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);