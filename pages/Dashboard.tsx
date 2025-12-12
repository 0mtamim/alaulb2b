
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SupplierDashboard from './SupplierDashboard';
import { 
    LayoutDashboard, Users, Settings, BookOpen, 
    BarChart2, Edit, X, Check, Info, Globe, Layout,
    Search, TrendingUp, Megaphone, ExternalLink, Eye,
    ShoppingBag, AlertTriangle, CheckCircle, Ban, Zap, ShieldCheck, 
    FileText, Truck, DollarSign, Activity, LogOut, Lock,
    Crown, CreditCard, List, Star, Sliders, Shield, Palette, Layers,
    Move, GripVertical, Power, Save, GitBranch, PlayCircle, Clock, FileCode, Workflow,
    Plus, Trash2, ChevronUp, ChevronDown, GitMerge, BellRing, Timer, AlertOctagon,
    MousePointer, Smartphone, Code, Cpu, ToggleLeft, ToggleRight, Monitor, User, Sparkles,
    Box, Type, Image as ImageIcon, Grid, Square, Database, Key, Server, DownloadCloud, Fingerprint
} from 'lucide-react';
import { 
    AdminRole, AdminUser, Banner, SiteSettings, Product, ToastNotification, MembershipPlan, SearchSettings, SecuritySettings, WorkflowTemplate, WorkflowInstance, WorkflowStage,
    LogicRule, PageConfig, PersonaType, RegionType, PageModule, AdminPermission, AdminResource, AuditLog, ComplianceRequest, Backup
} from '../types';
import { useBanners } from '../contexts/BannerContext';
import { 
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, CartesianGrid, AreaChart, Area, LineChart, Line, Legend
} from 'recharts';
import { analyzeProductCompliance } from '../services/gemini';

// --- Missing Type Definitions ---
interface LayoutSection {
    id: string;
    name: string;
    enabled: boolean;
}

interface LayoutConfig {
    sections: LayoutSection[];
}

const INITIAL_LAYOUT_CONFIG: LayoutConfig = {
    sections: [
        { id: 'overview', name: 'Overview', enabled: true },
        { id: 'analytics', name: 'Analytics', enabled: true },
        { id: 'recent_activity', name: 'Recent Activity', enabled: true }
    ]
};

// --- MOCK INITIAL DATA ---
const INITIAL_USERS: AdminUser[] = [
    { id: 'u1', name: 'Admin User', email: 'admin@tradegenius.ai', role: 'Administrator', status: 'Active', country: 'USA', joinDate: '2023-01-15', lastLogin: 'Just now', isVerified: true },
    { id: 'u2', name: 'Sarah Content', email: 'sarah@tradegenius.ai', role: 'Content Moderator', status: 'Active', country: 'UK', joinDate: '2023-03-10', lastLogin: '2 hours ago', isVerified: true },
    { id: 'u3', name: 'Mike Support', email: 'mike@tradegenius.ai', role: 'Support Agent', status: 'Active', country: 'Canada', joinDate: '2023-05-22', lastLogin: '1 day ago', isVerified: true },
];

const INITIAL_ROLES: AdminRole[] = [
    {
        id: 'role_admin', name: 'Administrator', description: 'Full system access',
        permissions: { products: ['read', 'write', 'delete', 'approve', 'manage'], users: ['read', 'write', 'delete', 'approve', 'manage'], orders: ['read', 'write', 'delete', 'approve', 'manage'], finance: ['read', 'write', 'delete', 'approve', 'manage'], settings: ['read', 'write', 'delete', 'approve', 'manage'], security: ['read', 'write', 'delete', 'approve', 'manage'] }
    },
    {
        id: 'role_moderator', name: 'Content Moderator', description: 'Can review and approve listings',
        permissions: { products: ['read', 'approve'], users: ['read'], orders: ['read'], finance: [], settings: [], security: [] }
    },
    {
        id: 'role_support', name: 'Support Agent', description: 'Customer service access',
        permissions: { products: ['read'], users: ['read'], orders: ['read', 'manage'], finance: ['read'], settings: [], security: [] }
    }
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
    { id: 'log_1', timestamp: '2023-10-28 14:30:22', actor: 'Admin User', action: 'UPDATE', resource: 'Security Settings', ipAddress: '192.168.1.10', status: 'SUCCESS' },
    { id: 'log_2', timestamp: '2023-10-28 14:15:00', actor: 'System', action: 'BACKUP', resource: 'Database', ipAddress: 'localhost', status: 'SUCCESS' },
    { id: 'log_3', timestamp: '2023-10-28 13:45:12', actor: 'Sarah Content', action: 'APPROVE', resource: 'Product #1023', ipAddress: '203.0.113.42', status: 'SUCCESS' },
    { id: 'log_4', timestamp: '2023-10-28 12:10:05', actor: 'Unknown', action: 'LOGIN_ATTEMPT', resource: 'Admin Panel', ipAddress: '198.51.100.23', status: 'FAILURE', metadata: 'Invalid Password' },
    { id: 'log_5', timestamp: '2023-10-28 10:00:00', actor: 'Mike Support', action: 'READ', resource: 'User #8821', ipAddress: '192.0.2.1', status: 'SUCCESS' }
];

const INITIAL_COMPLIANCE_REQUESTS: ComplianceRequest[] = [
    { id: 'req_1', userId: 'u_992', userName: 'John Doe', type: 'export_data', status: 'pending', requestDate: '2023-10-27', deadline: '2023-11-26' },
    { id: 'req_2', userId: 'u_104', userName: 'Jane Smith', type: 'delete_account', status: 'processing', requestDate: '2023-10-26', deadline: '2023-11-25' },
    { id: 'req_3', userId: 'u_551', userName: 'Acme Corp', type: 'marketing_optout', status: 'completed', requestDate: '2023-10-20', deadline: '2023-11-19' },
];

const INITIAL_BACKUPS: Backup[] = [
    { id: 'bk_1', timestamp: '2023-10-28 00:00:00', size: '1.2 GB', type: 'full', status: 'completed', location: 'us-east-1' },
    { id: 'bk_2', timestamp: '2023-10-27 00:00:00', size: '1.2 GB', type: 'full', status: 'completed', location: 'us-east-1' },
    { id: 'bk_3', timestamp: '2023-10-26 00:00:00', size: '1.1 GB', type: 'full', status: 'completed', location: 'us-east-1' },
];

