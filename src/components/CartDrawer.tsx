import React from 'react';
import { useCart } from '../context/CartContext';
import { formatPrice, formatApproxCdf } from '../services/cashpayApi';
import { X, Trash2, ShoppingBag, MessageCircle, ExternalLink, ArrowRight, ShieldCheck } from 'lucide-react';
import { APP_CONFIG } from '../config/appConfig';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalAmount,
    totalItemsCount,
  } = useCart();

  if (!isCartOpen) return null;

  const handleCheckoutWhatsApp = () => {
    if (items.length === 0) return;

    let itemsText = '';
    items.forEach((item, index) => {
      const varText = item.selectedVariation?.color
        ? ` (${item.selectedVariation.color})`
        : '';
      itemsText += `${index + 1}. *${item.product.name}*${varText} x${item.quantity} = $${(item.pricePerUnit * item.quantity).toFixed(2)} USD\n`;
    });

    const primaryBoutique = items[0]?.product.boutique;
    const whatsappNumber = primaryBoutique?.whatsappPublicNumber?.replace(/[^0-9]/g, '');

    const message = encodeURIComponent(
      `Bonjour ! Je souhaite finaliser ma commande sur Imagine Store :\n\n` +
        `🛒 *RÉCAPITULATIF DE MA COMMANDE (${totalItemsCount} article${totalItemsCount > 1 ? 's' : ''})* :\n` +
        itemsText +
        `\n💵 *TOTAL : $${totalAmount.toFixed(2)} USD* (${formatApproxCdf(totalAmount)})\n` +
        (primaryBoutique?.name ? `🏪 Boutique : ${primaryBoutique.name}\n` : '') +
        `\nMerci de me confirmer la prise en charge et le lieu de livraison !`
    );

    const waUrl = whatsappNumber
      ? `https://wa.me/${whatsappNumber}?text=${message}`
      : `https://wa.me/?text=${message}`;

    window.open(waUrl, '_blank');
  };

  const handleOpenStoreDirectly = () => {
    const baseUrl = APP_CONFIG.API_BASE_URL.replace(/\/+$/, '');
    const firstProduct = items[0]?.product;
    const storeUrl = firstProduct?.boutique?.id
      ? `${baseUrl}/public/store/${firstProduct.boutique.id}`
      : `${baseUrl}`;
    window.open(storeUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      {/* Drawer Container (full width on mobile, max 450px on desktop) */}
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md sm:max-w-lg bg-[#0b1329] border-l border-slate-800 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-4 sm:p-5 bg-[#0e1935] border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-white leading-tight">
                  Mon Panier
                </h2>
                <p className="text-[11px] text-slate-400">
                  {totalItemsCount} article{totalItemsCount > 1 ? 's' : ''} sélectionné{totalItemsCount > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-red-400 hover:text-red-300 px-2.5 py-1.5 rounded-lg hover:bg-red-500/10 transition cursor-pointer"
                  title="Vider le panier"
                >
                  Vider
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                aria-label="Fermer le panier"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-3xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-10 h-10 text-slate-400" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white">Votre panier est vide</h3>
                  <p className="text-xs text-slate-400 max-w-xs mt-1">
                    Explorez les articles disponibles dans la boutique et ajoutez vos coups de cœur.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 cursor-pointer transition"
                >
                  Continuer mes achats
                </button>
              </div>
            ) : (
              items.map((item, idx) => {
                const varKey = item.selectedVariation?.color || item.selectedVariation?.size || undefined;

                return (
                  <div
                    key={`${item.product.id}-${idx}`}
                    className="p-3 bg-[#111c3a] border border-slate-800/90 rounded-2xl flex gap-3 items-center shadow-sm"
                  >
                    {/* Thumbnail - Clean filled cover */}
                    <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl bg-[#070d1d] overflow-hidden flex-shrink-0 border border-slate-700/50 relative">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-100 truncate">
                        {item.product.name}
                      </h4>
                      {item.selectedVariation && (
                        <p className="text-[11px] text-amber-300 font-medium">
                          Option : {item.selectedVariation.color || ''} {item.selectedVariation.size || ''}
                        </p>
                      )}
                      <div className="flex items-baseline gap-1.5 mt-1">
                        <span className="text-xs sm:text-sm font-black text-white">
                          ${(item.pricePerUnit * item.quantity).toFixed(2)}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          (${item.pricePerUnit} / un.)
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {formatApproxCdf(item.pricePerUnit * item.quantity)}
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex flex-col items-end justify-between self-stretch flex-shrink-0">
                      <button
                        onClick={() => removeFromCart(item.product.id, varKey)}
                        className="text-slate-500 hover:text-red-400 p-1 transition cursor-pointer"
                        title="Supprimer du panier"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="flex items-center gap-1.5 bg-[#0b1227] px-2 py-1 rounded-xl border border-slate-700/60">
                        <button
                          onClick={() => updateQuantity(item.product.id, varKey, item.quantity - 1)}
                          className="text-slate-400 hover:text-white font-black text-xs w-4 h-4 flex items-center justify-center cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold text-white w-5 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, varKey, item.quantity + 1)}
                          className="text-slate-400 hover:text-white font-black text-xs w-4 h-4 flex items-center justify-center cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Checkout */}
          {items.length > 0 && (
            <div className="p-4 bg-[#0e1935] border-t border-slate-800 space-y-3">
              <div className="space-y-1.5 bg-[#080f22] p-3 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Sous-total ({totalItemsCount} article{totalItemsCount > 1 ? 's' : ''})</span>
                  <span className="font-semibold text-slate-200">${totalAmount.toFixed(2)} USD</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Estimation CDF</span>
                  <span className="font-semibold text-slate-300">{formatApproxCdf(totalAmount)}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-sm font-bold text-white">Total</span>
                  <span className="text-xl font-black text-amber-400">
                    ${totalAmount.toFixed(2)} USD
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={handleCheckoutWhatsApp}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer transition active:scale-[0.99]"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Commander via WhatsApp</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <button
                  onClick={handleOpenStoreDirectly}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#142347] hover:bg-[#1a2d5c] border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
                  <span>Rejoindre le magasin d'origine</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Paiements directs et sécurisés auprès du vendeur</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
