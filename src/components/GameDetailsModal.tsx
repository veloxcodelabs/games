import React, { useState } from 'react';
import { GamePrice, GameEditionPrice, MerchantDeal } from '../types';
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
  Ticket,
  Copy,
  Check,
  ExternalLink,
  Info,
} from 'lucide-react';
import { getFallbackGameImageUrl } from '../services/gameArtwork';
import { STORES, getMerchantDeals } from '../services/gamePriceService';

interface GameDetailsModalProps {
  game: GamePrice;
  onClose: () => void;
  onProceedToBuy?: (game: GamePrice, edition: GameEditionPrice | null) => void;
}

export const GameDetailsModal: React.FC<GameDetailsModalProps> = ({
  game,
  onClose,
}) => {
  const [copiedStore, setCopiedStore] = useState<string | null>(null);
  const [copiedCodeStore, setCopiedCodeStore] = useState<string | null>(null);
  const editions = game.allEditions || [];
  const [selectedEditionIndex, setSelectedEditionIndex] = useState<number>(0);

  const activeEdition = editions[selectedEditionIndex] || null;
  const currentPrice = activeEdition ? activeEdition.customerPrice : game.customerPrice;
  const gameTitle = game.external || game.name;

  const deals: MerchantDeal[] =
    game.merchantDeals && game.merchantDeals.length > 0
      ? game.merchantDeals
      : getMerchantDeals(gameTitle);

  const g2aDeal = deals.find((d) => d.storeName.toUpperCase() === 'G2A') || {
    storeName: 'G2A',
    voucherCode: STORES.g2a.voucherCode,
    discountText: STORES.g2a.discountText,
    affiliateUrl: STORES.g2a.getAffiliateUrl(gameTitle),
  };

  const gamivoDeal = deals.find((d) => d.storeName.toUpperCase() === 'GAMIVO') || {
    storeName: 'GAMIVO',
    voucherCode: STORES.gamivo.voucherCode,
    discountText: STORES.gamivo.discountText,
    affiliateUrl: STORES.gamivo.getAffiliateUrl(gameTitle),
  };

  const kinguinDeal = deals.find((d) => d.storeName.toUpperCase() === 'KINGUIN') || {
    storeName: 'Kinguin',
    voucherCode: STORES.kinguin.voucherCode,
    discountText: STORES.kinguin.discountText,
    affiliateUrl: STORES.kinguin.getAffiliateUrl(gameTitle),
  };

  const handleCopyCodeOnly = (deal: MerchantDeal) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(deal.voucherCode).catch(() => {});
    }
    setCopiedCodeStore(deal.storeName);
    setTimeout(() => {
      setCopiedCodeStore((prev) => (prev === deal.storeName ? null : prev));
    }, 2000);
  };

  const handleCopyAndBuy = (deal: MerchantDeal) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(deal.voucherCode).catch(() => {});
    }
    setCopiedStore(deal.storeName);
    setTimeout(() => {
      setCopiedStore((prev) => (prev === deal.storeName ? null : prev));
    }, 2500);

    window.open(deal.affiliateUrl, '_blank', 'noopener,noreferrer');
  };

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
            alt={gameTitle}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-center"
            onError={(e) => {
              (e.target as HTMLImageElement).src = getFallbackGameImageUrl(game.steamAppId);
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

          {/* Close button */}
          <button
            id="close-details-modal-btn"
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 transition-colors backdrop-blur-md cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Title and Badges over Image */}
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
                {game.platform || 'PC (Digital Key)'}
              </span>
              {game.metascore && (
                <span className="flex items-center gap-1 rounded-md bg-zinc-900/80 px-2 py-0.5 text-xs font-bold text-emerald-400 border border-zinc-700 backdrop-blur-md">
                  <Star className="h-3 w-3 fill-emerald-400 text-emerald-400" />
                  <span>Metascore: {game.metascore}</span>
                </span>
              )}
            </div>
            <h2 className="text-2xl font-black text-white">{gameTitle}</h2>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Key Guarantee Features */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 rounded-2xl bg-zinc-900/80 p-3.5 border border-zinc-800 text-center">
            <div className="flex flex-col items-center">
              <Zap className="h-4 w-4 text-emerald-400 mb-1" />
              <span className="text-[11px] font-bold text-white">Digital Delivery</span>
              <span className="text-[10px] text-zinc-400">Instant code & email</span>
            </div>
            <div className="flex flex-col items-center border-x border-zinc-800">
              <ShieldCheck className="h-4 w-4 text-teal-400 mb-1" />
              <span className="text-[11px] font-bold text-white">100% Guaranteed</span>
              <span className="text-[10px] text-zinc-400">Verified Stores</span>
            </div>
            <div className="flex flex-col items-center">
              <Globe className="h-4 w-4 text-cyan-400 mb-1" />
              <span className="text-[11px] font-bold text-white">Global Region</span>
              <span className="text-[10px] text-zinc-400">Worldwide Activation</span>
            </div>
          </div>

          {/* Dedicated G2A, GAMIVO & Kinguin Channels with Vouchers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2.5 flex items-center justify-between">
              <span>Partner Store Deals</span>
              <span className="text-[11px] font-medium text-emerald-400">Exclusive Voucher Discounts</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* G2A Deal Option */}
              <div className="flex flex-col justify-between gap-3 rounded-2xl bg-zinc-900/70 border border-amber-500/30 p-3.5 hover:border-amber-500/50 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-sm text-amber-400">G2A</span>
                    <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                      {g2aDeal.discountText}
                    </span>
                  </div>
                  <span className="text-[10px] font-medium text-zinc-400">Global Key</span>
                </div>

                {/* Voucher code box */}
                <div className="flex items-center justify-between gap-2 bg-zinc-950/80 rounded-lg p-2 px-2.5 border border-zinc-800">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-amber-400/90">
                      Voucher Code
                    </span>
                    <span className="font-mono text-xs font-bold text-zinc-100 flex items-center gap-1">
                      <Ticket className="h-3 w-3 text-amber-400" />
                      {g2aDeal.voucherCode}
                    </span>
                  </div>

                  <button
                    type="button"
                    title="Copy voucher code to clipboard"
                    onClick={() => handleCopyCodeOnly(g2aDeal)}
                    className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/80 transition-colors cursor-pointer"
                  >
                    {copiedCodeStore === 'G2A' ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 text-zinc-400" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyAndBuy(g2aDeal)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 px-3 py-2.5 text-xs font-extrabold shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  {copiedStore === 'G2A' ? (
                    <>
                      <Check className="h-4 w-4 stroke-[3]" />
                      <span>Code Copied! Opening G2A...</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Code &amp; Buy on G2A</span>
                      <ExternalLink className="h-3.5 w-3.5 opacity-80" />
                    </>
                  )}
                </button>
              </div>

              {/* GAMIVO Deal Option */}
              <div className="flex flex-col justify-between gap-3 rounded-2xl bg-zinc-900/70 border border-emerald-500/30 p-3.5 hover:border-emerald-500/50 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-sm text-emerald-400">GAMIVO</span>
                    <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                      {gamivoDeal.discountText}
                    </span>
                  </div>
                  <span className="text-[10px] font-medium text-zinc-400">Official Merchant</span>
                </div>

                {/* Voucher code box */}
                <div className="flex items-center justify-between gap-2 bg-zinc-950/80 rounded-lg p-2 px-2.5 border border-zinc-800">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-emerald-400/90">
                      Voucher Code
                    </span>
                    <span className="font-mono text-xs font-bold text-zinc-100 flex items-center gap-1">
                      <Ticket className="h-3 w-3 text-emerald-400" />
                      {gamivoDeal.voucherCode}
                    </span>
                  </div>

                  <button
                    type="button"
                    title="Copy voucher code to clipboard"
                    onClick={() => handleCopyCodeOnly(gamivoDeal)}
                    className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/80 transition-colors cursor-pointer"
                  >
                    {copiedCodeStore === 'GAMIVO' ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 text-zinc-400" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyAndBuy(gamivoDeal)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 px-3 py-2.5 text-xs font-extrabold shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  {copiedStore === 'GAMIVO' ? (
                    <>
                      <Check className="h-4 w-4 stroke-[3]" />
                      <span>Code Copied! Opening GAMIVO...</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Code &amp; Buy on GAMIVO</span>
                      <ExternalLink className="h-3.5 w-3.5 opacity-80" />
                    </>
                  )}
                </button>
              </div>

              {/* Kinguin Deal Option */}
              <div className="flex flex-col justify-between gap-3 rounded-2xl bg-zinc-900/70 border border-orange-500/30 p-3.5 hover:border-orange-500/50 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-sm text-orange-400">Kinguin</span>
                    <span className="text-[10px] font-bold text-orange-300 bg-orange-500/20 px-2 py-0.5 rounded border border-orange-500/30">
                      {kinguinDeal.discountText}
                    </span>
                  </div>
                  <span className="text-[10px] font-medium text-zinc-400">Global Key</span>
                </div>

                {/* Voucher code box */}
                <div className="flex items-center justify-between gap-2 bg-zinc-950/80 rounded-lg p-2 px-2.5 border border-zinc-800">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-orange-400/90">
                      Voucher Code
                    </span>
                    <span className="font-mono text-xs font-bold text-zinc-100 flex items-center gap-1">
                      <Ticket className="h-3 w-3 text-orange-400" />
                      {kinguinDeal.voucherCode}
                    </span>
                  </div>

                  <button
                    type="button"
                    title="Copy voucher code to clipboard"
                    onClick={() => handleCopyCodeOnly(kinguinDeal)}
                    className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/80 transition-colors cursor-pointer"
                  >
                    {copiedCodeStore === 'Kinguin' ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 text-zinc-400" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyAndBuy(kinguinDeal)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-400 hover:via-amber-400 hover:to-yellow-400 text-zinc-950 px-3 py-2.5 text-xs font-extrabold shadow-md shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  {copiedStore === 'Kinguin' ? (
                    <>
                      <Check className="h-4 w-4 stroke-[3]" />
                      <span>Code Copied! Opening Kinguin...</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Code &amp; Buy on Kinguin</span>
                      <ExternalLink className="h-3.5 w-3.5 opacity-80" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Price & Close Footer */}
          <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
            <div>
              <div className="text-xs text-zinc-400 font-medium">Lowest Tracked Price:</div>
              <div className="text-2xl font-black text-emerald-400">
                {game.currencySymbol}{currentPrice.toFixed(2)}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