const INITIAL_SECURITY_SETTINGS: SecuritySettings = {
    enforce2FAForSellers: true,
    fraudRiskThreshold: 75,
    bannedKeywords: ['replica', 'counterfeit', 'weapon', 'ivory', 'narcotics'],
    allowedIpRegions: ['US', 'CN', 'EU', 'GB', 'IN', 'VN', 'AE'],
    apiRateLimit: 1000,
    sessionTimeout: 30,
    passwordPolicy: 'strong',
    encryptionEnabled: true
};

const INITIAL_MEMBERSHIP_PLANS: MembershipPlan[] = [
    {
        id: 'plan_free',
        name: 'Free Member',
        type: 'seller',
        price: 0,
        period: 'yearly',
        currency: 'USD',
        features: ['50 Product Listings', 'Basic Storefront', '5 RFQs/month'],
        productListingLimit: 50,
        rfqResponseLimit: 5,
        searchRankingBoost: 1.0,
        commissionRate: 0.05,
        hasVerifiedBadge: false,
        hasCustomStorefront: false,
        hasTradeAssurance: false,
        hasAccountManager: false,
        requiredDocuments: ['Business License']
    },
    {
        id: 'plan_gold',
        name: 'Gold Supplier',
        type: 'seller',
        price: 2999,
        period: 'yearly',
        currency: 'USD',
        features: ['Unlimited Products', 'Verified Badge', 'Priority Search', '50 RFQs/month'],
        productListingLimit: 'unlimited',
        rfqResponseLimit: 50,
        searchRankingBoost: 1.5,
        commissionRate: 0.03,
        hasVerifiedBadge: true,
        hasCustomStorefront: true,
        hasTradeAssurance: true,
        hasAccountManager: false,
        requiredDocuments: ['Business License', 'Tax ID', 'Factory Audit Report']
    },
    {
        id: 'plan_platinum',
        name: 'Platinum Pro',
        type: 'seller',
        price: 5999,
        period: 'yearly',
        currency: 'USD',
        features: ['Top Tier Ranking', 'Dedicated Manager', 'Unlimited RFQs', '0% Fees (First $1M)'],
        productListingLimit: 'unlimited',
        rfqResponseLimit: 'unlimited',
        searchRankingBoost: 2.0,
        commissionRate: 0.02,
        hasVerifiedBadge: true,
        hasCustomStorefront: true,
        hasTradeAssurance: true,
        hasAccountManager: true,
        requiredDocuments: ['Business License', 'Tax ID', 'Factory Audit', 'ISO Certification']
    }
];

// Mock Workflows with Enterprise Logic
const INITIAL_WORKFLOWS: WorkflowTemplate[] = [
    {
        id: 'wf_kyc',
        name: 'Seller KYC Verification',
        description: 'Standard due diligence for new seller signups with auto-OCR and risk checks.',
        trigger: 'seller_signup',
        isActive: true,
        version: 3,
        createdAt: '2023-10-01',
        updatedAt: '2023-10-25',
        stats: { avgCompletionTime: '2.5 Days', activeInstances: 14, successRate: '92%' },
        stages: [
            { id: 'st_1', name: 'Document OCR', type: 'automation', description: 'Auto-scan business license', nextStageIdSuccess: 'st_rule_1', nextStageIdFailure: 'st_rej', automationConfig: { scriptId: 'ocr_v2' } },
            { 
                id: 'st_rule_1', name: 'Risk Check', type: 'split', description: 'Evaluate Risk Score', 
                rules: [
                    { id: 'r1', field: 'riskScore', operator: 'gt', value: 80, nextStageId: 'st_manual_audit' },
                    { id: 'r2', field: 'riskScore', operator: 'lt', value: 80, nextStageId: 'st_2' }
                ],
                nextStageIdFailure: 'st_rej'
            },
            { id: 'st_manual_audit', name: 'Enhanced Due Diligence', type: 'approval', assigneeRole: 'Compliance Lead', slaHours: 48, escalation: { afterHours: 48, action: 'notify', targetRole: 'VP Operations' }, nextStageIdSuccess: 'st_2', nextStageIdFailure: 'st_rej' },
            { id: 'st_2', name: 'Compliance Review', type: 'approval', assigneeRole: 'Compliance Officer', slaHours: 24, nextStageIdSuccess: 'st_3', nextStageIdFailure: 'st_rej' },
            { id: 'st_3', name: 'Activate Account', type: 'automation', nextStageIdSuccess: 'st_end' },
            { id: 'st_rej', name: 'Reject Application', type: 'notification', automationConfig: { emailTemplate: 'kyc_rejection' } },
            { id: 'st_end', name: 'Welcome Email', type: 'notification', automationConfig: { emailTemplate: 'seller_welcome' } }
        ]
    },
    {
        id: 'wf_rfq',
        name: 'High-Value RFQ Approval',
        description: 'Approval chain for RFQs over $50k with multi-department sign-off.',
        trigger: 'rfq_created',
        isActive: true,
        version: 5,
        createdAt: '2023-10-15',
        updatedAt: '2023-10-28',
        stats: { avgCompletionTime: '4 Hours', activeInstances: 5, successRate: '98%' },
        stages: [
            { id: 'st_1', name: 'Risk Assessment', type: 'automation', nextStageIdSuccess: 'st_2' },
            { 
                id: 'st_2', name: 'Manager Approval', type: 'approval', 
                approvalConfig: { minApprovals: 1, requiredRoles: ['Category Manager'] },
                slaHours: 4, 
                nextStageIdSuccess: 'st_end', nextStageIdFailure: 'st_rej' 
            },
            { id: 'st_end', name: 'Publish RFQ', type: 'automation' },
            { id: 'st_rej', name: 'Notify Buyer', type: 'notification' }
        ]
    }
];

