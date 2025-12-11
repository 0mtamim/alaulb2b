
import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MessageCircle, ShieldCheck, Truck, CreditCard, ChevronRight, Sparkles, X, Send, FileText, Ruler, Zap, Box, Star, ThumbsUp, User, DollarSign, Layers, Globe, Check, CheckCircle, AlertCircle, Clock, Package, Info } from 'lucide-react';
import { negotiateAssistant } from '../services/gemini';
import { Review, PricingTier } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

// Mock Specifications Data
const MOCK_SPECS = {
  "Model Number": "HP-5000-X",
  "Pressure Capacity": "5000 PSI",
  "Flow Rate": "15 GPM",
  "Material": "Stainless Steel 316L",
  "Power Source": "Electric",
  "Voltage": "220V / 380V (3-Phase)",
  "Certification": "ISO9001, CE",
  "Warranty": "2 Years",
  "Weight": "45 kg",
  "Dimensions": "60cm x 40cm x 40cm",
  "Application": "Industrial Manufacturing, Heavy Machinery",
  "Customization Support": "OEM, ODM, Software Re-engineering"
};

// Mock Pricing Tiers
const MOCK_TIERS: PricingTier[] = [
    { minQty: 10, maxQty: 49, pricePerUnit: 145 },
    { minQty: 50, maxQty: 199, pricePerUnit: 135 },
    { minQty: 200, maxQty: 499, pricePerUnit: 125 },
    { minQty: 500, maxQty: null, pricePerUnit: 115 },
];

