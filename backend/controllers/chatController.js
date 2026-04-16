const Anthropic = require('@anthropic-ai/sdk');
const Chat = require('../models/Chat');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPTS = {
  general: `You are PlaceBot, an expert AI assistant for placement and campus recruitment preparation. You help students with:
- DSA (Data Structures & Algorithms) concepts and problem solving
- Aptitude questions (Quantitative, Logical Reasoning, Verbal)
- Technical interview preparation (DBMS, OS, CN, OOP)
- Resume feedback and improvement
- Company-specific preparation strategies
- HR interview tips and mock questions
Be concise, practical, and encouraging. Use examples. Format code with markdown code blocks.`,

  dsa: `You are a DSA expert helping students master Data Structures and Algorithms for placement interviews. Explain concepts clearly, provide time/space complexity analysis, and give practical examples. Always suggest optimal approaches.`,

  aptitude: `You are an aptitude trainer specializing in placement exam preparation. Help students with Quantitative Aptitude, Logical Reasoning, and Verbal Ability. Provide step-by-step solutions and shortcut tricks.`,

  interview: `You are an experienced interviewer and career coach. Conduct mock interviews, provide feedback on answers, suggest improvements, and share company-specific interview patterns. Be honest but encouraging.`,

  resume: `You are a professional resume reviewer with expertise in tech industry hiring. Analyze resumes, suggest improvements for ATS optimization, help craft strong bullet points, and provide actionable feedback.`
};

// @desc Send message to AI chatbot
const sendMessage = async (req, res) => {
  try {
    const { message, chatId, type = 'general' } = req.body;
    if (!message) return res.status(400).json({ message: 'Message is required' });

    let chat;
    if (chatId) {
      chat = await Chat.findOne({ _id: chatId, user: req.user._id });
    }

    if (!chat) {
      chat = await Chat.create({
        user: req.user._id,
        type,
        title: message.substring(0, 50),
        messages: []
      });
    }

    // Build history for context
    const history = chat.messages.slice(-10).map(m => ({
      role: m.role,
      content: m.content
    }));
    history.push({ role: 'user', content: message });

    // Call Anthropic API
    const response = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1500,
      system: SYSTEM_PROMPTS[type] || SYSTEM_PROMPTS.general,
      messages: history
    });

    const aiReply = response.content[0].text;

    // Save messages
    chat.messages.push({ role: 'user', content: message });
    chat.messages.push({ role: 'assistant', content: aiReply });
    await chat.save();

    res.json({ reply: aiReply, chatId: chat._id });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc Get user's chat history
const getChatHistory = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user._id, isActive: true })
      .select('title type updatedAt createdAt')
      .sort({ updatedAt: -1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single chat
const getChat = async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, user: req.user._id });
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete chat
const deleteChat = async (req, res) => {
  try {
    await Chat.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { isActive: false });
    res.json({ message: 'Chat deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Resume review via AI
const reviewResume = async (req, res) => {
  try {
    const { resumeText } = req.body;
    if (!resumeText) return res.status(400).json({ message: 'Resume text required' });

    const response = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 2000,
      system: SYSTEM_PROMPTS.resume,
      messages: [{
        role: 'user',
        content: `Please review this resume and provide detailed feedback:\n\n${resumeText}`
      }]
    });

    res.json({ feedback: response.content[0].text });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Generate study plan
const generateStudyPlan = async (req, res) => {
  try {
    const { targetCompanies, skills, weakTopics, daysAvailable } = req.body;

    const prompt = `Create a ${daysAvailable || 30}-day personalized study plan for placement preparation.
Target companies: ${targetCompanies?.join(', ') || 'Top MNCs'}
Current skills: ${skills?.join(', ') || 'Basic programming'}
Weak areas: ${weakTopics?.join(', ') || 'None specified'}

Provide a structured day-by-day plan with topics, resources, and daily goals. Format it clearly.`;

    const response = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 2000,
      system: SYSTEM_PROMPTS.general,
      messages: [{ role: 'user', content: prompt }]
    });

    res.json({ studyPlan: response.content[0].text });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendMessage, getChatHistory, getChat, deleteChat, reviewResume, generateStudyPlan };
