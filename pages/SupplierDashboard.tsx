
import React, { useState, useEffect, useRef } from 'react';
import { generateProductDescription, getMarketInsights } from '../services/gemini';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2, TrendingUp, Sparkles, AlertCircle, Globe, Plus, Trash2, Package, DollarSign, Image as ImageIcon, List, Save, Settings, FileText, Box, Layers, CheckCircle, Zap, Upload, X, Video, Edit, ShieldAlert } from 'lucide-react';
import { Product, PricingTier } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { verifyFileSignature, sanitizeImageFile } from '../utils/security';

const MARKET_CATEGORIES = [
  'Electronics', 'Machinery', 'Textiles', 'Packaging', 
  'Construction', 'Agriculture', 'Chemicals', 'Energy', 'Automotive', 'Beauty & Personal Care'
];

// Mock existing products for the list view
const MOCK_MY_PRODUCTS: Partial<Product>[] = [
    { id: 'p1', title: 'Industrial Hydraulic Pump 5000 PSI', price: 120, stock: 50, status: 'active', views: 1250, category: 'Machinery', dateAdded: '2023-08-15', lastModified: '2023-10-25', aiRiskScore: 12 },
    { id: 'p2', title: 'Custom Packaging Box', price: 0.50, stock: 10000, status: 'active', views: 3400, category: 'Packaging', dateAdded: '2023-09-01', lastModified: '2023-10-28', aiRiskScore: 5 },
    { id: 'p3', title: 'Solar Panel 450W', price: 85, stock: 0, status: 'out-of-stock', views: 900, category: 'Energy', dateAdded: '2023-09-20', lastModified: '2023-10-10', aiRiskScore: 45 },
];

