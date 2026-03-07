import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { chatbotAPI } from '../../services/api';

export default function Chatbot() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { id: 0, sender: 'bot', message: `Hello${user?.profile?.firstName ? `, ${user.profile.firstName}` : ''}! I'm your EduCareer assistant. I can help you with career exploration, college selection, scholarships, and study resources. How can I help you today?`, timestamp: new Date().toISOString() },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      message: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    const currentInput = inputMessage;
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    const userContext = {
      firstName: user?.profile?.firstName || null,
      interests: user?.interests || [],
      topCategories: user?.assessmentStatus?.results?.topCategories || [],
      hasAssessment: !!user?.assessmentStatus?.completed,
      school: user?.academicInfo?.school || null,
      scores: user?.assessmentStatus?.results?.scores || null,
    };

    try {
      const response = await chatbotAPI.ask(currentInput, userContext);
      const botResponse = {
        id: messages.length + 2,
        message: response.data.answer,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        source: response.data.source,
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch {
      // Fallback to local response if backend is unavailable
      const botResponse = {
        id: messages.length + 2,
        message: generateBotResponse(currentInput),
        sender: 'bot',
        timestamp: new Date().toISOString(),
        source: 'offline',
      };
      setMessages((prev) => [...prev, botResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateBotResponse = (userInput) => {
    const input = userInput.toLowerCase();
    const firstName = user?.profile?.firstName || 'there';
    const topCategories = user?.assessmentStatus?.results?.topCategories || [];
    const hasAssessment = user?.assessmentStatus?.completed;
    const school = user?.academicInfo?.school;
    const interests = user?.interests || [];

    if (input.includes('career') || input.includes('job')) {
      if (hasAssessment && topCategories.length > 0) {
        return `Based on your assessment results, ${firstName}, your top career fields are: ${topCategories.join(', ')}. Would you like to explore specific careers in any of these fields? You can also visit the Career Explorer page for detailed information.`;
      }
      return `Hi ${firstName}! To give you personalized career recommendations, I'd suggest taking the Career Assessment first. It only takes a few minutes and will help me understand your strengths and interests. Would you like to know more about any specific career field in the meantime?`;
    } else if (input.includes('college') || input.includes('university')) {
      let response = `I can help you find the right college, ${firstName}! `;
      if (hasAssessment && topCategories.length > 0) {
        response += `Since your top fields are ${topCategories.join(' and ')}, I'd recommend looking at colleges with strong programs in those areas. `;
      }
      response += 'Check out our College Directory for an AI-powered search across 70,000+ colleges. What factors matter most to you — location, cost, specific programs, or campus size?';
      return response;
    } else if (input.includes('scholarship')) {
      return `Great question, ${firstName}! There are many scholarships available based on academic merit, financial need, and specific fields of study. ${hasAssessment ? `Given your interest in ${topCategories[0]}, look for field-specific scholarships too. ` : ''}Visit our Scholarships page to browse opportunities and filter by category. Would you like tips on strengthening your scholarship applications?`;
    } else if (input.includes('assessment') || input.includes('test')) {
      if (hasAssessment) {
        return `You've already completed your assessment, ${firstName}! Your top career fields are: ${topCategories.join(', ')}. You can retake it anytime if your interests have changed. Would you like to explore careers in your recommended fields?`;
      }
      return `The Career Assessment is a quick questionnaire that helps identify your strengths and interests across 12 career fields, ${firstName}. It takes about 5-10 minutes and will give you personalized career recommendations. Head to the Assessment page to get started!`;
    } else if (input.includes('resource') || input.includes('study') || input.includes('learn')) {
      return `We have curated study resources including Khan Academy, Coursera, MIT OpenCourseWare, and more, ${firstName}. ${hasAssessment ? `Since you're interested in ${topCategories[0]}, I'd recommend focusing on resources related to that field. ` : ''}Check out the Study Resources page to start learning!`;
    } else if (input.includes('profile') || input.includes('account')) {
      return `You can update your personal info, academic details, and interests on the Profile page, ${firstName}. ${school ? `I see you're at ${school}. ` : ''}A complete profile helps us give better recommendations. Your profile is currently ${user?.profileCompletion || 0}% complete.`;
    } else if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return `Hey ${firstName}! 👋 How can I help you today? I can assist with career exploration${hasAssessment ? ' (your top fields: ' + topCategories.join(', ') + ')' : ''}, college search, scholarships, study resources, and more!`;
    } else if (input.includes('thanks') || input.includes('thank you')) {
      return `You're welcome, ${firstName}! I'm always here to help with your career and education journey. Feel free to ask me anything anytime!`;
    } else {
      return `That's a great question, ${firstName}! I can help you with:\n\n• **Career Exploration** — discover careers matching your skills\n• **College Search** — find the perfect college\n• **Scholarships** — browse funding opportunities\n• **Study Resources** — access free learning materials\n• **Assessment** — take a career aptitude test\n\nWhat would you like to explore?`;
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-10rem)] sm:h-[calc(100vh-12rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">AI Career Advisor</h1>
        <p className="text-gray-600">Get personalized guidance for your career journey</p>
      </div>

      {/* Chat Container */}
      <div className="flex-1 glass-card flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}
            >
              {msg.sender === 'bot' && (
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-6 h-6 text-white" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[70%] p-3 sm:p-4 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'glass-card'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                <p className="text-xs mt-2 opacity-70">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              {msg.sender === 'user' && (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <UserIcon className="w-6 h-6 text-gray-600" />
                </div>
              )}
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="glass-card p-4 rounded-2xl">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.4s' }}
                  ></div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-white/20 p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="input-glass flex-1"
            />
            <button onClick={handleSend} className="btn-primary px-6">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Questions */}
      <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
        {[
          'What careers match my skills?',
          'Help me find colleges',
          'Tell me about scholarships',
        ].map((question) => (
          <button
            key={question}
            onClick={() => {
              setInputMessage(question);
              setTimeout(() => handleSend(), 100);
            }}
            className="text-sm glass-card px-4 py-2 rounded-full hover:shadow-lg transition-all"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}
