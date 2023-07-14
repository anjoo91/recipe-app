const Question = require('../models/question');
const Recipe = require('../models/recipe');

module.exports = {
  index,
  new: newQuestion,
  create,
  show,
  answer,
  submit: submitAnswer,
  edit,
  delete: deleteQuestion
};

// render all questions
function index(req, res, next) {
  Recipe.findById(req.params.id) // Find the recipe by ID
    .then(function(recipe) {
      Question.find({})
        .then(function(questions) {
          // render 'questions/index' & pass questions data and recipe
          res.render('questions/index', { questions: questions, recipe: recipe });
        })
        .catch(function(err) {
          console.log(err);
          next(err);
        });
    })
    .catch(function(err) {
      console.log(err);
      next(err);
    });
}

// render form for new questions
function newQuestion(req, res, next) {
  Recipe.findById(req.params.id) // find recipe by ID
    .then(function(recipe) {
      res.render('questions/new', { recipe: recipe });
    })
    .catch(function(err) {
      console.log(err);
      next(err);
    });
}

// create question
async function create(req, res) {
  try {
    const { question } = req.body;
    const userId = req.user._id;
    const recipeId = req.params.id;

    const newQuestion = new Question({
      userId,
      recipeId,
      question,
    });

    await newQuestion.save();

    // redirect to '/recipes/:id/questions' after successful question creation
    res.redirect(`/recipes/${recipeId}/questions`);
  } catch (error) {
    console.error(error);
    // redirect to '/recipes/:id/questions/new' if an error occurs
    res.redirect(`/recipes/${req.params.id}/questions/new`);
  }
}

// render details of a question
function show(req, res, next) {
  // identify question based on ID in the database
  Question.findById(req.params.id)
    .then(function(question) {
      if (!question) {
        console.log('Question not found.');
        // 404 status and error message if the question is not found
        res.status(404).send('Question not found.');
      } else {
        // render 'questions/show' and pass question data
        res.render('questions/show', { question: question });
      }
    })
    .catch(function(err) {
      console.log(err);
      next(err);
    });
}

// render form to answer question
function answer(req, res, next) {
  // identify question based on ID in db
  Question.findById(req.params.id)
    .populate('recipeId') // populate recipe data
    .then(function(question) {
      if (!question) {
        console.log('Question not found.');
        // 404 status and error message if question not found
        res.status(404).send('Question not found.');
      } else {
        // check if user ID matches recipe user ID
        if (req.user && req.user._id.toString() === question.recipeId.userId.toString()) {
          // render 'questions/answer' and pass question data
          res.render('questions/answer', { question: question });
        } else {
          console.log('Access denied.');
          // 403 status and error message if access is denied
          res.status(403).send('Access denied.');
        }
      }
    })
    .catch(function(err) {
      console.log(err);
      next(err);
    });
}


// submit answer for a question
function submitAnswer(req, res, next) {
  const questionId = req.params.id;
  const answer = req.body.answer;

  Question.findById(questionId)
    .then((question) => {
      if (!question) {
        // question not found
        return res.status(404).send('Question not found.');
      }
      
      question.answer = answer;
      
      question.save()
        .then(() => {
          const recipeId = question.recipeId; // recipe id associated with the question
          res.redirect(`/recipes/${recipeId}/questions/${questionId}`);
        })
        .catch((err) => {
          console.log(err);
          next(err);
        });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
}

// render edit form
function edit(req, res, next) {
  // identify question based on ID in the database
  Question.findById(req.params.id)
    .populate('recipeId') // populate recipe data
    .then(function (question) {
      if (!question) {
        console.log('Question not found.');
        // 404 status and error message if the question is not found
        res.status(404).send('Question not found.');
      } else {
        // render 'questions/edit' and pass question data
        res.render('questions/edit', { question: question, recipe: question.recipeId });
      }
    })
    .catch(function (err) {
      console.log(err);
      next(err);
    });
}



// delete question
function deleteQuestion(req, res, next) {
  const questionId = req.params.id;
  Question.findByIdAndRemove(questionId)
    .then((deletedQuestion) => {
      if (!deletedQuestion) {
        // question not found
        return res.status(404).send('Question not found.');
      }
      const recipeId = deletedQuestion.recipeId; // recipe id associated with deleted question
      res.redirect(`/recipes/${recipeId}/questions`); // redirect to questions index page
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
}