var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override')
var passport = require('passport');
var passportLocal = require('passport-local');
var LocalStrategy = require('passport-local').Strategy;
var passportLocalMongoose = require('passport-local-mongoose');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bcrypt = require('bcrypt-nodejs');
var nodemailer = require('nodemailer');
var async = require('async');
var crypto = require('crypto');
var fs = require('fs');
var officegen = require('officegen');



var app = express();


//Import the models
var Student = require('./models/student');
var AuthKey = require('./models/authkey');
var CV = require('./models/cv');


//Import the routes
var indexRoute = require('./routes/index');
var studentRoute = require('./routes/student');
var authkeyRoute = require('./routes/authkey');

app.use(bodyParser.json());
//enables body-parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
//you don't need to add .ejs everytime you use res.render
app.set('view engine', 'ejs');
//to add the directory '/public' so nodejs can look into it. You don't need to put '/public' on everytime
//you link or src a css/javascript file
app.use(express.static(__dirname + '/public'));
//useful for PUT and DELETE method
app.use(methodOverride('_method'));


app.use(logger('dev'));



//connects to mongodb
mongoose.connect('mongodb://localhost/prototype2');
// mongoose.connect('mongodb://admin:admin@ds011890.mlab.com:11890/prototype2');



//Passport Authentication
app.use(require("express-session")({
	secret: "7He$3cr37",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
// passport.use(new passportLocal(Student.authenticate()));
passport.use(Student.createStrategy());

passport.use(new LocalStrategy(function(username, password, done) {
  Student.findOne({ username: username }, function(err, user) {
    console.log(username);
    if (err) return done(err);
    if (!user) return done(null, false, { message: 'Incorrect username.' });
    user.comparePassword(password, function(err, isMatch) {
      console.log(password);
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect password.' });
      }
    });
  });
}));

passport.serializeUser(Student.serializeUser());
passport.deserializeUser(Student.deserializeUser());


app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});


//Use the routes
app.use(studentRoute);
app.use(authkeyRoute);
app.use(indexRoute);




//ROUTES










// //To heroku
// app.listen(process.env.PORT, function(req, res){
// 	console.log('server started at PORT 3000');
// });

//To localhost
app.listen('3000', function(req, res){
	console.log('server started at PORT 3000');
});