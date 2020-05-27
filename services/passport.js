const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const keys = require("../config/keys");

const User = mongoose.model("User");

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findById(id).then(user => {
		done(null, user);
	});
});

passport.use(
	new GoogleStrategy(
		{
			clientID: keys.googleClientId,
			clientSecret: keys.clientSecret,
			callbackURL: "/auth/google/callback",
			proxy: true,
		},
		async (accessToken, refreshToken, profile, done) => {
			const { _json: jsonProfile } = profile;
			console.log(jsonProfile);
			try {
				const existingUser = await User.findOne({ googleId: jsonProfile.sub });
				// if find
				if (existingUser) {
					return done(null, existingUser);
				}
				// if cant find data
				const user = await new User({
					googleId: jsonProfile.sub,
					email: jsonProfile.email,
					name: jsonProfile.displayName,
				}).save();
				done(null, user);
			} catch (error) {
				done(error, null);
			}
		},
	),
);
