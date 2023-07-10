const Question = require('../models/question');

module.exports = {
    index: question,
    show: questionShow,
    create: questionCreate,
};

// Render questions for a recipe
function question(req, res, next) {
  const recipeId = req.params.id;
  Question.find({ recipeId })
    .sort({ timestamp: -1 }) // Sort questions in desc order based on timestamp
    .then((questions) => {
      res.render('questions', { questions }); // Render the questions/index.ejs
    })
    .catch((err) => next(err));
}

// Render question form
function questionShow(req, res, next) {
  if (!req.user) {
    return res.redirect('/login');
  }
  res.render('questionForm'); // Render question/new.ejs
}

// Create question
function questionCreate(req, res, next) {
  if (!req.user) {
    return res.redirect('/login');
  }

  const recipeId = req.params.id;
  const { questionContent } = req.body;

  const question = new Question({
    recipeId,
    questionContent,
    userId: req.user._id, // Set 'userId' to current user ID
  });

  question.save()
    .then(() => {
      res.redirect(`/recipes/${recipeId}`); // Redirect to recipe page after successful question
    })
    .catch((err) => next(err));
}
