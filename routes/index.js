const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

// OAuth logout route
router.post('/logout', function(req, res) {
  req.session.destroy(function(err) {
    if (err) {
      console.error('Error destroying session:', err);
    }
    req.user = null; // Clear the user session
    res.redirect('/');
  });
});

// Google OAuth login route
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback route
router.get(
  '/oauth2callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    // Create or update the user with user id
    User.findOneAndUpdate(
      { googleId: req.user.googleId }, // find the user by id
      { googleId: req.user.googleId }, // force update google id
      { upsert: true, new: true } // create a new user if not found
    )
      .then(user => {
        // Redirect if successful login or user creation
        res.redirect('/recipes');
      })
      .catch(err => {
        console.error(err);
        res.redirect('/');
      });
  }
);

// The root route renders the landing page
router.get('/', function(req, res) {
  res.render('index', { title: 'Recipe Sharing Web App' });
});

module.exports = router;
