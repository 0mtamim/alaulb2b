
import React, { useState } from 'react';
import { CheckCircle, X, ShieldCheck, Zap, Globe, BarChart2, Crown, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  features: string[];
  notIncluded?: string[];
  isPopular?: boolean;
  cta: string;
  color: string;
  btnColor: string;
}

const MembershipPage: React.FC = () => {
  const [view, setView] = useState<'supplier' | 'buyer'>('supplier');

  const SUPPLIER_PLANS: PricingPlan[] = [
    {
      name: "Free Standard",
      price: "Free",
      period: "Forever",
      features: [
        "List up to 50 Products",
        "Basic Storefront",
        "Respond to 5 RFQs/month",
        "Standard Transaction Fees"
      ],
      notIncluded: [
        "Verified Supplier Badge",
        "Top Search Ranking",
        "Access to High-Value Buyers",
        "0% Transaction Fees"
      ],
      cta: "Join Free",
      color: "bg-white border-gray-200",
      btnColor: "bg-slate-100 text-slate-700 hover:bg-slate-200"
    },
    {
      name: "Gold Supplier",
      price: "$2,999",
      period: "/ year",
      isPopular: true,
      features: [
        "Verified Supplier Badge",
        "Unlimited Product Listings",
        "Priority Search Ranking",
        "Respond to 50 RFQs/month",
        "Custom Storefront Design",
        "3 Sub-Accounts"
      ],
      notIncluded: [
        "Key Account Manager",
        "Exclusive Franchise Rights"
      ],
      cta: "Apply for Gold",
      color: "bg-white border-orange-200 shadow-xl scale-105 relative z-10",
      btnColor: "bg-orange-500 text-white hover:bg-orange-600"
    },
    {
      name: "Platinum Pro",
      price: "$5,999",
      period: "/ year",
      features: [
        "All Gold Features",
        "Top Tier Search Ranking",
        "Unlimited RFQ Responses",
        "Key Account Manager",
        "Factory 3D VR Tour",
        "0% Transaction Fees (First $1M)",
        "Trade Finance Support"
      ],
      notIncluded: [],
      cta: "Contact Sales",
      color: "bg-slate-900 text-white border-slate-800",
      btnColor: "bg-white text-slate-900 hover:bg-gray-100"
    }
  ];

  const BUYER_PLANS: PricingPlan[] = [
    {
      name: "Standard Buyer",
      price: "Free",
      period: "",
      features: [
        "Access Global Suppliers",
        "Post RFQs",
        "Trade Assurance Protection",
        "Order Management Dashboard"
      ],
      cta: "Sign Up Free",
      color: "bg-white border-gray-200",
      btnColor: "bg-slate-100 text-slate-700 hover:bg-slate-200"
    },
    {
      name: "Pro Buyer",
      price: "$199",
      period: "/ year",
      features: [
        "Access to Premium Sellers",
        "View Supplier Financial Reports",
        "Priority RFQ Processing",
        "Verified Buyer Badge",
        "Dedicated Sourcing Agent"
      ],
      cta: "Upgrade to Pro",
      color: "bg-blue-50 border-blue-200 shadow-md",
      btnColor: "bg-blue-600 text-white hover:bg-blue-700"
    }
  ];

  const plans = view === 'supplier' ? SUPPLIER_PLANS : BUYER_PLANS;

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Grow Your Business on TradeGenius</h1>
          <p className="text-slate-500 text-lg mb-8">
            Choose the right plan to unlock global trade opportunities. 
            Whether you are sourcing products or selling to the world, we have you covered.
          </p>
          
          <div className="inline-flex bg-white p-1 rounded-xl shadow-sm border border-gray-200">
            <button 
              onClick={() => setView('supplier')}
              className={`px-8 py-3 rounded-lg font-bold transition-all ${view === 'supplier' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-500 hover:bg-gray-50'}`}
            >
              For Suppliers
            </button>
            <button 
              onClick={() => setView('buyer')}
              className={`px-8 py-3 rounded-lg font-bold transition-all ${view === 'buyer' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-gray-50'}`}
            >
              For Buyers
            </button>
          </div>
        </div>

        <div className={`grid gap-8 max-w-7xl mx-auto ${view === 'supplier' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 max-w-4xl'}`}>
          {plans.map((plan, idx) => (
            <div key={idx} className={`rounded-2xl p-8 border flex flex-col ${plan.color}`}>
              {plan.isPopular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg uppercase tracking-wide">
                  Most Popular
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2 opacity-90">{plan.name}</h3>
                <div className="flex items-baseline">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  <span className="opacity-70 ml-1 font-medium">{plan.period}</span>
                </div>
              </div>

              <div className="flex-1 space-y-4 mb-8">
                {plan.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm font-medium opacity-90">
                    <CheckCircle size={18} className={view === 'supplier' && idx === 1 ? 'text-orange-500' : 'text-green-500'} />
                    {feat}
                  </div>
                ))}
                {plan.notIncluded && plan.notIncluded.map((feat, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm opacity-50">
                    <X size={18} />
                    {feat}
                  </div>
                ))}
              </div>

              <Link 
                to={`/join?role=${view === 'supplier' ? 'supplier' : 'buyer'}&plan=${encodeURIComponent(plan.name)}`}
                className={`w-full py-4 rounded-xl font-bold text-center transition-transform hover:scale-105 active:scale-95 ${plan.btnColor}`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8">
           <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                 <ShieldCheck size={32}/>
              </div>
              <h4 className="font-bold text-slate-800 mb-2">Trade Assurance</h4>
              <p className="text-sm text-slate-500">Protect your orders from payment to delivery with our secure escrow system.</p>
           </div>
           <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Globe size={32}/>
              </div>
              <h4 className="font-bold text-slate-800 mb-2">Global Reach</h4>
              <p className="text-sm text-slate-500">Access buyers and sellers in over 190 countries and regions.</p>
           </div>
           <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Zap size={32}/>
              </div>
              <h4 className="font-bold text-slate-800 mb-2">AI Matching</h4>
              <p className="text-sm text-slate-500">Our Smart Match technology pairs you with the right business partners instantly.</p>
           </div>
           <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                 <BarChart2 size={32}/>
              </div>
              <h4 className="font-bold text-slate-800 mb-2">Data Insights</h4>
              <p className="text-sm text-slate-500">Get real-time market trends and demand analysis to stay ahead.</p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default MembershipPage;