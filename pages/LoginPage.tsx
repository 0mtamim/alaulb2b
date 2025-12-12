
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Smartphone, Lock, Eye, EyeOff, ShieldCheck, Globe, Truck, Loader2, Linkedin, Facebook } from 'lucide-react';
import { checkRateLimit } from '../utils/security'; // New Import

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState<'email' | 'mobile'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  
  const [formData, setFormData] = useState({
      email: '',
      password: '',
      phone: '',
      otp: ''
  });

  const handleLogin = (role: 'buyer' | 'seller' | 'admin' = 'buyer') => {
      setLoading(true);
      
      // Simulate API Login
      setTimeout(() => {
          setLoading(false);
          
          let mockUser;
          if (role === 'admin' || formData.email.toLowerCase() === 'admin@tradegenius.ai') {
              mockUser = {
                  name: "System Administrator",
                  email: "admin@tradegenius.ai",
                  role: "admin",
                  company: "TradeGenius HQ",
                  avatar: "https://i.pravatar.cc/150?img=3"
              };
          } else if (role === 'seller' || formData.email.toLowerCase().includes('seller')) {
               mockUser = {
                  name: "Shenzhen Tech",
                  email: formData.email || "sales@shenzhentech.com",
                  role: "seller",
                  company: "Shenzhen Tech Industries",
                  avatar: "https://i.pravatar.cc/150?img=12"
              };
          }
          else {
              mockUser = {
                  name: "Alex Morgan",
                  email: formData.email || "alex.m@globalimports.com",
                  role: "buyer",
                  company: "Global Imports LLC",
                  avatar: "https://i.pravatar.cc/150?img=11"
              };
          }
          
          localStorage.setItem('trade_user', JSON.stringify(mockUser));
          navigate('/dashboard');
      }, 1000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      // OWASP A04: Rate Limiting Check
      if (!checkRateLimit('login_attempt')) {
          alert("Too many login attempts. Please try again in a minute.");
          return;
      }

      // Basic detection based on email for demo purposes
      if (formData.email.includes('admin')) handleLogin('admin');
      else if (formData.email.includes('seller')) handleLogin('seller');
      else handleLogin('buyer');
  };

  const handleSendOtp = () => {
      if(!formData.phone) return alert("Please enter a phone number");
      
      // OWASP A04: Rate Limiting Check for OTP
      if (!checkRateLimit('otp_request', 3)) { // Stricter limit for OTP
          alert("Too many OTP requests. Please wait.");
          return;
      }

      setLoading(true);
      setTimeout(() => {
          setLoading(false);
          setOtpSent(true);
          alert(`OTP sent to ${formData.phone}: 1234`);
      }, 1000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans">
        
        {/* Left Side - Branding & Benefits */}
        <div className="hidden md:flex md:w-5/12 lg:w-1/3 bg-slate-900 text-white p-12 flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80')] bg-cover bg-center opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900/90"></div>
            
            <div className="relative z-10">
                <Link to="/" className="flex items-center gap-2 mb-10">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">T</div>
                    <span className="text-3xl font-bold tracking-tight">TradeGenius</span>
                </Link>
                
                <h2 className="text-4xl font-extrabold mb-6 leading-tight">
                    The Leading B2B <br/>
                    <span className="text-orange-500">Ecommerce Platform</span>
                </h2>
                <p className="text-slate-300 text-lg mb-8">
                    Connect with over 150 million buyers and suppliers worldwide. Secure, smart, and efficient.
                </p>

                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-slate-800 rounded-lg border border-slate-700 text-green-400">
                            <ShieldCheck size={24}/>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg">Trade Assurance</h4>
                            <p className="text-sm text-slate-400">Protect your orders from payment to delivery.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-slate-800 rounded-lg border border-slate-700 text-blue-400">
                            <Globe size={24}/>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg">Global Logistics</h4>
                            <p className="text-sm text-slate-400">Door-to-door shipping solutions.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-slate-800 rounded-lg border border-slate-700 text-purple-400">
                            <Truck size={24}/>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg">Verified Suppliers</h4>
                            <p className="text-sm text-slate-400">Source from inspected factories.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-10 text-xs text-slate-500 mt-12">
                © {new Date().getFullYear()} TradeGenius AI Network.
            </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex flex-col justify-center items-center p-6 bg-slate-50">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-800">Sign In</h2>
                    <Link to="/join" className="text-sm text-orange-600 font-bold hover:underline">
                        Join Free
                    </Link>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-6">
                    <button 
                        onClick={() => setLoginMethod('email')}
                        className={`flex-1 pb-3 text-sm font-bold transition-colors relative ${loginMethod === 'email' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Account Login
                    </button>
                    <button 
                        onClick={() => setLoginMethod('mobile')}
                        className={`flex-1 pb-3 text-sm font-bold transition-colors relative ${loginMethod === 'mobile' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Mobile SMS Login
                    </button>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-5">
                    {loginMethod === 'email' ? (
                        <>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1">Email Address or Member ID</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 text-gray-400" size={18}/>
                                    <input 
                                        type="email" 
                                        className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                                        placeholder="admin@tradegenius.ai"
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({...formData, email: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 text-gray-400" size={18}/>
                                    <input 
                                        type={showPassword ? "text" : "password"}
                                        className="w-full pl-10 pr-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                                        placeholder="Enter your password"
                                        required={loginMethod === 'email'}
                                        value={formData.password}
                                        onChange={e => setFormData({...formData, password: e.target.value})}
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1">Mobile Number</label>
                                <div className="flex">
                                    <select className="p-3 border border-gray-300 rounded-l-lg bg-gray-50 border-r-0 text-sm focus:outline-none">
                                        <option>+1</option>
                                        <option>+86</option>
                                        <option>+44</option>
                                        <option>+91</option>
                                    </select>
                                    <div className="relative flex-1">
                                        <Smartphone className="absolute left-3 top-3.5 text-gray-400" size={18}/>
                                        <input 
                                            type="tel" 
                                            className="w-full pl-10 p-3 border border-gray-300 rounded-r-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                                            placeholder="Mobile number"
                                            required={loginMethod === 'mobile'}
                                            value={formData.phone}
                                            onChange={e => setFormData({...formData, phone: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1">Verification Code</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                                        placeholder="Enter 4-digit code"
                                        maxLength={4}
                                        value={formData.otp}
                                        onChange={e => setFormData({...formData, otp: e.target.value})}
                                    />
                                    <button 
                                        type="button" 
                                        onClick={handleSendOtp}
                                        disabled={loading || otpSent}
                                        className="bg-gray-100 text-slate-700 px-4 rounded-lg font-bold text-sm hover:bg-gray-200 transition-colors disabled:opacity-50"
                                    >
                                        {otpSent ? 'Resend' : 'Get Code'}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="rounded text-orange-500 focus:ring-orange-500"/>
                            <span className="text-slate-600">Stay signed in</span>
                        </label>
                        <a href="#" className="text-slate-500 hover:text-orange-500 transition-colors">Forgot Password?</a>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-lg font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin"/> : 'Sign In'} 
                    </button>
                </form>

                {/* Demo Quick Logins */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-xs text-center text-slate-400 mb-3 uppercase font-bold tracking-wider">Quick Demo Login</p>
                    <div className="grid grid-cols-3 gap-2">
                        <button onClick={() => handleLogin('admin')} className="text-xs bg-red-50 text-red-700 border border-red-100 py-2 rounded hover:bg-red-100 font-bold">
                            Admin
                        </button>
                        <button onClick={() => handleLogin('seller')} className="text-xs bg-blue-50 text-blue-700 border border-blue-100 py-2 rounded hover:bg-blue-100 font-bold">
                            Seller
                        </button>
                        <button onClick={() => handleLogin('buyer')} className="text-xs bg-green-50 text-green-700 border border-green-100 py-2 rounded hover:bg-green-100 font-bold">
                            Buyer
                        </button>
                    </div>
                </div>

                <div className="mt-8">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-slate-400">Or continue with</span>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-3 gap-3">
                        <button className="flex items-center justify-center p-2.5 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors group">
                            <Linkedin className="text-[#0077b5]" size={24}/>
                        </button>
                        <button className="flex items-center justify-center p-2.5 border border-gray-200 rounded-lg hover:bg-slate-50 transition-colors">
                            <svg className="w-6 h-6" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                        </button>
                        <button className="flex items-center justify-center p-2.5 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors">
                            <Facebook className="text-[#1877F2]" size={24}/>
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="mt-8 text-center text-sm text-slate-400">
                <Link to="/join" className="hover:text-slate-600 mr-4">Privacy Policy</Link>
                <Link to="/join" className="hover:text-slate-600 mr-4">Terms of Use</Link>
                <Link to="/join" className="hover:text-slate-600">Help Center</Link>
            </div>
        </div>
    </div>
  );
};

export default LoginPage;
