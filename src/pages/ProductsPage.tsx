import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ChevronDown, ShoppingBag, SlidersHorizontal } from 'lucide-react';
import Navbar from '@/src/components/Navbar';
import AnnouncementBar from '@/src/components/AnnouncementBar';
import ProductCard from '@/src/components/ProductCard';
import { supabase } from '@/src/lib/supabase';
import { Product, Category } from '@/src/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const priceOptions = [
  { label: 'Tous les prix', value: 'all' },
  { label: '0 - 150 DT', value: '0-150' },
  { label: '150 - 350 DT', value: '150-350' },
  { label: '350 - 700 DT', value: '350-700' },
  { label: '700+ DT', value: '700+' },
];

const typeOptions = ['LED', 'Luxe', 'Outdoor', 'Smart'];
const roomOptions = ['Salon', 'Chambre', 'Jardin'];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedRoom, setSelectedRoom] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [search, setSearch] = useState('');
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
    const { data, error } = await supabase.from('products').select('*, categories(*)').order('created_at', { ascending: false });
    if (!error && data) setProducts(data);
    setLoading(false);
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (selectedCategory && product.category_id !== selectedCategory) return false;
        if (search && !product.name.toLowerCase().includes(search.toLowerCase())) return false;

        if (selectedPrice !== 'all') {
          const price = Number(product.price || 0);
          if (selectedPrice === '0-150' && !(price >= 0 && price <= 150)) return false;
          if (selectedPrice === '150-350' && !(price >= 150 && price <= 350)) return false;
          if (selectedPrice === '350-700' && !(price >= 350 && price <= 700)) return false;
          if (selectedPrice === '700+' && !(price > 700)) return false;
        }

        if (selectedType !== 'all' && product.type) {
          return product.type === selectedType;
        }
        if (selectedType !== 'all' && !product.type) {
          return false;
        }

        if (selectedRoom !== 'all' && product.room) {
          return product.room === selectedRoom;
        }
        if (selectedRoom !== 'all' && !product.room) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'priceLow') return Number(a.price) - Number(b.price);
        if (sortBy === 'priceHigh') return Number(b.price) - Number(a.price);
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [products, selectedCategory, selectedPrice, selectedType, selectedRoom, sortBy, search]);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-amber-100 selection:text-amber-900">
      <AnnouncementBar />
      <Navbar />

      <main className="pt-6 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-10">
            <div>
              <Badge variant="outline" className="border-amber-500 text-amber-600 mb-4 px-4 py-1 uppercase tracking-[0.22em] text-xs">
                Collection complète
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900">Tous les produits House of Lighting</h1>
              <p className="text-slate-600 max-w-2xl mt-4">
                Explorez notre sélection de lampes, LED, lustres et accessoires électriques pour chaque pièce et style.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-start lg:justify-end">
              <Button
                variant="outline"
                className="gap-2 border-slate-200 text-slate-700 hover:border-amber-300"
              >
                <Filter className="w-4 h-4" /> Filtrer
              </Button>
              <Link to="/checkout">
                <Button className="gap-2 bg-amber-500 hover:bg-amber-600 text-white">
                  <ShoppingBag className="w-4 h-4" /> Voir le panier
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid lg:grid-cols-[280px_minmax(0,1fr)] gap-8">
            <aside className="space-y-8">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Filtres</p>
                    <h2 className="text-xl font-bold text-slate-900">Affiner</h2>
                  </div>
                  <SlidersHorizontal className="w-5 h-5 text-amber-500" />
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">Catégorie</h3>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedCategory(null)}
                        className={`rounded-full px-3 py-2 text-sm ${selectedCategory === null ? 'bg-amber-500 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}
                      >
                        Tous
                      </button>
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => setSelectedCategory(category.id)}
                          className={`rounded-full px-3 py-2 text-sm ${selectedCategory === category.id ? 'bg-amber-500 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">Prix</h3>
                    <select
                      value={selectedPrice}
                      onChange={(e) => setSelectedPrice(e.target.value)}
                      className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-amber-400 focus:outline-none"
                    >
                      {priceOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">Type</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedType('all')}
                        className={`rounded-3xl px-3 py-2 text-sm ${selectedType === 'all' ? 'bg-amber-500 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}
                      >
                        Tous
                      </button>
                      {typeOptions.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setSelectedType(type)}
                          className={`rounded-3xl px-3 py-2 text-sm ${selectedType === type ? 'bg-amber-500 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">Pièce</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedRoom('all')}
                        className={`rounded-3xl px-3 py-2 text-sm ${selectedRoom === 'all' ? 'bg-amber-500 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}
                      >
                        Toutes
                      </button>
                      {roomOptions.map((room) => (
                        <button
                          key={room}
                          type="button"
                          onClick={() => setSelectedRoom(room)}
                          className={`rounded-3xl px-3 py-2 text-sm ${selectedRoom === room ? 'bg-amber-500 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}
                        >
                          {room}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Recherche</h3>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Rechercher un produit"
                    className="w-full rounded-3xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-700 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>
            </aside>

            <section className="space-y-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{filteredProducts.length} produits disponibles</p>
                  <h2 className="text-2xl font-bold text-slate-900">Filtres intelligents & tri</h2>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-500">Trier par :</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-amber-400 focus:outline-none"
                  >
                    <option value="newest">Nouveautés</option>
                    <option value="priceLow">Prix bas → haut</option>
                    <option value="priceHigh">Prix haut → bas</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((index) => (
                    <div key={index} className="h-[360px] rounded-3xl bg-slate-200 animate-pulse" />
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-12 text-center">
                  <p className="text-slate-500">Aucun produit ne correspond aux critères sélectionnés.</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
