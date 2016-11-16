var mongoose = require('mongoose');

var educationSchema = new mongoose.Schema({
		category: String,
		degree: String,
		school: String,
		city: String,
		country: String,
		startmonth: String,
		startyear: String,
		endmonth: String,
		endyear: String
});

module.exports = mongoose.model('Education', educationSchema);