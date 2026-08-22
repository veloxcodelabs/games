import React, { useState } from 'react';
import { GamePrice, GameEditionPrice } from '../types';
import {
  X,
  ShoppingCart,
  ShieldCheck,
  Zap,
  Tag,
  Star,
  Layers,
  Globe,
  Sparkles,
} from 'lucide-react';

interface GameDetailsModalProps {
  game: GamePrice;
  onClose: () => void;
  onProceedToBuy: (game: GamePrice, edition: GameEditionPrice | null) => void;
}

export const GameDetailsModal: React.FC<GameDetailsModalProps> = ({
  game,
  onClose,
  onProceedToBuy,
}) => {
  const editions = game.allEditions || [];
  const [selectedEditionIndex, setSelectedEditionIndex] = useState<number>(0);

  const activeEdition = editions[selectedEditionIndex] || null;
  const currentPrice = activeEdition ? activeEdition.customerPrice : game.customerPrice;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto">
      <div
        id="game-details-modal"
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl my-8 ring-1 ring-zinc-800"
      >
        {/* Banner Header Image */}
        <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-zinc-950">
          <img
            src={game.headerImage || game.coverImage}
            alt={game.name}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-center"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

          {/* Close button */}
          <button
            id="close-details-modal-btn"
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 transition-colors backdrop-blur-md"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Title and Badges over Image */}
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
                {game.platform}
              </span>
              {game.metascore && (
                <span className="flex items-center gap-1 rounded-md bg-zinc-900/80 px-2 py-0.5 text-xs font-bold text-emerald-400 border border-zinc-700 backdrop-blur-md">
                  <Star className="h-3 w-3 fill-emerald-400 text-emerald-400" />
                  <span>Metascore: {game.metascore}</span>
                </span>
              )}
            </div>
            <h2 className="text-2xl font-black text-white">{game.name}</h2>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Key Guarantee Features */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 rounded-2xl bg-zinc-900/80 p-3.5 border border-zinc-800 text-center">
            <div className="flex flex-col items-center">
              <Zap className="h-4 w-4 text-emerald-400 mb-1" />
              <span className="text-[11px] font-bold text-white">Digital Delivery</span>
              <span className="text-[10px] text-zinc-400">Direct code & email</span>
            </div>
            <div className="flex flex-col items-center border-x border-zinc-800">
              <ShieldCheck className="h-4 w-4 text-teal-400 mb-1" />
              <span className="text-[11px] font-bold text-white">100% Guaranteed</span>
              <span className="text-[10px] text-zinc-400">Direct Genuine License</span>
            </div>
            <div className="flex flex-col items-center">
              <Globe className="h-4 w-4 text-cyan-400 mb-1" />
              <span className="text-[11px] font-bold text-white">Global Region</span>
              <span className="text-[10px] text-zinc-400">Worldwide Activation</span>
            </div>
          </div>

          {/* Editions Selector if multiple */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-emerald-400" />
                <span>Select Game Edition</span>
              </label>
              <span className="text-[11px] text-zinc-400 font-mono">
                {editions.length} options indexed
              </span>
            </div>

            <div className="space-y-2">
              {editions.map((edition, idx) => (
                <div
                  key={idx}
                  id={`edition-option-${idx}`}
                  onClick={() => setSelectedEditionIndex(idx)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedEditionIndex === idx
                      ? 'border-emerald-500 bg-emerald-500/10 text-white shadow-sm'
                      : 'border-zinc-800/90 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900'
                  }`}
                >
                  <div>
                    <div className="text-sm font-bold text-zinc-100">{edition.edition}</div>
                    <div className="text-[11px] text-zinc-400 flex items-center gap-2 mt-0.5">
                      <span>Region: {edition.region}</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-medium">Verified Direct License</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-black text-emerald-400">
                      {game.currencySymbol}{edition.customerPrice.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      Digital Key
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price & Checkout Footer */}
          <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
            <div>
              <div className="text-xs text-zinc-400 font-medium">Total Price:</div>
              <div className="text-2xl font-black text-emerald-400">
                {game.currencySymbol}{currentPrice.toFixed(2)}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                id="details-proceed-buy-btn"
                type="button"
                onClick={() => {
                  onClose();
                  onProceedToBuy(game, activeEdition);
                }}
                className="flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-6 py-3 text-sm font-extrabold shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Buy Now ({game.currencySymbol}{currentPrice.toFixed(2)})</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
