var mongoose = require('mongoose');

var CVSchema = new mongoose.Schema({
	fullname: String,
	address: String,
	mobilenumber: Number,
	email: String,
	skills: [String]
});

module.exports = mongoose.model('cv', CVSchema);