var express = require('express');
var router = express.Router();
var passport = require('passport');
var CV = require('../models/cv');
var Student = require('../models/student');
var officegen = require('officegen');
var fs = require('fs');
var async = require('async');
var TheCV = require('../models/thecv');
var methodOverride = require('method-override');


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

          //
              var docx = officegen('docx');

              //Personal Info
              var pObjHead = docx.createP();
              pObjHead.addText(theStudent.fullname.toString(), {bold: true, font_size: 20, font_face: 'Arial'});
              pObjHead.addLineBreak();
              pObjHead.addText(theStudent.address.toString(), {font_size: 12, font_face: 'Arial'});
              pObjHead.addLineBreak();
              pObjHead.addText('Mobile# ' + theStudent.mobilenumber.toString(), {font_size: 12, font_face: 'Arial'});
              pObjHead.addLineBreak();
              pObjHead.addText('Email: ' + theStudent.email.toString(), {font_size: 12, font_face: 'Arial'});


              //Skills 
              var pObjSkills = docx.createP();
              var bulletPoint = String.fromCharCode(8226);
              pObjSkills.addText('Skills', {font_size: 16, font_face: 'Arial', underline: true});
              pObjSkills.addLineBreak();
              theStudent.cv.forEach(function(studentCV){
                studentCV.skills.forEach(function(studentSkills){
                  pObjSkills.addText(bulletPoint + ' ' + studentSkills);
                  pObjSkills.addLineBreak();
                });
              });

              var named = './CV/' + theStudent.fullname + '.' + theStudent.username + '/' + cvName
              var out = fs.createWriteStream ( named.replace(/\s/g,''));

              out.on ( 'error', function ( err ) {
                console.log ( err );
              });

              async.parallel ([
                function ( done ) {
                  out.on ( 'close', function () {
                    console.log ( 'Created a CV for ' + theStudent.fullname );
                    done ( null );
                  });
                  docx.generate ( out );
                }

              ], function ( err ) {
                if ( err ) {
                  console.log ( 'error: ' + err );
                } 
              });
          //



          res.redirect('back');
          }
        })
    } else if(req.user.cv.length > 0){
        CV.findOneAndUpdate({_id: req.user.cv[0]}, req.body.cv, function(err, updatedCV){
          if(err){
            console.log(err);
          } else {
          Student.findById(req.user.id).populate('cv').exec(function(err, theStudentUpdate){
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
              pObjHead.addText('Mobile# ' + theStudentUpdate.mobilenumber.toString(), {font_size: 12, font_face: 'Arial'});
              pObjHead.addLineBreak();
              pObjHead.addText('Email: ' + theStudentUpdate.email.toString(), {font_size: 12, font_face: 'Arial'});


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
      return res.redirect('/student2');
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



//TEST


router.post('/createcvtest', function(req, res){
  var cvName = req.body.thecv.cvname + '.docx';
  TheCV.create(req.body.thecv, function(err, newCV){
    if(err){
      console.log(err);
    } else {
      Student.findById(req.user.id, function(err, theStudent){
        if(err){
          console.log(err);
        } else {
          theStudent.cv.push(newCV);
          theStudent.save();
          //~~~~~~~~~~~~~~~~~~


              var docx = officegen('docx');

              //Personal Info
              var pObjHead = docx.createP();
              pObjHead.addText(newCV.firstname.toString() + ' ' + newCV.lastname.toString(), {bold: true, font_size: 20, font_face: 'Arial'});
              pObjHead.addLineBreak();
              pObjHead.addText(newCV.address.toString(), {font_size: 12, font_face: 'Arial'});
              pObjHead.addLineBreak();



              //Skills 
              // var pObjSkills = docx.createP();
              // var bulletPoint = String.fromCharCode(8226);
              // pObjSkills.addText('Skills', {font_size: 16, font_face: 'Arial', underline: true});
              // pObjSkills.addLineBreak();
              // theStudent.cv.forEach(function(studentCV){
              //   studentCV.skills.forEach(function(studentSkills){
              //     pObjSkills.addText(bulletPoint + ' ' + studentSkills);
              //     pObjSkills.addLineBreak();
              //   });
              // });

              var named = './CV/' + theStudent.fullname + '.' + theStudent.username + '/' + cvName
              var out = fs.createWriteStream ( named.replace(/\s/g,''));

              out.on ( 'error', function ( err ) {
                console.log ( err );
              });

              async.parallel ([
                function ( done ) {
                  out.on ( 'close', function () {
                    console.log ( 'Created a CV for ' + newCV.firstname + newCV.lastname);
                    done ( null );
                  });
                  docx.generate ( out );
                }

              ], function ( err ) {
                if ( err ) {
                  console.log ( 'error: ' + err );
                } 
              });
          //



          //~~~~~~~~~~~~~~~~~~







          res.redirect('/student2');
        }
      });
    }
  });
});

router.post('/createcvtest2', function(req, res){
  Student.findById(req.user.id, function(err, theStudent){
    if(err){
      console.log(err);
    } else {
      TheCV.create(req.body.thecv, function(err, newCV){
        if(err){
          console.log(err);
        } else {
          theStudent.cv.push(newCV);
          theStudent.save();
          res.redirect('back');
        }
      });
    }
  });
});

router.get('/student2', function(req, res){
  Student.findById(req.user.id).populate('cv').exec(function(err, loginStudent){
    if(err){
      console.log(err);
    } else {
      fs.readdir('./CV/' + req.user.folder, function(err, foundFolder){
        if(err){
          console.log(err);
        } else {
          res.render('demo', {loginStudent: loginStudent, foundFolder: foundFolder});
        }
      })
    }
  });
});

router.get('/cvs/:cvid', function(req, res){
  TheCV.findById(req.params.cvid).populate('experience education skills').exec(function(err, foundCV){
    if(err){
      console.log(err);
    } else {

      res.render('studenttest', {foundCV: foundCV});
      // res.send('hey');
    }
  });
});

router.put('/cvs/:cvid', function(req,res){
  var cvName = req.body.editcv.cvname + '.docx';
  TheCV.findByIdAndUpdate(req.params.cvid, req.body.editcv, function(err, editCV){

    if(err){
      console.log(err);
    } else {
      var docx = officegen('docx');

              //Personal Info
              var pObjHead = docx.createP();
              pObjHead.addText(editCV.firstname.toString() + ' ' + editCV.lastname.toString(), {bold: true, font_size: 20, font_face: 'Arial'});
              pObjHead.addLineBreak();
              pObjHead.addText(editCV.address.toString(), {font_size: 12, font_face: 'Arial'});
              pObjHead.addLineBreak();



              //Skills 
              // var pObjSkills = docx.createP();
              // var bulletPoint = String.fromCharCode(8226);
              // pObjSkills.addText('Skills', {font_size: 16, font_face: 'Arial', underline: true});
              // pObjSkills.addLineBreak();
              // theStudent.cv.forEach(function(studentCV){
              //   studentCV.skills.forEach(function(studentSkills){
              //     pObjSkills.addText(bulletPoint + ' ' + studentSkills);
              //     pObjSkills.addLineBreak();
              //   });
              // });

              var named = './CV/' + req.user.fullname + '.' + req.user.username + '/' + cvName
              var out = fs.createWriteStream ( named.replace(/\s/g,''));

              out.on ( 'error', function ( err ) {
                console.log ( err );
              });

              async.parallel ([
                function ( done ) {
                  out.on ( 'close', function () {
                    console.log ( 'Created a CV for ' + editCV.firstname + editCV.lastname);
                    done ( null );
                  });
                  docx.generate ( out );
                }

              ], function ( err ) {
                if ( err ) {
                  console.log ( 'error: ' + err );
                } 
              });
          //



          //~~~~~~~~~~~~~~~~~~







          res.redirect('/student2');
    }
  })
})




router.get('/demo', function(req, res){
  res.render('demo');
});

module.exports = router;