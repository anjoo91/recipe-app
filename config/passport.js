// File where we can configure our passport strategies (login in with google, login with facebook, etc.... are all strategies)
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const UserModel = require("../models/user");

// this function middleware will be called everytime a USER LOG's in
passport.use(
  new GoogleStrategy(
    // Configuration object, we need to tell google its our app!
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK,
    },
    // The verify callback function (Gets called everytime a user logs in!)
    async function (accessToken, refreshToken, profile, cb) {
      //< - information we want is in the profile object
      // a user has logged in with OAuth...

      // cb (callback) function signature, cb(error, SuccessfulDataYouWantToPassAlong) in our case successful data will the be users document from mongodb
      try {
        // if the user has logged in before, we want to make sure that we pass the users information along in our middlware chain
        let userDocument = await UserModel.findOne({ googleId: profile.id });
        // if no user is found, the let user, would be undefined otherwise its the users document from mongodb

        // so if we found the user, pass thier information to the next function in the middleware chain
        if (userDocument) return cb(null, userDocument);
        // if its the users first time loggin in, we need to create a user document and store them in our database, and then pass the user information
        // along in our middleware chain

        // first time logging in! Create the user!
        userDocument = await UserModel.create({
          name: profile.displayName,
          googleId: profile.id,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
        });
        // pass the created users information to the next function in the middleware chain
        return cb(null, userDocument);
      } catch (err) {
        return cb(err);
      }
    }
  )
);

// this function is called after the verify callback above, 2nd function called after the user logs
// in, and its job is to take the userDocument (user) and add the id of the user to the session cookie

passport.serializeUser(function(user, cb){
	cb(null, user._id); // this is adding the users mongodb id to the session cookie
});

// on every http request when the user is logged in, we need to open the cookie, get the user mongodb._id
// add attach the users document to req.user, so our controller functions know who is making the http request
passport.deserializeUser(async function(userId, cb){
	const user = await UserModel.findById(userId); // find the user by getting the id from the session cookie and search the db
	cb(null, user); // req.user = user document from the database
})