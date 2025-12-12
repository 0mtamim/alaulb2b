
import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Clock, Award, CheckCircle, Factory, MessageSquare, Video, Upload, X, Download, Eye, Globe, FileCheck, Calendar, DollarSign, Briefcase, TrendingUp, Bot, Send, Sparkles, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';
import { SupplierProfileDetails, Certificate } from '../types';
import { auditSupplier } from '../services/gemini';

// Mock Supplier Data
const MOCK_SUPPLIER: SupplierProfileDetails = {
  id: 's1',
  name: "Shenzhen Tech Industries Ltd.",
  country: "China",
  verified: true,
  yearsActive: 12,
  responseRate: "98%",
  logo: "ST",
  mainProducts: ["Hydraulics", "CNC Machines", "IoT Sensors"],
  bannerImage: "https://picsum.photos/1200/300?grayscale",
  businessType: ["Manufacturer", "Trading Company"], // Updated to array
  totalEmployees: "101-500 People",
  totalRevenue: "$50 Million - $100 Million",
  certs: ["ISO 9001", "CE", "RoHS", "UL"],
  detailedCerts: [
    { 
      name: "ISO 9001:2015 Quality Management System", 
      issuer: "SGS United Kingdom Ltd", 
      issueDate: "2022-01-15", 
      expiryDate: "2025-01-14", 
      image: "https://via.placeholder.com/600x800?text=ISO+9001+Certificate+Image" 
    },
    { 
      name: "CE Declaration of Conformity - Machinery", 
      issuer: "EU Notified Body", 
      issueDate: "2021-06-20", 
      expiryDate: "2026-06-20", 
      image: "https://via.placeholder.com/600x800?text=CE+Certificate+Image" 
    },
    { 
      name: "RoHS Compliance Certificate", 
      issuer: "Intertek Testing Services", 
      issueDate: "2023-03-10", 
      expiryDate: "2024-03-09", 
      image: "https://via.placeholder.com/600x800?text=RoHS+Certificate+Image" 
    },
    { 
      name: "UL Safety Certification", 
      issuer: "Underwriters Laboratories", 
      issueDate: "2020-11-05", 
      expiryDate: "2025-11-05", 
      image: "https://via.placeholder.com/600x800?text=UL+Certificate+Image" 
    }
  ],
  factoryImages: [
    "https://picsum.photos/400/300?random=101",
    "https://picsum.photos/400/300?random=102",
    "https://picsum.photos/400/300?random=103"
  ],
  factoryVideo: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  mainMarkets: [
    { region: "North America", percentage: 40 },
    { region: "Western Europe", percentage: 30 },
    { region: "Domestic", percentage: 30 }
  ],
  capabilities: [
    { label: "R&D Capacity", score: 90 },
    { label: "Production Speed", score: 85 },
    { label: "Quality Control", score: 95 }
  ],
  aboutUs: "Shenzhen Tech Industries is a premier manufacturer specializing in high-precision industrial machinery. Established in 2012, we serve over 500 enterprise clients globally. Our 20,000 sq. meter facility is equipped with state-of-the-art German CNC lines."
};

// Mock Analytics Data
const PERFORMANCE_DATA = [
  { name: 'Jan', views: 4000, inquiries: 240 },
  { name: 'Feb', views: 3000, inquiries: 139 },
  { name: 'Mar', views: 2000, inquiries: 980 },
  { name: 'Apr', views: 2780, inquiries: 390 },
  { name: 'May', views: 1890, inquiries: 480 },
  { name: 'Jun', views: 2390, inquiries: 380 },
];

const PRICE_TREND_DATA = [
  { month: 'Jan', 'Hydraulic Pump': 120, 'CNC Parts': 135, 'IoT Sensor': 45 },
  { month: 'Feb', 'Hydraulic Pump': 118, 'CNC Parts': 134, 'IoT Sensor': 44 },
  { month: 'Mar', 'Hydraulic Pump': 122, 'CNC Parts': 138, 'IoT Sensor': 46 },
  { month: 'Apr', 'Hydraulic Pump': 125, 'CNC Parts': 142, 'IoT Sensor': 48 },
  { month: 'May', 'Hydraulic Pump': 124, 'CNC Parts': 140, 'IoT Sensor': 47 },
  { month: 'Jun', 'Hydraulic Pump': 121, 'CNC Parts': 136, 'IoT Sensor': 45 },
];

