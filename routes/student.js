var express = require('express');
var router = express.Router();
var Student = require('../models/student');
var AuthKey = require('../models/authkey');
var CV = require('../models/cv');
var TheCV = require('../models/thecv');
var Experience = require('../models/experience');
var Education = require('../models/education');
var Skills = require('../models/skills');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var fs = require('fs');
var officegen = require('officegen');





router.get('/allstudent', function(req, res){
	Student.find({}, function(err, allStudent){
		if(err){
			console.log(err);
		} else {
			res.send(allStudent);
		}
	});
});


router.get('/student', function(req, res){
  fs.readdir('./CV/' + req.user.folder, function(err, files){
    if(err){
      console.log(err);
    } else {
      Student.findById(req.user.id).populate('cv').exec(function(err, theStudent){
        if(err){
          console.log(err);
        } else {
          res.render('student', {files: files, theStudent: theStudent});
        }
      })
    }
  });
});


router.post('/register', function(req, res){
	var theStudentInfo = req.body.student;
	var newStudent = new Student(theStudentInfo);

	Student.register(newStudent, req.body.thepassword, function(err, registerStudent){
		console.log(registerStudent);
		if(err){
			console.log(err);
		} else {
			AuthKey.findOneAndUpdate({'studentid': theStudentInfo.username}, {$set: {'used': true}}, function(err, Updated){
				if(err){
					console.log(err);
				} else {
					res.send(registerStudent);
				}
			});
		}
	});
});


router.post('/profile', function(req,res){
  Student.findByIdAndUpdate(req.user.id, req.body.studentprofile, function(err, studentProfile){
    if(err){
      console.log(err);
    } else {
      console.log('Student profile sucessfully updated');
      res.redirect('back');
    }
  });
});


router.post('/signup', function(req, res) {
  var fullnameAndId = req.body.fullname + '.' + req.body.username;
  console.log(fullnameAndId.replace(/\s/g,''));

  var theStudent = new Student({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      fullname: req.body.fullname,
      authkey: req.body.authkey,
      folder: fullnameAndId.replace(/\s/g,'')
    });
  AuthKey.findOneAndUpdate({'studentid': req.body.username}, {$set: {'used': true}}, function(err, Updated){
  	if(err){
  		console.log(err);
  	} else {
   		theStudent.save(function(err) {
    	req.logIn(theStudent, function(err) {
      	res.redirect('/');
   		});
 	 });
  	}
  });
  var named = "./CV/" + req.body.fullname +'.' + req.body.username;
  fs.mkdir(named.replace(/\s/g,''));
});



router.get('/reset/:token', function(req, res) {
  Student.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset');
  });
});


router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      Student.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var transporter = nodemailer.createTransport('SMTP', {
        service: 'SendGrid',
        auth: {
          user: 'dankusername',
          pass: '81hf081082ht0'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'passwordreset@demo.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
           'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n' +
          'This link will expire in 1 hour!' + '\n\n'+ 'Click the link now my friend! woohoo its working! :D'
      };
      transporter.sendMail(mailOptions, function(err) {
        // req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/');
  });
});



router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      Student.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save(function(err) {
          req.logIn(user, function(err) {
            done(err, user);
          });
        });
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport('SMTP', {
         service: 'SendGrid',
        auth: {
          user: 'dankusername',
          pass: '81hf081082ht0'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'passwordreset@demo.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
          +  'woohoo its working my friend! try your new password!!!! '

      };
      smtpTransport.sendMail(mailOptions, function(err) {
        // req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/');
  });
});



// router.post('/', function(req, res){
//   Student.findOne({username: req.user.username}, function(err, theStudent){
//     var docx = officegen('docx');

//     var pObjHead = docx.createP();
//     pObjHead.addText(theStudent.fullname.toString(), {bold: true, font_size: 20, font_face: 'Arial'});
//     pObjHead.addLineBreak();
//     pObjHead.addText(theStudent.address.toString(), {font_size: 12, font_face: 'Arial'});
//     pObjHead.addLineBreak();
//     pObjHead.addText('Mobile# ' + theStudent.mobilenumber.toString(), {font_size: 12, font_face: 'Arial'});
//     pObjHead.addLineBreak();
//     pObjHead.addText('Email: ' + theStudent.email.toString(), {font_size: 12, font_face: 'Arial'});

//     var pObjSkills = docx.createP();
//     pObjSkills.addText('Skills', {font_size: 16, font_face: 'Arial', underline: true});
//     pObjSkills.addLineBreak();
//     theStudent.cv.forEach(function(studentCV){
//       console.log(studentCV);
//     });

//     var named = './CV/' + theStudent.fullname + '.' + theStudent.username + '/' + 'CV.docx'
//     var out = fs.createWriteStream ( named.replace(/\s/g,''));

//     out.on ( 'error', function ( err ) {
//       console.log ( err );
//     });

//     async.parallel ([
//       function ( done ) {
//         out.on ( 'close', function () {
//           console.log ( 'Created a CV for ' + theStudent.fullname );
//           done ( null );
//         });
//         docx.generate ( out );
//       }

