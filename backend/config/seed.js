require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Course = require('./models/Course');
const { Test } = require('./models/Test');
const { CodingProblem } = require('./models/CodingProblem');
const Company = require('./models/Company');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB');

  // Clear existing data
  await Promise.all([User.deleteMany(), Course.deleteMany(), Test.deleteMany(), CodingProblem.deleteMany(), Company.deleteMany()]);
  console.log('Cleared existing data');

  // Admin user
  const admin = await User.create({
    name: 'Admin User', email: 'admin@placeprep.com', password: 'admin123',
    role: 'admin', branch: 'CSE', college: 'PlacePrep University'
  });

  // Student users
  await User.create([
    { name: 'Arjun Sharma', email: 'arjun@student.com', password: 'student123', branch: 'CSE', college: 'IIT Delhi', skills: ['JavaScript', 'Python', 'DSA'], targetCompanies: ['Google', 'Microsoft'], xp: 1250, streak: 7 },
    { name: 'Priya Patel', email: 'priya@student.com', password: 'student123', branch: 'IT', college: 'NIT Trichy', skills: ['Java', 'Spring Boot'], targetCompanies: ['Infosys', 'TCS'], xp: 980, streak: 3 },
    { name: 'Rahul Kumar', email: 'rahul@student.com', password: 'student123', branch: 'ECE', college: 'VIT Vellore', skills: ['C++', 'Python'], xp: 750, streak: 5 }
  ]);

  // Courses
  await Course.create([
    {
      title: 'Complete DSA Masterclass', description: 'Master Data Structures & Algorithms from basics to advanced. Covers Arrays, Linked Lists, Trees, Graphs, DP and more.',
      category: 'technical', subcategory: 'DSA', difficulty: 'intermediate', tags: ['arrays', 'trees', 'graphs', 'dp'], createdBy: admin._id,
      contents: [
        { title: 'Introduction to Arrays', type: 'article', body: 'Arrays are the most fundamental data structure...', order: 1 },
        { title: 'Linked Lists Deep Dive', type: 'article', body: 'A linked list is a linear data structure...', order: 2 },
        { title: 'Binary Trees & BST', type: 'article', body: 'Trees are hierarchical data structures...', order: 3 }
      ]
    },
    {
      title: 'Quantitative Aptitude for Placements', description: 'Complete coverage of quantitative aptitude topics asked in placement exams with shortcuts and tricks.',
      category: 'aptitude', subcategory: 'Quantitative', difficulty: 'beginner', tags: ['percentage', 'ratio', 'profit-loss', 'time-work'], createdBy: admin._id,
      contents: [
        { title: 'Percentages & Ratios', type: 'article', body: 'Percentages are a way of expressing fractions...', order: 1 },
        { title: 'Time, Speed & Distance', type: 'article', body: 'Problems on TSD are very common in aptitude tests...', order: 2 }
      ]
    },
    {
      title: 'DBMS Interview Preparation', description: 'Everything you need to know about Database Management Systems for technical interviews.',
      category: 'technical', subcategory: 'DBMS', difficulty: 'intermediate', tags: ['sql', 'normalization', 'transactions', 'indexing'], createdBy: admin._id,
      contents: [
        { title: 'SQL Fundamentals', type: 'article', body: 'SQL stands for Structured Query Language...', order: 1 },
        { title: 'Normalization', type: 'article', body: 'Normalization is the process of organizing data...', order: 2 }
      ]
    },
    {
      title: 'TCS Preparation Guide', description: 'Company-specific preparation for TCS placement drives. Covers TCS NQT pattern and previous year questions.',
      category: 'company-wise', subcategory: 'TCS', difficulty: 'beginner', tags: ['tcs', 'nqt', 'aptitude', 'coding'], companies: ['TCS'], createdBy: admin._id,
      contents: [{ title: 'TCS NQT Pattern & Strategy', type: 'article', body: 'TCS NQT consists of...', order: 1 }]
    }
  ]);

  // Tests
  await Test.create([
    {
      title: 'Aptitude Mock Test 1', description: 'Full-length aptitude test covering Quant, Logical, and Verbal sections.',
      type: 'mock', category: 'aptitude', duration: 60, totalMarks: 30, passingMarks: 12, createdBy: admin._id,
      questions: [
        { text: 'If 20% of a number is 50, what is 30% of that number?', type: 'mcq', options: ['65', '75', '85', '90'], correctAnswer: 1, explanation: '20% = 50, so 100% = 250. 30% of 250 = 75', difficulty: 'easy', topic: 'Percentages', marks: 1 },
        { text: 'A train travels 360 km in 4 hours. What is its speed in km/h?', type: 'mcq', options: ['80', '90', '100', '85'], correctAnswer: 1, explanation: 'Speed = Distance/Time = 360/4 = 90 km/h', difficulty: 'easy', topic: 'Speed & Distance', marks: 1 },
        { text: 'What is the next number in the series: 2, 6, 12, 20, 30, ?', type: 'mcq', options: ['40', '42', '44', '46'], correctAnswer: 1, explanation: 'Pattern: n(n+1). So 6*7 = 42', difficulty: 'medium', topic: 'Number Series', marks: 1 },
        { text: 'If APPLE is coded as 50, how is MANGO coded?', type: 'mcq', options: ['55', '56', '57', '58'], correctAnswer: 1, explanation: 'Sum of positions: M(13)+A(1)+N(14)+G(7)+O(15) = 50. Same logic.', difficulty: 'medium', topic: 'Coding', marks: 1 },
        { text: 'Two pipes A and B can fill a tank in 12 and 18 hours. How long together?', type: 'mcq', options: ['6.2 hours', '7.2 hours', '8 hours', '7 hours'], correctAnswer: 1, explanation: '1/12 + 1/18 = 5/36. Time = 36/5 = 7.2 hours', difficulty: 'medium', topic: 'Pipes & Cisterns', marks: 1 }
      ]
    },
    {
      title: 'DSA Topic Test - Arrays', description: 'Test your knowledge of array data structure and related algorithms.',
      type: 'topic-wise', category: 'technical', duration: 30, totalMarks: 10, passingMarks: 4, createdBy: admin._id,
      questions: [
        { text: 'What is the time complexity of binary search?', type: 'mcq', options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'], correctAnswer: 1, explanation: 'Binary search divides array in half each time: O(log n)', difficulty: 'easy', topic: 'Arrays', marks: 1 },
        { text: 'Which sorting algorithm has worst case O(n log n)?', type: 'mcq', options: ['Bubble Sort', 'Quick Sort', 'Merge Sort', 'Insertion Sort'], correctAnswer: 2, explanation: 'Merge sort always runs in O(n log n) even in worst case', difficulty: 'easy', topic: 'Sorting', marks: 1 },
        { text: 'What is the space complexity of merge sort?', type: 'mcq', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], correctAnswer: 2, explanation: 'Merge sort needs O(n) auxiliary space for merging', difficulty: 'medium', topic: 'Sorting', marks: 1 }
      ]
    },
    {
      title: 'TCS Mock Test', description: 'Simulates the actual TCS NQT pattern with aptitude and coding sections.',
      type: 'company', company: 'TCS', category: 'company', duration: 90, totalMarks: 40, passingMarks: 16, createdBy: admin._id,
      questions: [
        { text: 'A shopkeeper buys an item for ₹200 and sells at 25% profit. What is the selling price?', type: 'mcq', options: ['₹240', '₹250', '₹260', '₹220'], correctAnswer: 1, explanation: 'SP = CP * (1 + 25/100) = 200 * 1.25 = ₹250', difficulty: 'easy', topic: 'Profit & Loss', marks: 1 },
        { text: 'Which data structure uses LIFO principle?', type: 'mcq', options: ['Queue', 'Stack', 'Array', 'Linked List'], correctAnswer: 1, explanation: 'Stack follows Last In First Out (LIFO)', difficulty: 'easy', topic: 'DSA', marks: 1 }
      ]
    }
  ]);

  // Coding Problems
  await CodingProblem.create([
    {
      title: 'Two Sum', slug: 'two-sum',
      description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
      difficulty: 'easy', tags: ['array', 'hash-map'], companies: ['Google', 'Amazon', 'Facebook'],
      constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9',
      examples: [{ input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] = 2 + 7 = 9' }],
      testCases: [{ input: '[2,7,11,15]\n9', output: '[0,1]' }, { input: '[3,2,4]\n6', output: '[1,2]' }],
      starterCode: { javascript: 'function twoSum(nums, target) {\n  // Your code here\n}', python: 'def two_sum(nums, target):\n    # Your code here\n    pass', java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your code here\n        return new int[]{};\n    }\n}', cpp: '#include<vector>\nusing namespace std;\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Your code here\n        return {};\n    }\n};' },
      hints: ['Try using a HashMap', 'For each element, check if (target - element) exists in the map']
    },
    {
      title: 'Reverse a String', slug: 'reverse-string',
      description: 'Write a function that reverses a string. The input string is given as an array of characters `s`.\nYou must do this by modifying the input array in-place with O(1) extra memory.',
      difficulty: 'easy', tags: ['string', 'two-pointer'], companies: ['Microsoft', 'Amazon'],
      constraints: '1 <= s.length <= 10^5',
      examples: [{ input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]', explanation: 'Reversed the array in place' }],
      testCases: [{ input: '["h","e","l","l","o"]', output: '["o","l","l","e","h"]' }, { input: '["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]' }],
      starterCode: { javascript: 'function reverseString(s) {\n  // Your code here\n}', python: 'def reverse_string(s):\n    # Your code here\n    pass' }
    },
    {
      title: 'Valid Parentheses', slug: 'valid-parentheses',
      description: 'Given a string s containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.\nAn input string is valid if: Open brackets must be closed by the same type of brackets, and open brackets must be closed in the correct order.',
      difficulty: 'easy', tags: ['stack', 'string'], companies: ['Amazon', 'Microsoft', 'Google'],
      constraints: '1 <= s.length <= 10^4',
      examples: [{ input: 's = "()"', output: 'true' }, { input: 's = "()[]{}"', output: 'true' }, { input: 's = "(]"', output: 'false' }],
      testCases: [{ input: '()', output: 'true' }, { input: '()[]{} ', output: 'true' }, { input: '(]', output: 'false' }],
      starterCode: { javascript: 'function isValid(s) {\n  // Your code here\n}', python: 'def is_valid(s):\n    # Your code here\n    pass' },
      hints: ['Use a stack to keep track of opening brackets']
    },
    {
      title: 'Maximum Subarray', slug: 'maximum-subarray',
      description: 'Given an integer array `nums`, find the subarray with the largest sum, and return its sum.',
      difficulty: 'medium', tags: ['array', 'dynamic-programming', 'divide-conquer'], companies: ['Amazon', 'Microsoft', 'Adobe'],
      constraints: '1 <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4',
      examples: [{ input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6' }],
      testCases: [{ input: '[-2,1,-3,4,-1,2,1,-5,4]', output: '6' }, { input: '[1]', output: '1' }, { input: '[5,4,-1,7,8]', output: '23' }],
      starterCode: { javascript: 'function maxSubArray(nums) {\n  // Kadane\'s Algorithm\n}', python: 'def max_sub_array(nums):\n    # Use Kadane\'s Algorithm\n    pass' },
      hints: ["Try Kadane's Algorithm", "Keep track of current sum and maximum sum"]
    },
    {
      title: 'Binary Search', slug: 'binary-search',
      description: 'Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If target exists, return its index. Otherwise, return -1.',
      difficulty: 'easy', tags: ['array', 'binary-search'], companies: ['Google', 'Facebook', 'Apple'],
      constraints: '1 <= nums.length <= 10^4\nAll integers in nums are unique',
      examples: [{ input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4', explanation: '9 exists at index 4' }],
      testCases: [{ input: '[-1,0,3,5,9,12]\n9', output: '4' }, { input: '[-1,0,3,5,9,12]\n2', output: '-1' }],
      starterCode: { javascript: 'function search(nums, target) {\n  // Binary search\n}', python: 'def search(nums, target):\n    # Binary search\n    pass' }
    }
  ]);

  // Companies
  await Company.create([
    {
      name: 'TCS', description: 'Tata Consultancy Services - India\'s largest IT company', industry: 'IT Services', size: '500,000+',
      difficulty: 'easy', topTopics: ['Aptitude', 'Logical Reasoning', 'Basic Programming', 'Verbal'],
      interviewProcess: 'TCS NQT → TR Round → HR Round',
      drives: [{ title: 'TCS Campus Drive 2025', description: 'On-campus recruitment for 2025 batch', eligibility: '60% throughout, no active backlogs', ctc: '3.36 LPA', roles: ['System Engineer', 'Software Developer'], isActive: true }]
    },
    {
      name: 'Infosys', description: 'Infosys Limited - Global technology services company', industry: 'IT Services', size: '300,000+',
      difficulty: 'easy', topTopics: ['Aptitude', 'Reasoning', 'Verbal', 'Pseudocode'],
      interviewProcess: 'InfyTQ → HR Round',
      drives: [{ title: 'Infosys Instep 2025', description: 'Internship and placement drive', eligibility: '65% throughout', ctc: '3.6 LPA', roles: ['Systems Engineer'], isActive: true }]
    },
    {
      name: 'Google', description: 'Google LLC - Global technology leader', industry: 'Product', size: '100,000+',
      difficulty: 'hard', topTopics: ['DSA', 'System Design', 'Algorithms', 'Problem Solving'],
      interviewProcess: 'Online Assessment → 4-5 Technical Rounds → Hiring Committee',
      drives: [{ title: 'Google STEP Internship 2025', description: 'Software Engineering internship', eligibility: 'Pre-final year students', ctc: '2 LPA/month', roles: ['STEP Intern'], isActive: true }]
    },
    {
      name: 'Microsoft', description: 'Microsoft Corporation - Technology giant', industry: 'Product', size: '200,000+',
      difficulty: 'hard', topTopics: ['DSA', 'OOP', 'System Design', 'Problem Solving'],
      interviewProcess: 'Online Assessment → 3-4 Technical Rounds → HR',
      drives: [{ title: 'Microsoft IDC Hiring 2025', description: 'Full-time roles at Microsoft India', eligibility: 'B.Tech/M.Tech CS/IT', ctc: '42+ LPA', roles: ['SDE', 'SDE-2'], isActive: true }]
    },
    {
      name: 'Amazon', description: 'Amazon.com Inc - E-commerce and cloud giant', industry: 'Product', size: '1,000,000+',
      difficulty: 'hard', topTopics: ['DSA', 'Leadership Principles', 'System Design', 'Behavioral'],
      interviewProcess: 'Online Assessment → 2 Technical Rounds + 1 Bar Raiser',
      drives: [{ title: 'Amazon SDE Hiring 2025', description: 'Software Development Engineer roles', eligibility: 'B.Tech CS/IT/ECE', ctc: '32+ LPA', roles: ['SDE-1'], isActive: true }]
    },
    {
      name: 'Wipro', description: 'Wipro Limited - IT services and consulting', industry: 'IT Services', size: '250,000+',
      difficulty: 'easy', topTopics: ['Aptitude', 'Logical', 'Verbal', 'Basic Coding'],
      interviewProcess: 'NLTH Test → TR → MR → HR',
      drives: [{ title: 'Wipro Turbo 2025', description: 'High package track placement', eligibility: '60% throughout', ctc: '6.5 LPA', roles: ['Project Engineer'], isActive: true }]
    }
  ]);

  console.log('✅ Seed data created successfully!');
  console.log('Admin: admin@placeprep.com / admin123');
  console.log('Student: arjun@student.com / student123');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
