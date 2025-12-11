
import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { User, Building2, Store, Mail, Lock, Phone, ArrowRight, CheckCircle, Upload, Globe, AlertTriangle, FileText, MapPin, DollarSign, Calendar, Loader2, ShieldCheck, Briefcase } from 'lucide-react';
import { verifyDocumentOCR, performRiskAssessment } from '../services/gemini';

type RoleType = 'buyer' | 'seller' | 'partner';

const RegistrationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // State Management
  const [role, setRole] = useState<RoleType>((searchParams.get('role') as RoleType) || 'buyer');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'scanning' | 'verified' | 'failed'>('idle');

  // Unified Form State (Superset of all fields)
  const [formData, setFormData] = useState({
    // Account Basics
    full_name: '',
    email: '',
    password: '',
    phone: '',
    otp: '',
    
    // Buyer Specific
    sourcing_interests: [] as string[],
    sourcing_volume: '',
    shipping_country: 'United States',
    
    // Seller Specific
    company_legal_name: '',
    reg_number: '',
    year_established: '',
    business_type: 'Manufacturer',
    main_categories: [] as string[],
    factory_location: '',
    moq: '',
    lead_time: '',
    
    // Partner Specific
    target_territory: '',
    warehouse_space: '',
    investment_budget: '',
    current_role: '',
  });

  const [files, setFiles] = useState<Record<string, File | null>>({});

  // --- Step Definitions ---
  const STEPS: Record<RoleType, string[]> = {
    buyer: ['Account Basics', 'Sourcing Profile', 'Company Info (Opt)'],
    seller: ['Credentials', 'Business Reg', 'Operations', 'Compliance'],
    partner: ['Application', 'Territory', 'Financials', 'Review']
  };

  const currentSteps = STEPS[role];

  // --- Handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(prev => ({ ...prev, [key]: e.target.files![0] }));
    }
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation Logic (Simplified)
    if (step === 1 && !formData.email.includes('@')) {
        alert("Please enter a valid email.");
        return;
    }

    // Role-specific logic before moving next
    if (role === 'seller' && step === 1) {
        if (formData.email.includes('gmail.com') || formData.email.includes('yahoo.com')) {
            alert("Sellers must use a corporate email domain.");
            return;
        }
    }

    if (step < currentSteps.length) {
      setStep(step + 1);
    } else {
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    // 1. Risk Assessment (AI)
    const risk = await performRiskAssessment({ email: formData.email, role });
    
    if (risk.riskLevel === 'High') {
        alert(`Registration Flagged: ${risk.flags.join(', ')}. Please contact support.`);
        setLoading(false);
        return;
    }

    // 2. OCR Verification (Seller Only)
    if (role === 'seller' && files['business_license']) {
        setVerificationStatus('scanning');
        const ocr = await verifyDocumentOCR('Business License', formData.company_legal_name);
        if (!ocr.match) {
            alert("Document verification failed. Name on license does not match company name.");
            setVerificationStatus('failed');
            setLoading(false);
            return;
        }
        setVerificationStatus('verified');
    }

    // 3. Success Simulation
    setTimeout(() => {
        setLoading(false);
        if (role === 'buyer') navigate('/dashboard');
        if (role === 'seller') navigate('/supplier-dashboard'); // Or a "Pending Approval" page
        if (role === 'partner') alert("Application Submitted! An agent will contact you shortly.");
    }, 1500);
  };

  // --- Render Functions for Steps ---

  const renderRoleSelector = () => (
    <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-xl mb-8">
        {(['buyer', 'seller', 'partner'] as RoleType[]).map((r) => (
        <button
            key={r}
            type="button"
            onClick={() => { setRole(r); setStep(1); setFormData({...formData, email: ''}); }}
            className={`flex flex-col items-center justify-center py-3 rounded-lg text-sm font-bold capitalize transition-all duration-200 ${
            role === r 
                ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
        >
            {r === 'buyer' && <User size={18} className="mb-1"/>}
            {r === 'seller' && <Building2 size={18} className="mb-1"/>}
            {r === 'partner' && <Store size={18} className="mb-1"/>}
            {r}
        </button>
        ))}
    </div>
  );

  const renderCommonAccount = () => (
    <div className="space-y-4 animate-fade-in">
        <h3 className="text-xl font-bold text-slate-800">Account Credentials</h3>
        <div className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Full Name</label>
                <input name="full_name" value={formData.full_name} onChange={handleInputChange} className="w-full p-3 border rounded-lg bg-slate-50" required placeholder="John Doe" />
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Work Email</label>
                <input name="email" type="email" value={formData.email} onChange={handleInputChange} className="w-full p-3 border rounded-lg bg-slate-50" required placeholder={role === 'seller' ? "name@company.com" : "email@example.com"} />
                {role === 'seller' && <p className="text-[10px] text-amber-600 mt-1">* Corporate domain required for sellers</p>}
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Mobile Phone (OTP)</label>
                <input name="phone" type="tel" value={formData.phone} onChange={handleInputChange} className="w-full p-3 border rounded-lg bg-slate-50" required placeholder="+1..." />
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Password</label>
                <input name="password" type="password" value={formData.password} onChange={handleInputChange} className="w-full p-3 border rounded-lg bg-slate-50" required placeholder="Min 8 chars, 1 special char" />
            </div>
        </div>
    </div>
  );

  // --- Dynamic Form Renderer ---
  const renderStepContent = () => {
    // BUYER FLOW
    if (role === 'buyer') {
        if (step === 1) return renderCommonAccount();
        if (step === 2) return (
            <div className="space-y-4 animate-fade-in">
                <h3 className="text-xl font-bold text-slate-800">Sourcing Preferences</h3>
                <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Primary Interest</label>
                    <select className="w-full p-3 border rounded-lg bg-slate-50">
                        <option>Consumer Electronics</option>
                        <option>Apparel & Textiles</option>
                        <option>Machinery</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Annual Volume</label>
                    <select name="sourcing_volume" value={formData.sourcing_volume} onChange={handleInputChange} className="w-full p-3 border rounded-lg bg-slate-50">
                        <option value="small">&lt; $10k</option>
                        <option value="medium">$10k - $100k</option>
                        <option value="large">$100k+</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Shipping Country</label>
                    <input name="shipping_country" value={formData.shipping_country} onChange={handleInputChange} className="w-full p-3 border rounded-lg bg-slate-50" />
                </div>
            </div>
        );
        if (step === 3) return (
            <div className="space-y-4 animate-fade-in">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-slate-800">Company Details</h3>
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600">Optional</span>
                </div>
                <p className="text-sm text-slate-500 mb-2">Provide details now to get "Verified Buyer" status and better credit terms.</p>
                <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Company Name</label>
                    <input className="w-full p-3 border rounded-lg bg-slate-50" placeholder="Legal Entity Name" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Tax ID / VAT</label>
                    <input className="w-full p-3 border rounded-lg bg-slate-50" placeholder="Optional" />
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                    <Upload className="mx-auto text-gray-400 mb-2" size={24}/>
                    <p className="text-xs text-slate-500">Upload Business License (PDF)</p>
                </div>
            </div>
        );
    }

    // SELLER FLOW
    if (role === 'seller') {
        if (step === 1) return renderCommonAccount();
        if (step === 2) return (
            <div className="space-y-4 animate-fade-in">
                <h3 className="text-xl font-bold text-slate-800">Business Registration</h3>
                <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Legal Company Name</label>
                    <input name="company_legal_name" value={formData.company_legal_name} onChange={handleInputChange} className="w-full p-3 border rounded-lg bg-slate-50" required />
                    <p className="text-[10px] text-slate-400 mt-1">Must match your business license exactly.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Registration No.</label>
                        <input name="reg_number" value={formData.reg_number} onChange={handleInputChange} className="w-full p-3 border rounded-lg bg-slate-50" required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Year Est.</label>
                        <input name="year_established" type="number" value={formData.year_established} onChange={handleInputChange} className="w-full p-3 border rounded-lg bg-slate-50" required />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Business Type</label>
                    <select name="business_type" value={formData.business_type} onChange={handleInputChange} className="w-full p-3 border rounded-lg bg-slate-50">
                        <option>Manufacturer</option>
                        <option>Trading Company</option>
                        <option>Distributor</option>
                    </select>
                </div>
            </div>
        );
        if (step === 3) return (
            <div className="space-y-4 animate-fade-in">
                <h3 className="text-xl font-bold text-slate-800">Operations Profile</h3>
                <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Factory Location</label>
                    <div className="relative">
                        <MapPin size={16} className="absolute left-3 top-3.5 text-gray-400"/>
                        <input name="factory_location" value={formData.factory_location} onChange={handleInputChange} className="w-full pl-9 p-3 border rounded-lg bg-slate-50" placeholder="City, Country" required />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Typical MOQ</label>
                        <input name="moq" value={formData.moq} onChange={handleInputChange} className="w-full p-3 border rounded-lg bg-slate-50" placeholder="e.g. 500" required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Lead Time (Days)</label>
                        <input name="lead_time" value={formData.lead_time} onChange={handleInputChange} className="w-full p-3 border rounded-lg bg-slate-50" placeholder="e.g. 15" required />
                    </div>
                </div>
            </div>
        );
        if (step === 4) return (
            <div className="space-y-6 animate-fade-in">
                <h3 className="text-xl font-bold text-slate-800">Compliance & KYC</h3>
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex gap-3">
                    <ShieldCheck className="text-blue-600 flex-shrink-0" size={24}/>
                    <div className="text-xs text-blue-800">
                        <strong>Identity Verification Required</strong><br/>
                        We use AI OCR to match your documents. Ensure clear scans.
                    </div>
                </div>
                
                <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                        <div>
                            <div className="font-bold text-sm text-slate-700">Business License</div>
                            <div className="text-xs text-slate-500">Official Gov Registration (PDF/JPG)</div>
                        </div>
                        <input type="file" onChange={(e) => handleFileChange('business_license', e)} className="text-xs"/>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                        <div>
                            <div className="font-bold text-sm text-slate-700">Tax Certificate</div>
                            <div className="text-xs text-slate-500">VAT/Tax ID Proof</div>
                        </div>
                        <input type="file" onChange={(e) => handleFileChange('tax_cert', e)} className="text-xs"/>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                        <div>
                            <div className="font-bold text-sm text-slate-700">Owner ID</div>
                            <div className="text-xs text-slate-500">Passport / National ID</div>
                        </div>
                        <input type="file" onChange={(e) => handleFileChange('id_proof', e)} className="text-xs"/>
                    </div>
                </div>
            </div>
        );
    }

    // PARTNER FLOW
    if (role === 'partner') {
        if (step === 1) return renderCommonAccount();
        if (step === 2) return (
            <div className="space-y-4 animate-fade-in">
                <h3 className="text-xl font-bold text-slate-800">Territory & Investment</h3>
                <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Target Territory</label>
                    <input name="target_territory" value={formData.target_territory} onChange={handleInputChange} className="w-full p-3 border rounded-lg bg-slate-50" placeholder="Region or City" required />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Investment Budget</label>
                    <select name="investment_budget" value={formData.investment_budget} onChange={handleInputChange} className="w-full p-3 border rounded-lg bg-slate-50">
                        <option>$50k - $100k</option>
                        <option>$100k - $250k</option>
                        <option>$250k+</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Available Warehouse Space</label>
                    <input name="warehouse_space" value={formData.warehouse_space} onChange={handleInputChange} className="w-full p-3 border rounded-lg bg-slate-50" placeholder="Sq. Ft." />
                </div>
            </div>
        );
        if (step === 3) return (
            <div className="space-y-6 animate-fade-in">
                <h3 className="text-xl font-bold text-slate-800">Proof of Funds</h3>
                <p className="text-sm text-slate-500">Please upload a bank letter or audited financial statement demonstrating liquid capital.</p>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:bg-slate-50">
                    <FileText size={32} className="mx-auto text-gray-400 mb-2"/>
                    <p className="font-bold text-slate-700">Upload Financial Document</p>
                    <input type="file" className="hidden"/>
                </div>
            </div>
        );
    }

    return <div>Select a role</div>;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-4xl w-full rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Side: Context & Branding */}
        <div className="md:w-1/3 bg-slate-900 text-white p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-20"></div>
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center font-bold">T</div>
                    <span className="text-xl font-bold">TradeGenius</span>
                </div>
                <h2 className="text-3xl font-extrabold mb-4 leading-tight">
                    {role === 'buyer' ? "Source Smarter." : role === 'seller' ? "Sell Globally." : "Partner with Us."}
                </h2>
                <p className="text-slate-300 text-sm">
                    {role === 'buyer' && "Access millions of products and verified suppliers."}
                    {role === 'seller' && "Reach 150M+ B2B buyers with trade assurance."}
                    {role === 'partner' && "Join our logistics and fulfillment network."}
                </p>
            </div>
            
            <div className="relative z-10 mt-auto">
                <div className="flex gap-2 mb-4">
                    {[1, 2, 3, 4].slice(0, currentSteps.length).map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full ${step >= i ? 'bg-orange-500' : 'bg-slate-700'}`}></div>
                    ))}
                </div>
                <p className="text-xs font-bold text-orange-400 uppercase tracking-wider">Step {step}: {currentSteps[step-1]}</p>
            </div>
        </div>

        {/* Right Side: Dynamic Form */}
        <div className="flex-1 p-8 md:p-12 overflow-y-auto">
            <div className="max-w-md mx-auto">
                {step === 1 && renderRoleSelector()}
                
                <form onSubmit={handleNext}>
                    {renderStepContent()}

                    {/* Navigation Buttons */}
                    <div className="mt-8 flex gap-4 pt-4 border-t border-slate-100">
                        {step > 1 && (
                            <button 
                                type="button" 
                                onClick={() => setStep(step - 1)}
                                className="px-6 py-3 border border-slate-200 rounded-lg font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                                Back
                            </button>
                        )}
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                        >
                            {loading ? <Loader2 className="animate-spin"/> : step === currentSteps.length ? (role === 'partner' ? 'Submit Application' : 'Complete Registration') : 'Next Step'}
                            {!loading && step < currentSteps.length && <ArrowRight size={18}/>}
                        </button>
                    </div>
                </form>

                {step === 1 && (
                    <p className="text-center text-xs text-slate-400 mt-6">
                        By joining, you agree to our <a href="#" className="underline">Terms</a> and <a href="#" className="underline">Privacy Policy</a>.
                    </p>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default RegistrationPage;
