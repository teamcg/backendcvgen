var express = require('express');
var router = express.Router();
var passport = require('passport');
var CV = require('../models/cv');
var Student = require('../models/student');
var officegen = require('officegen');
var fs = require('fs');
var async = require('async');


router.get('/', function(req, res){
	res.render('loginregister');
});


router.post('/test2', function(req, res){
  var cvName = req.body.cv.cvname + '.docx';
  Student.findById(req.user.id).populate('cv').exec(function(err, theStudent){
    if(err){
      console.log(err);
    } else if(req.user.cv.length === 0){
        CV.create(req.body.cv, function(err, createdCV){
          if(err){
            console.log(err);
          } else {
          theStudent.cv.push(createdCV);
          theStudent.save();
          res.redirect('back');
          }
        })
    } else if(req.user.cv.length > 0){
        CV.findOneAndUpdate({_id: req.user.cv[0]}, req.body.cv, function(err, updatedCV){
          if(err){
            console.log(err);
          } else {
          Student.findById(req.user.id).populate('cv').exec(function(err, theStudentUpdate){
            console.log(theStudentUpdate);
            if(err){
              console.log(err);
            } else {
              var docx = officegen('docx');

              //Personal Info
              var pObjHead = docx.createP();
              pObjHead.addText(theStudentUpdate.fullname.toString(), {bold: true, font_size: 20, font_face: 'Arial'});
              pObjHead.addLineBreak();
              pObjHead.addText(theStudentUpdate.address.toString(), {font_size: 12, font_face: 'Arial'});
              pObjHead.addLineBreak();
              pObjHead.addText('Mobile# ' + theStudent.mobilenumber.toString(), {font_size: 12, font_face: 'Arial'});
              pObjHead.addLineBreak();
              pObjHead.addText('Email: ' + theStudent.email.toString(), {font_size: 12, font_face: 'Arial'});


              //Skills 
              var pObjSkills = docx.createP();
              var bulletPoint = String.fromCharCode(8226);
              pObjSkills.addText('Skills', {font_size: 16, font_face: 'Arial', underline: true});
              pObjSkills.addLineBreak();
              theStudentUpdate.cv.forEach(function(studentCV){
                studentCV.skills.forEach(function(studentSkills){
                  pObjSkills.addText(bulletPoint + ' ' + studentSkills);
                  pObjSkills.addLineBreak();
                });
              });

              var named = './CV/' + theStudentUpdate.fullname + '.' + theStudentUpdate.username + '/' + cvName
              var out = fs.createWriteStream ( named.replace(/\s/g,''));

              out.on ( 'error', function ( err ) {
                console.log ( err );
              });

              async.parallel ([
                function ( done ) {
                  out.on ( 'close', function () {
                    console.log ( 'Created a CV for ' + theStudentUpdate.fullname );
                    done ( null );
                  });
                  docx.generate ( out );
                }

              ], function ( err ) {
                if ( err ) {
                  console.log ( 'error: ' + err );
                } 
              });
              res.redirect('back');
                      }
                    })
              
        }
      });
    }
  });
});





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