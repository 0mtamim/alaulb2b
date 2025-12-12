
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Shirt, Box, Hammer, Zap, Anchor, Beaker, Truck, ChevronRight, TrendingUp, BarChart2, Search, Package, Award, PieChart as PieChartIcon, LineChart as LineChartIcon, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { MainCategory, CategoryHomePageSettings } from '../types';

// Mock Data for the new dynamic page
const MAIN_CATEGORIES: MainCategory[] = [
  {
    id: 'machinery', name: 'Industrial Machinery', icon: Hammer,
    description: 'Heavy equipment, tools, and processing lines.',
    image: 'https://images.unsplash.com/photo-1531297461136-82lw8z8z8z8z?auto=format&fit=crop&w=400&q=80',
    stats: { suppliers: '15.4k', products: '45.2k' }
  },
  {
    id: 'electronics', name: 'Consumer Electronics', icon: Cpu,
    description: 'Smart devices, components, and accessories.',
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=400&q=80',
    stats: { suppliers: '32.1k', products: '89.0k' }
  },
  {
    id: 'apparel', name: 'Apparel & Textiles', icon: Shirt,
    description: 'Fabrics, garments, and fashion accessories.',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=400&q=80',
    stats: { suppliers: '56.0k', products: '120.1k' }
  },
  {
    id: 'packaging', name: 'Packaging & Printing', icon: Box,
    description: 'Custom boxes, bags, and printing services.',
    image: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=400&q=80',
    stats: { suppliers: '21.0k', products: '34.0k' }
  },
  {
    id: 'energy', name: 'New Energy', icon: Zap,
    description: 'Solar panels, batteries, and EV chargers.',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=400&q=80',
    stats: { suppliers: '8.9k', products: '12.5k' }
  },
  {
    id: 'logistics', name: 'Logistics & Vehicles', icon: Truck,
    description: 'Freight, auto parts, and vehicle solutions.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80',
    stats: { suppliers: '4.5k', products: '18.3k' }
  },
];

const CATEGORY_STATS = [
  { name: 'Machinery', suppliers: 15400, products: 45200 },
  { name: 'Electronics', suppliers: 32100, products: 89000 },
  { name: 'Apparel', suppliers: 56000, products: 120100 },
  { name: 'Packaging', suppliers: 21000, products: 34000 },
  { name: 'Energy', suppliers: 8900, products: 12500 },
  { name: 'Logistics', suppliers: 4500, products: 18300 },
];

const PIE_COLORS = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#f59e0b'];

const FEATURED_SUPPLIERS = [
    { id: 's1', name: 'Shenzhen Tech Industries', country: 'China', logo: 'ST' },
    { id: 's2', name: 'German Precision Engineering', country: 'Germany', logo: 'GP' },
    { id: 's3', name: 'Vietnam Textile Group', country: 'Vietnam', logo: 'VT' },
];

const maxSuppliers = Math.ceil(Math.max(...CATEGORY_STATS.map(c => c.suppliers)) / 10000) * 10000;
const maxProducts = Math.ceil(Math.max(...CATEGORY_STATS.map(c => c.products)) / 10000) * 10000;


