
import React, { useState } from 'react';
import { ShieldCheck, User, Search, FileText, CheckCircle, XCircle, AlertTriangle, ChevronRight, Bot, Lock, Building2, Globe, TrendingUp } from 'lucide-react';
import { BuyerVerificationRequest } from '../types';
import { analyzeBuyerCredibility } from '../services/gemini';

const MOCK_REQUESTS: BuyerVerificationRequest[] = [
    {
        id: 'REQ-1001',
        buyerName: 'David Chen',
        buyerCompany: 'Global Sourcing Ltd.',
        country: 'Singapore',
        requestDate: '2023-10-27',
        status: 'pending',
        documents: [
            { type: 'Business License', url: '#', status: 'valid' },
            { type: 'Bank Reference Letter', url: '#', status: 'pending' }
        ],
        annualPurchasingVolume: '$5M - $10M'
    },
    {
        id: 'REQ-1002',
        buyerName: 'Sarah Johnson',
        buyerCompany: 'Nordic Retail Group',
        country: 'Sweden',
        requestDate: '2023-10-26',
        status: 'verified',
        documents: [
            { type: 'Tax Registration', url: '#', status: 'valid' }
        ],
        annualPurchasingVolume: '$1M - $5M',
        creditScore: 85
    }
];

const BuyerVerificationPage: React.FC = () => {
    const [requests, setRequests] = useState<BuyerVerificationRequest[]>(MOCK_REQUESTS);
    const [selectedRequest, setSelectedRequest] = useState<BuyerVerificationRequest | null>(null);
    const [loadingAnalysis, setLoadingAnalysis] = useState(false);

    const handleRunAnalysis = async () => {
        if (!selectedRequest) return;
        setLoadingAnalysis(true);
        const result = await analyzeBuyerCredibility(selectedRequest);
        setRequests(prev => prev.map(r => r.id === selectedRequest.id ? { ...r, aiRiskAnalysis: result } : r));
        // Update local selected state to reflect new data
        setSelectedRequest(prev => prev ? { ...prev, aiRiskAnalysis: result } : null);
        setLoadingAnalysis(false);
    };

    const handleStatusUpdate = (id: string, status: 'verified' | 'rejected') => {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
        if (selectedRequest?.id === id) {
            setSelectedRequest(prev => prev ? { ...prev, status } : null);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'bg-green-500';
        if (score >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            {/* Secure Header */}
            <div className="bg-slate-900 text-white py-6 border-b-4 border-yellow-500">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <ShieldCheck size={32} className="text-yellow-500"/>
                        <div>
                            <h1 className="text-2xl font-bold">Buyer Verification Center</h1>
                            <p className="text-xs text-slate-400 flex items-center gap-1">
                                <Lock size={10}/> Secure Supplier Environment
                            </p>
                        </div>
                    </div>
                    <div className="text-right hidden md:block">
                        <div className="text-sm font-bold">Pending Requests</div>
                        <div className="text-2xl font-mono text-yellow-400">{requests.filter(r => r.status === 'pending').length}</div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* List View */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden lg:col-span-1 h-[calc(100vh-200px)] flex flex-col">
                    <div className="p-4 border-b border-gray-100 bg-gray-50 flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={16}/>
                            <input 
                                type="text" 
                                placeholder="Search buyers..." 
                                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {requests.map(req => (
                            <div 
                                key={req.id}
                                onClick={() => setSelectedRequest(req)}
                                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-slate-50 transition-colors ${selectedRequest?.id === req.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
                            >
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-slate-800">{req.buyerName}</h4>
                                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${req.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : req.status === 'verified' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {req.status}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500">{req.buyerCompany} • {req.country}</p>
                                <div className="text-xs text-slate-400 mt-1">{req.requestDate}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Detail View */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 lg:col-span-2 p-6 h-[calc(100vh-200px)] overflow-y-auto">
                    {selectedRequest ? (
                        <div className="space-y-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800">{selectedRequest.buyerName}</h2>
                                    <div className="text-slate-500 flex items-center gap-2">
                                        <Building2 size={16}/> {selectedRequest.buyerCompany}
                                        <span>•</span>
                                        <Globe size={16}/> {selectedRequest.country}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-slate-400 uppercase font-bold">Purchasing Volume</div>
                                    <div className="text-lg font-bold text-green-600">{selectedRequest.annualPurchasingVolume}</div>
                                </div>
                            </div>

                            {/* Documents */}
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                                    <FileText size={18}/> Submitted Documents
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {selectedRequest.documents.map((doc, idx) => (
                                        <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 flex items-center justify-between">
                                            <span className="text-sm font-medium text-slate-700">{doc.type}</span>
                                            <span className={`text-xs font-bold px-2 py-1 rounded ${doc.status === 'valid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {doc.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* AI Analysis */}
                            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold text-indigo-900 flex items-center gap-2">
                                        <Bot size={20}/> AI Credibility Analysis
                                    </h3>
                                    <button 
                                        onClick={handleRunAnalysis}
                                        disabled={loadingAnalysis}
                                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {loadingAnalysis ? <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"/> : <TrendingUp size={14}/>}
                                        {loadingAnalysis ? 'Analyzing Data...' : 'Analyze Credibility'}
                                    </button>
                                </div>
                                {selectedRequest.aiRiskAnalysis ? (
                                    <div className="space-y-4 animate-fade-in">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="bg-white p-4 rounded-lg border border-indigo-100">
                                                <div className="text-xs text-slate-500 uppercase font-bold mb-1">Risk Level</div>
                                                <div className={`text-xl font-bold ${selectedRequest.aiRiskAnalysis.riskLevel === 'Low' ? 'text-green-600' : selectedRequest.aiRiskAnalysis.riskLevel === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                                                    {selectedRequest.aiRiskAnalysis.riskLevel} Risk
                                                </div>
                                            </div>
                                            <div className="bg-white p-4 rounded-lg border border-indigo-100">
                                                <div className="text-xs text-slate-500 uppercase font-bold mb-1">Credit Score</div>
                                                <div className="flex items-center gap-2">
                                                    <div className="text-xl font-bold text-slate-800">{selectedRequest.aiRiskAnalysis.score}</div>
                                                    <div className="text-xs text-slate-400">/ 100</div>
                                                </div>
                                                <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2">
                                                    <div className={`h-1.5 rounded-full ${getScoreColor(selectedRequest.aiRiskAnalysis.score)}`} style={{width: `${selectedRequest.aiRiskAnalysis.score}%`}}></div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-white p-4 rounded-lg border border-indigo-100">
                                            <div className="text-xs text-slate-500 uppercase font-bold mb-2">AI Assessment</div>
                                            <p className="text-sm text-slate-700 leading-relaxed">
                                                {selectedRequest.aiRiskAnalysis.reason}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-6 text-indigo-400 border-2 border-dashed border-indigo-200 rounded-lg bg-white/50">
                                        <Bot size={32} className="mx-auto mb-2 opacity-50"/>
                                        <p className="text-sm">Initiate AI analysis to evaluate buyer payment history and purchasing power.</p>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 pt-4 border-t border-gray-100">
                                <button 
                                    onClick={() => handleStatusUpdate(selectedRequest.id, 'verified')}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2"
                                >
                                    <CheckCircle size={18}/> Verify Buyer
                                </button>
                                <button 
                                    onClick={() => handleStatusUpdate(selectedRequest.id, 'rejected')}
                                    className="flex-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 py-3 rounded-lg font-bold flex items-center justify-center gap-2"
                                >
                                    <XCircle size={18}/> Reject Request
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <User size={64} className="mb-4 opacity-20"/>
                            <p>Select a buyer request to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BuyerVerificationPage;
