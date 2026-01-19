import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { HelmetProvider } from "react-helmet-async";
import TerminalLoading from "./components/TerminalLoading";
import { TerminalProvider, useTerminalStore } from "./store/terminalStore";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import type { LocaleCode } from "./locales/appContent";

const queryClient = new QueryClient();

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula caricamento per 2.5 secondi
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <TerminalProvider>
            <Toaster />
            <Sonner />

            {loading ? (
              <TerminalLoading lang="en" onFinish={() => setLoading(false)} />
            ) : (
              <BrowserRouter>
                <div className="relative min-h-screen">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <div className="fixed bottom-3 right-4 z-50 flex flex-col items-end gap-1 text-[10px] uppercase tracking-[0.2em] text-terminal-fg/40">
                    <PrivacyLink />
                  </div>
                </div>
              </BrowserRouter>
            )}
          </TerminalProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;

const PRIVACY_LINK_COPY: Record<LocaleCode, { label: string; aria: string; search?: string }> = {
  en: {
    label: "Privacy & Policy",
    aria: "Read the Privacy & Policy page in English",
    search: "",
  },
  it: {
    label: "Informativa Privacy",
    aria: "Leggi l'informativa privacy in italiano",
    search: "?lang=it",
  },
};

const PrivacyLink = () => {
  const { locale } = useTerminalStore();
  const copy = PRIVACY_LINK_COPY[locale];
  const destination = copy.search ? `/privacy${copy.search}` : "/privacy";

  return (
    <Link
      to={destination}
      className="transition-colors hover:text-terminal-cyan/80"
      aria-label={copy.aria}
    >
      {copy.label}
    </Link>
  );
};
