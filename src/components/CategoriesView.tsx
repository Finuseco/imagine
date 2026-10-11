import React from 'react';
import { Product } from '../types/cashpay';
import { Layers, ChevronRight, Tag } from 'lucide-react';
import { ProductCard } from './ProductCard';

interface CategoriesViewProps {
  products: Product[];
  onSelectProduct: (p: Product) => void;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  onBackToHome: () => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  products,
  onSelectProduct,
  wishlist,
  onToggleWishlist,
}) => {
  // Group products by categoryId
  const categoryMap = new Map<string, Product[]>();

  products.forEach((p) => {
    const cat = p.categoryId || 'Général / Non classé';
    if (!categoryMap.has(cat)) {
      categoryMap.set(cat, []);
    }
    categoryMap.get(cat)!.push(p);
  });

  const categories = Array.from(categoryMap.entries());

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-black text-white">Catégories d'articles</h2>
        </div>
        <span className="text-xs text-slate-400">
          {categories.length} catégorie{categories.length > 1 ? 's' : ''} trouvée{categories.length > 1 ? 's' : ''}
        </span>
      </div>

      {categories.length === 0 ? (
        <div className="p-8 text-center text-slate-400">
          Aucune catégorie disponible.
        </div>
      ) : (
        categories.map(([categoryName, catProducts]) => (
          <div key={categoryName} className="space-y-3">
            <div className="flex items-center justify-between bg-[#101b38] px-4 py-2.5 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-bold text-white capitalize">
                  {categoryName === 'cat-hab' ? 'Habillement, Mode & Vêtements (cat-hab)' : categoryName}
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full">
                {catProducts.length} article{catProducts.length > 1 ? 's' : ''}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4.5">
              {catProducts.map((p) => (
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
        ))
      )}
    </div>
  );
};
