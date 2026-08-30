import React, { useState } from 'react';
import { GamePrice, MerchantDeal } from '../types';
import { ShieldCheck, Zap, ExternalLink, Star, Tag, Copy, Check, Ticket, Info } from 'lucide-react';
import { getFallbackGameImageUrl } from '../services/gameArtwork';
import { STORES, getMerchantDeals } from '../services/gamePriceService';

interface GameCardProps {
  game: GamePrice;
  onViewDetails?: (game: GamePrice) => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onViewDetails }) => {
  const [copiedStore, setCopiedStore] = useState<string | null>(null);
  const [copiedCodeStore, setCopiedCodeStore] = useState<string | null>(null);

  const displayPrice = game.cheapest
    ? parseFloat(game.cheapest)
    : game.customerPrice;

  const savings =
    game.savings
      ? Math.round(parseFloat(game.savings))
      : game.steamStorePrice && game.steamStorePrice > displayPrice
      ? Math.round(((game.steamStorePrice - displayPrice) / game.steamStorePrice) * 100)
      : null;

  const gameTitle = game.external || game.name;
  const imageSrc = game.thumb || game.coverImage || game.headerImage;

  // Use merchant deals from API or fallback helper
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

  const handleCopyCodeOnly = (deal: MerchantDeal, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(deal.voucherCode).catch(() => {});
    }

    setCopiedCodeStore(deal.storeName);
    setTimeout(() => {
      setCopiedCodeStore((prev) => (prev === deal.storeName ? null : prev));
    }, 2000);
  };

  const handleCopyAndBuy = (deal: MerchantDeal, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Copy voucher code to clipboard
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(deal.voucherCode).catch(() => {});
    }

    setCopiedStore(deal.storeName);
    setTimeout(() => {
      setCopiedStore((prev) => (prev === deal.storeName ? null : prev));
    }, 2500);

    // Open affiliate URL in new browser tab
    window.open(deal.affiliateUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      id={`game-card-${game.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-zinc-900/90 border border-zinc-800/90 hover:border-zinc-700/80 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-950/20 hover:-translate-y-0.5"
    >
      {/* Cover Artwork Header */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-950">
        <img
          src={imageSrc}
          alt={gameTitle}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = getFallbackGameImageUrl(
              game.steamAppId || (game.steamAppID ? parseInt(game.steamAppID, 10) : undefined)
            );
          }}
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

        {/* Platform Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1 rounded-md bg-zinc-900/90 backdrop-blur-md px-2 py-0.5 text-[11px] font-semibold text-zinc-200 border border-zinc-700/60 shadow-sm">
            {game.platform || 'PC (Digital Key)'}
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
          title={gameTitle}
          className="text-base font-bold text-white line-clamp-1 group-hover:text-emerald-400 transition-colors"
        >
          {gameTitle}
        </h3>

        {/* Delivery / Guarantee Features */}
        <div className="mt-2 flex items-center gap-3 text-[11px] text-zinc-400">
          <div className="flex items-center gap-1 text-emerald-400">
            <Zap className="h-3 w-3" />
            <span>Instant Digital Key</span>
          </div>
          <div className="flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-teal-400" />
            <span>Verified Stores</span>
          </div>
        </div>

        {/* Price Box */}
        <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex items-end justify-between">
          <div>
            <div className="text-[11px] font-medium text-zinc-400">
              Lowest Tracked Price
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-400">
                {game.currencySymbol}{displayPrice.toFixed(2)}
              </span>
              {game.steamStorePrice && game.steamStorePrice > displayPrice && (
                <span className="text-xs text-zinc-500 line-through">
                  {game.currencySymbol}{game.steamStorePrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <div className="text-right text-[10px] text-zinc-500">
            <span>Live Price Index</span>
            <div className="font-semibold text-zinc-300">G2A, GAMIVO &amp; Kinguin</div>
          </div>
        </div>

        {/* Dedicated G2A, GAMIVO & Kinguin Affiliate Channels */}
        <div className="mt-4 flex flex-col gap-2.5">
          {/* G2A Deal Channel */}
          <div
            id={`deal-channel-g2a-${game.id}`}
            className="flex flex-col gap-2 rounded-xl bg-zinc-950/70 border border-amber-500/20 p-2.5 sm:p-3 hover:border-amber-500/40 transition-colors"
          >
            {/* Header with store name & discount */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xs text-amber-400 tracking-wide">G2A</span>
                <span className="text-[10px] font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.2 rounded">
                  {g2aDeal.discountText}
                </span>
              </div>
              <span className="text-[10px] font-medium text-zinc-400">
                Verified Global Key
              </span>
            </div>

            {/* Voucher Code Box */}
            <div className="flex items-center justify-between gap-2 bg-zinc-900/90 rounded-lg p-1.5 px-2.5 border border-zinc-800">
              <div className="flex flex-col">
                <span className="text-[9px] font-semibold uppercase tracking-wider text-amber-400/90">
                  Voucher Code (Copy at Checkout)
                </span>
                <span className="font-mono text-xs font-bold text-zinc-100 flex items-center gap-1">
                  <Ticket className="h-3 w-3 text-amber-400" />
                  {g2aDeal.voucherCode}
                </span>
              </div>

              <button
                type="button"
                title="Copy voucher code to clipboard"
                onClick={(e) => handleCopyCodeOnly(g2aDeal, e)}
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

            {/* Main Action Button */}
            <button
              id={`buy-g2a-btn-${game.id}`}
              type="button"
              onClick={(e) => handleCopyAndBuy(g2aDeal, e)}
              className="flex items-center justify-center gap-1.5 w-full rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 px-3 py-2 text-xs font-black shadow-md shadow-amber-500/10 transition-all hover:scale-[1.01] active:scale-95 cursor-pointer"
            >
              {copiedStore === 'G2A' ? (
                <>
                  <Check className="h-3.5 w-3.5 text-zinc-950 stroke-[3]" />
                  <span>Code Copied! Opening G2A...</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 opacity-90" />
                  <span>Copy Code &amp; Buy on G2A</span>
                  <ExternalLink className="h-3 w-3 opacity-75 ml-0.5" />
                </>
              )}
            </button>
          </div>

          {/* GAMIVO Deal Channel */}
          <div
            id={`deal-channel-gamivo-${game.id}`}
            className="flex flex-col gap-2 rounded-xl bg-zinc-950/70 border border-emerald-500/20 p-2.5 sm:p-3 hover:border-emerald-500/40 transition-colors"
          >
            {/* Header with store name & discount */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xs text-emerald-400 tracking-wide">GAMIVO</span>
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.2 rounded">
                  {gamivoDeal.discountText}
                </span>
              </div>
              <span className="text-[10px] font-medium text-zinc-400">
                Official Merchant
              </span>
            </div>

            {/* Voucher Code Box */}
            <div className="flex items-center justify-between gap-2 bg-zinc-900/90 rounded-lg p-1.5 px-2.5 border border-zinc-800">
              <div className="flex flex-col">
                <span className="text-[9px] font-semibold uppercase tracking-wider text-emerald-400/90">
                  Voucher Code (Copy at Checkout)
                </span>
                <span className="font-mono text-xs font-bold text-zinc-100 flex items-center gap-1">
                  <Ticket className="h-3 w-3 text-emerald-400" />
                  {gamivoDeal.voucherCode}
                </span>
              </div>

              <button
                type="button"
                title="Copy voucher code to clipboard"
                onClick={(e) => handleCopyCodeOnly(gamivoDeal, e)}
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

            {/* Main Action Button */}
            <button
              id={`buy-gamivo-btn-${game.id}`}
              type="button"
              onClick={(e) => handleCopyAndBuy(gamivoDeal, e)}
              className="flex items-center justify-center gap-1.5 w-full rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 px-3 py-2 text-xs font-black shadow-md shadow-emerald-500/10 transition-all hover:scale-[1.01] active:scale-95 cursor-pointer"
            >
              {copiedStore === 'GAMIVO' ? (
                <>
                  <Check className="h-3.5 w-3.5 text-zinc-950 stroke-[3]" />
                  <span>Code Copied! Opening GAMIVO...</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 opacity-90" />
                  <span>Copy Code &amp; Buy on GAMIVO</span>
                  <ExternalLink className="h-3 w-3 opacity-75 ml-0.5" />
                </>
              )}
            </button>
          </div>

          {/* Kinguin Deal Channel */}
          <div
            id={`deal-channel-kinguin-${game.id}`}
            className="flex flex-col gap-2 rounded-xl bg-zinc-950/70 border border-orange-500/20 p-2.5 sm:p-3 hover:border-orange-500/40 transition-colors"
          >
            {/* Header with store name & discount */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xs text-orange-400 tracking-wide">Kinguin</span>
                <span className="text-[10px] font-bold text-orange-300 bg-orange-500/15 border border-orange-500/30 px-1.5 py-0.2 rounded">
                  {kinguinDeal.discountText}
                </span>
              </div>
              <span className="text-[10px] font-medium text-zinc-400">
                Verified Global Key
              </span>
            </div>

            {/* Voucher Code Box */}
            <div className="flex items-center justify-between gap-2 bg-zinc-900/90 rounded-lg p-1.5 px-2.5 border border-zinc-800">
              <div className="flex flex-col">
                <span className="text-[9px] font-semibold uppercase tracking-wider text-orange-400/90">
                  Voucher Code (Copy at Checkout)
                </span>
                <span className="font-mono text-xs font-bold text-zinc-100 flex items-center gap-1">
                  <Ticket className="h-3 w-3 text-orange-400" />
                  {kinguinDeal.voucherCode}
                </span>
              </div>

              <button
                type="button"
                title="Copy voucher code to clipboard"
                onClick={(e) => handleCopyCodeOnly(kinguinDeal, e)}
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

            {/* Main Action Button */}
            <button
              id={`buy-kinguin-btn-${game.id}`}
              type="button"
              onClick={(e) => handleCopyAndBuy(kinguinDeal, e)}
              className="flex items-center justify-center gap-1.5 w-full rounded-lg bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-400 hover:via-amber-400 hover:to-yellow-400 text-zinc-950 px-3 py-2 text-xs font-black shadow-md shadow-orange-500/10 transition-all hover:scale-[1.01] active:scale-95 cursor-pointer"
            >
              {copiedStore === 'Kinguin' ? (
                <>
                  <Check className="h-3.5 w-3.5 text-zinc-950 stroke-[3]" />
                  <span>Code Copied! Opening Kinguin...</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 opacity-90" />
                  <span>Copy Code &amp; Buy on Kinguin</span>
                  <ExternalLink className="h-3 w-3 opacity-75 ml-0.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

