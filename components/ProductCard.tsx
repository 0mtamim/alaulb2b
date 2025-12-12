
import React from 'react';
import { Product } from '../types';
import { ShieldCheck, ShoppingCart, Eye, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, variant = 'default' }) => {
  const { formatPrice } = useLanguage();
  const { addToCart } = useCart();
  const isCompact = variant === 'compact';
  const isVerified = product.supplierVerified;
  const mainImage = product.multimedia.images[0] || product.image; // Fallback to old image field
  const price = product.variants[0]?.price ?? product.price;
  const priceDisplay = formatPrice(price);

  return (
    <div className={`group bg-white border rounded-lg overflow-hidden transition-all duration-300 flex flex-col h-full relative transform hover:-translate-y-1 
      ${isCompact ? 'text-sm' : ''} 
      ${isVerified 
        ? 'border-blue-100 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-100' 
        : 'border-slate-200 hover:shadow-xl'
      }`
    }>
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img 
          src={mainImage} 
          alt={product.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        
        {/* Enhanced Hover Overlay with Actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px] z-20">
           <button 
             onClick={(e) => {
               e.preventDefault();
               e.stopPropagation();
               addToCart(product);
             }}
             className="bg-white/90 backdrop-blur-sm text-slate-800 p-3 rounded-full hover:bg-orange-500 hover:text-white transition-all shadow-lg transform opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 duration-300 delay-100 hover:scale-110"
             title="Add to Cart"
           >
             <ShoppingCart size={18} />
           </button>
           <Link 
             to={`/product/${product.id}`}
             className="bg-white/90 backdrop-blur-sm text-slate-800 p-3 rounded-full hover:bg-orange-500 hover:text-white transition-all shadow-lg transform opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 duration-300 delay-150 hover:scale-110"
             title="View Details"
           >
             <Eye size={18} />
           </Link>
           {!isCompact && (
             <button 
               onClick={(e) => {
                 e.preventDefault();
                 e.stopPropagation();
                 navigator.clipboard.writeText(`${window.location.origin}/#/product/${product.id}`);
               }}
               className="bg-white/90 backdrop-blur-sm text-slate-800 p-3 rounded-full hover:bg-orange-500 hover:text-white transition-all shadow-lg transform opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 duration-300 delay-200 hover:scale-110"
               title="Copy Link"
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
            {isVerified && (
              <div 
                className={`bg-blue-100 text-blue-800 border border-blue-200 rounded-full font-bold shadow-md flex items-center gap-1.5 animate-fade-in ${isCompact ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'}`}
                title="Verified Supplier: Identity & Capabilities Checked"
              >
                <ShieldCheck size={isCompact ? 10 : 12} className="text-blue-600" /> 
                {isCompact ? 'Verified' : 'Verified Supplier'}
              </div>
            )}
        </div>
      </div>
      
      <Link to={`/product/${product.id}`} className={`flex-1 flex flex-col ${isCompact ? 'p-3' : 'p-4'}`}>
        <h3 className={`font-medium text-slate-900 line-clamp-2 mb-1 group-hover:text-orange-600 transition-colors ${isCompact ? 'text-xs leading-tight h-8' : 'text-base h-12'}`}>
          {product.title}
        </h3>
        <div className="mt-auto pt-2">
          <p className={`font-bold text-slate-900 ${isCompact ? 'text-sm' : 'text-lg'}`}>
             {product.pricingTiers.length > 1 ? `From ${formatPrice(product.pricingTiers[product.pricingTiers.length - 1].pricePerUnit)}` : priceDisplay}
          </p>
          {!isCompact && <p className="text-xs text-slate-500 mb-2">{product.moq} pieces (MOQ)</p>}
          
          {!isCompact && (
            <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-2">
               <div className="flex items-center gap-1 text-xs text-slate-400">
                  <span>{product.origin}</span>
               </div>
               <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
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
