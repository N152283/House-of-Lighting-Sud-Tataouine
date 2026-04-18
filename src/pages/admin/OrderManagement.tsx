import React, { useEffect, useState } from 'react';
import { supabase } from '@/src/lib/supabase';
import jsPDF from 'jspdf';
import { 
  Search, 
  ShoppingCart, 
  User, 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Truck,
  Eye,
  MoreVertical,
  Loader2,
  FileText,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Order, OrderStatus } from '@/src/types';

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(*))')
      .order('created_at', { ascending: false });

    if (!error) setOrders(data || []);
    setLoading(false);
  };

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (!error) {
      toast.success(`Statut mis à jour: ${status}`);
      fetchOrders();
    } else {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const exportOrderToPDF = (order: Order) => {
    const pdf = new jsPDF();
    
    pdf.setFontSize(20);
    pdf.text('BON DE COMMANDE', 20, 20);
    
    pdf.setFontSize(10);
    pdf.text(`Numéro: #${order.id.slice(0, 8)}`, 20, 35);
    pdf.text(`Date: ${new Date(order.created_at).toLocaleDateString('fr-FR')}`, 20, 42);
    
    pdf.setFontSize(12);
    pdf.text('Informations Client', 20, 55);
    pdf.setFontSize(10);
    pdf.text(`Nom: ${order.customer_name}`, 20, 62);
    pdf.text(`Téléphone: ${order.phone}`, 20, 69);
    pdf.text(`Adresse: ${order.address}`, 20, 76);
    if (order.email) pdf.text(`Email: ${order.email}`, 20, 83);
    
    pdf.setFontSize(12);
    pdf.text('Articles Commandés', 20, 95);
    let yPosition = 105;
    
    if (order.order_items && Array.isArray(order.order_items)) {
      order.order_items.forEach((item: any) => {
        const productName = item.products?.name || 'Produit';
        const quantity = item.quantity || 1;
        const price = item.price_at_time || 0;
        pdf.setFontSize(10);
        pdf.text(`- ${productName}`, 25, yPosition);
        pdf.text(`Quantité: ${quantity} | Prix: ${price} TND`, 25, yPosition + 5);
        yPosition += 12;
      });
    }
    
    pdf.setFontSize(12);
    pdf.text(`Total: ${Number(order.total_price).toLocaleString()} TND`, 20, yPosition + 10);
    
    pdf.setFontSize(10);
    pdf.text(`Statut: ${statusMap[order.status].label}`, 20, yPosition + 20);
    
    pdf.setFontSize(8);
    pdf.text('House of Lighting Sud Tataouine - Merci de votre confiance!', 20, yPosition + 35);
    
    pdf.save(`Commande_${order.id.slice(0, 8)}.pdf`);
    toast.success('PDF téléchargé avec succès');
  };

  const statusMap: Record<OrderStatus, { label: string, color: string, icon: any }> = {
    pending: { label: 'En attente', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: Clock },
    confirmed: { label: 'Confirmé', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle2 },
    shipped: { label: 'Expédié', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Truck },
    delivered: { label: 'Livré', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
    cancelled: { label: 'Annulé', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
  };

  const filteredOrders = orders.filter(o => 
    (o.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'all' || o.status === statusFilter)
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Gestion des Commandes</h1>
        <p className="text-slate-500">Suivez et gérez les commandes de vos clients.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100">
        <div className="p-4 border-b border-slate-50 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Rechercher par nom ou ID..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-50 border-none"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  statusFilter === 'all' 
                    ? 'bg-amber-500 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Filter className="w-4 h-4" />
                Tous
              </button>
              {Object.entries(statusMap).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setStatusFilter(key as OrderStatus)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === key 
                      ? value.color + ' border' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {value.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50 border-none">
                <TableHead>Numéro</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-amber-500" />
                  </TableCell>
                </TableRow>
              ) : filteredOrders.length > 0 ? filteredOrders.map((order) => {
                const status = statusMap[order.status];
                return (
                  <TableRow key={order.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="font-mono text-xs text-slate-500">
                      #{order.id.slice(0, 8)}
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-slate-900">{order.customer_name}</div>
                      <div className="text-xs text-slate-500">{order.phone}</div>
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-bold text-amber-600">
                      {Number(order.total_price).toLocaleString()} TND
                    </TableCell>
                    <TableCell>
                      <Badge className={`${status.color} border shadow-none px-2.5 py-0.5 gap-1.5`}>
                        <status.icon className="w-3.5 h-3.5" />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="hover:text-amber-600"
                          onClick={() => setSelectedOrder(order)}
                          title="Voir détails"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="hover:text-blue-600"
                          onClick={() => exportOrderToPDF(order)}
                          title="Télécharger PDF"
                        >
                          <FileText className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="p-2" title="Plus d'options">
                            <MoreVertical className="w-4 h-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            {Object.entries(statusMap).map(([key, value]) => (
                               <DropdownMenuItem 
                                 key={key} 
                                 onClick={() => updateStatus(order.id, key as OrderStatus)}
                                 className="flex items-center gap-2"
                               >
                                 <value.icon className="w-4 h-4" />
                                 {value.label}
                               </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              }) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-20 text-slate-400 italic">
                    Aucune commande trouvée
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Order Details Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-amber-500" />
              Détails de la commande #{selectedOrder?.id.slice(0, 8)}
            </DialogTitle>
            <DialogDescription>
              Informations complètes sur la commande et le client.
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-8 py-4">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-900 border-b pb-2">Client</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <User className="w-4 h-4 text-slate-400" />
                      {selectedOrder.customer_name}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="w-4 h-4 text-slate-400" />
                      {selectedOrder.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      {selectedOrder.address}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                   <h4 className="font-bold text-slate-900 border-b pb-2">Résumé</h4>
                   <div className="space-y-3">
                     <div className="flex justify-between text-sm">
                       <span className="text-slate-500">Statut:</span>
                       <Badge className={statusMap[selectedOrder.status].color + " border-none"}>
                         {statusMap[selectedOrder.status].label}
                       </Badge>
                     </div>
                     <div className="flex justify-between text-sm">
                       <span className="text-slate-500">Date:</span>
                       <span className="text-slate-900 font-medium">
                         {new Date(selectedOrder.created_at).toLocaleString()}
                       </span>
                     </div>
                     <div className="flex justify-between text-sm pt-2 border-t">
                       <span className="text-slate-900 font-bold">Total:</span>
                       <span className="text-amber-600 font-bold text-lg">
                         {Number(selectedOrder.total_price).toLocaleString()} TND
                       </span>
                     </div>
                   </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-slate-900 border-b pb-2">Articles</h4>
                <div className="space-y-4">
                   {selectedOrder.order_items?.map((item: any) => (
                     <div key={item.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                       <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-white rounded-lg border flex items-center justify-center overflow-hidden">
                           <img src={item.product?.image_url} alt="" className="w-full h-full object-cover" />
                         </div>
                         <div>
                           <p className="font-bold text-slate-900 text-sm">{item.product?.name}</p>
                           <p className="text-xs text-slate-500">{item.price_at_time} TND x {item.quantity}</p>
                         </div>
                       </div>
                       <div className="font-bold text-slate-900">
                         {(item.price_at_time * item.quantity).toLocaleString()} TND
                       </div>
                     </div>
                   ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