const getInitialFormState = () => ({
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

const SupplierDashboard: React.FC = () => {
  const { formatPrice, currency, availableCurrencies } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'add-product'>('overview');
  
  // --- Dashboard State ---
  const [category, setCategory] = useState(MARKET_CATEGORIES[0]);
  const [insights, setInsights] = useState<any>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  
  // --- Product CRUD State ---
  const [myProducts, setMyProducts] = useState<Partial<Product>[]>(MOCK_MY_PRODUCTS);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  // --- Inline Editing State ---
  const [editingCell, setEditingCell] = useState<{ productId: string; field: 'price' | 'stock' } | null>(null);
  const [inlineEditValue, setInlineEditValue] = useState<string>('');

  // --- Add/Edit Product Form State ---
  const [productForm, setProductForm] = useState(getInitialFormState());
  const [loadingGen, setLoadingGen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // New state for processing
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Effect to populate form when editing
  useEffect(() => {
    if (editingProduct) {
        setProductForm({
            title: editingProduct.title || '',
            category: editingProduct.category || 'Electronics',
            moq: editingProduct.moq || 10,
            basePrice: String(editingProduct.price || ''),
            description: editingProduct.description || '',
            // These would be part of a more detailed product model
            leadTime: '15 Days',
            packaging: 'Carton Box',
            supplyAbility: '10000 Units/Month',
            pricingTiers: (editingProduct as any).pricingTiers || [{ minQty: 10, maxQty: null, pricePerUnit: editingProduct.price || 0 }],
            specs: (editingProduct as any).specs || [{ key: 'Model Number', value: '' }, { key: 'Material', value: '' }],
            images: [],
            videoUrl: ''
        });
        setActiveTab('add-product');
    } else {
        setProductForm(getInitialFormState());
    }
  }, [editingProduct]);

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
  
  // --- CRUD Handlers ---

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      setMyProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  const handleEditProduct = (product: Partial<Product>) => {
    setEditingProduct(product);
  };
  
  const handleSaveProduct = () => {
      // UPDATE existing product
      if (editingProduct) {
          const updatedProduct: Partial<Product> = {
              ...editingProduct,
              title: productForm.title,
              price: parseFloat(productForm.basePrice),
              moq: productForm.moq,
              category: productForm.category,
              description: productForm.description,
              lastModified: new Date().toISOString().split('T')[0],
          };
          setMyProducts(prev => prev.map(p => p.id === editingProduct.id ? updatedProduct : p));
          alert("Product Updated Successfully!");
      } 
      // CREATE new product
      else {
          const newProduct: Partial<Product> = {
              id: `p${Date.now()}`,
              title: productForm.title,
              price: parseFloat(productForm.basePrice),
              moq: productForm.moq,
              stock: 100, // Default stock
              status: 'pending_approval',
              views: 0,
              category: productForm.category,
              description: productForm.description,
              dateAdded: new Date().toISOString().split('T')[0],
              lastModified: new Date().toISOString().split('T')[0],
              aiRiskScore: Math.floor(Math.random() * 50),
          };
          setMyProducts(prev => [newProduct, ...prev]);
          alert("Product Submitted for Approval! It will appear in the listing once verified by Admin.");
      }
      
      // Reset and switch tab
      setEditingProduct(null);
      setProductForm(getInitialFormState());
      setActiveTab('products');
  };
  
  const handleCancelEdit = () => {
      setEditingProduct(null);
      setProductForm(getInitialFormState());
      setActiveTab('products');
  };

  // --- Inline Edit Handlers ---
  const handleCellClick = (product: Partial<Product>, field: 'price' | 'stock') => {
    setEditingCell({ productId: product.id!, field });
    setInlineEditValue(String(product[field] || ''));
  };

  const handleSaveInlineEdit = () => {
    if (!editingCell) return;

    const { productId, field } = editingCell;
    const newValue = parseFloat(inlineEditValue);

    if (isNaN(newValue) || newValue < 0) {
      setEditingCell(null);
      return;
    }

    setMyProducts(prevProducts =>
      prevProducts.map(p =>
        p.id === productId
          ? {
              ...p,
              [field]: newValue,
              lastModified: new Date().toISOString().split('T')[0], // Update lastModified date
            }
          : p
      )
    );

    setEditingCell(null);
  };

  // --- Form Handlers ---
  const handleGenerateDesc = async () => {
    if (!productForm.title) return;
    setLoadingGen(true);
    const desc = await generateProductDescription(`${productForm.title} - ${productForm.category}. Specs: ${productForm.specs.map(s => `${s.key}: ${s.value}`).join(', ')}`);
    setProductForm(prev => ({ ...prev, description: desc || '' }));
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

  // --- Secure Media Handlers ---
  
  const processFiles = async (files: File[]) => {
      setIsUploading(true);
      const newImages: string[] = [];
      
      for (const file of files) {
          // 1. Check Magic Number (Security Layer 1)
          const isValidSignature = await verifyFileSignature(file);
          if (!isValidSignature) {
              alert(`Security Alert: File "${file.name}" has a mismatched signature and was rejected.`);
              continue;
          }

          // 2. Sanitize & Re-encode (Security Layer 2 - Anti-Steganography)
          const cleanFile = await sanitizeImageFile(file);
          if (cleanFile) {
              newImages.push(URL.createObjectURL(cleanFile));
          } else {
              alert(`Security Alert: File "${file.name}" could not be sanitized and was rejected.`);
          }
      }
      
      setProductForm(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
      setIsUploading(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          await processFiles(Array.from(e.dataTransfer.files));
      }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          await processFiles(Array.from(e.target.files));
      }
  };

  const removeImage = (index: number) => {
      setProductForm(prev => ({
          ...prev,
          images: prev.images.filter((_, i) => i !== index)
      }));
  };

  const currentSymbol = availableCurrencies.find(c => c.code === currency)?.symbol || '$';

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
                    onClick={() => { setEditingProduct(null); setActiveTab('add-product'); }}
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
                {/* ... (Existing Overview UI) ... */}
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
                    {/* ... Rest of overview UI ... */}
                </div>
                {/* ... Right col overview ... */}
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
            <div className="animate-fade-in bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="font-bold text-lg text-slate-800">Product Catalog</h2>
                    <div className="relative">
                        <input type="text" placeholder="Search..." className="pl-8 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"/>
                        <AlertCircle size={14} className="absolute left-2.5 top-3 text-gray-400"/>
                    </div>
                </div>
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50 text-slate-500 font-bold border-b border-gray-200 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-3">Product Name</th>
                            <th className="px-6 py-3">Price</th>
                            <th className="px-6 py-3">Stock</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Date Added</th>
                            <th className="px-6 py-3">Last Modified</th>
                            <th className="px-6 py-3">AI Risk Score</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {myProducts.map(p => (
                            <tr key={p.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-800">{p.title}</td>
                                <td className="px-6 py-4" onClick={() => !editingCell && handleCellClick(p, 'price')}>
                                    {editingCell?.productId === p.id && editingCell?.field === 'price' ? (
                                        <input 
                                            type="number" 
                                            value={inlineEditValue} 
                                            onChange={(e) => setInlineEditValue(e.target.value)}
                                            onBlur={handleSaveInlineEdit}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleSaveInlineEdit();
                                                if (e.key === 'Escape') setEditingCell(null);
                                            }}
                                            className="w-24 p-1 border border-blue-400 rounded-md ring-2 ring-blue-100 outline-none"
                                            autoFocus
                                            onFocus={(e) => e.target.select()}
                                        />
                                    ) : (
                                        <span className="text-green-600 font-bold p-1 cursor-pointer hover:bg-green-50 rounded-md">
                                            {formatPrice(p.price as number)}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4" onClick={() => !editingCell && handleCellClick(p, 'stock')}>
                                    {editingCell?.productId === p.id && editingCell?.field === 'stock' ? (
                                        <input 
                                            type="number"
                                            value={inlineEditValue}
                                            onChange={(e) => setInlineEditValue(e.target.value)}
                                            onBlur={handleSaveInlineEdit}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleSaveInlineEdit();
                                                if (e.key === 'Escape') setEditingCell(null);
                                            }}
                                            className="w-24 p-1 border border-blue-400 rounded-md ring-2 ring-blue-100 outline-none"
                                            autoFocus
                                            onFocus={(e) => e.target.select()}
                                        />
                                    ) : (
                                        <span className={`font-medium p-1 cursor-pointer hover:bg-blue-50 rounded-md ${p.stock === 0 ? 'text-red-600 font-bold' : 'text-slate-800'}`}>
                                            {p.stock === 0 ? 'Out' : p.stock}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                        p.status === 'active' ? 'bg-green-100 text-green-700' :
                                        p.status === 'out-of-stock' ? 'bg-yellow-100 text-yellow-700' :
                                        p.status === 'pending_approval' ? 'bg-blue-100 text-blue-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                        {p.status?.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500">{p.dateAdded}</td>
                                <td className="px-6 py-4 text-slate-500">{p.lastModified}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2" title={`Risk Score: ${p.aiRiskScore}`}>
                                        <span className={`w-2 h-2 rounded-full ${
                                            (p.aiRiskScore || 0) > 70 ? 'bg-red-500' :
                                            (p.aiRiskScore || 0) > 40 ? 'bg-yellow-500' :
                                            'bg-green-500'
                                        }`}></span>
                                        <span className={`font-bold ${
                                            (p.aiRiskScore || 0) > 70 ? 'text-red-600' :
                                            (p.aiRiskScore || 0) > 40 ? 'text-yellow-600' :
                                            'text-green-600'
                                        }`}>
                                            {(p.aiRiskScore || 0)}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEditProduct(p)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Edit Full Details"><Edit size={16}/></button>
                                        <button onClick={() => handleDeleteProduct(p.id!)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete Product"><Trash2 size={16}/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}

        {/* ADD/EDIT PRODUCT TAB */}
        {activeTab === 'add-product' && (
            <div className="animate-fade-in max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                    <div className="flex gap-3">
                        <button onClick={handleCancelEdit} className="px-4 py-2 border border-gray-300 rounded-lg text-slate-600 font-bold hover:bg-gray-50">Cancel</button>
                        <button onClick={handleSaveProduct} className="px-6 py-2 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 flex items-center gap-2">
                            <Save size={18}/> {editingProduct ? 'Update Product' : 'Publish Product'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Main Info */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Section 1: Basic Info */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            {/* ... Basic Info Fields ... */}
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

                        {/* Section 3: Specifications */}
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

                    {/* Right Column: Trade & Logistics & SECURE MEDIA */}
                    <div className="space-y-8">
                        
                        {/* Section 4: Trade Information */}
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
                                        <div className="col-span-3">Unit Price</div>
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
                                                    <span className="absolute left-2.5 top-2 text-gray-400">{currentSymbol}</span>
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

                        {/* Section 6: Secure Media Upload */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                                    <ImageIcon size={20} className="text-purple-500"/> Product Media
                                </h3>
                                <div className="text-[10px] text-slate-500 bg-slate-100 px-2 py-1 rounded-full flex items-center gap-1">
                                    <ShieldAlert size={10}/> Anti-Steganography Active
                                </div>
                            </div>
                            
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
                                onClick={() => !isUploading && fileInputRef.current?.click()}
                            >
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    multiple 
                                    accept="image/png, image/jpeg, image/gif"
                                    onChange={handleFileSelect}
                                />
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                                    {isUploading ? <Loader2 size={24} className="animate-spin text-purple-500"/> : <Upload size={24} className={isDragging ? 'text-purple-500' : ''}/>}
                                </div>
                                <p className="text-sm font-bold text-slate-600">
                                    {isUploading ? 'Sanitizing & Uploading...' : isDragging ? 'Drop images here' : 'Click to upload or drag and drop'}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">Safe JPG, PNG, GIF only (Scrubbed)</p>
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
                                        placeholder="Paste YouTube or Vimeo URL"
                                        className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                                        value={productForm.videoUrl}
                                        onChange={e => setProductForm({...productForm, videoUrl: e.target.value})}
                                    />
                                </div>
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
