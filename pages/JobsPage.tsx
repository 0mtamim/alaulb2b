
import React, { useState } from 'react';
import { Briefcase, MapPin, Search, Upload, Star, CheckCircle, Zap, DollarSign, Filter, Clock, LayoutGrid, List, Building2, Users, ArrowRight, BadgeCheck, Bookmark } from 'lucide-react';
import { analyzeResume } from '../services/gemini';
import { Job, HiringCompany } from '../types';

const MOCK_JOBS: Job[] = [
    { id: 'j1', title: 'Procurement Specialist', company: 'Global Imports LLC', companyLogo: 'G', location: 'New York, USA', type: 'Full-time', salaryRange: '$80k - $110k', postedDate: '2d ago', description: 'Seeking experienced buyer for electronics category...', applicantsCount: 12, isPromoted: true },
    { id: 'j2', title: 'Supply Chain Manager', company: 'Shenzhen Tech', companyLogo: 'S', location: 'Remote', type: 'Contract', salaryRange: '$60k - $90k', postedDate: '5h ago', description: 'Manage logistics coordination...', applicantsCount: 45, isPromoted: false },
    { id: 'j3', title: 'Logistics Coordinator', company: 'FastTrack Logistics', companyLogo: 'F', location: 'Los Angeles, USA', type: 'Full-time', salaryRange: '$55k - $75k', postedDate: '1d ago', description: 'Coordinate daily shipments and customs clearance...', applicantsCount: 28, isPromoted: false },
    { id: 'j4', title: 'Sourcing Agent', company: 'Asia Direct', companyLogo: 'A', location: 'Remote', type: 'Contract', salaryRange: '$40k - $60k', postedDate: '3d ago', description: 'Find suppliers in Southeast Asia...', applicantsCount: 8, isPromoted: true },
    { id: 'j5', title: 'Quality Control Inspector', company: 'VerifyPro', companyLogo: 'V', location: 'Shenzhen, CN', type: 'Full-time', salaryRange: '$40k - $55k', postedDate: '4h ago', description: 'On-site factory inspections for textile products.', applicantsCount: 15, isPromoted: false },
    { id: 'j6', title: 'Import/Export Manager', company: 'TradeFlow', companyLogo: 'T', location: 'London, UK', type: 'Full-time', salaryRange: '$70k - $95k', postedDate: '1w ago', description: 'Oversee EU compliance and shipping documentation.', applicantsCount: 32, isPromoted: true },
];

const MOCK_COMPANIES: HiringCompany[] = [
    { id: 'c1', name: 'Global Imports LLC', logo: 'G', industry: 'Retail & Distribution', location: 'USA', activeJobs: 4, rating: 4.8, verified: true, description: 'Leading distributor of consumer electronics across North America.' },
    { id: 'c2', name: 'Shenzhen Tech', logo: 'S', industry: 'Manufacturing', location: 'China', activeJobs: 12, rating: 4.5, verified: true, description: 'High-tech manufacturing facility specializing in IoT devices.' },
    { id: 'c3', name: 'FastTrack Logistics', logo: 'F', industry: 'Logistics', location: 'USA', activeJobs: 8, rating: 4.2, verified: true, description: 'End-to-end shipping solutions for e-commerce brands.' },
    { id: 'c4', name: 'Asia Direct', logo: 'A', industry: 'Sourcing', location: 'Singapore', activeJobs: 2, rating: 4.9, verified: false, description: 'Connecting Western buyers with Eastern factories.' },
    { id: 'c5', name: 'EcoPack Solutions', logo: 'E', industry: 'Packaging', location: 'Germany', activeJobs: 5, rating: 4.6, verified: true, description: 'Sustainable packaging solutions for global brands.' },
    { id: 'c6', name: 'BuildRight Construction', logo: 'B', industry: 'Construction', location: 'UAE', activeJobs: 7, rating: 4.3, verified: true, description: 'Large scale infrastructure projects in the Middle East.' },
];

const JobsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'jobs' | 'companies'>('jobs');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    
    const [search, setSearch] = useState('');
    const [locationSearch, setLocationSearch] = useState('');
    const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
    const [minSalary, setMinSalary] = useState<string>('');
    const [maxSalary, setMaxSalary] = useState<string>('');
    const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
    
    const [showResumeModal, setShowResumeModal] = useState(false);
    const [resumeAnalysis, setResumeAnalysis] = useState<any>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Helper to extract salary range values
    const getSalaryRangeValue = (rangeStr: string): { min: number, max: number } => {
        const matches = Array.from(rangeStr.matchAll(/\$(\d+)k/g)).map(m => parseInt(m[1]));
        if (matches.length === 0) return { min: 0, max: 0 };
        if (matches.length === 1) return { min: matches[0], max: matches[0] };
        return { min: Math.min(...matches), max: Math.max(...matches) };
    };

    const handleJobTypeChange = (type: string) => {
        setSelectedJobTypes(prev => 
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    const handleIndustryChange = (ind: string) => {
        setSelectedIndustries(prev => 
            prev.includes(ind) ? prev.filter(i => i !== ind) : [...prev, ind]
        );
    };

    // New Helper to navigate to jobs tab for a specific company
    const handleViewCompanyJobs = (companyName: string) => {
        setSearch(companyName);
        setActiveTab('jobs');
        // Reset location filter to ensure results are visible
        setLocationSearch('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const filteredJobs = MOCK_JOBS.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) || 
                              job.company.toLowerCase().includes(search.toLowerCase());
        const matchesLocation = locationSearch === '' || job.location.toLowerCase().includes(locationSearch.toLowerCase());
        
        // Logic for Job Type filter
        const matchesType = selectedJobTypes.length === 0 || selectedJobTypes.some(type => {
            if (type === 'Remote') {
                return job.location.toLowerCase().includes('remote') || job.type === 'Remote';
            }
            return job.type === type;
        });

        // Logic for Salary filter
        const jobSalary = getSalaryRangeValue(job.salaryRange);
        const filterMinSalary = minSalary ? parseInt(minSalary) : 0;
        const filterMaxSalary = maxSalary ? parseInt(maxSalary) : Infinity;
        
        // We check if the job's salary range overlaps or meets the criteria
        // Simple logic: Job max salary should be at least the user's min salary requirement
        // And Job min salary should be within the max budget if specified (optional logic, but here let's do range inclusion)
        
        // Let's go with: Job must pay at least Min Salary (if specified) AND Job must not exceed Max Salary requirement (if specified - though usually candidates want higher, let's assume this filters for "jobs within this budget")
        // Actually, typically candidates filter: "I want at least $X". 
        // Employers filter: "I can pay up to $Y".
        // As a candidate (user), I usually set a Min Salary.
        // If I set a range "$50k - $80k", I might be looking for jobs that fall roughly in that band.
        
        // Implementation: 
        // 1. Job Max >= Filter Min (Job pays enough)
        // 2. Job Min <= Filter Max (Job isn't too high level? Or maybe just ignore max for candidates)
        // Let's implement generic range overlap for flexibility.
        
        const salaryMatches = (jobSalary.max >= filterMinSalary) && (filterMaxSalary === Infinity || jobSalary.min <= filterMaxSalary);

        return matchesSearch && matchesLocation && matchesType && salaryMatches;
    });

    const filteredCompanies = MOCK_COMPANIES.filter(company => {
        const matchesSearch = company.name.toLowerCase().includes(search.toLowerCase());
        const matchesLocation = locationSearch === '' || company.location.toLowerCase().includes(locationSearch.toLowerCase());
        const matchesIndustry = selectedIndustries.length === 0 || selectedIndustries.includes(company.industry);
        return matchesSearch && matchesLocation && matchesIndustry;
    });

    const uniqueIndustries = Array.from(new Set(MOCK_COMPANIES.map(c => c.industry))).sort();

    const handleAnalyzeResume = async () => {
        setIsAnalyzing(true);
        const res = await analyzeResume(MOCK_JOBS[0].description);
        setResumeAnalysis(res);
        setIsAnalyzing(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
             {/* Header */}
             <div className="bg-white border-b border-gray-200 py-8">
                 <div className="container mx-auto px-4">
                     <div className="flex justify-between items-center mb-6">
                         <h1 className="text-3xl font-bold text-slate-800">TradeGenius Careers</h1>
                         <div className="hidden md:flex gap-4 text-sm font-medium text-gray-500">
                            <span className="flex items-center gap-1"><Briefcase size={16} className="text-blue-600"/> {MOCK_JOBS.length} Active Jobs</span>
                            <span className="flex items-center gap-1"><Building2 size={16} className="text-orange-600"/> {MOCK_COMPANIES.length} Companies</span>
                            <span className="flex items-center gap-1"><Clock size={16} className="text-green-600"/> 85 New Today</span>
                         </div>
                     </div>
                     
                     <div className="bg-slate-100 p-2 rounded-lg flex flex-col md:flex-row gap-2 max-w-4xl shadow-inner">
                         <div className="flex-1 flex items-center px-4 bg-white rounded border border-gray-200">
                             <Search className="text-gray-400" size={20}/>
                             <input 
                                type="text" 
                                placeholder={activeTab === 'jobs' ? "Search title, skill, or company" : "Search company name"}
                                className="w-full p-3 outline-none text-sm"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                             />
                         </div>
                         <div className="flex-1 flex items-center px-4 bg-white rounded border border-gray-200">
                             <MapPin className="text-gray-400" size={20}/>
                             <input 
                                type="text" 
                                placeholder="City, state, or remote" 
                                className="w-full p-3 outline-none text-sm"
                                value={locationSearch}
                                onChange={e => setLocationSearch(e.target.value)}
                             />
                         </div>
                         <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded font-bold transition-colors">
                             Find {activeTab === 'jobs' ? 'Jobs' : 'Companies'}
                         </button>
                     </div>
                 </div>
             </div>

             <div className="container mx-auto px-4 py-8">
                 
                 {/* Main Navigation Tabs */}
                 <div className="flex items-center gap-6 border-b border-gray-200 mb-8">
                     <button 
                        onClick={() => { setActiveTab('jobs'); setSearch(''); setLocationSearch(''); }}
                        className={`pb-3 font-bold text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'jobs' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                     >
                        <Briefcase size={18}/> Find Jobs
                     </button>
                     <button 
                        onClick={() => { setActiveTab('companies'); setSearch(''); setLocationSearch(''); }}
                        className={`pb-3 font-bold text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'companies' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                     >
                        <Building2 size={18}/> Top Hiring Companies
                     </button>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                     {/* Sidebar Filters */}
                     <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-24">
                            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                                <Filter size={20} className="text-slate-400"/>
                                <h3 className="font-bold text-slate-800">Filters</h3>
                            </div>
                            
                            {activeTab === 'jobs' && (
                                <>
                                    <div className="mb-6">
                                        <h4 className="font-bold text-sm text-slate-700 mb-3">Job Type</h4>
                                        <div className="space-y-2 text-sm text-gray-600">
                                            {['Full-time', 'Contract', 'Remote', 'Internship'].map(type => (
                                                <label key={type} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                                                    <input 
                                                        type="checkbox" 
                                                        className="rounded text-blue-600 focus:ring-blue-500"
                                                        checked={selectedJobTypes.includes(type)}
                                                        onChange={() => handleJobTypeChange(type)}
                                                    /> 
                                                    {type}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <h4 className="font-bold text-sm text-slate-700 mb-3">Experience Level</h4>
                                        <div className="space-y-2 text-sm text-gray-600">
                                            {['Entry Level', 'Mid-Senior', 'Director', 'Executive'].map(lvl => (
                                                <label key={lvl} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                                                    <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500"/> 
                                                    {lvl}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <h4 className="font-bold text-sm text-slate-700 mb-3">Salary Range (Annual)</h4>
                                        <div className="flex gap-2 items-center">
                                            <div className="relative flex-1">
                                                <DollarSign size={12} className="absolute left-2.5 top-2.5 text-gray-400"/>
                                                <input 
                                                    type="number" 
                                                    placeholder="Min"
                                                    className="w-full pl-6 p-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-500"
                                                    value={minSalary}
                                                    onChange={(e) => setMinSalary(e.target.value)}
                                                />
                                            </div>
                                            <span className="text-gray-400">-</span>
                                            <div className="relative flex-1">
                                                <DollarSign size={12} className="absolute left-2.5 top-2.5 text-gray-400"/>
                                                <input 
                                                    type="number" 
                                                    placeholder="Max"
                                                    className="w-full pl-6 p-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-500"
                                                    value={maxSalary}
                                                    onChange={(e) => setMaxSalary(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-2 text-right">In thousands (e.g. 50 = $50k)</p>
                                    </div>
                                    
                                    <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100 text-center">
                                        <Zap size={32} className="text-blue-500 mx-auto mb-2"/>
                                        <h4 className="font-bold text-blue-900 mb-2">Boost Your Profile</h4>
                                        <p className="text-xs text-blue-700 mb-4">Get AI feedback on your resume to match top jobs.</p>
                                        <button onClick={() => setShowResumeModal(true)} className="w-full bg-blue-600 text-white text-xs font-bold py-2 rounded hover:bg-blue-700 transition-colors">Analyze Resume</button>
                                    </div>
                                </>
                            )}

                            {activeTab === 'companies' && (
                                <div className="mb-6">
                                    <h4 className="font-bold text-sm text-slate-700 mb-3">Industry</h4>
                                    <div className="space-y-2 text-sm text-gray-600 max-h-96 overflow-y-auto">
                                        {uniqueIndustries.map(industry => (
                                            <label key={industry} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                                                <input 
                                                    type="checkbox" 
                                                    className="rounded text-blue-600 focus:ring-blue-500"
                                                    checked={selectedIndustries.includes(industry)}
                                                    onChange={() => handleIndustryChange(industry)}
                                                /> 
                                                {industry}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                     </div>

                     {/* Main Content Area */}
                     <div className="lg:col-span-3">
                         
                         {/* Jobs View */}
                         {activeTab === 'jobs' && (
                             <div className="space-y-6">
                                 <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200">
                                     <h2 className="font-bold text-slate-700 text-sm">{filteredJobs.length} Jobs Found</h2>
                                     <div className="flex items-center gap-2">
                                         <span className="text-xs text-gray-500">View:</span>
                                         <div className="flex bg-gray-100 rounded p-1">
                                             <button 
                                                onClick={() => setViewMode('list')}
                                                className={`p-1.5 rounded transition-all ${viewMode === 'list' ? 'bg-white shadow text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                                             >
                                                 <List size={16}/>
                                             </button>
                                             <button 
                                                onClick={() => setViewMode('grid')}
                                                className={`p-1.5 rounded transition-all ${viewMode === 'grid' ? 'bg-white shadow text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                                             >
                                                 <LayoutGrid size={16}/>
                                             </button>
                                         </div>
                                     </div>
                                 </div>
                                 
                                 {filteredJobs.length > 0 ? (
                                    <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}>
                                        {filteredJobs.map(job => (
                                            <div key={job.id} className={`bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group relative overflow-hidden ${viewMode === 'list' ? 'p-6 flex flex-col sm:flex-row gap-6' : 'p-6 flex flex-col h-full'}`}>
                                                
                                                {/* Promoted Badge */}
                                                {job.isPromoted && (
                                                    <div className="absolute top-0 right-0">
                                                        <div className="bg-gradient-to-bl from-yellow-400 to-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-sm uppercase tracking-wide z-10">
                                                            Promoted
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Company Logo */}
                                                <div className={`flex-shrink-0 ${viewMode === 'grid' ? 'mb-4' : ''}`}>
                                                    <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-xl font-bold text-slate-600 shadow-sm">
                                                        {job.companyLogo}
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="mb-1 pr-16">
                                                        <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate" title={job.title}>{job.title}</h3>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                                                        <span className="font-medium text-slate-700">{job.company}</span>
                                                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                        <span>{job.location}</span>
                                                    </div>

                                                    <div className="flex flex-wrap gap-2 text-xs text-slate-600 mb-4">
                                                        <span className="bg-slate-100 px-2.5 py-1 rounded-md font-medium flex items-center gap-1">
                                                            <Briefcase size={12} className="text-slate-400"/> {job.type}
                                                        </span>
                                                        <span className="bg-green-50 text-green-700 border border-green-100 px-2.5 py-1 rounded-md font-bold flex items-center gap-1">
                                                            <DollarSign size={12}/> {job.salaryRange}
                                                        </span>
                                                        <span className="bg-slate-100 px-2.5 py-1 rounded-md font-medium flex items-center gap-1">
                                                            <Clock size={12} className="text-slate-400"/> {job.postedDate}
                                                        </span>
                                                    </div>

                                                    {viewMode === 'list' && (
                                                        <p className="text-sm text-slate-600 line-clamp-2 mb-1">{job.description}</p>
                                                    )}
                                                </div>

                                                {/* Actions */}
                                                <div className={`flex items-center gap-3 ${viewMode === 'list' ? 'sm:flex-col sm:justify-center sm:min-w-[140px]' : 'mt-auto pt-4 border-t border-gray-100'}`}>
                                                    <button className={`p-2.5 rounded-lg border border-slate-200 text-slate-400 hover:text-orange-500 hover:border-orange-200 hover:bg-orange-50 transition-colors flex items-center justify-center gap-2 ${viewMode === 'list' ? 'w-full' : ''}`} title="Save Job">
                                                        <Bookmark size={18} />
                                                        {viewMode === 'list' && <span className="text-xs font-bold sm:hidden">Save</span>}
                                                    </button>
                                                    <button className={`bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm flex-1 ${viewMode === 'list' ? 'w-full' : ''}`}>
                                                        Apply Now
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                 ) : (
                                    <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                                        <Search className="mx-auto h-12 w-12 text-gray-300 mb-4"/>
                                        <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
                                        <p className="text-gray-500">Try adjusting your search or filters.</p>
                                        <button 
                                            onClick={() => {setSearch(''); setLocationSearch(''); setSelectedJobTypes([]); setMinSalary(''); setMaxSalary('');}}
                                            className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            Clear all filters
                                        </button>
                                    </div>
                                 )}
                             </div>
                         )}

                         {/* Companies View */}
                         {activeTab === 'companies' && (
                             <div>
                                 {filteredCompanies.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {filteredCompanies.map(company => (
                                            <div key={company.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all group">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex gap-4 items-center">
                                                        <div className="w-16 h-16 bg-slate-50 border border-gray-100 rounded-xl flex items-center justify-center text-2xl font-bold text-slate-700">
                                                            {company.logo}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-1.5">
                                                                <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors">{company.name}</h3>
                                                                {company.verified && (
                                                                    <BadgeCheck size={18} className="text-blue-500" fill="currentColor" color="white"/>
                                                                )}
                                                            </div>
                                                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                                                <MapPin size={12}/> {company.location}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <button 
                                                        onClick={() => handleViewCompanyJobs(company.name)}
                                                        className="text-xs border border-blue-100 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 font-bold transition-colors"
                                                    >
                                                        View Jobs
                                                    </button>
                                                </div>
                                                
                                                <div className="flex items-center gap-4 text-xs font-medium text-slate-600 mb-4 pb-4 border-b border-gray-100">
                                                    <span className="flex items-center gap-1"><Building2 size={12} className="text-gray-400"/> {company.industry}</span>
                                                    <span className="flex items-center gap-1"><Star size={12} className="text-yellow-400 fill-yellow-400"/> {company.rating}</span>
                                                </div>
                                                
                                                <p className="text-sm text-gray-600 line-clamp-2 mb-4 h-10">{company.description}</p>
                                                
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-bold text-slate-700">{company.activeJobs} Open Roles</span>
                                                    <button 
                                                        onClick={() => handleViewCompanyJobs(company.name)}
                                                        className="text-slate-400 hover:text-blue-600 transition-colors"
                                                    >
                                                        <ArrowRight size={20}/>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                 ) : (
                                    <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                                        <Search className="mx-auto h-12 w-12 text-gray-300 mb-4"/>
                                        <h3 className="text-lg font-medium text-gray-900">No companies found</h3>
                                        <p className="text-gray-500">Try adjusting your search or filters.</p>
                                        <button 
                                            onClick={() => {setSearch(''); setLocationSearch(''); setSelectedIndustries([]);}}
                                            className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            Clear all filters
                                        </button>
                                    </div>
                                 )}
                             </div>
                         )}
                     </div>
                 </div>
             </div>

             {/* Resume AI Modal */}
             {showResumeModal && (
                 <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
                     <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6">
                         <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-slate-800">AI Resume Optimizer</h3>
                            <button onClick={() => setShowResumeModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                         </div>
                         {!resumeAnalysis ? (
                             <div className="text-center py-8">
                                 <Upload size={48} className="mx-auto text-gray-300 mb-4"/>
                                 <p className="text-gray-500 mb-6">Upload your resume to get instant feedback and scoring against job descriptions.</p>
                                 <button 
                                    onClick={handleAnalyzeResume}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
                                 >
                                     {isAnalyzing