import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Brain,
  Building2,
  MessageSquare,
  Compass,
  ArrowRight,
  CheckCircle,
  Users,
  BookOpen,
  Sparkles,
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Career Assessment',
    desc: '20-question personality quiz that identifies your strengths across 12 categories and recommends matching careers.',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    icon: Compass,
    title: 'Career Explorer',
    desc: 'Browse 36+ career paths with details on salary, required skills, education, and growth prospects.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: Building2,
    title: 'College Directory',
    desc: 'Search 70,000+ colleges across India with AI-powered smart search and filters by field, state, and more.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: MessageSquare,
    title: 'AI Chatbot',
    desc: '24/7 AI career advisor powered by a local language model. Ask anything about careers, courses, or colleges.',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
];

const steps = [
  { num: '1', title: 'Create Your Account', desc: 'Sign up in seconds with just your email' },
  { num: '2', title: 'Take the Assessment', desc: 'Answer 20 quick questions about your interests' },
  { num: '3', title: 'Get Recommendations', desc: 'Receive personalized career and college suggestions' },
];

const stats = [
  { value: '70,000+', label: 'Colleges' },
  { value: '36+', label: 'Career Paths' },
  { value: '12', label: 'Skill Categories' },
  { value: '100%', label: 'Free' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/60 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gradient">EduCareer</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-secondary text-sm px-4 py-2">
              Sign In
            </Link>
            <Link to="/signup" className="btn-primary text-sm px-4 py-2 inline-flex items-center gap-1">
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-24 text-center">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6 text-sm font-medium text-purple-700">
            <Sparkles className="w-4 h-4" />
            AI-Powered Career Guidance — Completely Free
          </div>
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="visible"
          custom={1}
          variants={fadeUp}
          className="text-5xl md:text-7xl font-extrabold leading-tight mb-6"
        >
          Discover Your <span className="text-gradient">Perfect Career</span>
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="visible"
          custom={2}
          variants={fadeUp}
          className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10"
        >
          Take a quick assessment, explore matching careers, search 70,000+ colleges,
          and chat with an AI advisor — all in one platform.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="visible"
          custom={3}
          variants={fadeUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/signup"
            className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2"
          >
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/login"
            className="btn-secondary text-lg px-8 py-4 inline-flex items-center gap-2"
          >
            I Already Have an Account
          </Link>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              variants={fadeUp}
              className="glass-card p-6 text-center"
            >
              <p className="text-3xl md:text-4xl font-bold text-gradient">{stat.value}</p>
              <p className="text-gray-500 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            From self-discovery to college selection — we guide you through every step of your career journey.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              variants={fadeUp}
              className="glass-card-hover p-8 flex gap-5"
            >
              <div className={`${f.bg} rounded-xl p-3 h-fit`}>
                <f.icon className={`w-7 h-7 ${f.color}`} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-600">Three simple steps to your future career</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              variants={fadeUp}
              className="glass-card p-8 text-center relative"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl font-bold flex items-center justify-center mx-auto mb-5">
                {s.num}
              </div>
              <h3 className="text-lg font-bold mb-2">{s.title}</h3>
              <p className="text-gray-600">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Highlights */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="glass-card p-10 md:p-14"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Why EduCareer?</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              'AI-powered career matching',
              'Largest college database (70K+)',
              '24/7 AI chatbot advisor',
              'Completely free — no hidden costs',
              'Privacy-first — all AI runs locally',
              'No paid API keys needed',
              'Personalized recommendations',
              'Admin dashboard for management',
            ].map((item, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 pb-24 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Discover Your Path?
          </h2>
          <p className="text-gray-600 mb-8 max-w-lg mx-auto">
            Join EduCareer today and take the first step towards a career that fits you perfectly.
          </p>
          <Link
            to="/signup"
            className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2"
          >
            Create Free Account <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/30 bg-white/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-gradient">EduCareer</span>
          </div>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} EduCareer. Built for students, by students.
          </p>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/login" className="text-gray-600 hover:text-blue-600 transition-colors">
              Sign In
            </Link>
            <Link to="/signup" className="text-gray-600 hover:text-blue-600 transition-colors">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
