
import React, { useState } from 'react';
import { Lock, Crown, CheckCircle, Filter, Search, Globe, DollarSign, Users, Award, Zap, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const SELLERS = [
    { id: 1, name: 'Apex Manufacturing Group', country: 'China', revenue: '$200M+', employees: '500-1000', rdStaff: '50+', certs: ['ISO 9001', 'ISO 14001', 'IATF 16949'], verified: true, premium: true },
    { id: 2, name: 'EuroTech Solutions', country: 'Germany', revenue: '$50M - $100M', employees: '100-200', rdStaff: '25', certs: ['CE', 'RoHS'], verified: true, premium: true },
    { id: 3, name: 'Vietnam Garment Corp', country: 'Vietnam', revenue: '$100M+', employees: '1000+', rdStaff: '10', certs: ['WRAP', 'BSCI'], verified: true, premium: false },
    { id: 4, name: 'Silicon Valley Circuits', country: 'USA', revenue: '$500M+', employees: '2000+', rdStaff: '200+', certs: ['UL', 'IPC', 'ISO 9001'], verified: true, premium: true },
    { id: 5, name: 'Tokyo Precision Parts', country: 'Japan', revenue: '$80M+', employees: '300', rdStaff: '45', certs: ['JIS', 'ISO 9001'], verified: true, premium: false },
];

const PremiumSellersPage: React.FC = () => {
    // Simulate user state
    const [isPremiumUser, setIsPremiumUser] = useState(false);
    const [advancedFilter, setAdvancedFilter] = useState({
        minRevenue: '',
        minRD: '',
        certification: ''
    });

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            {/* Header */}
            <div className="bg-indigo-900 text-white py-12">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 bg-indigo-800 border border-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                        <Crown size={14} className="text-yellow-400"/> Premium Access
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Verified Seller Directory</h1>
                    <p className="text-indigo-200 text-lg max-w-2xl mx-auto">
                        Search high-capacity manufacturers with advanced filtering capabilities.
                        Access detailed financial and operational data.
                    </p>
                    
                    {/* User Role Simulation Toggle */}
                    <div className="mt-8 inline-flex bg-indigo-950 p-1 rounded-lg border border-indigo-800">
                        <button 
                            onClick={() => setIsPremiumUser(false)}
                            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${!isPremiumUser ? 'bg-white text-indigo-900 shadow' : 'text-indigo-300 hover:text-white'}`}
                        >
                            View as Free User
                        </button>
                        <button 
                            onClick={() => setIsPremiumUser(true)}
                            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${isPremiumUser ? 'bg-yellow-500 text-indigo-900 shadow' : 'text-indigo-300 hover:text-white'}`}
                        >
                            View as Premium User
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Advanced Filters Sidebar */}
                <div className="lg:col-span-1">
                    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24 ${!isPremiumUser ? 'relative overflow-hidden' : ''}`}>
                        
                        {!isPremiumUser && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-6 text-center">
                                <Lock size={48} className="text-slate-400 mb-4"/>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">Premium Filters Locked</h3>
                                <p className="text-sm text-slate-500 mb-4">Upgrade to Pro to filter by Revenue, R&D Capacity, and Certifications.</p>
                                <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-indigo-700 w-full">
                                    Unlock Premium
                                </button>
                            </div>
                        )}

                        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                            <Filter size={18}/> <span className="font-bold">Advanced Filters</span>
                        </div>

                        <div className="space-y-6 opacity-100">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
                                    <DollarSign size={12}/> Min. Revenue
                                </label>
                                <select 
                                    className="w-full p-2 border border-gray-200 rounded text-sm"
                                    disabled={!isPremiumUser}
                                    value={advancedFilter.minRevenue}
                                    onChange={e => setAdvancedFilter({...advancedFilter, minRevenue: e.target.value})}
                                >
                                    <option value="">Any Revenue</option>
                                    <option value="10M">$10 Million+</option>
                                    <option value="50M">$50 Million+</option>
                                    <option value="100M">$100 Million+</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
                                    <Zap size={12}/> R&D Capacity
                                </label>
                                <select 
                                    className="w-full p-2 border border-gray-200 rounded text-sm"
                                    disabled={!isPremiumUser}
                                    value={advancedFilter.minRD}
                                    onChange={e => setAdvancedFilter({...advancedFilter, minRD: e.target.value})}
                                >
                                    <option value="">Any</option>
                                    <option value="10">10+ Engineers</option>
                                    <option value="50">50+ Engineers</option>
                                    <option value="100">100+ Engineers</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
                                    <Award size={12}/> Certification
                                </label>
                                <div className="space-y-2">
                                    {['ISO 9001', 'ISO 14001', 'SA8000', 'CE', 'UL'].map(cert => (
                                        <label key={cert} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                className="rounded text-indigo-600"
                                                disabled={!isPremiumUser}
                                            /> {cert}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Seller List */}
                <div className="lg:col-span-3 space-y-4">
                    {!isPremiumUser && (
                        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex items-start gap-3 mb-6">
                            <AlertCircle className="text-yellow-600 flex-shrink-0" size={20}/>
                            <div>
                                <h4 className="font-bold text-yellow-800 text-sm">Limited View Access</h4>
                                <p className="text-xs text-yellow-700 mt-1">You are viewing a limited version of the directory. Premium members see advanced financial data and direct contact info.</p>
                            </div>
                        </div>
                    )}

                    {SELLERS.map(seller => (
                        <div key={seller.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all relative overflow-hidden group">
                            {seller.premium && (
                                <div className="absolute top-0 right-0 bg-yellow-400 text-slate-900 text-[10px] font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1">
                                    <Crown size={10}/> Premium Seller
                                </div>
                            )}
                            
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold text-slate-800">{seller.name}</h3>
                                        {seller.verified && <CheckCircle size={18} className="text-blue-500" fill="white"/>}
                                    </div>
                                    <div className="text-sm text-slate-500 flex items-center gap-4 mb-4">
                                        <span className="flex items-center gap-1"><Globe size={14}/> {seller.country}</span>
                                        <span className="flex items-center gap-1"><Users size={14}/> {seller.employees} Employees</span>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-2">
                                        {seller.certs.map((c, i) => (
                                            <span key={i} className="text-xs border border-gray-200 px-2 py-1 rounded bg-gray-50 text-slate-600">{c}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className={`flex flex-col justify-center min-w-[200px] border-l border-gray-100 pl-6 ${!isPremiumUser ? 'filter blur-[2px] select-none opacity-50 relative' : ''}`}>
                                    <div className="mb-3">
                                        <div className="text-xs text-slate-400 uppercase font-bold">Annual Revenue</div>
                                        <div className="text-lg font-bold text-green-600">{seller.revenue}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-400 uppercase font-bold">R&D Staff</div>
                                        <div className="text-lg font-bold text-indigo-600">{seller.rdStaff}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end gap-3">
                                <Link to={`/supplier/s${seller.id}`} className="px-4 py-2 border border-gray-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-gray-50">
                                    View Profile
                                </Link>
                                <button 
                                    disabled={!isPremiumUser}
                                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-colors ${isPremiumUser ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                                >
                                    {isPremiumUser ? 'Contact Directly' : 'Upgrade to Contact'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PremiumSellersPage;
