import React from 'react';
import { ShieldCheck, Zap, DollarSign, RefreshCw, Lock, Award } from 'lucide-react';

export const TrustSection: React.FC = () => {
  return (
    <section className="border-t border-zinc-800/80 bg-zinc-950/60 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-xl sm:text-2xl font-black text-white">
            How KeyVault Direct Pricing Works
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400">
            We index real-time verified price feeds across digital key distributors and pass the absolute lowest price directly to you with complete transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-zinc-900/60 p-6 border border-zinc-800/80 hover:border-zinc-700 transition-colors">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
              <DollarSign className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white">Direct Market Pricing</h3>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
              Every search query scrapes the latest verified global distributor feeds to lock in the lowest available price. You get genuine retail savings with zero hidden fees.
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-900/60 p-6 border border-zinc-800/80 hover:border-zinc-700 transition-colors">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 mb-4">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white">Direct Digital Delivery</h3>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
              Straightforward digital fulfillment. Your genuine digital product code and activation steps are delivered securely to your email upon order confirmation.
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-900/60 p-6 border border-zinc-800/80 hover:border-zinc-700 transition-colors">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white">100% Genuine Guarantee</h3>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
              Every key is verified for official DRM activation (Steam, EA, Ubisoft, Xbox, PlayStation). Full money-back replacement protection on every single order.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
