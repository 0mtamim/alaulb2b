
import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';
import { Package, Globe, Factory, Zap, ChevronRight, ShieldCheck, Box, Filter, Search, Star, MapPin, X, Gem, TrendingUp, DollarSign, Store, Calendar, Briefcase, Clock, Building2, PlayCircle, Timer, TrendingDown, ArrowRight, Anchor, Hammer, Droplets, Cpu, Shirt, Sparkles, LayoutGrid, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useModules } from '../contexts/ModuleContext';

// Mock Data with extended fields
const PRODUCTS: Product[] = [
  { id: '1', title: 'Industrial Heavy Duty Hydraulic Pump 5000 PSI', description: '', priceRange: '$120.00 - $150.00', price: 120, moq: 10, image: 'https://picsum.photos/400/400?random=1', category: 'Machinery', rating: 4.8, supplierId: 's1', specifications: {}, origin: 'China', supplierVerified: true, supplierBusinessType: 'Manufacturer', views: 1200, inquiries: 45 },
  { id: '2', title: 'Custom Printed Bio-degradable Coffee Packaging Bags', description: '', priceRange: '$0.05 - $0.12', price: 0.05, moq: 5000, image: 'https://picsum.photos/400/400?random=2', category: 'Packaging', rating: 4.9, supplierId: 's2', specifications: {}, origin: 'Vietnam', supplierVerified: true, supplierBusinessType: 'Manufacturer', views: 3500, inquiries: 120 },
  { id: '3', title: 'Smart Warehouse IoT Sensor Modules Long Range', description: '', priceRange: '$15.00 - $22.00', price: 15, moq: 100, image: 'https://picsum.photos/400/400?random=3', category: 'Electronics', rating: 4.5, supplierId: 's3', specifications: {}, origin: 'Taiwan', supplierVerified: false, supplierBusinessType: 'Trading Company', views: 800, inquiries: 20 },
  { id: '4', title: 'High Tensile Steel Construction Beam H-Shape', description: '', priceRange: '$500.00 - $800.00', price: 500, moq: 5, image: 'https://picsum.photos/400/400?random=4', category: 'Construction', rating: 4.7, supplierId: 's4', specifications: {}, origin: 'China', supplierVerified: true, supplierBusinessType: 'Manufacturer', views: 1500, inquiries: 55 },
  { id: '5', title: 'Organic Cotton Fabric Roll Textiles Wholesale', description: '', priceRange: '$3.50 - $5.00', price: 3.5, moq: 500, image: 'https://picsum.photos/400/400?random=5', category: 'Textiles', rating: 4.6, supplierId: 's5', specifications: {}, origin: 'India', supplierVerified: true, supplierBusinessType: 'Trading Company', views: 2200, inquiries: 80 },
  { id: '6', title: 'Automated CNC Milling Machine 5-Axis', description: '', priceRange: '$25,000 - $32,000', price: 25000, moq: 1, image: 'https://picsum.photos/400/400?random=6', category: 'Machinery', rating: 5.0, supplierId: 's6', specifications: {}, origin: 'Germany', supplierVerified: true, supplierBusinessType: 'Manufacturer', views: 950, inquiries: 30 },
  { id: '7', title: 'Solar Panel Monocrystalline 450W', description: '', priceRange: '$80.00 - $110.00', price: 80, moq: 200, image: 'https://picsum.photos/400/400?random=7', category: 'Energy', rating: 4.8, supplierId: 's7', specifications: {}, origin: 'China', supplierVerified: false, supplierBusinessType: 'Trading Company', views: 1800, inquiries: 70 },
  { id: '8', title: 'Commercial Grade Restaurant Kitchen Mixer', description: '', priceRange: '$400.00 - $600.00', price: 400, moq: 5, image: 'https://picsum.photos/400/400?random=8', category: 'Equipment', rating: 4.7, supplierId: 's8', specifications: {}, origin: 'Italy', supplierVerified: true, supplierBusinessType: 'Manufacturer', views: 600, inquiries: 15 },
];

