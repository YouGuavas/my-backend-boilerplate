const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dotenv = require('dotenv').config();

module.exports = () => {
	const db = mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`)
	const UserSchema = new Schema({
		email: {
			type: String, required: true,
			trim: true, unique: true,
			match:  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
		},
		twitterProvider: {
			type: {
				id: String,
				token: String
			},
			select: false
		}
	});
	UserSchema.set('toJSON', {getters: true, virtuals: true});
	UserSchema.statics.upsertTwitterUser = function(token, tokenSecret, profile, cb) {
		const that = this;
		return this.findOne({
			'twitterProvider.id': profile.id
		}, (err, user) => {
			if (!user) {
				const newUser = new that({
					email: profile.emails[0].value,
					twitterProvider: {
						id: profile.id,
						token: token,
						tokenSecret: tokenSecret
					}
				});
				newUser.save((err, savedUser) => {
					if (err) console.log(err);
					return cb(err, savedUser);
				});
			} else {
				return cb(err, user);
			}
		});
	};
	mongoose.model('User', UserSchema);
	return db;
};