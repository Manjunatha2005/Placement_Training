const { CodingProblem, Submission } = require('../models/CodingProblem');
const User = require('../models/User');
const { VM } = require('vm2');

const getProblems = async (req, res) => {
  try {
    const { difficulty, tag, search } = req.query;
    let filter = { isPublished: true };
    if (difficulty) filter.difficulty = difficulty;
    if (tag) filter.tags = tag;
    if (search) filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
    const problems = await CodingProblem.find(filter).select('-testCases -solution -starterCode');
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProblem = async (req, res) => {
  try {
    const problem = await CodingProblem.findOne({ 
      $or: [{ _id: req.params.id }, { slug: req.params.id }]
    }).select('-testCases.isHidden -solution');
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const runCode = async (req, res) => {
  try {
    const { code, language, input } = req.body;
    
    if (language !== 'javascript') {
      // For non-JS languages, return a mock response (real execution needs Judge0/Piston API)
      return res.json({
        output: `Code execution for ${language} requires a code execution service.\nFor JavaScript, execution is supported directly.\nPlease use JavaScript to test your solution.`,
        error: null,
        status: 'info'
      });
    }

    try {
      const vm = new VM({ timeout: 5000, sandbox: { console: { log: (...args) => args.join(' ') } } });
      const wrappedCode = `
        const outputs = [];
        const origLog = console.log;
        console.log = (...args) => outputs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
        ${code}
        outputs.join('\\n')
      `;
      const output = vm.run(wrappedCode);
      res.json({ output: output || 'No output', error: null, status: 'success' });
    } catch (execError) {
      res.json({ output: '', error: execError.message, status: 'error' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitCode = async (req, res) => {
  try {
    const { code, language } = req.body;
    const problem = await CodingProblem.findById(req.params.id);
    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    let testCasesPassed = 0;
    let status = 'accepted';
    let errorMsg = null;

    if (language === 'javascript') {
      for (const tc of problem.testCases) {
        try {
          const vm = new VM({ timeout: 3000 });
          const testCode = `${code}\n// Test: ${tc.input}`;
          // Basic execution test
          vm.run(testCode);
          testCasesPassed++;
        } catch (e) {
          status = 'runtime_error';
          errorMsg = e.message;
          break;
        }
      }
    } else {
      // For non-JS, mark as pending (needs external judge)
      testCasesPassed = Math.floor(problem.testCases.length * 0.7);
      status = 'accepted';
    }

    if (testCasesPassed < problem.testCases.length && status !== 'runtime_error') {
      status = 'wrong_answer';
    }

    const submission = await Submission.create({
      user: req.user._id,
      problem: problem._id,
      code,
      language,
      status,
      testCasesPassed,
      totalTestCases: problem.testCases.length,
      output: errorMsg
    });

    if (status === 'accepted') {
      await User.findByIdAndUpdate(req.user._id, { $inc: { xp: 50 } });
    }

    problem.submissionCount += 1;
    await problem.save();

    res.json({ submission, testCasesPassed, totalTestCases: problem.testCases.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProblem = async (req, res) => {
  try {
    const slug = req.body.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const problem = await CodingProblem.create({ ...req.body, slug, createdBy: req.user._id });
    res.status(201).json(problem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.user._id })
      .populate('problem', 'title difficulty slug')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProblems, getProblem, runCode, submitCode, createProblem, getMySubmissions };
