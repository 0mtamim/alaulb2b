import React, { useState } from 'react';
import { analyzeRFQ } from '../services/gemini';
import { Bot, CheckCircle, Loader2 } from 'lucide-react';

const RFQPage: React.FC = () => {
  const [requestText, setRequestText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{summary?: string, category?: string, suggestions?: string} | null>(null);

  const handleAnalyze = async () => {
    if (!requestText.trim()) return;
    setIsAnalyzing(true);
    const result = await analyzeRFQ(requestText);
    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("RFQ Submitted to 50+ Suppliers! You will be contacted shortly.");
    // In a real app, this would post to a backend
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Submit RFQ (Request for Quotation)</h1>
        <p className="text-gray-600 mb-8">Let our AI help you structure your request to get the best quotes from top suppliers.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
             <form onSubmit={handleSubmit}>
               <div className="mb-6">
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   What are you looking for?
                 </label>
                 <textarea
                   className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent h-40"
                   placeholder="Describe your product needs in detail. E.g., 'I need 5000 units of custom printed cotton t-shirts, 180gsm, sizes S-XL, delivered to New York by Oct 1st.'"
                   value={requestText}
                   onChange={(e) => setRequestText(e.target.value)}
                 ></textarea>
                 <div className="mt-2 flex justify-end">
                   <button 
                    type="button"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !requestText}
                    className="flex items-center gap-2 text-sm text-orange-600 font-medium hover:text-orange-700 disabled:opacity-50"
                   >
                     {isAnalyzing ? <Loader2 className="animate-spin" size={16}/> : <Bot size={16}/>}
                     Analyze with AI
                   </button>
                 </div>
               </div>

               {analysisResult && (
                 <div className="mb-6 bg-orange-50 border border-orange-100 rounded-lg p-4">
                    <h3 className="text-sm font-bold text-orange-800 mb-2 flex items-center gap-2">
                      <Bot size={16}/> AI Summary & Optimization
                    </h3>
                    <div className="space-y-3 text-sm text-gray-700">
                      <div>
                        <span className="font-semibold">Categorized as:</span> {analysisResult.category}
                      </div>
                      <div>
                        <span className="font-semibold">Professional Summary:</span>
                        <p className="mt-1 italic bg-white p-2 rounded border border-orange-100">
                          "{analysisResult.summary}"
                        </p>
                      </div>
                      <div>
                        <span className="font-semibold">Suggestion:</span> {analysisResult.suggestions}
                      </div>
                    </div>
                 </div>
               )}

               <div className="grid grid-cols-2 gap-4 mb-6">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Quantity Required</label>
                   <input type="number" className="w-full p-2 border border-gray-300 rounded" placeholder="e.g. 1000" required />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                    <select className="w-full p-2 border border-gray-300 rounded">
                      <option>Pieces</option>
                      <option>Sets</option>
                      <option>Tons</option>
                    </select>
                 </div>
               </div>

               <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors">
                 Post RFQ Now
               </button>
             </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
               <h3 className="font-bold text-gray-900 mb-4">How it works</h3>
               <ul className="space-y-4">
                 <li className="flex gap-3">
                   <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">1</div>
                   <p className="text-sm text-gray-600">Submit your request with details.</p>
                 </li>
                 <li className="flex gap-3">
                   <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">2</div>
                   <p className="text-sm text-gray-600">AI optimizes your request for suppliers.</p>
                 </li>
                 <li className="flex gap-3">
                   <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">3</div>
                   <p className="text-sm text-gray-600">Compare quotes and choose the best.</p>
                 </li>
               </ul>
             </div>

             <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl text-white">
                <div className="flex items-center gap-2 mb-2">
                   <CheckCircle className="text-green-400" size={20} />
                   <span className="font-bold">Trade Assurance</span>
                </div>
                <p className="text-xs text-slate-300">
                  Protect your orders from payment to delivery.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RFQPage;
