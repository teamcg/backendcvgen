var mongoose = require('mongoose');

var experienceSchema = new mongoose.Schema({
		category: String,
		role: String,
		companydescription: String,
		company: String,
		city: String,
		country: String,
		startmonth: String,
		startyear: String,
		endmonth: String,
		endyear: String
});

module.exports = mongoose.model('Experience', experienceSchema);