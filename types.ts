
import type { ElementType } from 'react';

export type ProductType = 'physical' | 'digital' | 'service';
export type ProductStatus = 'draft' | 'pending_approval' | 'active' | 'rejected' | 'archived' | 'out-of-stock';

// --- New Detailed Product Sub-Interfaces ---

export interface ProductVariant {
  id: string;
  sku: string;
  attributes: Record<string, string>; // e.g., { "Color": "Red", "Size": "XL" }
  price: number;
  stock: number;
  image?: string; // Specific image for this variant
}

export interface Multimedia {
  images: string[];
  videos?: string[];
  threeDModel?: string;
}

export interface ShippingDetails {
  weight: number; // in kg
  weightUnit: 'kg' | 'g';
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'in';
  };
  hsCode?: string; // Harmonized System code
  shippingTemplateId?: string;
}

export interface ComplianceInfo {
  certificates: string[]; // e.g., ["CE", "RoHS"]
  upc?: string;
  ean?: string;
}

export interface Specification {
    key: string;
    value: string;
}

// --- Main Expanded Product Interface ---

export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  supplierId: string;
  
  // Core Data
  productType: ProductType;
  status: ProductStatus;
  
  // Variants & Pricing
  variants: ProductVariant[];
  pricingTiers: PricingTier[]; // MOQ-based pricing
  samplePrice?: number;
  
  // Media & Specs
  multimedia: Multimedia;
  specifications: Specification[];
  
  // Logistics & Compliance
  shipping: ShippingDetails;
  compliance: ComplianceInfo;
  
  // Marketplace Data
  rating: number;
  origin: string;
  supplierVerified: boolean;
  supplierBusinessType: string;
  views?: number;
  inquiries?: number;
  dateAdded?: string;
  lastModified?: string;
  
  // AI & Admin
  aiRiskScore?: number;
  listingQualityScore?: number;

  // Deprecated fields for gradual migration (if needed)
  price: number; // Now part of variants
  moq: number; // Should be derived from pricingTiers
  image: string; // Now part of multimedia
  stock?: number;
}


export interface Banner {
  id: string;
  name: string; // For admin identification e.g., "Homepage Trade Assurance"
  slot: 'company' | 'product_showcase_1' | 'product_showcase_2' | 'promotion' | string;
  status: 'active' | 'draft' | 'archived';
  impressions?: number;
  clicks?: number;
  content: {
    title: string;
    subtitle: string;
    link: string;
    buttonText?: string;
    image?: string; // Main image or background
  };
  config?: {
    bgColor?: string; // e.g., 'bg-slate-800'
    bgGradient?: string; // e.g., 'from-orange-500 to-red-500'
  };
}

export interface PricingTier {
  minQty: number;
  maxQty: number | null;
  pricePerUnit: number;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  helpfulCount: number;
}

export interface SupplierProfileDetails {
  id: string;
  name: string;
  country: string;
  verified: boolean;
  yearsActive: number;
  responseRate: string;
  logo: string;
  mainProducts: string[];
  bannerImage: string;
  businessType: string[];
  totalEmployees: string;
  totalRevenue: string;
  certs: string[];
  detailedCerts: Certificate[];
  factoryImages: string[];
  factoryVideo?: string;
  mainMarkets: { region: string; percentage: number }[];
  capabilities: { label: string; score: number }[];
  aboutUs: string;
}

export interface Certificate {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  image: string;
}

export interface UserProfile {
  id: string;
  name: string;
  companyName: string;
  role: string;
  avatar: string;
  email: string;
  phone: string;
  sourcingCategories: string[];
  memberSince: string;
  level: string;
}

export interface PaymentMethod {
    id: string;
    type: 'Visa' | 'MasterCard' | 'Amex';
    last4: string;
    expiry: string;
    isDefault: boolean;
}

// --- REGISTRATION SCHEMAS ---

export interface BuyerRegistration {
  role: 'buyer';
  account: {
    email: string;
    password_hash?: string;
    phone: string;
    full_name: string;
  };
  profile: {
    sourcing_interests: string[];
    sourcing_volume: string;
    shipping_country: string;
  };
  company_info?: {
    name: string;
    tax_id: string;
    business_license_url?: string;
  };
}

