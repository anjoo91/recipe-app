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
    const reviews = await Review.find({});
    const recipe = await Recipe.findById(req.params.id);
    res.render('reviews/index', { reviews, recipe });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

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
    const review = await Review.findById(req.params.reviewId);
    const recipeId = req.params.id;

    // check current user ID matches the review's user ID
    if (review.userId.toString() === req.user._id.toString()) {
      await Review.findByIdAndDelete(req.params.reviewId);
      console.log('Review deleted.');
      res.redirect(`/recipes/${recipeId}/reviews`);
    } else {
      // if user ID doesn't match, redirect with a msg
      req.flash('error', 'You are not authorized to delete this review.');
      res.redirect(`/recipes/${recipeId}/reviews`);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// render form to edit reviews
async function editReview(req, res, next) {
  try {
    const review = await Review.findById(req.params.reviewId);
    const recipeId = req.params.id;

    // check if current user ID matches the review's user ID
    if (review.userId.toString() === req.user._id.toString()) {
      res.render('reviews/edit', { review, recipe: review.recipeId });
    } else {
      // if user ID doesn't match, redirect with a msg
      req.flash('error', 'You are not authorized to edit this review.');
      res.redirect(`/recipes/${recipeId}/reviews`);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
}


// update a review
async function updateReview(req, res, next) {
  try {
    const { title, rating, content } = req.body;
    const reviewId = req.params.reviewId;
    const recipeId = req.params.id;

    const review = await Review.findById(reviewId);

    // check if current user ID matches the review's user ID
    if (review.userId.toString() === req.user._id.toString()) {
      await Review.findByIdAndUpdate(reviewId, { title, rating, content });
      console.log('Review updated.');
      res.redirect(`/recipes/${recipeId}/reviews`);
    } else {
      // if user ID doesn't match, redirect with a msg
      req.flash('error', 'You are not authorized to update this review.');
      res.redirect(`/recipes/${recipeId}/reviews`);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
}

