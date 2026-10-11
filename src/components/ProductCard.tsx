import React, { useState } from 'react';
import { Product } from '../types/cashpay';
import { formatPrice, formatApproxCdf } from '../services/cashpayApi';
import { Heart, Plus, Sparkles, ImageOff } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  isWishlisted,
  onToggleWishlist,
}) => {
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const boutiqueName = product.boutique?.name || 'Imagine Boutique';
  const hasPromos = product.promotionalPackages && product.promotionalPackages.length > 0;
  const isOutOfStock = product.stock <= 0;

  // Best promotional package price if exists
  const bestPromoPrice = hasPromos
    ? Math.min(...product.promotionalPackages!.map((p) => p.price))
    : null;

  const displayPrice = bestPromoPrice && bestPromoPrice < product.sellingPrice
    ? bestPromoPrice
    : product.sellingPrice;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    setIsAdding(true);
    addToCart(product, 1);
    setTimeout(() => setIsAdding(false), 600);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist(product.id);
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group flex flex-col bg-[#111a33] hover:bg-[#162142] border border-slate-800/80 hover:border-slate-700/80 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-black/30 cursor-pointer relative"
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full bg-[#0a1022] overflow-hidden">
        {!imageError && product.image ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-[#0d162d] p-4 text-center">
            <ImageOff className="w-8 h-8 mb-1 text-slate-600" />
            <span className="text-[10px] text-slate-500">Image indisponible</span>
          </div>
        )}

        {/* Promo tag badge */}
        {hasPromos && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-red-600 to-orange-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            <span>Prix de gros</span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer ${
            isWishlisted
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
              : 'bg-black/40 text-slate-300 hover:text-white hover:bg-black/60'
          }`}
          aria-label="Ajouter aux favoris"
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Stock tag on bottom of image */}
        <div className="absolute bottom-2 left-2">
          {isOutOfStock ? (
            <span className="bg-red-950/90 text-red-300 border border-red-800/60 text-[9px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm">
              Épuisé
            </span>
          ) : product.stock <= 5 ? (
            <span className="bg-amber-950/90 text-amber-300 border border-amber-800/60 text-[9px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm">
              Reste {product.stock}
            </span>
          ) : (
            <span className="bg-black/60 text-emerald-400 text-[9px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-sm">
              Stock : {product.stock}
            </span>
          )}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-3 flex flex-col flex-1 justify-between">
        <div>
          {/* Title */}
          <h3 className="font-bold text-sm text-slate-100 group-hover:text-amber-300 transition-colors line-clamp-1 leading-snug">
            {product.name}
          </h3>

          {/* Boutique with DRC Flag indicator (matching screenshot) */}
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-sky-400">
            <span className="text-xs" role="img" aria-label="DRC Flag">
              🇨🇩
            </span>
            <span className="truncate hover:underline text-slate-300">
              {boutiqueName}
            </span>
          </div>
        </div>

        {/* Price and Cart Action */}
        <div className="mt-2.5 pt-2 border-t border-slate-800/70 flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-white tracking-tight">
                {formatPrice(displayPrice, product.currency)}
              </span>
              {bestPromoPrice && bestPromoPrice < product.sellingPrice && (
                <span className="text-[11px] text-slate-400 line-through">
                  ${product.sellingPrice}
                </span>
              )}
            </div>
            {/* Secondary currency in CDF (matches screenshot: e.g. ≈ 22 960 CDF) */}
            <div className="text-[10px] text-slate-400 font-medium">
              {formatApproxCdf(displayPrice)}
            </div>
          </div>

          {/* Add to Cart icon */}
          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              isOutOfStock
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : isAdding
                ? 'bg-emerald-500 text-white scale-110'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20 active:scale-95'
            }`}
            title={isOutOfStock ? 'Rupture de stock' : 'Ajouter au panier'}
            aria-label="Ajouter au panier"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
