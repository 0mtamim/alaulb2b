
import React, { useState, useRef, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Settings, CreditCard, Heart, History, TrendingUp, Sparkles, Bell, Lock, Link as LinkIcon, CheckCircle, ToggleLeft, ToggleRight, ChevronDown, ChevronUp, ShieldCheck, Upload, FileText, AlertCircle, Clock, Camera, Tag, Plus, Crown, Trash2, Smartphone, Globe, Monitor, LogOut, Eye, EyeOff, AlertTriangle, Save, X, Loader2 } from 'lucide-react';
import { UserProfile, PaymentMethod } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { validateCardLuhn, verifyFileSignature, sanitizeImageFile } from '../utils/security';

const MOCK_USER: UserProfile = {
  id: 'u1',
  name: "Alex Morgan",
  companyName: "Global Imports LLC",
  role: "Procurement Manager",
  avatar: "https://i.pravatar.cc/150?img=11",
  email: "alex.m@globalimports.com",
  phone: "+1 (555) 0123-4567",
  sourcingCategories: ["Electronics", "Machinery", "Packaging"],
  memberSince: "2021",
  level: "Pro"
};

const ACTIVE_SESSIONS = [
    { id: 1, device: 'MacBook Pro', location: 'New York, USA', ip: '192.168.1.1', lastActive: 'Current Session', icon: Monitor },
    { id: 2, device: 'iPhone 14 Pro', location: 'New York, USA', ip: '10.0.0.12', lastActive: '2 hours ago', icon: Smartphone },
];

const INITIAL_PAYMENT_METHODS: PaymentMethod[] = [
    { id: 'pm1', type: 'Visa', last4: '4242', expiry: '12/25', isDefault: true }
];

// Reusable Accordion Component
const AccordionItem = ({ 
  title, 
  icon: Icon, 
  isOpen, 
  onToggle, 
  children,
  badge
}: { 
  title: string, 
  icon: any, 
  isOpen: boolean, 
  onToggle: () => void, 
  children?: React.ReactNode,
  badge?: string
}) => (
  <div className={`border transition-all duration-300 rounded-xl overflow-hidden bg-white ${isOpen ? 'border-orange-200 shadow-md ring-1 ring-orange-100' : 'border-gray-200'}`}>
    <button 
      onClick={onToggle}
      className={`w-full flex items-center justify-between p-4 transition-colors text-left ${isOpen ? 'bg-orange-50/50' : 'bg-white hover:bg-gray-50'}`}
    >
        <h3 className={`text-lg font-bold flex items-center gap-2 ${isOpen ? 'text-orange-900' : 'text-slate-700'}`}>
            <Icon size={18} className={isOpen ? 'text-orange-500' : 'text-slate-400'}/> {title}
        </h3>
        <div className="flex items-center gap-3">
            {badge && <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{badge}</span>}
            {isOpen ? <ChevronUp size={20} className="text-orange-400"/> : <ChevronDown size={20} className="text-slate-400"/>}
        </div>
    </button>
    {isOpen && (
        <div className="p-6 border-t border-orange-100/50 bg-white animate-fade-in">
            {children}
        </div>
    )}
  </div>
);

