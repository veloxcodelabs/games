import React from 'react';
import { ShieldCheck, Zap, DollarSign, Ticket } from 'lucide-react';

export const TrustSection: React.FC = () => {
  return (
    <section className="border-t border-zinc-800/80 bg-zinc-950/60 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-xl sm:text-2xl font-black text-white">
            How KeyVault Direct Pricing &amp; Vouchers Work
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400">
            We index real-time verified price feeds across digital key distributors and provide exclusive partner vouchers for maximum savings.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="rounded-2xl bg-zinc-900/60 p-5 border border-zinc-800/80 hover:border-zinc-700 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3.5">
                <DollarSign className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Live Market Price Index</h3>
              <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                Live search queries check verified distributor feeds to display the lowest market price with direct transparency.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-zinc-900/60 p-5 border border-zinc-800/80 hover:border-zinc-700 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3.5">
                <Ticket className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Instant Checkout Codes</h3>
              <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                Copy exclusive voucher codes (<span className="text-amber-400 font-mono">SUMMER12</span> for G2A, <span className="text-orange-400 font-mono">KINGUIN10</span> for Kinguin, or <span className="text-emerald-400 font-mono">BASICS</span> for GAMIVO) with 1 click to apply extra savings at checkout.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-zinc-900/60 p-5 border border-zinc-800/80 hover:border-zinc-700 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 mb-3.5">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-white">GAMIVO Cart Flexibility</h3>
              <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                If GAMIVO automatically applies a promo in your cart, you can keep it or clear it and enter our code <span className="text-emerald-400 font-mono">BASICS</span> for 8% off.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-zinc-900/60 p-5 border border-zinc-800/80 hover:border-zinc-700 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3.5">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-white">100% Genuine Guarantee</h3>
              <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                Every key is verified for official DRM activation (Steam, EA, Ubisoft, Xbox, PlayStation) with full seller protection.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
