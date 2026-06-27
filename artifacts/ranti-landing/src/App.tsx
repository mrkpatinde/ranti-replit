import { useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import {
  motion, AnimatePresence,
  useInView, useMotionValue, useTransform, animate
} from 'framer-motion';
import { Check, Clock, FileText, ArrowRight, X, ChevronDown, Shield, Zap } from 'lucide-react';

const queryClient = new QueryClient();
const EASE = [0.21, 0.47, 0.32, 0.98] as const;

// ─── CountUp ────────────────────────────────────────────────────────────────
function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString("fr-FR"));
  useEffect(() => {
    if (isInView) animate(count, target, { duration: 1.8, ease: "easeOut" });
  }, [isInView, count, target]);
  return <span ref={ref}><motion.span>{rounded}</motion.span>{suffix}</span>;
}

// ─── FaqItem ─────────────────────────────────────────────────────────────────
function FaqItem({ q, a, index, openIndex, setOpenIndex }: {
  q: string; a: string; index: number;
  openIndex: number | null; setOpenIndex: (i: number | null) => void;
}) {
  const isOpen = openIndex === index;
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => setOpenIndex(isOpen ? null : index)}
        className="flex w-full items-center justify-between py-5 text-left font-medium text-foreground"
      >
        {q}
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.28 }}>
          <ChevronDown size={18} className="text-muted-foreground flex-shrink-0 ml-4" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: EASE }}
            style={{ overflow: "hidden" }}
          >
            <p className="text-muted-foreground pb-5 leading-relaxed text-sm pr-10">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Logo SVG ────────────────────────────────────────────────────────────────
function RantiLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="7" fill="#0A0A0A" />
      <rect x="8" y="10" width="16" height="2.5" rx="1.25" fill="white" />
      <rect x="8" y="15" width="12" height="2.5" rx="1.25" fill="white" />
      <rect x="8" y="20" width="8" height="2.5" rx="1.25" fill="white" />
    </svg>
  );
}