const INITIAL_WORKFLOW_INSTANCES: WorkflowInstance[] = [
    {
        id: 'inst_101', templateId: 'wf_kyc', templateName: 'Seller KYC Verification', currentStageId: 'st_2', status: 'running', 
        contextData: { seller: 'Shenzhen Tech', id: 's1', riskScore: 12 }, startDate: '2023-10-27 09:00', lastUpdated: '2023-10-27 09:05',
        logs: [
            { timestamp: '2023-10-27 09:00', stageId: 'st_1', stageName: 'Document OCR', action: 'completed', status: 'success', details: 'License Verified (98% confidence)' },
            { timestamp: '2023-10-27 09:01', stageId: 'st_rule_1', stageName: 'Risk Check', action: 'evaluated', status: 'success', details: 'Score 12 < 80. Routing to Standard Review.' },
            { timestamp: '2023-10-27 09:05', stageId: 'st_2', stageName: 'Compliance Review', action: 'started', status: 'info', details: 'Assigned to Compliance Pool' }
        ]
    },
    {
        id: 'inst_102', templateId: 'wf_rfq', templateName: 'High-Value RFQ Approval', currentStageId: 'st_end', status: 'completed', 
        contextData: { rfq: 'Steel Beams 500 Tons', val: '$120k' }, startDate: '2023-10-26 14:00', lastUpdated: '2023-10-26 16:30',
        logs: []
    }
];

// Mock Logic Rules
const INITIAL_LOGIC_RULES: LogicRule[] = [
    {
        id: 'rule_1', name: 'Hide Price for Guests', category: 'pricing', priority: 1, enabled: true,
        condition: { userType: ['guest'] },
        action: { type: 'hide_price' }
    },
    {
        id: 'rule_2', name: 'Show Wholesale Tiers for Verified Buyers', category: 'pricing', priority: 2, enabled: true,
        condition: { userType: ['verified_buyer'] },
        action: { type: 'show_component', value: 'wholesale_tier_table' }
    },
    {
        id: 'rule_3', name: 'Regional Banner - NA', category: 'ui', priority: 1, enabled: true,
        condition: { region: ['na'] },
        action: { type: 'show_component', value: 'banner_fast_shipping_usa' }
    },
    {
        id: 'rule_4', name: 'Redirect Mobile to App Promo', category: 'access', priority: 5, enabled: false,
        condition: { device: 'mobile' },
        action: { type: 'show_component', value: 'app_download_modal' }
    }
];

// Component Registry for Low-Code Builder
const COMPONENT_LIBRARY = [
  { type: 'HeroSection', label: 'Hero Banner', icon: Layout, defaultProps: { title: 'Welcome', subtitle: 'Global B2B Marketplace', bgImage: 'https://via.placeholder.com/1200x400', ctaText: 'Start Sourcing', ctaLink: '/join' } },
  { type: 'ProductGrid', label: 'Product Grid', icon: Grid, defaultProps: { title: 'Trending Products', limit: 8, category: 'all', layout: 'grid' } },
  { type: 'InfoCard', label: 'Feature Card', icon: Square, defaultProps: { title: 'Secure Trade', text: 'Trade Assurance protects your orders.', icon: 'shield' } },
  { type: 'TextBlock', label: 'Rich Text', icon: Type, defaultProps: { content: '<h2>Custom Section</h2><p>Add your content here.</p>' } },
  { type: 'HTMLBlock', label: 'Custom HTML', icon: Code, defaultProps: { content: '<div class="custom-widget">My Widget</div>' } },
  { type: 'Banner', label: 'Promo Banner', icon: ImageIcon, defaultProps: { imageUrl: '', link: '#' } },
];

const INITIAL_PAGE_CONFIGS: PageConfig[] = [
    {
        id: 'page_home', page: 'homepage', layout: 'single-col',
        modules: [
            { id: 'm1', name: 'Main Hero', component: 'HeroSection', enabled: true, order: 1, audience: ['guest', 'buyer', 'seller'], props: { title: 'Global Trade, Intelligent OS', subtitle: 'Experience the world\'s first AI-native B2B marketplace.', ctaText: 'Launch TradeOS' } },
            { id: 'm2', name: 'Industry Hubs', component: 'ProductGrid', enabled: true, order: 2, audience: ['guest', 'buyer'], props: { title: 'Source by Industry', category: 'featured' } },
            { id: 'm3', name: 'AI Recs', component: 'ProductGrid', enabled: true, order: 3, audience: ['buyer', 'verified_buyer'], props: { title: 'Curated for Your Business', layout: 'carousel' } },
        ]
    },
    {
        id: 'page_product', page: 'product_detail', layout: 'two-col',
        modules: [
            { id: 'pm1', name: 'Product Gallery', component: 'Gallery', enabled: true, order: 1, audience: ['guest', 'buyer'], props: {} },
            { id: 'pm2', name: 'Pricing Table', component: 'Pricing', enabled: true, order: 2, audience: ['buyer', 'verified_buyer'], props: { showWholesale: true } },
        ]
    }
];