export interface SellerRegistration {
  role: 'seller';
  account: {
    email: string;
    phone: string;
    contact_person: string;
    password_hash?: string;
  };
  business_entity: {
    legal_name: string;
    reg_number: string;
    tax_id: string;
    type: string; // Manufacturer, Trading Company
    year_est: number;
    website?: string;
  };
  operations: {
    categories: string[];
    factory_location: string;
    moq_range: number;
    lead_time_days: number;
  };
  compliance_docs: {
    business_license?: File | null;
    tax_cert?: File | null;
    id_proof?: File | null;
    bank_statement?: File | null;
  };
}

export interface FranchiseRegistration {
  role: 'partner';
  applicant: {
    full_name: string;
    email: string;
    phone: string;
    current_role: string;
  };
  proposal: {
    target_territory: string;
    warehouse_space: string;
    investment_budget: string;
  };
  documents: {
    proof_of_funds?: File | null;
    company_profile?: File | null;
  };
}

// --- Dashboard Types ---
export type UserRole = 'admin' | 'developer' | 'buyer' | 'seller';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string; // "Administrator" | "Content Moderator" | "Support Agent"
  status: 'Active' | 'Inactive' | 'Pending' | 'Banned';
  country: string;
  joinDate: string;
  lastLogin: string;
  isVerified: boolean;
  avatar?: string;
}

export interface Rule {
  id: string;
  name: string;
  description: string;
  condition: string; // Simplified for UI
  action: string; // Simplified for UI
  status: 'active' | 'paused';
  lastTriggered?: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  type: 'buyer' | 'seller';
  price: number;
  period: 'monthly' | 'yearly';
  currency: string;
  features: string[]; // Display features strings
  
  // Technical Limits & Boosts
  productListingLimit: number | 'unlimited'; // -1 for unlimited
  rfqResponseLimit: number | 'unlimited';
  subAccountLimit?: number;
  searchRankingBoost: number; // 1.0 = normal, 1.5 = +50%, 2.0 = +100%
  commissionRate: number; // Percentage, e.g., 0.05 for 5%
  
  // Capabilities
  hasVerifiedBadge: boolean;
  hasCustomStorefront: boolean;
  hasTradeAssurance: boolean;
  hasAccountManager: boolean;
  hasFactoryVR?: boolean;
  hasAdvancedAnalytics?: boolean;
  
  // Verification Requirements
  requiredDocuments: string[]; // e.g. ['Business License', 'Tax ID', 'Factory Audit']
}

// Enhanced for Granular RBAC
export type AdminPermission = 'read' | 'write' | 'delete' | 'approve' | 'manage';
export type AdminResource = 'products' | 'users' | 'orders' | 'finance' | 'settings' | 'security';

export interface AdminRole {
  id: string;
  name: string;
  description: string;
  permissions: Record<AdminResource, AdminPermission[]>; // e.g. { products: ['read', 'write'], users: ['read'] }
}

export interface PageSetting {
  id: string;
  name: string;
  path: string;
  enabled: boolean;
  templateId?: string; // Linked to Template definition
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
}

export interface CategoryHomePageSettings {
  showHero: boolean;
  showStatsChart: boolean;
  showFeaturedSuppliers: boolean;
  showTrendingProducts: boolean;
  showHowItWorks: boolean;
}

export interface MainCategory {
  id: string;
  name: string;
  icon: ElementType;
  description: string;
  image: string;
  stats: {
    suppliers: string;
    products: string;
  };
}

export interface CategoryMedia {
    id: string;
    name: string;
    icon: string; // URL or identifier for an icon component
    image: string; // URL
    coverImage: string; // URL
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  orderId: string;
  carrier: string;
  origin: string;
  destination: string;
  status: string;
  eta: string;
  type: string;
  weight: string;
}

export interface LogisticsQuote {
    // Add fields if needed
}

export interface LogisticsFleet {
    // Add fields if needed
}

export interface FranchisePartner {
  id: string;
  name: string;
  email: string;
  storeName: string;
  region: string;
  status: string;
  totalSales: number;
  commissionRate: number;
  joinedDate: string;
}

export interface FranchiseProduct {
    // Add fields if needed
}

export interface Invoice {
    // Add fields if needed
}

