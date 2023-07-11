const express = require('express');
const router = express.Router({ mergeParams: true });
const questionCtrl = require('../controllers/questions');

// Index route
router.get('/', questionCtrl.index);
// New route
router.get('/new', questionCtrl.new);
// Create route
router.post('/', questionCtrl.create);
// Show route
router.get('/:id', questionCtrl.show);
// Answer route
router.get('/:id/answer', questionCtrl.answer);
// Answer submit route
router.post('/:id/answer', questionCtrl.submit);
// Edit route
router.get('/:id/edit', questionCtrl.edit);
// Delete route
router.delete('/:id', questionCtrl.delete);

module.exports = router;
