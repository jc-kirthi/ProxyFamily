// services/voiceService.js - BidBuddy Intelligence Service
require('dotenv').config();
const axios = require('axios');
const ProjectListing = require('../models/ProjectListing');
const Bid = require('../models/Bid');
const Freelancer = require('../models/Freelancer');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY not found in environment');
} else {
  console.log('✅ BidBuddy Voice Service: Gemini Key Loaded');
}

let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 3000; // Faster for better demo
const requestCount = { count: 0, resetTime: Date.now() + 60000 };
const MAX_REQUESTS_PER_MINUTE = 20;

const INTENT_SYSTEM_PROMPT = `You are "Sparky", the helpful Kannada/English voice assistant for BidBuddy, an AI-powered freelancer bidding marketplace.

RULES:
1. ALWAYS respond in the language the user speaks (Default to Kannada if unclear).
2. Keep responses PROFESSIONAL, SHORT, and ENCOURAGING (1-2 sentences).
3. You are an expert in project management, web development, design, and blockchain verification.
4. Answer naturally about project trends, bidding tips, and platform navigation.
5. Use "BidBuddy" as the platform name.

User Context Data will be provided if they are logged in. Use it to be specific about their earnings or active bids.`;

function getSmartFallback(userText) {
  const text = userText.toLowerCase();
  
  if (text.includes('ನಮಸ್ಕಾರ') || text.includes('ಹಲೋ') || text.includes('hi') || text.includes('hello')) {
    return 'ನಮಸ್ಕಾರ! ಬಿಡ್‌ಬಡ್ಡಿ ಮಾರುಕಟ್ಟೆಗೆ ಸ್ವಾಗತ. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?';
  }
  
  if (text.includes('ಪ್ರಾಜೆಕ್ಟ್') || text.includes('project')) {
    return 'ಖಂಡಿತ! ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಹೊಸ ವೆಬ್ ಮತ್ತು ಎಐ ಪ್ರಾಜೆಕ್ಟ್‌ಗಳು ಲಭ್ಯವಿವೆ. "Browse Projects" ಎಂದು ಹೇಳಿ ನೋಡೋಣ.';
  }

  if (text.includes('ಮಾರುಕಟ್ಟೆ') || text.includes('market')) {
    return 'ಮಾರುಕಟ್ಟೆಗೆ ಹೋಗಲು "ಮಾರುಕಟ್ಟೆ ತೆರೆಯಿರಿ" ಎಂದು ಹೇಳಿ.';
  }

  return 'ಕ್ಷಮಿಸಿ, ಅರ್ಥವಾಗಲಿಲ್ಲ. ಬಿಡ್‌ಬಡ್ಡಿಯಲ್ಲಿ ಪ್ರಾಜೆಕ್ಟ್‌ಗಳು ಅಥವಾ ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಬಗ್ಗೆ ಕೇಳಿ.';
}

class VoiceService {
  async getFreelancerContext(userId) {
    try {
      if (!userId || userId === 'anonymous') return { success: false, context: null };

      const freelancer = await Freelancer.findById(userId).select('businessName').lean();
      if (!freelancer) return { success: false, context: null };
      
      const bids = await Bid.find({ freelancerId: userId }).select('bidAmount status').lean();

      const activeBids = bids.filter(b => b.status === 'pending').length;
      const wonBids = bids.filter(b => b.status === 'accepted').length;
      const totalEarnings = bids.filter(b => b.status === 'accepted').reduce((sum, b) => sum + b.bidAmount, 0);

      return { 
        success: true, 
        context: `User: ${freelancer.businessName}, Active Bids: ${activeBids}, Goals Achieved: ${wonBids}, Total Earned: ₹${totalEarnings}` 
      };
    } catch (error) {
      return { success: false, context: null };
    }
  }

  detectIntent(userText) {
    if (!userText) return null;
    let text = userText.toLowerCase();

    const intents = [
      { keywords: ['market', 'ಮಾರುಕಟ್ಟೆ', 'projects', 'ಪ್ರಾಜೆಕ್ಟ್'], action: { type: 'NAVIGATE', params: { route: '/marketplace' } }, response: 'ಪ್ರಾಜೆಕ್ಟ್ ಮಾರುಕಟ್ಟೆಗೆ ಕರೆದೊಯ್ಯುತ್ತಿದ್ದೇನೆ.' },
      { keywords: ['profile', 'ಪ್ರೊಫೈಲ್', 'my account'], action: { type: 'NAVIGATE', params: { route: '/profile' } }, response: 'ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ತೆರೆಯುತ್ತಿದ್ದೇನೆ.' },
      { keywords: ['dashboard', 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', 'earnings'], action: { type: 'NAVIGATE', params: { route: '/dashboard' } }, response: 'ನಿಮ್ಮ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಸಿದ್ಧವಾಗಿದೆ.' },
      { keywords: ['grader', 'ಗ್ರೇಡರ್', 'verify', 'ಅಪ್ಲೋಡ್'], action: { type: 'NAVIGATE', params: { route: '/project-grader' } }, response: 'ಪ್ರಾಜೆಕ್ಟ್ ವೆರಿಫಿಕೇಶನ್ ಸ್ಕ್ರೀನ್ ತೆರೆಯುತ್ತಿದ್ದೇನೆ.' }
    ];

    for (const intent of intents) {
      if (intent.keywords.some(kw => text.includes(kw))) {
        return { action: intent.action, response: intent.response, confidence: 0.95 };
      }
    }
    return null;
  }

  async processWithGemini(text, conversationHistory = [], userContext = null) {
    if (!GEMINI_API_KEY) return { success: false, text: getSmartFallback(text) };

    try {
      const now = Date.now();
      if (requestCount.count >= MAX_REQUESTS_PER_MINUTE) return { success: false, text: getSmartFallback(text) };
      requestCount.count++;

      let systemPrompt = INTENT_SYSTEM_PROMPT;
      if (userContext) systemPrompt += `\n\nUSER CONTEXT:\n${userContext}`;

      const messages = [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: 'Understood. I am Sparky from BidBuddy.' }] }
      ];

      conversationHistory.slice(-5).forEach(msg => {
        messages.push({ role: msg.role === 'user' ? 'user' : 'model', parts: [{ text: msg.parts ? msg.parts[0].text : (msg.text || '') }] });
      });

      messages.push({ role: 'user', parts: [{ text: text }] });

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        { contents: messages },
        { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
      );

      const aiText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      return aiText ? { success: true, text: aiText.trim() } : { success: false, text: getSmartFallback(text) };
    } catch (error) {
      return { success: false, text: getSmartFallback(text) };
    }
  }

  async processTextQuery(userText, conversationHistory = [], userId = null) {
    const localIntent = this.detectIntent(userText);
    if (localIntent) {
      return { success: true, userText, aiText: localIntent.response, action: localIntent.action };
    }

    const contextResult = await this.getFreelancerContext(userId);
    const aiResponse = await this.processWithGemini(userText, conversationHistory, contextResult.context);

    return { success: true, userText, aiText: aiResponse.text, action: null };
  }
}

module.exports = new VoiceService();
