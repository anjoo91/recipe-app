const Recipe = require('../models/recipe');
const Review = require('../models/review');

module.exports = {
  index,
  new: newReview,
  create,
  delete: deleteReview,
  edit: editReview,
  update: updateReview
};

// render reviews for a recipe
async function index(req, res, next) {
  try {
    const reviews = await Review.find({ recipeId: req.params.id });
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).send('Recipe not found.');
    }
    res.render('reviews/index', { reviews, recipe });
  } catch (err) {
    console.log(err);
    next(err);
  }
}

// render form to create review
async function newReview(req, res, next) {
  try {
    const recipe = await Recipe.findById(req.params.id);
    res.render('reviews/new', { recipe });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// create a new review
async function create(req, res) {
  try {
    const { title, rating, content } = req.body;
    const userId = req.user._id;
    const recipeId = req.params.id;

    const newReview = new Review({
      userId,
      recipeId,
      title,
      rating,
      content
    });

    await newReview.save();

    res.redirect(`/recipes/${recipeId}/reviews`);
  } catch (error) {
    console.error(error);
    res.redirect(`/recipes/${req.params.id}/reviews`);
  }
};

// delete a review
async function deleteReview(req, res, next) {
  try {
    const { reviewId } = req.params;
    const { user } = req;

    // Check if the current user is the owner of the review
    const review = await Review.findOneAndDelete({ _id: reviewId, userId: user._id });

    // Check if the review exists
    if (!review) {
      return res.status(404).send('Review not found.');
    }

    res.redirect(`/recipes/${review.recipeId}/reviews`);
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).send('An error occurred while deleting the review.');
  }
};

// render form to edit reviews
async function editReview(req, res, next) {
  try {
    const review = await Review.findById(req.params.reviewId);
    const { user } = req;

    // Check if the review exists
    if (!review) {
      return res.status(404).send('Review not found.');
    }

    // Check if the current user is the owner of the review
    if (!user || review.userId.toString() !== user._id.toString()) {
      return res.status(403).send('Unauthorized');
    }

    const recipe = await Recipe.findById(review.recipeId); // Fetch the associated recipe

    res.render('reviews/edit', { review, recipe }); // Pass the recipe
  } catch (error) {
    console.error('Error editing review:', error);
    res.status(500).send('An error occurred while editing the review.');
  }
}



// update a review
async function updateReview(req, res, next) {
  try {
    const { reviewId } = req.params;
    const { title, rating, content } = req.body;
    const { user } = req;

    // Check if the current user is the owner of the review
    const review = await Review.findOneAndUpdate(
      { _id: reviewId, userId: user._id },
      { $set: { title, rating, content } },
      { new: true }
    );

    // Check if the review exists
    if (!review) {
      return res.status(404).send('Review not found.');
    }

    res.redirect(`/recipes/${review.recipeId}/reviews`);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).send('An error occurred while updating the review.');
  }
};
