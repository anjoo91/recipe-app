const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
//Require your User Model here!
const User = require('../models/user'); // Update the path based on your file structure


// configuring Passport!
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK
  },
  async function(accessToken, refreshToken, profile, cb) {
    try {
      // Check if the user already exists in the database
      let user = await User.findOne({ email: profile.emails[0].value });

      if (!user) {
        // Create a new user if the user doesn't exist
        user = new User({
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
          name: profile.displayName
        });
        await user.save();
      }

      // Return the user object
      return cb(null, user);
    } catch (err) {
      return cb(err);
    }
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

module.exports = passport;
