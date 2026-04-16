const { Test, Result } = require('../models/Test');
const User = require('../models/User');

const getTests = async (req, res) => {
  try {
    const { type, category, company } = req.query;
    let filter = { isPublished: true };
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (company) filter.company = company;
    const tests = await Test.find(filter).select('-questions.correctAnswer -questions.explanation');
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id).select('-questions.correctAnswer');
    if (!test) return res.status(404).json({ message: 'Test not found' });
    res.json(test);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitTest = async (req, res) => {
  try {
    const { answers, timeTaken } = req.body;
    const test = await Test.findById(req.params.id);
    if (!test) return res.status(404).json({ message: 'Test not found' });

    let score = 0;
    const detailedAnswers = answers.map((ans, idx) => {
      const q = test.questions[idx];
      const isCorrect = q && ans.selectedAnswer === q.correctAnswer;
      if (isCorrect) score += q.marks || 1;
      return {
        questionIndex: idx,
        selectedAnswer: ans.selectedAnswer,
        isCorrect,
        timeTaken: ans.timeTaken || 0
      };
    });

    const totalMarks = test.questions.reduce((sum, q) => sum + (q.marks || 1), 0);
    const percentage = Math.round((score / totalMarks) * 100);
    const passed = percentage >= (test.passingMarks || 40);

    const result = await Result.create({
      user: req.user._id,
      test: test._id,
      answers: detailedAnswers,
      score,
      totalMarks,
      percentage,
      passed,
      timeTaken
    });

    // Award XP
    const xpGained = Math.floor(score * 2);
    await User.findByIdAndUpdate(req.user._id, { $inc: { xp: xpGained } });

    test.attemptedCount += 1;
    await test.save();

    // Return with explanations
    const testWithAnswers = await Test.findById(req.params.id);
    res.json({
      result,
      xpGained,
      questions: testWithAnswers.questions.map((q, i) => ({
        ...q.toObject(),
        userAnswer: detailedAnswers[i]?.selectedAnswer
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTest = async (req, res) => {
  try {
    const test = await Test.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(test);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyResults = async (req, res) => {
  try {
    const results = await Result.find({ user: req.user._id }).populate('test', 'title type category').sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTests, getTest, submitTest, createTest, getMyResults };
