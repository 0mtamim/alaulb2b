
import React, { useState } from 'react';
import { Calendar, MapPin, Clock, ArrowRight, Star, Building, Users, CheckCircle, Ticket, X } from 'lucide-react';

const EVENTS_DATA = [
    { id: 'ev1', title: 'Global Tech Expo 2024', type: 'In-Person', date: 'Dec 15-18, 2024', location: 'Las Vegas, NV', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', description: 'The largest consumer electronics sourcing show.', isPromoted: true, status: 'Upcoming' },
    { id: 'ev2', title: 'Sustainable Textiles Summit', type: 'Online', date: 'Nov 20, 2024', location: 'Virtual', image: 'https://images.unsplash.com/photo-1558008258-3256797b43f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1631&q=80', description: 'Connect with eco-friendly fabric suppliers.', isPromoted: false, status: 'Upcoming' },
    { id: 'ev3', title: 'Shenzhen Manufacturing Gala', type: 'In-Person', date: 'Jan 10, 2025', location: 'Shenzhen, CN', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', description: 'Factory tours and networking dinner.', isPromoted: true, status: 'Upcoming' },
];

const EventsPage: React.FC = () => {
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [requestForm, setRequestForm] = useState({
        company: '',
        eventType: 'Product Launch',
        budget: '',
        date: '',
        description: ''
    });

    const handleSubmitRequest = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Event Request Submitted! Our events team will contact you with a proposal.");
        setShowRequestModal(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            {/* Hero Section */}
            <div className="bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&auto=format&fit=crop&w=1412&q=80')] bg-cover bg-center opacity-20"></div>
                <div className="container mx-auto px-4 py-24 relative z-10 text-center">
                    <span className="inline-block bg-orange-500/20 border border-orange-500/50 text-orange-300 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6 animate-fade-in">
                        Global B2B Events
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                        Connect, Showcase, and <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Launch Your Next Big Thing</span>
                    </h1>
                    <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-10">
                        Discover world-class trade shows, online sourcing summits, and corporate galas. 
                        Manufacturers: Request custom event management services to launch your products globally.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={() => setShowRequestModal(true)} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-bold transition-all shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2">
                            <Star size={20} fill="currentColor"/> Request Event Management
                        </button>
                        <button className="bg-white/10 hover:bg-white/20 backdrop-blur text-white px-8 py-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2">
                            Browse Calendar <ArrowRight size={20}/>
                        </button>
                    </div>
                </div>
            </div>

            {/* Promoted Banners List */}
            <div className="container mx-auto px-4 -mt-16 relative z-20 mb-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {EVENTS_DATA.filter(e => e.isPromoted).map(event => (
                        <div key={event.id} className="bg-white rounded-xl shadow-xl overflow-hidden group hover:-translate-y-2 transition-transform duration-300 border-t-4 border-orange-500">
                            <div className="h-40 overflow-hidden relative">
                                <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                                <div className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded shadow-md flex items-center gap-1">
                                    <Star size={10} fill="currentColor"/> Featured Event
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide flex justify-between">
                                    <span>{event.type}</span>
                                    <span className="text-green-600">Promoted</span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight group-hover:text-orange-600 transition-colors">{event.title}</h3>
                                <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                                    <div className="flex items-center gap-1"><Calendar size={14}/> {event.date.split(',')[0]}</div>
                                    <div className="flex items-center gap-1"><MapPin size={14}/> {event.location}</div>
                                </div>
                                <button className="w-full border border-slate-200 text-slate-700 font-bold py-2 rounded hover:bg-slate-50 transition-colors">
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Events Grid */}
            <div className="container mx-auto px-4 py-12">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Upcoming Trade Shows & Summits</h2>
                        <p className="text-slate-500">Explore opportunities to source products and meet suppliers face-to-face.</p>
                    </div>
                    <div className="flex gap-2">
                         <button className="px-4 py-2 bg-slate-900 text-white rounded-lg font-bold text-sm">All Events</button>
                         <button className="px-4 py-2 bg-white border border-gray-200 text-slate-600 rounded-lg font-bold text-sm hover:bg-gray-50">Online Only</button>
                    </div>
                </div>

                <div className="space-y-4">
                    {EVENTS_DATA.map(event => (
                        <div key={event.id} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row items-center gap-6 hover:shadow-md transition-shadow">
                            <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                                <img src={event.image} alt={event.title} className="w-full h-full object-cover"/>
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                                    <h3 className="text-xl font-bold text-slate-800">{event.title}</h3>
                                    {event.status === 'Upcoming' && <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold w-fit mx-auto md:mx-0">Registration Open</span>}
                                </div>
                                <p className="text-slate-500 mb-4">{event.description}</p>
                                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-600">
                                    <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-100"><Calendar size={14}/> {event.date}</span>
                                    <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-100"><MapPin size={14}/> {event.location}</span>
                                    <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-100"><Ticket size={14}/> Free Entry</span>
                                </div>
                            </div>
                            <div className="flex-shrink-0">
                                <button className="bg-slate-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors">
                                    Register Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-white py-16 border-t border-gray-100 mt-12">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-slate-800 mb-12">Why Launch Your Event with TradeGenius?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Users size={32}/>
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-3">Targeted B2B Audience</h3>
                            <p className="text-slate-500">We invite relevant buyers and distributors from our verified database of 5M+ companies.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Building size={32}/>
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-3">Turnkey Management</h3>
                            <p className="text-slate-500">From venue selection to booth construction and catering, our "Pro" deals cover everything.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle size={32}/>
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-3">Guaranteed Leads</h3>
                            <p className="text-slate-500">Our AI matching ensures you meet buyers actively looking for your product category.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Request Modal */}
            {showRequestModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
                        <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
                             <h3 className="text-xl font-bold flex items-center gap-2"><Star className="text-orange-500"/> Request Event Management</h3>
                             <button onClick={() => setShowRequestModal(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors"><X size={20}/></button>
                        </div>
                        <form onSubmit={handleSubmitRequest} className="p-8 space-y-4">
                             <div>
                                 <label className="block text-sm font-bold text-slate-700 mb-1">Company Name</label>
                                 <input 
                                    type="text" 
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-orange-500"
                                    placeholder="e.g. Acme Manufacturing"
                                    required
                                    value={requestForm.company}
                                    onChange={e => setRequestForm({...requestForm, company: e.target.value})}
                                 />
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                                 <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Event Type</label>
                                    <select 
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-orange-500"
                                        value={requestForm.eventType}
                                        onChange={e => setRequestForm({...requestForm, eventType: e.target.value})}
                                    >
                                        <option>Product Launch</option>
                                        <option>Trade Show Booth</option>
                                        <option>Networking Gala</option>
                                        <option>Webinar</option>
                                    </select>
                                 </div>
                                 <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Budget Range</label>
                                    <select 
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-orange-500"
                                        value={requestForm.budget}
                                        onChange={e => setRequestForm({...requestForm, budget: e.target.value})}
                                    >
                                        <option value="">Select...</option>
                                        <option>$5k - $10k</option>
                                        <option>$10k - $50k</option>
                                        <option>$50k+</option>
                                    </select>
                                 </div>
                             </div>
                             <div>
                                 <label className="block text-sm font-bold text-slate-700 mb-1">Preferred Date</label>
                                 <input 
                                    type="date" 
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-orange-500"
                                    value={requestForm.date}
                                    onChange={e => setRequestForm({...requestForm, date: e.target.value})}
                                 />
                             </div>
                             <div>
                                 <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                                 <textarea 
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-orange-500 h-24"
                                    placeholder="Describe your goals and requirements..."
                                    value={requestForm.description}
                                    onChange={e => setRequestForm({...requestForm, description: e.target.value})}
                                 ></textarea>
                             </div>
                             <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-lg font-bold text-lg transition-colors shadow-lg">
                                 Submit Request
                             </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventsPage;
