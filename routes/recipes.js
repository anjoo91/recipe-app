const express = require('express');
const router = express.Router();
const recipeCtrl = require('../controllers/recipes');

// Index
router.get('/', recipeCtrl.index);
// New Route
router.get('/new', recipeCtrl.new);
// Create Route
router.post('/', recipeCtrl.create);
// Show Route 
router.get('/:id', recipeCtrl.show);
// Delete Route
router.delete('/:id', recipeCtrl.delete);


module.exports = router;
