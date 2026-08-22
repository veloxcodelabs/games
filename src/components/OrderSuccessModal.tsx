import React, { useState } from 'react';
import { PaymentResult } from '../types';
import {
  CheckCircle,
  Copy,
  Check,
  Download,
  ExternalLink,
  Mail,
  ShieldCheck,
  Gamepad2,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';

interface OrderSuccessModalProps {
  order: PaymentResult;
  onClose: () => void;
  onViewLibrary: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  onViewLibrary,
}) => {
  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(true);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(order.licenseKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadInvoice = () => {
    const invoiceContent = `=====================================================
KEYVAULT - DIGITAL GAME KEY RECEIPT
=====================================================
Order ID:       ${order.orderId}
Date:           ${new Date(order.timestamp).toLocaleString()}
Customer Email: ${order.customerEmail}

GAME DETAILS:
-----------------------------------------------------
Game Title:     ${order.gameName}
Edition:        ${order.edition}
Platform:       ${order.platform}
Digital Key:    ${order.licenseKey}
Total Paid:     ${order.currency} ${order.amount.toFixed(2)}

ACTIVATION INSTRUCTIONS:
1. Open Steam / DRM client on your PC/Console.
2. Select "Games" -> "Activate a Product on Steam...".
3. Enter your unique digital key above.
4. Download and enjoy your game!

Merchant: KeyVault Direct Key Sourcing
Guaranteed 100% Genuine & Authentic License
=====================================================`;

    const blob = new Blob([invoiceContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `KeyVault_Receipt_${order.orderId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md overflow-y-auto">
      <div
        id="order-success-modal"
        className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-zinc-950 border border-emerald-500/40 shadow-2xl my-8 ring-1 ring-emerald-500/20"
      >
        {/* Glow */}
        <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 h-32 w-64 rounded-full bg-emerald-500/20 blur-3xl" />

        {/* Top Header */}
        <div className="p-6 sm:p-8 text-center border-b border-zinc-800/80 bg-gradient-to-b from-emerald-950/40 via-zinc-900/60 to-transparent">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-950/50">
            <CheckCircle className="h-9 w-9" />
          </div>

          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
            <Sparkles className="h-3.5 w-3.5" /> Order Completed Successfully
          </div>

          <h2 className="mt-2 text-2xl font-black text-white">Your Digital Key is Ready!</h2>
          <p className="mt-1 text-xs text-zinc-400">
            Order Reference: <span className="font-mono font-semibold text-zinc-200">{order.orderId}</span>
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Game summary */}
          <div className="flex items-center justify-between rounded-2xl bg-zinc-900/80 p-4 border border-zinc-800">
            <div>
              <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                {order.platform}
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">{order.gameName}</h3>
              <p className="text-xs text-zinc-400">{order.edition}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-zinc-400">Paid:</span>
              <div className="text-lg font-extrabold text-emerald-400">
                ${order.amount.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Activation Key Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-zinc-300 flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5 text-emerald-400" />
                <span>Your Unique Product Activation Key:</span>
              </label>
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="flex items-center gap-1 text-zinc-400 hover:text-zinc-200 text-[11px]"
              >
                {showKey ? (
                  <>
                    <EyeOff className="h-3.5 w-3.5" /> <span>Hide</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-3.5 w-3.5" /> <span>Reveal</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-zinc-900 border-2 border-emerald-500/40 p-4 shadow-inner">
              <span className="font-mono text-base sm:text-lg font-black tracking-widest text-emerald-300 select-all">
                {showKey ? order.licenseKey : '•••••-•••••-•••••'}
              </span>

              <button
                id="copy-license-key-btn"
                type="button"
                onClick={handleCopyKey}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-3.5 py-2 text-xs font-extrabold shadow-md transition-all active:scale-95 cursor-pointer ml-3 flex-shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy Key</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Email dispatch notice */}
          <div className="flex items-center gap-3 rounded-xl bg-zinc-900/40 p-3 border border-zinc-800 text-xs text-zinc-400">
            <Mail className="h-4 w-4 text-emerald-400 flex-shrink-0" />
            <span>
              A digital receipt and key backup were also dispatched to{' '}
              <strong className="text-zinc-200">{order.customerEmail}</strong>.
            </span>
          </div>

          {/* Quick Activation Guide */}
          <div className="rounded-2xl bg-zinc-900/60 p-4 border border-zinc-800/80 text-xs space-y-2">
            <div className="font-bold text-zinc-200 flex items-center gap-1.5">
              <Gamepad2 className="h-4 w-4 text-emerald-400" />
              <span>How to Activate Your Game:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-zinc-400 pl-1 text-[11px]">
              <li>Launch your game client (Steam, EA App, Ubisoft Connect, or Xbox).</li>
              <li>Navigate to &quot;Add a Game&quot; or &quot;Redeem Code&quot;.</li>
              <li>Paste the activation code above and click &quot;Activate&quot;.</li>
              <li>The game will be permanently linked to your personal gaming account.</li>
            </ol>
          </div>

          {/* Bottom Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              id="download-invoice-btn"
              type="button"
              onClick={handleDownloadInvoice}
              className="flex items-center justify-center gap-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-3 text-xs font-bold border border-zinc-700 transition-colors cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Download Invoice / Receipt</span>
            </button>

            <button
              id="done-order-btn"
              type="button"
              onClick={() => {
                onClose();
                onViewLibrary();
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-4 py-3 text-xs font-black shadow-lg shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>View in My Keys Library</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
