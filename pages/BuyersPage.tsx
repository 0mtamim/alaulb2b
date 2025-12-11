
import React, { useState } from 'react';
import { Lock, Search, Filter, MapPin, DollarSign, Briefcase, ShieldCheck, UserCheck, Mail, Building, Globe, Crown, AlertTriangle } from 'lucide-react';

const BUYERS = [
    { 
        id: 1, 
        name: 'ElectroGlobal Distribution', 
        location: 'United States', 
        industry: 'Consumer Electronics', 
        annualPurchasing: '$10M - $50M', 
        recentRequest: 'Looking for 5000 units of Smart Watches with AMOLED display.', 
        verified: true, 
        tier: 'Enterprise',
        lastActive: '2 hours ago'
    },
    { 
        id: 2, 
        name: 'Berlin AutoParts GmbH', 
        location: 'Germany', 
        industry: 'Automotive', 
        annualPurchasing: '$5M - $10M', 
        recentRequest: 'CNC Machined Aluminum Parts for aftermarket exhaust systems.', 
        verified: true, 
        tier: 'Pro',
        lastActive: '1 day ago'
    },
    { 
        id: 3, 
        name: 'Tokyo Retail Group', 
        location: 'Japan', 
        industry: 'Apparel & Fashion', 
        annualPurchasing: '$1M - $5M', 
        recentRequest: 'Organic Cotton T-Shirts, 180 GSM, Custom Dye.', 
        verified: false, 
        tier: 'Standard',
        lastActive: '5 hours ago'
    },
    { 
        id: 4, 
        name: 'Samba Imports SA', 
        location: 'Brazil', 
        industry: 'Industrial Machinery', 
        annualPurchasing: '$20M+', 
        recentRequest: 'Heavy Duty Hydraulic Pumps and Valve sets.', 
        verified: true, 
        tier: 'Enterprise',
        lastActive: '30 mins ago'
    },
    { 
        id: 5, 
        name: 'Nordic Home Designs', 
        location: 'Sweden', 
        industry: 'Furniture', 
        annualPurchasing: '$500k - $2M', 
        recentRequest: 'Sustainable Bamboo Chairs and Flat-pack tables.', 
        verified: true, 
        tier: 'Pro',
        lastActive: '3 days ago'
    },
    { 
        id: 6, 
        name: 'TechWave Solutions', 
        location: 'India', 
        industry: 'Consumer Electronics', 
        annualPurchasing: '$2M - $5M', 
        recentRequest: 'PCB Assemblies for IoT devices.', 
        verified: false, 
        tier: 'Standard',
        lastActive: '1 week ago'
    },
];