export interface BusinessListing {
  id: string;
  title: string;
  type: string;
  industry: string;
  location: string;
  askingPrice: number;
  reportedRevenue: number;
  ebitda: number;
  description: string;
  status: string;
  isFeatured: boolean;
  postedDate: string;
  image: string;
}

export interface InvestorProfile {
    // Add fields if needed
}

export interface EventRequest {
    // Add fields if needed
}

export interface EventListing {
  id: string;
  title: string;
  organizer: string;
  type: string;
  location: string;
  date: string;
  bannerImage: string;
  isPromoted: boolean;
  status: string;
  attendeesCount: number;
}

export interface AdminProduct {
  id: string;
  title: string;
  supplier: string;
  category: string;
  price: number; // Represents base price or range
  status: ProductStatus;
  aiRiskScore: number;
  productType: ProductType;
}

export interface AdminBooking {
    id: string;
    serviceName: string;
    buyerName: string;
    date: string;
    status: 'confirmed' | 'pending' | 'cancelled';
    price: number;
    supplier: string;
}

export interface ContentReport {
    // Add fields if needed
}

export interface InsurancePolicy {
  id: string;
  holder: string;
  type: string;
  amount: number;
  premium: number;
  status: string;
}

export interface InsuranceClaim {
    // Add fields if needed
}

export interface CPDProject {
  id: string;
  title: string;
  client: string;
  stage: string;
  status: string;
  ndaSigned: boolean;
}

export interface VerificationRequest {
  id: string;
  supplierName: string;
  docType: string;
  date: string;
  status: string;
}

export interface DisputeCase {
  id: string;
  orderId: string;
  claimant: string;
  respondent: string;
  amount: number;
  reason: string;
  status: string;
  date: string;
}

export interface RFQ {
  id: string;
  product: string;
  qty: number;
  buyer: string;
  status: string;
  quotes: number;
  budget: number;
}

export interface Order {
  id: string;
  buyer: string;
  supplier: string;
  total: number;
  status: string;
  date: string;
}

export interface DeveloperLog {
    // Add fields if needed
}

export interface FeatureFlag {
    // Add fields if needed
}

export interface TrackingEvent {
  date: string;
  location: string;
  status: string;
  description: string;
  icon: string;
}

export interface LogisticsOption {
  mode: string;
  transitTime: string;
  costEstimate: string;
  riskFactor: string;
  carbonFootprint: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  type: string;
  salaryRange: string;
  postedDate: string;
  description: string;
  applicantsCount: number;
  isPromoted: boolean;
}

export interface HiringCompany {
  id: string;
  name: string;
  logo: string;
  industry: string;
  location: string;
  activeJobs: number;
  rating: number;
  verified: boolean;
  description: string;
}

export interface Supplier {
  id: string;
  name: string;
  country: string;
  verified: boolean;
  yearsActive: number;
  rating: number;
  reviews: number;
  mainProducts: string[];
  badges: string[];
  responseRate: string;
  totalRevenue: string;
  isPromoted: boolean;
  logo: string;
  banner: string;
  businessType: string[];
}

export interface BuyerVerificationRequest {
  id: string;
  buyerName: string;
  buyerCompany: string;
  country: string;
  requestDate: string;
  status: 'pending' | 'verified' | 'rejected';
  documents: { type: string; url: string; status: string }[];
  annualPurchasingVolume: string;
  creditScore?: number;
  aiRiskAnalysis?: {
      riskLevel: string;
      score: number;
      reason: string;
  };
}

// --- CMS Types ---

export type CmsStatus = 'published' | 'draft' | 'archived';

export interface CmsPage {
    id: string;
    title: string;
    slug: string;
    content: string; // Markdown or HTML
    status: CmsStatus;
    lastModified: string;
    seoTitle: string;
    seoDescription: string;
}

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string;
    author: string;
    category: string;
    tags: string[];
    status: CmsStatus;
    publishDate: string;
    featuredImage: string;
}

export interface FaqItem {
    id: string;
    question: string;
    answer: string;
    category: string;
    views: number;
}

export interface MediaAsset {
  id: string;
  filename: string;
  url: string;
  type: 'image' | 'video';
  size: number; // in bytes
  dimensions?: { width: number; height: number };
  uploadedAt: string;
  tags: string[];
}

