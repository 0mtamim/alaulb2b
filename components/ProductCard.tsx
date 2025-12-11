
import React from 'react';
import { Product } from '../types';
import { ShieldCheck, ShoppingCart, Eye, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, variant = 'default' }) => {
  const { formatPrice } = useLanguage();
  const isCompact = variant === 'compact';

  return (
    <div className={`group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full relative transform hover:-translate-y-1 ${isCompact ? 'text-sm' : ''}`}>
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img 
          src={product.image} 
          alt={product.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
        />
        
        {/* Hover Overlay with Actions */}
        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px] z-20">
           <button 
             onClick={(e) => {
               e.preventDefault();
               e.stopPropagation();
               alert("Added to cart (Demo)");
             }}
             className="bg-white text-slate-800 p-2.5 rounded-full hover:bg-orange-500 hover:text-white transition-all shadow-lg transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75 hover:scale-110"
             title="Add to Cart"
           >
             <ShoppingCart size={18} />
           </button>
           <Link 
             to={`/product/${product.id}`}
             className="bg-white text-slate-800 p-2.5 rounded-full hover:bg-orange-500 hover:text-white transition-all shadow-lg transform translate-y-4 group-hover:translate-y-0 duration-300 delay-100 hover:scale-110"
             title="View Details"
           >
             <Eye size={18} />
           </Link>
           {!isCompact && (
             <button 
               onClick={(e) => {
                 e.preventDefault();
                 e.stopPropagation();
                 navigator.clipboard.writeText(window.location.href);
                 alert("Link copied!");
               }}
               className="bg-white text-slate-800 p-2.5 rounded-full hover:bg-orange-500 hover:text-white transition-all shadow-lg transform translate-y-4 group-hover:translate-y-0 duration-300 delay-150 hover:scale-110"
               title="Share"
             >
               <Share2 size={18} />
             </button>
           )}
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2 z-10 items-start">
            {product.moq < 50 && !isCompact && (
              <div className="bg-emerald-600 text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-md tracking-wider animate-fade-in">
                Low MOQ
              </div>
            )}
            {product.supplierVerified && (
              <div 
                className={`bg-white/95 backdrop-blur-md text-blue-700 border border-blue-200 rounded font-bold shadow-md flex items-center gap-1 animate-fade-in ${isCompact ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1'}`}
                title="Verified Supplier: Identity & Capabilities Checked"
              >
                <ShieldCheck size={isCompact ? 10 : 12} className="text-blue-600" fill="currentColor" fillOpacity={0.2} /> 
                {isCompact ? 'Verified' : 'Verified Supplier'}
              </div>
            )}
        </div>
      </div>
      
      <Link to={`/product/${product.id}`} className={`flex-1 flex flex-col ${isCompact ? 'p-3' : 'p-4'}`}>
        <h3 className={`font-medium text-gray-900 line-clamp-2 mb-1 group-hover:text-orange-600 transition-colors ${isCompact ? 'text-xs leading-tight' : 'text-base'}`}>
          {product.title}
        </h3>
        <div className="mt-auto pt-2">
          <p className={`font-bold text-gray-900 ${isCompact ? 'text-sm' : 'text-lg'}`}>
             {product.priceRange && !product.priceRange.includes('$') ? `From ${formatPrice(product.price)}` : formatPrice(product.price)}
          </p>
          {!isCompact && <p className="text-xs text-gray-500 mb-2">{product.moq} pieces (MOQ)</p>}
          
          {!isCompact && (
            <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-2">
               <div className="flex items-center gap-1 text-xs text-gray-400">
                  <span>{product.origin}</span>
               </div>
               <div className="text-xs text-gray-400 font-medium flex items-center gap-1">
                 <span className="text-yellow-400">★</span> {product.rating}
               </div>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
