import React, { useState } from 'react';
import { GamePrice, GameEditionPrice, PaymentResult } from '../types';
import {
  X,
  CreditCard,
  Lock,
  ShieldCheck,
  Zap,
  Mail,
  CheckCircle2,
  Loader2,
  Sparkles,
  DollarSign,
  QrCode,
  Smartphone,
  Wallet,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  game: GamePrice;
  selectedEdition?: GameEditionPrice | null;
  onClose: () => void;
  onSuccess: (result: PaymentResult) => void;
}

type PaymentTab = 'card' | 'paypal' | 'wallet' | 'crypto';

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  game,
  selectedEdition,
  onClose,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<PaymentTab>('card');
  const [email, setEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  
  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  
  // Crypto selection
  const [selectedCrypto, setSelectedCrypto] = useState('USDT (TRC20)');

  // Processing states
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Price calculations
  const finalPrice = selectedEdition ? selectedEdition.customerPrice : game.customerPrice;
  const editionName = selectedEdition?.edition || game.edition || 'Standard Edition';

  // Format card number with spaces
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 16);
    val = val.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(val);
  };

  // Format expiry MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 3) {
      val = `${val.slice(0, 2)}/${val.slice(2, 4)}`;
    }
    setCardExpiry(val);
  };

  // 1-Click Fill Demo Card
  const fillTestCard = () => {
    setEmail('gamer@example.com');
    setCustomerName('Alex Turner');
    setCardNumber('4242 4242 4242 4242');
    setCardExpiry('12/28');
    setCardCvc('888');
    setErrorMessage(null);
  };

  // Submit payment handler: POST to /api/create-checkout-session and redirect to Stripe Checkout
  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid delivery email address.');
      return;
    }

    setIsProcessing(true);
    setProcessingStep('Creating secure Stripe Checkout session...');

    try {
      const itemTitle = `${game.name} (${editionName})`;
      
      const payload = {
        itemTitle,
        price: finalPrice,
        currency: game.currency || 'USD',
        customerEmail: email,
        successUrl: `${window.location.origin}/?session_id={CHECKOUT_SESSION_ID}&status=success`,
        cancelUrl: `${window.location.origin}/?status=cancelled`,
      };

      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Failed to initialize Stripe Checkout session.');
      }

      setProcessingStep('Redirecting to Stripe Checkout...');
      
      // Redirect window.location.href to Stripe Checkout session URL as requested
      window.location.href = data.url;
    } catch (err: any) {
      console.error('Stripe Checkout redirection error:', err);
      setErrorMessage(
        err.message || 'Unable to connect to Stripe Checkout. Please verify STRIPE_SECRET_KEY.'
      );
      setIsProcessing(false);
    }
  };

  // Fallback demo simulator for direct local sandbox testing if Stripe secret is not present
  const handleSimulatedSandboxCheckout = async () => {
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid delivery email address.');
      return;
    }

    setIsProcessing(true);
    setProcessingStep('Generating digital key & invoice in sandbox mode...');

    try {
      const payload = {
        gameId: game.id,
        gameName: game.name,
        edition: editionName,
        platform: game.platform || 'PC (Steam)',
        amount: finalPrice,
        currency: game.currency,
        customerEmail: email,
        customerName: customerName || 'Valued Gamer',
        paymentMethod: activeTab,
      };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Payment simulation failed.');
      }

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Confetti optional
      }

      onSuccess({
        success: true,
        orderId: data.order.orderId,
        licenseKey: data.order.licenseKey,
        gameName: game.name,
        edition: editionName,
        platform: game.platform || 'PC (Steam)',
        amount: finalPrice,
        currency: game.currency,
        customerEmail: email,
        timestamp: data.order.timestamp,
        transactionHash: data.order.transactionHash,
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Sandbox generation error.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto">
      <div
        id="payment-processor-modal"
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl my-8 ring-1 ring-zinc-800/80"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/90 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Secure Checkout</span>
                <span className="text-xs font-normal text-zinc-400">• Direct Game Key Purchase</span>
              </h2>
              <p className="text-xs text-zinc-400">
                Processed directly by KeyVault Merchant Gateway
              </p>
            </div>
          </div>

          <button
            id="close-checkout-btn"
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors disabled:opacity-30"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Processing Overlay if active */}
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center p-12 text-center space-y-5">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 animate-pulse">
              <Loader2 className="h-10 w-10 animate-spin text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Processing Your Payment</h3>
              <p className="mt-2 text-sm text-emerald-400 font-mono font-medium">{processingStep}</p>
              <p className="mt-1 text-xs text-zinc-500">
                Please do not refresh or close this window. Your activation key is being secured.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleProcessPayment} className="p-6 space-y-6">
            {/* Error banner */}
            {errorMessage && (
              <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-3.5 text-xs text-rose-300 space-y-2">
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-400" />
                  <span className="font-semibold">{errorMessage}</span>
                </div>
                {errorMessage.includes('STRIPE_SECRET_KEY') && (
                  <div className="pt-2 border-t border-rose-500/20 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] text-zinc-400">
                      You can configure <code>STRIPE_SECRET_KEY</code> in environment variables or test sandbox mode:
                    </span>
                    <button
                      type="button"
                      onClick={handleSimulatedSandboxCheckout}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-[11px] transition-colors cursor-pointer"
                    >
                      ⚡ Test Sandbox Delivery
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Order Item Summary Box */}
            <div className="flex items-center gap-4 rounded-2xl bg-zinc-900/80 p-4 border border-zinc-800">
              <img
                src={game.coverImage || game.headerImage}
                alt={game.name}
                referrerPolicy="no-referrer"
                className="h-16 w-24 rounded-lg object-cover bg-zinc-950 border border-zinc-800 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                    {game.platform || 'PC (Steam)'}
                  </span>
                  <span className="text-xs text-zinc-400 font-medium truncate">{editionName}</span>
                </div>
                <h4 className="text-sm font-bold text-white truncate mt-0.5">{game.name}</h4>
                <div className="mt-1 flex items-center gap-1.5 text-[11px] text-zinc-400">
                  <Zap className="h-3 w-3 text-emerald-400" />
                  <span>Digital Key & Email Delivery</span>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Total Price</div>
                <div className="text-xl font-black text-emerald-400">
                  {game.currencySymbol}{finalPrice.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Price Summary Breakdown */}
            <div className="rounded-xl bg-zinc-900/40 p-3 border border-zinc-800/60 text-xs space-y-1.5">
              <div className="flex justify-between text-zinc-400">
                <span>Item Subtotal:</span>
                <span>{game.currencySymbol}{finalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Digital Delivery:</span>
                <span className="text-emerald-400 font-medium">Included</span>
              </div>
              <div className="pt-1.5 border-t border-zinc-800 flex justify-between font-bold text-white">
                <span>Total Amount:</span>
                <span className="text-emerald-400">{game.currencySymbol}{finalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Email & Customer Information */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Delivery Email Address *</span>
                </label>
                <button
                  type="button"
                  onClick={fillTestCard}
                  className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
                >
                  ⚡ Auto-Fill Demo Details
                </button>
              </div>
              <input
                id="checkout-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@domain.com"
                className="w-full rounded-xl bg-zinc-900 border border-zinc-700/80 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <p className="text-[11px] text-zinc-500">
                Your activation key and order receipt will be sent directly to this address.
              </p>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-zinc-300">Choose Payment Method</label>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  id="tab-card"
                  onClick={() => setActiveTab('card')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                    activeTab === 'card'
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-sm'
                      : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <CreditCard className="h-5 w-5 mb-1 text-emerald-400" />
                  <span>Credit / Debit</span>
                </button>

                <button
                  type="button"
                  id="tab-paypal"
                  onClick={() => setActiveTab('paypal')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                    activeTab === 'paypal'
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-sm'
                      : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <Wallet className="h-5 w-5 mb-1 text-sky-400" />
                  <span>PayPal</span>
                </button>

                <button
                  type="button"
                  id="tab-wallet"
                  onClick={() => setActiveTab('wallet')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                    activeTab === 'wallet'
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-sm'
                      : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <Smartphone className="h-5 w-5 mb-1 text-indigo-400" />
                  <span>Apple/Google Pay</span>
                </button>

                <button
                  type="button"
                  id="tab-crypto"
                  onClick={() => setActiveTab('crypto')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                    activeTab === 'crypto'
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-sm'
                      : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <QrCode className="h-5 w-5 mb-1 text-amber-400" />
                  <span>Crypto</span>
                </button>
              </div>

              {/* Card Form */}
              {activeTab === 'card' && (
                <div className="space-y-3 rounded-2xl bg-zinc-900/60 p-4 border border-zinc-800/80">
                  <div>
                    <label className="text-[11px] font-medium text-zinc-400">Card Number</label>
                    <div className="relative mt-1">
                      <input
                        id="card-number-input"
                        type="text"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="4242 4242 4242 4242"
                        className="w-full rounded-xl bg-zinc-950 border border-zinc-700/80 pl-3.5 pr-10 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-emerald-500 focus:outline-none"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] text-zinc-400 font-bold">
                        VISA / MC
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-medium text-zinc-400">Expiry (MM/YY)</label>
                      <input
                        id="card-expiry-input"
                        type="text"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        placeholder="12/28"
                        className="mt-1 w-full rounded-xl bg-zinc-950 border border-zinc-700/80 px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-zinc-400">CVC / CVV</label>
                      <input
                        id="card-cvc-input"
                        type="password"
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                        placeholder="888"
                        className="mt-1 w-full rounded-xl bg-zinc-950 border border-zinc-700/80 px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PayPal Form */}
              {activeTab === 'paypal' && (
                <div className="rounded-2xl bg-zinc-900/60 p-4 border border-zinc-800 text-center space-y-2">
                  <div className="flex justify-center text-sky-400">
                    <Wallet className="h-8 w-8" />
                  </div>
                  <p className="text-xs text-zinc-300 font-medium">
                    PayPal Express Checkout Gateway
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    Clicking &quot;Authorize Payment&quot; will securely connect to your PayPal balance or linked bank.
                  </p>
                </div>
              )}

              {/* Mobile Wallet Form */}
              {activeTab === 'wallet' && (
                <div className="rounded-2xl bg-zinc-900/60 p-4 border border-zinc-800 text-center space-y-2">
                  <div className="flex justify-center text-indigo-400">
                    <Smartphone className="h-8 w-8" />
                  </div>
                  <p className="text-xs text-zinc-300 font-medium">
                    Apple Pay / Google Pay Biometric Authorization
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    Pay securely using device tokenization without sharing card details.
                  </p>
                </div>
              )}

              {/* Crypto Form */}
              {activeTab === 'crypto' && (
                <div className="rounded-2xl bg-zinc-900/60 p-4 border border-zinc-800 space-y-3">
                  <label className="text-[11px] font-medium text-zinc-400">Select Cryptocurrency</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['USDT (TRC20)', 'Bitcoin (BTC)', 'Ethereum (ETH)', 'Solana (SOL)'].map((coin) => (
                      <button
                        key={coin}
                        type="button"
                        onClick={() => setSelectedCrypto(coin)}
                        className={`p-2 rounded-lg border text-xs font-semibold ${
                          selectedCrypto === coin
                            ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                            : 'border-zinc-800 bg-zinc-950 text-zinc-400'
                        }`}
                      >
                        {coin}
                      </button>
                    ))}
                  </div>
                  <div className="rounded-lg bg-zinc-950 p-2 text-center text-[10px] font-mono text-zinc-400">
                    Wallet: 0x71C...B49F (On-chain network verification)
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-2">
              <button
                id="submit-payment-btn"
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-5 py-3.5 text-sm font-extrabold shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.01] active:scale-98 cursor-pointer"
              >
                <Lock className="h-4 w-4" />
                <span>Pay {game.currencySymbol}{finalPrice.toFixed(2)} with Stripe Checkout</span>
              </button>

              <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-zinc-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Stripe 256-Bit SSL Encrypted</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Money-Back Guarantee</span>
                </span>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
