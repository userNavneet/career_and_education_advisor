export const assessmentQuestions = [
  {
    id: 1,
    category: "Interests",
    question: "Which activity do you find most enjoyable?",
    options: [
      { id: "a", text: "Solving puzzles and logical problems", weight: { tech: 3, engineering: 2 } },
      { id: "b", text: "Helping and caring for others", weight: { healthcare: 3, education: 2 } },
      { id: "c", text: "Creating art or designing things", weight: { design: 3, arts: 2 } },
      { id: "d", text: "Analyzing data and trends", weight: { business: 2, finance: 3 } },
    ],
  },
  {
    id: 2,
    category: "Skills",
    question: "What are you naturally good at?",
    options: [
      { id: "a", text: "Mathematics and logical reasoning", weight: { tech: 3, engineering: 3, finance: 2 } },
      { id: "b", text: "Communication and public speaking", weight: { business: 3, education: 2, law: 2 } },
      { id: "c", text: "Creative thinking and innovation", weight: { design: 3, arts: 3, tech: 1 } },
      { id: "d", text: "Attention to detail and organization", weight: { finance: 2, healthcare: 2, engineering: 2 } },
    ],
  },
  {
    id: 3,
    category: "Work Environment",
    question: "What type of work environment appeals to you?",
    options: [
      { id: "a", text: "Office with computer and technology", weight: { tech: 3, finance: 2 } },
      { id: "b", text: "Hands-on field or lab work", weight: { engineering: 3, healthcare: 2, science: 3 } },
      { id: "c", text: "Creative studio or flexible workspace", weight: { design: 3, arts: 3 } },
      { id: "d", text: "Client-facing or people-oriented setting", weight: { business: 3, education: 2, healthcare: 2 } },
    ],
  },
  {
    id: 4,
    category: "Values",
    question: "What matters most to you in a career?",
    options: [
      { id: "a", text: "High income potential", weight: { tech: 2, finance: 3, business: 2 } },
      { id: "b", text: "Making a positive impact on society", weight: { healthcare: 3, education: 3, nonprofit: 3 } },
      { id: "c", text: "Creative freedom and expression", weight: { design: 3, arts: 3 } },
      { id: "d", text: "Job stability and security", weight: { healthcare: 2, education: 2, government: 3 } },
    ],
  },
  {
    id: 5,
    category: "Learning Style",
    question: "How do you prefer to learn new things?",
    options: [
      { id: "a", text: "Reading and independent study", weight: { tech: 2, science: 2, law: 2 } },
      { id: "b", text: "Hands-on practice and experimentation", weight: { engineering: 3, healthcare: 2 } },
      { id: "c", text: "Visual demonstrations and examples", weight: { design: 3, arts: 2 } },
      { id: "d", text: "Group discussions and collaboration", weight: { business: 3, education: 2 } },
    ],
  },
  {
    id: 6,
    category: "Problem Solving",
    question: "When faced with a problem, you tend to:",
    options: [
      { id: "a", text: "Analyze data and use logic", weight: { tech: 3, engineering: 3, finance: 2 } },
      { id: "b", text: "Consult with others and brainstorm", weight: { business: 3, education: 2 } },
      { id: "c", text: "Think creatively and try innovative solutions", weight: { design: 3, tech: 2, arts: 2 } },
      { id: "d", text: "Follow established procedures", weight: { healthcare: 2, law: 2 } },
    ],
  },
  {
    id: 7,
    category: "Subjects",
    question: "Which school subject do you enjoy most?",
    options: [
      { id: "a", text: "Math and Science", weight: { tech: 3, engineering: 3, healthcare: 2 } },
      { id: "b", text: "English and Literature", weight: { education: 2, arts: 2, law: 2 } },
      { id: "c", text: "Art and Design", weight: { design: 3, arts: 3 } },
      { id: "d", text: "Business and Economics", weight: { business: 3, finance: 3 } },
    ],
  },
  {
    id: 8,
    category: "Future Goals",
    question: "In 10 years, you see yourself:",
    options: [
      { id: "a", text: "Leading a tech company or project", weight: { tech: 3, business: 2 } },
      { id: "b", text: "Managing a team or organization", weight: { business: 3, healthcare: 2 } },
      { id: "c", text: "Creating innovative products or art", weight: { design: 3, arts: 3, engineering: 2 } },
      { id: "d", text: "Teaching or mentoring others", weight: { education: 3, healthcare: 2 } },
    ],
  },
];

export const careerFields = {
  tech: "Technology & Software",
  engineering: "Engineering",
  healthcare: "Healthcare & Medicine",
  business: "Business & Management",
  finance: "Finance & Banking",
  design: "Design & Creative",
  arts: "Arts & Media",
  education: "Education & Teaching",
  science: "Science & Research",
  law: "Law & Legal",
  nonprofit: "Nonprofit & Social Work",
  government: "Government & Public Service",
};
