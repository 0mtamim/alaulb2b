
import React, { useState } from 'react';
import { Search, Briefcase, Filter, Globe, DollarSign, TrendingUp, Lock, Sparkles, Building, Gem, UserCheck, MessageSquare, Clock, FileText, CheckCircle, PieChart } from 'lucide-react';
import { BusinessListing } from '../types';

const MOCK_LISTINGS: BusinessListing[] = [
  { id: 'BIZ-001', title: 'Profitable SaaS in Fintech', type: 'business_sale', industry: 'Software', location: 'Singapore', askingPrice: 2500000, reportedRevenue: 1200000, ebitda: 450000, description: 'Established B2B SaaS platform with recurring revenue and strong enterprise client base. Founder looking to exit.', status: 'active', isFeatured: true, postedDate: '2023-10-20', image: 'https://picsum.photos/400/300?random=88' },
  { id: 'BIZ-002', title: 'Textile Manufacturing Unit', type: 'business_sale', industry: 'Manufacturing', location: 'Vietnam', askingPrice: 15000000, reportedRevenue: 8000000, ebitda: 2000000, description: 'High capacity plant with EU export contracts. Fully compliant with modern labor laws.', status: 'active', isFeatured: false, postedDate: '2023-10-18', image: 'https://picsum.photos/400/300?random=89' },
  { id: 'BIZ-003', title: 'Coffee Franchise Opportunity', type: 'franchise', industry: 'Food & Beverage', location: 'USA', askingPrice: 150000, reportedRevenue: 0, ebitda: 0, description: 'Master franchise rights for NYC area. Turnkey operation with training provided.', status: 'active', isFeatured: false, postedDate: '2023-10-22', image: 'https://picsum.photos/400/300?random=90' },
  { id: 'BIZ-004', title: 'Logistics Fleet & Warehousing', type: 'investment', industry: 'Logistics', location: 'Germany', askingPrice: 5000000, reportedRevenue: 3200000, ebitda: 600000, description: 'Seeking equity partner for expansion into Eastern Europe. Fleet of 50+ trucks.', status: 'active', isFeatured: true, postedDate: '2023-10-25', image: 'https://picsum.photos/400/300?random=91' },
];