const MARKET_PIE_DATA = [
  { name: 'North America', value: 40 },
  { name: 'Western Europe', value: 30 },
  { name: 'Domestic (China)', value: 20 },
  { name: 'Southeast Asia', value: 10 },
];

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6'];

const PRODUCTS_TAB_DATA = [
  { id: 1, name: "Hydraulic Pump 5000 PSI High Pressure", image: "https://picsum.photos/100/100?random=21", views: "12.5k", inquiries: 450, conversion: "3.6%", price: "$120.00 - $150.00" },
  { id: 2, name: "CNC Milling Axis-5 Precision Part", image: "https://picsum.photos/100/100?random=22", views: "8.2k", inquiries: 120, conversion: "1.5%", price: "$25,000" },
  { id: 3, name: "IoT Sensor Module Long Range", image: "https://picsum.photos/100/100?random=23", views: "15.1k", inquiries: 890, conversion: "5.9%", price: "$15.00 - $22.00" },
  { id: 4, name: "Industrial Valve Set Stainless Steel", image: "https://picsum.photos/100/100?random=24", views: "5.4k", inquiries: 210, conversion: "2.8%", price: "$45.00" },
  { id: 5, name: "Heavy Duty Conveyor Belt System", image: "https://picsum.photos/100/100?random=25", views: "9.1k", inquiries: 330, conversion: "4.1%", price: "$1,200 / Meter" },
];

