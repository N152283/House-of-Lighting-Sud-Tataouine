import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-slate-50">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-amber-100/30 skew-x-12 transform origin-top-right -z-10" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -z-10" />
      
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-3 h-3" />
            Éclairez votre monde
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-[1.1] mb-6">
            L'Art de la <span className="text-amber-500">Lumière</span> à Tataouine
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
            Découvrez notre collection exclusive de lustres, appliques et matériel électrique de haute qualité. Transformez votre espace avec élégance et style.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white px-8">
              Voir la Collection
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-slate-200 text-slate-600 hover:bg-white">
              Nous Contacter
            </Button>
          </div>
          
          <div className="mt-12 grid grid-cols-3 gap-8 border-t border-slate-200 pt-8">
            <div>
              <div className="text-2xl font-bold text-slate-900">500+</div>
              <div className="text-sm text-slate-500">Produits</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">10+</div>
              <div className="text-sm text-slate-500">Années d'Expérience</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">100%</div>
              <div className="text-sm text-slate-500">Qualité Garantie</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative"
        >
          <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-8 border-white">
            <img
              src="https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=1000&auto=format&fit=crop"
              alt="Elegant Chandelier"
              className="w-full h-[600px] object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          {/* Floating element */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-10 -right-10 z-20 bg-white p-6 rounded-xl shadow-xl max-w-[200px]"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold">
                ★
              </div>
              <div className="text-sm font-bold text-slate-900">Nouveauté</div>
            </div>
            <p className="text-xs text-slate-500">Lustre Moderne Cristal - Collection 2024</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
