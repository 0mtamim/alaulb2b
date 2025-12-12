
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';
import { Package, Globe, Factory, Zap, ChevronRight, ShieldCheck, Box, Filter, Search, Star, MapPin, X, Gem, TrendingUp, DollarSign, Store, Calendar, Briefcase, Clock, Building2, PlayCircle, Timer, TrendingDown, ArrowRight, Anchor, Hammer, Droplets, Cpu, Shirt, Sparkles, LayoutGrid, CheckCircle, ChevronLeft, Award } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useModules } from '../contexts/ModuleContext';
import { useBanners } from '../contexts/BannerContext';

// Mock Data updated to the new expanded Product interface
const PRODUCTS: Product[] = [
  { 
    id: '1', title: 'Industrial Heavy Duty Hydraulic Pump 5000 PSI', description: '...', category: 'Machinery', supplierId: 's1', productType: 'physical', status: 'active',
    variants: [{ id: 'v1', sku: 'PUMP-5000-STD', attributes: { "Model": "Standard" }, price: 120, stock: 50 }],
    pricingTiers: [{ minQty: 10, maxQty: 49, pricePerUnit: 120 }, { minQty: 50, maxQty: null, pricePerUnit: 110 }],
    multimedia: { images: ['https://picsum.photos/400/400?random=1'] },
    specifications: [{ key: 'Pressure', value: '5000 PSI' }],
    shipping: { weight: 45, weightUnit: 'kg', dimensions: { length: 60, width: 40, height: 40, unit: 'cm' } },
    compliance: { certificates: ['CE', 'ISO 9001'] },
    rating: 4.8, origin: 'China', supplierVerified: true, supplierBusinessType: 'Manufacturer', views: 1200, inquiries: 45,
    // Deprecated fields for compatibility
    price: 120, moq: 10, image: 'https://picsum.photos/400/400?random=1',
  },
  { 
    id: '2', title: 'Custom Printed Bio-degradable Coffee Packaging Bags', description: '...', category: 'Packaging', supplierId: 's2', productType: 'physical', status: 'active',
    variants: [{ id: 'v2', sku: 'BAG-COFFEE-BIO', attributes: { "Size": "250g" }, price: 0.05, stock: 50000 }],
    pricingTiers: [{ minQty: 5000, maxQty: 19999, pricePerUnit: 0.05 }, { minQty: 20000, maxQty: null, pricePerUnit: 0.04 }],
    multimedia: { images: ['https://picsum.photos/400/400?random=2'] },
    specifications: [{ key: 'Material', value: 'PLA' }],
    shipping: { weight: 0.01, weightUnit: 'kg', dimensions: { length: 15, width: 10, height: 1, unit: 'cm' } },
    compliance: { certificates: ['FSC', 'Compostable'] },
    rating: 4.9, origin: 'Vietnam', supplierVerified: true, supplierBusinessType: 'Manufacturer', views: 3500, inquiries: 120,
    price: 0.05, moq: 5000, image: 'https://picsum.photos/400/400?random=2',
  },
  { 
    id: '3', title: 'Smart Warehouse IoT Sensor Modules Long Range', description: '...', category: 'Electronics', supplierId: 's3', productType: 'physical', status: 'active',
    variants: [{ id: 'v3', sku: 'IOT-SENSOR-LR', attributes: { "Frequency": "915MHz" }, price: 15, stock: 800 }],
    pricingTiers: [{ minQty: 100, maxQty: null, pricePerUnit: 15 }],
    multimedia: { images: ['https://picsum.photos/400/400?random=3'] },
    specifications: [{ key: 'Range', value: '5km' }],
    shipping: { weight: 0.2, weightUnit: 'kg', dimensions: { length: 10, width: 10, height: 3, unit: 'cm' } },
    compliance: { certificates: ['FCC'] },
    rating: 4.5, origin: 'Taiwan', supplierVerified: false, supplierBusinessType: 'Trading Company', views: 800, inquiries: 20,
    price: 15, moq: 100, image: 'https://picsum.photos/400/400?random=3',
  },
  { 
    id: '4', title: 'High Tensile Steel Construction Beam H-Shape', description: '...', category: 'Construction', supplierId: 's4', productType: 'physical', status: 'active',
    variants: [{ id: 'v4', sku: 'BEAM-H-10M', attributes: { "Length": "10m" }, price: 500, stock: 200 }],
    pricingTiers: [{ minQty: 5, maxQty: null, pricePerUnit: 500 }],
    multimedia: { images: ['https://picsum.photos/400/400?random=4'] },
    specifications: [{ key: 'Grade', value: 'S355' }],
    shipping: { weight: 200, weightUnit: 'kg', dimensions: { length: 1000, width: 20, height: 20, unit: 'cm' } },
    compliance: { certificates: [] },
    rating: 4.7, origin: 'China', supplierVerified: true, supplierBusinessType: 'Manufacturer', views: 1500, inquiries: 55,
    price: 500, moq: 5, image: 'https://picsum.photos/400/400?random=4',
  },
  { 
    id: '5', title: 'Organic Cotton Fabric Roll Textiles Wholesale', description: '...', category: 'Apparel', supplierId: 's5', productType: 'physical', status: 'active',
    variants: [{ id: 'v5', sku: 'FABRIC-COT-WHT', attributes: { "Color": "White" }, price: 3.5, stock: 10000 }],
    pricingTiers: [{ minQty: 500, maxQty: null, pricePerUnit: 3.5 }],
    multimedia: { images: ['https://picsum.photos/400/400?random=5'] },
    specifications: [{ key: 'GSM', value: '180' }],
    shipping: { weight: 20, weightUnit: 'kg', dimensions: { length: 150, width: 30, height: 30, unit: 'cm' } },
    compliance: { certificates: ['GOTS'] },
    rating: 4.6, origin: 'India', supplierVerified: true, supplierBusinessType: 'Trading Company', views: 2200, inquiries: 80,
    price: 3.5, moq: 500, image: 'https://picsum.photos/400/400?random=5',
  },
  { 
    id: '6', title: 'Automated CNC Milling Machine 5-Axis', description: '...', category: 'Machinery', supplierId: 's6', productType: 'physical', status: 'active',
    variants: [{ id: 'v6', sku: 'CNC-5AX-PRO', attributes: { "Model": "Pro" }, price: 25000, stock: 5 }],
    pricingTiers: [{ minQty: 1, maxQty: null, pricePerUnit: 25000 }],
    multimedia: { images: ['https://picsum.photos/400/400?random=6'] },
    specifications: [{ key: 'Control', value: 'Siemens' }],
    shipping: { weight: 1500, weightUnit: 'kg', dimensions: { length: 250, width: 200, height: 220, unit: 'cm' } },
    compliance: { certificates: ['CE'] },
    rating: 5.0, origin: 'Germany', supplierVerified: true, supplierBusinessType: 'Manufacturer', views: 950, inquiries: 30,
    price: 25000, moq: 1, image: 'https://picsum.photos/400/400?random=6',
  },
  { 
    id: '7', title: 'Solar Panel Monocrystalline 450W', description: '...', category: 'Energy', supplierId: 's7', productType: 'physical', status: 'active',
    variants: [{ id: 'v7', sku: 'SOLAR-450-MONO', attributes: {}, price: 80, stock: 500 }],
    pricingTiers: [{ minQty: 200, maxQty: null, pricePerUnit: 80 }],
    multimedia: { images: ['https://picsum.photos/400/400?random=7'] },
    specifications: [{ key: 'Efficiency', value: '22.5%' }],
    shipping: { weight: 22, weightUnit: 'kg', dimensions: { length: 209, width: 104, height: 3.5, unit: 'cm' } },
    compliance: { certificates: ['TUV'] },
    rating: 4.8, origin: 'China', supplierVerified: false, supplierBusinessType: 'Trading Company', views: 1800, inquiries: 70,
    price: 80, moq: 200, image: 'https://picsum.photos/400/400?random=7',
  },
  { 
    id: '8', title: 'Commercial Grade Restaurant Kitchen Mixer', description: '...', category: 'Machinery', supplierId: 's8', productType: 'physical', status: 'active',
    variants: [{ id: 'v8', sku: 'MIXER-20L', attributes: { "Capacity": "20L" }, price: 400, stock: 30 }],
    pricingTiers: [{ minQty: 5, maxQty: null, pricePerUnit: 400 }],
    multimedia: { images: ['https://picsum.photos/400/400?random=8'] },
    specifications: [{ key: 'Power', value: '1.5kW' }],
    shipping: { weight: 50, weightUnit: 'kg', dimensions: { length: 70, width: 50, height: 80, unit: 'cm' } },
    compliance: { certificates: ['CE', 'NSF'] },
    rating: 4.7, origin: 'Italy', supplierVerified: true, supplierBusinessType: 'Manufacturer', views: 600, inquiries: 15,
    price: 400, moq: 5, image: 'https://picsum.photos/400/400?random=8',
  },
];


