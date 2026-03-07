import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  ChevronLeft,
  Trophy,
  TrendingUp,
  Briefcase,
  DollarSign,
  Loader2,
} from 'lucide-react';
import { assessmentAPI } from '../../services/api';

const LIKERT_OPTIONS = [
  { value: 1, label: 'Strongly Disagree', color: 'from-red-400 to-red-500' },
  { value: 2, label: 'Disagree', color: 'from-orange-400 to-orange-500' },
  { value: 3, label: 'Neutral', color: 'from-yellow-400 to-yellow-500' },
  { value: 4, label: 'Agree', color: 'from-lime-400 to-lime-500' },
  { value: 5, label: 'Strongly Agree', color: 'from-green-400 to-green-500' },
];

export default function Assessment() {
  const { updateProfile, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    assessmentAPI.getQuestions()
      .then((res) => {
        setQuestions(res.data.questions);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load assessment questions. Please ensure the backend is running.');
        setLoading(false);
      });
  }, []);

  const progress = questions.length > 0
    ? ((currentQuestion + 1) / questions.length) * 100
    : 0;

  const handleAnswer = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    // Build responses array in question order
    const responses = questions.map((q) => answers[q.id] || 3);
    try {
      const res = await assessmentAPI.submit(responses);
      setResults(res.data);
      setShowResults(true);
      // Refresh user to get updated assessment status
      await refreshUser();
    } catch {
      setError('Failed to submit assessment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-lg">Loading assessment...</span>
      </div>
    );
  }

  if (error && !questions.length) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="glass-card p-8 text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (showResults && results) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto">
        <div className="glass-card p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-6"
          >
            <Trophy className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Assessment Complete! 🎉</h1>
          <p className="text-gray-600 mb-8">Here are your personalized career recommendations</p>

          {/* Top Fields */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Your Top Career Fields
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {results.topCategories.map((field, index) => (
                <motion.div
                  key={field}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="glass-card p-6"
                >
                  <div className="text-4xl mb-2">#{index + 1}</div>
                  <h3 className="font-bold">{field}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Score: {results.scores[field]}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recommended Careers */}
          {results.recommendedCareers && results.recommendedCareers.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center justify-center gap-2">
                <Briefcase className="w-5 h-5" />
                Recommended Careers
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {results.recommendedCareers.slice(0, 6).map((career, index) => (
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
                        className="w-16 h-16 rounded-lg object-cover bg-gradient-to-br from-blue-100 to-purple-100"
                        onError={(e) => { e.target.onerror = null; e.target.src = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22/>'; e.target.className = 'w-16 h-16 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500'; }}
                      />
                      <div className="flex-1">
                        <h3 className="font-bold">{career.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{career.field}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            {career.demandLevel}
                          </span>
                          <span className="text-xs text-gray-600 flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {career.averageSalary}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Score Breakdown */}
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4">All Category Scores</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {Object.entries(results.scores)
                .sort(([, a], [, b]) => b - a)
                .map(([category, score]) => (
                  <div key={category} className="glass-card p-3 text-left">
                    <p className="text-sm font-medium truncate">{category}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                          style={{ width: `${(score / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold">{score}</span>
                    </div>
                  </div>
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

  const currentQ = questions[currentQuestion];
  const isAnswered = answers[currentQ?.id];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="glass-card p-6 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            Question {currentQuestion + 1} of {questions.length}
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
          className="glass-card p-4 sm:p-8"
        >
          <div className="mb-2">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {currentQ.category}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">{currentQ.question}</h2>

          {/* Likert Scale */}
          <div className="space-y-3">
            {LIKERT_OPTIONS.map((option) => (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer(currentQ.id, option.value)}
                className={`w-full p-4 rounded-xl text-left transition-all flex items-center gap-4 ${
                  answers[currentQ.id] === option.value
                    ? `bg-gradient-to-r ${option.color} text-white shadow-lg`
                    : 'glass-card hover:shadow-lg'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                    answers[currentQ.id] === option.value
                      ? 'bg-white/30 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {option.value}
                </div>
                <span className="font-medium">{option.label}</span>
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
              disabled={!isAnswered || submitting}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : currentQuestion === questions.length - 1 ? (
                'Finish'
              ) : (
                'Next'
              )}
              {!submitting && <ChevronRight className="w-5 h-5" />}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
