const passport = require('passport');
const TwitterTokenStrategy = require('passport-twitter-token');
const dotenv = require('dotenv').config();
const User = require('mongoose').model('User');
module.exports = () => {
	passport.use(new TwitterTokenStrategy({
		consumerKey: process.env.TWITTER_KEY,
		consumerSecret: process.env.TWITTER_SECRET,
		includeEmail: true
	},
	(token, tokenSecret, profile, done) => {
		User.upsertTwitterUser(token, tokenSecret, profile, (err, user) => {
			return done(err, user);
		});
	}));
};