const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    productId: '1',
    userName: 'John D.',
    userAvatar: 'https://i.pravatar.cc/150?img=68',
    rating: 5,
    comment: 'Excellent quality pump. We have been using it in our assembly line for 3 months without issues. Fast shipping from the supplier.',
    date: '2023-09-15',
    helpfulCount: 12
  },
  {
    id: 'r2',
    productId: '1',
    userName: 'Sarah Construction Co.',
    userAvatar: 'https://i.pravatar.cc/150?img=44',
    rating: 4,
    comment: 'Good value for money. The documentation could be clearer, but the support team helped us with installation.',
    date: '2023-08-22',
    helpfulCount: 5
  }
];

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const { formatPrice, t } = useLanguage();
  
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{sender: string, text: string, detectedLanguage?: string}[]>([
      {sender: 'supplier', text: 'Hello! How can I help you with this product? We have stock ready for immediate shipment.', detectedLanguage: 'English'}
  ]);
  
  // Review State
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [ratingInput, setRatingInput] = useState(0);
  const [reviewText, setReviewText] = useState('');
  
  // Variant State
  const VARIANTS = {
      colors: [
          { name: 'Industrial Silver', hex: '#C0C0C0' },
          { name: 'Matte Black', hex: '#282828' },
          { name: 'Safety Orange', hex: '#FF5F15' }
      ],
      sizes: ['Standard (15 GPM)', 'High Flow (25 GPM)', 'Custom Spec']
  };

  const [selectedColor, setSelectedColor] = useState(VARIANTS.colors[0]);
  const [selectedSize, setSelectedSize] = useState(VARIANTS.sizes[0]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (showChat) {
        scrollToBottom();
    }
  }, [chatHistory, showChat]);

  // Language Detection Heuristic
  const detectLanguage = (text: string): string => {
    const chineseRegex = /[\u4e00-\u9fa5]/;
    const arabicRegex = /[\u0600-\u06FF]/;
    const cyrillicRegex = /[\u0400-\u04FF]/;
    
    if (chineseRegex.test(text)) return 'Chinese (Simplified)';
    if (arabicRegex.test(text)) return 'Arabic';
    if (cyrillicRegex.test(text)) return 'Russian';
    return 'English';
  };

  // Dynamic Price & Availability Logic
  const getCurrentPrice = () => {
      // Base Price logic in USD using Tiers if Standard model
      if (selectedSize === 'Standard (15 GPM)') {
          // Display range for main view based on tiers
          return { display: `${formatPrice(MOCK_TIERS[MOCK_TIERS.length-1].pricePerUnit)} - ${formatPrice(MOCK_TIERS[0].pricePerUnit)}`, min: MOCK_TIERS[0].pricePerUnit };
      }

      let minPrice = 180;
      let maxPrice = 210;

      if (selectedSize === 'Custom Spec') {
          return { display: 'Negotiable', min: 0 };
      }

      // High Flow Model is more expensive
      return { 
          display: `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`, 
          min: minPrice 
      };
  };

  const getCurrentStock = () => {
      if (selectedSize === 'High Flow (25 GPM)') return { label: 'Low Stock (3 units)', color: 'text-red-600', icon: <AlertCircle size={14}/> };
      if (selectedSize === 'Custom Spec') return { label: 'Made to Order (Lead time: 20-25 days)', color: 'text-blue-600', icon: <Clock size={14}/> };
      return { label: 'In Stock (150+ units)', color: 'text-green-600', icon: <CheckCircle size={14}/> };
  };

  const currentPrice = getCurrentPrice();
  const currentStock = getCurrentStock();

  const handleSendMessage = async () => {
    if(!chatInput.trim()) return;
    
    // 1. Detect Language of User Input
    const detectedLang = detectLanguage(chatInput);

    // 2. Add User Message
    const userMsg = {sender: 'user', text: chatInput, detectedLanguage: detectedLang};
    setChatHistory(prev => [...prev, userMsg]);
    setChatInput('');

    // 3. Get AI Negotiation Tip
    const context = [...chatHistory, userMsg].map(m => m.text);
    const tip = await negotiateAssistant(context, userMsg.text);

    if (tip) {
        setTimeout(() => {
            setChatHistory(prev => [...prev, {sender: 'ai-tip', text: tip, detectedLanguage: 'English'}]);
        }, 800);
    }

    // 4. Simulate Supplier Reply
    setTimeout(() => {
        let reply = "Thank you for your message. Can you confirm the destination port?";
        if (Math.random() > 0.8) {
           reply = "感谢您的询问。请问您的目标港口是哪里？ (Thank you for your inquiry. Where is your destination port?)";
        } else {
            const lowerInput = userMsg.text.toLowerCase();
            if (lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes('discount')) {
                reply = `For an order of that size, the best FOB price we can offer is ${formatPrice(118.50)} per unit. Does that work for your budget?`;
            } else if (lowerInput.includes('moq') || lowerInput.includes('minimum')) {
                reply = "Our standard MOQ is 10 pieces, but for a sample order we can do 1 piece to test quality.";
            } else if (lowerInput.includes('shipping') || lowerInput.includes('delivery')) {
                reply = "We can ship via DHL Express (3-5 days) or Ocean Freight (25-30 days). Which do you prefer?";
            }
        }
        const replyLang = detectLanguage(reply);
        setChatHistory(prev => [...prev, {sender: 'supplier', text: reply, detectedLanguage: replyLang}]);
    }, 2500);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (ratingInput === 0) {
      alert("Please select a star rating.");
      return;
    }
    const newReview: Review = {
      id: `r${Date.now()}`,
      productId: id || '1',
      userName: 'Current User', 
      rating: ratingInput,
      comment: reviewText,
      date: new Date().toISOString().split('T')[0],
      helpfulCount: 0
    };
    setReviews([newReview, ...reviews]);
    setRatingInput(0);
    setReviewText('');
    alert("Review submitted successfully!");
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) 
    : "0.0";

  return (
    <div className="bg-white min-h-screen pb-12">
       {/* Breadcrumb */}
       <div className="container mx-auto px-4 py-4 text-sm text-gray-500 flex items-center gap-2">
         <span>Home</span> <ChevronRight size={14}/> <span>Machinery</span> <ChevronRight size={14}/> <span>Hydraulics</span>
       </div>

       <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
         {/* Images */}
         <div className="md:col-span-5">
           <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 mb-4 group relative">
             <img src={`https://picsum.photos/600/600?random=${id || '100'}`} alt="Product" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
             {selectedSize === 'Custom Spec' && (
                 <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded shadow-lg animate-pulse">
                     Custom Build
                 </div>
             )}
           </div>
           <div className="grid grid-cols-4 gap-2">
             {[1,2,3,4].map(i => (
                <div key={i} className="aspect-square bg-gray-100 rounded cursor-pointer border hover:border-orange-500 overflow-hidden">
                    <img src={`https://picsum.photos/100/100?random=${i+10}`} className="w-full h-full object-cover hover:opacity-80 transition-opacity"/>
                </div>
             ))}
           </div>
         </div>

         {/* Info */}
         <div className="md:col-span-4">
           <h1 className="text-2xl font-bold text-gray-900 mb-2">Industrial Grade Heavy Duty Hydraulic Pump 5000 PSI High Performance</h1>
           <div className="flex items-center gap-3 mb-6 text-sm">
             <div className="flex items-center text-orange-500 font-bold">
                <span className="mr-1">{averageRating}</span>
                <Star size={14} fill="currentColor"/>
             </div>
             <span className="text-gray-300">|</span>
             <span className="text-gray-600">23 Orders</span>
             <span className="text-gray-300">|</span>
             <span className={`font-bold flex items-center gap-1 ${currentStock.color}`}>
                {currentStock.icon} {currentStock.label}
             </span>
           </div>

           {/* Product Variants Selector */}
           <div className="mb-6 p-5 bg-white border border-gray-200 rounded-xl shadow-sm">
              {/* Color Selector */}
              <div className="mb-5">
                  <div className="text-sm font-bold text-gray-800 mb-2 flex items-center justify-between">
                      <span>Color: <span className="font-normal text-gray-600">{selectedColor.name}</span></span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                      {VARIANTS.colors.map(c => (
                          <button 
                              key={c.name}
                              onClick={() => setSelectedColor(c)}
                              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${selectedColor.name === c.name ? 'border-orange-500 ring-2 ring-orange-100 scale-110' : 'border-gray-200 hover:border-gray-400'}`}
                              title={c.name}
                              style={{ backgroundColor: c.hex }}
                          >
                              {selectedColor.name === c.name && <Check size={16} className={`drop-shadow-md ${c.name === 'Industrial Silver' ? 'text-slate-800' : 'text-white'}`}/>}
                          </button>
                      ))}
                  </div>
              </div>

              {/* Size/Model Selector */}
              <div>
                  <div className="text-sm font-bold text-gray-800 mb-2 flex items-center justify-between">
                      <span>Model / Capacity</span>
                      <button className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                          <Ruler size={12}/> Size Guide
                      </button>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                      {VARIANTS.sizes.map(size => (
                          <button 
                              key={size}
                              onClick={() => setSelectedSize(size)}
                              className={`px-4 py-3 text-sm border rounded-lg transition-all flex items-center justify-between text-left group ${selectedSize === size ? 'border-orange-500 bg-orange-50 text-orange-900 shadow-sm' : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}
                          >
                              <span className={`font-medium ${selectedSize === size ? 'font-bold' : ''}`}>{size}</span>
                              {selectedSize === size && <CheckCircle size={16} className="text-orange-500"/>}
                          </button>
                      ))}
                  </div>
              </div>
           </div>

           {/* Dynamic Price Box */}
           <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 mb-6 transition-all duration-300">
             <div className="flex items-center justify-between mb-1">
                 <div className="text-3xl font-bold text-orange-600 animate-fade-in key={selectedSize}">
                     {currentPrice.display} 
                     {currentPrice.min > 0 && <span className="text-sm text-gray-500 font-normal ml-1">/ Piece</span>}
                 </div>
             </div>
             
             <div className="text-sm text-gray-600 flex items-center gap-4">
                 <span className="flex items-center gap-1"><Package size={14}/> Min. Order: 10 Pieces</span>
                 {selectedSize === 'Custom Spec' && <span className="text-blue-600 font-medium">Customization Available</span>}
             </div>

             {/* Additional Dynamic Pricing Note */}
             {selectedSize === 'High Flow (25 GPM)' && (
                 <div className="mt-3 p-2 bg-orange-100/50 border border-orange-100 rounded text-xs text-orange-800 flex items-center gap-2">
                     <Zap size={14} className="text-orange-600"/> High Performance Surcharge applied for 25 GPM model.
                 </div>
             )}
           </div>

            {/* Wholesale Pricing Tiers Table - Only for Standard */}
            {selectedSize === 'Standard (15 GPM)' && (
                <div className="mb-6 bg-white rounded-lg border border-slate-200 overflow-hidden">
                   <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-4 py-2 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
                      <Layers size={14}/> Volume Discounts
                   </div>
                   <div className="grid grid-cols-4 divide-x divide-slate-200 text-center text-sm">
                      {MOCK_TIERS.map((tier, idx) => (
                          <div key={idx} className="p-2 hover:bg-slate-50 transition-colors">
                              <div className="text-xs text-gray-500 mb-1">{tier.minQty}{tier.maxQty ? `-${tier.maxQty}` : '+'} pcs</div>
                              <div className="font-bold text-slate-900">{formatPrice(tier.pricePerUnit)}</div>
                          </div>
                      ))}
                   </div>
                </div>
            )}

           <div className="space-y-4 border-t border-gray-100 pt-4 mb-6">
             <div className="flex justify-between text-sm">
               <span className="text-gray-500">{t('lbl_warranty')}:</span>
               <span className="text-gray-900 font-medium">2 Years</span>
             </div>
             <div className="flex justify-between text-sm">
               <span className="text-gray-500">{t('lbl_lead_time')}:</span>
               <span className="text-gray-900 font-medium">{selectedSize === 'Custom Spec' ? '20-25 days' : '15 days (1-100 pcs)'}</span>
             </div>
             <div className="flex justify-between text-sm">
               <span className="text-gray-500">{t('lbl_customization')}:</span>
               <span className="text-gray-900 font-medium">Logo, Packaging, Graphic</span>
             </div>
           </div>

           <div className="space-y-3">
             <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-full font-bold transition-colors shadow-lg shadow-orange-200 flex items-center justify-center gap-2" onClick={() => setShowChat(!showChat)}>
               <MessageCircle size={20}/> {t('btn_contact')}
             </button>
             <button className="w-full bg-white border-2 border-orange-500 text-orange-600 py-3 rounded-full font-bold hover:bg-orange-50 transition-colors">
               {t('btn_order')}
             </button>
           </div>
         </div>

         {/* Supplier Card */}
         <div className="md:col-span-3">
           <div className="border border-gray-200 rounded-lg p-5 shadow-sm sticky top-24">
             <div className="flex items-center gap-3 mb-4">
               <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold text-lg">S</div>
               <div>
                 <div className="font-bold text-sm text-gray-900">Shenzhen Tech Industries</div>
                 <div className="text-xs text-gray-500">China (Mainland)</div>
               </div>
             </div>
             
             <div className="flex gap-2 mb-4">
                <div className="bg-orange-50 text-orange-600 text-xs px-2 py-1 rounded border border-orange-100 flex items-center gap-1 font-medium">
                   <ShieldCheck size={12}/> Verified Pro
                </div>
                <div className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded font-medium">
                   12 Yrs
                </div>
             </div>

             <div className="space-y-3 text-xs text-gray-600 border-t border-gray-100 pt-3">
               <div className="flex items-center gap-2">
                 <ShieldCheck size={14} className="text-green-500"/> Trade Assurance
               </div>
               <div className="flex items-center gap-2">
                 <Truck size={14} className="text-gray-400"/> On-time Delivery Guarantee
               </div>
               <div className="flex items-center gap-2">
                 <CreditCard size={14} className="text-gray-400"/> Visa, Mastercard, TT
               </div>
             </div>
             
             <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-xs mb-1">
                   <span className="text-gray-500">Response Time</span>
                   <span className="font-bold text-gray-800">≤ 3h</span>
                </div>
                <div className="flex justify-between text-xs">
                   <span className="text-gray-500">On-time Rate</span>
                   <span className="font-bold text-gray-800">98.5%</span>
                </div>
             </div>
           </div>
         </div>
       </div>

       {/* Product Specifications Section */}
       <div className="container mx-auto px-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
             <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center gap-2">
                <FileText className="text-orange-500" size={20}/>
                <h2 className="font-bold text-lg text-slate-800">{t('sect_specs')}</h2>
             </div>
             <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                   {Object.entries(MOCK_SPECS).map(([key, value], index) => (
                      <div key={key} className="flex border-b border-gray-100 pb-3 hover:bg-gray-50 transition-colors px-2 rounded">
                         <span className="text-gray-500 w-1/3 text-sm font-medium flex items-center">{key}</span>
                         <span className="text-gray-800 font-medium text-sm flex-1">{value}</span>
                      </div>
                   ))}
                </div>
             </div>
          </div>
       </div>

       {/* Reviews Section */}
       <div className="container mx-auto px-4 mb-12">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center gap-2">
                  <Star className="text-orange-500" size={20}/>
                  <h2 className="font-bold text-lg text-slate-800">{t('sect_reviews')}</h2>
              </div>
              <div className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                      {/* Left: Summary & Form */}
                      <div className="lg:col-span-1">
                          <div className="bg-orange-50 p-6 rounded-xl text-center mb-8 border border-orange-100">
                              <div className="text-5xl font-bold text-orange-600 mb-2">{averageRating}</div>
                              <div className="flex justify-center gap-1 mb-2 text-orange-500">
                                  {[1,2,3,4,5].map(star => (
                                      <Star key={star} size={20} fill={star <= Math.round(Number(averageRating)) ? "currentColor" : "none"} className={star <= Math.round(Number(averageRating)) ? "" : "text-gray-300"}/>
                                  ))}
                              </div>
                              <div className="text-sm text-gray-600">{reviews.length} Verified Reviews</div>
                          </div>

                          <div className="border border-gray-200 rounded-xl p-6">
                              <h3 className="font-bold text-slate-800 mb-4">Write a Review</h3>
                              <form onSubmit={handleSubmitReview}>
                                  <div className="mb-4">
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                                      <div className="flex gap-2">
                                          {[1,2,3,4,5].map(num => (
                                              <button 
                                                key={num} 
                                                type="button"
                                                onClick={() => setRatingInput(num)}
                                                className="focus:outline-none transition-transform hover:scale-110"
                                              >
                                                  <Star size={24} className={num <= ratingInput ? "text-orange-500 fill-orange-500" : "text-gray-300"}/>
                                              </button>
                                          ))}
                                      </div>
                                  </div>
                                  <div className="mb-4">
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Review</label>
                                      <textarea 
                                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                                          rows={4}
                                          placeholder="Share your experience with this product..."
                                          value={reviewText}
                                          onChange={(e) => setReviewText(e.target.value)}
                                          required
                                      ></textarea>
                                  </div>
                                  <button type="submit" className="w-full bg-slate-900 text-white py-2 rounded-lg font-bold hover:bg-slate-800 transition-colors">
                                      Submit Review
                                  </button>
                              </form>
                          </div>
                      </div>

                      {/* Right: Reviews List */}
                      <div className="lg:col-span-2 space-y-6">
                          {reviews.length > 0 ? (
                              reviews.map(review => (
                                  <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                      <div className="flex justify-between items-start mb-2">
                                          <div className="flex items-center gap-3">
                                              <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                                                  {review.userAvatar ? (
                                                      <img src={review.userAvatar} alt={review.userName} className="w-full h-full object-cover"/>
                                                  ) : (
                                                      <User className="text-gray-500" size={20}/>
                                                  )}
                                              </div>
                                              <div>
                                                  <div className="font-bold text-slate-800 text-sm">{review.userName}</div>
                                                  <div className="flex text-orange-500 text-xs">
                                                      {[...Array(5)].map((_, i) => (
                                                          <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-gray-300"}/>
                                                      ))}
                                                  </div>
                                              </div>
                                          </div>
                                          <div className="text-xs text-gray-400">{review.date}</div>
                                      </div>
                                      <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                                          {review.comment}
                                      </p>
                                      <div className="flex items-center gap-4 text-xs text-gray-500">
                                          <button className="flex items-center gap-1 hover:text-orange-500 transition-colors">
                                              <ThumbsUp size={14}/> Helpful ({review.helpfulCount})
                                          </button>
                                      </div>
                                  </div>
                              ))
                          ) : (
                              <div className="text-center py-12 text-gray-500">
                                  No reviews yet. Be the first to review this product!
                              </div>
                          )}
                      </div>
                  </div>
              </div>
          </div>
       </div>

       {/* Floating Chat Window */}
       {showChat && (
         <div className="fixed bottom-4 right-4 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden animate-fade-in-up" style={{height: '600px'}}>
            {/* Chat Header */}
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-md z-10">
               <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 font-bold">S</div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></div>
                  </div>
                  <div>
                      <div className="font-bold text-sm">Shenzhen Tech</div>
                      <div className="text-xs text-slate-400 flex items-center gap-1">
                          <Sparkles size={10} className="text-orange-400"/> AI Copilot Active
                      </div>
                  </div>
               </div>
               <button onClick={() => setShowChat(false)} className="text-slate-400 hover:text-white transition-colors bg-white/10 p-1.5 rounded-full">
                   <X size={16}/>
               </button>
            </div>
            
            {/* Chat Messages */}
            <div className="flex-1 bg-gray-50 p-4 overflow-y-auto space-y-4">
              <div className="text-center text-xs text-gray-400 my-4">Today</div>
              
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                   {msg.sender === 'ai-tip' ? (
                       <div className="w-full mx-4 my-2 animate-pulse">
                           <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-lg shadow-sm transform hover:scale-105 transition-transform cursor-help">
                                <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs mb-1 uppercase tracking-wide">
                                    <Sparkles size={12}/> Negotiation Coach
                                </div>
                                <div className="text-xs text-indigo-800 leading-relaxed font-medium">
                                    {msg.text}
                                </div>
                           </div>
                       </div>
                   ) : (
                       <div className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                           <div className={`p-3 rounded-2xl text-sm shadow-sm ${
                               msg.sender === 'user' 
                               ? 'bg-orange-500 text-white rounded-br-sm' 
                               : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'
                           }`}>
                              {msg.text}
                           </div>
                           <div className="flex items-center gap-2 mt-1 px-1">
                               {msg.detectedLanguage && (
                                   <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-1 rounded flex items-center gap-1">
                                       <Globe size={8}/> {msg.detectedLanguage}
                                   </span>
                               )}
                               <span className="text-[10px] text-gray-400">
                                   {msg.sender === 'user' ? 'You' : 'Supplier'} • Just now
                               </span>
                           </div>
                       </div>
                   )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-3 bg-white border-t border-gray-200">
               <div className="flex gap-2 items-end bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition-all">
                 <textarea 
                  className="flex-1 bg-transparent border-none text-sm focus:outline-none resize-none py-2 max-h-24"
                  placeholder="Type your message..."
                  rows={1}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                      }
                  }}
                 />
                 <button 
                    onClick={handleSendMessage} 
                    disabled={!chatInput.trim()}
                    className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed mb-0.5 transition-colors"
                 >
                    <Send size={16}/>
                 </button>
               </div>
               <div className="text-[10px] text-center text-gray-400 mt-2 flex items-center justify-center gap-1">
                   <Sparkles size={10} className="text-orange-400"/> AI Assistance enabled for negotiation support.
               </div>
            </div>
         </div>
       )}
    </div>
  );
};

export default ProductDetail;
