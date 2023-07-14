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
router.get('/:questionId', questionCtrl.show);
// Answer route
router.get('/:questionId/answer', questionCtrl.answer);
// Answer submit route
router.post('/:questionId/answer', questionCtrl.submit);
// Edit route
router.get('/:questionId/edit', questionCtrl.edit);
// Update route
router.put('/:questionId', questionCtrl.update);
// Delete route
router.delete('/:questionId', questionCtrl.delete);

module.exports = router;
