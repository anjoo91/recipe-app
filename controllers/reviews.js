const Review = require('../models/review');

module.exports = {
    index: review,
    show: reviewShow,
    create: reviewCreate,
};

// Render reviews for a recipe
function review(req, res, next) {
  const recipeId = req.params.id;
  Review.find({ recipeId })
    .sort({ timestamp: -1 }) // Sort reviews in desc order based on timestamp
    .then((reviews) => {
      res.render('reviews', { reviews }); // Render reviews/index.ejs
    })
    .catch((err) => next(err));
}

// Render review form
function reviewShow(req, res, next) {
  if (!req.user) {
    return res.redirect('/login');
  }
  res.render('reviewForm'); // Render review/new.ejs
}

// Review creation
function reviewCreate(req, res, next) {
  if (!req.user) {
    return res.redirect('/login');
  }

  const recipeId = req.params.id;
  const { reviewContent } = req.body;

  const review = new Review({
    recipeId,
    reviewContent,
    userId: req.user._id, // Set 'userId' to current user ID
  });

  review.save()
    .then(() => {
      res.redirect(`/recipes/${recipeId}`); // Redirect to recipe page after successful review
    })
    .catch((err) => next(err));
}


