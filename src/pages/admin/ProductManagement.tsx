import React, { useEffect, useState } from 'react';
import { supabase } from '@/src/lib/supabase';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  MoreVertical, 
  Package, 
  Image as ImageIcon,
  Loader2,
  X
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Product, Category } from '@/src/types';

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
    is_featured: false,
    stock_quantity: '0',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [
      { data: pData, error: pError },
      { data: cData, error: cError }
    ] = await Promise.all([
      supabase.from('products').select('*, categories(*)').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name')
    ]);

    if (!pError) setProducts(pData || []);
    if (!cError) setCategories(cData || []);
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category_id: '',
      image_url: '',
      is_featured: false,
      stock_quantity: '0',
    });
    setEditingProduct(null);
    setSelectedFile(null);
    setPreviewUrl('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category_id: product.category_id,
      image_url: product.image_url || '',
      is_featured: product.is_featured,
      stock_quantity: (product.stock_quantity || 0).toString(),
    });
    setPreviewUrl(''); // Reset file preview for editing
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;
    
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      setProducts(products.filter(p => p.id !== id));
      toast.success('Produit supprimé');
    } else {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);

    try {
      let imageUrl = formData.image_url;

      // Upload new image if one was selected
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      const submissionData = {
        ...formData,
        image_url: imageUrl,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity),
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(submissionData)
          .eq('id', editingProduct.id);
        if (error) throw error;
        toast.success('Produit mis à jour');
      } else {
        const { error } = await supabase.from('products').insert([submissionData]);
        if (error) throw error;
        toast.success('Produit ajouté');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Une erreur est survenue');
    } finally {
      setModalLoading(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Gestion des Produits</h1>
          <p className="text-slate-500">Ajoutez, modifiez ou supprimez les articles de votre catalogue.</p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger className="bg-amber-500 hover:bg-amber-600 text-white gap-2 h-11 px-6 shadow-lg shadow-amber-500/20 inline-flex items-center justify-center rounded-lg font-medium transition-colors cursor-pointer">
            <Plus className="w-5 h-5" />
            Nouveau Produit
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Modifier le produit' : 'Nouveau Produit'}</DialogTitle>
              <DialogDescription>
                Remplissez les informations ci-dessous pour {editingProduct ? 'mettre à jour' : 'ajouter'} l'article.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="name">Nom du produit</Label>
                  <Input 
                    id="name" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Prix (TND)</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    step="0.1" 
                    value={formData.price} 
                    onChange={e => setFormData({...formData, price: e.target.value})} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input 
                    id="stock" 
                    type="number" 
                    value={formData.stock_quantity} 
                    onChange={e => setFormData({...formData, stock_quantity: e.target.value})} 
                    required 
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <Select 
                    value={formData.category_id} 
                    onValueChange={val => setFormData({...formData, category_id: val})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="image">Image du produit</Label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input 
                        id="image" 
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="cursor-pointer"
                      />
                    </div>
                    {previewUrl && (
                      <div className="relative w-full h-[200px] bg-slate-50 rounded-lg overflow-hidden border border-slate-200">
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    {!previewUrl && formData.image_url && (
                      <div className="relative w-full h-[200px] bg-slate-50 rounded-lg overflow-hidden border border-slate-200">
                        <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <p className="text-[12px] text-slate-500">ou collez l'URL ci-dessous:</p>
                    <Input 
                      placeholder="https://images.unsplash.com/..."
                      value={formData.image_url} 
                      onChange={e => setFormData({...formData, image_url: e.target.value})} 
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2 pt-2">
                  <input 
                    type="checkbox" 
                    id="featured" 
                    checked={formData.is_featured} 
                    onChange={e => setFormData({...formData, is_featured: e.target.checked})}
                    className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-500"
                  />
                  <Label htmlFor="featured" className="cursor-pointer">Mettre en avant (Featured)</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Annuler</Button>
                <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white" disabled={modalLoading}>
                  {modalLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingProduct ? 'Enregistrer les modifications' : 'Ajouter le produit'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter and Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100">
        <div className="p-4 border-b border-slate-50">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Rechercher un produit..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-50 border-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50 border-none">
                <TableHead className="w-[100px]">Image</TableHead>
                <TableHead>Produit</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [1,2,3].map(i => (
                  <TableRow key={i}>
                    <TableCell colSpan={7} className="text-center py-10">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-amber-500" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredProducts.length > 0 ? filteredProducts.map((product) => (
                <TableRow key={product.id} className="hover:bg-slate-50 transition-colors">
                  <TableCell>
                    <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border">
                      {product.image_url ? (
                        <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-slate-900">{product.name}</div>
                    <div className="text-xs text-slate-500 truncate max-w-[200px]">{product.description || 'Pas de description'}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal text-slate-600 border-slate-200">
                      {product.categories?.name || 'Aucune'}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-bold text-slate-900">
                    {product.price} TND
                  </TableCell>
                  <TableCell className="text-slate-600 font-medium">
                    {product.stock_quantity ?? 0}
                  </TableCell>
                  <TableCell>
                    {product.is_featured && (
                      <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none px-2 py-0">Featured</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="hover:text-amber-600" onClick={() => handleEdit(product)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="hover:text-red-600" onClick={() => handleDelete(product.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-20 text-slate-400 italic">
                    Aucun produit trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
