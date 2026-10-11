import React, { useState } from 'react';
import { Search, ShoppingCart, RefreshCw, X, Home, Layers, User, Store } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { NavTab } from './BottomNav';
import { STORE_ASSETS } from '../config/assets';

interface TopBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
  boutiqueName?: string;
  activeNavTab: NavTab;
  onNavTabSelect: (tab: NavTab) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  searchQuery,
  onSearchChange,
  onRefresh,
  isLoading,
  activeNavTab,
  onNavTabSelect,
}) => {
  const { totalItemsCount, setIsCartOpen } = useCart();
  const [logoSrc, setLogoSrc] = useState(STORE_ASSETS.LOGO);
  const [logoError, setLogoError] = useState(false);

  const handleLogoError = () => {
    if (logoSrc !== STORE_ASSETS.LOGO_FALLBACK) {
      setLogoSrc(STORE_ASSETS.LOGO_FALLBACK);
    } else {
      setLogoError(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#070d1e]/95 backdrop-blur-md border-b border-slate-800/80 transition-all">
      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between gap-3 sm:gap-6">
        {/* Brand / Logo officiel Imagine Store */}
        <div
          onClick={() => onNavTabSelect('accueil')}
          className="flex items-center gap-2.5 flex-shrink-0 cursor-pointer group"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#0e1935] border border-amber-500/30 overflow-hidden flex items-center justify-center shadow-lg shadow-orange-500/15 group-hover:scale-105 transition-all p-0.5">
            {!logoError ? (
              <img
                src={logoSrc}
                alt="Logo Imagine Store"
                onError={handleLogoError}
                className="w-full h-full object-contain object-center"
              />
            ) : (
              <Store className="w-6 h-6 text-amber-400" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base sm:text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-amber-200 bg-clip-text text-transparent leading-none">
              Imagine Store
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wide mt-0.5">
              Boutique Officielle
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Rechercher chaussures, mocassins, vêtements..."
              className="w-full bg-[#131d3a] border border-slate-700/60 rounded-full pl-9 pr-9 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 text-slate-400 hover:text-slate-200 p-0.5 rounded-full"
                aria-label="Effacer la recherche"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => onNavTabSelect('accueil')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeNavTab === 'accueil'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Accueil</span>
          </button>

          <button
            onClick={() => onNavTabSelect('categories')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeNavTab === 'categories'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Catégories</span>
          </button>

          <button
            onClick={() => onNavTabSelect('boutiques')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeNavTab === 'boutiques'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Boutiques</span>
          </button>

          <button
            onClick={() => onNavTabSelect('profil')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeNavTab === 'profil'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>À Propos</span>
          </button>
        </nav>

        {/* Right Actions: Refresh + Cart Icon with badge */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-[#131d3a] hover:bg-[#1a264a] border border-slate-700/60 text-slate-300 hover:text-white transition disabled:opacity-50 cursor-pointer"
            title="Actualiser le catalogue"
            aria-label="Actualiser"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 sm:px-3.5 sm:py-2.5 rounded-xl bg-[#131d3a] hover:bg-[#1a264a] border border-slate-700/60 text-slate-200 transition-colors cursor-pointer flex items-center gap-2"
            title="Voir le panier"
          >
            <ShoppingCart className="w-5 h-5 text-slate-200" />
            <span className="hidden sm:inline text-xs font-bold text-slate-200">Panier</span>
            {totalItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 sm:relative sm:top-auto sm:right-auto bg-gradient-to-r from-orange-500 to-red-500 text-white text-[11px] font-bold min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                {totalItemsCount > 99 ? '99+' : totalItemsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
