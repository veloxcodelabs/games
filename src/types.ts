export interface GamePrice {
  id: number | string;
  name: string;
  normalizedName?: string;
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
  allEditions?: GameEditionPrice[];
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
