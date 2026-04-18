import React, { useEffect, useState } from 'react';
import { supabase } from '@/src/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Package, 
  ShoppingCart, 
  MessageSquare, 
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { Order, Product, Message } from '@/src/types';

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalMessages: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [
        { count: pCount },
        { count: oCount },
        { count: mCount },
        { count: pOCount },
        { data: rOrders }
      ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('messages').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5)
      ]);

      setStats({
        totalProducts: pCount || 0,
        totalOrders: oCount || 0,
        totalMessages: mCount || 0,
        pendingOrders: pOCount || 0,
      });
      setRecentOrders(rOrders || []);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { name: 'Lun', sales: 400 },
    { name: 'Mar', sales: 300 },
    { name: 'Mer', sales: 600 },
    { name: 'Jeu', sales: 800 },
    { name: 'Ven', sales: 500 },
    { name: 'Sam', sales: 900 },
    { name: 'Dim', sales: 700 },
  ];

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <Card className="border-none shadow-sm bg-white overflow-hidden group hover:shadow-md transition-all">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
            <h2 className="text-3xl font-bold text-slate-900">{value}</h2>
          </div>
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color} transition-transform group-hover:scale-110`}>
            <Icon className="w-7 h-7" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Tableau de bord</h1>
        <p className="text-slate-500">Aperçu global de l'activité de House of Lighting Sud.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Produits" 
          value={stats.totalProducts} 
          icon={Package} 
          color="bg-blue-50 text-blue-600" 
        />
        <StatCard 
          title="Commandes" 
          value={stats.totalOrders} 
          icon={ShoppingCart} 
          color="bg-amber-50 text-amber-600" 
        />
        <StatCard 
          title="En attente" 
          value={stats.pendingOrders} 
          icon={Clock} 
          color="bg-orange-50 text-orange-600" 
        />
        <StatCard 
          title="Messages" 
          value={stats.totalMessages} 
          icon={MessageSquare} 
          color="bg-emerald-50 text-emerald-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <Card className="lg:col-span-2 border-none shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              Activité Hebdomadaire
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="sales" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="border-none shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              Commandes Récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentOrders.length > 0 ? recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900">{order.customer_name}</p>
                    <p className="text-xs text-slate-500">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-amber-600">{order.total_price} TND</p>
                    <div className="flex items-center gap-1 justify-end">
                       {order.status === 'pending' ? (
                         <span className="w-2 h-2 rounded-full bg-orange-500" />
                       ) : (
                         <span className="w-2 h-2 rounded-full bg-emerald-500" />
                       )}
                       <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                         {order.status}
                       </span>
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-slate-500 italic text-center py-8">Aucune commande récente</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
