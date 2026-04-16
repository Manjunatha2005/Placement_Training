const User = require('../models/User');
const { Result } = require('../models/Test');
const { Submission } = require('../models/CodingProblem');
const Course = require('../models/Course');
const { Test } = require('../models/Test');

// @desc Get student dashboard data
const getStudentDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const [results, submissions, user] = await Promise.all([
      Result.find({ user: userId }).populate('test', 'title type category').sort({ createdAt: -1 }).limit(10),
      Submission.find({ user: userId }).populate('problem', 'title difficulty').sort({ createdAt: -1 }).limit(10),
      User.findById(userId)
    ]);

    // Stats
    const totalTests = results.length;
    const avgScore = totalTests > 0
      ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / totalTests)
      : 0;
    const totalSolved = submissions.filter(s => s.status === 'accepted').length;

    // Performance by category
    const categoryPerf = {};
    results.forEach(r => {
      const cat = r.test?.category || 'general';
      if (!categoryPerf[cat]) categoryPerf[cat] = { total: 0, score: 0 };
      categoryPerf[cat].total++;
      categoryPerf[cat].score += r.percentage;
    });
    const categoryStats = Object.entries(categoryPerf).map(([cat, data]) => ({
      category: cat,
      avgScore: Math.round(data.score / data.total)
    }));

    // Weekly activity (last 7 days)
    const weeklyActivity = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      const tests = results.filter(r => r.createdAt >= dayStart && r.createdAt <= dayEnd).length;
      const solves = submissions.filter(s => s.createdAt >= dayStart && s.createdAt <= dayEnd && s.status === 'accepted').length;
      weeklyActivity.push({
        day: dayStart.toLocaleDateString('en', { weekday: 'short' }),
        tests,
        solves
      });
    }

    // Difficulty distribution for coding
    const difficultyDist = { easy: 0, medium: 0, hard: 0 };
    submissions.filter(s => s.status === 'accepted').forEach(s => {
      if (s.problem?.difficulty) difficultyDist[s.problem.difficulty]++;
    });

    res.json({
      user: {
        name: user.name,
        xp: user.xp,
        streak: user.streak,
        avatar: user.avatar,
        branch: user.branch,
        college: user.college
      },
      stats: {
        totalTests,
        avgScore,
        totalSolved,
        xp: user.xp,
        streak: user.streak
      },
      recentResults: results.slice(0, 5),
      recentSubmissions: submissions.slice(0, 5),
      categoryStats,
      weeklyActivity,
      difficultyDist
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get admin dashboard data
const getAdminDashboard = async (req, res) => {
  try {
    const [totalUsers, totalTests, totalCourses, recentUsers, recentResults] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Test.countDocuments(),
      Course.countDocuments(),
      User.find({ role: 'student' }).sort({ createdAt: -1 }).limit(5).select('name email branch createdAt'),
      Result.find().populate('user', 'name').populate('test', 'title').sort({ createdAt: -1 }).limit(10)
    ]);

    const totalSubmissions = await Submission.countDocuments();

    res.json({
      stats: { totalUsers, totalTests, totalCourses, totalSubmissions },
      recentUsers,
      recentResults
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStudentDashboard, getAdminDashboard };
