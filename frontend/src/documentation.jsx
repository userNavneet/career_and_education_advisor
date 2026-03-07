import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    Code, 
    Database, 
    Layers, 
    FileCode, 
    Palette,
    Lock,
    Zap,
    BookOpen,
    Settings,
    Globe
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Documentation() {
    const sections = [
        {
            title: "Project Overview",
            icon: BookOpen,
            content: "EduCareer is a comprehensive educational guidance platform. It helps students make informed academic and career decisions through personalized assessments, career exploration, college directory, and AI-powered guidance."
        },
        {
            title: "Technology Stack",
            icon: Layers,
            content: (
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold mb-2">Frontend</h4>
                        <div className="flex flex-wrap gap-2">
                            <Badge>React</Badge>
                            <Badge>Tailwind CSS</Badge>
                            <Badge>shadcn/ui</Badge>
                            <Badge>Framer Motion</Badge>
                            <Badge>Recharts</Badge>
                            <Badge>React Query</Badge>
                            <Badge>Lucide Icons</Badge>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Backend</h4>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">Base44 BaaS</Badge>
                            <Badge variant="outline">Entity Management</Badge>
                            <Badge variant="outline">Auth System</Badge>
                            <Badge variant="outline">LLM Integration</Badge>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "Data Models",
            icon: Database,
            content: (
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-blue-700">User Entity (Extended)</h4>
                        <p className="text-sm text-slate-600 mb-2">Extended Base44 User with custom fields:</p>
                        <ul className="text-sm space-y-1 text-slate-700">
                            <li>• <code className="bg-slate-100 px-1 rounded">age, academic_level, stream, subjects</code></li>
                            <li>• <code className="bg-slate-100 px-1 rounded">preferred_language, location, interests</code></li>
                            <li>• <code className="bg-slate-100 px-1 rounded">aptitude_scores</code> (14 dimensions)</li>
                            <li>• <code className="bg-slate-100 px-1 rounded">assessment_completed, recommended_stream, recommended_careers</code></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-emerald-700">CareerPath Entity</h4>
                        <p className="text-sm text-slate-600">Comprehensive career information with streams, requirements, salaries, skills, and aptitudes</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-purple-700">College Entity</h4>
                        <p className="text-sm text-slate-600">Government colleges with location, courses, facilities, cutoffs, and contact info</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-orange-700">Timeline Entity</h4>
                        <p className="text-sm text-slate-600">Important dates for admissions, exams, scholarships with priority and target audience</p>
                    </div>
                </div>
            )
        },
        {
            title: "Key Features",
            icon: Zap,
            content: (
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-semibold mb-2">Dashboard</h4>
                        <p className="text-sm text-slate-600">Personalized overview with stats, recommendations, events, and quick actions</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Assessment</h4>
                        <p className="text-sm text-slate-600">15-question quiz scoring 14 aptitudes with visual results and AI recommendations</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Career Explorer</h4>
                        <p className="text-sm text-slate-600">Browse careers by stream with detailed info on salaries, skills, and opportunities</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">College Directory</h4>
                        <p className="text-sm text-slate-600">Searchable database of government colleges with filters and detailed profiles</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Timeline</h4>
                        <p className="text-sm text-slate-600">Important dates with smart filtering by category, priority, and relevance</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">AI Chatbot</h4>
                        <p className="text-sm text-slate-600">Real-time assistant using Base44 LLM for career and education guidance</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Profile</h4>
                        <p className="text-sm text-slate-600">Comprehensive user management with academic info and completion tracking</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Resources & Scholarships</h4>
                        <p className="text-sm text-slate-600">Curated study materials and scholarship opportunities with filters</p>
                    </div>
                </div>
            )
        },
        {
            title: "Architecture",
            icon: FileCode,
            content: (
                <div className="space-y-3">
                    <div className="bg-slate-50 p-3 rounded text-sm font-mono">
                        entities/ - Data schemas (JSON)<br/>
                        pages/ - React page components<br/>
                        components/ui/ - shadcn/ui library<br/>
                        Layout.js - App navigation wrapper
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">State Management</h4>
                        <p className="text-sm text-slate-600">React Query for server state, useState/useEffect for local state</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Routing</h4>
                        <p className="text-sm text-slate-600">React Router DOM with createPageUrl() utility</p>
                    </div>
                </div>
            )
        },
        {
            title: "API Usage (Base44 SDK)",
            icon: Code,
            content: (
                <div className="space-y-3">
                    <div className="bg-slate-900 text-green-400 p-3 rounded text-xs font-mono overflow-x-auto">
                        {`// Entity Operations
const careers = await base44.entities.CareerPath.list();
await base44.entities.Timeline.create({...});
await base44.entities.User.update(id, {...});

// Authentication
const user = await base44.auth.me();
await base44.auth.updateMe({...});

// AI Integration
const response = await base44.integrations.Core.InvokeLLM({
  prompt: "Career guidance question",
  add_context_from_internet: true
});`}
                    </div>
                </div>
            )
        },
        {
            title: "Design System",
            icon: Palette,
            content: (
                <div className="space-y-3">
                    <div>
                        <h4 className="font-semibold mb-2">Colors</h4>
                        <div className="flex gap-2">
                            <div className="w-12 h-12 bg-blue-600 rounded" title="Primary Blue" />
                            <div className="w-12 h-12 bg-emerald-500 rounded" title="Secondary Emerald" />
                            <div className="w-12 h-12 bg-purple-600 rounded" title="Accent Purple" />
                            <div className="w-12 h-12 bg-amber-500 rounded" title="Warning Amber" />
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Responsive</h4>
                        <p className="text-sm text-slate-600">Mobile-first design with breakpoints: sm, md, lg, xl</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Animations</h4>
                        <p className="text-sm text-slate-600">Smooth transitions via Framer Motion for enhanced UX</p>
                    </div>
                </div>
            )
        },
        {
            title: "Security & Privacy",
            icon: Lock,
            content: (
                <div className="space-y-2 text-sm">
                    <p className="text-slate-700">• JWT-based authentication via Base44</p>
                    <p className="text-slate-700">• Role-based access control (admin/user)</p>
                    <p className="text-slate-700">• Users can only access their own data</p>
                    <p className="text-slate-700">• Admins can manage all users</p>
                    <p className="text-slate-700">• Assessment results private to user</p>
                    <p className="text-slate-700">• No third-party data sharing</p>
                </div>
            )
        },
        {
            title: "Deployment & Environment",
            icon: Settings,
            content: (
                <div className="space-y-2 text-sm">
                    <p className="text-slate-700">• Automatic deployment on Base44 platform</p>
                    <p className="text-slate-700">• Built-in hosting and global CDN</p>
                    <p className="text-slate-700">• Automatic HTTPS and SSL</p>
                    <p className="text-slate-700">• No environment variables needed</p>
                    <p className="text-slate-700">• Preview URLs for testing</p>
                    <p className="text-slate-700">• Production domain support</p>
                </div>
            )
        },
        {
            title: "Localization",
            icon: Globe,
            content: (
                <div>
                    <h4 className="font-semibold mb-2">Supported Languages</h4>
                    <div className="flex flex-wrap gap-2">
                        <Badge>English</Badge>
                        <Badge>हिन्दी (Hindi)</Badge>
                        <Badge>বাংলা (Bengali)</Badge>
                        <Badge>தமிழ் (Tamil)</Badge>
                        <Badge>తెలుగు (Telugu)</Badge>
                        <Badge>मराठी (Marathi)</Badge>
                        <Badge>ગુજરાતી (Gujarati)</Badge>
                        <Badge>ಕನ್ನಡ (Kannada)</Badge>
                    </div>
                </div>
            )
        }
    ];

    return (
        <div className="p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">
                        Technical Documentation
                    </h1>
                    <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                        Complete technical overview of the EduCareer platform - architecture, data models, features, and implementation details
                    </p>
                    <div className="mt-6 flex justify-center gap-4">
                        <Badge className="text-sm">Base44 Platform</Badge>
                        <Badge className="text-sm" variant="outline">React Application</Badge>
                        <Badge className="text-sm" variant="outline">Education Technology</Badge>
                    </div>
                </div>

                {/* Documentation Sections */}
                <div className="grid lg:grid-cols-2 gap-6">
                    {sections.map((section, index) => (
                        <motion.div
                            key={section.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-blue-100">
                                            <section.icon className="w-5 h-5 text-blue-600" />
                                        </div>
                                        {section.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {typeof section.content === 'string' ? (
                                        <p className="text-slate-700">{section.content}</p>
                                    ) : (
                                        section.content
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Quick Reference */}
                <Card className="bg-gradient-to-br from-blue-50 to-emerald-50 border-2 border-blue-200">
                    <CardHeader>
                        <CardTitle className="text-center">Quick Reference</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-3 gap-6 text-center">
                            <div>
                                <div className="text-3xl font-bold text-blue-600">9</div>
                                <p className="text-sm text-slate-600 mt-1">Pages</p>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-emerald-600">4</div>
                                <p className="text-sm text-slate-600 mt-1">Entities</p>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-purple-600">8</div>
                                <p className="text-sm text-slate-600 mt-1">Languages</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Resources */}
                <Card>
                    <CardHeader>
                        <CardTitle>Additional Resources</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <a 
                            href="https://docs.base44.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block p-3 border rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            <div className="font-semibold text-blue-600">Base44 Documentation</div>
                            <div className="text-sm text-slate-600">Official platform documentation and API reference</div>
                        </a>
                        <div className="p-3 border rounded-lg bg-slate-50">
                            <div className="font-semibold text-slate-800">Platform Dashboard</div>
                            <div className="text-sm text-slate-600">Access entity management, users, and integrations via Base44 editor</div>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer Note */}
                <div className="text-center text-sm text-slate-500 pt-4 border-t">
                    <p>Built on Base44 Platform • Designed for Indian Students • Open Education Initiative</p>
                </div>
            </div>
        </div>
    );
}