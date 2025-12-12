
import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, XCircle, AlertTriangle, ShieldCheck, Camera, Loader2, RefreshCw, Building2, User, ChevronRight, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { analyzeDocument } from '../services/gemini';
import { verifyFileSignature } from '../utils/security';

type DocType = 'license' | 'id' | 'tax';
type VerificationStep = 'select' | 'upload' | 'review' | 'success';

const KYCPage: React.FC = () => {
  const navigate = useNavigate();
  const [verificationType, setVerificationType] = useState<'business' | 'personal'>('business');
  const [step, setStep] = useState<VerificationStep>('select');
  const [analyzing, setAnalyzing] = useState(false);
  const [extractedData, setExtractedData] = useState<Record<string, string>>({});
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // 1. Signature Verification (Prevents Malicious File Extensions)
      const isValid = await verifyFileSignature(file);
      if(!isValid) {
          alert("Security Error: Invalid file format detected. Please upload a valid PDF or Image.");
          return;
      }

      setUploadedFile(file);
      setStep('upload');
      setAnalyzing(true);
      
      // Simulate AI Analysis
      const docName = verificationType === 'business' ? 'Business License' : 'Government ID';
      const res = await analyzeDocument(docName, 'My Company Ltd');
      
      setExtractedData(res.extractedData);
      setAnalyzing(false);
      setStep('review');
  };

  const handleConfirm = () => {
      setStep('success');
      // In real app, submit data to backend here
  };

  const resetFlow = () => {
      setStep('select');
      setUploadedFile(null);
      setExtractedData({});
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 font-sans">
        <div className="container mx-auto px-4 max-w-3xl">
            
            {/* Header Steps */}
            <div className="flex justify-between items-center mb-12 relative">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10 rounded-full"></div>
                <div className={`flex flex-col items-center bg-slate-50 px-2 ${step !== 'success' ? 'text-blue-600' : 'text-green-500'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white mb-2 transition-colors ${step !== 'success' ? 'bg-blue-600' : 'bg-green-500'}`}>1</div>
                    <span className="text-xs font-bold">Select Type</span>
                </div>
                <div className={`flex flex-col items-center bg-slate-50 px-2 ${step === 'upload' || step === 'review' ? 'text-blue-600' : step === 'success' ? 'text-green-500' : 'text-slate-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white mb-2 transition-colors ${step === 'upload' || step === 'review' ? 'bg-blue-600' : step === 'success' ? 'bg-green-500' : 'bg-slate-300'}`}>2</div>
                    <span className="text-xs font-bold">Upload & Scan</span>
                </div>
                <div className={`flex flex-col items-center bg-slate-50 px-2 ${step === 'success' ? 'text-green-500' : 'text-slate-400'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white mb-2 transition-colors ${step === 'success' ? 'bg-green-500' : 'bg-slate-300'}`}>3</div>
                    <span className="text-xs font-bold">Verified</span>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden min-h-[500px] flex flex-col">
                
                {/* Step 1: Selection */}
                {step === 'select' && (
                    <div className="p-8 md:p-12 animate-fade-in">
                        <h2 className="text-3xl font-extrabold text-slate-900 mb-4 text-center">Let's verify your identity</h2>
                        <p className="text-slate-500 text-center mb-10 max-w-md mx-auto">
                            To comply with global trade regulations and ensure a safe marketplace, we need to verify who you are.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <button 
                                onClick={() => setVerificationType('business')}
                                className={`p-6 rounded-xl border-2 text-left transition-all hover:shadow-lg group ${verificationType === 'business' ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-blue-300'}`}
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${verificationType === 'business' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-500'}`}>
                                    <Building2 size={24}/>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">Business Verification (KYB)</h3>
                                <p className="text-sm text-slate-500">For companies. Requires Business License, Tax Registration, and Authorized Rep ID.</p>
                            </button>

                            <button 
                                onClick={() => setVerificationType('personal')}
                                className={`p-6 rounded-xl border-2 text-left transition-all hover:shadow-lg group ${verificationType === 'personal' ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-blue-300'}`}
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${verificationType === 'personal' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-500'}`}>
                                    <User size={24}/>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">Personal Identity (KYC)</h3>
                                <p className="text-sm text-slate-500">For freelancers or sole traders. Requires Passport, National ID, or Driver's License.</p>
                            </button>
                        </div>

                        <div className="mt-10 text-center">
                            <div className="inline-flex items-center gap-2 text-xs text-slate-400 bg-slate-50 px-3 py-1 rounded-full">
                                <Lock size={12}/> Your data is encrypted and stored securely.
                            </div>
                        </div>
                        
                        <div className="mt-8 flex justify-center">
                             <label className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-xl cursor-pointer flex items-center gap-2">
                                <Upload size={18}/>
                                <span>Upload {verificationType === 'business' ? 'Business License' : 'Government ID'}</span>
                                <input type="file" className="hidden" accept="image/jpeg,image/png,application/pdf" onChange={handleFileSelect}/>
                             </label>
                        </div>
                    </div>
                )}

                {/* Step 2: Upload & Analyzing */}
                {step === 'upload' && (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center animate-fade-in">
                        <div className="relative mb-6">
                            <div className="w-24 h-24 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Loader2 size={32} className="text-blue-500 animate-pulse"/>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Analyzing Document...</h3>
                        <p className="text-slate-500 max-w-sm">Our AI is scanning your document to extract details automatically. This prevents manual entry errors.</p>
                    </div>
                )}

                {/* Step 3: Review */}
                {step === 'review' && (
                    <div className="flex flex-col md:flex-row h-full animate-fade-in">
                        {/* Left: Document Preview */}
                        <div className="md:w-1/2 bg-slate-100 p-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-200">
                            {uploadedFile ? (
                                <img src={URL.createObjectURL(uploadedFile)} alt="Preview" className="max-w-full max-h-64 md:max-h-96 rounded shadow-lg border border-white"/>
                            ) : (
                                <FileText size={64} className="text-slate-300"/>
                            )}
                        </div>

                        {/* Right: Extracted Data */}
                        <div className="md:w-1/2 p-8 flex flex-col">
                            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <CheckCircle className="text-green-500" size={24}/> AI Extraction Complete
                            </h3>
                            
                            <div className="flex-1 space-y-4">
                                {Object.entries(extractedData).map(([key, value]) => (
                                    <div key={key}>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{key}</label>
                                        <input 
                                            type="text" 
                                            defaultValue={value as string} 
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 flex gap-3">
                                <button onClick={resetFlow} className="px-6 py-3 border border-slate-200 rounded-lg font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                                    Retake
                                </button>
                                <button onClick={handleConfirm} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-colors shadow-lg shadow-blue-200">
                                    Confirm & Submit
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 4: Success */}
                {step === 'success' && (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center animate-scale-in">
                        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                            <ShieldCheck size={48}/>
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-800 mb-4">Verification Submitted!</h2>
                        <p className="text-slate-500 max-w-md mb-8">
                            Your documents have been securely transmitted. Our compliance team will perform a final review within 24 hours. You can now access limited features.
                        </p>
                        <div className="flex gap-4">
                            <Link to="/dashboard" className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-slate-800 transition-colors shadow-lg">
                                Go to Dashboard
                            </Link>
                        </div>
                    </div>
                )}

            </div>
        </div>
    </div>
  );
};

export default KYCPage;
