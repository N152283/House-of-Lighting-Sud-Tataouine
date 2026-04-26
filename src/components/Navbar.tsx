import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/src/contexts/CartContext';
import { Badge } from '@/components/ui/badge';
import BrandLogo from '@/src/components/BrandLogo';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { totalItems, totalPrice } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Accueil', href: '/' },
    { name: 'Produits', href: '/products' },
    { name: 'À Propos', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 group">
          <BrandLogo className="h-12 w-12 rounded-xl border border-amber-100 p-1 transition-transform group-hover:scale-105" />
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">
              House of Lighting
            </span>
            <span className="text-xs font-medium text-amber-600 uppercase tracking-widest">
              Sud Tataouine
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm font-medium text-slate-600 hover:text-amber-600 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 border-l pl-8 border-slate-200">
            <Button variant="ghost" size="icon" className="text-slate-600 hover:text-amber-600">
              <Search className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-600 hover:text-amber-600"
              onClick={() => navigate('/admin')}
              title="Espace Admin"
            >
              <User className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-slate-600 hover:text-amber-600"
              onClick={() => navigate('/checkout')}
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <>
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 bg-amber-500 text-white text-[10px] border-2 border-white">
                    {totalItems}
                  </Badge>
                  <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-[8px] px-1 rounded-full font-bold">
                    {totalPrice.toFixed(0)}T
                  </span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="flex items-center gap-2 md:hidden">
          <Button variant="ghost" size="icon" className="text-slate-600 hover:text-amber-600">
            <Search className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative text-slate-600 hover:text-amber-600" onClick={() => navigate('/checkout')}>
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <>
                <Badge className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center p-0 bg-amber-500 text-white text-[8px]">
                  {totalItems}
                </Badge>
                <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-[7px] px-1 rounded-full font-bold">
                  {totalPrice.toFixed(0)}T
                </span>
              </>
            )}
          </Button>
          <Sheet>
            <SheetTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
              <Menu className="w-6 h-6" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col gap-6 mt-12">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-lg font-medium text-slate-900 hover:text-amber-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="pt-8 border-t border-slate-100 flex flex-col gap-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/admin')}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Espace Admin
                  </Button>
                  <Button
                    className="bg-amber-500 hover:bg-amber-600 text-white w-full"
                    onClick={() => navigate('/checkout')}
                  >
                    Panier ({totalItems})
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
