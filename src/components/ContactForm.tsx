import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/src/lib/supabase';
import { toast } from 'sonner';

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    };

    try {
      const { error } = await supabase.from('messages').insert([data]);
      if (error) throw error;
      
      setSubmitted(true);
      toast.success('Message envoyé avec succès !');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Une erreur est survenue lors de l\'envoi du message.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white p-12 rounded-2xl shadow-xl text-center flex flex-col items-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mb-6" />
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Merci pour votre message !</h3>
        <p className="text-slate-600 mb-8">Nous vous répondrons dans les plus brefs délais.</p>
        <Button onClick={() => setSubmitted(false)} variant="outline">
          Envoyer un autre message
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl">
      <h3 className="text-2xl font-bold text-slate-900 mb-6">Envoyez-nous un message</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Nom Complet</label>
            <Input name="name" placeholder="Votre nom" required className="bg-slate-50 border-slate-100" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Email</label>
            <Input name="email" type="email" placeholder="votre@email.com" required className="bg-slate-50 border-slate-100" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Sujet</label>
          <Input name="subject" placeholder="Comment pouvons-nous vous aider ?" required className="bg-slate-50 border-slate-100" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Message</label>
          <Textarea name="message" placeholder="Votre message ici..." required className="min-h-[150px] bg-slate-50 border-slate-100" />
        </div>
        <Button type="submit" disabled={loading} className="w-full bg-amber-500 hover:bg-amber-600 text-white py-6 text-lg">
          {loading ? 'Envoi en cours...' : (
            <>
              Envoyer le Message
              <Send className="ml-2 w-4 h-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
