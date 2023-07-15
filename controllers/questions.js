const Question = require('../models/question');
const Recipe = require('../models/recipe');

module.exports = {
  index,
  new: newQuestion,
  create,
  show,
  answer,
  submit: submitAnswer,
  edit: editQuestion,
  update: updateQuestion,
  delete: deleteQuestion
};

// Render all questions
async function index(req, res, next) {
  try {
    const recipe = await Recipe.findById(req.params.id).exec(); // Find the recipe by ID
    const questions = await Question.find({}).exec();
    res.render('questions/index', { questions, recipe });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// Render form for new questions
async function newQuestion(req, res, next) {
  try {
    const recipe = await Recipe.findById(req.params.id).exec(); // Find the recipe by ID
    res.render('questions/new', { recipe });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// Create question
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

    // Redirect to '/recipes/:id/questions' after successful question creation
    res.redirect(`/recipes/${recipeId}/questions`);
  } catch (error) {
    console.error(error);
    // Redirect to '/recipes/:id/questions/new' if an error occurs
    res.redirect(`/recipes/${req.params.id}/questions/new`);
  }
};

// Render details of a question
async function show(req, res, next) {
  try {
    const question = await Question.findById(req.params.questionId).exec();

    if (!question) {
      console.log('Question not found.');
      res.status(404).send('Question not found.');
    } else {
      // Fetch the associated recipe
      const recipe = await Recipe.findById(question.recipeId).exec();

      // Render 'questions/show' and pass question and recipe data
      res.render('questions/show', { question, recipe });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// Render form to answer question
async function answer(req, res, next) {
  try {
    const recipeId = req.params.id; // Use req.params.id to get the recipeId
    const question = await Question.findById(req.params.questionId)
      .populate('recipeId')
      .exec();

    if (!question) {
      console.log('Question not found.');
      // 404 status and error message if question not found
      res.status(404).send('Question not found.');
    } else {
      // Check if user ID matches recipe user ID
      if (
        req.user &&
        req.user._id.toString() === question.recipeId.userId.toString()
      ) {
        // Render 'questions/answer' and pass question data
        res.render('questions/answer', { question, recipeId }); // Pass recipeId instead of recipe
      } else {
        console.log('Access denied.');
        // 403 status and error message if access is denied
        res.status(403).send('Access denied.');
      }
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};


// Submit answer for a question
async function submitAnswer(req, res, next) {
  try {
    const questionId = req.params.questionId;
    const answer = req.body.answer;
    const recipeId = req.params.id; // Use req.params.id to get the recipeId

    const question = await Question.findById(questionId).exec();

    if (!question) {
      return res.status(404).send('Question not found.');
    }

    question.answer = answer;

    await question.save();

    res.redirect(`/recipes/${recipeId}/questions/${questionId}`);
  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).send('An error occurred while submitting the answer.');
  }
};


// Render form to edit a question
async function editQuestion(req, res, next) {
  try {
    const question = await Question.findById(req.params.questionId).exec();
    const { user } = req;

    // Check if the question exists
    if (!question) {
      return res.status(404).send('Question not found.');
    }

    // Check if the current user is the owner of the question
    if (!user || question.userId.toString() !== user._id.toString()) {
      return res.status(403).send('Unauthorized');
    }

    const recipe = await Recipe.findById(question.recipeId).exec();

    res.render('questions/edit', { question, recipe });
  } catch (error) {
    console.error('Error editing question:', error);
    res.status(500).send('An error occurred while editing the question.');
  }
};

// Update a question
async function updateQuestion(req, res, next) {
  try {
    const { questionId } = req.params;
    const { question } = req.body;
    const { user } = req;

    // Check if the current user is the owner of the question
    const updatedQuestion = await Question.findOneAndUpdate(
      { _id: questionId, userId: user._id },
      { $set: { question } },
      { new: true }
    ).exec();

    // Check if the question exists
    if (!updatedQuestion) {
      return res.status(404).send('Question not found.');
    }

    res.redirect(`/recipes/${updatedQuestion.recipeId}/questions/${updatedQuestion._id}`);
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).send('An error occurred while updating the question.');
  }
};

// Delete question
async function deleteQuestion(req, res, next) {
  try {
    const questionId = req.params.id;
    const deletedQuestion = await Question.findByIdAndRemove(questionId).exec();

    if (!deletedQuestion) {
      // Question not found
      return res.status(404).send('Question not found.');
    }

    const recipeId = deletedQuestion.recipeId; // Recipe ID associated with deleted question
    res.redirect(`/recipes/${recipeId}/questions`); // Redirect to questions index page
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).send('An error occurred while deleting the question.');
  }
};
