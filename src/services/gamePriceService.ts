import { GamePrice, RawGameItem, MerchantDeal } from '../types';
import { resolveSteamAppId, getOfficialGameImages } from './gameArtwork';

export const STORES = {
  g2a: {
    name: "G2A",
    voucherCode: "SUMMER12",
    discountText: "12% OFF",
    getAffiliateUrl: (title: string) => 
      title 
        ? `https://www.g2a.com/search?query=${encodeURIComponent(title)}&reflink=reflink-979532d1c4`
        : `https://www.g2a.com/n/reflink-979532d1c4`
  },
  gamivo: {
    name: "GAMIVO",
    voucherCode: "BASICS",
    discountText: "8% OFF",
    getAffiliateUrl: (title: string) => 
      `https://www.gamivo.com/search/${encodeURIComponent(title)}?glv=nov5oasf`
  },
  kinguin: {
    name: "Kinguin",
    voucherCode: "KINGUIN10",
    discountText: "10% OFF",
    getAffiliateUrl: (title: string) => 
      title
        ? `https://www.kinguin.net/search/${encodeURIComponent(title)}?r=34o3fs14tewgg`
        : `https://www.kinguin.net/?r=34o3fs14tewgg`
  }
};

export function getMerchantDeals(gameTitle: string): MerchantDeal[] {
  const cleanTitle = (gameTitle || '').replace(/[®™]/g, '').trim();
  return [
    {
      storeName: STORES.g2a.name,
      affiliateUrl: STORES.g2a.getAffiliateUrl(cleanTitle),
      voucherCode: STORES.g2a.voucherCode,
      discountText: STORES.g2a.discountText,
    },
    {
      storeName: STORES.gamivo.name,
      affiliateUrl: STORES.gamivo.getAffiliateUrl(cleanTitle),
      voucherCode: STORES.gamivo.voucherCode,
      discountText: STORES.gamivo.discountText,
    },
    {
      storeName: STORES.kinguin.name,
      affiliateUrl: STORES.kinguin.getAffiliateUrl(cleanTitle),
      voucherCode: STORES.kinguin.voucherCode,
      discountText: STORES.kinguin.discountText,
    }
  ];
}

/**
 * Builds the Kinguin search referral affiliate link for a given game title
 */
export function buildKinguinAffiliateUrl(gameTitle: string): string {
  const cleanTitle = (gameTitle || '')
    .replace(/[®™]/g, '')
    .trim();
  return STORES.kinguin.getAffiliateUrl(cleanTitle);
}

/**
 * Builds the GAMIVO search referral affiliate link for a given game title
 */
export function buildGamivoAffiliateUrl(gameTitle: string): string {
  const cleanTitle = (gameTitle || '')
    .replace(/[®™]/g, '')
    .trim();
  return STORES.gamivo.getAffiliateUrl(cleanTitle);
}

/**
 * Builds the G2A search referral affiliate link for a given game title
 */
export function buildG2aAffiliateUrl(gameTitle: string): string {
  const cleanTitle = (gameTitle || '')
    .replace(/[®™]/g, '')
    .trim();
  return STORES.g2a.getAffiliateUrl(cleanTitle);
}

/**
 * Helper to get currency symbol
 */
export function getCurrencySymbol(curr: string): string {
  switch (curr.toUpperCase()) {
    case 'EUR':
      return '€';
    case 'GBP':
      return '£';
    case 'CAD':
      return 'CA$';
    case 'AUD':
      return 'AU$';
    case 'JPY':
      return '¥';
    case 'USD':
    default:
      return '$';
  }
}

/**
 * Currency conversion multiplier estimate from USD (pricing feed returns USD prices)
 */
export function getCurrencyRate(curr: string): number {
  const rates: Record<string, number> = {
    USD: 1.0,
    EUR: 0.92,
    GBP: 0.79,
    CAD: 1.36,
    AUD: 1.52,
    JPY: 155.0,
  };
  return rates[curr.toUpperCase()] || 1.0;
}

/**
 * Maps raw pricing item into rich GamePrice structure with G2A & GAMIVO merchant deals
 */
