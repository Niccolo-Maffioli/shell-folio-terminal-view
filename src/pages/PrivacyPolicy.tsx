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
    sections: { title: string; body: string[] }[];
}> = {
    en: {
        badge: "Privacy & Policy",
        title: "How this portfolio handles your data",
        subtitle: "This notice explains, in plain terms, how personal data is handled across the portfolio.",
        updatedLabel: "Last updated: January 19, 2026",
        languageLabel: "Language",
        backLabel: "← Back to portfolio",
        contactIntro: "For any questions regarding this policy you can reach me at",
        contactEmail: "nico.maffioli@gmail.com",
        sections: [
            {
                title: "Data Controller",
                body: [
                    "This website is operated by Niccolò Maffioli.",
                    "For any privacy-related request you can contact me at nico.maffioli@gmail.com.",
                ],
            },
            {
                title: "Types of data processed",
                body: [
                    "This portfolio does not require accounts, registrations, or payments.",
                    "No personal data is collected automatically, except for the information you voluntarily provide when contacting me via email, LinkedIn, or other channels listed on the site (for example your name, email address, or the content of your message).",
                ],
            },
            {
                title: "Purpose and legal basis of processing",
                body: [
                    "Personal data voluntarily provided is processed solely to respond to contact or information requests and to initiate potential professional communications.",
                    "Legal basis: performance of pre-contractual measures requested by the data subject (Art. 6(1)(b) GDPR) and the legitimate interest of the data controller in replying to incoming communications (Art. 6(1)(f) GDPR).",
                ],
            },
            {
                title: "Processing methods",
                body: [
                    "Data is processed lawfully, fairly, and transparently, mainly through electronic tools and with appropriate security measures in place.",
                ],
            },
            {
                title: "Data retention",
                body: [
                    "Personal data is retained only for the time strictly necessary to handle and respond to the request, after which it is deleted unless retention is required by law or further communication is agreed upon with the data subject.",
                ],
            },
            {
                title: "Cookies and similar technologies",
                body: [
                    "This website does not use marketing or tracking cookies.",
                ],
            },
            {
                title: "Local Storage",
                body: [
                    "A single localStorage key (terminal-onboarding) stores whether the introductory tour has been dismissed:",
                    "- it remains entirely within the user's browser;",
                    "- it is not transmitted to external servers;",
                    "- it can be cleared at any time through the browser settings.",
                ],
            },
            {
                title: "Analytics and technical logs",
                body: [
                    "The website is hosted on Vercel infrastructure and may use Vercel Analytics, which collects aggregated and technical usage data (such as page views, device type, or performance metrics) without personal profiling.",
                    "Additionally, the hosting provider may generate minimal technical logs (for example IP addresses and HTTP requests) exclusively for security, maintenance, and performance purposes.",
                ],
            },
            {
                title: "Hosting and data processing",
                body: [
                    "The site's code is deployed and hosted via Vercel Inc..",
                    "A custom domain is used instead of a vercel.app subdomain, but the application infrastructure remains provided by Vercel.",
                ],
            },
            {
                title: "Data sharing and international transfers",
                body: [
                    "Personal data is not shared with third parties for marketing or commercial purposes.",
                    "Technical data may be processed on servers located outside the European Union, including in the United States, in accordance with applicable legal safeguards such as Standard Contractual Clauses.",
                ],
            },
            {
                title: "User accounts and payments",
                body: [
                    "The website does not include registration or authentication systems, restricted areas, payment checkouts, subscriptions, or donation features; consequently, no payment data is collected or processed.",
                ],
            },
            {
                title: "Data subject rights",
                body: [
                    "Under Regulation (EU) 2016/679 you have the right to access your personal data, request rectification or updates, erasure, restriction of processing, object to processing, and request data portability (where applicable).",
                    "Requests can be sent to nico.maffioli@gmail.com.",
                    "You also have the right to lodge a complaint with the Italian Data Protection Authority (Garante per la Protezione dei Dati Personali).",
                ],
            },
            {
                title: "Policy updates",
                body: [
                    "This policy may be updated if new features are introduced (for example analytics tools or personal areas).",
                    "Any significant updates will be published on this page together with the new revision date.",
                    "For any questions regarding this policy you can contact nico.maffioli@gmail.com.",
                ],
            },
        ],
    },
    it: {
        badge: "Privacy & Policy",
        title: "Come tratto i tuoi dati",
        subtitle: "Questa informativa descrive in modo trasparente come gestisco i dati personali raccolti tramite il portfolio.",
        updatedLabel: "Ultimo aggiornamento: 19 gennaio 2026",
        languageLabel: "Lingua",
        backLabel: "← Torna al portfolio",
        contactIntro: "Per qualsiasi domanda su questa informativa puoi scrivermi a",
        contactEmail: "nico.maffioli@gmail.com",
        sections: [
            {
                title: "Titolare del trattamento",
                body: [
                    "Questo sito è gestito da Niccolò Maffioli.",
                    "Per qualsiasi richiesta relativa alla privacy o al trattamento dei dati personali puoi contattarmi all'indirizzo email: nico.maffioli@gmail.com.",
                ],
            },
            {
                title: "Tipologia di dati trattati",
                body: [
                    "Il portfolio non richiede account, registrazioni né pagamenti.",
                    "Il sito non raccoglie dati personali in modo diretto, ad eccezione delle informazioni che scegli volontariamente di fornire contattandomi tramite email, LinkedIn o altri canali indicati nel sito (ad esempio nome, indirizzo email o contenuto del messaggio).",
                ],
            },
            {
                title: "Finalità e base giuridica del trattamento",
                body: [
                    "I dati personali forniti volontariamente vengono trattati esclusivamente per rispondere a richieste di contatto o informazioni e per avviare eventuali comunicazioni professionali.",
                    "Base giuridica del trattamento:",
                    "- esecuzione di misure precontrattuali richieste dall'interessato (art. 6.1.b GDPR);",
                    "- legittimo interesse del titolare a rispondere alle comunicazioni ricevute (art. 6.1.f GDPR).",
                ],
            },
            {
                title: "Modalità del trattamento",
                body: [
                    "Il trattamento avviene in modo lecito, corretto e trasparente, prevalentemente tramite strumenti elettronici e nel rispetto di misure di sicurezza adeguate.",
                ],
            },
            {
                title: "Conservazione dei dati",
                body: [
                    "I dati personali vengono conservati per il tempo strettamente necessario a gestire e rispondere alla richiesta e successivamente cancellati, salvo obblighi di legge o eventuali comunicazioni ulteriori concordate con l'interessato.",
                ],
            },
            {
                title: "Cookie e tecnologie simili",
                body: [
                    "Il sito non utilizza cookie di profilazione o marketing.",
                ],
            },
            {
                title: "Local Storage",
                body: [
                    "Viene utilizzata una sola chiave di localStorage (terminal-onboarding) per ricordare se il tour introduttivo è già stato visualizzato:",
                    "- resta esclusivamente nel browser dell'utente;",
                    "- non viene trasmessa a server esterni;",
                    "- può essere eliminata in qualunque momento tramite le impostazioni del browser.",
                ],
            },
            {
                title: "Analytics e log tecnici",
                body: [
                    "Il sito è ospitato su infrastruttura Vercel e può utilizzare Vercel Analytics, che raccoglie dati aggregati e tecnici (come visualizzazioni di pagina, tipo di dispositivo o metriche di performance) senza finalità di profilazione personale.",
                    "Il provider di hosting può inoltre generare log tecnici minimi (ad esempio indirizzi IP e richieste HTTP) esclusivamente per motivi di sicurezza, manutenzione e prestazioni.",
                ],
            },
            {
                title: "Hosting e trattamento dei dati",
                body: [
                    "Il codice del sito è distribuito e ospitato tramite Vercel Inc..",
                    "Il dominio utilizzato è personalizzato e non fa uso di sottodomini vercel.app, ma l'infrastruttura applicativa resta fornita da Vercel.",
                ],
            },
            {
                title: "Comunicazione e trasferimento dei dati",
                body: [
                    "I dati personali non vengono condivisi con terze parti per finalità commerciali o di marketing.",
                    "Il trattamento dei dati tecnici può avvenire su server localizzati anche al di fuori dell'Unione Europea, in particolare negli Stati Uniti, nel rispetto delle misure di garanzia previste dalla normativa (ad esempio clausole contrattuali standard).",
                ],
            },
            {
                title: "Account, aree riservate e pagamenti",
                body: [
                    "Il sito non prevede sistemi di registrazione o autenticazione, aree riservate né funzioni di pagamento, checkout, abbonamenti o donazioni; di conseguenza non vengono raccolti dati di pagamento.",
                ],
            },
            {
                title: "Diritti dell'interessato",
                body: [
                    "Ai sensi del Regolamento (UE) 2016/679 hai il diritto di accedere ai tuoi dati personali, richiederne la rettifica o l'aggiornamento, la cancellazione, la limitazione del trattamento, opporti al trattamento e richiedere la portabilità dei dati (ove applicabile).",
                    "Le richieste possono essere inviate a nico.maffioli@gmail.com.",
                    "Hai inoltre il diritto di proporre reclamo al Garante per la Protezione dei Dati Personali.",
                ],
            },
            {
                title: "Aggiornamenti dell'informativa",
                body: [
                    "Questa informativa potrà essere aggiornata in caso di modifiche tecniche o funzionali (ad esempio introduzione o modifica di strumenti di analisi).",
                    "Ogni aggiornamento rilevante verrà pubblicato in questa pagina con l'indicazione della nuova data di revisione.",
                    "Per qualsiasi domanda relativa a questa informativa puoi scrivermi a nico.maffioli@gmail.com.",
                ],
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
                        {section.body.map((paragraph, paragraphIndex) => (
                            <p key={`${section.title}-${paragraphIndex}`}>{paragraph}</p>
                        ))}
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
