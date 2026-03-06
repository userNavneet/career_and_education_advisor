import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User as UserIcon } from 'lucide-react';
import { chatHistory as initialChatHistory } from '../../data/mockUsers';
import { useAuth } from '../../contexts/AuthContext';
import { request } from '../../services/api';

export default function Chatbot() {
  const { user } = useAuth();
  const [messages, setMessages] = useState(initialChatHistory);
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

    setMessages([...messages, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const data = await request('/chatbot/faq', {
        method: 'POST',
        body: JSON.stringify({ query: inputMessage, top_k: 3, min_score: 0.45 }),
      });

      let botText = "I could not find a strong match in the FAQ yet. Try rephrasing your question.";
      const matches = data?.matches || [];
      if (matches.length > 0) {
        const top = matches[0];
        botText = top.answer;
        if (matches.length > 1) {
          const related = matches
            .slice(1, 3)
            .map((m) => `- ${m.question}`)
            .join('\n');
          botText += `\n\nRelated topics:\n${related}`;
        }
      }

      const botResponse = {
        id: messages.length + 2,
        message: botText,
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (err) {
      const botResponse = {
        id: messages.length + 2,
        message: 'Chat service is currently unavailable. Please try again.',
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">AI Career Advisor</h1>
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
                className={`max-w-[70%] p-4 rounded-2xl ${
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
      <div className="mt-4 flex flex-wrap gap-2">
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
