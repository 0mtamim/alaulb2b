
import React, { useState } from 'react';
import { PenTool, Layers, Cpu, CheckCircle, UploadCloud, Lock, ArrowRight, Zap, FileCode } from 'lucide-react';
import { analyzePrototypingFeasibility } from '../services/gemini';

const CPDPage: React.FC = () => {
    const [projectDesc, setProjectDesc] = useState('');
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState<any>(null);

    const handleAnalyze = async () => {
        if (!projectDesc) return;
        setLoading(true);
        const res = await analyzePrototypingFeasibility(projectDesc);
        setAnalysis(res);
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero */}
            <div className="bg-indigo-900 text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-purple-900 opacity-90"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 bg-indigo-800 border border-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                            <PenTool size={14}/> R&D Services
                        </div>
                        <h1 className="text-5xl font-extrabold mb-6 leading-tight">Collaborative Product Development (CPD)</h1>
                        <p className="text-indigo-100 text-xl mb-8">
                            Bring your ideas to life. Connect with verified ODM manufacturers and engineering experts to prototype, test, and mass-produce custom products.
                        </p>
                        <div className="flex gap-4">
                            <button className="bg-white text-indigo-900 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                                Start a New Project
                            </button>
                            <button className="border border-indigo-400 text-indigo-100 px-8 py-3 rounded-lg font-bold hover:bg-indigo-800 transition-colors">
                                Browse Experts
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Feasibility Tool */}
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Zap className="text-yellow-500"/> AI Feasibility Check
                    </h2>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Describe your product concept</label>
                        <textarea 
                            className="w-full p-4 border border-gray-200 rounded-xl h-40 focus:outline-none focus:border-indigo-500 mb-4"
                            placeholder="e.g. A smart water bottle with built-in UV purification and bluetooth tracking..."
                            value={projectDesc}
                            onChange={e => setProjectDesc(e.target.value)}
                        ></textarea>
                        
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Lock size={12}/> Your idea is processed securely via NDA-compliant AI.
                            </div>
                            <button 
                                onClick={handleAnalyze}
                                disabled={loading || !projectDesc}
                                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {loading ? 'Analyzing...' : 'Check Feasibility'}
                            </button>
                        </div>

                        {analysis && (
                            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 animate-fade-in">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-sm font-bold text-indigo-800 uppercase">Feasibility Score</span>
                                    <span className="text-3xl font-bold text-indigo-600">{analysis.feasibilityScore}/100</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                                    <div className="bg-indigo-600 h-2 rounded-full" style={{width: `${analysis.feasibilityScore}%`}}></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="bg-white p-3 rounded border border-indigo-100">
                                        <div className="text-xs text-gray-500 uppercase font-bold">Est. Timeline</div>
                                        <div className="font-bold text-slate-800">{analysis.estimatedTimeline}</div>
                                    </div>
                                    <div className="bg-white p-3 rounded border border-indigo-100">
                                        <div className="text-xs text-gray-500 uppercase font-bold">Tech Readiness</div>
                                        <div className="font-bold text-slate-800">TRL 4-5</div>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-indigo-800 mb-2">Potential Challenges</div>
                                    <ul className="text-sm text-slate-600 space-y-1">
                                        {analysis.challenges?.map((c: string, i: number) => (
                                            <li key={i} className="flex gap-2 items-start"><span className="text-indigo-400">•</span> {c}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Workflow Steps */}
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-8">How It Works</h2>
                    <div className="space-y-8">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">1</div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-800">Concept & NDA</h3>
                                <p className="text-slate-500 text-sm">Submit your PRD (Product Requirement Doc). We sign a platform-wide NDA to protect your IP.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-lg">2</div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-800">Match with ODM Experts</h3>
                                <p className="text-slate-500 text-sm">Our AI pairs you with manufacturers who have specific tooling and engineering capabilities for your product.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-lg">3</div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-800">Prototyping & Iteration</h3>
                                <p className="text-slate-500 text-sm">Manage CAD files, 3D printing requests, and sample shipping directly in the CPD Dashboard.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-lg">4</div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-800">Mass Production</h3>
                                <p className="text-slate-500 text-sm">Seamlessly transition verified prototypes to bulk manufacturing orders with Trade Assurance.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Document Handling Banner */}
            <div className="bg-slate-900 text-slate-300 py-16 mt-12">
                <div className="container mx-auto px-4 text-center">
                    <UploadCloud size={48} className="mx-auto text-indigo-400 mb-6"/>
                    <h2 className="text-2xl font-bold text-white mb-4">Secure File Handling</h2>
                    <p className="max-w-2xl mx-auto mb-8">
                        Our platform supports STEP, IGES, STL, and DWG file formats with version control. 
                        Access is strictly limited to assigned engineering teams.
                    </p>
                    <div className="flex justify-center gap-8 text-sm font-bold">
                        <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500"/> 256-bit Encryption</span>
                        <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500"/> IP Protection Guarantee</span>
                        <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500"/> ISO 27001 Certified</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CPDPage;