const BuyersPage: React.FC = () => {
    // Simulate user state: Suppliers must be Verified/Premium to see details
    const [isVerifiedSupplier, setIsVerifiedSupplier] = useState(false);
    
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({
        industry: '',
        minBudget: '',
        location: ''
    });

    const filteredBuyers = BUYERS.filter(b => {
        const matchSearch = b.recentRequest.toLowerCase().includes(search.toLowerCase()) || 
                            (isVerifiedSupplier && b.name.toLowerCase().includes(search.toLowerCase()));
        
        const matchIndustry = filters.industry ? b.industry === filters.industry : true;
        const matchLocation = filters.location ? b.location === filters.location : true;
        
        // Simple mock budget logic
        let matchBudget = true;
        if (filters.minBudget === 'high') {
            matchBudget = b.annualPurchasing.includes('$10M') || b.annualPurchasing.includes('$20M');
        } else if (filters.minBudget === 'medium') {
            matchBudget = b.annualPurchasing.includes('$1M') || b.annualPurchasing.includes('$5M');
        }

        return matchSearch && matchIndustry && matchLocation && matchBudget;
    });

    const industries = Array.from(new Set(BUYERS.map(b => b.industry)));
    const locations = Array.from(new Set(BUYERS.map(b => b.location)));

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            {/* Exclusive Header */}
            <div className="bg-slate-900 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 border border-orange-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6 shadow-lg">
                            <Crown size={14} fill="currentColor" className="text-white"/> Supplier Exclusive
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                            Find Active Buyers & RFQs
                        </h1>
                        <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
                            Access a curated directory of high-volume buyers actively looking for suppliers. 
                            Verified suppliers get full access to contact details and RFQ specifics.
                        </p>

                        {/* Simulation Toggle */}
                        <div className="inline-flex bg-slate-800 p-1 rounded-lg border border-slate-700">
                            <button 
                                onClick={() => setIsVerifiedSupplier(false)}
                                className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${!isVerifiedSupplier ? 'bg-white text-slate-900 shadow' : 'text-slate-400 hover:text-white'}`}
                            >
                                Free Supplier View
                            </button>
                            <button 
                                onClick={() => setIsVerifiedSupplier(true)}
                                className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${isVerifiedSupplier ? 'bg-orange-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                            >
                                Verified Supplier View
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Advanced Filters Sidebar */}
                <div className="lg:col-span-1">
                    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24 ${!isVerifiedSupplier ? 'relative overflow-hidden' : ''}`}>
                        
                        {/* Lock Overlay for Non-Verified */}
                        {!isVerifiedSupplier && (
                            <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] z-20 flex flex-col items-center justify-center p-6 text-center">
                                <Lock size={48} className="text-slate-300 mb-4"/>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">Advanced Filters Locked</h3>
                                <p className="text-sm text-slate-500 mb-4">Upgrade to Verified Supplier to filter buyers by purchasing power and specific regions.</p>
                                <button className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-slate-800 w-full shadow-lg">
                                    Unlock Now
                                </button>
                            </div>
                        )}

                        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                            <Filter size={18}/> <span className="font-bold">Refine Buyers</span>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
                                    <Building size={12}/> Industry
                                </label>
                                <select 
                                    className="w-full p-2 border border-gray-200 rounded text-sm bg-slate-50"
                                    value={filters.industry}
                                    onChange={e => setFilters({...filters, industry: e.target.value})}
                                >
                                    <option value="">All Industries</option>
                                    {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
                                    <DollarSign size={12}/> Purchasing Volume
                                </label>
                                <select 
                                    className="w-full p-2 border border-gray-200 rounded text-sm bg-slate-50"
                                    value={filters.minBudget}
                                    onChange={e => setFilters({...filters, minBudget: e.target.value})}
                                    disabled={!isVerifiedSupplier}
                                >
                                    <option value="">Any Volume</option>
                                    <option value="medium">$1M - $10M / Year</option>
                                    <option value="high">$10M+ / Year</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
                                    <Globe size={12}/> Location
                                </label>
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                    {locations.map(loc => (
                                        <label key={loc} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                            <input 
                                                type="radio" 
                                                name="location"
                                                className="text-orange-500"
                                                checked={filters.location === loc}
                                                onChange={() => setFilters({...filters, location: loc})}
                                                disabled={!isVerifiedSupplier}
                                            /> {loc}
                                        </label>
                                    ))}
                                    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="location"
                                            className="text-orange-500"
                                            checked={filters.location === ''}
                                            onChange={() => setFilters({...filters, location: ''})}
                                        /> All Locations
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Buyer List */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Search Bar */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 text-gray-400" size={20}/>
                            <input 
                                type="text"
                                placeholder={isVerifiedSupplier ? "Search buyer name, requests..." : "Search requests (Buyer names hidden)..."}
                                className="w-full pl-10 p-2.5 outline-none text-sm text-slate-700"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <button className="bg-slate-900 text-white px-6 rounded-lg font-bold text-sm hover:bg-slate-800">Search</button>
                    </div>

                    {!isVerifiedSupplier && (
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex gap-3 items-start">
                            <AlertTriangle className="text-blue-600 flex-shrink-0" size={20}/>
                            <div>
                                <h4 className="font-bold text-blue-900 text-sm">Limited Access Mode</h4>
                                <p className="text-xs text-blue-700 mt-1">
                                    You are viewing the public version of the Buyer Directory. 
                                    <strong> Company names</strong> and <strong>contact buttons</strong> are hidden. 
                                    Verified Suppliers can see full details and quote directly.
                                </p>
                            </div>
                        </div>
                    )}

                    {filteredBuyers.map(buyer => (
                        <div key={buyer.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all relative overflow-hidden group">
                            {buyer.tier === 'Enterprise' && (
                                <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1 shadow-md">
                                    <ShieldCheck size={10}/> Enterprise Buyer
                                </div>
                            )}

                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Buyer Avatar / Logo Placeholder */}
                                <div className="flex-shrink-0">
                                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-xl font-bold border-2 ${isVerifiedSupplier ? 'bg-white border-slate-100 text-slate-700' : 'bg-slate-100 border-dashed border-slate-300 text-slate-300'}`}>
                                        {isVerifiedSupplier ? buyer.name.charAt(0) : '?'}
                                    </div>
                                </div>

                                <div className="flex-1">
                                    {/* Buyer Name & Header */}
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                                        <div>
                                            {isVerifiedSupplier ? (
                                                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                                    {buyer.name} 
                                                    {buyer.verified && <UserCheck size={18} className="text-blue-500" fill="currentColor" color="white"/>}
                                                </h3>
                                            ) : (
                                                <h3 className="text-xl font-bold text-slate-400 flex items-center gap-2 select-none blur-[4px]">
                                                    Hidden Company Name
                                                </h3>
                                            )}
                                            <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                                                <span className="flex items-center gap-1"><MapPin size={12}/> {buyer.location}</span>
                                                <span className="flex items-center gap-1"><Briefcase size={12}/> {buyer.industry}</span>
                                                <span className="flex items-center gap-1"><Search size={12}/> Last active: {buyer.lastActive}</span>
                                            </div>
                                        </div>
                                        
                                        {isVerifiedSupplier && (
                                            <div className="mt-2 md:mt-0 text-right">
                                                <div className="text-xs text-slate-400 uppercase font-bold">Annual Spend</div>
                                                <div className="text-lg font-bold text-green-600">{buyer.annualPurchasing}</div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Request Detail */}
                                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mt-3">
                                        <div className="text-xs font-bold text-slate-400 uppercase mb-1">Latest Request</div>
                                        <p className="text-slate-700 font-medium">{buyer.recentRequest}</p>
                                    </div>

                                    {/* Action Footer */}
                                    <div className="mt-6 flex justify-end gap-3">
                                        <button className="px-4 py-2 text-sm font-bold text-slate-600 border border-gray-200 rounded-lg hover:bg-slate-50 transition-colors">
                                            View Profile
                                        </button>
                                        <button 
                                            disabled={!isVerifiedSupplier}
                                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                                                isVerifiedSupplier 
                                                ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-md' 
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            }`}
                                        >
                                            {isVerifiedSupplier ? <><Mail size={16}/> Contact Buyer</> : <><Lock size={14}/> Unlock to Contact</>}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BuyersPage;
