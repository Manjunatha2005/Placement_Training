const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['video', 'article', 'pdf', 'quiz'], default: 'article' },
  body: { type: String },
  url: { type: String },
  duration: { type: Number, default: 0 },
  order: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['aptitude', 'technical', 'company-wise', 'interview', 'soft-skills'],
    required: true
  },
  subcategory: { type: String },
  tags: [{ type: String }],
  thumbnail: { type: String, default: '' },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  contents: [contentSchema],
  enrolledCount: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  companies: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
