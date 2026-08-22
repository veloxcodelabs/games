import React from 'react';
import { GamePrice } from '../types';
import { ShieldCheck, Zap, ShoppingCart, Info, Star, Tag } from 'lucide-react';
import { getFallbackGameImageUrl } from '../services/gameArtwork';

interface GameCardProps {
  game: GamePrice;
  onBuy: (game: GamePrice) => void;
  onViewDetails: (game: GamePrice) => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onBuy, onViewDetails }) => {
  const savings =
    game.steamStorePrice && game.steamStorePrice > game.customerPrice
      ? Math.round(((game.steamStorePrice - game.customerPrice) / game.steamStorePrice) * 100)
      : null;

  return (
    <div
      id={`game-card-${game.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-zinc-900/90 border border-zinc-800/90 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-950/20 hover:-translate-y-1"
    >
      {/* Cover Artwork Header */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-950">
        <img
          src={game.coverImage || game.headerImage}
          alt={game.name}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = getFallbackGameImageUrl(game.steamAppId);
          }}
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

        {/* Platform Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1 rounded-md bg-zinc-900/90 backdrop-blur-md px-2 py-0.5 text-[11px] font-semibold text-zinc-200 border border-zinc-700/60 shadow-sm">
            {game.platform || 'PC (Steam / Global)'}
          </span>
        </div>

        {/* Savings Tag */}
        {savings && savings > 0 && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500 px-2 py-0.5 text-[11px] font-bold text-zinc-950 shadow-md">
              <Tag className="h-3 w-3" /> Save {savings}%
            </span>
          </div>
        )}

        {/* Metascore if available */}
        {game.metascore && (
          <div className="absolute bottom-2.5 left-3">
            <span className="inline-flex items-center gap-1 rounded-md bg-zinc-900/85 backdrop-blur-md px-1.5 py-0.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/30">
              <Star className="h-3 w-3 fill-emerald-400 text-emerald-400" />
              <span>{game.metascore}</span>
            </span>
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Title */}
        <h3
          title={game.name}
          className="text-base font-bold text-white line-clamp-1 group-hover:text-emerald-400 transition-colors"
        >
          {game.name}
        </h3>

        {/* Delivery / Guarantee Features */}
        <div className="mt-2 flex items-center gap-3 text-[11px] text-zinc-400">
          <div className="flex items-center gap-1 text-emerald-400">
            <Zap className="h-3 w-3" />
            <span>Digital Activation Key</span>
          </div>
          <div className="flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-teal-400" />
            <span>100% Genuine</span>
          </div>
        </div>

        {/* Price Box & Strikethrough */}
        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-end justify-between">
          <div>
            <div className="text-[11px] font-medium text-zinc-400">
              Lowest Verified Price
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-400">
                {game.currencySymbol}{game.customerPrice.toFixed(2)}
              </span>
              {game.steamStorePrice && game.steamStorePrice > game.customerPrice && (
                <span className="text-xs text-zinc-500 line-through">
                  {game.currencySymbol}{game.steamStorePrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <div className="text-right text-[10px] text-zinc-500">
            <span>Official Feed</span>
            <div className="font-semibold text-zinc-400">In Stock</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            id={`view-details-btn-${game.id}`}
            type="button"
            onClick={() => onViewDetails(game)}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700/80 text-zinc-300 px-3 py-2.5 text-xs font-semibold border border-zinc-700/50 transition-colors cursor-pointer"
          >
            <Info className="h-3.5 w-3.5" />
            <span>Editions</span>
          </button>

          <button
            id={`buy-game-btn-${game.id}`}
            type="button"
            onClick={() => onBuy(game)}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-3 py-2.5 text-xs font-extrabold shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
