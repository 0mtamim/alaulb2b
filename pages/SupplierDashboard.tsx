
import React, { useState, useEffect, useRef } from 'react';
import { generateProductDescription, getMarketInsights } from '../services/gemini';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2, TrendingUp, Sparkles, AlertCircle, Globe, Plus, Trash2, Package, DollarSign, Image as ImageIcon, List, Save, Settings, FileText, Box, Layers, CheckCircle, Zap, Upload, X, Video } from 'lucide-react';
import { Product, PricingTier } from '../types';

const MARKET_CATEGORIES = [
  'Electronics', 'Machinery', 'Textiles', 'Packaging', 
  'Construction', 'Agriculture', 'Chemicals', 'Energy', 'Automotive', 'Beauty & Personal Care'
];

// Mock existing products for the list view
const MOCK_MY_PRODUCTS: Partial<Product>[] = [
    { id: 'p1', title: 'Industrial Hydraulic Pump 5000 PSI', price: 120, stock: 50, status: 'active', views: 1250 },
    { id: 'p2', title: 'Custom Packaging Box', price: 0.50, stock: 10000, status: 'active', views: 3400 },
    { id: 'p3', title: 'Solar Panel 450W', price: 85, stock: 0, status: 'out-of-stock', views: 900 },
];

const SupplierDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'add-product'>('overview');
  
  // --- Dashboard State ---
  const [category, setCategory] = useState(MARKET_CATEGORIES[0]);
  const [insights, setInsights] = useState<any>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  
  // --- Add Product Form State ---
  const [productForm, setProductForm] = useState({
      title: '',
      category: 'Electronics',
      moq: 10,
      basePrice: '',
      description: '',
      leadTime: '15 Days',
      packaging: 'Carton Box',
      supplyAbility: '10000 Units/Month',
      pricingTiers: [{ minQty: 10, maxQty: null, pricePerUnit: 0 }] as PricingTier[],
      specs: [{ key: 'Model Number', value: '' }, { key: 'Material', value: '' }] as {key: string, value: string}[],
      images: [] as string[],
      videoUrl: ''
  });
  const [loadingGen, setLoadingGen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock Chart Data
  const data = [
    { name: 'Mon', views: 4000, inquiries: 240 },
    { name: 'Tue', views: 3000, inquiries: 139 },
    { name: 'Wed', views: 2000, inquiries: 980 },
    { name: 'Thu', views: 2780, inquiries: 390 },
    { name: 'Fri', views: 1890, inquiries: 480 },
    { name: 'Sat', views: 2390, inquiries: 380 },
    { name: 'Sun', views: 3490, inquiries: 430 },
  ];

  useEffect(() => {
    handleGetInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGetInsights = async () => {
      setLoadingInsights(true);
      const res = await getMarketInsights(category);
      setInsights(res);
      setLoadingInsights(false);
  };

  // --- Form Handlers ---
  const handleGenerateDesc = async () => {
    if (!productForm.title) return;
    setLoadingGen(true);
    const desc = await generateProductDescription(`${productForm.title} - ${productForm.category}. Specs: ${productForm.specs.map(s => `${s.key}: ${s.value}`).join(', ')}`);
    setProductForm(prev => ({ ...prev, description: desc }));
    setLoadingGen(false);
  };

  const handleAddTier = () => {
      setProductForm(prev => ({
          ...prev,
          pricingTiers: [...prev.pricingTiers, { minQty: 0, maxQty: null, pricePerUnit: 0 }]
      }));
  };

  const handleRemoveTier = (index: number) => {
      const newTiers = [...productForm.pricingTiers];
      newTiers.splice(index, 1);
      setProductForm(prev => ({ ...prev, pricingTiers: newTiers }));
  };

  const handleTierChange = (index: number, field: keyof PricingTier, value: number | null) => {
      const newTiers = [...productForm.pricingTiers];
      newTiers[index] = { ...newTiers[index], [field]: value };
      setProductForm(prev => ({ ...prev, pricingTiers: newTiers }));
  };

  const handleAddSpec = () => {
      setProductForm(prev => ({
          ...prev,
          specs: [...prev.specs, { key: '', value: '' }]
      }));
  };

  const handleSpecChange = (index: number, field: 'key' | 'value', value: string) => {
      const newSpecs = [...productForm.specs];
      newSpecs[index] = { ...newSpecs[index], [field]: value };
      setProductForm(prev => ({ ...prev, specs: newSpecs }));
  };

  const handleRemoveSpec = (index: number) => {
      const newSpecs = [...productForm.specs];
      newSpecs.splice(index, 1);
      setProductForm(prev => ({ ...prev, specs: newSpecs }));
  };

  const handleSaveProduct = () => {
      alert("Product Submitted for Approval! It will appear in the listing once verified by Admin.");
      setActiveTab('products');
  };

  // --- Media Handlers ---
  const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          const files = Array.from(e.dataTransfer.files);
          const newImages = files.map((file: any) => URL.createObjectURL(file));
          setProductForm(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
      }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          const files = Array.from(e.target.files);
          const newImages = files.map((file: any) => URL.createObjectURL(file));
          setProductForm(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
      }
  };

  const removeImage = (index: number) => {
      setProductForm(prev => ({
          ...prev,
          images: prev.images.filter((_, i) => i !== index)
      }));
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 mb-8 sticky top-0 z-20 shadow-sm">
        <div className="flex justify-between items-center container mx-auto">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Supplier Workstation</h1>
                <p className="text-sm text-gray-500">Manage catalog, orders, and analytics.</p>
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={() => setActiveTab('overview')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'overview' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                    Overview
                </button>
                <button 
                    onClick={() => setActiveTab('products')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'products' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                    My Products
                </button>
                <button 
                    onClick={() => setActiveTab('add-product')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${activeTab === 'add-product' ? 'bg-orange-500 text-white' : 'bg-orange-50 text-orange-600 hover:bg-orange-100'}`}
                >
                    <Plus size={16}/> Add Product
                </button>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <TrendingUp className="text-blue-500" /> Store Performance
                        </h2>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="views" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="inquiries" fill="#f97316" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Sparkles size={100} />
                        </div>
                        <h2 className="text-lg font-bold mb-4">AI Market Intelligence</h2>
                        <div className="flex gap-2 mb-4">
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="border rounded-lg px-3 py-2 text-sm flex-1 outline-none focus:border-blue-500 bg-white"
                            >
                                {MARKET_CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <button 
                                onClick={handleGetInsights} 
                                disabled={loadingInsights}
                                className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-70 flex items-center gap-2"
                            >
                                {loadingInsights ? <Loader2 className="animate-spin" size={16}/> : <Zap size={16}/>}
                                Analyze
                            </button>
                        </div>

                        {insights && !loadingInsights ? (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded border border-gray-100">
                                    <div className="text-xs text-gray-500 mb-1">Market Trend</div>
                                    <div className={`text-xl font-bold capitalize flex items-center gap-2 ${insights.trend === 'up' ? 'text-green-600' : insights.trend === 'down' ? 'text-red-500' : 'text-gray-600'}`}>
                                        {insights.trend === 'up' ? <TrendingUp size={20}/> : <TrendingUp size={20} className={insights.trend === 'down' ? 'rotate-180' : ''}/>}
                                        {insights.trend}
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded border border-gray-100">
                                    <div className="text-xs text-gray-500 mb-1">Avg. Price Change</div>
                                    <div className="text-xl font-bold text-slate-800">{insights.priceChange}</div>
                                </div>
                                <div className="col-span-2 bg-blue-50 p-4 rounded border border-blue-100">
                                    <div className="text-xs text-blue-600 font-bold mb-2">Trending Keywords</div>
                                    <div className="flex gap-2 flex-wrap">
                                        {insights.topKeywords?.map((k: string, i: number) => (
                                            <span key={i} className="bg-white px-2 py-1 rounded text-xs border border-blue-200 text-blue-800 font-medium">{k}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                                {loadingInsights ? (
                                    <Loader2 className="animate-spin" size={32} />
                                ) : (
                                    <span className="text-sm">Select a category to view insights</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="space-y-4">
                    <h3 className="font-bold text-slate-800">Recent Inquiries</h3>
                    {[1,2,3].map(i => (
                        <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 flex justify-between items-center hover:shadow-md transition-shadow cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                                    {String.fromCharCode(64+i)}
                                </div>
                                <div>
                                    <div className="font-bold text-slate-800 text-sm">Buyer from USA</div>
                                    <div className="text-xs text-gray-500">Regarding: Industrial Pump...</div>
                                </div>
                            </div>
                            <span className="text-xs text-slate-400">2h ago</span>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* PRODUCTS LIST TAB */}
        {activeTab === 'products' && (
            <div className="animate-fade-in bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="font-bold text-lg text-slate-800">Product Catalog</h2>
                    <div className="relative">
                        <input type="text" placeholder="Search..." className="pl-8 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"/>
                        <AlertCircle size={14} className="absolute left-2.5 top-3 text-gray-400"/>
                    </div>
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-bold border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4">Product Name</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Stock</th>
                            <th className="px-6 py-4">Views</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {MOCK_MY_PRODUCTS.map(p => (
                            <tr key={p.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-800">{p.title}</td>
                                <td className="px-6 py-4 text-green-600 font-bold">${p.price}</td>
                                <td className="px-6 py-4">{p.stock}</td>
                                <td className="px-6 py-4">{p.views}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${p.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {p.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 flex gap-2">
                                    <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Settings size={16}/></button>
                                    <button className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}

        {/* ADD PRODUCT TAB (Detailed Alibaba Style) */}
        {activeTab === 'add-product' && (
            <div className="animate-fade-in max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Add New Product</h2>
                    <div className="flex gap-3">
                        <button onClick={() => setActiveTab('products')} className="px-4 py-2 border border-gray-300 rounded-lg text-slate-600 font-bold hover:bg-gray-50">Cancel</button>
                        <button onClick={handleSaveProduct} className="px-6 py-2 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 flex items-center gap-2">
                            <Save size={18}/> Publish Product
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Main Info */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Section 1: Basic Info */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2"><FileText size={20} className="text-blue-500"/> Basic Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Product Name</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="e.g. Industrial Hydraulic Pump 5000 PSI"
                                        value={productForm.title}
                                        onChange={e => setProductForm({...productForm, title: e.target.value})}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
                                        <select 
                                            className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                                            value={productForm.category}
                                            onChange={e => setProductForm({...productForm, category: e.target.value})}
                                        >
                                            {MARKET_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Keywords</label>
                                        <input type="text" className="w-full p-2 border border-gray-300 rounded-lg" placeholder="pump, hydraulic, industrial"/>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Detailed Description with AI */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><List size={20} className="text-blue-500"/> Product Details</h3>
                                <button 
                                    onClick={handleGenerateDesc}
                                    disabled={loadingGen || !productForm.title}
                                    className="text-xs bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg font-bold hover:bg-purple-200 flex items-center gap-1 transition-colors"
                                >
                                    {loadingGen ? <Loader2 className="animate-spin" size={12}/> : <Sparkles size={12}/>} AI Write Description
                                </button>
                            </div>
                            <textarea 
                                className="w-full p-4 border border-gray-300 rounded-lg h-64 focus:ring-2 focus:ring-blue-500 outline-none text-sm leading-relaxed"
                                placeholder="Detailed product description, features, and applications..."
                                value={productForm.description}
                                onChange={e => setProductForm({...productForm, description: e.target.value})}
                            ></textarea>
                        </div>

                        {/* Section 3: Specifications (Dynamic Key-Value) */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2"><Layers size={20} className="text-blue-500"/> Specifications</h3>
                            <div className="space-y-3">
                                {productForm.specs.map((spec, index) => (
                                    <div key={index} className="flex gap-4">
                                        <input 
                                            type="text" 
                                            placeholder="Attribute Name (e.g. Color)" 
                                            className="flex-1 p-2 border border-gray-300 rounded-lg text-sm bg-slate-50"
                                            value={spec.key}
                                            onChange={e => handleSpecChange(index, 'key', e.target.value)}
                                        />
                                        <input 
                                            type="text" 
                                            placeholder="Value (e.g. Red)" 
                                            className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
                                            value={spec.value}
                                            onChange={e => handleSpecChange(index, 'value', e.target.value)}
                                        />
                                        <button onClick={() => handleRemoveSpec(index)} className="text-red-400 hover:text-red-600"><Trash2 size={18}/></button>
                                    </div>
                                ))}
                                <button onClick={handleAddSpec} className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1 mt-2">
                                    <Plus size={14}/> Add More Specification
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Trade & Logistics */}
                    <div className="space-y-8">
                        
                        {/* Section 4: Trade Information (Tiered Pricing) */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2"><DollarSign size={20} className="text-green-600"/> Trade Information</h3>
                            
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-slate-700 mb-1">Minimum Order Quantity (MOQ)</label>
                                <input 
                                    type="number" 
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    value={productForm.moq}
                                    onChange={e => setProductForm({...productForm, moq: parseInt(e.target.value)})}
                                />
                            </div>

                            <div className="mb-2">
                                <label className="block text-sm font-bold text-slate-700 mb-2">Wholesale Price Tiers</label>
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <div className="grid grid-cols-12 gap-2 bg-gray-50 p-2 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                        <div className="col-span-4">Min Qty</div>
                                        <div className="col-span-4">Max Qty</div>
                                        <div className="col-span-3">Unit Price ($)</div>
                                        <div className="col-span-1"></div>
                                    </div>
                                    <div className="divide-y divide-gray-100">
                                        {productForm.pricingTiers.map((tier, idx) => (
                                            <div key={idx} className="grid grid-cols-12 gap-2 p-2 items-center hover:bg-gray-50 transition-colors">
                                                <div className="col-span-4">
                                                    <input 
                                                        type="number" 
                                                        className="w-full p-2 border border-gray-300 rounded text-sm focus:border-green-500 outline-none"
                                                        placeholder="1"
                                                        value={tier.minQty}
                                                        onChange={e => handleTierChange(idx, 'minQty', parseInt(e.target.value))}
                                                    />
                                                </div>
                                                <div className="col-span-4">
                                                    <input 
                                                        type="number" 
                                                        className="w-full p-2 border border-gray-300 rounded text-sm focus:border-green-500 outline-none"
                                                        placeholder="∞ (Unlimited)"
                                                        value={tier.maxQty ?? ''}
                                                        onChange={e => handleTierChange(idx, 'maxQty', e.target.value ? parseInt(e.target.value) : null)}
                                                    />
                                                </div>
                                                <div className="col-span-3 relative">
                                                    <span className="absolute left-2.5 top-2 text-gray-400">$</span>
                                                    <input 
                                                        type="number" 
                                                        className="w-full pl-6 p-2 border border-gray-300 rounded text-sm font-bold text-slate-700 focus:border-green-500 outline-none"
                                                        placeholder="0.00"
                                                        value={tier.pricePerUnit}
                                                        onChange={e => handleTierChange(idx, 'pricePerUnit', parseFloat(e.target.value))}
                                                    />
                                                </div>
                                                <div className="col-span-1 text-center">
                                                    <button 
                                                        onClick={() => handleRemoveTier(idx)} 
                                                        className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded hover:bg-red-50"
                                                        title="Remove Tier"
                                                        disabled={productForm.pricingTiers.length === 1}
                                                    >
                                                        <Trash2 size={16}/>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-3 bg-gray-50 border-t border-gray-200">
                                        <button 
                                            onClick={handleAddTier} 
                                            className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-xs font-bold text-slate-600 hover:text-green-600 hover:border-green-400 hover:bg-green-50 transition-all flex items-center justify-center gap-1.5"
                                        >
                                            <Plus size={16}/> Add Price Break
                                        </button>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                                    <AlertCircle size={12}/>
                                    Set price breaks to encourage bulk purchasing. Leave Max Qty empty for "and above".
                                </p>
                            </div>
                        </div>

                        {/* Section 5: Logistics & Packaging */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2"><Package size={20} className="text-orange-500"/> Packaging & Delivery</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Lead Time</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                        value={productForm.leadTime}
                                        onChange={e => setProductForm({...productForm, leadTime: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Packaging Type</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                        value={productForm.packaging}
                                        onChange={e => setProductForm({...productForm, packaging: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Supply Ability</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                        value={productForm.supplyAbility}
                                        onChange={e => setProductForm({...productForm, supplyAbility: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 6: Media */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                                <ImageIcon size={20} className="text-purple-500"/> Product Media
                            </h3>
                            
                            {/* Drag & Drop Area */}
                            <div 
                                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                                    isDragging 
                                    ? 'border-purple-500 bg-purple-50' 
                                    : 'border-gray-300 hover:bg-gray-50'
                                }`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    multiple 
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                />
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                                    <Upload size={24} className={isDragging ? 'text-purple-500' : ''}/>
                                </div>
                                <p className="text-sm font-bold text-slate-600">
                                    {isDragging ? 'Drop images here' : 'Click to upload or drag and drop'}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF up to 5MB (Max 5 images)</p>
                            </div>

                            {/* Image Preview Grid */}
                            {productForm.images.length > 0 && (
                                <div className="grid grid-cols-4 gap-3 mt-4">
                                    {productForm.images.map((img, i) => (
                                        <div key={i} className="aspect-square bg-gray-100 rounded-lg border border-gray-200 relative group overflow-hidden">
                                            <img src={img} alt={`Product ${i}`} className="w-full h-full object-cover"/>
                                            <button 
                                                onClick={() => removeImage(i)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={12}/>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Video Embed */}
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                    <Video size={16} className="text-slate-400"/> Product Demonstration Video
                                </label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        placeholder="Paste YouTube or Vimeo URL (e.g. https://youtu.be/...)"
                                        className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                                        value={productForm.videoUrl}
                                        onChange={e => setProductForm({...productForm, videoUrl: e.target.value})}
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Add a video to increase conversion by up to 20%.</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default SupplierDashboard;
