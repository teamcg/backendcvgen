var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var bcrypt = require('bcrypt-nodejs');

var StudentSchema = new mongoose.Schema({
  folder: String,
	fullname: String,
	email: String,
  address: String,
  mobilenumber: Number,
	username: String,
	password: String,
	authkey: String,
  cv: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'cv'
    }
  ],
	resetPasswordToken: String,
	resetPasswordExpires: Date
});


StudentSchema.pre('save', function(next) {
  var user = this;
  var SALT_FACTOR = 5;

  if (!user.isModified('password')){
    return next();
  } 

  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

StudentSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};




StudentSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('Student', StudentSchema);