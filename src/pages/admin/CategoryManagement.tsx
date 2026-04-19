import React, { useEffect, useState } from 'react';
import { supabase } from '@/src/lib/supabase';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Tag,
  Loader2
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Category } from '@/src/types';

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('categories').select('*').order('name');
    if (!error) setCategories(data || []);
    setLoading(false);
  };

  const handleEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr ? Les produits liés pourraient être affectés.')) return;
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (!error) {
      setCategories(categories.filter(c => c.id !== id));
      toast.success('Catégorie supprimée');
    } else {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);

    try {
      if (editingCategory) {
        const { error } = await supabase.from('categories').update({ name }).eq('id', editingCategory.id);
        if (error) throw error;
        toast.success('Mis à jour');
      } else {
        const { error } = await supabase.from('categories').insert([{ name }]);
        if (error) throw error;
        toast.success('Ajouté');
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Catégories</h1>
          <p className="text-slate-500">Gérez les catégories de produits de votre boutique.</p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) {
            setEditingCategory(null);
            setName('');
          }
        }}>
          <DialogTrigger>
            <Button className="bg-amber-500 hover:bg-amber-600 text-white gap-2">
              <Plus className="w-5 h-5" />
              Nouvelle Catégorie
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'Modifier' : 'Nouveau'}</DialogTitle>
              <DialogDescription>Entrez le nom de la catégorie.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white" disabled={modalLoading}>
                  {modalLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Sauvegarder
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom de la catégorie</TableHead>
              <TableHead>Date de création</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={3} className="text-center py-10"><Loader2 className="w-8 h-8 animate-spin mx-auto text-amber-500" /></TableCell></TableRow>
            ) : categories.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell className="font-bold">{cat.name}</TableCell>
                <TableCell>{new Date(cat.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(cat)}><Edit2 className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="hover:text-red-600" onClick={() => handleDelete(cat.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
