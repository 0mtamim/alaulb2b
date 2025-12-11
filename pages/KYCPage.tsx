
import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, XCircle, AlertTriangle, ShieldCheck, Camera, Loader2, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { analyzeDocument } from '../services/gemini';

const KYCPage: React.FC = () => {
  const [activeDoc, setActiveDoc] = useState<'license' | 'id' | 'tax'>('license');
  const [uploads, setUploads] = useState({
      license: { file: null as File | null, status: 'pending', data: '' },
      id: { file: null as File | null, status: 'pending', data: '' },
      tax: { file: null as File | null, status: 'pending', data: '' }
  });
  const [analyzing, setAnalyzing] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'license' | 'id' | 'tax') => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploads(prev => ({ ...prev, [type]: { ...prev[type], file, status: 'uploading' } }));
      
      // Simulate Analysis
      setAnalyzing(true);
      
      // Fake delay then AI analysis
      setTimeout(async () => {
          const res = await analyzeDocument(type === 'license' ? 'Business License' : type === 'id' ? 'Passport' : 'Tax Cert', 'My Company Ltd');
          
          setUploads(prev => ({ 
              ...prev, 
              [type]: { 
                  file, 
                  status: res.valid ? 'valid' : 'invalid',
                  data: res.extractedData 
              } 
          }));
          setAnalyzing(false);
      }, 2000);
  };

  const allValid = uploads.license.status === 'valid' && uploads.id.status === 'valid';

  return (
    <div className="min-h-screen bg-slate-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
            
            <div className="text-center mb-10">
                <div className="inline-flex p-3 bg-blue-100 text-blue-600 rounded-full mb-4">
                    <ShieldCheck size={32} />
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Business Verification (KYC)</h1>
                <p className="text-slate-500">Please upload your documents to verify your business identity. All data is encrypted.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Left: Document List */}
                <div className="md:col-span-1 space-y-4">
                    <button 
                        onClick={() => setActiveDoc('license')}
                        className={`w-full p-4 rounded-xl border text-left transition-all ${activeDoc === 'license' ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
                    >
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-slate-700">Business License</span>
                            {uploads.license.status === 'valid' && <CheckCircle size={16} className="text-green-500"/>}
                        </div>
                        <p className="text-xs text-slate-500">Company registration certificate</p>
                    </button>

                    <button 
                        onClick={() => setActiveDoc('id')}
                        className={`w-full p-4 rounded-xl border text-left transition-all ${activeDoc === 'id' ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
                    >
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-slate-700">Govt. Issued ID</span>
                            {uploads.id.status === 'valid' && <CheckCircle size={16} className="text-green-500"/>}
                        </div>
                        <p className="text-xs text-slate-500">Passport or National ID of Owner</p>
                    </button>

                    <button 
                        onClick={() => setActiveDoc('tax')}
                        className={`w-full p-4 rounded-xl border text-left transition-all ${activeDoc === 'tax' ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
                    >
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-slate-700">Tax Registration</span>
                            <span className="text-xs bg-gray-200 px-2 py-0.5 rounded text-gray-600">Optional</span>
                        </div>
                        <p className="text-xs text-slate-500">VAT/Tax Identification number</p>
                    </button>
                </div>

                {/* Right: Upload Area */}
                <div className="md:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 h-full flex flex-col">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-slate-800 mb-2">
                                Upload {activeDoc === 'license' ? 'Business License' : activeDoc === 'id' ? 'Government ID' : 'Tax Certificate'}
                            </h3>
                            <p className="text-sm text-slate-500">Ensure the document is clear, valid, and corners are visible.</p>
                        </div>

                        {/* Upload State Handling */}
                        {uploads[activeDoc].status === 'valid' ? (
                            <div className="flex-1 flex flex-col items-center justify-center bg-green-50 border-2 border-green-100 border-dashed rounded-xl p-8">
                                <CheckCircle size={48} className="text-green-500 mb-4"/>
                                <h4 className="font-bold text-green-800">Verification Successful</h4>
                                <p className="text-sm text-green-700 mt-2 text-center">AI extracted data:</p>
                                <div className="bg-white p-3 rounded border border-green-200 mt-3 text-xs font-mono text-slate-600 w-full">
                                    {uploads[activeDoc].data}
                                </div>
                                <button 
                                    onClick={() => setUploads(prev => ({ ...prev, [activeDoc]: { ...prev[activeDoc], status: 'pending', file: null } }))}
                                    className="mt-4 text-sm text-green-700 hover:underline flex items-center gap-1"
                                >
                                    <RefreshCw size={12}/> Re-upload
                                </button>
                            </div>
                        ) : analyzing && uploads[activeDoc].status === 'uploading' ? (
                            <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 border-2 border-slate-200 border-dashed rounded-xl p-8">
                                <Loader2 size={48} className="text-blue-500 animate-spin mb-4"/>
                                <h4 className="font-bold text-slate-700">Analyzing Document...</h4>
                                <p className="text-sm text-slate-500 mt-2">Our AI is verifying authenticity and extracting details.</p>
                            </div>
                        ) : (
                            <div className="flex-1 border-2 border-dashed border-gray-300 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors relative flex flex-col items-center justify-center p-8 group cursor-pointer">
                                <input 
                                    type="file" 
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={(e) => handleFileUpload(e, activeDoc)}
                                    accept="image/*,.pdf"
                                />
                                <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Upload size={24} className="text-blue-600"/>
                                </div>
                                <p className="font-bold text-slate-700">Click to upload or drag and drop</p>
                                <p className="text-xs text-slate-400 mt-2">JPG, PNG or PDF (Max 5MB)</p>
                            </div>
                        )}

                        {/* Warnings */}
                        <div className="mt-6 flex gap-3 text-xs text-slate-500 bg-blue-50 p-3 rounded-lg">
                            <AlertTriangle size={16} className="text-blue-500 flex-shrink-0"/>
                            <p>Documents are processed securely. False submissions may lead to permanent account suspension.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="mt-8 flex justify-end">
                <Link to="/dashboard" className={`px-8 py-3 rounded-lg font-bold transition-all ${allValid ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-gray-200 text-gray-400 pointer-events-none'}`}>
                    Submit Verification
                </Link>
            </div>

        </div>
    </div>
  );
};

export default KYCPage;