// --- Global Settings & CMS Structure ---

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  defaultLanguage: string;
  timeZone: string;
  logoUrl: string;
  faviconUrl: string;
  // New Enhanced Settings
  primaryColor?: string;
  autoTranslate?: boolean;
  geoIpRedirect?: boolean;
  maintenanceMode?: boolean;
}

export interface SearchSettings {
    verifiedSupplierBoost: number; // e.g. 1.5x
    responseRateWeight: number; // e.g. 0.3
    yearsActiveWeight: number; // e.g. 0.2
    tradeAssuranceBoost: boolean;
    sponsoredPriority: boolean;
}

export interface SecuritySettings {
    enforce2FAForSellers: boolean;
    fraudRiskThreshold: number; // 0-100
    bannedKeywords: string[];
    allowedIpRegions: string[];
    // New Settings
    apiRateLimit: number; // requests per minute
    sessionTimeout: number; // minutes
    passwordPolicy: 'standard' | 'strong' | 'strict';
    encryptionEnabled: boolean;
}

export interface ContentTypeField {
  key: string;
  label: string;
  type: 'text' | 'richtext' | 'image' | 'number' | 'boolean' | 'date';
  required: boolean;
}

export interface ContentTypeDefinition {
  id: string;
  name: string; // e.g., "Blog Post", "Product"
  slug: string; // e.g., "blog-post"
  description?: string;
  fields: ContentTypeField[];
}

export interface PageTemplate {
  id: string;
  name: string; // e.g., "Full Width", "Sidebar Left"
  thumbnail: string;
  description: string;
}

// --- HEADLESS CMS API DOCUMENTATION ---

/**
 * GET /api/v1/cms/page?slug=homepage
 * Retrieves all content blocks for a specific page.
 * This allows for multi-channel publishing (web, mobile, external APIs).
 * 
 * @returns {
 *   slug: 'homepage',
 *   seo: { title: '...', description: '...' },
 *   sections: [
 *     { 
 *       id: 'section-ai-recs',
 *       component: 'AiRecommendations',
 *       enabled: true,
 *       content: { title: 'Curated for Your Business', ... }
 *     },
 *     {
 *       id: 'banner-company-1',
 *       component: 'CompanyBanner',
 *       enabled: true,
 *       content: { ... } // The content from the Banner type
 *     },
 *     ...
 *   ]
 * }
 */

// --- Financial Types for Admin ---

export interface Transaction {
    id: string;
    orderId: string;
    amount: number;
    fee: number;
    net: number;
    type: 'Sale' | 'Refund' | 'Membership Fee';
    status: 'Completed' | 'Pending' | 'Failed';
    date: string;
}

export interface Payout {
    id: string;
    sellerId: string;
    sellerName: string;
    amount: number;
    status: 'Pending' | 'Paid' | 'Failed';
    requestDate: string;
    paidDate?: string;
}

// --- Workflow Automation Types (Enterprise) ---

export type WorkflowTriggerType = 'event_based' | 'schedule_based' | 'api_triggered';
export type WorkflowStageType = 'approval' | 'automation' | 'notification' | 'integration' | 'delay' | 'split' | 'join';
export type WorkflowStageStatus = 'pending' | 'active' | 'completed' | 'failed' | 'skipped';

export interface WorkflowRule {
  id: string;
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'contains';
  value: any;
  nextStageId: string;
}

export interface EscalationPolicy {
  afterHours: number;
  action: 'notify' | 'reassign' | 'auto_reject' | 'auto_approve';
  targetRole?: string;
  targetUser?: string;
}

export interface AutomationConfig {
    webhookUrl?: string;
    headers?: Record<string, string>;
    scriptId?: string;
    emailTemplate?: string;
}

export interface ApprovalConfig {
    minApprovals: number; // e.g., 2 out of 3
    requiredRoles: string[]; // e.g., ["finance", "legal"]
    approverIds?: string[]; // Specific users
}

export interface WorkflowStage {
    id: string;
    name: string;
    type: WorkflowStageType;
    description?: string;
    assigneeRole?: string; // e.g. 'compliance_officer', 'finance_manager'
    
    // Enterprise Extensions
    isParallel?: boolean;
    parallelIds?: string[]; // IDs of stages running in parallel (if this is a split node)
    
