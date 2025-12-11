import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 text-sm mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold text-white mb-4">Customer Services</h3>
          <ul className="space-y-2">
            <li>Help Center</li>
            <li>Report Abuse</li>
            <li>Submit a Dispute</li>
            <li>Policies & Rules</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-white mb-4">About Us</h3>
          <ul className="space-y-2">
            <li>About TradeGenius</li>
            <li>Sitemap</li>
            <li>Investor Relations</li>
            <li>Legal</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-white mb-4">Source on TradeGenius</h3>
          <ul className="space-y-2">
            <li>AI Sourcing Tool</li>
            <li>Supplier Region</li>
            <li>Industry Clusters</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-white mb-4">Trade Services</h3>
          <ul className="space-y-2">
            <li>Trade Assurance</li>
            <li>Business Identity</li>
            <li>Logistics Service</li>
            <li>Letter of Credit</li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 pt-8 border-t border-slate-700 text-center">
        <p>&copy; {new Date().getFullYear()} TradeGenius AI Network. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
