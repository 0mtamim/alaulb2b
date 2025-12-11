
import React, { useState } from 'react';
import { ShieldCheck, Lock, DollarSign, CheckCircle, Building, FileText, PieChart, Umbrella, AlertTriangle } from 'lucide-react';
import { assessCreditRisk, calculateInsurancePremium } from '../services/gemini';
import { useLanguage } from '../contexts/LanguageContext';

const TradeAssurancePage: React.FC = () => {
    const { formatPrice } = useLanguage();
    const [activeTab, setActiveTab] = useState<'assurance' | 'insurance' | 'claims'>('assurance');
    
    // Assessment State
    const [companyName, setCompanyName] = useState('');
    const [amount, setAmount] = useState(10000);
    const [riskResult, setRiskResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    // Insurance Calc State
    const [insForm, setInsForm] = useState({ type: 'Cargo', value: '', details: '' });
    const [premiumResult, setPremiumResult] = useState<any>(null);
    const [loadingPremium, setLoadingPremium] = useState(false);

    const handleAssess = async () => {
        setLoading(true);
        const res = await assessCreditRisk(companyName, amount);
        setRiskResult(res);
        setLoading(false);
    };

    const handleCalcPremium = async () => {
        setLoadingPremium(true);
        const res = await calculateInsurancePremium(insForm);
        setPremiumResult(res);
        setLoadingPremium(false);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero */}
            <div className="bg-slate-900 text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-10"></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <ShieldCheck size={64} className="text-yellow-500 mx-auto mb-6"/>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Trade Assurance & Business Insurance</h1>
                    <p className="text-slate-300 text-xl max-w-3xl mx-auto mb-10">
                        Comprehensive protection for global trade. From payment escrow to real-time cargo insurance.
                    </p>
                    
                    <div className="flex justify-center gap-4">
                        <button 
                            onClick={() => setActiveTab('assurance')}
                            className={`px-6 py-2 rounded-full font-bold transition-colors ${activeTab === 'assurance' ? 'bg-yellow-500 text-slate-900' : 'bg-slate-800 text-slate-300'}`}
                        >
                            Credit Assurance
                        </button>
                        <button 
                            onClick={() => setActiveTab('insurance')}
                            className={`px-6 py-2 rounded-full font-bold transition-colors ${activeTab === 'insurance' ? 'bg-yellow-500 text-slate-900' : 'bg-slate-800 text-slate-300'}`}
                        >
                            Cargo Insurance
                        </button>
                        <button 
                            onClick={() => setActiveTab('claims')}
                            className={`px-6 py-2 rounded-full font-bold transition-colors ${activeTab === 'claims' ? 'bg-yellow-500 text-slate-900' : 'bg-slate-800 text-slate-300'}`}
                        >
                            File a Claim
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-10 relative z-10 pb-20">
                {activeTab === 'assurance' && (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 max-w-4xl mx-auto animate-fade-in">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <PieChart className="text-blue-600"/> Smart Credit Assessment
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Company Name</label>
                                <input 
                                    type="text" 
                                    className="w-full p-3 border border-gray-200 rounded-lg"
                                    placeholder="Legal Entity Name"
                                    value={companyName}
                                    onChange={e => setCompanyName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Requested Coverage ($)</label>
                                <input 
                                    type="number" 
                                    className="w-full p-3 border border-gray-200 rounded-lg"
                                    value={amount}
                                    onChange={e => setAmount(Number(e.target.value))}
                                />
                            </div>
                            <button 
                                onClick={handleAssess}
                                className="bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors"
                            >
                                {loading ? 'Analyzing...' : 'Check Eligibility'}
                            </button>
                        </div>

                        {riskResult && (
                            <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200 animate-fade-in">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <div className="text-sm text-gray-500 uppercase font-bold">Risk Level</div>
                                        <div className={`text-2xl font-bold ${riskResult.riskLevel === 'Low' ? 'text-green-600' : riskResult.riskLevel === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                                            {riskResult.riskLevel}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500 uppercase font-bold">Approved Limit</div>
                                        <div className="text-2xl font-bold text-slate-800">${riskResult.maxLimit.toLocaleString()}</div>
                                    </div>
                                </div>
                                <p className="text-slate-600 italic border-t border-gray-200 pt-4">"{riskResult.rationale}"</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'insurance' && (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 max-w-4xl mx-auto animate-fade-in">
                         <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Umbrella className="text-purple-600"/> Real-time Insurance Premium Calculator
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Policy Type</label>
                                <select 
                                    className="w-full p-3 border border-gray-200 rounded-lg bg-white"
                                    value={insForm.type}
                                    onChange={e => setInsForm({...insForm, type: e.target.value})}
                                >
                                    <option>Cargo Insurance (All Risk)</option>
                                    <option>General Liability</option>
                                    <option>Credit Insurance</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Total Value ($)</label>
                                <input 
                                    type="number" 
                                    className="w-full p-3 border border-gray-200 rounded-lg"
                                    placeholder="e.g. 50000"
                                    value={insForm.value}
                                    onChange={e => setInsForm({...insForm, value: e.target.value})}
                                />
                            </div>
                            <div className="col-span-full">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Route / Details</label>
                                <textarea 
                                    className="w-full p-3 border border-gray-200 rounded-lg h-24"
                                    placeholder="e.g. Shipping Electronics from Shenzhen to Hamburg via Sea Freight."
                                    value={insForm.details}
                                    onChange={e => setInsForm({...insForm, details: e.target.value})}
                                ></textarea>
                            </div>
                        </div>
                        <button 
                            onClick={handleCalcPremium}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-bold transition-colors shadow-lg"
                        >
                            {loadingPremium ? 'Calculating Risk Premium...' : 'Get Quote'}
                        </button>

                        {premiumResult && (
                            <div className="mt-8 bg-purple-50 border border-purple-100 rounded-xl p-6">
                                <div className="grid grid-cols-2 gap-8 mb-4">
                                    <div>
                                        <div className="text-sm text-purple-700 uppercase font-bold">Estimated Premium</div>
                                        <div className="text-3xl font-bold text-slate-900">{formatPrice(premiumResult.premium)}</div>
                                        <div className="text-xs text-gray-500">One-time payment</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-purple-700 uppercase font-bold">Deductible</div>
                                        <div className="text-3xl font-bold text-slate-900">{formatPrice(premiumResult.deductible)}</div>
                                        <div className="text-xs text-gray-500">Per incident</div>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-purple-800 mb-2">Key Risk Factors Detected:</div>
                                    <div className="flex gap-2">
                                        {premiumResult.riskFactors.map((r: string, i: number) => (
                                            <span key={i} className="bg-white px-3 py-1 rounded-full text-xs font-bold text-slate-600 border border-purple-100 flex items-center gap-1">
                                                <AlertTriangle size={12} className="text-orange-500"/> {r}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <button className="w-full mt-6 border-2 border-purple-600 text-purple-700 font-bold py-2 rounded-lg hover:bg-purple-100">
                                    Purchase Policy
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'claims' && (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 max-w-2xl mx-auto animate-fade-in text-center">
                        <FileText size={48} className="text-slate-400 mx-auto mb-4"/>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">File an Insurance Claim</h2>
                        <p className="text-slate-500 mb-8">Start the process for damaged cargo, delayed shipments, or liability issues.</p>
                        
                        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-left text-sm text-yellow-800 mb-8">
                            <strong className="block mb-1">Required Documents:</strong>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Original Policy Number</li>
                                <li>Bill of Lading / Airway Bill</li>
                                <li>Photos of Damage</li>
                                <li>Commercial Invoice</li>
                            </ul>
                        </div>

                        <button className="bg-slate-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors w-full">
                            Start Claim Process
                        </button>
                    </div>
                )}
            </div>

            {/* Features Grid */}
            <div className="container mx-auto px-4 py-12 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center p-6">
                        <Lock size={48} className="text-yellow-500 mx-auto mb-4"/>
                        <h3 className="text-xl font-bold mb-2">Secure Payment Escrow</h3>
                        <p className="text-slate-500">Your funds are held securely in a global bank account until you confirm product quality and delivery.</p>
                    </div>
                    <div className="text-center p-6">
                        <FileText size={48} className="text-yellow-500 mx-auto mb-4"/>
                        <h3 className="text-xl font-bold mb-2">Digital Contracts</h3>
                        <p className="text-slate-500">AI-generated smart contracts enforce terms automatically, reducing legal overhead.</p>
                    </div>
                    <div className="text-center p-6">
                        <Building size={48} className="text-yellow-500 mx-auto mb-4"/>
                        <h3 className="text-xl font-bold mb-2">Corporate Credit</h3>
                        <p className="text-slate-500">Apply for Net-30 or Net-60 payment terms powered by our financing partners.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TradeAssurancePage;
