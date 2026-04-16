const mongoose = require('mongoose');

const placementDriveSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date },
  eligibility: { type: String },
  ctc: { type: String },
  roles: [{ type: String }],
  registrationLink: { type: String },
  isActive: { type: Boolean, default: true }
});

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String, default: '' },
  description: { type: String },
  website: { type: String },
  industry: { type: String },
  size: { type: String },
  interviewProcess: { type: String },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  topTopics: [{ type: String }],
  drives: [placementDriveSchema],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
