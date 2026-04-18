import React, { useState, useEffect } from 'react';
import { Menu, X, Lightbulb, Phone, MapPin, ShoppingBag, ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/src/contexts/CartContext';
import { Badge } from '@/components/ui/badge';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Accueil', href: '/' },
    { name: 'Produits', href: '#products' },
    { name: 'À Propos', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 group">
          <div className="bg-amber-500 p-2 rounded-lg group-hover:rotate-12 transition-transform">
            <Lightbulb className="text-white w-6 h-6" />
          </div>
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
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-600 hover:text-amber-600 transition-colors"
            >
              {link.name}
            </a>
          ))}
          
          <div className="flex items-center gap-4 border-l pl-8 border-slate-200">
            <Button variant="ghost" size="icon" className="relative text-slate-600 hover:text-amber-600">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 bg-amber-500 text-white text-[10px] border-2 border-white">
                  {totalItems}
                </Badge>
              )}
            </Button>
            <a href="/admin">
              <Button variant="outline" size="icon" className="text-slate-600 hover:text-amber-600">
                <User className="w-5 h-5" />
              </Button>
            </a>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="flex items-center gap-2 md:hidden">
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <Badge className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center p-0 bg-amber-500 text-white text-[8px]">
                {totalItems}
              </Badge>
            )}
          </Button>
          <Sheet>
            <SheetTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
              <Menu className="w-6 h-6" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col gap-8 mt-12">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-lg font-medium text-slate-900 hover:text-amber-600 transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
                <div className="pt-8 border-t border-slate-100 flex flex-col gap-4">
                  <Button className="bg-amber-500 hover:bg-amber-600 text-white w-full">
                    Panier ({totalItems})
                  </Button>
                  <a href="/admin" className="w-full inline-block">
                    <span className="inline-flex items-center justify-center w-full px-2.5 py-2 text-sm font-medium border border-border bg-background hover:bg-muted rounded-lg">
                      Espace Admin
                    </span>
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
