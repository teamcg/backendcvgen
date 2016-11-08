var express = require('express');
var router = express.Router();
var AuthKey = require('../models/authkey');


router.get('/gentempkey', function(req, res){
	res.render('genauthkey');
});

router.get('/allauthkey', function(req, res){
	AuthKey.find({}, function(err, allStudent){
		if(err){
			console.log(err);
		} else {
			res.send(allStudent);
		}
	});
});

router.post('/authkeygen', function(req, res){
	var authkey = req.body.genauthkey;

	AuthKey.findOne({'studentid': authkey.studentid}, function(err, theKey){
		if(err){
			console.log(err);
		} else if(theKey){
			res.send('There is already a generated Authentication Key for Student ID: ' + theKey.studentid);
		} else {
				AuthKey.create(authkey, function(err, authkeygen){
					if(err){
						console.log(err);
					} else {
						authkeygen.used = false;
						authkeygen.save();
						res.redirect('/');
					}
				});
					}
	});
});



router.post('/reg', function(req, res){
	var regstudentid = req.body.regstudentid;
	var regauthkey = req.body.regauthkey;

		AuthKey.findOne({'studentid': regstudentid, 'authkey': regauthkey}, function(err, foundStudent){
			if(err){
				console.log(err);
			} else if(foundStudent === null) {
				res.send('Wrong Student ID/Authentication key. Please check with the Administrator');
			} else if(foundStudent.studentid && foundStudent.used === true) {
				res.send('That Student ID is already registered!');
			} else if(foundStudent.used === true){
				res.send('The authentication code is already been used! Please contact admin!');
			} else {
				res.render('register', {foundStudent: foundStudent});
			}
		});
	});


module.exports = router;