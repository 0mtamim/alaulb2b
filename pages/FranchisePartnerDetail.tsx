
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, ShieldCheck, Mail, Phone, Globe, Calendar, Package, TrendingUp, Filter, Search, ShoppingCart, ChevronRight, Store, Share2, Heart, Award, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Mock Data for the Profile
const MOCK_PROFILE = {
  id: 'fp1',
  storeName: "Dubai Tech Hub",
  ownerName: "Ali Ahmed",
  region: "Dubai, UAE",
  banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
  logo: "DT",
  description: "Premier distributor of consumer electronics and smart home devices in the MENA region. We partner with top global manufacturers to bring the latest tech to Dubai. Authorized franchise partner of TradeGenius since 2023.",
  joinedDate: "January 2023",
  rating: 4.9,
  reviewCount: 128,
  totalSales: "12.5k+",
  responseTime: "< 1 hr",
  badges: ["Top Rated", "Verified Partner", "Fast Shipper"],
  contact: {
    email: "contact@dubaitechhub.ae",
    phone: "+971 50 123 4567",
    website: "www.dubaitechhub.ae",
    address: "Unit 402, Business Bay, Dubai, UAE"
  },
  products: [
    { id: 'p1', title: "Smart Home Hub Gateway Zigbee 3.0", price: 120, oldPrice: 150, image: "https://picsum.photos/400/400?random=101", category: "Electronics", rating: 4.8, sales: 450 },
    { id: 'p2', title: "Portable Solar Power Bank 20000mAh", price: 45, oldPrice: 55, image: "https://picsum.photos/400/400?random=102", category: "Energy", rating: 4.6, sales: 1200 },
    { id: 'p3', title: "Noise Cancelling Wireless Earbuds Pro", price: 80, oldPrice: null, image: "https://picsum.photos/400/400?random=103", category: "Audio", rating: 4.9, sales: 850 },
    { id: 'p4', title: "4K Action Camera Waterproof", price: 250, oldPrice: 299, image: "https://picsum.photos/400/400?random=104", category: "Cameras", rating: 4.7, sales: 320 },
    { id: 'p5', title: "Smart LED Bulb RGBW WiFi", price: 12, oldPrice: 18, image: "https://picsum.photos/400/400?random=105", category: "Lighting", rating: 4.5, sales: 2100 },
    { id: 'p6', title: "Robot Vacuum Cleaner with Mop", price: 350, oldPrice: 450, image: "https://picsum.photos/400/400?random=106", category: "Appliances", rating: 4.8, sales: 150 },
  ],
  reviews: [
    { id: 1, user: "Sarah Jenkins", rating: 5, comment: "Fast delivery to Abu Dhabi. The product is authentic and works perfectly.", date: "2 days ago" },
    { id: 2, user: "Mohammed Al-Fayed", rating: 4, comment: "Great customer service, helped me setup the device over the phone.", date: "1 week ago" },
    { id: 3, user: "Tech Solutions Ltd", rating: 5, comment: "Reliable bulk supplier for our office needs.", date: "2 weeks ago" }
  ],
  performance: [
    { month: 'Jan', sales: 4000 },
    { month: 'Feb', sales: 3000 },
    { month: 'Mar', sales: 5000 },
    { month: 'Apr', sales: 4500 },
    { month: 'May', sales: 6000 },
    { month: 'Jun', sales: 7500 },
  ]
};

