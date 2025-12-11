
import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Shirt, Box, Hammer, Zap, Anchor, Beaker, Truck, ChevronRight, TrendingUp, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CATEGORIES = [
  {
    id: 'machinery',
    name: 'Industrial Machinery',
    icon: Hammer,
    sub: ['Construction Equipment', 'CNC Machines', 'Food Processing', 'Textile Machinery', 'Plastics & Rubber', 'Woodworking'],
    image: 'https://images.unsplash.com/photo-1531297461136-82lw8z8z8z8z?auto=format&fit=crop&w=400&q=80',
    trend: '+12% Demand'
  },
  {
    id: 'electronics',
    name: 'Consumer Electronics',
    icon: Cpu,
    sub: ['Mobile Phones', 'Computer Hardware', 'IoT Devices', 'Smart Home', 'Audio & Video', 'Camera & Photo'],
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=400&q=80',
    trend: '+8% Demand'
  },
  {
    id: 'apparel',
    name: 'Apparel & Textiles',
    icon: Shirt,
    sub: ['Men\'s Clothing', 'Women\'s Clothing', 'Sportswear', 'Fabrics', 'Yarn & Thread', 'Accessories'],
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=400&q=80',
    trend: 'Stable'
  },
  {
    id: 'packaging',
    name: 'Packaging & Printing',
    icon: Box,
    sub: ['Paper Boxes', 'Plastic Bags', 'Bottles', 'Cans', 'Printing Services', 'Protective Packaging'],
    image: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=400&q=80',
    trend: '+15% Demand'
  },
  {
    id: 'energy',
    name: 'New Energy',
    icon: Zap,
    sub: ['Solar Panels', 'Wind Generators', 'Lithium Batteries', 'Inverters', 'EV Chargers', 'Bioenergy'],
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=400&q=80',
    trend: '+45% Demand'
  },
  {
    id: 'logistics',
    name: 'Logistics Services',
    icon: Truck,
    sub: ['Freight Forwarding', 'Air Freight', 'Ocean Freight', 'Warehousing', 'Customs Clearance', 'Trucking'],
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80',
    trend: '+5% Demand'
  },
  {
    id: 'chemicals',
    name: 'Chemicals',
    icon: Beaker,
    sub: ['Agrochemicals', 'Plastics', 'Resins', 'Paints & Coatings', 'Lab Supplies', 'Basic Chemicals'],
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=400&q=80',
    trend: 'Stable'
  },
  {
    id: 'vehicles',
    name: 'Vehicles & Parts',
    icon: Anchor,
    sub: ['Electric Vehicles', 'Auto Parts', 'Motorcycles', 'Marine Parts', 'Aviation Parts', 'Bicycles'],
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=400&q=80',
    trend: '+20% Demand'
  }
];

const CATEGORY_STATS = [
  { name: 'Machinery', suppliers: 1540, products: 45200 },
  { name: 'Electronics', suppliers: 3200, products: 89000 },
  { name: 'Apparel', suppliers: 5600, products: 120000 },
  { name: 'Packaging', suppliers: 2100, products: 34000 },
  { name: 'Energy', suppliers: 890, products: 12500 },
  { name: 'Logistics', suppliers: 450, products: 2300 },
  { name: 'Chemicals', suppliers: 1200, products: 28000 },
  { name: 'Vehicles', suppliers: 950, products: 18000 },
];

const CategoriesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <div className="bg-white border-b border-gray-200 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Sourcing Categories</h1>
          <p className="text-lg text-slate-500 max-w-2xl">
            Explore millions of products from verified suppliers across 30+ major industry categories.
          </p>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="container mx-auto px-4 pt-12 pb-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center gap-2 mb-6">
                <BarChart2 className="text-orange-500" size={24} />
                <h2 className="text-2xl font-bold text-slate-800">Market Overview</h2>
            </div>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={CATEGORY_STATS} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} stroke="#64748b"/>
                        <YAxis axisLine={false} tickLine={false} fontSize={12} stroke="#64748b"/>
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            cursor={{ fill: '#f8fafc' }}
                        />
                        <Legend />
                        <Bar dataKey="suppliers" name="Active Suppliers" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
                        <Bar dataKey="products" name="Total Products" fill="#f97316" radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-300 group overflow-hidden flex flex-col h-full">
              <div className="h-32 bg-gray-100 relative overflow-hidden">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white font-bold flex items-center gap-2">
                  <cat.icon size={20} /> {cat.name}
                </div>
                {cat.trend.includes('+') && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                        <TrendingUp size={10}/> {cat.trend}
                    </div>
                )}
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <ul className="space-y-2 mb-6 flex-1">
                  {cat.sub.map((sub, idx) => (
                    <li key={idx}>
                      <Link to={`/?category=${encodeURIComponent(cat.name)}&q=${encodeURIComponent(sub)}`} className="text-sm text-gray-600 hover:text-orange-600 hover:underline flex items-center gap-1">
                        <ChevronRight size={12} className="text-gray-300"/> {sub}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link to={`/?category=${encodeURIComponent(cat.name)}`} className="w-full text-center border border-gray-200 text-slate-700 py-2 rounded-lg font-bold text-sm hover:bg-slate-50 transition-colors mt-auto">
                  View All {cat.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