//     ], function ( err ) {
//       if ( err ) {
//         console.log ( 'error: ' + err );
//       } 
//     });
//     res.redirect('back');
//   });
// });





router.post('/genword', function(req, res){
  Student.findOne({username: req.user.username}).populate('cv').exec(function(err, theStudent){

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

    var named = './CV/' + theStudent.fullname + '.' + theStudent.username + '/' + 'CV.docx'
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
    res.redirect('back');
  });
});






router.get('/CV/:file', function (req, res){

  var path=require('path');

    file = req.params.file;

    var dirname = path.resolve(".")+'/CV/';

    var img = fs.readFileSync(dirname  + file);

    res.writeHead(200, {'Content-Type': 'image/jpg' });

    res.end(img, 'binary');

});


router.get('/CV/:file(*)', function(req, res, next){ // this routes all types of file 

  var path = require('path');
  var file = req.params.file;
  var path = path.resolve(".")+'/CV/' + file;
  res.download(path); // magic of download function

});




//Testing purpose ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
router.get('/fortest', function(req, res){
  res.render('fortest');
});

router.post('/newcv', function(req, res){
  var cvName = req.body.thecvname;
  var docx = officegen('docx');



  var thecvname = {
    cvname: req.body.thecvname,
  };
  TheCV.create(thecvname, function(err, newCV){
    if(err){
      console.log(err);
    } else {
      Student.findById(req.user.id, function(err, theStudent){
        if(err){
          console.log(err);
        } else {

var pObjHead = docx.createP();
    pObjHead.addText(theStudent.fullname.toString(), {bold: true, font_size: 20, font_face: 'Arial'});
    pObjHead.addLineBreak();
    pObjHead.addText('Email: ' + theStudent.email.toString(), {font_size: 12, font_face: 'Arial'});

var named = './CV/' + theStudent.fullname + '.' + theStudent.username + '/' + cvName + '.docx';
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

          var cvid = newCV.id;
          theStudent.cv.push(newCV);
          theStudent.save();
          res.redirect('/cvs/' + cvid);
        }
      });
    }
  });
});

router.post('/fortesting', function(req, res){
  TheCV.create(req.body.thecv, function(err, newCV){
    if(err){
      console.log(err);
    } else {

      res.send(newCV);
    }
  });
});


router.post('/pisubmit/:cvid', function(req, res){
  TheCV.findByIdAndUpdate(req.params.cvid, req.body.pi, function(err, updateCV){
    if(err){
      console.log(err);
    } else {
      res.redirect('/cvs/' + req.params.cvid);
    }
  });
});


router.post('/pssubmit/:cvid', function(req, res){
  var personalStatement = {
    personalstatement: req.body.thetextarea
  }


  TheCV.findByIdAndUpdate(req.params.cvid, personalStatement, function(err, updateCV){
    if(err){
      console.log(err);
    } else {
      res.redirect('/cvs/' + req.params.cvid);
    }
  });
});

router.post('/expsubmit/:cvid', function(req, res){
  var expData = {
    category: req.body.expcategory,
    role: req.body.exprole,
    companydescription: req.body.expcompanydescription,
    company: req.body.expcompany,
    city: req.body.expcity,
    country: req.body.expcountry,
    startmonth: req.body.expstartmonth,
    startyear: req.body.expstartyear,
    endmonth: req.body.expendmonth,
    endyear: req.body.expendyear

  }


  Experience.create(expData, function(err, newExperience){
    if(err){
      console.log(err);
    } else {
      TheCV.findById(req.params.cvid, function(err, updateCV){
        if(err){
          console.log(err);
        } else {
          updateCV.experience.push(newExperience);
          updateCV.save();
          res.redirect('/cvs/' + req.params.cvid);
        }
      });
    }
  });
});

router.post('/edusubmit/:cvid', function(req, res){
  var eduData = {
    category: req.body.educategory,
    degree: req.body.edudegree,
    school: req.body.eduschool,
    city: req.body.educity,
    country: req.body.educountry,
    startmonth: req.body.edustartmonth,
    startyear: req.body.edustartyear,
    endmonth: req.body.eduendmonth,
    endyear: req.body.eduendyear
  }

  Education.create(eduData, function(err, newEducation){
    if(err){
      console.log(err);
    } else {
      TheCV.findById(req.params.cvid, function(err, updateCV){
        updateCV.education.push(newEducation);
        updateCV.save();
        res.redirect('/cvs/' + req.params.cvid);
      });
    }
  })

});


router.post('/skillsubmit/:cvid', function(req, res){
  var skillData = {
    name: req.body.skillname,
    description: req.body.skilldescription
  }

  Skills.create(skillData, function(err, newSkill){
    if(err){
      console.log(err);
    } else {
      TheCV.findById(req.params.cvid, function(err, updateCV){
        if(err){
          console.log(err);
        } else {
          updateCV.skills.push(newSkill);
          updateCV.save();
          res.redirect('/cvs/' + req.params.cvid);
        }
      });
    }
  });
});


module.exports = router;