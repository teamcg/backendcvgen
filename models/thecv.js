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
	personalstatement: String,
	experience: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Experience'
		}
	],
	education: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Education'
		}
	},
	skills:{
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Skills'
		}
	}
});

module.exports = mongoose.model('thecv', theCVSchema);