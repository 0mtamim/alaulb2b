
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Star, MapPin, Award, CheckCircle, Search, Filter, Globe, Building2, TrendingUp, Zap, Briefcase } from 'lucide-react';
import { Supplier } from '../types';

// Mock data now including businessType
const SUPPLIERS: Supplier[] = [
  {
    id: 's1',
    name: 'Shenzhen Tech Industries',
    country: 'China',
    verified: true,
    yearsActive: 5,
    rating: 4.9, // Extended from type definition for this page
    reviews: 1240, // Extended
    mainProducts: ['IoT Sensors', 'Smart Home', 'PCB Assembly'],
    badges: ['Verified', 'Trade Assurance', '5 Years'], // UI helper
    responseRate: '98%',
    totalRevenue: '$50M - $100M', // UI helper
    isPromoted: true, // UI helper
    logo: 'ST',
    banner: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    businessType: ['Manufacturer', 'Trading Company']
  },
  {
    id: 's2',
    name: 'Vietnam Textile Group',
    country: 'Vietnam',
    verified: true,
    yearsActive: 8,
    rating: 4.7,
    reviews: 850,
    mainProducts: ['Cotton Fabric', 'Apparel', 'Yarn'],
    badges: ['Verified', 'Eco-Friendly'],
    responseRate: '92%',
    totalRevenue: '$10M - $50M',
    isPromoted: false,
    logo: 'VT',
    banner: 'https://images.unsplash.com/photo-1534643960519-11ad79bc19df?auto=format&fit=crop&w=800&q=80',
    businessType: ['Manufacturer']
  },
  {
    id: 's3',
    name: 'German Precision Engineering',
    country: 'Germany',
    verified: true,
    yearsActive: 15,
    rating: 5.0,
    reviews: 320,
    mainProducts: ['CNC Machinery', 'Auto Parts', 'Tools'],
    badges: ['Verified', 'ISO 9001', 'High Tech'],
    responseRate: '95%',
    totalRevenue: '$100M+',
    isPromoted: true,
    logo: 'GP',
    banner: 'https://images.unsplash.com/photo-1565514020176-dbf2277e3b6e?auto=format&fit=crop&w=800&q=80',
    businessType: ['Manufacturer']
  },
  {
    id: 's4',
    name: 'Mumbai Exporters Ltd',
    country: 'India',
    verified: true,
    yearsActive: 3,
    rating: 4.5,
    reviews: 500,
    mainProducts: ['Spices', 'Organic Chemicals', 'Leather'],
    badges: ['Verified', 'Trade Assurance'],
    responseRate: '88%',
    totalRevenue: '$5M - $10M',
    isPromoted: false,
    logo: 'ME',
    banner: 'https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?auto=format&fit=crop&w=800&q=80',
    businessType: ['Trading Company']
  }
];

const SuppliersPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [businessTypes, setBusinessTypes] = useState<string[]>([]);

  const handleBusinessTypeChange = (type: string) => {
    setBusinessTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const filteredSuppliers = SUPPLIERS.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.mainProducts.some((p: string) => p.toLowerCase().includes(search.toLowerCase()));
    const matchCountry = countryFilter ? s.country === countryFilter : true;
    
    // Check if supplier has ANY of the selected business types (OR logic)
    // If no filter selected, show all
    const matchType = businessTypes.length === 0 || s.businessType.some((bt: string) => businessTypes.includes(bt));

    return matchSearch && matchCountry && matchType;
  });

  const promotedSuppliers = SUPPLIERS.filter(s => s.isPromoted);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Promotion Carousel / Header */}
      <div className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8">
            <div>
                <h1 className="text-3xl font-extrabold mb-2 flex items-center gap-2">
                    <Award className="text-yellow-500" fill="currentColor"/> Verified Suppliers
                </h1>
                <p className="text-slate-400">Connect with top-rated manufacturers vetted by TradeGenius.</p>
            </div>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
                <div className="text-center">
                    <div className="text-2xl font-bold text-white">150k+</div>
                    <div className="text-xs text-slate-500 uppercase">Suppliers</div>
                </div>
                <div className="w-px h-8 bg-slate-700"></div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">24h</div>
                    <div className="text-xs text-slate-500 uppercase">Avg Response</div>
                </div>
            </div>
          </div>

          {/* Featured Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {promotedSuppliers.map(s => (
                <div key={s.id} className="bg-slate-800 rounded-xl p-1 overflow-hidden hover:bg-slate-700 transition-colors cursor-pointer border border-slate-700">
                    <div className="flex h-full">
                        <div className="w-1/3 relative overflow-hidden rounded-l-lg">
                            <img src={s.banner} alt={s.name} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"/>
                            <div className="absolute top-2 left-2 bg-yellow-500 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded">Featured</div>
                        </div>
                        <div className="w-2/3 p-4 flex flex-col justify-between">
                            <div>
                                <h3 className="font-bold text-lg text-white mb-1">{s.name}</h3>
                                <div className="text-xs text-slate-400 flex items-center gap-2 mb-2">
                                    <MapPin size={12}/> {s.country}
                                </div>
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {s.mainProducts.map((p: string, i: number) => (
                                        <span key={i} className="text-[10px] bg-slate-900 border border-slate-600 text-slate-300 px-2 py-0.5 rounded">{p}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <div className="flex items-center gap-1 text-xs font-bold text-orange-400">
                                    <Star size={12} fill="currentColor"/> {s.rating}
                                </div>
                                <button className="text-xs font-bold bg-white text-slate-900 px-3 py-1.5 rounded hover:bg-slate-200">View Profile</button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                    <Filter size={18}/> <span className="font-bold">Filters</span>
                </div>
                
                <div className="mb-6">
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Search</label>
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-2.5 text-gray-400"/>
                        <input 
                            type="text" 
                            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                            placeholder="Supplier or product..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Business Type Filter */}
                <div className="mb-6">
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block flex items-center gap-1"><Briefcase size={12}/> Business Type</label>
                    <div className="space-y-2">
                        {['Manufacturer', 'Trading Company'].map(type => (
                            <label key={type} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-blue-600">
                                <input 
                                    type="checkbox" 
                                    className="rounded text-blue-600 focus:ring-blue-500"
                                    checked={businessTypes.includes(type)}
                                    onChange={() => handleBusinessTypeChange(type)}
                                /> 
                                {type}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Region</label>
                    <select 
                        className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white"
                        value={countryFilter}
                        onChange={e => setCountryFilter(e.target.value)}
                    >
                        <option value="">All Regions</option>
                        <option value="China">China</option>
                        <option value="Vietnam">Vietnam</option>
                        <option value="Germany">Germany</option>
                        <option value="India">India</option>
                    </select>
                </div>

                <div className="mb-6">
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Certifications</label>
                    <div className="space-y-2">
                        {['ISO 9001', 'CE', 'RoHS', 'SA8000'].map(cert => (
                            <label key={cert} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                <input type="checkbox" className="rounded text-blue-600"/> {cert}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-2 font-bold text-blue-800 text-sm mb-1">
                        <ShieldCheck size={16}/> Trade Assurance
                    </div>
                    <p className="text-xs text-blue-600">Only show suppliers with payment protection.</p>
                    <div className="mt-2">
                        <label className="flex items-center gap-2 text-sm text-blue-900 font-bold cursor-pointer">
                            <input type="checkbox" className="rounded text-blue-600"/> Show only protected
                        </label>
                    </div>
                </div>
            </div>
        </div>

        {/* Suppliers List */}
        <div className="lg:w-3/4 space-y-6">
            {filteredSuppliers.map(s => (
                <div key={s.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-shrink-0 flex flex-col items-center">
                            <div className="w-20 h-20 bg-slate-900 text-white rounded-xl flex items-center justify-center text-2xl font-bold mb-3 border-4 border-gray-50">
                                {s.logo}
                            </div>
                            <div className="text-xs font-bold text-slate-500">{s.country}</div>
                        </div>
                        
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold text-slate-800 hover:text-blue-600 cursor-pointer transition-colors">
                                    <Link to={`/supplier/${s.id}`}>{s.name}</Link>
                                </h3>
                                <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-xs font-bold">
                                    <Star size={12} className="text-orange-500 fill-orange-500"/> {s.rating}
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                                {s.badges?.map((b: string, i: number) => (
                                    <span key={i} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-100 flex items-center gap-1">
                                        <CheckCircle size={10}/> {b}
                                    </span>
                                ))}
                                {/* Business Type Badges */}
                                {s.businessType.map((bt: string, i: number) => (
                                    <span key={`bt-${i}`} className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-100 flex items-center gap-1 font-bold">
                                        <Briefcase size={10}/> {bt}
                                    </span>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 bg-gray-50 p-4 rounded-lg text-sm">
                                <div>
                                    <div className="text-slate-400 text-xs uppercase font-bold">Main Products</div>
                                    <div className="font-medium text-slate-700 truncate">{s.mainProducts.join(', ')}</div>
                                </div>
                                <div>
                                    <div className="text-slate-400 text-xs uppercase font-bold">Total Revenue</div>
                                    <div className="font-medium text-slate-700">{s.totalRevenue}</div>
                                </div>
                                <div>
                                    <div className="text-slate-400 text-xs uppercase font-bold">Response</div>
                                    <div className="font-medium text-slate-700">{s.responseRate}</div>
                                </div>
                                <div>
                                    <div className="text-slate-400 text-xs uppercase font-bold">Transactions</div>
                                    <div className="font-medium text-slate-700">{s.reviews}+</div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3">
                                <Link to={`/supplier/${s.id}`} className="px-4 py-2 text-sm font-bold text-slate-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                    View Products
                                </Link>
                                <button className="px-6 py-2 text-sm font-bold text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors shadow-sm">
                                    Contact Supplier
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            
            {filteredSuppliers.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                    <Search size={48} className="mx-auto text-gray-300 mb-4"/>
                    <h3 className="text-lg font-bold text-slate-700">No suppliers found</h3>
                    <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default SuppliersPage;
