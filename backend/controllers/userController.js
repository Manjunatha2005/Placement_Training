const User = require('../models/User');
const { Result } = require('../models/Test');
const { Submission } = require('../models/CodingProblem');

// @desc Get user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update user profile
const updateProfile = async (req, res) => {
  try {
    const { name, branch, college, graduationYear, skills, targetCompanies, bio, linkedIn, github } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name || user.name;
    user.branch = branch || user.branch;
    user.college = college || user.college;
    user.graduationYear = graduationYear || user.graduationYear;
    user.skills = skills || user.skills;
    user.targetCompanies = targetCompanies || user.targetCompanies;
    user.bio = bio || user.bio;
    user.linkedIn = linkedIn || user.linkedIn;
    user.github = github || user.github;

    const updated = await user.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Upload resume
const uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const user = await User.findById(req.user._id);
    user.resume = `/uploads/${req.file.filename}`;
    await user.save();
    res.json({ resumeUrl: user.resume });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({ role: 'student' })
      .select('name branch college xp streak avatar')
      .sort({ xp: -1 })
      .limit(50);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Admin: get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProfile, updateProfile, uploadResume, getLeaderboard, getAllUsers };
