// controllers/recipes.js

const Recipe = require('../models/recipe');

module.exports = {
  index: index,
  new: newRecipe,
  create: create,
  show: show,
  delete: deleteRecipe
};

function index(req, res, next) {
  // pull all recipes
  Recipe.find({})
    .then(function(recipes) {
      res.render('recipes/index', { recipes: recipes });
    })
    .catch(function(err) {
      console.log(err);
      next(err);
    });
}

function newRecipe(req, res, next) {
  res.render('recipes/new');
}

function create(req, res, next) {
  // create a new recipe from req.body
  Recipe.create(req.body)
    .then(function(recipe) {
      console.log('New recipe created:', recipe);
      res.redirect('/recipes');
    })
    .catch(function(err) {
      console.log(err);
      next(err);
    });
}

function show(req, res, next) {
  // find recipe._id in db
  Recipe.findById(req.params.id)
    .then(function(recipe) {
      if (!recipe) {
        console.log('Recipe not found.');
        res.status(404).send('Recipe not found.');
      } else {
        res.render('recipes/show', { recipe: recipe });
      }
    })
    .catch(function(err) {
      console.log(err);
      next(err);
    });
}

function deleteRecipe(req, res, next) {
  // find recipe._id and delete from db
  Recipe.findByIdAndDelete(req.params.id)
    .then(function() {
      console.log('Recipe deleted.');
      res.redirect('/recipes');
    })
    .catch(function(err) {
      console.log(err);
      next(err);
    });
}
