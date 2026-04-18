import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useCart } from '@/src/contexts/CartContext';
import { supabase } from '@/src/lib/supabase';
import { 
  ShoppingBag, 
  ArrowLeft, 
  CreditCard, 
  Truck, 
  User, 
  MapPin, 
  Phone, 
  CheckCircle2,
  Lock,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [hasPreviousOrders, setHasPreviousOrders] = useState(false);

  // Discount Logic: 10% if total > 500 TND
  const discountThreshold = 500;
  const discountRate = 0.10;
  const isEligibleForDiscount = totalPrice > discountThreshold || hasPreviousOrders;
  const discountAmount = isEligibleForDiscount ? totalPrice * discountRate : 0;
  const finalPrice = totalPrice - discountAmount;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  // Check for previous orders when email changes
  const checkLoyalty = async (email: string) => {
    if (!email || !email.includes('@')) return;
    try {
      const { count, error } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('email', email);
      
      if (!error && count && count > 0) {
        setHasPreviousOrders(true);
      } else {
        setHasPreviousOrders(false);
      }
    } catch (err) {
      console.error('Loyalty check error:', err);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setFormData({ ...formData, email });
    checkLoyalty(email);
  };

  if (cart.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-12 rounded-3xl shadow-xl text-center max-w-md">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Votre panier est vide</h2>
          <p className="text-slate-500 mb-8">Ajoutez des produits de notre catalogue pour passer commande.</p>
          <Button onClick={() => navigate('/')} className="bg-amber-500 hover:bg-amber-600 text-white w-full h-12 text-blue-50">
            Retour à la boutique
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create Order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          customer_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          total_price: finalPrice,
          status: 'pending'
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Create Order Items
      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price_at_time: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      setOrderComplete(true);
      clearCart();
      toast.success('Commande passée avec succès !');
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error('Erreur lors de la commande: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(245,158,11,0.1),transparent_70%)]" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900 border border-slate-800 p-12 rounded-[40px] shadow-2xl text-center max-w-lg relative z-10"
        >
          <div className="w-24 h-24 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-amber-500/30">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-6">Merci pour votre commande !</h2>
          <p className="text-slate-400 mb-10 text-lg leading-relaxed">
            Votre demande a été enregistrée avec succès. Notre équipe vous contactera par téléphone pour confirmer la livraison.
          </p>
          <Button onClick={() => navigate('/')} size="lg" className="bg-amber-500 hover:bg-amber-600 text-white w-full font-bold h-14">
            Retour à l'accueil
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24">
      <div className="container mx-auto px-4">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-amber-600 transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Retour à la boutique
        </Link>
        
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
               <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-4">
                 <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white">
                   <User className="w-5 h-5" />
                 </div>
                 Informations de Livraison
               </h2>
               
               <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                 <div className="grid md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <Label htmlFor="name" className="text-slate-600 font-medium ml-1">Nom complet</Label>
                     <Input 
                       id="name" 
                       required 
                       value={formData.name}
                       onChange={e => setFormData({...formData, name: e.target.value})}
                       className="h-12 border-slate-200 bg-slate-50 focus:bg-white rounded-xl" 
                       placeholder="M. Foulen Ben Foulen"
                     />
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="phone" className="text-slate-600 font-medium ml-1">Téléphone</Label>
                     <Input 
                       id="phone" 
                       required 
                       value={formData.phone}
                       onChange={e => setFormData({...formData, phone: e.target.value})}
                       className="h-12 border-slate-200 bg-slate-50 focus:bg-white rounded-xl" 
                       placeholder="+216 12 345 678"
                     />
                   </div>
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="email" className="text-slate-600 font-medium ml-1">Email (Optionnel)</Label>
                   <Input 
                     id="email" 
                     type="email"
                     value={formData.email}
                     onChange={handleEmailChange}
                     className="h-12 border-slate-200 bg-slate-50 focus:bg-white rounded-xl" 
                     placeholder="votre@email.com"
                   />
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="address" className="text-slate-600 font-medium ml-1">Adresse complète</Label>
                   <Input 
                     id="address" 
                     required 
                     value={formData.address}
                     onChange={e => setFormData({...formData, address: e.target.value})}
                     className="h-12 border-slate-200 bg-slate-50 focus:bg-white rounded-xl" 
                     placeholder="Rue, Cité, Ville, Code Postal"
                   />
                 </div>

                 <div className="pt-6 border-t border-slate-100 flex items-center gap-4 text-slate-500">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <Truck className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-sm">Livraison gratuite sur Tataouine et environs.</p>
                 </div>
               </form>
            </div>

            <div className="bg-amber-50 p-6 rounded-3xl border border-amber-200 flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-amber-500/20">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-amber-900">Paiement à la livraison</h4>
                <p className="text-sm text-amber-800/80">
                  Le paiement s'effectue directement auprès du livreur en espèces lors de la réception de votre commande.
                </p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-6">
             <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
                <CardHeader className="bg-slate-900 text-white p-8">
                  <CardTitle className="text-xl flex items-center gap-3">
                    <ShoppingBag className="w-5 h-5 text-amber-500" />
                    Résumé du panier
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="max-h-[300px] overflow-y-auto pr-2 space-y-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-16 h-16 bg-slate-50 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                           <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 text-sm truncate">{item.name}</p>
                          <p className="text-slate-500 text-xs">Quantité: {item.quantity}</p>
                          <p className="text-amber-600 font-bold text-sm mt-1">{(item.price * item.quantity).toLocaleString()} TND</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="bg-slate-100" />

                  <div className="space-y-4">
                    <div className="flex justify-between text-slate-500">
                      <span>Sous-total</span>
                      <span className="font-bold text-slate-900">{totalPrice.toLocaleString()} TND</span>
                    </div>
                    {isEligibleForDiscount && (
                      <div className="flex justify-between text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100 animate-in fade-in zoom-in duration-300">
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          Remise Fidélité (10%)
                        </span>
                        <span className="font-bold">-{discountAmount.toLocaleString()} TND</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-500">
                      <span>Livraison</span>
                      <span className="font-bold text-emerald-600">GRATUIT</span>
                    </div>
                    <div className="flex justify-between items-center text-xl pt-2">
                       <span className="font-bold text-slate-900">Total</span>
                       <span className="font-bold text-amber-600">{finalPrice.toLocaleString()} TND</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-8 pt-0">
                  <Button 
                    form="checkout-form"
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white py-8 text-lg font-bold rounded-2xl shadow-xl shadow-amber-500/20"
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                      <>
                        Confirmer la commande
                        <CheckCircle2 className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </Button>
                </CardFooter>
             </Card>
             
             <div className="flex items-center justify-center gap-2 text-slate-400 text-xs uppercase tracking-widest font-bold">
               <Lock className="w-3 h-3" />
               Paiement Sécurisé
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
