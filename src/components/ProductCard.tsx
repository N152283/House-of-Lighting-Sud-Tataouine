import React from 'react';
import { ShoppingCart, Eye, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/src/types';
import { useCart } from '@/src/contexts/CartContext';
import { getProductImageUrl, handleProductImageError } from '@/src/lib/productImages';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <Card className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={getProductImageUrl(product.image_url)}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={handleProductImageError}
          referrerPolicy="no-referrer"
        />
        {product.is_featured && (
          <Badge className="absolute top-4 left-4 bg-amber-500 text-white border-none">
            Populaire
          </Badge>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Button 
            size="icon" 
            variant="secondary" 
            className="rounded-full bg-white text-slate-900 hover:bg-amber-500 hover:text-white border-none"
            onClick={() => addToCart(product)}
          >
            <Plus className="w-5 h-5" />
          </Button>
          <Button size="icon" variant="secondary" className="rounded-full bg-white text-slate-900 hover:bg-amber-500 hover:text-white border-none">
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <CardContent className="p-5">
        <div className="text-xs font-medium text-amber-600 uppercase tracking-wider mb-1">
          {product.categories?.name || 'Éclairage'}
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1">{product.name}</h3>
        <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10">{product.description}</p>
      </CardContent>
      <CardFooter className="p-5 pt-0 flex items-center justify-between">
        <span className="text-xl font-bold text-amber-600">{Number(product.price).toLocaleString()} TND</span>
        <Button 
          variant="ghost" 
          className="text-slate-600 hover:text-amber-600 p-0 h-auto font-bold flex items-center gap-2 group/btn"
          onClick={() => addToCart(product)}
        >
          Commander
          <ShoppingCart className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
}
