const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  recipeName: {
    type: String,
    required: true,
  },
  ingredients: {
    type: String,
    required: true,
  },
  instructions: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  cuisine: {
    type: String,
  },
});

module.exports = mongoose.model('Recipe', recipeSchema);
