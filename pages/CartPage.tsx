import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart, Lock, ArrowLeft, Heart, Tag, Package, Star } from 'lucide-react';
import { CartItem } from '../contexts/CartContext';

const CartItemRow: React.FC<{ item: CartItem }> = ({ item }) => {
    const { removeFromCart, updateQuantity } = useCart();
    const { formatPrice } = useLanguage();
    const isActionDisabled = item.productType !== 'physical' || item.isSample;

    return (
        <div className="grid grid-cols-12 gap-4 items-center py-4 border-b border-slate-100">
            <div className="col-span-5 flex items-center gap-4">
                <img src={item.image} alt={item.title} className="w-24 h-24 object-cover rounded-lg" />
                <div>
                    <h3 className="font-bold text-slate-800 text-sm">{item.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        {item.isSample && (
                            <span className="text-[10px] font-bold bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full flex items-center gap-1"><Star size={10}/> Sample</span>
                        )}
                        {item.productType !== 'physical' && (
                            <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full flex items-center gap-1"><Package size={10}/> {item.productType}</span>
                        )}
                    </div>
                     <button onClick={() => removeFromCart(item.id)} className="text-xs text-red-500 hover:underline flex items-center gap-1 mt-1">
                        <Trash2 size={12}/> Remove
                    </button>
                </div>
            </div>
            <div className="col-span-2 text-sm font-medium">{formatPrice(item.price)}</div>
            <div className="col-span-3">
                 <div className={`flex items-center border border-slate-200 rounded w-fit ${isActionDisabled ? 'opacity-60' : ''}`}>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={isActionDisabled} className="p-2 text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed"><Minus size={16}/></button>
                    <span className="px-4 font-bold text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={isActionDisabled} className="p-2 text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed"><Plus size={16}/></button>
                </div>
            </div>
            <div className="col-span-2 text-right font-bold text-slate-900">{formatPrice(item.price * item.quantity)}</div>
        </div>
    );
};


const CartPage: React.FC = () => {
    const { cartItems, subtotal, cartCount, hasPhysicalItems } = useCart();
    const { formatPrice } = useLanguage();

    const physicalItems = cartItems.filter(item => item.productType === 'physical');
    const digitalItems = cartItems.filter(item => item.productType !== 'physical');

    const physicalSubtotal = physicalItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const digitalSubtotal = digitalItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const shippingEstimate = hasPhysicalItems ? 50 : 0; // Only add shipping if physical items exist
    const taxEstimate = subtotal * 0.08; // Mock tax on total
    const total = subtotal + shippingEstimate + taxEstimate;

    return (
        <div className="bg-slate-50 min-h-screen py-12">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-extrabold text-slate-900">Shopping Cart</h1>
                    <Link to="/" className="text-sm font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1">
                        <ArrowLeft size={16}/> Continue Shopping
                    </Link>
                </div>
                
                {cartItems.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                        <ShoppingCart size={48} className="mx-auto text-slate-300 mb-4"/>
                        <h2 className="text-xl font-bold text-slate-800">Your cart is empty</h2>
                        <p className="text-slate-500 mt-2 mb-6">Looks like you haven't added anything to your cart yet.</p>
                        <Link to="/" className="bg-slate-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-800">
                            Start Sourcing
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                             <div className="grid grid-cols-12 gap-4 text-xs text-slate-500 uppercase font-bold border-b border-slate-200 pb-3 mb-2">
                                <div className="col-span-5">Product</div>
                                <div className="col-span-2">Price</div>
                                <div className="col-span-3">Quantity</div>
                                <div className="col-span-2 text-right">Total</div>
                            </div>
                            
                            {physicalItems.length > 0 && (
                                <>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase my-4">Physical Goods</h3>
                                    {physicalItems.map(item => <CartItemRow key={item.id} item={item} />)}
                                </>
                            )}
                            
                            {digitalItems.length > 0 && (
                                <>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase my-4">Digital Goods & Services</h3>
                                    {digitalItems.map(item => <CartItemRow key={item.id} item={item} />)}
                                </>
                            )}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-24">
                                <h2 className="text-xl font-bold border-b border-slate-200 pb-4 mb-4">Order Summary</h2>
                                
                                <div className="space-y-4 mb-4">
                                    <div className="flex items-center gap-2">
                                        <input type="text" placeholder="Enter coupon code" className="flex-1 p-2 border border-slate-200 rounded-lg text-sm bg-slate-50"/>
                                        <button className="px-4 py-2 bg-slate-200 text-slate-600 rounded-lg font-bold text-sm">Apply</button>
                                    </div>
                                </div>

                                <div className="space-y-3 text-sm text-slate-600 border-t border-slate-100 pt-4">
                                    {physicalItems.length > 0 && <div className="flex justify-between"><span>Physical Items Subtotal</span> <span className="font-medium text-slate-900">{formatPrice(physicalSubtotal)}</span></div>}
                                    {digitalItems.length > 0 && <div className="flex justify-between"><span>Digital Items Subtotal</span> <span className="font-medium text-slate-900">{formatPrice(digitalSubtotal)}</span></div>}
                                    <div className="flex justify-between"><span>Shipping Estimate</span> <span className="font-medium text-slate-900">{hasPhysicalItems ? formatPrice(shippingEstimate) : 'N/A'}</span></div>
                                    <div className="flex justify-between"><span>Tax Estimate</span> <span className="font-medium text-slate-900">{formatPrice(taxEstimate)}</span></div>
                                </div>

                                <div className="flex justify-between font-extrabold text-xl text-slate-900 border-t border-slate-200 mt-4 pt-4">
                                    <span>Total</span>
                                    <span>{formatPrice(total)}</span>
                                </div>
                                <button className="w-full mt-6 bg-orange-500 text-white py-4 rounded-lg font-bold text-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
                                    <Lock size={18}/> Proceed to Checkout
                                </button>
                            </div>
                            <div className="text-center text-xs text-slate-400 mt-4">
                                <p>Shipping for physical items calculated at next step.</p>
                            </div>
                        </div>
                    </div>
                )}

                 {/* Saved for Later */}
                 <div className="mt-16">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Heart size={20}/> Saved for Later</h2>
                    <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
                        <p className="text-slate-500">You have no items saved for later.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
