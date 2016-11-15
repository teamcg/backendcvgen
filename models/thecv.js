var mongoose = require('mongoose');

var theCVSchema = new mongoose.Schema({
	cvname: String,
	firstname: String,
	lastname: String,
	address: String,
	suburb: String,
	city: String,
	postcode: Number,
	mobilephone: Number,
	email: String,
	careerobjective: String,
	experience: {
		category: String,
		role: String,
		companydescription: String,
		company: String,
		city: String,
		country: String,
		start: String,
		end: String
	},
	education: {
		category: String,
		degree: String,
		schoolname: String,
		city: String,
		country: String,
		years: Number,
	}
});

module.exports = mongoose.model('thecv', theCVSchema);