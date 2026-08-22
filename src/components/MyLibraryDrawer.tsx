import React, { useState } from 'react';
import { PurchasedKey } from '../types';
import {
  X,
  Key,
  Copy,
  Check,
  Download,
  Calendar,
  Gamepad2,
  Trash2,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface MyLibraryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  purchasedKeys: PurchasedKey[];
  onClearLibrary?: () => void;
}

export const MyLibraryDrawer: React.FC<MyLibraryDrawerProps> = ({
  isOpen,
  onClose,
  purchasedKeys,
  onClearLibrary,
}) => {
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (keyText: string, id: string) => {
    navigator.clipboard.writeText(keyText);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2500);
  };

  const handleDownloadInvoice = (item: PurchasedKey) => {
    const invoiceContent = `=====================================================
KEYVAULT - DIGITAL GAME KEY RECEIPT
=====================================================
Order ID:       ${item.orderId}
Date:           ${new Date(item.purchaseDate).toLocaleString()}
Customer Email: ${item.customerEmail}

GAME DETAILS:
-----------------------------------------------------
Game Title:     ${item.gameName}
Edition:        ${item.edition}
Platform:       ${item.platform}
Digital Key:    ${item.licenseKey}
Total Paid:     ${item.currency} ${item.pricePaid.toFixed(2)}

ACTIVATION INSTRUCTIONS:
1. Open Steam / DRM client.
2. Go to "Games" -> "Activate a Product on Steam...".
3. Paste: ${item.licenseKey}
4. Install and Play!

Merchant: KeyVault Direct Key Sourcing
=====================================================`;

    const blob = new Blob([invoiceContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `KeyVault_Receipt_${item.orderId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
      <div
        id="my-library-drawer"
        className="relative flex h-full w-full max-w-md flex-col bg-zinc-950 border-l border-zinc-800 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/90 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">My Purchased Keys</h2>
              <p className="text-xs text-zinc-400">
                {purchasedKeys.length} {purchasedKeys.length === 1 ? 'game key' : 'game keys'} saved
              </p>
            </div>
          </div>

          <button
            id="close-library-btn"
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Keys List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {purchasedKeys.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center text-zinc-500 space-y-3">
              <Key className="h-12 w-12 text-zinc-700" />
              <div className="text-sm font-semibold text-zinc-400">No Purchased Keys Yet</div>
              <p className="text-xs text-zinc-500 max-w-xs">
                Search for any game above, complete checkout, and your activation keys will appear here.
              </p>
            </div>
          ) : (
            purchasedKeys.map((item) => (
              <div
                key={item.id}
                id={`purchased-key-item-${item.id}`}
                className="rounded-2xl bg-zinc-900/80 p-4 border border-zinc-800 space-y-3 shadow-sm hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                      {item.platform}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1 truncate">{item.gameName}</h4>
                    <p className="text-xs text-zinc-400">{item.edition}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-bold text-emerald-400">
                      {item.currencySymbol}{item.pricePaid.toFixed(2)}
                    </span>
                    <div className="text-[10px] text-zinc-500">
                      {new Date(item.purchaseDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Key Reveal and Copy Box */}
                <div className="flex items-center justify-between rounded-xl bg-zinc-950 p-2.5 border border-zinc-800 font-mono text-xs text-emerald-400">
                  <span className="truncate select-all font-bold">{item.licenseKey}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(item.licenseKey, item.id)}
                    className="flex items-center gap-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-2 py-1 text-[11px] font-semibold transition-all active:scale-95 ml-2 flex-shrink-0 cursor-pointer"
                  >
                    {copiedKeyId === item.id ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Receipt action */}
                <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
                  <span>Ref: {item.orderId}</span>
                  <button
                    type="button"
                    onClick={() => handleDownloadInvoice(item)}
                    className="flex items-center gap-1 text-zinc-400 hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    <Download className="h-3 w-3" />
                    <span>Download Receipt</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {purchasedKeys.length > 0 && onClearLibrary && (
          <div className="border-t border-zinc-800 bg-zinc-900/60 p-4">
            <button
              type="button"
              onClick={onClearLibrary}
              className="w-full flex items-center justify-center gap-1.5 text-xs text-zinc-500 hover:text-rose-400 py-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear Stored Keys History</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
