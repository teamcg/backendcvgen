var express = require('express');
var router = express.Router();
var passport = require('passport');
var CV = require('../models/cv');
var Student = require('../models/student');


router.get('/', function(req, res){
	// res.render('homepage');
	res.render('loginregister');
});

router.post('/test', function(req, res){
  Student.findById(req.user.id, function(err, foundStudent){
    if(err){
        console.log(err);
    } else {
        CV.create(req.body.cv, function(err, createdCV){
        if(err){
          console.log(err);
        } else {
          foundStudent.cv.push(createdCV);
          foundStudent.save();
          res.send('Successfully created CV!');
        }
      });
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