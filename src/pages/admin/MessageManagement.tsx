import React, { useEffect, useState } from 'react';
import { supabase } from '@/src/lib/supabase';
import { 
  Mail, 
  Trash2, 
  User, 
  Clock, 
  MessageSquare,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Message } from '@/src/types';

export default function MessageManagement() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    if (!error) setMessages(data || []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce message ?')) return;
    const { error } = await supabase.from('messages').delete().eq('id', id);
    if (!error) {
      setMessages(messages.filter(m => m.id !== id));
      toast.success('Message supprimé');
    } else {
      toast.error('Erreur');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Messages Clients</h1>
        <p className="text-slate-500">Gérez les demandes reçues via le formulaire de contact.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Expéditeur</TableHead>
              <TableHead>Sujet</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-10"><Loader2 className="w-8 h-8 animate-spin mx-auto text-amber-500" /></TableCell></TableRow>
            ) : messages.length > 0 ? messages.map((m) => (
              <TableRow key={m.id}>
                <TableCell>
                  <div className="font-bold text-slate-900">{m.name}</div>
                  <div className="text-xs text-slate-500">{m.email}</div>
                </TableCell>
                <TableCell className="font-medium">{m.subject}</TableCell>
                <TableCell className="max-w-xs">
                  <p className="text-sm text-slate-600 line-clamp-2">{m.message}</p>
                </TableCell>
                <TableCell className="text-slate-500 text-sm">
                  {new Date(m.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="hover:text-red-600" onClick={() => handleDelete(m.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow><TableCell colSpan={5} className="text-center py-20 text-slate-400 italic">Aucun message</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
