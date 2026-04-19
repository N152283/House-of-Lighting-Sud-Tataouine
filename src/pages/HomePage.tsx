import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Lightbulb, MapPin, Phone, Facebook, Instagram, Twitter } from 'lucide-react';
import Navbar from '@/src/components/Navbar';
import AnnouncementBar from '@/src/components/AnnouncementBar';
import Hero from '@/src/components/Hero';
import ProductCard from '@/src/components/ProductCard';
import ContactForm from '@/src/components/ContactForm';
import BrandLogo from '@/src/components/BrandLogo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/src/lib/supabase';
import { getProductImageUrl, handleProductImageError } from '@/src/lib/productImages';
import { Product, Category } from '@/src/types';

const categoryLabels = [
  'Tous',
  'Accessoires',
  'Appliques Murales',
  'Éclairage Extérieur',
  'Éclairage LED',
  'Lustres de Luxe',
  'Matériel Électrique',
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Tous');
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

    const activeCategory = categories.find((cat) => cat.name === selectedCategory);
    if (activeCategory) {
      query = query.eq('category_id', activeCategory.id);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (!error && data) setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, categories]);

  const popularProducts = useMemo(() => {
    const featured = products.filter((product) => product.is_featured);
    return featured.length > 0 ? featured.slice(0, 8) : products.slice(0, 8);
  }, [products]);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-amber-100 selection:text-amber-900">
      <AnnouncementBar />
      <Navbar />
      <Hero />

      <section className="pt-24 pb-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="outline" className="border-amber-500 text-amber-600 mb-4 px-4 py-1 uppercase tracking-[0.22em] text-xs">
              Catégories Populaires
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Trouvez l'éclairage parfait pour chaque pièce</h2>
            <p className="text-slate-600 leading-relaxed">
              Parcourez nos collections premium de lampes, LED, lustres et accessoires électriques. Un design moderne et une ambiance chaleureuse vous attendent.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categoryLabels.map((label) => {
              const activeCategory = categories.find((cat) => cat.name === label);
              const isActive = selectedCategory === label;
              return (
                <Button
                  key={label}
                  variant={isActive ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(label)}
                  className={isActive ? 'bg-amber-500 hover:bg-amber-600 border-none text-white px-5 py-2' : 'border-slate-200 text-slate-600 px-5 py-2'}
                >
                  {label}
                </Button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Produits populaires</h3>
              <p className="text-slate-500">Un aperçu des best-sellers et des nouveautés de la boutique.</p>
            </div>
            <Link to="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600 hover:text-amber-700 transition">
              Découvrir plus
            </Link>
          </div>

          <div className="relative">
            <div className="absolute left-0 top-1/2 hidden h-px w-full bg-slate-200 md:block" />
            <div className="relative flex gap-4 overflow-x-auto pb-3 scroll-smooth snap-x snap-mandatory">
              {popularProducts.map((product) => (
                <Link
                  key={product.id}
                  to="/products"
                  className="snap-start min-w-[260px] lg:min-w-[300px] rounded-3xl border border-slate-200 bg-white shadow-sm transition-transform hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="h-60 overflow-hidden rounded-t-3xl">
                    <img
                      src={getProductImageUrl(product.image_url)}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={handleProductImageError}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-5">
                    <div className="text-xs uppercase tracking-[0.22em] text-amber-600 mb-3">{product.categories?.name || 'Éclairage'}</div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">{product.name}</h4>
                    <p className="text-sm text-slate-500 line-clamp-3 mb-4">{product.description || 'Élégance et performance pour vos espaces de vie.'}</p>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xl font-bold text-amber-600">{Number(product.price).toLocaleString()} DT</span>
                      <Badge className="bg-amber-100 text-amber-700 border-none">Top</Badge>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Badge variant="outline" className="border-amber-500 text-amber-600 mb-4 px-4 py-1 uppercase tracking-[0.22em] text-xs">
              Notre Catalogue
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Une sélection moderne pour tous vos projets</h2>
            <p className="text-slate-600">Choisissez parmi des lampes, luminaires et accessoires électriques conçus pour un intérieur contemporain.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-[420px] rounded-3xl bg-slate-200 animate-pulse" />
              ))
            ) : products.length > 0 ? (
              products.slice(0, 8).map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-slate-200 col-span-full">
                <p className="text-slate-500">Aucun produit trouvé pour le moment.</p>
              </div>
            )}
          </div>

          <div className="mt-12 text-center">
            <Link to="/products" className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-8 py-4 text-sm font-semibold text-slate-900 shadow-sm hover:border-amber-300 hover:bg-amber-50 transition">
              Découvrir plus de produits
            </Link>
          </div>
        </div>
      </section>

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

      <footer className="bg-slate-950 text-white pt-24 pb-12 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-16 mb-20">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <BrandLogo className="h-14 w-14 rounded-2xl border border-white/10 p-1" />
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
