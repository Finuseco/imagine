import React, { useState } from 'react';
import { STORE_ASSETS } from '../config/assets';
import { Sparkles, ShoppingBag, ShieldCheck, Truck, ArrowRight } from 'lucide-react';

export const BannerCarousel: React.FC = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(STORE_ASSETS.BANNER);

  const handleImageError = () => {
    // Si l'asset local échoue pour une raison quelconque, basculer sur l'URL directe Google Drive
    if (imgSrc !== STORE_ASSETS.BANNER_FALLBACK) {
      setImgSrc(STORE_ASSETS.BANNER_FALLBACK);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl mx-3 sm:mx-4 my-3 sm:my-4 shadow-2xl border border-slate-800/90 group bg-[#091124]">
      {/* Container de la bannière avec hauteur responsive optimisée */}
      <div className="relative w-full aspect-[21/9] min-h-[160px] sm:min-h-[220px] md:min-h-[260px] max-h-[340px] overflow-hidden flex items-center justify-center">
        {/* Image officielle de la bannière */}
        <img
          src={imgSrc}
          alt="Bannière Imagine Store"
          onLoad={() => setImageLoaded(true)}
          onError={handleImageError}
          className={`w-full h-full object-cover object-center transition-all duration-700 ${
            imageLoaded ? 'scale-100 blur-0' : 'scale-105 blur-sm'
          } group-hover:scale-[1.02]`}
        />

        {/* Dégradé d'accentuation en superposition pour la lisibilité et l'élégance */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070e1e]/90 via-[#070e1e]/30 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070e1e]/60 via-transparent to-transparent pointer-events-none" />

        {/* Badges superposés discrets sur la bannière */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex items-center gap-2">
          <span className="bg-amber-500 text-slate-950 font-black text-[10px] sm:text-xs uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Vitrine Officielle</span>
          </span>
          <span className="hidden sm:inline-flex bg-black/60 backdrop-blur-md text-amber-300 border border-amber-500/30 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full">
            Nouvelle Collection
          </span>
        </div>

        {/* Texte et engagements en bas de bannière */}
        <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-10 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-2xl font-black text-white tracking-tight drop-shadow-md">
              Imagine Store
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-200/90 max-w-md drop-shadow line-clamp-1 font-medium">
              Mode raffinée, chaussures de luxe et confection élégante
            </p>
          </div>

          <div className="hidden md:flex items-center gap-3 text-[11px] text-slate-200 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Qualité Certifiée
            </span>
            <span className="flex items-center gap-1 text-sky-400 font-semibold">
              <Truck className="w-3.5 h-3.5" />
              Livraison Kinshasa & RDC
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
