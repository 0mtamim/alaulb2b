
export interface Product {
  id: string;
  title: string;
  description: string;
  priceRange: string;
  price: number;
  moq: number;
  image: string;
  category: string;
  rating: number;
  supplierId: string;
  specifications: Record<string, string>;
  origin: string;
  supplierVerified: boolean;
  supplierBusinessType: string;
  views?: number;
  inquiries?: number;
  stock?: number;
  status?: string;
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
  price: number;
  status: string;
  aiRiskScore: number;
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
}

export interface RFQ {
  id: string;
  product: string;
  qty: number;
  buyer: string;
  status: string;
  quotes: number;
  budget: string;
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
