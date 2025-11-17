import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Trophy,
  TrendingUp,
  Briefcase,
} from 'lucide-react';
import { assessmentQuestions, careerFields } from '../../data/mockAssessments';
import { careers } from '../../data/mockCareers';

export default function Assessment() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);

  const progress = ((currentQuestion + 1) / assessmentQuestions.length) * 100;

  const handleAnswer = (questionId, optionId, weights) => {
    setAnswers({ ...answers, [questionId]: { optionId, weights } });
  };

  const handleNext = () => {
    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = () => {
    const fieldScores = {};

    // Calculate scores for each field
    Object.values(answers).forEach(({ weights }) => {
      Object.entries(weights).forEach(([field, score]) => {
        fieldScores[field] = (fieldScores[field] || 0) + score;
      });
    });

    // Sort fields by score
    const sortedFields = Object.entries(fieldScores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([field]) => careerFields[field]);

    // Get recommended careers based on top fields
    const topFieldKeys = Object.keys(fieldScores)
      .sort((a, b) => fieldScores[b] - fieldScores[a])
      .slice(0, 3);

    const recommendedCareers = careers
      .filter((career) =>
        topFieldKeys.some((field) => career.field.toLowerCase().includes(field))
      )
      .slice(0, 5);

    const assessmentResults = {
      topFields: sortedFields,
      recommendedCareers: recommendedCareers.map((c) => c.id),
      fieldScores,
      completedAt: new Date().toISOString(),
    };

    setResults(assessmentResults);
    setShowResults(true);

    // Update user profile
    updateProfile({
      assessmentStatus: {
        completed: true,
        lastTaken: new Date().toISOString(),
        results: assessmentResults,
      },
      profileCompletion: Math.min(100, (user?.profileCompletion || 0) + 15),
    });
  };

  const currentQ = assessmentQuestions[currentQuestion];
  const isAnswered = answers[currentQ?.id];

  if (showResults && results) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        <div className="glass-card p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-6"
          >
            <Trophy className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-3xl font-bold mb-2">Assessment Complete! 🎉</h1>
          <p className="text-gray-600 mb-8">
            Here are your personalized career recommendations
          </p>

          {/* Top Fields */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Your Top Career Fields
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {results.topFields.map((field, index) => (
                <motion.div
                  key={field}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="glass-card p-6"
                >
                  <div className="text-4xl mb-2">#{index + 1}</div>
                  <h3 className="font-bold">{field}</h3>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recommended Careers */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center justify-center gap-2">
              <Briefcase className="w-5 h-5" />
              Recommended Careers
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {careers
                .filter((c) => results.recommendedCareers.includes(c.id))
                .map((career, index) => (
                  <motion.div
                    key={career.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="glass-card p-4 text-left hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={career.image}
                        alt={career.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold">{career.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{career.field}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            {career.demandLevel}
                          </span>
                          <span className="text-xs text-gray-600">{career.averageSalary}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button onClick={() => navigate('/student/careers')} className="btn-primary">
              Explore All Careers
            </button>
            <button onClick={() => navigate('/student/dashboard')} className="btn-secondary">
              Back to Dashboard
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="glass-card p-6 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            Question {currentQuestion + 1} of {assessmentQuestions.length}
          </span>
          <span className="text-sm font-medium">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          className="glass-card p-8"
        >
          <div className="mb-2">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {currentQ.category}
            </span>
          </div>

          <h2 className="text-2xl font-bold mb-6">{currentQ.question}</h2>

          <div className="space-y-3">
            {currentQ.options.map((option) => (
              <motion.button
                key={option.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer(currentQ.id, option.id, option.weight)}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  answers[currentQ.id]?.optionId === option.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'glass-card hover:shadow-lg'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      answers[currentQ.id]?.optionId === option.id
                        ? 'border-white bg-white'
                        : 'border-gray-300'
                    }`}
                  >
                    {answers[currentQ.id]?.optionId === option.id && (
                      <Check className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <span className="flex-1 font-medium">{option.text}</span>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="btn-secondary flex items-center gap-2 disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            <button
              onClick={handleNext}
              disabled={!isAnswered}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              {currentQuestion === assessmentQuestions.length - 1 ? 'Finish' : 'Next'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