const SupplierProfile: React.FC = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'home' | 'products' | 'analytics' | 'certificates' | 'profile'>('home');
  const [auditReport, setAuditReport] = useState<any>(null);
  const [loadingAudit, setLoadingAudit] = useState(false);
  const [viewingCert, setViewingCert] = useState<Certificate | null>(null);
  
  // State for Video
  const [factoryVideo, setFactoryVideo] = useState<string | undefined>(MOCK_SUPPLIER.factoryVideo);

  // Chat State
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{sender: string, text: string}[]>([
      {sender: 'supplier', text: 'Welcome to Shenzhen Tech! How can we assist with your sourcing needs today?'}
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (showChat) {
        scrollToBottom();
    }
  }, [chatHistory, showChat]);

  const runAudit = async () => {
    setLoadingAudit(true);
    const report = await auditSupplier(MOCK_SUPPLIER);
    setAuditReport(report);
    setLoadingAudit(false);
  };

  const handleVideoUpload = () => {
      // Simulate file upload or link embedding
      const input = window.prompt("Enter a video URL (MP4) to embed, or leave empty to simulate a file upload:", factoryVideo || "");
      
      if (input) {
          setFactoryVideo(input);
      } else if (input === "") {
          // Simulate file upload interaction
          const confirmUpload = window.confirm("Simulate uploading 'factory_tour_hd.mp4' from your computer?");
          if (confirmUpload) {
             // Mock upload URL
             setFactoryVideo("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4");
          }
      }
  };

  const handleVerifyClick = () => {
      // Simulate verification initiation for the supplier owner
      const isConfirmed = window.confirm(
          "Initiate Supplier Verification Process?\n\nYou will be redirected to the secure document upload portal to submit your Business License and Tax Registration."
      );
      
      if (isConfirmed) {
          // Simulate API call/redirect delay
          setTimeout(() => {
              alert("Verification process initiated successfully! Please check your registered email for the upload link.");
          }, 500);
      }
  };

  const handleContactProduct = (productName: string) => {
      setChatHistory([
          {sender: 'supplier', text: 'Welcome to Shenzhen Tech! How can we assist with your sourcing needs today?'},
          {sender: 'user', text: `Hi, I am interested in inquiring about: ${productName}`}
      ]);
      setShowChat(true);
  };

  const handleSendMessage = () => {
    if(!chatInput.trim()) return;
    const userMsg = {sender: 'user', text: chatInput};
    setChatHistory(prev => [...prev, userMsg]);
    setChatInput('');
    
    // Simulate auto-reply
    setTimeout(() => {
        setChatHistory(prev => [...prev, {sender: 'supplier', text: "Thanks for your inquiry. A sales representative will be with you shortly."}]);
    }, 1000);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Hero / Banner */}
      <div className="relative h-64 bg-slate-900 w-full overflow-hidden">
        <img src={MOCK_SUPPLIER.bannerImage} alt="Banner" className="w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full container mx-auto px-4 pb-6 flex items-end gap-6">
          <div className="w-32 h-32 bg-white rounded-xl shadow-2xl flex items-center justify-center text-4xl font-extrabold text-slate-800 border-4 border-white transform translate-y-4 z-10">
            {MOCK_SUPPLIER.logo}
          </div>
          <div className="text-white mb-2 flex-1">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              {MOCK_SUPPLIER.name} 
              {MOCK_SUPPLIER.verified && <ShieldCheck className="text-orange-500" fill="white" />}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300 mt-2">
              <span className="flex items-center gap-1"><MapPin size={14}/> {MOCK_SUPPLIER.country}</span>
              <div className="flex items-center gap-1">
                  <Briefcase size={14}/> 
                  <div className="flex gap-1">
                      {MOCK_SUPPLIER.businessType.map(t => t).join(', ')}
                  </div>
              </div>
              <span className="flex items-center gap-1"><Clock size={14}/> {MOCK_SUPPLIER.yearsActive} Years Active</span>
              <span className="flex items-center gap-1"><MessageSquare size={14}/> {MOCK_SUPPLIER.responseRate} Response Rate</span>
            </div>
          </div>
          <div className="flex gap-3 mb-2">
            <button 
                onClick={() => setShowChat(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-bold transition-colors shadow-lg"
            >
                Contact Supplier
            </button>
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur text-white border border-white/30 px-6 py-2 rounded-full font-bold transition-colors">Follow</button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-[64px] z-30">
        <div className="container mx-auto px-4 flex gap-8 overflow-x-auto pl-40 lg:pl-4">
          {['home', 'products', 'analytics', 'certificates', 'profile'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`py-4 font-medium text-sm capitalize border-b-2 transition-colors whitespace-nowrap ${activeTab === tab ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar Info */}
        <div className="lg:col-span-1 space-y-6">
           {/* Trust Audit Widget */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <div className="flex items-center gap-2 font-bold text-slate-800 mb-4">
                <Bot className="text-purple-600" /> AI Trust Audit
             </div>
             {!auditReport ? (
               <div className="text-center py-4">
                 <p className="text-xs text-gray-500 mb-4">Let Gemini AI analyze this supplier's history and risk profile.</p>
                 <button onClick={runAudit} disabled={loadingAudit} className="w-full bg-purple-100 text-purple-700 font-bold text-xs py-2 rounded hover:bg-purple-200">
                   {loadingAudit ? 'Analyzing...' : 'Generate Report'}
                 </button>
               </div>
             ) : (
               <div className="animate-fade-in">
                 <div className="flex justify-between items-end mb-2">
                   <span className="text-sm text-gray-600">Trust Score</span>
                   <span className="text-2xl font-bold text-purple-600">{auditReport.score}/100</span>
                 </div>
                 <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div className="bg-purple-600 h-2 rounded-full" style={{width: `${auditReport.score}%`}}></div>
                 </div>
                 <p className="text-xs text-gray-600 italic mb-3">"{auditReport.summary}"</p>
                 <div className="space-y-1">
                    {auditReport.pros.map((p:string, i:number) => (
                      <div key={i} className="flex gap-2 text-xs text-green-700 items-center"><CheckCircle size={10}/> {p}</div>
                    ))}
                 </div>
               </div>
             )}
           </div>

           {/* Supplier Verification Section (Simulated for Owner/Admin View) */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <FileText size={18} className="text-blue-600"/> Supplier Verification
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                    {MOCK_SUPPLIER.verified 
                        ? "Your business is verified. Ensure your documents are up-to-date to maintain this status." 
                        : "Verify your business to gain buyer trust and unlock premium features."}
                </p>
                <div className="flex items-center gap-2 mb-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${MOCK_SUPPLIER.verified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {MOCK_SUPPLIER.verified ? 'Status: Verified' : 'Status: Unverified'}
                    </span>
                    {MOCK_SUPPLIER.verified && <CheckCircle size={14} className="text-green-600"/>}
                </div>
                <button 
                    onClick={handleVerifyClick}
                    className="w-full bg-slate-900 text-white py-2 rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                    {MOCK_SUPPLIER.verified ? 'Update Documents' : 'Start Verification'}
                </button>
           </div>

           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-slate-800 mb-4">Business Info</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex justify-between items-start">
                  <span className="text-gray-500 mt-0.5">Business Type</span>
                  <div className="text-right flex flex-col items-end gap-1">
                      {MOCK_SUPPLIER.businessType.map((type, idx) => (
                          <Link 
                            to={`/suppliers?businessType=${encodeURIComponent(type.trim())}`} 
                            key={idx} 
                            className="font-medium text-slate-800 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 text-xs hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 transition-colors"
                          >
                              {type.trim()}
                          </Link>
                      ))}
                  </div>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-500">Employees</span>
                  <span className="text-gray-900 font-medium">{MOCK_SUPPLIER.totalEmployees}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-500">Revenue</span>
                  <span className="text-gray-900 font-medium">{MOCK_SUPPLIER.totalRevenue}</span>
                </li>
              </ul>
           </div>
        </div>

        {/* Center Content */}
        <div className="lg:col-span-3 space-y-8">
          
          {activeTab === 'home' && (
            <div className="space-y-8 animate-fade-in">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Company Overview</h2>
                <p className="text-gray-600 leading-relaxed mb-8">{MOCK_SUPPLIER.aboutUs}</p>
                
                <div>
                   <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2 text-lg">
                      <Factory size={20} className="text-orange-500"/> Factory Tour & Media
                   </h3>
                   <div className="mb-8">
                       <div className="flex justify-between items-center mb-3">
                           <h4 className="font-bold text-slate-700 flex items-center gap-2 text-sm">
                               <Video size={16} className="text-blue-500"/> Introduction Video
                           </h4>
                           <button onClick={handleVideoUpload} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors border border-gray-200 font-medium">
                               <Upload size={14}/> Update Video
                           </button>
                       </div>
                       <div className="aspect-video w-full bg-slate-900 rounded-xl overflow-hidden shadow-sm relative group border border-gray-200">
                           {factoryVideo ? (
                               <video src={factoryVideo} className="w-full h-full object-cover" controls poster={MOCK_SUPPLIER.bannerImage}>
                                   Your browser does not support the video tag.
                               </video>
                           ) : (
                               <div className="flex flex-col items-center justify-center h-full text-slate-500 bg-slate-50">
                                   <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm">
                                     <Video size={32} className="opacity-20 text-slate-400"/>
                                   </div>
                                   <p className="text-sm font-medium">No video uploaded yet.</p>
                                   <p className="text-xs text-slate-400 mt-1">Upload a factory tour to build trust.</p>
                               </div>
                           )}
                       </div>
                   </div>
                   <div>
                       <h4 className="font-bold text-slate-700 mb-3 text-sm flex items-center gap-2">
                           <Sparkles size={16} className="text-yellow-500"/> Facility Images
                       </h4>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         {MOCK_SUPPLIER.factoryImages.map((img, i) => (
                           <div key={i} className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer border border-gray-100 hover:shadow-md transition-all">
                             <img src={img} alt="Factory" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
                             <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                 <Eye className="text-white opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0" size={24}/>
                             </div>
                           </div>
                         ))}
                       </div>
                   </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100">
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {MOCK_SUPPLIER.certs.map(cert => (
                        <div key={cert} className="border border-gray-200 rounded p-3 flex flex-col items-center justify-center text-center hover:border-orange-200 transition-colors bg-gray-50">
                           <Award className="text-orange-500 mb-2" size={24}/>
                           <span className="text-xs font-bold text-gray-700">{cert}</span>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-slate-800 mb-6">Trade Capabilities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div>
                      <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Main Markets</h3>
                      <div className="space-y-3">
                         {MOCK_SUPPLIER.mainMarkets.map((m, i) => (
                           <div key={i}>
                             <div className="flex justify-between text-sm mb-1">
                               <span>{m.region}</span>
                               <span className="font-bold">{m.percentage}%</span>
                             </div>
                             <div className="w-full bg-gray-100 rounded-full h-2">
                               <div className="bg-blue-500 h-2 rounded-full" style={{width: `${m.percentage}%`}}></div>
                             </div>
                           </div>
                         ))}
                      </div>
                   </div>
                   <div>
                      <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Performance Score</h3>
                      <div className="space-y-4">
                         {MOCK_SUPPLIER.capabilities.map((c, i) => (
                           <div key={i} className="flex items-center gap-4">
                              <span className="w-32 text-sm text-gray-700">{c.label}</span>
                              <div className="flex-1 flex gap-1">
                                 {[...Array(5)].map((_, idx) => (
                                    <div key={idx} className={`h-2 flex-1 rounded-sm ${idx < (c.score/20) ? 'bg-orange-400' : 'bg-gray-200'}`}></div>
                                 ))}
                              </div>
                              <span className="text-sm font-bold w-8">{c.score}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 animate-fade-in">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                        <tr>
                            <th className="px-6 py-4">Product</th>
                            <th className="px-6 py-4">Views</th>
                            <th className="px-6 py-4">Inquiries</th>
                            <th className="px-6 py-4">Conversion</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {PRODUCTS_TAB_DATA.map(p => (
                            <tr key={p.id} className="border-b border-gray-100 hover:bg-slate-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <img src={p.image} className="w-12 h-12 rounded object-cover"/>
                                        <span className="font-bold text-slate-800">{p.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-medium text-slate-600">{p.views}</td>
                                <td className="px-6 py-4 font-medium text-slate-600">{p.inquiries}</td>
                                <td className="px-6 py-4 font-bold text-green-600">{p.conversion}</td>
                                <td className="px-6 py-4 font-medium text-slate-600">{p.price}</td>
                                <td className="px-6 py-4">
                                    <button onClick={() => handleContactProduct(p.name)} className="bg-orange-500 text-white text-xs px-3 py-1.5 rounded font-bold hover:bg-orange-600">
                                        Inquire
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          )}
          
          {activeTab === 'analytics' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-fade-in space-y-12">
                <section>
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><TrendingUp className="text-blue-500"/> Traffic & Engagement</h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer>
                            <BarChart data={PERFORMANCE_DATA}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" fontSize={12} />
                                <YAxis fontSize={12} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="views" fill="#3b82f6" name="Product Views" />
                                <Bar dataKey="inquiries" fill="#f97316" name="Inquiries" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </section>
                <section>
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><DollarSign className="text-green-500"/> Product Price Trends</h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer>
                            <LineChart data={PRICE_TREND_DATA}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" fontSize={12}/>
                                <YAxis fontSize={12} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="Hydraulic Pump" stroke="#f97316" />
                                <Line type="monotone" dataKey="CNC Parts" stroke="#3b82f6" />
                                <Line type="monotone" dataKey="IoT Sensor" stroke="#10b981" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </section>
                <section>
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><Globe className="text-purple-500"/> Market Distribution</h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer>
                           <PieChart>
                               <Pie data={MARKET_PIE_DATA} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                   {MARKET_PIE_DATA.map((entry, index) => (
                                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                   ))}
                               </Pie>
                               <Tooltip/>
                               <Legend/>
                           </PieChart>
                        </ResponsiveContainer>
                    </div>
                </section>
            </div>
          )}

          {activeTab === 'certificates' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-fade-in">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><FileCheck className="text-green-500"/> Certifications & Compliance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {MOCK_SUPPLIER.detailedCerts.map((cert, idx) => (
                        <div key={idx} className="border border-gray-200 rounded-lg p-6 flex flex-col hover:border-blue-300 transition-all">
                            <div className="flex-1 mb-4">
                                <Award size={24} className="text-yellow-500 mb-3"/>
                                <h4 className="font-bold text-slate-800">{cert.name}</h4>
                                <p className="text-xs text-slate-500 mt-1">Issued by: {cert.issuer}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-xs border-t border-gray-100 pt-4">
                                <div><span className="font-bold text-slate-500 block">Issue Date</span> {cert.issueDate}</div>
                                <div><span className="font-bold text-slate-500 block">Expiry Date</span> {cert.expiryDate}</div>
                            </div>
                            <button onClick={() => setViewingCert(cert)} className="w-full mt-4 text-sm text-blue-600 font-bold border border-blue-200 rounded py-2 hover:bg-blue-50 transition-colors">
                                View Certificate
                            </button>
                        </div>
                    ))}
                </div>
            </div>
          )}
          
          {activeTab === 'profile' && (
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-fade-in space-y-10">
                <section>
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Briefcase className="text-blue-500"/> Company Details
                    </h3>
                    <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                            <div className="p-0">
                                <div className="flex justify-between p-4 border-b border-gray-100">
                                    <span className="text-gray-500 text-sm">Company Name</span>
                                    <span className="font-medium text-sm text-slate-800">{MOCK_SUPPLIER.name}</span>
                                </div>
                                <div className="flex justify-between p-4 border-b border-gray-100">
                                    <span className="text-gray-500 text-sm">Business Type</span>
                                    <span className="font-medium text-sm text-slate-800 text-right">{MOCK_SUPPLIER.businessType.join(', ')}</span>
                                </div>
                                <div className="flex justify-between p-4 border-b border-gray-100 md:border-b-0">
                                    <span className="text-gray-500 text-sm">Country / Region</span>
                                    <span className="font-medium text-sm text-slate-800">{MOCK_SUPPLIER.country}</span>
                                </div>
                            </div>
                            <div className="p-0">
                                <div className="flex justify-between p-4 border-b border-gray-100">
                                    <span className="text-gray-500 text-sm">Total Employees</span>
                                    <span className="font-medium text-sm text-slate-800">{MOCK_SUPPLIER.totalEmployees}</span>
                                </div>
                                <div className="flex justify-between p-4 border-b border-gray-100">
                                    <span className="text-gray-500 text-sm">Year Established</span>
                                    <span className="font-medium text-sm text-slate-800">{new Date().getFullYear() - MOCK_SUPPLIER.yearsActive}</span>
                                </div>
                                <div className="flex justify-between p-4">
                                    <span className="text-gray-500 text-sm">Total Annual Revenue</span>
                                    <span className="font-medium text-sm text-slate-800">{MOCK_SUPPLIER.totalRevenue}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
             </div>
          )}

        </div>
      </div>

      {/* Certificate Viewer Modal */}
      {viewingCert && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 animate-fade-in" onClick={() => setViewingCert(null)}>
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full relative" onClick={e => e.stopPropagation()}>
                <button onClick={() => setViewingCert(null)} className="absolute -top-4 -right-4 bg-white text-slate-600 rounded-full p-2 shadow-lg hover:bg-red-500 hover:text-white transition-all"><X/></button>
                <div className="p-6 border-b border-gray-200">
                    <h3 className="font-bold text-lg">{viewingCert.name}</h3>
                    <p className="text-xs text-gray-500">Issued by: {viewingCert.issuer}</p>
                </div>
                <div className="p-6">
                    <img src={viewingCert.image} alt={viewingCert.name} className="w-full h-auto object-contain max-h-[70vh] rounded"/>
                </div>
            </div>
        </div>
      )}

      {/* Chat Modal */}
      {showChat && (
        <div className="fixed bottom-4 right-4 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden animate-fade-in-up" style={{height: '500px'}}>
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center"><h3 className="font-bold text-sm">Contact Supplier</h3><button onClick={() => setShowChat(false)}><X size={16}/></button></div>
            <div ref={messagesEndRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
                {chatHistory.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-3 rounded-lg text-sm ${msg.sender === 'user' ? 'bg-orange-500 text-white' : 'bg-white border'}`}>{msg.text}</div>
                    </div>
                ))}
            </div>
            <div className="p-3 border-t bg-white flex gap-2">
                <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendMessage()} className="flex-1 p-2 border rounded" placeholder="Type your message..."/>
                <button onClick={handleSendMessage} className="bg-orange-500 text-white px-4 rounded font-bold"><Send size={16}/></button>
            </div>
        </div>
      )}

    </div>
  );
};

export default SupplierProfile;
