import React from 'react';
import { ArrowUpDown, Check, Filter, X } from 'lucide-react';

export type MainTabType = 'recommander' | 'nouveau';
export type SortOption = 'default' | 'price_asc' | 'price_desc' | 'views';

interface FilterTabsProps {
  activeTab: MainTabType;
  onTabChange: (tab: MainTabType) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  inStockOnly: boolean;
  onToggleInStockOnly: () => void;
  totalProductsCount: number;
  filteredCount: number;
  availableBoutiques: string[];
  selectedBoutique: string | null;
  onSelectBoutique: (boutique: string | null) => void;
  activeQuickFilter: string | null;
  onClearAllFilters: () => void;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({
  activeTab,
  onTabChange,
  sortBy,
  onSortChange,
  inStockOnly,
  onToggleInStockOnly,
  totalProductsCount,
  filteredCount,
  availableBoutiques,
  selectedBoutique,
  onSelectBoutique,
  activeQuickFilter,
  onClearAllFilters,
}) => {
  const hasActiveFilters =
    inStockOnly || selectedBoutique !== null || activeQuickFilter !== null || sortBy !== 'default';

  return (
    <div className="px-4 pt-3 pb-2">
      {/* Primary tabs like the screenshot */}
      <div className="flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-6">
          <button
            onClick={() => onTabChange('recommander')}
            className={`pb-2.5 text-base sm:text-lg font-bold tracking-tight relative transition-colors cursor-pointer ${
              activeTab === 'recommander'
                ? 'text-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Recommander
            {activeTab === 'recommander' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onTabChange('nouveau')}
            className={`pb-2.5 text-base sm:text-lg font-bold tracking-tight relative transition-colors cursor-pointer ${
              activeTab === 'nouveau'
                ? 'text-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Nouveau
            {activeTab === 'nouveau' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" />
            )}
          </button>
        </div>

        <div className="text-xs text-slate-400 font-medium pb-2">
          {filteredCount === totalProductsCount ? (
            <span>{totalProductsCount} produit{totalProductsCount > 1 ? 's' : ''}</span>
          ) : (
            <span>
              <strong className="text-amber-400">{filteredCount}</strong> / {totalProductsCount}
            </span>
          )}
        </div>
      </div>

      {/* Sub-filters chip row */}
      <div className="flex items-center gap-2 overflow-x-auto py-2.5 no-scrollbar text-xs">
        {/* In stock toggle */}
        <button
          onClick={onToggleInStockOnly}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full whitespace-nowrap border transition-all cursor-pointer ${
            inStockOnly
              ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-semibold'
              : 'bg-[#121c36] border-slate-700/60 text-slate-300 hover:border-slate-600'
          }`}
        >
          {inStockOnly && <Check className="w-3 h-3 text-amber-400" />}
          <span>En stock uniquement</span>
        </button>

        {/* Boutiques filter */}
        {availableBoutiques.length > 1 && (
          <div className="flex items-center gap-1.5">
            {availableBoutiques.map((bName) => (
              <button
                key={bName}
                onClick={() => onSelectBoutique(selectedBoutique === bName ? null : bName)}
                className={`px-3 py-1 rounded-full whitespace-nowrap border transition-all cursor-pointer ${
                  selectedBoutique === bName
                    ? 'bg-blue-600/30 border-blue-400 text-sky-200 font-semibold'
                    : 'bg-[#121c36] border-slate-700/60 text-slate-300 hover:border-slate-600'
                }`}
              >
                🏪 {bName}
              </button>
            ))}
          </div>
        )}

        {/* Sort Select */}
        <div className="relative flex items-center ml-auto">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="bg-[#121c36] border border-slate-700/60 text-slate-300 hover:text-white rounded-full px-3 py-1 text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="default">Tri: Standard</option>
            <option value="price_asc">Prix croissant ($ → $$)</option>
            <option value="price_desc">Prix décroissant ($$ → $)</option>
            <option value="views">Plus populaires</option>
          </select>
        </div>

        {/* Clear filters button */}
        {hasActiveFilters && (
          <button
            onClick={onClearAllFilters}
            className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-2 py-1 rounded-full border border-red-500/20 whitespace-nowrap cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span>Effacer filtres</span>
          </button>
        )}
      </div>
    </div>
  );
};
