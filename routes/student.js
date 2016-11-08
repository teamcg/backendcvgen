var express = require('express');
var router = express.Router();
var Student = require('../models/student');
var AuthKey = require('../models/authkey');
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
      res.render('student', {files: files});
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
        service: '',
        auth: {
          user: '',
          pass: ''
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
        service: '',
        auth: {
          user: '',
          pass: ''
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



router.post('/genword', function(req, res){
  Student.findOne({username: req.user.username}, function(err, theStudent){
    var docx = officegen('docx');

    var pObj = docx.createP();
    pObj.addText(theStudent.fullname.toString());
    pObj.addLineBreak();
    pObj.addText('Student ID# ' + theStudent.username.toString());
    pObj.addLineBreak();
    pObj.addText(theStudent.email.toString(), {color: 'red'});



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


module.exports = router;