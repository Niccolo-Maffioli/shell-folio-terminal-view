import { Link, useLocation, useNavigate } from "react-router-dom";
import type { LocaleCode } from "../locales/appContent";

const PRIVACY_COPY: Record<LocaleCode, {
    badge: string;
    title: string;
    subtitle: string;
    updatedLabel: string;
    languageLabel: string;
    backLabel: string;
    contactIntro: string;
    contactEmail: string;
    sections: { title: string; body: string }[];
}> = {
    en: {
        badge: "Privacy & Policy",
        title: "How this portfolio handles your data",
        subtitle: "I keep things simple: no accounts, no payments, and only the information you choose to share when you reach out.",
        updatedLabel: "Last updated: January 19, 2026",
        languageLabel: "Language",
        backLabel: "← Back to portfolio",
        contactIntro: "For any question about this policy you can write to",
        contactEmail: "nico.maffioli@gmail.com",
        sections: [
            {
                title: "Data Controller",
                body: "This website is maintained by Niccolò Maffioli. You can reach me at nico.maffioli@gmail.com for any privacy related inquiry.",
            },
            {
                title: "Personal Data Handling",
                body: "The site does not include login areas, comment forms, or payment modules. If you decide to contact me via email, LinkedIn, or other channels listed in the terminal, I will receive only the information you voluntarily share (for example your name or email) and I will use it solely to respond to your request.",
            },
            {
                title: "Cookies",
                body: "No marketing or tracking cookies are set. The site relies exclusively on essential browser storage described below.",
            },
            {
                title: "Local Storage",
                body: "A single localStorage key (terminal-onboarding) remembers whether you have already dismissed the onboarding overlay. This value stays in your browser, is not sent to my servers, and can be cleared at any time through your browser settings.",
            },
            {
                title: "Analytics",
                body: "Traffic analytics are not currently in use. I do not profile visitors or monitor browsing behavior beyond the minimal technical logs produced by the hosting provider for security and performance.",
            },
            {
                title: "User Accounts & Access Controls",
                body: "There are no account systems, invitations, or gated areas. Every piece of content is publicly accessible without registration.",
            },
            {
                title: "Payments",
                body: "This portfolio has no checkout, subscription, or donation functionality. No payment data is collected or processed.",
            },
            {
                title: "Data Sharing",
                body: "I do not share visitor information with third parties. Standard infrastructure providers (such as the hosting platform or CDN) only process data to deliver the site securely and are bound by their own privacy terms.",
            },
            {
                title: "Your Rights",
                body: "You may request clarification, updates, or deletion of any personal data you shared by contacting me via email. I will respond promptly to confirm the action taken.",
            },
            {
                title: "Updates",
                body: "This notice may evolve if new features (for example analytics or account areas) are introduced. Material changes will be announced on this page together with a new revision date.",
            },
        ],
    },
    it: {
        badge: "Privacy & Policy",
        title: "Come tratto i tuoi dati",
        subtitle: "Il portfolio non richiede account né pagamenti e raccoglie solo le informazioni che scegli di inviarmi quando mi contatti.",
        updatedLabel: "Ultimo aggiornamento: 19 gennaio 2026",
        languageLabel: "Lingua",
        backLabel: "← Torna al portfolio",
        contactIntro: "Per qualsiasi domanda su questa informativa puoi scrivermi a",
        contactEmail: "nico.maffioli@gmail.com",
        sections: [
            {
                title: "Titolare del trattamento",
                body: "Questo sito è gestito da Niccolò Maffioli. Per richieste relative alla privacy puoi contattarmi all'indirizzo nico.maffioli@gmail.com.",
            },
            {
                title: "Gestione dei dati personali",
                body: "Il sito non prevede aree di login, form di commento o moduli di pagamento. Se scegli di contattarmi via email, LinkedIn o altri canali presenti nel terminale, riceverò solo le informazioni che decidi di condividere (ad esempio nome o email) e le userò esclusivamente per rispondere alla tua richiesta.",
            },
            {
                title: "Cookie",
                body: "Non vengono impostati cookie di marketing o tracciamento. Il sito utilizza esclusivamente gli archivi essenziali del browser descritti di seguito.",
            },
            {
                title: "Local Storage",
                body: "Una sola chiave di localStorage (terminal-onboarding) memorizza se hai già chiuso il tour introduttivo. Il valore resta sul tuo browser, non viene inviato ai miei server e puoi eliminarlo in qualunque momento dalle impostazioni del browser.",
            },
            {
                title: "Analytics",
                body: "Al momento non utilizzo strumenti di analytics. Non profilo i visitatori e non monitoro la navigazione oltre i log tecnici minimi generati dal provider di hosting per motivi di sicurezza e prestazioni.",
            },
            {
                title: "Account utente e accessi",
                body: "Non esistono sistemi di registrazione, inviti o aree riservate. Tutti i contenuti sono pubblicamente accessibili senza autenticazione.",
            },
            {
                title: "Pagamenti",
                body: "Questo portfolio non include funzioni di checkout, abbonamenti o donazioni. Nessun dato di pagamento viene raccolto o trattato.",
            },
            {
                title: "Condivisione con terze parti",
                body: "Non condivido informazioni sui visitatori con soggetti terzi. I fornitori infrastrutturali standard (hosting, CDN) trattano i dati solo per erogare il servizio e sono vincolati alle loro policy di riservatezza.",
            },
            {
                title: "I tuoi diritti",
                body: "Puoi richiedere chiarimenti, aggiornamenti o la cancellazione dei dati personali che mi hai fornito scrivendomi via email. Ti risponderò tempestivamente confermando l'azione eseguita.",
            },
            {
                title: "Aggiornamenti",
                body: "Questa informativa potrà evolvere se introdurrò nuove funzionalità (ad esempio analytics o aree personali). Ogni modifica sostanziale verrà segnalata in questa pagina insieme alla nuova data di revisione.",
            },
        ],
    },
};