// ─── Dashboard Card (product visual) ─────────────────────────────────────────
function DashboardCard() {
  const rows = [
    { name: "Aline", unit: "Chambre 1", status: "paid", detail: "Reçu prêt" },
    { name: "Koffi", unit: "Boutique", status: "late", detail: "Relancer" },
    { name: "Mireille", unit: "Appartement", status: "paid", detail: "Preuve disponible" },
    { name: "Omar", unit: "Studio", status: "paid", detail: "Reçu prêt" },
  ];
  return (
    <div className="rounded-2xl border border-border bg-card shadow-[0_24px_80px_rgb(0,0,0,0.07)] overflow-hidden">
      {/* Card header */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-card">
        <div className="flex items-center gap-3">
          <RantiLogo size={20} />
          <span className="font-semibold text-sm text-foreground">Tableau de bord</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-xs text-muted-foreground font-medium">Novembre 2025</span>
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-4 border-b border-border bg-muted/20">
        {[
          { label: "Attendus", value: "8", color: "text-foreground" },
          { label: "Payés", value: "5", color: "text-emerald-600" },
          { label: "En retard", value: "3", color: "text-amber-600" },
          { label: "Reçus", value: "2", color: "text-foreground" },
        ].map((s) => (
          <div key={s.label} className="px-4 py-3 flex flex-col gap-0.5">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{s.label}</span>
            <span className={`text-xl font-bold ${s.color}`}>{s.value}</span>
          </div>
        ))}
      </div>
      {/* Rows */}
      <div className="divide-y divide-border">
        {rows.map((row, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.45, delay: i * 0.08, ease: EASE }}
            className="px-6 py-3.5 flex items-center justify-between gap-4 hover:bg-muted/10 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-foreground flex-shrink-0">
                {row.name[0]}
              </div>
              <div className="min-w-0">
                <span className="font-medium text-sm text-foreground block truncate">{row.name}</span>
                <span className="text-xs text-muted-foreground">{row.unit}</span>
              </div>
            </div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
              row.status === "paid"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
                : "bg-amber-50 text-amber-700 border border-amber-200/50"
            }`}>
              {row.status === "paid" ? "Payé" : "En retard"}
            </span>
            <span className="text-xs text-muted-foreground hidden sm:block flex-shrink-0">{row.detail}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Home ─────────────────────────────────────────────────────────────────────
function Home() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const testimonials = [
    { text: "Avant Ranti, je relançais mes locataires par WhatsApp et je perdais le fil. Maintenant je vois tout en un coup d'œil.", name: "Aminata K.", location: "Abidjan — 6 logements" },
    { text: "En moins de dix minutes j'avais ajouté mes premiers locataires. Le reçu PDF, c'est ce que je faisais à la main avant.", name: "Jean-Paul M.", location: "Douala — 3 boutiques" },
    { text: "Mes locataires paient en Mobile Money. Je prends une capture, je l'attache dans Ranti. C'est tout. Je n'ai plus besoin de mon cahier.", name: "Fatou D.", location: "Dakar — 11 logements" },
    { text: "Simple, rapide, sans configuration. Exactement ce qu'il fallait pour ma petite activité de location.", name: "Moussa B.", location: "Bamako — 4 logements" },
    { text: "Je recommande à tous les propriétaires qui gèrent encore leurs loyers sur papier. Le gain de temps est réel.", name: "Chantal N.", location: "Yaoundé — 7 logements" },
  ];

  const faqs = [
    { q: "Mes locataires doivent-ils créer un compte ?", a: "Non. Ranti est votre outil privé. Vos locataires n'ont pas besoin de s'inscrire." },
    { q: "Est-ce que Ranti encaisse les paiements à ma place ?", a: "Non. L'argent passe toujours par vous : cash, Mobile Money, virement. Ranti vous aide seulement à garder la trace de ce qui a été reçu." },
    { q: "Mes données sont-elles en sécurité ?", a: "Oui. Vos données sont chiffrées et hébergées en toute sécurité. Vous seul avez accès à votre espace." },
    { q: "Est-ce que ça fonctionne sans connexion stable ?", a: "Ranti fonctionne depuis un navigateur web. Une connexion de base suffit. Nous travaillons sur une version mobile optimisée." },
    { q: "Puis-je exporter mes données ?", a: "Oui, vous pouvez générer des reçus PDF et consulter l'historique de tous vos paiements." },
  ];

  const heroWords = "Vos loyers, sans confusion.".split(" ");
  const heroContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
  const heroWord = {
    hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: EASE } }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans overflow-x-hidden">

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="fixed top-0 left-0 right-0 h-16 z-50 bg-background/80 backdrop-blur-md border-b border-transparent data-[scrolled=true]:border-border transition-colors"
      >
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <RantiLogo size={26} />
            <span className="font-bold text-lg tracking-tight text-primary">Ranti</span>
          </a>
          <div className="flex items-center gap-3">
            <a href="/login" className="hidden sm:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Se connecter
            </a>
            <motion.a
              href="/signup"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="inline-flex items-center h-9 px-5 rounded-full bg-primary text-primary-foreground text-sm font-semibold"
            >
              Commencer
            </motion.a>
          </div>
        </div>
      </motion.header>

      <main className="flex-grow">

        {/* ── HERO ───────────────────────────────────────────────────────────── */}
        <section className="relative flex flex-col items-center text-center pt-36 pb-0 overflow-hidden">
          {/* Background blobs — slow drift */}
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] overflow-hidden">
            <motion.div
              animate={{ x: [0, 38, -22, 14, 0], y: [0, -28, 20, -12, 0] }}
              transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
              className="absolute top-24 left-[12%] w-80 h-80 rounded-full bg-muted/80 blur-[90px]"
            />
            <motion.div
              animate={{ x: [0, -32, 18, -8, 0], y: [0, 24, -32, 12, 0] }}
              transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", repeatType: "mirror", delay: 4 }}
              className="absolute top-8 right-[8%] w-72 h-72 rounded-full bg-muted/60 blur-[80px]"
            />
            <motion.div
              animate={{ x: [0, 20, -28, 10, 0], y: [0, 30, -18, 22, 0], scale: [1, 1.08, 0.96, 1.04, 1] }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", repeatType: "mirror", delay: 9 }}
              className="absolute top-40 left-[38%] w-64 h-64 rounded-full bg-muted/50 blur-[100px]"
            />
          </div>

          <div className="relative max-w-4xl mx-auto px-6 flex flex-col items-center">
            {/* Title */}
            <motion.h1
              variants={heroContainer}
              initial="hidden"
              animate="visible"
              className="text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] font-bold tracking-tight text-primary leading-[1.0] mb-7"
            >
              {heroWords.map((w, i) => (
                <motion.span key={i} variants={heroWord} style={{ display: "inline-block", marginRight: "0.22em" }}>
                  {w}
                </motion.span>
              ))}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
              className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed mb-10"
            >
              Ranti aide les propriétaires à voir qui a payé, qui est en retard, et quelle preuve existe avant toute relance.
            </motion.p>

            {/* CTA pill */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65, ease: EASE }}
              className="flex flex-col sm:flex-row items-center gap-3"
            >
              <motion.a
                href="/signup"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
                className="inline-flex items-center gap-2 h-13 px-8 rounded-full bg-primary text-primary-foreground text-base font-semibold shadow-md hover:shadow-lg transition-shadow group"
              >
                Ouvrir mon espace propriétaire
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </motion.a>
              <a href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Déjà un compte ?
              </a>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-4 text-xs text-muted-foreground"
            >
              Gratuit jusqu'à 3 logements — aucune carte bancaire requise
            </motion.p>
          </div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9, ease: EASE }}
            className="relative mt-14 w-full border-t border-border py-5 bg-muted/20 backdrop-blur-sm"
          >
            <div className="max-w-4xl mx-auto px-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-3">
              {[
                { value: 320, suffix: "+", label: "propriétaires actifs" },
                { value: 4200, suffix: "", label: "loyers suivis" },
                { value: 12, suffix: "", label: "pays" },
              ].map((s, i) => (
                <div key={i} className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-foreground tracking-tight">
                    <CountUp target={s.value} suffix={s.suffix} />
                  </span>
                  <span className="text-sm text-muted-foreground">{s.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Dashboard visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6, ease: EASE }}
            className="relative max-w-3xl w-full mx-auto px-6 mt-16"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <DashboardCard />
            </motion.div>
            {/* Shadow glow */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-2/3 h-12 bg-foreground/5 blur-2xl rounded-full" />
          </motion.div>
        </section>

        {/* ── TESTIMONIALS SCROLLER ──────────────────────────────────────────── */}
        <section className="pt-28 pb-4 overflow-hidden">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE }}
            className="text-center text-xs font-medium text-muted-foreground uppercase tracking-widest mb-10"
          >
            Ce que disent les propriétaires
          </motion.p>

          {/* Marquee */}
          <div className="relative">
            <div className="flex gap-5 animate-marquee whitespace-nowrap w-max">
              {[...testimonials, ...testimonials].map((t, i) => (
                <div
                  key={i}
                  className="inline-flex flex-col w-72 flex-shrink-0 p-6 rounded-2xl border border-border bg-card shadow-sm"
                >
                  <p className="text-sm text-foreground leading-relaxed whitespace-normal mb-5">"{t.text}"</p>
                  <div className="mt-auto">
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{t.location}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Fade edges */}
            <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-background to-transparent" />
          </div>
        </section>

        {/* ── HOW IT WORKS — alternating sections ──────────────────────────── */}
        <section className="py-28">
          <div className="max-w-5xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px" }}
              transition={{ duration: 0.85, ease: EASE }}
              className="text-center mb-20"
            >
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-3">Comment ça marche</p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Trois étapes, c'est tout.</h2>
            </motion.div>

            <div className="flex flex-col gap-24">
              {[
                {
                  num: "01",
                  title: "Ajoutez vos logements",
                  body: "Créez vos lieux, vos logements et ajoutez vos locataires en quelques minutes. Pas de configuration complexe — vous commencez à suivre le jour même.",
                  flip: false,
                  visual: (
                    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4 font-medium">Mes logements</p>
                      {["Résidence Koumassi — 3 logements", "Villa Deux-Plateaux — 1 logement", "Immeuble Marcory — 4 logements"].map((l, i) => (
                        <div key={i} className="flex items-center gap-3 py-3 border-b border-border last:border-b-0">
                          <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-xs font-bold text-foreground">
                            {i + 1}
                          </div>
                          <span className="text-sm font-medium text-foreground">{l}</span>
                        </div>
                      ))}
                      <motion.div
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="mt-4 h-8 w-full rounded-lg border border-dashed border-border flex items-center justify-center text-xs text-muted-foreground gap-1.5"
                      >
                        + Ajouter un logement
                      </motion.div>
                    </div>
                  )
                },
                {
                  num: "02",
                  title: "Enregistrez les paiements",
                  body: "Cash, Mobile Money, virement — vous notez ce qui a été reçu et attachez une preuve si vous l'avez. Capture d'écran, photo, tout est accepté.",
                  flip: true,
                  visual: (
                    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4 font-medium">Enregistrer un paiement</p>
                      <div className="space-y-3">
                        <div className="p-3 rounded-xl bg-muted/40">
                          <p className="text-xs text-muted-foreground mb-1">Locataire</p>
                          <p className="text-sm font-semibold text-foreground">Aline — Chambre 1</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {["Cash", "Mobile Money", "Virement", "Autre"].map((m) => (
                            <div key={m} className={`p-2.5 rounded-lg border text-xs font-medium text-center cursor-pointer transition-colors ${m === "Mobile Money" ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-foreground"}`}>
                              {m}
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 p-3 rounded-xl border border-dashed border-border text-xs text-muted-foreground">
                          <FileText size={14} />
                          Joindre une preuve (optionnel)
                        </div>
                        <motion.div
                          whileHover={{ scale: 1.01 }}
                          className="h-10 rounded-xl bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center cursor-pointer"
                        >
                          Confirmer le paiement
                        </motion.div>
                      </div>
                    </div>
                  )
                },
                {
                  num: "03",
                  title: "Gardez une vue claire",
                  body: "Chaque mois, vous voyez qui a payé, qui est en retard, et vous générez un reçu en un clic. Fini les cahiers, fini les confusions.",
                  flip: false,
                  visual: (
                    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                      <div className="px-5 py-4 border-b border-border flex justify-between items-center">
                        <span className="text-sm font-semibold text-foreground">Vue du mois</span>
                        <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">Novembre</span>
                      </div>
                      {[
                        { name: "Aline", status: "Payé", color: "emerald" },
                        { name: "Koffi", status: "En retard", color: "amber" },
                        { name: "Mireille", status: "Payé", color: "emerald" },
                      ].map((r, i) => (
                        <div key={i} className="px-5 py-3.5 flex items-center justify-between border-b border-border last:border-b-0">
                          <span className="text-sm font-medium text-foreground">{r.name}</span>
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${r.color === "emerald" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                            {r.status}
                          </span>
                          {r.status === "Payé" && (
                            <motion.button
                              whileHover={{ scale: 1.04 }}
                              className="text-xs text-muted-foreground border border-border rounded-lg px-3 py-1.5 hover:bg-muted/50 transition-colors"
                            >
                              Reçu PDF
                            </motion.button>
                          )}
                        </div>
                      ))}
                    </div>
                  )
                }
              ].map((step, i) => (
                <div
                  key={i}
                  className={`grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center ${step.flip ? "md:[&>*:first-child]:order-2" : ""}`}
                >
                  <motion.div
                    className="flex flex-col"
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "0px" }}
                    transition={{ duration: 0.9, ease: EASE }}
                  >
                    <span className="text-4xl font-bold text-muted/60 mb-4 font-mono">{step.num}</span>
                    <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.body}</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "0px" }}
                    transition={{ duration: 0.9, delay: 0.12, ease: EASE }}
                  >
                    {step.visual}
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURE GRID ─────────────────────────────────────────────────── */}
        <section className="py-24 border-t border-border bg-muted/15">
          <div className="max-w-5xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px" }}
              transition={{ duration: 0.85, ease: EASE }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">La clarté, un mois après l'autre.</h2>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "0px" }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            >
              {[
                { icon: <Check size={20} />, title: "Qui a payé", body: "Vue instantanée des paiements confirmés du mois, logement par logement." },
                { icon: <Clock size={20} />, title: "Qui est en retard", body: "Identifiez immédiatement les locataires qui n'ont pas encore payé." },
                { icon: <FileText size={20} />, title: "Quelle preuve existe", body: "Capture, reçu ou note — chaque paiement a sa trace." },
                { icon: <Shield size={20} />, title: "Vous gardez le contrôle", body: "Ranti ne confirme rien automatiquement. Vous validez tout vous-même." },
                { icon: <Zap size={20} />, title: "Reçus en un clic", body: "Générez un reçu PDF propre à envoyer à votre locataire, sans effort." },
                { icon: <ArrowRight size={20} />, title: "Adapté au terrain", body: "Cash, Mobile Money, virement — tous les modes de paiement africains." },
              ].map((f, i) => (
                <motion.div
                  key={i}
                  variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } }}
                  whileHover={{ y: -4 }}
                  className="p-6 rounded-2xl border border-border bg-card shadow-sm flex flex-col gap-4 cursor-default"
                >
                  <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-foreground">
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1.5">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── CE QUE RANTI N'EST PAS ────────────────────────────────────────── */}
        <section className="py-28 bg-foreground text-background">
          <div className="max-w-5xl mx-auto px-6">
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px" }}
              transition={{ duration: 0.85, ease: EASE }}
              className="text-3xl md:text-4xl font-bold tracking-tight text-background mb-16 text-center"
            >
              Ce que Ranti n'est pas
            </motion.h2>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "0px" }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
            >
              {[
                { title: "Pas un logiciel compliqué", body: "Aucune configuration. Vous ajoutez vos logements et vous commencez." },
                { title: "Pas une banque", body: "L'argent ne passe pas par nous. Vous encaissez comme d'habitude." },
                { title: "Pas une marketplace", body: "Vos locataires ne créent pas de compte. C'est votre outil privé." },
                { title: "Pas un outil comptable", body: "Pas de bilan, pas de taxes. Juste le suivi des loyers." },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={{ hidden: { opacity: 0, y: 60 }, visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } } }}
                  className="pt-5 border-t border-background/20"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <X size={14} className="text-background/50" />
                    <h3 className="font-semibold text-background text-sm">{item.title}</h3>
                  </div>
                  <p className="text-sm text-background/60 leading-relaxed">{item.body}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── PRICING ──────────────────────────────────────────────────────── */}
        <section className="py-28 border-b border-border">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px" }}
              transition={{ duration: 0.85, ease: EASE }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Simple et gratuit pour commencer.</h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px" }}
              transition={{ duration: 0.9, delay: 0.08, ease: EASE }}
              whileHover={{ y: -4 }}
              className="rounded-3xl border border-border bg-card p-8 md:p-12 shadow-sm flex flex-col md:flex-row gap-10 md:gap-16 items-start"
            >
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center h-7 px-3 rounded-full bg-foreground text-background text-xs font-semibold uppercase tracking-wide">
                  Offre de lancement
                </div>
                <div>
                  <h3 className="text-5xl font-bold tracking-tight mb-1">Gratuit</h3>
                  <p className="text-muted-foreground">Jusqu'à 3 logements inclus.</p>
                </div>
                <ul className="space-y-3">
                  {["Toutes les fonctionnalités de base", "Aucune carte bancaire requise", "Support par email"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check size={11} className="text-primary" />
                      </div>
                      <span className="text-foreground font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-5 border-t border-border">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock size={14} />
                    <span><span className="font-medium text-foreground">À venir :</span> Formule propriétaire (4+ logements).</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center md:items-start gap-3 w-full md:w-auto">
                <motion.a
                  href="/signup"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 350, damping: 22 }}
                  className="inline-flex items-center justify-center h-13 px-8 rounded-full bg-primary text-primary-foreground font-semibold whitespace-nowrap shadow-sm text-sm"
                >
                  Ouvrir mon espace — c'est gratuit
                </motion.a>
                <p className="text-xs text-muted-foreground">Moins de 2 minutes pour s'inscrire</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <section className="py-24">
          <div className="max-w-2xl mx-auto px-6">
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px" }}
              transition={{ duration: 0.85, ease: EASE }}
              className="text-3xl font-bold tracking-tight mb-12"
            >
              Questions fréquentes
            </motion.h2>
            <div className="border-y border-border">
              {faqs.map((faq, i) => (
                <FaqItem key={i} q={faq.q} a={faq.a} index={i} openIndex={openIndex} setOpenIndex={setOpenIndex} />
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ────────────────────────────────────────────────────── */}
        <section className="py-32 bg-muted/20 border-t border-border">
          <div className="max-w-3xl mx-auto px-6 text-center flex flex-col items-center">
            <motion.h2
              initial={{ opacity: 0, y: 60, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "0px" }}
              transition={{ duration: 0.9, ease: EASE }}
              className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
            >
              Commencez par suivre un seul logement.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px" }}
              transition={{ duration: 0.75, delay: 0.15, ease: EASE }}
              className="text-lg text-muted-foreground mb-10 max-w-md"
            >
              Ajoutez un lieu, un logement, un locataire, puis suivez les loyers du mois.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px" }}
              transition={{ duration: 0.75, delay: 0.28, ease: EASE }}
            >
              <motion.a
                href="/signup"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
                className="inline-flex items-center gap-2 h-14 px-10 rounded-full bg-primary text-primary-foreground text-base font-semibold shadow-md hover:shadow-lg transition-shadow group"
              >
                Ouvrir mon espace propriétaire
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </motion.a>
            </motion.div>
          </div>
        </section>

      </main>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-2">
            <RantiLogo size={20} />
            <span className="text-sm font-semibold text-foreground">Ranti</span>
          </a>
          <p className="text-xs text-muted-foreground">© 2025 Ranti. Tous droits réservés.</p>
          <div className="flex items-center gap-6">
            <a href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Se connecter</a>
            <a href="/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Ouvrir un espace</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('header');
      if (header) {
        header.setAttribute('data-scrolled', window.scrollY > 10 ? 'true' : 'false');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
