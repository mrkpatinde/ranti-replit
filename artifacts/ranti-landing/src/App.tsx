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
import { Check, Clock, FileText, ArrowRight, X, ChevronDown } from 'lucide-react';

const queryClient = new QueryClient();

// Fade In Animation Component (Generic fallback)
const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    className={className}
  >
    {children}
  </motion.div>
);

// CountUp Animation Component
function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString("fr-FR"));

  useEffect(() => {
    if (isInView) {
      animate(count, target, { duration: 1.8, ease: "easeOut" });
    }
  }, [isInView, count, target]);

  return <span ref={ref}><motion.span>{rounded}</motion.span>{suffix}</span>;
}

// FAQ Item Component
function FaqItem({ q, a, index, openIndex, setOpenIndex }: { q: string; a: string; index: number; openIndex: number | null; setOpenIndex: (i: number | null) => void }) {
  const isOpen = openIndex === index;
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => setOpenIndex(isOpen ? null : index)}
        className="flex w-full items-center justify-between py-6 text-left font-medium text-lg text-foreground"
      >
        {q}
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown size={20} className="text-muted-foreground flex-shrink-0" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
            style={{ overflow: "hidden" }}
          >
            <p className="text-muted-foreground pb-6 leading-relaxed pr-8">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Home() {
  const heroTitle = "Vos loyers, sans confusion.";
  const words = heroTitle.split(" ");
  
  const heroContainerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06 } }
  };
  const heroWordVariants = {
    hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] } }
  };

  const lineRef = useRef(null);
  const lineInView = useInView(lineRef, { once: true, margin: "-100px" });

  const stepContainerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } }
  };
  const stepVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] } }
  };

  const rowVariants = {
    hidden: { opacity: 0, x: 24 },
    visible: (i: number) => ({
      opacity: 1, x: 0,
      transition: { duration: 0.5, delay: i * 0.12, ease: [0.21, 0.47, 0.32, 0.98] }
    })
  };

  const listVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, x: -16 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  const notRantiContainerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } }
  };
  const notRantiItemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] } }
  };

  const testimonials = [
    {
      text: "Avant Ranti, je relançais mes locataires par WhatsApp et je perdais le fil. Maintenant je vois tout en un coup d'œil dès que j'ouvre l'appli.",
      name: "Aminata K.",
      location: "Abidjan — 6 logements"
    },
    {
      text: "J'avais peur que ce soit compliqué. En fait j'ai ajouté mes premiers locataires en moins de dix minutes. Le reçu PDF, c'est ce que je préférais faire à la main avant.",
      name: "Jean-Paul M.",
      location: "Douala — 3 boutiques"
    },
    {
      text: "Mes locataires paient en Mobile Money. Je prends une capture, je l'attache dans Ranti. C'est tout. Je n'ai plus besoin de mon cahier.",
      name: "Fatou D.",
      location: "Dakar — 11 logements"
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqs = [
    {
      q: "Mes locataires doivent-ils créer un compte ?",
      a: "Non. Ranti est votre outil privé. Vos locataires n'ont pas besoin de s'inscrire."
    },
    {
      q: "Est-ce que Ranti encaisse les paiements à ma place ?",
      a: "Non. L'argent passe toujours par vous : cash, Mobile Money, virement. Ranti vous aide seulement à garder la trace de ce qui a été reçu."
    },
    {
      q: "Mes données sont-elles en sécurité ?",
      a: "Oui. Vos données sont chiffrées et hébergées en toute sécurité. Vous seul avez accès à votre espace."
    },
    {
      q: "Est-ce que ça fonctionne sans connexion stable ?",
      a: "Ranti fonctionne depuis un navigateur web. Une connexion de base suffit. Nous travaillons sur une version mobile optimisée."
    },
    {
      q: "Puis-je exporter mes données ?",
      a: "Oui, vous pouvez générer des reçus PDF et consulter l'historique de tous vos paiements."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      
      {/* 1. Header */}
      <motion.header
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="fixed top-0 left-0 right-0 h-16 border-b border-transparent bg-background/80 backdrop-blur-md z-50 transition-colors duration-300 data-[scrolled=true]:border-border"
      >
        <div className="max-w-5xl mx-auto px-6 h-full flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 group">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect width="32" height="32" rx="7" className="fill-primary"/>
              <rect x="8" y="10" width="16" height="2.5" rx="1.25" fill="white"/>
              <rect x="8" y="15" width="12" height="2.5" rx="1.25" fill="white"/>
              <rect x="8" y="20" width="8" height="2.5" rx="1.25" fill="white"/>
            </svg>
            <span className="font-bold text-xl tracking-tight text-primary">Ranti</span>
          </a>
          <nav>
            <a href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Se connecter
            </a>
          </nav>
        </div>
      </motion.header>

      <main className="flex-grow pt-32 pb-16">
        
        {/* 2. Hero Section */}
        <section className="max-w-5xl mx-auto px-6 pt-10 pb-20 md:pb-28">
          
          <motion.h1 
            variants={heroContainerVariants} 
            initial="hidden" 
            animate="visible"
            className="text-5xl md:text-6xl lg:text-[4rem] font-bold tracking-tight text-primary max-w-3xl leading-[1.1]"
          >
            {words.map((word, i) => (
              <motion.span key={i} variants={heroWordVariants} style={{ display: "inline-block", marginRight: "0.25em" }}>
                {word}
              </motion.span>
            ))}
          </motion.h1>
          
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Ranti aide les propriétaires à voir qui a payé, qui est en retard, et quelle preuve existe avant toute relance.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}>
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
              <motion.a 
                href="/signup" 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="w-full sm:w-auto h-12 px-8 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Ouvrir mon espace propriétaire
              </motion.a>
              <a 
                href="/login" 
                className="w-full sm:w-auto h-12 px-8 inline-flex items-center justify-center rounded-md border border-input bg-transparent text-foreground font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Se connecter
              </a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}>
            <p className="mt-5 text-sm text-muted-foreground max-w-md">
              Pensé pour les propriétaires qui gèrent leurs loyers avec WhatsApp, un cahier, des appels ou des captures Mobile Money.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}>
            <div className="mt-12 flex items-center flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground"><CountUp target={320} suffix="+" /></span> propriétaires actifs
              </div>
              <div className="h-4 w-px bg-border hidden sm:block"></div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground"><CountUp target={4200} /></span> loyers suivis
              </div>
              <div className="h-4 w-px bg-border hidden sm:block"></div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground"><CountUp target={12} /></span> pays
              </div>
            </div>
          </motion.div>
        </section>

        {/* 3. Comment ça marche */}
        <section className="py-24 border-t border-border">
          <div className="max-w-5xl mx-auto px-6">
            <FadeIn>
              <h2 className="text-3xl font-bold mb-16">Trois étapes, c'est tout.</h2>
            </FadeIn>
            
            <motion.div 
              variants={stepContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-12 relative"
            >
              <motion.div
                ref={lineRef}
                style={{ transformOrigin: "left" }}
                initial={{ scaleX: 0 }}
                animate={lineInView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
                className="hidden md:block absolute top-6 left-[10%] right-[10%] h-[1px] bg-border/50 z-0"
              />
              
              <motion.div variants={stepVariants} className="relative z-10 flex flex-col">
                <div className="h-12 w-12 rounded-full bg-background border border-border flex items-center justify-center mb-6 text-sm font-medium text-muted-foreground shadow-sm">01</div>
                <h3 className="text-xl font-semibold mb-3">Ajoutez vos logements</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Créez vos lieux, vos logements et invitez vos locataires en quelques minutes.
                </p>
              </motion.div>
              
              <motion.div variants={stepVariants} className="relative z-10 flex flex-col">
                <div className="h-12 w-12 rounded-full bg-background border border-border flex items-center justify-center mb-6 text-sm font-medium text-muted-foreground shadow-sm">02</div>
                <h3 className="text-xl font-semibold mb-3">Enregistrez les paiements</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Cash, Mobile Money, virement : vous notez ce qui a été reçu et vous attachez une preuve si vous l'avez.
                </p>
              </motion.div>
              
              <motion.div variants={stepVariants} className="relative z-10 flex flex-col">
                <div className="h-12 w-12 rounded-full bg-background border border-border flex items-center justify-center mb-6 text-sm font-medium text-muted-foreground shadow-sm">03</div>
                <h3 className="text-xl font-semibold mb-3">Gardez une vue claire</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Chaque mois, vous voyez qui a payé, qui est en retard, et vous générez un reçu en un clic.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* 4. Product Card (Simulated UI) */}
        <section className="max-w-4xl mx-auto px-6 mb-32 pt-16">
          <FadeIn delay={0.1}>
            <motion.div 
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-xl border border-border bg-card shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col relative z-10"
            >
              
              {/* Card Header */}
              <div className="px-6 py-5 border-b border-border flex justify-between items-center bg-card">
                <h3 className="font-semibold text-card-foreground">Ce mois-ci</h3>
                <div className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">Novembre</div>
              </div>
              
              {/* Stats Bar */}
              <div className="px-6 py-4 bg-muted/30 border-b border-border grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 text-sm">
                <div className="flex flex-col space-y-1">
                  <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Attendus</span>
                  <span className="font-medium text-foreground text-lg">8 loyers</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Payés</span>
                  <span className="font-medium text-emerald-700 dark:text-emerald-400 text-lg">5</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">En retard</span>
                  <span className="font-medium text-amber-600 dark:text-amber-500 text-lg">3</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Reçus prêts</span>
                  <span className="font-medium text-foreground text-lg">2</span>
                </div>
              </div>

              {/* Table / List */}
              <div className="divide-y divide-border bg-card overflow-hidden">
                
                {/* Row 1 */}
                <motion.div
                  custom={0}
                  variants={rowVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-muted/10"
                >
                  <div className="flex flex-col flex-1 min-w-[150px]">
                    <span className="font-medium text-foreground">Aline</span>
                    <span className="text-sm text-muted-foreground mt-0.5">Chambre 1</span>
                  </div>
                  <div className="flex-1 flex items-center justify-start sm:justify-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/20">
                      Payé
                    </span>
                  </div>
                  <div className="flex-1 flex items-center justify-start sm:justify-end text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5"><FileText size={14} className="text-muted-foreground/70" /> Reçu prêt</span>
                  </div>
                </motion.div>

                {/* Row 2 */}
                <motion.div
                  custom={1}
                  variants={rowVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-muted/10"
                >
                  <div className="flex flex-col flex-1 min-w-[150px]">
                    <span className="font-medium text-foreground">Koffi</span>
                    <span className="text-sm text-muted-foreground mt-0.5">Boutique</span>
                  </div>
                  <div className="flex-1 flex items-center justify-start sm:justify-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-medium dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/20">
                      En retard
                    </span>
                  </div>
                  <div className="flex-1 flex items-center justify-start sm:justify-end text-sm">
                    <button className="text-foreground font-medium hover:underline flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border hover:bg-muted/50 transition-colors">
                      Relancer
                    </button>
                  </div>
                </motion.div>

                {/* Row 3 */}
                <motion.div
                  custom={2}
                  variants={rowVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-muted/10"
                >
                  <div className="flex flex-col flex-1 min-w-[150px]">
                    <span className="font-medium text-foreground">Mireille</span>
                    <span className="text-sm text-muted-foreground mt-0.5">Appartement</span>
                  </div>
                  <div className="flex-1 flex items-center justify-start sm:justify-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/20">
                      Payé
                    </span>
                  </div>
                  <div className="flex-1 flex items-center justify-start sm:justify-end text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Check size={14} className="text-muted-foreground/70" /> Preuve disponible</span>
                  </div>
                </motion.div>

              </div>
            </motion.div>
          </FadeIn>
        </section>

        {/* 5. Section "Ce que Ranti clarifie" */}
        <section className="py-24 border-y border-border bg-muted/30">
          <div className="max-w-5xl mx-auto px-6">
            <FadeIn>
              <h2 className="text-2xl font-bold mb-12">La clarté, un mois après l'autre.</h2>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              
              <FadeIn delay={0.1} className="flex flex-col">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                  className="h-10 w-10 rounded-lg bg-background border border-border flex items-center justify-center mb-5 text-foreground shadow-sm cursor-default"
                >
                  <Check size={18} />
                </motion.div>
                <h3 className="text-lg font-semibold mb-2">Qui a payé</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Tu vois en un coup d'œil les paiements confirmés du mois.
                </p>
              </FadeIn>

              <FadeIn delay={0.2} className="flex flex-col">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                  className="h-10 w-10 rounded-lg bg-background border border-border flex items-center justify-center mb-5 text-foreground shadow-sm cursor-default"
                >
                  <Clock size={18} />
                </motion.div>
                <h3 className="text-lg font-semibold mb-2">Qui est en retard</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Tu identifies immédiatement les locataires qui n'ont pas encore payé.
                </p>
              </FadeIn>

              <FadeIn delay={0.3} className="flex flex-col">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
                  className="h-10 w-10 rounded-lg bg-background border border-border flex items-center justify-center mb-5 text-foreground shadow-sm cursor-default"
                >
                  <FileText size={18} />
                </motion.div>
                <h3 className="text-lg font-semibold mb-2">Quelle preuve existe</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Capture, reçu ou note : chaque paiement est tracé.
                </p>
              </FadeIn>

            </div>
          </div>
        </section>

        {/* 6. Section "Adapté au terrain" */}
        <section className="py-24">
          <div className="max-w-5xl mx-auto px-6">
            <FadeIn>
              <h2 className="text-3xl font-bold mb-10">Adapté à votre façon de travailler</h2>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              
              <motion.ul variants={listVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="space-y-4">
                {[
                  "Cash",
                  "Mobile Money",
                  "Virement bancaire",
                  "Preuves par capture d'écran",
                  "Reçus simples",
                  "Propriétaires de 1 à 20 logements"
                ].map((item, i) => (
                  <motion.li key={i} variants={itemVariants} className="flex items-center gap-3 text-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary/40"></div>
                    <span className="text-lg">{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
              
              <FadeIn delay={0.2} className="flex items-start">
                <div className="p-6 rounded-lg border border-border bg-muted/20">
                  <p className="text-foreground leading-relaxed font-medium">
                    Le propriétaire reste celui qui valide chaque paiement.
                  </p>
                  <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                    Ranti ne confirme rien automatiquement. Vous gardez le contrôle total sur ce qui est marqué comme payé ou en retard.
                  </p>
                </div>
              </FadeIn>

            </div>
          </div>
        </section>

        {/* 7. Section "Ce que Ranti n'est pas" */}
        <section className="py-24 bg-foreground text-background">
          <div className="max-w-5xl mx-auto px-6">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7 }}
              className="text-3xl font-bold mb-12 text-background"
            >
              Ce que Ranti n'est pas
            </motion.h2>
            
            <motion.div
              variants={notRantiContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              
              <motion.div variants={notRantiItemVariants} className="pt-4 border-t border-background/20">
                <div className="flex items-center gap-2 mb-3">
                  <X size={16} className="text-background/60" />
                  <h3 className="font-semibold text-background">Pas un logiciel compliqué</h3>
                </div>
                <p className="text-sm text-background/70 leading-relaxed">
                  Aucune configuration complexe. Vous ajoutez vos logements et vous commencez.
                </p>
              </motion.div>

              <motion.div variants={notRantiItemVariants} className="pt-4 border-t border-background/20">
                <div className="flex items-center gap-2 mb-3">
                  <X size={16} className="text-background/60" />
                  <h3 className="font-semibold text-background">Pas une banque</h3>
                </div>
                <p className="text-sm text-background/70 leading-relaxed">
                  L'argent ne passe pas par nous. Vous encaissez comme d'habitude.
                </p>
              </motion.div>

              <motion.div variants={notRantiItemVariants} className="pt-4 border-t border-background/20">
                <div className="flex items-center gap-2 mb-3">
                  <X size={16} className="text-background/60" />
                  <h3 className="font-semibold text-background">Pas une marketplace</h3>
                </div>
                <p className="text-sm text-background/70 leading-relaxed">
                  Vos locataires ne créent pas de compte. C'est votre outil privé.
                </p>
              </motion.div>

              <motion.div variants={notRantiItemVariants} className="pt-4 border-t border-background/20">
                <div className="flex items-center gap-2 mb-3">
                  <X size={16} className="text-background/60" />
                  <h3 className="font-semibold text-background">Pas un outil comptable</h3>
                </div>
                <p className="text-sm text-background/70 leading-relaxed">
                  Pas de bilan, pas de taxes. Juste le suivi des loyers pour savoir où vous en êtes.
                </p>
              </motion.div>

            </motion.div>
          </div>
        </section>

        {/* 8. Témoignages */}
        <section className="py-24 border-t border-border">
          <div className="max-w-5xl mx-auto px-6">
            <FadeIn>
              <h2 className="text-3xl font-bold mb-16">Ce que disent les propriétaires</h2>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
                  whileHover={{ y: -4, boxShadow: "0 12px 40px rgb(0,0,0,0.04)" }}
                  className="flex flex-col h-full border-l-2 border-primary/20 pl-6 py-4 rounded-r-xl transition-all"
                >
                  <p className="text-foreground leading-relaxed mb-6 text-lg flex-grow">
                    "{t.text}"
                  </p>
                  <div>
                    <p className="font-semibold text-foreground">{t.name}</p>
                    <p className="text-sm text-muted-foreground">{t.location}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 9. Pricing */}
        <section className="py-24 border-t border-border bg-muted/10">
          <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
            <FadeIn>
              <h2 className="text-3xl font-bold mb-12">Simple et gratuit pour commencer.</h2>
            </FadeIn>
            
            <FadeIn delay={0.1} className="w-full">
              <motion.div
                whileHover={{ y: -4, boxShadow: "0 12px 40px rgb(0,0,0,0.08)" }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="p-8 md:p-12 rounded-3xl border border-border bg-card text-left flex flex-col md:flex-row items-center md:items-start justify-between gap-10 shadow-sm"
              >
                <div className="flex-1 space-y-6 w-full">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-foreground text-background text-xs font-semibold tracking-wide uppercase">
                    Offre de lancement
                  </div>
                  <div>
                    <h3 className="text-4xl font-bold tracking-tight mb-2">Gratuit</h3>
                    <p className="text-muted-foreground text-lg">Jusqu'à 3 logements inclus.</p>
                  </div>
                  
                  <ul className="space-y-4 py-2">
                    <li className="flex items-center gap-3 text-sm">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check size={12} className="text-primary" />
                      </div>
                      <span className="text-foreground font-medium">Toutes les fonctionnalités de base</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check size={12} className="text-primary" />
                      </div>
                      <span className="text-foreground font-medium">Aucune carte bancaire requise</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check size={12} className="text-primary" />
                      </div>
                      <span className="text-foreground font-medium">Support par email</span>
                    </li>
                  </ul>
                  
                  <div className="pt-6 border-t border-border mt-6">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Clock size={16} />
                      <span className="font-medium text-foreground">À venir :</span> Formule propriétaire (4+ logements).
                    </p>
                  </div>
                </div>
                
                <div className="w-full md:w-auto flex flex-col justify-center items-center md:items-end">
                  <motion.a 
                    href="/signup" 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="inline-flex items-center justify-center h-14 px-8 w-full md:w-auto rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring whitespace-nowrap shadow-sm"
                  >
                    Ouvrir mon espace — c'est gratuit
                  </motion.a>
                  <p className="text-xs text-center text-muted-foreground mt-4">Moins de 2 minutes pour s'inscrire</p>
                </div>
              </motion.div>
            </FadeIn>
          </div>
        </section>

        {/* 10. FAQ */}
        <section className="py-24 border-t border-border">
          <div className="max-w-3xl mx-auto px-6">
            <FadeIn>
              <h2 className="text-3xl font-bold mb-12">Questions fréquentes</h2>
            </FadeIn>
            
            <div className="border-y border-border">
              {faqs.map((faq, i) => (
                <FaqItem key={i} q={faq.q} a={faq.a} index={i} openIndex={openIndex} setOpenIndex={setOpenIndex} />
              ))}
            </div>
          </div>
        </section>

        {/* 11. CTA Final */}
        <section className="py-32">
          <div className="max-w-3xl mx-auto px-6 text-center flex flex-col items-center">
            <motion.h2
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="text-4xl font-bold tracking-tight mb-6"
            >
              Commencez par suivre un seul logement.
            </motion.h2>
            
            <FadeIn delay={0.2} className="w-full flex flex-col items-center">
              <p className="text-lg text-muted-foreground mb-10">
                Ajoutez un lieu, un logement, un locataire, puis suivez les loyers du mois.
              </p>
              <motion.a 
                href="/signup" 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="inline-flex items-center justify-center h-12 px-8 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring gap-2 group"
              >
                Ouvrir mon espace propriétaire
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </motion.a>
            </FadeIn>
          </div>
        </section>

      </main>

      {/* 12. Footer */}
      <footer className="border-t border-border py-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">Ranti © 2025</p>
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
  // Setup header scroll listener
  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('header');
      if (header) {
        if (window.scrollY > 10) {
          header.setAttribute('data-scrolled', 'true');
        } else {
          header.removeAttribute('data-scrolled');
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
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
