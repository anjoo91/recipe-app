const express = require('express');
const router = express.Router({ mergeParams: true });
const reviewCtrl = require('../controllers/reviews');
const isLoggedIn = require('../config/auth');

// Index
router.get('/', isLoggedIn, reviewCtrl.index);
// New Route
router.get('/new', isLoggedIn, reviewCtrl.new);
// Create Route
router.post('/', isLoggedIn, reviewCtrl.create);
// Edit Route
router.get('/:reviewId/edit', isLoggedIn, reviewCtrl.edit);
// Update Route
router.put('/:reviewId', isLoggedIn, reviewCtrl.update);
// Delete Route
router.delete('/:reviewId', isLoggedIn, reviewCtrl.delete);

module.exports = router;