    rules?: WorkflowRule[]; // Dynamic routing (If-Else logic)
    escalation?: EscalationPolicy; // SLA handling
    slaHours?: number;
    
    approvalConfig?: ApprovalConfig;
    automationConfig?: AutomationConfig;

    // Legacy / Simple Routing
    nextStageIdSuccess?: string;
    nextStageIdFailure?: string;
    
    position?: { x: number, y: number }; // For visual editor
}

export interface WorkflowTemplate {
    id: string;
    name: string;
    description: string;
    trigger: string; // e.g., 'kyc_submission', 'order_placed'
    stages: WorkflowStage[];
    isActive: boolean;
    version: number;
    createdAt: string;
    updatedAt: string;
    stats?: {
        avgCompletionTime: string;
        activeInstances: number;
        successRate: string;
    };
}

export interface WorkflowInstance {
    id: string;
    templateId: string;
    templateName: string;
    currentStageId: string;
    status: 'running' | 'completed' | 'failed' | 'cancelled';
    contextData: Record<string, any>; // Snapshot of data triggering flow
    startDate: string;
    lastUpdated: string;
    logs: WorkflowLog[];
}

export interface WorkflowLog {
    timestamp: string;
    stageId: string;
    stageName: string;
    action: string;
    user?: string;
    details: string;
    status: 'success' | 'failure' | 'info';
}

export interface WorkflowKpi {
    name: string;
    value: string;
    change?: string;
}

// --- Experience Engine Types (Frontend Logic) ---

export type PersonaType = 'guest' | 'buyer' | 'verified_buyer' | 'seller' | 'gold_supplier' | 'admin';
export type RegionType = 'global' | 'na' | 'eu' | 'asia' | 'mea';

export interface LogicRule {
    id: string;
    name: string;
    category: 'pricing' | 'visibility' | 'access' | 'ui';
    condition: {
        userType?: PersonaType[];
        region?: RegionType[];
        device?: 'mobile' | 'desktop';
        behaviorScore?: number; // e.g. 0-100 engagement
    };
    action: {
        type: 'show_price' | 'hide_price' | 'show_component' | 'hide_component' | 'redirect' | 'apply_discount';
        value?: any; // e.g. discount percent, or component ID
    };
    priority: number;
    enabled: boolean;
}

export interface PageModule {
    id: string;
    name: string;
    component: string; // The component key from library
    enabled: boolean;
    order: number;
    audience: PersonaType[];
    props?: Record<string, any>; // Component specific props (JSON)
    dataBinding?: {
        dataSource: 'static' | 'api' | 'context';
        endpoint?: string;
    };
    visibilityRules?: {
        field: string;
        operator: 'eq' | 'neq' | 'contains';
        value: any;
    }[];
}

export interface PageConfig {
    id: string;
    page: string; // slug or id
    layout?: 'single-col' | 'two-col' | 'dashboard';
    modules: PageModule[];
}

// --- Badge & Level Management ---

export type BadgeIcon = 'Star' | 'Award' | 'ShieldCheck' | 'TrendingUp' | 'Zap';
export type BadgeColor = 'yellow' | 'blue' | 'green' | 'red' | 'purple';
export type ConditionMetric = 'Total Sales ($)' | 'Average Rating (1-5)' | 'Completed Orders' | 'Response Rate (%)';
export type ConditionOperator = '>=' | '<=';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: BadgeIcon;
  color: BadgeColor;
  type: 'buyer' | 'seller';
  conditionMetric: ConditionMetric;
  conditionOperator: ConditionOperator;
  conditionValue: number;
}

// --- Security & Compliance Types ---

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  resource: string;
  ipAddress: string;
  status: 'SUCCESS' | 'FAILURE' | 'WARNING';
  metadata?: string;
}

export interface ComplianceRequest {
  id: string;
  userId: string;
  userName: string;
  type: 'export_data' | 'delete_account' | 'marketing_optout';
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  requestDate: string;
  deadline: string;
}

export interface Backup {
  id: string;
  timestamp: string;
  size: string;
  type: 'full' | 'incremental' | 'manual';
  status: 'completed' | 'failed';
  location: string;
}

// --- Extensions / App Store ---
export interface Extension {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  icon: ElementType;
  category: 'Marketing' | 'Analytics' | 'Productivity' | 'AI';
  active: boolean;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