export function mapRawItemToGamePrice(
  item: any,
  currency = 'USD'
): GamePrice {
  const title = item.external || item.title || item.name || 'Video Game';
  const usdPrice = parseFloat(item.cheapest || item.salePrice || item.price || '19.99') || 19.99;
  const rate = getCurrencyRate(currency);
  const customerPrice = Number((usdPrice * rate).toFixed(2));
  const currencySymbol = getCurrencySymbol(currency);
  const steamAppIdNum = item.steamAppID ? parseInt(item.steamAppID, 10) : resolveSteamAppId(title);
  const realImages = getOfficialGameImages(title, steamAppIdNum);
  const affiliateUrl = item.affiliateUrl || buildGamivoAffiliateUrl(title);
  const merchantDeals = item.merchantDeals && Array.isArray(item.merchantDeals) && item.merchantDeals.length > 0
    ? item.merchantDeals
    : getMerchantDeals(title);

  // Normal / store price comparison
  const normalUsd = item.normalPrice ? parseFloat(item.normalPrice) : usdPrice * 1.5;
  const normalConverted = Number((normalUsd * rate).toFixed(2));

  return {
    id: item.gameID || item.dealID || `game-${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    gameID: String(item.gameID || ''),
    external: title,
    name: title,
    cheapest: String(item.cheapest || usdPrice.toFixed(2)),
    thumb: item.thumb || realImages.coverImage,
    steamAppID: item.steamAppID || String(steamAppIdNum),
    steamAppId: steamAppIdNum,
    affiliateUrl,
    merchantDeals,
    customerPrice: customerPrice > 0 ? customerPrice : Number((14.99 * rate).toFixed(2)),
    steamStorePrice: normalConverted > customerPrice ? normalConverted : Number((customerPrice * 1.4).toFixed(2)),
    currency: currency.toUpperCase(),
    currencySymbol,
    coverImage: realImages.coverImage || item.thumb,
    headerImage: realImages.headerImage || item.thumb,
    inStock: true,
    platform: 'PC (Steam / Global Key)',
    metascore: item.metacriticScore || undefined,
    dealRating: item.dealRating,
    savings: item.savings,
    allEditions: [
      {
        edition: 'Standard Edition',
        region: 'Global',
        basePrice: customerPrice,
        markup: 0,
        customerPrice: customerPrice,
      },
      {
        edition: 'Deluxe / GOTY Edition',
        region: 'Global',
        basePrice: Number((customerPrice * 1.35).toFixed(2)),
        markup: 0,
        customerPrice: Number((customerPrice * 1.35).toFixed(2)),
      },
    ],
  };
}

/**
 * Searches for games using live market pricing feeds
 */
export async function searchGames(
  query: string,
  currency = 'USD'
): Promise<GamePrice[]> {
  if (!query || !query.trim()) return [];

  const cleanQuery = query.trim();

  // Try backend endpoint first
  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(cleanQuery)}&currency=${currency}`, {
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data.map((item) => mapRawItemToGamePrice(item, currency));
      } else if (data && Array.isArray(data.results)) {
        return data.results.map((item: any) => mapRawItemToGamePrice(item, currency));
      }
    }
  } catch (err) {
    console.warn('Backend search request failed or timed out, trying direct API:', err);
  }

  // Direct public pricing API endpoint fallback
  try {
    const directUrl = `https://www.cheapshark.com/api/1.0/games?title=${encodeURIComponent(cleanQuery)}`;
    const res = await fetch(directUrl, { signal: AbortSignal.timeout(6000) });
    if (res.ok) {
      const rawGames: any[] = await res.json();
      if (Array.isArray(rawGames) && rawGames.length > 0) {
        return rawGames.slice(0, 12).map((item) => {
          const deals = getMerchantDeals(item.external || cleanQuery);
          return mapRawItemToGamePrice({ ...item, merchantDeals: deals }, currency);
        });
      }
    }
  } catch (err) {
    console.error('Direct price query error:', err);
  }

  // Final graceful fallback with G2A and GAMIVO affiliate links
  const fallbackAppId = resolveSteamAppId(cleanQuery);
  const fallbackImages = getOfficialGameImages(cleanQuery, fallbackAppId);
  const rate = getCurrencyRate(currency);
  const customerPrice = Number((19.99 * rate).toFixed(2));
  const fallbackDeals = getMerchantDeals(cleanQuery);

  return [
    {
      id: `fallback-${Date.now()}`,
      gameID: '0',
      external: cleanQuery,
      name: cleanQuery,
      cheapest: '19.99',
      thumb: fallbackImages.coverImage,
      steamAppID: String(fallbackAppId),
      steamAppId: fallbackAppId,
      affiliateUrl: buildGamivoAffiliateUrl(cleanQuery),
      merchantDeals: fallbackDeals,
      customerPrice,
      steamStorePrice: Number((customerPrice * 1.5).toFixed(2)),
      currency: currency.toUpperCase(),
      currencySymbol: getCurrencySymbol(currency),
      coverImage: fallbackImages.coverImage,
      headerImage: fallbackImages.headerImage,
      inStock: true,
      platform: 'PC (Steam / Global)',
      allEditions: [
        {
          edition: 'Standard Edition',
          region: 'Global',
          basePrice: customerPrice,
          markup: 0,
          customerPrice: customerPrice,
        },
      ],
    },
  ];
}

