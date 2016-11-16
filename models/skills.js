var mongoose = require('mongoose');

var skillsSchema = new mongoose.Schema({
		name: String,
		description: String,
});

module.exports = mongoose.model('Skills', skillsSchema);