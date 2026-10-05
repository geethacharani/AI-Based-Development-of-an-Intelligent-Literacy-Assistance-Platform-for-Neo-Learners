import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, CheckCircle, Share, PlusSquare } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let globalDeferredPrompt: BeforeInstallPromptEvent | null = null;

export const PWAInstallPrompt: React.FC<{ forceShow?: boolean; onClose?: () => void }> = ({ forceShow = false, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(globalDeferredPrompt);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  useEffect(() => {
    // Check if app is already running as installed PWA
    const inStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    setIsStandalone(inStandaloneMode);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Check saved preference
    const dismissedPref = localStorage.getItem('lingopath_pwa_dismissed');
    if (dismissedPref === 'true' && !forceShow) {
      setIsDismissed(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      globalDeferredPrompt = promptEvent;
      setDeferredPrompt(promptEvent);
    };

    const handleAppInstalled = () => {
      setIsStandalone(true);
      globalDeferredPrompt = null;
      setDeferredPrompt(null);
      localStorage.setItem('lingopath_pwa_dismissed', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [forceShow]);

  if (isStandalone) {
    if (forceShow) {
      return (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center space-x-3 text-emerald-300 text-xs">
          <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>LingoPath AI is already installed and active on your device!</span>
        </div>
      );
    }
    return null;
  }

  if (isDismissed && !forceShow) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    if (!deferredPrompt) {
      // Fallback instruction if prompt event not fired automatically by browser
      alert('To install LingoPath AI, open your browser menu (⋮) and tap "Install app" or "Add to Home screen".');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallSuccess(true);
      setIsStandalone(true);
      localStorage.setItem('lingopath_pwa_dismissed', 'true');
    }
    globalDeferredPrompt = null;
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('lingopath_pwa_dismissed', 'true');
    if (onClose) onClose();
  };

  if (installSuccess) {
    return (
      <div className="bg-emerald-900/40 border border-emerald-500/40 rounded-2xl p-4 text-center space-y-2 animate-in fade-in">
        <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
        <h4 className="font-bold text-white text-sm">App Installed Successfully!</h4>
        <p className="text-xs text-slate-300">LingoPath AI is now ready on your home screen.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-indigo-900/90 via-slate-900 to-brand-950/90 border border-brand-500/40 rounded-2xl p-5 shadow-2xl space-y-4 text-white relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/30 flex-shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-white tracking-wide">Download LingoPath AI</h4>
            <p className="text-xs text-slate-300">Learn anywhere, anytime with fast offline access.</p>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed">
        Install LingoPath AI on your phone or desktop for an app-like experience, instant access, and offline lesson practice.
      </p>

      {showIOSGuide ? (
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 space-y-2.5 text-xs text-slate-200 animate-in fade-in">
          <div className="font-bold text-amber-300 flex items-center space-x-1.5">
            <Share className="w-4 h-4 text-amber-400" />
            <span>To install on iPhone / iPad (Safari):</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-slate-300">
            <li>Tap the <strong className="text-white">Share button</strong> at the bottom of Safari.</li>
            <li>Scroll down and select <strong className="text-white">'Add to Home Screen' <PlusSquare className="w-3.5 h-3.5 inline text-slate-400" /></strong>.</li>
            <li>Tap <strong className="text-white">Add</strong> in the top right corner.</li>
          </ol>
          <button
            onClick={() => setShowIOSGuide(false)}
            className="w-full mt-2 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-semibold text-[11px] hover:bg-slate-700"
          >
            Got it
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-3 pt-1">
          <button
            onClick={handleInstallClick}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-indigo-600 hover:from-brand-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-brand-500/30 transition transform hover:-translate-y-0.5"
          >
            <Download className="w-4 h-4" />
            <span>Install App</span>
          </button>

          <button
            onClick={handleDismiss}
            className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition"
          >
            Maybe Later
          </button>
        </div>
      )}
    </div>
  );
};
