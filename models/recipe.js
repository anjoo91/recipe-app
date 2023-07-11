const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true 
  },
  recipeName: { 
    type: String, 
    required: true 
  },
  ingredients: { 
    type: String, 
    required: true 
  },
  instructions: { 
    type: String, 
    required: true 
  },
  image: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Recipe', recipeSchema);
