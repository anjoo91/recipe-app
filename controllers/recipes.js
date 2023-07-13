const Recipe = require('../models/recipe');

module.exports = {
  index,
  new: newRecipe,
  create,
  show,
  edit,
  delete: deleteRecipe
};

// render all recipes
function index(req, res, next) {
  // pull all recipes from the db
  Recipe.find({})
    .then(function(recipes) {
      // render the 'recipes/index' & pass recipe data
      res.render('recipes/index', { recipes: recipes });
    })
    .catch(function(err) {
      console.log(err);
      next(err);
    });
}

// render form for new recipes
function newRecipe(req, res, next) {
  res.render('recipes/new');
}

// create new recipe
async function create(req, res) {
  try {
    const { recipeName, ingredients, instructions, image } = req.body;

    // user ID assigned to recipe
    const userId = req.user._id;

    const newRecipe = new Recipe({
      userId: userId,
      recipeName: recipeName,
      ingredients: ingredients,
      instructions: instructions,
      image: image,
    });

    await newRecipe.save();

    // redirect to the '/recipes' page after successful creation of recipe
    res.redirect('/recipes');
  } catch (error) {
    console.error(error);
    // redirect to the '/recipes/new' page if an error occurs
    res.redirect('/recipes/new');
  }
}

// render details of a recipe
function show(req, res, next) {
  // identify the recipe based on ID in the db
  Recipe.findById(req.params.id)
    .then(function(recipe) {
      if (!recipe) {
        console.log('Recipe not found.');
        // 404 status and error message if the recipe is not found
        res.status(404).send('Recipe not found.');
      } else {
        // render 'recipes/show' and pass recipe data
        res.render('recipes/show', { recipe: recipe });
      }
    })
    .catch(function(err) {
      console.log(err);
      next(err);
    });
}

// render form to edit recipe
function edit(req, res, next) {
  // identify the recipe based on ID in the database
  Recipe.findById(req.params.id)
    .then(function(recipe) {
      if (!recipe) {
        console.log('Recipe not found.');
        // 404 status and error message if the recipe is not found
        res.status(404).send('Recipe not found.');
      } else {
        // check if the logged-in user is owner of recipe
        if (recipe.userId.toString() !== req.user._id.toString()) {
          console.log('Unauthorized access to edit recipe.');
          // 403 status and error message if user is not authorized to edit recipe
          res.status(403).send('Unauthorized');
        } else {
          // render 'recipes/edit' and pass recipe data
          res.render('recipes/edit', { recipe: recipe });
        }
      }
    })
    .catch(function(err) {
      console.log(err);
      next(err);
    });
}

// delete a recipe
function deleteRecipe(req, res, next) {
  // identify recipe based on ID and delete it from db
  Recipe.findByIdAndDelete(req.params.id)
    .then(function() {
      console.log('Recipe deleted.');
      // redirect to the '/recipes' page after successful deletion of recipe
      res.redirect('/recipes');
    })
    .catch(function(err) {
      console.log(err);
      next(err);
    });
}