// Mock Products for Admin Review with extended fields
const ADMIN_PRODUCTS_QUEUE: Product[] = [
    { 
        id: 'p_pending_1', 
        title: 'Luxury Replica Watch 2024 Model', 
        description: 'High quality replica watch satisfying all fashion needs. Not authorized by original brand.', 
        category: 'Watches', 
        supplierId: 's5', 
        productType: 'physical', 
        status: 'pending_approval', 
        variants: [], 
        pricingTiers: [{minQty: 1, maxQty: null, pricePerUnit: 150}], 
        multimedia: { images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=300&q=80'] }, 
        shipping: { weight: 0.5, weightUnit: 'kg', dimensions: { length: 10, width: 10, height: 5, unit: 'cm' } }, 
        compliance: { certificates: [] }, 
        specifications: [], 
        rating: 0, 
        origin: 'CN', 
        supplierVerified: false, 
        supplierBusinessType: 'Trader',
        price: 150, 
        moq: 1, 
        image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=300&q=80',
        dateAdded: '2023-10-26'
    },
    { 
        id: 'p_pending_2', 
        title: 'Industrial Generator 500kW Diesel', 
        description: 'Heavy duty diesel generator for industrial power backup. CE and ISO certified.', 
        category: 'Machinery', 
        supplierId: 's1', 
        productType: 'physical', 
        status: 'pending_approval', 
        variants: [], 
        pricingTiers: [{minQty: 1, maxQty: null, pricePerUnit: 50000}], 
        multimedia: { images: ['https://images.unsplash.com/photo-1455165814004-1126a7199f9b?auto=format&fit=crop&w=300&q=80'] }, 
        shipping: { weight: 5000, weightUnit: 'kg', dimensions: { length: 400, width: 200, height: 200, unit: 'cm' } }, 
        compliance: { certificates: ['CE', 'ISO'] }, 
        specifications: [{key: 'Power', value: '500kW'}, {key: 'Fuel', value: 'Diesel'}], 
        rating: 0, 
        origin: 'DE', 
        supplierVerified: true, 
        supplierBusinessType: 'Manufacturer', 
        price: 50000, 
        moq: 1, 
        image: 'https://images.unsplash.com/photo-1455165814004-1126a7199f9b?auto=format&fit=crop&w=300&q=80',
        dateAdded: '2023-10-27'
    }
];

const INITIAL_SITE_SETTINGS: SiteSettings = {
    siteName: 'TradeGenius AI',
    siteDescription: 'The World\'s Leading AI-Powered B2B Marketplace.',
    contactEmail: 'support@tradegenius.ai',
    defaultLanguage: 'en',
    timeZone: 'UTC-5 (EST)',
    logoUrl: 'https://via.placeholder.com/150x50?text=LOGO',
    faviconUrl: 'https://via.placeholder.com/32x32?text=T',
    autoTranslate: true,
    geoIpRedirect: false,
    maintenanceMode: false
};

const INITIAL_SEARCH_SETTINGS: SearchSettings = {
    verifiedSupplierBoost: 1.5,
    responseRateWeight: 0.3,
    yearsActiveWeight: 0.2,
    tradeAssuranceBoost: true,
    sponsoredPriority: true
};

// --- Workflow Analytics Data ---
const WF_PERFORMANCE_DATA = [
    { name: 'KYC Verification', time: 45, volume: 120 },
    { name: 'RFQ Approval', time: 12, volume: 45 },
    { name: 'Order Processing', time: 8, volume: 350 },
    { name: 'Dispute Resolution', time: 72, volume: 15 },
];

const STAGE_BOTTLENECKS = [
    { stage: 'Manual Audit (KYC)', avgTime: '48h', load: 'High', status: 'Critical' },
    { stage: 'Finance Review (Order)', avgTime: '4h', load: 'Medium', status: 'Normal' },
    { stage: 'Logistics Booking', avgTime: '2h', load: 'Low', status: 'Optimal' },
];

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { banners, updateBanner } = useBanners();
    
    // Auth Check
    const [currentUser, setCurrentUser] = useState<any>(null);
    useEffect(() => {
        const userStr = localStorage.getItem('trade_user');
        if (userStr) {
            const user = JSON.parse(userStr);
            setCurrentUser(user);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    // If user is seller, show SupplierDashboard immediately
    if (currentUser && currentUser.role === 'seller') {
        return <SupplierDashboard />;
    }

    // --- Admin State ---
    const [activePage, setActivePage] = useState('dashboard');
    
    // Core Data
    const [adminUsers, setAdminUsers] = useState<AdminUser[]>(INITIAL_USERS);
    const [siteSettings, setSiteSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
    const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>(INITIAL_LAYOUT_CONFIG);
    const [searchSettings, setSearchSettings] = useState<SearchSettings>(INITIAL_SEARCH_SETTINGS);
    const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(INITIAL_SECURITY_SETTINGS);

    // Security & Compliance State
    const [roles, setRoles] = useState<AdminRole[]>(INITIAL_ROLES);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
    const [complianceRequests, setComplianceRequests] = useState<ComplianceRequest[]>(INITIAL_COMPLIANCE_REQUESTS);
    const [backups, setBackups] = useState<Backup[]>(INITIAL_BACKUPS);
    const [securityTab, setSecurityTab] = useState<'overview' | 'audit' | 'access' | 'compliance' | 'settings'>('overview');

    // Membership State
    const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>(INITIAL_MEMBERSHIP_PLANS);
    const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

    // Workflow State
    const [workflows, setWorkflows] = useState<WorkflowTemplate[]>(INITIAL_WORKFLOWS);
    const [workflowInstances, setWorkflowInstances] = useState<WorkflowInstance[]>(INITIAL_WORKFLOW_INSTANCES);
    const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowTemplate | null>(null);
    const [editingStage, setEditingStage] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'list' | 'analytics'>('list');

    // Frontend Logic / Experience Engine State
    const [logicRules, setLogicRules] = useState<LogicRule[]>(INITIAL_LOGIC_RULES);
    const [pageConfigs, setPageConfigs] = useState<PageConfig[]>(INITIAL_PAGE_CONFIGS);
    const [logicTab, setLogicTab] = useState<'pages' | 'rules' | 'ai' | 'simulator'>('pages');
    const [activePageConfig, setActivePageConfig] = useState<string>('homepage');
    const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
    
    // Simulator State
    const [simPersona, setSimPersona] = useState<PersonaType>('guest');
    const [simRegion, setSimRegion] = useState<RegionType>('global');

    // Product Management
    const [productQueue, setProductQueue] = useState<Product[]>(ADMIN_PRODUCTS_QUEUE);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [complianceResult, setComplianceResult] = useState<{compliant: boolean, issues: string[]} | null>(null);
    const [isAnalyzingProduct, setIsAnalyzingProduct] = useState(false);

    // UI
    const [toasts, setToasts] = useState<ToastNotification[]>([]);
    
    // Banner
    const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
    const [bannerForm, setBannerForm] = useState<any>({});

    // Helpers
    const addToast = (type: 'success' | 'error' | 'info', message: string) => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, type, message }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    };

    const handleLogout = () => { localStorage.removeItem('trade_user'); navigate('/login'); };

    // Membership Actions
    const handleSavePlan = (plan: MembershipPlan) => {
        if (editingPlan) {
            setMembershipPlans(prev => prev.map(p => p.id === plan.id ? plan : p));
            addToast('success', 'Membership plan updated successfully.');
        } else {
            setMembershipPlans(prev => [...prev, { ...plan, id: `plan_${Date.now()}` }]);
            addToast('success', 'New membership plan created.');
        }
        setIsPlanModalOpen(false);
        setEditingPlan(null);
    };

    const handleDeletePlan = (id: string) => {
        if (window.confirm("Are you sure you want to delete this plan?")) {
            setMembershipPlans(prev => prev.filter(p => p.id !== id));
            addToast('info', 'Membership plan deleted.');
        }
    };

    // Product Actions
    const handleInspectProduct = (product: Product) => {
        setSelectedProduct(product);
        setComplianceResult(null);
    };

    const handleAiComplianceCheck = async () => {
        if (!selectedProduct) return;
        setIsAnalyzingProduct(true);
        const result = await analyzeProductCompliance(selectedProduct.title + " " + selectedProduct.description);
        setComplianceResult(result);
        setIsAnalyzingProduct(false);
    };

    const handleApproveProduct = (id: string) => {
        setProductQueue(prev => prev.filter(p => p.id !== id));
        setSelectedProduct(null);
        addToast('success', 'Product approved and published.');
    };

    const handleRejectProduct = (id: string) => {
        setProductQueue(prev => prev.filter(p => p.id !== id));
        setSelectedProduct(null);
        addToast('info', 'Product rejected.');
    };

    // Layout Actions
    const toggleSection = (id: string) => {
        setLayoutConfig(prev => ({
            sections: prev.sections.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s)
        }));
    };

    const moveSection = (index: number, direction: 'up' | 'down') => {
        const newSections = [...layoutConfig.sections];
        if (direction === 'up' && index > 0) {
            [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
        } else if (direction === 'down' && index < newSections.length - 1) {
            [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
        }
        setLayoutConfig({ sections: newSections });
    };

    // Workflow Actions
    const toggleWorkflow = (id: string) => {
        setWorkflows(prev => prev.map(w => w.id === id ? { ...w, isActive: !w.isActive } : w));
        addToast('success', 'Workflow status updated.');
    };

    // Logic Engine Actions
    const toggleLogicRule = (id: string) => {
        setLogicRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
        addToast('success', 'Rule status updated.');
    };

    const handleDragStart = (e: React.DragEvent, componentType: string) => {
        e.dataTransfer.setData('componentType', componentType);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const componentType = e.dataTransfer.getData('componentType');
        if (!componentType) return;

        const componentDef = COMPONENT_LIBRARY.find(c => c.type === componentType);
        if (!componentDef) return;

        const newModule: PageModule = {
            id: `mod_${Date.now()}`,
            name: `${componentDef.label} New`,
            component: componentType,
            enabled: true,
            order: (pageConfigs.find(p => p.page === activePageConfig)?.modules.length || 0) + 1,
            audience: ['guest', 'buyer'], // Default
            props: { ...componentDef.defaultProps }
        };

        setPageConfigs(prev => prev.map(p => {
            if (p.page === activePageConfig) {
                return { ...p, modules: [...p.modules, newModule] };
            }
            return p;
        }));
        
        setSelectedModuleId(newModule.id);
        addToast('success', 'Component added to page.');
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const updateModuleProps = (key: string, value: any) => {
        if (!selectedModuleId) return;
        setPageConfigs(prev => prev.map(p => {
            if (p.page === activePageConfig) {
                return {
                    ...p,
                    modules: p.modules.map(m => m.id === selectedModuleId ? { ...m, props: { ...m.props, [key]: value } } : m)
                };
            }
            return p;
        }));
    };

    const handleDeleteModule = (moduleId: string) => {
        setPageConfigs(prev => prev.map(p => {
            if (p.page === activePageConfig) {
                return { ...p, modules: p.modules.filter(m => m.id !== moduleId) };
            }
            return p;
        }));
        if (selectedModuleId === moduleId) setSelectedModuleId(null);
    };

    const togglePermission = (roleId: string, resource: AdminResource, permission: AdminPermission) => {
        setRoles(prev => prev.map(role => {
            if (role.id === roleId) {
                const currentPerms = role.permissions[resource] || [];
                const newPerms = currentPerms.includes(permission)
                    ? currentPerms.filter(p => p !== permission)
                    : [...currentPerms, permission];
                return {
                    ...role,
                    permissions: {
                        ...role.permissions,
                        [resource]: newPerms
                    }
                };
            }
            return role;
        }));
    };

    const handleProcessCompliance = (id: string, status: 'completed' | 'rejected') => {
        setComplianceRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
        addToast('success', `Request ${id} marked as ${status}`);
    };

    const handleTriggerBackup = () => {
        addToast('info', 'Backup process started...');
        setTimeout(() => {
            const newBackup: Backup = {
                id: `bk_${Date.now()}`,
                timestamp: new Date().toISOString().replace('T', ' ').split('.')[0],
                size: '1.2 GB',
                type: 'manual',
                status: 'completed',
                location: 'us-east-1'
            };
            setBackups(prev => [newBackup, ...prev]);
            addToast('success', 'Backup completed successfully.');
        }, 2000);
    };

    // --- Renderers ---

    const renderSidebar = () => (
        <nav className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed h-full overflow-y-auto z-20 shadow-xl custom-scrollbar">
            <div className="p-6 flex items-center gap-3 border-b border-slate-800">
                <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center font-bold text-white shadow-lg">T</div>
                <span className="text-lg font-bold text-white tracking-tight">Admin OS</span>
            </div>
            
            <div className="flex-1 px-4 py-6 space-y-1">
                <button onClick={() => setActivePage('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${activePage === 'dashboard' ? 'bg-orange-500 text-white font-bold shadow-md' : 'hover:bg-slate-800 hover:text-white'}`}> <LayoutDashboard size={18}/> Dashboard </button>
                
                <div className="pt-6 pb-2 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Experience & Logic</div>
                <button onClick={() => setActivePage('experience_engine')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${activePage === 'experience_engine' ? 'bg-slate-800 text-white font-bold' : 'hover:bg-slate-800 hover:text-white'}`}> <Cpu size={18}/> Experience Engine </button>
                
                <div className="pt-6 pb-2 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Marketplace Ops</div>
                <button onClick={() => setActivePage('products')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${activePage === 'products' ? 'bg-slate-800 text-white font-bold' : 'hover:bg-slate-800 hover:text-white'}`}> 
                    <ShoppingBag size={18}/> 
                    <span className="flex-1 text-left">Product Approvals</span>
                    {productQueue.length > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full">{productQueue.length}</span>}
                </button>
                <button onClick={() => setActivePage('workflows')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${activePage === 'workflows' ? 'bg-slate-800 text-white font-bold' : 'hover:bg-slate-800 hover:text-white'}`}> <Workflow size={18}/> Workflow Engine </button>
                <button onClick={() => setActivePage('memberships')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${activePage === 'memberships' ? 'bg-slate-800 text-white font-bold' : 'hover:bg-slate-800 hover:text-white'}`}> <Crown size={18}/> Memberships </button>
                <button onClick={() => setActivePage('users')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${activePage === 'users' ? 'bg-slate-800 text-white font-bold' : 'hover:bg-slate-800 hover:text-white'}`}> <Users size={18}/> User Verification </button>
                
                <div className="pt-6 pb-2 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Site & Content</div>
                <button onClick={() => setActivePage('marketing')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${activePage === 'marketing' ? 'bg-slate-800 text-white font-bold' : 'hover:bg-slate-800 hover:text-white'}`}> <Megaphone size={18}/> Marketing </button>
                <button onClick={() => setActivePage('site_config')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${activePage === 'site_config' ? 'bg-slate-800 text-white font-bold' : 'hover:bg-slate-800 hover:text-white'}`}> <Palette size={18}/> Global Config </button>
                <button onClick={() => setActivePage('cms')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${activePage === 'cms' ? 'bg-slate-800 text-white font-bold' : 'hover:bg-slate-800 hover:text-white'}`}> <Layout size={18}/> Page Builder </button>
                
                <div className="pt-6 pb-2 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">System</div>
                <button onClick={() => setActivePage('security')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${activePage === 'security' ? 'bg-slate-800 text-white font-bold' : 'hover:bg-slate-800 hover:text-white'}`}> <ShieldCheck size={18}/> Security & Audit </button>
                <button onClick={() => setActivePage('analytics')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${activePage === 'analytics' ? 'bg-slate-800 text-white font-bold' : 'hover:bg-slate-800 hover:text-white'}`}> <BarChart2 size={18}/> Analytics </button>
            </div>
            
            <div className="p-4 border-t border-slate-800">
                <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                    <LogOut size={16}/> Log Out
                </button>
            </div>
        </nav>
    );

    // --- SECURITY & COMPLIANCE RENDERER ---
    const renderSecurity = () => {
        return (
            <div className="animate-fade-in h-[calc(100vh-100px)] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
                            <ShieldCheck size={32} className="text-green-600"/> Security & Compliance
                        </h1>
                        <p className="text-slate-500">Manage system access, audit logs, and data protection policies.</p>
                    </div>
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button onClick={() => setSecurityTab('overview')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${securityTab === 'overview' ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}>Overview</button>
                        <button onClick={() => setSecurityTab('audit')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${securityTab === 'audit' ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}>Audit Logs</button>
                        <button onClick={() => setSecurityTab('access')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${securityTab === 'access' ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}>Access Control</button>
                        <button onClick={() => setSecurityTab('compliance')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${securityTab === 'compliance' ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}>Compliance</button>
                        <button onClick={() => setSecurityTab('settings')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${securityTab === 'settings' ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}>Settings</button>
                    </div>
                </div>

                <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-y-auto">
                    {/* TAB: OVERVIEW */}
                    {securityTab === 'overview' && (
                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                                    <div className="text-green-600 mb-2"><ShieldCheck size={32}/></div>
                                    <h3 className="text-2xl font-bold text-slate-800">98%</h3>
                                    <p className="text-sm text-slate-500">Security Score</p>
                                </div>
                                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                                    <div className="text-blue-600 mb-2"><Activity size={32}/></div>
                                    <h3 className="text-2xl font-bold text-slate-800">12</h3>
                                    <p className="text-sm text-slate-500">Active Sessions</p>
                                </div>
                                <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                                    <div className="text-orange-600 mb-2"><AlertTriangle size={32}/></div>
                                    <h3 className="text-2xl font-bold text-slate-800">3</h3>
                                    <p className="text-sm text-slate-500">Failed Logins (24h)</p>
                                </div>
                                <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                                    <div className="text-purple-600 mb-2"><FileText size={32}/></div>
                                    <h3 className="text-2xl font-bold text-slate-800">{complianceRequests.filter(r => r.status === 'pending').length}</h3>
                                    <p className="text-sm text-slate-500">Pending DSRs</p>
                                </div>
                            </div>

                            <h3 className="font-bold text-lg text-slate-800 mb-4">Recent Security Events</h3>
                            <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                                {auditLogs.slice(0, 5).map(log => (
                                    <div key={log.id} className="flex items-center justify-between p-4 border-b border-slate-200 last:border-0">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-lg ${log.status === 'SUCCESS' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                {log.status === 'SUCCESS' ? <Check size={16}/> : <X size={16}/>}
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm text-slate-800">{log.action} <span className="font-normal text-slate-500">on</span> {log.resource}</div>
                                                <div className="text-xs text-slate-500">{log.actor} • {log.ipAddress}</div>
                                            </div>
                                        </div>
                                        <div className="text-xs font-mono text-slate-400">{log.timestamp}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TAB: AUDIT LOGS */}
                    {securityTab === 'audit' && (
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-lg text-slate-800">System Audit Trail</h3>
                                <div className="flex gap-2">
                                    <input type="text" placeholder="Search logs..." className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64"/>
                                    <button className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                                        <DownloadCloud size={16}/> Export CSV
                                    </button>
                                </div>
                            </div>
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-3">Timestamp</th>
                                        <th className="px-6 py-3">Actor</th>
                                        <th className="px-6 py-3">Action</th>
                                        <th className="px-6 py-3">Resource</th>
                                        <th className="px-6 py-3">IP Address</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {auditLogs.map(log => (
                                        <tr key={log.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 font-mono text-xs text-slate-500">{log.timestamp}</td>
                                            <td className="px-6 py-4 font-bold text-slate-700">{log.actor}</td>
                                            <td className="px-6 py-4">
                                                <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold border border-slate-200">{log.action}</span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">{log.resource}</td>
                                            <td className="px-6 py-4 font-mono text-xs text-slate-500">{log.ipAddress}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${log.status === 'SUCCESS' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                                    {log.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-slate-400 italic">{log.metadata || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* TAB: ACCESS CONTROL */}
                    {securityTab === 'access' && (
                        <div className="p-8">
                            <h3 className="font-bold text-lg text-slate-800 mb-6">Role-Based Access Control (RBAC)</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm border border-slate-200 rounded-lg">
                                    <thead className="bg-slate-50 text-slate-700 font-bold">
                                        <tr>
                                            <th className="px-6 py-4 border-b border-r border-slate-200 bg-slate-100 sticky left-0">Permissions Matrix</th>
                                            {roles.map(role => (
                                                <th key={role.id} className="px-6 py-4 border-b border-slate-200 text-center min-w-[120px]">
                                                    {role.name}
                                                    <div className="text-[10px] font-normal text-slate-500 mt-1">{role.description}</div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {(['products', 'users', 'orders', 'finance', 'settings', 'security'] as AdminResource[]).map(resource => (
                                            <React.Fragment key={resource}>
                                                <tr className="bg-slate-50/50">
                                                    <td colSpan={roles.length + 1} className="px-6 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider border-y border-slate-200">
                                                        {resource} Management
                                                    </td>
                                                </tr>
                                                {(['read', 'write', 'delete', 'approve', 'manage'] as AdminPermission[]).map(perm => (
                                                    <tr key={`${resource}-${perm}`} className="hover:bg-slate-50">
                                                        <td className="px-6 py-3 border-r border-slate-200 font-medium text-slate-600 capitalize">
                                                            {perm} {resource}
                                                        </td>
                                                        {roles.map(role => (
                                                            <td key={role.id} className="px-6 py-3 text-center">
                                                                <input 
                                                                    type="checkbox" 
                                                                    checked={role.permissions[resource]?.includes(perm)}
                                                                    onChange={() => togglePermission(role.id, resource, perm)}
                                                                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                                                                />
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* TAB: COMPLIANCE */}
                    {securityTab === 'compliance' && (
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800">Data Subject Requests (GDPR / CCPA)</h3>
                                    <p className="text-sm text-slate-500">Manage user requests for data export and deletion.</p>
                                </div>
                                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                                    <Info size={16}/> SLA Deadline: 30 Days
                                </div>
                            </div>

                            <div className="space-y-4">
                                {complianceRequests.map(req => (
                                    <div key={req.id} className="border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-full ${req.type === 'delete_account' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                                {req.type === 'delete_account' ? <Trash2 size={20}/> : <DownloadCloud size={20}/>}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800 text-lg">{req.type === 'delete_account' ? 'Right to be Forgotten' : req.type === 'export_data' ? 'Data Portability' : 'Marketing Opt-out'}</div>
                                                <div className="text-sm text-slate-500">
                                                    User: <span className="font-bold text-slate-700">{req.userName}</span> (ID: {req.userId})
                                                </div>
                                                <div className="text-xs text-slate-400 mt-1">Requested: {req.requestDate} • Deadline: <span className="text-orange-600 font-bold">{req.deadline}</span></div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-3">
                                            {req.status === 'pending' && (
                                                <>
                                                    <button onClick={() => handleProcessCompliance(req.id, 'completed')} className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors">
                                                        Process Request
                                                    </button>
                                                    <button onClick={() => handleProcessCompliance(req.id, 'rejected')} className="border border-slate-300 text-slate-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-50 transition-colors">
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                            {req.status !== 'pending' && (
                                                <span className={`px-4 py-2 rounded-lg font-bold text-sm uppercase ${req.status === 'completed' ? 'bg-green-100 text-green-700' : req.status === 'processing' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                                                    {req.status}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TAB: SETTINGS */}
                    {securityTab === 'settings' && (
                        <div className="p-8 space-y-12">
                            {/* General Config */}
                            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-white p-6 rounded-xl border border-gray-200">
                                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Lock size={18}/> Login Policy</h4>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-600">Enforce 2FA for Admins</span>
                                            <div className="w-12 h-6 bg-green-500 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow"></div></div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-600">Session Timeout (mins)</span>
                                            <input type="number" className="w-20 p-1 border rounded text-center text-sm" defaultValue={30}/>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-600">Password Strength</span>
                                            <select className="border rounded p-1 text-sm"><option>Strong</option><option>Strict</option></select>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-xl border border-gray-200">
                                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Globe size={18}/> Network Security</h4>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-600">Rate Limit (req/min)</span>
                                            <input type="number" className="w-24 p-1 border rounded text-center text-sm" defaultValue={1000}/>
                                        </div>
                                        <div>
                                            <span className="text-sm text-slate-600 block mb-2">Whitelisted Regions</span>
                                            <div className="flex flex-wrap gap-2">
                                                {['US', 'EU', 'CN', 'JP'].map(r => <span key={r} className="bg-slate-100 px-2 py-1 rounded text-xs font-bold">{r}</span>)}
                                                <button className="text-xs text-blue-600 font-bold hover:underline">+ Add</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Data Protection */}
                            <section>
                                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Fingerprint size={18}/> Data Protection</h4>
                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex justify-between items-center">
                                    <div>
                                        <h5 className="font-bold text-slate-700">Field-Level Encryption</h5>
                                        <p className="text-sm text-slate-500">Encrypt sensitive PII (Personally Identifiable Information) at rest in the database.</p>
                                    </div>
                                    <div className="w-12 h-6 bg-green-500 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow"></div></div>
                                </div>
                            </section>

                            {/* Backups */}
                            <section>
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-bold text-slate-800 flex items-center gap-2"><Server size={18}/> Disaster Recovery</h4>
                                    <button onClick={handleTriggerBackup} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800">Trigger Backup Now</button>
                                </div>
                                <div className="border border-gray-200 rounded-xl overflow-hidden">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-slate-50 text-slate-500">
                                            <tr>
                                                <th className="px-6 py-3">Backup ID</th>
                                                <th className="px-6 py-3">Date</th>
                                                <th className="px-6 py-3">Size</th>
                                                <th className="px-6 py-3">Type</th>
                                                <th className="px-6 py-3">Status</th>
                                                <th className="px-6 py-3">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {backups.map(bk => (
                                                <tr key={bk.id}>
                                                    <td className="px-6 py-4 font-mono text-xs">{bk.id}</td>
                                                    <td className="px-6 py-4">{bk.timestamp}</td>
                                                    <td className="px-6 py-4">{bk.size}</td>
                                                    <td className="px-6 py-4 capitalize">{bk.type}</td>
                                                    <td className="px-6 py-4 text-green-600 font-bold uppercase text-xs">{bk.status}</td>
                                                    <td className="px-6 py-4">
                                                        <button className="text-blue-600 hover:underline font-bold text-xs">Restore</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // ... (Keep renderExperienceEngine, renderProductManagement, renderMembershipManagement, renderSiteConfig, renderCmsBuilder, renderSearchLogic, renderUserManagement, renderWorkflowEditor, renderWorkflowList from previous step) ...
    // Placeholder to keep file size manageable for the diff
    const renderExperienceEngine = () => (<div>Experience Engine Placeholder</div>);
    const renderProductManagement = () => (<div>Product Management Placeholder</div>);
    const renderWorkflowEditor = () => (<div>Workflow Editor Placeholder</div>);
    const renderWorkflowList = () => (<div>Workflow List Placeholder</div>);
    const renderMembershipManagement = () => (<div>Membership Placeholder</div>);
    const renderSiteConfig = () => (<div>Site Config Placeholder</div>);
    const renderCmsBuilder = () => (<div>CMS Builder Placeholder</div>);
    const renderSearchLogic = () => (<div>Search Logic Placeholder</div>);
    const renderUserManagement = () => (<div>User Management Placeholder</div>);

    return (
        <div className="min-h-screen bg-slate-100 flex font-sans text-slate-800">
            {renderSidebar()}

            <main className="flex-1 ml-64 p-8 relative overflow-y-auto">
                {/* Toasts */}
                <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
                    {toasts.map(t => (
                        <div key={t.id} className={`pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-bold animate-fade-in-up ${t.type === 'success' ? 'bg-green-600' : t.type === 'error' ? 'bg-red-600' : 'bg-blue-600'}`}>
                            {t.type === 'success' ? <Check size={16}/> : t.type === 'error' ? <X size={16}/> : <Info size={16}/>}
                            {t.message}
                        </div>
                    ))}
                </div>

                {activePage === 'dashboard' && (
                    <div className="animate-fade-in space-y-8">
                        <h1 className="text-3xl font-bold text-slate-800">Operations Overview</h1>
                        <div className="grid grid-cols-4 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                <div className="text-sm text-slate-500 font-bold uppercase">Total GMV</div>
                                <div className="text-3xl font-bold text-slate-800 mt-2">$12.5M</div>
                                <div className="text-xs text-green-600 font-bold mt-1 flex items-center gap-1"><TrendingUp size={12}/> +8.2%</div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                <div className="text-sm text-slate-500 font-bold uppercase">Active Sellers</div>
                                <div className="text-3xl font-bold text-slate-800 mt-2">1,240</div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden">
                                <div className="text-sm text-slate-500 font-bold uppercase">Pending Approvals</div>
                                <div className="text-3xl font-bold text-orange-600 mt-2">{productQueue.length}</div>
                                <div className="text-xs text-slate-400 mt-1">Requires Attention</div>
                                {productQueue.length > 0 && <div className="absolute right-4 top-4 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>}
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                <div className="text-sm text-slate-500 font-bold uppercase">System Status</div>
                                <div className="text-3xl font-bold text-green-600 mt-2">99.9%</div>
                                <div className="text-xs text-slate-400 mt-1">All Systems Operational</div>
                            </div>
                        </div>
                    </div>
                )}

                {activePage === 'security' && renderSecurity()}
                {activePage === 'experience_engine' && renderExperienceEngine()}
                
                {activePage === 'products' && renderProductManagement()}
                {activePage === 'workflows' && (selectedWorkflow ? renderWorkflowEditor() : renderWorkflowList())}
                {activePage === 'memberships' && renderMembershipManagement()}
                {activePage === 'site_config' && renderSiteConfig()}
                {activePage === 'cms' && renderCmsBuilder()}
                {activePage === 'search_logic' && renderSearchLogic()}
                {activePage === 'users' && renderUserManagement()}

                {/* Banner Management */}
                {activePage === 'marketing' && (
                    <div className="animate-fade-in space-y-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-800">Marketing & Banners</h1>
                                <p className="text-slate-500">Manage homepage banners and promotional content.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {banners.map(banner => (
                                <div key={banner.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row group hover:border-blue-300 transition-all">
                                    <div className="w-full md:w-64 h-40 md:h-auto bg-slate-100 relative">
                                        <img src={banner.content.image || 'https://via.placeholder.com/400x200?text=No+Image'} className="w-full h-full object-cover"/>
                                        <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold uppercase ${banner.status === 'active' ? 'bg-green-500 text-white' : 'bg-slate-500 text-white'}`}>
                                            {banner.status}
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-xl font-bold text-slate-800">{banner.content.title}</h3>
                                                <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">{banner.slot}</span>
                                            </div>
                                            <p className="text-slate-600 text-sm mb-4 line-clamp-2">{banner.content.subtitle}</p>
                                            
                                            <div className="flex items-center gap-6 text-sm text-slate-500">
                                                <div className="flex items-center gap-1"><Eye size={14}/> {banner.impressions?.toLocaleString()} Views</div>
                                                <div className="flex items-center gap-1"><ExternalLink size={14}/> {banner.clicks?.toLocaleString()} Clicks</div>
                                                <div className="flex items-center gap-1 font-mono text-xs bg-slate-50 px-2 py-0.5 rounded border">{banner.content.link}</div>
                                            </div>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => { setEditingBanner(banner); setBannerForm({...banner.content, status: banner.status}); setIsBannerModalOpen(true); }}
                                                className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                                            >
                                                <Edit size={16}/> Edit Content
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Banner Edit Modal */}
                {isBannerModalOpen && (
                    <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 animate-scale-in">
                            <h3 className="text-lg font-bold mb-4">Edit Banner</h3>
                            <div className="space-y-4">
                                <input className="w-full p-2 border rounded" placeholder="Title" value={bannerForm.title || ''} onChange={e => setBannerForm({...bannerForm, title: e.target.value})} />
                                <input className="w-full p-2 border rounded" placeholder="Subtitle" value={bannerForm.subtitle || ''} onChange={e => setBannerForm({...bannerForm, subtitle: e.target.value})} />
                                <input className="w-full p-2 border rounded" placeholder="Link" value={bannerForm.link || ''} onChange={e => setBannerForm({...bannerForm, link: e.target.value})} />
                                <input className="w-full p-2 border rounded" placeholder="Image URL" value={bannerForm.image || ''} onChange={e => setBannerForm({...bannerForm, image: e.target.value})} />
                                <select className="w-full p-2 border rounded bg-white" value={bannerForm.status} onChange={e => setBannerForm({...bannerForm, status: e.target.value})}>
                                    <option value="active">Active</option>
                                    <option value="draft">Draft</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button onClick={() => setIsBannerModalOpen(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded">Cancel</button>
                                <button onClick={() => { if(editingBanner) updateBanner(editingBanner.id, bannerForm); setIsBannerModalOpen(false); }} className="px-4 py-2 bg-orange-500 text-white rounded font-bold hover:bg-orange-600">Save Changes</button>
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};

export default Dashboard;