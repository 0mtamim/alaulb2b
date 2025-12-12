
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, MessageSquare, Menu, LayoutDashboard, Clock, X, TrendingUp, History, Briefcase, Calendar, Globe, DollarSign, Ship, ShieldCheck, PenTool, Award, Layers, Users, CheckCircle, ChevronDown, LogIn, UserPlus, Crown, LogOut, Package, CreditCard } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useModules } from '../contexts/ModuleContext';
import { useCart } from '../contexts/CartContext';

const MOCK_SUGGESTIONS = [
  "CNC Machines", "Hydraulic Pumps", "Solar Panels", "Packaging Bags", 
  "Textiles", "Excavators", "Consumer Electronics", "Steel Beams",
  "Smart Sensors", "Heavy Machinery", "Sustainable Packaging", "Lithium Batteries"
];

// --- Language & Currency Modal Component ---
const LanguageSettingsModal = ({ 
  isOpen, 
  onClose,
  availableLanguages,
  availableCurrencies,
  currentLanguage,
  setLanguage,
  currentCurrency,
  setCurrency
}: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] animate-scale-in">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-20">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Regional Settings</h2>
            <p className="text-sm text-slate-500">Customize your language and currency preferences.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {/* Currency Section */}
          <section className="mb-8">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <DollarSign size={14} className="text-orange-500"/> Select Currency
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {availableCurrencies.map((c: any) => (
                <button
                  key={c.code}
                  onClick={() => setCurrency(c.code)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                    currentCurrency === c.code 
                      ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-sm transform scale-105' 
                      : 'border-slate-100 hover:border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-2xl font-bold mb-1">{c.symbol}</span>
                  <span className="text-sm font-bold">{c.code}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Language Section */}
          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Globe size={14} className="text-blue-500"/> Select Language
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {availableLanguages.map((l: any) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 text-left ${
                    currentLanguage === l.code 
                      ? 'border-orange-500 bg-orange-50 text-slate-900 shadow-sm' 
                      : 'border-slate-100 hover:border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-2xl shadow-sm rounded-sm overflow-hidden">{l.flag}</span>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className={`text-sm truncate ${currentLanguage === l.code ? 'font-bold' : 'font-medium'}`}>{l.label.split(' ')[0]}</span>
                    <span className="text-[10px] opacity-70 truncate">{l.label.split(' ')[1] || l.code.toUpperCase()}</span>
                  </div>
                  {currentLanguage === l.code && <CheckCircle size={16} className="flex-shrink-0 text-orange-500" />}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end sticky bottom-0 z-20">
          <button 
            onClick={onClose} 
            className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            Apply Settings
          </button>
        </div>
      </div>
    </div>
  );
};

const Navbar: React.FC = () => {
  const { language, setLanguage, currency, setCurrency, t, availableLanguages, availableCurrencies, isRTL } = useLanguage();
  const { modules } = useModules();
  const navigate = useNavigate();
  const { openCart, cartCount } = useCart();
  const location = useLocation();
  
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const searchRef = useRef<HTMLDivElement>(null);

  // Check auth state on mount and location change (to catch login updates)
  useEffect(() => {
    const checkAuth = () => {
      const userStr = localStorage.getItem('trade_user');
      if (userStr) {
        try {
          setCurrentUser(JSON.parse(userStr));
        } catch(e) {
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    };
    checkAuth();
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('trade_user');
    setCurrentUser(null);
    navigate('/');
  };

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse recent searches", e);
      }
    }
  }, []);

  // Handle click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset active index when query changes
  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    // Update Recent Searches (Unique, limit to 5)
    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
    
    setIsFocused(false);
    setQuery(searchTerm);
    navigate(`/?q=${encodeURIComponent(searchTerm)}`);
  };

  const clearHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const removeHistoryItem = (e: React.MouseEvent, item: string) => {
    e.stopPropagation();
    const updated = recentSearches.filter(s => s !== item);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const filteredSuggestions = MOCK_SUGGESTIONS.filter(s => 
    s.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 6);

  const currentLang = availableLanguages.find(l => l.code === language);
  const currentCurr = availableCurrencies.find(c => c.code === currency);

  // Determine items to display for keyboard navigation
  const getDisplayItems = () => {
    if (query === '') {
      return [
        ...recentSearches.map(term => ({ type: 'history', term })),
        ...MOCK_SUGGESTIONS.slice(0, 5).map(term => ({ type: 'trending', term }))
      ];
    }
    return filteredSuggestions.map(term => ({ type: 'suggestion', term }));
  };

  const displayItems = getDisplayItems();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isFocused) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < displayItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : displayItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && displayItems[activeIndex]) {
        handleSearch(displayItems[activeIndex].term);
      } else {
        handleSearch(query);
      }
    } else if (e.key === 'Escape') {
      setIsFocused(false);
    }
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        {/* Top Utility Bar */}
        <div className="bg-slate-900 text-white text-xs py-1 px-4 hidden md:flex justify-between">
          <div className="flex space-x-4">
            <Link to="/categories" className="hover:text-orange-400 cursor-pointer flex items-center gap-1"><Layers size={12}/> All Categories</Link>
            <Link to="/suppliers" className="hover:text-orange-400 cursor-pointer flex items-center gap-1"><Award size={12}/> Verified Suppliers</Link>
            <Link to="/premium-sellers" className="hover:text-orange-400 cursor-pointer flex items-center gap-1"><ShieldCheck size={12}/> Premium Directory</Link>
            <Link to="/buyers" className="hover:text-orange-400 cursor-pointer flex items-center gap-1 font-bold text-orange-300"><Users size={12}/> Find Buyers</Link>
            {modules.invest && (
              <Link to="/invest" className="hover:text-orange-400 cursor-pointer flex items-center gap-1 font-bold text-orange-200"><Briefcase size={12}/> {t('nav_invest')}</Link>
            )}
            {modules.logistics && (
              <Link to="/logistics" className="hover:text-orange-400 cursor-pointer flex items-center gap-1"><Ship size={12}/> Logistics</Link>
            )}
          </div>
          <div className="flex space-x-4 items-center">
            <Link to="/membership" className="hover:text-orange-400 cursor-pointer flex items-center gap-1 text-orange-200 font-bold"><Crown size={12}/> Membership</Link>
            
            {!currentUser && (
              <>
                <Link to="/join" className="hover:text-orange-400 cursor-pointer flex items-center gap-1"><UserPlus size={12}/> Sign Up</Link>
                <Link to="/login" className="hover:text-orange-400 cursor-pointer flex items-center gap-1"><LogIn size={12}/> Sign In</Link>
              </>
            )}
            
            <button 
              onClick={() => setShowSettingsModal(true)}
              className="hover:text-orange-400 cursor-pointer flex items-center gap-1.5 border border-transparent hover:border-slate-700 px-2 py-0.5 rounded transition-colors group"
            >
              <span className="text-lg leading-none">{currentLang?.flag}</span>
              <span className="font-medium">{currentLang?.label.split(' ')[0]}</span>
              <span className="text-slate-600">|</span>
              <span className="font-bold">{currentCurr?.symbol} {currency}</span>
              <ChevronDown size={10} className="text-slate-400 group-hover:text-orange-400 transition-colors" />
            </button>
          </div>
        </div>

        {/* Main Nav */}
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
              
              {/* Left Section */}
              <div className="flex flex-shrink-0 items-center">
                  <Link to="/" className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center text-white font-bold text-lg shadow-sm">T</div>
                      <span className="text-2xl font-bold text-slate-800 tracking-tight hidden lg:inline-block">TradeGenius<span className="text-orange-500">.ai</span></span>
                  </Link>
              </div>

              {/* Center Section (Search) */}
              <div className="flex-1 min-w-0 hidden md:flex justify-center">
                  <div className="w-full max-w-xl" ref={searchRef}>
                      <div className="relative">
                          <div className="flex w-full border-2 border-orange-500 rounded-full overflow-hidden shadow-sm hover:shadow transition-shadow bg-white">
                              <select className="bg-gray-50 border-r border-gray-200 px-3 py-2 text-sm text-gray-600 focus:outline-none cursor-pointer hover:bg-gray-100">
                                  <option>Products</option>
                                  <option>Suppliers</option>
                                  <option>Buyers</option>
                                  {modules.invest && <option>Businesses</option>}
                              </select>
                              <input 
                                  type="text" 
                                  placeholder={t('search_placeholder')}
                                  className="flex-1 px-4 py-2 focus:outline-none text-gray-700"
                                  value={query}
                                  onChange={(e) => setQuery(e.target.value)}
                                  onFocus={() => setIsFocused(true)}
                                  onKeyDown={handleKeyDown}
                              />
                              <button 
                                  onClick={() => handleSearch(query)}
                                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 font-medium flex items-center gap-2 transition-colors"
                              >
                                  <Search size={18} /> {t('btn_search')}
                              </button>
                          </div>
                          
                          {isFocused && (
                            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl mt-2 z-50 overflow-hidden animate-fade-in-up">
                              {query === '' ? (
                                <div className="py-2">
                                  {recentSearches.length > 0 && (
                                    <div className="mb-2">
                                      <div className="flex justify-between items-center px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                        <span className="flex items-center gap-1"><History size={12}/> Recent Searches</span>
                                        <button onClick={clearHistory} className="hover:text-red-500 text-[10px] bg-gray-100 px-2 py-0.5 rounded">Clear History</button>
                                      </div>
                                      {recentSearches.map((term, idx) => (
                                        <div key={`history-${term}`} className={`flex items-center justify-between px-4 py-2 cursor-pointer group transition-colors ${idx === activeIndex ? 'bg-orange-50 text-orange-700' : 'hover:bg-gray-50 text-gray-600'}`} onClick={() => handleSearch(term)} onMouseEnter={() => setActiveIndex(idx)}>
                                          <div className="flex items-center gap-3"><Clock size={16} className={idx === activeIndex ? 'text-orange-400' : 'text-gray-400'}/><span>{term}</span></div>
                                          <button onClick={(e) => removeHistoryItem(e, term)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1" title="Remove from history"><X size={14}/></button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  <div>
                                    <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1"><TrendingUp size={12}/> Trending Now</div>
                                    {MOCK_SUGGESTIONS.slice(0, 5).map((term, idx) => {
                                      const globalIdx = recentSearches.length + idx;
                                      return (
                                        <div key={`trending-${term}`} className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors ${globalIdx === activeIndex ? 'bg-orange-50 text-orange-700' : 'hover:bg-gray-50 text-gray-700'}`} onClick={() => handleSearch(term)} onMouseEnter={() => setActiveIndex(globalIdx)}>
                                          <TrendingUp size={16} className={globalIdx === activeIndex ? 'text-orange-400' : 'text-gray-400'}/><span>{term}</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ) : (
                                <div className="py-2">
                                  {filteredSuggestions.length > 0 ? (
                                    filteredSuggestions.map((term, idx) => (
                                      <div key={`suggest-${term}`} className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors ${idx === activeIndex ? 'bg-orange-50 text-orange-700' : 'hover:bg-gray-50 text-gray-700'}`} onClick={() => handleSearch(term)} onMouseEnter={() => setActiveIndex(idx)}>
                                        <Search size={16} className={idx === activeIndex ? 'text-orange-400' : 'text-gray-400'}/>
                                        {/* OWASP A03: Safe Text Rendering */}
                                        <span>
                                          {term.split(new RegExp(`(${query})`, 'gi')).map((part, i) => (
                                            part.toLowerCase() === query.toLowerCase() ? <span key={i} className="font-bold text-slate-900">{part}</span> : part
                                          ))}
                                        </span>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="px-4 py-4 text-sm text-gray-500 text-center italic">No auto-suggestions found for "{query}"</div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                      </div>
                  </div>
              </div>

              {/* Right Section */}
              <div className="flex flex-shrink-0 items-center justify-end gap-2 sm:gap-4">
                  <button className="p-2 text-slate-600 hover:text-orange-500 md:hidden">
                    <Search size={22}/>
                  </button>

                  {modules.events && (
                    <Link to="/events" className="hidden lg:flex flex-col items-center hover:text-orange-500 group transition-colors">
                      <span className="text-xs font-semibold bg-gray-100 px-2 py-0.5 rounded-full group-hover:bg-orange-100 mb-0.5 transition-colors">New</span>
                      <span className="text-sm font-medium flex items-center gap-1"><Calendar size={14}/> {t('nav_events')}</span>
                    </Link>
                  )}
                  <Link to="/rfq" className="hidden lg:flex flex-col items-center hover:text-orange-500 group transition-colors">
                    <span className="text-xs font-semibold bg-gray-100 px-2 py-0.5 rounded-full group-hover:bg-orange-100 mb-0.5 transition-colors">AI Powered</span>
                    <span className="text-sm font-medium">{t('nav_rfq')}</span>
                  </Link>
                  
                  <div className="h-8 w-px bg-slate-200 hidden lg:block"></div>
                  
                  <Link to="/profile" className="hidden lg:flex flex-col items-center hover:text-orange-500 cursor-pointer transition-colors group">
                    <MessageSquare size={20} className="group-hover:scale-110 transition-transform"/>
                    <span className="text-xs mt-1 font-bold">{t('nav_messages')}</span>
                  </Link>

                  <button onClick={openCart} className="flex flex-col items-center hover:text-orange-500 cursor-pointer transition-colors group relative">
                    {cartCount > 0 && (
                      <div className="absolute -top-1 -right-2 bg-orange-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                        {cartCount}
                      </div>
                    )}
                    <ShoppingCart size={20} className="group-hover:scale-110 transition-transform"/>
                    <span className="text-xs mt-1 font-bold">Cart</span>
                  </button>

                  <div className="relative group z-50">
                    <Link to={currentUser ? "/profile" : "/login"} className="flex flex-col items-center hover:text-orange-500 transition-colors cursor-pointer">
                      <User size={20} className={`group-hover:scale-110 transition-transform ${currentUser ? 'text-blue-500' : ''}`}/>
                      <span className="text-xs mt-1 font-bold whitespace-nowrap">{currentUser ? 'Account' : 'Sign In'}</span>
                    </Link>
                    <div className="absolute right-0 top-full pt-2 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-5 relative mt-2">
                        <div className="absolute -top-2 right-6 w-4 h-4 bg-white transform rotate-45 border-t border-l border-gray-100"></div>
                        {!currentUser ? (
                          <div className="text-center space-y-4">
                            <div><p className="text-sm text-gray-500 mb-1">Welcome to TradeGenius</p><p className="text-xs text-gray-400">Join 150M+ traders worldwide</p></div>
                            <div className="flex flex-col gap-2"><Link to="/login" className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-lg transition-colors shadow-md">Sign In</Link><Link to="/join" className="block w-full bg-orange-50 text-orange-600 font-bold py-2.5 rounded-lg hover:bg-orange-100 transition-colors">Join Free</Link></div>
                            <div className="border-t border-gray-100 pt-4 mt-2 text-left">
                              <p className="text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Quick Actions</p>
                              <Link to="/login" className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-500 py-1.5 transition-colors"><Package size={14}/> My Orders</Link>
                              <Link to="/login" className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-500 py-1.5 transition-colors"><MessageSquare size={14}/> Message Center</Link>
                              <Link to="/rfq" className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-500 py-1.5 transition-colors"><PenTool size={14}/> Submit RFQ</Link>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-2">
                              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">{currentUser.name ? currentUser.name.charAt(0) : 'U'}</div>
                              <div className="overflow-hidden"><p className="text-sm font-bold text-slate-800 truncate">{currentUser.name || 'User'}</p><p className="text-xs text-slate-500 truncate">{currentUser.company || currentUser.email}</p><span className="inline-block mt-1 text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">{currentUser.role === 'seller' ? 'Supplier Account' : 'Buyer Account'}</span></div>
                            </div>
                            <div className="space-y-1">
                              <Link to="/dashboard" className="flex items-center gap-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-600 py-2 px-2 rounded-lg transition-colors"><LayoutDashboard size={16}/> Dashboard</Link>
                              <Link to="/profile" className="flex items-center gap-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-600 py-2 px-2 rounded-lg transition-colors"><User size={16}/> My Profile</Link>
                              <Link to="/dashboard" className="flex items-center gap-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-600 py-2 px-2 rounded-lg transition-colors"><Package size={16}/> Orders & RFQs</Link>
                              <Link to="/profile" className="flex items-center gap-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-600 py-2 px-2 rounded-lg transition-colors"><CreditCard size={16}/> Payments</Link>
                            </div>
                            <div className="border-t border-gray-100 pt-2 mt-2">
                              <button onClick={handleLogout} className="flex items-center gap-3 text-sm text-red-500 hover:bg-red-50 py-2 px-2 rounded-lg w-full text-left transition-colors font-medium"><LogOut size={16}/> Sign Out</button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <button className="md:hidden text-gray-700">
                    <Menu size={24} />
                  </button>
              </div>

          </div>
        </div>
      </nav>

      {/* Render the Modal */}
      <LanguageSettingsModal 
        isOpen={showSettingsModal} 
        onClose={() => setShowSettingsModal(false)}
        availableLanguages={availableLanguages}
        availableCurrencies={availableCurrencies}
        currentLanguage={language}
        setLanguage={setLanguage}
        currentCurrency={currency}
        setCurrency={setCurrency}
      />
    </>
  );
};

export default Navbar;