// Expanded Industry Categories
const INDUSTRY_HUBS = [
  { name: 'Machinery', icon: Factory, sub: ['CNC', 'Hydraulics'], layout: 'md:col-span-2' },
  { name: 'Electronics', icon: Cpu, sub: ['IoT', 'Components'] },
  { name: 'Apparel', icon: Shirt, sub: ['Fabric', 'Garments'] },
  { name: 'Packaging', icon: Box, sub: ['Paper', 'Bottles'] },
  { name: 'Construction', icon: Hammer, sub: ['Steel', 'Tools'] },
  { name: 'Energy', icon: Zap, sub: ['Solar', 'Batteries'], layout: 'md:col-span-2' },
];

const REGIONS = [
    { name: 'China', image: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&w=400&q=80', label: 'Manufacturing Hub' },
    { name: 'Vietnam', image: 'https://images.unsplash.com/photo-1557750255-c76072a7bb19?auto=format&fit=crop&w=400&q=80', label: 'Textiles & Wood' },
    { name: 'Germany', image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=400&q=80', label: 'Precision Eng.' },
    { name: 'USA', image: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=400&q=80', label: 'Tech & Innovation' },
];

const VERIFIED_SELLERS = [
  { id: 's1', name: 'Shenzhen Tech Industries', country: 'China', logo: 'ST', mainProducts: ['IoT Sensors', 'Smart Home', 'PCB Assembly'] },
  { id: 's6', name: 'German Precision Engineering', country: 'Germany', logo: 'GP', mainProducts: ['CNC Machinery', 'Auto Parts', 'Tools'] },
  { id: 's2', name: 'Vietnam Textile Group', country: 'Vietnam', logo: 'VT', mainProducts: ['Cotton Fabric', 'Apparel', 'Yarn'] },
];

const FEATURED_BRANDS = [
  { id: 's1', name: 'Shenzhen Tech Industries', country: 'China', logo: 'ST', years: 12, rating: 4.9, banner: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80' },
  { id: 's6', name: 'German Precision Engineering', country: 'Germany', logo: 'GP', years: 25, rating: 5.0, banner: 'https://images.unsplash.com/photo-1565514020176-dbf2277e3b6e?auto=format&fit=crop&w=600&q=80' },
  { id: 's2', name: 'Vietnam Textile Group', country: 'Vietnam', logo: 'VT', years: 8, rating: 4.7, banner: 'https://images.unsplash.com/photo-1534643960519-11ad79bc19df?auto=format&fit=crop&w=600&q=80' },
  { id: 's5', name: 'India Organics Inc.', country: 'India', logo: 'IO', years: 5, rating: 4.6, banner: 'https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?auto=format&fit=crop&w=600&q=80' },
  { id: 's8', name: 'Italian Kitchenware Co.', country: 'Italy', logo: 'IK', years: 18, rating: 4.8, banner: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=600&q=80' },
];

const UPCOMING_EVENTS = [
  { id: 'ev1', title: 'Global Tech Expo 2024', date: 'Dec 15-18, 2024', location: 'Las Vegas, NV', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80', type: 'In-Person' },
  { id: 'ev2', title: 'Sustainable Textiles Summit', date: 'Nov 20, 2024', location: 'Virtual', image: 'https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=600&q=80', type: 'Online' },
  { id: 'ev3', title: 'Shenzhen Manufacturing Gala', date: 'Jan 10, 2025', location: 'Shenzhen, CN', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80', type: 'In-Person' },
];

const OPPORTUNITIES = [
  { id: 'inv1', type: 'Investment', title: 'Profitable SaaS in Fintech', location: 'Singapore', investment: '$2.5M Asking', revenue: '$1.2M ARR', image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=600&q=80' },
  { id: 'fran1', type: 'Franchise', title: 'Eco-Friendly Coffee Chain', location: 'USA Nationwide', investment: '$150k Min.', revenue: 'High ROI', image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=600&q=80' },
  { id: 'inv2', type: 'Investment', title: 'Textile Manufacturing Unit', location: 'Vietnam', investment: '$15M Asking', revenue: '$8M/year', image: 'https://images.unsplash.com/photo-1620756236232-ff429071d73c?auto=format&fit=crop&w=600&q=80' },
  { id: 'fran2', type: 'Franchise', title: 'Logistics & Last-Mile Delivery', location: 'EU Region', investment: '$200k Min.', revenue: 'Established Network', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80' },
];

// --- Carousel Components ---

const HorizontalScrollSection: React.FC<{ title?: string; subtitle?: string; items: Product[]; linkText?: string; icon?: React.ElementType; iconColor?: string; darkMode?: boolean }> = ({ title, subtitle, items, linkText, icon: Icon, iconColor, darkMode = false }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScrollability = () => {
        const el = scrollRef.current;
        if (el) {
            setCanScrollLeft(el.scrollLeft > 0);
            setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1); // -1 for precision
        }
    };

    useEffect(() => {
        checkScrollability();
        const currentRef = scrollRef.current;
        currentRef?.addEventListener('scroll', checkScrollability);
        window.addEventListener('resize', checkScrollability);
        return () => {
            currentRef?.removeEventListener('scroll', checkScrollability);
            window.removeEventListener('resize', checkScrollability);
        };
    }, [items]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = scrollRef.current.offsetWidth * 0.8;
            scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="py-2">
            {(title || subtitle || linkText) && (
                <div className="flex justify-between items-end mb-6 px-1">
                    <div>
                        {title && <h2 className={`text-xl md:text-2xl font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                            {Icon && <Icon className={iconColor} size={24}/>}
                            {title}
                        </h2>}
                        {subtitle && <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{subtitle}</p>}
                    </div>
                    {linkText && (
                        <button className={`text-sm font-bold flex items-center gap-1 transition-colors group ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
                            {linkText} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
                        </button>
                    )}
                </div>
            )}
            
            <div className="relative group/scroll">
                <button onClick={() => scroll('left')} disabled={!canScrollLeft} className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/60 backdrop-blur-sm p-2 rounded-full shadow-lg opacity-0 group-hover/scroll:opacity-100 transition-opacity -ml-4 hover:bg-white disabled:opacity-0 disabled:cursor-default"><ChevronLeft className="text-slate-800"/></button>
                <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory no-scrollbar scroll-smooth px-1">
                    {items.map((product: Product) => (
                        <div key={product.id} className="min-w-[200px] w-[200px] md:min-w-[240px] md:w-[240px] snap-start">
                            <ProductCard product={product} variant="compact" />
                        </div>
                    ))}
                </div>
                <button onClick={() => scroll('right')} disabled={!canScrollRight} className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/60 backdrop-blur-sm p-2 rounded-full shadow-lg opacity-0 group-hover/scroll:opacity-100 transition-opacity -mr-4 hover:bg-white disabled:opacity-0 disabled:cursor-default"><ChevronRight className="text-slate-800"/></button>
            </div>
        </div>
    );
};

const CompanyCard: React.FC<{ brand: typeof FEATURED_BRANDS[0] }> = ({ brand }) => (
    <Link to={`/supplier/${brand.id}`} className="block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
        <div className="h-28 bg-gray-200 relative overflow-hidden">
            <img src={brand.banner} alt={`${brand.name} banner`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-[-20px] left-4 w-16 h-16 bg-white rounded-xl shadow-md flex items-center justify-center text-xl font-bold text-slate-700 border-2 border-white group-hover:scale-105 transition-transform">
                {brand.logo}
            </div>
        </div>
        <div className="p-4 pt-8">
            <h4 className="font-bold text-slate-800 truncate group-hover:text-orange-600 transition-colors">{brand.name}</h4>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                <span className="flex items-center gap-1"><MapPin size={12}/> {brand.country}</span>
                <span className="flex items-center gap-1 font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full"><Star size={12} fill="currentColor"/> {brand.rating}</span>
            </div>
        </div>
    </Link>
);

const CompanyCarousel: React.FC<{ title: string, subtitle: string }> = ({ title, subtitle }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const scroll = (dir: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = scrollRef.current.offsetWidth * 0.9;
            scrollRef.current.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="py-6">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-800">{title}</h2>
                    <p className="text-sm mt-1 text-slate-500">{subtitle}</p>
                </div>
                <Link to="/suppliers" className="text-sm font-bold flex items-center gap-1 text-blue-600 hover:text-blue-700">
                    View All <ArrowRight size={16}/>
                </Link>
            </div>
            
            <div className="relative group/scroll">
                <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/60 backdrop-blur-sm p-2 rounded-full shadow-lg opacity-0 group-hover/scroll:opacity-100 transition-opacity -ml-4 hover:bg-white"><ChevronLeft className="text-slate-800"/></button>
                <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar scroll-smooth">
                    {FEATURED_BRANDS.map(brand => (
                        <div key={brand.id} className="min-w-[250px] w-[250px] snap-start">
                            <CompanyCard brand={brand} />
                        </div>
                    ))}
                </div>
                <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/60 backdrop-blur-sm p-2 rounded-full shadow-lg opacity-0 group-hover/scroll:opacity-100 transition-opacity -mr-4 hover:bg-white"><ChevronRight className="text-slate-800"/></button>
            </div>
        </div>
    );
};

// --- Main Page Component ---

export const Home: React.FC = () => {
  const { t, isRTL, formatPrice } = useLanguage();
  const { modules } = useModules();
  const { banners } = useBanners();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCarouselCategory, setActiveCarouselCategory] = useState(INDUSTRY_HUBS[0].name);

  // Get banners from context
  const companyBanner = banners.find(b => b.slot === 'company' && b.status === 'active');
  const showcase1 = banners.find(b => b.slot === 'product_showcase_1' && b.status === 'active');
  const showcase2 = banners.find(b => b.slot === 'product_showcase_2' && b.status === 'active');
  const promoBanner = banners.find(b => b.slot === 'promotion' && b.status === 'active');

  // Derived State (Source of Truth is URL)
  const activeCategory = searchParams.get('category');
  const urlSearchQuery = searchParams.get('q') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const maxMoq = searchParams.get('maxMoq') || '';
  const minRating = Number(searchParams.get('minRating')) || 0;
  const origin = searchParams.get('origin') || '';
  const businessTypes = searchParams.get('businessType') ? searchParams.get('businessType')!.split(',') : [];
  const sortBy = searchParams.get('sort') || 'best-match';
  const verifiedOnly = searchParams.get('verified') === 'true';

  // Local state for search input and filter inputs
  const [localSearch, setLocalSearch] = useState(urlSearchQuery);
  const [priceMinInput, setPriceMinInput] = useState(minPrice);
  const [priceMaxInput, setPriceMaxInput] = useState(maxPrice);
  const [moqInput, setMoqInput] = useState(maxMoq);

  useEffect(() => {
    setLocalSearch(urlSearchQuery);
  }, [urlSearchQuery]);

  // Sync local filter states when URL params change
  useEffect(() => {
    setPriceMinInput(minPrice);
    setPriceMaxInput(maxPrice);
    setMoqInput(maxMoq);
  }, [minPrice, maxPrice, maxMoq]);

  const updateParam = (key: string, value: string | null) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
      return newParams;
    });
  };

  const handlePriceApply = () => {
    updateParam('minPrice', priceMinInput);
    updateParam('maxPrice', priceMaxInput);
  };

  const handleMoqApply = () => {
    updateParam('maxMoq', moqInput);
  };

  const handleSearchSubmit = () => {
    updateParam('q', localSearch.trim() || null);
  };

  const handleBusinessTypeChange = (type: string, checked: boolean) => {
    const current = new Set(businessTypes);
    if (checked) current.add(type);
    else current.delete(type);
    
    const newVal = Array.from(current).join(',');
    updateParam('businessType', newVal.length > 0 ? newVal : null);
  };

  const clearFilters = () => {
    setSearchParams({});
    setLocalSearch('');
    setPriceMinInput('');
    setPriceMaxInput('');
    setMoqInput('');
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchCategory = activeCategory ? p.category === activeCategory : true;
      const matchSearch = p.title.toLowerCase().includes(urlSearchQuery.toLowerCase());
      const matchMinPrice = minPrice ? p.price >= Number(minPrice) : true;
      const matchMaxPrice = maxPrice ? p.price <= Number(maxPrice) : true;
      const matchMoq = maxMoq ? p.moq <= Number(maxMoq) : true;
      const matchRating = minRating ? p.rating >= minRating : true;
      const matchOrigin = origin ? p.origin === origin : true;
      const matchBusinessType = businessTypes.length > 0 ? (p.supplierBusinessType && businessTypes.includes(p.supplierBusinessType)) : true;
      const matchVerified = verifiedOnly ? p.supplierVerified : true;
      
      return matchCategory && matchSearch && matchMinPrice && matchMaxPrice && matchMoq && matchRating && matchOrigin && matchBusinessType && matchVerified;
    });
  }, [activeCategory, urlSearchQuery, minPrice, maxPrice, maxMoq, minRating, origin, businessTypes, verifiedOnly]);

  const sortedProducts = useMemo(() => {
    let products = [...filteredProducts];
    switch (sortBy) {
      case 'price-asc': return products.sort((a, b) => a.price - b.price);
      case 'price-desc': return products.sort((a, b) => b.price - a.price);
      case 'moq-asc': return products.sort((a, b) => a.moq - b.moq);
      case 'popularity': return products.sort((a, b) => (b.views || 0) - (a.views || 0));
      default: return products;
    }
  }, [filteredProducts, sortBy]);

  const categoryProducts = useMemo(() => 
    PRODUCTS.filter(p => p.category === activeCarouselCategory), 
    [activeCarouselCategory]
  );
  
  const personalizedProducts = useMemo(() => {
    return [...PRODUCTS].sort(() => 0.5 - Math.random()).slice(0, 8); // Shuffle and take 8
  }, []);

  const countries = Array.from(new Set(PRODUCTS.map(p => p.origin))).sort();

  return (
    <div className="bg-slate-100 min-h-screen pb-12">
      {/* Ticker Bar */}
      <div className="bg-black text-slate-400 text-xs py-2 overflow-hidden whitespace-nowrap border-b border-slate-800">
          <div className="inline-block animate-marquee pl-10">
              <span className="mx-6"><span className="text-green-500">▲</span> Copper Index: $8,420 (+1.2%)</span>
              <span className="mx-6"><span className="text-red-500">▼</span> Cotton Futures: $84.20 (-0.5%)</span>
              <span className="mx-6"><span className="text-green-500">▲</span> Brent Crude: $82.10 (+0.8%)</span>
              <span className="mx-6"><span className="text-green-500">▲</span> Shipping Rate (CN-US): $1,450 (+2.1%)</span>
              <span className="mx-6 text-orange-400">★ Trending: Sustainable Packaging, Li-Ion Batteries, Solar Components</span>
          </div>
      </div>

      {/* Hero Section */}
      <div className="bg-slate-950 text-white relative overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Animated Aurora Background */}
        <div className="absolute inset-0 z-0 opacity-40">
            <div className="absolute top-[20%] left-[10%] w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse delay-2000"></div>
            <div className="absolute top-[10%] right-[20%] w-96 h-96 bg-orange-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-[5%] right-[5%] w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse delay-4000"></div>
        </div>
        
        <div className="container mx-auto px-4 py-28 md:py-36 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm text-xs font-bold px-3 py-1.5 rounded-full mb-6 text-orange-300 animate-fade-in">
              <Zap size={12} fill="currentColor"/> NEXT-GEN B2B COMMERCE
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-400 animate-fade-in-up">
              {t('hero_title')}
            </h1>
            <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              {t('hero_subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Link to="/dashboard" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg hover:shadow-orange-500/25 flex items-center justify-center gap-2 transform hover:scale-105">
                {t('btn_launch')} <ChevronRight size={18} className={isRTL ? 'rotate-180' : ''}/>
              </Link>
              <Link to="/rfq" className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-4 rounded-full font-bold transition-all border border-white/20 flex items-center justify-center gap-2 transform hover:scale-105">
                {t('btn_post_rfq')}
              </Link>
            </div>
        </div>
      </div>

      {/* Trust Indicators Bar */}
      <div className="container mx-auto px-4 -mt-12 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                  { icon: ShieldCheck, text: 'Secure Payments', color: 'text-green-500' },
                  { icon: Globe, text: 'Global Logistics', color: 'text-blue-500' },
                  { icon: CheckCircle, text: 'Verified Sellers', color: 'text-orange-500' },
                  { icon: Zap, text: 'AI Matching', color: 'text-purple-500' },
              ].map((item, idx) => (
                  <div key={idx} className="bg-white/60 backdrop-blur-lg p-4 md:p-6 rounded-2xl border border-white/50 shadow-lg text-center flex flex-col items-center justify-center animate-fade-in-up" style={{animationDelay: `${idx * 100}ms`}}>
                      <item.icon size={32} className={`${item.color} mb-3`} strokeWidth={1.5}/>
                      <span className="font-bold text-slate-700 text-sm md:text-base">{item.text}</span>
                  </div>
              ))}
          </div>
      </div>

      {/* Main Content Container */}
      <div className="space-y-16 pb-12 relative z-20 mt-16">
        
        {/* Source by Industry - BENTO GRID */}
        <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Source by Industry</h2>
                    <p className="text-slate-500 mt-2">Explore top manufacturing hubs and specialized sectors.</p>
                </div>
                <Link to="/categories" className="text-blue-600 font-bold hover:underline flex items-center gap-1">View All Categories <ArrowRight size={16}/></Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] gap-4">
                {INDUSTRY_HUBS.map((cat, idx) => (
                    <div 
                        key={idx} 
                        className={`
                            group relative flex flex-col justify-between p-6 rounded-2xl cursor-pointer transition-all duration-300
                            border border-slate-200/50 bg-white/50 backdrop-blur-sm hover:shadow-2xl hover:border-white overflow-hidden
                            ${activeCategory === cat.name ? 'ring-2 ring-orange-500 shadow-orange-200' : ''} ${cat.layout || ''}
                        `}
                        onClick={() => updateParam('category', activeCategory === cat.name ? null : cat.name)}
                    >
                        <div className="relative z-10">
                            <div className={`p-3 rounded-full mb-3 transition-all duration-300 w-fit ${activeCategory === cat.name ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-orange-100 group-hover:text-orange-600'}`}>
                                <cat.icon size={24} strokeWidth={1.5}/>
                            </div>
                            <span className="relative z-10 text-lg font-bold text-slate-800">{cat.name}</span>
                        </div>
                        <div className="relative z-10 text-xs text-slate-400 font-medium">{cat.sub.join(' • ')}</div>
                    </div>
                ))}
            </div>
        </div>

        {/* Company Banner */}
        {companyBanner && (
          <div className="container mx-auto px-4">
            <div className={`relative ${companyBanner.config?.bgColor || 'bg-slate-800'} rounded-2xl text-white overflow-hidden group`}>
                {companyBanner.content.image && <img src={companyBanner.content.image} alt={companyBanner.content.title} className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500"/>}
                <div className="relative z-10 p-12 md:p-16 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                           <ShieldCheck size={24} className="text-yellow-400"/>
                           <h2 className="text-3xl font-bold">{companyBanner.content.title}</h2>
                        </div>
                        <p className="text-slate-300 max-w-lg">{companyBanner.content.subtitle}</p>
                    </div>
                    {companyBanner.content.buttonText &&
                      <Link to={companyBanner.content.link} className="bg-white/90 backdrop-blur-sm text-slate-800 px-8 py-3 rounded-lg font-bold hover:bg-white transition-colors shadow-lg flex-shrink-0">
                          {companyBanner.content.buttonText}
                      </Link>
                    }
                </div>
            </div>
          </div>
        )}

        {/* AI Recommendations - Dark Theme Carousel */}
        <div className="bg-slate-900 py-16 text-white overflow-hidden relative">
            <div className="absolute inset-0 z-0 opacity-20">
                <div className="absolute top-[-50%] left-[-10%] w-[50%] h-[150%] bg-blue-500 blur-[100px] rounded-full mix-blend-screen animate-pulse"></div>
                <div className="absolute bottom-[-50%] right-[-10%] w-[50%] h-[150%] bg-purple-500 blur-[100px] rounded-full mix-blend-screen animate-pulse delay-1000"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-blue-300 mb-3">
                            <Sparkles size={12}/> AI PERSONALIZED
                        </div>
                        <h2 className="text-3xl font-bold">Curated for Your Business</h2>
                        <p className="text-slate-400 mt-2 max-w-xl">
                            Based on your browsing history, these high-potential suppliers match your sourcing criteria.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold transition-colors">Trending</button>
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-blue-500/30">For You</button>
                    </div>
                </div>

                <HorizontalScrollSection 
                    title="Just for You"
                    subtitle="Products selected based on your activity."
                    items={personalizedProducts}
                    linkText="See More Recommendations"
                    icon={Sparkles}
                    iconColor="text-blue-400"
                    darkMode={true}
                />
            </div>
        </div>
        
        <div className="container mx-auto px-4">
            <HorizontalScrollSection 
                title="Top Selling Products"
                subtitle="Explore what's trending across all categories."
                items={PRODUCTS.slice().sort((a,b) => (b.views || 0) - (a.views || 0))}
                linkText="View All Products"
                icon={TrendingUp}
                iconColor="text-green-500"
            />
        </div>
        
        {/* Product Showcase Banners */}
        <div className="container mx-auto px-4">
             <div className="grid md:grid-cols-2 gap-8">
                {showcase1 && (
                  <div className={`relative ${showcase1.config?.bgColor || 'bg-blue-50'} rounded-2xl p-8 flex flex-col justify-between overflow-hidden group`}>
                      <div>
                          <h3 className="text-2xl font-bold text-slate-800">{showcase1.content.title}</h3>
                          <p className="text-slate-500 mt-2 mb-6">{showcase1.content.subtitle}</p>
                          <Link to={showcase1.content.link} className="font-bold text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                              {showcase1.content.buttonText} <ArrowRight size={16}/>
                          </Link>
                      </div>
                      {showcase1.content.image && <img src={showcase1.content.image} alt={showcase1.content.title} className="absolute bottom-0 right-0 h-4/5 w-auto object-contain translate-x-10 group-hover:scale-105 transition-transform duration-500 opacity-90"/>}
                  </div>
                )}
                 {showcase2 && (
                   <div className={`relative ${showcase2.config?.bgColor || 'bg-slate-100'} rounded-2xl p-8 flex flex-col justify-between overflow-hidden group`}>
                      <div>
                          <h3 className="text-2xl font-bold text-slate-800">{showcase2.content.title}</h3>
                          <p className="text-slate-500 mt-2 mb-6">{showcase2.content.subtitle}</p>
                          <Link to={showcase2.content.link} className="font-bold text-slate-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                              {showcase2.content.buttonText} <ArrowRight size={16}/>
                          </Link>
                      </div>
                      {showcase2.content.image && <img src={showcase2.content.image} alt={showcase2.content.title} className="absolute -bottom-8 -right-8 h-4/5 w-4/5 object-contain group-hover:rotate-3 transition-transform duration-500 opacity-80"/>}
                   </div>
                 )}
             </div>
        </div>

        <div className="container mx-auto px-4">
             <CompanyCarousel 
                title="Featured Brands & Factories"
                subtitle="Directly source from leading manufacturers with proven track records."
            />
        </div>

        {/* Dynamic Category Products Section */}
        <div className="container mx-auto px-4 mt-16">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Shop by Category</h2>
                <p className="text-slate-500 mt-2 max-w-2xl mx-auto">Discover top-selling products from our most popular industrial and commercial categories.</p>
            </div>

            {/* Category Tabs */}
            <div className="flex justify-center gap-2 mb-8 border-b border-gray-200">
                {INDUSTRY_HUBS.map((cat) => (
                    <button
                        key={cat.name}
                        onClick={() => setActiveCarouselCategory(cat.name)}
                        className={`flex items-center gap-2 px-5 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-all duration-300 ${
                            activeCarouselCategory === cat.name
                                ? 'border-orange-500 text-orange-600'
                                : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        <cat.icon size={16} />
                        <span>{cat.name}</span>
                    </button>
                ))}
            </div>

            {/* Carousel which updates based on active tab */}
            <div key={activeCarouselCategory} className="animate-fade-in">
                <HorizontalScrollSection
                    items={categoryProducts}
                />
            </div>
        </div>


        {/* Verified Sellers Section */}
        <div className="container mx-auto px-4 mt-16">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <Award className="text-yellow-500" /> Top Verified Manufacturers
                </h2>
                <Link to="/suppliers" className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1">
                    View All Suppliers <ArrowRight size={14}/>
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {VERIFIED_SELLERS.map(seller => (
                    <Link to={`/supplier/${seller.id}`} key={seller.id} className="block bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all group">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-xl font-bold text-slate-600 border-2 border-white shadow-inner">
                                {seller.logo}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                                    {seller.name} <ShieldCheck size={16} className="text-blue-500" />
                                </h3>
                                <p className="text-sm text-slate-500 flex items-center gap-1.5"><MapPin size={12}/> {seller.country}</p>
                            </div>
                        </div>
                        <div className="mb-4">
                            <p className="text-xs font-bold text-slate-400 uppercase mb-2">Main Products</p>
                            <div className="flex flex-wrap gap-2">
                                {seller.mainProducts.map(prod => (
                                    <span key={prod} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full font-medium">{prod}</span>
                                ))}
                            </div>
                        </div>
                        <div className="pt-4 border-t border-gray-100 text-right">
                            <span className="text-sm font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">View Profile &rarr;</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>

        {/* Source by Region */}
        <div className="container mx-auto px-4 mt-16">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <Globe className="text-blue-600" /> Source by Region
                </h2>
                <button className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1">View All Markets <ArrowRight size={14}/></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {REGIONS.map((region, idx) => (
                    <div key={idx} className="relative h-64 rounded-2xl overflow-hidden cursor-pointer group hover:shadow-xl transition-all border border-slate-200">
                        <img src={region.image} alt={region.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 text-white">
                            <h3 className="font-bold text-xl">{region.name}</h3>
                            <p className="text-xs text-slate-300 font-medium bg-white/20 backdrop-blur-md px-2 py-0.5 rounded w-fit mt-1">{region.label}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        
        {/* Events Section */}
        <div className="container mx-auto px-4 mt-16">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Calendar className="text-red-500" /> Global Trade Events
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Discover trade shows, summits, and networking opportunities.</p>
                </div>
                <Link to="/events" className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1">
                    View All Events <ArrowRight size={14}/>
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {UPCOMING_EVENTS.map(event => (
                    <Link to="/events" key={event.id} className="block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all">
                        <div className="h-48 bg-gray-200 relative overflow-hidden">
                            <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full shadow-md ${event.type === 'Online' ? 'bg-blue-500 text-white' : 'bg-white text-slate-800'}`}>
                                {event.type}
                            </span>
                        </div>
                        <div className="p-5">
                            <h3 className="font-bold text-slate-800 mb-2 group-hover:text-red-600 transition-colors h-12">{event.title}</h3>
                            <div className="space-y-2 text-xs text-slate-500">
                                <p className="flex items-center gap-2"><Calendar size={14}/> {event.date}</p>
                                <p className="flex items-center gap-2"><MapPin size={14}/> {event.location}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>

        {/* Promotion Banner */}
        {promoBanner && (
            <div className="container mx-auto px-4">
                <div className={`relative bg-gradient-to-r ${promoBanner.config?.bgGradient || 'from-gray-500 to-gray-700'} rounded-2xl text-white p-12 text-center overflow-hidden`}>
                    <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-white/10 rounded-full"></div>
                    <div className="absolute -top-16 -left-16 w-48 h-48 bg-white/10 rounded-full"></div>
                    <h3 className="text-4xl font-extrabold mb-3 relative z-10">{promoBanner.content.title}</h3>
                    <p className="text-lg mb-6 relative z-10">{promoBanner.content.subtitle}</p>
                    <Link to={promoBanner.content.link} className="bg-white text-orange-600 px-8 py-3 rounded-full font-bold shadow-lg hover:bg-orange-50 transition-colors relative z-10">
                        {promoBanner.content.buttonText}
                    </Link>
                </div>
            </div>
        )}

        {/* Investment & Franchise Section */}
        <div className="bg-slate-900 py-16 text-white overflow-hidden relative mt-16">
            <div className="absolute inset-0 z-0 opacity-20">
                <div className="absolute top-[-50%] left-[-10%] w-[50%] h-[150%] bg-purple-500 blur-[100px] rounded-full mix-blend-screen animate-pulse"></div>
                <div className="absolute bottom-[-50%] right-[-10%] w-[50%] h-[150%] bg-pink-500 blur-[100px] rounded-full mix-blend-screen animate-pulse delay-1000"></div>
            </div>
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-3">Investment & Franchise Opportunities</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">Acquire profitable businesses or partner with established brands to expand your portfolio.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {OPPORTUNITIES.map(op => (
                        <Link to="/invest" key={op.id} className="block bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden group hover:border-purple-500 transition-all transform hover:-translate-y-1">
                            <div className="h-40 overflow-hidden">
                                <img src={op.image} alt={op.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                            </div>
                            <div className="p-5">
                                <span className={`text-xs font-bold px-2 py-1 rounded mb-2 inline-flex items-center gap-1 ${op.type === 'Investment' ? 'bg-purple-200 text-purple-800' : 'bg-pink-200 text-pink-800'}`}>
                                    {op.type === 'Investment' ? <Gem size={12}/> : <Store size={12}/>} {op.type}
                                </span>
                                <h4 className="font-bold text-white mb-2 h-10 group-hover:text-purple-300 transition-colors">{op.title}</h4>
                                <div className="text-xs text-slate-400 flex items-center gap-1 mb-4"><MapPin size={12}/> {op.location}</div>
                                <div className="space-y-2 text-sm border-t border-slate-700 pt-3">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Investment</span>
                                        <span className="font-bold text-white">{op.investment}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Revenue</span>
                                        <span className="font-bold text-white">{op.revenue}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="text-center mt-12">
                    <Link to="/invest" className="bg-white/10 hover:bg-white/20 border border-slate-700 text-white px-8 py-3 rounded-full font-bold transition-colors">
                        Explore All Opportunities
                    </Link>
                </div>
            </div>
        </div>


        {/* Product Grid with Filters */}
        <div className="container mx-auto px-4 my-16" id="products-section">
             <h2 className="text-2xl font-bold text-slate-800 text-center mb-12">More Products</h2>
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <div className="lg:w-1/4">
                    <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-24">
                        <div className="flex justify-between items-center gap-2 font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">
                            <div className="flex items-center gap-2"><Filter size={20}/> Filters</div>
                            {(minPrice || maxPrice || maxMoq || minRating > 0 || verifiedOnly || origin || businessTypes.length > 0) && (
                                <button onClick={clearFilters} className="text-xs text-red-500 font-normal hover:underline">Clear All</button>
                            )}
                        </div>

                        {/* Supplier Features */}
                        <div className="mb-6 pb-6 border-b border-slate-100">
                            <h4 className="text-sm font-bold text-slate-700 mb-3">Supplier Features</h4>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={verifiedOnly}
                                        onChange={(e) => updateParam('verified', e.target.checked ? 'true' : null)}
                                        className="rounded text-orange-500 focus:ring-orange-500"
                                    />
                                    <span className="text-sm text-slate-600 flex items-center gap-1">
                                        <ShieldCheck size={14} className="text-orange-500"/> Verified Supplier
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="mb-6">
                            <h4 className="text-sm font-bold text-slate-700 mb-3">Price Range</h4>
                            <div className="flex items-center gap-2 mb-2">
                                <input 
                                    type="number" 
                                    placeholder="Min"
                                    value={priceMinInput}
                                    onChange={(e) => setPriceMinInput(e.target.value)}
                                    className="w-full p-2 border bg-slate-50 border-slate-200 rounded text-sm outline-none focus:border-orange-500"
                                />
                                <span className="text-slate-400">-</span>
                                <input 
                                    type="number" 
                                    placeholder="Max"
                                    value={priceMaxInput}
                                    onChange={(e) => setPriceMaxInput(e.target.value)}
                                    className="w-full p-2 border bg-slate-50 border-slate-200 rounded text-sm outline-none focus:border-orange-500"
                                />
                            </div>
                            <button onClick={handlePriceApply} className="w-full bg-slate-100 text-slate-600 text-xs font-bold py-1.5 rounded hover:bg-slate-200">Apply Price</button>
                        </div>
                    </div>
                </div>

                {/* Product List */}
                <div className="lg:w-3/4">
                    {sortedProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sortedProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                            <div className="inline-block p-4 rounded-full bg-slate-50 mb-4">
                                <Search size={32} className="text-slate-400"/>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-1">No products found</h3>
                            <p className="text-slate-500 mb-6">We couldn't find any matches for your filters.</p>
                            <button 
                                onClick={clearFilters}
                                className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-800 transition-colors"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default Home;
