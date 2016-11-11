var express = require('express');
var router = express.Router();
var passport = require('passport');
var CV = require('../models/cv');


router.get('/', function(req, res){
	// res.render('homepage');
	res.render('loginregister');
});

router.post('/test', function(req, res){
  var newCV = {
    fullname: 'John Frades',
    address: '43 shanaway rise',
    mobilenumber: 0221600143,
    email: 'johnfrades@gmail.com',
    skills: ['guitar', 'web developer']
  }

  CV.create(req.body.cv, function(err, createdCV){
    if(err){
      console.log(err);
    } else {
      res.send(createdCV);
    }
  });
});



// router.post("/login", passport.authenticate("local", {
// 	successRedirect: "/student",
// 	failureRedirect: "back"
// }));


router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if(err){
    	return next(err)
    }
    if (!user) {
      return res.redirect('/')
    }
    req.logIn(user, function(err) {
      if (err) return next(err);
      return res.redirect('/student');
    });
  })(req, res, next);
});


router.get("/logout", function(req, res){
	req.logout();
	res.redirect("/");
});

router.get('/forgotpass', function(req, res){
	res.render('forgotpass');
});


module.exports = router;