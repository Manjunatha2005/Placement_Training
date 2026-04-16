const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  type: { type: String, enum: ['mcq', 'true-false', 'fill-blank'], default: 'mcq' },
  options: [{ type: String }],
  correctAnswer: { type: Number, required: true },
  explanation: { type: String },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  topic: { type: String },
  marks: { type: Number, default: 1 }
}, { timestamps: true });

const testSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['topic-wise', 'mock', 'company'], default: 'topic-wise' },
  category: { type: String },
  company: { type: String },
  questions: [questionSchema],
  duration: { type: Number, required: true }, // in minutes
  totalMarks: { type: Number },
  passingMarks: { type: Number },
  isPublished: { type: Boolean, default: true },
  attemptedCount: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const resultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  answers: [{
    questionIndex: Number,
    selectedAnswer: Number,
    isCorrect: Boolean,
    timeTaken: Number
  }],
  score: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  percentage: { type: Number, required: true },
  passed: { type: Boolean },
  timeTaken: { type: Number }, // in seconds
  completedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Question = mongoose.model('Question', questionSchema);
const Test = mongoose.model('Test', testSchema);
const Result = mongoose.model('Result', resultSchema);

module.exports = { Test, Result, Question };
