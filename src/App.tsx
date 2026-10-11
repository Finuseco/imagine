/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Product } from './types/cashpay';
import { fetchCashPayProducts } from './services/cashpayApi';
import { APP_CONFIG } from './config/appConfig';
import { CartProvider } from './context/CartContext';
import { TopBar } from './components/TopBar';
import { BannerCarousel } from './components/BannerCarousel';
import { QuickActions } from './components/QuickActions';
import { FilterTabs, MainTabType, SortOption } from './components/FilterTabs';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { BottomNav, NavTab } from './components/BottomNav';
import { CategoriesView } from './components/CategoriesView';
import { BoutiquesView } from './components/BoutiquesView';
import { ProfileView } from './components/ProfileView';
import {
  AlertCircle,
  RefreshCw,
  ShoppingBag,
  PackageOpen,
} from 'lucide-react';

const WISHLIST_STORAGE_KEY = 'imagine_store_wishlist_v1';

export default function App() {
  return (
    <CartProvider>
      <ImagineStoreApp />
    </CartProvider>
  );
}

function ImagineStoreApp() {
  // Products state directly from API
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeNavTab, setActiveNavTab] = useState<NavTab>('accueil');
  const [activeMainTab, setActiveMainTab] = useState<MainTabType>('recommander');
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(null);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [selectedBoutique, setSelectedBoutique] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('default');

  // Modal and selected product
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Wishlist state
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Toggle Wishlist
  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const next = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.warn('Could not save wishlist:', e);
      }
      return next;
    });
  };

  // Fetch products from configured API endpoint
  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchCashPayProducts();
      if (response && Array.isArray(response.products)) {
        setProducts(response.products);
      } else {
        setProducts([]);
      }
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError('Impossible de charger les produits pour le moment.');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Extract available boutiques
  const availableBoutiques = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.boutique?.name) {
        set.add(p.boutique.name);
      }
    });
    return Array.from(set);
  }, [products]);

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Text Search (name, description, category, barcode, boutique)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.categoryId?.toLowerCase().includes(q) ||
          p.barcode?.toLowerCase().includes(q) ||
          p.boutique?.name?.toLowerCase().includes(q)
      );
    }

    // 2. In stock filter
    if (inStockOnly) {
      result = result.filter((p) => p.stock > 0);
    }

    // 3. Boutique filter
    if (selectedBoutique) {
      result = result.filter((p) => p.boutique?.name === selectedBoutique);
    }

    // 4. Quick Actions filter
    if (activeQuickFilter === 'wishlist') {
      result = result.filter((p) => wishlist.includes(p.id));
    } else if (activeQuickFilter === 'wholesale') {
      result = result.filter(
        (p) => p.promotionalPackages && p.promotionalPackages.length > 0
      );
    } else if (activeQuickFilter === 'bargain') {
      result = result.filter(
        (p) =>
          p.sellingPrice <= 15 ||
          (p.promotionalPackages && p.promotionalPackages.length > 0)
      );
    }

    // 5. Main Tab or Sort option
    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.sellingPrice - b.sellingPrice);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.sellingPrice - a.sellingPrice);
    } else if (sortBy === 'views') {
      result.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
    } else if (activeMainTab === 'nouveau' || activeQuickFilter === 'new_arrival') {
      // Sort by newest createdAt
      result.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    } else {
      // 'recommander' default: rank by viewCount and orderCount
      result.sort((a, b) => {
        const scoreA = (a.orderCount || 0) * 3 + (a.viewCount || 0);
        const scoreB = (b.orderCount || 0) * 3 + (b.viewCount || 0);
        return scoreB - scoreA;
      });
    }

    return result;
  }, [
    products,
    searchQuery,
    inStockOnly,
    selectedBoutique,
    activeQuickFilter,
    wishlist,
    activeMainTab,
    sortBy,
  ]);

  const handleClearAllFilters = () => {
    setInStockOnly(false);
    setSelectedBoutique(null);
    setActiveQuickFilter(null);
    setSortBy('default');
    setSearchQuery('');
  };

  const currentBoutiqueName = products[0]?.boutique?.name;

  return (
    <div className="min-h-screen bg-[#070e1e] text-slate-100 flex flex-col pb-24 md:pb-12 selection:bg-amber-500 selection:text-slate-950">
      {/* Top Header */}
      <TopBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onRefresh={loadProducts}
        isLoading={isLoading}
        boutiqueName={currentBoutiqueName}
        activeNavTab={activeNavTab}
        onNavTabSelect={(tab) => {
          setActiveNavTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto">
        {/* TAB: Accueil */}
        {activeNavTab === 'accueil' && (
          <div className="space-y-2">
            {/* Promo Carousel Banner */}
            <BannerCarousel />

            {/* Quick Action Circles */}
            <QuickActions
              activeQuickFilter={activeQuickFilter}
              onSelectQuickFilter={setActiveQuickFilter}
              wishlistCount={wishlist.length}
            />

            {/* Recommander / Nouveau Tabs & Sub-filters */}
            <FilterTabs
              activeTab={activeMainTab}
              onTabChange={setActiveMainTab}
              sortBy={sortBy}
              onSortChange={setSortBy}
              inStockOnly={inStockOnly}
              onToggleInStockOnly={() => setInStockOnly((prev) => !prev)}
              totalProductsCount={products.length}
              filteredCount={filteredProducts.length}
              availableBoutiques={availableBoutiques}
              selectedBoutique={selectedBoutique}
              onSelectBoutique={setSelectedBoutique}
              activeQuickFilter={activeQuickFilter}
              onClearAllFilters={handleClearAllFilters}
            />

            {/* Products Grid Content */}
            <div className="px-4 py-2">
              {isLoading && products.length === 0 ? (
                /* Loading Skeleton Grid */
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4.5 animate-pulse">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-[#111a33] rounded-2xl border border-slate-800/80 overflow-hidden flex flex-col"
                    >
                      <div className="aspect-square bg-slate-800/60" />
                      <div className="p-3 space-y-2">
                        <div className="h-4 bg-slate-800/80 rounded w-3/4" />
                        <div className="h-3 bg-slate-800/60 rounded w-1/2" />
                        <div className="h-5 bg-slate-800/80 rounded w-1/3 pt-2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                /* Error State */
                <div className="bg-[#121c38] border border-red-500/30 rounded-3xl p-8 text-center max-w-md mx-auto my-8 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto">
                    <AlertCircle className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-white">Erreur de connexion</h3>
                  <p className="text-sm text-slate-300 font-medium">
                    « Impossible de charger les produits pour le moment. »
                  </p>
                  <div className="pt-2 flex items-center justify-center">
                    <button
                      onClick={loadProducts}
                      className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Réessayer</span>
                    </button>
                  </div>
                </div>
              ) : products.length === 0 ? (
                /* Empty API response */
                <div className="bg-[#101b38] border border-slate-800 rounded-3xl p-8 text-center max-w-md mx-auto my-8 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
                    <PackageOpen className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-white">
                    « Aucun produit disponible. »
                  </h3>
                  <p className="text-xs text-slate-400">
                    Cette boutique n'a actuellement aucun produit public disponible.
                  </p>
                  <div className="pt-3 flex items-center justify-center">
                    <button
                      onClick={loadProducts}
                      className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs cursor-pointer shadow-lg shadow-amber-500/20"
                    >
                      Actualiser
                    </button>
                  </div>
                </div>
              ) : filteredProducts.length === 0 ? (
                /* Filter result is empty */
                <div className="bg-[#101b38] border border-slate-800 rounded-2xl p-8 text-center max-w-md mx-auto my-6 space-y-3">
                  <ShoppingBag className="w-10 h-10 text-slate-500 mx-auto" />
                  <h3 className="text-sm font-bold text-white">
                    Aucun article ne correspond à vos filtres
                  </h3>
                  <p className="text-xs text-slate-400">
                    Essayez de réinitialiser vos critères de recherche ou de sélection.
                  </p>
                  <button
                    onClick={handleClearAllFilters}
                    className="mt-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
                  >
                    Effacer tous les filtres
                  </button>
                </div>
              ) : (
                /* Product Grid - 2 cols on mobile, 3 cols tablet, 4-5 cols desktop */
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4.5">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelect={(p) => setSelectedProduct(p)}
                      isWishlisted={wishlist.includes(product.id)}
                      onToggleWishlist={handleToggleWishlist}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: Catégories */}
        {activeNavTab === 'categories' && (
          <CategoriesView
            products={products}
            onSelectProduct={(p) => setSelectedProduct(p)}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onBackToHome={() => setActiveNavTab('accueil')}
          />
        )}

        {/* TAB: Boutiques */}
        {activeNavTab === 'boutiques' && (
          <BoutiquesView
            products={products}
            onSelectProduct={(p) => setSelectedProduct(p)}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
          />
        )}

        {/* TAB: À Propos */}
        {activeNavTab === 'profil' && (
          <ProfileView
            sellerId={APP_CONFIG.SELLER_USER_ID}
            storeId={APP_CONFIG.STORE_ID}
            productsCount={products.length}
            wishlistCount={wishlist.length}
            onViewWishlist={() => {
              setActiveNavTab('accueil');
              setActiveQuickFilter('wishlist');
            }}
          />
        )}
      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        allProducts={products}
        onSelectProduct={(p) => setSelectedProduct(p)}
        onClose={() => setSelectedProduct(null)}
        isWishlisted={selectedProduct ? wishlist.includes(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Bottom Navigation Bar (Mobile only) */}
      <BottomNav
        activeTab={activeNavTab}
        onTabSelect={(tab) => {
          setActiveNavTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