const UserProfilePage: React.FC = () => {
  const { availableLanguages, availableCurrencies, language, setLanguage, currency, setCurrency } = useLanguage();
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');
  const [avatar, setAvatar] = useState(MOCK_USER.avatar);
  const [isAvatarProcessing, setIsAvatarProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const initialNotifications = { email: true, sms: false, push: true, marketing: false };
  const initialSecurity = { twoFactor: true, profileVisibility: 'public' };

  const [notifications, setNotifications] = useState(initialNotifications);
  const [securitySettings, setSecuritySettings] = useState(initialSecurity);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(INITIAL_PAYMENT_METHODS);
  
  const [isDirty, setIsDirty] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [expandedSections, setExpandedSections] = useState({
    notifications: true,
    security: false,
    linked: false,
    verification: false,
    payment: false,
    preferences: false
  });

  const [verificationStatus, setVerificationStatus] = useState<'unverified' | 'pending' | 'verified'>('unverified');

  // --- Payment Modal State ---
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardForm, setCardForm] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [processingCard, setProcessingCard] = useState(false);
  const [secureStep, setSecureStep] = useState<'input' | '3ds' | 'success'>('input');
  const [cardError, setCardError] = useState('');
  const [otp, setOtp] = useState('');

  const handleNotificationsChange = (key: keyof typeof notifications, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };
  
  const handleSecurityChange = (key: keyof typeof securitySettings, value: any) => {
    setSecuritySettings(prev => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const handleSaveChanges = () => {
    console.log("Saving changes...", { notifications, securitySettings });
    setIsDirty(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleDiscardChanges = () => {
    setNotifications(initialNotifications);
    setSecuritySettings(initialSecurity);
    setIsDirty(false);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const openSettingsSection = (section: keyof typeof expandedSections) => {
      setActiveTab('settings');
      setExpandedSections(prev => ({
          ...prev,
          notifications: false,
          security: false,
          linked: false,
          verification: false,
          payment: false,
          preferences: false,
          [section]: true
      }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVerificationUpload = () => {
      const confirmUpload = window.confirm("Upload business license and tax registration documents?");
      if (confirmUpload) {
          setVerificationStatus('pending');
          alert("Documents uploaded successfully! Your verification is now pending review (approx 24-48h).");
      }
  };

  // Secure Avatar Upload with Scrubbing
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsAvatarProcessing(true);
      
      // 1. Signature Verification
      const isValid = await verifyFileSignature(file);
      if(!isValid) {
          alert("Security Error: Invalid file format.");
          setIsAvatarProcessing(false);
          return;
      }

      // 2. Sanitization (Canvas redraw)
      const cleanFile = await sanitizeImageFile(file);
      if (cleanFile) {
          const imageUrl = URL.createObjectURL(cleanFile);
          setAvatar(imageUrl);
          setIsDirty(true);
      } else {
          alert("Error processing image. The file might be corrupt.");
      }
      setIsAvatarProcessing(false);
    }
  };

  // --- Payment Handlers ---
  const handleAddCardClick = () => {
      setCardForm({ number: '', expiry: '', cvv: '', name: '' });
      setSecureStep('input');
      setCardError('');
      setOtp('');
      setShowAddCard(true);
  };

  const handleCardSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      // Basic Validation
      if (!cardForm.number || !cardForm.expiry || !cardForm.cvv || !cardForm.name) {
          setCardError('All fields are required.');
          return;
      }

      // Luhn Check (Forgery Protection)
      if (!validateCardLuhn(cardForm.number.replace(/\s/g, ''))) {
          setCardError('Invalid card number. Please check for typos.');
          return;
      }

      setProcessingCard(true);
      
      // Simulate API delay then trigger 3DS
      setTimeout(() => {
          setProcessingCard(false);
          setSecureStep('3ds');
      }, 1500);
  };

  const handle3DSSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (otp.length !== 6) {
          alert("Please enter a valid 6-digit OTP.");
          return;
      }
      
      setProcessingCard(true);
      setTimeout(() => {
          setProcessingCard(false);
          setSecureStep('success');
          
          // Add to list
          const newCard: PaymentMethod = {
              id: `pm_${Date.now()}`,
              type: 'Visa', // Mock detection
              last4: cardForm.number.slice(-4),
              expiry: cardForm.expiry,
              isDefault: false
          };
          setPaymentMethods(prev => [...prev, newCard]);
          
          // Close after short delay
          setTimeout(() => {
              setShowAddCard(false);
          }, 1500);
      }, 2000);
  };

  const handleDeleteCard = (id: string) => {
      if(window.confirm('Are you sure you want to remove this card?')) {
          setPaymentMethods(prev => prev.filter(p => p.id !== id));
      }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Sidebar - Profile Card */}
        <div className="lg:col-span-4 space-y-6">
           {/* Digital Business Card */}
           <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden relative group">
              <div className="h-24 bg-gradient-to-r from-slate-800 to-slate-900"></div>
              <div className="px-6 pb-6 relative">
                 {/* Interactive Avatar Upload */}
                 <div 
                    className="absolute -top-12 left-6 w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-md cursor-pointer group/avatar relative bg-gray-200"
                    onClick={() => !isAvatarProcessing && fileInputRef.current?.click()}
                    title="Click to change profile picture"
                 >
                    <img src={avatar} alt="Profile" className={`w-full h-full object-cover transition-opacity ${isAvatarProcessing ? 'opacity-50' : 'group-hover/avatar:opacity-75'}`}/>
                    
                    {isAvatarProcessing ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <Loader2 className="animate-spin text-white" size={24}/>
                        </div>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity bg-black/20">
                            <Camera className="text-white drop-shadow-md" size={24} />
                        </div>
                    )}
                    
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/png, image/jpeg"
                        onChange={handleImageUpload} 
                    />
                 </div>
                 
                 <div className="mt-14">
                    <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-2xl font-bold text-slate-800">{MOCK_USER.name}</h1>
                        <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border shadow-sm ${
                            MOCK_USER.level === 'Enterprise' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                            MOCK_USER.level === 'Pro' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                            'bg-gray-100 text-gray-600 border-gray-200'
                        }`}>
                            {(MOCK_USER.level === 'Pro' || MOCK_USER.level === 'Enterprise') && <Crown size={12} fill="currentColor"/>}
                            {MOCK_USER.level}
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm mb-4">{MOCK_USER.role} at {MOCK_USER.companyName}</p>
                    
                    <div className="space-y-3 text-sm text-gray-600 border-t border-gray-100 pt-4">
                       <div className="flex items-center gap-3">
                          <Mail size={16} className="text-gray-400"/> {MOCK_USER.email}
                       </div>
                       <div className="flex items-center gap-3">
                          <Phone size={16} className="text-gray-400"/> {MOCK_USER.phone}
                       </div>
                       <div className="flex items-center gap-3">
                          <MapPin size={16} className="text-gray-400"/> New York, USA
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Settings Nav */}
           <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              <nav className="flex flex-col">
                 <button 
                    onClick={() => setActiveTab('profile')}
                    className={`flex items-center gap-3 px-6 py-4 hover:bg-orange-50 transition-colors border-l-4 w-full text-left ${activeTab === 'profile' ? 'border-orange-500 bg-orange-50/50 text-orange-600' : 'border-transparent text-gray-600'}`}
                 >
                    <User size={18}/> My Profile
                 </button>
                 <button 
                    onClick={() => openSettingsSection('verification')}
                    className={`flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors border-l-4 w-full text-left ${activeTab === 'settings' && expandedSections.verification ? 'border-orange-500 bg-orange-50/30 text-orange-700' : 'border-transparent text-gray-600'}`}
                 >
                    <Briefcase size={18}/> Business Verification
                 </button>
                 <button 
                    onClick={() => openSettingsSection('payment')}
                    className={`flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors border-l-4 w-full text-left ${activeTab === 'settings' && expandedSections.payment ? 'border-orange-500 bg-orange-50/30 text-orange-700' : 'border-transparent text-gray-600'}`}
                 >
                    <CreditCard size={18}/> Payment Methods
                 </button>
                 <button 
                    onClick={() => setActiveTab('settings')}
                    className={`flex items-center gap-3 px-6 py-4 hover:bg-orange-50 transition-colors border-l-4 w-full text-left ${activeTab === 'settings' && !expandedSections.verification && !expandedSections.payment ? 'border-orange-500 bg-orange-50/50 text-orange-600' : 'border-transparent text-gray-600'}`}
                 >
                    <Settings size={18}/> Account Settings
                 </button>
              </nav>
           </div>
        </div>

        {/* Right Content */}
        <div className="lg:col-span-8 space-y-8">
           
           {activeTab === 'profile' && (
             <div className="animate-fade-in space-y-8">
                {/* AI Recommendations */}
                <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-xl p-8 text-white relative overflow-hidden shadow-xl">
                    <div className="relative z-10 flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
                                <Sparkles className="text-yellow-400"/> AI Procurement Assistant
                            </h2>
                            <p className="text-indigo-200 text-sm max-w-md">
                                Based on your recent RFQs for <span className="text-white font-bold">Electronics</span>, 
                                we found 5 new Verified Suppliers in Vietnam with 15% lower MOQ.
                            </p>
                        </div>
                        <button className="bg-white text-indigo-900 px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-indigo-50 transition-colors">
                            View Suggestions
                        </button>
                    </div>
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-5 rounded-full"></div>
                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-purple-500 opacity-20 rounded-full blur-2xl"></div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center hover:translate-y-1 transition-transform">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                            <History size={24}/>
                        </div>
                        <div className="text-2xl font-bold text-slate-800">12</div>
                        <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Active RFQs</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center hover:translate-y-1 transition-transform">
                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-3">
                            <Heart size={24}/>
                        </div>
                        <div className="text-2xl font-bold text-slate-800">45</div>
                        <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Saved Items</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center hover:translate-y-1 transition-transform">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                            <TrendingUp size={24}/>
                        </div>
                        <div className="text-2xl font-bold text-slate-800">$45k</div>
                        <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Yearly Spend</div>
                    </div>
                </div>

                {/* Sourcing Interests */}
                <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                           <Tag className="text-orange-500"/> Sourcing Interests
                        </h3>
                        <button className="text-sm text-orange-500 font-medium hover:underline">Edit Preferences</button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {MOCK_USER.sourcingCategories.map(cat => (
                            <span key={cat} className="px-4 py-2 bg-orange-50 border border-orange-100 text-orange-800 rounded-full text-sm font-medium hover:bg-orange-100 transition-colors cursor-pointer flex items-center gap-2 shadow-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                                {cat}
                            </span>
                        ))}
                        <button className="px-4 py-2 border border-dashed border-gray-300 text-gray-400 rounded-full text-sm hover:border-orange-500 hover:text-orange-500 transition-colors flex items-center gap-2">
                            <Plus size={14}/> Add Category
                        </button>
                    </div>
                </div>
             </div>
           )}

           {activeTab === 'settings' && (
             <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 animate-fade-in">
               <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-2">
                  <Settings className="text-orange-500"/> Account Settings
               </h2>

               <div className="space-y-4">
                  {/* Preferences Accordion */}
                  <AccordionItem 
                    title="Preferences & Privacy" 
                    icon={Globe} 
                    isOpen={expandedSections.preferences} 
                    onToggle={() => toggleSection('preferences')}
                  >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                              <label className="block text-sm font-bold text-slate-700 mb-2">Platform Language</label>
                              <select 
                                value={language} 
                                onChange={(e) => { setLanguage(e.target.value as any); setIsDirty(true); }}
                                className="w-full p-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:border-orange-500 outline-none"
                              >
                                  {availableLanguages.map(l => (
                                      <option key={l.code} value={l.code}>{l.flag} {l.label}</option>
                                  ))}
                              </select>
                          </div>
                          <div>
                              <label className="block text-sm font-bold text-slate-700 mb-2">Default Currency</label>
                              <select 
                                value={currency}
                                onChange={(e) => { setCurrency(e.target.value as any); setIsDirty(true); }}
                                className="w-full p-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:border-orange-500 outline-none"
                              >
                                  {availableCurrencies.map(c => (
                                      <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>
                                  ))}
                              </select>
                          </div>
                          <div className="col-span-full border-t border-gray-100 pt-6 mt-2">
                              <div className="flex justify-between items-center">
                                  <div>
                                      <div className="font-bold text-slate-800">Profile Visibility</div>
                                      <div className="text-xs text-slate-500">Control who can see your business profile and history.</div>
                                  </div>
                                  <div className="flex bg-gray-100 rounded-lg p-1">
                                      <button 
                                        onClick={() => handleSecurityChange('profileVisibility', 'public')}
                                        className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${securitySettings.profileVisibility === 'public' ? 'bg-white shadow text-slate-800' : 'text-gray-500'}`}
                                      >
                                          Public
                                      </button>
                                      <button 
                                        onClick={() => handleSecurityChange('profileVisibility', 'private')}
                                        className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${securitySettings.profileVisibility === 'private' ? 'bg-white shadow text-slate-800' : 'text-gray-500'}`}
                                      >
                                          Private
                                      </button>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </AccordionItem>

                  {/* Notifications Accordion */}
                  <AccordionItem 
                    title="Notification Preferences" 
                    icon={Bell} 
                    isOpen={expandedSections.notifications} 
                    onToggle={() => toggleSection('notifications')}
                  >
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                               <div>
                                  <div className="font-bold text-slate-800">Email Notifications</div>
                                  <div className="text-xs text-slate-500">Receive order updates and RFQ alerts via email.</div>
                               </div>
                               <button onClick={() => handleNotificationsChange('email', !notifications.email)} className={`text-2xl transition-colors ${notifications.email ? 'text-green-500' : 'text-gray-300'}`}>
                                  {notifications.email ? <ToggleRight size={36} fill="currentColor" className="text-green-100"/> : <ToggleLeft size={36}/>}
                               </button>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                               <div>
                                  <div className="font-bold text-slate-800">SMS Notifications</div>
                                  <div className="text-xs text-slate-500">Get urgent delivery updates on your phone.</div>
                               </div>
                               <button onClick={() => handleNotificationsChange('sms', !notifications.sms)} className={`text-2xl transition-colors ${notifications.sms ? 'text-green-500' : 'text-gray-300'}`}>
                                  {notifications.sms ? <ToggleRight size={36} fill="currentColor" className="text-green-100"/> : <ToggleLeft size={36}/>}
                               </button>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                               <div>
                                  <div className="font-bold text-slate-800">Push Notifications</div>
                                  <div className="text-xs text-slate-500">Real-time alerts for browser and mobile app.</div>
                               </div>
                               <button onClick={() => handleNotificationsChange('push', !notifications.push)} className={`text-2xl transition-colors ${notifications.push ? 'text-green-500' : 'text-gray-300'}`}>
                                  {notifications.push ? <ToggleRight size={36} fill="currentColor" className="text-green-100"/> : <ToggleLeft size={36}/>}
                               </button>
                            </div>
                        </div>
                  </AccordionItem>

                  {/* Supplier Verification Accordion */}
                   <AccordionItem 
                    title="Supplier Verification" 
                    icon={ShieldCheck} 
                    isOpen={expandedSections.verification} 
                    onToggle={() => toggleSection('verification')}
                    badge={verificationStatus === 'verified' ? 'Verified' : undefined}
                  >
                             {verificationStatus === 'verified' ? (
                                 <div className="flex flex-col items-center justify-center py-6 text-center">
                                     <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                         <CheckCircle size={32}/>
                                     </div>
                                     <h4 className="text-xl font-bold text-slate-800">Verified Supplier</h4>
                                     <p className="text-slate-500 mt-2 mb-4">Your business documents have been verified. You have full access to supplier features.</p>
                                     <button className="text-orange-500 font-bold hover:underline">View Verified Badge</button>
                                 </div>
                             ) : verificationStatus === 'pending' ? (
                                 <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 flex flex-col items-center text-center">
                                     <Clock size={32} className="text-yellow-600 mb-3"/>
                                     <h4 className="text-lg font-bold text-yellow-800">Verification Pending</h4>
                                     <p className="text-yellow-700 text-sm mt-2 max-w-md">
                                         We are currently reviewing your documents. This process typically takes 24-48 hours. You will be notified via email once completed.
                                     </p>
                                 </div>
                             ) : (
                                 <div>
                                     <div className="mb-6">
                                         <h4 className="font-bold text-slate-800 mb-2">Become a Verified Supplier</h4>
                                         <p className="text-sm text-slate-500 mb-4">
                                             Unlock premium features, gain buyer trust with a verified badge, and increase your ranking in search results.
                                             Please upload your Business License and Tax Registration.
                                         </p>
                                         <div className="flex gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100 mb-6">
                                             <AlertCircle className="text-blue-500 flex-shrink-0" size={20}/>
                                             <div className="text-sm text-blue-700">
                                                 <span className="font-bold">Required:</span> Valid Government Business License, Tax ID, and Proof of Address (Utility Bill).
                                             </div>
                                         </div>
                                     </div>

                                     <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer" onClick={handleVerificationUpload}>
                                         <Upload size={32} className="mx-auto text-gray-400 mb-3"/>
                                         <div className="text-sm font-medium text-slate-700">Click to upload documents</div>
                                         <div className="text-xs text-gray-400 mt-1">PDF, JPG, or PNG (Max 10MB)</div>
                                     </div>
                                     
                                     <div className="mt-6 flex justify-end">
                                         <button 
                                            onClick={handleVerificationUpload}
                                            className="bg-orange-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-orange-600 transition-colors shadow-sm"
                                        >
                                            Submit for Verification
                                        </button>
                                     </div>
                                 </div>
                             )}
                  </AccordionItem>

                  {/* Payment Methods Accordion */}
                  <AccordionItem 
                    title="Payment Methods" 
                    icon={CreditCard} 
                    isOpen={expandedSections.payment} 
                    onToggle={() => toggleSection('payment')}
                  >
                      {/* ... (Existing Payment UI) ... */}
                      <div className="space-y-4">
                          {paymentMethods.map(pm => (
                              <div key={pm.id} className="p-4 border border-gray-200 rounded-lg flex items-center justify-between bg-white hover:shadow-sm transition-shadow">
                                  <div className="flex items-center gap-4">
                                      <div className={`w-12 h-8 rounded flex items-center justify-center text-white text-xs font-bold ${pm.type === 'Visa' ? 'bg-blue-900' : pm.type === 'MasterCard' ? 'bg-orange-600' : 'bg-blue-500'}`}>
                                          {pm.type}
                                      </div>
                                      <div>
                                          <div className="font-bold text-slate-800 flex items-center gap-2">
                                              {pm.type} ending in {pm.last4}
                                              {pm.isDefault && <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">Default</span>}
                                          </div>
                                          <div className="text-xs text-gray-500">Expires {pm.expiry}</div>
                                      </div>
                                  </div>
                                  <button onClick={() => handleDeleteCard(pm.id)} className="text-gray-400 hover:text-red-500 p-2 rounded hover:bg-red-50 transition-colors">
                                      <Trash2 size={18}/>
                                  </button>
                              </div>
                          ))}
                          
                          <button 
                            onClick={handleAddCardClick}
                            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 font-bold hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50 transition-all flex items-center justify-center gap-2"
                          >
                              <Plus size={18}/> Add New Card
                          </button>
                      </div>
                  </AccordionItem>
                  
                  {/* Security Accordion */}
                   <AccordionItem 
                    title="Security & Login" 
                    icon={Lock} 
                    isOpen={expandedSections.security} 
                    onToggle={() => toggleSection('security')}
                  >
                             <div className="space-y-8">
                                {/* Password Change */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="col-span-full">
                                        <h4 className="font-bold text-slate-800 text-sm mb-4 border-b border-gray-100 pb-2">Change Password</h4>
                                    </div>
                                    <div className="col-span-full">
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Current Password</label>
                                        <div className="relative">
                                            <input type="password" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none" placeholder="••••••••"/>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">New Password</label>
                                        <input type="password" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none" placeholder="New password"/>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Confirm New Password</label>
                                        <input type="password" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none" placeholder="Confirm password"/>
                                    </div>
                                    <div className="col-span-full flex justify-end">
                                        <button className="bg-slate-800 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-slate-700 transition-colors shadow-sm">
                                            Update Password
                                        </button>
                                    </div>
                                </div>

                                {/* Two-Factor Auth */}
                                <div className="border-t border-gray-100 pt-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <div className="font-bold text-slate-800 flex items-center gap-2">Two-Factor Authentication (2FA)</div>
                                            <div className="text-xs text-slate-500">Secure your account with an additional layer of security.</div>
                                        </div>
                                        <button 
                                            onClick={() => handleSecurityChange('twoFactor', !securitySettings.twoFactor)}
                                            className={`text-2xl transition-colors ${securitySettings.twoFactor ? 'text-green-500' : 'text-gray-300'}`}
                                        >
                                            {securitySettings.twoFactor ? <ToggleRight size={36} fill="currentColor" className="text-green-100"/> : <ToggleLeft size={36}/>}
                                        </button>
                                    </div>
                                    {securitySettings.twoFactor && (
                                        <div className="bg-green-50 p-3 rounded-lg border border-green-100 text-xs text-green-800 flex items-center gap-2">
                                            <CheckCircle size={14}/> 2FA is currently enabled via Google Authenticator.
                                        </div>
                                    )}
                                </div>

                                {/* Active Sessions */}
                                <div className="border-t border-gray-100 pt-6">
                                    <h4 className="font-bold text-slate-800 text-sm mb-4">Active Sessions</h4>
                                    <div className="space-y-3">
                                        {ACTIVE_SESSIONS.map(session => (
                                            <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-white p-2 rounded-lg border border-gray-200 text-slate-500">
                                                        <session.icon size={20}/>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-sm text-slate-700">{session.device}</div>
                                                        <div className="text-xs text-gray-500">{session.location} • {session.ip}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`text-xs font-bold ${session.lastActive === 'Current Session' ? 'text-green-600' : 'text-slate-400'}`}>
                                                        {session.lastActive}
                                                    </div>
                                                    {session.lastActive !== 'Current Session' && (
                                                        <button className="text-xs text-red-500 hover:underline mt-1 flex items-center justify-end gap-1">
                                                            Revoke <LogOut size={10}/>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                             </div>
                  </AccordionItem>

                  {/* Linked Services Accordion */}
                   <AccordionItem 
                    title="Linked Services" 
                    icon={LinkIcon} 
                    isOpen={expandedSections.linked} 
                    onToggle={() => toggleSection('linked')}
                  >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center p-2">
                                        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-full h-full object-contain"/>
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-800">Google Account</div>
                                        <div className="text-xs text-green-600 flex items-center gap-1 font-medium">
                                            <CheckCircle size={10}/> Connected as alex.m@globalimports.com
                                        </div>
                                    </div>
                                </div>
                                <button className="text-xs font-bold text-slate-500 border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50 transition-colors">Disconnect</button>
                                </div>
                                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-[#0077b5] rounded-full flex items-center justify-center text-white font-bold text-sm">
                                        in
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-800">LinkedIn</div>
                                        <div className="text-xs text-gray-400">Not connected</div>
                                    </div>
                                </div>
                                <button className="text-xs font-bold text-blue-600 border border-blue-600 px-3 py-1.5 rounded hover:bg-blue-50 transition-colors">Connect</button>
                                </div>
                            </div>
                  </AccordionItem>

                  {/* Danger Zone */}
                  <div className="mt-8 pt-8 border-t border-gray-200">
                      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                          <h4 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                              <AlertTriangle size={18}/> Danger Zone
                          </h4>
                          <p className="text-sm text-red-700 mb-4">
                              Deleting your account is irreversible. All your data, orders, and history will be permanently removed.
                          </p>
                          <button 
                            className="bg-white border border-red-300 text-red-600 px-6 py-2 rounded-lg font-bold text-sm hover:bg-red-600 hover:text-white transition-colors"
                            onClick={() => alert('Account deletion flow initiated.')}
                          >
                              Delete Account
                          </button>
                      </div>
                  </div>
               </div>
             </div>
           )}
        </div>
      </div>
        
        {/* Secure Add Card Modal */}
        {showAddCard && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
                {/* ... (Existing Modal Content) ... */}
                <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative">
                    {/* Header */}
                    <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2 font-bold">
                            <Lock size={16} className="text-green-400"/>
                            Secure Payment Setup
                        </div>
                        <button onClick={() => setShowAddCard(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
                    </div>

                    <div className="p-6">
                        {secureStep === 'input' && (
                            <form onSubmit={handleCardSubmit} className="space-y-4">
                                <div className="text-center mb-6">
                                    <ShieldCheck size={48} className="mx-auto text-green-500 mb-2"/>
                                    <h3 className="font-bold text-slate-800 text-lg">Add New Card</h3>
                                    <p className="text-xs text-slate-500">Your details are encrypted using 256-bit SSL.</p>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cardholder Name</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                                        placeholder="Name on Card"
                                        value={cardForm.name}
                                        onChange={e => setCardForm({...cardForm, name: e.target.value})}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Card Number</label>
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            maxLength={19}
                                            className="w-full pl-10 p-3 border border-gray-300 rounded-lg text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                                            placeholder="0000 0000 0000 0000"
                                            value={cardForm.number}
                                            onChange={e => setCardForm({...cardForm, number: e.target.value})}
                                        />
                                        <CreditCard size={18} className="absolute left-3 top-3 text-gray-400"/>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Expiry Date</label>
                                        <input 
                                            type="text" 
                                            maxLength={5}
                                            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                                            placeholder="MM/YY"
                                            value={cardForm.expiry}
                                            onChange={e => setCardForm({...cardForm, expiry: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CVV</label>
                                        <div className="relative">
                                            <input 
                                                type="password" 
                                                maxLength={4}
                                                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                                                placeholder="***"
                                                value={cardForm.cvv}
                                                onChange={e => setCardForm({...cardForm, cvv: e.target.value})}
                                            />
                                            <Lock size={14} className="absolute right-3 top-3.5 text-gray-400"/>
                                        </div>
                                    </div>
                                </div>

                                {cardError && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-2 rounded flex items-center gap-2">
                                        <AlertTriangle size={14}/> {cardError}
                                    </div>
                                )}

                                <button 
                                    type="submit" 
                                    disabled={processingCard}
                                    className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors flex justify-center items-center gap-2 shadow-lg"
                                >
                                    {processingCard ? <Loader2 className="animate-spin" size={18}/> : <Lock size={16}/>}
                                    {processingCard ? 'Verifying...' : 'Secure Save'}
                                </button>
                                
                                <div className="flex justify-center gap-4 mt-2">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4 opacity-50" alt="Visa"/>
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4 opacity-50" alt="Mastercard"/>
                                </div>
                            </form>
                        )}

                        {/* 3D Secure Simulation Step */}
                        {secureStep === '3ds' && (
                            <form onSubmit={handle3DSSubmit} className="animate-fade-in text-center space-y-6">
                                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                                    <div className="flex justify-center mb-4">
                                        <div className="bg-white p-2 rounded shadow-sm border">
                                            <Globe size={32} className="text-blue-600"/>
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-slate-800">Verified by Bank</h3>
                                    <p className="text-xs text-slate-500 mt-1">Please enter the One-Time Password (OTP) sent to your mobile ending in **88.</p>
                                </div>

                                <div>
                                    <input 
                                        type="text" 
                                        maxLength={6}
                                        className="w-full p-4 text-center text-2xl font-mono tracking-widest border-2 border-slate-300 rounded-xl focus:border-blue-500 outline-none"
                                        placeholder="000000"
                                        value={otp}
                                        onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                                        autoFocus
                                    />
                                    <p className="text-xs text-slate-400 mt-2">Resend OTP in 30s</p>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={processingCard}
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg flex justify-center items-center gap-2"
                                >
                                    {processingCard ? <Loader2 className="animate-spin" size={18}/> : 'Submit'}
                                </button>
                            </form>
                        )}

                        {/* Success Step */}
                        {secureStep === 'success' && (
                            <div className="text-center py-8 animate-scale-in">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle size={40} className="text-green-600"/>
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">Card Added Successfully</h3>
                                <p className="text-sm text-slate-500 mt-2">Your payment method is now ready for secure transactions.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}
        
        {/* Save Bar */}
        {isDirty && (
            <div className="fixed bottom-0 left-0 right-0 z-50 animate-fade-in-up">
                <div className="container mx-auto px-4 pb-4">
                    <div className="bg-slate-900 text-white rounded-xl shadow-2xl p-4 flex justify-between items-center">
                        <p className="text-sm font-medium">You have unsaved changes.</p>
                        <div className="flex gap-3">
                            <button onClick={handleDiscardChanges} className="px-4 py-2 text-sm font-bold hover:bg-slate-700 rounded-lg">Discard</button>
                            <button onClick={handleSaveChanges} className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg">
                                <Save size={16}/> Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
        
        {/* Success Toast */}
        {showSuccess && (
            <div className="fixed top-20 right-4 z-50 animate-fade-in-up">
                <div className="bg-green-500 text-white rounded-lg shadow-lg p-3 flex items-center gap-2">
                    <CheckCircle size={20}/>
                    <span className="text-sm font-bold">Settings saved successfully!</span>
                </div>
            </div>
        )}
    </div>
  );
};

export default UserProfilePage;