const FranchisePartnerDetail: React.FC = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'products' | 'about' | 'reviews'>('products');
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter products
  const filteredProducts = MOCK_PROFILE.products.filter(p => {
      const matchSearch = p.title.toLowerCase().includes(productSearch.toLowerCase());
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      return matchSearch && matchCat;
  });

  const categories = ['All', ...Array.from(new Set(MOCK_PROFILE.products.map(p => p.category)))];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-12">
      
      {/* Dynamic Header / Hero */}
      <div className="relative bg-white shadow-sm">
        {/* Banner */}
        <div className="h-64 w-full overflow-hidden relative">
            <img src={MOCK_PROFILE.banner} alt="Banner" className="w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 relative -mt-20 z-10 pb-6">
            <div className="flex flex-col md:flex-row items-end gap-6">
                {/* Profile Logo */}
                <div className="w-40 h-40 bg-white rounded-2xl shadow-xl p-2 flex-shrink-0">
                    <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center text-4xl font-bold text-white border border-slate-200">
                        {MOCK_PROFILE.logo}
                    </div>
                </div>
                
                {/* Info Block */}
                <div className="flex-1 text-white md:text-slate-800 mb-2">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h1 className="text-3xl font-extrabold">{MOCK_PROFILE.storeName}</h1>
                        <ShieldCheck className="text-blue-500 fill-white" size={24}/>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium opacity-90 md:text-slate-600">
                        <span className="flex items-center gap-1"><MapPin size={14}/> {MOCK_PROFILE.region}</span>
                        <span className="flex items-center gap-1"><Star size={14} className="text-yellow-400 fill-yellow-400"/> {MOCK_PROFILE.rating} ({MOCK_PROFILE.reviewCount} Reviews)</span>
                        <span className="flex items-center gap-1"><Calendar size={14}/> Joined {MOCK_PROFILE.joinedDate}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mb-2 w-full md:w-auto">
                    <button className="flex-1 md:flex-none bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg transition-colors flex items-center justify-center gap-2">
                        <Mail size={18}/> Contact Partner
                    </button>
                    <button className="bg-white hover:bg-gray-50 text-slate-800 border border-gray-200 px-4 py-3 rounded-lg font-bold shadow-sm transition-colors">
                        <Share2 size={18}/>
                    </button>
                </div>
            </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-t border-gray-100">
            <div className="container mx-auto px-4 flex gap-8">
                {['products', 'about', 'reviews'].map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`py-4 font-bold text-sm border-b-2 transition-colors capitalize ${activeTab === tab ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-slate-800'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Sidebar Info */}
          <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Store size={18}/> Store Details</h3>
                  <div className="space-y-4 text-sm">
                      <div className="flex justify-between">
                          <span className="text-gray-500">Owner</span>
                          <span className="font-medium">{MOCK_PROFILE.ownerName}</span>
                      </div>
                      <div className="flex justify-between">
                          <span className="text-gray-500">Business Type</span>
                          <span className="font-medium">Franchise Partner</span>
                      </div>
                      <div className="flex justify-between">
                          <span className="text-gray-500">Total Sales</span>
                          <span className="font-medium text-green-600">{MOCK_PROFILE.totalSales}</span>
                      </div>
                      <div className="flex justify-between">
                          <span className="text-gray-500">Response Time</span>
                          <span className="font-medium">{MOCK_PROFILE.responseTime}</span>
                      </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-100">
                      <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Badges</h4>
                      <div className="flex flex-wrap gap-2">
                          {MOCK_PROFILE.badges.map(badge => (
                              <span key={badge} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded border border-blue-100 font-bold flex items-center gap-1">
                                  <Award size={12}/> {badge}
                              </span>
                          ))}
                      </div>
                  </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="font-bold text-slate-800 mb-4">Contact Info</h3>
                  <ul className="space-y-3 text-sm">
                      <li className="flex items-center gap-3 text-slate-600">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><Phone size={14}/></div>
                          {MOCK_PROFILE.contact.phone}
                      </li>
                      <li className="flex items-center gap-3 text-slate-600">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><Mail size={14}/></div>
                          <span className="truncate">{MOCK_PROFILE.contact.email}</span>
                      </li>
                      <li className="flex items-center gap-3 text-slate-600">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><Globe size={14}/></div>
                          {MOCK_PROFILE.contact.website}
                      </li>
                      <li className="flex items-center gap-3 text-slate-600">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><MapPin size={14}/></div>
                          {MOCK_PROFILE.contact.address}
                      </li>
                  </ul>
              </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
              
              {activeTab === 'products' && (
                  <div className="space-y-6">
                      {/* Filter Bar */}
                      <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row justify-between gap-4">
                          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                              {categories.map(cat => (
                                  <button 
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-slate-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                  >
                                      {cat}
                                  </button>
                              ))}
                          </div>
                          <div className="relative min-w-[200px]">
                              <Search size={16} className="absolute left-3 top-3 text-gray-400"/>
                              <input 
                                type="text" 
                                placeholder="Search store..." 
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500"
                                value={productSearch}
                                onChange={e => setProductSearch(e.target.value)}
                              />
                          </div>
                      </div>

                      {/* Products Grid */}
                      {filteredProducts.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                              {filteredProducts.map(product => (
                                  <div key={product.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all group">
                                      <div className="relative aspect-square bg-gray-100 overflow-hidden">
                                          <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                                          {product.oldPrice && (
                                              <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                                  -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                                              </span>
                                          )}
                                          <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                              <button className="bg-white text-slate-800 p-2 rounded-full shadow hover:text-orange-500"><Heart size={16}/></button>
                                              <button className="bg-white text-slate-800 p-2 rounded-full shadow hover:text-orange-500"><ShoppingCart size={16}/></button>
                                          </div>
                                      </div>
                                      <div className="p-4">
                                          <div className="text-xs text-gray-500 mb-1">{product.category}</div>
                                          <h3 className="font-bold text-slate-800 mb-2 line-clamp-2 h-10 group-hover:text-orange-600 transition-colors">{product.title}</h3>
                                          <div className="flex items-end justify-between">
                                              <div>
                                                  <div className="flex items-center gap-2">
                                                      <span className="text-lg font-bold text-slate-900">${product.price}</span>
                                                      {product.oldPrice && <span className="text-xs text-gray-400 line-through">${product.oldPrice}</span>}
                                                  </div>
                                                  <div className="text-xs text-gray-500 mt-1">{product.sales} sold</div>
                                              </div>
                                              <div className="flex items-center gap-1 text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded">
                                                  <Star size={10} fill="currentColor"/> {product.rating}
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      ) : (
                          <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
                              <Package size={48} className="mx-auto text-gray-300 mb-4"/>
                              <h3 className="text-lg font-bold text-slate-700">No products found</h3>
                              <p className="text-gray-500">Try adjusting your category or search terms.</p>
                          </div>
                      )}
                  </div>
              )}

              {activeTab === 'about' && (
                  <div className="space-y-8 animate-fade-in">
                      <div className="bg-white rounded-xl border border-gray-200 p-8">
                          <h3 className="text-xl font-bold text-slate-800 mb-4">About {MOCK_PROFILE.storeName}</h3>
                          <p className="text-gray-600 leading-relaxed mb-6">
                              {MOCK_PROFILE.description}
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                              <div className="p-4 bg-gray-50 rounded-lg">
                                  <div className="text-2xl font-bold text-blue-600">{MOCK_PROFILE.products.length}</div>
                                  <div className="text-xs text-gray-500 uppercase font-bold mt-1">Products</div>
                              </div>
                              <div className="p-4 bg-gray-50 rounded-lg">
                                  <div className="text-2xl font-bold text-green-600">{MOCK_PROFILE.rating}</div>
                                  <div className="text-xs text-gray-500 uppercase font-bold mt-1">Rating</div>
                              </div>
                              <div className="p-4 bg-gray-50 rounded-lg">
                                  <div className="text-2xl font-bold text-purple-600">{MOCK_PROFILE.joinedDate.split(' ')[1]}</div>
                                  <div className="text-xs text-gray-500 uppercase font-bold mt-1">Since</div>
                              </div>
                              <div className="p-4 bg-gray-50 rounded-lg">
                                  <div className="text-2xl font-bold text-orange-600">{MOCK_PROFILE.responseTime}</div>
                                  <div className="text-xs text-gray-500 uppercase font-bold mt-1">Response</div>
                              </div>
                          </div>
                      </div>

                      {/* Performance Chart (Simulated) */}
                      <div className="bg-white rounded-xl border border-gray-200 p-8">
                          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                              <TrendingUp size={20} className="text-blue-500"/> Performance Growth
                          </h3>
                          <div className="h-64 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                  <BarChart data={MOCK_PROFILE.performance}>
                                      <XAxis dataKey="month" fontSize={12}/>
                                      <Tooltip 
                                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                                        cursor={{fill: '#f1f5f9'}}
                                      />
                                      <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Monthly Sales ($)"/>
                                  </BarChart>
                              </ResponsiveContainer>
                          </div>
                      </div>
                  </div>
              )}

              {activeTab === 'reviews' && (
                  <div className="bg-white rounded-xl border border-gray-200 p-8 animate-fade-in">
                      <div className="flex items-center justify-between mb-8">
                          <h3 className="text-xl font-bold text-slate-800">Customer Reviews</h3>
                          <div className="flex items-center gap-2">
                              <span className="text-4xl font-bold text-slate-800">{MOCK_PROFILE.rating}</span>
                              <div className="text-sm text-gray-500">
                                  <div className="flex text-yellow-400">
                                      {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="currentColor"/>)}
                                  </div>
                                  <div>Based on {MOCK_PROFILE.reviewCount} reviews</div>
                              </div>
                          </div>
                      </div>

                      <div className="space-y-6">
                          {MOCK_PROFILE.reviews.map(review => (
                              <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                  <div className="flex justify-between items-start mb-2">
                                      <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                              {review.user.charAt(0)}
                                          </div>
                                          <div>
                                              <div className="font-bold text-slate-800 text-sm">{review.user}</div>
                                              <div className="flex text-orange-500 text-xs">
                                                  {[...Array(5)].map((_, i) => (
                                                      <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-gray-300"}/>
                                                  ))}
                                              </div>
                                          </div>
                                      </div>
                                      <span className="text-xs text-gray-400 flex items-center gap-1">
                                          <Clock size={12}/> {review.date}
                                      </span>
                                  </div>
                                  <p className="text-gray-600 text-sm ml-13 pl-13">{review.comment}</p>
                              </div>
                          ))}
                      </div>
                  </div>
              )}

          </div>
      </div>
    </div>
  );
};

export default FranchisePartnerDetail;
