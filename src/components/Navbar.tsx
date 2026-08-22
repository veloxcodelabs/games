import React from 'react';
import { Key, ShieldCheck, ShoppingBag, Sparkles, Zap } from 'lucide-react';

interface NavbarProps {
  currency: string;
  onCurrencyChange: (curr: string) => void;
  savedKeysCount: number;
  onOpenLibrary: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currency,
  onCurrencyChange,
  savedKeysCount,
  onOpenLibrary,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-400/30">
            <Key className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-tight text-zinc-100">
                Key<span className="text-emerald-400">Vault</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                <Sparkles className="h-3 w-3" /> Live Verified Feed
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-medium hidden sm:block">
              Best digital key prices • Secure digital delivery
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Trust indicator */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-zinc-400 bg-zinc-900/80 px-3 py-1.5 rounded-lg border border-zinc-800">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Direct Merchant • 100% Genuine</span>
          </div>

          {/* Currency Selector */}
          <div className="flex items-center bg-zinc-900 rounded-lg border border-zinc-800 p-0.5">
            {(['USD', 'EUR', 'GBP'] as const).map((curr) => (
              <button
                key={curr}
                id={`currency-btn-${curr.toLowerCase()}`}
                type="button"
                onClick={() => onCurrencyChange(curr)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  currency === curr
                    ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {curr === 'USD' ? '$ USD' : curr === 'EUR' ? '€ EUR' : '£ GBP'}
              </button>
            ))}
          </div>

          {/* My Library / Purchased Keys Button */}
          <button
            id="my-library-btn"
            type="button"
            onClick={onOpenLibrary}
            className="relative flex items-center gap-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 px-3.5 py-2 text-sm font-medium border border-zinc-800 transition-all hover:border-zinc-700 active:scale-95"
          >
            <ShoppingBag className="h-4 w-4 text-emerald-400" />
            <span className="hidden sm:inline">My Keys</span>
            {savedKeysCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[11px] font-bold text-zinc-950 shadow-sm animate-pulse">
                {savedKeysCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
