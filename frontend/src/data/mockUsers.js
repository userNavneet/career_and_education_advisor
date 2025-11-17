export const users = {
  student: {
    id: "student-1",
    role: "student",
    email: "student@example.com",
    password: "student123",
    profile: {
      firstName: "Alex",
      lastName: "Johnson",
      phone: "+1-234-567-8900",
      dateOfBirth: "2006-05-15",
      address: "123 Main St, San Francisco, CA 94102",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    academicInfo: {
      grade: "12th",
      school: "Lincoln High School",
      gpa: 3.8,
      satScore: 1450,
      actScore: 32,
      subjects: ["Mathematics", "Physics", "Computer Science", "English"],
    },
    interests: ["Technology", "Robotics", "Music", "Sports"],
    careerPreferences: {
      fields: ["Technology & Software", "Engineering"],
      desiredSalary: "$80,000+",
      workEnvironment: "Office/Remote",
    },
    assessmentStatus: {
      completed: true,
      lastTaken: "2024-11-01",
      results: {
        topFields: ["Technology & Software", "Engineering", "Design & Creative"],
        recommendedCareers: [1, 2, 6], // IDs from mockCareers
      },
    },
    profileCompletion: 85,
    achievements: [
      { id: 1, title: "Assessment Complete", icon: "✓", date: "2024-11-01" },
      { id: 2, title: "Profile 85% Complete", icon: "⭐", date: "2024-11-05" },
      { id: 3, title: "5 Colleges Shortlisted", icon: "🎓", date: "2024-11-10" },
    ],
    savedColleges: [1, 2, 5],
    savedCareers: [1, 2, 6],
    appliedScholarships: [1, 3],
  },
  counselor: {
    id: "counselor-1",
    role: "counselor",
    email: "counselor@example.com",
    password: "counselor123",
    profile: {
      firstName: "Dr. Sarah",
      lastName: "Williams",
      phone: "+1-234-567-8901",
      specialization: "Career Counseling",
      yearsOfExperience: 12,
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    assignedStudents: ["student-1", "student-2", "student-3"],
  },
  admin: {
    id: "admin-1",
    role: "admin",
    email: "admin@example.com",
    password: "admin123",
    profile: {
      firstName: "Michael",
      lastName: "Chen",
      phone: "+1-234-567-8902",
      department: "Platform Management",
      avatar: "https://i.pravatar.cc/150?img=8",
    },
  },
};

export const chatHistory = [
  {
    id: 1,
    message: "Hello! I'm your AI career advisor. How can I help you today?",
    sender: "bot",
    timestamp: "2024-11-15T10:00:00",
  },
  {
    id: 2,
    message: "I'm interested in computer science but not sure which specialization to choose.",
    sender: "user",
    timestamp: "2024-11-15T10:01:00",
  },
  {
    id: 3,
    message: "Great question! Computer Science offers many exciting specializations. Based on your assessment results, I see you have strong analytical and creative skills. Here are some specializations that might interest you:\n\n1. **Software Engineering** - Building applications and systems\n2. **Data Science & AI** - Working with data and machine learning\n3. **Cybersecurity** - Protecting systems and data\n4. **Web Development** - Creating websites and web applications\n\nWhich of these sounds most interesting to you?",
    sender: "bot",
    timestamp: "2024-11-15T10:01:30",
  },
];
