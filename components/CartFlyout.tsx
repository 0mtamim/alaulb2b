import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { X, Trash2, Plus, Minus, Package, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartFlyout: React.FC = () => {
  const { isCartOpen, closeCart, cartItems, removeFromCart, updateQuantity, subtotal, cartCount } = useCart();
  const { formatPrice } = useLanguage();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] animate-fade-in" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeCart}></div>
      <div className="absolute top-0 right-0 bottom-0 bg-white w-full max-w-md shadow-2xl flex flex-col transition-transform transform translate-x-0">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">Your Cart ({cartCount})</h2>
          <button onClick={closeCart} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <p className="text-slate-500">Your cart is empty.</p>
            <button onClick={closeCart} className="mt-4 bg-slate-900 text-white px-6 py-2 rounded-lg font-bold">
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="flex gap-4 items-start border-b border-slate-100 pb-4">
                <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-lg border border-slate-200" />
                <div className="flex-1">
                  <h3 className="font-bold text-sm text-slate-800 line-clamp-2">{item.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                      {item.isSample && (
                        <span className="text-[10px] font-bold bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full flex items-center gap-1"><Star size={10}/> Sample</span>
                      )}
                      {item.productType !== 'physical' && (
                        <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full flex items-center gap-1"><Package size={10}/> {item.productType}</span>
                      )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Unit Price: {formatPrice(item.price)}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className={`flex items-center border border-slate-200 rounded ${item.productType !== 'physical' || item.isSample ? 'opacity-60' : ''}`}>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                        className="p-1.5 text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed"
                        disabled={item.productType !== 'physical' || item.isSample}
                      >
                        <Minus size={14}/>
                      </button>
                      <span className="px-3 text-sm font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                        className="p-1.5 text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed"
                        disabled={item.productType !== 'physical' || item.isSample}
                      >
                        <Plus size={14}/>
                      </button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 p-1">
                      <Trash2 size={16}/>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {cartItems.length > 0 && (
          <div className="p-6 border-t border-slate-200 bg-slate-50 space-y-4">
            <div className="flex justify-between font-bold text-lg">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <p className="text-xs text-slate-500 text-center">Shipping & taxes calculated at checkout.</p>
            <div className="flex flex-col gap-3">
              <Link to="/cart" onClick={closeCart} className="w-full text-center bg-white border border-slate-300 text-slate-800 py-3 rounded-lg font-bold hover:bg-slate-100 transition-colors">
                View Full Cart
              </Link>
              <button className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartFlyout;
