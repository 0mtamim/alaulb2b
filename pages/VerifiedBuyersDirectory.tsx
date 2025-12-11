
import React, { useState } from 'react';
import { 
    Users, ShieldCheck, Lock, Search, Filter, Globe, 
    CreditCard, Calendar, CheckCircle, Activity, 
    DollarSign, Star, Zap, Building2, Crown
} from 'lucide-react';
import { calculateBuyerMatch } from '../services/gemini';

// Mock Verified Buyers Data
const VERIFIED_BUYERS = [
    {
        id: 'vb1',
        name: 'Global Retail Solutions',
        country: 'USA',
        industry: 'Consumer Electronics',
        purchasingVolume: '50M+',
        creditRating: 'AAA',
        verifiedSince: '2019',
        lastActive: '2 hours ago',
        matchScore: 95,
        rfqsPosted: 124,
        preferredTerms: 'Net 60'
    },
    {
        id: 'vb2',
        name: 'EuroTech Components',
        country: 'Germany',
        industry: 'Industrial Machinery',
        purchasingVolume: '10M-50M',
        creditRating: 'AA',
        verifiedSince: '2021',
        lastActive: '1 day ago',
        matchScore: 88,
        rfqsPosted: 45,
        preferredTerms: 'LC'
    },
    {
        id: 'vb3',
        name: 'Asia Pacific Sourcing',
        country: 'Singapore',
        industry: 'Textiles',
        purchasingVolume: '5M-10M',
        creditRating: 'A',
        verifiedSince: '2022',
        lastActive: '30 mins ago',
        matchScore: 72,
        rfqsPosted: 89,
        preferredTerms: 'T/T'
    },
    {
        id: 'vb4',
        name: 'Nordic Home Furnishings',
        country: 'Sweden',
        industry: 'Furniture',
        purchasingVolume: '1M-5M',
        creditRating: 'AA+',
        verifiedSince: '2020',
        lastActive: '5 hours ago',
        matchScore: 81,
        rfqsPosted: 32,
        preferredTerms: 'Net 30'
    },
    {
        id: 'vb5',
        name: 'Sao Paulo Construction',
        country: 'Brazil',
        industry: 'Construction Materials',
        purchasingVolume: '10M-50M',
        creditRating: 'B+',
        verifiedSince: '2023',
        lastActive: '2 days ago',
        matchScore: 65,
        rfqsPosted: 15,
        preferredTerms: 'LC'
    }
];

