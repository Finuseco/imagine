import React from 'react';
import { Heart, Layers, BadgePercent, PackageCheck } from 'lucide-react';

interface QuickActionsProps {
  activeQuickFilter: string | null;
  onSelectQuickFilter: (filter: string | null) => void;
  wishlistCount: number;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  activeQuickFilter,
  onSelectQuickFilter,
  wishlistCount,
}) => {
  const actions = [
    {
      id: 'wishlist',
      label: 'Wish List',
      sub: wishlistCount > 0 ? `(${wishlistCount})` : '',
      icon: Heart,
      color: 'from-blue-600 to-sky-700',
      activeBorder: 'ring-rose-500 text-rose-400',
    },
    {
      id: 'wholesale',
      label: 'Wholesale',
      sub: 'Prix de gros',
      icon: Layers,
      color: 'from-blue-600 to-sky-700',
      activeBorder: 'ring-amber-500 text-amber-400',
    },
    {
      id: 'bargain',
      label: 'Bargain Zone',
      sub: 'Bons plans',
      icon: BadgePercent,
      color: 'from-blue-600 to-sky-700',
      activeBorder: 'ring-emerald-500 text-emerald-400',
    },
    {
      id: 'new_arrival',
      label: 'New Arrival',
      sub: 'Nouveautés',
      icon: PackageCheck,
      color: 'from-blue-600 to-sky-700',
      activeBorder: 'ring-indigo-500 text-indigo-400',
    },
  ];

  return (
    <div className="px-4 py-2.5">
      <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-lg mx-auto">
        {actions.map((act) => {
          const Icon = act.icon;
          const isActive = activeQuickFilter === act.id;

          return (
            <button
              key={act.id}
              onClick={() => onSelectQuickFilter(isActive ? null : act.id)}
              className="flex flex-col items-center group cursor-pointer text-center"
            >
              <div
                className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center bg-gradient-to-b from-[#18284e] to-[#0f1a36] border transition-all duration-200 shadow-md ${
                  isActive
                    ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105 shadow-amber-500/20'
                    : 'border-blue-900/40 hover:border-blue-700/60 group-hover:scale-105'
                }`}
              >
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600/30 flex items-center justify-center text-sky-400 group-hover:text-amber-300 transition-colors ${
                    isActive ? 'text-amber-400 bg-amber-500/20' : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <span
                className={`text-[11px] sm:text-xs font-semibold mt-1.5 transition-colors line-clamp-1 ${
                  isActive ? 'text-amber-400' : 'text-slate-200 group-hover:text-white'
                }`}
              >
                {act.label}
              </span>
              <span className="text-[9px] text-slate-400 hidden sm:block">
                {act.sub}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
