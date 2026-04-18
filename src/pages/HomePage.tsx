import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Lightbulb, MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';
import Navbar from '@/src/components/Navbar';
import Hero from '@/src/components/Hero';
import ProductCard from '@/src/components/ProductCard';
import ContactForm from '@/src/components/ContactForm';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/src/lib/supabase';
import { Product, Category } from '@/src/types';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase.from('categories').select('*').order('name');
    if (!error && data) setCategories(data);
  };

  const fetchProducts = async () => {
    setLoading(true);
    let query = supabase.from('products').select('*, categories(*)');
    
    if (selectedCategory) {
      query = query.eq('category_id', selectedCategory);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (!error && data) setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-amber-100 selection:text-amber-900">
      <Navbar />
      <Hero />

      {/* Products Section */}
      <section id="products" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="border-amber-500 text-amber-600 mb-4 px-4 py-1">Notre Catalogue</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Éclairez Votre Intérieur</h2>
            <p className="text-slate-600">Découvrez nos collections de luminaires haut de gamme pour une ambiance unique.</p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(null)}
              className={selectedCategory === null ? 'bg-amber-500 hover:bg-amber-600 border-none px-6' : 'border-slate-200 text-slate-600'}
            >
              Tous
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(cat.id)}
                className={selectedCategory === cat.id ? 'bg-amber-500 hover:bg-amber-600 border-none px-6' : 'border-slate-200 text-slate-600'}
              >
                {cat.name}
              </Button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-[400px] bg-slate-200 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-slate-200">
              <p className="text-slate-500">Aucun produit trouvé dans cette catégorie.</p>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 overflow-hidden bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-amber-500/10 rounded-full -z-10" />
              <img
                src="https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?q=80&w=1000&auto=format&fit=crop"
                alt="Showroom"
                className="rounded-2xl shadow-2xl relative z-10"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-6 -right-6 bg-amber-500 text-white p-8 rounded-2xl shadow-xl hidden md:block z-20">
                <div className="text-4xl font-bold mb-1">10+</div>
                <div className="text-sm font-medium opacity-90 uppercase tracking-widest">Ans d'Expertise</div>
              </div>
            </div>
            <div>
              <Badge variant="outline" className="border-amber-500 text-amber-600 mb-4 px-4 py-1 uppercase tracking-widest text-[10px]">Notre Histoire</Badge>
              <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">L'Excellence de l'Éclairage à Tataouine</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Située à Tataouine, House of Lighting Sud est votre destination privilégiée pour tout matériel électrique et solutions d'éclairage de luxe.
              </p>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Nous combinons élégance, qualité et service client exceptionnel pour transformer vos espaces en lieux d'exception.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center shrink-0 border border-amber-100">
                    <Lightbulb className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Qualité</h4>
                    <p className="text-xs text-slate-500">Produits certifiés et durables.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center shrink-0 border border-amber-100">
                    <MapPin className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Service</h4>
                    <p className="text-xs text-slate-500">Accompagnement de proximité.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-amber-500/5 -z-0" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20">
            <div>
              <Badge variant="outline" className="border-amber-500 text-amber-500 mb-6 px-4 py-1 uppercase tracking-widest text-[10px]">Contact</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">Vous avez un projet ? <br /><span className="text-amber-500">Parlons-en.</span></h2>
              <p className="text-slate-400 mb-12 max-w-md leading-relaxed">
                Notre équipe d'experts est à votre écoute pour vous conseiller sur le meilleur choix d'éclairage pour votre maison ou commerce.
              </p>
              
              <div className="space-y-10">
                <div className="flex items-center gap-6 group">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-amber-500/20 group-hover:border-amber-500/50 transition-all">
                    <MapPin className="w-7 h-7 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">Showroom Principal</h4>
                    <p className="text-slate-400">Cité El Mahrajen, Tataouine 3200</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 group">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-amber-500/20 group-hover:border-amber-500/50 transition-all">
                    <Phone className="w-7 h-7 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">Appelez-nous</h4>
                    <p className="text-slate-400">+216 54 999 872</p>
                  </div>
                </div>
              </div>
            </div>
            
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-white pt-24 pb-12 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-16 mb-20">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-amber-500 p-2 rounded-lg">
                  <Lightbulb className="text-white w-7 h-7" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold tracking-tight">House of Lighting</span>
                  <span className="text-xs text-amber-500 font-bold tracking-widest uppercase">Sud Tataouine</span>
                </div>
              </div>
              <p className="text-slate-400 max-w-sm mb-10 leading-relaxed">
                Votre référence en matériel électrique et luminaire de haute gamme en Tunisie du sud. Qualité, design et innovation.
              </p>
              <div className="flex gap-4">
                {[Facebook, Instagram, Twitter].map((Icon, i) => (
                  <Button key={i} size="icon" variant="outline" className="rounded-xl border-white/10 bg-white/5 hover:bg-amber-500 hover:text-white transition-all">
                    <Icon className="w-5 h-5" />
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-8 text-lg">Menu</h4>
              <ul className="space-y-4 text-slate-400">
                {['Accueil', 'Produits', 'À Propos', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase().replace(' ', '-')}`} className="hover:text-amber-500 transition-colors flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500/50" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-8 text-lg">Horaires Showroom</h4>
              <ul className="space-y-4 text-slate-400">
                <li className="flex justify-between border-b border-white/5 pb-2"><span>Lun - Vend:</span> <span className="text-white font-medium">07:30 - 18:00</span></li>
                <li className="flex justify-between border-b border-white/5 pb-2"><span>Samedi:</span> <span className="text-white font-medium">07:30 - 14:00</span></li>
                <li className="flex justify-between text-amber-500/70"><span>Dimanche:</span> <span className="font-bold">Fermé</span></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-500">
            <p>© 2024 House of Lighting Sud Tataouine. Design par El Kar Nabil.</p>
            <div className="flex gap-10">
              <a href="#" className="hover:text-white transition-colors">Mentions Légales</a>
              <a href="#" className="hover:text-white transition-colors">Politique Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
