import React, { useState } from 'react';
import { Product, ProductVariation } from '../types/cashpay';
import { formatPrice, formatApproxCdf } from '../services/cashpayApi';
import {
  X,
  Share2,
  Heart,
  ShoppingCart,
  MessageCircle,
  Truck,
  ShieldCheck,
  Store,
  UserCheck,
  Barcode,
  Package,
  Eye,
  ShoppingBag,
  Star,
  Check,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { APP_CONFIG } from '../config/appConfig';

interface ProductDetailModalProps {
  product: Product | null;
  allProducts: Product[];
  onSelectProduct: (product: Product) => void;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  allProducts,
  onSelectProduct,
  onClose,
  isWishlisted,
  onToggleWishlist,
}) => {
  const { addToCart } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Reset internal selection when product changes
  React.useEffect(() => {
    setSelectedImageIndex(0);
    setSelectedVariation(null);
    setQuantity(1);
    setAddedSuccess(false);
  }, [product?.id]);

  if (!product) return null;

  // Filter similar products
  const similarProducts = (allProducts || [])
    .filter((p) => p.id !== product.id)
    .sort((a, b) => {
      const scoreA = (a.boutique?.id === product.boutique?.id ? 2 : 0) + (a.categoryId === product.categoryId ? 1 : 0);
      const scoreB = (b.boutique?.id === product.boutique?.id ? 2 : 0) + (b.categoryId === product.categoryId ? 1 : 0);
      return scoreB - scoreA;
    });

  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const activeImage = images[selectedImageIndex] || product.image;

  const hasVariations = product.variations && product.variations.length > 0;
  const hasPromos = product.promotionalPackages && product.promotionalPackages.length > 0;
  const hasShipping = product.shippingRates && product.shippingRates.length > 0;
  const isOutOfStock = product.stock <= 0;

  // Calculate price according to selected quantity if promotionalPackages exist
  const getUnitPrice = (qty: number) => {
    if (product.promotionalPackages && product.promotionalPackages.length > 0) {
      const sorted = [...product.promotionalPackages].sort((a, b) => b.quantity - a.quantity);
      const matched = sorted.find((p) => qty >= p.quantity);
      if (matched && matched.price < product.sellingPrice) {
        return matched.price;
      }
    }
    return product.sellingPrice;
  };

  const currentUnitPrice = getUnitPrice(quantity);
  const totalPrice = currentUnitPrice * quantity;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity, selectedVariation);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  // WhatsApp order
  const handleDirectBuyWhatsApp = () => {
    const variationDesc = selectedVariation
      ? `\n• Variante choisie : ${selectedVariation.color || ''} ${selectedVariation.size || ''}`
      : '';

    const promoNotice =
      currentUnitPrice < product.sellingPrice
        ? ` (Tarif dégressif de gros appliqué : $${currentUnitPrice}/unité)`
        : '';

    const message = encodeURIComponent(
      `Bonjour ! Je souhaite commander sur Imagine Store :\n\n` +
        `📦 *${product.name}*\n` +
        `• Quantité : ${quantity}${variationDesc}\n` +
        `• Prix unitaire : $${currentUnitPrice} USD${promoNotice}\n` +
        `• Total estimé : $${totalPrice} USD (${formatApproxCdf(totalPrice)})\n` +
        `• Réf Produit : #${product.id}\n` +
        (product.boutique?.name ? `• Boutique : ${product.boutique.name}\n` : '') +
        `\nPourriez-vous me confirmer la disponibilité et les modalités de livraison ? Merci !`
    );

    const whatsappNumber = product.boutique?.whatsappPublicNumber?.replace(/[^0-9]/g, '');
    const waUrl = whatsappNumber
      ? `https://wa.me/${whatsappNumber}?text=${message}`
      : `https://wa.me/?text=${message}`;

    window.open(waUrl, '_blank');
  };

  // Buy directly / Join the original store
  const handleJoinOriginalStore = () => {
    const baseUrl = APP_CONFIG.API_BASE_URL.replace(/\/+$/, '');
    const directUrl = product.boutique?.id
      ? `${baseUrl}/public/store/${product.boutique.id}`
      : `${baseUrl}`;
    window.open(directUrl, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: product.name,
          text: `Découvrez ${product.name} sur Imagine Store pour $${product.sellingPrice}`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl max-h-[94vh] sm:max-h-[90vh] bg-[#0c142b] border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10">
        {/* Floating Top Controls Overlay */}
        <div className="px-4 py-3 border-b border-slate-800/80 flex items-center justify-between bg-[#0e1834] sticky top-0 z-20">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
              Fiche Produit
            </span>
            <span className="text-xs text-slate-400 truncate">
              #{product.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
              title="Partager le produit"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{copiedLink ? 'Lien copié !' : 'Partager'}</span>
            </button>
            <button
              onClick={() => onToggleWishlist(product.id)}
              className={`p-2 rounded-xl transition cursor-pointer ${
                isWishlisted
                  ? 'bg-rose-500 text-white'
                  : 'bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white'
              }`}
              title="Favoris"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer ml-1"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div id="modal-scroll-area" className="overflow-y-auto p-4 sm:p-6 space-y-5 flex-1 text-slate-200">
          {/* Main Product Hero Image - Rempli entièrement avec object-cover & bord arrondi */}
          <div className="space-y-3">
            <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full rounded-2xl overflow-hidden bg-[#070b18] border border-slate-800 shadow-xl group">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
              />

              {/* Tag promo */}
              {hasPromos && (
                <div className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-amber-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg">
                  Tarif dégressif de gros
                </div>
              )}

              {/* Image counter */}
              <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md text-white font-bold text-xs px-2.5 py-1 rounded-lg border border-white/10">
                {selectedImageIndex + 1} / {images.length}
              </div>

              {/* Direct image arrows if multiple */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length)
                    }
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-sm cursor-pointer"
                    aria-label="Image précédente"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedImageIndex((prev) => (prev + 1) % images.length)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-sm cursor-pointer"
                    aria-label="Image suivante"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails row */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all cursor-pointer bg-[#070b18] ${
                      selectedImageIndex === idx
                        ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105'
                        : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Pricing Card */}
          <div className="bg-[#101b38] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 mb-1">
                <span>🇨🇩</span>
                <span>{product.boutique?.name || 'Imagine Boutique'}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {product.name}
              </h1>

              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-400">
                {product.barcode && (
                  <span className="flex items-center gap-1 font-mono bg-slate-800/80 px-2 py-0.5 rounded">
                    <Barcode className="w-3.5 h-3.5 text-amber-400" />
                    {product.barcode}
                  </span>
                )}
                {product.categoryId && (
                  <span className="bg-blue-900/40 text-sky-300 px-2 py-0.5 rounded">
                    Catégorie : {product.categoryId}
                  </span>
                )}
              </div>
            </div>

            {/* Price display */}
            <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight">
                    {formatPrice(currentUnitPrice, product.currency)}
                  </span>
                  {currentUnitPrice < product.sellingPrice && (
                    <span className="text-sm text-slate-400 line-through">
                      ${product.sellingPrice}
                    </span>
                  )}
                  <span className="text-xs text-slate-400 font-medium">/ unité</span>
                </div>
                <div className="text-sm font-semibold text-slate-300 mt-0.5">
                  {formatApproxCdf(currentUnitPrice)}
                </div>
              </div>

              {/* Stock status */}
              <div>
                {isOutOfStock ? (
                  <span className="inline-flex items-center gap-1 bg-red-950 text-red-300 border border-red-800 text-xs font-bold px-3 py-1 rounded-full">
                    Rupture de stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-semibold px-3 py-1 rounded-full">
                    <Check className="w-3 h-3 text-emerald-400" />
                    En stock ({product.stock} disponibles)
                  </span>
                )}
              </div>
            </div>

            {/* Wholesale promo packages if present */}
            {hasPromos && (
              <div className="mt-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-2">
                  🔥 Tarifs dégressifs pour commande en gros :
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {product.promotionalPackages!.map((pkg, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg border flex items-center justify-between transition cursor-pointer ${
                        quantity >= pkg.quantity
                          ? 'bg-amber-500/25 border-amber-400 text-amber-200 font-bold'
                          : 'bg-[#0e1730] border-slate-700/60 text-slate-300 hover:border-amber-500/40'
                      }`}
                      onClick={() => setQuantity(pkg.quantity)}
                    >
                      <span>Dès {pkg.quantity} pièces</span>
                      <span className="text-amber-400 font-black">
                        ${pkg.price} USD / pc
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Variations selector */}
          {hasVariations && (
            <div className="bg-[#101b38] border border-slate-800 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Choisir une variante :
                </label>
                {selectedVariation && (
                  <button
                    onClick={() => setSelectedVariation(null)}
                    className="text-[11px] text-amber-400 hover:underline cursor-pointer"
                  >
                    Réinitialiser
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {product.variations!.map((v, idx) => {
                  const isSelected =
                    selectedVariation?.color === v.color && selectedVariation?.size === v.size;
                  const label = v.color || v.size || `Option #${idx + 1}`;

                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedVariation(v)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500 border-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/30'
                          : 'bg-[#152347] border-slate-700 text-slate-200 hover:border-slate-500'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      <span>{label}</span>
                      {v.stock !== undefined && (
                        <span
                          className={`text-[10px] ml-1 px-1.5 py-0.2 rounded-full ${
                            isSelected
                              ? 'bg-slate-900/30 text-slate-900'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {v.stock}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="bg-[#101b38] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Description de l'article
            </h2>
            <div className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">
              {product.description || 'Aucune description détaillée.'}
            </div>
          </div>

          {/* Shipping Rates Breakdown */}
          {hasShipping && (
            <div className="bg-[#101b38] border border-slate-800 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                <Truck className="w-4 h-4 text-sky-400" />
                <span>Tarifs d'expédition :</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {product.shippingRates!.map((rate, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-[#142246] border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold text-slate-200">
                        {rate.province}
                      </span>
                      <span className="text-[10px] text-slate-400 ml-1.5">
                        ({rate.country})
                      </span>
                    </div>
                    <span className="font-bold text-amber-400">
                      ${rate.rate} USD
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Boutique Details & Direct Store Link */}
          {product.boutique && (
            <div className="bg-[#101b38] border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-100 text-sm">
                    {product.boutique.name}
                  </div>
                  <div className="text-xs text-slate-400">
                    {product.boutique.address || 'Kinshasa, RD Congo'}
                  </div>
                </div>
              </div>

              <button
                onClick={handleJoinOriginalStore}
                className="px-3.5 py-2 rounded-xl bg-[#142246] hover:bg-[#1a2d5a] border border-slate-700 text-xs font-bold text-sky-300 flex items-center gap-1.5 cursor-pointer transition self-start sm:self-auto"
              >
                <span>Voir le magasin d'origine</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Similar Products Section */}
          {similarProducts.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-slate-800/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <h3 className="text-sm font-extrabold text-white tracking-tight">
                    Produits similaires & recommandations
                  </h3>
                </div>
                <span className="text-xs text-slate-400">
                  {similarProducts.length} article{similarProducts.length > 1 ? 's' : ''}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {similarProducts.map((simProduct) => (
                  <div
                    key={simProduct.id}
                    onClick={() => {
                      onSelectProduct(simProduct);
                      const scrollElem = document.getElementById('modal-scroll-area');
                      if (scrollElem) scrollElem.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="group bg-[#111a33] hover:bg-[#162347] border border-slate-800/90 hover:border-slate-700 rounded-2xl p-2.5 transition-all duration-200 cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-square rounded-xl overflow-hidden bg-[#070b18] mb-2 relative">
                        <img
                          src={simProduct.image}
                          alt={simProduct.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        {simProduct.stock <= 0 && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="text-[10px] text-red-300 font-bold bg-red-950/80 px-2 py-0.5 rounded">
                              Épuisé
                            </span>
                          </div>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-slate-200 group-hover:text-amber-300 line-clamp-1">
                        {simProduct.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate">
                        {simProduct.boutique?.name || 'Imagine Store'}
                      </p>
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-slate-800 flex items-baseline justify-between">
                      <span className="text-xs font-black text-amber-400">
                        {formatPrice(simProduct.sellingPrice, simProduct.currency)}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {formatApproxCdf(simProduct.sellingPrice)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Bottom Actions Bar */}
        <div className="p-3.5 sm:p-4 bg-[#0e1834] border-t border-slate-800 flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            {/* Quantity selector */}
            <div className="flex items-center justify-between gap-2 bg-[#142246] px-2.5 py-2 rounded-xl border border-slate-700/80 flex-shrink-0">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center font-bold text-sm cursor-pointer"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="font-extrabold text-sm text-white w-5 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock || 999, q + 1))}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center font-bold text-sm cursor-pointer"
                disabled={product.stock > 0 && quantity >= product.stock}
              >
                +
              </button>
            </div>

            {/* Add to Cart button */}
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex-1 py-3 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md ${
                isOutOfStock
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : addedSuccess
                  ? 'bg-emerald-500 text-white'
                  : 'bg-[#182952] hover:bg-[#20366b] text-white border border-slate-700'
              }`}
            >
              {addedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Ajouté !</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>Ajouter au panier</span>
                </>
              )}
            </button>
          </div>

          {/* Primary Action Buttons: WhatsApp & Acheter directement */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleDirectBuyWhatsApp}
              disabled={isOutOfStock}
              className={`py-3 px-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer shadow-lg ${
                isOutOfStock
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-emerald-600/20'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span>Commander via WhatsApp</span>
            </button>

            <button
              onClick={handleJoinOriginalStore}
              className="py-3 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 transition cursor-pointer shadow-lg shadow-amber-500/20 active:scale-[0.99]"
            >
              <ExternalLink className="w-4 h-4 stroke-[2.5]" />
              <span>Acheter directement</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
