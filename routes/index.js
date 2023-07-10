const express = require('express');
const router = express.Router();
const passport = require('passport');

// The root route renders the landing page
router.get('/', function(req, res) {
  res.render('index', { title: 'Recipe Sharing Web App' });
});

// Google OAuth login route
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback route
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    // redirect to the main recipe page after successful login
    res.redirect('/recipes');
  }
);

// OAuth logout route
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