/**
 * Fetch featured deals
 */
export async function fetchFeaturedDeals(
  currency = 'USD'
): Promise<GamePrice[]> {
  // Try backend deals endpoint first
  try {
    const res = await fetch(`/api/deals?currency=${currency}`, { signal: AbortSignal.timeout(5000) });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.map((item) => mapRawItemToGamePrice(item, currency));
      }
    }
  } catch (err) {
    // fallback to direct deals
  }

  try {
    const dealsUrl = `https://www.cheapshark.com/api/1.0/deals?pageSize=12&sortBy=Deal%20Rating`;
    const res = await fetch(dealsUrl, { signal: AbortSignal.timeout(6000) });
    if (res.ok) {
      const rawDeals: any[] = await res.json();
      if (Array.isArray(rawDeals) && rawDeals.length > 0) {
        return rawDeals.map((deal) => {
          const title = deal.title || 'Game Deal';
          const deals = getMerchantDeals(title);
          return mapRawItemToGamePrice(
            {
              gameID: deal.gameID,
              dealID: deal.dealID,
              external: title,
              cheapest: deal.salePrice,
              salePrice: deal.salePrice,
              normalPrice: deal.normalPrice,
              thumb: deal.thumb,
              steamAppID: deal.steamAppID,
              metacriticScore: deal.metacriticScore,
              dealRating: deal.dealRating,
              savings: deal.savings,
              affiliateUrl: STORES.gamivo.getAffiliateUrl(title),
              merchantDeals: deals,
            },
            currency
          );
        });
      }
    }
  } catch (err) {
    console.error('Failed to load direct deals:', err);
  }

  // Popular curated fallback list with G2A & GAMIVO links
  const curatedList = [
    'Grand Theft Auto V',
    'Cyberpunk 2077',
    'Elden Ring',
    'The Witcher 3: Wild Hunt',
    'Red Dead Redemption 2',
    'Helldivers 2',
    'Black Myth: Wukong',
    'Baldur\'s Gate 3',
    'Resident Evil 4',
    'Ghost of Tsushima',
    'Marvel\'s Spider-Man Remastered',
    'God of War',
  ];

  return curatedList.map((title, idx) => {
    const appId = resolveSteamAppId(title);
    const images = getOfficialGameImages(title, appId);
    const rate = getCurrencyRate(currency);
    const price = Number(((idx % 3 === 0 ? 19.99 : idx % 2 === 0 ? 29.99 : 39.99) * rate).toFixed(2));
    const deals = getMerchantDeals(title);

    return {
      id: `curated-${idx}`,
      gameID: String(idx + 100),
      external: title,
      name: title,
      cheapest: String(price),
      thumb: images.coverImage,
      steamAppID: String(appId),
      steamAppId: appId,
      affiliateUrl: STORES.gamivo.getAffiliateUrl(title),
      merchantDeals: deals,
      customerPrice: price,
      steamStorePrice: Number((price * 1.5).toFixed(2)),
      currency: currency.toUpperCase(),
      currencySymbol: getCurrencySymbol(currency),
      coverImage: images.coverImage,
      headerImage: images.headerImage,
      inStock: true,
      platform: 'PC (Steam / Global)',
      allEditions: [
        {
          edition: 'Standard Edition',
          region: 'Global',
          basePrice: price,
          markup: 0,
          customerPrice: price,
        },
      ],
    };
  });
}