const PrivacyPolicy = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const langParam = params.get("lang") === "it" ? "it" : "en";
    const copy = PRIVACY_COPY[langParam];

    const handleLanguageChange = (lang: LocaleCode) => {
        if (lang === langParam) return;
        const next = new URLSearchParams(location.search);
        if (lang === "en") {
            next.delete("lang");
        } else {
            next.set("lang", lang);
        }
        navigate({
            pathname: location.pathname,
            search: next.toString() ? `?${next.toString()}` : "",
        }, { replace: true });
    };

    return (
        <div className="min-h-screen bg-terminal-bg text-terminal-fg px-4 py-10 sm:px-8">
            <div className="mx-auto w-full max-w-3xl space-y-8 text-sm leading-relaxed sm:text-base">
                <div className="flex flex-wrap items-center justify-between gap-4 text-[10px] uppercase tracking-[0.3em] text-terminal-fg/60">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-1 text-terminal-cyan/80 transition-colors hover:text-terminal-cyan"
                    >
                        {copy.backLabel}
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className="text-terminal-fg/40">{copy.languageLabel}</span>
                        {["en", "it"].map((lang) => (
                            <button
                                key={lang}
                                type="button"
                                onClick={() => handleLanguageChange(lang as LocaleCode)}
                                className={`rounded-full border px-3 py-1 font-semibold tracking-[0.3em] transition-colors ${langParam === lang
                                    ? "border-terminal-cyan/70 bg-terminal-cyan/90 text-terminal-bg"
                                    : "border-terminal-fg/20 text-terminal-fg/60 hover:text-terminal-cyan"
                                    }`}
                                aria-pressed={langParam === lang}
                            >
                                {lang.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                <header className="space-y-4">
                    <p className="text-xs uppercase tracking-[0.35em] text-terminal-cyan/70">{copy.badge}</p>
                    <h1 className="text-3xl font-semibold text-terminal-cyan">{copy.title}</h1>
                    <p className="text-terminal-fg/70">{copy.subtitle}</p>
                    <p className="text-terminal-fg/50">{copy.updatedLabel}</p>
                </header>

                {copy.sections.map((section) => (
                    <section key={section.title} className="space-y-2">
                        <h2 className="text-lg font-semibold text-terminal-cyan">{section.title}</h2>
                        <p>{section.body}</p>
                    </section>
                ))}

                <div className="border-t border-terminal-fg/20 pt-6 text-sm text-terminal-fg/80">
                    <p>
                        {copy.contactIntro}
                        <a
                            href={`mailto:${copy.contactEmail}`}
                            className="ml-1 text-terminal-cyan underline-offset-4 hover:underline"
                        >
                            {copy.contactEmail}
                        </a>
                        .
                    </p>
                    <Link
                        to="/"
                        className="mt-4 inline-flex items-center text-terminal-cyan/80 underline-offset-4 hover:underline"
                    >
                        {copy.backLabel}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
