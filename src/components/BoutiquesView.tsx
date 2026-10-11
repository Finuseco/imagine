import React from 'react';
import { Product, Boutique } from '../types/cashpay';
import { Store, MapPin, MessageCircle, UserCheck, PackageCheck } from 'lucide-react';
import { ProductCard } from './ProductCard';

interface BoutiquesViewProps {
  products: Product[];
  onSelectProduct: (p: Product) => void;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
}

export const BoutiquesView: React.FC<BoutiquesViewProps> = ({
  products,
  onSelectProduct,
  wishlist,
  onToggleWishlist,
}) => {
  // Extract distinct boutiques
  const boutiquesMap = new Map<string, { boutique: Boutique; products: Product[] }>();

  products.forEach((p) => {
    if (p.boutique) {
      const bKey = String(p.boutique.id || p.boutique.name);
      if (!boutiquesMap.has(bKey)) {
        boutiquesMap.set(bKey, { boutique: p.boutique, products: [] });
      }
      boutiquesMap.get(bKey)!.products.push(p);
    }
  });

  const list = Array.from(boutiquesMap.values());

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Store className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-black text-white">Boutiques Partenaires</h2>
        </div>
        <span className="text-xs text-slate-400">
          {list.length} boutique{list.length > 1 ? 's' : ''} active{list.length > 1 ? 's' : ''}
        </span>
      </div>

      {list.length === 0 ? (
        <div className="p-8 text-center text-slate-400">
          Aucune boutique enregistrée pour ce vendeur.
        </div>
      ) : (
        list.map(({ boutique, products: bProducts }) => {
          const seller = bProducts[0]?.seller;

          const handleContactWhatsApp = () => {
            const num = boutique.whatsappPublicNumber?.replace(/[^0-9]/g, '');
            const msg = encodeURIComponent(
              `Bonjour ${boutique.name} ! Je vous contacte depuis la vitrine Imagine Store.`
            );
            const url = num ? `https://wa.me/${num}?text=${msg}` : `https://wa.me/?text=${msg}`;
            window.open(url, '_blank');
          };

          return (
            <div
              key={String(boutique.id)}
              className="bg-[#0f1936] border border-slate-800/80 rounded-3xl p-5 space-y-5 shadow-xl"
            >
              {/* Boutique Info Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20 flex-shrink-0">
                    <Store className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-white">
                        {boutique.name}
                      </h3>
                      <span className="text-xs" role="img" aria-label="DRC Flag">
                        🇨🇩
                      </span>
                    </div>
                    {boutique.address && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                        <span>{boutique.address}</span>
                      </div>
                    )}
                    {seller && (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                        <UserCheck className="w-3 h-3 text-sky-400" />
                        <span>Vendeur : {seller.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <button
                    onClick={handleContactWhatsApp}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Contacter</span>
                  </button>
                </div>
              </div>

              {/* Boutique Products */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <PackageCheck className="w-4 h-4 text-amber-400" />
                  <span>Articles disponibles dans cette boutique ({bProducts.length})</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4.5">
                  {bProducts.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onSelect={onSelectProduct}
                      isWishlisted={wishlist.includes(p.id)}
                      onToggleWishlist={onToggleWishlist}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
