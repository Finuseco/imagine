import React, { useState } from 'react';
import {
  ShieldCheck,
  Zap,
  Heart,
  Store,
  DollarSign,
  PackageCheck,
  Truck,
  Sparkles,
  Layers,
  MapPin,
} from 'lucide-react';
import { USD_TO_CDF_RATE } from '../services/cashpayApi';
import { STORE_ASSETS } from '../config/assets';

interface ProfileViewProps {
  sellerId: string;
  storeId?: string | null;
  productsCount: number;
  wishlistCount: number;
  onViewWishlist: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  productsCount,
  wishlistCount,
  onViewWishlist,
}) => {
  const [logoSrc, setLogoSrc] = useState(STORE_ASSETS.LOGO);
  const [logoError, setLogoError] = useState(false);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 text-slate-200">
      {/* Brand Header Card avec Logo Officiel */}
      <div className="bg-gradient-to-br from-[#121f42] via-[#0d1733] to-[#080e22] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 z-10 relative">
          <div className="flex items-center gap-4">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-[#0e1935] border-2 border-amber-500/40 p-1 flex items-center justify-center shadow-xl shadow-amber-500/20 flex-shrink-0 overflow-hidden">
              {!logoError ? (
                <img
                  src={logoSrc}
                  alt="Imagine Store Logo"
                  onError={() => {
                    if (logoSrc !== STORE_ASSETS.LOGO_FALLBACK) {
                      setLogoSrc(STORE_ASSETS.LOGO_FALLBACK);
                    } else {
                      setLogoError(true);
                    }
                  }}
                  className="w-full h-full object-contain"
                />
              ) : (
                <Store className="w-9 h-9 text-amber-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">Imagine Store</h2>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
                  Boutique Officielle
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                La vitrine d'articles de mode, vêtements et accessoires de qualité
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-sky-400">
                <MapPin className="w-3.5 h-3.5" />
                <span>17Tango, Gb, Kintambo (Immeuble Tango) · Kinshasa, RDC 🇨🇩</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-[#0f1a36] border border-slate-800/80 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Catalogue</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">{productsCount}</div>
          <span className="text-[11px] text-emerald-400 font-medium">Article{productsCount > 1 ? 's' : ''} en rayon</span>
        </div>

        <button
          onClick={onViewWishlist}
          className="bg-[#0f1a36] border border-slate-800/80 rounded-2xl p-4 text-left transition hover:border-rose-500/50 cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Favoris</span>
            <Heart className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-white">{wishlistCount}</div>
          <span className="text-[11px] text-rose-400 font-medium">Voir mes favoris →</span>
        </button>

        <div className="bg-[#0f1a36] border border-slate-800/80 rounded-2xl p-4 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Taux Actuel</span>
            <DollarSign className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-xl font-black text-white">1 $ = {USD_TO_CDF_RATE} CDF</div>
          <span className="text-[11px] text-slate-400 font-medium">Équivalent franc congolais</span>
        </div>
      </div>

      {/* Commitments & Quality */}
      <div className="bg-[#0f1a36] border border-slate-800/80 rounded-3xl p-5 space-y-4">
        <div className="flex items-center gap-2 text-white font-black text-sm pb-2 border-b border-slate-800">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Nos Engagements de Qualité</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-[#121f42] border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Articles Authentiques</span>
            </div>
            <p className="text-slate-300">
              Des produits confectionnés avec soin, rigoureusement inspectés avant envoi.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-[#121f42] border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-sky-400 font-bold">
              <Truck className="w-4 h-4" />
              <span>Livraison Rapide</span>
            </div>
            <p className="text-slate-300">
              Expédition directe à Kinshasa, Kasaï-Oriental, Haut-Katanga et dans les provinces.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-[#121f42] border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Layers className="w-4 h-4" />
              <span>Tarifs de Gros Dégressifs</span>
            </div>
            <p className="text-slate-300">
              Bénéficiez de remises immédiates pour vos commandes par lot ou pour la revente.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-[#121f42] border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-teal-400 font-bold">
              <PackageCheck className="w-4 h-4" />
              <span>Assistance Directe</span>
            </div>
            <p className="text-slate-300">
              Service client réactif sur WhatsApp pour répondre à vos questions et confirmer vos tailles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