const InvestPage: React.FC = () => {
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredListings = MOCK_LISTINGS.filter(l => {
      const matchType = filterType === 'all' || l.type === filterType;
      const matchSearch = l.title.toLowerCase().includes(searchQuery.toLowerCase()) || l.industry.toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchSearch;
  });

  const featuredListings = MOCK_LISTINGS.filter(l => l.isFeatured);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Hero Header */}
      <div className="bg-slate-900 text-white pt-20 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 text-purple-300 px-3 py-1 rounded-full text-xs font-bold mb-6">
                <Gem size={14}/> INVESTMENT BANKING PLATFORM
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
                Buy, Sell & Invest in <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Privately Held Businesses</span>
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-10">
                Connect with verified business owners, franchisors, and investors globally. 
                Secure data rooms, NDA protection, and AI-driven deal matching.
            </p>
            
            <div className="bg-white p-2 rounded-full max-w-2xl mx-auto shadow-2xl flex">
                <div className="flex-1 flex items-center px-4 border-r border-gray-200">
                    <Search className="text-gray-400" size={20}/>
                    <input 
                        type="text" 
                        placeholder="Search industries, locations..." 
                        className="w-full p-3 outline-none text-slate-800 placeholder:text-slate-400"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 rounded-full font-bold transition-colors">
                    Search Deals
                </button>
            </div>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="bg-white border-b border-gray-200">
         <div className="container mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
             <div>
                 <div className="text-3xl font-bold text-slate-800">12k+</div>
                 <div className="text-xs text-gray-500 uppercase tracking-wider">Active Investors</div>
             </div>
             <div>
                 <div className="text-3xl font-bold text-slate-800">$2.4B</div>
                 <div className="text-xs text-gray-500 uppercase tracking-wider">Deal Value</div>
             </div>
             <div>
                 <div className="text-3xl font-bold text-slate-800">140+</div>
                 <div className="text-xs text-gray-500 uppercase tracking-wider">Countries</div>
             </div>
             <div>
                 <div className="text-3xl font-bold text-slate-800">24h</div>
                 <div className="text-xs text-gray-500 uppercase tracking-wider">Avg Response</div>
             </div>
         </div>
      </div>

      {/* How it Works Section */}
        <div className="py-16 bg-white border-b border-gray-100">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">A Secure Process for High-Value Deals</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center text-2xl font-bold mb-4">1</div>
                        <h3 className="font-bold text-slate-800 mb-2">Browse & Inquire</h3>
                        <p className="text-sm text-slate-500">Explore blind profiles and send confidential inquiries.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center text-2xl font-bold mb-4">2</div>
                        <h3 className="font-bold text-slate-800 mb-2">Sign Digital NDA</h3>
                        <p className="text-sm text-slate-500">Execute a legally binding non-disclosure agreement on-platform.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center text-2xl font-bold mb-4">3</div>
                        <h3 className="font-bold text-slate-800 mb-2">Access Data Room</h3>
                        <p className="text-sm text-slate-500">Review verified financials and operational documents.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center text-2xl font-bold mb-4">4</div>
                        <h3 className="font-bold text-slate-800 mb-2">Make Offer</h3>
                        <p className="text-sm text-slate-500">Submit offers and negotiate terms through our secure portal.</p>
                    </div>
                </div>
            </div>
        </div>

      {/* Featured Section */}
      <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-2">
              <Sparkles className="text-yellow-500" fill="currentColor"/> Featured Opportunities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {featuredListings.map(listing => (
                  <div key={listing.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col md:flex-row group hover:shadow-xl transition-all">
                      <div className="md:w-2/5 relative overflow-hidden">
                          <img src={listing.image} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
                          <div className="absolute top-4 left-4 bg-yellow-400 text-slate-900 text-xs font-bold px-3 py-1 rounded shadow-sm">
                              Featured
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6 md:hidden">
                             <div className="text-white font-bold">{listing.title}</div>
                          </div>
                      </div>
                      <div className="p-6 md:w-3/5 flex flex-col">
                          <div className="mb-4">
                              <div className="flex justify-between items-start mb-2">
                                  <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded uppercase tracking-wider">{listing.type.replace('_', ' ')}</span>
                                  <span className="text-xs text-slate-400 flex items-center gap-1"><Clock size={12}/> {listing.postedDate}</span>
                              </div>
                              <h3 className="text-xl font-bold text-slate-800 leading-tight mb-2 group-hover:text-purple-600 transition-colors">{listing.title}</h3>
                              <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                                  <Globe size={14}/> {listing.location} <span className="text-slate-300">|</span> <Building size={14}/> {listing.industry}
                              </div>
                              <p className="text-sm text-slate-600 line-clamp-2 mb-4">{listing.description}</p>
                          </div>
                          
                          <div className="mt-auto pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                              <div>
                                  <div className="text-xs text-slate-400 uppercase">Revenue</div>
                                  <div className="font-bold text-slate-800 text-lg">${(listing.reportedRevenue/1000000).toFixed(1)}M</div>
                              </div>
                              <div>
                                  <div className="text-xs text-slate-400 uppercase">EBITDA</div>
                                  <div className="font-bold text-green-600 text-lg">${(listing.ebitda/1000).toFixed(0)}k</div>
                              </div>
                          </div>
                          <button className="w-full mt-4 bg-slate-900 text-white py-2 rounded-lg font-bold hover:bg-slate-800 transition-colors">
                              View Teaser
                          </button>
                      </div>
                  </div>
              ))}
          </div>
      </div>

      {/* Main Listings */}
      <div className="bg-white py-12 border-t border-gray-100">
          <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                  <h2 className="text-2xl font-bold text-slate-800">Latest Listings</h2>
                  <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                      {['all', 'business_sale', 'franchise', 'investment'].map(type => (
                          <button 
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-4 py-2 rounded-md text-sm font-bold capitalize transition-all ${filterType === type ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                          >
                              {type.replace('_', ' ')}
                          </button>
                      ))}
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredListings.map(listing => (
                      <div key={listing.id} className="border border-gray-200 rounded-xl hover:shadow-lg transition-all bg-white group">
                          <div className="h-48 overflow-hidden relative rounded-t-xl">
                               <img src={listing.image} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                               <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-slate-800 text-xs font-bold px-2 py-1 rounded flex items-center gap-1 shadow-sm">
                                   <Lock size={12}/> Blind Profile
                               </div>
                          </div>
                          <div className="p-6">
                              <div className="flex items-center gap-2 mb-2">
                                  <span className="text-[10px] font-bold uppercase text-slate-500 border border-slate-200 px-2 py-0.5 rounded">{listing.industry}</span>
                                  <span className="text-[10px] font-bold uppercase text-slate-500 border border-slate-200 px-2 py-0.5 rounded">{listing.location}</span>
                              </div>
                              <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-1 group-hover:text-purple-600 transition-colors">{listing.title}</h3>
                              
                              <div className="grid grid-cols-2 gap-y-2 mb-4 text-sm">
                                  <div>
                                      <span className="text-slate-400 text-xs block">Asking Price</span>
                                      <span className="font-bold text-slate-800">${listing.askingPrice.toLocaleString()}</span>
                                  </div>
                                  <div>
                                      <span className="text-slate-400 text-xs block">Revenue</span>
                                      <span className="font-bold text-slate-800">${listing.reportedRevenue.toLocaleString()}</span>
                                  </div>
                              </div>
                              
                              <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                                  <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded font-bold text-sm transition-colors flex items-center justify-center gap-2">
                                      <UserCheck size={16}/> Connect
                                  </button>
                                  <button className="px-3 py-2 border border-gray-200 rounded hover:bg-gray-50 text-slate-600">
                                      <MessageSquare size={18}/>
                                  </button>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>
    </div>
  );
};

export default InvestPage;