const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//생성될 필드명을 정한다.
const inflearnSchema = new Schema({
	title: String,
	instructor: String,
	price: [{del:String, pay:String}],
	rating: String,
	img: String
},
{
  timestamps: true
});

// Create Model & Export
module.exports = mongoose.model('inflearn', inflearnSchema);