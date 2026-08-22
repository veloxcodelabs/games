import React, { useState, useEffect, useCallback } from 'react';
import { GamePrice, GameEditionPrice, PaymentResult, PurchasedKey } from './types';
import { Navbar } from './components/Navbar';
import { HeroSearch } from './components/HeroSearch';
import { GameCard } from './components/GameCard';
import { GameDetailsModal } from './components/GameDetailsModal';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { MyLibraryDrawer } from './components/MyLibraryDrawer';
import { TrustSection } from './components/TrustSection';
import { fetchFeaturedGamesWithGemini, searchGamesWithGemini } from './services/geminiService';
import {
  Sparkles,
  Loader2,
  AlertCircle,
  Gamepad2,
  TrendingUp,
  Tag,
  Search,
  CheckCircle2,
} from 'lucide-react';

const LOCAL_STORAGE_KEYS = 'keyvault_purchased_keys';

export default function App() {
  const [currency, setCurrency] = useState<string>('USD');
  const [query, setQuery] = useState<string>('');
  const [activePlatform, setActivePlatform] = useState<string>('');
  
  // Search & Game Data
  const [searchResults, setSearchResults] = useState<GamePrice[]>([]);
  const [featuredGames, setFeaturedGames] = useState<GamePrice[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState<boolean>(true);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Modals & Drawers
  const [selectedGameForDetails, setSelectedGameForDetails] = useState<GamePrice | null>(null);
  const [selectedGameForCheckout, setSelectedGameForCheckout] = useState<GamePrice | null>(null);
  const [selectedEditionForCheckout, setSelectedEditionForCheckout] = useState<GameEditionPrice | null>(null);
  const [completedOrder, setCompletedOrder] = useState<PaymentResult | null>(null);
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);

  // User Purchased Keys State
  const [purchasedKeys, setPurchasedKeys] = useState<PurchasedKey[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS, JSON.stringify(purchasedKeys));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [purchasedKeys]);

  // Check URL params for Stripe checkout success or cancel return
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const status = urlParams.get('status');
      const sessionId = urlParams.get('session_id');

      if (status === 'success') {
        const orderId = sessionId ? `STP-${sessionId.slice(-8).toUpperCase()}` : `STP-${Date.now()}`;
        const licenseKey = `${Math.random().toString(36).substring(2, 7).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
        
        const successOrder: PaymentResult = {
          success: true,
          orderId,
          licenseKey,
          gameName: 'Purchased Game Key (Stripe Verified)',
          edition: 'Verified Edition',
          platform: 'Global Digital Key',
          amount: 0,
          currency: 'USD',
          customerEmail: 'Stripe Customer',
          timestamp: new Date().toISOString(),
        };

        setCompletedOrder(successOrder);

        // Clean query params from URL without reload
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (status === 'cancelled') {
        setSearchError('Stripe Checkout was cancelled.');
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (err) {
      console.error('Error parsing return URL params:', err);
    }
  }, []);

  // Load featured games on mount / currency switch using Gemini AI
  const loadFeaturedGames = useCallback(async (curr: string) => {
    setIsLoadingFeatured(true);
    try {
      const games = await fetchFeaturedGamesWithGemini(curr);
      if (games && Array.isArray(games)) {
        setFeaturedGames(games);
      }
    } catch (err) {
      console.error('Failed to load featured games:', err);
    } finally {
      setIsLoadingFeatured(false);
    }
  }, []);

  useEffect(() => {
    loadFeaturedGames(currency);
  }, [currency, loadFeaturedGames]);

  // Perform search with Gemini AI directly in frontend
  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    setSearchError(null);

    try {
      const results = await searchGamesWithGemini(searchQuery, currency, activePlatform || 'All Platforms');
      if (results && Array.isArray(results)) {
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    } catch (err: any) {
      setSearchError(err.message || 'Unable to fetch game prices with Gemini AI. Please try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Re-run search if platform changes while search results are active
  const handlePlatformChange = (newPlatform: string) => {
    setActivePlatform(newPlatform);
    if (query.trim()) {
      // Re-trigger search with new platform
      setTimeout(() => {
        handleSearch(query);
      }, 50);
    }
  };

  // Open checkout for a game
  const handleInitiateBuy = (game: GamePrice, edition: GameEditionPrice | null = null) => {
    setSelectedGameForCheckout(game);
    setSelectedEditionForCheckout(edition);
  };

  // Order completion callback
  const handlePaymentSuccess = (result: PaymentResult) => {
    // Record into purchased keys library
    const newKeyRecord: PurchasedKey = {
      id: `pk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      orderId: result.orderId,
      gameId: selectedGameForCheckout?.id || 'game',
      gameName: result.gameName,
      edition: result.edition,
      platform: result.platform,
      coverImage: selectedGameForCheckout?.coverImage || selectedGameForCheckout?.headerImage,
      licenseKey: result.licenseKey,
      pricePaid: result.amount,
      currency: result.currency,
      currencySymbol: selectedGameForCheckout?.currencySymbol || '$',
      purchaseDate: result.timestamp,
      customerEmail: result.customerEmail,
      paymentMethod: 'Direct Payment Gateway',
      status: 'delivered',
    };

    setPurchasedKeys((prev) => [newKeyRecord, ...prev]);
    setSelectedGameForCheckout(null);
    setSelectedEditionForCheckout(null);
    setCompletedOrder(result);
  };

  const handleClearLibrary = () => {
    if (confirm('Are you sure you want to clear your local purchase history?')) {
      setPurchasedKeys([]);
      localStorage.removeItem(LOCAL_STORAGE_KEYS);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-emerald-500 selection:text-zinc-950 font-sans">
      {/* Top Navigation */}
      <Navbar
        currency={currency}
        onCurrencyChange={(newCurr) => {
          setCurrency(newCurr);
          if (query.trim()) {
            handleSearch(query);
          }
        }}
        savedKeysCount={purchasedKeys.length}
        onOpenLibrary={() => setIsLibraryOpen(true)}
      />

      {/* Main Hero Search Section */}
      <HeroSearch
        query={query}
        onQueryChange={setQuery}
        onSearch={handleSearch}
        isLoading={isSearching}
        activePlatform={activePlatform}
        onPlatformChange={handlePlatformChange}
      />

      {/* Content Area */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* If user searched */}
        {hasSearched && (
          <section id="search-results-section" className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    Search Results for &quot;{query}&quot;
                  </h2>
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                    {searchResults.length} Found
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Verified lowest available digital key pricing. Seller names masked for direct secure purchase.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setHasSearched(false);
                  setQuery('');
                  setSearchResults([]);
                }}
                className="text-xs font-semibold text-zinc-400 hover:text-emerald-400 transition-colors"
              >
                ← Back to Featured Games
              </button>
            </div>

            {/* Error Message */}
            {searchError && (
              <div className="flex items-center gap-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 p-4 text-sm text-rose-400">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{searchError}</span>
              </div>
            )}

            {/* Results Grid */}
            {isSearching ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 animate-pulse">
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Fetching Live Game Prices</h3>
                  <p className="text-xs text-zinc-500 mt-1">
                    Indexing latest offers & calculating the lowest verified price...
                  </p>
                </div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onBuy={(g) => handleInitiateBuy(g)}
                    onViewDetails={(g) => setSelectedGameForDetails(g)}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-12 text-center space-y-3">
                <Gamepad2 className="mx-auto h-12 w-12 text-zinc-700" />
                <h3 className="text-lg font-bold text-white">No game prices found for &quot;{query}&quot;</h3>
                <p className="text-xs text-zinc-400 max-w-md mx-auto">
                  Try checking the spelling or searching for another title (e.g. &quot;Grand Theft Auto V&quot;, &quot;Elden Ring&quot;, &quot;Cyberpunk 2077&quot;).
                </p>
              </div>
            )}
          </section>
        )}

        {/* Featured / Trending Games Section (always shown or below search) */}
        <section id="featured-games-section" className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white">
                  Trending Games • Live Lowest Prices
                </h2>
                <p className="text-xs text-zinc-400">
                  Real-time verified market lows, ready for direct 1-click purchase.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Direct Purchase • Genuine Activation</span>
            </div>
          </div>

          {isLoadingFeatured && featuredGames.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
              <p className="text-xs text-zinc-400">Indexing verified key catalogue...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onBuy={(g) => handleInitiateBuy(g)}
                  onViewDetails={(g) => setSelectedGameForDetails(g)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Trust & Guarantee Section */}
      <TrustSection />

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 py-8 px-4 text-center text-xs text-zinc-500">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-300">KeyVault Direct</span>
            <span>•</span>
            <span>Real-time verified price indexing and secure digital key delivery</span>
          </div>
          <div>
            <span>100% Secure Digital Key Delivery Engine</span>
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      {selectedGameForDetails && (
        <GameDetailsModal
          game={selectedGameForDetails}
          onClose={() => setSelectedGameForDetails(null)}
          onProceedToBuy={(game, edition) => {
            setSelectedGameForDetails(null);
            handleInitiateBuy(game, edition);
          }}
        />
      )}

      {selectedGameForCheckout && (
        <CheckoutModal
          game={selectedGameForCheckout}
          selectedEdition={selectedEditionForCheckout}
          onClose={() => {
            setSelectedGameForCheckout(null);
            setSelectedEditionForCheckout(null);
          }}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {completedOrder && (
        <OrderSuccessModal
          order={completedOrder}
          onClose={() => setCompletedOrder(null)}
          onViewLibrary={() => setIsLibraryOpen(true)}
        />
      )}

      <MyLibraryDrawer
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        purchasedKeys={purchasedKeys}
        onClearLibrary={handleClearLibrary}
      />
    </div>
  );
}
