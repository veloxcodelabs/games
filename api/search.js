/**
 * Serverless / Express handler for /api/search.js
 * Queries public pricing feeds for live video game price data and constructs G2A & GAMIVO affiliate links with discount voucher codes.
 */

export const STORES = {
  g2a: {
    name: "G2A",
    voucherCode: "SUMMER12",
    discountText: "12% OFF",
    getAffiliateUrl: (title) => 
      title 
        ? `https://www.g2a.com/search?query=${encodeURIComponent(title)}&reflink=reflink-979532d1c4`
        : `https://www.g2a.com/n/reflink-979532d1c4`
  },
  gamivo: {
    name: "GAMIVO",
    voucherCode: "BASICS",
    discountText: "8% OFF",
    getAffiliateUrl: (title) => 
      `https://www.gamivo.com/search/${encodeURIComponent(title)}?glv=nov5oasf`
  },
  kinguin: {
    name: "Kinguin",
    voucherCode: "KINGUIN10",
    discountText: "10% OFF",
    getAffiliateUrl: (title) => 
      title
        ? `https://www.kinguin.net/listing?active=1&phrase=${encodeURIComponent(title)}&r=34o3fs14tewgg`
        : `https://www.kinguin.net/?r=34o3fs14tewgg`
  }
};

export function getMerchantDeals(title) {
  const cleanTitle = (title || '').replace(/[®™]/g, '').trim();
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

export async function handleSearch(req, res) {
  const query = req.query.title || req.query.q || req.query.query || '';

  if (!query || !query.trim()) {
    return res.status(200).json([]);
  }

  const cleanQuery = query.trim();
  const cheapSharkUrl = `https://www.cheapshark.com/api/1.0/games?title=${encodeURIComponent(cleanQuery)}`;

  try {
    const response = await fetch(cheapSharkUrl, { signal: AbortSignal.timeout(6000) });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Price index feed returned HTTP ${response.status}`,
      });
    }

    const games = await response.json();

    if (!Array.isArray(games)) {
      return res.status(200).json([]);
    }

    // Parse and map the response to return required fields + merchantDeals array
    const mappedResults = games.map((game) => {
      const title = game.external || 'Video Game';
      const deals = getMerchantDeals(title);
      return {
        gameID: String(game.gameID || ''),
        external: title,
        cheapest: String(game.cheapest || '0.00'),
        thumb: game.thumb || '',
        steamAppID: game.steamAppID || null,
        affiliateUrl: STORES.gamivo.getAffiliateUrl(title),
        merchantDeals: deals,
      };
    });

    return res.status(200).json(mappedResults);
  } catch (error) {
    console.error('Error fetching game data:', error);
    return res.status(500).json({
      error: 'Failed to fetch game data',
      message: error.message,
    });
  }
}

export default handleSearch;

