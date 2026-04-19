import React, { useEffect, useState } from 'react';
import { supabase } from '@/src/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Coupon } from '@/src/types';
import { Plus, Trash2, Percent, CheckCircle2 } from 'lucide-react';

function generateCouponCode(length = 8) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export default function CouponManagement() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [discount, setDiscount] = useState(10);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch coupons error:', error);
      toast.error('Impossible de charger les coupons.');
      setCoupons([]);
    } else {
      setCoupons(data || []);
    }
    setLoading(false);
  };

  const handleCreateCoupon = async () => {
    if (discount < 1 || discount > 100) {
      toast.error('Le pourcentage doit être entre 1 et 100.');
      return;
    }

    setCreating(true);

    let code = `SAVE-${generateCouponCode(6)}`;
    let tries = 0;
    let created = false;

    while (!created && tries < 5) {
      const { error } = await supabase.from('coupons').insert([
        {
          code,
          discount_percent: discount,
        },
      ]);

      if (!error) {
        created = true;
      } else if (error.code === '23505') {
        code = `SAVE-${generateCouponCode(6)}`;
        tries += 1;
      } else {
        console.error('Create coupon error:', error);
        toast.error('Impossible de créer le coupon.');
        setCreating(false);
        return;
      }
    }

    if (!created) {
      toast.error('Impossible de générer un code unique. Réessayez.');
      setCreating(false);
      return;
    }

    toast.success(`Coupon ${code} créé (${discount}% de réduction)`);
    setDiscount(10);
    await fetchCoupons();
    setCreating(false);
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm('Supprimer ce coupon ?')) return;
    const { error } = await supabase.from('coupons').delete().eq('id', id);
    if (error) {
      console.error('Delete coupon error:', error);
      toast.error('Impossible de supprimer le coupon.');
      return;
    }
    toast.success('Coupon supprimé');
    setCoupons(coupons.filter((coupon) => coupon.id !== id));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Coupons de réduction</h1>
            <p className="text-slate-500">Générez des codes promo monod-use et suivez leur utilisation.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_auto] items-end">
            <div className="grid gap-2">
              <Label htmlFor="discount" className="font-medium text-slate-600">Réduction (%)</Label>
              <Input
                id="discount"
                type="number"
                min={1}
                max={100}
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="bg-slate-50 border-slate-200"
              />
            </div>
            <Button onClick={handleCreateCoupon} disabled={creating} className="bg-amber-500 hover:bg-amber-600 text-white">
              {creating ? 'Génération...' : (
                <>
                  <Plus className="w-4 h-4 mr-2" /> Générer coupon
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Réduction</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date de création</TableHead>
              <TableHead>Utilisé le</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-slate-500">Chargement...</TableCell>
              </TableRow>
            ) : coupons.length > 0 ? (
              coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell className="font-medium text-slate-900">{coupon.code}</TableCell>
                  <TableCell>{coupon.discount_percent}%</TableCell>
                  <TableCell>
                    <Badge className={coupon.is_used ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}>
                      {coupon.is_used ? 'Utilisé' : 'Actif'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm">{new Date(coupon.created_at).toLocaleString()}</TableCell>
                  <TableCell className="text-slate-500 text-sm">
                    {coupon.used_at ? new Date(coupon.used_at).toLocaleString() : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="text-slate-500 hover:text-red-600" onClick={() => handleDeleteCoupon(coupon.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-20 text-slate-400 italic">Aucun coupon généré</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
