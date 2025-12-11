
import React, { useState } from 'react';
import { Truck, Ship, Plane, Box, Search, MapPin, Calendar, ArrowRight, ShieldCheck, Globe, CheckCircle, Clock, AlertTriangle, Leaf, DollarSign, Activity } from 'lucide-react';
import { analyzeLogistics } from '../services/gemini';
import { TrackingEvent, LogisticsOption } from '../types';

const MOCK_TRACKING: TrackingEvent[] = [
    { date: '2023-11-01 09:00', location: 'Shenzhen Warehouse', status: 'Picked Up', description: 'Cargo picked up from supplier factory.', icon: 'box' },
    { date: '2023-11-02 14:30', location: 'Shenzhen Port', status: 'In Transit', description: 'Arrived at export terminal.', icon: 'truck' },
    { date: '2023-11-03 10:00', location: 'Shenzhen Customs', status: 'Cleared', description: 'Export customs clearance completed.', icon: 'check' },
    { date: '2023-11-05 18:00', location: 'South China Sea', status: 'On Vessel', description: 'Departed on vessel "Ever Given".', icon: 'ship' },
];

const LogisticsPage: React.FC = () => {
    const [quoteForm, setQuoteForm] = useState({ origin: '', destination: '', weight: '', type: 'Ocean' });
    const [optimizationResults, setOptimizationResults] = useState<LogisticsOption[] | null>(null);
    const [loading, setLoading] = useState(false);
    
    // Tracking State
    const [trackingId, setTrackingId] = useState('');
    const [trackingResult, setTrackingResult] = useState<TrackingEvent[] | null>(null);

    const handleOptimizeRoute = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!quoteForm.origin || !quoteForm.destination) {
            alert("Please enter origin and destination.");
            return;
        }
        setLoading(true);
        const results = await analyzeLogistics(quoteForm.origin, quoteForm.destination);
        setOptimizationResults(results);
        setLoading(false);
    };

    const handleTrack = () => {
        if (!trackingId) return;
        // Simulate API call
        setTrackingResult(MOCK_TRACKING);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero */}
            <div className="bg-blue-900 text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-20"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-2xl">
                        <span className="bg-blue-800 text-blue-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">TradeGenius Logistics</span>
                        <h1 className="text-5xl font-extrabold mb-6 leading-tight">Smart Shipping for <br/>Global Trade.</h1>
                        <p className="text-blue-100 text-lg mb-8">End-to-end logistics solutions with AI route optimization, real-time tracking, and customs clearance.</p>
                        
                        <div className="bg-white p-2 rounded-lg shadow-2xl flex flex-col md:flex-row gap-2 max-w-xl">
                            <input 
                                type="text" 
                                placeholder="Tracking Number (e.g. TG-88293)" 
                                className="flex-1 p-3 text-slate-800 outline-none rounded"
                                value={trackingId}
                                onChange={(e) => setTrackingId(e.target.value)}
                            />
                            <button 
                                onClick={handleTrack}
                                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded font-bold transition-colors"
                            >
                                Track
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tracking Result Section */}
            {trackingResult && (
                <div className="container mx-auto px-4 -mt-10 relative z-20 mb-12">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 animate-fade-in">
                        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                             <div>
                                <h2 className="text-2xl font-bold text-slate-800">Shipment #{trackingId}</h2>
                                <p className="text-slate-500">Current Status: <span className="font-bold text-blue-600">En Route</span></p>
                             </div>
                             <button onClick={() => setTrackingResult(null)} className="text-slate-400 hover:text-slate-600">Close</button>
                        </div>
                        <div className="relative">
                            {/* Vertical Line */}
                            <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gray-200"></div>
                            
                            <div className="space-y-8">
                                {trackingResult.map((event, index) => (
                                    <div key={index} className="flex gap-6 relative">
                                        <div className={`w-12 h-12 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 ${index === trackingResult.length - 1 ? 'bg-blue-600 text-white' : 'bg-green-100 text-green-600'}`}>
                                            {event.icon === 'ship' ? <Ship size={20}/> : event.icon === 'truck' ? <Truck size={20}/> : event.icon === 'box' ? <Box size={20}/> : <CheckCircle size={20}/>}
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 font-bold mb-1">{event.date}</div>
                                            <h4 className="font-bold text-slate-800 text-lg">{event.status}</h4>
                                            <p className="text-slate-600">{event.description}</p>
                                            <div className="text-xs text-slate-400 flex items-center gap-1 mt-1"><MapPin size={12}/> {event.location}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* AI Route Optimizer Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Form Side */}
                    <div className="lg:col-span-5">
                        <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Globe className="text-blue-600"/> AI Route Optimizer
                        </h2>
                        <p className="text-slate-500 mb-8">
                            Compare shipping modes based on cost, speed, risk, and carbon footprint. Powered by Gemini AI.
                        </p>
                        <form onSubmit={handleOptimizeRoute} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Origin</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 text-gray-400" size={18}/>
                                        <input 
                                            type="text" 
                                            className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors" 
                                            placeholder="City or Port (e.g. Shanghai)"
                                            value={quoteForm.origin}
                                            onChange={e => setQuoteForm({...quoteForm, origin: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Destination</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 text-gray-400" size={18}/>
                                        <input 
                                            type="text" 
                                            className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors" 
                                            placeholder="City or Port (e.g. Los Angeles)"
                                            value={quoteForm.destination}
                                            onChange={e => setQuoteForm({...quoteForm, destination: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Weight (kg)</label>
                                        <input 
                                            type="number" 
                                            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors" 
                                            placeholder="Total Weight"
                                            value={quoteForm.weight}
                                            onChange={e => setQuoteForm({...quoteForm, weight: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Priority</label>
                                        <select className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white transition-colors">
                                            <option>Lowest Cost</option>
                                            <option>Fastest Route</option>
                                            <option>Greenest Route</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-bold text-lg transition-colors shadow-lg shadow-blue-200">
                                {loading ? 'Analyzing Routes...' : 'Find Best Options'}
                            </button>
                        </form>
                    </div>

                    {/* Results Side */}
                    <div className="lg:col-span-7">
                        {optimizationResults ? (
                            <div className="space-y-6 animate-fade-in">
                                <h3 className="text-xl font-bold text-slate-800 mb-4">Recommended Shipping Options</h3>
                                
                                {optimizationResults.length === 0 && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-yellow-800">
                                        No specific routes found. Please check your inputs or try major cities.
                                    </div>
                                )}

                                {optimizationResults.map((opt, idx) => (
                                    <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all relative overflow-hidden group">
                                        {/* Dynamic "Best For" Badge logic could go here */}
                                        {idx === 0 && (
                                            <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                                                Best Value
                                            </div>
                                        )}

                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${opt.mode.includes('Air') ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                                    {opt.mode.includes('Air') ? <Plane size={24}/> : <Ship size={24}/>}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-lg text-slate-800">{opt.mode}</h4>
                                                    <div className="text-sm text-slate-500 flex items-center gap-2">
                                                        <Clock size={14}/> {opt.transitTime} Transit
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-slate-900">{opt.costEstimate}</div>
                                                <div className="text-xs text-gray-500 font-medium">Estimated Total</div>
                                            </div>
                                        </div>

                                        <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 md:grid-cols-3 gap-4">
                                            <div className="flex items-center gap-2">
                                                <AlertTriangle size={16} className={`${opt.riskFactor === 'High' ? 'text-red-500' : opt.riskFactor === 'Medium' ? 'text-yellow-500' : 'text-green-500'}`}/>
                                                <div>
                                                    <div className="text-xs text-gray-400 uppercase font-bold">Risk Factor</div>
                                                    <div className="text-sm font-medium text-slate-700">{opt.riskFactor}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Leaf size={16} className={`${opt.carbonFootprint === 'High' ? 'text-red-500' : 'text-green-500'}`}/>
                                                <div>
                                                    <div className="text-xs text-gray-400 uppercase font-bold">Carbon Footprint</div>
                                                    <div className="text-sm font-medium text-slate-700">{opt.carbonFootprint}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-end md:col-span-1 col-span-2">
                                                <button className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1">
                                                    Select & Book <ArrowRight size={16}/>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-slate-100 border border-dashed border-slate-300 rounded-2xl h-full flex flex-col justify-center items-center text-center p-12">
                                <Activity size={48} className="text-slate-300 mb-4"/>
                                <h3 className="text-xl font-bold text-slate-700">Waiting for Input</h3>
                                <p className="text-slate-500 max-w-sm mx-auto mt-2">Enter your shipment details on the left to see AI-optimized logistics routes.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Services Grid */}
            <div className="bg-white py-16 border-t border-gray-100">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">Our Services</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6 border border-gray-100 rounded-xl hover:shadow-lg transition-all group">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Ship size={32}/>
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-3">Ocean Freight</h3>
                            <p className="text-slate-500">Cost-effective FCL and LCL shipping for large volume orders. Port-to-port and Door-to-door.</p>
                        </div>
                        <div className="p-6 border border-gray-100 rounded-xl hover:shadow-lg transition-all group">
                            <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Plane size={32}/>
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-3">Air Freight</h3>
                            <p className="text-slate-500">Expedited shipping for time-sensitive cargo. Global coverage with top airlines.</p>
                        </div>
                        <div className="p-6 border border-gray-100 rounded-xl hover:shadow-lg transition-all group">
                            <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <ShieldCheck size={32}/>
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-3">Customs & Compliance</h3>
                            <p className="text-slate-500">Hassle-free customs clearance and duty management handled by experts.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogisticsPage;
