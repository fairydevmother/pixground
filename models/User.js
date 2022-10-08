const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema( {
	
	unique_id: Number,
	email: String,
	profilePhotoLocation:String,
	username: String,
	password: String,
	passwordConf: String,
});

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', userSchema);


module.exports = User;