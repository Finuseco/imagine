import React from 'react';
import { Home, Layers, Store, ShoppingCart, User } from 'lucide-react';
import { useCart } from '../context/CartContext';

export type NavTab = 'accueil' | 'categories' | 'boutiques' | 'panier' | 'profil';

interface BottomNavProps {
  activeTab: NavTab;
  onTabSelect: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabSelect }) => {
  const { totalItemsCount, setIsCartOpen } = useCart();

  const handleSelect = (tab: NavTab) => {
    if (tab === 'panier') {
      setIsCartOpen(true);
    } else {
      onTabSelect(tab);
    }
  };

  const navItems = [
    { id: 'accueil' as NavTab, label: 'Accueil', icon: Home },
    { id: 'categories' as NavTab, label: 'Catégories', icon: Layers },
    { id: 'boutiques' as NavTab, label: 'Boutiques', icon: Store },
    { id: 'panier' as NavTab, label: 'Panier', icon: ShoppingCart, badge: totalItemsCount },
    { id: 'profil' as NavTab, label: 'Mon Imagine', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#070d1e]/98 backdrop-blur-lg border-t border-slate-800/90 py-1.5 px-2 safe-bottom transition-all md:hidden">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className="flex flex-col items-center justify-center flex-1 py-1 relative cursor-pointer group transition-colors"
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-amber-400 stroke-[2.4]' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-gradient-to-r from-red-600 to-orange-500 text-white text-[10px] font-black min-w-[17px] h-[17px] px-1 rounded-full flex items-center justify-center shadow-md animate-pulse">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] mt-1 font-semibold transition-colors ${
                  isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-300'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