const CategoriesPage: React.FC = () => {
  const [settings] = useState<CategoryHomePageSettings>({
      showHero: true,
      showStatsChart: true,
      showFeaturedSuppliers: true,
      showTrendingProducts: false,
      showHowItWorks: true
  });

  const [chartType, setChartType] = useState<'bar' | 'pie' | 'line'>('bar');
  const [supplierFilter, setSupplierFilter] = useState<number>(maxSuppliers);
  const [productFilter, setProductFilter] = useState<number>(maxProducts);

  const resetFilters = () => {
    setSupplierFilter(maxSuppliers);
    setProductFilter(maxProducts);
  };

  const filteredCategoryStats = useMemo(() => {
    return CATEGORY_STATS.filter(
        cat => cat.suppliers <= supplierFilter && cat.products <= productFilter
    );
  }, [supplierFilter, productFilter]);

  const renderChart = (data: typeof CATEGORY_STATS) => {
    if (data.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-slate-500">
          No data matches the current filters.
        </div>
      );
    }
    switch (chartType) {
      case 'pie':
        const pieDataSuppliers = data.map(d => ({ name: d.name, value: d.suppliers }));
        const pieDataProducts = data.map(d => ({ name: d.name, value: d.products }));
        return (
          <div className="flex flex-col md:flex-row justify-around items-center h-full">
            <div className="w-full md:w-1/2 h-80">
                <h4 className="text-center font-bold text-slate-600 mb-2">Supplier Distribution</h4>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie data={pieDataSuppliers} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                            {pieDataSuppliers.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 h-80">
                <h4 className="text-center font-bold text-slate-600 mb-2">Product Distribution</h4>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie data={pieDataProducts} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                            {pieDataProducts.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
          </div>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} stroke="#64748b"/>
              <YAxis axisLine={false} tickLine={false} fontSize={12} stroke="#64748b"/>
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{ fill: '#f8fafc' }} />
              <Legend />
              <Line type="monotone" dataKey="suppliers" name="Active Suppliers" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="products" name="Total Products" stroke="#f97316" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'bar':
      default:
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} stroke="#64748b"/>
              <YAxis axisLine={false} tickLine={false} fontSize={12} stroke="#64748b"/>
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{ fill: '#f8fafc' }} />
              <Legend />
              <Bar dataKey="suppliers" name="Active Suppliers" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
              <Bar dataKey="products" name="Total Products" fill="#f97316" radius={[4, 4, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };


  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {settings.showHero && (
        <div className="bg-white border-b border-gray-200 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Find Anything, Source Everything</h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-8">
              Explore millions of products from verified suppliers across 30+ major industry categories.
            </p>
            <div className="max-w-xl mx-auto bg-white p-2 rounded-full shadow-md border border-gray-200 flex">
                <input 
                    type="text" 
                    placeholder="Search for a category or product..." 
                    className="flex-1 p-3 outline-none text-slate-800 placeholder:text-slate-400"
                />
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 rounded-full font-bold transition-colors flex items-center gap-2">
                    <Search size={18}/> Search
                </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-1/4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                           <SlidersHorizontal size={18}/> Chart Filters
                        </h3>
                        <button onClick={resetFilters} className="text-xs text-slate-500 hover:text-red-500 font-medium flex items-center gap-1">
                            <RefreshCw size={12}/> Reset
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Supplier Filter */}
                        <div>
                            <label htmlFor="supplier-range" className="block text-sm font-bold text-slate-700 mb-2">Number of Suppliers</label>
                            <div className="flex justify-between text-xs text-slate-500 mb-1">
                                <span>0</span>
                                <span>{supplierFilter.toLocaleString()}</span>
                            </div>
                            <input 
                                id="supplier-range"
                                type="range" 
                                min="0" 
                                max={maxSuppliers}
                                step="1000"
                                value={supplierFilter}
                                onChange={(e) => setSupplierFilter(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                        </div>

                        {/* Product Filter */}
                        <div>
                            <label htmlFor="product-range" className="block text-sm font-bold text-slate-700 mb-2">Number of Products</label>
                             <div className="flex justify-between text-xs text-slate-500 mb-1">
                                <span>0</span>
                                <span>{productFilter.toLocaleString()}</span>
                            </div>
                            <input 
                                id="product-range"
                                type="range" 
                                min="0" 
                                max={maxProducts}
                                step="1000"
                                value={productFilter}
                                onChange={(e) => setProductFilter(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                            />
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:w-3/4 space-y-12">
              {/* Main Category Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {MAIN_CATEGORIES.map((cat) => (
                      <Link to={`/?category=${encodeURIComponent(cat.name)}`} key={cat.id} className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full">
                          <div className="p-6">
                              <div className="flex items-center gap-4 mb-3">
                                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                                      <cat.icon size={24}/>
                                  </div>
                                  <div>
                                      <h3 className="font-bold text-lg text-slate-800">{cat.name}</h3>
                                      <p className="text-sm text-slate-500">{cat.description}</p>
                                  </div>
                              </div>
                              <div className="flex justify-between text-xs text-slate-500 border-t border-gray-100 pt-3 mt-3">
                                  <span>{cat.stats.suppliers} Suppliers</span>
                                  <span>{cat.stats.products} Products</span>
                              </div>
                          </div>
                          <div className="h-20 bg-gray-50 mt-auto overflow-hidden">
                              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"/>
                          </div>
                      </Link>
                  ))}
              </div>

              {/* Conditional: Analytics Section */}
              {settings.showStatsChart && (
                <div className="pt-8 pb-12">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                          <div className="flex items-center gap-2">
                              <BarChart2 className="text-orange-500" size={24} />
                              <h2 className="text-2xl font-bold text-slate-800">Market Overview</h2>
                          </div>
                          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                              <button onClick={() => setChartType('bar')} className={`p-2 rounded-md transition-all ${chartType === 'bar' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:bg-slate-200'}`} title="Bar Chart">
                                  <BarChart2 size={16}/>
                              </button>
                              <button onClick={() => setChartType('line')} className={`p-2 rounded-md transition-all ${chartType === 'line' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:bg-slate-200'}`} title="Line Chart">
                                  <LineChartIcon size={16}/>
                              </button>
                               <button onClick={() => setChartType('pie')} className={`p-2 rounded-md transition-all ${chartType === 'pie' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:bg-slate-200'}`} title="Pie Chart">
                                  <PieChartIcon size={16}/>
                              </button>
                          </div>
                      </div>
                      <div className="h-80 w-full">
                          {renderChart(filteredCategoryStats)}
                      </div>
                  </div>
                </div>
              )}
            </main>
        </div>
      </div>

      {/* Conditional: Featured Suppliers */}
      {settings.showFeaturedSuppliers && (
          <div className="bg-slate-100 py-16">
              <div className="container mx-auto px-4">
                  <div className="flex justify-between items-end mb-8">
                      <div>
                          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                              <Award className="text-yellow-500"/> Featured Suppliers
                          </h2>
                          <p className="text-slate-500 mt-1">Top-rated manufacturers across all categories.</p>
                      </div>
                      <Link to="/suppliers" className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1">
                          View All <ChevronRight size={14}/>
                      </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {FEATURED_SUPPLIERS.map(s => (
                          <div key={s.id} className="bg-white p-6 rounded-xl border border-gray-200 flex items-center gap-4 hover:shadow-lg transition-shadow">
                              <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">
                                  {s.logo}
                              </div>
                              <div>
                                  <h4 className="font-bold text-slate-800">{s.name}</h4>
                                  <p className="text-sm text-slate-500">{s.country}</p>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default CategoriesPage;
