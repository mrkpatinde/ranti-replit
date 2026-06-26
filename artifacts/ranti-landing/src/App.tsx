import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { motion } from 'framer-motion';
import { Check, Clock, FileText, ArrowRight, X } from 'lucide-react';

const queryClient = new QueryClient();

// Fade In Animation Component
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

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      
      {/* 1. Header */}
      <header className="fixed top-0 left-0 right-0 h-16 border-b border-transparent bg-background/80 backdrop-blur-md z-50 transition-all duration-300 data-[scrolled=true]:border-border">
        <div className="max-w-5xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="font-bold text-xl tracking-tight text-primary">Ranti</div>
          <nav>
            <a href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Se connecter
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-grow pt-32 pb-16">
        
        {/* 2. Hero Section */}
        <section className="max-w-5xl mx-auto px-6 pt-10 pb-20 md:pb-28">
          <FadeIn>
            <h1 className="text-5xl md:text-6xl lg:text-[4rem] font-bold tracking-tight text-primary max-w-3xl leading-[1.1]">
              Vos loyers, sans confusion.
            </h1>
          </FadeIn>
          
          <FadeIn delay={0.1}>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Ranti aide les propriétaires à voir qui a payé, qui est en retard, et quelle preuve existe avant toute relance.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
              <a 
                href="/signup" 
                className="w-full sm:w-auto h-12 px-8 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground font-medium transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Ouvrir mon espace propriétaire
              </a>
              <a 
                href="/login" 
                className="w-full sm:w-auto h-12 px-8 inline-flex items-center justify-center rounded-md border border-input bg-transparent text-foreground font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Se connecter
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p className="mt-5 text-sm text-muted-foreground max-w-md">
              Pensé pour les propriétaires qui gèrent leurs loyers avec WhatsApp, un cahier, des appels ou des captures Mobile Money.
            </p>
          </FadeIn>
        </section>

        {/* 3. Product Card (Simulated UI) */}
        <section className="max-w-4xl mx-auto px-6 mb-32">
          <FadeIn delay={0.4}>
            <div className="rounded-xl border border-border bg-card shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col relative z-10">
              
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
              <div className="divide-y divide-border bg-card">
                
                {/* Row 1 */}
                <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-muted/10">
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
                </div>

                {/* Row 2 */}
                <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-muted/10">
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
                </div>

                {/* Row 3 */}
                <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-muted/10">
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
                </div>

              </div>
            </div>
          </FadeIn>
        </section>

        {/* 4. Section "Ce que Ranti clarifie" */}
        <section className="py-24 border-y border-border bg-muted/30">
          <div className="max-w-5xl mx-auto px-6">
            <FadeIn>
              <h2 className="text-2xl font-bold mb-12">La clarté, un mois après l'autre.</h2>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              
              <FadeIn delay={0.1} className="flex flex-col">
                <div className="h-10 w-10 rounded-lg bg-background border border-border flex items-center justify-center mb-5 text-foreground shadow-sm">
                  <Check size={18} />
                </div>
                <h3 className="text-lg font-semibold mb-2">Qui a payé</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Tu vois en un coup d'œil les paiements confirmés du mois.
                </p>
              </FadeIn>

              <FadeIn delay={0.2} className="flex flex-col">
                <div className="h-10 w-10 rounded-lg bg-background border border-border flex items-center justify-center mb-5 text-foreground shadow-sm">
                  <Clock size={18} />
                </div>
                <h3 className="text-lg font-semibold mb-2">Qui est en retard</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Tu identifies immédiatement les locataires qui n'ont pas encore payé.
                </p>
              </FadeIn>

              <FadeIn delay={0.3} className="flex flex-col">
                <div className="h-10 w-10 rounded-lg bg-background border border-border flex items-center justify-center mb-5 text-foreground shadow-sm">
                  <FileText size={18} />
                </div>
                <h3 className="text-lg font-semibold mb-2">Quelle preuve existe</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Capture, reçu ou note : chaque paiement est tracé.
                </p>
              </FadeIn>

            </div>
          </div>
        </section>

        {/* 5. Section "Adapté au terrain" */}
        <section className="py-24">
          <div className="max-w-5xl mx-auto px-6">
            <FadeIn>
              <h2 className="text-3xl font-bold mb-10">Adapté à votre façon de travailler</h2>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              
              <FadeIn delay={0.1}>
                <ul className="space-y-4">
                  {[
                    "Cash",
                    "Mobile Money",
                    "Virement bancaire",
                    "Preuves par capture d'écran",
                    "Reçus simples",
                    "Propriétaires de 1 à 20 logements"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary/40"></div>
                      <span className="text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </FadeIn>
              
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

        {/* 6. Section "Ce que Ranti n'est pas" */}
        <section className="py-24 bg-foreground text-background">
          <div className="max-w-5xl mx-auto px-6">
            <FadeIn>
              <h2 className="text-3xl font-bold mb-12 text-background">Ce que Ranti n'est pas</h2>
            </FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              
              <FadeIn delay={0.1}>
                <div className="pt-4 border-t border-background/20">
                  <div className="flex items-center gap-2 mb-3">
                    <X size={16} className="text-background/60" />
                    <h3 className="font-semibold text-background">Pas un logiciel compliqué</h3>
                  </div>
                  <p className="text-sm text-background/70 leading-relaxed">
                    Aucune configuration complexe. Vous ajoutez vos logements et vous commencez.
                  </p>
                </div>
              </FadeIn>

              <FadeIn delay={0.2}>
                <div className="pt-4 border-t border-background/20">
                  <div className="flex items-center gap-2 mb-3">
                    <X size={16} className="text-background/60" />
                    <h3 className="font-semibold text-background">Pas une banque</h3>
                  </div>
                  <p className="text-sm text-background/70 leading-relaxed">
                    L'argent ne passe pas par nous. Vous encaissez comme d'habitude.
                  </p>
                </div>
              </FadeIn>

              <FadeIn delay={0.3}>
                <div className="pt-4 border-t border-background/20">
                  <div className="flex items-center gap-2 mb-3">
                    <X size={16} className="text-background/60" />
                    <h3 className="font-semibold text-background">Pas une marketplace</h3>
                  </div>
                  <p className="text-sm text-background/70 leading-relaxed">
                    Vos locataires ne créent pas de compte. C'est votre outil privé.
                  </p>
                </div>
              </FadeIn>

              <FadeIn delay={0.4}>
                <div className="pt-4 border-t border-background/20">
                  <div className="flex items-center gap-2 mb-3">
                    <X size={16} className="text-background/60" />
                    <h3 className="font-semibold text-background">Pas un outil comptable</h3>
                  </div>
                  <p className="text-sm text-background/70 leading-relaxed">
                    Pas de bilan, pas de taxes. Juste le suivi des loyers pour savoir où vous en êtes.
                  </p>
                </div>
              </FadeIn>

            </div>
          </div>
        </section>

        {/* 7. CTA Final */}
        <section className="py-32">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <FadeIn>
              <h2 className="text-4xl font-bold tracking-tight mb-6">Commencez par suivre un seul logement.</h2>
              <p className="text-lg text-muted-foreground mb-10">
                Ajoutez un lieu, un logement, un locataire, puis suivez les loyers du mois.
              </p>
              <a 
                href="/signup" 
                className="inline-flex items-center justify-center h-12 px-8 rounded-md bg-primary text-primary-foreground font-medium transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring gap-2 group"
              >
                Ouvrir mon espace propriétaire
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </a>
            </FadeIn>
          </div>
        </section>

      </main>

      {/* 8. Footer */}
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