// Expanded Industry Categories
const INDUSTRY_HUBS = [
  { name: 'Machinery', icon: Factory, sub: ['CNC', 'Hydraulics'] },
  { name: 'Electronics', icon: Cpu, sub: ['IoT', 'Components'] },
  { name: 'Apparel', icon: Shirt, sub: ['Fabric', 'Garments'] },
  { name: 'Packaging', icon: Box, sub: ['Paper', 'Bottles'] },
  { name: 'Construction', icon: Hammer, sub: ['Steel', 'Tools'] },
  { name: 'Chemicals', icon: Droplets, sub: ['Resin', 'Plastics'] },
  { name: 'Energy', icon: Zap, sub: ['Solar', 'Batteries'] },
  { name: 'Logistics', icon: Anchor, sub: ['Containers', 'Pallets'] },
];

const REGIONS = [
    { name: 'China', image: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&w=400&q=80', label: 'Manufacturing Hub' },
    { name: 'Vietnam', image: 'https://images.unsplash.com/photo-1557750255-c76072a7bb19?auto=format&fit=crop&w=400&q=80', label: 'Textiles & Wood' },
    { name: 'Germany', image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=400&q=80', label: 'Precision Eng.' },
    { name: 'USA', image: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=400&q=80', label: 'Tech & Innovation' },
];

const Home: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const { modules } = useModules();
  const [searchParams, setSearchParams] = useSearchParams();

  // Derived State (Source of Truth is URL)
  const activeCategory = searchParams.get('category');
  const urlSearchQuery = searchParams.get('q') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const maxMoq = searchParams.get('maxMoq') || '';
  const minRating = Number(searchParams.get('minRating')) || 0;
  const origin = searchParams.get('origin') || '';
  const businessTypes = searchParams.get('businessType') ? searchParams.get('businessType')!.split(',') : [];
  const sortBy = searchParams.get('sort') || 'best-match';
  const verifiedOnly = searchParams.get('verified') === 'true';

  // Local state for search input and filter inputs
  const [localSearch, setLocalSearch] = useState(urlSearchQuery);
  const [priceMinInput, setPriceMinInput] = useState(minPrice);
  const [priceMaxInput, setPriceMaxInput] = useState(maxPrice);
  const [moqInput, setMoqInput] = useState(maxMoq);

  useEffect(() => {
    setLocalSearch(urlSearchQuery);
  }, [urlSearchQuery]);

  // Sync local filter states when URL params change
  useEffect(() => {
    setPriceMinInput(minPrice);
    setPriceMaxInput(maxPrice);
    setMoqInput(maxMoq);
  }, [minPrice, maxPrice, maxMoq]);

  const updateParam = (key: string, value: string | null) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
      return newParams;
    });
  };

  const handlePriceApply = () => {
    updateParam('minPrice', priceMinInput);
    updateParam('maxPrice', priceMaxInput);
  };

  const handleMoqApply = () => {
    updateParam('maxMoq', moqInput);
  };

  const handleSearchSubmit = () => {
    updateParam('q', localSearch.trim() || null);
  };

  const handleBusinessTypeChange = (type: string, checked: boolean) => {
    const current = new Set(businessTypes);
    if (checked) current.add(type);
    else current.delete(type);
    
    const newVal = Array.from(current).join(',');
    updateParam('businessType', newVal.length > 0 ? newVal : null);
  };

  const clearFilters = () => {
    setSearchParams({});
    setLocalSearch('');
    setPriceMinInput('');
    setPriceMaxInput('');
    setMoqInput('');
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchCategory = activeCategory ? p.category === activeCategory : true;
      const matchSearch = p.title.toLowerCase().includes(urlSearchQuery.toLowerCase());
      const matchMinPrice = minPrice ? p.price >= Number(minPrice) : true;
      const matchMaxPrice = maxPrice ? p.price <= Number(maxPrice) : true;
      const matchMoq = maxMoq ? p.moq <= Number(maxMoq) : true;
      const matchRating = minRating ? p.rating >= minRating : true;
      const matchOrigin = origin ? p.origin === origin : true;
      const matchBusinessType = businessTypes.length > 0 ? (p.supplierBusinessType && businessTypes.includes(p.supplierBusinessType)) : true;
      const matchVerified = verifiedOnly ? p.supplierVerified : true;
      
      return matchCategory && matchSearch && matchMinPrice && matchMaxPrice && matchMoq && matchRating && matchOrigin && matchBusinessType && matchVerified;
    });
  }, [activeCategory, urlSearchQuery, minPrice, maxPrice, maxMoq, minRating, origin, businessTypes, verifiedOnly]);

  const sortedProducts = useMemo(() => {
    let products = [...filteredProducts];
    switch (sortBy) {
      case 'price-asc': return products.sort((a, b) => a.price - b.price);
      case 'price-desc': return products.sort((a, b) => b.price - a.price);
      case 'moq-asc': return products.sort((a, b) => a.moq - b.moq);
      case 'popularity': return products.sort((a, b) => (b.views || 0) - (a.views || 0));
      default: return products;
    }
  }, [filteredProducts, sortBy]);

  const countries = Array.from(new Set(PRODUCTS.map(p => p.origin))).sort();

  // Helper Component for Horizontal Scrolling Sections
  const HorizontalScrollSection = ({ title, subtitle, items, linkText, linkTo, icon: Icon, iconColor, darkMode = false }: any) => (
    <div className="py-6">
        <div className="flex justify-between items-end mb-6 px-1">
            <div>
                <h2 className={`text-xl md:text-2xl font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                    {Icon && <Icon className={iconColor} size={24}/>}
                    {title}
                </h2>
                {subtitle && <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>{subtitle}</p>}
            </div>
            {linkText && (
                <button className={`text-sm font-bold flex items-center gap-1 transition-colors group ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
                    {linkText} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
                </button>
            )}
        </div>
        
        <div className="relative group/scroll">
            <div className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory no-scrollbar scroll-smooth px-1">
                {items.map((product: Product) => (
                    <div key={product.id} className="min-w-[200px] w-[200px] md:min-w-[240px] md:w-[240px] snap-start">
                        <ProductCard product={product} variant="compact" />
                    </div>
                ))}
            </div>
            {/* Fade effect on right */}
            <div className={`absolute right-0 top-0 bottom-6 w-16 bg-gradient-to-l pointer-events-none md:block hidden ${darkMode ? 'from-slate-900 via-slate-900/50 to-transparent' : 'from-white/90 to-transparent'}`}></div>
        </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Ticker Bar */}
      <div className="bg-slate-950 text-slate-400 text-xs py-2 overflow-hidden whitespace-nowrap border-b border-slate-800">
          <div className="inline-block animate-marquee pl-10">
              <span className="mx-6"><span className="text-green-500">▲</span> Copper Index: $8,420 (+1.2%)</span>
              <span className="mx-6"><span className="text-red-500">▼</span> Cotton Futures: $84.20 (-0.5%)</span>
              <span className="mx-6"><span className="text-green-500">▲</span> Brent Crude: $82.10 (+0.8%)</span>
              <span className="mx-6"><span className="text-green-500">▲</span> Shipping Rate (CN-US): $1,450 (+2.1%)</span>
              <span className="mx-6 text-orange-400">★ Trending: Sustainable Packaging, Li-Ion Batteries, Solar Components</span>
          </div>
      </div>

      {/* Hero Section */}
      <div className="bg-slate-900 text-white relative overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'} w-1/2 h-full bg-gradient-to-l from-slate-800 to-transparent opacity-50`}></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-24 right-24 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

        <div className="container mx-auto px-4 py-20 relative z-10 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <div className="inline-flex items-center gap-2 bg-slate-800/50 border border-slate-700 backdrop-blur-sm text-xs font-bold px-3 py-1.5 rounded-full mb-6 text-orange-400">
              <Zap size={12} fill="currentColor"/> NEXT-GEN B2B COMMERCE
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
              {t('hero_title')}
            </h1>
            <p className="text-slate-300 text-lg mb-8 max-w-xl leading-relaxed">
              {t('hero_subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/dashboard" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-bold transition-all shadow-lg hover:shadow-orange-500/25 flex items-center justify-center gap-2">
                {t('btn_launch')} <ChevronRight size={18} className={isRTL ? 'rotate-180' : ''}/>
              </Link>
              <Link to="/rfq" className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-lg font-bold transition-all border border-slate-700 flex items-center justify-center gap-2">
                {t('btn_post_rfq')}
              </Link>
            </div>
            
            <div className="mt-12 flex items-center gap-6 text-slate-400 text-sm font-medium">
               <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-green-500"/> {t('verified_suppliers')}</div>
               <div className="flex items-center gap-2"><Globe size={16} className="text-blue-500"/> {t('countries')}</div>
               <div className="flex items-center gap-2"><Zap size={16} className="text-yellow-500"/> {t('ai_powered')}</div>
            </div>
          </div>
          
          {/* 3D-like Dashboard Preview Card */}
          <div className="md:w-5/12 perspective-1000 hidden lg:block">
            <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 shadow-2xl transform rotate-y-12 hover:rotate-y-0 transition-transform duration-700 ease-out">
               <div className="flex justify-between items-center mb-6 border-b border-slate-700/50 pb-4">
                  <div className="flex gap-2">
                     <div className="w-3 h-3 rounded-full bg-red-500"></div>
                     <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                     <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-xs font-mono text-slate-400">TradeGenius Intelligence Hub</div>
               </div>
               
               <div className="space-y-4">
                  <div className="flex gap-4">
                     <div className="flex-1 bg-slate-700/50 rounded p-3">
                        <div className="text-xs text-slate-400 mb-1">Market Trend</div>
                        <div className="text-green-400 font-bold text-lg">+24.5%</div>
                     </div>
                     <div className="flex-1 bg-slate-700/50 rounded p-3">
                        <div className="text-xs text-slate-400 mb-1">Active Leads</div>
                        <div className="text-white font-bold text-lg">1,240</div>
                     </div>
                  </div>
                  <div className="bg-slate-700/30 rounded h-32 flex items-center justify-center text-slate-500 border border-slate-700/50 border-dashed">
                     AI Prediction Chart Visualization
                  </div>
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded p-3 flex items-center gap-3">
                     <div className="bg-orange-500 rounded-full p-1.5"><Zap size={14} className="text-white"/></div>
                     <div>
                        <div className="text-xs text-orange-200 font-bold">Smart Recommendation</div>
                        <div className="text-xs text-slate-300">Stock up on "Li-Ion Batteries" before Q4 spike.</div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Indicators Bar */}
      <div className="bg-white border-b border-gray-200 py-6">
          <div className="container mx-auto px-4 flex flex-wrap justify-center md:justify-between items-center gap-6 text-slate-500 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-default">
              <div className="flex items-center gap-2 font-bold text-lg"><ShieldCheck size={24}/> Secure Payments</div>
              <div className="flex items-center gap-2 font-bold text-lg"><Globe size={24}/> Global Logistics</div>
              <div className="flex items-center gap-2 font-bold text-lg"><CheckCircle size={24}/> Verified Sellers</div>
              <div className="flex items-center gap-2 font-bold text-lg"><Zap size={24}/> AI Matching</div>
          </div>
      </div>

      {/* Main Content Container */}
      <div className="space-y-16 pb-12 relative z-20 mt-12">
        
        {/* Source by Industry Cards */}
        <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Source by Industry</h2>
                    <p className="text-slate-500 mt-2">Explore top manufacturing hubs and specialized sectors.</p>
                </div>
                <Link to="/categories" className="text-blue-600 font-bold hover:underline flex items-center gap-1">View All Categories <ArrowRight size={16}/></Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                {INDUSTRY_HUBS.map((cat, idx) => (
                <div 
                    key={idx} 
                    className={`
                        group relative flex flex-col items-center justify-center p-6 rounded-2xl cursor-pointer transition-all duration-300
                        border border-gray-100 bg-white hover:shadow-xl hover:-translate-y-1 overflow-hidden
                        ${activeCategory === cat.name ? 'ring-2 ring-orange-500 shadow-orange-200' : ''}
                    `}
                    onClick={() => updateParam('category', activeCategory === cat.name ? null : cat.name)}
                >
                    {/* Hover Decoration */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className={`relative z-10 p-3 rounded-full mb-3 transition-colors duration-300 ${activeCategory === cat.name ? 'bg-orange-500 text-white' : 'bg-slate-50 text-slate-600 group-hover:bg-white group-hover:text-orange-600 group-hover:shadow-sm'}`}>
                        <cat.icon size={24} strokeWidth={1.5}/>
                    </div>
                    <span className="relative z-10 text-xs font-bold text-center leading-tight text-slate-700 group-hover:text-slate-900">{cat.name}</span>
                </div>
                ))}
            </div>
        </div>

        {/* AI Recommendations - Dark Theme Carousel */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-16 text-white overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
                <div className="absolute top-[-50%] left-[-10%] w-[50%] h-[150%] bg-blue-500 blur-[100px] rounded-full mix-blend-screen animate-pulse"></div>
                <div className="absolute bottom-[-50%] right-[-10%] w-[50%] h-[150%] bg-purple-500 blur-[100px] rounded-full mix-blend-screen animate-pulse delay-1000"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-blue-300 mb-3">
                            <Sparkles size={12}/> AI PERSONALIZED
                        </div>
                        <h2 className="text-3xl font-bold">Curated for Your Business</h2>
                        <p className="text-slate-400 mt-2 max-w-xl">
                            Based on your browsing history, these high-potential suppliers match your sourcing criteria.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold transition-colors">Trending</button>
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-blue-500/30">For You</button>
                    </div>
                </div>

                {/* Horizontal Scroll Containers */}
                <div className="space-y-12">
                    <HorizontalScrollSection 
                        title="High-Demand Machinery"
                        subtitle="Verified manufacturers with >98% on-time delivery."
                        items={PRODUCTS.filter(p => p.category === 'Machinery')}
                        linkText="View All Machinery"
                        icon={Factory}
                        iconColor="text-blue-400"
                        darkMode={true}
                    />
                    
                    <HorizontalScrollSection 
                        title="Electronics & Components"
                        subtitle="Trending IoT modules and smart sensors for Q4."
                        items={PRODUCTS.filter(p => p.category === 'Electronics' || p.category === 'Energy')}
                        linkText="See Electronics Trends"
                        icon={Cpu}
                        iconColor="text-purple-400"
                        darkMode={true}
                    />
                </div>
            </div>
        </div>

        {/* Super Deals */}
        <div className="container mx-auto px-4">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/4 bg-gradient-to-br from-red-600 to-red-700 p-8 text-white flex flex-col justify-center items-start relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2 bg-red-800/50 px-3 py-1 rounded-full text-xs font-bold border border-red-500/50 animate-pulse">
                                <Timer size={14}/> Flash Deals
                            </div>
                            <h3 className="text-3xl font-extrabold mb-4">Super Deals</h3>
                            <p className="mb-6 opacity-90 text-sm">Up to 60% off on bulk orders. Offers expire soon.</p>
                            <div className="flex gap-2 text-red-600 font-bold font-mono">
                                <div className="bg-white px-3 py-2 rounded text-lg shadow-lg">04</div>
                                <div className="text-white py-2 text-lg">:</div>
                                <div className="bg-white px-3 py-2 rounded text-lg shadow-lg">12</div>
                                <div className="text-white py-2 text-lg">:</div>
                                <div className="bg-white px-3 py-2 rounded text-lg shadow-lg">45</div>
                            </div>
                        </div>
                    </div>
                    <div className="md:w-3/4 p-6 bg-slate-50">
                        <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar">
                            {PRODUCTS.slice(0, 4).map(p => (
                                <Link to={`/product/${p.id}`} key={p.id} className="min-w-[180px] w-[180px] snap-start group cursor-pointer block relative">
                                    <div className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 mb-3 bg-white shadow-sm hover:shadow-md transition-all">
                                        <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                                        <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">-15%</span>
                                    </div>
                                    <div className="text-sm font-bold text-slate-800 truncate mb-1 group-hover:text-red-600 transition-colors">{p.title}</div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-red-600 text-lg">${(p.price * 0.85).toFixed(2)}</span>
                                        <span className="text-xs text-gray-400 line-through">${p.price}</span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">{p.moq} Min. Order</div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Source by Region */}
        <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <Globe className="text-blue-600" /> Source by Region
                </h2>
                <button className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1">View All Markets <ArrowRight size={14}/></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {REGIONS.map((region, idx) => (
                    <div key={idx} className="relative h-48 rounded-2xl overflow-hidden cursor-pointer group hover:shadow-xl transition-all border border-gray-100">
                        <img src={region.image} alt={region.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 text-white">
                            <h3 className="font-bold text-lg">{region.name}</h3>
                            <p className="text-xs text-gray-300 font-medium bg-white/20 backdrop-blur-md px-2 py-0.5 rounded w-fit mt-1">{region.label}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Featured Franchise Stores */}
        {modules.franchise && (
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <Store className="text-orange-500" /> Featured Franchise Stores
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">Shop directly from authorized local partners with ready stock.</p>
                    </div>
                    <Link to="/franchise/fp1" className="text-sm font-bold text-blue-600 hover:underline">View All Partners</Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex hover:shadow-lg transition-all group">
                        <div className="w-1/3 relative">
                            <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Store"/>
                            <div className="absolute top-2 left-2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded">
                                UAE Region
                            </div>
                        </div>
                        <div className="w-2/3 p-5 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-slate-800">Dubai Tech Hub</h3>
                                    <div className="flex items-center gap-1 text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded">
                                        <Star size={10} fill="currentColor"/> 4.9
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 line-clamp-2 mb-3">Premier distributor of consumer electronics and smart home devices in the MENA region.</p>
                                <div className="flex gap-2 text-xs text-slate-600 font-medium">
                                    <span className="bg-gray-100 px-2 py-1 rounded flex items-center gap-1"><Package size={12}/> Ready Stock</span>
                                    <span className="bg-gray-100 px-2 py-1 rounded flex items-center gap-1"><ShieldCheck size={12}/> Authorized</span>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                                <span className="text-xs text-gray-400">Joined Jan 2023</span>
                                <Link to="/franchise/fp1" className="text-sm font-bold text-slate-900 hover:text-orange-500 flex items-center gap-1 transition-colors">
                                    Visit Store <ChevronRight size={14}/>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex hover:shadow-lg transition-all group">
                        <div className="w-1/3 relative">
                            <img src="https://images.unsplash.com/photo-1556740758-90de2929450a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Store"/>
                            <div className="absolute top-2 left-2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded">
                                Europe
                            </div>
                        </div>
                        <div className="w-2/3 p-5 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-slate-800">Berlin Trade Post</h3>
                                    <div className="flex items-center gap-1 text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded">
                                        <Star size={10} fill="currentColor"/> 4.8
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 line-clamp-2 mb-3">Specialized in industrial machinery parts and automotive components serving the DACH region.</p>
                                <div className="flex gap-2 text-xs text-slate-600 font-medium">
                                    <span className="bg-gray-100 px-2 py-1 rounded flex items-center gap-1"><Package size={12}/> Bulk Only</span>
                                    <span className="bg-gray-100 px-2 py-1 rounded flex items-center gap-1"><ShieldCheck size={12}/> Verified</span>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                                <span className="text-xs text-gray-400">Joined Mar 2023</span>
                                <Link to="/franchise/fp2" className="text-sm font-bold text-slate-900 hover:text-orange-500 flex items-center gap-1 transition-colors">
                                    Visit Store <ChevronRight size={14}/>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Product Grid with Filters */}
        <div className="container mx-auto px-4 mb-8" id="products-section">
            <div className="flex justify-between items-end mb-6">
                 <div>
                    <h2 className="text-2xl font-bold text-slate-800">More Products</h2>
                    <p className="text-gray-500 text-sm mt-1">Discover items matching your criteria.</p>
                 </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <div className="lg:w-1/4">
                    <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
                        <div className="flex items-center gap-2 font-bold text-slate-800 mb-6 pb-4 border-b border-gray-100">
                            <Filter size={20}/> Filters
                            {(minPrice || maxPrice || maxMoq || minRating > 0 || verifiedOnly || origin || businessTypes.length > 0) && (
                                <button onClick={clearFilters} className="text-xs text-red-500 font-normal ml-auto hover:underline">Clear All</button>
                            )}
                        </div>

                        {/* Supplier Features */}
                        <div className="mb-6">
                            <h4 className="text-sm font-bold text-slate-700 mb-3">Supplier Features</h4>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={verifiedOnly}
                                        onChange={(e) => updateParam('verified', e.target.checked ? 'true' : null)}
                                        className="rounded text-orange-500 focus:ring-orange-500"
                                    />
                                    <span className="text-sm text-slate-600 flex items-center gap-1">
                                        <ShieldCheck size={14} className="text-orange-500"/> Verified Supplier
                                    </span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={businessTypes.includes('Manufacturer')}
                                        onChange={(e) => handleBusinessTypeChange('Manufacturer', e.target.checked)}
                                        className="rounded text-orange-500 focus:ring-orange-500"
                                    />
                                    <span className="text-sm text-slate-600">Manufacturer</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={businessTypes.includes('Trading Company')}
                                        onChange={(e) => handleBusinessTypeChange('Trading Company', e.target.checked)}
                                        className="rounded text-orange-500 focus:ring-orange-500"
                                    />
                                    <span className="text-sm text-slate-600">Trading Company</span>
                                </label>
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="mb-6">
                            <h4 className="text-sm font-bold text-slate-700 mb-3">Price Range</h4>
                            <div className="flex items-center gap-2 mb-2">
                                <input 
                                    type="number" 
                                    placeholder="Min"
                                    value={priceMinInput}
                                    onChange={(e) => setPriceMinInput(e.target.value)}
                                    className="w-full p-2 border border-gray-200 rounded text-sm outline-none focus:border-orange-500"
                                />
                                <span className="text-gray-400">-</span>
                                <input 
                                    type="number" 
                                    placeholder="Max"
                                    value={priceMaxInput}
                                    onChange={(e) => setPriceMaxInput(e.target.value)}
                                    className="w-full p-2 border border-gray-200 rounded text-sm outline-none focus:border-orange-500"
                                />
                            </div>
                            <button onClick={handlePriceApply} className="w-full bg-slate-100 text-slate-600 text-xs font-bold py-1.5 rounded hover:bg-slate-200">Apply Price</button>
                        </div>

                        {/* MOQ */}
                        <div className="mb-6">
                            <h4 className="text-sm font-bold text-slate-700 mb-3">Min. Order (MOQ)</h4>
                            <div className="flex gap-2">
                                <input 
                                    type="number" 
                                    placeholder="Less than..."
                                    value={moqInput}
                                    onChange={(e) => setMoqInput(e.target.value)}
                                    className="flex-1 p-2 border border-gray-200 rounded text-sm outline-none focus:border-orange-500"
                                />
                                <button onClick={handleMoqApply} className="bg-slate-100 text-slate-600 text-xs font-bold px-3 rounded hover:bg-slate-200">OK</button>
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="mb-6">
                            <h4 className="text-sm font-bold text-slate-700 mb-3">Supplier Rating</h4>
                            <div className="space-y-2">
                                {[5, 4, 3].map(r => (
                                    <div 
                                        key={r} 
                                        onClick={() => updateParam('minRating', String(r))}
                                        className={`flex items-center gap-2 cursor-pointer text-sm ${minRating === r ? 'text-orange-600 font-bold bg-orange-50 p-1 rounded' : 'text-slate-600 hover:text-orange-500'}`}
                                    >
                                        <div className="flex text-orange-400 text-xs">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={12} fill={i < r ? "currentColor" : "none"} className={i < r ? "" : "text-gray-200"}/>
                                            ))}
                                        </div>
                                        <span>& Up</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Origin */}
                        <div>
                            <h4 className="text-sm font-bold text-slate-700 mb-3">Country of Origin</h4>
                            <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="origin" 
                                        checked={origin === ''}
                                        onChange={() => updateParam('origin', null)}
                                        className="text-orange-500 focus:ring-orange-500"
                                    />
                                    <span className="text-sm text-slate-600">All Countries</span>
                                </label>
                                {countries.map(c => (
                                    <label key={c} className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="origin" 
                                            checked={origin === c}
                                            onChange={() => updateParam('origin', c)}
                                            className="text-orange-500 focus:ring-orange-500"
                                        />
                                        <span className="text-sm text-slate-600">{c}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product List */}
                <div className="lg:w-3/4">
                    <div className="flex items-center justify-end mb-4">
                         <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                             <span>Sort by:</span>
                             <select 
                                value={sortBy} 
                                onChange={(e) => updateParam('sort', e.target.value)}
                                className="bg-transparent font-bold text-slate-700 focus:outline-none cursor-pointer"
                             >
                                 <option value="best-match">Best Match</option>
                                 <option value="price-asc">Price: Low to High</option>
                                 <option value="price-desc">Price: High to Low</option>
                                 <option value="moq-asc">Low MOQ</option>
                                 <option value="popularity">Popularity</option>
                             </select>
                         </div>
                    </div>

                    {sortedProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sortedProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                            <div className="inline-block p-4 rounded-full bg-gray-50 mb-4">
                                <Search size={32} className="text-gray-400"/>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">No products found</h3>
                            <p className="text-gray-500 mb-6">We couldn't find any matches for your filters.</p>
                            <button 
                                onClick={clearFilters}
                                className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-800 transition-colors"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
