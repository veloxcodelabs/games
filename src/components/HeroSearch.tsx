import React, { useState } from 'react';
import { Search, Loader2, Gamepad2, X, ArrowRight, Flame, Sparkles } from 'lucide-react';

interface HeroSearchProps {
  query: string;
  onQueryChange: (q: string) => void;
  onSearch: (q: string) => void;
  isLoading: boolean;
  activePlatform: string;
  onPlatformChange: (p: string) => void;
}

const POPULAR_GAMES = [
  'Elden Ring',
  'Grand Theft Auto V',
  'Cyberpunk 2077',
  'Red Dead Redemption 2',
  'Helldivers 2',
  'The Witcher 3',
  'Black Myth: Wukong',
  'Baldur\'s Gate 3',
  'Resident Evil 4',
  'God of War',
];

const PLATFORMS = [
  { id: '', label: 'All Platforms' },
  { id: 'pc', label: 'PC / Steam' },
  { id: 'ps5', label: 'PlayStation 5' },
  { id: 'xbox', label: 'Xbox Series X|S' },
  { id: 'switch', label: 'Nintendo Switch' },
];

export const HeroSearch: React.FC<HeroSearchProps> = ({
  query,
  onQueryChange,
  onSearch,
  isLoading,
  activePlatform,
  onPlatformChange,
}) => {
  const [localInput, setLocalInput] = useState(query);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localInput.trim()) {
      onSearch(localInput.trim());
    }
  };

  const handleChipClick = (gameName: string) => {
    setLocalInput(gameName);
    onQueryChange(gameName);
    onSearch(gameName);
  };

  const handleClear = () => {
    setLocalInput('');
    onQueryChange('');
  };

  return (
    <div className="relative overflow-hidden border-b border-zinc-800/80 bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-950 py-10 sm:py-14">
      {/* Glow highlight */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-80 w-[600px] rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        {/* Banner Tag */}
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400 mb-5 shadow-sm">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Global Live Price Index • G2A, GAMIVO &amp; Kinguin Deals • Exclusive Discount Vouchers</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-5xl">
          Search Any Game. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-amber-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent">
            Find the Best Deals.
          </span>
        </h1>

        <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-zinc-400">
          Compare video game prices across global distributors and get instant digital key deals with exclusive voucher codes for G2A (12% OFF), Kinguin (10% OFF), and GAMIVO (8% OFF).
        </p>

        {/* Main Search Bar Form */}
        <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-3xl">
          <div className="relative flex items-center rounded-2xl bg-zinc-900/90 p-2 shadow-2xl ring-1 ring-zinc-700/60 focus-within:ring-2 focus-within:ring-emerald-500 backdrop-blur-xl transition-all">
            <div className="flex pl-3 text-zinc-400">
              <Search className="h-5 w-5" />
            </div>

            <input
              id="game-search-input"
              type="text"
              value={localInput}
              onChange={(e) => {
                setLocalInput(e.target.value);
                onQueryChange(e.target.value);
              }}
              placeholder="Search by game name (e.g. Cyberpunk 2077, GTA V, Elden Ring)..."
              className="w-full bg-transparent px-3 py-2.5 text-base font-medium text-white placeholder-zinc-500 focus:outline-none"
            />

            {localInput && (
              <button
                type="button"
                id="clear-search-btn"
                onClick={handleClear}
                className="mr-2 p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
                title="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            <button
              id="search-submit-btn"
              type="submit"
              disabled={isLoading || !localInput.trim()}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:hover:bg-emerald-500 px-5 py-3 text-sm font-bold text-zinc-950 shadow-md shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-zinc-950" />
                  <span>Fetching...</span>
                </>
              ) : (
                <>
                  <span>Search Prices</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Platform Selector Chips */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {PLATFORMS.map((platform) => (
            <button
              key={platform.id}
              id={`platform-chip-${platform.id || 'all'}`}
              type="button"
              onClick={() => onPlatformChange(platform.id)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                activePlatform === platform.id
                  ? 'bg-zinc-100 text-zinc-900 shadow-md'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              <Gamepad2 className="h-3.5 w-3.5" />
              <span>{platform.label}</span>
            </button>
          ))}
        </div>

        {/* Popular / Trending Searches */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <div className="flex items-center gap-1 text-xs font-medium text-zinc-500">
            <Flame className="h-3.5 w-3.5 text-amber-500" />
            <span>Trending:</span>
          </div>
          {POPULAR_GAMES.map((game) => (
            <button
              key={game}
              id={`trending-chip-${game.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              type="button"
              onClick={() => handleChipClick(game)}
              className="rounded-full bg-zinc-900/70 hover:bg-zinc-800 border border-zinc-800/80 px-2.5 py-1 text-xs font-medium text-zinc-300 hover:text-emerald-400 transition-colors"
            >
              {game}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
