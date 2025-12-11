
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  LayoutDashboard, Package, TrendingUp, Users, Ship, ShieldCheck, 
  Settings, Bot, Globe, FileText, ChevronRight, Bell, Search, Sparkles, Truck, AlertTriangle, Download, Printer, Plus, MoreHorizontal, Mail, Phone, Trash2, Edit, CheckCircle, Clock, Briefcase, Lock, AlertOctagon, Activity, Server, Ban, Eye, Scale, DollarSign, Map, Gavel, FilePlus, BadgeCheck, Megaphone, Target, BarChart2, Terminal, Code, Database, Key, Play, ToggleLeft, ToggleRight, Save, RefreshCw, UserPlus, Anchor, GitCommit, UploadCloud, ClipboardCheck, ShoppingBag, BookOpen, AlertCircle, CreditCard, Flag, Languages, HelpCircle, Layers, FolderTree, MessageSquare, X, ChevronUp, ChevronDown, PenTool, Gem, UserCheck, Briefcase as BriefcaseIcon, Factory, Calendar, Ticket, Send, Radio, Umbrella, PenTool as PenToolIcon, Grid, Star, Navigation, Filter, User, Store, Share2, Building2, Check, XCircle, MapPin, Copy, FileCheck, FileSearch, History, MessageCircle, ArrowRight, Cpu, Tag
} from 'lucide-react';
import { UserRole, Shipment, LogisticsQuote, LogisticsFleet, FranchisePartner, FranchiseProduct, Invoice, BusinessListing, InvestorProfile, EventRequest, EventListing, AdminProduct, ContentReport, InsurancePolicy, InsuranceClaim, CPDProject, VerificationRequest, DisputeCase, RFQ, Order, DeveloperLog, FeatureFlag } from '../types';
import { 
  predictLogisticsDelay,
  generateFranchiseMarketing,
  generateFranchiseContract,
  analyzeFinancialTrends,
  generateEventConcept,
  analyzeDocument,
  analyzeDispute,
  generateProductDescription,
  getMarketInsights,
  analyzeSystemLog,
  suggestCodeFix
} from '../services/gemini';
import { Link } from 'react-router-dom';
import { useModules, ModuleKey } from '../contexts/ModuleContext';
import { useLanguage } from '../contexts/LanguageContext';

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick, badge, className }: { icon: any, label: string, active: boolean, onClick: () => void, badge?: string | number, className?: string }) => (
  <button 
     onClick={onClick}
     className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1 ${active ? 'bg-orange-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'} ${className}`}
  >
     <div className="flex items-center gap-3">
        <Icon size={18}/>
        {label}
     </div>
     {badge && <span className="bg-orange-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">{badge}</span>}
  </button>
);

const StatCard = ({ title, value, change, icon: Icon, color }: { title: string, value: string, change: string, icon: any, color: string }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
        <div>
            <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
            <p className={`text-xs font-bold mt-2 ${change.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>{change} from last month</p>
        </div>
        <div className={`p-3 rounded-lg ${color} text-white shadow-md`}>
            <Icon size={24}/>
        </div>
    </div>
);

// Mock details for inspection
const MOCK_INSPECT_DETAILS = {
    images: ['https://picsum.photos/400/400?random=1', 'https://picsum.photos/400/400?random=2'],
    tiers: [
        { min: 10, max: 50, price: 120 },
        { min: 51, max: 200, price: 110 },
        { min: 201, max: null, price: 95 }
    ],
    specs: {
        "Material": "Stainless Steel 304",
        "Voltage": "220V",
        "Warranty": "2 Years",
        "Certification": "CE, ISO9001"
    },
    logistics: {
        leadTime: "15 Days",
        packaging: "Wooden Crate",
        weight: "45kg"
    }
};

const Dashboard: React.FC = () => {
  // --- Global State ---
  const { modules, toggleModule } = useModules();
  const { t } = useLanguage();
  
  // Extended role types for Sub-Admin simulation
  const [role, setRole] = useState<string>('admin');
  const [activeTab, setActiveTab] = useState('overview');
  
  // --- Admin Tab State ---
  const [marketAdminTab, setMarketAdminTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  
  // --- CRUD State ---
  const [isCrudModalOpen, setIsCrudModalOpen] = useState(false);
  const [crudMode, setCrudMode] = useState<'add' | 'edit'>('add');
  const [editingItem, setEditingItem] = useState<any>({});
  const [activeCrudSection, setActiveCrudSection] = useState<string>('');

  // --- Data States (with setters for CRUD) ---
  const [users, setUsers] = useState([
      { id: 'u1', name: 'John Doe', role: 'Buyer', status: 'Active', country: 'USA', email: 'john@example.com' },
      { id: 'u2', name: 'Shenzhen Tech', role: 'Supplier', status: 'Verified', country: 'China', email: 'sales@sztech.cn' },
      { id: 'u3', name: 'Global Traders', role: 'Buyer', status: 'Suspended', country: 'UK', email: 'contact@global.uk' },
  ]);

  const [adminProducts, setAdminProducts] = useState<AdminProduct[]>([
      { id: 'p_new_1', title: 'High-Speed Centrifuge', supplier: 'LabEquip Co', category: 'Machinery', price: 1200, status: 'pending_approval', aiRiskScore: 12 },
      { id: 'p_new_2', title: 'Replica Luxury Watch', supplier: 'FastTrade', category: 'Watches', price: 50, status: 'pending_approval', aiRiskScore: 95 }, 
      { id: 'p_new_3', title: 'Organic Cotton Sheets', supplier: 'EcoTextiles', category: 'Textiles', price: 15, status: 'active', aiRiskScore: 5 },
  ]);

  const [adminOrders, setAdminOrders] = useState([
      { id: 'ORD-2023-001', buyer: 'Global Imports', supplier: 'Shenzhen Tech', total: 12500, status: 'Pending Payment', date: '2023-10-25' },
      { id: 'ORD-2023-002', buyer: 'Berlin Auto', supplier: 'Ningbo Parts', total: 4500, status: 'Shipped', date: '2023-10-24' },
      { id: 'ORD-2023-003', buyer: 'Retail Chain SA', supplier: 'Vietnam Textiles', total: 28000, status: 'Completed', date: '2023-10-20' },
  ]);

  const [adminRFQs, setAdminRFQs] = useState([
      { id: 'RFQ-101', product: 'Cotton T-Shirts', qty: 5000, buyer: 'Fashion Co', status: 'Open', quotes: 12, budget: '$5000' },
      { id: 'RFQ-102', product: 'CNC Machines', qty: 2, buyer: 'Heavy Ind', status: 'Closed', quotes: 5, budget: '$30000' },
  ]);

  const [adminShipments, setAdminShipments] = useState<Shipment[]>([
      { id: 'SH-001', trackingNumber: 'TG-88293', orderId: 'ORD-102', carrier: 'Maersk', origin: 'Shenzhen, CN', destination: 'Los Angeles, US', status: 'In Transit', eta: '2023-11-15', type: 'Ocean', weight: '2400 kg' },
      { id: 'SH-002', trackingNumber: 'TG-99102', orderId: 'ORD-105', carrier: 'DHL', origin: 'Shanghai, CN', destination: 'Berlin, DE', status: 'Customs', eta: '2023-11-10', type: 'Air', weight: '150 kg' }
  ]);

  const [partners, setPartners] = useState<FranchisePartner[]>([
      { id: 'fp1', name: 'Ali Ahmed', email: 'ali@dubaihub.ae', storeName: 'Dubai Tech Hub', region: 'UAE', status: 'Active', totalSales: 45000, commissionRate: 15, joinedDate: '2023-01-10' },
      { id: 'fp2', name: 'Maria Garcia', email: 'm.garcia@madrid.es', storeName: 'Madrid Essentials', region: 'Spain', status: 'Pending', totalSales: 0, commissionRate: 12, joinedDate: '2023-11-01' }
  ]);

  const [investmentListings, setInvestmentListings] = useState<BusinessListing[]>([
      { id: 'BIZ-001', title: 'Profitable SaaS in Fintech', type: 'business_sale', industry: 'Software', location: 'Singapore', askingPrice: 2500000, reportedRevenue: 1200000, ebitda: 450000, description: 'SaaS Platform', status: 'active', isFeatured: true, postedDate: '2023-10-20', image: '' },
      { id: 'BIZ-002', title: 'Textile Manufacturing Unit', type: 'business_sale', industry: 'Manufacturing', location: 'Vietnam', askingPrice: 15000000, reportedRevenue: 8000000, ebitda: 2000000, description: 'Factory', status: 'active', isFeatured: false, postedDate: '2023-10-18', image: '' },
  ]);

  const [adminEvents, setAdminEvents] = useState<EventListing[]>([
      { id: 'ev1', title: 'Global Tech Expo 2024', organizer: 'TradeGenius', type: 'In-Person', location: 'Las Vegas, NV', date: 'Dec 15-18, 2024', bannerImage: '', isPromoted: true, status: 'Upcoming', attendeesCount: 1200 },
      { id: 'ev2', title: 'Sustainable Textiles Summit', organizer: 'GreenAlliance', type: 'Online', location: 'Virtual', date: 'Nov 20, 2024', bannerImage: '', isPromoted: false, status: 'Upcoming', attendeesCount: 450 }
  ]);

  const [adminJobs, setAdminJobs] = useState([
      { id: 'j1', title: 'Procurement Specialist', company: 'Global Imports LLC', status: 'Active', posted: '2023-10-25', applicants: 12, views: 145, isPromoted: true },
      { id: 'j2', title: 'Supply Chain Intern', company: 'LogiTech', status: 'Pending Review', posted: '2023-10-26', applicants: 0, views: 2, isPromoted: false },
  ]);

  const [disputeCases, setDisputeCases] = useState([
    { id: 'd1', orderId: 'ORD-998', claimant: 'Global Imports', respondent: 'Shenzhen Tech', amount: 15000, reason: 'Defective Goods', status: 'Open' },
    { id: 'd2', orderId: 'ORD-776', claimant: 'Berlin Auto', respondent: 'Ningbo Parts', amount: 4500, reason: 'Late Delivery', status: 'Resolved' },
  ]);

  const [verificationQueue, setVerificationQueue] = useState([
    { id: 'v1', supplierName: 'Alpha Mfg', docType: 'Business License', date: '2023-10-28', status: 'Pending' },
    { id: 'v2', supplierName: 'Beta Traders', docType: 'Tax Reg', date: '2023-10-27', status: 'Approved' },
  ]);

  const [cpdProjects, setCpdProjects] = useState([
      { id: 'cpd1', title: 'Smart Water Bottle V2', client: 'HydroSmart', stage: 'Prototyping', status: 'Active', ndaSigned: true },
      { id: 'cpd2', title: 'Solar Backpack Panel', client: 'EcoGear', stage: 'Concept', status: 'Pending Review', ndaSigned: false },
  ]);

  const [insurancePolicies, setInsurancePolicies] = useState([
      { id: 'pol1', holder: 'Global Imports LLC', type: 'Cargo', amount: 50000, premium: 350, status: 'Active' },
      { id: 'pol2', holder: 'Berlin Auto', type: 'Liability', amount: 1000000, premium: 1200, status: 'Expired' },
  ]);

  const [reviewsList, setReviewsList] = useState([
      { id: 'rev1', user: 'John Doe', product: 'Hydraulic Pump', rating: 5, comment: 'Great product!', status: 'Published' },
      { id: 'rev2', user: 'Spam Bot', product: 'Cheap Rolex', rating: 1, comment: 'Click here for free money...', status: 'Flagged' },
  ]);

  const [categoriesList, setCategoriesList] = useState([
      { id: 'cat1', name: 'Machinery', parent: 'None', count: 45200, trend: '+12%' },
      { id: 'cat2', name: 'Electronics', parent: 'None', count: 89000, trend: '+8%' },
      { id: 'cat3', name: 'CNC Machines', parent: 'Machinery', count: 5200, trend: '+15%' },
  ]);

  const [siteSettings, setSiteSettings] = useState({
      siteName: 'TradeGenius AI',
      seoTitle: 'Global B2B Marketplace',
      maintenanceMode: false,
      registrationOpen: true
  });

  const [inspectProduct, setInspectProduct] = useState<AdminProduct | null>(null);

  // --- CRUD Handlers ---

  const openAddModal = (section: string) => {
      setCrudMode('add');
      setEditingItem({});
      setActiveCrudSection(section);
      setIsCrudModalOpen(true);
  };

  const openEditModal = (section: string, item: any) => {
      setCrudMode('edit');
      setEditingItem(item);
      setActiveCrudSection(section);
      setIsCrudModalOpen(true);
  };

  const handleDelete = (section: string, id: string) => {
      if (!window.confirm("Are you sure you want to delete this item?")) return;
      
      switch(section) {
          case 'users': setUsers(prev => prev.filter(i => i.id !== id)); break;
          case 'products': setAdminProducts(prev => prev.filter(i => i.id !== id)); break;
          case 'orders': setAdminOrders(prev => prev.filter(i => i.id !== id)); break;
          case 'rfqs': setAdminRFQs(prev => prev.filter(i => i.id !== id)); break;
          case 'shipments': setAdminShipments(prev => prev.filter(i => i.id !== id)); break;
          case 'partners': setPartners(prev => prev.filter(i => i.id !== id)); break;
          case 'investments': setInvestmentListings(prev => prev.filter(i => i.id !== id)); break;
          case 'events': setAdminEvents(prev => prev.filter(i => i.id !== id)); break;
          case 'jobs': setAdminJobs(prev => prev.filter(i => i.id !== id)); break;
          case 'disputes': setDisputeCases(prev => prev.filter(i => i.id !== id)); break;
          case 'verification': setVerificationQueue(prev => prev.filter(i => i.id !== id)); break;
          case 'cpd': setCpdProjects(prev => prev.filter(i => i.id !== id)); break;
          case 'insurance': setInsurancePolicies(prev => prev.filter(i => i.id !== id)); break;
          case 'content': setReviewsList(prev => prev.filter(i => i.id !== id)); break;
          case 'categories': setCategoriesList(prev => prev.filter(i => i.id !== id)); break;
      }
  };

  const handleCrudSave = (e: React.FormEvent) => {
      e.preventDefault();
      const id = crudMode === 'edit' ? editingItem.id : `${Date.now()}`;
      let newItem = { ...editingItem, id }; 

      // Auto-populate Date fields for new items
      const today = new Date().toISOString().split('T')[0];
      
      if (crudMode === 'add') {
          if (!newItem.date && ['orders', 'shipments', 'events', 'verification', 'disputes', 'content', 'insurance'].includes(activeCrudSection)) newItem.date = today;
          if (!newItem.postedDate && activeCrudSection === 'investments') newItem.postedDate = today;
          if (!newItem.posted && activeCrudSection === 'jobs') newItem.posted = today;
          if (!newItem.joinedDate && activeCrudSection === 'partners') newItem.joinedDate = today;
      }

      // Default Status Handling if missing
      if(activeCrudSection === 'users' && !newItem.status) newItem.status = 'Active';
      if(activeCrudSection === 'products' && !newItem.status) newItem.status = 'active';
      if(activeCrudSection === 'orders' && !newItem.status) newItem.status = 'Pending Payment';
      if(activeCrudSection === 'rfqs' && !newItem.status) newItem.status = 'Open';
      if(activeCrudSection === 'jobs' && !newItem.status) newItem.status = 'Active';
      if(activeCrudSection === 'disputes' && !newItem.status) newItem.status = 'Open';
      if(activeCrudSection === 'verification' && !newItem.status) newItem.status = 'Pending';
      if(activeCrudSection === 'cpd' && !newItem.status) newItem.status = 'Active';
      if(activeCrudSection === 'insurance' && !newItem.status) newItem.status = 'Active';
      if(activeCrudSection === 'content' && !newItem.status) newItem.status = 'Published';
      if(activeCrudSection === 'partners' && !newItem.status) newItem.status = 'Active';
      if(activeCrudSection === 'shipments' && !newItem.status) newItem.status = 'Scheduled';
      if(activeCrudSection === 'events' && !newItem.status) newItem.status = 'Upcoming';

      if (crudMode === 'add') {
           switch(activeCrudSection) {
              case 'users': setUsers(prev => [...prev, newItem]); break;
              case 'products': setAdminProducts(prev => [...prev, newItem]); break;
              case 'orders': setAdminOrders(prev => [...prev, newItem]); break;
              case 'rfqs': setAdminRFQs(prev => [...prev, newItem]); break;
              case 'shipments': setAdminShipments(prev => [...prev, newItem]); break;
              case 'partners': setPartners(prev => [...prev, newItem]); break;
              case 'investments': setInvestmentListings(prev => [...prev, newItem]); break;
              case 'events': setAdminEvents(prev => [...prev, newItem]); break;
              case 'jobs': setAdminJobs(prev => [...prev, newItem]); break;
              case 'disputes': setDisputeCases(prev => [...prev, newItem]); break;
              case 'verification': setVerificationQueue(prev => [...prev, newItem]); break;
              case 'cpd': setCpdProjects(prev => [...prev, newItem]); break;
              case 'insurance': setInsurancePolicies(prev => [...prev, newItem]); break;
              case 'content': setReviewsList(prev => [...prev, newItem]); break;
              case 'categories': setCategoriesList(prev => [...prev, newItem]); break;
           }
      } else {
           switch(activeCrudSection) {
              case 'users': setUsers(prev => prev.map(i => i.id === id ? newItem : i)); break;
              case 'products': setAdminProducts(prev => prev.map(i => i.id === id ? newItem : i)); break;
              case 'orders': setAdminOrders(prev => prev.map(i => i.id === id ? newItem : i)); break;
              case 'rfqs': setAdminRFQs(prev => prev.map(i => i.id === id ? newItem : i)); break;
              case 'shipments': setAdminShipments(prev => prev.map(i => i.id === id ? newItem : i)); break;
              case 'partners': setPartners(prev => prev.map(i => i.id === id ? newItem : i)); break;
              case 'investments': setInvestmentListings(prev => prev.map(i => i.id === id ? newItem : i)); break;
              case 'events': setAdminEvents(prev => prev.map(i => i.id === id ? newItem : i)); break;
              case 'jobs': setAdminJobs(prev => prev.map(i => i.id === id ? newItem : i)); break;
              case 'disputes': setDisputeCases(prev => prev.map(i => i.id === id ? newItem : i)); break;
              case 'verification': setVerificationQueue(prev => prev.map(i => i.id === id ? newItem : i)); break;
              case 'cpd': setCpdProjects(prev => prev.map(i => i.id === id ? newItem : i)); break;
              case 'insurance': setInsurancePolicies(prev => prev.map(i => i.id === id ? newItem : i)); break;
              case 'content': setReviewsList(prev => prev.map(i => i.id === id ? newItem : i)); break;
              case 'categories': setCategoriesList(prev => prev.map(i => i.id === id ? newItem : i)); break;
           }
      }
      setIsCrudModalOpen(false);
  };

  const handleInspectProduct = (prod: AdminProduct) => {
      setInspectProduct(prod);
  };

  const filterData = (data: any[]) => {
      if (!searchTerm) return data;
      const lower = searchTerm.toLowerCase();
      return data.filter(item => 
          Object.values(item).some(val => 
              String(val).toLowerCase().includes(lower)
          )
      );
  };

  // --- Render Helpers ---

  const renderContent = () => {
      if (activeTab === 'overview') {
          return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in">
                  <StatCard title="Total Revenue" value="$4.2M" change="+12.5%" icon={DollarSign} color="bg-green-500"/>
                  <StatCard title="Active Users" value={users.length.toString()} change="+5.2%" icon={Users} color="bg-blue-500"/>
                  <StatCard title="Pending Shipments" value={adminShipments.length.toString()} change="-2.1%" icon={Truck} color="bg-orange-500"/>
                  <StatCard title="System Health" value="99.9%" change="Stable" icon={Activity} color="bg-purple-500"/>
                  
                  {/* Chart */}
                  <div className="col-span-full bg-white p-6 rounded-xl border border-gray-200 mt-4 h-96">
                      <h3 className="font-bold text-slate-800 mb-4">Platform Activity</h3>
                      <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={[{n:'Mon', v:40},{n:'Tue', v:30},{n:'Wed', v:55},{n:'Thu', v:45},{n:'Fri', v:60},{n:'Sat', v:75},{n:'Sun', v:65}]}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                              <XAxis dataKey="n"/>
                              <YAxis/>
                              <Tooltip/>
                              <Area type="monotone" dataKey="v" stroke="#f97316" fill="#ffedd5" />
                          </AreaChart>
                      </ResponsiveContainer>
                  </div>
              </div>
          );
      }
      if (activeTab === 'market') {
          return (
              <div>
                  <div className="flex gap-4 border-b border-gray-200 mb-6">
                      {['users', 'products', 'orders', 'rfqs'].map(t => (
                          <button 
                            key={t}
                            onClick={() => { setMarketAdminTab(t); setSearchTerm(''); }}
                            className={`pb-2 px-2 capitalize font-medium ${marketAdminTab === t ? 'border-b-2 border-orange-500 text-orange-600' : 'text-slate-500'}`}
                          >
                              {t}
                          </button>
                      ))}
                  </div>
                  
                  {marketAdminTab === 'users' && (
                      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden animate-fade-in">
                          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                              <h3 className="font-bold">All Users</h3>
                              <div className="flex gap-2">
                                  <div className="relative">
                                      <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400"/>
                                      <input type="text" placeholder="Search..." className="pl-8 pr-3 py-1.5 text-sm border rounded-lg" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
                                  </div>
                                  <button onClick={() => openAddModal('users')} className="bg-slate-900 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1"><Plus size={12}/> Add</button>
                              </div>
                          </div>
                          <table className="w-full text-sm text-left">
                              <thead className="bg-gray-50 text-gray-500">
                                  <tr>
                                      <th className="px-6 py-3">Name</th>
                                      <th className="px-6 py-3">Role</th>
                                      <th className="px-6 py-3">Country</th>
                                      <th className="px-6 py-3">Email</th>
                                      <th className="px-6 py-3">Status</th>
                                      <th className="px-6 py-3 text-right">Actions</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                  {filterData(users).map(u => (
                                      <tr key={u.id} className="hover:bg-slate-50">
                                          <td className="px-6 py-4 font-medium">{u.name}</td>
                                          <td className="px-6 py-4">{u.role}</td>
                                          <td className="px-6 py-4">{u.country}</td>
                                          <td className="px-6 py-4">{u.email}</td>
                                          <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-bold ${u.status === 'Active' || u.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>{u.status}</span></td>
                                          <td className="px-6 py-4 text-right flex justify-end gap-2">
                                              <button onClick={() => openEditModal('users', u)} className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Edit size={16}/></button>
                                              <button onClick={() => handleDelete('users', u.id)} className="text-red-600 hover:bg-red-50 p-1 rounded"><Trash2 size={16}/></button>
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  )}

                  {marketAdminTab === 'products' && (
                      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden animate-fade-in">
                          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                              <h3 className="font-bold">Product Catalog</h3>
                              <div className="flex gap-2">
                                  <div className="relative">
                                      <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400"/>
                                      <input type="text" placeholder="Search..." className="pl-8 pr-3 py-1.5 text-sm border rounded-lg" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
                                  </div>
                                  <button onClick={() => openAddModal('products')} className="bg-slate-900 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1"><Plus size={12}/> Add</button>
                              </div>
                          </div>
                          <table className="w-full text-sm text-left">
                              <thead className="bg-gray-50 text-gray-500">
                                  <tr>
                                      <th className="px-6 py-3">Product</th>
                                      <th className="px-6 py-3">Supplier</th>
                                      <th className="px-6 py-3">Price</th>
                                      <th className="px-6 py-3">Risk Score</th>
                                      <th className="px-6 py-3">Status</th>
                                      <th className="px-6 py-3 text-right">Action</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                  {filterData(adminProducts).map(p => (
                                      <tr key={p.id} className="hover:bg-slate-50">
                                          <td className="px-6 py-4 font-medium">{p.title}</td>
                                          <td className="px-6 py-4">{p.supplier}</td>
                                          <td className="px-6 py-4">${p.price}</td>
                                          <td className="px-6 py-4">
                                              <span className={`px-2 py-1 rounded text-xs font-bold ${p.aiRiskScore && p.aiRiskScore > 50 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                                  {p.aiRiskScore} / 100
                                              </span>
                                          </td>
                                          <td className="px-6 py-4 capitalize">{p.status.replace('_', ' ')}</td>
                                          <td className="px-6 py-4 text-right flex justify-end gap-2">
                                              <button onClick={() => handleInspectProduct(p)} className="text-blue-600 hover:underline font-bold text-xs mr-2">Inspect</button>
                                              <button onClick={() => openEditModal('products', p)} className="text-gray-500 hover:text-blue-600"><Edit size={16}/></button>
                                              <button onClick={() => handleDelete('products', p.id)} className="text-gray-500 hover:text-red-600"><Trash2 size={16}/></button>
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  )}

                  {marketAdminTab === 'orders' && (
                      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden animate-fade-in">
                          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                              <h3 className="font-bold">Order Management</h3>
                              <div className="flex gap-2">
                                  <input type="text" placeholder="Search..." className="pl-3 pr-3 py-1.5 text-sm border rounded-lg" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
                                  <button onClick={() => openAddModal('orders')} className="bg-slate-900 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1"><Plus size={12}/> Create</button>
                              </div>
                          </div>
                          <table className="w-full text-sm text-left">
                              <thead className="bg-gray-50 text-gray-500">
                                  <tr>
                                      <th className="px-6 py-3">Order ID</th>
                                      <th className="px-6 py-3">Buyer</th>
                                      <th className="px-6 py-3">Supplier</th>
                                      <th className="px-6 py-3">Total</th>
                                      <th className="px-6 py-3">Status</th>
                                      <th className="px-6 py-3 text-right">Actions</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                  {filterData(adminOrders).map(o => (
                                      <tr key={o.id} className="hover:bg-slate-50">
                                          <td className="px-6 py-4 font-mono text-xs">{o.id}</td>
                                          <td className="px-6 py-4">{o.buyer}</td>
                                          <td className="px-6 py-4">{o.supplier}</td>
                                          <td className="px-6 py-4 font-bold text-green-600">${o.total.toLocaleString()}</td>
                                          <td className="px-6 py-4">
                                              <span className={`px-2 py-1 rounded text-xs font-bold ${o.status === 'Completed' ? 'bg-green-100 text-green-700' : o.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                  {o.status}
                                              </span>
                                          </td>
                                          <td className="px-6 py-4 text-right flex justify-end gap-2">
                                              <button onClick={() => openEditModal('orders', o)} className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Edit size={16}/></button>
                                              <button onClick={() => handleDelete('orders', o.id)} className="text-red-600 hover:bg-red-50 p-1 rounded"><Trash2 size={16}/></button>
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  )}

                  {marketAdminTab === 'rfqs' && (
                      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden animate-fade-in">
                          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                              <h3 className="font-bold">RFQ Management</h3>
                              <div className="flex gap-2">
                                  <input type="text" placeholder="Search..." className="pl-3 pr-3 py-1.5 text-sm border rounded-lg" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
                                  <button onClick={() => openAddModal('rfqs')} className="bg-slate-900 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1"><Plus size={12}/> Add</button>
                              </div>
                          </div>
                          <table className="w-full text-sm text-left">
                              <thead className="bg-gray-50 text-gray-500">
                                  <tr>
                                      <th className="px-6 py-3">RFQ ID</th>
                                      <th className="px-6 py-3">Product</th>
                                      <th className="px-6 py-3">Buyer</th>
                                      <th className="px-6 py-3">Qty</th>
                                      <th className="px-6 py-3">Quotes</th>
                                      <th className="px-6 py-3">Status</th>
                                      <th className="px-6 py-3 text-right">Actions</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                  {filterData(adminRFQs).map(r => (
                                      <tr key={r.id} className="hover:bg-slate-50">
                                          <td className="px-6 py-4 font-mono text-xs">{r.id}</td>
                                          <td className="px-6 py-4 font-medium">{r.product}</td>
                                          <td className="px-6 py-4">{r.buyer}</td>
                                          <td className="px-6 py-4">{r.qty}</td>
                                          <td className="px-6 py-4">{r.quotes}</td>
                                          <td className="px-6 py-4">
                                              <span className={`px-2 py-1 rounded text-xs font-bold ${r.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                  {r.status}
                                              </span>
                                          </td>
                                          <td className="px-6 py-4 text-right flex justify-end gap-2">
                                              <button onClick={() => openEditModal('rfqs', r)} className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Edit size={16}/></button>
                                              <button onClick={() => handleDelete('rfqs', r.id)} className="text-red-600 hover:bg-red-50 p-1 rounded"><Trash2 size={16}/></button>
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  )}
              </div>
          );
      }
      
      if (activeTab === 'franchise') {
          return (
              <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden animate-fade-in">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                      <h3 className="font-bold">Franchise Partners</h3>
                      <button onClick={() => openAddModal('partners')} className="bg-slate-900 text-white px-4 py-2 rounded text-xs font-bold flex items-center gap-2"><Plus size={14}/> Add Partner</button>
                  </div>
                  <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-gray-500">
                          <tr>
                              <th className="px-6 py-3">Store Name</th>
                              <th className="px-6 py-3">Owner</th>
                              <th className="px-6 py-3">Region</th>
                              <th className="px-6 py-3">Sales</th>
                              <th className="px-6 py-3">Status</th>
                              <th className="px-6 py-3 text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          {partners.map(p => (
                              <tr key={p.id}>
                                  <td className="px-6 py-4 font-bold">{p.storeName}</td>
                                  <td className="px-6 py-4">{p.name}</td>
                                  <td className="px-6 py-4">{p.region}</td>
                                  <td className="px-6 py-4 text-green-600">${p.totalSales}</td>
                                  <td className="px-6 py-4"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">{p.status}</span></td>
                                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                                      <button onClick={() => openEditModal('partners', p)} className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Edit size={16}/></button>
                                      <button onClick={() => handleDelete('partners', p.id)} className="text-red-600 hover:bg-red-50 p-1 rounded"><Trash2 size={16}/></button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          );
      }

      if (activeTab === 'cpd') {
          return (
              <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden animate-fade-in">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                      <h3 className="font-bold">R&D Projects (CPD)</h3>
                      <button onClick={() => openAddModal('cpd')} className="bg-slate-900 text-white px-4 py-2 rounded text-xs font-bold flex items-center gap-2"><Plus size={14}/> Add Project</button>
                  </div>
                  <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-gray-500">
                          <tr>
                              <th className="px-6 py-3">Project Title</th>
                              <th className="px-6 py-3">Client</th>
                              <th className="px-6 py-3">Stage</th>
                              <th className="px-6 py-3">NDA</th>
                              <th className="px-6 py-3">Status</th>
                              <th className="px-6 py-3 text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          {cpdProjects.map(p => (
                              <tr key={p.id}>
                                  <td className="px-6 py-4 font-bold">{p.title}</td>
                                  <td className="px-6 py-4">{p.client}</td>
                                  <td className="px-6 py-4">{p.stage}</td>
                                  <td className="px-6 py-4">{p.ndaSigned ? <CheckCircle size={14} className="text-green-500"/> : <XCircle size={14} className="text-red-500"/>}</td>
                                  <td className="px-6 py-4"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold">{p.status}</span></td>
                                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                                      <button onClick={() => openEditModal('cpd', p)} className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Edit size={16}/></button>
                                      <button onClick={() => handleDelete('cpd', p.id)} className="text-red-600 hover:bg-red-50 p-1 rounded"><Trash2 size={16}/></button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          );
      }

      if (activeTab === 'logistics') {
          return (
              <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden animate-fade-in">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                      <h3 className="font-bold">Active Shipments</h3>
                      <button onClick={() => openAddModal('shipments')} className="bg-slate-900 text-white px-4 py-2 rounded text-xs font-bold flex items-center gap-2"><Plus size={14}/> Create Shipment</button>
                  </div>
                  <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-gray-500">
                          <tr>
                              <th className="px-6 py-3">Tracking #</th>
                              <th className="px-6 py-3">Carrier</th>
                              <th className="px-6 py-3">Origin</th>
                              <th className="px-6 py-3">Destination</th>
                              <th className="px-6 py-3">Status</th>
                              <th className="px-6 py-3 text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          {adminShipments.map(s => (
                              <tr key={s.id}>
                                  <td className="px-6 py-4 font-mono text-xs">{s.trackingNumber}</td>
                                  <td className="px-6 py-4">{s.carrier}</td>
                                  <td className="px-6 py-4">{s.origin}</td>
                                  <td className="px-6 py-4">{s.destination}</td>
                                  <td className="px-6 py-4"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold">{s.status}</span></td>
                                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                                      <button onClick={() => openEditModal('shipments', s)} className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Edit size={16}/></button>
                                      <button onClick={() => handleDelete('shipments', s.id)} className="text-red-600 hover:bg-red-50 p-1 rounded"><Trash2 size={16}/></button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          );
      }

      if (activeTab === 'invest') {
          return (
              <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden animate-fade-in">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                      <h3 className="font-bold">Business Listings (M&A)</h3>
                      <button onClick={() => openAddModal('investments')} className="bg-slate-900 text-white px-4 py-2 rounded text-xs font-bold flex items-center gap-2"><Plus size={14}/> Add Listing</button>
                  </div>
                  <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-gray-500">
                          <tr>
                              <th className="px-6 py-3">Title</th>
                              <th className="px-6 py-3">Type</th>
                              <th className="px-6 py-3">Industry</th>
                              <th className="px-6 py-3">Asking Price</th>
                              <th className="px-6 py-3 text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          {investmentListings.map(l => (
                              <tr key={l.id}>
                                  <td className="px-6 py-4 font-bold">{l.title}</td>
                                  <td className="px-6 py-4 capitalize">{l.type.replace('_', ' ')}</td>
                                  <td className="px-6 py-4">{l.industry}</td>
                                  <td className="px-6 py-4 font-mono text-green-600">${l.askingPrice.toLocaleString()}</td>
                                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                                      <button onClick={() => openEditModal('investments', l)} className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Edit size={16}/></button>
                                      <button onClick={() => handleDelete('investments', l.id)} className="text-red-600 hover:bg-red-50 p-1 rounded"><Trash2 size={16}/></button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          );
      }

      if (activeTab === 'events') {
          return (
              <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden animate-fade-in">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                      <h3 className="font-bold">Trade Events</h3>
                      <button onClick={() => openAddModal('events')} className="bg-slate-900 text-white px-4 py-2 rounded text-xs font-bold flex items-center gap-2"><Plus size={14}/> Create Event</button>
                  </div>
                  <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-gray-500">
                          <tr>
                              <th className="px-6 py-3">Event Name</th>
                              <th className="px-6 py-3">Type</th>
                              <th className="px-6 py-3">Date</th>
                              <th className="px-6 py-3">Location</th>
                              <th className="px-6 py-3 text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          {adminEvents.map(e => (
                              <tr key={e.id}>
                                  <td className="px-6 py-4 font-bold">{e.title}</td>
                                  <td className="px-6 py-4">{e.type}</td>
                                  <td className="px-6 py-4">{e.date}</td>
                                  <td className="px-6 py-4">{e.location}</td>
                                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                                      <button onClick={() => openEditModal('events', e)} className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Edit size={16}/></button>
                                      <button onClick={() => handleDelete('events', e.id)} className="text-red-600 hover:bg-red-50 p-1 rounded"><Trash2 size={16}/></button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          );
      }

      if (activeTab === 'jobs') {
          return (
              <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden animate-fade-in">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                      <h3 className="font-bold">Job Postings</h3>
                      <button onClick={() => openAddModal('jobs')} className="bg-slate-900 text-white px-4 py-2 rounded text-xs font-bold flex items-center gap-2"><Plus size={14}/> Post Job</button>
                  </div>
                  <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-gray-500">
                          <tr>
                              <th className="px-6 py-3">Title</th>
                              <th className="px-6 py-3">Company</th>
                              <th className="px-6 py-3">Applicants</th>
                              <th className="px-6 py-3">Status</th>
                              <th className="px-6 py-3 text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          {adminJobs.map(j => (
                              <tr key={j.id}>
                                  <td className="px-6 py-4 font-bold">{j.title}</td>
                                  <td className="px-6 py-4">{j.company}</td>
                                  <td className="px-6 py-4">{j.applicants}</td>
                                  <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-bold ${j.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{j.status}</span></td>
                                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                                      <button onClick={() => openEditModal('jobs', j)} className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Edit size={16}/></button>
                                      <button onClick={() => handleDelete('jobs', j.id)} className="text-red-600 hover:bg-red-50 p-1 rounded"><Trash2 size={16}/></button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          );
      }

      if (activeTab === 'verification') {
          return (
              <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden animate-fade-in">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                      <h3 className="font-bold">Verification Queue</h3>
                      <button onClick={() => openAddModal('verification')} className="bg-slate-900 text-white px-4 py-2 rounded text-xs font-bold flex items-center gap-2"><Plus size={14}/> Add Request</button>
                  </div>
                  <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-gray-500">
                          <tr>
                              <th className="px-6 py-3">Supplier</th>
                              <th className="px-6 py-3">Document</th>
                              <th className="px-6 py-3">Date</th>
                              <th className="px-6 py-3">Status</th>
                              <th className="px-6 py-3 text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          {verificationQueue.map(v => (
                              <tr key={v.id}>
                                  <td className="px-6 py-4 font-bold">{v.supplierName}</td>
                                  <td className="px-6 py-4">{v.docType}</td>
                                  <td className="px-6 py-4">{v.date}</td>
                                  <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-bold ${v.status === 'Approved' ? 'bg-green-100 text-green-700' : v.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{v.status}</span></td>
                                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                                      <button onClick={() => openEditModal('verification', v)} className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Edit size={16}/></button>
                                      <button onClick={() => handleDelete('verification', v.id)} className="text-red-600 hover:bg-red-50 p-1 rounded"><Trash2 size={16}/></button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          );
      }

      if (activeTab === 'assurance') {
          return (
              <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden animate-fade-in">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                      <h3 className="font-bold">Trade Disputes</h3>
                      <button onClick={() => openAddModal('disputes')} className="bg-slate-900 text-white px-4 py-2 rounded text-xs font-bold flex items-center gap-2"><Plus size={14}/> Create Dispute</button>
                  </div>
                  <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-gray-500">
                          <tr>
                              <th className="px-6 py-3">Order ID</th>
                              <th className="px-6 py-3">Claimant</th>
                              <th className="px-6 py-3">Reason</th>
                              <th className="px-6 py-3">Amount</th>
                              <th className="px-6 py-3">Status</th>
                              <th className="px-6 py-3 text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          {disputeCases.map(d => (
                              <tr key={d.id}>
                                  <td className="px-6 py-4 font-mono text-xs">{d.orderId}</td>
                                  <td className="px-6 py-4">{d.claimant}</td>
                                  <td className="px-6 py-4">{d.reason}</td>
                                  <td className="px-6 py-4 text-red-600">${d.amount}</td>
                                  <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-bold ${d.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{d.status}</span></td>
                                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                                      <button onClick={() => openEditModal('disputes', d)} className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Edit size={16}/></button>
                                      <button onClick={() => handleDelete('disputes', d.id)} className="text-red-600 hover:bg-red-50 p-1 rounded"><Trash2 size={16}/></button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          );
      }

      if (activeTab === 'insurance') {
          return (
              <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden animate-fade-in">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                      <h3 className="font-bold">Insurance Policies</h3>
                      <button onClick={() => openAddModal('insurance')} className="bg-slate-900 text-white px-4 py-2 rounded text-xs font-bold flex items-center gap-2"><Plus size={14}/> Issue Policy</button>
                  </div>
                  <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-gray-500">
                          <tr>
                              <th className="px-6 py-3">Holder</th>
                              <th className="px-6 py-3">Type</th>
                              <th className="px-6 py-3">Coverage</th>
                              <th className="px-6 py-3">Status</th>
                              <th className="px-6 py-3 text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          {insurancePolicies.map(p => (
                              <tr key={p.id}>
                                  <td className="px-6 py-4 font-bold">{p.holder}</td>
                                  <td className="px-6 py-4">{p.type}</td>
                                  <td className="px-6 py-4 font-mono">${p.amount.toLocaleString()}</td>
                                  <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-bold ${p.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>{p.status}</span></td>
                                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                                      <button onClick={() => openEditModal('insurance', p)} className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Edit size={16}/></button>
                                      <button onClick={() => handleDelete('insurance', p.id)} className="text-red-600 hover:bg-red-50 p-1 rounded"><Trash2 size={16}/></button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          );
      }

      if (activeTab === 'categories') {
          return (
              <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden animate-fade-in">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                      <h3 className="font-bold">Category Management</h3>
                      <button onClick={() => openAddModal('categories')} className="bg-slate-900 text-white px-4 py-2 rounded text-xs font-bold flex items-center gap-2"><Plus size={14}/> Add Category</button>
                  </div>
                  <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-gray-500">
                          <tr>
                              <th className="px-6 py-3">Name</th>
                              <th className="px-6 py-3">Parent</th>
                              <th className="px-6 py-3">Products</th>
                              <th className="px-6 py-3">Trend</th>
                              <th className="px-6 py-3 text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          {categoriesList.map(c => (
                              <tr key={c.id}>
                                  <td className="px-6 py-4 font-bold">{c.name}</td>
                                  <td className="px-6 py-4">{c.parent}</td>
                                  <td className="px-6 py-4">{c.count}</td>
                                  <td className="px-6 py-4 text-green-600">{c.trend}</td>
                                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                                      <button onClick={() => openEditModal('categories', c)} className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Edit size={16}/></button>
                                      <button onClick={() => handleDelete('categories', c.id)} className="text-red-600 hover:bg-red-50 p-1 rounded"><Trash2 size={16}/></button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          );
      }

      if (activeTab === 'content') {
          return (
              <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden animate-fade-in">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                      <h3 className="font-bold">Content Moderation Queue</h3>
                      <button onClick={() => openAddModal('content')} className="bg-slate-900 text-white px-4 py-2 rounded text-xs font-bold flex items-center gap-2"><Plus size={14}/> Add Review</button>
                  </div>
                  <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-gray-500">
                          <tr>
                              <th className="px-6 py-3">User</th>
                              <th className="px-6 py-3">Product</th>
                              <th className="px-6 py-3">Content</th>
                              <th className="px-6 py-3">Status</th>
                              <th className="px-6 py-3 text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          {reviewsList.map(r => (
                              <tr key={r.id}>
                                  <td className="px-6 py-4 font-medium">{r.user}</td>
                                  <td className="px-6 py-4 text-xs">{r.product}</td>
                                  <td className="px-6 py-4 truncate max-w-xs">{r.comment}</td>
                                  <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-bold ${r.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{r.status}</span></td>
                                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                                      <button onClick={() => openEditModal('content', r)} className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Edit size={16}/></button>
                                      <button onClick={() => handleDelete('content', r.id)} className="text-red-600 hover:bg-red-50 p-1 rounded"><Trash2 size={16}/></button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          );
      }

      if (activeTab === 'settings') {
          return (
              <div className="bg-white rounded-lg shadow border border-gray-200 p-8 max-w-2xl mx-auto animate-fade-in">
                  <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Settings size={20}/> Global System Settings</h3>
                  <div className="space-y-6">
                      <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Site Name</label>
                          <input className="w-full border p-2 rounded" value={siteSettings.siteName} onChange={e => setSiteSettings({...siteSettings, siteName: e.target.value})} />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">SEO Title</label>
                          <input className="w-full border p-2 rounded" value={siteSettings.seoTitle} onChange={e => setSiteSettings({...siteSettings, seoTitle: e.target.value})} />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded border">
                          <div>
                              <div className="font-bold">Maintenance Mode</div>
                              <div className="text-xs text-gray-500">Suspend all public access</div>
                          </div>
                          <button onClick={() => setSiteSettings({...siteSettings, maintenanceMode: !siteSettings.maintenanceMode})} className={`text-2xl ${siteSettings.maintenanceMode ? 'text-green-500' : 'text-gray-300'}`}>
                              {siteSettings.maintenanceMode ? <ToggleRight size={40}/> : <ToggleLeft size={40}/>}
                          </button>
                      </div>
                      <button className="w-full bg-slate-900 text-white py-2 rounded font-bold hover:bg-slate-800">Save Configuration</button>
                  </div>
              </div>
          );
      }

      return <div className="p-8 text-center text-gray-500">Module content placeholder</div>;
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 transition-all duration-300">
        <div className="p-4 border-b border-slate-800">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">T</div>
                TradeOS
            </h1>
            <div className="mt-4 flex gap-2 p-1 bg-slate-800 rounded-lg">
                <button onClick={() => setRole('admin')} className={`flex-1 text-xs py-1 rounded font-bold transition-colors ${role === 'admin' ? 'bg-slate-600 text-white shadow' : 'hover:bg-slate-700 text-slate-400'}`}>Admin</button>
                <button onClick={() => setRole('developer')} className={`flex-1 text-xs py-1 rounded font-bold transition-colors ${role === 'developer' ? 'bg-slate-600 text-white shadow' : 'hover:bg-slate-700 text-slate-400'}`}>Dev</button>
            </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="mb-6">
                <p className="text-xs font-bold text-slate-500 uppercase mb-2 px-3">Main</p>
                <SidebarItem icon={LayoutDashboard} label={t('dash_overview')} active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                <SidebarItem icon={ShoppingBag} label={t('dash_market')} active={activeTab === 'market'} onClick={() => setActiveTab('market')} />
            </div>
            
            <div className="mb-6">
                <p className="text-xs font-bold text-slate-500 uppercase mb-2 px-3">Commerce</p>
                {modules.franchise && <SidebarItem icon={Store} label={t('dash_franchise')} active={activeTab === 'franchise'} onClick={() => setActiveTab('franchise')} />}
                {modules.invest && <SidebarItem icon={BriefcaseIcon} label={t('dash_invest')} active={activeTab === 'invest'} onClick={() => setActiveTab('invest')} />}
                {modules.jobs && <SidebarItem icon={Briefcase} label={t('dash_jobs')} active={activeTab === 'jobs'} onClick={() => setActiveTab('jobs')} />}
                {modules.cpd && <SidebarItem icon={PenTool} label="R&D Projects" active={activeTab === 'cpd'} onClick={() => setActiveTab('cpd')} />}
            </div>

            <div className="mb-6">
                <p className="text-xs font-bold text-slate-500 uppercase mb-2 px-3">Operations</p>
                {modules.logistics && <SidebarItem icon={Truck} label={t('dash_logistics')} active={activeTab === 'logistics'} onClick={() => setActiveTab('logistics')} />}
                {modules.trade_assurance && <SidebarItem icon={Gavel} label={t('dash_trade_assurance')} active={activeTab === 'assurance'} onClick={() => setActiveTab('assurance')} />}
                {modules.insurance && <SidebarItem icon={Umbrella} label="Insurance" active={activeTab === 'insurance'} onClick={() => setActiveTab('insurance')} />}
                {modules.events && <SidebarItem icon={Calendar} label={t('dash_events')} active={activeTab === 'events'} onClick={() => setActiveTab('events')} />}
            </div>

            <div className="mb-6">
                <p className="text-xs font-bold text-slate-500 uppercase mb-2 px-3">System</p>
                <SidebarItem icon={ShieldCheck} label={t('dash_verify')} active={activeTab === 'verification'} onClick={() => setActiveTab('verification')} badge={verificationQueue.filter(v => v.status === 'Pending').length} />
                <SidebarItem icon={Layers} label="Categories" active={activeTab === 'categories'} onClick={() => setActiveTab('categories')} />
                <SidebarItem icon={MessageSquare} label="Content & Reviews" active={activeTab === 'content'} onClick={() => setActiveTab('content')} />
                <SidebarItem icon={Settings} label={t('dash_settings')} active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header */}
          <div className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 flex-shrink-0">
              <div className="flex items-center gap-4">
                  <h2 className="text-xl font-bold text-slate-800 capitalize">{activeTab.replace('_', ' ')}</h2>
                  {role === 'developer' && <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded border border-red-200 flex items-center gap-1"><Terminal size={12}/> Dev Mode</span>}
              </div>
              <div className="flex items-center gap-4">
                  <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full relative">
                      <Bell size={20}/>
                      <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>
                  <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">A</div>
              </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
              {renderContent()}
          </div>
      </div>

      {/* Generic CRUD Modal */}
      {isCrudModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-scale-in">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                      <h3 className="font-bold text-lg capitalize flex items-center gap-2">
                          {crudMode === 'add' ? <Plus size={18} className="text-green-500"/> : <Edit size={18} className="text-blue-500"/>}
                          {crudMode} {activeCrudSection.slice(0, -1)}
                      </h3>
                      <button onClick={() => setIsCrudModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={20}/></button>
                  </div>
                  <form onSubmit={handleCrudSave} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                      {/* Dynamic Fields based on activeCrudSection */}
                      {activeCrudSection === 'users' && (
                          <>
                              <div><label className="block text-xs font-bold mb-1">Name</label><input className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" value={editingItem.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} required/></div>
                              <div><label className="block text-xs font-bold mb-1">Role</label><input className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" value={editingItem.role || ''} onChange={e => setEditingItem({...editingItem, role: e.target.value})} required/></div>
                              <div><label className="block text-xs font-bold mb-1">Country</label><input className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" value={editingItem.country || ''} onChange={e => setEditingItem({...editingItem, country: e.target.value})} required/></div>
                              <div>
                                <label className="block text-xs font-bold mb-1">Status</label>
                                <select className="w-full border rounded p-2 text-sm bg-white" value={editingItem.status || 'Active'} onChange={e => setEditingItem({...editingItem, status: e.target.value})}>
                                    <option>Active</option>
                                    <option>Verified</option>
                                    <option>Suspended</option>
                                </select>
                              </div>
                          </>
                      )}
                      
                      {activeCrudSection === 'products' && (
                          <>
                              <div><label className="block text-xs font-bold mb-1">Title</label><input className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" value={editingItem.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} required/></div>
                              <div><label className="block text-xs font-bold mb-1">Supplier</label><input className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" value={editingItem.supplier || ''} onChange={e => setEditingItem({...editingItem, supplier: e.target.value})} required/></div>
                              <div><label className="block text-xs font-bold mb-1">Price ($)</label><input type="number" className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" value={editingItem.price || ''} onChange={e => setEditingItem({...editingItem, price: parseFloat(e.target.value)})} required/></div>
                              <div><label className="block text-xs font-bold mb-1">Category</label><input className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" value={editingItem.category || ''} onChange={e => setEditingItem({...editingItem, category: e.target.value})} required/></div>
                              <div>
                                <label className="block text-xs font-bold mb-1">Status</label>
                                <select className="w-full border rounded p-2 text-sm bg-white" value={editingItem.status || 'active'} onChange={e => setEditingItem({...editingItem, status: e.target.value})}>
                                    <option value="active">Active</option>
                                    <option value="pending_approval">Pending Approval</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                              </div>
                          </>
                      )}

                      {activeCrudSection === 'shipments' && (
                          <>
                              <div><label className="block text-xs font-bold mb-1">Tracking Number</label><input className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" value={editingItem.trackingNumber || ''} onChange={e => setEditingItem({...editingItem, trackingNumber: e.target.value})} required/></div>
                              <div><label className="block text-xs font-bold mb-1">Carrier</label><input className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" value={editingItem.carrier || ''} onChange={e => setEditingItem({...editingItem, carrier: e.target.value})} required/></div>
                              <div className="grid grid-cols-2 gap-2">
                                  <div><label className="block text-xs font-bold mb-1">Origin</label><input className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" value={editingItem.origin || ''} onChange={e => setEditingItem({...editingItem, origin: e.target.value})} required/></div>
                                  <div><label className="block text-xs font-bold mb-1">Destination</label><input className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" value={editingItem.destination || ''} onChange={e => setEditingItem({...editingItem, destination: e.target.value})} required/></div>
                              </div>
                              <div>
                                  <label className="block text-xs font-bold mb-1">Status</label>
                                  <select className="w-full border rounded p-2 text-sm bg-white" value={editingItem.status || 'Scheduled'} onChange={e => setEditingItem({...editingItem, status: e.target.value})}>
                                      <option>Scheduled</option>
                                      <option>In Transit</option>
                                      <option>Customs</option>
                                      <option>Delivered</option>
                                  </select>
                              </div>
                          </>
                      )}

                      {activeCrudSection === 'partners' && (
                          <>
                              <div><label className="block text-xs font-bold mb-1">Store Name</label><input className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" value={editingItem.storeName || ''} onChange={e => setEditingItem({...editingItem, storeName: e.target.value})} required/></div>
                              <div><label className="block text-xs font-bold mb-1">Owner Name</label><input className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" value={editingItem.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} required/></div>
                              <div><label className="block text-xs font-bold mb-1">Region</label><input className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" value={editingItem.region || ''} onChange={e => setEditingItem({...editingItem, region: e.target.value})} required/></div>
                              <div><label className="block text-xs font-bold mb-1">Total Sales</label><input type="number" className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" value={editingItem.totalSales || 0} onChange={e => setEditingItem({...editingItem, totalSales: parseFloat(e.target.value)})} required/></div>
                              <div>
                                <label className="block text-xs font-bold mb-1">Status</label>
                                <select className="w-full border rounded p-2 text-sm bg-white" value={editingItem.status || 'Active'} onChange={e => setEditingItem({...editingItem, status: e.target.value})}>
                                    <option>Active</option>
                                    <option>Pending</option>
                                    <option>Suspended</option>
                                </select>
                              </div>
                          </>
                      )}

                      {activeCrudSection === 'investments' && (
                          <>
                              <div><label className="block text-xs font-bold mb-1">Listing Title</label><input className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" value={editingItem.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} required/></div>
                              <div>
                                  <label className="block text-xs font-bold mb-1">Type</label>
                                  <select className="w-full border rounded p-2 text-sm bg-white" value={editingItem.type || 'business_sale'} onChange={e => setEditingItem({...editingItem, type: e.target.value})}>
                                      <option value="business_sale">Business Sale</option>
                                      <option value="franchise">Franchise</option>
                                      <option value="investment">Investment</option>
                                  </select>
                              </div>
                              <div><label className="block text-xs font-bold mb-1">Industry</label><input className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" value={editingItem.industry || ''} onChange={e => setEditingItem({...editingItem, industry: e.target.value})} required/></div>
                              <div><label className="block text-xs font-bold mb-1">Asking Price ($)</label><input type="number" className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" value={editingItem.askingPrice || 0} onChange={e => setEditingItem({...editingItem, askingPrice: parseFloat(e.target.value)})} required/></div>
                          </>
                      )}

                      {activeCrudSection === 'events' && (
                          <>
                              <div><label className="block text-xs font-bold mb-1">Event Title</label><input className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" value={editingItem.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} required/></div>
                              <div>
                                  <label className="block text-xs font-bold mb-1">Type</label>
                                  <select className="w-full border rounded p-2 text-sm bg-white" value={editingItem.type || 'In-Person'} onChange={e => setEditingItem({...editingItem, type: e.target.value})}>
                                      <option>In-Person</option>
                                      <option>Online</option>
                                  </select>
                              </div>
                              <div><label className="block text-xs font-bold mb-1">Date</label><input className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" value={editingItem.date || ''} onChange={e => setEditingItem({...editingItem, date: e.target.value})} required/></div>
                              <div><label className="block text-xs font-bold mb-1">Location</label><input className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" value={editingItem.location || ''} onChange={e => setEditingItem({...editingItem, location: e.target.value})} required/></div>
                          </>
                      )}

                      {activeCrudSection === 'jobs' && (
                          <>
                              <div><label className="block text-xs font-bold mb-1">Job Title</label><input className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" value={editingItem.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} required/></div>
                              <div><label className="block text-xs font-bold mb-1">Company</label><input className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" value={editingItem.company || ''} onChange={e => setEditingItem({...editingItem, company: e.target.value})} required/></div>
                              <div>
                                <label className="block text-xs font-bold mb-1">Status</label>
                                <select className="w-full border rounded p-2 text-sm bg-white" value={editingItem.status || 'Active'} onChange={e => setEditingItem({...editingItem, status: e.target.value})}>
                                    <option>Active</option>
                                    <option>Pending Review</option>
                                    <option>Closed</option>
                                </select>
                              </div>
                          </>
                      )}

                      {activeCrudSection === 'disputes' && (
                          <>
                              {crudMode === 'add' && (
                                  <div><label className="block text-xs font-bold mb-1">Order ID</label><input className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" value={editingItem.orderId || ''} onChange={e => setEditingItem({...editingItem, orderId: e.target.value})} placeholder="e.g. ORD-123" required/></div>
                              )}
                              <div><label className="block text-xs font-bold mb-1">Claimant</label><input className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" value={editingItem.claimant || ''} onChange={e => setEditingItem({...editingItem, claimant: e.target.value})} readOnly={crudMode==='edit'}/></div>
                              <div><label className="block text-xs font-bold mb-1">Respondent</label><input className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" value={editingItem.respondent || ''} onChange={e => setEditingItem({...editingItem, respondent: e.target.value})} readOnly={crudMode==='edit'}/></div>
                              <div><label className="block text-xs font-bold mb-1">Reason</label><input className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" value={editingItem.reason || ''} onChange={e => setEditingItem({...editingItem, reason: e.target.value})} readOnly={crudMode==='edit'}/></div>
                              <div><label className="block text-xs font-bold mb-1">Amount ($)</label><input type="number" className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" value={editingItem.amount || 0} onChange={e => setEditingItem({...editingItem, amount: parseFloat(e.target.value)})} readOnly={crudMode==='edit'}/></div>
                              <div>
                                <label className="block text-xs font-bold mb-1">Status</label>
                                <select className="w-full border rounded p-2 text-sm bg-white" value={editingItem.status || 'Open'} onChange={e => setEditingItem({...editingItem, status: e.target.value})}>
                                    <option>Open</option>
                                    <option>Under Review</option>
                                    <option>Resolved</option>
                                    <option>Dismissed</option>
                                </select>
                              </div>
                          </>
                      )}

                      {activeCrudSection === 'verification' && (
                          <>
                              <div><label className="block text-xs font-bold mb-1">Supplier</label><input className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" value={editingItem.supplierName || ''} onChange={e => setEditingItem({...editingItem, supplierName: e.target.value})} readOnly={crudMode==='edit'} required/></div>
                              <div><label className="block text-xs font-bold mb-1">Document Type</label><input className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" value={editingItem.docType || ''} onChange={e => setEditingItem({...editingItem, docType: e.target.value})} readOnly={crudMode==='edit'} required/></div>
                              <div>
                                <label className="block text-xs font-bold mb-1">Status</label>
                                <select className="w-full border rounded p-2 text-sm bg-white" value={editingItem.status || 'Pending'} onChange={e => setEditingItem({...editingItem, status: e.target.value})}>
                                    <option>Pending</option>
                                    <option>Approved</option>
                                    <option>Rejected</option>
                                </select>
                              </div>
                          </>
                      )}

                      {activeCrudSection === 'cpd' && (
                          <>
                              <div><label className="block text-xs font-bold mb-1">Project Title</label><input className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" value={editingItem.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} required/></div>
                              <div><label className="block text-xs font-bold mb-1">Client</label><input className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" value={editingItem.client || ''} onChange={e => setEditingItem({...editingItem, client: e.target.value})} required/></div>
                              <div><label className="block text-xs font-bold mb-1">Stage</label><input className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" value={editingItem.stage || ''} onChange={e => setEditingItem({...editingItem, stage: e.target.value})} required/></div>
                              <div>
                                <label className="block text-xs font-bold mb-1">Status</label>
                                <select className="w-full border rounded p-2 text-sm bg-white" value={editingItem.status || 'Active'} onChange={e => setEditingItem({...editingItem, status: e.target.value})}>
                                    <option>Active</option>
                                    <option>Pending Review</option>
                                    <option>Completed</option>
                                </select>
                              </div>
                          </>
                      )}

                      {activeCrudSection === 'insurance' && (
                          <>
                              <div><label className="block text-xs font-bold mb-1">Policy Holder</label><input className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" value={editingItem.holder || ''} onChange={e => setEditingItem({...editingItem, holder: e.target.value})} required/></div>
                              <div><label className="block text-xs font-bold mb-1">Type</label><input className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" value={editingItem.type || ''} onChange={e => setEditingItem({...editingItem, type: e.target.value})} required/></div>
                              <div><label className="block text-xs font-bold mb-1">Coverage Amount ($)</label><input type="number" className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" value={editingItem.amount || 0} onChange={e => setEditingItem({...editingItem, amount: parseFloat(e.target.value)})} required/></div>
                              <div>
                                <label className="block text-xs font-bold mb-1">Status</label>
                                <select className="w-full border rounded p-2 text-sm bg-white" value={editingItem.status || 'Active'} onChange={e => setEditingItem({...editingItem, status: e.target.value})}>
                                    <option>Active</option>
                                    <option>Expired</option>
                                    <option>Cancelled</option>
                                </select>
                              </div>
                          </>
                      )}

                      {activeCrudSection === 'categories' && (
                          <>
                              <div><label className="block text-xs font-bold mb-1">Category Name</label><input className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" value={editingItem.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} required/></div>
                              <div><label className="block text-xs font-bold mb-1">Parent Category</label><input className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" value={editingItem.parent || 'None'} onChange={e => setEditingItem({...editingItem, parent: e.target.value})} required/></div>
                              <div><label className="block text-xs font-bold mb-1">Product Count</label><input type="number" className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" value={editingItem.count || 0} onChange={e => setEditingItem({...editingItem, count: parseInt(e.target.value)})} required/></div>
                          </>
                      )}

                      {activeCrudSection === 'content' && (
                          <>
                              <div><label className="block text-xs font-bold mb-1">User</label><input className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" value={editingItem.user || ''} onChange={e => setEditingItem({...editingItem, user: e.target.value})} readOnly={crudMode==='edit'} required/></div>
                              {crudMode === 'add' && <div><label className="block text-xs font-bold mb-1">Product</label><input className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" value={editingItem.product || ''} onChange={e => setEditingItem({...editingItem, product: e.target.value})} required/></div>}
                              <div><label className="block text-xs font-bold mb-1">Comment</label><textarea className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" value={editingItem.comment || ''} onChange={e => setEditingItem({...editingItem, comment: e.target.value})}/></div>
                              <div>
                                <label className="block text-xs font-bold mb-1">Status</label>
                                <select className="w-full border rounded p-2 text-sm bg-white" value={editingItem.status || 'Published'} onChange={e => setEditingItem({...editingItem, status: e.target.value})}>
                                    <option>Published</option>
                                    <option>Flagged</option>
                                    <option>Removed</option>
                                </select>
                              </div>
                          </>
                      )}

                      {activeCrudSection === 'orders' && (
                          <>
                              <div><label className="block text-xs font-bold mb-1">Buyer</label><input className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" value={editingItem.buyer || ''} onChange={e => setEditingItem({...editingItem, buyer: e.target.value})} required/></div>
                              <div><label className="block text-xs font-bold mb-1">Supplier</label><input className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" value={editingItem.supplier || ''} onChange={e => setEditingItem({...editingItem, supplier: e.target.value})} required/></div>
                              <div><label className="block text-xs font-bold mb-1">Total ($)</label><input type="number" className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" value={editingItem.total || 0} onChange={e => setEditingItem({...editingItem, total: parseFloat(e.target.value)})} required/></div>
                              <div>
                                  <label className="block text-xs font-bold mb-1">Status</label>
                                  <select className="w-full border rounded p-2 text-sm bg-white" value={editingItem.status || 'Pending Payment'} onChange={e => setEditingItem({...editingItem, status: e.target.value})}>
                                      <option>Pending Payment</option>
                                      <option>Processing</option>
                                      <option>Shipped</option>
                                      <option>Completed</option>
                                      <option>Cancelled</option>
                                  </select>
                              </div>
                          </>
                      )}

                      {activeCrudSection === 'rfqs' && (
                          <>
                              <div><label className="block text-xs font-bold mb-1">Product</label><input className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" value={editingItem.product || ''} onChange={e => setEditingItem({...editingItem, product: e.target.value})} required/></div>
                              <div><label className="block text-xs font-bold mb-1">Buyer</label><input className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" value={editingItem.buyer || ''} onChange={e => setEditingItem({...editingItem, buyer: e.target.value})} required/></div>
                              <div><label className="block text-xs font-bold mb-1">Quantity</label><input type="number" className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" value={editingItem.qty || 0} onChange={e => setEditingItem({...editingItem, qty: parseInt(e.target.value)})} required/></div>
                              <div>
                                  <label className="block text-xs font-bold mb-1">Status</label>
                                  <select className="w-full border rounded p-2 text-sm bg-white" value={editingItem.status || 'Open'} onChange={e => setEditingItem({...editingItem, status: e.target.value})}>
                                      <option>Open</option>
                                      <option>Closed</option>
                                      <option>Awarded</option>
                                  </select>
                              </div>
                          </>
                      )}

                      <div className="flex gap-2 pt-2 border-t border-gray-100 mt-4">
                          <button type="button" onClick={() => setIsCrudModalOpen(false)} className="flex-1 py-2 border rounded font-bold text-gray-500 hover:bg-gray-50 transition-colors">Cancel</button>
                          <button type="submit" className="flex-1 py-2 bg-slate-900 text-white rounded font-bold hover:bg-slate-800 transition-colors">Save</button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* Product Inspection Modal */}
      {inspectProduct && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-scale-in">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]">
                  <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                      <div>
                          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                              {inspectProduct.title}
                              <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-2 py-1 rounded uppercase">{inspectProduct.status}</span>
                          </h2>
                          <p className="text-sm text-gray-500">Submitted by {inspectProduct.supplier}</p>
                      </div>
                      <button onClick={() => setInspectProduct(null)} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={24}/></button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                          {/* Images */}
                          <div className="lg:col-span-1 space-y-4">
                              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                  <img src={MOCK_INSPECT_DETAILS.images[0]} className="w-full h-full object-cover"/>
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                  {MOCK_INSPECT_DETAILS.images.map((img, i) => (
                                      <div key={i} className="aspect-square bg-gray-100 rounded border border-gray-200 overflow-hidden cursor-pointer hover:border-orange-500 transition-colors">
                                          <img src={img} className="w-full h-full object-cover"/>
                                      </div>
                                  ))}
                              </div>
                          </div>

                          {/* Details */}
                          <div className="lg:col-span-2 space-y-8">
                              {/* Wholesale Pricing */}
                              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 font-bold text-sm text-slate-700 flex items-center gap-2"><DollarSign size={14}/> Wholesale Pricing Tiers</div>
                                  <table className="w-full text-sm text-left">
                                      <thead className="text-xs text-gray-500 bg-gray-50/50">
                                          <tr>
                                              <th className="px-4 py-2">Min Qty</th>
                                              <th className="px-4 py-2">Max Qty</th>
                                              <th className="px-4 py-2">Unit Price</th>
                                          </tr>
                                      </thead>
                                      <tbody className="divide-y divide-gray-100">
                                          {MOCK_INSPECT_DETAILS.tiers.map((tier, i) => (
                                              <tr key={i}>
                                                  <td className="px-4 py-2">{tier.min}</td>
                                                  <td className="px-4 py-2">{tier.max || '+'}</td>
                                                  <td className="px-4 py-2 font-bold">${tier.price}</td>
                                              </tr>
                                          ))}
                                      </tbody>
                                  </table>
                              </div>

                              {/* Specifications */}
                              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 font-bold text-sm text-slate-700 flex items-center gap-2"><Settings size={14}/> Technical Specifications</div>
                                  <div className="grid grid-cols-2 gap-4 p-4">
                                      {Object.entries(MOCK_INSPECT_DETAILS.specs).map(([k, v]) => (
                                          <div key={k} className="flex flex-col">
                                              <span className="text-xs text-gray-500 uppercase font-semibold">{k}</span>
                                              <span className="text-sm font-medium text-slate-800">{v}</span>
                                          </div>
                                      ))}
                                  </div>
                              </div>

                              {/* Logistics */}
                              <div className="grid grid-cols-3 gap-4">
                                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 text-center">
                                      <div className="text-xs text-blue-600 font-bold uppercase mb-1">Lead Time</div>
                                      <div className="text-slate-800 font-medium">{MOCK_INSPECT_DETAILS.logistics.leadTime}</div>
                                  </div>
                                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-100 text-center">
                                      <div className="text-xs text-orange-600 font-bold uppercase mb-1">Packaging</div>
                                      <div className="text-slate-800 font-medium">{MOCK_INSPECT_DETAILS.logistics.packaging}</div>
                                  </div>
                                  <div className="p-4 bg-green-50 rounded-lg border border-green-100 text-center">
                                      <div className="text-xs text-green-600 font-bold uppercase mb-1">Weight</div>
                                      <div className="text-slate-800 font-medium">{MOCK_INSPECT_DETAILS.logistics.weight}</div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
                      <div className="flex items-center gap-4">
                          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${inspectProduct.aiRiskScore && inspectProduct.aiRiskScore > 50 ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
                              <Bot size={16}/> 
                              <span className="text-sm font-bold">AI Risk Score: {inspectProduct.aiRiskScore}/100</span>
                          </div>
                      </div>
                      <div className="flex gap-3">
                          <button onClick={() => setInspectProduct(null)} className="px-4 py-2 border border-gray-300 rounded-lg text-slate-600 font-bold hover:bg-gray-100 transition-colors">Cancel</button>
                          <button className="px-6 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 flex items-center gap-2 transition-colors shadow-sm">
                              <XCircle size={18}/> Reject
                          </button>
                          <button className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 flex items-center gap-2 transition-colors shadow-sm">
                              <CheckCircle size={18}/> Approve Listing
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Dashboard;
