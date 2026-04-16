const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
  isHidden: { type: Boolean, default: false },
  explanation: { type: String }
});

const codingProblemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  tags: [{ type: String }],
  companies: [{ type: String }],
  constraints: { type: String },
  examples: [{
    input: String,
    output: String,
    explanation: String
  }],
  testCases: [testCaseSchema],
  starterCode: {
    javascript: { type: String, default: '// Write your solution here\nfunction solution() {\n  \n}' },
    python: { type: String, default: '# Write your solution here\ndef solution():\n    pass' },
    java: { type: String, default: '// Write your solution here\npublic class Solution {\n    public static void main(String[] args) {\n        \n    }\n}' },
    cpp: { type: String, default: '// Write your solution here\n#include<iostream>\nusing namespace std;\nint main() {\n    return 0;\n}' }
  },
  hints: [{ type: String }],
  solution: { type: String },
  acceptanceRate: { type: Number, default: 0 },
  submissionCount: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const submissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  problem: { type: mongoose.Schema.Types.ObjectId, ref: 'CodingProblem', required: true },
  code: { type: String, required: true },
  language: { type: String, enum: ['javascript', 'python', 'java', 'cpp'], required: true },
  status: { type: String, enum: ['accepted', 'wrong_answer', 'runtime_error', 'time_limit_exceeded', 'compilation_error', 'pending'], default: 'pending' },
  output: { type: String },
  executionTime: { type: Number },
  testCasesPassed: { type: Number, default: 0 },
  totalTestCases: { type: Number, default: 0 }
}, { timestamps: true });

const CodingProblem = mongoose.model('CodingProblem', codingProblemSchema);
const Submission = mongoose.model('Submission', submissionSchema);

module.exports = { CodingProblem, Submission };
