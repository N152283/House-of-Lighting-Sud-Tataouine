import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Tag, 
  ShoppingCart, 
  MessageSquare, 
  LogOut,
  Lightbulb
} from 'lucide-react';
import { useAuth } from '@/src/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function AdminSidebar() {
  const { signOut } = useAuth();

  const links = [
    { name: 'Tableau de bord', href: '/admin', icon: LayoutDashboard },
    { name: 'Produits', href: '/admin/products', icon: Package },
    { name: 'Catégories', href: '/admin/categories', icon: Tag },
    { name: 'Commandes', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col border-r border-slate-800">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="bg-amber-500 p-2 rounded-lg">
          <Lightbulb className="text-white w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-tight leading-none">Administration</span>
          <span className="text-[10px] text-amber-500 uppercase font-bold tracking-widest mt-1">Sud Tataouine</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.href}
            to={link.href}
            end
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all group',
                isActive 
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              )
            }
          >
            <link.icon className="w-5 h-5" />
            <span className="font-medium">{link.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-slate-400 hover:text-red-400 hover:bg-red-400/10"
          onClick={signOut}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
}