const VerifiedBuyersDirectory: React.FC = () => {
    // Permission State
    const [isPremiumSupplier, setIsPremiumSupplier] = useState(false);
    
    // Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        industry: [] as string[],
        minVolume: '',
        creditRating: '',
        country: ''
    });

    // AI Match State
    const [selectedBuyerId, setSelectedBuyerId] = useState<string | null>(null);
    const [matchAnalysis, setMatchAnalysis] = useState<any>(null);
    const [analyzing, setAnalyzing] = useState(false);

    const handleMatchAnalysis = async (buyer: any) => {
        setAnalyzing(true);
        setSelectedBuyerId(buyer.id);
        const res = await calculateBuyerMatch(
            "High-end Electronics Manufacturer with ISO9001 and 10 years export experience to US/EU.", 
            `${buyer.industry} buyer seeking reliable suppliers with ${buyer.preferredTerms} terms.`
        );
        setMatchAnalysis(res);
        setAnalyzing(false);
    };

    const handleIndustryToggle = (industry: string) => {
        setFilters(prev => ({
            ...prev,
            industry: prev.industry.includes(industry) 
                ? prev.industry.filter(i => i !== industry) 
                : [...prev.industry, industry]
        }));
    };

    const filteredBuyers = VERIFIED_BUYERS.filter(buyer => {
        const matchesSearch = buyer.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesIndustry = filters.industry.length === 0 || filters.industry.includes(buyer.industry);
        const matchesCountry = filters.country === '' || buyer.country === filters.country;
        
        let matchesVolume = true;
        if (filters.minVolume === 'high') matchesVolume = buyer.purchasingVolume.includes('50M');
        if (filters.minVolume === 'med') matchesVolume = buyer.purchasingVolume.includes('10M');

        return matchesSearch && matchesIndustry && matchesCountry && matchesVolume;
    });

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            {/* Header */}
            <div className="bg-slate-900 text-white pt-10 pb-20">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <ShieldCheck className="text-green-400" size={24}/>
                                <span className="text-green-400 font-bold tracking-wide text-sm uppercase">Verified Database</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Global Buyer Directory</h1>
                            <p className="text-slate-400 max-w-xl">
                                Exclusive access to verified buyers with high purchasing volume. 
                                Connect directly with decision makers.
                            </p>
                        </div>
                        
                        {/* Simulation Toggle */}
                        <div className="bg-slate-800 p-1 rounded-lg border border-slate-700 flex text-xs font-bold">
                            <button 
                                onClick={() => setIsPremiumSupplier(false)}
                                className={`px-4 py-2 rounded-md transition-all ${!isPremiumSupplier ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white'}`}
                            >
                                Free Supplier
                            </button>
                            <button 
                                onClick={() => setIsPremiumSupplier(true)}
                                className={`px-4 py-2 rounded-md transition-all ${isPremiumSupplier ? 'bg-green-500 text-white' : 'text-slate-400 hover:text-white'}`}
                            >
                                Premium Supplier
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-10 relative z-10 pb-12">
                <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden min-h-[600px] flex">
                    
                    {/* Filters Sidebar */}
                    <div className="w-64 bg-slate-50 border-r border-gray-200 p-6 flex-shrink-0">
                        <div className="flex items-center gap-2 mb-6 font-bold text-slate-700">
                            <Filter size={18}/> Filters
                        </div>

                        <div className="space-y-6">
                            {/* Industry */}
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Industry</label>
                                <div className="space-y-2">
                                    {['Consumer Electronics', 'Textiles', 'Industrial Machinery', 'Furniture'].map(ind => (
                                        <label key={ind} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-blue-600">
                                            <input 
                                                type="checkbox" 
                                                className="rounded text-blue-600"
                                                checked={filters.industry.includes(ind)}
                                                onChange={() => handleIndustryToggle(ind)}
                                                disabled={!isPremiumSupplier}
                                            />
                                            {ind}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Annual Volume */}
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Purchasing Volume</label>
                                <select 
                                    className="w-full p-2 border border-gray-200 rounded text-sm bg-white"
                                    value={filters.minVolume}
                                    onChange={e => setFilters({...filters, minVolume: e.target.value})}
                                    disabled={!isPremiumSupplier}
                                >
                                    <option value="">Any Volume</option>
                                    <option value="med">$10M+ / Year</option>
                                    <option value="high">$50M+ / Year</option>
                                </select>
                            </div>

                            {/* Credit Rating */}
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Min. Credit Rating</label>
                                <div className="flex gap-2">
                                    {['A', 'AA', 'AAA'].map(rate => (
                                        <button 
                                            key={rate}
                                            className="px-3 py-1 bg-white border border-gray-200 rounded text-xs font-bold hover:border-green-500 hover:text-green-600 disabled:opacity-50"
                                            disabled={!isPremiumSupplier}
                                        >
                                            {rate}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {!isPremiumSupplier && (
                            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                                <Lock size={24} className="mx-auto text-yellow-600 mb-2"/>
                                <p className="text-xs text-yellow-800 font-bold mb-2">Filters Locked</p>
                                <p className="text-[10px] text-yellow-700 mb-3">Upgrade to Premium to filter high-value buyers.</p>
                                <button className="w-full bg-yellow-500 text-white text-xs font-bold py-2 rounded hover:bg-yellow-600">Upgrade</button>
                            </div>
                        )}
                    </div>

                    {/* Main List */}
                    <div className="flex-1 flex flex-col">
                        {/* Search Bar */}
                        <div className="p-4 border-b border-gray-200 flex gap-4 bg-white">
                            <div className="flex-1 relative">
                                <Search size={18} className="absolute left-3 top-2.5 text-gray-400"/>
                                <input 
                                    type="text" 
                                    placeholder="Search by company name, country..." 
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    disabled={!isPremiumSupplier}
                                />
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span className="font-bold text-slate-800">{filteredBuyers.length}</span> Results
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
                            {!isPremiumSupplier ? (
                                <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
                                    <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-6">
                                        <Lock size={40} className="text-slate-400"/>
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Premium Access Required</h2>
                                    <p className="text-slate-500 mb-8">
                                        The Global Verified Buyer Directory contains sensitive commercial data available only to our verified manufacturing partners.
                                    </p>
                                    <button 
                                        onClick={() => setIsPremiumSupplier(true)}
                                        className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-lg"
                                    >
                                        Unlock Full Access (Demo)
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredBuyers.map(buyer => (
                                        <div key={buyer.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow relative group">
                                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-xl font-bold text-slate-800">{buyer.name}</h3>
                                                        <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                                            <CheckCircle size={10}/> Verified {buyer.verifiedSince}
                                                        </span>
                                                        {buyer.creditRating === 'AAA' && (
                                                            <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                                                <Crown size={10}/> Top Credit
                                                            </span>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-4">
                                                        <div>
                                                            <div className="text-xs text-slate-400 uppercase font-bold mb-1">Location</div>
                                                            <div className="flex items-center gap-1 font-medium text-slate-700">
                                                                <Globe size={14}/> {buyer.country}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-slate-400 uppercase font-bold mb-1">Annual Volume</div>
                                                            <div className="flex items-center gap-1 font-medium text-green-600">
                                                                <DollarSign size={14}/> {buyer.purchasingVolume}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-slate-400 uppercase font-bold mb-1">Industry</div>
                                                            <div className="flex items-center gap-1 font-medium text-slate-700">
                                                                <Building2 size={14}/> {buyer.industry}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-slate-400 uppercase font-bold mb-1">Activity</div>
                                                            <div className="flex items-center gap-1 font-medium text-slate-700">
                                                                <Activity size={14}/> {buyer.lastActive}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-2 min-w-[160px] border-l border-gray-100 pl-6 justify-center">
                                                    <div className="text-center mb-2">
                                                        <div className="text-xs text-slate-400 font-bold uppercase mb-1">Match Score</div>
                                                        <div className="text-2xl font-bold text-blue-600">{buyer.matchScore}%</div>
                                                    </div>
                                                    <button 
                                                        onClick={() => handleMatchAnalysis(buyer)}
                                                        className="w-full bg-blue-50 text-blue-600 font-bold text-xs py-2 rounded border border-blue-100 hover:bg-blue-100 flex items-center justify-center gap-1"
                                                    >
                                                        <Zap size={12}/> Analyze Needs
                                                    </button>
                                                    <button className="w-full bg-slate-900 text-white font-bold text-xs py-2 rounded hover:bg-slate-800">
                                                        Connect
                                                    </button>
                                                </div>
                                            </div>

                                            {/* AI Analysis Dropdown */}
                                            {selectedBuyerId === buyer.id && (
                                                <div className="mt-4 pt-4 border-t border-gray-100 bg-slate-50 -mx-6 -mb-6 p-6 rounded-b-xl animate-fade-in">
                                                    <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                                                        <Zap size={16} className="text-yellow-500"/> AI Buyer Analysis
                                                    </h4>
                                                    {analyzing ? (
                                                        <div className="text-sm text-slate-500 flex items-center gap-2">
                                                            <Activity className="animate-spin" size={14}/> Analyzing fit...
                                                        </div>
                                                    ) : matchAnalysis ? (
                                                        <div className="text-sm">
                                                            <div className="flex justify-between mb-2">
                                                                <span className="font-bold text-slate-700">Compatibility Score:</span>
                                                                <span className="font-bold text-green-600">{matchAnalysis.score}/100</span>
                                                            </div>
                                                            <p className="text-slate-600 bg-white p-3 rounded border border-gray-200">
                                                                {matchAnalysis.reason}
                                                            </p>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifiedBuyersDirectory;
