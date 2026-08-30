export interface MerchantDeal {
  storeName: string;
  affiliateUrl: string;
  voucherCode: string;
  discountText: string;
}

export interface GamePrice {
  id: number | string;
  gameID?: string;
  external?: string;
  name: string;
  normalizedName?: string;
  cheapest?: string;
  thumb?: string;
  steamAppID?: string | null;
  steamAppId?: number;
  affiliateUrl: string;
  merchantDeals?: MerchantDeal[];
  edition?: string;
  region?: string;
  platform?: string;
  coverImage?: string;
  headerImage?: string;
  screenshots?: string[];
  description?: string;
  genres?: string[];
  releaseDate?: string;
  metascore?: number | string;
  steamStorePrice?: number;
  basePrice?: number;
  lowestBasePrice?: number;
  allkeyshopLowestBase?: number;
  markup?: number;
  customerPrice: number;
  currency: string;
  currencySymbol: string;
  inStock: boolean;
  offersCount?: number;
  dealID?: string;
  normalPrice?: string;
  salePrice?: string;
  savings?: string;
  dealRating?: string;
  allEditions?: GameEditionPrice[];
}

export interface RawGameItem {
  gameID: string;
  steamAppID?: string | null;
  cheapest: string;
  cheapestDealID?: string;
  external: string;
  internalName?: string;
  thumb: string;
  affiliateUrl: string;
  merchantDeals?: MerchantDeal[];
}

export interface GameEditionPrice {
  edition: string;
  region: string;
  basePrice: number;
  markup: number;
  customerPrice: number;
}

export interface SearchResponse {
  query: string;
  results: GamePrice[];
  totalFound: number;
  processingTimeMs: number;
}

export interface PurchasedKey {
  id: string;
  orderId: string;
  gameId: number | string;
  gameName: string;
  edition: string;
  platform: string;
  coverImage?: string;
  licenseKey: string;
  pricePaid: number;
  currency: string;
  currencySymbol: string;
  purchaseDate: string;
  customerEmail: string;
  paymentMethod: string;
  status: 'delivered' | 'processing';
}

export interface PaymentRequest {
  gameId: number | string;
  gameName: string;
  edition?: string;
  platform?: string;
  coverImage?: string;
  amount: number;
  currency: string;
  customerEmail: string;
  customerName?: string;
  paymentMethod: 'card' | 'paypal' | 'apple_pay' | 'google_pay' | 'crypto';
  cardDetails?: {
    cardNumber: string;
    expMonth: string;
    expYear: string;
    cvc: string;
  };
  cryptoCurrency?: string;
}

export interface PaymentResult {
  success: boolean;
  orderId: string;
  licenseKey: string;
  gameName: string;
  edition: string;
  platform: string;
  amount: number;
  currency: string;
  customerEmail: string;
  timestamp: string;
  transactionHash?: string;
  message?: string;
}
